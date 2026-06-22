import '../styles/poll.css'
import { useState, useEffect, useContext, useReducer, useCallback, useMemo, useOptimistic, useTransition } from 'react'
import { UserCtx, voteReducer, type PollData } from '../components/poll/pollTypes'
import PollOption from '../components/poll/PollOption'
import SuggestionBox from '../components/poll/SuggestionBox'

function fetchPollData(): Promise<PollData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        question: 'What is the best React hook?',
        options: [
          { id: 'a', text: 'useState', votes: 42 },
          { id: 'b', text: 'useEffect', votes: 28 },
          { id: 'c', text: 'useContext', votes: 15 },
          { id: 'd', text: 'useReducer', votes: 20 },
        ],
        totalVotes: 105,
      })
    }, 500)
  })
}

const pollPromise = fetchPollData()

function PollView({ initial }: { initial: PollData }) {
  const [poll, dispatch] = useReducer(voteReducer, initial)
  const [votedOption, setVotedOption] = useState<string | null>(null)
  const [newOptionText, setNewOptionText] = useState('')
  const user = useContext(UserCtx)
  const [, startTransition] = useTransition()

  const [optimisticPoll, addOptimisticVote] = useOptimistic(
    poll,
    (state, optionId: string) => ({
      ...state,
      options: state.options.map((o) =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o
      ),
      totalVotes: state.totalVotes + 1,
    })
  )

  useEffect(() => {
    if (poll.totalVotes > initial.totalVotes + 10) return
    const interval = setInterval(() => {
      const randOpt = poll.options[Math.floor(Math.random() * poll.options.length)]
      if (randOpt) {
        dispatch({ type: 'VOTE', optionId: randOpt.id })
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [poll, initial.totalVotes])

  const percentages = useMemo(() => {
    return optimisticPoll.options.map((o) => ({
      ...o,
      pct: optimisticPoll.totalVotes > 0 ? (o.votes / optimisticPoll.totalVotes) * 100 : 0,
    }))
  }, [optimisticPoll])

  const handleVote = useCallback((optionId: string) => {
    if (votedOption) return
    setVotedOption(optionId)
    addOptimisticVote(optionId)

    startTransition(() => {
      setTimeout(() => {
        dispatch({ type: 'VOTE', optionId })
      }, 300)
    })
  }, [votedOption, addOptimisticVote])

  const addCustomOption = useCallback(() => {
    if (!newOptionText.trim()) return
    const id = String(Date.now())
    startTransition(() => {
      dispatch({ type: 'VOTE', optionId: id })
    })
    setNewOptionText('')
  }, [newOptionText])

  return (
    <div className="page poll-page">
      <div className="poll-user-info">
        Logged in as: <strong>{user.name}</strong>
      </div>

      <div className="island">
        <h2 className="poll-question">{optimisticPoll.question}</h2>

        <div className="poll-options">
          {percentages.map((opt) => (
            <PollOption key={opt.id} option={opt} votedOption={votedOption} onVote={handleVote} />
          ))}
        </div>

        <div className="poll-total-votes">
          Total votes: {optimisticPoll.totalVotes}
          {votedOption && <span className="poll-voted-badge">· You voted</span>}
        </div>
      </div>

      <SuggestionBox value={newOptionText} onChange={setNewOptionText} onAdd={addCustomOption} />

      <div className="poll-footer">
        Simulated votes every 4s · Optimistic update on vote
      </div>
    </div>
  )
}

function PollFetcher() {
  const [pollData, setPollData] = useState<PollData | null>(null)

  useEffect(() => {
    pollPromise.then(setPollData)
  }, [])

  if (!pollData) {
    return (
      <div className="page poll-loading">
        <div className="poll-loading-text">Loading poll...</div>
      </div>
    )
  }

  return <PollView initial={pollData} />
}

export default function Poll() {
  return (
    <UserCtx.Provider value={{ name: 'Player1', id: '1' }}>
      <PollFetcher />
    </UserCtx.Provider>
  )
}
