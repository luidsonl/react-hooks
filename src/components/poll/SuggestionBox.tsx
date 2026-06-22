type Props = {
  value: string
  onChange: (v: string) => void
  onAdd: () => void
}

export default function SuggestionBox({ value, onChange, onAdd }: Props) {
  return (
    <div className="island poll-suggestion">
      <h4 className="poll-suggestion-title">Suggest an option</h4>
      <div className="poll-suggestion-input-row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your idea..."
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
        <button onClick={onAdd} disabled={!value.trim()}>Add</button>
      </div>
    </div>
  )
}
