# Dashboard UI Reconstruction Prompt

**Role**: You are an expert Frontend Developer and UI/UX Engineer with deep experience in React, Tailwind CSS, and modern web design principles (Glassmorphism, Bento Box layouts).

**Task**: Accurately recreate the provided "WeatherSwim" dashboard UI. Your goal is pixel-perfect replication of the layout, typography, color palette, and component structure.

## 1. Overall Aesthetic & Theming
- **Style**: Modern, clean, Glassmorphism.
- **Background**: A softly blurred, nature-inspired image (e.g., a green landscape) that peeks through the translucent components.
- **Card Styling**: All widgets are housed in white, semi-transparent cards (`bg-white/80` or similar) with heavy backdrop blur, very soft drop shadows (`shadow-sm` or custom soft shadow), and generous rounded corners (approx `rounded-3xl` or `24px/32px`).
- **Typography**: Clean, geometric sans-serif (e.g., Inter, SF Pro Display). Use dark slate/black for primary values and soft muted grays for secondary text and labels.

## 2. Layout Structure (Bento Box / Masonry Grid)
The dashboard uses a full-width CSS Grid layout. 

### Header (Top Navigation)
- **Left**: Logo ("WeatherSwim" with "Swim" in a distinct green).
- **Center**: Pill-shaped navigation menu with the active item ("Dashboard") having a dark background.
- **Right**: Search bar (with magnifying glass icon), filter icon, bell icon, settings icon, and a profile dropdown.

### Left Column (~30% Width)
1. **Temperature Gauge Card**:
   - Location pin with city name and "Last Updated" timestamp.
   - Trend pill (e.g., "+2°C Feels warmer") in green.
   - **Gauge**: A semi-circular arc with a gradient from Green -> Yellow -> Orange -> Red. A needle points to the current value.
   - Text reading the current temperature large and bold in the center.
   - Legend below the gauge showing color meanings (Chilly, Pleasant, Peak).
   - A dark pill at the bottom split into two sections: Wind (with icon) and Humidity (with icon).
2. **Other Cities List**:
   - Header "Other Cities" with a "View all" green link.
   - A vertical list of cities. Each row contains:
     - Weather icon (e.g., cloud, sun) in a light container.
     - City Name and secondary text (wind/humidity).
     - Large temperature value and short weather text (e.g., "CLOUDY").

### Right Column (~70% Width)
**Top Half: Air Quality & Pollutants**
1. **Air Quality Index Card** (Left side of the top half):
   - A unique Diamond/Rhombus shaped visual containing the AQI number and status ("GOOD").
   - A short descriptive text paragraph below it.
   - Three horizontal progress bars for specific pollutants (PM2.5, OZONE, PM10) with values on the right.
2. **Pollutants Grid** (Right side of the top half):
   - A 2x3 grid of mini-cards (6 in total) for specific pollutants: Particulate 2.5, Sulfur Dioxide, Ozone (O3), Carbon Monoxide, Nitrogen Dioxide, Particulate 10.
   - Each card has a label, a large value with unit, and a **distinct micro-chart** (e.g., step chart, area chart, bar chart, sparkline) using green/orange accent colors.

**Bottom Half: Trends & Outlook**
1. **UV Index Chart** (Left side of the bottom half):
   - Header showing the current value, trend (e.g., "↑ 15%"), and daily average.
   - A wide, vertical bar chart showing data over time (6 AM to NOW). The bars transition in color from green to yellow to orange to red as the values get higher.
   - A dark tooltip/label on the most recent bar.
   - A "Scientific Advisory" text block at the bottom of the card.
2. **10-Day Outlook** (Right side of the bottom half):
   - Header "10-Day-Outlook".
   - A vertical list of days (Today, Tue, Wed...).
   - Each row contains: Day name, weather icon, low temperature, a horizontal gradient range bar, and high temperature.
   - A dark, full-width button at the bottom: "Detailed 10-Day Report".

## 3. Implementation Requirements
- **Framework**: Use React (Next.js preferred) with Tailwind CSS.
- **Charts**: Use a charting library like Recharts or specialized SVG drawing for the unique charts (especially the Gauge and the Diamond AQI visual).
- **Responsiveness**: The grid must collapse gracefully. On mobile, the layout should stack vertically (Header -> Gauge -> AQI -> Pollutants -> UV Index -> Other Cities -> Outlook).
- **Attention to Detail**: Pay extremely close attention to the paddings, alignment, font weights, and the exact gradients used in the visual elements. The success of this UI relies heavily on the "premium" feel of the spacing and glassmorphic effects.
