type Props = {
  currentStep: number
  totalSteps: number
}

export default function FormSteps({ currentStep, totalSteps }: Props) {
  return (
    <div className="formwizard-steps">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`formwizard-step-dot${i <= currentStep ? ' formwizard-step-dot--active' : ''}`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  )
}
