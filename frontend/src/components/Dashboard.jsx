import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ShieldCheck, CreditCard, PlusCircle, Unlock, Check, LogOut, Smartphone, AlertCircle, Moon, Sun, MessageSquare } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({
    onLogout,
    theme,
    toggleTheme,
    user,
    myCards = [],
    setMyCards = () => { }
}) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [targetCardholder, setTargetCardholder] = useState(null);
    const [paymentStep, setPaymentStep] = useState('method');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [upiPin, setUpiPin] = useState('');
    const [upiError, setUpiError] = useState('');

    // Real data arrays instead of mocking
    const [cardholders, setCardholders] = useState([]);
    const [inboundRequests, setInboundRequests] = useState([]); // Empty until we add an inbound table

    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardBank, setNewCardBank] = useState('HDFC Bank');
    const [newCardNetwork, setNewCardNetwork] = useState('Visa');
    const [newCardColor, setNewCardColor] = useState('dark-gold');

    // Fetch actual profiles mapped securely to the UI structure
    useEffect(() => {
        let isMounted = true;
        const fetchProfiles = async () => {
            const { supabase } = await import('../lib/supabaseClient');
            const { data, error } = await supabase.from('profiles').select('*');
            if (data && isMounted) {
                // Map the raw public DB schema into the visual formats expected by the UI.
                // Exclude the currently logged-in user so they don't search for themselves!
                const otherUsers = data.filter(p => p.id !== user?.id);

                const mapped = otherUsers.map(p => {
                    const fullName = p.full_name || 'Anonymous User';
                    return {
                        id: p.id,
                        name: fullName,
                        avatarColor: '#4f46e5', // Generate dynamic generic color if desired
                        verified: true, // We can toggle this when DB implements KYC verified boolean
                        rating: parseFloat(p.rating || 5.0),
                        distance: "Online", // Assuming distance scaling to digital platform
                        cards: p.owned_cards || [],
                        phone: p.phone || 'Not Provided'
                    };
                });

                setCardholders(mapped);
            }
        };
        fetchProfiles();
        return () => { isMounted = false; };
    }, [user]);

    // Live search against real Supabase Data
    const filteredCardholders = cardholders.filter(holder => {
        // Exclude users who haven't populated any cards yet to keep the UI clean
        if (!holder.cards || holder.cards.length === 0) return false;

        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();

        return holder.cards.some(card =>
            (card.name && card.name.toLowerCase().includes(query)) ||
            (card.bank && card.bank.toLowerCase().includes(query))
        );
    }).sort((a, b) => b.rating - a.rating);

    const startUnlockFlow = (cardholder) => {
        setTargetCardholder(cardholder);
        setPaymentStep('method');
        setSelectedMethod('');
        setUpiPin('');
        setUpiError('');
        setShowUpiModal(true);
    };

    const selectPaymentMethod = (method) => {
        setSelectedMethod(method);
        setPaymentStep('pin');
    };

    const handlePaySubmit = (e) => {
        e.preventDefault();
        if (upiPin === '1122') {
            setPaymentStep('processing');
            setTimeout(() => {
                setPaymentStep('success');
                setUnlockedIds(prev => [...prev, targetCardholder.id]);
            }, 1800);
        } else {
            setUpiError('Invalid UPI PIN. Hint: Enter 1122');
        }
    };

    const handleAddCardSubmit = async (e) => {
        e.preventDefault();
        if (!newCardName.trim() || !user) return;

        const newId = Date.now();
        const cardObj = {
            id: newId,
            name: newCardName,
            bank: newCardBank,
            network: newCardNetwork,
            color: newCardColor
        };

        const updatedCards = [...myCards, cardObj];

        import('../lib/supabaseClient').then(async ({ supabase }) => {
            const { error } = await supabase
                .from('profiles')
                .update({ owned_cards: updatedCards })
                .eq('id', user.id);

            if (!error) {
                setMyCards(updatedCards);
                setShowAddCardModal(false);
                setNewCardName('');
            } else {
                console.error("Error saving card:", error.message);
                alert("Failed to link card. Please try again.");
            }
        });

        // Small simulated UI hook so they immediately feel the connection effect
        setTimeout(() => {
            const mockReq = {
                id: Date.now(),
                userName: "Aarti Sinha",
                cardRequested: `${newCardName} (${newCardBank})`,
                timeAgo: "Just now",
                status: "pending",
                buyerRating: 4.85
            };
            setInboundRequests(prev => [mockReq, ...prev]);
        }, 3000);
    };

    return (
        <div className="dashboard-container animate-fade-in" onClick={() => setShowProfileDropdown(false)}>
            {/* Topbar Unified Dashboard Header */}
            <header className="dashboard-header" onClick={(e) => e.stopPropagation()}>
                <div className="dash-logo">
                    <span className="brand-logo-accent">Card</span>Kin
                    <span className="dash-badge">Workspace</span>
                </div>

                <div className="dash-header-actions">
                    <button
                        className="theme-toggle-btn theme-toggle-btn-dash"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="profile-container">
                        <button
                            className="profile-avatar-trigger"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            {user && user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                        </button>
                        {showProfileDropdown && (
                            <div className="profile-dropdown-card animate-fade-in">
                                <div className="profile-drop-header">
                                    <div className="profile-drop-avatar">
                                        {user && user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                                    </div>
                                    <div className="profile-drop-info">
                                        <h4>{user?.name || 'CardKin Member'}</h4>
                                        <p>{user?.email || 'member@cardkin.in'}</p>
                                    </div>
                                </div>
                                <div className="user-rating-metric">
                                    <Star size={14} className="star-icon" />
                                    <span><strong>5.0 Rating</strong> (New Member)</span>
                                </div>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setShowAddCardModal(true); }}>
                                    <PlusCircle size={15} />
                                    <span>Link Credit Card</span>
                                </button>
                                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); alert("Billing details options coming soon!"); }}>
                                    <CreditCard size={15} />
                                    <span>My Earnings Settings</span>
                                </button>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item logout-item" onClick={() => { setShowProfileDropdown(false); onLogout(); }}>
                                    <LogOut size={15} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="dashboard-grid-workspace">
                {/* COLUMN 1: DISCOVER AND SEARCH OFFERS */}
                <section className="dash-column-left">
                    <div className="section-intro">
                        <h1>Discover Cards & Offers</h1>
                        <p>Search for specific credit card products. Unlock coordinates of nearby verified cardholders using our simulator.</p>
                    </div>

                    <div className="search-bar-row">
                        <div className="search-input-box">
                            <Search className="inner-search-icon" size={18} />
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search by credit card name (e.g. Infinia, Atlas) or bank name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cardholders-grid">
                        {filteredCardholders.length > 0 ? (
                            filteredCardholders.map(holder => {
                                const isUnlocked = unlockedIds.includes(holder.id);
                                return (
                                    <div key={holder.id} className="cardholder-match-card">
                                        <div className="holder-profile-header">
                                            <div className="holder-avatar" style={{ backgroundColor: holder.avatarColor }}>
                                                {holder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div className="holder-identity">
                                                <h3>
                                                    {holder.name}
                                                    {holder.verified && <ShieldCheck size={16} className="verified-shield-icon" />}
                                                </h3>
                                                <span className="distance-badge">
                                                    <MapPin size={12} />
                                                    {holder.distance}
                                                </span>
                                            </div>
                                            <div className="holder-ratings">
                                                <Star size={14} className="star-icon" />
                                                <span>{holder.rating.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="holder-cards-list">
                                            <span className="section-lbl">Listed Cards</span>
                                            <div className="holder-cards-flex">
                                                {holder.cards.map((c, i) => (
                                                    <div key={i} className={`mini-card-pill ${c.color || 'dark-gold'}`}>
                                                        <span className="mini-bank">{c.bank}</span>
                                                        <span className="mini-name">{c.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="holder-card-footer">
                                            {isUnlocked ? (
                                                <div className="contact-revealed-row">
                                                    <div className="phone-display-box">
                                                        <Smartphone size={14} />
                                                        <span>{holder.phone}</span>
                                                    </div>
                                                    <a
                                                        href={`https://wa.me/${holder.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="whatsapp-chat-btn"
                                                    >
                                                        Chat on WhatsApp
                                                    </a>
                                                </div>
                                            ) : (
                                                <button
                                                    className="unlock-contact-btn"
                                                    onClick={() => startUnlockFlow(holder)}
                                                >
                                                    <Unlock size={14} />
                                                    <span>Unlock Contact (₹49 Match Fee)</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-matches-box">
                                <AlertCircle size={32} />
                                <p>{cardholders.length === 0 ? "Loading network profiles..." : `No cardholders found matching "${searchQuery}"`}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* COLUMN 2: MY OWN CREDIT CARDS & INBOX MATCH REQUESTS */}
                <section className="dash-column-right">
                    <div className="my-portfolio-section">
                        <div className="portfolio-header-row">
                            <h3>My Linked Cards ({myCards.length})</h3>
                            <button
                                className="add-card-link-trigger-btn"
                                onClick={() => setShowAddCardModal(true)}
                            >
                                <PlusCircle size={14} />
                                <span>Link Credit Card</span>
                            </button>
                        </div>

                        <div className="portfolio-cards-vertical-list">
                            {myCards.length > 0 ? (
                                myCards.map((card) => (
                                    <div key={card.id} className={`portfolio-credit-card-row ${card.color || 'dark-gold'}`}>
                                        <div className="p-card-row-info">
                                            <div className="p-card-row-bank">{card.bank}</div>
                                            <div className="p-card-row-name">{card.name}</div>
                                        </div>
                                        <span className="p-card-row-network">{card.network}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-cards-dash-msg">
                                    <p>You haven't linked any cards yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="inbound-requests-section">
                        <div className="section-header-row">
                            <h3>Inbound Requests</h3>
                            <span className="requests-badge-count">{inboundRequests.length}</span>
                        </div>
                        <p className="requests-desc-p">
                            Requests from online buyers who unlocked card details containing your listed card offers:
                        </p>

                        <div className="inbound-requests-list">
                            {inboundRequests.length > 0 ? (
                                inboundRequests.map((req) => (
                                    <div key={req.id} className="inbound-request-item-card">
                                        <div className="req-item-header">
                                            <div className="req-item-left">
                                                <span className="req-item-name">{req.userName}</span>
                                                <div className="req-item-rating">
                                                    <Star size={11} className="star-icon" />
                                                    <span>{req.buyerRating.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <span className="req-item-time">{req.timeAgo}</span>
                                        </div>
                                        <div className="req-item-body">
                                            Unlocked coordinates for your <strong>{req.cardRequested}</strong> card.
                                        </div>
                                        <div className="req-item-footer">
                                            {req.status === 'unlocked' ? (
                                                <span className="req-status-locked-badge status-unlocked">
                                                    <Check size={12} />
                                                    <span>Buyer Unlocked</span>
                                                </span>
                                            ) : (
                                                <span className="req-status-locked-badge status-pending">
                                                    <MessageSquare size={12} />
                                                    <span>Pending Contact</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-requests-msg">
                                    <AlertCircle size={20} />
                                    <span>No inbound requests logged yet. Link more cards to attract buyers.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {showUpiModal && targetCardholder && (
                <div className="upi-modal-overlay" onClick={() => setShowUpiModal(false)}>
                    <div className="upi-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="upi-modal-header">
                            <h2>CardKin Match Gateway</h2>
                            <button className="upi-close-btn" onClick={() => setShowUpiModal(false)}>×</button>
                        </div>
                        {paymentStep === 'method' && (
                            <div className="upi-step-content">
                                <div className="match-summary-indicator">
                                    <span className="summary-title">Unlock Match Coordinates</span>
                                    <span className="summary-desc">Requesting contact for <strong>{targetCardholder.name}</strong></span>
                                    <span className="fee-amount">₹49.00</span>
                                </div>
                                <p className="method-label">Select UPI Wallet App:</p>
                                <div className="upi-methods-grid">
                                    <button className="upi-method-btn" onClick={() => selectPaymentMethod('Google Pay')}>
                                        <span className="upi-logo-gpay">GPay</span>
                                    </button>
                                    <button className="upi-method-btn" onClick={() => selectPaymentMethod('PhonePe')}>
                                        <span className="upi-logo-phonepe">PhonePe</span>
                                    </button>
                                    <button className="upi-method-btn" onClick={() => selectPaymentMethod('Paytm')}>
                                        <span className="upi-logo-paytm">Paytm</span>
                                    </button>
                                </div>
                                <span className="secure-lbl">🔐 Secured CardKin fee gateway</span>
                            </div>
                        )}
                        {paymentStep === 'pin' && (
                            <form onSubmit={handlePaySubmit} className="upi-step-content">
                                <div className="pin-summary-indicator">
                                    <span>Paying to <strong>CardKin Community</strong></span>
                                    <span className="pin-fee">₹49.00</span>
                                </div>
                                <div className="pin-input-group">
                                    <label className="pin-label">Enter 4-Digit UPI PIN ({selectedMethod})</label>
                                    <input
                                        type="password"
                                        className="pin-box-input"
                                        placeholder="••••"
                                        maxLength="4"
                                        value={upiPin}
                                        onChange={(e) => {
                                            setUpiPin(e.target.value.replace(/\D/g, ''));
                                            setUpiError('');
                                        }}
                                        autoFocus
                                    />
                                    <span className="upi-tip-msg">Hint: Enter mock PIN <strong>1122</strong></span>
                                    {upiError && (
                                        <div className="upi-error-msg">
                                            <AlertCircle size={14} />
                                            <span>{upiError}</span>
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="upi-pay-submit-btn">
                                    Confirm Payment
                                </button>
                            </form>
                        )}
                        {paymentStep === 'processing' && (
                            <div className="upi-step-content text-center-wrap">
                                <div className="upi-spinner"></div>
                                <h3>Processing matchmaking fee...</h3>
                                <p>Checking secure wallet logs</p>
                            </div>
                        )}
                        {paymentStep === 'success' && (
                            <div className="upi-step-content text-center-wrap success-state">
                                <div className="payment-success-badge">
                                    <Check size={32} />
                                </div>
                                <h2>Payment Successful!</h2>
                                <p>₹49 match fee received. Selected cardholder details are now unlocked.</p>
                                <button
                                    className="upi-success-done-btn"
                                    onClick={() => setShowUpiModal(false)}
                                >
                                    Proceed to Match details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showAddCardModal && (
                <div className="upi-modal-overlay" onClick={() => setShowAddCardModal(false)}>
                    <div className="upi-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="upi-modal-header">
                            <h2>Link Credit Card to Profile</h2>
                            <button className="upi-close-btn" onClick={() => setShowAddCardModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddCardSubmit} className="add-card-form">
                            <div className="form-group">
                                <label className="form-label">Card Product Name</label>
                                <input
                                    type="text"
                                    className="dash-text-input"
                                    placeholder="e.g. Infinia, Atlas, Regalia"
                                    value={newCardName}
                                    onChange={(e) => setNewCardName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Issuing Bank</label>
                                <select
                                    className="dash-select-field"
                                    value={newCardBank}
                                    onChange={(e) => setNewCardBank(e.target.value)}
                                >
                                    <option value="HDFC Bank">HDFC Bank</option>
                                    <option value="Axis Bank">Axis Bank</option>
                                    <option value="SBI Card">SBI Card</option>
                                    <option value="ICICI Bank">ICICI Bank</option>
                                    <option value="Kotak Bank">Kotak Bank</option>
                                    <option value="IndusInd Bank">IndusInd Bank</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Card Network</label>
                                <select
                                    className="dash-select-field"
                                    value={newCardNetwork}
                                    onChange={(e) => setNewCardNetwork(e.target.value)}
                                >
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="RuPay">RuPay</option>
                                    <option value="Amex">American Express</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Visual Theme / Background</label>
                                <select
                                    className="dash-select-field"
                                    value={newCardColor}
                                    onChange={(e) => setNewCardColor(e.target.value)}
                                >
                                    <option value="dark-gold">Deep Gold/Black</option>
                                    <option value="silver-dark">Space Silver/Black</option>
                                    <option value="deep-teal">Deep Teal/Aqua</option>
                                    <option value="platinum">Platinum/Silver</option>
                                </select>
                            </div>
                            <button type="submit" className="add-card-submit-btn">
                                Link Credit Card
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

