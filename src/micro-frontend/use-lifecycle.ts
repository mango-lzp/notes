import { useState, useEffect } from '../hooks'

const useLifeCycle = (lifecycle: Lifecycle) => {
  const [status, setStatus] = useState('inactive')
  const { activeWhen, onActive, onInactive, deps } = lifecycle

  useEffect(() => {
    if(activeWhen()) {
      onActive?.()
      setStatus('active')
    } else {
      onInactive?.()
      setStatus('inactive')
    }
  }, deps)

  return status
}

let visible = false
setTimeout(() => {
  visible = true
  setTimeout(() => {
    console.log(state)
  })
}, 1000);

const state = useLifeCycle({
  activeWhen: () => visible,
  deps: [visible]
})

console.log(state)

interface Lifecycle {
  activeWhen: () => boolean
  onActive?: () => void
  onInactive?: () => void
  deps: Array<any>
}