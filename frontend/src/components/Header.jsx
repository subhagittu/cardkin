import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, ArrowRight, Star, LogOut, User } from 'lucide-react';
import './Header.css';

export default function Header({
    theme,
    toggleTheme,
    onSignUpClick,
    onSignInClick,
    onHomeClick,
    currentView,
    activeSection,
    isLoggedIn,
    user,
    onLogout,
    onProfileClick
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavClick = (sectionId) => {
        if (currentView !== 'landing') {
            onHomeClick();
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const userInitials = user && user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'CK';

    return (
        <div className="header-wrapper">

            <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
                <div className="header-container">
                    <div className="logo-section" onClick={onHomeClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onHomeClick()}>
                        <div className="logo-box">
                            <span className="logo-text-short">CK</span>
                        </div>
                        <span className="brand-name">CardKin</span>
                    </div>

                    <nav className="nav-menu" aria-label="Main navigation">
                        {[
                            { id: 'home', label: 'Home' },
                            { id: 'features', label: 'How it works' },
                            { id: 'about', label: 'About' },
                        ].map(({ id, label }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className={`nav-link ${currentView === 'landing' && activeSection === id ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(id); }}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="header-actions">
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
                        </button>

                        {isLoggedIn ? (
                            <div className="header-profile-container" ref={dropdownRef}>
                                <button
                                    className="header-avatar-btn"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    aria-expanded={showDropdown}
                                    aria-label="Account menu"
                                >
                                    {userInitials}
                                </button>
                                {showDropdown && (
                                    <div className="header-profile-dropdown">
                                        <div className="dropdown-details-header">
                                            <div className="dropdown-avatar-large">{userInitials}</div>
                                            <div className="dropdown-info-block">
                                                <h4>{user?.name || 'Member'}</h4>
                                                <p>{user?.email || ''}</p>
                                            </div>
                                        </div>
                                        <div className="dropdown-rating-bar">
                                            <Star size={12} className="star-gold-icon" />
                                            <span>4.95 rating · 42 matches</span>
                                        </div>
                                        <hr className="dropdown-hr" />
                                        <button className="dropdown-link-btn" onClick={() => { setShowDropdown(false); onProfileClick?.(); }}>
                                            <User size={14} />
                                            <span>My profile</span>
                                        </button>
                                        <hr className="dropdown-hr" />
                                        <button className="dropdown-link-btn dropdown-logout-btn" onClick={() => { setShowDropdown(false); onLogout(); }}>
                                            <LogOut size={14} />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button type="button" className="login-link" onClick={onSignInClick}>Log in</button>
                                <button className="btn btn-primary join-btn" onClick={onSignUpClick}>
                                    Get started free
                                    <ArrowRight size={15} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
}
