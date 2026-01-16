<script setup lang="ts">
import StickyNote from './components/StickyNote.vue'
import { useNotes } from './composables/useNotes' 
import { useDraggable } from './composables/useDraggable' 

const { notes, addNote, deleteNote, updateNote } = useNotes()

const { startDragging, onMouseMove, stopDragging } = useDraggable()

const handleWallClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('wall')) {
    addNote(event.clientX - 100, event.clientY - 20)
  }
}

const handleDragStart = (payload: { id: number; event: MouseEvent }) => {
  const note = notes.value.find((n) => n.id === payload.id)
  if (note) {
    startDragging(note, payload.event)
  }
}
</script>

<template>
  <div
    class="wall"
    @mousedown.left="handleWallClick"
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
      @update="(payload) => updateNote(payload.id, payload)"
      @drag-start="handleDragStart"
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
