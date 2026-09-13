# Breast Cancer Wisconsin Classification

Educational research tool that classifies a breast tumor as **BENIGN** or **MALIGNANT** from eight Fine Needle Aspirate (FNA) scores (1–10).

This is **not a medical device**. It does not replace professional diagnosis, advice, or treatment.

The main app is a React workstation in the `frontend` folder. It runs on your computer with built-in demo data, so you do **not** need a Python server or a Gemini API key to try it.

---

## How to run the app (first time)

Follow these steps in order. You only need to do the installs once.

### Step 1. Install Node.js

The app needs Node.js (it includes `npm`, the installer for JavaScript packages).

1. Open [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version (the recommended button).
3. Run the installer.
4. Keep the default options. Make sure **“Add to PATH”** is checked if you see it.
5. Click through until it finishes, then **restart your computer** (or at least close and reopen any terminal windows).

Check that it worked:

1. On Windows: press the Start key, type `PowerShell`, and open **Windows PowerShell**.
2. On Mac: open **Terminal**.
3. Type this and press Enter:

```bash
node -v
npm -v
```

You should see version numbers (for example `v22.x` and `10.x`). If you see “not recognized”, Node is not installed or the terminal was not restarted.

### Step 2. Get the project onto your computer

**Option A — Git (if you have Git installed)**

```bash
git clone https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification.git
cd Breast-Cancer-Wisconsin-Classification
```

**Option B — Download a ZIP (no Git needed)**

1. Open [the GitHub repository](https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification).
2. Click the green **Code** button, then **Download ZIP**.
3. Unzip the file (right-click → Extract All on Windows).
4. Remember the folder path. You will open a terminal inside it.

### Step 3. Open a terminal in the project folder

**Windows**

1. Open File Explorer and go into the project folder (`Breast-Cancer-Wisconsin-Classification`).
2. Click the address bar, type `powershell`, and press Enter.

**Mac**

1. Open Terminal.
2. Type `cd ` (with a space), then drag the project folder onto the Terminal window and press Enter.

You are in the right place if this folder contains `frontend`, `app.py`, and `README.md`.

### Step 4. Go into the frontend folder

```bash
cd frontend
```

### Step 5. Install the app packages

This downloads everything the app needs. It can take one or two minutes. Run it only from inside `frontend`.

```bash
npm install
```

Wait until the command finishes and you see the prompt again. You only need this once, or again after someone updates `package.json`.

### Step 6. Start the app

```bash
npm run dev
```

Leave this window open. When it is ready you will see something like:

```text
VITE v6.x  ready
➜  Local:   http://localhost:5173/
```

If it says port 5173 is in use, it may start on `http://localhost:5174/` instead. Use the address it prints.

### Step 7. Open it in your browser

1. Hold `Ctrl` and click the `http://localhost:5173/` link, **or**
2. Open Chrome / Edge / Firefox and paste `http://localhost:5173` into the address bar.

You should see **BCW Clinical** with a navy sidebar.

### Step 8. Try a sample analysis

1. In the left sidebar, click **Analyze**.
2. Click **Load benign sample** or **Load malignant sample** (top right).
3. Click **Analyze Tumor**.
4. The **Results** page shows:
   - a large **BENIGN** (green) or **MALIGNANT** (red) banner
   - a radar chart vs typical benign / malignant patterns
   - a feature-contribution chart
   - an educational AI note
   - **Download Medical Report (PDF)**
5. Open **Maintenance: Report Incorrect Prediction** if you want to send feedback (demo mode stores it in memory).

To enter your own scores, stay on **Analyze**, set each biomarker from 1 to 10, then click **Analyze Tumor**.

**What the scores mean**

| Score | Typical reading |
| --- | --- |
| 1–3 | Benign-leaning |
| 4–6 | Intermediate |
| 7–10 | Malignant-leaning |

The eight inputs, in order, are: Clump Thickness, Uniformity of Cell Size, Uniformity of Cell Shape, Marginal Adhesion, Single Epithelial Cell Size, Bland Chromatin, Normal Nucleoli, Mitoses. **Bare Nuclei is not used.**

### Step 9. Stop the app

Go back to the terminal where `npm run dev` is running. Press `Ctrl+C`. If it asks to confirm, type `Y` and press Enter.

To start it again later:

```bash
cd frontend
npm run dev
```

You do **not** need to run `npm install` again unless you deleted the `node_modules` folder.

---

## If something goes wrong

| What you see | What to do |
| --- | --- |
| `node` or `npm` is not recognized | Install Node.js LTS, then close and reopen the terminal |
| `npm install` fails | Make sure you ran it inside `frontend`, not the project root. Delete `frontend/node_modules` and try `npm install` again |
| The page is blank | Confirm `npm run dev` is still running. Try `http://localhost:5173` and `http://localhost:5174` |
| `EADDRINUSE` / port in use | Use the new port Vite printed, or close the other app using 5173 |
| Charts look empty | Run an analysis first, or use **Load benign sample** / **Load malignant sample** |

---

## What each screen does

| Page | Purpose |
| --- | --- |
| Overview | What the tool is and the 1–10 scale |
| Analyze | Enter the eight FNA scores and run the classifier |
| Results | Diagnosis banner, charts, AI note, PDF, feedback |
| Analytics | Population radar with the last patient overlaid |
| Reports | Preview and download `medical_report.pdf` |
| Feedback | Report an incorrect prediction |
| About | Dataset citation and disclaimer |
| Settings | Theme and API status |

The top bar **New Analysis** button always returns you to Analyze.

---

## Optional: Streamlit prototype

The original Python UI still lives at the project root. You do **not** need this if you are using the React app above.

1. Install [Python 3.10+](https://www.python.org/downloads/). On Windows, check **Add python.exe to PATH**.
2. In a terminal at the **project root** (not `frontend`):

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

Mac / Linux:

```bash
source venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

3. Open [http://localhost:8501](http://localhost:8501).

Gemini recommendations in Streamlit need a `.env` file in the project root:

```env
GEMINI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## Deploy on Vercel (optional)

The React app can be published for free as a static site.

1. Open [https://vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import `abdull6771/Breast-Cancer-Wisconsin-Classification`.
3. Leave the repository root as-is.
4. Click **Deploy**.

Production uses demo (mocked) data, so no backend is required.

---

## Project layout

```text
Breast-Cancer-Wisconsin-Classification/
├── frontend/                 # React workstation (start here)
│   ├── README.md             # Frontend API notes
│   ├── package.json
│   └── src/
├── app.py                    # Streamlit prototype
├── report_generator.py
├── predictive_system.py
├── breast-cancer-wisconsin.csv
├── requirements.txt
└── vercel.json
```

More frontend detail (API contract, mocks, environment variables) is in [frontend/README.md](frontend/README.md).

---

## Dataset

**Wisconsin Breast Cancer (Original)** — UCI Machine Learning Repository  
699 samples. Benign is coded `2`, malignant is coded `4`.

Wolberg, W. H., & Mangasarian, O. L. (1990). Multisurface method of pattern separation for medical diagnosis applied to breast cytology. *Proceedings of the National Academy of Sciences, 87*(23), 9193–9196.

---

## Disclaimer

This application is designed for educational and research purposes only. It is **NOT** intended to replace professional medical diagnosis, advice, or treatment. Always consult qualified healthcare professionals for medical decisions.

Predictions are supplementary educational information and must be validated by licensed practitioners.

---

## License

MIT. See the LICENSE file.

## Contact

[Abdullah](https://github.com/abdull6771) · [Repository](https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification)
