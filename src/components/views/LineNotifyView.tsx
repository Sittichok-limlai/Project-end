import React, { useState } from 'react';
import { 
  Package, 
  Send, 
  CheckCircle, 
  Radio
} from 'lucide-react';
import { initialNotices } from '../../mockData';
import type { LineNotice } from '../../types';

export const LineNotifyView: React.FC = () => {
  const [notices, setNotices] = useState<LineNotice[]>(initialNotices);
  const [parcelRoom, setParcelRoom] = useState('102');
  const [parcelTracking, setParcelTracking] = useState('TH0492817281');
  const [parcelSuccess, setParcelSuccess] = useState(false);

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'ทั้งหมด' | 'เฉพาะห้อง' | 'ชั้น 1-4'>('ทั้งหมด');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleSendParcelNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: LineNotice = {
      id: `not-${Date.now()}`,
      title: `พัสดุมาถึงหอพักแล้ว (${parcelTracking}) รอรับที่ห้องธุรการ ชั้น 1`,
      type: 'พัสดุมาถึง',
      target: 'เฉพาะห้อง',
      sentAt: 'เมื่อสักครู่',
      readCount: 1,
      totalRecipients: 1,
    };
    setNotices([newNotice, ...notices]);
    setParcelSuccess(true);
    setTimeout(() => setParcelSuccess(false), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;
    const newNotice: LineNotice = {
      id: `not-${Date.now()}`,
      title: broadcastTitle,
      type: 'ทั่วไป',
      target: broadcastTarget,
      sentAt: 'เมื่อสักครู่',
      readCount: 0,
      totalRecipients: broadcastTarget === 'ทั้งหมด' ? 108 : 30,
    };
    setNotices([newNotice, ...notices]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="linenotify-view-container">
      {/* View Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">ศูนย์แจ้งเตือนผ่าน LINE Official Account</h2>
          <p className="view-subtitle">เชื่อมต่อ API LINE Messaging ส่งบิลค่าเช่า แจ้งเตือนพัสดุ และประกาศข่าวสารแบบเรียลไทม์</p>
        </div>
        <div className="line-connection-status-pill">
          <span className="live-dot"></span>
          <span>LINE OA: @niva_residence (เชื่อมต่อพร้อมใช้งาน)</span>
        </div>
      </div>

      <div className="line-view-split">
        {/* LEFT COLUMN: PARCEL NOTIFIER & BROADCAST COMPOSER */}
        <div className="line-action-forms-col">
          {/* Box 1: Parcel Notification */}
          <div className="content-box">
            <div className="box-header">
              <div className="box-title-with-icon">
                <Package className="text-blue-600" size={20} />
                <h3 className="box-title">แจ้งเตือนพัสดุมาถึง (Smart Parcel Alert)</h3>
              </div>
            </div>
            <p className="box-sub mb-4">ส่ง Push Notification พร้อมภาพสลิป/หมายเลขพัสดุไปยัง LINE OA นักศึกษาโดยตรง</p>

            {parcelSuccess && (
              <div className="success-banner">
                <CheckCircle size={18} />
                <span>ส่งข้อความแจ้งเตือนพัสดุไปยัง LINE ห้อง {parcelRoom} เรียบร้อยแล้ว!</span>
              </div>
            )}

            <form onSubmit={handleSendParcelNotice} className="parcel-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>เลขห้องพักผู้รับ:</label>
                  <input
                    type="text"
                    value={parcelRoom}
                    onChange={(e) => setParcelRoom(e.target.value)}
                    placeholder="เช่น 102, 205..."
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>สถานะพัสดุ:</label>
                  <input
                    type="text"
                    value="ถึงหอพักแล้ว (รอรับที่ห้องธุรการ ชั้น 1)"
                    readOnly
                    className="form-input bg-slate-50 text-blue-700 font-semibold"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>หมายเลขพัสดุ (Tracking No.):</label>
                <input
                  type="text"
                  value={parcelTracking}
                  onChange={(e) => setParcelTracking(e.target.value)}
                  placeholder="กรอกเลขแทร็กกิ้งพัสดุ..."
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="line-send-btn">
                <Send size={16} />
                <span>ส่งการแจ้งเตือนพัสดุผ่าน LINE</span>
              </button>
            </form>
          </div>

          {/* Box 2: Broadcast Announcement */}
          <div className="content-box">
            <div className="box-header">
              <div className="box-title-with-icon">
                <Radio className="text-blue-600" size={20} />
                <h3 className="box-title">บรอดแคสต์ประกาศหอพัก (Broadcast Notice)</h3>
              </div>
            </div>
            <p className="box-sub mb-4">ส่งข้อความแจ้งเตือนสำคัญหรือข่าวด่วนไปยังนักศึกษาทุกคนในหอพัก</p>

            {broadcastSuccess && (
              <div className="success-banner">
                <CheckCircle size={18} />
                <span>บรอดแคสต์ข้อความไปยังนักศึกษา {broadcastTarget === 'ทั้งหมด' ? '108 คน' : 'ตามกลุ่มเป้าหมาย'} สำเร็จ!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="broadcast-form">
              <div className="form-group">
                <label>หัวข้อประกาศ:</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="เช่น แจ้งกำหนดการทำความสะอาดถังน้ำประจำเดือน..."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>เนื้อหาข้อความประกาศ:</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="พิมพ์รายละเอียดประกาศที่จะส่งเข้าช่องแชท LINE OA..."
                  className="form-input textarea"
                />
              </div>

              <div className="form-group">
                <label>กลุ่มผู้รับ:</label>
                <div className="target-radio-group">
                  {(['ทั้งหมด', 'ชั้น 1-4', 'เฉพาะห้อง'] as const).map((t) => (
                    <label key={t} className="radio-label">
                      <input
                        type="radio"
                        name="target"
                        checked={broadcastTarget === t}
                        onChange={() => setBroadcastTarget(t)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="line-send-btn secondary">
                <Send size={16} />
                <span>ส่งบรอดแคสต์ประกาศ</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: NOTIFICATION LOG HISTORY */}
        <div className="line-history-col">
          <div className="content-box">
            <div className="box-header">
              <h3 className="box-title">ประวัติการส่งแจ้งเตือนล่าสุด</h3>
            </div>
            <p className="box-sub mb-4">รายการแจ้งเตือนและสถิติการเปิดอ่านของนักศึกษา</p>

            <div className="notice-history-list">
              {notices.map((n) => (
                <div key={n.id} className="notice-history-item">
                  <div className="notice-item-top">
                    <span className={`notice-type-pill ${n.type}`}>{n.type}</span>
                    <span className="notice-time">{n.sentAt}</span>
                  </div>
                  <div className="notice-item-title">{n.title}</div>
                  <div className="notice-item-footer">
                    <span>กลุ่มเป้าหมาย: <strong>{n.target}</strong></span>
                    <span className="notice-read-stat">
                      เปิดอ่านแล้ว {n.readCount}/{n.totalRecipients} คน ({Math.round((n.readCount / n.totalRecipients) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
