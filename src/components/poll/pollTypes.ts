import { createContext } from 'react'

export type Option = { id: string; text: string; votes: number }
export type PollData = { question: string; options: Option[]; totalVotes: number }
export type VoteAction = { type: 'VOTE'; optionId: string }
export type User = { name: string; id: string }

export const UserCtx = createContext<User>({ name: 'Guest', id: '0' })

export function voteReducer(state: PollData, action: VoteAction): PollData {
  if (action.type === 'VOTE') {
    return {
      ...state,
      options: state.options.map((o) =>
        o.id === action.optionId ? { ...o, votes: o.votes + 1 } : o
      ),
      totalVotes: state.totalVotes + 1,
    }
  }
  return state
}
