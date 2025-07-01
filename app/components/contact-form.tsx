'use client';

import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Button from './button-component';
import Label from './label';
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
          <div>
            <Label htmlFor="from_name" required>
              Name
            </Label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <Label htmlFor="email" required>
              Email
            </Label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject" required>
            Subject
          </Label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
            placeholder="What are we talking about here?"
          />
        </div>

        <div>
          <Label htmlFor="message" required>
            Questions & Ideas
          </Label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border-none border-border-subtle rounded-lg bg-background-base text-text-primary placeholder-text-tertiary placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors resize-vertical"
            placeholder="Tell me about your project, ask a question, or share your ideas..."
          />
        </div>

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
