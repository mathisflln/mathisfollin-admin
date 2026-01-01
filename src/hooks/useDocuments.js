import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('documents_meta')
      .select('*')
      .order('created_at', { ascending: false })
    setDocuments(data || [])
    setLoading(false)
  }

  const create = async (title, description, file) => {
    const filename = `${Date.now()}_${file.name}`
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Insert metadata
    const { error: insertError } = await supabase
      .from('documents_meta')
      .insert([{
        title,
        filename,
        description: description || null
      }])

    if (insertError) {
      // Cleanup uploaded file
      await supabase.storage.from('documents').remove([filename])
      throw insertError
    }

    await load()
  }

  const remove = async (id, filename) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
    
    // Delete metadata
    const { error: dbError } = await supabase
      .from('documents_meta')
      .delete()
      .eq('id', id)
    
    if (dbError) throw dbError

    // Delete file
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filename])
    
    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return { 
    documents, 
    loading, 
    create, 
    remove,
    reload: load 
  }
}
