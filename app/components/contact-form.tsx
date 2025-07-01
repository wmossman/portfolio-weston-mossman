'use client';

import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Button from './button-component';
import FormInput from './form-input';
import FormTextarea from './form-textarea';
import { isMobileDevice } from './utils';

interface ContactFormData {
  from_name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    from_name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onHCaptchaChange = (token: string) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate captcha
    if (!captchaToken) {
      setError('Please complete the captcha verification.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create custom subject with user's input
      const customSubject = `Portfolio Form - ${formData.subject}`;

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          from_name: formData.from_name,
          email: formData.email,
          message: formData.message,
          subject: customSubject,
          'h-captcha-response': captchaToken,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({ from_name: '', email: '', subject: '', message: '' });
        setCaptchaToken('');
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-background-content rounded-lg border-none border-border-subtle">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Message Sent!</h3>
          <p className="text-text-secondary mb-6">
            Thanks for reaching out!
            <br />
            I'll get back to you as soon as possible.
            <br />
            Unless I'm on vacation.
            <br />
            Which then I'll get back to you when I accidentally check my email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Get In Touch</h2>
        <p className="text-text-secondary">
          Got questions or ideas? I'd love to hear from you.
          <br />
          Send me a message and I'll respond as soon as possible.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8 bg-background-content rounded-lg border-none border-border-subtle"
      >
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            id="from_name"
            name="from_name"
            type="text"
            value={formData.from_name}
            onChange={handleChange}
            label="Name"
            placeholder="Your name"
            required
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <FormInput
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          label="Subject"
          placeholder="What are we talking about here?"
          required
        />

        <FormTextarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          label="Questions & Ideas"
          placeholder="Tell me about your project, ask a question, or share your ideas..."
          required
          rows={6}
        />

        <div className="flex justify-center">
          <HCaptcha
            theme={'dark'}
            size={isMobileDevice() ? 'compact' : 'normal'}
            sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
            onVerify={onHCaptchaChange}
            reCaptchaCompat={false}
          />
        </div>

        <div className="text-center">
          <Button type="submit" disabled={isSubmitting} color="primary" size="lg">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
