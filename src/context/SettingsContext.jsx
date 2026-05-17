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
    },
    pages: {
      home: {
        about: {
          tagline: "About Vanguard Legal",
          title: "Practical legal expertise for growing businesses",
          desc: "Vanguard Legal provides clear, business-focused legal and compliance support for SMEs. We don’t just quote the law — we help you apply it commercially so you can manage legal risk, stay compliant, strengthen contracts, and make confident business decisions.",
          bullets: [
            "Practical compliance solutions without bureaucracy",
            "Contracts that protect you but don't kill the deal",
            "Risk mitigation integrated into your workflow"
          ],
          image: "/black-financial-consultant-explaining-deal-details.jpg"
        },
        features: {
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
        },
        howItWorks: {
          title: "How It Works",
          steps: [
            { num: "1", title: "Book a consultation" },
            { num: "2", title: "Receive a clear plan with scope and pricing" },
            { num: "3", title: "We handle the legal side while you focus on your business" }
          ]
        },
        testimonials: {
          title: "Testimonials",
          list: [
            { quote: "Vanguard Legal helped us restructure a key agreement and avoid what could have become a serious dispute. The process was clear, efficient and practical.", author: "Founder", role: "SME in logistics" },
            { quote: "We needed urgent help reviewing a supplier contract. The turnaround was quick and the advice highlighted risks we hadn't considered.", author: "Director", role: "Retail business" },
            { quote: "Clear, practical advice without the legal jargon. It's like having a legal partner who understands how businesses actually work.", author: "SME owner", role: "Consulting sector" }
          ]
        },
        cta: {
          title: "Avoid costly legal mistakes as your business grows"
        }
      },
      about: {
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
      },
      services: {
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
      },
      insights: {
        hero: {
          title: "Insights",
          desc: "Expert legal perspectives and strategic guidance tailored for South African business growth.",
          image: "/insights/insights-hero.png"
        }
      },
      contact: {
        hero: {
          title: "Let’s discuss your legal needs",
          desc: "Tell us about your business and we’ll guide you on the best next steps.",
          image: "/discussion.png"
        }
      }
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to the siteSettings document in Firestore
    const unsubscribe = onSnapshot(doc(db, 'siteSettings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(prev => {
          const mergedPages = {
            ...prev.pages,
            ...(data.pages || {})
          };
          if (data.pages?.home) {
            mergedPages.home = {
              ...prev.pages.home,
              ...data.pages.home,
              about: { ...prev.pages.home?.about, ...data.pages.home?.about },
              features: { ...prev.pages.home?.features, ...data.pages.home?.features },
              howItWorks: { ...prev.pages.home?.howItWorks, ...data.pages.home?.howItWorks },
              testimonials: { ...prev.pages.home?.testimonials, ...data.pages.home?.testimonials },
              cta: { ...prev.pages.home?.cta, ...data.pages.home?.cta }
            };
          }
          if (data.pages?.about) {
            mergedPages.about = {
              ...prev.pages.about,
              ...data.pages.about,
              hero: { ...prev.pages.about?.hero, ...data.pages.about?.hero },
              experience: { ...prev.pages.about?.experience, ...data.pages.about?.experience },
              approach: { ...prev.pages.about?.approach, ...data.pages.about?.approach },
              cta: { ...prev.pages.about?.cta, ...data.pages.about?.cta }
            };
          }
          if (data.pages?.services) {
            mergedPages.services = {
              ...prev.pages.services,
              ...data.pages.services,
              hero: { ...prev.pages.services?.hero, ...data.pages.services?.hero },
              cta: { ...prev.pages.services?.cta, ...data.pages.services?.cta }
            };
          }
          if (data.pages?.insights) {
            mergedPages.insights = {
              ...prev.pages.insights,
              ...data.pages.insights,
              hero: { ...prev.pages.insights?.hero, ...data.pages.insights?.hero }
            };
          }
          if (data.pages?.contact) {
            mergedPages.contact = {
              ...prev.pages.contact,
              ...data.pages.contact,
              hero: { ...prev.pages.contact?.hero, ...data.pages.contact?.hero }
            };
          }
          return {
            ...prev,
            ...data,
            pages: mergedPages
          };
        });
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
