import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabaseRouteClient";
import { supabaseServer as supabase } from "@/lib/supabase/server";

/**
 * POST /api/students/assign-exam
 *
 * Assign one or more exams to an existing student
 *
 * Request Body:
 * {
 *   studentEmail: string;
 *   examIds: string[];
 *   departmentId: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const routeClient = await createRouteClient();

    // Authenticate user
    const { data: { user }, error: authError } = await routeClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is teacher or admin
    const { data: profile } = await routeClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { studentEmail, examIds, departmentId } = body;

    // Validate required fields
    if (!studentEmail || !examIds || !Array.isArray(examIds) || examIds.length === 0) {
      return NextResponse.json({
        error: 'Missing required fields: studentEmail, examIds (array with at least one exam)'
      }, { status: 400 });
    }

    if (!departmentId) {
      return NextResponse.json({
        error: 'Missing required field: departmentId'
      }, { status: 400 });
    }

    // Verify that all exams exist and belong to the teacher's department
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('id, title, department_id')
      .in('id', examIds);

    if (examsError) {
      console.error('Error fetching exams:', examsError);
      return NextResponse.json({ error: 'Failed to verify exams' }, { status: 500 });
    }

    if (!exams || exams.length !== examIds.length) {
      return NextResponse.json({
        error: 'One or more exam IDs are invalid'
      }, { status: 400 });
    }

    // Verify exams belong to the correct department
    const invalidExams = exams.filter(exam => exam.department_id !== departmentId);
    if (invalidExams.length > 0) {
      return NextResponse.json({
        error: `Exams must belong to the selected department`,
        invalidExams: invalidExams.map(e => e.title)
      }, { status: 400 });
    }

    // Check if student exists (get student_id if they've accepted invitation)
    const { data: studentInvitation } = await supabase
      .from('student_invitations')
      .select('student_id, student_email')
      .eq('student_email', studentEmail)
      .single();

    const studentId = studentInvitation?.student_id || null;

    // Check for existing assignments to avoid duplicates
    const { data: existingAssignments } = await supabase
      .from('student_exam_assignments')
      .select('exam_id')
      .eq('student_email', studentEmail)
      .in('exam_id', examIds);

    const existingExamIds = existingAssignments?.map(a => a.exam_id) || [];
    const newExamIds = examIds.filter(id => !existingExamIds.includes(id));

    if (newExamIds.length === 0) {
      return NextResponse.json({
        message: 'All selected exams are already assigned to this student',
        skipped: existingExamIds.length
      }, { status: 200 });
    }

    // Create assignment records for new exams
    const assignmentsToCreate = newExamIds.map(examId => ({
      student_email: studentEmail,
      student_id: studentId,
      exam_id: examId,
      assigned_by: user.id,
      department_id: departmentId,
      status: 'active'
    }));

    const { data: createdAssignments, error: insertError } = await supabase
      .from('student_exam_assignments')
      .insert(assignmentsToCreate)
      .select(`
        id,
        exam_id,
        assigned_at,
        exams (
          id,
          title
        )
      `);

    if (insertError) {
      console.error('Error creating assignments:', insertError);
      return NextResponse.json({ error: 'Failed to assign exams' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${newExamIds.length} exam(s)`,
      assigned: createdAssignments,
      skipped: existingExamIds.length
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in assign-exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
