import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck } from 'lucide-react';
import ConsultButton from './ConsultButton.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const Hero = ({ onNavigate, onContact }) => {
  const { settings } = useSettings();
  const { title, subtitle, image, credibilityStrip } = settings.heros.home;

  return (
    <>
      <section className="hero-section-fix" style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        background: 'white'
      }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem' }}>

          {/* Left Text Content */}
          <div className="hero-content" style={{ zIndex: 10, padding: '2rem 0 4rem 0' }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.1 }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '2.5rem', maxWidth: '540px' }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-cta-group"
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}
            >
              <ConsultButton onSelectContact={onContact} className="btn btn-teal">
                Book a Consultation
              </ConsultButton>
              <button onClick={() => onContact('whatsapp')} className="btn btn-teal-outline">
                Chat on WhatsApp
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text)', alignItems: 'center' }}
            >
              <div><span style={{ color: 'var(--color-secondary)' }}>✔</span> Fixed-fee options available</div>
              <div style={{ color: 'var(--color-border)' }}>|</div>
              <div><span style={{ color: 'var(--color-secondary)' }}>✔</span> Fast turnaround times</div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image-container"
            style={{
              height: '100%',
              position: 'absolute',
              right: 0,
              top: 0,
              width: '45%',
              backgroundImage: `url(${image || '/hero.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottomLeftRadius: '100px'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 25%)' }}></div>
          </motion.div>

        </div>
      </section>

      {/* Credibility Strip */}
      <div style={{ background: 'var(--color-primary-dark)', padding: '1.5rem 0', color: 'white' }}>
        <div className="container credibility-strip" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem', 
          fontSize: '1.1rem', 
          fontWeight: 500,
          textAlign: 'center'
        }}>
          <ShieldCheck size={24} color="var(--color-border)" style={{ opacity: 0.8, flexShrink: 0 }} />
          <span>{credibilityStrip || 'Attorney-led legal support for SMEs across South Africa'}</span>
          <Truck size={24} color="var(--color-border)" style={{ opacity: 0.8, flexShrink: 0 }} />
        </div>
      </div>
    </>
  );
};

export default Hero;
