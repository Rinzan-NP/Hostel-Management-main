import { useState } from 'react'
import { LayoutDashboard, Hotel, Users, CreditCard, Settings, LogOut } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Halls from './components/Halls'
import Students from './components/Students'
import Rent from './components/Rent'
import Login from './components/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'halls', label: 'Halls & Rooms', icon: <Hotel size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'rent', label: 'Rent Management', icon: <CreditCard size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'halls': return <Halls />
      case 'students': return <Students />
      case 'rent': return <Rent />
      default: return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '32px', height: '32px', borderRadius: '8px' }}></div>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Hostel Management</h2>
        </div>
        <nav style={{ flex: 1 }}>
          {sidebarItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div 
          onClick={() => setIsLoggedIn(false)}
          className="sidebar-item" 
          style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Logout</span>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '4px' }}>Overview</p>
            <h1>{sidebarItems.find(i => i.id === activeTab)?.label}</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
              <span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>System Live</span>
            </div>
            <button className="btn btn-primary">Action Center</button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}

export default App
