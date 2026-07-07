import { useState } from 'react';
import { DailySummaryView } from './DailySummary';
import { FactorsPanel } from './FactorsPanel';
import { CalendarView } from './CalendarView';
import { ProfileActions } from './ProfileActions';
import { ProfileInputForm } from './ProfileInputForm';
import { VedicPanel } from './VedicPanel';
import { IslamicPanel } from './IslamicPanel';

export function Dashboard() {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileInputForm mode="edit" onCancel={() => setEditing(false)} />
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Astro Insights</h1>
        <ProfileActions onEdit={() => setEditing(true)} />
      </header>
      <DailySummaryView />
      <FactorsPanel />
      <VedicPanel />
      <IslamicPanel />
      <CalendarView />
    </div>
  );
}
