import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createRouteClient();
    const { id } = await params;
    
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

    const { data: response, error: responseError } = await supabase
      .from('student_responses')
      .select('*')
      .eq('id', id)
      .eq('student_id', user.id)
      .single();

    if (responseError || !response) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id, title, department')
      .eq('id', response.exam_id)
      .single();

    if (examError) {
      console.error('Error fetching exam:', examError);
    }

    const departmentName = exam?.department || 'N/A';

    const { data: mcqQuestions } = await supabase
      .from('mcq')
      .select('*')
      .eq('exam_id', response.exam_id)
      .is('user_id', null);

    const { data: saqQuestions } = await supabase
      .from('saq')
      .select('*')
      .eq('exam_id', response.exam_id)
      .is('user_id', null);

    const { data: codingQuestions } = await supabase
      .from('coding')
      .select('*')
      .eq('exam_id', response.exam_id)
      .is('user_id', null);

    const studentAnswers = response.answers || {};

    console.log('Response:', { id, exam_id: response.exam_id });
    console.log('Exam:', exam);
    console.log('MCQ:', mcqQuestions?.length || 0, 'SAQ:', saqQuestions?.length || 0, 'Coding:', codingQuestions?.length || 0);

    interface QuestionWithAnswer {
      question_number: number;
      question_text: string;
      question_type: 'mcq' | 'saq' | 'coding';
      options: string[];
      correct_answer: string;
      student_answer: string | null;
      is_correct: boolean;
      points: number;
      earned_points: number;
    }

    interface MCQQuestion {
      id: string;
      question: string;
      marks: number;
      options?: string[];
      correct_option: number;
    }

    interface SAQQuestion {
      id: string;
      question: string;
      marks: number;
      correct_answer?: string;
    }

    interface CodingQuestion {
      id: string;
      question: string;
      marks: number;
      correct_answer?: string;
    }

    const questionsWithAnswers: QuestionWithAnswer[] = [];
    let questionNumber = 1;

    (mcqQuestions || []).forEach((question: MCQQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question,
        question_type: 'mcq',
        options: question.options || [],
        correct_answer: question.options?.[question.correct_option] || '',
        student_answer: question.options?.[studentAnswer?.answer] || null,
        is_correct: studentAnswer?.isCorrect || false,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained || 0,
      });
    });

    (saqQuestions || []).forEach((question: SAQQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question,
        question_type: 'saq',
        options: [],
        correct_answer: question.correct_answer || '',
        student_answer: studentAnswer?.answer || null,
        is_correct: studentAnswer?.marksObtained > 0,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained || 0,
      });
    });

    (codingQuestions || []).forEach((question: CodingQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question,
        question_type: 'coding',
        options: [],
        correct_answer: question.correct_answer || '',
        student_answer: studentAnswer?.answer || null,
        is_correct: studentAnswer?.marksObtained > 0,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained || 0,
      });
    });

    const answeredCount = Object.keys(studentAnswers).filter(
      (key) => studentAnswers[key] && studentAnswers[key].answer !== null && studentAnswers[key].answer !== "" && studentAnswers[key].answer !== undefined
    ).length;

    const percentage = response.max_possible_score > 0 
      ? Math.round((response.total_score / response.max_possible_score) * 100)
      : 0;

    const detailedResult = {
      id: response.id,
      exam_id: response.exam_id,
      exam_title: exam?.title || "Unknown Exam",
      department: departmentName,
      submitted_at: response.submitted_at,
      total_questions: questionsWithAnswers.length,
      answered_questions: answeredCount,
      total_score: response.total_score,
      max_possible_score: response.max_possible_score,
      percentage,
      grading_status: response.grading_status,
      questions: questionsWithAnswers,
    };

    return NextResponse.json({ result: detailedResult });
  } catch (error) {
    console.error('Error fetching result details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
