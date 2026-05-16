import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlignRight, X } from 'lucide-react'
import { useSettings } from './context/SettingsContext.jsx'

// Components
// ... (omitting imports)
import Hero from './components/Hero.jsx'
import AboutSection from './components/AboutSection.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import Testimonials from './components/Testimonials.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import ConsultButton from './components/ConsultButton.jsx'
import WhatsAppModal from './components/WhatsAppModal.jsx'
import EmailModal from './components/EmailModal.jsx'
import LegalModal from './components/LegalModal.jsx'

// Views
import AboutView from './views/AboutView.jsx'
import ServicesView from './views/ServicesView.jsx'
import ContactView from './views/ContactView.jsx'
import InsightsView, { ArticleModal } from './views/InsightsView.jsx'
import AdminDashboard from './views/admin/AdminDashboard.jsx'

function App() {
  const { settings } = useSettings();
// ... (omitting App body)
  // Initialize from hash or default to home
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [contactModal, setContactModal] = useState(null) // null, 'whatsapp', 'email'
  const [legalModal, setLegalModal] = useState(null) // null, 'privacy', 'terms'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredView, setHoveredView] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when menu, legal modal, or article modal is open
  useEffect(() => {
    if (isMenuOpen || !!legalModal || !!selectedArticle) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, legalModal, selectedArticle]);

  const navigateTo = (view) => {
    setActiveView(view);
    setIsMenuOpen(false);
    window.location.hash = view;
  };

  // Sync state with hash and handle back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeView) {
        setActiveView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
// ... (omitting return body for range)
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'white' }}>

      {/* Navigation */}
