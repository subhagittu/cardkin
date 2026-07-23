import React, { useState } from 'react';
import {
    User, Mail, Phone, CreditCard, LogOut, CheckCircle,
    MapPin, Calendar, ShieldCheck, Edit3, Plus, Search, ChevronRight
} from 'lucide-react';
import './Profile.css';

export default function Profile({ user, myCards, setMyCards, onLogout }) {
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardBank, setNewCardBank] = useState('HDFC Bank');
    const [newCardNetwork, setNewCardNetwork] = useState('Visa');

    // Extract Initials
    const userInitials = user && user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!newCardName.trim() || !user) return;
        const cardObj = {
            id: Date.now(),
            name: newCardName,
            bank: newCardBank,
            network: newCardNetwork,
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
                setNewCardName('');
                setShowAddCard(false);
            } else {
                console.error("Error saving card:", error.message);
                alert("Failed to link card. Please try again.");
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
                                <span className="meta-item"><ShieldCheck size={16} /> Identity Verified</span>
                                <span className="meta-item"><Calendar size={16} /> Member since 2024</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-hero-right">
                        <button className="profile-action-btn edit-btn">
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
                                            <span className="row-secondary-text">#B-{(card.id || 0).toString().slice(-4) || '1024'}</span>
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

                            {/* Add Card Form inside the list to keep flow */}
                            {showAddCard && (
                                <div className="add-card-inline-form">
                                    <form onSubmit={handleAddCard} className="ac-form">
                                        <input
                                            type="text"
                                            placeholder="Card Name (e.g. HDFC Regalia)"
                                            value={newCardName}
                                            onChange={e => setNewCardName(e.target.value)}
                                            className="ac-input"
                                            required
                                        />
                                        <div className="ac-form-row">
                                            <select value={newCardBank} onChange={e => setNewCardBank(e.target.value)} className="ac-input">
                                                <option>HDFC Bank</option>
                                                <option>SBI Card</option>
                                                <option>ICICI Bank</option>
                                                <option>Axis Bank</option>
                                                <option>AMEX</option>
                                            </select>
                                            <select value={newCardNetwork} onChange={e => setNewCardNetwork(e.target.value)} className="ac-input">
                                                <option>Visa</option>
                                                <option>Mastercard</option>
                                                <option>Rupay</option>
                                                <option>Amex</option>
                                            </select>
                                        </div>
                                        <div className="ac-form-actions">
                                            <button type="submit" className="ac-submit-btn">Link Card</button>
                                            <button type="button" onClick={() => setShowAddCard(false)} className="ac-cancel-btn">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
