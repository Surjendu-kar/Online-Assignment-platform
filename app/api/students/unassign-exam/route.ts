import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabaseRouteClient";
import { supabaseServer as supabase } from "@/lib/supabase/server";

/**
 * DELETE /api/students/unassign-exam
 *
 * Remove exam assignments from students
 *
 * Request Body:
 * {
 *   assignmentIds: string[]; // Array of assignment IDs to remove
 * }
 */
export async function DELETE(request: NextRequest) {
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
    const { assignmentIds } = body;

    // Validate required fields
    if (!assignmentIds || !Array.isArray(assignmentIds) || assignmentIds.length === 0) {
      return NextResponse.json({
        error: 'Missing required field: assignmentIds (array with at least one ID)'
      }, { status: 400 });
    }

    // Verify that teacher owns these assignments (unless admin)
    if (profile.role === 'teacher') {
      const { data: assignments } = await supabase
        .from('student_exam_assignments')
        .select('id, assigned_by')
        .in('id', assignmentIds);

      if (!assignments) {
        return NextResponse.json({ error: 'Assignments not found' }, { status: 404 });
      }

      const unauthorizedAssignments = assignments.filter(a => a.assigned_by !== user.id);
      if (unauthorizedAssignments.length > 0) {
        return NextResponse.json({
          error: 'You can only unassign exams that you assigned'
        }, { status: 403 });
      }
    }

    // Option 1: Soft delete - Update status to 'revoked'
    // This preserves the history
    const { data: updatedAssignments, error: updateError } = await supabase
      .from('student_exam_assignments')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .in('id', assignmentIds)
      .select('id, student_email, exam_id');

    if (updateError) {
      console.error('Error revoking assignments:', updateError);
      return NextResponse.json({ error: 'Failed to unassign exams' }, { status: 500 });
    }

    // Option 2: Hard delete - Permanently remove records
    // Uncomment this if you prefer hard deletes instead of soft deletes
    /*
    const { error: deleteError } = await supabase
      .from('student_exam_assignments')
      .delete()
      .in('id', assignmentIds);

    if (deleteError) {
      console.error('Error deleting assignments:', deleteError);
      return NextResponse.json({ error: 'Failed to unassign exams' }, { status: 500 });
    }
    */

    return NextResponse.json({
      success: true,
      message: `Successfully unassigned ${assignmentIds.length} exam(s)`,
      revoked: updatedAssignments
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in unassign-exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/students/unassign-exam
 *
 * Alternative endpoint using POST instead of DELETE (for better client compatibility)
 */
export async function POST(request: NextRequest) {
  return DELETE(request);
}
