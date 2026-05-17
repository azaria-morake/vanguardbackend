import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConsultButton from '../components/ConsultButton.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { useSettings } from '../context/SettingsContext.jsx';

const ServiceCategory = ({ title, desc, includes, delay, isMobile }) => (
  <motion.div
    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: isMobile ? 0 : delay }}
    className="flat-card"
    style={{
      padding: '2.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      width: isMobile ? '95%' : '345px',
      margin: isMobile ? '0 auto' : '0 0.75rem',
      boxSizing: 'border-box',
      flexShrink: 0,
      height: '100%',
      minHeight: isMobile ? '380px' : '450px'
    }}
  >
    <div style={{ minHeight: '125px', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>{title}</h3>
      <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{desc}</p>
    </div>
    <div style={{ marginTop: 'auto' }}>
      <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Includes:</div>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {includes.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-secondary)', flexShrink: 0 }}></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const ServicesView = ({ onNavigate, onContact, isMobile }) => {
  const { settings } = useSettings();
  const pageData = settings?.pages?.services || {
    hero: {
      title: "Legal support for every stage of your business",
      desc: "Clear, practical legal and compliance support designed for SMEs.",
      image: "/services.png"
    },
    cta: {
      title: "Clear and transparent pricing",
      bullets: ["Fixed-fee services where possible", "Upfront pricing clarity", "No unnecessary hourly billing"],
      subtitle: "Not sure where to start? We'll guide you.",
      image: "/dimitri-karastelev-ZH4FUYiaczY-unsplash.jpg"
    }
  };

  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (querySnapshot) => {
      const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (servicesData.length > 0) {
        setServices(servicesData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to services:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) return;

    const progress = scrollLeft / maxScroll;
    const newIndex = Math.round(progress * (services.length - 1));

    if (newIndex !== activeIdx && newIndex >= 0 && newIndex < services.length) {
      setActiveIdx(newIndex);
    }
  };

  const scrollCarousel = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.6;

    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'white',
    border: '1px solid var(--color-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    zIndex: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh' }}
    >
      <section className="hero-section-fix" style={{ position: 'relative', display: 'flex', background: 'var(--color-primary-dark)', overflow: 'hidden' }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', minHeight: '40vh', padding: '0 0 4rem 0' }}>
          <div className="hero-content" style={{ zIndex: 10, textAlign: 'left', color: 'white', paddingTop: '2rem' }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '3rem', marginBottom: '1rem', marginTop: '0rem', color: 'white' }}
            >
              {pageData.hero?.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '1.25rem', opacity: 0.9 }}
            >
              {pageData.hero?.desc}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-image-container"
            style={{
              position: 'absolute', right: 0, top: 0, height: '100%', width: '45%',
              backgroundImage: `url(${pageData.hero?.image})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              borderBottomLeftRadius: '60px'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--color-primary-dark) 0%, rgba(15,23,42,0) 25%)' }}></div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--color-bg)', paddingBottom: 0 }}>
        <div className="container">
          <div style={{ width: '100%', marginBottom: '5rem' }}>
            <div style={{ position: 'relative' }}>
              {!isMobile && (
                <>
                  <button
                    onClick={() => scrollCarousel('left')}
                    style={{ ...arrowButtonStyle, left: '-40px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-secondary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    style={{ ...arrowButtonStyle, right: '-40px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-secondary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="mobile-features-carousel"
                style={{
                  padding: '1rem 0',
                  gap: '0',
                  alignItems: 'stretch',
                  justifyContent: isMobile ? 'flex-start' : 'center',
                  display: 'flex'
                }}
              >
                {services.map((svc, i) => (
                  <div key={i} className={isMobile ? "mobile-square-card-wrapper" : ""} style={!isMobile ? { flex: '0 0 auto', scrollSnapAlign: 'center', display: 'flex' } : { display: 'flex' }}>
                    <ServiceCategory {...svc} isMobile={isMobile} delay={0} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mobile-carousel-dots" style={{ marginTop: '5rem', paddingBottom: '3rem' }}>
              {services.map((_, idx) => (
                <div
                  key={idx}
                  className={`mobile-dot ${activeIdx === idx ? 'active' : ''}`}
                  onClick={() => {
                    if (scrollRef.current) {
                      const { scrollWidth, clientWidth } = scrollRef.current;
                      const maxScroll = scrollWidth - clientWidth;
                      const targetScroll = (idx / (services.length - 1)) * maxScroll;

                      scrollRef.current.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="about-cta-container"
          style={{
            marginTop: '0',
            background: 'var(--color-primary)',
            position: 'relative',
            overflow: 'visible',
            minHeight: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div className="about-cta-image-container hide-on-mobile" style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '40%',
              height: '100%',
              backgroundImage: `url(${pageData.cta?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0) 60%, var(--color-primary) 100%)' }}></div>
            </div>

            <div className="about-cta-image-container show-on-mobile" style={{
              position: 'relative',
              width: '100%',
              height: '250px',
              backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.25)), url(${pageData.cta?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-primary) 0%, rgba(15,23,42,0) 50%)' }}></div>
            </div>
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem' }}>
              <div className="hide-on-mobile"></div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '4rem var(--spacing-6)' }}>
                <h3 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                  {pageData.cta?.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  {(pageData.cta?.bullets || []).map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1', fontSize: '1.15rem' }}>
                      <div style={{ background: 'var(--color-secondary)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', flexShrink: 0 }}>
                        ✔
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#cbd5e1' }}>{pageData.cta?.subtitle}</div>
                <div className="hero-cta-group">
                  <ConsultButton onSelectContact={onContact} className="btn btn-teal" direction="up" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
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

export default ServicesView;