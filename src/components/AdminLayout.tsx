import React from "react";
import {
  LayoutDashboard,
  DoorClosed,
  Users,
  Receipt,
  Wrench,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  Search,
  Building,
  ExternalLink,
} from "lucide-react";
import type { AdminPage } from "../types";

import logoRmutt from "../assets/LogoRmutt.png";

interface AdminLayoutProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  children,
}) => {
  const menuItems = [
    {
      id: "dashboard" as AdminPage,
      label: "แดชบอร์ดภาพรวม",
      icon: LayoutDashboard,
    },
    {
      id: "rooms" as AdminPage,
      label: "จัดการห้องพัก",
      icon: DoorClosed,
      badge: "120",
    },
    {
      id: "residents" as AdminPage,
      label: "ข้อมูลผู้พักอาศัย",
      icon: Users,
      badge: "108",
    },
    {
      id: "billing" as AdminPage,
      label: "ค่าเช่า & ค่าน้ำค่าไฟ",
      icon: Receipt,
      badge: "2 รอยืนยัน",
    },
    {
      id: "repairs" as AdminPage,
      label: "รายการแจ้งซ่อม",
      icon: Wrench,
      badge: "1 ด่วน",
    },
    {
      id: "chat" as AdminPage,
      label: "แชทติดต่อผู้พักอาศัย",
      icon: MessageCircle,
      badge: "2 ใหม่",
    },
    { id: "settings" as AdminPage, label: "ตั้งค่าระบบ", icon: Settings },
  ];

  return (
    <div className="admin-app-container">
      {/* SIDEBAR (DEEP FOREST TEAL) */}
      <aside className="admin-sidebar">
        {/* Top Brand */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-logo">
            <img src={logoRmutt} alt="RMUTT" className="logo-img" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}/>
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name">Rmutt</span>
            <span className="brand-sub">ระบบจัดการหอพักนักศึกษา</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">เมนูหลัก (MAIN MENU)</div>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`nav-button ${isActive ? "active" : ""}`}
                  >
                    <Icon size={19} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`nav-badge ${item.badge.includes("ด่วน") ? "urgent" : item.badge.includes("รอ") ? "warning" : ""}`}
                      >
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
          <div className="user-avatar-circle">
            <span>NW</span>
          </div>
          <div className="user-details">
            <div className="user-name">อ.ณัฐวุฒิ วิจิตรสกล</div>
            <div className="user-role">ผู้จัดการหอพัก (Super Admin)</div>
          </div>
          <button
            onClick={onLogout}
            className="sidebar-logout-btn"
            title="ออกจากระบบ"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main-wrapper">
        {/* TOP HEADER BAR */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <div className="topbar-dorm-tag">
              <Building size={16} className="building-icon" />
              <span>มหาวิทยาลัยราชมงคลธัญบุรี · อาคาร A (120 ห้อง)</span>
            </div>
          </div>

          <div className="topbar-search">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง, รหัสนักศึกษา, ชื่อผู้พัก หรือใบเสร็จ..."
              className="topbar-search-input"
            />
          </div>

          <div className="topbar-right">
            <div className="date-badge">
              {new Date().toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <button className="topbar-icon-button" title="การแจ้งเตือน">
              <Bell size={20} />
              <span className="notif-dot"></span>
            </button>

            <button onClick={onLogout} className="topbar-switch-login-btn">
              <LogOut size={16} />
              <span>หน้าล็อกอิน</span>
            </button>
          </div>
        </header>

        {/* VIEW CONTAINER */}
        <main className="admin-page-content">{children}</main>
      </div>
    </div>
  );
};
