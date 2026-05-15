import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext.jsx';

const Footer = ({ onNavigate, onContact, onLegal, isMobile }) => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navGroups = [
// ... (omitting navGroups content)
    {
      title: 'Company',
      links: [
        { id: 'home', label: 'Home', type: 'nav' },
        { id: 'about', label: 'About Us', type: 'nav' },
        { id: 'services', label: 'Services', type: 'nav' },
      ]
    },
    {
      title: 'Support',
      links: [
        { id: 'contact', label: 'Contact Us', type: 'nav' },
        { id: 'whatsapp', label: 'WhatsApp Us', type: 'contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { id: 'privacy', label: 'Privacy Policy', type: 'legal' },
        { id: 'terms', label: 'Terms & Conditions', type: 'legal' },
      ]
    }
  ];

  const renderLink = (link) => (
// ... (omitting renderLink content)
    <button
      key={link.id}
      onMouseEnter={() => setHoveredLink(link.id)}
      onMouseLeave={() => setHoveredLink(null)}
      onClick={() => {
        if (link.type === 'nav') onNavigate(link.id);
        else if (link.type === 'contact') onContact(link.id);
        else if (link.type === 'legal') onLegal(link.id);
      }}
      style={{
        color: hoveredLink === link.id ? 'white' : 'inherit',
        textAlign: 'left',
        padding: '0.2rem 0',
        transition: 'color 0.2s',
        position: 'relative',
        display: 'inline-block',
        width: 'fit-content',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}
    >
      {link.label}
      {hoveredLink === link.id && (
        <motion.div
          layoutId="footer-underline"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'white'
          }}
        />
      )}
    </button>
  );

  return (
    <footer style={{ background: 'var(--color-primary-dark)', color: '#94a3b8', padding: '4rem 0 2rem 0' }}>
      <div className="container">
        <div className="responsive-grid" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '3rem',
          marginBottom: '2rem'
        }}>

          {/* Left Side: Logo & Main Navigation */}
          <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap', flex: '1 1 auto' }}>
            <div style={{ maxWidth: '300px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate('home')}
              >
                <div
                  role="img"
                  aria-label="Vanguard Legal Logo"
                  style={{
                    height: '3rem',
                    width: '200px',
                    backgroundColor: '#94a3b8',
                    maskImage: 'url("/vlegal-transparent.png")',
                    WebkitMaskImage: 'url("/vlegal-transparent.png")',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center left',
                    transformOrigin: 'left center',
                    transition: 'opacity 0.2s',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                />
              </div>
              <p style={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
                Practical legal and compliance support for SMEs. Built for business owners across South Africa.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                {[
                  {
                    name: 'Facebook',
                    href: settings.socials.facebook,
                    src: 'https://img.icons8.com/ios-filled/50/facebook--v1.png'
                  },
                  {
                    name: 'Instagram',
                    href: settings.socials.instagram,
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  },
                  {
                    name: 'LinkedIn',
                    href: settings.socials.linkedin,
                    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    style={{
                      color: 'inherit',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'inherit';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {social.src ? (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d={social.path} />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns Container */}
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '2rem' : '5rem', 
              flex: isMobile ? '1 1 100%' : '1 1 auto',
              flexWrap: isMobile ? 'nowrap' : 'wrap' 
            }}>
              {/* Main Links Stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: isMobile ? 1 : 'none', minWidth: isMobile ? 'auto' : '150px' }}>
                {navGroups
                  .filter(group => group.title !== 'Legal')
                  .flatMap(group => group.links)
                  .map(link => renderLink(link))
                }
              </div>

              {/* Legal Links Stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: isMobile ? 1 : 'none', minWidth: isMobile ? 'auto' : '150px' }}>
                {navGroups
                  .find(group => group.title === 'Legal')
                  .links.map(link => renderLink(link))
                }
              </div>
            </div>
          </div>

          {/* Right Side: Scroll Top (Separate from links on desktop) */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }} className="hide-on-mobile">
            <button
              onClick={scrollToTop}
              title="Scroll to Top"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'var(--color-secondary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <div style={{ width: '12px', height: '12px', background: 'var(--color-secondary)', borderRadius: '50%' }}></div>
            </button>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', opacity: 0.7 }}>
          <span>&copy; {new Date().getFullYear()} - Vanguard Legal</span>
          <span>•</span>
          <button
            onClick={() => onNavigate('admin')}
            style={{ color: 'inherit', fontSize: '0.8rem', opacity: 0.6, cursor: 'pointer', textDecoration: 'underline' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
          >
            Admin Portal
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
