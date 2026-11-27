import React, { useState } from 'react';
import { 
  Home, 
  Receipt, 
  Wrench, 
  Package, 
  User, 
  Bell, 
  MessageCircle,
  QrCode, 
  X,
  PhoneCall,
  Building,
  ShieldCheck
} from 'lucide-react';
import type { UserPage, Resident, UtilityBill, UserParcel } from '../../types';

import logoRmutt from '../../assets/LogoRmutt.png';

interface UserLayoutProps {
  currentPage: UserPage;
  onNavigate: (page: UserPage) => void;
  currentResident: Resident;
  onSwitchResident: (residentId: string) => void;
  allResidents: Resident[];
  currentBill?: UtilityBill;
  parcels: UserParcel[];
  onSwitchToAdmin: () => void;
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  currentPage,
  onNavigate,
  currentResident,
  onSwitchResident,
  allResidents,
  currentBill,
  parcels,
  onSwitchToAdmin,
  children
}) => {
  const [showQrPass, setShowQrPass] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const pendingParcels = parcels.filter(
    p => p.roomNumber === currentResident.roomNumber && p.status === 'ready_for_pickup'
  );

  const menuItems = [
    { id: 'home' as UserPage, label: 'หน้าหลักและภาพรวม', icon: Home },
    { 
      id: 'billing' as UserPage, 
      label: 'ค่าเช่า & ค่าน้ำ-ไฟ', 
      icon: Receipt,
      badge: currentBill && currentBill.status !== 'paid' ? 'รอชำระ' : undefined,
      badgeType: 'warning'
    },
    { id: 'repairs' as UserPage, label: 'รายการแจ้งซ่อมห้อง', icon: Wrench },
    { 
      id: 'parcels' as UserPage, 
      label: 'พัสดุของฉัน', 
      icon: Package,
      badge: pendingParcels.length > 0 ? `${pendingParcels.length} ชิ้น` : undefined,
      badgeType: 'info'
    },
    { id: 'notices' as UserPage, label: 'ประกาศ & ระเบียบหอพัก', icon: Bell },
    { 
      id: 'chat' as UserPage, 
      label: 'แชทติดต่อธุรการ / นิติ', 
      icon: MessageCircle,
      badge: '1 ใหม่',
      badgeType: 'info'
    },
    { id: 'profile' as UserPage, label: 'ข้อมูลสัญญา & โปรไฟล์', icon: User },
  ];

  return (
    <div className="user-web-app-container">
      {/* SIDEBAR (DESKTOP WEB LAYOUT) */}
      <aside className="user-web-sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-logo">
            <img src={logoRmutt} alt="RMUTT" className="logo-img" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name">Rmutt</span>
            <span className="brand-sub">ระบบนักศึกษาและผู้พักอาศัย</span>
          </div>
        </div>

        {/* Student Active Room Card in Sidebar */}
        <div className="sidebar-resident-badge-box">
          <div className="res-badge-top">
            <span className="res-room-num">ห้อง {currentResident.roomNumber}</span>
            <span className="res-room-type">อาคาร A</span>
          </div>
          <div className="res-name-text">{currentResident.name}</div>
          <div className="res-faculty-text">{currentResident.faculty}</div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">เมนูบริการนักศึกษา</div>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`nav-button ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge ${item.badgeType === 'warning' ? 'warning' : 'urgent'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          
          
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="sidebar-user-footer">
          <div className="user-avatar-circle student">
            <span>{currentResident.name.charAt(3) || 'น'}</span>
          </div>
          <div className="user-details">
            <div className="user-name">{currentResident.name}</div>
            <div className="user-role">รหัส: {currentResident.studentId}</div>
          </div>
          <button
            onClick={onSwitchToAdmin}
            className="sidebar-switch-mode-btn"
            title="สลับไปโหมดผู้ดูแลหอพัก (Admin)"
          >
            <ShieldCheck size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN DESKTOP WRAPPER */}
      <div className="user-main-wrapper">
        {/* TOPBAR */}
        <header className="user-topbar">
          <div className="topbar-left">
            <div className="topbar-dorm-tag">
              <Building size={16} className="building-icon" />
              <span>มหาวิทยาลัยนิวา · อาคาร A (ห้อง {currentResident.roomNumber})</span>
            </div>
          </div>

          <div className="topbar-center">
            {/* Resident Switcher Dropdown */}
            <div className="resident-selector-bar">
              <span className="selector-lbl">จำลองสลับดูห้อง:</span>
              <select
                value={currentResident.id}
                onChange={(e) => onSwitchResident(e.target.value)}
                className="resident-top-select"
              >
                {allResidents.map(r => (
                  <option key={r.id} value={r.id}>
                    ห้อง {r.roomNumber} - {r.name} ({r.faculty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="topbar-right">
            

            <button 
              className="topbar-contact-btn"
              onClick={() => setShowContactModal(true)}
            >
              <PhoneCall size={16} />
              <span>สายนิติ/ฉุกเฉิน</span>
            </button>

            <button
              onClick={onSwitchToAdmin}
              className="topbar-switch-admin-pill"
              title="สลับไปยังหน้าจอผู้ดูแลหอพัก"
            >
              <ShieldCheck size={16} />
              <span>สลับไปฝั่งแอดมิน</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="user-page-content">
          {children}
        </main>
      </div>

      {/* QR DIGITAL PASS MODAL */}
      {showQrPass && (
        <div className="modal-backdrop" onClick={() => setShowQrPass(false)}>
          <div className="modal-container digital-pass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <QrCode size={22} />
                </div>
                <div>
                  <h3 className="modal-title">Niva Digital Resident Pass</h3>
                  <p className="modal-sub">บัตรผ่านประตูหอพักดิจิทัล · ห้อง {currentResident.roomNumber}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowQrPass(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body text-center pass-body">
              <div className="pass-card">
                <div className="pass-student-name">{currentResident.name}</div>
                <div className="pass-student-id">รหัสนักศึกษา: {currentResident.studentId}</div>
                <div className="pass-room">อาคาร A · ห้องพัก {currentResident.roomNumber} ({currentResident.faculty})</div>

                <div className="qr-large-box">
                  <div className="qr-mock-matrix">
                    <QrCode size={190} className="text-slate-900" />
                  </div>
                  <div className="qr-timer-note">● สแกนเพื่อเปิดประตูกั้นทางเข้าหอพัก (อัปเดตทุก 60 วิ)</div>
                </div>

                <div className="pass-footer-validity">
                  สัญญาเข้าพักถึง: {currentResident.contractEndDate} · นโยบายความปลอดภัย Niva
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowQrPass(false)}>
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY / CONTACT OFFICE MODAL */}
      {showContactModal && (
        <div className="modal-backdrop" onClick={() => setShowContactModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h3 className="modal-title">ติดต่อสำนักงานหอพัก & ฉุกเฉิน</h3>
                  <p className="modal-sub">มหาวิทยาลัยนิวา · อาคาร A</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowContactModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-list-box">
                <div className="contact-row">
                  <div>
                    <div className="contact-name">สำนักงานนิติบุคคลหอพัก (ชั้น 1)</div>
                    <div className="contact-desc">เวลาทำการ 08:30 - 18:00 น.</div>
                  </div>
                  <a href="tel:021234567" className="call-btn">โทร 02 123 4567</a>
                </div>
                <div className="contact-row">
                  <div>
                    <div className="contact-name">รปภ. ประจำป้อมหน้าหอ (24 ชั่วโมง)</div>
                    <div className="contact-desc">กรณีลืมกุญแจ, สัตว์มีพิษ, หรือเหตุฉุกเฉิน</div>
                  </div>
                  <a href="tel:021234568" className="call-btn urgent">โทร 02 123 4568</a>
                </div>
                <div className="contact-row">
                  <div>
                    <div className="contact-name">แชทออนไลน์กับนิติบุคคล</div>
                    <div className="contact-desc">ติดต่อสอบถาม แจ้งซ่อมบำรุง หรือติดตามพัสดุ</div>
                  </div>
                  <button 
                    className="call-btn" 
                    onClick={() => {
                      setShowContactModal(false);
                      onNavigate('chat');
                    }}
                  >
                    เปิดห้องแชท
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowContactModal(false)}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
