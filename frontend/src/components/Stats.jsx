import React from 'react';
import './Stats.css';

const STATS = [
    { value: '25,000+', label: 'Active members', sub: 'Verified cardholders' },
    { value: '1,200+', label: 'Matches / month', sub: 'Successful connections' },
    { value: '4.9★', label: 'Avg. rating', sub: 'Community trust score' },
    { value: '40+', label: 'Cities covered', sub: 'Pan-India network' },
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
