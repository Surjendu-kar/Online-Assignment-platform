# Task: Make Exam Assignment Optional and Support Multiple Exams per Student

## Overview
Currently, teachers must select an exam when inviting students. This task makes exam selection optional and allows teachers to assign multiple exams to students (both during invitation and after).

## Solution Approach
Create a separate `student_exam_assignments` table to handle exam assignments independently from student invitations. This separates concerns and provides better flexibility.

---

## Phase 1: Database Schema Changes

### 1.1 Create New Table: `student_exam_assignments`

**Purpose:** Track which exams are assigned to which students

**SQL Schema:**
```sql
-- Create student_exam_assignments table
CREATE TABLE public.student_exam_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  student_email TEXT NOT NULL,
  student_id UUID NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  department_id UUID NULL REFERENCES departments(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT student_exam_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT unique_student_exam UNIQUE (student_email, exam_id),
  CONSTRAINT student_exam_assignments_status_check CHECK (status IN ('active', 'completed', 'revoked'))
);

-- Create indexes for better performance
CREATE INDEX idx_student_exam_assignments_email ON public.student_exam_assignments(student_email);
CREATE INDEX idx_student_exam_assignments_exam ON public.student_exam_assignments(exam_id);
CREATE INDEX idx_student_exam_assignments_student_id ON public.student_exam_assignments(student_id);
CREATE INDEX idx_student_exam_assignments_assigned_by ON public.student_exam_assignments(assigned_by);

-- Enable RLS
ALTER TABLE public.student_exam_assignments ENABLE ROW LEVEL SECURITY;
```

**RLS Policies:**
```sql
-- Teachers can view assignments they created
CREATE POLICY "Teachers can view their assignments"
ON public.student_exam_assignments
FOR SELECT USING (auth.uid() = assigned_by);

-- Teachers can create assignments
CREATE POLICY "Teachers can create assignments"
ON public.student_exam_assignments
FOR INSERT WITH CHECK (
  auth.uid() = assigned_by
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'teacher'
  )
);

-- Teachers can update their assignments
CREATE POLICY "Teachers can update their assignments"
ON public.student_exam_assignments
FOR UPDATE USING (auth.uid() = assigned_by);

-- Teachers can delete their assignments
CREATE POLICY "Teachers can delete their assignments"
ON public.student_exam_assignments
FOR DELETE USING (auth.uid() = assigned_by);

-- Students can view their own assignments
CREATE POLICY "Students can view their assignments"
ON public.student_exam_assignments
FOR SELECT USING (
  auth.uid() = student_id
  OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = student_exam_assignments.student_email
  )
);

-- Admins can view all assignments
CREATE POLICY "Admins can view all assignments"
ON public.student_exam_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Service role can access all
CREATE POLICY "Service role can access assignments"
ON public.student_exam_assignments
FOR ALL USING (auth.role() = 'service_role'::text);
```

### 1.2 Modify `student_invitations` Table

**Make `exam_id` optional:**
```sql
-- The exam_id field is already nullable in the schema, so no change needed
-- But we should consider adding a note that it's deprecated in favor of student_exam_assignments

-- Optional: Add a comment to the column
COMMENT ON COLUMN public.student_invitations.exam_id IS 'Deprecated: Use student_exam_assignments table instead';
```

### 1.3 Update Trigger for `updated_at`

```sql
-- Add trigger for student_exam_assignments
CREATE TRIGGER update_student_exam_assignments_updated_at
BEFORE UPDATE ON public.student_exam_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Phase 2: API Endpoint Changes

### 2.1 Modify `POST /api/students` Endpoint

**File:** `app/api/students/route.ts`

**Changes:**
- Make `examId` optional in request body
- Accept `examIds` as an array of exam IDs
- Create student invitation record (without exam_id)
- If `examIds` is provided and not empty, create records in `student_exam_assignments` table
- Return success with created invitation and assignments

**Request Body Schema:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  expirationDate: string;
  examIds?: string[]; // Optional array of exam IDs
}
```

### 2.2 Modify `GET /api/students` Endpoint

**File:** `app/api/students/route.ts`

**Changes:**
- Join with `student_exam_assignments` table to get assigned exams
- Return invitations with their assigned exams as an array
- Handle filtering by institution and department (already implemented)

**Response Schema:**
```typescript
{
  id: string;
  student_email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  expires_at: string;
  teacher_id: string;
  department_id: string;
  departments: { id, name, code };
  teacher: { email };
  assigned_exams: [
    {
      id: string;
      exam_id: string;
      exam_title: string;
      assigned_at: string;
      status: string;
    }
  ];
}
```

