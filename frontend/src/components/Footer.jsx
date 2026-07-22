import React from 'react';
import { Globe, Share2, AtSign, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer({ onSignUpClick }) {
    const year = new Date().getFullYear();

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <div className="footer-logo-box">
                            <span className="footer-logo-mark" aria-hidden="true">CK</span>
                        </div>
                        <span className="footer-logo-name">CardKin</span>
                    </div>
                    <p className="footer-tagline">
                        India's verified credit card community.
                        Share benefits, earn from your cards.
                    </p>
                    <button className="btn btn-primary footer-cta-btn" onClick={onSignUpClick}>
                        Join for free <ArrowRight size={14} />
                    </button>
                    <div className="footer-socials">
                        <a href="#" aria-label="Website" className="footer-social-icon"><Globe size={16} /></a>
                        <a href="#" aria-label="Share" className="footer-social-icon"><Share2 size={16} /></a>
                        <a href="#" aria-label="Contact" className="footer-social-icon"><AtSign size={16} /></a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <h4>Product</h4>
                    <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>How it works</a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a>
                    <button type="button" className="footer-link-btn" onClick={onSignUpClick}>Sign up</button>
                </div>

                <div className="footer-links-group">
                    <h4>Company</h4>
                    <span className="footer-placeholder">About us</span>
                    <span className="footer-placeholder">Blog</span>
                    <span className="footer-placeholder">Careers</span>
                    <span className="footer-placeholder">Contact</span>
                </div>

                <div className="footer-links-group">
                    <h4>Legal</h4>
                    <span className="footer-placeholder">Privacy policy</span>
                    <span className="footer-placeholder">Terms of service</span>
                    <span className="footer-placeholder">Cookie policy</span>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {year} CardKin Technologies Pvt. Ltd. All rights reserved.</span>
                <span className="footer-bottom-right">Made with ♥ in India</span>
            </div>
        </footer>
    );
}
