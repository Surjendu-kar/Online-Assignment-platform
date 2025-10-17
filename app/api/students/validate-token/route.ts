import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';

// POST - Validate student invitation token
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Fetch invitation by token with exam details
    const { data: invitation, error } = await supabase
      .from('student_invitations')
      .select(`
        *,
        exams (
          id,
          title,
          description,
          start_time,
          end_time,
          duration
        )
      `)
      .eq('invitation_token', token)
      .single();

    if (error || !invitation) {
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

    return NextResponse.json({ 
      success: true, 
      invitation 
    });
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
