import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import PlaceholderPage from './PlaceholderPage';

export default function Reports() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Analyze pipeline conversion, sales velocity, and executive summaries."
      icon={FiBarChart2}
      modulePhase="Phase 4"
    />
  );
}
