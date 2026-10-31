# TruthLens — AI-Based Fake News Detection using Machine Learning

A B.Tech Information Technology PBL project that uses NLP and a TF-IDF-based
machine learning classifier to predict whether a news article is likely
**REAL** or **FAKE**.

The project has two parts that run separately and talk to each other over HTTP:

1. **Frontend** — React + TypeScript + Vite + Tailwind CSS (the website you see).
2. **Backend** — Python + Flask + SQLite + scikit-learn (the API + the ML model).

---

## Tech Stack

**Frontend**
- React + TypeScript
- Vite (dev server / build tool)
- React Router (page navigation)
- Tailwind CSS (styling)
- Lucide React (icons)

**Backend**
- Python + Flask (REST API)
- SQLite (user accounts + detection history)
- scikit-learn + pandas + TF-IDF (the machine-learning model)
- Werkzeug (secure password hashing)
- Flask-Cors (safe cross-origin requests)

---

## Project Structure

```
project-root/
├── src/                      # React frontend
│   ├── components/           # Navbar, Sidebar, Footer, Button, ResultCard, etc.
│   ├── context/              # AuthContext (login/logout/session)
│   ├── pages/                # Landing, Login, Register, Dashboard, Detect, History, ...
│   ├── services/api.ts       # Centralized API calls to the Flask backend
│   ├── types/                # TypeScript interfaces
│   └── utils/                # Date formatting, validation helpers
├── backend/                  # Flask + ML backend
│   ├── app/
│   │   ├── __init__.py        # App factory + error handlers
│   │   ├── config.py          # Config from environment variables
│   │   ├── database.py        # SQLite connection + table creation
│   │   ├── auth.py            # Password hashing, sessions, login_required
│   │   ├── preprocess.py      # NLP text cleaning
│   │   ├── predictor.py       # Load model + run a real prediction
│   │   └── routes/            # auth_routes.py, api_routes.py, health_routes.py
│   ├── dataset/              # Put your labelled CSV files here (for training)
│   ├── models/               # Trained model + vectorizer are saved here
│   ├── data/                 # SQLite database file is created here
│   ├── train_model.py        # Training script (trains + saves the model)
│   ├── run.py                # Starts the Flask server
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend environment variables
├── frontend/.env.example     # Frontend environment variables
└── .env.example              # Frontend env (also used by the dev server)
```

---

## 1. Prerequisites

- **Node.js 18+** (for the frontend)
- **Python 3.11+** (for the backend; dependency pins support Python 3.14)
- **pip** (Python package installer)

Check you have them:

```bash
node --version
python --version
pip --version
```

---

## 2. Setup the Backend (Flask + ML)

### a) Create and activate a virtual environment (recommended)

On **Windows**:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

On **macOS / Linux**:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### b) Install the Python dependencies

```bash
pip install -r requirements.txt
```

### c) Configure environment variables

```bash
cp .env.example .env
```

Open `backend/.env` and change the `SECRET_KEY` to any long random string.
The other defaults are fine for local development. The root `.env` file should contain `VITE_API_BASE_URL=http://127.0.0.1:5000/api` for the React frontend.

### d) Run the Flask server

From inside the `backend/` folder (with the virtual environment active):

```bash
python run.py
```

You should see something like:

```
* Running on http://127.0.0.1:5000
```

The first run automatically creates the SQLite database (`backend/data/truthlens.db`).

You can test that it is alive by opening <http://127.0.0.1:5000/api/health>
in your browser — it should return `{"status":"ok", ...}`.

---

## 3. Setup the Dataset and Train the Model

The prediction endpoint only works **after** you train the model. If you call
`/api/predict` before training, the API returns a clear error explaining what
to do.

### a) Get a labelled Real/Fake news dataset

You need a CSV file (or files) where each row is one news article with two
columns:

| column | meaning |
|---|---|
| `text` | the full news article text (a headline or a paragraph) |
| `label` | `0` for REAL news, `1` for FAKE news |

Good free datasets for this project:

- **ISOT Fake News Dataset** (Kaggle): `Fake.csv` and `True.csv`.
  Combine them into one CSV with a `text` and a `label` column (0 = True/Real,
  1 = Fake). The Kaggle search for "fake news dataset" has several options.
- **LIAR dataset**, **FakeNewsNet**, or any other labelled news CSV with the
  same `text` / `label` format.

If your CSV uses different column names, rename them to `text` and `label`
before training (you can open the CSV in Excel or use pandas).

### b) Place the dataset

Put your CSV file(s) inside the `backend/dataset/` folder, for example:

```
backend/dataset/news.csv
```

### c) Train the model

From inside the `backend/` folder (with the virtual environment active):

```bash
python train_model.py
```

The script will:

1. Read every CSV in `backend/dataset/`.
2. Clean the text (lowercase, remove punctuation, URLs, digits).
3. Convert text to numbers using **TF-IDF** (1- and 2-word combinations).
4. Train two candidate models and compare them:
   - **Logistic Regression**
   - **Multinomial Naive Bayes**
