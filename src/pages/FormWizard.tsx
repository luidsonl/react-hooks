import '../styles/form-wizard.css'
import { useState, useTransition, useActionState } from 'react'
import PersonalForm from '../components/form-wizard/PersonalForm'
import CreditCardForm from '../components/form-wizard/CreditCardForm'
import FormSteps from '../components/form-wizard/FormSteps'
import Button from '../components/shared/Button'

type ShippingData = { name: string; email: string; address: string }
type PaymentData = { cardNumber: string; expiry: string; cvv: string }
type FormData = ShippingData & PaymentData
type Errors = Partial<Record<keyof FormData, string>>

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function validateStep(s: number, data: FormData): Errors {
  const errs: Errors = {}
  if (s === 0) {
    if (!data.name.trim()) errs.name = 'Required'
    if (!data.email.includes('@')) errs.email = 'Invalid email'
    if (!data.address.trim()) errs.address = 'Required'
  }
  if (s === 1) {
    if (data.cardNumber.replace(/\s/g, '').length < 13) errs.cardNumber = 'Invalid card'
    if (!data.expiry.match(/^\d{2}\/\d{2,4}$/)) errs.expiry = 'MM/YY or MM/YYYY required'
    if (!data.cvv.match(/^\d{3,4}$/)) errs.cvv = 'Invalid CVV'
  }
  return errs
}

export default function FormWizard() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', address: '', cardNumber: '', expiry: '', cvv: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [, startTransition] = useTransition()

  function updateField(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function nextStep() {
    const errs = validateStep(step, formData)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    startTransition(() => setStep((s) => Math.min(s + 1, 2)))
  }

  function prevStep() {
    startTransition(() => setStep((s) => Math.max(s - 1, 0)))
  }

  const [submitState, submitAction, isSubmitting] = useActionState(async () => {
    await delay(1500)
    return { success: true }
  }, null)

  if (submitState?.success) {
    return (
      <div className="page">
        <FormSteps currentStep={2} totalSteps={3} />
        <div className="island formwizard-submitted-text">
          <h2 className="formwizard-success-heading">Submitted!</h2>
          <pre className="formwizard-submitted-json">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <FormSteps currentStep={step} totalSteps={3} />

      {step === 0 && (
        <PersonalForm
          data={formData}
          errors={errors}
          onChange={updateField}
          onNext={nextStep}
        />
      )}

      {step === 1 && (
        <CreditCardForm
          data={formData}
          errors={errors}
          onChange={updateField}
          onBack={prevStep}
          onNext={nextStep}
        />
      )}

      {step === 2 && (
        <div className="island">
          <h3>Review & Confirm</h3>
          <div className="formwizard-review-section">
            {Object.entries(formData).map(([key, val]) => (
              <div key={key} className="formwizard-review-row">
                <span className="formwizard-review-key">{key}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
          <div className="formwizard-review-actions">
            <Button action={prevStep} text="Back" />
            <form action={submitAction}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="formwizard-submit-btn"
              >
                {isSubmitting ? 'Sending...' : 'Confirm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
