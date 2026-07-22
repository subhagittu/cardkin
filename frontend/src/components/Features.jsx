import React from 'react';
import { Search, Shield, MessageCircle, CreditCard, ArrowRight } from 'lucide-react';
import './Features.css';

const FEATURES = [
    {
        icon: Search,
        color: '#3b82f6',
        title: 'Smart discovery',
        desc: 'Find cardholders near you who carry the exact cards you need — from travel premium tiers to cashback rewards.',
    },
    {
        icon: Shield,
        color: '#22c55e',
        title: 'Verified trust',
        desc: 'Every member has a public rating and verification status, so you connect with confidence every time.',
    },
    {
        icon: CreditCard,
        color: '#eab308',
        title: 'Seamless payments',
        desc: 'Unlock contact details instantly with secure UPI payments through GPay, Paytm, or PhonePe.',
    },
    {
        icon: MessageCircle,
        color: '#a855f7',
        title: 'Direct coordination',
        desc: 'Once matched, connect via WhatsApp to coordinate lounge access, bookings, and reward redemptions.',
    },
];

const STEPS = [
    { num: '01', title: 'Search', desc: 'Find the card or holder you need by name, bank, or benefit type' },
    { num: '02', title: 'Match', desc: 'Review verified profiles, community ratings, and past transactions' },
    { num: '03', title: 'Connect', desc: 'Unlock contact details and coordinate the benefit securely' },
];

export default function Features() {
    return (
        <section id="features" className="features-section landing-section">
            <div className="features-header">
                <span className="section-label">How it works</span>
                <h2>Everything you need to share card benefits</h2>
                <p>
                    A trusted platform for credit card enthusiasts to discover each other,
                    share rewards, and maximize value — together.
                </p>
            </div>

            <div className="steps-bar">
                {STEPS.map((step, i) => (
                    <React.Fragment key={step.num}>
                        <div className="step-item">
                            <div className="step-num-circle">{step.num}</div>
                            <div className="step-content">
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="step-connector" aria-hidden="true">
                                <ArrowRight size={16} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="features-grid-cards">
                {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                    <div key={title} className="feature-card-box" style={{ '--feat-color': color }}>
                        <div className="feature-icon-circle">
                            <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
