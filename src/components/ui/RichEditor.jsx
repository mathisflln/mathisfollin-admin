import { useRef, useEffect } from 'react'

function RichEditor({ value, onChange, placeholder = "Commencez à écrire..." }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    
    // Trigger onChange after command
    if (onChange) {
      onChange(editorRef.current?.innerHTML || '')
    }
  }

  const handleCreateLink = () => {
    const url = prompt('URL du lien:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current?.innerHTML || '')
    }
  }

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('bold')}
        >
          <strong>Gras</strong>
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('italic')}
        >
          <em>Italique</em>
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('underline')}
        >
          <u>Souligné</u>
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('insertUnorderedList')}
        >
          • Liste
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('insertOrderedList')}
        >
          1. Numérotée
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('formatBlock', 'h2')}
        >
          Titre 2
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={() => execCommand('formatBlock', 'h3')}
        >
          Titre 3
        </button>
        <button 
          type="button" 
          className="editor-btn" 
          onClick={handleCreateLink}
        >
          🔗 Lien
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  )
}

export default RichEditor
