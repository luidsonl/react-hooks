import { useId } from 'react'
import Button from '../shared/Button'

type PaymentData = {
  cardNumber: string
  expiry: string
  cvv: string
}

type Errors = Partial<Record<keyof PaymentData, string>>

type Props = {
  data: PaymentData
  errors: Errors
  onChange: (field: keyof PaymentData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  onNext: () => void
}

export default function CreditCardForm({ data, errors, onChange, onBack, onNext }: Props) {
  const cardId = useId()
  const expiryId = useId()
  const cvvId = useId()

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '')
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 6)
    e.target.value = val
    onChange('expiry')(e)
  }

  const textFields: { id: string; label: string; field: keyof PaymentData; placeholder: string }[] = [
    { id: cardId, label: 'Card Number', field: 'cardNumber', placeholder: '0000 0000 0000 0000' },
    { id: cvvId, label: 'CVV', field: 'cvv', placeholder: '123' },
  ]

  return (
    <div className="island">
      <h3>Payment Information</h3>
      <div className="formwizard-field-group">
        {textFields.map(({ id, label, field, placeholder }) => (
          <div key={field}>
            <label htmlFor={id} className="formwizard-label">
              {label}
            </label>
            <input
              id={id}
              type="text"
              value={data[field]}
              onChange={onChange(field)}
              onKeyDown={(e) => e.key === 'Enter' && onNext()}
              placeholder={placeholder}
              className={errors[field] ? 'formwizard-input--error' : ''}
            />
            {errors[field] && (
              <span className="formwizard-error-text">{errors[field]}</span>
            )}
          </div>
        ))}

        <div key="expiry">
          <label htmlFor={expiryId} className="formwizard-label">
            Expiry
          </label>
          <input
            id={expiryId}
            type="text"
            value={data.expiry}
            onChange={handleExpiry}
            onKeyDown={(e) => e.key === 'Enter' && onNext()}
            placeholder="MM/YY or MM/YYYY"
            className={errors.expiry ? 'formwizard-input--error' : ''}
          />
          {errors.expiry && (
            <span className="formwizard-error-text">{errors.expiry}</span>
          )}
        </div>
      </div>
      <div className="formwizard-nav-buttons">
        <Button action={onBack} text="Back" />
        <Button action={onNext} text="Next" />
      </div>
    </div>
  )
}
