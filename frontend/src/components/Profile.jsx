import React, { useState } from 'react';
import {
    ArrowLeft, User, Mail, Phone, CreditCard, PlusCircle,
    Star, ShoppingBag, LogOut, BadgeCheck, Calendar
} from 'lucide-react';
import './Profile.css';

const MOCK_PURCHASES = [
    {
        id: 1,
        buyer: 'A**** K.',
        card: 'HDFC Infinia',
        platform: 'Flipkart',
        product: 'Sony WH-1000XM5 Headphones',
        amount: '₹24,990',
        date: '18 Jul 2026',
        status: 'completed'
    },
    {
        id: 2,
        buyer: 'P**** S.',
        card: 'Axis Atlas',
        platform: 'Amazon',
        product: 'Apple Watch Series 9',
        amount: '₹41,900',
        date: '14 Jul 2026',
        status: 'completed'
    },
    {
        id: 3,
        buyer: 'N**** R.',
        card: 'SBI Cashback',
        platform: 'Myntra',
        product: 'Nike Air Max 270',
        amount: '₹9,995',
        date: '09 Jul 2026',
        status: 'completed'
    },
    {
        id: 4,
        buyer: 'S**** M.',
        card: 'HDFC Infinia',
        platform: 'Croma',
        product: 'Bose Soundbar 900',
        amount: '₹79,000',
        date: '01 Jul 2026',
        status: 'completed'
    },
    {
        id: 5,
        buyer: 'R**** D.',
        card: 'ICICI Sapphiro',
        platform: 'Amazon',
        product: 'iPad Air 5th Gen',
        amount: '₹59,900',
        date: '22 Jun 2026',
        status: 'pending'
    }
];

const CARD_COLOR_MAP = {
    'dark-gold': 'linear-gradient(135deg, #1a0a00 0%, #3d2200 50%, #5c3300 100%)',
    'silver-dark': 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #16213e 100%)',
    'deep-teal': 'linear-gradient(135deg, #001a1a 0%, #003333 50%, #004d4d 100%)',
    'platinum': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)',
};

