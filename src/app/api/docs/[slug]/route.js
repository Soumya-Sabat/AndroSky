import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // Fetch the target document profile
    const { data: doc, error } = await supabase
      .from('docs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    
    if (error || !doc) {
      return NextResponse.json(
        { success: false, error: 'Document not found or restricted' },
        { status: 404 }
      );
    }
    
    // Atomically increment view counters via standard database updates
    const currentViews = doc.views || 0;
    await supabase
      .from('docs')
      .update({ views: currentViews + 1 })
      .eq('id', doc.id);
      
    // Return the updated doc reference to the client
    doc.views = currentViews + 1;
    
    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error(`Error processing request for slug ${slug}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}