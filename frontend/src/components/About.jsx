import React from 'react';
import { Users, Eye, Sparkles, TrendingUp, ShieldCheck, BadgeCheck } from 'lucide-react';
import './About.css';

const VALUES = [
    {
        icon: Users,
        title: 'Community first',
        desc: 'Built for credit card enthusiasts who want to share and optimize rewards together.',
    },
    {
        icon: Eye,
        title: 'Full transparency',
        desc: 'Public ratings and verification ensure every match comes with built-in trust.',
    },
    {
        icon: Sparkles,
        title: 'Safe by design',
        desc: 'Verify matches locally and coordinate through secure, direct channels.',
    },
];

const METRICS = [
    { icon: TrendingUp, value: 'Value', label: 'Reward Maximization' },
    { icon: ShieldCheck, value: 'Trust', label: 'Verified & Secure' },
    { icon: BadgeCheck, value: 'Safety', label: 'Zero Compromise' },
];

export default function About() {
    return (
        <section id="about" className="about-section landing-section">
            <div className="about-container-grid">
                <div className="about-narrative">
                    <span className="section-label">About CardKin</span>
                    <h2>Unlocking India's credit card rewards ecosystem</h2>
                    <p className="lead-p">
                        Billions in lounge access, cashback, and travel perks go unused every year —
                        locked behind cards most people don't hold.
                    </p>
                    <p className="body-p">
                        CardKin connects people who need specific card benefits with verified holders
                        who can share them. It's mutual assistance for everyday consumers who want
                        premium perks without the premium annual fees.
                    </p>

                    <div className="about-metrics-row">
                        {METRICS.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="about-metric-box">
                                <div className="about-metric-icon">
                                    <Icon size={16} />
                                </div>
                                <span className="about-metric-value">{value}</span>
                                <span className="about-metric-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="about-values-sidebar">
                    {VALUES.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="value-item-card">
                            <div className="value-icon-box">
                                <Icon size={18} strokeWidth={1.75} />
                            </div>
                            <div className="value-content-box">
                                <h4>{title}</h4>
                                <p>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