5. Print **accuracy, precision, recall, and F1-score** for each model.
6. Pick the model with the best F1-score.
7. Save the model and the TF-IDF vectorizer into `backend/models/`
   (`model.joblib` and `vectorizer.joblib`).

Example output:

```
Reading news.csv ...
Loaded 40000 rows from 1 file(s).

Training Logistic Regression ...
  Accuracy : 0.9587
  Precision: 0.9563
  Recall   : 0.9612
  F1-score : 0.9587

Training Multinomial Naive Bayes ...
  ...

Best model: Logistic Regression (F1 = 0.9587)
Saved vectorizer -> .../models/vectorizer.joblib
Saved model      -> .../models/model.joblib
```

After this, the Flask `/api/predict` endpoint uses the **real trained model**
(not a hardcoded or random result).

---

## 4. Setup the Frontend (React)

Open a **new terminal** (keep the Flask server running in the first one).

### a) Install dependencies

From the project root:

```bash
npm install
```

### b) Configure environment variables

```bash
cp .env.example .env
```

The default value is already correct for local development:

```
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

This tells the React app where the Flask backend is.

### c) Run the frontend dev server

```bash
npm run dev
```

Open the URL shown in the terminal (usually <http://localhost:5173>).

---

## 5. How to Use the App

1. The Flask backend must be running (`python run.py` inside `backend/`).
2. Open the frontend in your browser.
3. Create an account on the **Register** page (this also logs you in).
4. On the **Detect** page, paste a news article and click **Detect News**.
   - The text is sent to the Flask backend, preprocessed, vectorized with
     TF-IDF, and classified by the trained model.
   - The result (REAL / FAKE + confidence) is shown and saved to your history.
5. The **History** page lists your past detections. You can search, filter,
   and delete them.
6. The **Dashboard** shows summary stats and recent detections.
7. The **Profile** page lets you edit your display name and log out.

---

## 6. API Endpoints

All endpoints are prefixed with `/api`. Auth uses a server-side session cookie
(`credentials: 'include'` on the frontend).

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account (logs you in) | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/auth/logout` | Log out | Yes |
| GET  | `/api/auth/me` | Get the current user | Yes |
| PUT  | `/api/auth/me` | Update display name | Yes |
| POST | `/api/predict` | Run the ML model on news text | Yes |
| GET  | `/api/history` | List your detection history | Yes |
| GET  | `/api/history/<id>` | Get one detection record | Yes |
| DELETE | `/api/history/<id>` | Delete one record | Yes |
| DELETE | `/api/history` | Clear all your records | Yes |
| GET  | `/api/dashboard/stats` | Summary stats for the dashboard | Yes |
| GET  | `/api/health` | Health check (reports if the model is trained) | No |

### `/api/predict` details

Request body:

```json
{ "text": "News article text to analyze" }
```

Success response (200):

```json
{
  "prediction": "REAL",
  "confidence": 0.87,
  "analysisId": "12"
}
```

If the model is not trained, the endpoint returns `503` with a message telling
you to add a dataset and run `python train_model.py`.

---

## 7. Security Notes

- Passwords are hashed with Werkzeug's `generate_password_hash` (PBKDF2) and are
  **never** stored in plain text.
- Sessions are signed with `SECRET_KEY` and stored in an HTTP-only cookie.
- Each user can only read, create, and delete **their own** detection records
  (the backend filters by the logged-in user's id).
- CORS is limited to the origins listed in `CORS_ORIGINS` in `backend/.env`.
- The `SECRET_KEY` in `.env.example` is a placeholder — always change it.

---

## 8. Available Scripts (Frontend)

```bash
npm run dev        # Start the Vite dev server
npm run build      # Build the frontend for production (into dist/)
npm run preview    # Preview the production build
npm run typecheck  # TypeScript type checking
npm run lint       # Run ESLint
```

---

## 9. Troubleshooting

- **"Cannot reach the backend server"** in the frontend:
  Make sure the Flask server is running (`python run.py` inside `backend/`)
  and that `VITE_API_BASE_URL` in your `.env` matches its address.
- **"The fake-news model is not trained yet"** when predicting:
  You have not trained the model yet. See section **3** above.
- **CORS error in the browser console**:
  Make sure the frontend URL (e.g. `http://localhost:5173`) is listed in
  `CORS_ORIGINS` in `backend/.env`, then restart the Flask server.
- **`pip` not found**: use `python -m pip ...` or install pip for your Python.
- **Port 5000 already in use**: change the port in `backend/run.py` and update
  `VITE_API_BASE_URL` in the frontend `.env` to match.

---

## 10. Important Notes

- Predictions are **educational, not definitive**. The model classifies based on
  learned text patterns; it does not verify facts or sources.
- The app never invents accuracy numbers, user counts, or other unverified
  metrics. The only metrics shown are the ones the training script computes
  from your dataset.
- This is an educational project for a B.Tech IT PBL submission.
