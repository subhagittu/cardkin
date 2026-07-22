import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';
import './Signup.css';

export default function Signup({ onBack, onNavigateHome, onLogin }) {
    const [signUpStep, setSignUpStep] = useState('contact');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // OTP / password step state kept for multi-step flow
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timerSecs, setTimerSecs] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef(null);

    const startTimer = () => {
        setTimerSecs(60);
        setCanResend(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimerSecs((prev) => {
                if (prev <= 1) { setCanResend(true); clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

    const validateContactStep = () => {
        const e = {};
        if (!fullName.trim()) e.fullName = 'Full name is required';
        else if (fullName.trim().length < 3) e.fullName = 'Name must be at least 3 characters';
        if (!email) e.email = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
        if (!password) e.password = 'Password is required';
        else if (password.length < 8) e.password = 'Password must be at least 8 characters';
        if (!agreeToTerms) e.agreeToTerms = "You must accept the Terms of Service and Privacy Policy";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (validateContactStep()) {
            setErrors({});
            setSignUpStep('success');
        }
    };

    // SUCCESS SCREEN
    if (signUpStep === 'success') {
        return (
            <div className="su-page">
                <div className="su-success-wrap">
                    <div className="su-success-card">
                        <div className="su-success-icon"><CheckCircle2 size={64} /></div>
                        <h2 className="su-success-title">Account Created!</h2>
                        <p className="su-success-desc">
                            Welcome to CardKin, <strong>{fullName}</strong>. Your account has been set up successfully.
                        </p>
                        <button onClick={() => onNavigateHome({ name: fullName, email })} className="su-btn-primary">
                            Go to Home Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="su-page">
            {/* ── TOP HEADER BAR ── */}
            <header className="su-header">
                <div className="su-header-logo" onClick={onBack} role="button" tabIndex={0}>
                    <div className="su-logo-box">CK</div>
                    <span className="su-logo-name">CardKin</span>
                </div>
                <div className="su-header-auth">
                    <span className="su-header-auth-text">Have an account?</span>
                    <button type="button" className="su-header-login-btn" onClick={onLogin}>Log in</button>
                </div>
            </header>

            {/* ── BODY: LEFT HERO + RIGHT CARD ── */}
            <div className="su-body">
                {/* LEFT — Branding panel (transparent) */}
                <div className="su-left">
                    <span className="su-badge">
                        <span className="su-badge-dot" />
                        Join the network
                    </span>
                    <h1 className="su-hero-headline">
                        Welcome to <span className="su-hero-accent">CardKin</span>.
                    </h1>
                    <p className="su-hero-sub">
                        Your account unlocks India's smartest credit card network.
                    </p>
                </div>

                {/* RIGHT — Glass Card */}
                <div className="su-right">
                    <div className="su-card">
                        <h2 className="su-card-title">Create your account</h2>
                        <p className="su-card-sub">Free forever. Takes less than 2 minutes.</p>

                        {/* Google OAuth */}
                        <button type="button" className="su-google-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
                                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="su-divider">
                            <span className="su-divider-line" />
                            <span className="su-divider-text">OR WITH EMAIL</span>
                            <span className="su-divider-line" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleContactSubmit} className="su-form" noValidate>
                            {/* Full name */}
                            <div className="su-field">
                                <label className="su-label">Full name</label>
                                <div className={`su-input-wrap ${errors.fullName ? 'error' : ''}`}>
                                    <User className="su-input-icon" size={16} />
                                    <input
                                        type="text"
                                        className="su-input"
                                        placeholder="Aarav Mehta"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                {errors.fullName && (
                                    <div className="su-error-msg"><ShieldAlert size={12} /><span>{errors.fullName}</span></div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="su-field">
                                <label className="su-label">Email address</label>
                                <div className={`su-input-wrap ${errors.email ? 'error' : ''}`}>
                                    <Mail className="su-input-icon" size={16} />
                                    <input
                                        type="email"
                                        className="su-input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                {errors.email && (
                                    <div className="su-error-msg"><ShieldAlert size={12} /><span>{errors.email}</span></div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="su-field">
                                <label className="su-label">Password</label>
                                <div className={`su-input-wrap ${errors.password ? 'error' : ''}`}>
                                    <Lock className="su-input-icon" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="su-input"
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="su-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="su-error-msg"><ShieldAlert size={12} /><span>{errors.password}</span></div>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="su-terms-row">
                                <label className="su-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="su-checkbox-input"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span className="su-checkbox-box" />
                                    <span className="su-terms-text">
                                        I agree to CardKin's{' '}
                                        <a href="#terms" onClick={(e) => e.preventDefault()} className="su-link">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#privacy" onClick={(e) => e.preventDefault()} className="su-link">Privacy Policy</a>.
                                    </span>
                                </label>
                                {errors.agreeToTerms && (
                                    <div className="su-error-msg"><ShieldAlert size={12} /><span>{errors.agreeToTerms}</span></div>
                                )}
                            </div>

                            <button type="submit" className="su-btn-primary">Create Account</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
