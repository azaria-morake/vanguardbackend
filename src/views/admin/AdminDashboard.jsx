/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { Settings, FileText, Briefcase, LogOut, Lock, Mail, Key, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import AdminSettings from './AdminSettings';
import AdminArticles from './AdminArticles';
import AdminServices from './AdminServices';

const AdminDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'services', 'settings'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message.replace('Firebase: ', ''));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a' }}>
        <Loader2 size={40} className="lucide-spin" style={{ color: '#14b8a6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Not logged in -> Show Login Screen
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '1.5rem', position: 'relative', zIndex: 9999 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at center, #14b8a6 0%, transparent 70%)' }}></div>
        
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '24px', padding: '3rem 2.5rem', position: 'relative', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #14b8a6' }}>
              <Lock size={28} color="#14b8a6" />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>VANGUARD CMS</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Secure administrative access only.</p>
          </div>

          {loginError && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '1rem' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="admin@vanguardlegal.co.za"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Key size={18} color="#64748b" style={{ position: 'absolute', left: '1rem' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
            >
              {isLoggingIn ? <Loader2 size={18} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={20} />}
              <span>{isLoggingIn ? 'Authenticating...' : 'Secure Login'}</span>
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
            <button onClick={() => onNavigate('home')} style={{ color: '#14b8a6', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <span>← Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in -> Show Admin CMS Layout
  return (
    <div className="admin-container" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#020617', fontWeight: 800, fontSize: '1rem' }}>
            V
          </div>
          <span>Vanguard CMS</span>
        </div>

        <nav className="admin-nav">
          <div
            onClick={() => setActiveTab('articles')}
            className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
          >
            <FileText size={20} />
            <span>Insights & Articles</span>
          </div>

          <div
            onClick={() => setActiveTab('services')}
            className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`}
          >
            <Briefcase size={20} />
            <span>Service Packages</span>
          </div>

          <div
            onClick={() => setActiveTab('settings')}
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span>Site Settings</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#14b8a6' }}></span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
          </div>

          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', textTransform: 'capitalize' }}>
            {activeTab} Management
          </div>

          <button
            onClick={() => onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #334155', borderRadius: '20px', color: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <span>Exit Admin View</span>
            <ExternalLink size={16} color="#14b8a6" />
          </button>
        </header>

        <div className="admin-content">
          {activeTab === 'articles' && <AdminArticles />}
          {activeTab === 'services' && <AdminServices />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
