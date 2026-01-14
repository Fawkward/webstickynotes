<script setup lang="ts">
import MarkdownEditor from './MarkdownEditor.vue'

interface Props {
  id: number
  text: string
  color: string
  x: number
  y: number
  isNew: boolean
  rotation: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update', 'delete', 'drag-start'])

const colors = ['#fff9c4', '#ffccbc', '#c8e6c9', '#b3e5fc', '#d1c4e9', '#ffffff']

const handleTextUpdate = (newText: string) => {
  emit('update', { id: props.id, text: newText })
}

const changeColor = (newColor: string) => {
  emit('update', { id: props.id, color: newColor })
}
</script>

<template>
  <div
    class="sticky-note"
    :style="{
      backgroundColor: props.color,
      left: props.x + 'px',
      top: props.y + 'px',
      transform: `rotate(${props.rotation}deg)`,
    }"
    @mousedown="$emit('drag-start', { id: props.id, x: props.x, y: props.y, event: $event })"
  >
    <div class="color-picker">
      <button
        v-for="c in colors"
        :key="c"
        class="color-dot"
        :style="{ backgroundColor: c }"
        @mousedown.stop="changeColor(c)"
      ></button>
    </div>

    <button class="delete-btn" @click.stop="emit('delete', props.id)">
      <svg viewBox="0 0 24 24" class="icon-trash">
        <path
          d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
        />
      </svg>
    </button>

    <MarkdownEditor
      :modelValue="props.text"
      :isNew="props.isNew"
      @update:modelValue="handleTextUpdate"
    />
  </div>
</template>

<style scoped>
.sticky-note {
  position: absolute;
  width: 220px;
  min-height: 220px;
  padding: 25px 15px 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ff5252;
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
  z-index: 10;
}

.sticky-note:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-btn:hover {
  background: #ff1744;
  transform: scale(1.1) !important;
}

.icon-trash {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.color-picker {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: white;
  padding: 10px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 20;
}

.sticky-note:hover .color-picker {
  opacity: 1;
  pointer-events: auto;
  top: -40px;
}

.color-picker::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
  height: 15px;
}

.color-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-dot:hover {
  transform: scale(1.3);
}
</style>
