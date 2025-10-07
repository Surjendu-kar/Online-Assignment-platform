import { supabaseServer as supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH - Update an institution
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, description } = await request.json();

    // Validate institution ID
    if (!id) {
      return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    // Update institution
    const { data, error } = await supabase
      .from('institutions')
      .update({
        name: name || undefined,
        description: description || undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating institution:', error);
      return NextResponse.json({ error: 'Failed to update institution' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Return the updated institution
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an institution
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Validate institution ID
    if (!id) {
      return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    // First, delete all departments associated with this institution
    const { error: deptDeleteError } = await supabase
      .from('departments')
      .delete()
      .eq('institution_id', id);

    if (deptDeleteError) {
      console.error('Error deleting institution departments:', deptDeleteError);
      return NextResponse.json({ error: 'Failed to delete institution departments' }, { status: 500 });
    }

    // Then delete the institution itself
    const { error: instDeleteError } = await supabase
      .from('institutions')
      .delete()
      .eq('id', id);

    if (instDeleteError) {
      console.error('Error deleting institution:', instDeleteError);
      return NextResponse.json({ error: 'Failed to delete institution' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}