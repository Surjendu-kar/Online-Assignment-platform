import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createRouteClient();
    
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

    const { data: responses, error } = await supabase
      .from('student_responses')
      .select(`
        id,
        exam_id,
        submitted_at,
        total_score,
        max_possible_score,
        grading_status,
        answers
      `)
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    const examIds = [...new Set(responses?.map(r => r.exam_id).filter(Boolean) || [])];
    
    if (examIds.length === 0) {
      return NextResponse.json({ results: [] });
    }
    
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select(`
        id,
        title,
        department_id,
        departments (
          name
        )
      `)
      .in('id', examIds);

    if (examsError) {
      console.error('Error fetching exams:', examsError);
    }

    const examMap = new Map(
      exams?.map(e => {
        let departmentName = 'N/A';

        if (Array.isArray(e.departments) && e.departments.length > 0) {
          departmentName = e.departments[0]?.name || 'N/A';
        } else if (e.departments && typeof e.departments === 'object' && 'name' in e.departments) {
          departmentName = (e.departments as { name: string }).name || 'N/A';
        }

        return [
          e.id,
          {
            id: e.id,
            title: e.title,
            department: departmentName
          }
        ];
      }) || []
    );

    const results = (responses || []).map((result) => {
      const exam = examMap.get(result.exam_id);
      
      const answersObj = result.answers || {};
      const answeredCount = Object.keys(answersObj).filter(
        (key) => answersObj[key] && answersObj[key].answer !== null && answersObj[key].answer !== ""
      ).length;
      const totalQuestions = Object.keys(answersObj).length;
      const percentage = result.max_possible_score > 0 
        ? Math.round((result.total_score / result.max_possible_score) * 100)
        : 0;

      return {
        id: result.id,
        exam_id: result.exam_id,
        exam_title: exam?.title || "Unknown Exam",
        department: exam?.department || "N/A",
        submitted_at: result.submitted_at,
        total_questions: totalQuestions,
        answered_questions: answeredCount,
        total_score: result.total_score,
        max_possible_score: result.max_possible_score,
        percentage,
        grading_status: result.grading_status,
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
