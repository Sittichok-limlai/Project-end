import React from 'react';
import { 
  DoorClosed, 
  Receipt, 
  Wrench, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  PackagePlus
} from 'lucide-react';
import type { AdminPage, Room, UtilityBill, RepairTicket } from '../../types';

interface DashboardViewProps {
  rooms: Room[];
  bills: UtilityBill[];
  repairs: RepairTicket[];
  onNavigate: (page: AdminPage) => void;
  onSelectBillForVerification: (bill: UtilityBill) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rooms,
  bills,
  repairs,
  onNavigate,
  onSelectBillForVerification
}) => {
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const vacantCount = rooms.filter(r => r.status === 'vacant').length;
  const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedCount / totalRooms) * 100);

  const pendingBills = bills.filter(b => b.status === 'pending_verification');
  const activeRepairs = repairs.filter(r => r.status === 'pending' || r.status === 'in_progress');

  return (
    <div className="dashboard-view-container">
      {/* Top Banner / Welcome */}
      <div className="dashboard-welcome-banner">
        <div>
          <h2 className="welcome-title">ภาพรวมระบบบริหารจัดการหอพักนักศึกษา</h2>
          <p className="welcome-desc">ยินดีต้อนรับสู่แดชบอร์ด Rmutt Residence · มหาวิทยาลัยราชมงคลธัญบุรี ประจำภาคการศึกษา 2/2568</p>
        </div>
        <div className="quick-action-button-group">
          
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="kpi-grid">
        {/* Card 1: Total Rooms */}
        <div className="kpi-card" onClick={() => onNavigate('rooms')}>
          <div className="kpi-header">
            <span className="kpi-label">ห้องพักทั้งหมด</span>
            <div className="kpi-icon-wrapper teal">
              <DoorClosed size={22} />
            </div>
          </div>
          <div className="kpi-main-stat">
            <span className="kpi-value">{totalRooms}</span>
            <span className="kpi-unit">ห้อง</span>
          </div>
          <div className="kpi-sub-badges">
            <span className="kpi-sub-pill occupied">พักอยู่ {occupiedCount}</span>
            <span className="kpi-sub-pill vacant">ว่าง {vacantCount}</span>
            <span className="kpi-sub-pill clean">ทำความสะอาด {cleaningCount}</span>
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="kpi-card" onClick={() => onNavigate('residents')}>
          <div className="kpi-header">
            <span className="kpi-label">อัตราการเข้าพัก</span>
            <div className="kpi-icon-wrapper emerald">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-main-stat">
            <span className="kpi-value">{occupancyRate}%</span>
            <span className="kpi-trend positive">
              <ArrowUpRight size={16} />
              +2.4% vs เดือนก่อน
            </span>
          </div>
          <div className="occupancy-progress-bar">
            <div className="bar-fill" style={{ width: `${occupancyRate}%` }}></div>
          </div>
          <div className="kpi-footer-text">นักศึกษาพักอาศัย {occupiedCount} คน จาก 120 เตียง</div>
        </div>

        {/* Card 3: Monthly Billing */}
        <div className="kpi-card" onClick={() => onNavigate('billing')}>
          <div className="kpi-header">
            <span className="kpi-label">ค่าเช่า & น้ำไฟ เดือน ก.พ.</span>
            <div className="kpi-icon-wrapper amber">
              <Receipt size={22} />
            </div>
          </div>
          <div className="kpi-main-stat">
            <span className="kpi-value">฿684,200</span>
            <span className="kpi-unit">ยอดรวม</span>
          </div>
          <div className="billing-status-splits">
            <span className="bill-split-tag paid">
              <CheckCircle2 size={13} />
              ชำระแล้ว 78%
            </span>
            <span className="bill-split-tag pending">
              <Clock size={13} />
              รอตรวจสลิป {pendingBills.length}
            </span>
          </div>
        </div>

        {/* Card 4: Maintenance Tickets */}
        <div className="kpi-card" onClick={() => onNavigate('repairs')}>
          <div className="kpi-header">
            <span className="kpi-label">รายการแจ้งซ่อมบำรุง</span>
            <div className="kpi-icon-wrapper rose">
              <Wrench size={22} />
            </div>
          </div>
          <div className="kpi-main-stat">
            <span className="kpi-value">{activeRepairs.length}</span>
            <span className="kpi-unit">รายการรอดำเนินการ</span>
          </div>
          <div className="kpi-sub-badges">
            <span className="kpi-sub-pill urgent">
              <AlertTriangle size={12} />
              เร่งด่วน 1
            </span>
            <span className="kpi-sub-pill normal">ปกติ 2</span>
            <span className="kpi-sub-pill completed">เสร็จสัปดาห์นี้ 8</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: OCCUPANCY BY FLOOR & SLIP APPROVAL QUEUE */}
      <div className="dashboard-content-split">
        {/* LEFT COLUMN: Floor Occupancy & Quick Stats */}
        <div className="content-box">
          <div className="box-header">
            <div>
              <h3 className="box-title">อัตราการเข้าพักแยกตามชั้น (Floors 1 - 4)</h3>
              <p className="box-sub">ตรวจสอบจำนวนห้องว่างและสถานะเรียลไทม์</p>
            </div>
            <button 
              className="box-link-btn"
              onClick={() => onNavigate('rooms')}
            >
              ดูแผนผังห้องทั้งหมด →
            </button>
          </div>

          <div className="floor-bars-list">
            {[
              { floor: 'ชั้น 1 (ห้อง 101 - 130)', occupied: 28, vacant: 1, cleaning: 1, total: 30 },
              { floor: 'ชั้น 2 (ห้อง 201 - 230)', occupied: 27, vacant: 2, cleaning: 0, maintenance: 1, total: 30 },
              { floor: 'ชั้น 3 (ห้อง 301 - 330)', occupied: 28, vacant: 1, cleaning: 1, total: 30 },
              { floor: 'ชั้น 4 (ห้อง 401 - 430)', occupied: 25, vacant: 4, cleaning: 1, total: 30 },
            ].map((f, idx) => {
              const pct = Math.round((f.occupied / f.total) * 100);
              return (
                <div key={idx} className="floor-bar-item">
                  <div className="floor-label-row">
                    <span className="floor-name">{f.floor}</span>
                    <span className="floor-stats">
                      <strong>{f.occupied}</strong> / {f.total} ห้อง ({pct}%)
                    </span>
                  </div>
                  <div className="multi-segmented-bar">
                    <div className="segment occupied" style={{ width: `${(f.occupied / f.total) * 100}%` }} title={`เข้าพัก: ${f.occupied}`}></div>
                    <div className="segment clean" style={{ width: `${(f.cleaning / f.total) * 100}%` }} title={`ทำความสะอาด: ${f.cleaning}`}></div>
                    {f.maintenance && (
                      <div className="segment maintenance" style={{ width: `${(f.maintenance / f.total) * 100}%` }} title={`ซ่อมบำรุง: ${f.maintenance}`}></div>
                    )}
                    <div className="segment vacant" style={{ width: `${(f.vacant / f.total) * 100}%` }} title={`ว่าง: ${f.vacant}`}></div>
                  </div>
                  <div className="floor-legend-micro">
                    <span>ว่าง: <strong>{f.vacant}</strong> ห้อง</span>
                    <span>ทำความสะอาด: <strong>{f.cleaning}</strong> ห้อง</span>
                    {f.maintenance ? <span>แจ้งซ่อม: <strong>{f.maintenance}</strong> ห้อง</span> : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="room-status-legend">
            <span className="legend-item"><span className="dot dot-occupied"></span> มีผู้พักอาศัย</span>
            <span className="legend-item"><span className="dot dot-vacant"></span> ห้องว่าง</span>
            <span className="legend-item"><span className="dot dot-cleaning"></span> รอทำความสะอาด</span>
            <span className="legend-item"><span className="dot dot-maintenance"></span> ปิดปรับปรุง</span>
          </div>
        </div>

        {/* RIGHT COLUMN: PENDING SLIP APPROVALS & URGENT REPAIRS */}
        <div className="content-box">
          <div className="box-header">
            <div>
              <h3 className="box-title">
                คิวตรวจสอบสลิปโอนเงิน 
                <span className="count-badge warning">{pendingBills.length} รายการ</span>
              </h3>
              <p className="box-sub">สลิปจากนักศึกษาที่ชำระผ่าน QR พร้อมเพย์ / Mobile Banking</p>
            </div>
            <button 
              className="box-link-btn"
              onClick={() => onNavigate('billing')}
            >
              ดูบิลทั้งหมด →
            </button>
          </div>

          <div className="pending-slips-list">
            {pendingBills.length === 0 ? (
              <div className="empty-notice">ไม่มีสลิปรอการตรวจสอบในขณะนี้</div>
            ) : (
              pendingBills.map((bill) => (
                <div key={bill.id} className="slip-verification-item">
                  <div className="slip-room-badge">
                    <span className="room-no">ห้อง {bill.roomNumber}</span>
                    <span className="room-type">฿{bill.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="slip-item-info">
                    <div className="resident-name">{bill.residentName}</div>
                    <div className="slip-sub">
                      <span>ค่าเช่า ฿{bill.rentAmount}</span>
                      <span>น้ำ ฿{bill.waterTotal}</span>
                      <span>ไฟ ฿{bill.elecTotal}</span>
                    </div>
                    <div className="slip-time">โอนเมื่อ {bill.paidAt || 'วันนี้'}</div>
                  </div>
                  <button 
                    className="verify-action-btn"
                    onClick={() => onSelectBillForVerification(bill)}
                  >
                    ตรวจสลิป
                  </button>
                </div>
              ))
            )}
          </div>

          <hr className="box-divider" />

          {/* Urgent Repairs section */}
          <div className="urgent-repairs-box">
            <div className="box-mini-header">
              <span className="mini-title">
                <AlertTriangle size={16} className="text-amber-500" />
                แจ้งซ่อมที่ต้องรีบดำเนินการ
              </span>
              <button 
                className="box-link-btn small"
                onClick={() => onNavigate('repairs')}
              >
                จัดการงานซ่อม →
              </button>
            </div>
            <div className="urgent-repair-card">
              <div className="repair-card-top">
                <span className="room-pill">ห้อง 103</span>
                <span className="cat-pill">เครื่องปรับอากาศ</span>
                <span className="urgent-tag">ด่วนมาก</span>
              </div>
              <div className="repair-card-desc">
                แอร์มีน้ำหยดลงบนโต๊ะทำงาน และช่วงเปิดลมแรงจะมีเสียงสั่นดัง
              </div>
              <div className="repair-card-footer">
                <span>ผู้แจ้ง: นายธนดล สิริวัฒนกุล</span>
                <span className="tech-assigned">มอบหมาย: ช่างสมชาย</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
