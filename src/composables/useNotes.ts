import { ref, watch } from 'vue'
import type { Note } from '@/types'

export function useNotes() {
  const loadNotes = (): Note[] => {
    const saved = localStorage.getItem('my-sticky-notes')
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Error loading notes:', e)
      return []
    }
  }

  const notes = ref<Note[]>(loadNotes())

  watch(
    notes,
    (newNotes) => {
      localStorage.setItem('my-sticky-notes', JSON.stringify(newNotes))
    },
    { deep: true },
  )

  const addNote = (x: number, y: number) => {
    const newNote: Note = {
      id: Date.now(),
      text: '',
      color: '#fff9c4',
      x,
      y,
      isNew: true,
      rotation: Math.floor(Math.random() * 6) - 3,
    }
    notes.value.push(newNote)
  }

  const deleteNote = (id: number) => {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  const updateNote = (id: number, updates: Partial<Note>) => {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      Object.assign(note, updates)
      if (updates.text !== undefined) note.isNew = false
    }
  }

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `notes-export-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const importNotes = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    const file = input.files[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedData)) {
          notes.value = importedData
        }
      } catch (err) {
        alert('Error while importing notes: ' + (err as Error).message)
      }
    }
    reader.readAsText(file)
  }

  return {
    notes,
    addNote,
    deleteNote,
    updateNote,
    importNotes,
    exportNotes,
  }
}
