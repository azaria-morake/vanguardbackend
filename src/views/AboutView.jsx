import React from 'react';
import { motion } from 'framer-motion';
import ConsultButton from '../components/ConsultButton.jsx';
import { useSettings } from '../context/SettingsContext';

const AboutView = ({ onNavigate, onContact }) => {
  const { settings } = useSettings();
  const aboutPage = settings.pages?.about || {
    hero: {
      title: "Practical legal support built for SMEs",
      desc1: "Vanguard Legal exists to provide SMEs with clear, practical legal and compliance support that makes business sense.",
      desc2: "We work closely with business owners to simplify complex legal requirements, manage risk and support confident decision-making as they grow.",
      image: "/christina-wocintechchat-com-m-rg1y72eKw6o-unsplash.jpg"
    },
    experience: {
      title: "Experience you can rely on",
      desc: "With over a decade of experience advising businesses across multiple industries, we provide legal and compliance guidance that is practical, clear and commercially focused."
    },
    approach: {
      title: "Our approach",
      bullets: ['Practical, not theoretical', 'Proactive, not reactive', 'Clear and commercially focused'],
      footerNote: "We focus on helping businesses get things right from the start — avoiding costly issues later."
    },
    cta: {
      title: "Work with a legal partner who understands your business",
      image: "/vitaly-gariev-h-v8A2ng0Oc-unsplash.jpg"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh' }}
    >
      {/* Hero-style Section */}
      <section className="hero-section-fix" style={{ position: 'relative', display: 'flex', background: 'white' }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', minHeight: '60vh' }}>

          <div className="hero-content" style={{ zIndex: 10, padding: '2rem 0 4rem 0' }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="responsive-title"
              style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.1 }}
            >
              {aboutPage.hero?.title}
            </motion.h1>

            <div className="hero-body-content">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '1.5rem', lineHeight: 1.6 }}
              >
                {aboutPage.hero?.desc1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontSize: '1.15rem', color: 'var(--color-text)', lineHeight: 1.6 }}
              >
                {aboutPage.hero?.desc2}
              </motion.p>
            </div>
          </div>

          {/* Right Hero Image matching Home Hero Fade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-image-container"
            style={{
              height: '100%',
              position: 'absolute',
              right: 0,
              top: 0,
              width: '45%',
              backgroundImage: `url(${aboutPage.hero?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottomLeftRadius: '100px'
            }}
          >
            {/* Fade into white left side to blend perfectly */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0) 30%)' }}></div>
          </motion.div>

        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-bg)', paddingBottom: 0 }}>
        <div className="container">
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flat-card"
              style={{ padding: '3rem' }}
            >
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{aboutPage.experience?.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                {aboutPage.experience?.desc}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flat-card"
              style={{ padding: '3rem' }}
            >
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{aboutPage.approach?.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {aboutPage.approach?.bullets?.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: 'var(--color-text)' }}>
                    <span style={{ color: 'var(--color-secondary)' }}>✔</span> {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 500, fontStyle: 'italic' }}>
                {aboutPage.approach?.footerNote}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Full-width CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="about-cta-container"
          style={{
            marginTop: '5rem',
            background: 'var(--color-primary)',
            position: 'relative',
            overflow: 'visible', // Changed to visible
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Background Clipping Container */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* Desktop Image - Fixed width to prevent overlap */}
            <div className="about-cta-image-container hide-on-mobile" style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '40%',
              height: '100%',
              backgroundImage: `url(${aboutPage.cta?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0) 60%, var(--color-primary) 100%)' }}></div>
            </div>

            {/* Mobile Image - Full width top background */}
            <div className="about-cta-image-container show-on-mobile" style={{
              position: 'relative',
              width: '100%',
              height: '250px',
              backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.85)), url(${aboutPage.cta?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-primary) 0%, rgba(15,23,42,0) 50%)' }}></div>
            </div>
          </div>

          {/* Content properly aligned to the grid container */}
          <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem' }}>
              <div className="hide-on-mobile"></div> {/* Leaves left empty */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '4rem var(--spacing-6)' }}>
                <h3 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  {aboutPage.cta?.title}
                </h3>
                <div className="hero-cta-group">
                  <ConsultButton onSelectContact={onContact} className="btn btn-teal" direction="up">
                    Book a consultation
                  </ConsultButton>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </section>
    </motion.div>
  );
};

export default AboutView;
