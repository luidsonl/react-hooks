import { type Message } from './chatTypes'

export default function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div
      className="chat-bubble"
      data-user={msg.user}
      data-pending={msg.pending}
    >
      <div className="chat-bubble-author">
        {msg.user}
      </div>
      {msg.text}
    </div>
  )
}