### 2.3 Modify `PUT /api/students` Endpoint

**File:** `app/api/students/route.ts`

**Changes:**
- Update student invitation basic info (name, department, expiration)
- Do NOT update exam assignments here (handled separately)

### 2.4 Create New `POST /api/students/assign-exam` Endpoint

**File:** `app/api/students/assign-exam/route.ts` (NEW FILE)

**Purpose:** Assign one or more exams to an existing student

**Request Body:**
```typescript
{
  studentEmail: string;
  examIds: string[]; // Array of exam IDs to assign
  departmentId: string;
}
```

**Logic:**
- Validate teacher is authenticated
- Validate exams exist and belong to teacher's department
- Check if assignments already exist (handle duplicates gracefully)
- Create new records in `student_exam_assignments`
- Return success with created assignments

### 2.5 Create New `DELETE /api/students/unassign-exam` Endpoint

**File:** `app/api/students/unassign-exam/route.ts` (NEW FILE)

**Purpose:** Remove exam assignment from a student

**Request Body:**
```typescript
{
  assignmentIds: string[]; // Array of assignment IDs to remove
}
```

**Logic:**
- Validate teacher is authenticated
- Validate teacher owns these assignments
- Delete records from `student_exam_assignments` or update status to 'revoked'
- Return success

---

## Phase 3: Frontend Component Changes

### 3.1 Update `AddStudentDialog` Component

**File:** `components/AddStudentDialog.tsx`

**Changes:**
1. Change exam selection from single `<Select>` to multiple checkboxes
2. Add "Select Exams (Optional)" section with checkbox list
3. Allow submitting with no exams selected
4. Update form validation to make exam selection optional
5. Pass `examIds: string[]` to the API instead of single `examId`

**UI Mockup:**
```
┌─────────────────────────────────────┐
│ First Name: [________]              │
│ Last Name:  [________]              │
│ Email:      [________]              │
│ Department: [Dropdown ▼]           │
│ Expiration: [Date Picker]          │
│                                     │
│ Assign Exams (Optional)             │
│ ┌─────────────────────────────┐   │
│ │ ☐ Midterm Exam 2024         │   │
│ │ ☐ Final Exam 2024           │   │
│ │ ☐ Quiz 1 - Data Structures  │   │
│ └─────────────────────────────┘   │
│                                     │
│ [Cancel]  [Send Invitation]         │
└─────────────────────────────────────┘
```

### 3.2 Update `ViewStudentDialog` Component

**File:** `components/ViewStudentDialog.tsx`

**Changes:**
1. Add "Assigned Exams" section showing list of assigned exams
2. Add "Assign Exam" button in the dialog
3. Create a sub-dialog/modal for assigning new exams
4. Show exam assignment history with dates
5. Add "Unassign" button for each exam (optional)

**UI Mockup:**
```
┌──────────────────────────────────────┐
│ Student Details                       │
│                                      │
│ Name: John Doe                       │
│ Email: john@example.com              │
│ Status: Active                       │
│ Department: Computer Science         │
│                                      │
│ Assigned Exams:                      │
│ ┌────────────────────────────────┐ │
│ │ • Midterm Exam 2024            │ │
│ │   Assigned: Jan 15, 2024       │ │
│ │                                │ │
│ │ • Final Exam 2024              │ │
│ │   Assigned: Jan 20, 2024       │ │
│ └────────────────────────────────┘ │
│                                      │
│ [Assign Exam] [Edit] [Send Email]   │
│ [Delete]                             │
└──────────────────────────────────────┘
```

### 3.3 Create `AssignExamDialog` Component

**File:** `components/AssignExamDialog.tsx` (NEW FILE)

**Purpose:** Dialog for assigning exams to an existing student

**Props:**
```typescript
interface AssignExamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  studentEmail: string;
  studentName: string;
  departmentId: string;
  currentExamIds: string[]; // Already assigned exams
  availableExams: Exam[];
  onAssign: (examIds: string[]) => Promise<void>;
}
```

**UI:**
- Show list of available exams (filtered by department)
- Exclude already assigned exams from the list
- Multiple checkbox selection
- Submit button to assign selected exams

### 3.4 Update `TeacherStudentsPage`

**File:** `app/teacher/management/students/page.tsx`

**Changes:**

