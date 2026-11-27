import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  User, 
  Search, 
  Check
} from 'lucide-react';
import type { RepairTicket, RepairStatus, RepairPriority } from '../../types';

interface RepairsViewProps {
  repairs: RepairTicket[];
  onUpdateRepairStatus: (ticketId: string, newStatus: RepairStatus) => void;
  onAssignTechnician: (ticketId: string, techName: string) => void;
}

export const RepairsView: React.FC<RepairsViewProps> = ({
  repairs,
  onUpdateRepairStatus,
  onAssignTechnician
}) => {
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = repairs.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchRoom = r.roomNumber.toLowerCase().includes(term);
      const matchTitle = r.title.toLowerCase().includes(term);
      const matchTech = r.technician?.toLowerCase().includes(term);
      if (!matchRoom && !matchTitle && !matchTech) return false;
    }
    return true;
  });

  const getPriorityBadge = (p: RepairPriority) => {
    switch (p) {
      case 'ด่วนมาก':
        return <span className="priority-badge urgent"><AlertTriangle size={12} /> ด่วนมาก</span>;
      case 'ปกติ':
        return <span className="priority-badge normal">ปกติ</span>;
      case 'รอได้':
        return <span className="priority-badge low">รอได้</span>;
    }
  };

  const getStatusBadge = (s: RepairStatus) => {
    switch (s) {
      case 'pending':
        return <span className="repair-status-pill pending"><Clock size={13} /> รอดำเนินการ</span>;
      case 'in_progress':
        return <span className="repair-status-pill in_progress"><Wrench size={13} /> กำลังดำเนินการ</span>;
      case 'completed':
        return <span className="repair-status-pill completed"><CheckCircle2 size={13} /> ซ่อมเสร็จสิ้น</span>;
      case 'cancelled':
        return <span className="repair-status-pill cancelled">ยกเลิก</span>;
    }
  };

  return (
    <div className="repairs-view-container">
      {/* Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">รายการแจ้งซ่อมบำรุง (Maintenance & Repairs)</h2>
          <p className="view-subtitle">ติดตามสถานะงานซ่อม มอบหมายช่างประจำอาคาร และแจ้งผลผ่าน LINE OA</p>
        </div>
        <div className="view-header-actions">
          <button 
            className="add-room-btn"
            onClick={() => alert('เปิดแบบฟอร์มเปิดใบแจ้งซ่อมใหม่โดยเจ้าหน้าที่')}
          >
            <Plus size={16} />
            <span>เปิดใบแจ้งซ่อมใหม่</span>
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="table-filter-bar">
        <div className="status-chips-group">
          <button
            className={`status-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            ทั้งหมด ({repairs.length})
          </button>
          <button
            className={`status-chip urgent ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            <Clock size={14} className="inline mr-1" />
            รอดำเนินการ ({repairs.filter(r => r.status === 'pending').length})
          </button>
          <button
            className={`status-chip in_progress ${statusFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in_progress')}
          >
            <Wrench size={14} className="inline mr-1" />
            กำลังซ่อม ({repairs.filter(r => r.status === 'in_progress').length})
          </button>
          <button
            className={`status-chip completed ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            <CheckCircle2 size={14} className="inline mr-1" />
            เสร็จสิ้น ({repairs.filter(r => r.status === 'completed').length})
          </button>
        </div>

        <div className="search-input-group">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="ค้นหาเลขห้อง, อาการแจ้งซ่อม, หรือชื่อช่าง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>
      </div>

      {/* TICKETS LIST */}
      <div className="repair-tickets-grid">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className={`repair-ticket-card status-${ticket.status}`}>
            <div className="ticket-card-header">
              <div className="ticket-left-info">
                <span className="ticket-room-pill">ห้อง {ticket.roomNumber}</span>
                <span className="ticket-cat-tag">{ticket.category}</span>
              </div>
              <div className="ticket-right-info">
                {getPriorityBadge(ticket.priority)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>

            <h3 className="ticket-title">{ticket.title}</h3>
            <p className="ticket-description">{ticket.description}</p>

            <div className="ticket-meta-box">
              <div className="meta-line">
                <span className="meta-lbl">ผู้แจ้ง:</span>
                <span className="meta-val">{ticket.residentName}</span>
              </div>
              <div className="meta-line">
                <span className="meta-lbl">เวลาแจ้ง:</span>
                <span className="meta-val">{ticket.reportedAt}</span>
              </div>
              <div className="meta-line">
                <span className="meta-lbl">ช่างผู้รับผิดชอบ:</span>
                <span className="meta-val text-blue-800 font-semibold">
                  {ticket.technician || 'ยังไม่ได้มอบหมายช่าง'}
                </span>
              </div>
            </div>

            <div className="ticket-card-actions">
              {ticket.status === 'pending' && (
                <button
                  className="btn-assign-tech"
                  onClick={() => onAssignTechnician(ticket.id, 'ช่างสมชาย (ช่างประจำอาคาร)')}
                >
                  <User size={15} />
                  <span>มอบหมายช่างสมชาย</span>
                </button>
              )}
              {ticket.status === 'in_progress' && (
                <button
                  className="btn-complete-repair"
                  onClick={() => onUpdateRepairStatus(ticket.id, 'completed')}
                >
                  <Check size={15} />
                  <span>บันทึกซ่อมเสร็จสิ้น</span>
                </button>
              )}
              {ticket.status === 'completed' && (
                <div className="completed-check-tag">
                  <CheckCircle2 size={15} className="text-emerald-600 inline mr-1" />
                  <span>ซ่อมเสร็จสิ้นแล้วเมื่อ {ticket.completedAt || 'วานนี้'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
