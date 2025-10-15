import { supabaseServer as supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH - Update a department
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Validate department ID
    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    // Prepare update data - only include fields that are provided
    const updateData: Record<string, string | null> = {};
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    
    if (updates.code !== undefined) {
      // Allow setting code to null/empty to clear it
      updateData.code = updates.code || null;
    }
    
    if (updates.description !== undefined) {
      // Allow setting description to null/empty to clear it
      updateData.description = updates.description || null;
    }
    
    if (updates.institution_id !== undefined) {
      // Allow setting institution_id to null/empty to clear it
      updateData.institution_id = updates.institution_id || null;
    }

    // Update department only if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('departments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating department:', error);
      return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Return the updated department with success message
    return NextResponse.json({ 
      data,
      message: `Department "${data.name}" updated successfully`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a department
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate department ID
    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    // First, get the department name for the success message
    const { data: deptData, error: fetchError } = await supabase
      .from('departments')
      .select('name')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching department for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch department for deletion' }, { status: 500 });
    }

    if (!deptData) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Delete department
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting department:', error);
      return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
    }

    // Return success response with deleted data
    return NextResponse.json({ 
      message: `Department "${deptData.name}" deleted successfully`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}