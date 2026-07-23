import React, { useState } from 'react';
import { Search, Plane, Coffee, ShoppingBag, Gem, ArrowRight } from 'lucide-react';
import './Hero.css';

const CATEGORIES = [
    { id: 'all', label: 'All cards', icon: Search },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'lounge', label: 'Lounge', icon: Coffee },
    { id: 'cashback', label: 'Cashback', icon: ShoppingBag },
    { id: 'premium', label: 'Premium', icon: Gem },
];

const QUICK_SEARCHES = [
    'HDFC Infinia',
    'Axis Atlas',
    'SBI Cashback',
    'ICICI Amazon Pay',
    'Amex Platinum',
];

export default function Hero({ onSignUpClick, onSearch, isLoggedIn }) {
    const [searchValue, setSearchValue] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchValue.trim();
        if (query && onSearch) {
            onSearch(query);
        }
    };

    const handleQuickSearch = (term) => {
        setSearchValue(term);
        if (onSearch) onSearch(term);
    };

    return (
        <section className="hero-business" id="home">
            <div className="hero-business-inner animate-fade-up">

                <div className="hero-copy">
                    <h1>
                        India's Smartest<br />
                        <span className="hero-h1-accent">Credit Card Network</span>
                    </h1>
                    <p>
                        Find verified cardholders across India. Book lounge access, split rewards,
                        and unlock premium card benefits — matched instantly from our growing network.
                    </p>
                </div>

                {/* Primary CTA pair */}
                {!isLoggedIn && (
                    <div className="hero-cta-pair">
                        <button className="btn btn-primary hero-cta-btn" onClick={() => {
                            const el = document.getElementById('hero-search');
                            if (el) el.focus();
                        }}>
                            Find a cardholder
                            <ArrowRight size={16} />
                        </button>
                        <button className="btn btn-ghost hero-cta-btn" onClick={onSignUpClick}>
                            List your cards
                        </button>
                    </div>
                )}

                <div className="hero-search-panel">
                    <div className="search-category-tabs" role="tablist" aria-label="Search categories">
                        {CATEGORIES.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === id}
                                className={`category-tab ${activeCategory === id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(id)}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearchSubmit} className="hero-search-form">
                        <div className="hero-search-field">
                            <Search size={18} className="hero-search-icon" />
                            <input
                                type="text"
                                id="hero-search"
                                placeholder="Search card name, bank, or benefit..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                aria-label="Search cards, banks, or benefits"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary hero-search-btn">
                            Search
                            <ArrowRight size={15} />
                        </button>
                    </form>

                    <div className="hero-quick-searches">
                        <span>Trending:</span>
                        {QUICK_SEARCHES.map((term) => (
                            <button
                                key={term}
                                type="button"
                                className="quick-search-chip"
                                onClick={() => handleQuickSearch(term)}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {!isLoggedIn && (
                    <p className="hero-signup-hint">
                        Already have an account?{' '}
                        <button type="button" className="hero-signup-link" onClick={onSignUpClick}>
                            Sign in to your dashboard →
                        </button>
                    </p>
                )}
            </div>
        </section>
    );
}
