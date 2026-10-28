import { useMemo } from 'react'
import { supabase } from './supabase'
import useLoad from './useLoad'

// Арга хэмжээ + үзмэрийг нэг он цагийн жагсаалт болгоно (Home, Time Machine хоёрт)
export function useTimelineItems() {
  const ev = useLoad(() => supabase.from('events').select('id,title,event_date,description,cover_image_url'), [])
  const ex = useLoad(() => supabase.from('exhibits').select('id,title,description,year_created,image_url').eq('status', 'published'), [])
  const items = useMemo(() => [
    ...(ev.data ?? []).map((e) => ({ kind: 'event', id: e.id, year: Number(e.event_date.slice(0, 4)), title: e.title, text: e.description, image: e.cover_image_url, to: '/events' })),
    ...(ex.data ?? []).filter((e) => e.year_created).map((e) => ({ kind: 'exhibit', id: e.id, year: e.year_created, title: e.title, text: e.description, image: e.image_url, to: `/exhibits/${e.id}` })),
  ], [ev.data, ex.data])
  return { items, loading: ev.loading || ex.loading, error: ev.error || ex.error }
}
