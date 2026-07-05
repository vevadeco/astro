# Implementation Plan: Astrology App

## Overview

A client-side React + TypeScript astrology application that accepts birth details, determines zodiac signs, calculates natal charts, derives lucky/unlucky factors, and displays an interactive calendar with auspicious and cautionary dates. All computations are deterministic and performed in-browser; data is persisted via localStorage.

## Tasks

- [x] 1. Set up project structure and core data models
  - [x] 1.1 Initialize project with Vite, React, TypeScript, Vitest, and fast-check
    - Create a React + TypeScript project using Vite
    - Install dependencies: react, react-dom, vitest, @testing-library/react, fast-check
    - Configure Vitest in `vitest.config.ts`
    - Set up directory structure: `src/models/`, `src/services/`, `src/components/`, `src/context/`, `src/persistence/`
    - _Requirements: all_

  - [x] 1.2 Define core TypeScript interfaces and types
    - Create `src/models/types.ts` with all interfaces: `BirthProfile`, `ZodiacSign`, `NatalChart`, `PlanetaryPosition`, `LuckyFactors`, `UnluckyFactors`, `LuckyItem`, `UnluckyItem`, `DateClassification`, `MonthCalendarData`, `CalendarDate`, `DateSummary`, `DailySummary`, `Result<T,E>`, `PersistenceError`, `ValidationError`, `ValidationResult`
    - _Requirements: 1.1, 1.2, 2.1, 2.3, 3.1, 4.1, 5.1, 6.1, 8.1_

- [x] 2. Implement validation module
  - [x] 2.1 Implement profile validation functions
    - Create `src/services/validation.ts` implementing `ProfileValidator` interface
    - `validateName`: 1-100 chars, alphabetic + spaces only
    - `validateDateOfBirth`: YYYY-MM-DD format, valid calendar date, range 1900-01-01 to today
    - `validateBirthTime`: HH:MM 24-hour format, 00:00–23:59
    - `validateLocation`: optional, max 200 chars
    - `validateProfile`: combines all field validations, returns all errors for missing/invalid fields
    - _Requirements: 1.1, 1.4, 1.5, 1.6_

  - [ ]* 2.2 Write property test for missing field validation
    - **Property 2: Missing field validation**
    - **Validates: Requirements 1.4**

  - [ ]* 2.3 Write property test for invalid format rejection
    - **Property 3: Invalid format rejection**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 3. Implement zodiac sign determination service
  - [-] 3.1 Implement zodiac service
    - Create `src/services/zodiacService.ts` implementing `ZodiacService` interface
    - `determineSign`: match date of birth against Western tropical zodiac date ranges for all 12 signs
    - `getSignDescription`: return 1-3 sentence description for each sign
    - Define zodiac date ranges as constants
    - _Requirements: 2.1, 2.2_

  - [ ]* 3.2 Write property test for zodiac sign determination correctness
    - **Property 4: Zodiac sign determination correctness**
    - **Validates: Requirements 2.1**

  - [ ]* 3.3 Write property test for zodiac description format
    - **Property 5: Zodiac description format**
    - **Validates: Requirements 2.2**

- [ ] 4. Implement natal chart calculation service
  - [~] 4.1 Implement natal chart service
    - Create `src/services/natalChartService.ts` implementing `NatalChartService` interface
    - `calculate`: compute sun sign, moon position (degree 0-359), planetary positions for 7 planets
    - When location is provided: compute ascendant, set `reducedPrecision` to false
    - When location is absent: omit ascendant, set `reducedPrecision` to true
    - Use deterministic astronomical approximations based on birth date and time
    - _Requirements: 2.3, 2.4_

  - [ ]* 4.2 Write property test for natal chart precision reflects location presence
    - **Property 6: Natal chart precision reflects location presence**
    - **Validates: Requirements 2.3, 2.4**