// ... (omitting header content)
      {activeView !== 'admin' && (
        <header
          className="flat-header"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 50,
          padding: '0.75rem 5%',
          background: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        {/* Dynamic Logo using PNG Mask */}
        <div
          className="vlegal-logo-responsive"
          onClick={() => navigateTo('home')}
          style={{ backgroundColor: 'var(--color-primary)' }}
        />


        {/* Nav & Buttons Container */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="hide-on-mobile">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                onMouseEnter={() => setHoveredView(item.id)}
                onMouseLeave={() => setHoveredView(null)}
                style={{
                  position: 'relative',
                  color: activeView === item.id ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: activeView === item.id ? 700 : 500,
                  fontSize: '0.9rem',
                  padding: '0.5rem 0',
                  transition: 'color 0.2s'
                }}
              >
                {item.label}
                {(hoveredView === item.id || (hoveredView === null && activeView === item.id)) && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--color-primary)',
                      zIndex: 1
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div style={{ borderLeft: '1px solid var(--color-border)', height: '30px' }} className="hide-on-mobile"></div>

          <div style={{ display: 'flex', gap: '0.5rem' }} className="hide-on-mobile">
            <ConsultButton
              onSelectContact={setContactModal}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Book Consultation
            </ConsultButton>
            <button
              onClick={() => setContactModal('whatsapp')}
              className="btn btn-teal"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              WhatsApp Us
            </button>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="show-on-mobile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: isMenuOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: isMenuOpen ? 'white' : 'var(--color-primary)',
              zIndex: 101,
              transition: 'all 0.3s',
              border: isMenuOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}
          >
            {isMenuOpen ? <X size={24} strokeWidth={3} /> : <AlignRight size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay & Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(2, 6, 23, 0.6)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 99
                }}
              />

              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="no-scrollbar"
                style={{
                  position: 'fixed',
                  top: '1rem',
                  right: '1rem',
                  bottom: '1rem',
                  width: 'calc(100% - 2rem)',
                  maxWidth: '380px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: isMobile ? '3rem 1.5rem 1.5rem 1.5rem' : '4rem 2rem 2rem 2rem',
                  color: 'white',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  borderRadius: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {/* Decorative background element */}
                <div style={{
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    padding: '0 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '1.25rem',
                    gap: '1rem'
                  }}>
                    <div
                      className="vlegal-logo-responsive"
                      style={{
                        backgroundColor: 'white',
                        height: '1.2rem',
                        width: '80px',
                        minWidth: '80px',
                        marginLeft: '-0.5rem',
                        opacity: 0.9
                      }}
                    />

                    {/* Social Icons moved to header */}
                    <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'center' }}>
                      {[
                        {
                          name: 'Facebook',
                          href: settings.socials.facebook,
                          src: 'https://img.icons8.com/ios-filled/50/facebook--v1.png',
                          size: '23.5px'
                        },
                        { name: 'Instagram', href: settings.socials.instagram, path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                        { name: 'LinkedIn', href: settings.socials.linkedin, path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
                      ].map((social, idx) => (
                        <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.6 }}>
                          {social.src ? (
                            <div
                              style={{
                                width: social.size || '22px',
                                height: social.size || '22px',
                                backgroundColor: 'currentColor',
                                maskImage: `url(${social.src})`,
                                WebkitMaskImage: `url(${social.src})`,
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                WebkitMaskRepeat: 'no-repeat'
                              }}
                            />
                          ) : (
                            <svg width={social.size || "22"} height={social.size || "22"} viewBox="0 0 24 24" fill="currentColor">
                              <path d={social.path} />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15rem', color: 'var(--color-secondary)', textTransform: 'uppercase', opacity: 0.8 }}>
                      Menu
                    </div>
                  </div>

                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        show: { opacity: 1, x: 0 }
                      }}
                      onClick={() => navigateTo(item.id)}
                      style={{
                        textAlign: 'left',
                        padding: '1rem 1.5rem',
                        background: activeView === item.id ? 'rgba(13, 148, 136, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '20px',
                        color: activeView === item.id ? 'var(--color-secondary-light)' : 'white',
                        fontWeight: activeView === item.id ? 700 : 500,
                        fontSize: '1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.3s',
                        border: activeView === item.id ? '1px solid rgba(13, 148, 136, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {item.label}
                      {activeView === item.id && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-secondary-light)' }} />
                      )}
                    </motion.button>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                  >
                    <ConsultButton
                      onSelectContact={(type) => { setContactModal(type); setIsMenuOpen(false); }}
                      className="btn btn-teal"
                      style={{ width: '100%', padding: '1.1rem', fontSize: '1rem' }}
                    >
                      Book Consultation
                    </ConsultButton>
                    <button
                      onClick={() => { setContactModal('whatsapp'); setIsMenuOpen(false); }}
                      className="btn btn-teal-outline"
                      style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', borderColor: 'rgba(20, 184, 166, 0.3)', color: 'white' }}
                    >
                      WhatsApp Us
                    </button>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 }
                    }}
                    style={{
                      marginTop: '2rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: isMobile ? '1rem' : '1.25rem',
                      paddingBottom: isMobile ? '1rem' : '0'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '0.3rem' }}>Get in touch</div>
                      <a href={`mailto:${settings.contact.email}`} style={{ fontSize: '0.9rem', color: 'white', opacity: 0.8 }}>{settings.contact.email}</a>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero onNavigate={navigateTo} onContact={setContactModal} />
              <AboutSection />
              <FeaturesSection />
              <Testimonials />
              <HowItWorks />
              <FinalCTA onNavigate={navigateTo} onContact={setContactModal} />
            </motion.div>
          )}

          {activeView === 'about' && <AboutView key="about" onNavigate={navigateTo} onContact={setContactModal} />}
          {activeView === 'services' && <ServicesView key="services" onNavigate={navigateTo} onContact={setContactModal} isMobile={isMobile} />}
          {activeView === 'insights' && <InsightsView key="insights" isMobile={isMobile} onContact={setContactModal} onReadMore={setSelectedArticle} />}
          {activeView === 'contact' && <ContactView key="contact" onContact={setContactModal} />}
          {activeView === 'admin' && <AdminDashboard key="admin" onNavigate={navigateTo} />}
        </AnimatePresence>
      </main>

      {activeView !== 'admin' && (
        <Footer onNavigate={navigateTo} onContact={setContactModal} onLegal={setLegalModal} isMobile={isMobile} />
      )}

      <AnimatePresence>
        {selectedArticle && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
            <ArticleModal
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              onContact={setContactModal}
            />
          </div>
        )}
      </AnimatePresence>

      <WhatsAppModal isOpen={contactModal === 'whatsapp'} onClose={() => setContactModal(null)} />
      <EmailModal isOpen={contactModal === 'email'} onClose={() => setContactModal(null)} />
      <LegalModal isOpen={!!legalModal} type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  )
}

export default App