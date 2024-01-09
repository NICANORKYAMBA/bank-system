import React from 'react';

const PasswordStrengthIndicator = ({ strength }) => {
  switch (strength) {
    case 'weak':
      return <span style={{ color: 'red' }}>Weak</span>;
    case 'medium':
      return <span style={{ color: 'yellow' }}>Medium</span>;
    case 'strong':
      return <span style={{ color: 'green' }}>Strong</span>;
    default:
      return null;
  }
};

export default PasswordStrengthIndicator;