- [ ] 5. Implement lucky and unlucky factors services
  - [~] 5.1 Implement lucky factors derivation
    - Create `src/services/factorsService.ts` implementing `FactorsService` interface
    - `deriveLuckyFactors`: derive 1-3 lucky numbers, 1-3 lucky colors, 1-2 lucky days, 1-2 lucky gemstones from zodiac sign and natal chart positions
    - Each factor includes an explanation of at most 200 characters
    - _Requirements: 3.1, 3.2, 3.3_

  - [~] 5.2 Implement unlucky factors derivation
    - `deriveUnluckyFactors`: derive 1-3 unfavorable numbers, 1-3 unfavorable colors, 1-2 unfavorable days from zodiac sign and natal chart positions
    - Each factor includes an explanation of at most 2 sentences
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 5.3 Write property test for lucky factors count constraints
    - **Property 7: Lucky factors count constraints**
    - **Validates: Requirements 3.1**

  - [ ]* 5.4 Write property test for lucky factor explanation length
    - **Property 8: Lucky factor explanation length**
    - **Validates: Requirements 3.3**

  - [ ]* 5.5 Write property test for unlucky factors count constraints
    - **Property 9: Unlucky factors count constraints**
    - **Validates: Requirements 4.1**

  - [ ]* 5.6 Write property test for unlucky factor explanation length
    - **Property 10: Unlucky factor explanation length**
    - **Validates: Requirements 4.3**

- [~] 6. Checkpoint - Core services validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement calendar service
  - [~] 7.1 Implement date classification and calendar data generation
    - Create `src/services/calendarService.ts` implementing `CalendarService` interface
    - `classifyDate`: classify a date as 'lucky', 'caution', 'both', or 'neutral' based on natal chart
    - `getMonthDates`: generate `MonthCalendarData` for a given year/month with classifications for every day
    - `getDateSummary`: produce a `DateSummary` with lucky/caution explanations
    - Validate navigation range: accept month offsets -12 to +12 from current month, reject outside range
    - Caution summary must be 50-500 characters
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.3, 6.4, 6.5_

  - [ ]* 7.2 Write property test for calendar produces valid date classifications
    - **Property 11: Calendar produces valid date classifications**
    - **Validates: Requirements 5.1, 6.1**

  - [ ]* 7.3 Write property test for calendar navigation accepts valid range
    - **Property 12: Calendar navigation accepts valid range**
    - **Validates: Requirements 5.2, 6.4**

  - [ ]* 7.4 Write property test for date summaries match classification
    - **Property 13: Date summaries match classification**
    - **Validates: Requirements 5.3, 6.3, 6.5**

- [ ] 8. Implement daily summary service
  - [~] 8.1 Implement daily summary generation
    - Create `src/services/dailySummaryService.ts`
    - Generate `DailySummary` for today's date using the natal chart classification
    - Classification must match the calendar service output for the same date
    - If lucky: reference at least one lucky factor value in guidance
    - If caution: reference at least one unlucky factor value in guidance
    - If neutral: display neutral message with no notable influences
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 8.2 Write property test for daily summary classification validity
    - **Property 14: Daily summary classification validity**
    - **Validates: Requirements 8.1**

  - [ ]* 8.3 Write property test for daily guidance references matching factors
    - **Property 15: Daily guidance references matching factors**
    - **Validates: Requirements 8.2, 8.3**

- [x] 9. Implement persistence layer
  - [x] 9.1 Implement localStorage persistence service
    - Create `src/persistence/profilePersistence.ts` implementing `ProfilePersistenceService`
    - `save`: serialize BirthProfile to JSON, store in localStorage, return `Result<void, PersistenceError>`
    - `load`: read from localStorage, parse JSON, validate structure, return `Result<BirthProfile | null, PersistenceError>`
    - `delete`: remove profile from localStorage
    - Handle errors: storage_full, corrupted_data, unavailable
    - _Requirements: 1.3, 7.1, 7.6_

  - [ ]* 9.2 Write property test for profile persistence round-trip
    - **Property 1: Profile persistence round-trip**
    - **Validates: Requirements 1.3, 7.1**

- [~] 10. Checkpoint - All services complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement React Context and state management
  - [~] 11.1 Create app context with profile and astrological data
    - Create `src/context/AppContext.tsx`
    - Provide profile state, computed zodiac sign, natal chart, lucky/unlucky factors, and calendar data
    - On profile save: persist to localStorage, compute all astrological data
    - On profile edit: recalculate all derived data (zodiac, factors, dates)
    - On app load: attempt to load saved profile, handle corrupted data gracefully
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ]* 11.2 Write property test for profile change triggers recalculation determinism
    - **Property 16: Profile change triggers recalculation determinism**
    - **Validates: Requirements 7.5**

