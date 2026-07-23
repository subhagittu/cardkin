import React from 'react';
import { Plane, ShoppingBag, Ticket } from 'lucide-react';
import './Testimonials.css';

const USE_CASES = [
    {
        title: 'Airport Lounge Access',
        icon: Plane,
        text: 'Need lounge access for your next trip? Connect with cardholders who have complimentary access and fly in comfort.',
        category: 'Travel Perks',
    },
    {
        title: 'E-commerce Mega Sales',
        icon: ShoppingBag,
        text: 'Don\'t miss out on instant discounts on major platforms. Match with cardholders to get great deals on phones, laptops, and appliances.',
        category: 'Cashback & Offers',
    },
    {
        title: 'Fine Dining & Movies',
        icon: Ticket,
        text: 'Getting 1-on-1 movie tickets or exclusive dining discounts is easy when you have a premium credit card network to rely on.',
        category: 'Entertainment',
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials-section landing-section">
            <div className="testimonials-header">
                <span className="section-label">Use Cases</span>
                <h2>Endless possibilities with the right card</h2>
                <p>Discover how you can maximize value through our network</p>
            </div>

            <div className="testimonials-grid">
                {USE_CASES.map((uc) => {
                    const Icon = uc.icon;
                    return (
                        <div key={uc.title} className="testimonial-card">
                            <div className="testimonial-top">
                                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{uc.title}</h3>
                                <Icon size={20} className="testimonial-quote-icon" />
                            </div>
                            <p className="testimonial-text" style={{ marginTop: '12px' }}>{uc.text}</p>
                            <footer className="testimonial-author">
                                <div>
                                    <strong style={{ fontSize: '13.5px' }}>{uc.category}</strong>
                                </div>
                            </footer>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

