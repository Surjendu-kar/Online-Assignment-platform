import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // Use the imported supabase client directly

  try {
    const { token, password } = await req.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain uppercase, lowercase, and number" },
        { status: 400 }
      );
    }

    // Get invitation by token
    const { data: invitation, error: invitationError } = await supabase
      .from("teacher_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation token" },
        { status: 400 }
      );
    }

    // Check if invitation is expired
    if (new Date() > new Date(invitation.expires_at)) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    // Create the auth user directly without email confirmation using admin privileges
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: invitation.email,
      password: password,
      email_confirm: true, // Auto-confirm since they were invited
      user_metadata: {
        first_name: invitation.first_name,
        last_name: invitation.last_name,
      }
    });

    if (authError || !newUser.user) {
      // Check if error is due to existing user
      if (authError && authError.message && authError.message.includes('email')) {
        // Check if user exists and is deleted
        const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingAuthUsers?.users?.find(user => user.email === invitation.email);
        
        if (existingUser) {
          // Check if user profile is marked as deleted
          const { data: userProfile } = await supabase
            .from("user_profiles")
            .select("deleted")
            .eq("id", existingUser.id)
            .single();
          
          if (userProfile && userProfile.deleted) {
            // User is deleted, reactivate them
            const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
              password: password,
              email_confirm: true,
            });
            
            if (updateError || !updatedUser) {
              return NextResponse.json(
                { error: updateError?.message || "Failed to reactivate user account" },
                { status: 400 }
              );
            }
            
            // Update user profile to reactivate it
            const { error: profileError } = await supabase
              .from("user_profiles")
              .update({
                role: "teacher",
                created_by: invitation.admin_id,
                institution: invitation.institution,
                department: invitation.department,
                first_name: invitation.first_name,
                last_name: invitation.last_name,
                email: invitation.email,
                verified: true,
                deleted: false,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingUser.id);
            
            if (profileError) {
              return NextResponse.json(
                { error: profileError.message || "Failed to reactivate user profile" },
                { status: 400 }
              );
            }
            
            // Continue with the rest of the process using the reactivated user
            // Mark invitation as used/accepted
            await supabase
              .from("teacher_invitations")
              .update({
                status: "accepted",
                used_at: new Date().toISOString(),
              })
              .eq("token", token);

            return NextResponse.json({
              message: "Teacher account reactivated successfully",
              user: {
                id: existingUser.id,
                email: existingUser.email,
              },
            });
          }
        }
      }
      
      return NextResponse.json(
        { error: authError?.message || "Failed to create user account" },
        { status: 400 }
      );
    }

    // Create the user profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: newUser.user.id,
        role: "teacher",
        created_by: invitation.admin_id,
        institution: invitation.institution,
        department: invitation.department,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        email: invitation.email,
        verified: true,
      });

    if (profileError) {
      // Cleanup: Delete the auth user if profile creation fails
      // Note: In Supabase, we can't easily delete users, but we can mark them as unverified
      return NextResponse.json(
        { error: profileError.message || "Failed to create user profile" },
        { status: 400 }
      );
    }

    // Mark invitation as used/accepted
    await supabase
      .from("teacher_invitations")
      .update({
        status: "accepted",
        used_at: new Date().toISOString(),
      })
      .eq("token", token);

    return NextResponse.json({
      message: "Teacher account created successfully",
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
      },
    });
  } catch (error) {
    console.error("Error in teacher signup:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}