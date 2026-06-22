# Multi-step Form Wizard

**Hooks:** `useState` `useActionState` `useTransition` `useId`

**Files:**
- `src/pages/FormWizard.tsx` — step management, validation, submission
- `src/components/form-wizard/PersonalForm.tsx` — shipping info form
- `src/components/form-wizard/CreditCardForm.tsx` — payment info form

---

## `useState`

Step index, form data, validation errors.

`src/pages/FormWizard.tsx:31-35`
```tsx
const [step, setStep] = useState(0)
const [formData, setFormData] = useState<FormData>({
  name: '', email: '', address: '', cardNumber: '', expiry: '', cvv: '',
})
const [errors, setErrors] = useState<Errors>({})
```
`step` tracks which of the 3 stages is active (0 = personal, 1 = payment, 2 = review). `formData` accumulates all fields. `errors` holds per-field validation messages.

---

## `useActionState`

Async form submission.

`src/pages/FormWizard.tsx:56-59`
```tsx
const [submitState, submitAction, isSubmitting] = useActionState(async () => {
  await delay(1500)
  return { success: true }
}, null)
```
`submitAction` is passed to a `<form>` element at line 111. While the 1.5s simulated request runs, `isSubmitting` is `true`, disabling the button and showing "Sending..." (lines 113-117). On success, `submitState.success` triggers the confirmation screen (lines 61-72).

---

## `useTransition`

Smooth step transitions.

`src/pages/FormWizard.tsx:36`
```tsx
const [, startTransition] = useTransition()
```
Used in `nextStep` (line 49) and `prevStep` (line 53) to defer step-index updates:
```tsx
function nextStep() {
  const errs = validateStep(step, formData)
  setErrors(errs)
  if (Object.keys(errs).length > 0) return
  startTransition(() => setStep((s) => Math.min(s + 1, 2)))
}
```

---

## `useId`

Accessible label-input associations.

`src/components/form-wizard/PersonalForm.tsx:20-22`
```tsx
const nameId = useId()
const emailId = useId()
const addressId = useId()
```

`src/components/form-wizard/CreditCardForm.tsx:21-23`
```tsx
const cardId = useId()
const expiryId = useId()
const cvvId = useId()
```
Each `useId()` generates a unique, hydration-safe ID used in `htmlFor` on labels (e.g., line 36: `<label htmlFor={id}>`) matched by `id={id}` on the corresponding `<input>`.
