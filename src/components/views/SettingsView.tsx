import React, { useState } from 'react';
import { Save, CheckCircle, Building, CreditCard } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [elecRate, setElecRate] = useState('8.00');
  const [waterRate, setWaterRate] = useState('18.00');
  const [commonFee, setCommonFee] = useState('300');
  const [dormName, setDormName] = useState('หอพักนักศึกษา Niva Residence (อาคาร A)');
  const [promptPay, setPromptPay] = useState('0105556098765');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-view-container">
      <div className="view-header-row">
        <div>
          <h2 className="view-title">การตั้งค่าระบบ (System Settings)</h2>
          <p className="view-subtitle">กำหนดอัตราค่าน้ำ ค่าไฟ บัญชีรับชำระเงิน และข้อมูลหอพัก Niva Residence</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="success-banner mb-4">
          <CheckCircle size={18} />
          <span>บันทึกการตั้งค่าระบบเรียบร้อยแล้ว มีผลกับรอบบิลถัดไป</span>
        </div>
      )}

      <form onSubmit={handleSave} className="settings-grid">
        {/* Box 1: Utility Rates */}
        <div className="content-box">
          <div className="box-header">
            <div className="box-title-with-icon">
              <CreditCard className="text-blue-600" size={20} />
              <h3 className="box-title">อัตราค่าสาธารณูปโภค</h3>
            </div>
          </div>
          <p className="box-sub mb-4">กำหนดราคาต่อหน่วยสำหรับคำนวณบิลรายเดือน</p>

          <div className="form-group mb-3">
            <label>ค่าไฟฟ้า (บาท ต่อ หน่วย):</label>
            <input
              type="number"
              step="0.5"
              value={elecRate}
              onChange={(e) => setElecRate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>ค่าน้ำประปา (บาท ต่อ หน่วย):</label>
            <input
              type="number"
              step="0.5"
              value={waterRate}
              onChange={(e) => setWaterRate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>ค่าบำรุงรักษาส่วนกลาง (บาท ต่อ เดือน):</label>
            <input
              type="number"
              value={commonFee}
              onChange={(e) => setCommonFee(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Box 2: Payment & Dorm Info */}
        <div className="content-box">
          <div className="box-header">
            <div className="box-title-with-icon">
              <Building className="text-blue-600" size={20} />
              <h3 className="box-title">ข้อมูลหอพักและบัญชีรับเงิน</h3>
            </div>
          </div>
          <p className="box-sub mb-4">แสดงบนหัวใบเสร็จรับเงินและ QR PromptPay</p>

          <div className="form-group mb-3">
            <label>ชื่อหอพัก / อาคาร:</label>
            <input
              type="text"
              value={dormName}
              onChange={(e) => setDormName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>หมายเลขพร้อมเพย์ (Biller ID / นิติบุคคล):</label>
            <input
              type="text"
              value={promptPay}
              onChange={(e) => setPromptPay(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>เบอร์โทรติดต่อเจ้าหน้าที่ (แสดงหน้าล็อกอิน):</label>
            <input
              type="text"
              defaultValue="02 123 4567"
              className="form-input"
            />
          </div>
        </div>

        <div className="settings-footer-actions">
          <button type="submit" className="add-room-btn">
            <Save size={16} />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </form>
    </div>
  );
};
