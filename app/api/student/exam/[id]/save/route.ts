import { createRouteClient } from '@/lib/supabaseRouteClient';
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

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
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

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    // Check if response already exists
    const { data: existingResponse } = await supabase
      .from('student_responses')
      .select('id')
      .eq('exam_session_id', sessionId)
      .eq('student_id', user.id)
      .single();

    if (existingResponse) {
      // Update existing response
      const { error: updateError } = await supabase
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
      // Create new response (draft)
      const { error: insertError } = await supabase
        .from('student_responses')
        .insert({
          student_id: user.id,
          exam_session_id: sessionId,
          exam_id: examId,
          student_first_name: profile?.first_name || '',
          student_last_name: profile?.last_name || '',
          student_email: profile?.email || '',
          answers,
          total_score: 0,
          max_possible_score: 0,
          auto_graded_score: 0,
          manual_graded_score: 0,
          grading_status: 'pending',
          submitted_at: new Date().toISOString()
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
