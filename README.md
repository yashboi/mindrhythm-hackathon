# MindRhythm

MindRhythm is a local-first stability forecasting website for sleep, stress, workload, mood, energy, and quick manual check-ins. It is a reflection tool, not a diagnosis tool.

## Run Locally

```powershell
node server.js
```

Open `http://localhost:3000`.

To enable AI-generated stabilization plans:

```powershell
$env:OPENAI_API_KEY="your_api_key"
node server.js
```

Optional model override:

```powershell
$env:OPENAI_MODEL="gpt-5.1-mini"
node server.js
```

## Current Workflow

1. Upload Apple Health `export.xml` in the Upload tab.
2. MindRhythm parses sleep records locally in the browser and stores nightly summaries in `localStorage`.
3. Add daily Check-Ins with mood, stress, workload, energy, sleep hours, sleep quality, connection, overwhelm, and an optional note.
4. Open Dashboard to see baseline sleep, manual check-in count, forecast confidence, 24/48/72-hour forecast cards, charts, top drivers, and a stabilization plan.

## Files

- `server.js`: static localhost server plus `POST /api/stabilization`.
- `static/index.html`: the full UI, Apple Health XML parser, local model, dashboard rendering, canvas charts, and check-in storage.

## Data Logic

- Apple Health sleep data is grouped by sleep night. Records before noon are assigned to the previous night so overnight sleep is not split incorrectly.
- Baseline sleep uses the earliest available nights, up to 14 nights, from the uploaded XML.
- Manual check-ins are permanent browser data until cleared. Older check-ins remain in `localStorage` and recent check-ins are used in forecasts.
- Manual sleep hours and sleep quality now contribute to the instability signal. If no XML exists, typical sleep comes from manual sleep entries only.

## Forecast Logic

MindRhythm uses a transparent weighted score from 0 to 100.

- Sleep duration below baseline
- Manual sleep quality below the steady range
- Sleep efficiency below baseline
- Stress above baseline
- Mood below baseline
- Workload above baseline
- Energy and social connection below the steady range

Forecast windows:

- 24 hours: latest check-in plus last sleep night
- 48 hours: recent 48-hour trend
- 72 hours: next 72-hour outlook

Forecast states:

- `0-27`: Stable
- `28-51`: Watch Zone
- `52-74`: Elevated Instability
- `75-100`: High Instability

## Confidence Logic

Confidence answers how much the user should trust the forecast right now.

- Apple Health mode combines sleep-history volume, XML presence, check-in volume, and baseline availability.
- Manual-only mode starts lower, rewards check-in count, recency, completeness, and manual sleep entries, and caps at 70%.
- The app should say it lacks data rather than fabricating a sleep baseline.

## OpenAI Plan Logic

The dashboard first shows a local driver-based stabilization plan. Clicking `Generate AI plan` sends summarized forecast context to `/api/stabilization`. The server calls the OpenAI Responses API when `OPENAI_API_KEY` is configured. If not configured or if the request fails, the UI keeps a local fallback plan.

Only summarized forecast context is sent to the endpoint; raw Apple Health XML is not sent.

## Safety

MindRhythm is not medical advice and does not diagnose or treat mental health conditions. If someone feels unsafe or in crisis, they should contact emergency services, 988 in the U.S., or a trusted adult immediately.
