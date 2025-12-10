import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabaseRouteClient";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // 1. Activity Metrics
    const { data: allSessions } = await supabase
      .from("exam_sessions")
      .select(
        `
        id,
        status,
        start_time,
        violations_count,
        exams!inner (
          institution_id
        )
      `
      )
      .eq("exams.institution_id", institutionId);

    const totalExamAttempts = allSessions?.length || 0;

    // Active sessions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeSessions =
      allSessions?.filter((s) => {
        if (s.status !== "in_progress") return false;
        const startDate = new Date(s.start_time);
        return startDate >= today;
      }) || [];
    const activeSessionsToday = activeSessions.length;

    // Submissions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentResponses } = await supabase
      .from("student_responses")
      .select(
        `
        submitted_at,
        exams!inner (
          institution_id
        )
      `
      )
      .eq("exams.institution_id", institutionId)
      .gte("submitted_at", oneWeekAgo.toISOString());

    const submissionsThisWeek = recentResponses?.length || 0;

    // Average violations
    const totalViolations = allSessions?.reduce(
      (sum, s) => sum + (s.violations_count || 0),
      0
    );
    const averageViolations =
      allSessions && allSessions.length > 0
        ? totalViolations! / allSessions.length
        : 0;

    // 2. Daily Activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSessions } = await supabase
      .from("exam_sessions")
      .select(
        `
        start_time,
        exams!inner (
          institution_id
        )
      `
      )
      .eq("exams.institution_id", institutionId)
      .gte("start_time", thirtyDaysAgo.toISOString());

    // Group by date
    const dailyActivityMap = new Map<string, number>();
    recentSessions?.forEach((session) => {
      const date = new Date(session.start_time).toISOString().split("T")[0];
      dailyActivityMap.set(date, (dailyActivityMap.get(date) || 0) + 1);
    });

    const dailyActivity = Array.from(dailyActivityMap.entries())
      .map(([date, count]) => ({
        date,
        attempts: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 3. Peak Usage Hours
    const peakHoursMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      peakHoursMap.set(i, 0);
    }

    recentSessions?.forEach((session) => {
      const hour = new Date(session.start_time).getHours();
      peakHoursMap.set(hour, (peakHoursMap.get(hour) || 0) + 1);
    });

    const peakUsageHours = Array.from(peakHoursMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour.toString().padStart(2, "0")}:00`,
        attempts: count,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // 4. Teacher Activity
    const { data: teachers } = await supabase
      .from("user_profiles")
      .select("id, full_name, email, created_at")
      .eq("role", "teacher")
      .eq("institution_id", institutionId);

    const teacherActivity = await Promise.all(
      (teachers || []).map(async (teacher) => {
        // Count exams created by this teacher
        const { data: exams } = await supabase
          .from("exams")
          .select("id")
          .eq("created_by", teacher.id);

        // Count students invited
        const { data: invitations } = await supabase
          .from("student_invitations")
          .select("id")
          .in(
            "exam_id",
            exams?.map((e) => e.id) || []
          );

        return {
          name: teacher.full_name || "Unknown",
          email: teacher.email,
          examsCreated: exams?.length || 0,
          studentsInvited: invitations?.length || 0,
          lastActive: teacher.created_at, // This would ideally track last login
        };
      })
    );

    // Sort by exams created
    teacherActivity.sort((a, b) => b.examsCreated - a.examsCreated);

    // 5. Proctoring Violations
    const { data: violations } = await supabase
      .from("proctoring_logs")
      .select(
        `
        violation_type,
        exam_sessions!inner (
          exams!inner (
            institution_id
          )
        )
      `
      )
      .eq("exam_sessions.exams.institution_id", institutionId);

    const violationCounts = new Map<string, number>();

    violations?.forEach((v) => {
      const type = v.violation_type || "Unknown";
      violationCounts.set(type, (violationCounts.get(type) || 0) + 1);
    });

    const proctoringViolations = Array.from(violationCounts.entries())
      .map(([type, count]) => ({
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // 6. Exam Terminations
    const terminatedSessions =
      allSessions?.filter((s) => s.status === "terminated") || [];
    const examTerminations = terminatedSessions.length;

    // 7. Invitation Statistics
    const { data: studentInvitations } = await supabase
      .from("student_invitations")
      .select(
        `
        status,
        exams!inner (
          institution_id
        )
      `
      )
      .eq("exams.institution_id", institutionId);

    const invitationStats = {
      pending: 0,
      accepted: 0,
      expired: 0,
      total: studentInvitations?.length || 0,
    };

    studentInvitations?.forEach((inv) => {
      if (inv.status === "pending") invitationStats.pending++;
      else if (inv.status === "accepted") invitationStats.accepted++;
      else if (inv.status === "expired") invitationStats.expired++;
    });

    const acceptanceRate =
      invitationStats.total > 0
        ? (invitationStats.accepted / invitationStats.total) * 100
        : 0;

    invitationStats.total = invitationStats.total;

    // Return all data
    return NextResponse.json({
      activityMetrics: {
        totalExamAttempts,
        activeSessionsToday,
        submissionsThisWeek,
        averageViolations: parseFloat(averageViolations.toFixed(2)),
      },
      dailyActivity,
      peakUsageHours,
      teacherActivity: teacherActivity.slice(0, 10), // Top 10 teachers
      proctoringViolations,
      examTerminations,
      invitationStats: {
        ...invitationStats,
        acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
      },
    });
  } catch (error) {
    console.error("Error fetching usage reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage reports" },
      { status: 500 }
    );
  }
}
