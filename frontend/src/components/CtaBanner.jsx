import React from 'react';
import { ArrowRight } from 'lucide-react';
import './CtaBanner.css';

export default function CtaBanner({ onSignUpClick, onSearch }) {
    return (
        <section className="cta-banner">
            <div className="cta-banner-inner">
                <div className="cta-banner-copy">
                    <h2>Start matching in under 60 seconds</h2>
                    <p>Join 25,000+ members across India. Search free — pay only when you unlock a match.</p>
                </div>
                <div className="cta-banner-actions">
                    <button type="button" className="btn btn-primary cta-banner-primary" onClick={() => onSearch?.('HDFC Infinia')}>
                        Search holders
                    </button>
                    <button type="button" className="btn btn-outline cta-banner-secondary" onClick={onSignUpClick}>
                        List your cards
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
