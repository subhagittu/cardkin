import React from 'react';
import { Plane, Coffee, ShoppingBag, Gem, CreditCard, Gift } from 'lucide-react';
import './CategoryGrid.css';

const CATEGORIES = [
    { icon: Plane, label: 'Travel rewards', desc: 'Miles & hotel points', query: 'travel cards', count: '840+' },
    { icon: Coffee, label: 'Airport lounge', desc: 'Priority Pass & more', query: 'lounge access', count: '620+' },
    { icon: ShoppingBag, label: 'Cashback', desc: 'Up to 5% back', query: 'cashback', count: '1.2k+' },
    { icon: Gem, label: 'Premium cards', desc: 'Infinia, Atlas & more', query: 'premium', count: '380+' },
    { icon: CreditCard, label: 'Shopping offers', desc: 'Amazon, Flipkart', query: 'shopping', count: '950+' },
    { icon: Gift, label: 'Welcome benefits', desc: 'Joining bonuses', query: 'welcome offer', count: '210+' },
];

export default function CategoryGrid({ onSearch }) {
    return (
        <section className="category-grid-section">
            <div className="section-head-row">
                <div>
                    <h2>Browse by benefit</h2>
                    <p>Explore categories — holders available in your city</p>
                </div>
            </div>

            <div className="category-grid">
                {CATEGORIES.map(({ icon: Icon, label, desc, query, count }) => (
                    <button
                        key={label}
                        type="button"
                        className="category-card"
                        onClick={() => onSearch?.(query)}
                    >
                        <div className="category-icon">
                            <Icon size={22} strokeWidth={1.75} />
                        </div>
                        <div className="category-text">
                            <span className="category-label">{label}</span>
                            <span className="category-desc">{desc}</span>
                        </div>
                        <span className="category-count">{count} holders</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
