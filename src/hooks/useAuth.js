import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', userId)
      .single()
    
    setProfile(data)
    setLoading(false)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()
    
    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut()
      throw new Error("Accès non autorisé : vous n'êtes pas administrateur")
    }
    
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    isAdmin: profile?.role === 'admin'
  }
}
