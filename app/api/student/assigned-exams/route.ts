import { createRouteClient } from "@/lib/supabaseRouteClient";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface Exam {
  id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  unique_code: string;
  created_by: string;
  max_attempts: number;
  shuffle_questions: boolean;
  show_results_immediately: boolean;
}

interface Department {
  id: string;
  name: string;
}

interface StudentExamAssignment {
  id: string;
  exam_id: string;
  status: string;
  assigned_at: string;
  department_id: string;
  exams: Exam;
  departments: Department;
}

export async function GET() {
  try {
    const supabase = await createRouteClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to verify student role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== "student") {
      return NextResponse.json(
        { error: "Access denied. Students only." },
        { status: 403 }
      );
    }

    // Fetch exam assignments from the new student_exam_assignments table
    // Use service role to bypass RLS after authentication (similar to /api/students pattern)
    // Query by student_id (if populated) OR by student_email (for backward compatibility)

    const { data, error: assignmentsError } = await supabaseServer
      .from("student_exam_assignments")
      .select(
        `
        id,
        exam_id,
        status,
        assigned_at,
        department_id,
        exams (
          id,
          title,
          description,
          start_time,
          end_time,
          duration,
          unique_code,
          created_by,
          max_attempts,
          shuffle_questions,
          show_results_immediately
        ),
        departments (
          id,
          name
        )
      `
      )
      .or(`student_id.eq.${user.id},student_email.eq.${profile.email}`)
      .eq("status", "active") // Only show active assignments
      .order("assigned_at", { ascending: false });

    const assignments = data as unknown as StudentExamAssignment[];

    if (assignmentsError) {
      console.error("Error fetching assignments:", assignmentsError);
      return NextResponse.json(
        { error: "Failed to fetch assigned exams" },
        { status: 500 }
      );
    }

    // For each exam, get session status and question counts
    const examsWithDetails = await Promise.all(
      (assignments || []).map(async (assignment: StudentExamAssignment) => {
        const exam = assignment.exams;
        const department = assignment.departments;

        if (!exam) return null;

        // Get exam session if exists (use service role to bypass RLS)
        const { data: session } = await supabaseServer
          .from("exam_sessions")
          .select(
            "id, status, start_time, end_time, total_score, violations_count"
          )
          .eq("exam_id", exam.id)
          .eq("user_id", user.id)
          .single();

        // Get question counts (template questions only, use service role)
        const [mcqCount, saqCount, codingCount] = await Promise.all([
          supabaseServer
            .from("mcq")
            .select("id", { count: "exact", head: true })
            .eq("exam_id", exam.id),
          supabaseServer
            .from("saq")
            .select("id", { count: "exact", head: true })
            .eq("exam_id", exam.id),
          supabaseServer
            .from("coding")
            .select("id", { count: "exact", head: true })
            .eq("exam_id", exam.id),
        ]);

        const totalQuestions =
          (mcqCount.count || 0) +
          (saqCount.count || 0) +
          (codingCount.count || 0);

        // Determine exam status
        const now = new Date();
        const startTime = exam.start_time ? new Date(exam.start_time) : null;
        const endTime = exam.end_time ? new Date(exam.end_time) : null;

        let examStatus = "pending";

        if (session?.status === "completed") {
          examStatus = "completed";
        } else if (session?.status === "in_progress") {
          examStatus = "in-progress";
        } else if (endTime && now > endTime) {
          examStatus = "expired";
        } else if (
          startTime &&
          now >= startTime &&
          (!endTime || now <= endTime)
        ) {
          examStatus = "pending";
        } else if (startTime && now < startTime) {
          examStatus = "upcoming";
        }

        return {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          department: department?.name || "No Department",
          startTime: exam.start_time,
          endTime: exam.end_time,
          duration: exam.duration,
          uniqueCode: exam.unique_code,
          totalQuestions,
          status: examStatus,
          sessionId: session?.id || null,
          sessionStatus: session?.status || null,
          sessionStartTime: session?.start_time || null,
          score: session?.total_score || null,
          assignmentId: assignment.id,
          assignmentStatus: assignment.status,
        };
      })
    );

    const validExams = examsWithDetails.filter(
      (exam): exam is NonNullable<typeof exam> => exam !== null
    );

    return NextResponse.json(validExams);
  } catch (error) {
    console.error("Error in GET /api/student/assigned-exams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
