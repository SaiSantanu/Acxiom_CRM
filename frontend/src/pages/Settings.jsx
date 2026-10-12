import React from 'react';
import { FiSettings } from 'react-icons/fi';
import PlaceholderPage from './PlaceholderPage';

export default function Settings() {
  return (
    <PlaceholderPage
      title="Settings"
      description="System configurations, role permissions, and integration preferences."
      icon={FiSettings}
      modulePhase="Phase 4"
    />
  );
}
