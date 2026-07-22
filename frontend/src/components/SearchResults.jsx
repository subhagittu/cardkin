import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Search, CheckCircle, MessageSquare, Loader, Sparkles, CreditCard, Wifi, Lock, Activity } from 'lucide-react';
import './SearchResults.css';

export default function SearchResults({ searchQuery, onBack }) {
    const [searching, setSearching] = useState(true);
    const [progress, setProgress] = useState(0);
    const [logEntries, setLogEntries] = useState([]);
    const [activeMetric, setActiveMetric] = useState(0);

    // Full mock cardholder registry — filtered by search query
    const allCardholders = [
        { id: 1, name: "Rohan Sharma", phone: "+91 98765 43210", card: "HDFC Infinia Metal", rating: 4.9, matches: 46, initials: "RS" },
        { id: 2, name: "Priya Kapoor", phone: "+91 91234 56789", card: "HDFC Infinia Metal", rating: 4.8, matches: 31, initials: "PK" },
        { id: 3, name: "Sneha Reddy", phone: "+91 81234 56789", card: "ICICI Sapphiro", rating: 4.8, matches: 32, initials: "SR" },
        { id: 4, name: "Vikram Malhotra", phone: "+91 70123 45678", card: "SBI Aurum", rating: 4.7, matches: 18, initials: "VM" },
        { id: 5, name: "Anjali Mehta", phone: "+91 99887 76655", card: "Axis Magnus", rating: 4.6, matches: 22, initials: "AM" },
        { id: 6, name: "Karthik Iyer", phone: "+91 88776 65544", card: "ICICI Sapphiro", rating: 4.9, matches: 57, initials: "KI" },
        { id: 7, name: "Deepa Nair", phone: "+91 77665 54433", card: "Amex Platinum", rating: 4.7, matches: 14, initials: "DN" },
        { id: 8, name: "Rahul Joshi", phone: "+91 66554 43322", card: "HDFC Infinia Metal", rating: 4.5, matches: 9, initials: "RJ" },
        { id: 9, name: "Meera Singh", phone: "+91 55443 32211", card: "Axis Magnus", rating: 4.8, matches: 38, initials: "MS" },
        { id: 10, name: "Arjun Patel", phone: "+91 44332 21100", card: "SBI Aurum", rating: 4.6, matches: 11, initials: "AP" },
        { id: 11, name: "Nisha Gupta", phone: "+91 33221 10099", card: "Kotak Royale Signature", rating: 4.7, matches: 19, initials: "NG" },
        { id: 12, name: "Suresh Pillai", phone: "+91 22110 09988", card: "Yes First Exclusive", rating: 4.5, matches: 7, initials: "SP" },
    ];

    // Filter cardholders whose card name matches the search query (case-insensitive)
    const cardholders = allCardholders.filter(ch =>
        ch.card.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusMessages = [
        { time: '00:00', msg: 'Initializing secure network scan...', type: 'info' },
        { time: '00:01', msg: `Query indexed: "${searchQuery}"`, type: 'success' },
        { time: '00:02', msg: 'Authenticating cardholder registry...', type: 'info' },
        { time: '00:03', msg: 'Encrypting location handshake (AES-256)...', type: 'info' },
        { time: '00:04', msg: 'Proximity nodes discovered: 12', type: 'success' },
        { time: '00:05', msg: 'Filtering by card category & reward tier...', type: 'info' },
        { time: '00:06', msg: 'Verified matches found: 3', type: 'success' },
        { time: '00:07', msg: 'Building secure contact index...', type: 'info' },
        { time: '00:08', msg: 'Scan complete. Results ready.', type: 'success' },
    ];

    // Progress bar simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setSearching(false), 600);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);
        return () => clearInterval(interval);
    }, []);

    // Progressive log entries
    useEffect(() => {
        if (!searching) return;
        const timers = statusMessages.map((entry, i) =>
            setTimeout(() => {
                setLogEntries(prev => [...prev, entry]);
            }, i * 450)
        );
        return () => timers.forEach(clearTimeout);
    }, [searching]);

    // Cycle active metric
    useEffect(() => {
        const interval = setInterval(() => setActiveMetric(m => (m + 1) % 4), 800);
        return () => clearInterval(interval);
    }, []);

    const handleCloseModal = () => { };

    return (
        <div className="search-results-viewport animate-fade-in">

            {searching ? (
                /* ENTERPRISE SCANNER SCREEN */
                <div className="biz-scan-wrapper">
                    {/* Top Status Bar */}
                    <div className="biz-topbar">
                        <div className="biz-topbar-left">
                            <span className="biz-live-dot"></span>
                            <span className="biz-live-label">LIVE SCAN</span>
                        </div>
                        <div className="biz-topbar-center">
                            <span className="biz-topbar-title">CardKin Network Intelligence</span>
                        </div>
                        <div className="biz-topbar-right">
                            <Wifi size={13} className="biz-wifi-icon" />
                            <span>ENCRYPTED</span>
                            <Lock size={12} />
                        </div>
                    </div>

                    {/* Main 3-Column Layout */}
                    <div className="biz-main-grid">

                        {/* LEFT: Animated Credit Card Scanner */}
                        <div className="biz-card-scanner-col">
                            <p className="biz-col-label">SCANNING CARD NETWORK</p>
                            <div className="biz-card-scene">
                                {/* Animated credit card */}
                                <div className="biz-credit-card">
                                    <div className="biz-card-chip"></div>
                                    <div className="biz-card-wave-lines">
                                        <div className="biz-wave-line w1"></div>
                                        <div className="biz-wave-line w2"></div>
                                        <div className="biz-wave-line w3"></div>
                                    </div>
                                    <div className="biz-card-number">•••• •••• •••• ••••</div>
                                    <div className="biz-card-bottom">
                                        <span>CARDHOLDER</span>
                                        <span>{searchQuery.toUpperCase()}</span>
                                    </div>
                                    {/* Scan beam */}
                                    <div className="biz-scan-beam"></div>
                                </div>
                                {/* Corner brackets */}
                                <div className="biz-bracket tl"></div>
                                <div className="biz-bracket tr"></div>
                                <div className="biz-bracket bl"></div>
                                <div className="biz-bracket br"></div>
                            </div>
                            {/* Metrics row below card */}
                            <div className="biz-metrics-row">
                                {[
                                    { label: 'NODES', value: '247' },
                                    { label: 'VERIFIED', value: '3' },
                                    { label: 'PROXIMITY', value: '5km' },
                                    { label: 'ENCRYPTION', value: '256' },
                                ].map((m, i) => (
                                    <div key={i} className={`biz-metric-item ${activeMetric === i ? 'biz-metric-active' : ''}`}>
                                        <span className="biz-metric-val">{m.value}</span>
                                        <span className="biz-metric-lbl">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CENTER: Progress & Status Log */}
                        <div className="biz-status-col">
                            <p className="biz-col-label">SEARCH PROTOCOL</p>
                            <div className="biz-progress-block">
                                <div className="biz-progress-header">
                                    <span>Search Progress</span>
                                    <span className="biz-progress-pct">{Math.round(progress)}%</span>
                                </div>
                                <div className="biz-progress-track">
                                    <div className="biz-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="biz-progress-stages">
                                    {['INDEX', 'AUTH', 'SCAN', 'MATCH', 'READY'].map((s, i) => (
                                        <span key={s} className={`biz-stage-chip ${progress >= (i + 1) * 20 ? 'biz-stage-done' : ''}`}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="biz-log-panel">
                                <div className="biz-log-header">
                                    <Activity size={12} />
                                    <span>ACTIVITY LOG</span>
                                </div>
                                <div className="biz-log-entries">
                                    {logEntries.map((entry, i) => (
                                        <div key={i} className={`biz-log-row biz-log-${entry.type} biz-log-appear`}>
                                            <span className="biz-log-time">{entry.time}</span>
                                            <span className="biz-log-dot"></span>
                                            <span className="biz-log-msg">{entry.msg}</span>
                                        </div>
                                    ))}
                                    <div className="biz-log-cursor"></div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Data stream */}
                        <div className="biz-datastream-col">
                            <p className="biz-col-label">DATA STREAM</p>
                            <div className="biz-datastream-box">
                                <div className="biz-stream-inner">
                                    {Array.from({ length: 22 }).map((_, i) => (
                                        <div key={i} className="biz-stream-row" style={{ animationDelay: `${i * 0.18}s` }}>
                                            <span className="biz-stream-key">{['HDFC', 'ICICI', 'SBI', 'AXIS', 'YES', 'AMEX', 'KOTAK', 'CITI'][i % 8]}_</span>
                                            <span className="biz-stream-val">{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="biz-security-badge">
                                <Lock size={12} />
                                <span>AES-256 Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ENTERPRISE RESULTS PANEL */
                <div className="res-outer">
                    {/* Results summary bar */}
                    <div className="res-header-bar">
                        <div className="res-header-left">
                            <div className="res-live-badge">
                                <span className="res-live-dot"></span>
                                <span>LIVE RESULTS</span>
                            </div>
                            <h2 className="res-main-title">Cardholder Network</h2>
                            <p className="res-sub">Displaying verified matches for <span className="res-query-chip">{searchQuery}</span></p>
                        </div>
                        <div className="res-header-stats">
                            <div className="res-stat-card">
                                <span className="res-stat-num">{cardholders.length}</span>
                                <span className="res-stat-lbl">Matches Found</span>
                            </div>
                            <div className="res-stat-card">
                                <span className="res-stat-num">Free</span>
                                <span className="res-stat-lbl">Contact Access</span>
                            </div>
                            <div className="res-stat-card res-stat-enc">
                                <Lock size={14} className="res-enc-icon" />
                                <span className="res-stat-lbl">AES-256 Encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Cardholder cards */}
                    <div className="res-cards-list">
                        {cardholders.length === 0 ? (
                            <div className="res-empty-state">
                                <ShieldCheck size={40} className="res-empty-icon" />
                                <h3>No Matches Found</h3>
                                <p>No cardholders found with <strong>"{searchQuery}"</strong>. Try a different card name.</p>
                            </div>
                        ) : cardholders.map((ch, idx) => (
                            <div key={ch.id} className="res-ch-card res-ch-unlocked">
                                {/* Left accent strip */}
                                <div className="res-card-accent-strip"></div>

                                {/* Rank badge */}
                                <div className="res-rank-badge">#{idx + 1}</div>

                                {/* Avatar section */}
                                <div className="res-avatar-section">
                                    <div className="res-avatar">{ch.initials}</div>
                                    <div className="res-match-ring">
                                        <svg viewBox="0 0 40 40" className="res-ring-svg">
                                            <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                            <circle cx="20" cy="20" r="17" fill="none"
                                                stroke={ch.rating >= 4.8 ? '#f59e0b' : '#10b981'}
                                                strokeWidth="3"
                                                strokeDasharray={`${(ch.rating / 5) * 107} 107`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 20 20)" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Main info */}
                                <div className="res-ch-main">
                                    <div className="res-ch-name-row">
                                        <h3 className="res-ch-name">{ch.name}</h3>
                                        <span className="res-verified-badge"><ShieldCheck size={11} /> Verified</span>
                                    </div>
                                    <p className="res-card-type">{ch.card}</p>

                                    <div className="res-meta-grid">
                                        <div className="res-meta-item">
                                            <span className="res-meta-lbl">RATING</span>
                                            <span className="res-meta-val res-rating-val">★ {ch.rating}</span>
                                        </div>
                                        <div className="res-meta-item">
                                            <span className="res-meta-lbl">MATCHES</span>
                                            <span className="res-meta-val">{ch.matches}</span>
                                        </div>
                                        <div className="res-meta-item">
                                            <span className="res-meta-lbl">CONTACT</span>
                                            <span className="res-meta-val res-phone-revealed">{ch.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA — always WhatsApp, no unlock needed */}
                                <div className="res-cta-section">
                                    <a
                                        href={`https://wa.me/${ch.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ch.name)},%20I%20found%20you%20on%20CardKin%20for%20your%20${encodeURIComponent(ch.card)}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="res-cta-btn res-cta-whatsapp"
                                    >
                                        <MessageSquare size={15} />
                                        <span>Chat on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div >
    );
}
   