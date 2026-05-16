/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit, Trash2, X, Loader2, Save } from 'lucide-react';

const AdminServices = ({ showSnackbar, confirmAction }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null); // null, or service object for modal
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(list);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to services:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({
      title: '',
      desc: '',
      includes: ['']
    });
    setModalMode('add');
  };

  const handleOpenEdit = (service) => {
    setEditingService(JSON.parse(JSON.stringify(service)));
    setModalMode('edit');
  };

  const handleDelete = (id, title) => {
    confirmAction(
      "Delete Service Package",
      `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteDoc(doc(db, 'services', id));
          showSnackbar("Service package deleted successfully!", "success");
        } catch (error) {
          console.error("Error deleting service:", error);
          showSnackbar("Failed to delete service package. Please check permissions.", "error");
        }
      }
    );
  };

  const handleIncludeChange = (index, value) => {
    setEditingService(prev => {
      const newIncludes = [...prev.includes];
      newIncludes[index] = value;
      return { ...prev, includes: newIncludes };
    });
  };

  const handleAddInclude = () => {
    setEditingService(prev => ({ ...prev, includes: [...prev.includes, ''] }));
  };

  const handleRemoveInclude = (index) => {
    setEditingService(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingService.title || !editingService.desc) {
      alert("Please fill in the title and description.");
      return;
    }

    const cleanIncludes = editingService.includes.filter(i => i.trim() !== '');

    const serviceData = {
      title: editingService.title,
      desc: editingService.desc,
      includes: cleanIncludes
    };

    try {
      if (modalMode === 'add') {
        await addDoc(collection(db, 'services'), serviceData);
        showSnackbar("Service package created successfully!", "success");
      } else {
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
        showSnackbar("Service package updated successfully!", "success");
      }
      setEditingService(null);
    } catch (error) {
      console.error("Error saving service:", error);
      showSnackbar("Failed to save service package.", "error");
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
          <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '0.25rem' }}>Services Manager</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Manage the legal service packages and bullet points shown on the Services view.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {services.map((service) => (
          <div key={service.id} className="admin-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#14b8a6', marginBottom: '0.5rem', fontWeight: 700 }}>{service.title}</h3>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{service.desc}</p>
              
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Included Offerings:</div>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {service.includes?.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1.25rem', marginTop: '1rem' }}>
              <button
                onClick={() => handleOpenEdit(service)}
                className="admin-btn admin-btn-secondary"
                style={{ flex: 1, padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <Edit size={16} />
                <span>Edit Package</span>
              </button>
              <button
                onClick={() => handleDelete(service.id, service.title)}
                className="admin-btn admin-btn-danger"
                style={{ padding: '0.6rem 1rem' }}
                title="Delete Service"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {editingService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 700 }}>
                {modalMode === 'add' ? 'Add New Legal Service' : 'Edit Legal Service'}
              </h2>
              <button onClick={() => setEditingService(null)} style={{ color: '#94a3b8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService(prev => ({ ...prev, title: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Contract Drafting & Review"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                <textarea
                  value={editingService.desc}
                  onChange={(e) => setEditingService(prev => ({ ...prev, desc: e.target.value }))}
                  className="admin-input"
                  rows={3}
                  placeholder="Clear overview of the service package..."
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Included Items (Bullet Points)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {editingService.includes.map((inc, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={inc}
                        onChange={(e) => handleIncludeChange(index, e.target.value)}
                        className="admin-input"
                        placeholder={`Included item #${index + 1}`}
                      />
                      {editingService.includes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(index)}
                          style={{ color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddInclude}
                    style={{ color: '#14b8a6', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start', marginTop: '0.5rem', cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #334155', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  <Save size={18} />
                  <span>{modalMode === 'add' ? 'Create Package' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
