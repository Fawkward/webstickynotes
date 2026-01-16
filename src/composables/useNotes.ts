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
      Object.assign(note, updates) // Умное обновление полей
      if (updates.text !== undefined) note.isNew = false
    }
  }

  return {
    notes,
    addNote,
    deleteNote,
    updateNote,
  }
}
