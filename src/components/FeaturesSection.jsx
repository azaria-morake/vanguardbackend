import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Gavel, Calendar, BarChart2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const getIcon = (title) => {
  switch (title?.toLowerCase()) {
    case 'contracts': return FileText;
    case 'compliance': return Gavel;
    case 'advisory': return Calendar;
    case 'strategy': return BarChart2;
    default: return FileText;
  }
};

const HelpCard = ({ icon: Icon, title, desc, delay, isMobile }) => (
  <motion.div
    // Neutralize scaling animations on mobile for a clean swipe
    initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
    whileInView={isMobile ? undefined : { opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay: isMobile ? 0 : delay }}
    className={isMobile ? "mobile-square-card" : ""}
    style={
      !isMobile
        ? {
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
          minHeight: '200px',
          justifyContent: 'center',
          background: 'white',
          border: '1px solid var(--color-secondary)',
          borderRadius: '16px'
        }
        : { margin: '0 auto' } // Forces separation in the wrapper
    }
  >
    <div style={{
      background: 'rgba(13, 148, 136, 0.1)',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem',
      flexShrink: 0
    }}>
      <Icon size={28} color="var(--color-secondary)" />
    </div>
    <div>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
  </motion.div>
);

const FeaturesSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);
  const { settings } = useSettings();

  const featuresData = settings.pages?.home?.features || {
    title: "How We Help",
    cards: [
      { title: 'Contracts', desc: 'Clear, enforceable agreements that reduce disputes and risk.' },
      { title: 'Compliance', desc: 'Stay on top of legal obligations without complexity.' },
      { title: 'Advisory', desc: 'Practical guidance when you need it most.' },
      { title: 'Strategy', desc: 'Helping you make decisions, not just interpret the law.' }
    ],
    whyTitle: "Why SMEs Choose Us",
    whySubtitle: "Built for business owners",
    reasons: [
      'Fixed-fee pricing — no unexpected costs',
      'Clear, practical advice without jargon',
      'Fast turnaround times',
      'Direct access to experienced legal support',
      'Solutions aligned with how SMEs actually operate'
    ]
  };

  const cardsWithIcons = featuresData.cards?.map(c => ({
    ...c,
    icon: getIcon(c.title)
  })) || [];

  const handleScroll = () => {
    if (!scrollRef.current) return;

    // Calculate which card is currently in view
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

        {/* =========================================
            DESKTOP LAYOUT 
            (Hidden on mobile via 'hide-on-mobile' class)
            ========================================= */}
        <div className="responsive-grid hide-on-mobile" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', gap: '4rem', alignItems: 'stretch' }}>

          {/* Left Column: How We Help (Square Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2.5rem' }}>{featuresData.title}</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              alignContent: 'start',
              flexGrow: 1
            }}>
              {cardsWithIcons.map((card, idx) => (
                <HelpCard key={idx} {...card} delay={0.1 * idx} />
              ))}
            </div>
          </div>

          {/* Full Height Center Separator */}
          <div style={{ width: '1px', background: 'var(--color-secondary)', height: '100%', opacity: 0.5 }}></div>

          {/* Right Column: Why Choose Us (Inside Bordered Card) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2.5rem' }}>{featuresData.whyTitle}</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'white',
                border: '1px solid var(--color-secondary)',
                borderRadius: '16px',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexGrow: 1
              }}
            >
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '2.5rem', lineHeight: 1.2 }}>
                {featuresData.whySubtitle}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {featuresData.reasons?.map((reason, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      flexShrink: 0
                    }}>
                      <span style={{ color: 'var(--color-secondary)' }}>✔</span>
                    </div>
                    <span style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 500 }}>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* =========================================
            MOBILE LAYOUT 
            ========================================= */}
        <div className="mobile-only-layout" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>{featuresData.title}</h2>

          {/* Swipeable Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="mobile-features-carousel"
          >
            {cardsWithIcons.map((card, idx) => (
              <div key={idx} className="mobile-square-card-wrapper">
                <HelpCard {...card} isMobile={true} delay={0} />
              </div>
            ))}
          </div>

          {/* Centered Pulsating Dots */}
          <div className="mobile-carousel-dots">
            {cardsWithIcons.map((_, idx) => (
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

          {/* Static Section below carousel */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>{featuresData.whyTitle}</h2>
            <div style={{ background: 'white', border: '1px solid var(--color-secondary)', borderRadius: '16px', padding: '2rem 1.5rem' }}>
              {featuresData.reasons?.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ color: 'var(--color-secondary)', flexShrink: 0 }}>✔</div>
                  <span style={{ fontSize: '1rem', color: 'var(--color-text)' }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;