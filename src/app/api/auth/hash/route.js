import { NextResponse } from 'next/server'
import crypto from 'crypto'

const AUTH_SALT = process.env.NEXT_PUBLIC_AUTH_SALT

export async function POST(request) {
  try {
    const { email } = await request.json()
    const saltedEmail = email.toLowerCase().trim() + AUTH_SALT
    const hash = crypto.createHash('sha256').update(saltedEmail).digest('hex')
    
    return NextResponse.json({ hash })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}