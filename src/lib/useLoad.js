import { useEffect, useState } from 'react'

export default function useLoad(fn, deps) {
  const [s, set] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    let off = false
    set((p) => ({ ...p, loading: true }))
    fn().then(({ data, error }) => !off && set({ data, error, loading: false }))
    return () => {
      off = true
    }
  }, deps)
  return s
}
