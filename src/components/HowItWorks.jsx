import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Step = ({ num, title, delay, isMobile }) => (
  <motion.div
    // Neutralize entrance animations on mobile for a clean swipe
    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: isMobile ? 0 : delay }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'center',
      gap: '1.5rem',
      zIndex: 10,
      background: isMobile ? 'white' : 'transparent',
      border: isMobile ? '1px solid var(--color-secondary)' : 'none',
      borderRadius: isMobile ? '16px' : '0',
      padding: isMobile ? '3rem 2rem' : '0',
      width: isMobile ? '85%' : 'auto',
      margin: isMobile ? '0 auto' : '0', // Forces separation in the wrapper
      boxSizing: 'border-box',
      minHeight: isMobile ? '250px' : 'auto',
      flex: isMobile ? 'none' : 1 // Removed flex: 1 on mobile to prevent stretching
    }}
  >
    <div style={{
      width: '60px', height: '60px', borderRadius: '50%',
      background: 'var(--color-primary)', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem', fontWeight: 600,
      border: '4px solid white',
      boxShadow: isMobile ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
    }}>
      {num}
    </div>
    <div style={{ fontSize: '1.05rem', color: 'var(--color-text)', maxWidth: isMobile ? '100%' : '180px', lineHeight: 1.5, fontWeight: 500 }}>
      {title}
    </div>
  </motion.div>
);

const HowItWorks = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);
  const { settings } = useSettings();

  const howData = settings.pages?.home?.howItWorks || {
    title: "How It Works",
    steps: [
      { num: "1", title: "Book a consultation" },
      { num: "2", title: "Receive a clear plan with scope and pricing" },
      { num: "3", title: "We handle the legal side while you focus on your business" }
    ]
  };

  const steps = howData.steps || [];

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
    <section className="section-padding" style={{ background: 'white' }}>
      <div className="container">

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hide-on-mobile">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{howData.title}</h2>
          </div>

          <div className="how-steps-container" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              position: 'absolute', top: '30px', left: '15%', right: '15%', height: '1px',
              background: 'var(--color-border)', zIndex: 0
            }}></div>

            {steps.map((step, idx) => (
              <Step key={idx} {...step} delay={0.1 * (idx + 1)} />
            ))}
          </div>
        </div>

        {/* --- MOBILE LAYOUT --- */}
        <div className="mobile-only-layout" style={{ width: '100%' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>{howData.title}</h2>

          <div ref={scrollRef} onScroll={handleScroll} className="mobile-features-carousel">
            {steps.map((step, idx) => (
              <div key={idx} className="mobile-square-card-wrapper">
                <Step {...step} isMobile={true} delay={0} />
              </div>
            ))}
          </div>

          <div className="mobile-carousel-dots">
            {steps.map((_, idx) => (
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
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;