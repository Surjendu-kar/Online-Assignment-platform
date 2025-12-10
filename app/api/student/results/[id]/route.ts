import { createRouteClient } from '@/lib/supabaseRouteClient';
import { supabaseServer } from '@/lib/supabase/server';
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

    // Use service role to fetch student response (after authentication)
    const { data: response, error: responseError } = await supabaseServer
      .from('student_responses')
      .select('*')
      .eq('id', id)
      .eq('student_id', user.id)
      .single();

    if (responseError || !response) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Use service role to fetch exam details (after authentication)
    const { data: exam, error: examError } = await supabaseServer
      .from('exams')
      .select(`
        id,
        title,
        department_id,
        departments (
          name
        )
      `)
      .eq('id', response.exam_id)
      .single();

    if (examError) {
      console.error('Error fetching exam:', examError);
    }

    let departmentName = 'N/A';

    if (Array.isArray(exam?.departments) && exam.departments.length > 0) {
      departmentName = exam.departments[0]?.name || 'N/A';
    } else if (exam?.departments && typeof exam.departments === 'object' && 'name' in exam.departments) {
      departmentName = (exam.departments as { name: string }).name || 'N/A';
    }

    // Use service role to fetch questions (after authentication)
    const { data: mcqQuestions } = await supabaseServer
      .from('mcq')
      .select('*')
      .eq('exam_id', response.exam_id);

    const { data: saqQuestions } = await supabaseServer
      .from('saq')
      .select('*')
      .eq('exam_id', response.exam_id);

    const { data: codingQuestions } = await supabaseServer
      .from('coding')
      .select('*')
      .eq('exam_id', response.exam_id);

    const studentAnswers = response.answers || {};

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
      teacher_feedback?: string | null;
    }

    interface MCQQuestion {
      id: string;
      question_text: string;
      marks: number;
      options?: string[];
      correct_option: number;
    }

    interface SAQQuestion {
      id: string;
      question_text: string;
      marks: number;
      answer_text?: string;
      grading_guidelines?: string;
    }

    interface CodingQuestion {
      id: string;
      question_text: string;
      marks: number;
      expected_output?: string;
    }

    const questionsWithAnswers: QuestionWithAnswer[] = [];
    let questionNumber = 1;

    (mcqQuestions || []).forEach((question: MCQQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question_text,
        question_type: 'mcq',
        options: question.options || [],
        correct_answer: question.options?.[question.correct_option] || '',
        student_answer: question.options?.[studentAnswer?.answer] || null,
        is_correct: studentAnswer?.isCorrect || false,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained ?? null,
      });
    });

    (saqQuestions || []).forEach((question: SAQQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question_text,
        question_type: 'saq',
        options: [],
        correct_answer: question.grading_guidelines || question.answer_text || 'No model answer provided',
        student_answer: studentAnswer?.answer || null,
        is_correct: studentAnswer?.marksObtained > 0,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained ?? null,
        teacher_feedback: studentAnswer?.teacher_feedback || null,
      });
    });

    (codingQuestions || []).forEach((question: CodingQuestion) => {
      const studentAnswer = studentAnswers[question.id];
      questionsWithAnswers.push({
        question_number: questionNumber++,
        question_text: question.question_text,
        question_type: 'coding',
        options: [],
        correct_answer: question.expected_output || 'No expected output provided',
        student_answer: studentAnswer?.answer || null,
        is_correct: studentAnswer?.marksObtained > 0,
        points: question.marks || 0,
        earned_points: studentAnswer?.marksObtained ?? null,
        teacher_feedback: studentAnswer?.teacher_feedback || null,
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
