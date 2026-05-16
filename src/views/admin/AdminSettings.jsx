/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSettings } from '../../context/SettingsContext';
import { Save, Check, Loader2 } from 'lucide-react';

const AdminSettings = ({ showSnackbar }) => {
  const { settings, loading: contextLoading } = useSettings();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('contact'); // contact, socials, heros

  useEffect(() => {
    if (settings && !formData) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings, formData]);

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleHeroChange = (page, field, value) => {
    setFormData(prev => ({
      ...prev,
      heros: {
        ...prev.heros,
        [page]: {
          ...prev.heros[page],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'siteSettings', 'main'), formData, { merge: true });
      setSuccess(true);
      showSnackbar("Site settings saved successfully!", "success");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      showSnackbar("Failed to save settings. Check permissions.", "error");
    } finally {
      setSaving(false);
    }
  };


  if (contextLoading || !formData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <Loader2 size={32} className="lucide-spin" style={{ color: '#14b8a6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '0.25rem' }}>Site Settings Manager</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Update global contact details, social links, and hero banners across all pages.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          {saving ? <Loader2 size={18} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (success ? <Check size={18} /> : <Save size={18} />)}
          <span>{saving ? 'Saving...' : (success ? 'Saved!' : 'Save All Settings')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        {['contact', 'socials', 'heros'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: activeTab === tab ? '#14b8a6' : '#94a3b8',
              backgroundColor: activeTab === tab ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.25rem', color: '#14b8a6', marginBottom: '1.5rem' }}>Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number (Display)</label>
                <input
                  type="text"
                  value={formData.contact?.phone || ''}
                  onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>WhatsApp Number (Format: 2778...)</label>
                <input
                  type="text"
                  value={formData.contact?.whatsapp || ''}
                  onChange={(e) => handleNestedChange('contact', 'whatsapp', e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Physical Location</label>
                <input
                  type="text"
                  value={formData.contact?.location || ''}
                  onChange={(e) => handleNestedChange('contact', 'location', e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Socials Tab */}
        {activeTab === 'socials' && (
          <div className="admin-card">
            <h2 style={{ fontSize: '1.25rem', color: '#14b8a6', marginBottom: '1.5rem' }}>Social Media Links</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.socials?.linkedin || ''}
                  onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Facebook URL</label>
                <input
                  type="url"
                  value={formData.socials?.facebook || ''}
                  onChange={(e) => handleNestedChange('socials', 'facebook', e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Instagram URL</label>
                <input
                  type="url"
                  value={formData.socials?.instagram || ''}
                  onChange={(e) => handleNestedChange('socials', 'instagram', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Heros Tab */}
        {activeTab === 'heros' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {['home', 'about', 'services', 'insights', 'contact'].map((page) => (
              <div key={page} className="admin-card" style={{ marginBottom: 0 }}>
                <h3 style={{ fontSize: '1.15rem', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                  {page} Page Banner
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Main Title</label>
                    <input
                      type="text"
                      value={formData.heros?.[page]?.title || ''}
                      onChange={(e) => handleHeroChange(page, 'title', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Subtitle</label>
                    <input
                      type="text"
                      value={formData.heros?.[page]?.subtitle || ''}
                      onChange={(e) => handleHeroChange(page, 'subtitle', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettings;
