import { useId } from 'react'
import Button from '../shared/Button'

type ShippingData = {
  name: string
  email: string
  address: string
}

type Errors = Partial<Record<keyof ShippingData, string>>

type Props = {
  data: ShippingData
  errors: Errors
  onChange: (field: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onNext: () => void
}

export default function PersonalForm({ data, errors, onChange, onNext }: Props) {
  const nameId = useId()
  const emailId = useId()
  const addressId = useId()

  const fields: { id: string; label: string; field: keyof ShippingData; type: string }[] = [
    { id: nameId, label: 'Name', field: 'name', type: 'text' },
    { id: emailId, label: 'Email', field: 'email', type: 'email' },
    { id: addressId, label: 'Address', field: 'address', type: 'text' },
  ]

  return (
    <div className="island">
      <h3>Personal Information</h3>
      <div className="formwizard-field-group">
        {fields.map(({ id, label, field, type }) => (
          <div key={field}>
            <label htmlFor={id} className="formwizard-label">
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={data[field]}
              onChange={onChange(field)}
              onKeyDown={(e) => e.key === 'Enter' && onNext()}
              className={errors[field] ? 'formwizard-input--error' : ''}
            />
            {errors[field] && (
              <span className="formwizard-error-text">{errors[field]}</span>
            )}
          </div>
        ))}
      </div>
      <div className="formwizard-actions-right">
        <Button action={onNext} text="Next" />
      </div>
    </div>
  )
}
