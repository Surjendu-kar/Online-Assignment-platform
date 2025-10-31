import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createRouteClient();
    const { id: examId } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { data: invitation, error: invitationError } = await supabase
      .from('student_invitations')
      .select('id, status, duration, exam_id')
      .eq('student_id', user.id)
      .eq('exam_id', examId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'You are not invited to this exam' }, { status: 403 });
    }

    const { data: existingSession } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('exam_id', examId)
      .eq('user_id', user.id)
      .single();

    if (existingSession) {
      return NextResponse.json({ 
        error: 'Exam session already exists',
        session: existingSession 
      }, { status: 400 });
    }

    const { data: newSession, error: createError } = await supabase
      .from('exam_sessions')
      .insert({
        exam_id: examId,
        user_id: user.id,
        start_time: new Date().toISOString(),
        status: 'in_progress',
        total_score: 0,
        violations_count: 0
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating session:', createError);
      return NextResponse.json({ error: 'Failed to start exam session' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      session: newSession
    });
  } catch (error) {
    console.error('Error in POST /api/student/exam/[examId]/start:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
