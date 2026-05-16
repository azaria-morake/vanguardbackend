import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const AboutSection = () => {
  const { settings } = useSettings();
  const aboutData = settings.pages?.home?.about || {
    tagline: "About Vanguard Legal",
    title: "Practical legal expertise for growing businesses",
    desc: "Vanguard Legal provides clear, business-focused legal and compliance support for SMEs. We don’t just quote the law — we help you apply it commercially so you can manage legal risk, stay compliant, strengthen contracts, and make confident business decisions.",
    bullets: [
      "Practical compliance solutions without bureaucracy",
      "Contracts that protect you but don't kill the deal",
      "Risk mitigation integrated into your workflow"
    ],
    image: "/black-financial-consultant-explaining-deal-details.jpg"
  };

  return (
    <section className="about-section" style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--color-primary)',
      color: 'white',
      overflow: 'hidden',
      minHeight: '70vh'
    }}>

      {/* Left Image Full Bleed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="about-image-container"
        style={{
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          backgroundImage: `url(${aboutData.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomRightRadius: '100px'
        }}
      >
        {/* Gradient fading to the right side so it blends into the blue background */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, var(--color-primary) 0%, rgba(15,23,42,0) 30%)' }} className="hide-on-mobile"></div>
      </motion.div>

      <div className="container about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'center' }}>

        {/* Empty left column to push content to the right */}
        <div className="hide-on-mobile"></div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="about-content"
          style={{ zIndex: 10, padding: '6rem 0' }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--color-secondary-light)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {aboutData.tagline}
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white', lineHeight: 1.1 }}>
            {aboutData.title}
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#cbd5e1', lineHeight: 1.7 }}>
            {aboutData.desc}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            {aboutData.bullets?.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem', color: '#f8fafc' }}>
                <div style={{
                  background: 'var(--color-secondary)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  ✔
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>


      </div>
    </section>
  );
};

export default AboutSection;
