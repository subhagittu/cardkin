import React from 'react';
import { MapPin, Star, CheckCircle, Loader } from 'lucide-react';
import './PlatformPreview.css';

const MATCHES = [
    { name: 'Rohan S.', card: 'HDFC Infinia', dist: '1.2 km', rating: 4.9, initials: 'RS' },
    { name: 'Sneha R.', card: 'ICICI Sapphiro', dist: '2.5 km', rating: 4.8, initials: 'SR' },
    { name: 'Vikram M.', card: 'SBI Aurum', dist: '3.8 km', rating: 4.7, initials: 'VM' },
];

export default function PlatformPreview() {
    return (
        <section className="platform-preview-section">
            <div className="platform-preview-grid">
                <div className="platform-preview-copy">
                    <span className="section-label">Live marketplace</span>
                    <h2>Real matches. Real people. Real transactions.</h2>
                    <p>
                        When you search, CardKin scans verified holders near you —
                        just like booking on MakeMyTrip or ordering on Flipkart.
                    </p>
                    <ul className="platform-checklist">
                        <li><CheckCircle size={16} /> Instant holder discovery by location</li>
                        <li><CheckCircle size={16} /> Pay unlock fee via UPI in seconds</li>
                        <li><CheckCircle size={16} /> Coordinate on WhatsApp immediately</li>
                    </ul>
                </div>

                <div className="platform-mock-ui">
                    <div className="mock-ui-header">
                        <div className="mock-ui-title">
                            <Loader size={14} className="mock-spinner" />
                            <span>3 holders found near you</span>
                        </div>
                        <span className="mock-ui-query">HDFC Infinia</span>
                    </div>

                    <div className="mock-ui-list">
                        {MATCHES.map((m) => (
                            <div key={m.initials} className="mock-holder-row">
                                <div className="mock-avatar">{m.initials}</div>
                                <div className="mock-holder-info">
                                    <span className="mock-name">{m.name}</span>
                                    <span className="mock-card">{m.card}</span>
                                </div>
                                <div className="mock-holder-meta">
                                    <span className="mock-rating">
                                        <Star size={11} />
                                        {m.rating}
                                    </span>
                                    <span className="mock-dist">
                                        <MapPin size={11} />
                                        {m.dist}
                                    </span>
                                </div>
                                <button type="button" className="mock-unlock-btn">Unlock</button>
                            </div>
                        ))}
                    </div>

                    <div className="mock-ui-footer">
                        <span>Unlock fee from ₹49 · Secured by UPI</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
