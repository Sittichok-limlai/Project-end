import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  UserPlus, 
  Download,
  Eye,
  X
} from 'lucide-react';
import type { Resident } from '../../types';

interface ResidentsViewProps {
  residents: Resident[];
}

export const ResidentsView: React.FC<ResidentsViewProps> = ({ residents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const faculties = Array.from(new Set(residents.map(r => r.faculty)));

  const filteredResidents = residents.filter(r => {
    if (facultyFilter !== 'all' && r.faculty !== facultyFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = r.name.toLowerCase().includes(term);
      const matchId = r.studentId.includes(term);
      const matchRoom = r.roomNumber.includes(term);
      if (!matchName && !matchId && !matchRoom) return false;
    }
    return true;
  });

  return (
    <div className="residents-view-container">
      {/* Title & Actions */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">ทะเบียนข้อมูลผู้พักอาศัย (Residents Directory)</h2>
          <p className="view-subtitle">รายชื่อนักศึกษาหอพัก Niva Residence ทั้งหมด 108 คน ประจำอาคาร A</p>
        </div>
        <div className="view-header-actions">
          <button className="add-room-btn secondary">
            <Download size={16} />
            <span>ส่งออก Excel</span>
          </button>
          <button className="add-room-btn">
            <UserPlus size={16} />
            <span>เพิ่มผู้พักใหม่</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="table-filter-bar">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัสนักศึกษา, ชื่อ-นามสกุล หรือเลขห้อง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>

        <div className="filter-select-group">
          <label>คณะ:</label>
          <select 
            value={facultyFilter} 
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">ทุกคณะวิชา</option>
            {faculties.map(fac => (
              <option key={fac} value={fac}>{fac}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RESIDENTS TABLE */}
      <div className="table-responsive-wrapper">
        <table className="styled-data-table">
          <thead>
            <tr>
              <th>ห้องพัก</th>
              <th>รหัสนักศึกษา / ชื่อ-สกุล</th>
              <th>คณะวิชา</th>
              <th>เบอร์โทรศัพท์</th>
              <th>อีเมลติดต่อ</th>
              <th>ระยะสัญญา</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((res) => (
              <tr key={res.id}>
                <td>
                  <span className="room-badge-table">ห้อง {res.roomNumber}</span>
                </td>
                <td>
                  <div className="resident-identity">
                    <div className="res-name">{res.name}</div>
                    <div className="res-id">{res.studentId}</div>
                  </div>
                </td>
                <td>
                  <span className="faculty-badge">{res.faculty}</span>
                </td>
                <td>
                  <div className="contact-cell">
                    <Phone size={13} className="text-gray-400" />
                    <span>{res.phone}</span>
                  </div>
                </td>
                <td>
                  <span className="text-slate-600 text-xs font-mono">{res.email}</span>
                </td>
                <td>
                  <div className="contract-dates">
                    <span>{res.checkInDate} ถึง {res.contractEndDate}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div className="table-action-btns">
                    <button
                      className="btn-action-view"
                      title="ดูข้อมูลรายละเอียด"
                      onClick={() => setSelectedResident(res)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-action-msg"
                      title="เปิดแชทติดต่อ"
                      onClick={() => alert(`เปิดแชทติดต่อสำหรับนักศึกษา ${res.name} (ห้อง ${res.roomNumber})`)}
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL VIEW RESIDENT */}
      {selectedResident && (
        <div className="modal-backdrop" onClick={() => setSelectedResident(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="modal-title">{selectedResident.name}</h3>
                  <p className="modal-sub">รหัส {selectedResident.studentId} · ห้องพัก {selectedResident.roomNumber}</p>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedResident(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-item-grid">
                <div className="detail-cell">
                  <div className="cell-label">คณะวิชา</div>
                  <div className="cell-value">{selectedResident.faculty}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">อีเมลมหาวิทยาลัย</div>
                  <div className="cell-value">{selectedResident.email}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">เบอร์โทรศัพท์ติดต่อ</div>
                  <div className="cell-value">{selectedResident.phone}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">ผู้ติดต่อฉุกเฉิน</div>
                  <div className="cell-value">{selectedResident.emergencyContact}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">วันเริ่มเข้าพัก</div>
                  <div className="cell-value">{selectedResident.checkInDate}</div>
                </div>
                <div className="detail-cell">
                  <div className="cell-label">วันสิ้นสุดสัญญา</div>
                  <div className="cell-value">{selectedResident.contractEndDate}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal-cancel"
                onClick={() => setSelectedResident(null)}
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
