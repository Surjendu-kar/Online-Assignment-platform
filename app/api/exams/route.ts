// app/api/exams/route.ts
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

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteClient(req);
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, department')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch exams based on role
    let query = supabase.from('exams').select('*'); // Ensure duration is fetched here
    
    if (profile.role === 'teacher') {
      // Teachers see only their created exams
      query = query.eq('created_by', user.id);
    } else if (profile.role === 'admin') {
      // Admins see all exams
      // No additional filter needed
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const { data: exams, error: examsError } = await query.order('created_at', { ascending: false });

    if (examsError) {
      console.error('Error fetching exams:', examsError);
      return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }

    // For each exam, get question counts
    const examsWithCounts = await Promise.all(
      exams.map(async (exam) => {
        const [mcqCount, saqCount, codingCount] = await Promise.all([
          supabase.from('mcq').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null),
          supabase.from('saq').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null),
          supabase.from('coding').select('id', { count: 'exact', head: true }).eq('exam_id', exam.id).is('user_id', null)
        ]);

        const totalQuestions = (mcqCount.count || 0) + (saqCount.count || 0) + (codingCount.count || 0);
        
        // Get assigned students count
        const { count: assignedStudents } = await supabase
          .from('student_invitations')
          .select('id', { count: 'exact', head: true })
          .eq('exam_id', exam.id);

        return {
          ...exam,
          totalQuestions,
          assignedStudents: assignedStudents || 0,
          status: exam.status || (
            exam.end_time && new Date(exam.end_time) < new Date() 
              ? 'archived' 
              : exam.start_time && new Date(exam.start_time) <= new Date() 
                ? 'active' 
                : 'draft'
          )
        };
      })
    );

    return NextResponse.json(examsWithCounts);
  } catch (error) {
    console.error('Error in GET /api/exams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteClient(req);
    const body = await req.json();
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, department')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Only admins and teachers can create exams
    if (profile.role !== 'admin' && profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

const { name, startDate, endDate, duration, questions, status } = body;
const utcStartDate = convertLocalToUTCISO(startDate);
const utcEndDate = convertLocalToUTCISO(endDate);
    // Generate unique exam code
    const uniqueCode = `EXAM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    // Create exam
    const { data: exam, error: examError } = await supabase
      .from('exams')
      .insert({
        title: name,
        description: '',
        department: profile.department,
        start_time: utcStartDate,
    end_time: utcEndDate,
        unique_code: uniqueCode,
        created_by: user.id,
        access_type: 'invitation',
        max_attempts: 1,
        shuffle_questions: false,
        show_results_immediately: false,
        require_webcam: true,
        max_violations: 3,
        duration: duration,
        status: status || 'draft',
      })
      .select()
      .single();

    if (examError) {
      console.error('Error creating exam:', examError);
      return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }

    // Add questions if provided
    if (questions && questions.length > 0) {
      for (const question of questions) {
        if (question.type === 'mcq') {
          await supabase.from('mcq').insert({
            exam_id: exam.id,
            question_text: question.question,
            options: question.options,
            correct_option: question.correctAnswer,
            marks: question.points,
            question_order: question.order || questions.indexOf(question) + 1
          });
        } else if (question.type === 'saq') {
          await supabase.from('saq').insert({
            exam_id: exam.id,
            question_text: question.question,
            grading_guidelines: question.gradingGuidelines,
            marks: question.points,
            question_order: question.order || questions.indexOf(question) + 1
          });
        } else if (question.type === 'coding') {
          await supabase.from('coding').insert({
            exam_id: exam.id,
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

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error('Error in POST /api/exams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}