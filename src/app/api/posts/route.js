import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0
    const category = searchParams.get('category')
    
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      posts: data,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}