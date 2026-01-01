import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateSlug } from '../utils/helpers'

export function useArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  const create = async (articleData, userId) => {
    const slug = generateSlug(articleData.title)
    const { error } = await supabase
      .from('articles')
      .insert([{
        ...articleData,
        slug,
        author_id: userId
      }])
    
    if (error) throw error
    await load()
  }

  const update = async (id, articleData) => {
    const slug = generateSlug(articleData.title)
    const { error } = await supabase
      .from('articles')
      .update({
        ...articleData,
        slug
      })
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await load()
  }

  const getById = async (id) => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    
    return data
  }

  useEffect(() => {
    load()
  }, [])

  return { 
    articles, 
    loading, 
    create, 
    update, 
    remove, 
    getById,
    reload: load 
  }
}
