import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  const create = async (eventData) => {
    const { error } = await supabase
      .from('events')
      .insert([eventData])
    
    if (error) throw error
    await load()
  }

  const update = async (id, eventData) => {
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const getById = async (id) => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    return data
  }

  useEffect(() => {
    load()
  }, [])

  return { 
    events, 
    loading, 
    create, 
    update, 
    remove, 
    getById,
    reload: load 
  }
}
