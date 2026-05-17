/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useSettings } from '../../context/SettingsContext';
import { Save, Check, Loader2, Image as ImageIcon } from 'lucide-react';

const AdminSettings = ({ showSnackbar }) => {
  const { settings, loading: contextLoading } = useSettings();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('contact'); // contact, socials, homeHero

  useEffect(() => {
    if (!contextLoading && settings && !formData) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [contextLoading, settings, formData]);

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleHeroChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      heros: {
        ...prev.heros,
        home: {
          ...prev.heros?.home,
          [field]: value
        }
      }
    }));
  };

  const handleHeroImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldUrl = formData.heros?.home?.[field];
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/heros/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (oldUrl && oldUrl.includes('firebasestorage')) {
        try {
          await deleteObject(ref(storage, oldUrl));
          console.log("Old home hero image deleted:", oldUrl);
        } catch (err) {
          console.warn("Could not delete old image:", err);
        }
      }

      setFormData(prev => {
        const updated = {
          ...prev,
          heros: {
            ...prev.heros,
            home: {
              ...prev.heros?.home,
              [field]: url
            }
          }
        };
        setDoc(doc(db, 'siteSettings', 'main'), { heros: updated.heros }, { merge: true })
          .then(() => showSnackbar("Hero image uploaded and saved successfully!", "success"))
          .catch(err => {
            console.error("Error saving hero image:", err);
            showSnackbar("Image uploaded but failed to save to database.", "error");
          });
        return updated;
      });
    } catch (error) {
      console.error("Error uploading hero image:", error);
      showSnackbar("Failed to upload image. Check permissions.", "error");
    } finally {
      setUploadingImage(false);
    }
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
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Update global contact details, social links, and the Home page hero banner.</p>
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
        {[
          { id: 'contact', label: 'Contact Info' },
          { id: 'socials', label: 'Social Media' },
          { id: 'homeHero', label: 'Home Hero Banner' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: activeTab === tab.id ? '#14b8a6' : '#94a3b8',
              backgroundColor: activeTab === tab.id ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
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
        {activeTab === 'homeHero' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#14b8a6', marginBottom: '0.5rem' }}>Home Page Hero Banner</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Main Title</label>
                <input
                  type="text"
                  value={formData.heros?.home?.title || ''}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Subtitle Description</label>
                <input
                  type="text"
                  value={formData.heros?.home?.subtitle || ''}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Credibility Strip Bar Text</label>
                <input
                  type="text"
                  value={formData.heros?.home?.credibilityStrip || ''}
                  onChange={(e) => handleHeroChange('credibilityStrip', e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Attorney-led legal support for SMEs across South Africa"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Hero Background Image</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.heros?.home?.image && (
                  <img
                    src={formData.heros.home.image}
                    alt="Home hero preview"
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
                      onChange={(e) => handleHeroImageUpload(e, 'image')}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettings;
