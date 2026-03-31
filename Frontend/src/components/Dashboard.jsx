import { useState, useEffect } from 'react'
import { hostelApi } from '../api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    occupancy: 0,
    students: 0,
    balance: 0,
    recent: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hallsRes, studentsRes, rentsRes] = await Promise.all([
          hostelApi.getHalls(),
          hostelApi.getStudents(),
          hostelApi.getRents()
        ])

        const totalBeds = hallsRes.data.reduce((acc, hall) => 
          acc + hall.rooms.reduce((rAcc, room) => rAcc + room.beds.length, 0), 0)
        const occupiedBeds = hallsRes.data.reduce((acc, hall) => 
          acc + hall.rooms.reduce((rAcc, room) => rAcc + room.beds.filter(b => b.is_occupied).length, 0), 0)
        
        const pendingAmount = rentsRes.data
          .filter(r => r.status !== 'PAID')
          .reduce((acc, r) => acc + parseFloat(r.amount), 0)

        setStats({
          occupancy: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
          students: studentsRes.data.length,
          balance: pendingAmount,
          recent: studentsRes.data.slice(-5).reverse()
        })
      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Loading Dashboard...</p>

  return (
    <div className="dashboard-content">
      <section className="dashboard-grid">
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '8px' }}>Total Occupancy</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.occupancy}%</p>
          <div style={{ marginTop: '16px', background: '#f1f5f9', height: '8px', borderRadius: '4px' }}>
            <div style={{ background: 'var(--primary)', width: `${stats.occupancy}%`, height: '100%', borderRadius: '4px' }}></div>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '8px' }}>Total Students</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.students}</p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '8px' }}>Pending Rent</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e11d48' }}>${stats.balance}</p>
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Recently Joined Students</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '12px 16px' }}>Student</th>
                <th>Roll Number</th>
                <th>Joined Date</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>{student.name}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.joined_at}</td>
                  <td>{student.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
