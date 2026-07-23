import React, { useState, useEffect } from "react";
import { ShieldCheck, ArrowLeft, Search, CheckCircle, MessageSquare, Loader, Sparkles, CreditCard, Wifi, Lock, Activity } from "lucide-react";
import './SearchResults.css';

export default function SearchResults({ searchQuery, onBack }) {
    const [ searching, setSearching ] = useState(true);
    const [ progress, setProgress ] = useState(0);
    const [ logEntries, setLogEntries ] = useState([]);
    const [ activeMetric, setActiveMetric ] = useState(0);

    const [ cardholders, setCardholders ] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchResults = async () => {
            const { supabase } = await import('../lib/supabaseclient')
            const { data, error } = await supabase.from('profiles').select('*');
            if(data && isMounted) {
                const query = (searchQuery || '').toLowerCase();
                const matched = data.filter(p => {
                    if(!p.owned_cards || !Array.isArray(p.owned_cards))
                        return false;
                    return p.owned_cards.some(c => 
                        (c.name && c.name.toLowerCase().includes(query)) || 
                        (c.bank && c.bank.toLowerCase().includes(query))
                    );
                });

                const formatted = matched.map(p => {
                    const matchedCard = p.owned_cards.find(c => 
                        (c.name && c.name.toLowerCase().includes(query)) ||
                        (c.bank && c.bank.toLowerCase().includes(query))
                    );

                    const fullName = p.full_name || 'Anonymous User';
                    const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                    return {
                        id: p.id,
                        name: fullName,
                        initials: initials || 'AU',
                        card: matchedCard ? `${matchedCard.name} (${matchedCard.bank})` : 'Credit Card',
                        rating: parseFloat(p.rating || 5.0).toFixed(2),
                        matches: p.matches_count || 0,
                        phone: p.phone || 'Not Provided'
                    };
                });

                // Sort by highest rating
                setCardholders(formatted.sort((a, b) => b.rating - a.rating));
            }
        };

        fetchResults();

        const timeout = setTimeout(() => {
            if(isMounted)
                setSearching(false);
        }, 1500);

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [searchQuery]);

    const handleCloseModal = () => { };

    return (
        <div className="search-results-viewport animate-fade-in">
            {searching ? (
                <div className="res-simple-loader">
                    <Loader size={40} className="res-spinner" />
                    <h2>Searching for relevant cardholders...</h2>
                </div>
            ) : (
                /* ENTERPRISE RESULTS PANEL */
                <div className="res-outer">
                    {/* Results summary bar */}
                    <div className="res-header-bar">
                        <div className="res-header-left">
                            <div className="res-live-badge">
                                <span className="res-live-dot">
                                    <span>LIVE RESULTS</span>
                                </span>
                            </div>
                            <h2 className="res-main-title">Search Results</h2>
                            <p className="res-sub">Showing all registered holders of <span className="res-query-chip">{searchQuery}</span></p>
                        </div>
                        <div className="res-header-stats">
                            <div className="res-stat-card">
                                <span className="res-stat-num">{cardholders.length}</span>
                                <span className="res-stat-lbl">Matches Found</span>
                            </div>
                            <div className="res-stat-card res-stat-enc">
                                <Lock size={14} className="res-enc-icon" />
                                <span className="res-stat-lbl">AES-256 Encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Cardholders cards */}
                    <div className="res-card-list">
                        {cardholders.length === 0 ? (
                            <div className="res-empty-state">
                                <ShieldCheck size={40} className="res-empty-icon" />
                                <h3>No Matches Found</h3>
                                <p>No Cardholders found with <strong>"{searchQuery}"</strong>. Try a different card name.</p>
                            </div>
                        ) : cardholders.map((ch, idx) => (
                            <div key={ch.id} className="res-ch-row">
                                {/* Col 1: User Info */}
                                <div className="res-row-col res-row-user">
                                    <div className="res-avatar-wrap">
                                        <div className="res-avatar">{ch.initials}</div>
                                    </div>
                                    <div className="res-user-details">
                                        <div className="res-name-wrapper">
                                            <h3 className="res-row-name">{ch.name}</h3>
                                            <span className="res-verified-badge"><ShieldCheck size={12} />Verified</span>
                                        </div>
                                        <span className="res-row-phone">{ch.phone}</span>
                                    </div>
                                </div>

                                {/* Col 2: Card Match */}
                                <div className="res-row-col res-row-card">
                                    <span className="res-row-label">Matching Card</span>
                                    <p className="res-row-value">{ch.card}</p>
                                </div>

                                {/* Col 3: Stats */}
                                <div className="res-row-col res-row-stats">
                                    <div className="res-stat-mini">
                                        <span className="res-row-label">Trust Score</span>
                                        <span className="res-row-value res-rating-val">{ch.rating}</span>
                                    </div>
                                    <div className="res-stat-mini">
                                        <span className="res-row-label">Total Matches</span>
                                        <span className="res-row-value">{ch.matches}</span>
                                    </div>
                                </div>

                                {/* Col 4: Action */}
                                <div className="res-row-col res-row-action">
                                    <a
                                        href={`https://wa.me/${ch.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ch.name)}, %20I%20found%20you%20on%20CardKin%20for%20your%20${encodeURIComponent(ch.card)}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="res-row-btn res-cta-whatsapp"
                                    >
                                        <MessageSquare size={16} />
                                        <span>Chat on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
   