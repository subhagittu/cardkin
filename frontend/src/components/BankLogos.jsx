import React from 'react';
import './BankLogos.css';

/**
 * Local SVG logos stored in /public/logos/ — served by Vite as static assets.
 * No external dependencies, always available.
 */
const BANKS = [
    { id: 'hdfc', name: 'HDFC Bank', src: '/logos/hdfc.svg' },
    { id: 'axis', name: 'Axis Bank', src: '/logos/axis.svg' },
    { id: 'sbi', name: 'SBI Card', src: '/logos/sbi.svg' },
    { id: 'icici', name: 'ICICI Bank', src: '/logos/icici.svg' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', src: '/logos/kotak.svg' },
    { id: 'indusind', name: 'IndusInd Bank', src: '/logos/indusind.svg' },
];

export default function BankLogos() {
    // Triple so the seamless loop works on all screen widths
    const repeated = [...BANKS, ...BANKS, ...BANKS];

    return (
        <div className="bank-logos-section">
            <p className="bank-logos-heading">Trusted by cardholders from India's leading banks</p>
            <div className="logos-marquee-wrapper" aria-hidden="true">
                <div className="logos-marquee-track">
                    {repeated.map((bank, i) => (
                        <span key={`${bank.id}-${i}`} className="bank-logo-unit">
                            <img
                                src={bank.src}
                                alt={bank.name}
                                className="bank-logo-img"
                                loading="lazy"
                                width="140"
                                height="44"
                            />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
