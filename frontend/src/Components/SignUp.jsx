import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just redirect to home
        navigate('/home');
    };

    const handleGoogleSignIn = () => {
        // For now, just redirect to home
        navigate('/home');
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Sign Up</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">
                    Sign Up
                </button>
                <div className="login-link">
                    <span>Already a user?</span>
                    <Link to="/login">Login here</Link>
                </div>
                <div className="divider">
                    <span>or</span>
                </div>
                <button type="button" className="google-button" onClick={handleGoogleSignIn}>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
                    Sign in with Google
                </button>
            </form>
        </div>
    );
};

export default SignUp; 