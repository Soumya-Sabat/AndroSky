import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    
    // Get the post
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    if (error || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Increment view count (fire and forget)
    await supabase
      .from('posts')
      .update({ views: post.views + 1 })
      .eq('id', post.id)
    
    return NextResponse.json({
      success: true,
      post
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}