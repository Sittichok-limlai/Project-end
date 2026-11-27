import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { DormNotice } from '../../types';

interface UserNoticesViewProps {
  notices: DormNotice[];
}

export const UserNoticesView: React.FC<UserNoticesViewProps> = ({ notices }) => {
  const dormRules = [
    { title: 'เวลาเปิด-ปิด ประตูทางเข้าหอพัก', desc: 'เปิด 06:00 น. และปิดประตูอัตโนมัติเวลา 24:00 น. หากเข้าหลังเที่ยงคืนต้องสแกนบัตรนักศึกษาและลงชื่อกับ รปภ.' },
    { title: 'การพาบุคคลภายนอกเข้าหอพัก', desc: 'อนุญาตให้เข้าได้เฉพาะบริเวณล็อบบี้ชั้น 1 ไม่อนุญาตให้ขึ้นชั้นห้องพักโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร' },
    { title: 'การใช้เสียงและความสงบเรียบร้อย', desc: 'งดใช้เสียงดังหลังเวลา 22:00 น. โดยเฉพาะช่วงสัปดาห์สอบกลางภาคและปลายภาค' },
    { title: 'การประกอบอาหารและการใช้เครื่องใช้ไฟฟ้า', desc: 'ห้ามใช้เตาแก๊สหรือเตาปิ้งย่าง อนุญาตเฉพาะไมโครเวฟและกาต้มน้ำร้อนที่ได้รับมาตรฐาน มอก.' }
  ];

  return (
    <div className="user-notices-container">
      <div className="section-heading mb-1">ประกาศและข่าวสารหอพัก</div>
      <p className="section-subheading mb-3">ติดตามข่าวสารและการแจ้งเตือนอย่างเป็นทางการจากมหาวิทยาลัย</p>

      {/* ANNOUNCEMENTS LIST */}
      <div className="notices-list">
        {notices.map((n) => (
          <div key={n.id} className="user-notice-item-card">
            <div className="notice-card-header">
              <span className={`notice-badge-pill ${n.type}`}>{n.type}</span>
              <span className="notice-date">{n.sentAt}</span>
            </div>
            <div className="notice-card-title">{n.title}</div>
            <div className="notice-card-target">สำหรับ: {n.target}</div>
          </div>
        ))}
      </div>

      {/* DORM RULES SECTION */}
      <div className="dorm-rules-box mt-4">
        <div className="rules-header">
          <ShieldAlert size={18} className="text-amber-700" />
          <span className="font-bold text-slate-800 text-sm">กฎระเบียบการพักอาศัย (Dormitory Rules)</span>
        </div>
        <div className="rules-items-list">
          {dormRules.map((rule, idx) => (
            <div key={idx} className="rule-item">
              <div className="rule-num">{idx + 1}</div>
              <div className="rule-body">
                <div className="rule-title">{rule.title}</div>
                <div className="rule-desc">{rule.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
