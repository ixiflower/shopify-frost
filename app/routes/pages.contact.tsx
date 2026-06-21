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
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-hero-content">
          <span className="contact-hero-badge">Get in Touch</span>
          <h1 className="contact-hero-title">Let's Build Something<br />Together</h1>
          <p className="contact-hero-subtitle">
            Have a question, a project, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
        <div className="contact-hero-orb" />
      </section>

      <section className="contact-main">
        <div className="contact-grid">
          <div className="contact-info-card">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4>Visit Us</h4>
                <p>123 Design District<br />San Francisco, CA 94107</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h4>Email</h4>
                <p>hello@ecodeshop.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 234-5678</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h4>Hours</h4>
                <p>Mon–Fri 9am–6pm PST<br />Sat 10am–4pm PST</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <h3 className="contact-form-heading">Send a Message</h3>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="name">Full Name</label>
                <input id="name" type="text" className="contact-form-input" placeholder="Alex Johnson" required />
              </div>
              <div className="contact-form-group">
                <label className="contact-form-label" htmlFor="email">Email Address</label>
                <input id="email" type="email" className="contact-form-input" placeholder="alex@example.com" required />
              </div>
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="subject">Subject</label>
              <input id="subject" type="text" className="contact-form-input" placeholder="How can we help?" required />
            </div>
            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="message">Message</label>
              <textarea id="message" className="contact-form-textarea" rows={5} placeholder="Tell us about your project or inquiry..." required />
            </div>
            <button type="submit" className="contact-form-btn">
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      <section className="contact-faq">
        <h2 className="contact-faq-title">Frequently Asked Questions</h2>
        <div className="contact-faq-grid">
          <div className="contact-faq-item">
            <h4>What are your shipping times?</h4>
            <p>Standard shipping takes 5–7 business days. Express delivery is 2–3 business days. International shipping varies by location.</p>
          </div>
          <div className="contact-faq-item">
            <h4>What's your return policy?</h4>
            <p>We offer free returns within 30 days of purchase. Items must be unworn with original tags attached.</p>
          </div>
          <div className="contact-faq-item">
            <h4>Do you ship internationally?</h4>
            <p>Yes! We ship to over 50 countries worldwide. Shipping costs are calculated at checkout.</p>
          </div>
          <div className="contact-faq-item">
            <h4>How can I track my order?</h4>
            <p>Once your order ships, you'll receive a tracking number via email. You can also check your account dashboard.</p>
          </div>
        </div>
      </section>
    </div>
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