export default function Profile({ user, myCards, setMyCards, onBack, onLogout }) {
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardBank, setNewCardBank] = useState('HDFC Bank');
    const [newCardNetwork, setNewCardNetwork] = useState('Visa');
    const [newCardColor, setNewCardColor] = useState('dark-gold');

    const userInitials = user && user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'RS';

    const handleAddCard = (e) => {
        e.preventDefault();
        if (!newCardName.trim()) return;
        const card = {
            id: Date.now(),
            name: newCardName,
            bank: newCardBank,
            network: newCardNetwork,
            color: newCardColor
        };
        if (setMyCards) setMyCards(prev => [...prev, card]);
        setNewCardName('');
        setShowAddCard(false);
    };

    return (
        <div className="profile-viewport">
            {/* Back Nav */}
            <button className="profile-back-btn" onClick={onBack}>
                <ArrowLeft size={18} />
                <span>Back to Home</span>
            </button>

            <div className="profile-main-grid">

                {/* LEFT COLUMN — Identity + Cards */}
                <div className="profile-left-col">

                    {/* Identity Card */}
                    <div className="profile-card glass profile-identity-card">
                        <div className="profile-avatar-circle">
                            {userInitials}
                        </div>
                        <div className="profile-identity-info">
                            <h2 className="profile-name">{user?.name || 'Rohan Sharma'}</h2>
                            <div className="profile-trust-badge">
                                <BadgeCheck size={14} />
                                <span>KYC Verified</span>
                            </div>
                            <div className="profile-rating-row">
                                <Star size={13} className="star-gold" />
                                <span><strong>4.95</strong> · 42 Verified Matches</span>
                            </div>
                        </div>

                        <div className="profile-contact-list">
                            <div className="profile-contact-item">
                                <Mail size={15} />
                                <span>{user?.email || 'rohan.sharma@cardkin.in'}</span>
                            </div>
                            <div className="profile-contact-item">
                                <Phone size={15} />
                                <span>{user?.mobile || '+91 98765 43210'}</span>
                            </div>
                            <div className="profile-contact-item">
                                <User size={15} />
                                <span>Member since July 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Credit Cards Portfolio */}
                    <div className="profile-card glass profile-cards-card">
                        <div className="profile-section-header">
                            <CreditCard size={18} />
                            <h3>Linked Credit Cards</h3>
                        </div>

                        <div className="profile-card-chips">
                            {(myCards && myCards.length > 0) ? myCards.map(card => (
                                <div
                                    key={card.id}
                                    className="profile-card-chip"
                                    style={{ background: CARD_COLOR_MAP[card.color] || CARD_COLOR_MAP['dark-gold'] }}
                                >
                                    <div className="chip-card-name">{card.name}</div>
                                    <div className="chip-card-meta">{card.bank} · {card.network}</div>
                                </div>
                            )) : (
                                <p className="profile-empty-state">No linked cards yet.</p>
                            )}
                        </div>

                        {!showAddCard ? (
                            <button className="profile-add-card-btn" onClick={() => setShowAddCard(true)}>
                                <PlusCircle size={15} />
                                Link New Credit Card
                            </button>
                        ) : (
                            <form className="profile-add-card-form" onSubmit={handleAddCard}>
                                <h4 className="add-form-title">Add a New Card</h4>
                                <input
                                    type="text"
                                    className="profile-input"
                                    placeholder="Card name (e.g. Infinia, Atlas)"
                                    value={newCardName}
                                    onChange={e => setNewCardName(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <select className="profile-input" value={newCardBank} onChange={e => setNewCardBank(e.target.value)}>
                                    {['HDFC Bank', 'Axis Bank', 'SBI Card', 'ICICI Bank', 'Kotak Bank', 'IndusInd Bank'].map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                <select className="profile-input" value={newCardNetwork} onChange={e => setNewCardNetwork(e.target.value)}>
                                    {['Visa', 'Mastercard', 'RuPay', 'Amex'].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <select className="profile-input" value={newCardColor} onChange={e => setNewCardColor(e.target.value)}>
                                    <option value="dark-gold">Deep Gold / Black</option>
                                    <option value="silver-dark">Space Silver / Black</option>
                                    <option value="deep-teal">Deep Teal / Aqua</option>
                                    <option value="platinum">Platinum / Silver</option>
                                </select>
                                <div className="add-form-actions">
                                    <button type="button" className="cancel-form-btn" onClick={() => setShowAddCard(false)}>Cancel</button>
                                    <button type="submit" className="profile-add-card-btn">Link Card</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN — Purchase History + Logout */}
                <div className="profile-right-col">
                    <div className="profile-card glass profile-history-card">
                        <div className="profile-section-header">
                            <ShoppingBag size={18} />
                            <h3>Successful Purchases</h3>
                            <span className="history-count-badge">{MOCK_PURCHASES.filter(p => p.status === 'completed').length} completed</span>
                        </div>

                        <div className="profile-history-list">
                            {MOCK_PURCHASES.map(purchase => (
                                <div key={purchase.id} className={`history-item ${purchase.status}`}>
                                    <div className="history-item-main">
                                        <div className="history-product">{purchase.product}</div>
                                        <div className="history-buyer-row">
                                            <span className="history-buyer">Buyer: <strong>{purchase.buyer}</strong></span>
                                            <span className="history-platform">{purchase.platform}</span>
                                        </div>
                                        <div className="history-card-used">
                                            <CreditCard size={12} />
                                            <span>{purchase.card}</span>
                                        </div>
                                    </div>
                                    <div className="history-item-right">
                                        <div className="history-amount">{purchase.amount}</div>
                                        <div className={`history-status-badge ${purchase.status}`}>
                                            {purchase.status === 'completed' ? '✓ Done' : '⏳ Pending'}
                                        </div>
                                        <div className="history-date">
                                            <Calendar size={11} />
                                            <span>{purchase.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Log Out */}
                    <button className="profile-logout-btn" onClick={onLogout}>
                        <LogOut size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
