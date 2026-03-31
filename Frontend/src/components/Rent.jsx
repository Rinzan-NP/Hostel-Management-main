import { useState, useEffect } from 'react'
import { CreditCard, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react'
import { hostelApi } from '../api'

const Rent = () => {
  const [rents, setRents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRents = async () => {
    try {
      const res = await hostelApi.getRents()
      setRents(res.data)
    } catch (error) {
      console.error("Error fetching rents", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRents()
  }, [])

  const handlePay = async (rentId) => {
    try {
      await hostelApi.updateRent(rentId, { 
        status: 'PAID',
        paid_at: new Date().toISOString().split('T')[0]
      })
      fetchRents()
    } catch (error) {
      console.error("Error updating rent", error)
    }
  }

  const stats = {
    collected: rents.filter(r => r.status === 'PAID').reduce((acc, r) => acc + parseFloat(r.amount), 0),
    outstanding: rents.filter(r => r.status !== 'PAID').reduce((acc, r) => acc + parseFloat(r.amount), 0),
    rate: rents.length > 0 ? Math.round((rents.filter(r => r.status === 'PAID').length / rents.length) * 100) : 0
  }

  if (loading && rents.length === 0) return <p>Loading Rent Data...</p>

  return (
    <div className="rent-view">
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '10px', color: '#10b981' }}>
              <ArrowDownRight size={20} />
            </div>
          </div>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '4px' }}>Collected This Month</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>${stats.collected}</p>
        </div>
        
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '10px', color: '#ef4444' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '4px' }}>Outstanding Balance</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>${stats.outstanding}</p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ background: '#eef2ff', padding: '10px', borderRadius: '10px', color: 'var(--primary)' }}>
              <CreditCard size={20} />
            </div>
          </div>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '4px' }}>Collection Rate</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.rate}%</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Payment Tracking</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rents.map(rent => (
              <tr key={rent.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px' }}>{rent.student_name}</td>
                <td>${rent.amount}</td>
                <td>{rent.due_date}</td>
                <td>
                  <span style={{ 
                    background: rent.status === 'PAID' ? '#dcfce7' : 
                                rent.status === 'UNPAID' ? '#fef9c3' : 
                                '#fee2e2', 
                    color: rent.status === 'PAID' ? '#15803d' : 
                          rent.status === 'UNPAID' ? '#854d0e' : 
                          '#b91c1c', 
                    padding: '4px 10px', 
                    borderRadius: '8px', 
                    fontSize: '12px' 
                  }}>
                    {rent.status}
                  </span>
                </td>
                <td>
                  {rent.status !== 'PAID' && (
                    <button 
                      onClick={() => handlePay(rent.id)}
                      className="btn" 
                      style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={14} />
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Rent
