# Requirements Document

## Introduction

A custom astrology application that accepts user birth details (date of birth, birth time, name) and generates personalized astrological insights. The app provides information about lucky and unlucky factors for the user, displays a calendar highlighting auspicious dates, and identifies dates where the user should avoid making important decisions.

## Glossary

- **Astrology_App**: The overall application system that provides personalized astrological readings and calendar views
- **Birth_Profile**: A data record containing the user's name, date of birth, birth time, and optionally birth location
- **Lucky_Factors**: Astrological elements deemed favorable for the user, including lucky numbers, colors, days, and gemstones
- **Unlucky_Factors**: Astrological elements deemed unfavorable for the user that should be avoided
- **Lucky_Date**: A calendar date identified as auspicious for the user based on their astrological profile
- **Caution_Date**: A calendar date where the user should avoid making important decisions based on their astrological profile
- **Zodiac_Sign**: The astrological sign determined by the user's date of birth
- **Natal_Chart**: The astrological chart calculated from the user's birth details representing planetary positions at the time of birth
- **Calendar_View**: The visual calendar interface displaying lucky and caution dates for the user

## Requirements

### Requirement 1: Birth Profile Input

**User Story:** As a user, I want to enter my birth details, so that the app can generate my personalized astrological profile.

#### Acceptance Criteria

1. THE Astrology_App SHALL provide input fields for name (maximum 100 characters, alphabetic characters and spaces only), date of birth (in YYYY-MM-DD format, ranging from 1900-01-01 to the current date), and birth time (in 24-hour HH:MM format, from 00:00 to 23:59)
2. THE Astrology_App SHALL accept an optional birth location field as a free-text city name input with a maximum length of 200 characters
3. WHEN a user submits a complete Birth_Profile, THE Astrology_App SHALL store the profile for future use and display a confirmation that the profile was saved
4. IF a required field (name, date of birth, or birth time) is missing, THEN THE Astrology_App SHALL display a validation error indicating which fields are required without clearing the already-filled fields
5. IF a date of birth is provided in a format other than YYYY-MM-DD or contains an invalid calendar date, THEN THE Astrology_App SHALL display an error message specifying the expected YYYY-MM-DD format
6. IF a birth time is provided in a format other than HH:MM in 24-hour notation or contains values outside the 00:00–23:59 range, THEN THE Astrology_App SHALL display an error message specifying the expected 24-hour HH:MM format
7. IF the Astrology_App fails to store the Birth_Profile after submission, THEN THE Astrology_App SHALL display an error message indicating the profile could not be saved and SHALL retain the entered data in the input fields

### Requirement 2: Zodiac Sign Determination

**User Story:** As a user, I want to see my zodiac sign based on my birth date, so that I can understand my basic astrological identity.

#### Acceptance Criteria

1. WHEN a valid Birth_Profile is submitted, THE Astrology_App SHALL determine the user's Zodiac_Sign by matching the date of birth against the standard Western tropical zodiac date ranges covering all 12 signs, assigning the sign whose date range contains the birth date
2. WHEN a Zodiac_Sign is determined, THE Astrology_App SHALL display the sign name and a description of its characteristics in 1 to 3 sentences
3. WHEN a valid Birth_Profile is submitted with a birth location, THE Astrology_App SHALL calculate the Natal_Chart based on the user's date of birth, birth time, and birth location
4. IF a valid Birth_Profile is submitted without a birth location, THEN THE Astrology_App SHALL calculate the Natal_Chart using only the user's date of birth and birth time, and SHALL indicate that the chart has reduced precision due to missing location data

### Requirement 3: Lucky Factors Display

**User Story:** As a user, I want to see what is lucky for me, so that I can incorporate favorable elements into my daily life.

#### Acceptance Criteria

1. WHEN a Natal_Chart is calculated, THE Astrology_App SHALL display the user's Lucky_Factors including at least 1 and at most 3 lucky numbers, at least 1 and at most 3 lucky colors, at least 1 and at most 2 lucky days of the week, and at least 1 and at most 2 lucky gemstones
2. THE Astrology_App SHALL derive Lucky_Factors from the user's Zodiac_Sign and Natal_Chart positions
3. WHEN Lucky_Factors are displayed, THE Astrology_App SHALL provide an explanation of no more than 200 characters per factor describing why that factor is considered lucky for the user
4. IF the Astrology_App cannot derive Lucky_Factors from the Natal_Chart, THEN THE Astrology_App SHALL display an error message indicating that lucky factors are unavailable and suggesting the user verify their birth details

### Requirement 4: Unlucky Factors Display

**User Story:** As a user, I want to see what is unlucky for me, so that I can be mindful of unfavorable elements.

#### Acceptance Criteria

