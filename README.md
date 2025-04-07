# Say The Number

A web application that converts numbers into their English word equivalents, built with Django (backend) and Vue.js (frontend).

> You can check a live version on https://saythenumber.onrender.com

![Say the Number demo](demo.gif?raw=true "Say the Number demo")

## Features

- Convert numbers to English words (e.g., "123" → "one hundred twenty three")
- Supports:
  - Positive and negative numbers
  - Decimal numbers
  - Very large numbers (up to 999 quintillion)
- Two conversion modes:
  - Instant conversion
  - Delayed conversion (simulating async processing)
- Responsive design works on all devices
- Light/dark mode toggle
- Rate-limited API (10 requests per minute)
- Unit tests for backend and frontend.
- E2E tests with Cypress.

## Tech Stack

**Frontend:**
- Vue.js 3 (Composition API)
- Vite (build tool)
- Tailwind CSS (styling)
- Vitest (unit testing)
- Cypress (e2e testing)

**Backend:**
- Django 5
- WhiteNoise (static files)
- django-cors-headers (CORS management)
- django-ratelimit (API rate limiting)

## Prerequisites

- Python 3.10+
- pip 23+

For front-end development:
- Node 22+
- npm 9+

## Installation

### Setup

For convenience (and to avoid needing a Node environment setup), this project includes pre-built frontend files (in `staticfiles`).

> This setup has been tested in Debian Linux 12.

1. Create and activate a virtual environment:
```
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install backend dependencies:
```
    pip install -r requirements.txt
```

3. Run
```
  python manage.py runserver
```

4. Head over to ```http://localhost:8000```.

5. To run tests:
```
  python manage.py test
```

> If interested in building the frontend as well, you can follow the instructions at `frontend/README.md`.

# API Documentation
### Endpoint

GET|POST /num_to_english

Parameters

    number (required): The number to convert (string)

Example Request

`curl "http://localhost:8000/num_to_english?number=123.45"`

Example Response

```
{
  "status": "ok",
  "num_in_english": "one hundred twenty three point four five"
}
```

Example error responses

    400: Missing or invalid number parameter

    429: Rate limit exceeded (10 requests per minute)

---

Developed by Feliciano Lima - © 2025