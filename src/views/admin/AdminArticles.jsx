/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Plus, Edit, Trash2, X, Loader2, Save, Image as ImageIcon, Star, Maximize2, Check } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

const AdminArticles = ({ showSnackbar, confirmAction }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setArticles(list);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to articles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAdd = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setEditingArticle({
      title: '',
      date: today,
      excerpt: '',
      fullContent: '',
      image: '',
      audioEmbed: '',
      audioUrl: '',
      isHeader: false
    });
    setModalMode('add');
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(JSON.parse(JSON.stringify(article)));
    setModalMode('edit');
  };

  const handleDelete = (id, title) => {
    confirmAction(
      "Delete Insight",
      `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      async () => {
        try {
          const articleToDelete = articles.find(a => a.id === id);
          if (articleToDelete?.image?.includes('firebasestorage')) {
            try {
              await deleteObject(ref(storage, articleToDelete.image));
              console.log("Deleted article cover image from storage.");
            } catch (err) {
              console.warn("Could not delete article image from storage:", err);
            }
          }
          await deleteDoc(doc(db, 'articles', id));
          showSnackbar("Insight deleted successfully!", "success");
        } catch (error) {
          console.error("Error deleting article:", error);
          showSnackbar("Failed to delete insight. Please check permissions.", "error");
        }
      }
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const oldUrl = editingArticle?.image;
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/articles/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (oldUrl && oldUrl.includes('firebasestorage')) {
        try {
          await deleteObject(ref(storage, oldUrl));
          console.log("Deleted old article image from storage.");
        } catch (err) {
          console.warn("Could not delete old article image from storage:", err);
        }
      }

      setEditingArticle(prev => ({ ...prev, image: url }));
      showSnackbar("Image uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showSnackbar("Failed to upload image. Please check storage rules.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingArticle.title || !editingArticle.fullContent) {
      alert("Please fill in the title and full content.");
      return;
    }

    const articleData = { ...editingArticle };
    delete articleData.id;

    try {
      if (modalMode === 'add') {
        articleData.createdAt = Date.now();
        await addDoc(collection(db, 'articles'), articleData);
        showSnackbar("Insight published successfully!", "success");
      } else {
        await updateDoc(doc(db, 'articles', editingArticle.id), articleData);
        showSnackbar("Insight updated successfully!", "success");
      }
      setEditingArticle(null);
    } catch (error) {
      console.error("Error saving article:", error);
      showSnackbar("Failed to save insight.", "error");
    }
  };

  if (loading) {
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
          <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '0.25rem' }}>Insights & Articles Manager</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Publish and manage legal features, radio interview embeds, and Skyways magazine spots.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={18} />
          <span>Publish New Insight</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {articles.map((article) => (
          <div key={article.id} className="admin-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              {article.isHeader && (
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={14} fill="#14b8a6" />
                  <span>FEATURED HEADER</span>
                </div>
              )}

              {article.image && (
                <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', background: '#0f172a' }}>
                  <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{article.date}</span>
                {article.audioUrl && (
                  <span style={{ color: '#14b8a6', fontWeight: 600 }}>• Audio Included</span>
                )}
              </div>

              <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '0.75rem', fontWeight: 700, lineHeight: 1.3 }}>{article.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.excerpt || article.fullContent}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
              <button
                onClick={() => handleOpenEdit(article)}
                className="admin-btn admin-btn-secondary"
                style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <Edit size={16} />
                <span>Edit Insight</span>
              </button>
              <button
                onClick={() => handleDelete(article.id, article.title)}
                className="admin-btn admin-btn-danger"
                style={{ padding: '0.6rem 1rem' }}
                title="Delete Article"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {editingArticle && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 700 }}>
                {modalMode === 'add' ? 'Publish New Insight' : 'Edit Insight'}
              </h2>
              <button onClick={() => setEditingArticle(null)} style={{ color: '#94a3b8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Article Title</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, title: e.target.value }))}
                    className="admin-input"
                    placeholder="e.g. Skyways Magazine Feature: Contractor vs Employee?"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Display Date</label>
                  <input
                    type="text"
                    value={editingArticle.date}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, date: e.target.value }))}
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#0f172a', borderRadius: '10px', border: '1px solid #334155' }}>
                <input
                  type="checkbox"
                  id="isHeader"
                  checked={editingArticle.isHeader || false}
                  onChange={(e) => setEditingArticle(prev => ({ ...prev, isHeader: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: '#14b8a6', cursor: 'pointer' }}
                />
                <label htmlFor="isHeader" style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} fill={editingArticle.isHeader ? "#14b8a6" : "none"} color={editingArticle.isHeader ? "#14b8a6" : "#94a3b8"} />
                  <span>Feature in Insights Header Carousel</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Cover Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {editingArticle.image && (
                    <img src={editingArticle.image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #334155' }} />
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: '#334155', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }}>
                    {uploadingImage ? <Loader2 size={18} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <ImageIcon size={18} />}
                    <span>{uploadingImage ? 'Uploading to Storage...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                  </label>
                  <input
                    type="url"
                    value={editingArticle.image}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, image: e.target.value }))}
                    className="admin-input"
                    placeholder="Or paste image URL here..."
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Excerpt (Short Summary for Card)</label>
                <textarea
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="admin-input"
                  rows={2}
                  placeholder="Brief 2-3 line overview..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Full Article Content (Markdown Supported)</label>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#14b8a6', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(20, 184, 166, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #14b8a6' }}
                  >
                    <Maximize2 size={14} />
                    <span>Open Full Window Editor</span>
                  </button>
                </div>
                
                <div
                  onClick={() => setIsEditorOpen(true)}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    maxHeight: '220px',
                    padding: '1.25rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: editingArticle.fullContent ? '#e2e8f0' : '#64748b',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 7,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#14b8a6'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
                >
                  {editingArticle.fullContent ? editingArticle.fullContent : "Click here to open the full-window rich Markdown editor..."}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'right' }}>
                  Click inside box to launch distraction-free editor
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Audio Embed Iframe URL (Optional)</label>
                  <input
                    type="url"
                    value={editingArticle.audioEmbed || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, audioEmbed: e.target.value }))}
                    className="admin-input"
                    placeholder="e.g. https://iframe.iono.fm/e/..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Audio Direct Link (Optional)</label>
                  <input
                    type="url"
                    value={editingArticle.audioUrl || ''}
                    onChange={(e) => setEditingArticle(prev => ({ ...prev, audioUrl: e.target.value }))}
                    className="admin-input"
                    placeholder="e.g. https://iono.fm/e/..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #334155', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  <Save size={18} />
                  <span>{modalMode === 'add' ? 'Publish Article' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen MDEditor Modal */}
      {isEditorOpen && editingArticle && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#0f172a', display: 'flex', flexDirection: 'column' }} data-color-mode="dark">
          <div style={{ height: '72px', padding: '0 2.5rem', background: '#020617', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}>Distraction-Free Article Editor</h3>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Editing: {editingArticle.title || 'Untitled Insight'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="admin-btn admin-btn-primary"
            >
              <Check size={18} />
              <span>Done Editing (Return to Form)</span>
            </button>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', background: '#0b1120', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <MDEditor
              value={editingArticle.fullContent || ''}
              onChange={(val) => setEditingArticle(prev => ({ ...prev, fullContent: val || '' }))}
              height="100%"
              style={{ flex: 1, border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}
              preview="live"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
