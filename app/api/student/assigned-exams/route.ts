import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createRouteClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to verify student role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.role !== 'student') {
      return NextResponse.json({ error: 'Access denied. Students only.' }, { status: 403 });
    }

    // Fetch student invitations with exam details
    const { data: invitations, error: invitationsError } = await supabase
      .from('student_invitations')
      .select(`
        id,
        exam_id,
        status,
        duration,
        created_at,
        exams (
          id,
          title,
          description,
          department,
          start_time,
          end_time,
          duration,
          unique_code,
          created_by,
          max_attempts,
          shuffle_questions,
          show_results_immediately
        )
      `)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json({ error: 'Failed to fetch assigned exams' }, { status: 500 });
    }

    // For each exam, get session status and question counts
    const examsWithDetails = await Promise.all(
      (invitations || []).map(async (invitation) => {
        const exam = invitation.exams as unknown as { id: string; title: string; description: string; department: string; start_time: string | null; end_time: string | null; duration: number; unique_code: string } | null;
        if (!exam) return null;

        // Get exam session if exists
        const { data: session } = await supabase
          .from('exam_sessions')
          .select('id, status, start_time, end_time, total_score, violations_count')
          .eq('exam_id', exam.id)
          .eq('user_id', user.id)
          .single();

        // Get question counts (template questions only)
        const [mcqCount, saqCount, codingCount] = await Promise.all([
          supabase.from('mcq').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null),
          supabase.from('saq').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null),
          supabase.from('coding').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null)
        ]);

        const totalQuestions = (mcqCount.count || 0) + (saqCount.count || 0) + (codingCount.count || 0);

        // Determine exam status
        const now = new Date();
        const startTime = exam.start_time ? new Date(exam.start_time) : null;
        const endTime = exam.end_time ? new Date(exam.end_time) : null;

        let examStatus = 'pending';
        
        if (session?.status === 'completed') {
          examStatus = 'completed';
        } else if (session?.status === 'in_progress') {
          examStatus = 'in-progress';
        } else if (endTime && now > endTime) {
          examStatus = 'expired';
        } else if (startTime && now >= startTime && (!endTime || now <= endTime)) {
          examStatus = 'pending';
        } else if (startTime && now < startTime) {
          examStatus = 'upcoming';
        }

        return {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          department: exam.department,
          startTime: exam.start_time,
          endTime: exam.end_time,
          duration: invitation.duration || exam.duration,
          uniqueCode: exam.unique_code,
          totalQuestions,
          status: examStatus,
          sessionId: session?.id || null,
          sessionStatus: session?.status || null,
          sessionStartTime: session?.start_time || null,
          score: session?.total_score || null,
          invitationId: invitation.id,
          invitationStatus: invitation.status,
        };
      })
    );

    const validExams = examsWithDetails.filter((exam): exam is NonNullable<typeof exam> => exam !== null);

    return NextResponse.json(validExams);
  } catch (error) {
    console.error('Error in GET /api/student/assigned-exams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
