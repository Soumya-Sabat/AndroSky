// src/auth.js
import { supabase } from './lib/supabase'

const AUTH_SALT = process.env.NEXT_PUBLIC_AUTH_SALT || 'androsky_default_salt_2024'

export async function hashEmailWithSalt(email) {
  const saltedEmail = email.toLowerCase().trim() + AUTH_SALT
  const encoder = new TextEncoder()
  const data = encoder.encode(saltedEmail)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Register new user - FIXED VERSION (no admin API)
export async function registerUser(email, username) {
  try {
    // First, check if user already exists in custom users table
    const emailHash = await hashEmailWithSalt(email)
    
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email_hash', emailHash)
      .maybeSingle()
    
    if (existingUser) {
      return { success: false, error: 'Email already registered. Please login instead.' }
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: Math.random().toString(36).slice(-16), // Random password
      options: {
        data: {
          username: username,
          display_name: username
        }
      }
    })
    
    if (authError) {
      // Check if error is because user already exists
      if (authError.message.includes('already registered')) {
        return { success: false, error: 'Email already registered. Please login instead.' }
      }
      console.error('Auth error:', authError)
      return { success: false, error: authError.message }
    }
    
    if (!authData.user) {
      return { success: false, error: 'Failed to create user account' }
    }
    
    // Create user profile in custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email_hash: emailHash,
        email_original: email,
        username: username,
        total_xp: 0,
        nebula_coins: 100,
        current_level: 1
      })
      .select()
      .single()
    
    if (userError) {
      console.error('User insert error:', userError)
      // Profile creation failed but auth user exists
      return { 
        success: true, 
        user: authData.user, 
        warning: 'Account created but profile setup incomplete. Please contact support.'
      }
    }
    
    return { success: true, user: userData }
    
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}

// Send magic link
export async function sendMagicLink(email) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`
      }
    })
    
    if (error) {
      return { success: false, error: 'No account found with this email. Please register first.' }
    }
    
    return { success: true, message: 'Magic link sent to your email!' }
    
  } catch (error) {
    console.error('Magic link error:', error)
    return { success: false, error: error.message }
  }
}

// Login user
export async function loginUser(email) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`
      }
    })
    
    if (error) {
      return { success: false, error: 'No account found. Please register first.' }
    }
    
    return { success: true, requiresMagicLink: true, message: 'Magic link sent to your email!' }
    
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }
}

// Logout user
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return { success: true }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  
  return { ...user, profile }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}