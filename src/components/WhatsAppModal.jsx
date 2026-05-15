import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Copy } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

const WhatsAppModal = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const [message, setMessage] = useState('');

  const handleContinue = () => {
    const encodedMessage = encodeURIComponent(message || "I would like to consult about legal services.");
    window.open(`https://wa.me/${settings.contact.phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'relative', width: '100%', maxWidth: '450px', background: 'var(--color-secondary)', color: 'white',
              borderRadius: '24px', padding: '2rem 2.5rem 2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }}>
              <MessageCircle size={20} color="white" />
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase', opacity: 0.9 }}>
              Connect
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: 1.2, fontWeight: 500, fontFamily: 'serif' }}>
              REACH OUT VIA WHATSAPP
            </h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your general inquiry here..."
              style={{
                width: '100%', height: '140px', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)',
                background: 'transparent', color: 'white', outline: 'none', resize: 'none', marginBottom: '1.5rem',
                fontSize: '1rem'
              }}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleContinue}
                style={{ flex: 1, background: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 600, border: 'none', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              >
                CONTINUE TO WHATSAPP ↗
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(message)}
                style={{ width: '56px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                title="Copy Message"
              >
                <Copy size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppModal;
