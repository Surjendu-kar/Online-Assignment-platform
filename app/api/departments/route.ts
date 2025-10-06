import { supabaseServer as supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch all departments
export async function GET(request: Request) {
  try {
    // Fetch all departments from the database
    const { data: departments, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching departments:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch departments',
        details: error.message
      }, { status: 500 });
    }

    // Process departments - show actual data from DB, don't generate defaults
    const processedDepartments = departments.map((dept: any) => ({
      id: dept.id,
      name: dept.name,
      // Only include code and description if they exist in the database
      ...(dept.code && { code: dept.code }),
      ...(dept.description && { description: dept.description })
    }));

    // Return the departments data exactly as it is in the database
    return NextResponse.json(processedDepartments);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new department
export async function POST(request: Request) {
  try {
    const { name, code, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    // Create department with provided values (code and description are optional)
    const departmentData: any = {
      name
    };
    
    // Only add code and description if they are provided
    if (code !== undefined && code !== null && code !== '') {
      departmentData.code = code;
    }
    
    if (description !== undefined && description !== null && description !== '') {
      departmentData.description = description;
    }

    const { data, error } = await supabase
      .from('departments')
      .insert(departmentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating department:', error);
      return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
    }

    // Return the created department with success message
    return NextResponse.json({ 
      data,
      message: `Department "${name}" created successfully`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}