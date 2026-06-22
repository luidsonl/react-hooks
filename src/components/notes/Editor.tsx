import { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react'
import { simpleMarkdown } from './simpleMarkdown'
import { type Note } from './noteTypes'

type Props = {
  note: Note
  onSave: (id: string, title: string, content: string) => void
}

export default function Editor({ note, onSave }: Props) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const deferredContent = useDeferredValue(content)

  useEffect(() => {
    return () => clearTimeout(saveTimer.current)
  }, [])

  const debouncedSave = useCallback((t: string, c: string) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSave(note.id, t, c)
    }, 500)
  }, [note.id, onSave])

  const previewHtml = useMemo(() => simpleMarkdown(deferredContent), [deferredContent])

  return (
    <div className="notes-editor">
      <div className="notes-editor-column">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); debouncedSave(e.target.value, content) }}
          placeholder="Note title"
          className="notes-title-input"
        />
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); debouncedSave(title, e.target.value) }}
          placeholder="Write markdown..."
          className="notes-textarea"
        />
      </div>

      <div
        className="island notes-preview"
        data-stale={deferredContent !== content ? '' : undefined}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  )
}
