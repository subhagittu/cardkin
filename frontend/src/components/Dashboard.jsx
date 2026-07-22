import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, CreditCard, PlusCircle, Unlock, Check, LogOut, Smartphone, AlertCircle, Moon, Sun, MessageSquare } from 'lucide-react';
import './Dashboard.css';

// Mock Cardholders Database
const initialCardholders = [
    {
        id: 1,
        name: "Rohan Sharma",
        avatarColor: "#fbbf24",
        verified: true,
        rating: 4.95,
        distance: "0.8 km",
        matchesCount: 42,
        cards: [
            { name: "Infinia", bank: "HDFC Bank", network: "Visa", color: "dark-gold" },
            { name: "Atlas", bank: "Axis Bank", network: "Visa", color: "silver-dark" }
        ],
        phone: "+91 98765 43210"
    },
    {
        id: 2,
        name: "Priyanka Patel",
        avatarColor: "#ec4899",
        verified: true,
        rating: 4.88,
        distance: "1.2 km",
        matchesCount: 29,
        cards: [
            { name: "Cashback", bank: "SBI Card", network: "RuPay", color: "deep-teal" }
        ],
        phone: "+91 91234 56789"
    },
    {
        id: 3,
        name: "Anand Verma",
        avatarColor: "#10b981",
        verified: true,
        rating: 4.79,
        distance: "2.5 km",
        matchesCount: 15,
        cards: [
            { name: "Sapphiro", bank: "ICICI Bank", network: "Mastercard", color: "platinum" }
        ],
        phone: "+91 99887 76655"
    },
    {
        id: 4,
        name: "Aditya Roy",
        avatarColor: "#8b5cf6",
        verified: false,
        rating: 4.54,
        distance: "3.7 km",
        matchesCount: 8,
        cards: [
            { name: "Infinia", bank: "HDFC Bank", network: "Visa", color: "dark-gold" }
        ],
        phone: "+91 98761 23456"
    }
];

// Mock Inbound Requests list
const initialInboundRequests = [
    {
        id: 1,
        userName: "Rahul Verma",
        cardRequested: "Cashback (SBI Card)",
        timeAgo: "2 mins ago",
        status: "unlocked",
        buyerRating: 4.9
    },
    {
        id: 2,
        userName: "Sneha Gupta",
        cardRequested: "Infinia (HDFC Bank)",
        timeAgo: "1 hour ago",
        status: "unlocked",
        buyerRating: 4.8
    },
    {
        id: 3,
        userName: "Vikram Malhotra",
        cardRequested: "Infinia (HDFC Bank)",
        timeAgo: "Yesterday",
        status: "pending",
        buyerRating: 4.6
    }
];

