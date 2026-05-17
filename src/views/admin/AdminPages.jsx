/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useSettings } from '../../context/SettingsContext';
import { Save, Loader2, Image as ImageIcon, FileText, Layout } from 'lucide-react';

const AdminPages = ({ showSnackbar }) => {
  const { settings, loading: contextLoading } = useSettings();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activePageTab, setActivePageTab] = useState(() => {
    return localStorage.getItem('vanguard_admin_pages_tab') || 'home';
  }); // 'home', 'about', 'services', 'insights', 'contact'
  const [uploadingImage, setUploadingImage] = useState(false);

  const handlePageTabChange = (tab) => {
    setActivePageTab(tab);
    localStorage.setItem('vanguard_admin_pages_tab', tab);
  };

  useEffect(() => {
    if (!contextLoading && settings?.pages && !formData) {
      setFormData(JSON.parse(JSON.stringify(settings.pages)));
    }
  }, [contextLoading, settings, formData]);

  if (contextLoading || !formData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8' }}>
        <Loader2 className="animate-spin" size={32} style={{ marginRight: '1rem' }} />
        <span>Loading page content...</span>
      </div>
    );
  }

  // Handle simple nested text updates
  const handleTextChange = (page, section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [section]: {
          ...prev[page][section],
          [field]: value
        }
      }
    }));
  };

  // Handle array of strings updates (like bullets or reasons)
  const handleStringArrayChange = (page, section, arrayField, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[page][section][arrayField] || [])];
      newArray[index] = value;
      return {
        ...prev,
        [page]: {
          ...prev[page],
          [section]: {
            ...prev[page][section],
            [arrayField]: newArray
          }
        }
      };
    });
  };

  // Handle array of objects updates (like cards, steps, testimonials)
  const handleObjectArrayChange = (page, section, arrayField, index, objField, value) => {
    setFormData(prev => {
      const newArray = [...(prev[page][section][arrayField] || [])];
      newArray[index] = {
        ...newArray[index],
        [objField]: value
      };
      return {
        ...prev,
        [page]: {
          ...prev[page],
          [section]: {
            ...prev[page][section],
            [arrayField]: newArray
          }
        }
      };
    });
  };

  // Handle image upload to Firebase Storage
  const handleImageUpload = async (e, page, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldUrl = formData[page]?.[section]?.[field];
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/pages/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (oldUrl && oldUrl.includes('firebasestorage')) {
        try {
          await deleteObject(ref(storage, oldUrl));
          console.log("Old page image successfully deleted from storage:", oldUrl);
        } catch (delErr) {
          console.warn("Could not delete old image from storage:", delErr);
        }
      }

      // Update local state and instantly save to Firestore
      setFormData(prev => {
        const updated = {
          ...prev,
          [page]: {
            ...prev[page],
            [section]: {
              ...prev[page][section],
              [field]: url
            }
          }
        };
        setDoc(doc(db, 'siteSettings', 'main'), { pages: updated }, { merge: true })
          .then(() => {
            showSnackbar("Section image uploaded and saved successfully!", "success");
          })
          .catch((err) => {
            console.error("Error saving image to settings:", err);
            showSnackbar("Image uploaded but failed to save to database.", "error");
          });
        return updated;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      showSnackbar("Failed to upload image. Check storage rules.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), { pages: formData }, { merge: true });
      showSnackbar("All page content updated successfully!", "success");
    } catch (error) {
      console.error("Error saving page content:", error);
      showSnackbar("Failed to save page content. Please check permissions.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ color: '#f8fafc', padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: '#f8fafc', fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layout className="text-teal-400" />
            Page Content Manager
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            Modify text, sections, and images across pages. Changes instantly update the live website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: '0.8rem 1.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Saving Content...' : 'Save All Page Content'}
        </button>
      </div>

      {/* Sub-Tabs for selecting page */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
        <button
          onClick={() => handlePageTabChange('home')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: activePageTab === 'home' ? '1px solid #14b8a6' : '1px solid #334155',
            background: activePageTab === 'home' ? 'rgba(20, 184, 166, 0.15)' : '#1e293b',
            color: activePageTab === 'home' ? '#14b8a6' : '#94a3b8'
          }}
        >
          {/* 🏠 */}  Home Page Content
        </button>
        <button
          onClick={() => handlePageTabChange('about')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: activePageTab === 'about' ? '1px solid #14b8a6' : '1px solid #334155',
            background: activePageTab === 'about' ? 'rgba(20, 184, 166, 0.15)' : '#1e293b',
            color: activePageTab === 'about' ? '#14b8a6' : '#94a3b8'
          }}
        >
          {/* 📖 */}  About Page Content
        </button>
        <button
          onClick={() => handlePageTabChange('services')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: activePageTab === 'services' ? '1px solid #14b8a6' : '1px solid #334155',
            background: activePageTab === 'services' ? 'rgba(20, 184, 166, 0.15)' : '#1e293b',
            color: activePageTab === 'services' ? '#14b8a6' : '#94a3b8'
          }}
        >
          {/* 💼 */}  Services Page Content
        </button>
        <button
          onClick={() => handlePageTabChange('insights')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: activePageTab === 'insights' ? '1px solid #14b8a6' : '1px solid #334155',
            background: activePageTab === 'insights' ? 'rgba(20, 184, 166, 0.15)' : '#1e293b',
            color: activePageTab === 'insights' ? '#14b8a6' : '#94a3b8'
          }}
        >
          {/* 📰 */} Insights Page Content
        </button>
        <button
          onClick={() => handlePageTabChange('contact')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: activePageTab === 'contact' ? '1px solid #14b8a6' : '1px solid #334155',
            background: activePageTab === 'contact' ? 'rgba(20, 184, 166, 0.15)' : '#1e293b',
            color: activePageTab === 'contact' ? '#14b8a6' : '#94a3b8'
          }}
        >
          {/* 📞 */} Contact Page Content
        </button>
      </div>

      {/* ======================================= */}
      {/* HOME PAGE CONTENT */}
      {/* ======================================= */}
      {activePageTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* About Vanguard Legal Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> About Vanguard Legal Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="admin-label">Tagline (Uppercase Header)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.home.about.tagline || ''}
                  onChange={(e) => handleTextChange('home', 'about', 'tagline', e.target.value)}
                  placeholder="e.g. About Vanguard Legal"
                />
              </div>
              <div>
                <label className="admin-label">Main Headline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.home.about.title || ''}
                  onChange={(e) => handleTextChange('home', 'about', 'title', e.target.value)}
                  placeholder="e.g. Practical legal expertise for growing businesses"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="admin-label">Section Description Paragraph</label>
              <textarea
                className="admin-input"
                rows="4"
                value={formData.home.about.desc || ''}
                onChange={(e) => handleTextChange('home', 'about', 'desc', e.target.value)}
                placeholder="Detailed section description..."
              />
            </div>

            {/* Bullets */}
            <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <label className="admin-label" style={{ marginBottom: '1rem', display: 'block' }}>Bullet Points (Key Benefits)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.home.about.bullets?.map((bullet, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#14b8a6', fontWeight: 700 }}>✔</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={bullet || ''}
                      onChange={(e) => handleStringArrayChange('home', 'about', 'bullets', idx, e.target.value)}
                      placeholder="Benefit statement"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="admin-label">Section Cover Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.home.about.image && (
                  <img
                    src={formData.home.about.image}
                    alt="About section cover preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'home', 'about', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Recommended size: High resolution horizontal or portrait image.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Help / Features Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> How We Help & Why Choose Us Section
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <label className="admin-label">Features Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={formData.home.features.title || ''}
                onChange={(e) => handleTextChange('home', 'features', 'title', e.target.value)}
                placeholder="e.g. How We Help"
              />
            </div>

            {/* Help Cards */}
            <div style={{ marginBottom: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <label className="admin-label" style={{ marginBottom: '1.5rem', display: 'block' }}>Help Cards Grid Items</label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {formData.home.features.cards?.map((card, idx) => (
                  <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 700 }}>CARD {idx + 1}</div>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginBottom: '0.75rem', fontWeight: 700, color: '#14b8a6' }}
                      value={card.title || ''}
                      onChange={(e) => handleObjectArrayChange('home', 'features', 'cards', idx, 'title', e.target.value)}
                      placeholder="Card Title"
                    />
                    <textarea
                      className="admin-input"
                      rows="2"
                      value={card.desc || ''}
                      onChange={(e) => handleObjectArrayChange('home', 'features', 'cards', idx, 'desc', e.target.value)}
                      placeholder="Card Description"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why SMEs Section Sub-Box */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '1.25rem', fontWeight: 700 }}>Why SMEs Choose Us Box</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="admin-label">Why Heading</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.home.features.whyTitle || ''}
                    onChange={(e) => handleTextChange('home', 'features', 'whyTitle', e.target.value)}
                    placeholder="e.g. Why SMEs Choose Us"
                  />
                </div>
                <div>
                  <label className="admin-label">Why Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.home.features.whySubtitle || ''}
                    onChange={(e) => handleTextChange('home', 'features', 'whySubtitle', e.target.value)}
                    placeholder="e.g. Built for business owners"
                  />
                </div>
              </div>

              {/* Reasons */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                <label className="admin-label" style={{ marginBottom: '1rem', display: 'block' }}>Reasons List</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.home.features.reasons?.map((reason, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#14b8a6', fontWeight: 700 }}>✔</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={reason || ''}
                        onChange={(e) => handleStringArrayChange('home', 'features', 'reasons', idx, e.target.value)}
                        placeholder="Reason description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> How It Works Section
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={formData.home.howItWorks.title || ''}
                onChange={(e) => handleTextChange('home', 'howItWorks', 'title', e.target.value)}
                placeholder="e.g. How It Works"
              />
            </div>

            {/* Steps */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <label className="admin-label" style={{ marginBottom: '1.5rem', display: 'block' }}>Step-by-Step Cards</label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {formData.home.howItWorks.steps?.map((step, idx) => (
                  <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#0d9488', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
                      {step.num || idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={step.title || ''}
                        onChange={(e) => handleObjectArrayChange('home', 'howItWorks', 'steps', idx, 'title', e.target.value)}
                        placeholder="Step description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Client Testimonials Section
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={formData.home.testimonials.title || ''}
                onChange={(e) => handleTextChange('home', 'testimonials', 'title', e.target.value)}
                placeholder="e.g. Testimonials"
              />
            </div>

            {/* Testimonials List */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <label className="admin-label" style={{ marginBottom: '1.5rem', display: 'block' }}>Client Review Cards</label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {formData.home.testimonials.list?.map((t, idx) => (
                  <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>TESTIMONIAL #{idx + 1}</div>
                    <textarea
                      className="admin-input"
                      rows="3"
                      value={t.quote || ''}
                      onChange={(e) => handleObjectArrayChange('home', 'testimonials', 'list', idx, 'quote', e.target.value)}
                      placeholder="Client quote..."
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={t.author || ''}
                        onChange={(e) => handleObjectArrayChange('home', 'testimonials', 'list', idx, 'author', e.target.value)}
                        placeholder="Author Name (e.g. Founder)"
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={t.role || ''}
                        onChange={(e) => handleObjectArrayChange('home', 'testimonials', 'list', idx, 'role', e.target.value)}
                        placeholder="Company Role / Sector"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Final CTA Section (Home Bottom)
            </h3>
            <div>
              <label className="admin-label">Call to Action Title</label>
              <input
                type="text"
                className="admin-input"
                value={formData.home.cta.title || ''}
                onChange={(e) => handleTextChange('home', 'cta', 'title', e.target.value)}
                placeholder="e.g. Avoid costly legal mistakes as your business grows"
              />
            </div>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* ABOUT PAGE CONTENT */}
      {/* ======================================= */}
      {activePageTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* About Hero Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> About Page Hero Section
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="admin-label">Main Title</label>
              <input
                type="text"
                className="admin-input"
                value={formData.about.hero.title || ''}
                onChange={(e) => handleTextChange('about', 'hero', 'title', e.target.value)}
                placeholder="e.g. Practical legal support built for SMEs"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label className="admin-label">Description Paragraph 1</label>
                <textarea
                  className="admin-input"
                  rows="4"
                  value={formData.about.hero.desc1 || ''}
                  onChange={(e) => handleTextChange('about', 'hero', 'desc1', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Description Paragraph 2</label>
                <textarea
                  className="admin-input"
                  rows="4"
                  value={formData.about.hero.desc2 || ''}
                  onChange={(e) => handleTextChange('about', 'hero', 'desc2', e.target.value)}
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="admin-label">Hero Cover Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.about.hero.image && (
                  <img
                    src={formData.about.hero.image}
                    alt="About hero image preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'about', 'hero', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Experience Section Box
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="admin-label">Heading</label>
              <input
                type="text"
                className="admin-input"
                value={formData.about.experience.title || ''}
                onChange={(e) => handleTextChange('about', 'experience', 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Detailed Description</label>
              <textarea
                className="admin-input"
                rows="4"
                value={formData.about.experience.desc || ''}
                onChange={(e) => handleTextChange('about', 'experience', 'desc', e.target.value)}
              />
            </div>
          </div>

          {/* Our Approach Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Our Approach Section Box
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="admin-label">Heading</label>
              <input
                type="text"
                className="admin-input"
                value={formData.about.approach.title || ''}
                onChange={(e) => handleTextChange('about', 'approach', 'title', e.target.value)}
              />
            </div>

            {/* Bullets */}
            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <label className="admin-label" style={{ marginBottom: '1rem', display: 'block' }}>Approach Bullet Points</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {formData.about.approach.bullets?.map((bullet, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#14b8a6', fontWeight: 700 }}>✔</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={bullet || ''}
                      onChange={(e) => handleStringArrayChange('about', 'approach', 'bullets', idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="admin-label">Footer Note / Philosophy (Italicized text)</label>
              <input
                type="text"
                className="admin-input"
                value={formData.about.approach.footerNote || ''}
                onChange={(e) => handleTextChange('about', 'approach', 'footerNote', e.target.value)}
              />
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Bottom Call to Action Box
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="admin-label">CTA Heading</label>
              <input
                type="text"
                className="admin-input"
                value={formData.about.cta.title || ''}
                onChange={(e) => handleTextChange('about', 'cta', 'title', e.target.value)}
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="admin-label">CTA Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.about.cta.image && (
                  <img
                    src={formData.about.cta.image}
                    alt="About CTA background preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'about', 'cta', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* SERVICES PAGE CONTENT */}
      {/* ======================================= */}
      {activePageTab === 'services' && formData.services && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Services Hero Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Services Hero Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="admin-label">Hero Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.services.hero?.title || ''}
                  onChange={(e) => handleTextChange('services', 'hero', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Hero Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={formData.services.hero?.desc || ''}
                  onChange={(e) => handleTextChange('services', 'hero', 'desc', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Hero Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.services.hero?.image && (
                  <img
                    src={formData.services.hero.image}
                    alt="Services hero preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'services', 'hero', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Services Bottom Pricing CTA Section */}
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Clear & Transparent Pricing Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="admin-label">Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.services.cta?.title || ''}
                  onChange={(e) => handleTextChange('services', 'cta', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Section Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.services.cta?.subtitle || ''}
                  onChange={(e) => handleTextChange('services', 'cta', 'subtitle', e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="admin-label">Pricing Bullet Points</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(formData.services.cta?.bullets || []).map((bullet, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="admin-input"
                    value={bullet}
                    onChange={(e) => handleStringArrayChange('services', 'cta', 'bullets', idx, e.target.value)}
                    placeholder={`Bullet #${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="admin-label">Section Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.services.cta?.image && (
                  <img
                    src={formData.services.cta.image}
                    alt="Services CTA preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'services', 'cta', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* INSIGHTS PAGE CONTENT */}
      {/* ======================================= */}
      {activePageTab === 'insights' && formData.insights && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Insights Hero Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="admin-label">Hero Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.insights.hero?.title || ''}
                  onChange={(e) => handleTextChange('insights', 'hero', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Hero Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={formData.insights.hero?.desc || ''}
                  onChange={(e) => handleTextChange('insights', 'hero', 'desc', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Hero Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.insights.hero?.image && (
                  <img
                    src={formData.insights.hero.image}
                    alt="Insights hero preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'insights', 'hero', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* CONTACT PAGE CONTENT */}
      {/* ======================================= */}
      {activePageTab === 'contact' && formData.contact && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="admin-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#14b8a6', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} /> Contact Hero Section
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="admin-label">Hero Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.contact.hero?.title || ''}
                  onChange={(e) => handleTextChange('contact', 'hero', 'title', e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label">Hero Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={formData.contact.hero?.desc || ''}
                  onChange={(e) => handleTextChange('contact', 'hero', 'desc', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Hero Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.contact.hero?.image && (
                  <img
                    src={formData.contact.hero.image}
                    alt="Contact hero preview"
                    style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #334155' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.25rem' }}>
                    {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    {uploadingImage ? 'Uploading Image...' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'contact', 'hero', 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Button at bottom as well for convenience */}
      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: '0.8rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Saving Content...' : 'Save All Page Content'}
        </button>
      </div>
    </div>
  );
};

export default AdminPages;
