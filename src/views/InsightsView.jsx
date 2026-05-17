import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, ArrowRight } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import MDEditor from '@uiw/react-md-editor';
import ConsultButton from '../components/ConsultButton.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

export const ArticleModal = ({ article, onClose, onContact }) => {
  if (!article) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-primary)' }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '3rem 3rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text)', opacity: 0.6, marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {article.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> Vanguard Legal</span>
          </div>
          <h2 className="article-modal-title" style={{ color: 'var(--color-primary)', lineHeight: 1.2, fontWeight: 800 }}>{article.title}</h2>
        </div>

        <div className="legal-content-scroll" style={{ padding: '2.5rem 3rem', overflowY: 'auto', flexGrow: 1, color: 'var(--color-text)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          {article.image && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#0f172a' }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          
          {article.fullContent ? (
            <div data-color-mode="light" className="article-markdown-container" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
              <MDEditor.Markdown source={article.fullContent} style={{ background: 'transparent', color: 'var(--color-text)', fontSize: 'inherit', lineHeight: 'inherit' }} />
            </div>
          ) : (
            <p>{article.excerpt}</p>
          )}


          {article.audioEmbed && (
            <div style={{ marginTop: '2.5rem', borderRadius: '16px', overflow: 'hidden', background: '#f1f5f9', padding: '1rem' }}>
              <iframe 
                src={article.audioEmbed} 
                width="100%" 
                height="170" 
                frameBorder="0" 
                referrerPolicy="origin" 
                loading="lazy"
                title="Audio Player"
                style={{ display: 'block' }}
              ></iframe>
            </div>
          )}

          {article.audioUrl && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a 
                href={article.audioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.75rem 1.5rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  color: 'var(--color-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-secondary)'; e.currentTarget.style.background = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <span>Listen on</span>
                <div style={{ height: '24px' }}>
                  <svg viewBox="0 0 485 150" xmlns="http://www.w3.org/2000/svg" style={{ height: '100%', width: 'auto' }}>
                    <path fill="currentColor" d="M411.61 108.437h25.763v4.41c1.911-3.4 6.043-5.561 10.173-5.561 5.44 0 9.353 2.236 11.256 6.03 2.974-4.338 6.668-6.03 11.795-6.03 7.195 0 14.097 4.248 14.097 14.685v24.881h-11.272v-22.266c0-3.621-1.903-6.485-6.05-6.485-4.122 0-6.339 3.171-6.339 6.568v22.183H449.54v-22.266c0-3.621-1.907-6.485-6.123-6.485-4.07 0-6.285 3.171-6.285 6.643v22.108h-11.639v-28.518H411.61v28.518h-11.638v-28.518h-6.046v-9.897h6.046v-3.313c0-8.812 5.28-14.843 14.542-14.843 2.376 0 4.444.303 5.515.852v9.585c-.61-.157-1.61-.39-3.455-.39-2.06 0-4.964.923-4.964 5.167v2.942zM98.15 42.857c29.32 0 53.077 23.978 53.077 53.57 0 29.587-23.758 53.573-53.077 53.573-29.312 0-53.074-23.986-53.074-53.573 0-29.592 23.762-53.57 53.074-53.57zm0 79.015c13.928 0 25.22-11.387 25.22-25.445 0-14.062-11.292-25.446-25.22-25.446-13.93 0-25.209 11.384-25.209 25.446 0 14.058 11.28 25.445 25.209 25.445zm223.174-79.015c29.308 0 53.07 23.978 53.07 53.57 0 29.587-23.762 53.573-53.07 53.573-29.323 0-53.093-23.986-53.093-53.573 0-29.592 23.77-53.57 53.093-53.57zm0 79.015c13.917 0 25.212-11.387 25.212-25.445 0-14.062-11.295-25.446-25.212-25.446-13.929 0-25.224 11.384-25.224 25.446 0 14.058 11.295 25.445 25.224 25.445zM3.06 46.001h30.555v100.852H3.06V46zm190.393 100.851h-30.562V46h29.565v11.566c5.429-9.538 17.692-14.204 27.936-14.204 25.134 0 36.386 18.061 36.386 40.17v63.32h-30.551V88.818c0-9.948-5.229-17.45-16.294-17.45-10.043 0-16.48 7.502-16.48 17.65v57.834zm186.305-15.15c4.283 0 7.867 3.558 7.867 7.888 0 4.245-3.584 7.952-7.867 7.952-4.296 0-7.801-3.707-7.801-7.952 0-4.33 3.505-7.888 7.8-7.888z"></path>
                    <path fill="currentColor" d="M17.157 0c9.75 0 17.537 7.8 17.537 17.349 0 9.552-7.787 17.345-17.537 17.345C7.811 34.694 0 26.9 0 17.349 0 7.8 7.811 0 17.157 0"></path>
                  </svg>
                </div>
              </a>
            </div>
          )}
          
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--color-bg)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Want to discuss this further?</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>Our team is ready to help you navigate these legal complexities tailored to your business needs.</p>
            <ConsultButton 
              direction="up" 
              onSelectContact={(type) => { onContact(type); onClose(); }}
            >
              Book a Consultation
            </ConsultButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ArticleCard = ({ article, onReadMore }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flat-card"
    style={{
      padding: article.image ? '0' : '2rem',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      height: '100%',
      overflow: 'hidden'
    }}
  >
    {article.image && (
      <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
        <img 
          src={article.image} 
          alt={article.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    )}
    <div style={{ padding: article.image ? '2rem' : '0', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text)', opacity: 0.6 }}>
        <span>{article.date}</span>
        <span>•</span>
        <span>Vanguard Legal</span>
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', lineHeight: 1.3, fontWeight: 700 }}>
        {article.title}
      </h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.6, flexGrow: 1 }}>
        {article.excerpt}
      </p>
      <button 
        onClick={() => onReadMore(article)}
        style={{ 
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'var(--color-secondary)', 
          fontWeight: 600, 
          fontSize: '0.9rem', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          textAlign: 'left'
        }}
      >
        Read Full Insight <ArrowRight size={16} />
      </button>
    </div>
  </motion.div>
);

