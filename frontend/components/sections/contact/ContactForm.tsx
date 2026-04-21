'use client'

import { useState, useRef } from 'react'
import type { AxiosError } from 'axios'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MessageSquare, User, CheckCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { Section }   from '@/components/ui/Section'
import { Card }      from '@/components/ui/Card'
import { Button }    from '@/components/ui/Button'
import { cn }        from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { staggerContainer, fadeInLeft, fadeInRight } from '@/lib/animations'
import { toast } from '@/store'
import axiosClient from '@/lib/api/client'

interface FormData {
  name:    string
  email:   string
  subject: string
  message: string
}

interface FormErrors {
  name?:    string
  email?:   string
  message?: string
}

interface ContactErrorResponse {
  error?: string
}

// ========================
// VALIDATION
// Runs in the BROWSER before sending to backend.
// Fast feedback for the user.
// ========================
function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required'
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}

// API call function
async function submitContactForm(data: FormData) {
  const response = await axiosClient.post('/api/contact', data)
  return response.data
}

export function ContactForm() {
  const ref     = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', subject: '', message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSuccess, setIsSuccess] = useState(false)

  // useMutation handles the POST request
  const mutation = useMutation({
    mutationFn: submitContactForm,

    onSuccess: () => {
      toast.success(
        'Message sent!',
        'I will reply within 24 hours.'
      )
      setIsSuccess(true)
    },

    onError: (error: AxiosError<ContactErrorResponse>) => {
      const message = error.response?.data?.error || 'Something went wrong'
      toast.error('Failed to send', message)
    },
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit() {
    // Run client-side validation first
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors', 'Check the form fields.')
      return
    }

    // All good — send to backend
    mutation.mutate(formData)
  }

  function handleReset() {
    setIsSuccess(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    mutation.reset()
  }

  return (
    <Section>
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12"
        >

          {/* ---- LEFT: Contact info ---- */}
          <motion.div variants={fadeInLeft} className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Get in touch</h2>
              <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                Fill in the form and I will get back to you within 24 hours.
                You will also receive a confirmation email.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon:  <Mail className="h-4 w-4" />,
                  label: 'Email',
                  value: SITE_CONFIG.email,
                  href:  `mailto:${SITE_CONFIG.email}`,
                  color: 'violet' as const,
                },
                {
                  icon:  <MessageSquare className="h-4 w-4" />,
                  label: 'Response time',
                  value: 'Within 24 hours',
                  href:  null,
                  color: 'blue' as const,
                },
              ].map((method) => (
                <Card key={method.label} variant="glass" padding="sm">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                      method.color === 'violet'
                        ? 'bg-[hsl(var(--violet)/0.1)] text-[hsl(var(--violet))] border border-[hsl(var(--violet)/0.2)]'
                        : 'bg-[hsl(var(--blue)/0.1)]   text-[hsl(var(--blue))]   border border-[hsl(var(--blue)/0.2)]',
                    )}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(var(--text-muted))]">
                        {method.label}
                      </p>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="text-sm font-medium hover:text-[hsl(var(--violet))] transition-colors"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{method.value}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <p className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-widest mb-3">
                Or find me on
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'GitHub',   href: SITE_CONFIG.github },
                  { label: 'LinkedIn', href: SITE_CONFIG.linkedin },
                  { label: 'Twitter',  href: SITE_CONFIG.twitter },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium',
                      'glass border border-[hsl(var(--border-default))]',
                      'text-[hsl(var(--text-secondary))]',
                      'hover:text-[hsl(var(--violet))]',
                      'hover:border-[hsl(var(--violet)/0.3)]',
                      'transition-all duration-200',
                    )}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---- RIGHT: Form ---- */}
          <motion.div variants={fadeInRight} className="lg:col-span-3">
            <Card variant="default" padding="lg">

              {/* SUCCESS STATE */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                    className={cn(
                      'h-20 w-20 rounded-full',
                      'bg-[hsl(var(--emerald)/0.1)]',
                      'border border-[hsl(var(--emerald)/0.3)]',
                      'flex items-center justify-center',
                    )}
                  >
                    <CheckCircle className="h-10 w-10 text-[hsl(var(--emerald))]" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-sm text-[hsl(var(--text-secondary))] max-w-xs leading-relaxed">
                      Thank you for reaching out. I have sent you a confirmation
                      email and will reply within 24 hours.
                    </p>
                  </div>

                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Send another message
                  </Button>
                </motion.div>

              ) : (
                /* FORM */
                <div className="space-y-5">

                  {/* Row 1 — Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Your Name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      icon={<User className="h-4 w-4" />}
                      error={errors.name}
                    />
                    <InputField
                      label="Your Email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      icon={<Mail className="h-4 w-4" />}
                      error={errors.email}
                    />
                  </div>

                  {/* Row 2 — Subject */}
                  <InputField
                    label="Subject"
                    name="subject"
                    type="text"
                    placeholder="Job opportunity, project idea, just saying hi..."
                    value={formData.subject}
                    onChange={handleChange}
                    icon={<MessageSquare className="h-4 w-4" />}
                  />

                  {/* Row 3 — Message */}
                  <div>
                    <label className="block text-xs font-medium text-[hsl(var(--text-secondary))] mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or idea..."
                      rows={5}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-[hsl(var(--bg-overlay))]',
                        'border',
                        errors.message
                          ? 'border-[hsl(var(--rose)/0.6)] focus:border-[hsl(var(--rose))]'
                          : 'border-[hsl(var(--border-default))] focus:border-[hsl(var(--violet)/0.5)]',
                        'text-sm text-[hsl(var(--text-primary))]',
                        'placeholder:text-[hsl(var(--text-muted))]',
                        'focus:outline-none focus:shadow-[0_0_0_3px_hsl(var(--violet)/0.1)]',
                        'transition-all duration-200 resize-none',
                      )}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-[hsl(var(--rose))]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Character count */}
                  <p className="text-xs text-[hsl(var(--text-muted))] text-right">
                    {formData.message.length} / 5000
                  </p>

                  {/* Submit */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={mutation.isPending}
                    rightIcon={<Send className="h-4 w-4" />}
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-center text-xs text-[hsl(var(--text-muted))]">
                    You will receive a confirmation email after sending.
                  </p>
                </div>
              )}

            </Card>
          </motion.div>

        </motion.div>
      </div>
    </Section>
  )
}

// ========================
// INPUT FIELD COMPONENT
// Now with error support
// ========================
function InputField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
}: {
  label:       string
  name:        string
  type:        string
  placeholder: string
  value:       string
  onChange:    (e: React.ChangeEvent<HTMLInputElement>) => void
  icon:        React.ReactNode
  error?:      string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[hsl(var(--text-secondary))] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-4 py-3 rounded-lg',
            'bg-[hsl(var(--bg-overlay))]',
            'border',
            error
              ? 'border-[hsl(var(--rose)/0.6)] focus:border-[hsl(var(--rose))]'
              : 'border-[hsl(var(--border-default))] focus:border-[hsl(var(--violet)/0.5)]',
            'text-sm text-[hsl(var(--text-primary))]',
            'placeholder:text-[hsl(var(--text-muted))]',
            'focus:outline-none focus:shadow-[0_0_0_3px_hsl(var(--violet)/0.1)]',
            'transition-all duration-200',
          )}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-[hsl(var(--rose))]">
          {error}
        </p>
      )}
    </div>
  )
}
// AIzaSyDak8zwef_Z6IqIH-AKC-igxztx08fnVYI
