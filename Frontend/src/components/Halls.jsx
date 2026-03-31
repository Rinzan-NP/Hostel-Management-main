import { useState, useEffect } from 'react'
import { Hotel, MapPin, Plus, UserPlus, Bed as BedIcon, ChevronRight, ChevronDown } from 'lucide-react'
import { hostelApi } from '../api'
import Modal from './Modal'

const Halls = () => {
  const [halls, setHalls] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newHall, setNewHall] = useState({ name: '', location: '', description: '' })
  const [selectedHall, setSelectedHall] = useState(null)
  
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: 2, room_type: 'NON_AC', rent_price: 450.00 })
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedBed, setSelectedBed] = useState(null)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [expandedHallId, setExpandedHallId] = useState(null)

  const fetchHalls = async () => {
    try {
      const res = await hostelApi.getHalls()
      const processedHalls = res.data.map(hall => {
        const totalBeds = hall.rooms.reduce((acc, room) => acc + room.beds.length, 0)
        const occupiedBeds = hall.rooms.reduce((acc, room) => acc + room.beds.filter(b => b.is_occupied).length, 0)
        return {
          ...hall,
          totalBeds,
          occupiedBeds,
          occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
        }
      })
      setHalls(processedHalls)
    } catch (error) {
      console.error("Error fetching halls", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await hostelApi.getStudents()
      setStudents(res.data)
    } catch (error) {
      console.error("Error fetching students", error)
    }
  }

  useEffect(() => {
    fetchHalls()
    fetchStudents()
  }, [])

  const handleCreateHall = async (e) => {
    e.preventDefault()
    try {
      await hostelApi.createHall(newHall)
      setIsModalOpen(false)
      setNewHall({ name: '', location: '', description: '' })
      fetchHalls()
    } catch (error) {
      console.error("Error creating hall", error)
    }
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    try {
      await hostelApi.createRoom({ ...newRoom, hall: selectedHall.id })
      setIsRoomModalOpen(false)
      setNewRoom({ room_number: '', capacity: 2, room_type: 'NON_AC', rent_price: 450.00 })
      fetchHalls()
    } catch (error) {
      console.error("Error creating room", error)
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await hostelApi.createAssignment({
        student: selectedStudentId,
        bed: selectedBed.id,
        check_in_date: new Date().toISOString().split('T')[0]
      })
      setIsAssignModalOpen(false)
      setSelectedStudentId('')
      fetchHalls()
    } catch (error) {
      console.error("Error assigning student", error)
      alert("Assignment failed. Perhaps student or bed is already assigned.")
    }
  }

  if (loading && halls.length === 0) return <p>Loading Halls...</p>

  return (
    <div className="halls-view">
      <div className="dashboard-grid">
        {halls.map(hall => (
          <div key={hall.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ background: '#eef2ff', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                <Hotel size={24} />
              </div>
              <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'var(--text-dim)' }}>
                {hall.occupancyRate}% Occupied
              </span>
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{hall.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '14px', marginBottom: '20px' }}>
              <MapPin size={14} />
              {hall.location}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-dim)' }}>Rooms: {hall.rooms.length}</span>
              <span>{hall.occupiedBeds} / {hall.totalBeds} Beds occupied</span>
            </div>
            <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary)', width: `${hall.occupancyRate}%`, height: '100%' }}></div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setExpandedHallId(expandedHallId === hall.id ? null : hall.id)}
                className="btn" 
                style={{ flex: 1, background: '#f1f5f9', color: 'var(--text)', border: '1px solid #e2e8f0', fontSize: '14px' }}
              >
                {expandedHallId === hall.id ? 'Hide Rooms' : 'View Rooms'}
              </button>
              <button 
                onClick={() => { setSelectedHall(hall); setIsRoomModalOpen(true); }}
                className="btn btn-primary" 
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={20} />
              </button>
            </div>

            {expandedHallId === hall.id && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                {hall.rooms.map(room => (
                  <div key={room.id} style={{ marginBottom: '15px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Room {room.room_number}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{room.room_type} ({room.capacity} beds)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                      {room.beds.map(bed => (
                        <div 
                          key={bed.id}
                          onClick={() => { if (!bed.is_occupied) { setSelectedBed(bed); setIsAssignModalOpen(true); } }}
                          style={{
                            padding: '8px',
                            background: bed.is_occupied ? '#eef2ff' : '#fff',
                            border: bed.is_occupied ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: bed.is_occupied ? 'default' : 'pointer',
                            opacity: bed.is_occupied ? 0.7 : 1
                          }}
                        >
                          <BedIcon size={16} color={bed.is_occupied ? 'var(--primary)' : '#94a3b8'} />
                          <div style={{ fontSize: '11px', marginTop: '4px' }}>Bed {bed.bed_number}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div 
          onClick={() => setIsModalOpen(true)}
          className="glass-card" 
          style={{ padding: '24px', border: '2px dashed #e2e8f0', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '260px', boxShadow: 'none' }}
        >
          <div style={{ color: 'var(--text-dim)', fontSize: '40px', marginBottom: '12px' }}>+</div>
          <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Add New Hall</p>
        </div>
      </div>

      {/* New Hall Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Hall">
        <form onSubmit={handleCreateHall}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Hall Name</label>
            <input type="text" required value={newHall.name} onChange={e => setNewHall({ ...newHall, name: e.target.value })} style={{ width: '100%' }} placeholder="e.g. Diamond Wing" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Location</label>
            <input type="text" required value={newHall.location} onChange={e => setNewHall({ ...newHall, location: e.target.value })} style={{ width: '100%' }} placeholder="e.g. North Side" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Hall</button>
        </form>
      </Modal>

      {/* New Room Modal */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title={`Add Room to ${selectedHall?.name}`}>
        <form onSubmit={handleCreateRoom}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Room Number</label>
            <input type="text" required value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })} style={{ width: '100%' }} placeholder="e.g. 101B" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Capacity</label>
            <input type="number" required min="1" value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Room Type</label>
            <select value={newRoom.room_type} onChange={e => setNewRoom({ ...newRoom, room_type: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <option value="NON_AC">Non Air Conditioned</option>
              <option value="AC">Air Conditioned</option>
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Monthly Rent ($)</label>
            <input 
              type="number" 
              required
              step="0.01"
              value={newRoom.rent_price}
              onChange={e => setNewRoom({ ...newRoom, rent_price: parseFloat(e.target.value) })}
              style={{ width: '100%' }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Room</button>
        </form>
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Student to Bed">
        <form onSubmit={handleAssign}>
          <p style={{ marginBottom: '1rem', fontSize: '14px', color: 'var(--text-dim)' }}>Selected Bed: {selectedBed?.bed_number} (Room {selectedBed?.room})</p>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Select Student</label>
            <select 
              required 
              value={selectedStudentId} 
              onChange={e => setSelectedStudentId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            >
              <option value="">Choose a student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.roll_number})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Confirm Assignment</button>
        </form>
      </Modal>
    </div>
  )
}

export default Halls
