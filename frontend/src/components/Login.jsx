import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import './Login.css';

import { supabase } from '../lib/supabaseClient';

export default function Login({ onBack, onLoginSuccess, onNavigateSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        });
        if (error) {
            console.error('Error logging in with Google:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};

        if (!email) errs.email = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';

        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                setErrors({ email: error.message });
            } else {
                onLoginSuccess({ name: data.user.user_metadata.full_name || data.user.email, email: data.user.email });
            }
        }
    };

    return (
        <div className="li-page">
            {/* ── TOP HEADER BAR ── */}
            <header className="li-header">
                <div className="li-header-logo" onClick={onBack} role="button" tabIndex={0}>
                    <div className="li-logo-box">CK</div>
                    <span className="li-logo-name">CardKin</span>
                </div>
                <div className="li-header-auth">
                    <span className="li-header-auth-text">New to CardKin?</span>
                    <button type="button" className="li-header-signup-btn" onClick={onNavigateSignup}>
                        Create account
                    </button>
                </div>
            </header>

            {/* ── BODY: LEFT HERO + RIGHT CARD ── */}
            <div className="li-body">
                {/* LEFT — Branding panel (transparent) */}
                <div className="li-left">
                    <span className="li-badge">
                        <span className="li-badge-dot" />
                        Members only
                    </span>
                    <h1 className="li-hero-headline">
                        Welcome back to <span className="li-hero-accent">CardKin</span>.
                    </h1>
                    <p className="li-hero-sub">
                        Sign in to access your card matches, saved offers, and community rewards.
                    </p>
                </div>

                {/* RIGHT — Glass Card */}
                <div className="li-right">
                    <div className="li-card">
                        <h2 className="li-card-title">Sign in to your account</h2>
                        <p className="li-card-sub">Good to see you again.</p>

                        {/* Google OAuth */}
                        <button type="button" className="li-google-btn" onClick={handleGoogleLogin}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
                                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="li-divider">
                            <span className="li-divider-line" />
                            <span className="li-divider-text">OR WITH EMAIL</span>
                            <span className="li-divider-line" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="li-form" noValidate>
                            {/* Email */}
                            <div className="li-field">
                                <label className="li-label">Email address</label>
                                <div className={`li-input-wrap ${errors.email ? 'error' : ''}`}>
                                    <Mail className="li-input-icon" size={16} />
                                    <input
                                        type="email"
                                        className="li-input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <div className="li-error-msg"><ShieldAlert size={12} /><span>{errors.email}</span></div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="li-field">
                                <div className="li-password-label-row">
                                    <label className="li-label">Password</label>
                                    <a
                                        href="#forgot"
                                        className="li-forgot-link"
                                        onClick={(e) => { e.preventDefault(); alert('Password reset coming soon!'); }}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className={`li-input-wrap ${errors.password ? 'error' : ''}`}>
                                    <Lock className="li-input-icon" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="li-input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="li-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="li-error-msg"><ShieldAlert size={12} /><span>{errors.password}</span></div>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="li-remember-row">
                                <label className="li-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="li-checkbox-input"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="li-checkbox-box" />
                                    <span className="li-remember-text">Remember me on this device</span>
                                </label>
                            </div>

                            <button type="submit" className="li-btn-primary">Sign In</button>
                        </form>

                        {/* Footer */}
                        <div className="li-card-footer">
                            <span className="li-footer-text">Don't have an account?</span>
                            <button type="button" className="li-footer-link-btn" onClick={onNavigateSignup}>
                                Create free account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
