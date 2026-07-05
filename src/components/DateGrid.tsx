import type { DateClassification } from '../models/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DateGridProps {
  year: number;
  month: number;
  dates: { date: string; classification: DateClassification }[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DateGrid({ year, month, dates, selectedDate, onSelectDate }: DateGridProps) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="date-grid">
      <div className="weekday-header">
        {WEEKDAYS.map((d) => (
          <span key={d} className="weekday-label">
            {d}
          </span>
        ))}
      </div>
      <div className="date-grid-cells">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="date-cell empty" />
        ))}
        {dates.map(({ date, classification }) => {
          const day = parseInt(date.slice(8, 10), 10);
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              type="button"
              className={`date-cell date-${classification}${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectDate(date)}
              aria-label={`${date}, ${classification}`}
              aria-pressed={isSelected}
            >
              <span className="day-number">{day}</span>
              {(classification === 'lucky' || classification === 'both') && (
                <span className="indicator indicator-lucky" aria-hidden="true" />
              )}
              {(classification === 'caution' || classification === 'both') && (
                <span className="indicator indicator-caution" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
