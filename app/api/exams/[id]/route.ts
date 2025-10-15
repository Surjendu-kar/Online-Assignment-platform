// app/api/exams/[id]/route.ts
import { createRouteClient } from '@/lib/supabaseRouteClient';
import { NextRequest, NextResponse } from 'next/server';


const convertLocalToUTCISO = (localDatetimeString: string): string | null => {
  if (!localDatetimeString) return null;
  try {
    const date = new Date(localDatetimeString); // Parses as local time
    if (isNaN(date.getTime())) {
      console.warn(`[API Helper] Invalid local datetime string for conversion: ${localDatetimeString}`);
      return null;
    }
    const utcISOString = date.toISOString(); // Converts to UTC ISO string
    console.log(`[API Helper] Converted local (${localDatetimeString}) to UTC ISO: ${utcISOString}`);
    return utcISOString;
  } catch (e) {
    console.error(`[API Helper] Error processing local datetime string: ${localDatetimeString}`, e);
    return null;
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteClient(req);
    const { id: examId } = await params;

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get exam details
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .select('*') // Ensure 'duration' is included here
      .eq('id', examId)
      .single();

    if (examError || !exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Get all questions for the exam
    const [mcqRes, saqRes, codingRes] = await Promise.all([
      supabase.from('mcq').select('*').eq('exam_id', examId).is('user_id', null).order('question_order'),
      supabase.from('saq').select('*').eq('exam_id', examId).is('user_id', null).order('question_order'),
      supabase.from('coding').select('*').eq('exam_id', examId).is('user_id', null).order('question_order')
    ]);

    // Format questions
    const questions = [
      ...mcqRes.data?.map(q => ({
        id: q.id,
        type: 'mcq' as const,
        question: q.question_text,
        points: q.marks,
        options: q.options,
        correctAnswer: q.correct_option,
        order: q.question_order
      })) || [],
      ...saqRes.data?.map(q => ({
        id: q.id,
        type: 'saq' as const,
        question: q.question_text,
        points: q.marks,
        gradingGuidelines: q.grading_guidelines,
        order: q.question_order
      })) || [],
      ...codingRes.data?.map(q => ({
        id: q.id,
        type: 'coding' as const,
        question: q.question_text,
        points: q.marks,
        programmingLanguage: q.language,
        testCases: q.test_cases,
        codeTemplate: q.starter_code,
        order: q.question_order
      })) || []
    ].sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ ...exam, questions });
  } catch (error) {
    console.error('Error in GET /api/exams/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteClient(req);
    const { id: examId } = await params;
    const body = await req.json();

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns the exam
    const { data: exam, error: checkError } = await supabase
      .from('exams')
      .select('created_by')
      .eq('id', examId)
      .single();

    if (checkError || !exam || exam.created_by !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to edit this exam' }, { status: 403 });
    }

const { name, startDate, endDate, duration, questions, status } = body;
const utcStartDate = convertLocalToUTCISO(startDate);
const utcEndDate = convertLocalToUTCISO(endDate);
    // Update exam details
    const { error: updateError } = await supabase
      .from('exams')
      .update({
        title: name,
        start_time: utcStartDate,
    end_time: utcEndDate,
        duration: duration, 
        status: status || 'draft',
      })
      .eq('id', examId);

    if (updateError) {
      console.error('Error updating exam:', updateError);
      return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
    }

    // Delete existing questions
    await Promise.all([
      supabase.from('mcq').delete().eq('exam_id', examId).is('user_id', null),
      supabase.from('saq').delete().eq('exam_id', examId).is('user_id', null),
      supabase.from('coding').delete().eq('exam_id', examId).is('user_id', null)
    ]);

    // Add updated questions
    if (questions && questions.length > 0) {
      for (const question of questions) {
        if (question.type === 'mcq') {
          await supabase.from('mcq').insert({
            exam_id: examId,
            question_text: question.question,
            options: question.options,
            correct_option: question.correctAnswer,
            marks: question.points,
            question_order: question.order || questions.indexOf(question) + 1
          });
        } else if (question.type === 'saq') {
          await supabase.from('saq').insert({
            exam_id: examId,
            question_text: question.question,
            grading_guidelines: question.gradingGuidelines,
            marks: question.points,
            question_order: question.order || questions.indexOf(question) + 1
          });
        } else if (question.type === 'coding') {
          await supabase.from('coding').insert({
            exam_id: examId,
            question_text: question.question,
            starter_code: question.codeTemplate,
            expected_output: '',
            test_cases: question.testCases,
            language: question.programmingLanguage,
            marks: question.points,
            question_order: question.order || questions.indexOf(question) + 1
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/exams/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteClient(req);
    const { id: examId } = await params;

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns the exam
    const { data: exam, error: checkError } = await supabase
      .from('exams')
      .select('created_by')
      .eq('id', examId)
      .single();

    if (checkError || !exam || exam.created_by !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this exam' }, { status: 403 });
    }

    // Delete exam (questions will cascade delete)
    const { error: deleteError } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId);

    if (deleteError) {
      console.error('Error deleting exam:', deleteError);
      return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/exams/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}