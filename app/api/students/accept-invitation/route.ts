import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';

// POST - Accept student invitation and create account
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Token and password are required' 
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters' 
      }, { status: 400 });
    }

    // Fetch invitation by token
    const { data: invitation, error: invError } = await supabase
      .from('student_invitations')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (invError || !invitation) {
      return NextResponse.json({ 
        error: 'Invalid or expired invitation token' 
      }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ 
        error: 'This invitation has expired' 
      }, { status: 400 });
    }

    // Check if invitation is already accepted
    if (invitation.status === 'accepted') {
      return NextResponse.json({ 
        error: 'This invitation has already been accepted' 
      }, { status: 400 });
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: invitation.student_email,
      password: password,
      email_confirm: true, // Auto-confirm email for invited students
    });

    if (authError || !authData.user) {
      console.error('Error creating user:', authError);
      return NextResponse.json({ 
        error: authError?.message || 'Failed to create user account' 
      }, { status: 500 });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: invitation.student_email,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        role: 'student',
        department_id: invitation.department_id,
        profile_completed: true,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ 
        error: 'Failed to create user profile' 
      }, { status: 500 });
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('student_invitations')
      .update({
        status: 'accepted',
        student_id: authData.user.id,
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
      // Don't fail the request if this fails, account is already created
    }

    return NextResponse.json({ 
      success: true,
      examId: invitation.exam_id,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