1. **Update Student Interface:**
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "suspended";
  assignedExams: number; // Count of assigned exams
  completedExams: number;
  averageScore: number;
  dateJoined: Date;
  invitedBy?: string;
  profileImage?: string;
  studentId?: string;
  department?: string;
  assignedExamsList?: Array<{  // NEW: Array of assigned exams
    id: string;
    examId: string;
    examTitle: string;
    assignedAt: string;
  }>;
  departmentId?: string;
}
```

2. **Update `processedStudents` mapping:**
   - Map `assigned_exams` array from API response
   - Calculate `assignedExams` count from array length
   - Handle case where `assigned_exams` is empty

3. **Update table display:**
   - In "Assigned Exam" column, show:
     - "Not yet assigned" if no exams
     - "1 exam" if one exam
     - "X exams" if multiple exams
     - On hover, show tooltip with exam names

4. **Add handlers:**
```typescript
const handleAssignExam = async (studentEmail: string, examIds: string[]) => {
  // Call /api/students/assign-exam
  // Refresh student list
};

const handleUnassignExam = async (assignmentId: string) => {
  // Call /api/students/unassign-exam
  // Refresh student list
};
```

5. **Update API calls:**
   - Modify `handleSendStudentInvitation` to send `examIds` array
   - Add fetch calls for assign/unassign exam endpoints

### 3.5 Update Type Definitions

**File:** `types/student.ts` or inline in component

**Add:**
```typescript
export interface ExamAssignment {
  id: string;
  examId: string;
  examTitle: string;
  assignedAt: string;
  status: 'active' | 'completed' | 'revoked';
}

export interface StudentInvitationWithExams {
  id: string;
  student_email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  expires_at: string;
  teacher_id: string;
  department_id: string;
  departments: { id: string; name: string; code: string };
  teacher?: { email: string };
  assigned_exams: ExamAssignment[];
}
```

---

## Phase 4: Data Migration (If Needed)

### 4.1 Migrate Existing Data

**Purpose:** Move existing exam assignments from `student_invitations.exam_id` to `student_exam_assignments` table

**SQL Migration Script:**
```sql
-- Insert existing exam assignments into new table
INSERT INTO public.student_exam_assignments (
  student_email,
  student_id,
  exam_id,
  assigned_by,
  department_id,
  assigned_at,
  status
)
SELECT
  si.student_email,
  si.student_id,
  si.exam_id,
  si.teacher_id,
  si.department_id,
  si.created_at,
  CASE
    WHEN si.status = 'accepted' THEN 'active'
    ELSE 'active'
  END as status
FROM public.student_invitations si
WHERE si.exam_id IS NOT NULL
ON CONFLICT (student_email, exam_id) DO NOTHING;

