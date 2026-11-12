
import React, { useEffect, useState } from "react";
import StudentProfile from "./StudentProfile.jsx";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseCheckTable = import.meta.env.VITE_SUPABASE_CHECK_TABLE;

// Email Icon
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="m5 7 7 5.5L19 7" />
    </svg>
  );
}

// Lock Icon
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
    </svg>
  );
}

// Password Visibility Icon
function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.1 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.7M6.2 6.3C3.8 8 2.5 12 2.5 12s3.4 6 9.5 6a9.5 9.5 0 0 0 4-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

// Valoria Brand Symbol
function BrandSymbol() {
  return (
    <svg
      aria-label="Valoria symbol"
      className="brand-symbol"
      role="img"
      viewBox="0 0 64 64"
    >
      <path d="M10 48V29a22 22 0 0 1 44 0v19H43c-7 0-10-4-11-12-1 8-4 12-11 12H10Z" />
      <circle cx="32" cy="27" r="8" />
      <path d="M10 48h11c7 0 10 4 11 12 1-8 4-12 11-12h11" />
    </svg>
  );
}

// Page Navigation
function getCurrentPage() {
  if (window.location.hash === "#dashboard") {
    return "profile";
  }

  if (
    window.location.hash === "#forgot-password" ||
    window.location.hash === "#reset-password"
  ) {
    return "reset";
  }

  return "login";
}

