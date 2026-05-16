import React from 'react';
import { motion } from 'framer-motion';
import ConsultButton from './ConsultButton.jsx';
import { useSettings } from '../context/SettingsContext';

const FinalCTA = ({ onNavigate, onContact }) => {
  const { settings } = useSettings();
  const ctaData = settings.pages?.home?.cta || {
    title: "Avoid costly legal mistakes as your business grows"
  };

  return (
    <section className="section-padding" style={{
      background: 'var(--color-primary)',
      color: 'white',
      backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.85)), url(/hero.jpg)', /* Reusing hero image for background as proxy */
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAlign: 'center',
      paddingBottom: 0
    }}>
      <div className="container" style={{ padding: '4rem var(--spacing-6)' }}>
        {/* <div style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>Final CTA</div> */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cta-title"
          style={{ fontSize: '2.5rem', marginBottom: '2.5rem', color: 'white', maxWidth: '700px', margin: '0 auto 2.5rem' }}
        >
          {ctaData.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="hero-cta-group"
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <ConsultButton onSelectContact={onContact} className="btn btn-teal" direction="up">
            Book a Consultation
          </ConsultButton>
          <button onClick={() => onContact('whatsapp')} className="btn btn-teal-outline" style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
            Chat on WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
