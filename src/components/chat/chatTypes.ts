export type Message = { id: string; text: string; user: string; pending?: boolean }

export const initialMessages: Message[] = [
  { id: '1', text: 'Hey there!', user: 'Alice' },
  { id: '2', text: 'Hi! How are you?', user: 'Bob' },
  { id: '3', text: 'I\'m good, thanks!', user: 'Alice' },
]

let _nextId = 4
export function generateId(): string {
  return String(++_nextId)
}

export function simulateResponse(text: string): Promise<Message> {
  const delay = 800 + Math.random() * 1200
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: generateId(), text: `Reply to: "${text.slice(0, 20)}"`, user: 'Bot' })
    }, delay)
  })
}
