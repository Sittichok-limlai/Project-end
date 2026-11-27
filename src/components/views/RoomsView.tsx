import React, { useState } from 'react';
import { 
  DoorClosed, 
  Search, 
  Wind, 
  UserCheck, 
  UserPlus,
  Check, 
  X,
  Plus
} from 'lucide-react';
import type { Room, RoomStatus } from '../../types';

export interface ResidentInput {
  residentName: string;
  phone?: string;
  checkInDate?: string;
}

interface RoomsViewProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
  /** เรียกเมื่อเพิ่มผู้พักในห้องว่าง (ฝั่ง parent ควรเปลี่ยนสถานะเป็น occupied ด้วย) */
  onAssignResident: (roomId: string, resident: ResidentInput) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const RoomsView: React.FC<RoomsViewProps> = ({ rooms, onUpdateRoomStatus, onAssignResident }) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // ฟอร์มเพิ่มผู้พัก (ใช้เฉพาะห้องว่าง)
  const [assignName, setAssignName] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignDate, setAssignDate] = useState(todayISO());
  const [assignError, setAssignError] = useState('');

  const resetAssignForm = () => {
    setAssignName('');
    setAssignPhone('');
    setAssignDate(todayISO());
    setAssignError('');
  };

  const openRoom = (room: Room) => {
    resetAssignForm();
    setSelectedRoom(room);
  };

  const closeRoom = () => {
    resetAssignForm();
    setSelectedRoom(null);
  };

  const handleAssignResident = () => {
    if (!selectedRoom) return;
    const name = assignName.trim();
    if (!name) {
      setAssignError('กรุณากรอกชื่อผู้พักอาศัย');
      return;
    }
    const resident: ResidentInput = {
      residentName: name,
      phone: assignPhone.trim() || undefined,
      checkInDate: assignDate || undefined,
    };
    onAssignResident(selectedRoom.id, resident);
    setSelectedRoom({
      ...selectedRoom,
      status: 'occupied',
      residentName: resident.residentName,
      phone: resident.phone,
      checkInDate: resident.checkInDate,
    });
    resetAssignForm();
  };

  const filteredRooms = rooms.filter((room) => {
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNumber = room.roomNumber.toLowerCase().includes(term);
      const matchResident = room.residentName?.toLowerCase().includes(term);
      if (!matchNumber && !matchResident) return false;
    }
    return true;
  });

  const getStatusThai = (status: RoomStatus) => {
    switch (status) {
      case 'occupied': return 'มีผู้พักอาศัย';
      case 'vacant': return 'ว่างพร้อมเข้าพัก';
      case 'cleaning': return 'รอทำความสะอาด';
      case 'maintenance': return 'ปิดปรับปรุง/แจ้งซ่อม';
    }
  };

  return (
    <div className="rooms-view-container">
      {/* Title & Stats */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">ผังและสถานะห้องพัก (Room Management)</h2>
          <p className="view-subtitle">ตรวจสอบและปรับเปลี่ยนสถานะห้องพัก 120 ห้อง อาคาร A</p>
        </div>
        <div className="view-header-actions">
          <button className="add-room-btn">
            <Plus size={16} />
            <span>เพิ่มห้องพัก</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="room-filters-card">
        {/* Floor selector tabs */}
        <div className="floor-tabs-list">
          <button
            className={`floor-tab ${selectedFloor === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFloor('all')}
          >
            ทุกชั้น (120)
          </button>
          {[1, 2, 3, 4].map((floor) => (
            <button
              key={floor}
              className={`floor-tab ${selectedFloor === floor ? 'active' : ''}`}
              onClick={() => setSelectedFloor(floor)}
            >
              ชั้น {floor} (30 ห้อง)
            </button>
          ))}
        </div>

        {/* Status filters & Search */}
        <div className="filter-controls-row">
          <div className="status-chips-group">
            <button
              className={`status-chip ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              ทั้งหมด
            </button>
            <button
              className={`status-chip occupied ${statusFilter === 'occupied' ? 'active' : ''}`}
              onClick={() => setStatusFilter('occupied')}
            >
              <span className="dot dot-occupied"></span> พักอยู่ (108)
            </button>
            <button
              className={`status-chip vacant ${statusFilter === 'vacant' ? 'active' : ''}`}
              onClick={() => setStatusFilter('vacant')}
            >
              <span className="dot dot-vacant"></span> ห้องว่าง (8)
            </button>
            <button
              className={`status-chip cleaning ${statusFilter === 'cleaning' ? 'active' : ''}`}
              onClick={() => setStatusFilter('cleaning')}
            >
              <span className="dot dot-cleaning"></span> ทำความสะอาด (3)
            </button>
            <button
              className={`status-chip maintenance ${statusFilter === 'maintenance' ? 'active' : ''}`}
              onClick={() => setStatusFilter('maintenance')}
            >
              <span className="dot dot-maintenance"></span> แจ้งซ่อม (1)
            </button>
          </div>

          <div className="filter-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง หรือชื่อ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search-input"
            />
          </div>
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="rooms-grid">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
              className={`room-card-box status-${room.status}`}
              onClick={() => openRoom(room)}
            >
              <div className="room-card-top">
                <span className="room-num">ห้อง {room.roomNumber}</span>
                <span className={`status-pill ${room.status}`}>
                  {room.status === 'occupied' && 'มีผู้พัก'}
                  {room.status === 'vacant' && 'ว่าง'}
                  {room.status === 'cleaning' && 'ทำความสะอาด'}
                  {room.status === 'maintenance' && 'ซ่อม'}
                </span>
              </div>

              <div className="room-card-body">
                <div className="room-type-text">{room.type.split(' ')[0]}</div>
                <div className="room-price-text">฿{room.price.toLocaleString()} / ด.</div>
                {room.residentName && (
                  <div className="room-resident-name" title={room.residentName}>
                    <UserCheck size={13} className="mr-1 inline text-blue-500" />
                    {room.residentName}
                  </div>
                )}
              </div>

              <div className="room-card-bottom">
                <span className="room-floor-tag">ชั้น {room.floor}</span>
                {room.airConditioner && (
                  <span className="room-ac-tag" title="เครื่องปรับอากาศ">
                    <Wind size={13} /> แอร์
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROOM DETAIL MODAL */}
      {selectedRoom && (
        <div className="modal-backdrop" onClick={closeRoom}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <DoorClosed size={24} />
                </div>
                <div>
                  <h3 className="modal-title">ข้อมูลห้องพัก {selectedRoom.roomNumber}</h3>
                  <p className="modal-sub">{selectedRoom.building} · ชั้น {selectedRoom.floor}</p>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={closeRoom}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-item-grid">
                <div className="detail-cell">
                  <div className="cell-label">ประเภทห้อง</div>
                  <div className="cell-value">{selectedRoom.type}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">อัตราค่าเช่ารายเดือน</div>
                  <div className="cell-value highlight">฿{selectedRoom.price.toLocaleString()} บาท/เดือน</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">สิ่งอำนวยความสะดวก</div>
                  <div className="cell-value">เครื่องปรับอากาศ, ตู้เสื้อผ้า, โต๊ะอ่านหนังสือ, เครื่องทำน้ำอุ่น</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">สถานะปัจจุบัน</div>
                  <div className={`status-pill ${selectedRoom.status} large`}>
                    {getStatusThai(selectedRoom.status)}
                  </div>
                </div>
              </div>

              {/* ฟอร์มเพิ่มผู้พักอาศัย (เฉพาะห้องว่าง) */}
              {selectedRoom.status === 'vacant' && (
                <div className="resident-detail-card assign-resident-card">
                  <div className="card-sub-header">
                    <UserPlus size={16} className="inline mr-1" />
                    เพิ่มผู้พักอาศัยเข้าห้องนี้
                  </div>
                  <div className="assign-form">
                    <div className="assign-field">
                      <label className="lbl" htmlFor="assign-name">ชื่อผู้พัก *</label>
                      <input
                        id="assign-name"
                        type="text"
                        className="filter-search-input"
                        placeholder="เช่น สมชาย ใจดี"
                        value={assignName}
                        onChange={(e) => {
                          setAssignName(e.target.value);
                          if (assignError) setAssignError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAssignResident();
                        }}
                      />
                      {assignError && (
                        <div className="assign-error" style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                          {assignError}
                        </div>
                      )}
                    </div>
                    <div className="assign-field">
                      <label className="lbl" htmlFor="assign-phone">เบอร์โทรศัพท์</label>
                      <input
                        id="assign-phone"
                        type="tel"
                        className="filter-search-input"
                        placeholder="08x-xxx-xxxx"
                        value={assignPhone}
                        onChange={(e) => setAssignPhone(e.target.value)}
                      />
                    </div>
                    <div className="assign-field">
                      <label className="lbl" htmlFor="assign-date">วันเริ่มสัญญา</label>
                      <input
                        id="assign-date"
                        type="date"
                        className="filter-search-input"
                        value={assignDate}
                        onChange={(e) => setAssignDate(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="add-room-btn"
                      onClick={handleAssignResident}
                    >
                      <UserPlus size={16} />
                      <span>บันทึกและเปลี่ยนเป็น “มีผู้พักอาศัย”</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedRoom.status === 'occupied' && (
                <div className="resident-detail-card">
                  <div className="card-sub-header">ข้อมูลผู้พักอาศัยปัจจุบัน</div>
                  <div className="resident-row">
                    <div className="info-item">
                      <span className="lbl">ชื่อผู้พัก:</span>
                      <span className="val">{selectedRoom.residentName}</span>
                    </div>
                    <div className="info-item">
                      <span className="lbl">เบอร์โทรศัพท์:</span>
                      <span className="val">{selectedRoom.phone || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="lbl">วันเริ่มสัญญา:</span>
                      <span className="val">{selectedRoom.checkInDate || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="lbl">สถานะสัญญา:</span>
                      <span className="val text-blue-600 font-medium">● ปกติ</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Change Selector */}
              <div className="change-status-box">
                <div className="change-title">ปรับเปลี่ยนสถานะห้องพัก:</div>
                <div className="status-btn-group">
                  {(['occupied', 'vacant', 'cleaning', 'maintenance'] as RoomStatus[]).map((st) => {
                    // การเปลี่ยนเป็น "มีผู้พักอาศัย" ต้องกรอกชื่อผ่านฟอร์มด้านบนเท่านั้น
                    const needsResident = st === 'occupied' && selectedRoom.status !== 'occupied';
                    return (
                      <button
                        key={st}
                        disabled={needsResident}
                        title={needsResident ? 'กรุณาเพิ่มชื่อผู้พักผ่านฟอร์มเพิ่มผู้พักอาศัย (ห้องว่างเท่านั้น)' : undefined}
                        className={`status-btn ${st} ${selectedRoom.status === st ? 'current' : ''}`}
                        onClick={() => {
                          onUpdateRoomStatus(selectedRoom.id, st);
                          setSelectedRoom({ ...selectedRoom, status: st });
                        }}
                      >
                        {selectedRoom.status === st && <Check size={14} className="inline mr-1" />}
                        {getStatusThai(st)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal-cancel"
                onClick={closeRoom}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};