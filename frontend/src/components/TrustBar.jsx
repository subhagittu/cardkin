import React from 'react';
import { TrendingUp, ShieldCheck, MapPin } from 'lucide-react';
import './TrustBar.css';

export default function TrustBar() {
    return (
        <div className="trust-bar">
            <div className="trust-bar-inner">
                <span className="trust-bar-item">
                    <TrendingUp size={14} />
                    <strong>2,847</strong> matches completed this month
                </span>
                <span className="trust-bar-divider" aria-hidden="true" />
                <span className="trust-bar-item">
                    <ShieldCheck size={14} />
                    100% verified cardholders
                </span>
                <span className="trust-bar-divider" aria-hidden="true" />
                <span className="trust-bar-item">
                    <MapPin size={14} />
                    Live in <strong>40+</strong> Indian cities
                </span>
            </div>
        </div>
    );
}
