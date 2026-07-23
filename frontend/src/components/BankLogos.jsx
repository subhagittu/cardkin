import React from 'react';
import './BankLogos.css';

/**
 * Bank logos with name labels displayed next to each logo image.
 * Uses real downloaded images for most banks + accurate SVGs for others.
 */
const BANKS = [
    { id: 'hdfc',     name: 'HDFC Bank',           src: '/logos/hdfc.png' },
    { id: 'icici',    name: 'ICICI Bank',           src: '/logos/icici.png' },
    { id: 'axis',     name: 'Axis Bank',            src: '/logos/axis.svg' },
    { id: 'sbi',      name: 'SBI',                  src: '/logos/sbi.webp' },
    { id: 'kotak',    name: 'Kotak Mahindra Bank',  src: '/logos/kotak_new.png' },
    { id: 'indusind', name: 'IndusInd Bank',        src: '/logos/indusind_new.png' },
    { id: 'yes',      name: 'Yes Bank',             src: '/logos/yes.png' },
    { id: 'pnb',      name: 'Punjab National Bank', src: '/logos/pnb_new.png' },
    { id: 'bob',      name: 'Bank of Baroda',       src: '/logos/bob.png' },
    { id: 'canara',   name: 'Canara Bank',          src: '/logos/canara.png' },
    { id: 'federal',  name: 'Federal Bank',         src: '/logos/federal_new.png' },
    { id: 'rbl',      name: 'RBL Bank',             src: '/logos/rbl.png' },
];

export default function BankLogos() {
    const repeated = [...BANKS, ...BANKS, ...BANKS];

    return (
        <div className="bank-logos-section">
            <p className="bank-logos-heading">Trusted by cardholders from India&apos;s leading banks</p>
            <div className="logos-marquee-wrapper" aria-hidden="true">
                <div className="logos-marquee-track">
                    {repeated.map((bank, i) => (
                        <span key={`${bank.id}-${i}`} className="bank-logo-unit">
                            <img
                                src={bank.src}
                                alt={bank.name}
                                className="bank-logo-img"
                                loading="lazy"
                                width="160"
                                height="50"
                            />
                            {/* Show name label for logos that are pure image/icon without text */}
                            {!bank.hideName && (
                                <span className="bank-logo-name">{bank.name}</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
