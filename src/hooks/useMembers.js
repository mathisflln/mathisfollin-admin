import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading members:', error)
      setMembers([])
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  const remove = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      return
    }
    
    try {
      // Delete from auth.users (this will cascade to profiles via trigger)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Session expirée')
      }

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/delete_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ user_id: id })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la suppression')
      }

      await load()
    } catch (error) {
      console.error('Error deleting member:', error)
      throw error
    }
  }

  const updateRole = async (id, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return { 
    members, 
    loading, 
    remove,
    updateRole,
    reload: load 
  }
}