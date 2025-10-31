import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabase/server";
import { createRouteClient } from "@/lib/supabaseRouteClient";
import nodemailer from 'nodemailer';

// Generate a secure token for student invitations
function generateInvitationToken(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Send invitation email
async function sendStudentInvitationEmail(
  email: string,
  examTitle: string,
  token: string,
  expiresAt: Date
): Promise<void> {
  const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/student-invitation/${token}`;
  
  // Format expiration date
  const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Create transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: `You're Invited to Take: ${examTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .exam-info { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Exam Invitation</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>You've been invited to take an exam on our platform.</p>
              
              <div class="exam-info">
                <h3>📝 ${examTitle}</h3>
              </div>
              
              <p>To accept this invitation and create your student account, please click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${signupUrl}" class="button" style="color: #FFFFFF;">Accept Invitation & Create Account</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${signupUrl}</p>
              
              <p><strong>Note:</strong> This invitation link will expire on ${expirationDate}.</p>
            </div>
            <div class="footer">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export interface CreateStudentInvitationData {
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  examId: string;
  teacherId: string;
  expiresAt?: Date;
}

export interface CreateStudentInvitationResult {
  success: boolean;
  invitation?: Record<string, unknown>;
  error?: string;
}

// Create student invitation
async function createStudentInvitation(
  supabase: Awaited<ReturnType<typeof createRouteClient>>,
  {
    email,
    firstName,
    lastName,
    departmentId,
    examId,
    teacherId,
    expiresAt,
  }: CreateStudentInvitationData
): Promise<CreateStudentInvitationResult> {
  try {
    // Generate unique invitation token
    const token = generateInvitationToken();
    
    // Set expiration date (7 days from now if not provided)
    const expirationDate = expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Get exam details for the email
    const { data: exam } = await supabase
      .from('exams')
      .select('title')
      .eq('id', examId)
      .single();

    // Create invitation record
    const { data: invitation, error } = await supabase
      .from('student_invitations')
      .insert({
        student_email: email,
        first_name: firstName,
        last_name: lastName,
        department_id: departmentId,
        exam_id: examId,
        teacher_id: teacherId,
        invitation_token: token,
        status: 'pending',
        expires_at: expirationDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating student invitation:', error);
      return { success: false, error: error.message };
    }

    // Send invitation email
    try {
      await sendStudentInvitationEmail(email, exam?.title || 'Exam', token, expirationDate);
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the invitation creation if email fails
    }

    return { success: true, invitation };
  } catch (error) {
    console.error('Unexpected error creating student invitation:', error);
    return { success: false, error: 'Failed to create invitation' };
  }
}

// GET - Fetch all student invitations
export async function GET() {
  try {
    const supabase = await createRouteClient();
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'teacher')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch student invitations with exam and department details
    const { data: invitations, error } = await supabase
      .from('student_invitations')
      .select(`
        *,
        exams (
          id,
          title,
          start_time,
          end_time,
          duration
        ),
        departments (
          id,
          name,
          code
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student invitations:', error);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new student invitation
export async function POST(request: Request) {
  try {
    const supabase = await createRouteClient();
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'teacher')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastName, departmentId, examId, expirationDate } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !departmentId || !examId) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, firstName, lastName, departmentId, examId' 
      }, { status: 400 });
    }

    // Check if student already invited for this exam
    const { data: existing } = await supabase
      .from('student_invitations')
      .select('id')
      .eq('student_email', email)
      .eq('exam_id', examId)
      .single();

    if (existing) {
      return NextResponse.json({ 
        error: 'Student already invited for this exam' 
      }, { status: 400 });
    }

    // Create invitation
    const result = await createStudentInvitation(supabase, {
      email,
      firstName,
      lastName,
      departmentId,
      examId,
      teacherId: user.id,
      expiresAt: expirationDate ? new Date(expirationDate) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      invitation: result.invitation 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete student invitation(s)
export async function DELETE(request: Request) {
  try {
    const supabase = await createRouteClient();
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or teacher
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'teacher')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No invitation IDs provided' }, { status: 400 });
    }

    // Get invitations to check if any are accepted
    const { data: invitations, error: fetchError } = await supabase
      .from('student_invitations')
      .select('id, student_email, status, student_id')
      .in('id', ids);

    if (fetchError) {
      console.error('Error fetching invitations:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    // For accepted invitations, mark user profiles as deleted (soft delete)
    for (const invitation of invitations || []) {
      if (invitation.status === 'accepted' && invitation.student_id) {
        console.log('Marking student profile as deleted:', invitation.student_id);
        
        try {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ 
              deleted: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', invitation.student_id);

          if (updateError) {
            console.error('Error marking student profile as deleted:', updateError);
          } else {
            console.log('Successfully marked student profile as deleted');
          }
        } catch (updateErr) {
          console.error('Error during soft delete:', updateErr);
        }
      }
    }

    // Delete invitations permanently
    const { error } = await supabase
      .from('student_invitations')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting invitations:', error);
      return NextResponse.json({ error: 'Failed to delete invitations' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update student invitation
export async function PUT(request: Request) {
  try {
    const routeClient = await createRouteClient();
    
    // Get user session for authorization
    const { data: { user }, error: authError } = await routeClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or teacher
    const { data: profile } = await routeClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'teacher')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, firstName, lastName, email, examId, departmentId, expirationDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !examId || !departmentId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Use server-side supabase for update to bypass RLS
    const { error: updateError } = await supabase
      .from('student_invitations')
      .update({
        first_name: firstName,
        last_name: lastName,
        student_email: email,
        exam_id: examId,
        department_id: departmentId,
        expires_at: expirationDate,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
      return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Invitation updated successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
