import { supabase } from '../lib/supabase'

export function AdminBar({ onEdit, onDuplicate, onDelete }) {
  return (
    <div className="abar">
      <button className="linkbtn" onClick={onEdit}>
        Засах
      </button>
      {onDuplicate && (
        <button className="linkbtn" onClick={onDuplicate}>
          Давхарлах
        </button>
      )}
      <button className="linkbtn del" onClick={onDelete}>
        Устгах
      </button>
    </div>
  )
}

export async function duplicateRow(table, row, labelKey) {
  const { id, created_at, ...rest } = row
  const { error } = await supabase
    .from(table)
    .insert({ ...rest, [labelKey]: `${rest[labelKey]} (хуулбар)` })
  if (error) alert(error.message)
}

export async function deleteRow(table, id, what = 'Үүнийг') {
  if (!confirm(`${what} устгах уу?`)) return false
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    alert(error.message)
    return false
  }
  return true
}
