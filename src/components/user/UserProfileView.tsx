import React from 'react';
import { 
  User, 
  Wifi, 
  Calendar, 
  Building
} from 'lucide-react';
import type { Resident } from '../../types';

interface UserProfileViewProps {
  resident: Resident;
  onSwitchToAdmin: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  resident,
  onSwitchToAdmin
}) => {
  return (
    <div className="user-profile-container">
      {/* Left Column: Profile Card */}
      <div className="profile-identity-card">
        <div className="profile-avatar-circle">
          <span>{resident.name.charAt(3) || 'น'}</span>
        </div>
        <div className="profile-name-lg">{resident.name}</div>
        <div className="profile-sub-id">รหัสนักศึกษา: {resident.studentId}</div>
        <div className="profile-tag-pill">
          ห้องพัก {resident.roomNumber} · คณะ{resident.faculty}
        </div>
      </div>

      {/* Right Column: Information Panels */}
      <div className="profile-right-panels-col">
        {/* CONTRACT DETAILS */}
        <div className="profile-section-card">
          <div className="section-card-title">
            <Calendar size={16} className="text-blue-600 mr-2 inline" />
            ข้อมูลสัญญาหอพักนักศึกษา
          </div>
          <div className="profile-info-grid">
            <div className="info-cell">
              <span className="lbl">วันเริ่มสัญญา:</span>
              <span className="val">{resident.checkInDate}</span>
            </div>
            <div className="info-cell">
              <span className="lbl">วันสิ้นสุดสัญญา:</span>
              <span className="val">{resident.contractEndDate}</span>
            </div>
            <div className="info-cell">
              <span className="lbl">ประเภทห้อง:</span>
              <span className="val">เตียงเดี่ยว (Standard)</span>
            </div>
            <div className="info-cell">
              <span className="lbl">เงินประกันความเสียหาย:</span>
              <span className="val text-blue-800 font-semibold">฿10,000 (ได้รับคืนเมื่อย้ายออก)</span>
            </div>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="profile-section-card">
          <div className="section-card-title">
            <User size={16} className="text-blue-600 mr-2 inline" />
            ข้อมูลการติดต่อ
          </div>
          <div className="profile-info-grid">
            <div className="info-cell">
              <span className="lbl">เบอร์โทรศัพท์:</span>
              <span className="val">{resident.phone}</span>
            </div>
            <div className="info-cell">
              <span className="lbl">อีเมลสถาบัน:</span>
              <span className="val">{resident.email}</span>
            </div>
            <div className="info-cell col-span-2">
              <span className="lbl">ผู้ติดต่อกรณีฉุกเฉิน:</span>
              <span className="val">{resident.emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* DORM WI-FI INFO */}
        <div className="profile-section-card wifi-card">
          <div className="section-card-title">
            <Wifi size={16} className="text-blue-600 mr-2 inline" />
            อินเทอร์เน็ตหอพัก (High-Speed Wi-Fi)
          </div>
          <div className="wifi-details-row">
            <div>
              <div className="text-xs text-slate-500">ชื่อสัญญาณ (SSID):</div>
              <div className="font-mono font-bold text-slate-800">NIVA_RESIDENCE_5G</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">รหัสผ่าน (Password):</div>
              <div className="font-mono font-bold text-blue-600">niva2026wifi</div>
            </div>
          </div>
        </div>

        {/* SWITCH TO ADMIN PORTAL BUTTON */}
        <div className="switch-portal-action-box">
          <button
            className="btn-switch-to-admin"
            onClick={onSwitchToAdmin}
          >
            <Building size={16} />
            <span>สลับไปยังหน้าต่างเจ้าหน้าที่ (Admin Portal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
