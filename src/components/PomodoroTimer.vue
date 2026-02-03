<script setup lang="ts">
import { usePomodoro } from '@/composables/usePomodoro'

const emit = defineEmits(['drag-start'])
const { displayTime, isActive, isBreak, toggleTimer, resetTimer } = usePomodoro()

const onMouseDown = (event: MouseEvent) => {
  emit('drag-start', event)
}
</script>
<template>
  <div class="pomodoro-sticker" :class="{ 'break-mode': isBreak }" @mousedown="onMouseDown">
    <div class="content">
      <div class="timer-display">{{ displayTime }}</div>
      <div class="timer-status">
        {{ isBreak ? 'Break Time' : 'Focus Time' }}
      </div>

      <div class="timer-controls">
        <button
          class="timer-btn primary"
          :class="{ paused: isActive }"
          @mousedown.stop
          @click="toggleTimer"
        >
          {{ isActive ? 'Pause' : 'Start' }}
        </button>
        <button class="timer-btn" @mousedown.stop @click="resetTimer">Reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-sticker {
  cursor: pointer;
  position: absolute;
  user-select: none;
  top: 100px;
  right: 50px;
  width: 220px;
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-top: 5px solid #ff5f5f;
  font-family: 'Inter', sans-serif;
  text-align: center;
}

.pomodoro-sticker:active {
  cursor: grabbing;
}

.pomodoro-sticker.break-mode {
  border-top-color: #4caf50;
}

.pomodoro-sticker.break-mode .timer-status {
  color: #4caf50;
}

.pomodoro-sticker.break-mode .timer-btn.primary {
  background: #4caf50;
}

.drag-handle {
  cursor: grab;
  text-align: center;
  color: #ddd;
  margin-bottom: 5px;
}

.timer-display {
  font-size: 38px;
  font-weight: 800;
  color: #2d3436;
  font-variant-numeric: tabular-nums;
}

.timer-status {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #ff5f5f;
  margin-bottom: 15px;
}

.timer-controls {
  display: flex;
  gap: 8px;
}

.timer-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fdfdfd;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.timer-btn.primary {
  background: #ff5f5f;
  color: white;
  border: none;
}

.timer-btn.primary.paused {
  background: #636e72;
}
</style>
