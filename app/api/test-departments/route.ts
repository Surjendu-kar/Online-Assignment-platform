import { supabaseServer as supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Test if departments table exists and fetch schema
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error testing departments table:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error.details
      });
    }

    // Also test institutions table
    const { data: instData, error: instError } = await supabase
      .from('institutions')
      .select('*')
      .limit(1);

    return NextResponse.json({ 
      success: true, 
      departments: data,
      institutions: instData,
      departmentsError: instError
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}