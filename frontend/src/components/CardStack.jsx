import React, { useState } from 'react';
import './CardStack.css';
import rupayPng from '../assets/rupay.png';
import visaPng from '../assets/visa.png';

// Crisp, custom inline image components for the payment networks using high-fidelity assets
const VisaLogo = () => (
    <img src={visaPng} alt="Visa" className="network-logo visa-logo-img" />
);

const MastercardLogo = () => (
    <svg className="network-logo mc-logo" viewBox="0 0 60 48" width="55" height="44" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="18" r="14" fill="#FF0000" />
        <circle cx="36" cy="18" r="14" fill="#FFAB00" opacity="0.9" />
        <path d="M28 6.5C31.5 9 33.5 13.2 33.5 18C33.5 22.8 31.5 27 28 29.5C24.5 27 22.5 22.8 22.5 18C22.5 13.2 24.5 9 28 6.5Z" fill="#FF6D00" />
        <text x="30" y="44" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="7.5" fontWeight="bold" fill="#ffffff" letterSpacing="0.1">mastercard.</text>
    </svg>
);

const RuPayLogo = () => (
    <img src={rupayPng} alt="RuPay" className="network-logo rupay-logo-img" />
);

export default function CardStack() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const CardChip = () => (
        <svg className="card-chip" width="38" height="30" viewBox="0 0 38 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="30" rx="6" fill="url(#chip-grad)" />
            <rect x="0.8" y="0.8" width="36.4" height="28.4" rx="5.2" stroke="#f0d695" strokeWidth="0.8" strokeOpacity="0.4" />
            <path d="M12 0V30M26 0V30M0 10H38M0 20H38" stroke="#1c180e" strokeWidth="0.5" strokeOpacity="0.7" />
            <rect x="14" y="8" width="10" height="14" rx="2" fill="#1c180e" fillOpacity="0.1" stroke="#f0d695" strokeWidth="0.8" strokeOpacity="0.5" />
            <defs>
                <linearGradient id="chip-grad" x1="0" y1="0" x2="38" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffeaba" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#aa7c11" />
                </linearGradient>
            </defs>
        </svg>
    );

    return (
        <div className="cardstack-wrapper animate-fade-up animate-delay-2">
            <div className="cardstack-pedestal"></div>

            {/* Credit Card Stack */}
            <div className="cardstack-container">

                {/* ─── Card 1: HDFC Bank Infinia ─── */}
                <div
                    className={`credit-card card-hdfc-infinia ${hoveredCard === 'infinia' ? 'active-hover' : hoveredCard ? 'dimmed' : ''}`}
                    style={{ '--card-index': 1 }}
                    onMouseEnter={() => setHoveredCard('infinia')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <div className="card-texture texture-gold-mesh"></div>

                    <div className="card-top-row">
                        <div className="bank-logo-group">
                            <svg className="card-bank-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M2 2h6v2H4v4H2V2zm14 0h6v6h-2V4h-4V2zM2 16h2v4h4v2H2v-6zm20 0v6h-6v-2h4v-4h2z" />
                                <rect x="9" y="9" width="6" height="6" />
                            </svg>
                            <span className="card-bank-name uppercase-bold">HDFC BANK</span>
                        </div>
                        <div className="card-tier-text tier-gold uppercase-spaced">I N F I N I A</div>
                    </div>

                    <div className="card-mid-row">
                        <CardChip />
                    </div>

                    <div className="card-bottom-row">
                        <div className="card-number-group">
                            <span className="dots">••••  ••••  ••••</span>
                            <span className="digits">4821</span>
                        </div>

                        <div className="card-details-group">
                            <span className="details-label">VALID THRU</span>
                            <span className="details-value">09/30</span>
                        </div>

                        <div className="card-network-logo-wrap">
                            <VisaLogo />
                        </div>
                    </div>
                </div>

                {/* ─── Card 2: Axis Bank Atlas ─── */}
                <div
                    className={`credit-card card-axis-atlas ${hoveredCard === 'atlas' ? 'active-hover' : hoveredCard ? 'dimmed' : ''}`}
                    style={{ '--card-index': 2 }}
                    onMouseEnter={() => setHoveredCard('atlas')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <div className="card-texture texture-cosmic"></div>

                    <div className="card-top-row">
                        <div className="bank-logo-group">
                            <svg className="card-bank-icon" viewBox="0 0 31 23" width="20" height="15" fill="currentColor">
                                <path d="M19.1 0L30.9 22.8H21.4L15.4 11.2L9.4 22.8H0L11.8 0H19.1Z" />
                            </svg>
                            <span className="card-bank-name uppercase-bold">AXIS BANK</span>
                        </div>
                        <div className="card-tier-text tier-white uppercase-spaced">A T L A S</div>
                    </div>

                    <div className="card-mid-row">
                        <CardChip />
                    </div>

                    <div className="card-bottom-row">
                        <div className="card-number-group">
                            <span className="dots">••••  ••••  ••••</span>
                            <span className="digits">4821</span>
                        </div>

                        <div className="card-details-group">
                            <span className="details-label">VALID THRU</span>
                            <span className="details-value">09/30</span>
                        </div>

                        <div className="card-network-logo-wrap">
                            <MastercardLogo />
                        </div>
                    </div>
                </div>

                {/* ─── Card 3: SBI Card Cashback ─── */}
                <div
                    className={`credit-card card-sbi-cashback ${hoveredCard === 'sbi' ? 'active-hover' : hoveredCard ? 'dimmed' : ''}`}
                    style={{ '--card-index': 3 }}
                    onMouseEnter={() => setHoveredCard('sbi')}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    <div className="card-texture texture-cyber-grid"></div>

                    <div className="card-top-row">
                        <div className="bank-logo-group">
                            <svg className="card-bank-icon sbi-circle-logo-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 5 3.7 9.1 8.5 9.9V15h3v6.9c4.8-.8 8.5-4.9 8.5-9.9 0-5.5-4.5-10-10-10zm-1.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                            <span className="card-bank-name sbi-card-mix">
                                <span className="sbi-bold">SBI</span> <span className="sbi-light">card</span>
                            </span>
                        </div>
                        <div className="card-tier-text tier-teal uppercase-spaced">CASHBACK</div>
                    </div>

                    <div className="card-mid-row">
                        <CardChip />
                    </div>

                    <div className="card-bottom-row">
                        <div className="card-number-group">
                            <span className="dots">••••  ••••  ••••</span>
                            <span className="digits">4821</span>
                        </div>

                        <div className="card-details-group">
                            <span className="details-label">VALID THRU</span>
                            <span className="details-value">09/30</span>
                        </div>

                        <div className="card-network-logo-wrap">
                            <RuPayLogo />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