1. WHEN a Natal_Chart is calculated, THE Astrology_App SHALL display the user's Unlucky_Factors including at least 1 and at most 3 unfavorable numbers, at least 1 and at most 3 unfavorable colors, and at least 1 and at most 2 unfavorable days of the week
2. THE Astrology_App SHALL derive Unlucky_Factors from the user's Zodiac_Sign and Natal_Chart positions
3. WHEN Unlucky_Factors are displayed, THE Astrology_App SHALL provide an explanation of no more than 2 sentences per factor describing why that factor is considered unlucky for the user
4. IF Unlucky_Factors cannot be derived from the Natal_Chart, THEN THE Astrology_App SHALL display a message indicating that unlucky factors are unavailable for the given profile

### Requirement 5: Lucky Dates Calendar

**User Story:** As a user, I want to see a calendar of dates that are lucky for me, so that I can plan important activities on favorable days.

#### Acceptance Criteria

1. WHEN a Natal_Chart is calculated, THE Astrology_App SHALL generate a Calendar_View highlighting Lucky_Dates for the current month
2. THE Astrology_App SHALL allow the user to navigate up to 12 months into the future and 12 months into the past from the current month in the Calendar_View
3. WHEN a user selects a Lucky_Date on the Calendar_View, THE Astrology_App SHALL display a summary of why that date is considered auspicious, including at least the contributing astrological factor from the Natal_Chart
4. THE Astrology_App SHALL visually distinguish Lucky_Dates from both regular dates and Caution_Dates using a dedicated visual indicator unique to Lucky_Dates
5. IF a navigated month contains no Lucky_Dates, THEN THE Astrology_App SHALL display a message informing the user that no lucky dates were identified for that month

### Requirement 6: Caution Dates Calendar

**User Story:** As a user, I want to see dates where I should avoid making decisions, so that I can postpone important choices to more favorable times.

#### Acceptance Criteria

1. WHEN a Natal_Chart is calculated, THE Astrology_App SHALL identify and display Caution_Dates on the Calendar_View for the current month
2. THE Astrology_App SHALL visually distinguish Caution_Dates from Lucky_Dates and regular dates using a distinct color or icon that is different from both the Lucky_Date indicator and the default date styling
3. WHEN a user selects a Caution_Date on the Calendar_View, THE Astrology_App SHALL display a summary between 50 and 500 characters explaining which astrological factors make that date unfavorable for decision-making
4. THE Astrology_App SHALL allow the user to navigate to at least 12 months in the future and 12 months in the past to view Caution_Dates
5. IF a calendar date qualifies as both a Lucky_Date and a Caution_Date, THEN THE Astrology_App SHALL display both indicators on that date and show both summaries when the date is selected
6. IF no Caution_Dates exist for the currently displayed month, THEN THE Astrology_App SHALL display a message indicating that no caution dates were identified for that month

### Requirement 7: Profile Persistence

**User Story:** As a user, I want my birth profile to be saved, so that I do not need to re-enter my details each time I use the app.

#### Acceptance Criteria

1. WHEN a user submits a valid Birth_Profile, THE Astrology_App SHALL persist the profile data locally such that it survives app closure and reopening
2. WHEN the user launches the Astrology_App and a saved Birth_Profile exists, THE Astrology_App SHALL load the previously saved Birth_Profile and display the associated astrological information within 3 seconds
3. WHEN the user requests to edit a saved Birth_Profile, THE Astrology_App SHALL present the existing profile data in editable input fields
4. WHEN the user requests to delete a saved Birth_Profile, THE Astrology_App SHALL prompt the user for confirmation before removing the profile data and, upon confirmation, return the user to the Birth_Profile input screen
5. IF the user edits a Birth_Profile and submits valid changes, THEN THE Astrology_App SHALL recalculate all astrological data including Lucky_Factors, Unlucky_Factors, Lucky_Dates, and Caution_Dates and display the updated results
6. IF the locally persisted Birth_Profile data is corrupted or unavailable, THEN THE Astrology_App SHALL display an error message indicating the profile could not be loaded and present the Birth_Profile input screen for re-entry

### Requirement 8: Daily Summary

**User Story:** As a user, I want to see a daily astrological summary, so that I can quickly understand how today aligns with my profile.

#### Acceptance Criteria

1. WHEN the user opens the Astrology_App and a saved Birth_Profile exists, THE Astrology_App SHALL display a daily summary indicating whether today is a Lucky_Date, a Caution_Date, or a neutral date based on the user's Natal_Chart
2. IF today is a Lucky_Date, THEN THE Astrology_App SHALL display guidance referencing the user's Lucky_Factors and suggesting favorable activities aligned with the astrological conditions for that date
3. IF today is a Caution_Date, THEN THE Astrology_App SHALL display guidance identifying the categories of decisions to defer and referencing the user's Unlucky_Factors relevant to that date
4. IF today is neither a Lucky_Date nor a Caution_Date, THEN THE Astrology_App SHALL display a neutral summary indicating no notable astrological influences for the day
5. IF no saved Birth_Profile exists when the user opens the Astrology_App, THEN THE Astrology_App SHALL prompt the user to create a Birth_Profile before displaying a daily summary
