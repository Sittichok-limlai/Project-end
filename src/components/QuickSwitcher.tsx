import React, { useState } from 'react';
import { Layers, ChevronUp, ChevronDown, Check, User, ShieldCheck } from 'lucide-react';
import type { AdminPage, UserPage, PortalMode } from '../types';

interface QuickSwitcherProps {
  portalMode: PortalMode;
  onSelectPortalMode: (mode: PortalMode) => void;
  adminPage: AdminPage;
  onSelectAdminPage: (page: AdminPage) => void;
  userPage: UserPage;
  onSelectUserPage: (page: UserPage) => void;
}

export const QuickSwitcher: React.FC<QuickSwitcherProps> = ({
  portalMode,
  onSelectPortalMode,
  adminPage,
  onSelectAdminPage,
  userPage,
  onSelectUserPage
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const adminScreens: { id: AdminPage; label: string; figmaTag: string }[] = [
    { id: 'login', label: 'เข้าสู่ระบบแอดมิน (Desktop)', figmaTag: 'Admin 01 · Figma' },
    { id: 'dashboard', label: 'แดชบอร์ดภาพรวมหอพัก', figmaTag: 'Admin 02' },
    { id: 'rooms', label: 'ผังห้องพัก 120 ห้อง (อาคาร A)', figmaTag: 'Admin 03' },
    { id: 'residents', label: 'ทะเบียนข้อมูลผู้พักอาศัย', figmaTag: 'Admin 04' },
    { id: 'billing', label: 'บิลค่าเช่า & ค่าน้ำค่าไฟ & ตรวจสลิป', figmaTag: 'Admin 05' },
    { id: 'repairs', label: 'รายการแจ้งซ่อมบำรุง', figmaTag: 'Admin 06' },
    { id: 'chat', label: 'แชทติดต่อผู้พักอาศัย (Chat Hub)', figmaTag: 'Admin 07' },
    { id: 'settings', label: 'ตั้งค่าระบบและอัตราค่าน้ำไฟ', figmaTag: 'Admin 08' },
  ];

  const userScreens: { id: UserPage; label: string; tag: string }[] = [
    { id: 'home', label: 'หน้าหลักนักศึกษา (Home & บัตรผ่าน)', tag: 'User 01' },
    { id: 'billing', label: 'ชำระค่าเช่า-น้ำไฟ & แนบสลิป & ใบเสร็จ', tag: 'User 02' },
    { id: 'repairs', label: 'แบบฟอร์มแจ้งซ่อม & ติดตามช่าง', tag: 'User 03' },
    { id: 'parcels', label: 'กล่องพัสดุ & QR สแกนรับของ', tag: 'User 04' },
    { id: 'chat', label: 'แชทติดต่อธุรการ / นิติบุคคล', tag: 'User 05' },
    { id: 'notices', label: 'ประกาศหอพัก & กฎระเบียบ', tag: 'User 06' },
    { id: 'profile', label: 'ข้อมูลนักศึกษา & สัญญา & Wi-Fi', tag: 'User 07' },
  ];

  return (
    <div className="quick-screen-switcher">
      {isOpen && (
        <div className="switcher-dropdown-panel wide">
          {/* PORTAL MODE TOGGLE */}
          <div className="portal-mode-toggle-row">
            <button
              className={`mode-tab-btn ${portalMode === 'admin' ? 'active admin' : ''}`}
              onClick={() => onSelectPortalMode('admin')}
            >
              <ShieldCheck size={16} />
              <span>ฝั่งเจ้าหน้าที่ (Admin)</span>
            </button>
            <button
              className={`mode-tab-btn ${portalMode === 'user' ? 'active user' : ''}`}
              onClick={() => onSelectPortalMode('user')}
            >
              <User size={16} />
              <span>ฝั่งนักศึกษา (User)</span>
            </button>
          </div>

          <div className="switcher-panel-header">
            <span className="font-semibold text-slate-700">
              {portalMode === 'admin' ? 'เลือกดูหน้าจอฝั่ง Admin (Figma)' : 'เลือกดูหน้าจอฝั่ง User (นักศึกษา)'}
            </span>
          </div>

          <div className="switcher-items-list">
            {portalMode === 'admin' ? (
              adminScreens.map(s => (
                <button
                  key={s.id}
                  className={`switcher-item-btn ${adminPage === s.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectAdminPage(s.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="switcher-btn-text">
                    <span className="figma-code">{s.figmaTag}</span>
                    <span className="screen-title">{s.label}</span>
                  </div>
                  {adminPage === s.id && <Check size={16} className="text-blue-500" />}
                </button>
              ))
            ) : (
              userScreens.map(s => (
                <button
                  key={s.id}
                  className={`switcher-item-btn ${userPage === s.id ? 'active user-active' : ''}`}
                  onClick={() => {
                    onSelectUserPage(s.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="switcher-btn-text">
                    <span className="figma-code user-code">{s.tag}</span>
                    <span className="screen-title">{s.label}</span>
                  </div>
                  {userPage === s.id && <Check size={16} className="text-emerald-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER PILL */}
      <button
        className={`quick-switcher-pill-trigger ${portalMode === 'user' ? 'user-mode-pill' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="สลับโหมดและหน้าจอ Mockup"
      >
        <Layers size={18} className={portalMode === 'user' ? 'text-emerald-400' : 'text-sky-400'} />
        <span className="current-screen-name">
          {portalMode === 'admin' 
            ? `Admin: ${adminScreens.find(s => s.id === adminPage)?.label || 'แอดมิน'}`
            : `User: ${userScreens.find(s => s.id === userPage)?.label || 'นักศึกษา'}`}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};