- [ ] 12. Implement UI components - Profile input
  - [~] 12.1 Create ProfileInputForm component
    - Create `src/components/ProfileInputForm.tsx`
    - Input fields: name, date of birth (YYYY-MM-DD), birth time (HH:MM), optional location
    - Display validation errors inline per field without clearing other fields
    - On submit: validate, save via context, show confirmation
    - On save failure: display error message, retain entered data
    - Support edit mode: pre-populate fields with existing profile data
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.3_

- [ ] 13. Implement UI components - Dashboard
  - [~] 13.1 Create Dashboard layout with DailySummary, FactorsPanel, and CalendarView
    - Create `src/components/Dashboard.tsx` as the main layout after profile is saved
    - Create `src/components/DailySummary.tsx`: display today's classification and guidance text
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [~] 13.2 Create FactorsPanel with lucky and unlucky factors display
    - Create `src/components/FactorsPanel.tsx` with sub-components for lucky and unlucky factors
    - Display zodiac sign name and description (1-3 sentences)
    - Display lucky numbers, colors, days, gemstones with explanations
    - Display unlucky numbers, colors, days with explanations
    - Handle error states: display messages when factors cannot be derived
    - _Requirements: 2.1, 2.2, 3.1, 3.3, 3.4, 4.1, 4.3, 4.4_

  - [~] 13.3 Create CalendarView with month navigation, date grid, and date detail popover
    - Create `src/components/CalendarView.tsx` with month navigation (±12 months)
    - Create `src/components/DateGrid.tsx`: render dates with visual indicators (distinct styling for lucky, caution, both, neutral)
    - Create `src/components/DateDetailPopover.tsx`: show lucky/caution summaries on date click
    - Display messages when no lucky or caution dates exist for a month
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 14. Implement profile management actions
  - [~] 14.1 Create ProfileActions component for edit and delete
    - Create `src/components/ProfileActions.tsx`
    - Edit button: navigate to ProfileInputForm in edit mode with pre-populated fields
    - Delete button: show confirmation dialog, on confirm delete profile and return to input screen
    - _Requirements: 7.3, 7.4_

- [ ] 15. Wire App component with routing logic
  - [~] 15.1 Create App component with conditional rendering
    - Create/update `src/App.tsx`
    - If no saved profile: show ProfileInputForm with prompt to create profile
    - If saved profile exists: show Dashboard
    - Load saved profile on mount within 3 seconds
    - Handle corrupted data: show error and input form
    - _Requirements: 7.2, 7.6, 8.5_

  - [ ]* 15.2 Write unit tests for UI components
    - Test form rendering: verify input fields exist with correct attributes
    - Test storage failure handling: mock localStorage to throw, verify error display
    - Test factor derivation failure: mock service to fail, verify error messages
    - Test visual indicators: verify distinct CSS classes for lucky, caution, neutral dates
    - Test profile CRUD: edit populates fields, delete prompts confirmation
    - Test app startup states: no profile shows creation prompt, neutral day shows neutral message
    - _Requirements: 1.1, 1.2, 1.7, 3.4, 4.4, 5.4, 6.2, 7.3, 7.4, 8.4, 8.5_

- [~] 16. Final checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases using React Testing Library
- All astrological calculations are deterministic pure functions, making them ideal for property-based testing
- The service layer is fully decoupled from UI, enabling independent testing

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "9.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.1", "9.2"] },
    { "id": 4, "tasks": ["3.2", "3.3", "4.1"] },
    { "id": 5, "tasks": ["4.2", "5.1", "5.2"] },
    { "id": 6, "tasks": ["5.3", "5.4", "5.5", "5.6", "7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3", "7.4", "8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3", "11.1"] },
    { "id": 9, "tasks": ["11.2", "12.1"] },
    { "id": 10, "tasks": ["13.1", "13.2", "13.3", "14.1"] },
    { "id": 11, "tasks": ["15.1"] },
    { "id": 12, "tasks": ["15.2"] }
  ]
}
```
