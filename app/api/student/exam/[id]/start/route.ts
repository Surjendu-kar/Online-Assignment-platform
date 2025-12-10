import { createRouteClient } from '@/lib/supabaseRouteClient';
import { supabaseServer } from '@/lib/supabase/server';
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
      .select('role, email')
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

    // Check for existing session (use service role after authentication)
    const { data: existingSession } = await supabaseServer
      .from('exam_sessions')
      .select('*')
      .eq('exam_id', examId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingSession) {
      return NextResponse.json({
        error: 'Exam session already exists',
        session: existingSession
      }, { status: 400 });
    }

    // Create new exam session (use service role)
    const { data: newSession, error: createError } = await supabaseServer
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
      return NextResponse.json({ error: 'Failed to start exam session' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
