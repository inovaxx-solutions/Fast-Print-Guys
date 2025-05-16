import React from 'react';
import './CheckoutStepIndicator.css';

// Checkmark icon component (can be an SVG or a character)
const CheckmarkIcon = () => (
  <svg
    className="checkmark-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
  >
    <circle cx="26" cy="26" r="25" fill="none" />
    <path fill="none" stroke="#FFF" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

const CheckoutStepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'CONTACTS' },
    { number: 2, label: 'SHIPPING' },
    { number: 3, label: 'PAYMENT' },
  ];

  // Determine totalSteps based on the steps array
  const totalSteps = steps.length;

  return (
    <div className="checkout-step-indicator-container"> {/* Added a container for the background */}
      <div className="checkout-step-indicator">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step ${step.number === currentStep ? 'active' : ''} ${
              step.number < currentStep ? 'completed' : ''
            }`}
          >
            <div className="step-circle-wrapper">
              <div className="step-number">
                {step.number < currentStep ? <CheckmarkIcon /> : step.number}
              </div>
            </div>
            <div className="step-label">{step.label}</div>
            {step.number < totalSteps && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutStepIndicator;