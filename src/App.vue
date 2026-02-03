<script setup lang="ts">
import StickyNote from './components/StickyNote.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'

import { ref } from 'vue'
import { useNotes } from './composables/useNotes'
import { useDraggable } from './composables/useDraggable'

const { notes, addNote, deleteNote, updateNote, importNotes, exportNotes } = useNotes()

const { startDragging, onMouseMove, stopDragging } = useDraggable()

const isSidebarOpen = ref(true)
const showPomodoro = ref(false)

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

const pomodoroPosition = ref({
  id: -1,
  x: 800,
  y: 100,
  content: '',
  text: '',
  color: '#ffd700',
  isNew: false,
  rotation: 0,
})
const handlePomodoroDrag = (event: MouseEvent) => {
  startDragging(pomodoroPosition.value, event)
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
    <button v-if="!isSidebarOpen" class="menu-trigger" @mouseenter="isSidebarOpen = true">
      ☰
    </button>

    <aside
      class="sidebar"
      :class="{ 'is-open': isSidebarOpen }"
      @mouseleave="isSidebarOpen = false"
    >
      <div class="sidebar-container">
        <div class="sidebar-header">
          <h2>Notes Board</h2>
          <p>Manage your creative space</p>
        </div>

        <div class="sidebar-body">
          <div class="tool-item">
            <label class="checkbox-container">
              <input type="checkbox" v-model="showPomodoro" />
              <span class="checkbox-label">Pomodoro Timer</span>
            </label>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="stats">
            Total Notes: <span>{{ notes.length }}</span>
          </div>
          <div class="footer-actions">
            <button @click="exportNotes" class="btn btn-action"><span>📤</span> Export</button>

            <label class="btn btn-action">
              <span>📥</span> Import
              <input type="file" @change="importNotes" accept=".json" hidden />
            </label>
          </div>
        </div>
      </div>
    </aside>

    <div class="instruction">Click to spawn sticker</div>
    <Transition name="fade">
      <PomodoroTimer
        v-if="showPomodoro"
        :style="{ left: pomodoroPosition.x + 'px', top: pomodoroPosition.y + 'px' }"
        @drag-start="handlePomodoroDrag"
      />
    </Transition>

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
.tool-item {
  margin-bottom: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.2s;
}

.checkbox-container:hover {
  background: rgba(0, 0, 0, 0.03);
}

.checkbox-label {
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: #444;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: #ff5f5f;
  cursor: pointer;
}
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

.menu-trigger {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2000;
  background: #ecebeb;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 20px;
}

.sidebar {
  position: absolute;
  top: 0;
  left: -360px;
  width: 320px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1500;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.sidebar.is-open {
  left: 0;
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 40px 24px 30px;
  box-sizing: border-box;
}

.sidebar-header h2 {
  margin: 0;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  font-size: 24px;
}

.sidebar-header p {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.sidebar-body {
  flex-grow: 1;
  margin-top: 40px;
}

.placeholder-text {
  color: #bbb;
  font-size: 14px;
  font-style: italic;
}

.sidebar-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 20px;
}

.stats {
  font-family: sans-serif;
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.stats span {
  font-weight: bold;
  color: #3b82f6;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.btn-action:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.btn-action:active {
  transform: translateY(0);
}
</style>