-- Verify migration
SELECT COUNT(*) FROM public.student_exam_assignments;
```

**Note:** Do NOT delete `exam_id` from `student_invitations` immediately. Keep it for backward compatibility during transition period.

---

## Phase 5: Update Student Exam Access Logic

### 5.1 Modify Student Exam Listing API

**File:** `app/api/student/exams/route.ts`

**Changes:**
- Instead of checking `student_invitations.exam_id`, query `student_exam_assignments` table
- Filter exams where `student_email` or `student_id` matches and `status = 'active'`

### 5.2 Modify Exam Start API

**File:** `app/api/student/exam/[id]/start/route.ts`

**Changes:**
- Verify student has access by checking `student_exam_assignments` table
- Ensure exam assignment exists and is active before allowing exam start

---

## Phase 6: Update Documentation

### 6.1 Update `db-schema-setup-config.md`

**Add:**
- New `student_exam_assignments` table schema
- RLS policies for the new table
- Migration instructions
- Update student_invitations section to note `exam_id` is deprecated

### 6.2 Update `CLAUDE.md`

**Add:**
- Note about new exam assignment architecture
- Explain separation between invitation and exam assignment
- Update API endpoint documentation

---

## Testing Checklist

### Database Tests
- [ ] Create `student_exam_assignments` table successfully
- [ ] RLS policies work correctly for teachers, students, and admins
- [ ] Unique constraint prevents duplicate assignments
- [ ] Foreign key constraints work (cascading deletes)
- [ ] Indexes improve query performance

### API Tests
- [ ] POST /api/students without examIds creates invitation only
- [ ] POST /api/students with examIds creates invitation + assignments
- [ ] GET /api/students returns invitations with assigned_exams array
- [ ] POST /api/students/assign-exam assigns exams to existing student
- [ ] POST /api/students/assign-exam prevents duplicate assignments
- [ ] DELETE /api/students/unassign-exam removes assignments
- [ ] Student can only see their own assigned exams

### Frontend Tests
- [ ] AddStudentDialog shows multiple exam checkboxes
- [ ] Can submit invitation without selecting any exams
- [ ] Can submit invitation with multiple exams selected
- [ ] ViewStudentDialog shows all assigned exams
- [ ] "Assign Exam" button opens AssignExamDialog
- [ ] AssignExamDialog excludes already assigned exams
- [ ] Can assign multiple exams from ViewStudentDialog
- [ ] Table shows "Not yet assigned" when no exams
- [ ] Table shows "X exams" when multiple exams assigned
- [ ] Tooltip shows exam names on hover

### Integration Tests
- [ ] Invite student without exam → appears in list with "Not yet assigned"
- [ ] Assign exam to student → exam appears in their assigned list
- [ ] Student can see newly assigned exam in their exam list
- [ ] Student can start exam after it's assigned
- [ ] Unassign exam → student loses access
- [ ] Delete student invitation → all exam assignments are deleted (cascade)
- [ ] Delete exam → all assignments for that exam are deleted (cascade)

---

## Rollback Plan

If issues occur, rollback steps:

1. **Database:**
   ```sql
   DROP TABLE IF EXISTS public.student_exam_assignments CASCADE;
   ```

2. **API:** Revert changes to `/api/students` endpoints

3. **Frontend:** Revert component changes

4. **Restore from git:**
   ```bash
   git checkout HEAD -- app/api/students/
   git checkout HEAD -- components/AddStudentDialog.tsx
   git checkout HEAD -- components/ViewStudentDialog.tsx
   git checkout HEAD -- app/teacher/management/students/page.tsx
   ```

---

## Implementation Order

1. ✅ Review and approve this task plan
2. Create database table and RLS policies
3. Create new API endpoints (assign-exam, unassign-exam)
4. Modify existing API endpoints (POST, GET /api/students)
5. Create AssignExamDialog component
6. Update AddStudentDialog component
7. Update ViewStudentDialog component
8. Update TeacherStudentsPage component
9. Test all functionality
10. Migrate existing data (if applicable)
11. Update documentation
12. Deploy to production

---

## Estimated Impact

**Files to Create:**
- `app/api/students/assign-exam/route.ts`
- `app/api/students/unassign-exam/route.ts`
- `components/AssignExamDialog.tsx`

**Files to Modify:**
- `app/api/students/route.ts`
- `components/AddStudentDialog.tsx`
- `components/ViewStudentDialog.tsx`
- `app/teacher/management/students/page.tsx`
- `db-schema-setup-config.md`
- `CLAUDE.md`

**Database Changes:**
- New table: `student_exam_assignments`
- 8 new RLS policies
- 4 new indexes
- 1 new trigger

---

## Notes

- The `exam_id` field in `student_invitations` is kept for backward compatibility but should be considered deprecated
- **IMPORTANT:** The `exam_id` field in `exam_sessions` table is **NOT** deprecated and must remain - it tracks which exam the student is currently taking/has taken
- Future enhancement: Add bulk assign/unassign operations
- Future enhancement: Add exam assignment history/audit log
- Future enhancement: Allow students to see assignment notifications

---

## Table Relationships Summary

Understanding the relationship between the three key tables:

| Table                      | Rows per Student                           | Purpose                                    |
|----------------------------|--------------------------------------------|--------------------------------------------|
| `student_invitations`      | 1 row (the invitation itself)              | Invite student to create account           |
| `student_exam_assignments` | N rows (one per assigned exam)             | Track which exams student CAN take         |
| `exam_sessions`            | N rows (one per exam started/completed)    | Track which exams student IS/HAS taking    |

**Data Flow:**
1. Teacher invites student → creates 1 row in `student_invitations`
2. Teacher assigns exams → creates N rows in `student_exam_assignments` (permission list)
3. Student accepts invitation → creates user account
4. Student starts exam → creates 1 row in `exam_sessions` per exam attempt
5. System loads questions → uses `exam_id` from `exam_sessions` to fetch correct questions
6. Student submits → updates `exam_sessions` with score and marks as completed

**Key Points:**
- `student_exam_assignments.exam_id` = "You are ALLOWED to take this exam"
- `exam_sessions.exam_id` = "You are CURRENTLY TAKING (or HAVE TAKEN) this exam"
- Both tables need `exam_id`, but for different purposes
- `exam_sessions` uses `exam_id` to know which questions to load, which exam settings to apply, and which exam to calculate scores for
