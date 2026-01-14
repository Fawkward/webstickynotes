<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { marked } from 'marked'

const props = defineProps<{
  modelValue: string
  isNew?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isEditing = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const draft = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    draft.value = v
  },
)

watch(
  () => props.modelValue,
  (v) => {
    draft.value = v
  },
)

const renderedMarkdown = computed(() => marked.parse(draft.value || ''))

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  if (contentRef.value) {
    contentRef.value.innerText = draft.value
    contentRef.value.focus()
    const range = document.createRange()
    range.selectNodeContents(contentRef.value)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
}
const stopEditing = () => {
  isEditing.value = false
  emit('update:modelValue', draft.value)
}

const handleInput = (event: Event) => {
  draft.value = (event.target as HTMLElement).innerText
}

onMounted(() => {
  if (props.isNew) {
    setTimeout(startEditing, 50)
  }
})
</script>

<template>
  <div class="editor-wrapper">
    <div
      v-if="isEditing"
      ref="contentRef"
      class="content editable"
      contenteditable="true"
      @input="handleInput"
      @blur="stopEditing"
      @mousedown.stop
      data-placeholder="Write..."
    ></div>

    <div
      v-else
      class="content preview markdown-body"
      v-html="renderedMarkdown"
      @dblclick="startEditing"
    ></div>
  </div>
</template>

<style scoped>
.content:empty:before {
  content: attr(data-placeholder);
  color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  display: block;
}

.content {
  outline: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  min-height: 150px;
  width: 100%;

  overflow-wrap: anywhere;
  word-break: break-all;
  white-space: pre-wrap;
}
.editor-wrapper {
  height: 100%;
  width: 100%;
}

.markdown-body :deep(p) {
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.markdown-body :deep(h1) {
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.markdown-body :deep(ul) {
  padding-left: 20px;
}
.markdown-body :deep(strong) {
  font-weight: bold;
}

.markdown-body {
  overflow-wrap: anywhere;
  word-break: break-all;
}
.editable:empty:before {
  content: attr(data-placeholder);
  color: rgba(0, 0, 0, 0.3);
}
</style>
