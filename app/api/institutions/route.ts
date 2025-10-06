import { supabaseServer as supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch all institutions
export async function GET(request: Request) {
  try {
    // Fetch all institutions from the database
    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching institutions:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch institutions',
        details: error.message
      }, { status: 500 });
    }

    // Process institutions to ensure they have required fields
    const processedInstitutions = institutions.map((inst: any) => ({
      id: inst.id,
      name: inst.name,
      description: inst.description || inst.name
    }));

    // Return the institutions data
    return NextResponse.json(processedInstitutions);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new institution
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
    }

    // Create institution
    const { data, error } = await supabase
      .from('institutions')
      .insert({
        name,
        description: description || name
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating institution:', error);
      return NextResponse.json({ error: 'Failed to create institution' }, { status: 500 });
    }

    // Return the created institution
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}