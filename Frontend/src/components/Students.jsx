import { useState, useEffect } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { hostelApi } from '../api'
import Modal from './Modal'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    roll_number: '',
    department: ''
  })
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await hostelApi.getStudents()
      setStudents(res.data)
    } catch (error) {
      console.error("Error fetching students", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await hostelApi.createStudent(newStudent)
      setIsModalOpen(false)
      setNewStudent({ name: '', email: '', phone: '', roll_number: '', department: '' })
      fetchStudents()
    } catch (error) {
      console.error("Error registering student", error)
    }
  }

  if (loading && students.length === 0) return <p>Loading Students...</p>

  return (
    <div className="students-view">
      <div className="glass-card" style={{ padding: '24px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Search students by name, roll number, or department..." 
            style={{
              width: '100%',
              padding: '12px 12px 12px 48px'
            }}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} />
          Register Student
        </button>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '12px 16px' }}>Student Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Joined At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                      {student.name[0]}
                    </div>
                    {student.name}
                  </div>
                </td>
                <td>{student.roll_number}</td>
                <td>{student.department}</td>
                <td>{student.joined_at}</td>
                <td>
                  <button 
                    onClick={() => { setSelectedStudent(student); setIsProfileModalOpen(true); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>Full Name</label>
            <input 
              type="text" 
              required
              value={newStudent.name}
              onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
              style={{ width: '100%' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              required
              value={newStudent.email}
              onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
              style={{ width: '100%' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>Phone Number</label>
            <input 
              type="text" 
              required
              value={newStudent.phone}
              onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
              style={{ width: '100%' }} 
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>Roll Number</label>
            <input 
              type="text" 
              required
              value={newStudent.roll_number}
              onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })}
              style={{ width: '100%' }} 
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '13px', fontWeight: 500 }}>Department</label>
            <input 
              type="text" 
              required
              value={newStudent.department}
              onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}
              style={{ width: '100%' }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Student</button>
        </form>
      </Modal>

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Student Profile">
        {selectedStudent && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '32px',
              fontWeight: 'bold', 
              color: '#fff',
              margin: '0 auto 1.5rem'
            }}>
              {selectedStudent.name[0]}
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>{selectedStudent.name}</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>{selectedStudent.roll_number}</p>
            
            <div style={{ textAlign: 'left', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Department</span>
                <span>{selectedStudent.department}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Email</span>
                <span>{selectedStudent.email}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Phone</span>
                <span>{selectedStudent.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Joined Date</span>
                <span>{selectedStudent.joined_at}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsProfileModalOpen(false)} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Close Profile
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Students