const InsightsView = ({ isMobile, onContact, onReadMore }) => {
  const { settings } = useSettings();
  const pageData = settings?.pages?.insights || {
    hero: {
      title: "Insights",
      desc: "Expert legal perspectives and strategic guidance tailored for South African business growth.",
      image: "/insights/insights-hero.png"
    }
  };

  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([
    {
      title: "Radio interview: When does business debt become personal liability for directors?",
      date: "April 12, 2026",
      audioEmbed: "https://iframe.iono.fm/e/1664443?layout=modern",
      audioUrl: "https://iono.fm/e/1664443",
      excerpt: "Our MD recently joined Jeremy Maggs on radio to unpack an issue many entrepreneurs misunderstand: when the protection of a company’s separate legal personality falls away and directors become personally liable for company debts.",
      fullContent: "Our MD recently joined Jeremy Maggs on radio to unpack an issue many entrepreneurs misunderstand: when the protection of a company’s separate legal personality falls away and directors become personally liable for company debts.\n\nFrom personal sureties to reckless trading and breaches of directors’ duties, there are situations where directors can be exposed to creditors.\n\nIn this radio interview we discuss where that line is drawn — and what directors should do to protect themselves while running their businesses responsibly."
    },
    {
      title: "Skyways Magazine Feature: Contractor vs Employee?",
      date: "April 12, 2026",
      image: "/insights/contractor-vs-employee.png",
      excerpt: "Growing your team is exciting—but how you do it matters. Choosing between contractors and employees isn’t just an operational call; it’s a strategic decision that shapes compliance, costs and long-term sustainability.",
      fullContent: "Growing your team is exciting—but how you do it matters.\n\nChoosing between contractors and employees isn’t just an operational call; it’s a strategic decision that shapes compliance, costs and long-term sustainability.\n\nIn this Skyways Magazine feature, our founder and MD Molisa Cheda, breaks down why understanding the distinction is essential to avoiding costly missteps.\n\nBefore making your next hire, ask yourself: are you setting your business up for flexibility, stability or the right balance of both?"
    },
    {
      title: "SME Entrepreneur Magazine Feature: How Molisa Cheda is making Legal Compliance work for Modern SMEs",
      date: "April 12, 2026",
      image: "/insights/sme-compliance.png",
      excerpt: "In this feature, SME Entrepreneur Magazine unpacks how we are making compliance work for modern SMEs — through practical solutions, streamlined and aligned with real business growth.",
      fullContent: "In this feature, SME Entrepreneur Magazine unpacks how we are making compliance work for modern SMEs — through practical solutions, streamlined and aligned with real business growth.\n\nNo unnecessary complexity. No outdated processes.\n\nJust smart, strategic compliance that supports confident decision-making. From governance to regulatory alignment, we focus on building systems that strengthen businesses as they scale.\n\nIn today’s economy, compliance isn’t about ticking boxes; it’s about building credibility, resilience and long-term value."
    },
    {
      title: "SME Entrepreneur Magazine Feature: How to build a legally strong business",
      date: "April 12, 2026",
      image: "/insights/legally-strong.png",
      excerpt: "In this article featured in SME Entrepreneur Magazine, we unpack why building a legally strong business isn’t about red tape — but about sustainable growth.",
      fullContent: "In this article featured in SME Entrepreneur Magazine, we unpack why building a legally strong business isn’t about red tape — but about sustainable growth.\n\nFrom contracts and governance to regulatory compliance, doing things right from the start builds confidence, attracts investors, and protects your business as it scales. Strong foundations lead to smarter growth and fewer surprises. Compliance isn’t a burden; it’s a competitive advantage that gives you the peace of mind to focus on what you do best: building your business."
    },
    {
      title: "Skyways Magazine Feature: Did you know that anti-bribery laws now go far beyond interactions with public officials?",
      date: "April 12, 2026",
      image: "/insights/anti-bribery.png",
      excerpt: "Amendments to South Africa’s anti-corruption legislation significantly expanded the scope of bribery offences to include private sector transactions.",
      fullContent: "Amendments to South Africa’s anti-corruption legislation significantly expanded the scope of bribery offences to include private sector transactions.\n\nThis means that offering, giving, receiving or soliciting any improper advantage — whether monetary or otherwise — in ordinary business dealings is now expressly prohibited by law.\n\nFor businesses, this is not a technical change. It directly affects:\n• Sales incentives and commissions\n• Supplier and procurement relationships\n• Gifts, hospitality and “favours”\n• Joint ventures and commercial negotiations\n\nPractices once brushed off as “how business is done” can expose organisations — and individuals — to serious legal and reputational risk.\n\nIn the latest edition of Skyways Magazine, we unpack what this shift means in practice, why governance and internal controls matter more than ever, and how businesses can stay compliant without losing commercial agility."
    },
    {
      title: "Skyways Magazine Feature: If your business collects, stores or shares personal information, POPIA applies to you.",
      date: "April 12, 2026",
      image: "/insights/popia-skyways.png",
      excerpt: "POPIA Compliance Matters In this article, featured in Skyways Magazine, our MD explores why POPIA compliance matters beyond ticking legal boxes.",
      fullContent: "POPIA Compliance Matters\n\nIn this article, featured in Skyways Magazine, our MD explores why POPIA compliance matters beyond ticking legal boxes. He delves into how it shapes accountability, trust and governance in modern organisations.\n\nA timely read for businesses of all sizes."
    },
    {
      title: "Data Protection according to POPIA",
      date: "December 20, 2025",
      image: "/insights/popia-skyways-cover.png",
      excerpt: "Act Accordingly: POPIA Flying Airlink this December? Don’t miss our article in Skyways Magazine discussing the Protection of Personal Information Act (POPIA).",
      fullContent: "Act Accordingly: POPIA\n\nFlying Airlink this December? Don’t miss our article in Skyways Magazine discussing the Protection of Personal Information Act (POPIA). South African SMEs are collecting more personal data than ever — from customer details to payments and cloud-based services. And with that comes a real responsibility.\n\nPOPIA isn’t just about avoiding penalties. It’s about understanding that even when a third-party handles our data, our businesses remain accountable for protecting the people who trust us.\n\nIn this month’s in-flight Skyways Magazine, our founder Molisa Cheda unpacks what SMEs need to know: practical POPIA obligations, how to manage third-party risks and how compliance can actually strengthen customer trust.\n\nIf you’re flying Airlink during the December holidays, turn to page 82 of Skyways Magazine and have a read."
    },
    {
      title: "Avoiding Legal Traps: Common Mistakes made by Farmers",
      date: "December 20, 2025",
      image: "/insights/farming-traps.jpg",
      excerpt: "Farming is tough — but legal mistakes make it even tougher. From informal operations to verbal deals and overlooked tax duties, small slip-ups can become costly setbacks.",
      fullContent: "Avoiding legal traps: Common mistakes made by farmers\n\n🚜 Farming is tough — but legal mistakes make it even tougher. From informal operations to verbal deals and overlooked tax duties, small slip-ups can become costly setbacks for farmers.\n\nIn our latest African Farming article, we unpack the most common legal traps farmers fall into — and how to avoid them. Protecting your land, your business and your livelihood starts with getting the basics right."
    },
    {
      title: "Getting Farm Employment Right: Your Compliance Checklist",
      date: "December 20, 2025",
      image: "/insights/farm-employment.jpg",
      excerpt: "Labour is at the heart of every farm — but so is compliance. In our latest article featured in African Farming magazine, Molisa Cheda breaks down what every farmer needs to get right.",
      fullContent: "Getting farm employment right: Your compliance checklist\n\nLabour is at the heart of every farm — but so is compliance. In our latest article featured in African Farming magazine, Molisa Cheda breaks down what every farmer needs to get right when employing workers, from contracts to UIF to safety on the farm. A fair and compliant workplace isn’t just ethical — it’s good business."
    },
    {
      title: "Set up a Sustainable Business the Right Way",
      date: "December 20, 2025",
      image: "/insights/sustainable-business.jpg",
      excerpt: "Set up a sustainable business the right way 💡 Most entrepreneurs only think about compliance when it’s too late.",
      fullContent: "Set up a sustainable business the right way\n\n💡 Most entrepreneurs only think about compliance when it’s too late. In our latest article published in The Big Issue magazine, our founder, Molisa Cheda, shares insights on how entrepreneurs can set up a sustainable business the right way — from the very start.\n\nToo many businesses only think about legal structure, compliance, and governance once problems appear… when it’s already costing time, money, and momentum.\n\nTrue sustainability is about building a business that can endure — legally, financially, and operationally. When the foundation is structured correctly, growth compounds without unnecessary risk."
    },
    {
      title: "We’re at the South African Future Trust Summit!",
      date: "October 29, 2025",
      image: "/insights/future-trust-summit.png",
      isHeader: true,
      excerpt: "We will be at the South African Future Trust Summit, happening on 5 and 6 November at the Sandton Convention Centre. Our team will be showcasing how we are simplifying business law.",
      fullContent: "We’re exhibiting at the South African Future Trust Summit!\n\nWe will be at the South African Future Trust Summit, happening on 5 and 6 November at the Sandton Convention Centre.\n\nOur team will be showcasing how we are simplifying business law – making compliance and legal strategy clear, accessible and effective for every business.\n\nVisit us and let’s chat about how we can support your growth with clarity and confidence."
    },
    {
      title: "From handshakes to contracts: Securing your farm’s future",
      date: "October 14, 2025",
      image: "/insights/handshakes-to-contracts.jpeg",
      excerpt: "Many farmers still seal deals with a handshake. Yet when things go wrong, such as late deliveries, poor-quality inputs or broken promises, that handshake will not stand up for you.",
      fullContent: "From handshakes to contracts: Securing your farm’s future\n\nMany farmers still seal deals with a handshake. Yet when things go wrong, such as late deliveries, poor-quality inputs or broken promises, that handshake will not stand up for you.\n\nA simple written contract can.\n\nIt is not about mistrust; it is about protecting your hard work and planning for the future. Read the latest article by our Founder and MD featured in African Farming."
    },
    {
      title: "Lease and land-use agreements for farmers: All you need to know",
      date: "October 10, 2025",
      image: "/insights/lease-agreements.jpeg",
      excerpt: "Land is the lifeblood of farming — but without a secure agreement, your hard work could vanish overnight.",
      fullContent: "Lease and land-use agreements for farmers: All you need to know\n\nLand is the lifeblood of farming — but without a secure agreement, your hard work could vanish overnight.\n\nMany small-scale farmers rely on verbal promises that offer little protection when disputes arise. A written lease or land-use agreement provides the security and clarity every farmer deserves — protecting your investment, your crops and your future.\n\nRead this article featured in African Farming by our Founder & MD on why formal agreements matter and what every farmer should include in one."
    },
    {
      title: "Business registration and structuring for farmers: All you need to know",
      date: "September 27, 2025",
      image: "/insights/business-registration-farming.png",
      excerpt: "For many small-scale farmers in South Africa, planting crops and finding buyers often take centre stage. Yet before a single seed is sown, the legal structure of a farming operation can determine its success.",
      fullContent: "Business registration and structuring for farmers: All you need to know\n\nFor many small-scale farmers in South Africa, planting crops and finding buyers often take centre stage. Yet before a single seed is sown, the legal structure of a farming operation can determine its success. From tax implications and liability to access to funding and markets, the right business structure lays the foundation for growth and stability.\n\nIn this article, featured in African Farming, our founder and Managing Director unpacks the key options available to farmers — from sole proprietorships and partnerships to cooperatives and private companies — and highlights the factors to consider when registering a farming business.\n\nRead the full article to explore how the right structure can help farmers secure opportunities, manage risk and build sustainable enterprises."
    },
    {
      title: "Is Your Food Label Legal? Here’s Why It Matters More Than You Think",
      date: "September 14, 2025",
      image: "/insights/food-label-legal.png",
      excerpt: "In South Africa’s fast-growing food and beverage industry, your product label is more than just a design—it is a legal obligation.",
      fullContent: "Is Your Food Label Legal? Here’s Why It Matters More Than You Think\n\nIn South Africa’s fast-growing food and beverage industry, your product label is more than just a design—it is a legal obligation. In this article, featured in Food & Beverage Reporter magazine, our founder breaks down the critical food labelling laws under the Foodstuffs, Cosmetics and Disinfectants Act 54 of 1972, including Regulations R146 and R429, and highlights the common mistakes that can cost your business in fines, recalls, and reputational damage.\n\nFrom allergen declarations to nutritional panels, learn how to protect your brand, stay compliant, and build trust with consumers.\n\nRead the full article to ensure your labels meet South African legal standards."
    },
    {
      title: "RADIO INTERVIEW: Choosing a business structure – Our founder in conversation with Jeremy Maggs",
      date: "August 3, 2025",
      excerpt: "Starting a business? Choosing the right structure matters. Our founder unpacked the key things every entrepreneur should consider when deciding on a business structure.",
      fullContent: "RADIO INTERVIEW: Choosing a business structure - Our founder in conversation with Jeremy Maggs\n\nStarting a business? Choosing the right structure matters.\n\nIn this recent radio interview, our founder unpacked the key things every entrepreneur should consider when deciding on a business structure – whether it’s a sole proprietorship, private company (Pty Ltd), or partnership.\n\nThese are decisions that affect your long-term success — legally and financially.\n\n🎙️ Listen now and make an informed choice for your business!"
    },
    {
      title: "RADIO INTERVIEW: How to stay compliant without high legal fees: Our founder in conversation with Jeremy Maggs",
      date: "July 19, 2025",
      excerpt: "How do I stay compliant without racking up legal fees I can’t afford? Compliance doesn’t have to cost a fortune.",
      fullContent: "RADIO INTERVIEW: How to stay compliant without high legal fees: Our founder in conversation with Jeremy Maggs\n\nIn his recent radio interview, our founder unpacked a key question facing most entrepreneurs: How do I stay compliant without racking up legal fees I can’t afford?”\n\n⚖️ Compliance doesn’t have to cost a fortune. With the right support, small businesses can grow smartly.\n\n🎙️ Catch the interview clip for more tips on legally sound business growth — no jargon."
    },
    {
      title: "RADIO INTERVIEW: What You Need to Know About Shelf Companies: Our Founder in conversation with Jeremy Maggs",
      date: "July 4, 2025",
      excerpt: "Our founder joins veteran broadcaster Jeremy Maggs to unpack the essentials of shelf companies — what they are, why they exist and the key pros and cons.",
      fullContent: "RADIO INTERVIEW: What You Need to Know About Shelf Companies – Our Founder and Jeremy Maggs in conversation\n\nIn this exclusive radio interview, our founder joins veteran broadcaster Jeremy Maggs to unpack the essentials of shelf companies — what they are, why they exist and the key pros and cons every business owner should understand. Whether you’re a startup founder or a seasoned entrepreneur, this conversation offers valuable insights into a topic often misunderstood.\n\nListen to the full interview with Jeremy Maggs."
    },
    {
      title: "RADIO INTERVIEW WITH JEREMY MAGGS: Our founder discusses the legal pitfalls that trip up SMEs",
      date: "June 27, 2025",
      excerpt: "Our founder joined renowned broadcaster Jeremy Maggs for a candid conversation on the legal challenges that many South African SMEs face.",
      fullContent: "RADIO INTERVIEW WITH JEREMY MAGGS: Our founder discusses the legal pitfalls that trip up SMEs\n\nOur founder joined renowned broadcaster Jeremy Maggs for a candid conversation on the legal challenges that many South African SMEs face – and how to navigate them without unnecessary cost or confusion.\n\nThe discussion unpacked critical issues that every entrepreneur should consider, including:\n- 🔍 The legal pitfalls that commonly trip up SMEs – and how to proactively avoid them.\n- 🏢 What every entrepreneur should know before registering a company – from choosing the right structure to understanding key obligations.\n- 💸 How to stay compliant without spending a fortune on legal fees – practical, cost-effective strategies to protect your business.\n\n🎧 Listen to the full interview with Jeremy Maggs."
    },
    {
      title: "Are You at Risk? CIPC to Deregister Over 800,000 Entities",
      date: "May 18, 2025",
      image: "/insights/cipc-deregistration.png",
      isHeader: true,
      excerpt: "The CIPC has issued a stern warning: over 800,000 companies and close corporations are currently non-compliant and face imminent deregistration.",
      fullContent: "The Companies and Intellectual Property Commission (CIPC) has issued a stern warning: over 800,000 companies and close corporations are currently non-compliant and face imminent deregistration. This large-scale action is part of the CIPC’s mandate to maintain an accurate and up-to-date register of active business entities in South Africa. If you are a business owner, this development highlights the urgent need to ensure your entity meets all statutory requirements.\n\nWhat is Deregistration?\nDeregistration refers to the removal of a company or close corporation from the CIPC register. Once deregistered, an entity loses its legal status—it can no longer operate, enter into contracts, own property, or pursue legal claims. While some companies may apply for voluntary deregistration, the bulk of current cases stem from involuntary deregistration due to non-compliance.\n\nWhy Are So Many Entities at Risk?\nThe CIPC has identified over 800,000 entities that have failed to comply with essential statutory obligations. The main triggers for deregistration include:\n1. Failure to File Annual Returns\n2. Failure to file Beneficial Ownership details.\n3. Outdated Contact or Office Information\n4. Ignored Compliance Notices\n\nThe Impact of Deregistration\nIf your business is deregistered, the implications can be significant:\n- Loss of Legal Standing\n- Frozen or Lost Assets\n- Damage to Reputation\n- Outstanding Liabilities Remain\n\nHow to Avoid Being Part of the 800,000\n- File Annual Returns on Time\n- Keep Company Details Up to Date\n- Monitor Communications from the CIPC\n\nCan a Deregistered Company Be Reinstated?\nYes—but it’s a process. Reinstatement requires submitting all outstanding annual returns, paying penalties and fees, and providing supporting documents such as a SARS compliance letter. Reinstatement can take several weeks to months, so it’s best to avoid deregistration in the first place."
    },
    {
      title: "Top 7 Legal Mistakes SA Entrepreneurs Make — And How to Avoid Them",
      date: "April 27, 2025",
      image: "/insights/legal-mistakes-header.jpg",
      isHeader: true,
      excerpt: "Starting and running a business in South Africa is exciting, but many entrepreneurs unknowingly expose themselves to legal risk by overlooking key legal fundamentals.",
      fullContent: "Top 7 Legal Mistakes SA Entrepreneurs Make — And How to Avoid Them\n\nStarting and running a business in South Africa is exciting, but many entrepreneurs unknowingly expose themselves to legal risk by overlooking key legal fundamentals. From registration oversights to poorly drafted contracts, these mistakes can cost time, money, and even the reputation of your business.\n\nHere are the top 7 legal pitfalls we see among entrepreneurs in South Africa — and how to avoid them.\n\n1. Not Registering the Business Properly\nRegister a private company (Pty Ltd) with the CIPC if you are geared towards growth. It offers limited liability protection.\n\n2. Skipping Written Contracts\nAlways use properly drafted written agreements — from service contracts and NDAs to shareholder agreements.\n\n3. Ignoring POPIA Compliance\nHave a privacy policy, get consent for marketing communications, and ensure your systems are secure.\n\n4. Not Protecting Intellectual Property\nRegister trademarks, copyright your creative works, and have IP clauses in employee and contractor agreements.\n\n5. Overlooking Employment Law\nDraft employment contracts, understand basic labour rights, and put workplace policies in place.\n\n6. Poor Record-Keeping and Compliance\nKeep records, use accounting software or services, and get legal advice for ongoing compliance.\n\n7. Waiting Too Long to Get Legal Advice\nLegal support does not have to be expensive. Work with a consultancy that offers affordable, SME-focused legal services.\n\nLegal mistakes can be costly, but most are completely avoidable with the right guidance."
    },
    {
      title: "South Africa’s 2025 VAT Hike: What Businesses Need to Know",
      date: "April 21, 2025",
      image: "/insights/vat-hike-header.jpg",
      isHeader: true,
      excerpt: "The proposed VAT hike from 15% to 16% was a major concern for SMEs. We break down the latest updates, including the recent withdrawal of the proposal.",
      fullContent: "South Africa’s 2025 VAT Hike: What Businesses Need to Know\n\nUpdate (April 2025): The proposed VAT hike from 15% to 16%, originally set to roll out over the next two years, has officially been withdrawn. As always, we remain committed to keeping you informed and supported through shifting regulatory landscapes.\n\nOverview\nThe South African government has announced a 1% increase in Value-Added Tax (VAT), raising the rate from 15% to 16%.\n\nImplications for Businesses\n1. Pricing Strategy Adjustments\n2. Revised Invoicing & Compliance\n3. Cash Flow Management\n\nLegal & Contractual Considerations\nCommercial contracts—especially long-term agreements or fixed-price contracts—must be reviewed. Ready to update your contracts to reflect the new VAT rate? Contact us today for professional legal support."
    }
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (articlesData.length > 0) {
        articlesData.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setArticles(articlesData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to articles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, articles.length));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <section style={{ 
        background: 'var(--color-primary)', 
        padding: isMobile ? '7rem 0 5rem' : '10rem 0 8rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Hero Background Image with Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `url(${pageData.hero?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4
        }}></div>
        
        {/* Blue Tint Overlay for readability */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.6))',
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: isMobile ? '3.5rem' : '5rem', 
            color: 'white', 
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            {pageData.hero?.title}
          </h1>
          <p style={{ 
            color: 'white', 
            textAlign: 'center', 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '1.5rem auto 0',
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            lineHeight: 1.6
          }}>
            {pageData.hero?.desc}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '2.5rem',
            alignItems: 'stretch'
          }}>
            {articles.slice(0, visibleCount).map((article, idx) => (
              <ArticleCard key={idx} article={article} onReadMore={onReadMore} />
            ))}
          </div>

          {visibleCount < articles.length && (
            <div style={{ marginTop: '5rem', textAlign: 'center' }}>
              <button 
                className="btn btn-teal" 
                style={{ padding: '1rem 3rem' }}
                onClick={handleLoadMore}
              >
                LOAD MORE INSIGHTS
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default InsightsView;
