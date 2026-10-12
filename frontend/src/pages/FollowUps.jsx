import React from 'react';
import { FiClock } from 'react-icons/fi';
import PlaceholderPage from './PlaceholderPage';

export default function FollowUps() {
  return (
    <PlaceholderPage
      title="Follow-Ups"
      description="Schedule and monitor scheduled client touchpoints, deadlines, and reminders."
      icon={FiClock}
      modulePhase="Phase 3"
    />
  );
}
