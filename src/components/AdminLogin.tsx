import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin.niva');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  return (
    <div className="login-page-container">
      {/* LEFT COLUMN: HERO BANNER (DARK FOREST GREEN) */}
      <div className="login-left-banner">
        {/* Brand & Logo */}
        <div className="brand-header">
          <div className="brand-logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
              {/* Shield Outline */}
              <path d="M20 4L34 10V21C34 29 27.8 35.8 20 38C12.2 35.8 6 29 6 21V10L20 4Z" fill="#163B66" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Sun Rays */}
              <circle cx="20" cy="17" r="4.5" fill="#F59E0B" />
              <path d="M20 10V11.5M20 22.5V24M13.5 17H15M25 17H26.5M15.4 12.4L16.5 13.5M23.5 20.5L24.6 21.6M15.4 21.6L16.5 20.5M23.5 13.5L24.6 12.4" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
              {/* Book / Leaves */}
              <path d="M13 25C15.5 24 18 24.5 20 26C22 24.5 24.5 24 27 25V28.5C24.5 27.5 22 28 20 29.5C18 28 15.5 27.5 13 28.5V25Z" fill="#0EA5E9" />
              <path d="M20 26V29.5" stroke="#0284C7" strokeWidth="1.2" />
            </svg>
          </div>
          <span className="brand-title">Rmutt Residence </span>
        </div>

        {/* Center Content */}
        <div className="banner-main-content">
          <h1 className="banner-headline">
            พื้นที่ดูแลหอพัก<br />
            เพื่อทุกวันที่ดีขึ้น
          </h1>
          <p className="banner-subtext">
            จัดการห้องพัก การชำระเงิน และการดูแลนักศึกษา<br className="hide-on-mobile" />
            จากพื้นที่ทำงานเดียวแบบครบวงจร
          </p>

          {/* Stats Card: Rmutt Residence AT A GLANCE */}
          <div className="niva-glance-card">
            <div className="glance-header">Rmutt Residence AT A GLANCE</div>
            <div className="glance-stats-grid">
              <div className="stat-col">
                <div className="stat-number">120</div>
                <div className="stat-label">ห้องพักทั้งหมด</div>
              </div>
              <div className="stat-col">
                <div className="stat-number">108</div>
                <div className="stat-label">ผู้พักอาศัย</div>
              </div>
              <div className="stat-col">
                <div className="stat-number">90%</div>
                <div className="stat-label">อัตราเข้าพัก</div>
              </div>
            </div>
            <div className="glance-footer-note">
              มหาวิทยาลัยราชมงคลธัญบุรี · ข้อมูลและตราสัญลักษณ์ตัวอย่าง
            </div>
          </div>
        </div>

        {/* Banner Footer */}
        <div className="banner-bottom-note">
          <ShieldCheck size={16} className="shield-icon" />
          <span>ปลอดภัยสำหรับเจ้าหน้าที่ · Rmutt Residence Dormitory System</span>
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN FORM (LIGHT ELEGANT) */}
      <div className="login-right-pane">
        <div className="login-form-wrapper">
          {/* Tag */}
          <div className="admin-portal-tag">
            <span className="tag-triangle">▲</span>
            <span className="tag-text">ADMIN PORTAL</span>
          </div>

          <h2 className="login-heading">ยินดีต้อนรับกลับมา</h2>
          <p className="login-subheading">เข้าสู่ระบบเพื่อบริหารจัดการหอพักนักศึกษา</p>

          {errorMessage && (
            <div className="login-error-banner">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="กรอกชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="remember-forgot-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <span>จดจำการเข้าสู่ระบบ</span>
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => alert('ติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน (โทร 02 123 4567)')}
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="button-loading-text">กำลังตรวจสอบข้อมูล...</span>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight size={18} className="arrow-icon" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="demo-helper-pill" onClick={handleSubmit}>
            <Sparkles size={14} className="sparkle-icon" />
            <span>คลิกที่นี่เพื่อทดลองเข้าสู่ระบบแอดมิน (Demo Admin Mode)</span>
          </div>

          {/* Notice Box */}
          <div className="authorized-notice-box">
            <div className="notice-title">สำหรับเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</div>
            <div className="notice-content">
              หากไม่สามารถเข้าสู่ระบบได้ กรุณาติดต่อ ผู้ดูแลระบบมหาวิทยาลัย โทร 02 123 4567
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="login-footer-copy">
            © 2569 Rmutt Residence · นโยบายความเป็นส่วนตัว
          </div>
        </div>
      </div>
    </div>
  );
};