export default function Dashboard({
    onLogout,
    theme,
    toggleTheme,
    user,
    myCards = [
        { id: 101, name: "Infinia", bank: "HDFC Bank", network: "Visa", color: "dark-gold" },
        { id: 102, name: "Cashback", bank: "SBI Card", network: "RuPay", color: "deep-teal" }
    ],
    setMyCards = () => { }
}) {
    // Dropdown profile card state
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // Search query for cards you need
    const [searchQuery, setSearchQuery] = useState('');

    // Unlocked Cardholders list (stores IDs of cardholders unlocked by current user)
    const [unlockedIds, setUnlockedIds] = useState([]);

    // Open UPI Payment Modal states
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [targetCardholder, setTargetCardholder] = useState(null);
    const [paymentStep, setPaymentStep] = useState('method'); // 'method' | 'pin' | 'processing' | 'success'
    const [selectedMethod, setSelectedMethod] = useState('');
    const [upiPin, setUpiPin] = useState('');
    const [upiError, setUpiError] = useState('');

    // User's own listed cards is passed via props now


    // Live inbound requests matching user's own cards
    const [inboundRequests, setInboundRequests] = useState(initialInboundRequests);

    // Add card modal states
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardBank, setNewCardBank] = useState('HDFC Bank');
    const [newCardNetwork, setNewCardNetwork] = useState('Visa');
    const [newCardColor, setNewCardColor] = useState('dark-gold');

    // Filter cardholders based on card name/bank search
    const filteredCardholders = initialCardholders.filter(cardholder => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        // Return matching cardholders who host cards matching the search term
        return cardholder.cards.some(card =>
            card.name.toLowerCase().includes(query) ||
            card.bank.toLowerCase().includes(query)
        );
    }).sort((a, b) => b.rating - a.rating); // Sort by highest rating descending

    // Open transaction match payment modal
    const startUnlockFlow = (cardholder) => {
        setTargetCardholder(cardholder);
        setPaymentStep('method');
        setSelectedMethod('');
        setUpiPin('');
        setUpiError('');
        setShowUpiModal(true);
    };

    // Proceed to PIN entry step
    const selectPaymentMethod = (method) => {
        setSelectedMethod(method);
        setPaymentStep('pin');
    };

    // Verify mock PIN
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

    // Add card submission
    const handleAddCardSubmit = (e) => {
        e.preventDefault();
        if (!newCardName.trim()) return;

        const newId = Date.now();
        const cardObj = {
            id: newId,
            name: newCardName,
            bank: newCardBank,
            network: newCardNetwork,
            color: newCardColor
        };

        setMyCards(prev => [...prev, cardObj]);
        setShowAddCardModal(false);
        setNewCardName('');

        // Also simulate an inbound match request coming after linking a card
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
                    {/* Theme switcher */}
                    <button
                        className="theme-toggle-btn theme-toggle-btn-dash"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {/* Integrated Profile Avatar */}
                    <div className="profile-container">
                        <button
                            className="profile-avatar-trigger"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            {user && user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RS'}
                        </button>
                        {showProfileDropdown && (
                            <div className="profile-dropdown-card animate-fade-in">
                                <div className="profile-drop-header">
                                    <div className="profile-drop-avatar">
                                        {user && user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RS'}
                                    </div>
                                    <div className="profile-drop-info">
                                        <h4>{user?.name || 'Rohan Sharma'}</h4>
                                        <p>{user?.email || 'rohan.sharma@cardkin.in'}</p>
                                    </div>
                                </div>
                                <div className="user-rating-metric">
                                    <Star size={14} className="star-icon" />
                                    <span><strong>4.95 Rating</strong> (42 Shares)</span>
                                </div>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setShowAddCardModal(true); }}>
                                    <PlusCircle size={15} />
                                    <span>Link Credit Card</span>
                                </button>
                                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); alert("Billing details & earnings options coming soon!"); }}>
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

            {/* UNIFIED SIDE-BY-SIDE GRID WORKSPACE */}
            <main className="dashboard-grid-workspace">
                {/* COLUMN 1: DISCOVER AND SEARCH OFFERS */}
                <section className="dash-column-left">
                    <div className="section-intro">
                        <h1>Discover Cards & Offers</h1>
                        <p>Search for specific credit card products. Unlock coordinates of nearby verified cardholders using our simulator.</p>
                    </div>

                    {/* Search Field */}
                    <div className="search-bar-row">
                        <div className="search-input-box">
                            <Search className="inner-search-icon" size={18} />
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search by credit card name (e.g. Infinia, Atlas, Cashback) or bank name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Matches List Grid */}
                    <div className="cardholders-grid">
                        {filteredCardholders.length > 0 ? (
                            filteredCardholders.map(holder => {
                                const isUnlocked = unlockedIds.includes(holder.id);
                                return (
                                    <div key={holder.id} className="cardholder-match-card">
                                        <div className="holder-profile-header">
                                            <div className="holder-avatar" style={{ backgroundColor: holder.avatarColor }}>
                                                {holder.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="holder-identity">
                                                <h3>
                                                    {holder.name}
                                                    {holder.verified && <ShieldCheck size={16} className="verified-shield-icon" />}
                                                </h3>
                                                <span className="distance-badge">
                                                    <MapPin size={12} />
                                                    {holder.distance} away
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
                                                    <div key={i} className={`mini-card-pill ${c.color}`}>
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
                                <p>No cardholders found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* COLUMN 2: MY OWN CREDIT CARDS & INBOX MATCH REQUESTS */}
                <section className="dash-column-right">
                    {/* My Own Credit Cards Portfolio Block */}
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

                        {/* Slide/Grid Lists of user's credit cards */}
                        <div className="portfolio-cards-vertical-list">
                            {myCards.map((card) => (
                                <div key={card.id} className={`portfolio-credit-card-row ${card.color}`}>
                                    <div className="p-card-row-info">
                                        <div className="p-card-row-bank">{card.bank}</div>
                                        <div className="p-card-row-name">{card.name}</div>
                                    </div>
                                    <span className="p-card-row-network">{card.network}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inbox Match requests received */}
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

            {/* A. ₹49 UPI MATCHMAKING FEE MODAL */}
            {showUpiModal && targetCardholder && (
                <div className="upi-modal-overlay" onClick={() => setShowUpiModal(false)}>
                    <div className="upi-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="upi-modal-header">
                            <h2>CardKin Match Gateway</h2>
                            <button className="upi-close-btn" onClick={() => setShowUpiModal(false)}>×</button>
                        </div>

                        {/* STEP 1: Select Payment App */}
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

                        {/* STEP 2: Input PIN */}
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

                        {/* STEP 3: Processing loading */}
                        {paymentStep === 'processing' && (
                            <div className="upi-step-content text-center-wrap">
                                <div className="upi-spinner"></div>
                                <h3>Processing matchmaking fee...</h3>
                                <p>Checking secure wallet logs</p>
                            </div>
                        )}

                        {/* STEP 4: Success confirmation */}
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

            {/* B. ADD CREDIT CARD MODAL */}
            {showAddCardModal && (
                <div className="upi-modal-overlay" onClick={() => setShowAddCardModal(false)}>
                    <div className="upi-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="upi-modal-header">
                            <h2>Link Credit Card to Profile</h2>
                            <button className="upi-close-btn" onClick={() => setShowAddCardModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddCardSubmit} className="add-card-form">
                            {/* Card Product Name */}
                            <div className="form-group">
                                <label className="form-label">Card Product Name</label>
                                <input
                                    type="text"
                                    className="dash-text-input"
                                    placeholder="e.g. Infinia, Atlas, Regalia, Sapphiro"
                                    value={newCardName}
                                    onChange={(e) => setNewCardName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Bank Name */}
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

                            {/* Card Network */}
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

                            {/* Card Color Scheme */}
                            <div className="form-group">
                                <label className="form-label">Visual Theme / Background</label>
                                <select
                                    className="dash-select-field"
                                    value={newCardColor}
                                    onChange={(e) => setNewCardColor(e.target.value)}
                                >
                                    <option value="dark-gold">HDFC Infinia Deep Gold/Black</option>
                                    <option value="silver-dark">Axis Atlas Space Silver/Black</option>
                                    <option value="deep-teal">SBI Cashback Deep Teal/Aqua</option>
                                    <option value="platinum">ICICI Platinum/Silver</option>
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

