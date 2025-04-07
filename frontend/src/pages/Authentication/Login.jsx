import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";

const Login = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const { login, loginWithGoogle } = useAuthFunctions();

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await login(username, password);
         navigate("/home");
      } catch (error) {
         console.log(error);
      }
   };

   const handleGoogleSignIn = async () => {
      try {
         await loginWithGoogle();
         navigate("/home");
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="login-container">
         <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <div className="form-group">
               <label htmlFor="username">Username</label>
               <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
               <label htmlFor="password">Password</label>
               <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-button">
               Login
            </button>
            <div className="register-link">
               <span>New to CodeAI?</span>
               <Link to="/signup">Register Here</Link>
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

export default Login;
