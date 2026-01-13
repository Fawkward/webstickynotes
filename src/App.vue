<script setup lang="ts">
import { ref } from 'vue'
import StickyNote from './components/StickyNote.vue'

interface Note {
  id: number
  text: string
  color: string
  x: number
  y: number
  isNew: boolean
  rotation: number
}

const notes = ref<Note[]>([])
const draggingNote = ref<Note | null>(null)
const offset = ref({ x: 0, y: 0 })

const addNote = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('wall')) {
    const newNote: Note = {
      id: Date.now(),
      text: '',
      color: '#fff9c4',
      x: event.clientX - 100,
      y: event.clientY - 20,
      isNew: true,
      rotation: Math.floor(Math.random() * 6) - 3,
    }
    notes.value.push(newNote)
  }
}

const startDragging = (payload: { id: number; x: number; y: number; event: MouseEvent }) => {
  const note = notes.value.find((n) => n.id === payload.id)
  if (note) {
    draggingNote.value = note
    offset.value = { x: payload.event.clientX - note.x, y: payload.event.clientY - note.y }
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

const updateNote = (payload: { id: number; text?: string; color?: string }) => {
  const note = notes.value.find((n) => n.id === payload.id)
  if (note) {
    if (payload.text !== undefined) note.text = payload.text
    if (payload.color !== undefined) note.color = payload.color
    note.isNew = false
  }
}

const deleteNote = (id: number) => {
  notes.value = notes.value.filter((note) => note.id !== id)
}
</script>

<template>
  <div
    class="wall"
    @mousedown.left="addNote"
    @mousemove="onMouseMove"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <div class="instruction">Click to spawn sticker</div>

    <StickyNote
      v-for="note in notes"
      :key="note.id"
      v-bind="note"
      @delete="deleteNote"
      @update="updateNote"
      @drag-start="startDragging"
    />
  </div>
</template>

<style scoped>
.wall {
  width: 100vw;
  height: 100vh;
  background-color: #e0e0e0;
  overflow: hidden;
}

.instruction {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(49, 48, 48, 0.3);
  font-family: sans-serif;
  pointer-events: none;
}
</style>
