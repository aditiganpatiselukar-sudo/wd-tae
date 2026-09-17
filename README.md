# Digital Time Zone Converter — WorldClock

## Project overview
A responsive world clock tool that compares custom-selected city times against the user's local time.

## Main features
- Automatically detects the browser's local time zone.
- Live clocks updated every second.
- Add multiple cities from a predefined world-city list.
- Remove individual cities or clear all.
- Shows date and UTC offset for every selected city.
- Shows how many hours/minutes each city is ahead of or behind the user.
- 12-hour / 24-hour time format switch.
- Light / dark theme switch.
- Responsive desktop, tablet and mobile layout.
- No backend or database required.

## Technology stack
- Front-end: HTML5, CSS3, JavaScript (ES6+)
- API: JavaScript Internationalization API (`Intl.DateTimeFormat`)
- Database: Not required
- Back-end: Not required
- Libraries/frameworks: None

## How to run
1. Keep `index.html`, `style.css`, and `script.js` in the same folder.
2. Open `index.html` in Chrome, Edge, Firefox, or another modern browser.
3. Select a city and click **Add City**.
4. Use **12H/24H** and **☾/☀** to change display preferences.

## Suggested GitHub repository
`digital-time-zone-converter`

## Suggested deployment
GitHub Pages, Netlify, or Vercel can host this static website.

## Suggested project architecture
User Browser
→ HTML Structure
→ CSS Responsive UI
→ JavaScript Application Logic
→ Intl.DateTimeFormat
→ Local Time + Selected City Times
