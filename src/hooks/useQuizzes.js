import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })
    setQuizzes(data || [])
    setLoading(false)
  }

  const create = async (quizData) => {
    const { error } = await supabase
      .from('quizzes')
      .insert([quizData])
    
    if (error) throw error
    await load()
  }

  const update = async (id, quizData) => {
    const { error } = await supabase
      .from('quizzes')
      .update(quizData)
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) return
    
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const getById = async (id) => {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single()
    
    return data
  }

  useEffect(() => {
    load()
  }, [])

  return { 
    quizzes, 
    loading, 
    create, 
    update, 
    remove, 
    getById,
    reload: load 
  }
}
