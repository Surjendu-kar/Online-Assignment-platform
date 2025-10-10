import { NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // Use the imported supabase client directly

  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const { data: invitation, error } = await supabase
      .from("teacher_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > new Date(invitation.expires_at)) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    // Fetch institution name if institution ID is provided
    let institutionName = "Your Institution";
    if (invitation.institution) {
      // Try to fetch from institutions table first
      const { data: institutionData, error: institutionError } = await supabase
        .from("institutions")
        .select("name")
        .eq("id", invitation.institution)
        .single();
      
      if (!institutionError && institutionData) {
        institutionName = institutionData.name;
      } else {
        // If not found in institutions table, use the stored value directly
        institutionName = invitation.institution;
      }
    }

    // Fetch department name if department ID is provided
    let departmentName = "General Department";
    if (invitation.department) {
      // Try to fetch from departments table first
      const { data: departmentData, error: departmentError } = await supabase
        .from("departments")
        .select("name")
        .eq("id", invitation.department)
        .single();
      
      if (!departmentError && departmentData) {
        departmentName = departmentData.name;
      } else {
        // If not found in departments table, check if it's one of our known department codes
        const departmentMap: Record<string, string> = {
          "bca": "BCA (Bachelor of Computer Applications)",
          "bba": "BBA (Bachelor of Business Administration)",
          "cse": "CSE (Computer Science Engineering)",
          "ece": "ECE (Electronics & Communication Engineering)"
        };
        
        if (departmentMap[invitation.department]) {
          departmentName = departmentMap[invitation.department];
        } else {
          // Otherwise, use the stored value directly
          departmentName = invitation.department;
        }
      }
    }

    return NextResponse.json({
      valid: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        institution: institutionName,
        department: departmentName,
        expires_at: invitation.expires_at,
      },
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}