import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabaseRouteClient";

// Type definitions
interface StudentAnswer {
  answer: string | number | null;
  marksObtained?: number | null;
  teacher_feedback?: string | null;
  type?: "mcq" | "saq" | "coding";
  gradingStatus?: "pending" | "partial" | "completed";
}

interface AnswersObject {
  [questionId: string]: StudentAnswer;
}

interface Department {
  id: string;
  name: string;
}

interface ExamRecord {
  id: string;
  title: string;
  created_by: string;
  institution_id: string | null;
  department_id: string;
  departments: Department | Department[] | null;
}

interface ExamInfo {
  title: string;
  created_by: string;
  institution_id: string | null;
  department_id: string;
  department: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createRouteClient();

  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to verify role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Only admins can access this endpoint
    if (profile.role.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admins only" },
        { status: 403 }
      );
    }

    // Get institution_id from query params
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get("institution_id");

    if (!institutionId) {
      return NextResponse.json(
        { error: "Institution ID is required" },
        { status: 400 }
      );
    }

    // Fetch all completed submissions directly from student_responses
    const { data: responses, error: responsesError } = await supabase
      .from("student_responses")
      .select(
        `
        id,
        student_id,
        exam_session_id,
        exam_id,
        student_first_name,
        student_last_name,
        student_email,
        answers,
        total_score,
        max_possible_score,
        grading_status,
        submitted_at
      `
      )
      .order("submitted_at", { ascending: false });

    if (responsesError) {
      console.error("Error fetching responses:", responsesError);
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({
        submissions: [],
        message: "No submissions found",
      });
    }

    // Get unique exam IDs to fetch exam details
    const examIds = [...new Set(responses.map((r) => r.exam_id))];

    // Fetch exam details
    const { data: exams, error: examsError } = await supabase
      .from("exams")
      .select(
        `
        id,
        title,
        created_by,
        institution_id,
        department_id,
        departments (
          id,
          name
        )
      `
      )
      .in("id", examIds);

    if (examsError) {
      console.error("Error fetching exams:", examsError);
    }

    // Create exam lookup map
    const examMap = new Map<string, ExamInfo>(
      ((exams as ExamRecord[]) || []).map((e) => {
        let departmentName = "Unknown";
        if (Array.isArray(e.departments) && e.departments.length > 0) {
          departmentName = e.departments[0]?.name || "Unknown";
        } else if (
          e.departments &&
          typeof e.departments === "object" &&
          "name" in e.departments
        ) {
          departmentName =
            (e.departments as { name: string }).name || "Unknown";
        }

        return [
          e.id,
          {
            title: e.title,
            created_by: e.created_by,
            institution_id: e.institution_id,
            department_id: e.department_id,
            department: departmentName,
          },
        ];
      }) || []
    );

    // Filter responses to only include exams from the selected institution
    const filteredResponses = responses.filter((response) => {
      const exam = examMap.get(response.exam_id);
      if (!exam) return false;

      return exam.institution_id === institutionId;
    });

    // Process each response to count questions
    const submissions = filteredResponses.map((response) => {
      const exam = examMap.get(response.exam_id);
      const answersObj: AnswersObject = response.answers || {};

      // Count question types from answers
      let mcqCount = 0;
      let saqCount = 0;
      let codingCount = 0;
      let gradedCount = 0;
      let pendingCount = 0;

      Object.values(answersObj).forEach((answer: StudentAnswer) => {
        if (answer.type === "mcq") {
          mcqCount++;
          // MCQs are auto-graded, so count them as graded
          gradedCount++;
        } else if (answer.type === "saq") {
          saqCount++;
          // Check if graded: either has gradingStatus 'completed' or marksObtained is set
          if (
            answer.gradingStatus === "completed" ||
            (answer.marksObtained !== null &&
              answer.marksObtained !== undefined)
          ) {
            gradedCount++;
          } else {
            pendingCount++;
          }
        } else if (answer.type === "coding") {
          codingCount++;
          // Check if graded: either has gradingStatus 'completed' or marksObtained is set
          if (
            answer.gradingStatus === "completed" ||
            (answer.marksObtained !== null &&
              answer.marksObtained !== undefined)
          ) {
            gradedCount++;
          } else {
            pendingCount++;
          }
        }
      });

      const totalQuestions = Object.keys(answersObj).length;

      return {
        id: response.id,
        session_id: response.exam_session_id,
        exam_id: response.exam_id,
        exam_title: exam?.title || "Unknown Exam",
        student_id: response.student_id,
        student_name: `${response.student_first_name} ${response.student_last_name}`,
        student_email: response.student_email,
        department: exam?.department || "Unknown",
        department_id: exam?.department_id || "",
        institution_id: exam?.institution_id || "",
        institution_name: "", // Can be fetched separately if needed
        submitted_at: response.submitted_at,
        total_questions: totalQuestions,
        mcq_count: mcqCount,
        saq_count: saqCount,
        coding_count: codingCount,
        graded_count: gradedCount,
        pending_count: pendingCount,
        grading_status: response.grading_status,
        total_score: response.total_score || 0,
        max_possible_score: response.max_possible_score || 0,
      };
    });

    return NextResponse.json({
      submissions,
      message: "Submissions fetched successfully",
    });
  } catch (error) {
    console.error("Error in admin grading API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createRouteClient();

  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile to verify role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Only admins can delete submissions
    if (profile.role.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admins only" },
        { status: 403 }
      );
    }

    // Get submission IDs from request body
    const body = await request.json();
    const { submissionIds } = body;

    if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
      return NextResponse.json(
        { error: "Submission IDs are required" },
        { status: 400 }
      );
    }

    // Fetch submission details to get session_id, student_id, and exam_id
    const { data: submissions, error: fetchError } = await supabase
      .from("student_responses")
      .select("id, exam_session_id, student_id, exam_id")
      .in("id", submissionIds);

    if (fetchError) {
      console.error("Error fetching submissions:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch submission details" },
        { status: 500 }
      );
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json(
        { error: "No submissions found with provided IDs" },
        { status: 404 }
      );
    }

    // Extract unique session IDs, student IDs, and exam IDs
    const sessionIds = [...new Set(submissions.map((s) => s.exam_session_id))];
    const studentExamPairs = submissions.map((s) => ({
      student_id: s.student_id,
      exam_id: s.exam_id,
    }));

    // Step 1: Delete proctoring logs
    const { error: proctoringError } = await supabase
      .from("proctoring_logs")
      .delete()
      .in("session_id", sessionIds);

    if (proctoringError) {
      console.error("Error deleting proctoring logs:", proctoringError);
      // Continue even if this fails (logs might not exist)
    }

    // Step 2: Delete student's cloned questions (MCQ, SAQ, Coding)
    // Delete for each student-exam pair
    for (const pair of studentExamPairs) {
      // Delete MCQ questions
      const { error: mcqError } = await supabase
        .from("mcq")
        .delete()
        .eq("user_id", pair.student_id)
        .eq("exam_id", pair.exam_id);

      if (mcqError) {
        console.error("Error deleting MCQ questions:", mcqError);
      }

      // Delete SAQ questions
      const { error: saqError } = await supabase
        .from("saq")
        .delete()
        .eq("user_id", pair.student_id)
        .eq("exam_id", pair.exam_id);

      if (saqError) {
        console.error("Error deleting SAQ questions:", saqError);
      }

      // Delete Coding questions
      const { error: codingError } = await supabase
        .from("coding")
        .delete()
        .eq("user_id", pair.student_id)
        .eq("exam_id", pair.exam_id);

      if (codingError) {
        console.error("Error deleting Coding questions:", codingError);
      }
    }

    // Step 3: Delete exam_sessions (this will CASCADE delete student_responses)
    const { error: sessionError } = await supabase
      .from("exam_sessions")
      .delete()
      .in("id", sessionIds);

    if (sessionError) {
      console.error("Error deleting exam sessions:", sessionError);
      return NextResponse.json(
        { error: "Failed to delete exam sessions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${submissionIds.length} submission(s)`,
      deletedCount: submissionIds.length,
    });
  } catch (error) {
    console.error("Error in DELETE grading API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
