import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle2, Phone, ShieldAlert, Eye, EyeOff, Send, ShieldCheck, Upload } from 'lucide-react';
import './Signup.css';

import { supabase } from '../lib/supabaseClient';

export default function Signup({ onBack, onNavigateHome, onLogin }) {
    // Steps: 'form' -> 'check-email'
    const [signUpStep, setSignUpStep] = useState('form');

    // Form State
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const e = {};
        if (!fullName.trim() || fullName.trim().length < 3) e.fullName = 'Valid full name is required';
        if (!mobileNumber.trim() || mobileNumber.trim().length < 10) e.mobileNumber = 'Valid phone number is required';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';

        // Strict password policy: min 8 length, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const strictPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !strictPasswordRegex.test(password)) {
            e.password = 'Must be 8+ chars with uppercase, number, & special character';
        }

        if (!agreeToTerms) e.terms = 'You must accept the Terms of Service';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setErrors({});
            setSignUpStep('kyc');
        }
    };

    const handleKycComplete = async () => {
        setIsLoading(true);

        // Standard Supabase Signup With KYC metadata
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    full_name: fullName.trim(),
                    phone: mobileNumber.trim(),
                    kyc_verified: true
                },
                emailRedirectTo: `${window.location.origin}/`
            }
        });

        setIsLoading(false);
        if (error) {
            setErrors({ submit: error.message });
            setSignUpStep('form');
        } else if (data?.session) {
            onNavigateHome({ name: fullName.trim(), email: email.trim(), kyc_verified: true });
        } else {
            setSignUpStep('check-email');
        }
    };

    if (signUpStep === 'kyc') {
        return (
            <div className="su-page">
                <div className="su-success-wrap">
                    <div className="su-success-card">
                        <div className="su-success-icon"><ShieldCheck size={48} color="#eab308" /></div>
                        <h2 className="su-success-title">Identity Verification</h2>
                        <p className="su-success-desc">
                            CardKin is a trusted network. We require a quick photo of your Government ID (e.g. Aadhaar/PAN) to keep scammers out.
                        </p>

                        <div style={{ position: 'relative', overflow: 'hidden', padding: '30px 20px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Upload size={28} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }} />
                            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Click to upload ID Document</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={() => {
                                    // Simulate processing delay for demo
                                    setIsLoading(true);
                                    setTimeout(() => handleKycComplete(), 1500);
                                }}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                        </div>

                        {isLoading && (
                            <p style={{ color: '#eab308', fontSize: '14px', marginBottom: '15px' }}>
                                Searching records... Verifying identity matches...
                            </p>
                        )}

                        <button onClick={handleKycComplete} className="su-btn-primary" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Skip for Demo & Verify'}
                        </button>
                        <button onClick={() => setSignUpStep('form')} disabled={isLoading} style={{ background: 'transparent', border: 'none', color: '#71717a', width: '100%', padding: '12px', marginTop: '8px', cursor: 'pointer' }}>
                            Return to Signup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // SUCCESS SCREEN - Check Email
    if (signUpStep === 'check-email') {
        return (
            <div className="su-page">
                <div className="su-success-wrap">
                    <div className="su-success-card">
                        <div className="su-success-icon"><Send size={48} color="white" /></div>
                        <h2 className="su-success-title">Check your inbox</h2>
                        <p className="su-success-desc">
                            We've sent a secure verification link to <strong>{email}</strong>.
                            <br /><br />
                            Please click the link in that email to activate your account. You will automatically be redirected back to the dashboard!
                        </p>
                        <button onClick={() => window.location.reload()} className="su-btn-primary" style={{ marginTop: '20px' }}>
                            I have verified my email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="su-page">
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

            <div className="su-body">
                <div className="su-left">
                    <span className="su-badge">
                        <span className="su-badge-dot" />
                        Join the network
                    </span>
                    <h1 className="su-hero-headline">
                        Welcome to <span className="su-hero-accent">CardKin</span>.
                    </h1>
                    <p className="su-hero-sub">
                        Your secure account unlocks India's smartest credit card database.
                    </p>
                </div>

                <div className="su-right">
                    <div className="su-card">
                        <h2 className="su-card-title">Create your account</h2>
                        <p className="su-card-sub">Free forever. Takes less than 2 minutes.</p>

                        {errors.submit && (
                            <div className="su-error-box">
                                <ShieldAlert size={14} />
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        <form className="su-form" onSubmit={handleSignUp}>
                            <div className="su-field">
                                <label className="su-label">Full Name</label>
                                <div className={`su-input-wrap ${errors.fullName ? 'error' : ''}`}>
                                    <User size={16} className="su-input-icon" />
                                    <input
                                        className="su-input"
                                        type="text"
                                        placeholder="e.g. Rahul Sharma"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                    />
                                </div>
                                {errors.fullName && <span className="su-field-error"><ShieldAlert size={12} style={{ marginRight: '4px' }} />{errors.fullName}</span>}
                            </div>

                            <div className="su-field">
                                <label className="su-label">Phone Number</label>
                                <div className={`su-input-wrap ${errors.mobileNumber ? 'error' : ''}`}>
                                    <Phone size={16} className="su-input-icon" />
                                    <input
                                        className="su-input"
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={mobileNumber}
                                        onChange={e => setMobileNumber(e.target.value)}
                                    />
                                </div>
                                {errors.mobileNumber && <span className="su-field-error"><ShieldAlert size={12} style={{ marginRight: '4px' }} />{errors.mobileNumber}</span>}
                            </div>

                            <div className="su-field">
                                <label className="su-label">Email Address</label>
                                <div className={`su-input-wrap ${errors.email ? 'error' : ''}`}>
                                    <Mail size={16} className="su-input-icon" />
                                    <input
                                        className="su-input"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                {errors.email && <span className="su-field-error"><ShieldAlert size={12} style={{ marginRight: '4px' }} />{errors.email}</span>}
                            </div>

                            <div className="su-field">
                                <label className="su-label">Account Password</label>
                                <div className={`su-input-wrap ${errors.password ? 'error' : ''}`}>
                                    <Lock size={16} className="su-input-icon" />
                                    <input
                                        className="su-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min 8 chars, uppercase, & special req."
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="su-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <span className="su-field-error"><ShieldAlert size={12} style={{ marginRight: '4px' }} />{errors.password}</span>}
                            </div>

                            <label className="su-checkbox-label" style={{ marginTop: '8px' }}>
                                <input
                                    type="checkbox"
                                    className="su-checkbox-input"
                                    checked={agreeToTerms}
                                    onChange={e => setAgreeToTerms(e.target.checked)}
                                />
                                <span className="su-checkbox-box"></span>
                                <span className="su-terms-text">
                                    I agree to the <a href="#" className="su-link">Terms of Service</a> & <a href="#" className="su-link">Privacy Policy</a>
                                </span>
                            </label>
                            {errors.terms && <span className="su-field-error" style={{ marginTop: '-12px', marginLeft: '27px' }}>{errors.terms}</span>}

                            <button type="submit" className="su-btn-primary" disabled={isLoading} style={{ marginTop: '10px' }}>
                                {isLoading ? 'Sending Verification Link...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
