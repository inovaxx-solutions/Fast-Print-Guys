import React from 'react';
import SignupForm from './components/SignupForm/SignupForm';
import './LoginPage.css';
import { Link } from 'react-router-dom'; 
import logo from '../../assets/logo.png';
import authIllustration from '../../assets/auth-illustration.png'; 

function SignupPage() {
  return (
    <div className="login-page-wrapper"> 
      <div className="login-left-panel"> 
        <div className="login-logo">
          <Link to="/"> 
            <img src={logo} alt="FastPrint Logo" /> 
          </Link>
        </div>
        <div className="login-illustration">
          <img src={authIllustration} alt="Auth Illustration" />
        </div>
      </div>
      <div className="login-right-panel"> 
        <SignupForm />
      </div>
    </div>
  );
}

export default SignupPage;