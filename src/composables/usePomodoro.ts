import { ref, computed, onUnmounted } from 'vue'

export function usePomodoro() {
  const defaultFocusTime = 25 * 60
  const defaultBreakTime = 5 * 60

  const timeLeft = ref(defaultFocusTime)
  const isActive = ref(false)
  const isBreak = ref(false)
  let timerInterval: number | null = null

  const displayTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const toggleTimer = () => {
    if (isActive.value) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  const startTimer = () => {
    isActive.value = true
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        finishSession()
      }
    }, 1000)
  }

  const pauseTimer = () => {
    isActive.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const resetTimer = () => {
    pauseTimer()
    isBreak.value = false
    timeLeft.value = defaultFocusTime
  }

  const finishSession = () => {
    pauseTimer()
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
    audio.play()

    isBreak.value = !isBreak.value
    timeLeft.value = isBreak.value ? defaultBreakTime : defaultFocusTime

    alert(isBreak.value ? 'Time to rest!' : 'Back to work!')
  }

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
  })

  return {
    displayTime,
    isActive,
    isBreak,
    toggleTimer,
    resetTimer,
    timeLeft,
  }
}
