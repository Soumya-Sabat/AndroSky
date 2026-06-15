import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // Get doc
    const { data: doc, error } = await supabase
      .from('docs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    
    if (error || !doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    await supabase
      .from('docs')
      .update({ views: (doc.views || 0) + 1 })
      .eq('id', doc.id);
    
    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error('Error fetching doc:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}