import React from 'react';
import { FiActivity } from 'react-icons/fi';
import PlaceholderPage from './PlaceholderPage';

export default function Activities() {
  return (
    <PlaceholderPage
      title="Activities"
      description="Log calls, meetings, tasks, and client interaction histories."
      icon={FiActivity}
      modulePhase="Phase 3"
    />
  );
}
