import { ref } from 'vue'
import type { Note } from '@/types'

export function useDraggable() {
  const draggingNote = ref<Note | null>(null)
  const offset = ref({ x: 0, y: 0 })

  const startDragging = (note: Note, event: MouseEvent) => {
    draggingNote.value = note
    offset.value = {
      x: event.clientX - note.x,
      y: event.clientY - note.y,
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (draggingNote.value) {
      draggingNote.value.x = event.clientX - offset.value.x
      draggingNote.value.y = event.clientY - offset.value.y
    }
  }

  const stopDragging = () => {
    draggingNote.value = null
  }

  return {
    draggingNote,
    startDragging,
    onMouseMove,
    stopDragging,
  }
}
