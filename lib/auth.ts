import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// Sign up with email and password
export async function signUp(email: string, password: string, userData?: {
  first_name?: string
  last_name?: string
  role?: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error }
  }

  // Create user profile if userData provided
  if (data.user && userData) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        created_at: new Date().toISOString(),
      })

    if (profileError) {
      return { error: profileError }
    }
  }

  return { data }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error }
  }

  // Get user profile and store in localStorage
  if (data?.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, first_name, last_name, email, deleted')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      return { error: profileError }
    }

    // Check if user is marked as deleted
    if (profileData.deleted) {
      // Sign out the user immediately
      await supabase.auth.signOut();
      return { error: { message: "Account has been deleted" } }
    }

    if (profileData) {
      // Store user role and basic info in localStorage
      localStorage.setItem('userRole', profileData.role);
      localStorage.setItem('userFirstName', profileData.first_name || '');
      localStorage.setItem('userLastName', profileData.last_name || '');
      localStorage.setItem('userEmail', profileData.email || '');
    }
  }

  return { data }
}

// Sign out
export async function signOut() {
  // Clear user data from localStorage
  localStorage.removeItem('userRole');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userEmail');
  
  const { error } = await supabase.auth.signOut();
  return { error }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

// Get redirect path based on user role
export function getRedirectPath(user: { role?: string } | null): string {
  if (!user?.role) return "/login";

  switch (user.role.toLowerCase()) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    default:
      return "/login";
  }
}