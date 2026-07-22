import React from 'react';
import './Stats.css';

const STATS = [
    { value: 'Smart', label: 'Network Coverage', sub: 'Expanding rapidly' },
    { value: 'Instant', label: 'Contact Access', sub: 'Direct communication' },
    { value: '100%', label: 'Verified Users', sub: 'KYC-backed profiles' },
    { value: 'Seamless', label: 'Connectivity', sub: 'Match & coordinates' },
];

export default function Stats() {
    return (
        <section className="stats-grid-section" aria-label="Platform statistics">
            {STATS.map((stat) => (
                <div key={stat.label} className="stat-card">
                    <span className="stat-card-value">{stat.value}</span>
                    <span className="stat-card-label">{stat.label}</span>
                    <span className="stat-card-sub">{stat.sub}</span>
                </div>
            ))}
        </section>
    );
}