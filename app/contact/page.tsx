import ContactForm from '../components/contact-form';
import Button from '../components/button-component';
import PageTitle from 'app/components/page-title';

export default function ContactPage() {
  return (
    <section>
      <PageTitle>Contact</PageTitle>
      {/* Contact Form Section */}
      <div className="mb-48">
        <ContactForm />
      </div>

      {/* Calendly Section */}
      <div className="text-center mb-32">
        <h2 className="text-3xl font-bold text-text-primary mb-16">Let's hop on a call</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Got something exciting and want to meet about it?
          <br />
          Schedule a time on my calendar for a free 30 minute consultation.
        </p>

        <Button url="https://calendly.com/weston-limi/30min" color="primary" size="lg">
          Schedule a Call
        </Button>
      </div>
    </section>
  );
}
