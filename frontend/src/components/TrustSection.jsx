import React from 'react';
import { Shield, Smartphone, BadgeCheck, Headphones } from 'lucide-react';
import './TrustSection.css';

const TRUST_ITEMS = [
    { icon: BadgeCheck, title: 'Verified members', desc: 'Every holder is identity-verified before listing cards.' },
    { icon: Smartphone, title: 'UPI-secured payments', desc: 'Unlock fees processed via GPay, PhonePe, and Paytm.' },
    { icon: Shield, title: 'Community ratings', desc: 'Public star ratings after every completed match.' },
    { icon: Headphones, title: 'Support when needed', desc: 'Help desk for disputes and account issues.' },
];

export default function TrustSection() {
    return (
        <section className="trust-section">
            <div className="trust-section-inner">
                {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="trust-item">
                        <div className="trust-item-icon">
                            <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <div>
                            <h3>{title}</h3>
                            <p>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
