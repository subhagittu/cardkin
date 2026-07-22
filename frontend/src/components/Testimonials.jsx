import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const REVIEWS = [
    {
        name: 'Arjun Mehta',
        city: 'Bangalore',
        initials: 'AM',
        text: 'Needed lounge access at BLR airport. Found a holder in 2 minutes, paid ₹49 unlock fee, coordinated on WhatsApp. Smooth as any travel app.',
        rating: 5,
        use: 'Lounge access',
    },
    {
        name: 'Priya Nair',
        city: 'Mumbai',
        initials: 'PN',
        text: 'Used CardKin for a Flipkart Big Billion Days purchase through an SBI Cashback holder. Saved ₹2,400 on a ₹48,000 order.',
        rating: 5,
        use: 'Cashback match',
    },
    {
        name: 'Karan Singh',
        city: 'Delhi NCR',
        initials: 'KS',
        text: 'I list my HDFC Infinia and earn from 3–4 matches every month. Verification and ratings make the whole thing feel legitimate.',
        rating: 5,
        use: 'Card holder',
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials-section landing-section">
            <div className="testimonials-header">
                <span className="section-label">Reviews</span>
                <h2>Trusted by thousands of cardholders</h2>
                <p>Real stories from Indians using CardKin every day</p>
            </div>

            <div className="testimonials-grid">
                {REVIEWS.map((review) => (
                    <blockquote key={review.name} className="testimonial-card">
                        <div className="testimonial-top">
                            <div className="testimonial-stars">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} size={13} className="star-filled" />
                                ))}
                            </div>
                            <Quote size={20} className="testimonial-quote-icon" />
                        </div>
                        <p className="testimonial-text">{review.text}</p>
                        <footer className="testimonial-author">
                            <div className="testimonial-avatar">{review.initials}</div>
                            <div>
                                <strong>{review.name}</strong>
                                <span>{review.city} · {review.use}</span>
                            </div>
                        </footer>
                    </blockquote>
                ))}
            </div>
        </section>
    );
}
