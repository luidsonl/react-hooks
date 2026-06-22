import './style.css'

type Props = {
  action: () => void
  text: string
}

function Button({ action, text }: Props) {
  return (
    <button onClick={action}>
      {text}
    </button>
  )
}

export default Button
