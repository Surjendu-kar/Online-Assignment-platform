import { createRouteClient } from '@/lib/supabaseRouteClient';
import { supabaseServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Save answers during exam (for resume functionality)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createRouteClient();
    const { id: examId } = await params;
    const body = await req.json();
    const { answers, sessionId } = body;

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, first_name, last_name, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if student has access to this exam via student_exam_assignments table
    // This supports the new multi-exam assignment system
    const { data: assignment, error: assignmentError } = await supabaseServer
      .from('student_exam_assignments')
      .select('id, status, exam_id')
      .eq('exam_id', examId)
      .or(`student_id.eq.${user.id},student_email.eq.${profile.email}`)
      .eq('status', 'active')
      .maybeSingle();

    if (assignmentError) {
      return NextResponse.json({ error: 'Failed to verify exam access' }, { status: 500 });
    }

    if (!assignment) {
      return NextResponse.json({ error: 'You are not assigned to this exam' }, { status: 403 });
    }

    // Verify session belongs to user (use service role after authentication)
    const { data: session, error: sessionError } = await supabaseServer
      .from('exam_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .eq('exam_id', examId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.status !== 'in_progress') {
      return NextResponse.json({ error: 'Cannot save answers for completed exam' }, { status: 400 });
    }

    // Check if response already exists (use service role)
    const { data: existingResponse } = await supabaseServer
      .from('student_responses')
      .select('id')
      .eq('exam_session_id', sessionId)
      .eq('student_id', user.id)
      .maybeSingle();

    if (existingResponse) {
      // Update existing response
      const { error: updateError } = await supabaseServer
        .from('student_responses')
        .update({
          answers,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingResponse.id);

      if (updateError) {
        console.error('Error updating answers:', updateError);
        return NextResponse.json({ error: 'Failed to save answers' }, { status: 500 });
      }
    } else {
      // Create new response (draft - not submitted yet)
      const { error: insertError } = await supabaseServer
        .from('student_responses')
        .insert({
          student_id: user.id,
          exam_session_id: sessionId,
          exam_id: examId,
          student_first_name: profile.first_name || '',
          student_last_name: profile.last_name || '',
          student_email: profile.email || '',
          answers,
          total_score: 0,
          max_possible_score: 0,
          auto_graded_score: 0,
          manual_graded_score: 0,
          grading_status: 'pending'
        });

      if (insertError) {
        console.error('Error inserting answers:', insertError);
        return NextResponse.json({ error: 'Failed to save answers' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Answers saved successfully' });
  } catch (error) {
    console.error('Error in POST /api/student/exam/[examId]/save:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
