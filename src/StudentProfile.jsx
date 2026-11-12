
import React from "react";

function StudentProfile({ student, onSignOut }) {
  const initials = student.fullname
    ? student.fullname
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <main className="student-dashboard">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-icon">V</div>
          <span>VALORIA</span>
        </div>

        <div className="sidebar-menu">
          <p className="sidebar-heading">MENU</p>

          <div className="sidebar-link active">
            <span>▦</span>
            Dashboard
          </div>

          <div className="sidebar-link">
            <span>♙</span>
            My Profile
          </div>
        </div>

        <button
          className="dashboard-logout"
          onClick={onSignOut}
        >
          <span>↪</span>
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <section className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <p className="dashboard-breadcrumb">
              VALORIA / DASHBOARD
            </p>
            <h1>Student Dashboard</h1>
          </div>

          <div className="header-profile">
            <div className="header-avatar">
              {initials}
            </div>

            <div>
              <strong>{student.fullname}</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="welcome-banner">
          <div>
            <p>WELCOME BACK!</p>
            <h2>Hello, {student.fullname} 👋</h2>
            <span>
              Welcome to your Valoria student dashboard.
            </span>
          </div>

          <div className="welcome-decoration">
            V
          </div>
        </section>

        {/* Profile Information */}
        <section className="profile-section">

          <div className="section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>
                Your registered student details
              </p>
            </div>

            <span className="verified-status">
              ● Registered Student
            </span>
          </div>

          <div className="profile-grid">

            {/* Full Name */}
            <div className="profile-detail-card">
              <div className="detail-icon">♙</div>
              <div>
                <span>Full Name</span>
                <h3>{student.fullname || "Not available"}</h3>
              </div>
            </div>

            {/* Email */}
            <div className="profile-detail-card">
              <div className="detail-icon">✉</div>
              <div>
                <span>Email Address</span>
                <h3>{student.email || "Not available"}</h3>
              </div>
            </div>

            {/* Phone */}
            <div className="profile-detail-card">
              <div className="detail-icon">☎</div>
              <div>
                <span>Phone Number</span>
                <h3>{student.phone || "Not available"}</h3>
              </div>
            </div>

            {/* Course */}
            <div className="profile-detail-card">
              <div className="detail-icon">▤</div>
              <div>
                <span>Course</span>
                <h3>{student.course || "Not available"}</h3>
              </div>
            </div>

          </div>
        </section>

        <footer className="dashboard-footer">
          © {new Date().getFullYear()} Valoria Technology.
          All rights reserved.
        </footer>

      </section>

      {/* Dashboard Styles */}
      <style>{`
        .student-dashboard {
          min-height: 100vh;
          display: flex;
          background: #f6f7fb;
          color: #202438;
          font-family: inherit;
        }

        .dashboard-sidebar {
          width: 245px;
          min-width: 245px;
          background: #17182b;
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
        }

        .dashboard-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #7770ef;
          font-size: 22px;
        }

        .sidebar-menu {
          margin-top: 65px;
        }

        .sidebar-heading {
          color: #9294ac;
          font-size: 11px;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
        }

        .sidebar-link {
          display: flex;
          gap: 13px;
          align-items: center;
          padding: 14px;
          margin-bottom: 10px;
          border-radius: 10px;
          color: #c7c8d7;
          font-size: 14px;
        }

        .sidebar-link.active {
          background: #7770ef;
          color: white;
        }

        .dashboard-logout {
          margin-top: auto;
          padding: 14px;
          border: 1px solid #414258;
          border-radius: 10px;
          background: transparent;
          color: white;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
        }

        .dashboard-logout:hover {
          background: #292a43;
        }

        .dashboard-main {
          flex: 1;
          min-width: 0;
          padding: 35px 45px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 35px;
        }

        .dashboard-breadcrumb {
          color: #898b9e;
          font-size: 11px;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .dashboard-header h1 {
          font-size: 27px;
          margin: 0;
        }

        .header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #7770ef;
          color: white;
          font-weight: 700;
        }

        .header-profile strong,
        .header-profile span {
          display: block;
        }

        .header-profile strong {
          font-size: 13px;
        }

        .header-profile span {
          color: #85879a;
          font-size: 12px;
          margin-top: 4px;
        }

        .welcome-banner {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 180px;
          padding: 30px 35px;
          border-radius: 18px;
          background: linear-gradient(
            120deg,
            #5147b9,
            #8278f4
          );
          color: white;
        }

        .welcome-banner p {
          font-size: 11px;
          letter-spacing: 2px;
          opacity: 0.8;
        }

        .welcome-banner h2 {
          font-size: 27px;
          margin: 12px 0;
        }

        .welcome-banner span {
          font-size: 13px;
          opacity: 0.85;
        }

        .welcome-decoration {
          font-size: 150px;
          font-weight: 900;
          line-height: 1;
          opacity: 0.12;
        }

        .profile-section {
          margin-top: 40px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 22px;
        }

        .section-heading h2 {
          font-size: 20px;
          margin: 0 0 7px;
        }

        .section-heading p {
          font-size: 13px;
          color: #85879a;
          margin: 0;
        }

        .verified-status {
          color: #15845a;
          background: #e4f6ed;
          padding: 9px 13px;
          border-radius: 20px;
          font-size: 11px;
          white-space: nowrap;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .profile-detail-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 25px;
          background: white;
          border: 1px solid #ececf3;
          border-radius: 14px;
          min-width: 0;
        }

        .detail-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #efedff;
          color: #6458d9;
          font-size: 22px;
        }

        .profile-detail-card span {
          display: block;
          color: #85879a;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .profile-detail-card h3 {
          font-size: 14px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .dashboard-footer {
          margin-top: 55px;
          text-align: center;
          font-size: 12px;
          color: #9294a4;
        }

        @media (max-width: 800px) {
          .dashboard-sidebar {
            width: 75px;
            min-width: 75px;
            padding: 25px 10px;
          }

          .dashboard-brand {
            justify-content: center;
            font-size: 0;
          }

          .sidebar-heading,
          .sidebar-link:not(.active),
          .sidebar-link {
            font-size: 0;
            justify-content: center;
          }

          .sidebar-link span {
            font-size: 20px;
          }

          .dashboard-logout {
            font-size: 0;
            text-align: center;
          }

          .dashboard-logout span {
            font-size: 20px;
          }

          .dashboard-main {
            padding: 25px 20px;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-banner {
            padding: 25px 20px;
          }

          .welcome-banner h2 {
            font-size: 21px;
          }

          .welcome-decoration {
            font-size: 80px;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-detail-card {
            padding: 18px;
          }
        }
      `}</style>

    </main>
  );
}

export default StudentProfile;
