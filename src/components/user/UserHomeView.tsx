import React from 'react';
import { 
  Receipt, 
  Package, 
  Wrench, 
  Bell, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import type { UserPage, Resident, UtilityBill, RepairTicket, UserParcel, DormNotice } from '../../types';

interface UserHomeViewProps {
  resident: Resident;
  bill?: UtilityBill;
  repairs: RepairTicket[];
  parcels: UserParcel[];
  notices: DormNotice[];
  onNavigate: (page: UserPage) => void;
  onOpenDigitalPass: () => void;
}

export const UserHomeView: React.FC<UserHomeViewProps> = ({
  resident,
  bill,
  repairs,
  parcels,
  notices,
  onNavigate,
  onOpenDigitalPass
}) => {
  const roomRepairs = repairs.filter(r => r.roomNumber === resident.roomNumber);
  const roomParcels = parcels.filter(p => p.roomNumber === resident.roomNumber && p.status === 'ready_for_pickup');
  const activeRepair = roomRepairs.find(r => r.status === 'pending' || r.status === 'in_progress');

  return (
    <div className="user-desktop-home-container">
      {/* DESKTOP WELCOME HERO BANNER */}
      <div className="user-desktop-hero-banner">
        <div className="hero-left-info">
          <div className="hero-greeting-line">
            <h2 className="greeting-title">สวัสดี, {resident.name} 👋</h2>
            <span className="student-badge-tag">{resident.faculty} · รหัส {resident.studentId}</span>
          </div>
          <p className="greeting-sub">
            ยินดีต้อนรับสู่ระบบพอร์ทัลบริการผู้พักอาศัย หอพักนักศึกษา Niva Residence อาคาร A
          </p>
        </div>

        <div className="hero-right-actions">
          
          <button 
            className="hero-action-btn secondary"
            onClick={() => onNavigate('billing')}
          >
            <Receipt size={17} />
            <span>เช็คบิลค่าน้ำ-ไฟ</span>
          </button>
        </div>
      </div>

      {/* 4 KPI METRIC CARDS */}
      <div className="user-kpi-grid">
        {/* KPI 1: Monthly Bill */}
        <div className="user-kpi-card" onClick={() => onNavigate('billing')}>
          <div className="kpi-card-header">
            <span className="kpi-title">บิลค่าเช่า & น้ำไฟ ({bill?.month.split(' ')[0] || 'ก.พ.'})</span>
            <div className="kpi-icon-wrap amber">
              <Receipt size={20} />
            </div>
          </div>
          <div className="kpi-stat-number">
            ฿{bill ? bill.grandTotal.toLocaleString() : '0'}
          </div>
          <div className="kpi-status-row">
            {bill?.status === 'paid' && (
              <span className="status-chip paid">
                <CheckCircle2 size={12} className="inline mr-1" /> ชำระแล้ว
              </span>
            )}
            {bill?.status === 'pending_verification' && (
              <span className="status-chip pending">
                <Clock size={12} className="inline mr-1" /> รอตรวจสลิป
              </span>
            )}
            {(bill?.status === 'unpaid' || bill?.status === 'overdue') && (
              <span className="status-chip unpaid">
                <AlertCircle size={12} className="inline mr-1" /> รอชำระ (ครบกำหนด 25 ก.พ.)
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Parcels */}
        <div className="user-kpi-card" onClick={() => onNavigate('parcels')}>
          <div className="kpi-card-header">
            <span className="kpi-title">พัสดุรอรับที่นิติ</span>
            <div className="kpi-icon-wrap blue">
              <Package size={20} />
            </div>
          </div>
          <div className="kpi-stat-number">
            {roomParcels.length} <span className="kpi-unit">ชิ้น</span>
          </div>
          <div className="kpi-status-row">
            {roomParcels.length > 0 ? (
              <span className="status-chip active-blue">
                รับได้ที่ สนง.นิติบุคคล ชั้น 1
              </span>
            ) : (
              <span className="status-chip normal">ไม่มีพัสดุตกค้าง</span>
            )}
          </div>
        </div>

        {/* KPI 3: Repairs */}
        <div className="user-kpi-card" onClick={() => onNavigate('repairs')}>
          <div className="kpi-card-header">
            <span className="kpi-title">งานแจ้งซ่อมของห้องพัก</span>
            <div className="kpi-icon-wrap rose">
              <Wrench size={20} />
            </div>
          </div>
          <div className="kpi-stat-number">
            {roomRepairs.filter(r => r.status !== 'completed').length} <span className="kpi-unit">รายการ</span>
          </div>
          <div className="kpi-status-row">
            {activeRepair ? (
              <span className="status-chip active-amber">
                {activeRepair.status === 'in_progress' ? 'ช่างกำลังซ่อม' : 'รอดำเนินการ'}
              </span>
            ) : (
              <span className="status-chip paid">อุปกรณ์ในห้องปกติ</span>
            )}
          </div>
        </div>

        {/* KPI 4: Contract Period */}
        <div className="user-kpi-card" onClick={() => onNavigate('profile')}>
          <div className="kpi-card-header">
            <span className="kpi-title">สัญญาห้อง {resident.roomNumber}</span>
            <div className="kpi-icon-wrap emerald">
              <Calendar size={20} />
            </div>
          </div>
          <div className="kpi-stat-number">
            เตียงเดี่ยว <span className="kpi-unit">Standard</span>
          </div>
          <div className="kpi-status-row">
            <span className="status-chip normal">
              สิ้นสุด {resident.contractEndDate}
            </span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN DESKTOP WORKSPACE */}
      <div className="user-desktop-workspace-grid">
        {/* LEFT COLUMN: DETAILED BILL BREAKDOWN & PAYMENT */}
        <div className="content-box">
          <div className="box-header">
            <div>
              <h3 className="box-title">
                <Receipt className="text-blue-600" size={20} />
                <span>บิลค่าใช้จ่ายประจำเดือน {bill?.month}</span>
              </h3>
              <p className="box-sub">ตรวจสอบค่าเช่าและหน่วยมิเตอร์น้ำ-ไฟของห้อง {resident.roomNumber}</p>
            </div>
            {bill && (
              <div className={`bill-status-pill ${bill.status}`}>
                {bill.status === 'paid' && '✓ ชำระเงินเรียบร้อยแล้ว'}
                {bill.status === 'pending_verification' && '⏳ รอเจ้าหน้าที่ตรวจสลิป'}
                {(bill.status === 'unpaid' || bill.status === 'overdue') && '⚠️ รอชำระเงิน'}
              </div>
            )}
          </div>

          {bill ? (
            <div className="bill-desktop-itemized">
              <table className="desktop-bill-table">
                <thead>
                  <tr>
                    <th>รายการค่าใช้จ่าย</th>
                    <th>หน่วยมิเตอร์ (ก่อนหน้า → ปัจจุบัน)</th>
                    <th>อัตราต่อหน่วย</th>
                    <th style={{ textAlign: 'right' }}>จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="font-semibold text-slate-800">ค่าเช่าห้องพักรายเดือน</div>
                      <div className="text-xs text-slate-500">ห้องพักปรับอากาศ อาคาร A</div>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{bill.rentAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="font-semibold text-slate-800">ค่าน้ำประปา</div>
                      <div className="text-xs text-slate-500">มิเตอร์ใช้น้ำประจำห้อง</div>
                    </td>
                    <td>{bill.waterPrev} → {bill.waterCurr} ({bill.waterCurr - bill.waterPrev} หน่วย)</td>
                    <td>฿{bill.waterUnitRate} / หน่วย</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{bill.waterTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="font-semibold text-slate-800">ค่าไฟฟ้า</div>
                      <div className="text-xs text-slate-500">มิเตอร์ไฟฟ้าประจำห้อง</div>
                    </td>
                    <td>{bill.elecPrev} → {bill.elecCurr} ({bill.elecCurr - bill.elecPrev} หน่วย)</td>
                    <td>฿{bill.elecUnitRate} / หน่วย</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{bill.elecTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="font-semibold text-slate-800">ค่าบำรุงรักษาส่วนกลาง</div>
                      <div className="text-xs text-slate-500">ลิฟต์, แม่บ้าน, Wi-Fi</div>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{bill.commonFee.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3} style={{ textAlign: 'right', fontSize: '15px' }}>ยอดรวมสุทธิทั้งสิ้น:</th>
                    <th style={{ textAlign: 'right', fontSize: '20px', color: '#1d6fd6' }}>
                      ฿{bill.grandTotal.toLocaleString()}
                    </th>
                  </tr>
                </tfoot>
              </table>

              <div className="desktop-bill-footer-cta">
                <button
                  className="add-room-btn"
                  onClick={() => onNavigate('billing')}
                >
                  <Receipt size={16} />
                  <span>{bill.status === 'paid' ? 'ดูใบเสร็จรับเงิน (E-Receipt)' : 'ชำระเงินและแนบสลิปโอน PromptPay'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-notice">ไม่พบบิลค่าใช้จ่ายประจำเดือนนี้</div>
          )}
        </div>

        {/* RIGHT COLUMN: READY PARCELS & ACTIVE REPAIR */}
        <div className="user-right-col-stack">
          {/* Card 1: Ready Parcels */}
          <div className="content-box">
            <div className="box-header">
              <div>
                <h3 className="box-title">
                  <Package className="text-blue-600" size={20} />
                  <span>พัสดุรอรับที่นิติบุคคล ({roomParcels.length} ชิ้น)</span>
                </h3>
                <p className="box-sub">ติดต่อรับได้ที่ห้องนิติ ชั้น 1 (เวลา 09:00 - 21:00 น.)</p>
              </div>
              <button 
                className="box-link-btn"
                onClick={() => onNavigate('parcels')}
              >
                ดูพัสดุทั้งหมด →
              </button>
            </div>

            {roomParcels.length === 0 ? (
              <div className="empty-notice py-4">
                <CheckCircle2 size={24} className="text-emerald-500 inline mr-2" />
                <span>ไม่มีพัสดุตกค้างสำหรับห้อง {resident.roomNumber}</span>
              </div>
            ) : (
              <div className="desktop-parcels-list">
                {roomParcels.map(p => (
                  <div key={p.id} className="desktop-parcel-row">
                    <div className="parcel-carrier-tag">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mr-1"></span>
                      ถึงหอพักแล้ว
                    </div>
                    <div className="parcel-track-text">รหัส: {p.trackingNumber}</div>
                    <div className="parcel-arrive-text">ถึงเมื่อ {p.arrivedAt}</div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Active Repair Stepper */}
          <div className="content-box">
            <div className="box-header">
              <div>
                <h3 className="box-title">
                  <Wrench className="text-amber-600" size={20} />
                  <span>สถานะงานแจ้งซ่อมบำรุง</span>
                </h3>
                <p className="box-sub">ติดตามขั้นตอนการดำเนินงานของทีมช่าง</p>
              </div>
              <button 
                className="box-link-btn"
                onClick={() => onNavigate('repairs')}
              >
                แจ้งซ่อมเพิ่ม →
              </button>
            </div>

            {activeRepair ? (
              <div className="desktop-active-repair-box">
                <div className="active-repair-header">
                  <span className="repair-item-title">{activeRepair.title}</span>
                  <span className="repair-category-pill">{activeRepair.category}</span>
                </div>
                <p className="repair-item-desc">{activeRepair.description}</p>

                {/* Desktop Stepper */}
                <div className="repair-timeline-stepper">
                  <div className={`step-node ${activeRepair.status ? 'active' : ''}`}>
                    <div className="node-dot">1</div>
                    <span className="node-label">แจ้งเรื่องแล้ว</span>
                  </div>
                  <div className={`step-line ${activeRepair.status !== 'pending' ? 'active' : ''}`}></div>
                  <div className={`step-node ${activeRepair.status === 'in_progress' || activeRepair.status === 'completed' ? 'active' : ''}`}>
                    <div className="node-dot">2</div>
                    <span className="node-label">มอบหมายช่าง</span>
                  </div>
                  <div className={`step-line ${activeRepair.status === 'completed' ? 'active' : ''}`}></div>
                  <div className={`step-node ${activeRepair.status === 'completed' ? 'active' : ''}`}>
                    <div className="node-dot">3</div>
                    <span className="node-label">ซ่อมเสร็จสิ้น</span>
                  </div>
                </div>

                <div className="repair-card-footer mt-2">
                  <span>แจ้งเมื่อ: {activeRepair.reportedAt}</span>
                  <span className="tech-assigned">
                    {activeRepair.technician ? `ช่างผู้รับผิดชอบ: ${activeRepair.technician}` : 'กำลังจัดคิวช่าง'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty-notice py-4">
                <CheckCircle2 size={24} className="text-emerald-500 inline mr-2" />
                <span>ไม่มีรายการแจ้งซ่อมที่ค้างอยู่ อุปกรณ์ในห้องพักสมบูรณ์</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DORM ANNOUNCEMENT BOARD */}
      <div className="content-box">
        <div className="box-header">
          <div>
            <h3 className="box-title">
              <Bell className="text-blue-600" size={20} />
              <span>ประกาศข่าวสารและกิจกรรมหอพัก</span>
            </h3>
            <p className="box-sub">ประกาศทางการจากสำนักงานบริหารหอพักนักศึกษา Niva Residence</p>
          </div>
          <button 
            className="box-link-btn"
            onClick={() => onNavigate('notices')}
          >
            ดูประกาศทั้งหมด ({notices.length}) →
          </button>
        </div>

        <div className="desktop-notices-grid">
          {notices.map((n) => (
            <div key={n.id} className="desktop-notice-card">
              <div className="notice-card-top">
                <span className={`notice-badge-pill ${n.type}`}>{n.type}</span>
                <span className="notice-date">{n.sentAt}</span>
              </div>
              <h4 className="notice-card-heading">{n.title}</h4>
              <div className="notice-card-target-text">กลุ่มเป้าหมาย: {n.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
