import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    let query = supabase
      .from('docs')
      .select('slug, title, excerpt, category, tags, read_time, author, created_at, views')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, docs: data });
  } catch (error) {
    console.error('Error fetching docs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}