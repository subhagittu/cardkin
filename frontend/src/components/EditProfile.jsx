import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import './Profile.css';

export default function EditProfile({ user, onBack, onSave }) {
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (user && user.id) {
            // Update profile
            const { error } = await supabase
                .from('profiles')
                .update({ phone: phone.trim(), email: email.trim(), avatar_url: avatar })
                .eq('id', user.id);

            if (!error) {
                onSave({ phone: phone.trim(), email: email.trim(), avatar: avatar });
            } else {
                alert("Failed to update profile: " + error.message);
            }
        }
        setIsLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 200;
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX) { height *= MAX / width; width = MAX; }
                } else {
                    if (height > MAX) { width *= MAX / height; height = MAX; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                setAvatar(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="profile-viewport">
            <div className="profile-block-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 style={{ margin: 0 }}>Edit Profile</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)', padding: '3px', position: 'relative' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#FFD700', fontSize: '2rem', fontWeight: '600' }}>
                                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                </span>
                            )}
                        </div>
                        <label style={{ position: 'absolute', bottom: '0', right: '0', background: '#0052CC', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            <Camera size={14} color="white" />
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="ac-input"
                            required
                        />
                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.4rem' }}>
                            Updating this will change your contact email on the platform.
                        </small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="ac-input"
                            placeholder="e.g. 9876543210"
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="ac-submit-btn" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <Save size={18} />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
