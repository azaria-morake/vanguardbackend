import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    contact: {
      email: 'contact@vanguardlegal.co.za',
      phone: '+27 78 833 4236',
      whatsapp: '27788334236',
      location: 'South Africa',
    },
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=61575264892574',
      instagram: 'https://www.instagram.com/vanguardlegalsa/',
      linkedin: 'https://www.linkedin.com/company/vanguard-legal-sa',
    },
    heros: {
      home: {
        title: 'Legal Protection for your Business',
        subtitle: 'Built for SMEs across South Africa.',
        image: '/hero-bg.jpg'
      }
    },
    whatsappConfig: {
      greeting: 'Hi there! How can we help you today?',
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to the siteSettings document in Firestore
    const unsubscribe = onSnapshot(doc(db, 'siteSettings', 'main'), (doc) => {
      if (doc.exists()) {
        setSettings(prev => ({ ...prev, ...doc.data() }));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
