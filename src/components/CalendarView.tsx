import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  countCautionDates,
  countLuckyDates,
  getDateSummary,
  isValidMonthOffset,
  MAX_MONTH_OFFSET,
  MIN_MONTH_OFFSET,
} from '../services/calendarService';
import { DateGrid } from './DateGrid';
import { DateDetailPopover } from './DateDetailPopover';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarView() {
  const { natalChart, monthCalendar, monthOffset, setMonthOffset } = useApp();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [navError, setNavError] = useState<string | null>(null);

  if (!natalChart || !monthCalendar) return null;

  const monthLabel = `${MONTH_NAMES[monthCalendar.month - 1]} ${monthCalendar.year}`;
  const luckyCount = countLuckyDates(monthCalendar);
  const cautionCount = countCautionDates(monthCalendar);

  const handleNavigate = (delta: number) => {
    const next = monthOffset + delta;
    if (!isValidMonthOffset(next)) {
      setNavError(`Navigation limited to ${MIN_MONTH_OFFSET} to ${MAX_MONTH_OFFSET} months from today.`);
      return;
    }
    setNavError(null);
    setMonthOffset(next);
    setSelectedDate(null);
  };

  const summary =
    selectedDate && natalChart ? getDateSummary(selectedDate, natalChart) : null;

  return (
    <section className="calendar-view">
      <h2>Your Astrological Calendar</h2>

      <div className="month-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleNavigate(-1)}
          disabled={!isValidMonthOffset(monthOffset - 1)}
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="month-label">{monthLabel}</span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleNavigate(1)}
          disabled={!isValidMonthOffset(monthOffset + 1)}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {navError && <div className="alert alert-warning">{navError}</div>}

      <div className="calendar-legend">
        <span className="legend-item"><span className="indicator indicator-lucky" /> Lucky</span>
        <span className="legend-item"><span className="indicator indicator-caution" /> Caution</span>
        <span className="legend-item"><span className="dot both" /> Both</span>
      </div>

      <DateGrid
        year={monthCalendar.year}
        month={monthCalendar.month}
        dates={monthCalendar.dates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {luckyCount === 0 && (
        <p className="month-message">No lucky dates were identified for this month.</p>
      )}
      {cautionCount === 0 && (
        <p className="month-message">No caution dates were identified for this month.</p>
      )}

      {summary && (
        <DateDetailPopover summary={summary} onClose={() => setSelectedDate(null)} />
      )}
    </section>
  );
}
