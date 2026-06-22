import { type Option } from './pollTypes'

type Props = {
  option: Option & { pct: number }
  votedOption: string | null
  onVote: (id: string) => void
}

export default function PollOption({ option, votedOption, onVote }: Props) {
  return (
    <button
      onClick={() => onVote(option.id)}
      disabled={!!votedOption}
      className={'poll-option' + (votedOption === option.id ? ' poll-option--voted' : '')}
    >
      <div className="poll-option-bar" style={{ width: `${option.pct}%` }} />
      <div className="poll-option-content">
        <span className="poll-option-text">{option.text}</span>
        <span className="poll-option-votes">
          {option.votes} ({option.pct.toFixed(0)}%)
        </span>
      </div>
    </button>
  )
}
