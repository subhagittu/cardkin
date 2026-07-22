import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Search, CheckCircle, MessageSquare, Loader, Sparkles } from 'lucide-react';
import './SearchResults.css';

export default function SearchResults({ searchQuery, onBack }) {
    const [searching, setSearching] = useState(true);
    const [progress, setProgress] = useState(0);
    const [selectedCardholder, setSelectedCardholder] = useState(null);

    // Modal Form States
    const [productName, setProductName] = useState('');
    const [amount, setAmount] = useState('');
    const [platform, setPlatform] = useState('Amazon');

    // Payment States
    const [paymentStage, setPaymentStage] = useState('form'); // 'form', 'upi-select', 'processing', 'success'
    const [selectedUpiApp, setSelectedUpiApp] = useState('');

    // Mock Cardholder Database
    const [cardholders, setCardholders] = useState([
        {
            id: 1,
            name: "Rohan Sharma",
            phone: "+91 98765 43210",
            card: "HDFC Infinia Metal",
            distance: "1.2 km away",
            rating: 4.9,
            matches: 46,
            unlocked: false,
            initials: "RS"
        },
        {
            id: 2,
            name: "Sneha Reddy",
            phone: "+91 81234 56789",
            card: "ICICI Sapphiro",
            distance: "2.5 km away",
            rating: 4.8,
            matches: 32,
            unlocked: false,
            initials: "SR"
        },
        {
            id: 3,
            name: "Vikram Malhotra",
            phone: "+91 70123 45678",
            card: "SBI Aurum",
            distance: "3.8 km away",
            rating: 4.7,
            matches: 18,
            unlocked: false,
            initials: "VM"
        }
    ]);

    // 3-second Radar Scan simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setSearching(false), 300);
                    return 100;
                }
                return prev + 4;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const handleUnlockRequest = (cardholder) => {
        setSelectedCardholder(cardholder);
        setPaymentStage('form');
        setProductName('');
        setAmount('');
        setPlatform('Amazon');
    };

    // Calculate dynamic 0.5% unlock fee (min Rs 49)
    const calculateFee = () => {
        const amt = parseFloat(amount) || 0;
        return Math.max(49, Math.round(amt * 0.005));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!productName || !amount) {
            alert('Please populate product details and transaction value.');
            return;
        }
        setPaymentStage('upi-select');
    };

    const handlePayClick = (upiApp) => {
        setSelectedUpiApp(upiApp);
        setPaymentStage('processing');

        // Simulating 2-second processing time
        setTimeout(() => {
            setPaymentStage('success');

            // Mark the selected cardholder as unlocked in local state
            setCardholders(prev => prev.map(ch =>
                ch.id === selectedCardholder.id ? { ...ch, unlocked: true } : ch
            ));
        }, 2000);
    };

    const handleCloseModal = () => {
        setSelectedCardholder(null);
        setPaymentStage('form');
    };

    return (
        <div className="search-results-viewport animate-fade-in">
            {/* Nav Back Header */}
            <div className="search-results-nav">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </button>
                <div className="search-badge">
                    <Search size={14} />
                    <span>Query: "{searchQuery}"</span>
                </div>
            </div>

            {searching ? (
                /* RADAR LOADER SCREEN */
                <div className="radar-loader-container">
                    <div className="desktop-radar-card glass">
                        <div className="radar-left-side">
                            {/* Scanning Animation */}
                            <div className="radar-circles-box">
                                <div className="conic-scanner-sweep"></div>
                                <div className="radar-circle circle-1"></div>
                                <div className="radar-circle circle-2"></div>
                                <div className="radar-circle circle-3"></div>
                                <div className="radar-circle circle-4"></div>

                                {/* Central user profile bubble */}
                                <div className="radar-avatar center-node pulse-node">
                                    <span className="avatar-initials">YOU</span>
                                </div>

                                {/* Orbiting cardholder elements */}
                                <div className="radar-avatar orbit-1">
                                    <div className="orbit-avatar-dot offset-dot-1"></div>
                                </div>
                                <div className="radar-avatar orbit-2">
                                    <div className="orbit-avatar-dot offset-dot-2"></div>
                                </div>
                                <div className="radar-avatar orbit-3">
                                    <div className="orbit-avatar-dot offset-dot-3"></div>
                                </div>
                            </div>
                        </div>

                        <div className="radar-right-side">
                            <span className="buyer-pill-tag">For Buyer</span>
                            <h3 className="radar-title">Real time shopping</h3>

                            {/* Captions */}
                            <div className="radar-caption-panel">
                                <h4>Finding the right cardholder</h4>
                                <p>Please wait while we search the network for close connections that carry your requested cards.</p>

                                {/* Progress Bar */}
                                <div className="linear-progress-track">
                                    <div className="linear-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="progress-percent-lbl">{Math.round(progress)}% scanned</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* CARDHOLDERS RESULTS LIST */
                <div className="results-listing-container">
                    <div className="results-header">
                        <h2>Nearest Cardholders Found</h2>
                        <p>We found {cardholders.length} cardholders carrying keys matching <strong>"{searchQuery}"</strong> near your location.</p>
                    </div>

                    <div className="cardholders-grid">
                        {cardholders.map((ch) => (
                            <div key={ch.id} className="cardholder-item-box glass">
                                <div className="cardholder-badge-rating">
                                    <span className="rating-star">⭐ {ch.rating}</span>
                                    <span className="matches-count">({ch.matches} matches)</span>
                                </div>

                                <div className="cardholder-header-row">
                                    <div className="ch-avatar-circle">
                                        {ch.initials}
                                    </div>
                                    <div className="ch-names-info">
                                        {ch.unlocked ? (
                                            <h3 className="unblurred-name-text">{ch.name}</h3>
                                        ) : (
                                            <h3 className="blurred-name-text" title="Lock active until matching approval">{ch.name}</h3>
                                        )}
                                        <p className="card-model-text">{ch.card}</p>
                                    </div>
                                </div>

                                <div className="cardholder-body-row">
                                    <div className="meta-data-line">
                                        <span className="meta-label">Distance:</span>
                                        <span className="meta-val">{ch.distance}</span>
                                    </div>
                                    <div className="meta-data-line">
                                        <span className="meta-label">Contact:</span>
                                        {ch.unlocked ? (
                                            <span className="meta-val unblurred-phone">{ch.phone}</span>
                                        ) : (
                                            <span className="meta-val blurred-phone">+91 ••••• •••••</span>
                                        )}
                                    </div>
                                </div>

                                <div className="cardholder-action-footer">
                                    {ch.unlocked ? (
                                        <a
                                            href={`https://wa.me/${ch.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ch.name)},%20I%20matched%20with%20you%20on%20CardKin%20for%20your%20${encodeURIComponent(ch.card)}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary whatsapp-chat-btn"
                                        >
                                            <MessageSquare size={16} />
                                            <span>Chat via WhatsApp</span>
                                        </a>
                                    ) : (
                                        <button
                                            className="btn btn-primary ch-unlock-trigger-btn"
                                            onClick={() => handleUnlockRequest(ch)}
                                        >
                                            <span>Unlock Contact</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* UNLOCK DIALOG MODAL SIMULATOR */}
            {selectedCardholder && (
                <div className="modal-backdrop-layer">
                    <div className="modal-content-card glass animate-scale-up">
                        <div className="modal-header-section">
                            <h3>Unlock {selectedCardholder.unlocked ? "Details" : "Match Request"}</h3>
                            <button className="modal-close-x" onClick={handleCloseModal}>×</button>
                        </div>

                        {paymentStage === 'form' && (
                            <form onSubmit={handleFormSubmit} className="modal-form-body">
                                <div className="form-summary-card">
                                    <p className="summary-cardholder">Cardholder matches: <strong>{selectedCardholder.card}</strong></p>
                                    <p className="summary-rating">Community Rating: ⭐ {selectedCardholder.rating} ({selectedCardholder.matches} Matches)</p>
                                </div>

                                <div className="form-input-group">
                                    <label htmlFor="product">Product / Service Name</label>
                                    <input
                                        type="text"
                                        id="product"
                                        placeholder="e.g., iPhone 15 Pro, Sony Headphones"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-input-group">
                                    <label htmlFor="amount">Transaction Amount (₹)</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        placeholder="e.g., 25000"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-input-group">
                                    <label htmlFor="platform">Purchase Platform</label>
                                    <select
                                        id="platform"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                    >
                                        <option value="Amazon">Amazon.in</option>
                                        <option value="Flipkart">Flipkart</option>
                                        <option value="Myntra">Myntra</option>
                                        <option value="Tata Cliq">Tata CliQ</option>
                                        <option value="Apple Store">Apple Store</option>
                                        <option value="Offline Store">Offline Retail</option>
                                        <option value="Other">Other Platform</option>
                                    </select>
                                </div>

                                <div className="fee-disclosure-block">
                                    <div className="fee-row">
                                        <span>Community Match Fee (0.5%):</span>
                                        <strong>₹{calculateFee()}</strong>
                                    </div>
                                    <p className="fee-hint">Match fees are verified on platform lock escrows. Safe refund guarantee holds true if matchmaking fails.</p>
                                </div>

                                <button type="submit" className="btn btn-primary submit-pay-btn">
                                    <span>Pay ₹{calculateFee()} to Unlock Contact Details</span>
                                </button>
                            </form>
                        )}

                        {paymentStage === 'upi-select' && (
                            <div className="upi-app-selector">
                                <h4>Select UPI App to Complete Search Unlock</h4>
                                <p className="payment-amount-subtitle">Amount to pay: <strong>₹{calculateFee()}</strong></p>

                                <div className="upi-grid-options">
                                    <button className="upi-opt-btn btn-gpay" onClick={() => handlePayClick('GPay')}>
                                        <div className="upi-app-logo gpay">G</div>
                                        <span>Google Pay</span>
                                    </button>
                                    <button className="upi-opt-btn btn-phonepe" onClick={() => handlePayClick('PhonePe')}>
                                        <div className="upi-app-logo phonepe">PE</div>
                                        <span>PhonePe</span>
                                    </button>
                                    <button className="upi-opt-btn btn-paytm" onClick={() => handlePayClick('Paytm')}>
                                        <div className="upi-app-logo paytm">Pay</div>
                                        <span>Paytm</span>
                                    </button>
                                </div>

                                <button className="btn btn-outline cancel-pay-btn" onClick={() => setPaymentStage('form')}>
                                    <span>Back</span>
                                </button>
                            </div>
                        )}

                        {paymentStage === 'processing' && (
                            <div className="payment-processing-loader">
                                <Loader size={48} className="spinner-loading-icon" />
                                <h4>Connecting with {selectedUpiApp}...</h4>
                                <p>Simulating UPI secure gateway authentication. Please do not close this window.</p>
                            </div>
                        )}

                        {paymentStage === 'success' && (
                            <div className="payment-success-window">
                                <CheckCircle size={64} className="checkmark-success" />
                                <h4>Payment Successful!</h4>
                                <p className="success-banner-txt">Verified Match Secured successfully. Contact details unlocked below:</p>

                                <div className="unlocked-contact-card glass">
                                    <h4>{selectedCardholder.name}</h4>
                                    <p className="card-model-bold">{selectedCardholder.card}</p>
                                    <p className="phone-bold-num">{selectedCardholder.phone}</p>
                                </div>

                                <div className="success-action-dialog">
                                    <a
                                        href={`https://wa.me/${selectedCardholder.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedCardholder.name)},%20I%20matched%20with%20you%20on%20CardKin%20for%20your%20${encodeURIComponent(selectedCardholder.card)}.%20Buying%20${encodeURIComponent(productName)}%20worth%20%E2%82%B9${amount}%20on%20${platform}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary whatsapp-chat-btn"
                                    >
                                        <MessageSquare size={16} />
                                        <span>Start Coordinating on WhatsApp</span>
                                    </a>
                                </div>

                                <button className="btn btn-outline done-btn" onClick={handleCloseModal}>
                                    <span>Back to Results List</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
