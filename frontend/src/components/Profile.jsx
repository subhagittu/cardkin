import React, { useState } from 'react';
import {
    User, Mail, Phone, CreditCard, LogOut, CheckCircle,
    MapPin, Calendar, ShieldCheck, Edit3, Plus, Search, ChevronRight, X, Shield, Lock, Loader
} from 'lucide-react';
import './Profile.css';

export default function Profile({ user, myCards, setMyCards, onLogout, onEditProfile }) {
    const [showAddCard, setShowAddCard] = useState(false);

    // Razorpay Mock State
    const [rzpStep, setRzpStep] = useState('details');
    const [dummyCardPan, setDummyCardPan] = useState('');
    const [dummyExp, setDummyExp] = useState('');
    const [dummyCvv, setDummyCvv] = useState('');
    const [dummyOtp, setDummyOtp] = useState('');

    const [newCardName, setNewCardName] = useState('');
    const [newCardBank, setNewCardBank] = useState('HDFC Bank');
    const [newCardNetwork, setNewCardNetwork] = useState('Visa');

    // Extract Initials
    const userInitials = user && user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    const handleRzpSubmit = (e) => {
        e.preventDefault();
        setRzpStep('processing');
        setTimeout(() => setRzpStep('otp'), 1500);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setRzpStep('processing');
        setTimeout(() => {
            setRzpStep('success');
            setTimeout(() => {
                executeLinkCard();
            }, 1000);
        }, 2000);
    };

    const executeLinkCard = async () => {
        if (!newCardName.trim() || !user) return;
        const cardObj = {
            id: Date.now(),
            name: newCardName,
            bank: newCardBank,
            network: newCardNetwork,
            last4: dummyCardPan.replace(/\D/g, '').slice(-4) || 'XXXX',
            dateAdded: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        };

        const updatedCards = [...(myCards || []), cardObj];

        import('../lib/supabaseClient').then(async ({ supabase }) => {
            const { error } = await supabase
                .from('profiles')
                .update({ owned_cards: updatedCards })
                .eq('id', user.id);

            if (!error) {
                if (setMyCards) setMyCards(updatedCards);
                // Reset states
                setNewCardName('');
                setDummyCardPan('');
                setDummyExp('');
                setDummyCvv('');
                setDummyOtp('');
                setRzpStep('details');
                setShowAddCard(false);
            } else {
                console.error("Error saving card:", error.message);
                alert("Failed to link card. Please try again.");
                setShowAddCard(false);
            }
        });
    };

    return (
        <div className="profile-viewport">
            {/* --- HERO HEADER --- */}
            <div className="profile-hero">
                <div className="profile-hero-content">
                    <div className="profile-hero-left">
                        <div className="profile-hero-avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{userInitials}</span>
                            )}
                        </div>
                        <div className="profile-hero-info">
                            <div className="profile-hero-title-row">
                                <h1 className="profile-hero-name">{user?.name || 'CardKin Member'}</h1>
                                <span className="profile-hero-badge">PLATINUM MEMBER</span>
                            </div>
                            <p className="profile-hero-subtitle">Credit & Rewards Enthusiast</p>
                            <div className="profile-hero-meta">
                                <span className="meta-item"><ShieldCheck size={16} color={user?.kyc_verified ? "#22c55e" : "gray"} /> {user?.kyc_verified ? 'KYC Verified' : 'Unverified'}</span>
                                <span className="meta-item"><Calendar size={16} /> Member since 2024</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-hero-right">
                        <button className="profile-action-btn edit-btn" onClick={onEditProfile}>
                            <Edit3 size={16} /> Edit Profile
                        </button>
                        <button onClick={onLogout} className="profile-action-btn logout-btn">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM GRID --- */}
            <div className="profile-main-grid">

                {/* LEFT COLUMN */}
                <div className="profile-left-col">

                    {/* Contact Information Card */}
                    <div className="profile-block-card">
                        <h3 className="profile-block-title">Contact Information</h3>
                        <div className="profile-contact-list">
                            <div className="contact-row">
                                <div className="contact-icon"><Mail size={16} /></div>
                                <div className="contact-text">
                                    <span className="contact-lbl">Email Address</span>
                                    <span className="contact-val">{user?.email || 'email@example.com'}</span>
                                </div>
                            </div>
                            <div className="contact-row">
                                <div className="contact-icon"><Phone size={16} /></div>
                                <div className="contact-text">
                                    <span className="contact-lbl">Phone Number</span>
                                    <span className="contact-val">{user?.phone || 'Not Provided'}</span>
                                </div>
                            </div>
                            <div className="contact-row">
                                <div className="contact-icon"><MapPin size={16} /></div>
                                <div className="contact-text">
                                    <span className="contact-lbl">Residential Address</span>
                                    <span className="contact-val">India (Primary)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dark CTA Card */}
                    <div className="profile-cta-card">
                        <div className="cta-icon-box">
                            <CreditCard size={24} color="white" />
                        </div>
                        <h3 className="cta-title">Link Credit Card</h3>
                        <p className="cta-desc">Expand your portfolio power by adding new cards.</p>
                        <button onClick={() => setShowAddCard(!showAddCard)} className="cta-btn">
                            Get Started <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="profile-right-col">
                    <div className="profile-block-card full-height">
                        <div className="block-header-flex">
                            <h3 className="profile-block-title mb-0">Linked Cards</h3>
                            <button className="view-all-link">View All ↗</button>
                        </div>

                        {/* Table Header */}
                        <div className="table-header-row">
                            <div className="th-item">Card / Item</div>
                            <div className="th-item">Bank</div>
                            <div className="th-item">Network</div>
                            <div className="th-item text-right">Status</div>
                        </div>

                        {/* Linked Cards List */}
                        <div className="profile-list-container">
                            {myCards && myCards.length > 0 ? (
                                myCards.map((card, idx) => (
                                    <div key={card.id || idx} className="profile-list-row">
                                        <div className="row-col-main">
                                            <div className="row-icon-circle blue-tint">
                                                <CreditCard size={18} />
                                            </div>
                                            <div className="row-text-group">
                                                <span className="row-primary-text">{card.name}</span>
                                                <span className="row-secondary-text">Role: Owner</span>
                                            </div>
                                        </div>

                                        <div className="row-col-date">
                                            <span className="row-primary-text">{card.bank}</span>
                                            <span className="row-secondary-text">**{card.last4 || (card.id || 0).toString().slice(-4) || '1024'}</span>
                                        </div>

                                        <div className="row-col-amount">
                                            {card.network}
                                        </div>

                                        <div className="row-col-status text-right">
                                            <div className="status-pill completed">
                                                <span className="dot"></span> Active
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-history-box">
                                    <CreditCard size={32} className="empty-icon" />
                                    <p>No cards linked to your portfolio.</p>
                                </div>
                            )}

                            {/* Old inline form removed */}
                        </div>

                    </div>
                </div>

            </div>

            {/* Razorpay Mock Modal */}
            {showAddCard && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="animate-fade-in" style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontFamily: '-apple-system, system-ui, sans-serif', border: '1px solid rgba(0,0,0,0.1)' }}>

                        {/* Header */}
                        <div style={{ background: '#0b1c31', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={20} color="#3b82f6" style={{ fill: 'currentColor' }} /> Secure Gateway</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', opacity: 0.85 }}>Verify ownership with a temporary ₹2 charge.</p>
                            </div>
                            <button onClick={() => { setShowAddCard(false); setRzpStep('details'); }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}><X size={22} /></button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px', color: '#1a1a1a' }}>

                            {rzpStep === 'processing' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                                    {/* Inline CSS animation for spinner via class or generic style */}
                                    <div style={{ animation: 'spin 1s linear infinite' }}><Loader size={48} color="#3b82f6" /></div>
                                    <p style={{ marginTop: '20px', fontWeight: '500', color: '#444' }}>Contacting Your Bank...</p>
                                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                                </div>
                            )}

                            {rzpStep === 'success' && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                                    <CheckCircle size={48} color="#22c55e" />
                                    <p style={{ marginTop: '20px', fontWeight: '600', color: '#22c55e' }}>Verification Successful</p>
                                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#666', textAlign: 'center' }}>₹2.00 will be refunded directly to limit within 24hrs.</p>
                                </div>
                            )}

                            {rzpStep === 'details' && (
                                <form onSubmit={handleRzpSubmit}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>₹ 2.00</span>
                                            <span style={{ fontSize: '11px', color: '#555', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: '600', textTransform: 'uppercase' }}>Card Validation</span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Card Alias (For UI)</label>
                                                <input type="text" required value={newCardName} onChange={e => setNewCardName(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="e.g. HDFC Swiggy" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Bank & Network</label>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <select value={newCardBank} onChange={e => setNewCardBank(e.target.value)} style={{ width: '50%', padding: '10px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: 'white', boxSizing: 'border-box' }}>
                                                        <option>HDFC</option>
                                                        <option>SBI</option>
                                                        <option>ICICI</option>
                                                        <option>Axis</option>
                                                        <option>Amex</option>
                                                    </select>
                                                    <select value={newCardNetwork} onChange={e => setNewCardNetwork(e.target.value)} style={{ width: '50%', padding: '10px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: 'white', boxSizing: 'border-box' }}>
                                                        <option>Visa</option>
                                                        <option>MCard</option>
                                                        <option>Rupay</option>
                                                        <option>Amex</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Card Number</label>
                                            <div style={{ position: 'relative' }}>
                                                <CreditCard size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                                                <input type="text" required value={dummyCardPan} onChange={e => setDummyCardPan(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', letterSpacing: '1px', boxSizing: 'border-box' }} placeholder="0000 0000 0000 0000" />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>Expiry</label>
                                                <input type="text" required value={dummyExp} onChange={e => setDummyExp(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="MM / YY" />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '6px', fontWeight: '500' }}>CVV</label>
                                                <input type="password" required value={dummyCvv} onChange={e => setDummyCvv(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="***" maxLength="4" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}>
                                        <Lock size={16} /> Pay ₹ 2.00
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#64748b', lineHeight: 1.4, padding: '0 10px' }}>
                                        <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#22c55e' }} />
                                        Your card credentials are encrypted and stored solely by the banking provider. We do not store full card numbers.
                                    </div>
                                </form>
                            )}

                            {rzpStep === 'otp' && (
                                <form onSubmit={handleOtpSubmit}>
                                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                        <h4 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '10px', color: '#111' }}>Confirm Payment</h4>
                                        <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.5 }}>A One Time Password (OTP) has been sent to your registered mobile number ending in <strong>{user?.phone?.slice(-4) || 'XXXX'}</strong>.</p>
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', fontSize: '12.5px', color: '#4b5563', marginBottom: '8px', textAlign: 'center', fontWeight: '500' }}>Enter Bank OTP</label>
                                        <input type="text" required autoFocus value={dummyOtp} onChange={e => setDummyOtp(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '20px', textAlign: 'center', letterSpacing: '4px', boxSizing: 'border-box', background: '#f8fafc' }} placeholder="• • • • • •" />
                                    </div>
                                    <button type="submit" style={{ width: '100%', background: '#22c55e', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)' }}>
                                        Submit & Verify
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
