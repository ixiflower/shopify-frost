import {Link} from 'react-router';
import type {Route} from './+types/pages.contact';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Contact Us — ecode Shop'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const contactPage = await context.storefront
    .query(CONTACT_PAGE_QUERY)
    .catch(() => null);

  return {
    content: contactPage?.page?.body ?? null,
    title: contactPage?.page?.title ?? 'Contact Us',
  };
}

export default function ContactPage() {
  return (
    <div className="contact">
      <ContactHero />
      <ContactCards />
      <ContactFormSection />
      <ContactFAQ />
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────── */

function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="contact-hero-blob contact-hero-blob--1" />
      <div className="contact-hero-blob contact-hero-blob--2" />
      <div className="contact-hero-blob contact-hero-blob--3" />
      <div className="contact-hero-blob contact-hero-blob--4" />
      <span className="contact-hero-tag">Contact</span>
      <h1 className="contact-hero-heading">
        We'd love to<br />
        <span className="contact-hero-accent">hear from you</span>
      </h1>
      <p className="contact-hero-desc">
        Whether you have a question about our products, pricing, or anything
        else — our team is ready to answer all your questions.
      </p>
    </section>
  );
}

/* ─── Info Cards ──────────────────────────────────────────────── */

function ContactCards() {
  return (
    <section className="contact-cards-wrap">
      <div className="contact-cards-blob contact-cards-blob--a" />
      <div className="contact-cards-blob contact-cards-blob--b" />
      <div className="contact-cards-blob contact-cards-blob--c" />
      <div className="contact-cards">
        <div className="contact-card">
        <div className="contact-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h3>Visit Our Store</h3>
        <p>123 Design District<br />San Francisco, CA 94107</p>
        <Link to="#" className="contact-card-link">Get directions →</Link>
      </div>

      <div className="contact-card">
        <div className="contact-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h3>Email Us</h3>
        <p>hello@ecodeshop.com<br />support@ecodeshop.com</p>
        <Link to="#" className="contact-card-link">Send an email →</Link>
      </div>

      <div className="contact-card">
        <div className="contact-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <h3>Call Us</h3>
        <p>+1 (555) 234-5678<br />Mon–Fri 9am–6pm PST</p>
        <Link to="#" className="contact-card-link">Schedule a call →</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Form ────────────────────────────────────────────────────── */

function ContactFormSection() {
  return (
    <section className="contact-form-section">
      <div className="contact-form-wrap">
        <div className="contact-form-header">
          <h2 className="contact-form-title">Send us a message</h2>
          <p className="contact-form-subtitle">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>
        <form className="contact-form-fields" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-field-row">
            <div className="contact-field">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Alex Johnson" required />
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="alex@example.com" required />
            </div>
          </div>
          <div className="contact-field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" type="text" placeholder="How can we help?" required />
          </div>
          <div className="contact-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={5} placeholder="Tell us about your inquiry..." required />
          </div>
          <button type="submit" className="contact-submit">
            <span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────── */

function ContactFAQ() {
  const faqs = [
    {
      q: 'What are your shipping times?',
      a: 'Standard shipping takes 5–7 business days within the US. Express delivery is 2–3 business days. International shipping varies by destination — typically 7–14 days.',
    },
    {
      q: "What's your return policy?",
      a: 'We offer free returns within 30 days of purchase. Items must be unworn and in original condition with all tags attached. Refunds are processed within 5 business days.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship to over 50 countries worldwide. Shipping costs are calculated at checkout based on your location and order size.',
    },
    {
      q: 'How can I track my order?',
      a: "Once your order ships, you'll receive a tracking number via email. You can also view your order status anytime in your account dashboard.",
    },
    {
      q: 'Can I modify or cancel my order?',
      a: 'Orders can be modified or cancelled within 1 hour of placement. After that, we process orders quickly and cannot guarantee changes. Contact support immediately.',
    },
  ];

  return (
    <section className="contact-faq-section">
      <h2 className="contact-faq-heading">Frequently Asked Questions</h2>
      <div className="contact-faq-list">
        {faqs.map((faq) => (
          <details key={faq.q} className="contact-faq-item">
            <summary className="contact-faq-question">
              <span>{faq.q}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </summary>
            <p className="contact-faq-answer">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage($language: LanguageCode, $country: CountryCode)
    @inContext(language: $language, country: $country) {
    page(handle: "contact") {
      handle
      id
      title
      body
    }
  }
` as const;
