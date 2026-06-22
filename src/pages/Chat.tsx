import '../styles/chat.css'
import { useState, useEffect, useRef, useOptimistic, useCallback, useTransition, useSyncExternalStore } from 'react'
import { initialMessages, simulateResponse, generateId, type Message } from '../components/chat/chatTypes'
import MessageBubble from '../components/chat/MessageBubble'

function getOnlineStatus() { return navigator.onLine }

function subscribe(cb: () => void) {
  window.addEventListener('online', cb)
  window.addEventListener('offline', cb)
  return () => {
    window.removeEventListener('online', cb)
    window.removeEventListener('offline', cb)
  }
}

export default function Chat() {
  const [, startTransition] = useTransition()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const isOnline = useSyncExternalStore(subscribe, getOnlineStatus, () => true)

  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMsg: Message) => [...state, newMsg]
  )

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')

    const tempId = generateId()
    const temp: Message = { id: tempId, text, user: 'You', pending: true }

    addOptimistic(temp)

    const reply = await simulateResponse(text)

    startTransition(() => {
      setMessages((prev) => [
        ...prev,
        { id: generateId(), text, user: 'You' },
        reply,
      ])
    })
  }, [input, addOptimistic])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [optimisticMessages])

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        'Anyone there?', 'How\'s the project going?',
        'Don\'t forget to commit!', '☕ coffee time?',
      ]
      const text = msgs[Math.floor(Math.random() * msgs.length)]
      setMessages((prev) => [...prev, { id: generateId(), text, user: 'Bot' }])
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const displayedMessages = messages

  return (
    <div className="page chat-container">
      <div className="chat-status-row">
        <div className="chat-status-dot" data-online={isOnline} />
        <span className="chat-status-text">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div
        ref={listRef}
        className="chat-message-list"
      >
        {displayedMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={!isOnline}
        />
        <button onClick={sendMessage} disabled={!isOnline || !input.trim()}>
          Send
        </button>
      </div>

      <div className="chat-footer">
        Bot messages arrive every 8s · Simulated 1s reply delay
      </div>
    </div>
  )
}
