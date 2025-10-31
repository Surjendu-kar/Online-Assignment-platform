import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextRequest, NextResponse } from 'next/server';

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

    // Verify user is a student
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, first_name, last_name, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get exam session
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

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Exam already submitted' }, { status: 400 });
    }

    // Get exam details
    const { data: exam } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single();

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Fetch template questions to calculate scores
    const { data: mcqQuestions } = await supabase
      .from('mcq')
      .select('*')
      .eq('exam_id', examId)
      .is('user_id', null);

    const { data: saqQuestions } = await supabase
      .from('saq')
      .select('*')
      .eq('exam_id', examId)
      .is('user_id', null);

    const { data: codingQuestions } = await supabase
      .from('coding')
      .select('*')
      .eq('exam_id', examId)
      .is('user_id', null);

    // Calculate scores
    let autoGradedScore = 0;
    let maxPossibleScore = 0;

    interface GradedAnswer {
      questionId: string;
      type: 'mcq' | 'saq' | 'coding';
      answer: string | number | null;
      isCorrect?: boolean;
      marksObtained: number | null;
      maxMarks: number;
      gradingStatus?: string;
    }

    const gradedAnswers: Record<string, GradedAnswer> = {};

    // Auto-grade MCQ questions
    (mcqQuestions || []).forEach((question) => {
      maxPossibleScore += question.marks || 0;
      const studentAnswer = answers[question.id];
      
      if (studentAnswer !== undefined && studentAnswer !== null) {
        const isCorrect = parseInt(studentAnswer) === question.correct_option;
        gradedAnswers[question.id] = {
          questionId: question.id,
          type: 'mcq',
          answer: studentAnswer,
          isCorrect,
          marksObtained: isCorrect ? question.marks : 0,
          maxMarks: question.marks
        };
        
        if (isCorrect) {
          autoGradedScore += question.marks || 0;
        }
      } else {
        gradedAnswers[question.id] = {
          questionId: question.id,
          type: 'mcq',
          answer: null,
          isCorrect: false,
          marksObtained: 0,
          maxMarks: question.marks
        };
      }
    });

    // Store SAQ answers (not auto-graded)
    (saqQuestions || []).forEach((question) => {
      maxPossibleScore += question.marks || 0;
      const studentAnswer = answers[question.id];
      
      gradedAnswers[question.id] = {
        questionId: question.id,
        type: 'saq',
        answer: studentAnswer || '',
        marksObtained: null, // To be graded manually
        maxMarks: question.marks,
        gradingStatus: 'pending'
      };
    });

    // Store Coding answers (not auto-graded)
    (codingQuestions || []).forEach((question) => {
      maxPossibleScore += question.marks || 0;
      const studentAnswer = answers[question.id];
      
      gradedAnswers[question.id] = {
        questionId: question.id,
        type: 'coding',
        answer: studentAnswer || '',
        marksObtained: null, // To be graded manually
        maxMarks: question.marks,
        gradingStatus: 'pending'
      };
    });

    // Determine grading status
    const hasManualQuestions = (saqQuestions?.length || 0) > 0 || (codingQuestions?.length || 0) > 0;
    const gradingStatus = hasManualQuestions ? 'partial' : 'completed';

    // Create or update student_responses
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
          answers: gradedAnswers,
          total_score: autoGradedScore,
          max_possible_score: maxPossibleScore,
          auto_graded_score: autoGradedScore,
          manual_graded_score: 0,
          grading_status: gradingStatus,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingResponse.id);

      if (updateError) {
        console.error('Error updating response:', updateError);
        return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
      }
    } else {
      // Create new response
      const { error: insertError } = await supabase
        .from('student_responses')
        .insert({
          student_id: user.id,
          exam_session_id: sessionId,
          exam_id: examId,
          student_first_name: profile.first_name || '',
          student_last_name: profile.last_name || '',
          student_email: profile.email || '',
          answers: gradedAnswers,
          total_score: autoGradedScore,
          max_possible_score: maxPossibleScore,
          auto_graded_score: autoGradedScore,
          manual_graded_score: 0,
          grading_status: gradingStatus,
          submitted_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting response:', insertError);
        return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
      }
    }

    // Update exam session
    const { error: sessionUpdateError } = await supabase
      .from('exam_sessions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        total_score: autoGradedScore
      })
      .eq('id', sessionId);

    if (sessionUpdateError) {
      console.error('Error updating session:', sessionUpdateError);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      score: autoGradedScore,
      maxScore: maxPossibleScore,
      gradingStatus,
      message: hasManualQuestions 
        ? 'Exam submitted successfully. Some questions require manual grading.' 
        : 'Exam submitted successfully!'
    });
  } catch (error) {
    console.error('Error in POST /api/student/exam/[examId]/submit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