function App() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageState, setMessageState] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  const [studentProfile, setStudentProfile] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [resetError, setResetError] = useState("");

  // Handle browser hash navigation
  useEffect(() => {
    function updatePage() {
      setCurrentPage(getCurrentPage());
      setResetError("");
    }

    window.addEventListener("hashchange", updatePage);

    return () =>
      window.removeEventListener("hashchange", updatePage);
  }, []);

  // Navigation
  function navigateTo(page) {
    const hash =
      page === "login"
        ? ""
        : page === "profile"
          ? "#dashboard"
          : "#reset-password";

    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${hash}`
    );

    setCurrentPage(page);
    setResetError("");
  }

  // LOGIN VERIFICATION USING SUPABASE
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageState("");

    if (
      !supabaseUrl ||
      !supabasePublishableKey ||
      !supabaseCheckTable
    ) {
      setMessage("Supabase configuration is missing.");
      setMessageState("error");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const emailAddress = formData.get("email");
    const password = formData.get("password");

    setSignInLoading(true);

    try {
      // Fetch student information and verify credentials
      const params = new URLSearchParams({
        select: "Firstname,Lastname,email,Phone,Course",
        email: `eq.${emailAddress}`,
        password: `eq.${password}`,
        limit: "1",
      });

      const response = await fetch(
        `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(
          supabaseCheckTable
        )}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            apikey: supabasePublishableKey,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Database query failed"
        );
      }

      const data = await response.json();

      if (data.length > 0) {
        const student = data[0];

        // Store logged-in student information
        setStudentProfile({
          fullname: `${student.Firstname || ""} ${
            student.Lastname || ""
          }`.trim(),
          email: student.email,
          phone: student.Phone,
          course: student.Course,
        });

        setMessage("Login Successful!");
        setMessageState("success");

        // Navigate to student dashboard
        navigateTo("profile");
      } else {
        setMessage("Email or password is incorrect.");
        setMessageState("error");
      }
    } catch (error) {
      console.error("Supabase login error:", error);

      setMessage(
        error.message || "Unable to connect to Supabase."
      );

      setMessageState("error");
    } finally {
      setSignInLoading(false);
    }
  }

  // EMAIL CHANGE
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  // RESET PASSWORD
  async function handleResetSubmit(event) {
    event.preventDefault();

    setResetError("");
    setMessage("");
    setMessageState("");

    if (newPassword !== confirmedPassword) {
      setResetError(
        "The passwords don't match. Please try again."
      );
      return;
    }

    if (!email || !newPassword) {
      setResetError("Email and password are required.");
      return;
    }

    if (
      !supabaseUrl ||
      !supabasePublishableKey ||
      !supabaseCheckTable
    ) {
      setResetError("Supabase configuration is missing.");
      return;
    }

    setSignInLoading(true);

    try {
      const params = new URLSearchParams({
        email: `eq.${email}`,
        select: "email",
      });

      const response = await fetch(
        `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(
          supabaseCheckTable
        )}?${params.toString()}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabasePublishableKey,
            "Content-Type": "application/json",
            Accept: "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Password update failed."
        );
      }

      const data = await response.json();

      if (data.length > 0) {
        setMessage("Password updated successfully!");
        setMessageState("success");

        setNewPassword("");
        setConfirmedPassword("");

        navigateTo("login");
      } else {
        setResetError("Email address not found.");
      }
    } catch (error) {
      console.error("Password update error:", error);

      setResetError(
        error.message || "Unable to update password."
      );
    } finally {
      setSignInLoading(false);
    }
  }

  // SIGN OUT
  function handleSignOut() {
    setStudentProfile(null);
    setEmail("");
    setMessage("");
    setMessageState("");
    setPasswordVisible(false);

    navigateTo("login");
  }

  // STUDENT DASHBOARD
  if (currentPage === "profile" && studentProfile) {
    return (
      <StudentProfile
        student={studentProfile}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <main className="login-page">
      <div className="ambient-glow" aria-hidden="true" />

      <section
        className="login-card"
        aria-labelledby={
          currentPage === "reset"
            ? "reset-title"
            : "login-title"
        }
      >
        <BrandSymbol />

        {currentPage === "reset" ? (
          <>
            <p className="eyebrow">ACCOUNT RECOVERY</p>

            <h1 id="reset-title">Choose a new password</h1>

            <p className="intro">
              Enter your new password twice to confirm it.
            </p>

            <form
              key="reset-form"
              onSubmit={handleResetSubmit}
            >
              <label htmlFor="reset-email">
                Email address
              </label>

              <div className="input-wrap">
                <MailIcon />

                <input
                  autoComplete="email"
                  id="reset-email"
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setResetError("");
                  }}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <label htmlFor="new-password">
                New password
              </label>

              <div className="input-wrap">
                <LockIcon />

                <input
                  autoComplete="new-password"
                  id="new-password"
                  minLength={8}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setResetError("");
                  }}
                  placeholder="At least 8 characters"
                  required
                  type="password"
                  value={newPassword}
                />
              </div>

              <label
                className="confirm-password-label"
                htmlFor="confirm-password"
              >
                Re-enter password
              </label>

              <div className="input-wrap">
                <LockIcon />

                <input
                  autoComplete="new-password"
                  id="confirm-password"
                  minLength={8}
                  onChange={(event) => {
                    setConfirmedPassword(event.target.value);
                    setResetError("");
                  }}
                  placeholder="Re-enter your new password"
                  required
                  type="password"
                  value={confirmedPassword}
                />
              </div>

              <p
                aria-live="polite"
                className="form-message reset-error"
              >
                {resetError}
              </p>

              <button
                className="submit-button"
                disabled={signInLoading}
                type="submit"
              >
                <span>
                  {signInLoading
                    ? "Updating..."
                    : "Update Password"}
                </span>

                <span
                  aria-hidden="true"
                  className="button-arrow"
                >
                  ↗
                </span>
              </button>
            </form>

            <p className="card-footer recovery-footer">
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo("login");
                }}
              >
                ← Back to sign in
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">YOUR SPACE, YOUR PACE</p>

            <h1 id="login-title">Welcome back</h1>

            <p className="intro">
              Sign in to continue to your Valoria account.
            </p>

            <form
              key="login-form"
              onSubmit={handleSubmit}
            >
              <label htmlFor="email">Email address</label>

              <div className="input-wrap">
                <MailIcon />

                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="password-heading">
                <label htmlFor="password">Password</label>
                <a href="#forgot-password">
                  Forgot password?
                </a>
              </div>

              <div className="input-wrap">
                <LockIcon />

                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={
                    passwordVisible ? "text" : "password"
                  }
                />

                <button
                  aria-label={
                    passwordVisible
                      ? "Hide password"
                      : "Show password"
                  }
                  className="visibility-toggle"
                  onClick={() =>
                    setPasswordVisible((visible) => !visible)
                  }
                  type="button"
                >
                  <EyeIcon visible={passwordVisible} />
                </button>
              </div>

              <button
                className="submit-button"
                disabled={signInLoading}
                type="submit"
              >
                <span>
                  {signInLoading ? "Checking..." : "Sign in"}
                </span>

                <span
                  aria-hidden="true"
                  className="button-arrow"
                >
                  ↗
                </span>
              </button>
            </form>

            <p
              aria-live="polite"
              className={`form-message login-message is-${messageState}`}
            >
              {message}
            </p>

            <p className="card-footer">
              New to Valoria?{" "}
              <a href="#create-account">Create an account</a>
            </p>
          </>
        )}
      </section>

      <p className="page-caption">
        A quieter place to get things done.
      </p>
    </main>
  );
}

export default App;
