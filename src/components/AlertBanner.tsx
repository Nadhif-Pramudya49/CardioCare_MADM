import React from 'react';

export const AlertBanner: React.FC = () => {
  // Hide AlertBanner globally because this is now a clinical portal,
  // and patient-specific alerts are handled inside the detailed patient views.
  return null;
};
