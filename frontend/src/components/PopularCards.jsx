import React from 'react';
import { Star, MapPin, ArrowRight, Users } from 'lucide-react';
import './PopularCards.css';

const CARDS = [
    {
        id: 1,
        name: 'HDFC Infinia Metal',
        bank: 'HDFC Bank',
        benefit: 'Unlimited lounge · 3.3% rewards',
        holders: 124,
        rating: 4.9,
        fee: 'From ₹49',
        tier: 'premium',
    },
    {
        id: 2,
        name: 'Axis Atlas',
        bank: 'Axis Bank',
        benefit: 'Travel miles · Priority Pass',
        holders: 89,
        rating: 4.8,
        fee: 'From ₹49',
        tier: 'travel',
    },
    {
        id: 3,
        name: 'SBI Cashback',
        bank: 'SBI Card',
        benefit: '5% online cashback',
        holders: 203,
        rating: 4.7,
        fee: 'From ₹49',
        tier: 'cashback',
    },
    {
        id: 4,
        name: 'ICICI Amazon Pay',
        bank: 'ICICI Bank',
        benefit: '5% on Amazon · Prime',
        holders: 167,
        rating: 4.8,
        fee: 'From ₹49',
        tier: 'shopping',
    },
    {
        id: 5,
        name: 'Amex Platinum',
        bank: 'American Express',
        benefit: 'Premium lounges · concierge',
        holders: 45,
        rating: 4.9,
        fee: 'From ₹99',
        tier: 'premium',
    },
    {
        id: 6,
        name: 'HDFC Diners Black',
        bank: 'HDFC Bank',
        benefit: '2x rewards · golf access',
        holders: 72,
        rating: 4.8,
        fee: 'From ₹49',
        tier: 'premium',
    },
];

export default function PopularCards({ onSearch }) {
    return (
        <section className="popular-cards-section">
            <div className="section-head-row">
                <div>
                    <h2>Most searched cards</h2>
                    <p>Verified holders ready to match in your area</p>
                </div>
                <button type="button" className="view-all-link" onClick={() => onSearch?.('')}>
                    View all cards
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="popular-cards-grid">
                {CARDS.map((card) => (
                    <article key={card.id} className="product-card">
                        <div className={`product-card-visual tier-${card.tier}`}>
                            <span className="product-bank">{card.bank}</span>
                            <span className="product-card-name">{card.name}</span>
                        </div>

                        <div className="product-card-body">
                            <p className="product-benefit">{card.benefit}</p>

                            <div className="product-meta">
                                <span className="product-rating">
                                    <Star size={12} />
                                    {card.rating}
                                </span>
                                <span className="product-holders">
                                    <Users size={12} />
                                    {card.holders} holders
                                </span>
                                <span className="product-fee">{card.fee}</span>
                            </div>

                            <div className="product-location">
                                <MapPin size={12} />
                                Available near you
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary product-cta"
                                onClick={() => onSearch?.(card.name)}
                            >
                                Find holders
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
