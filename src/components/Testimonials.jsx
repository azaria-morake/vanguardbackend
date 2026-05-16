import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const TestimonialCard = ({ quote, author, role, delay, isMobile }) => (
  <motion.div
    // Neutralize entrance animations on mobile for a clean swipe
    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: isMobile ? 0 : delay }}
    className="flat-card"
    style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      background: 'white',
      width: isMobile ? '85%' : 'auto',
      margin: isMobile ? '0 auto' : '0', // Forces separation
      boxSizing: 'border-box',
      minHeight: isMobile ? '250px' : 'auto',
      flex: 'none'
    }}
  >
    <div style={{ color: 'var(--color-secondary)', fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '-10px' }}>"</div>
    <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1, margin: 0 }}>
      {quote}
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        {/* Placeholder Avatar */}
        <div style={{ width: '100%', height: '100%', background: 'var(--color-border)' }}></div>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>{author}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{role}</div>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);
  const { settings } = useSettings();

  const testData = settings.pages?.home?.testimonials || {
    title: "Testimonials",
    list: [
      { quote: "Vanguard Legal helped us restructure a key agreement and avoid what could have become a serious dispute. The process was clear, efficient and practical.", author: "Founder", role: "SME in logistics" },
      { quote: "We needed urgent help reviewing a supplier contract. The turnaround was quick and the advice highlighted risks we hadn't considered.", author: "Director", role: "Retail business" },
      { quote: "Clear, practical advice without the legal jargon. It's like having a legal partner who understands how businesses actually work.", author: "SME owner", role: "Consulting sector" }
    ]
  };

  const testimonials = testData.list || [];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);

    if (newIndex !== activeIdx) {
      setActiveIdx(newIndex);
    }
  };

  return (
    <section className="section-padding" style={{ background: 'var(--color-bg)' }}>
      <div className="container">

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hide-on-mobile">
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>{testData.title}</h2>
          <div className="responsive-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {testimonials.map((t, idx) => (
              <TestimonialCard key={idx} {...t} delay={0.1 * idx} />
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text)', opacity: 0.6, marginTop: '1rem' }}>
            *Client details withheld for confidentiality.
          </div>
        </div>

        {/* --- MOBILE LAYOUT --- */}
        <div className="mobile-only-layout" style={{ width: '100%' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>{testData.title}</h2>

          <div ref={scrollRef} onScroll={handleScroll} className="mobile-features-carousel">
            {testimonials.map((t, idx) => (
              <div key={idx} className="mobile-square-card-wrapper">
                <TestimonialCard {...t} isMobile={true} delay={0} />
              </div>
            ))}
          </div>

          <div className="mobile-carousel-dots">
            {testimonials.map((_, idx) => (
              <div
                key={idx}
                className={`mobile-dot ${activeIdx === idx ? 'active' : ''}`}
                onClick={() => {
                  if (scrollRef.current) {
                    const target = scrollRef.current.children[idx];
                    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text)', opacity: 0.6, marginTop: '2rem', textAlign: 'center' }}>
            *Client details withheld for confidentiality.
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;