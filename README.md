# 🩺 Breast Cancer Prediction System (MSc SDLC Project)

An advanced, AI-powered medical diagnostic tool modernized for the **Software Development Life Cycle (SDLC)**. This application predicts breast tumor malignancy using the Wisconsin Breast Cancer Dataset and features Explainable AI (XAI), Population Analytics, and Generative AI recommendations.

---

## 🚀 Key Features

### 1. **Modern Diagnostic Interface**
- **Numeric Input Grid**: Precision inputs (1-10 scale) replacing legacy text fields.
- **Instant Classification**: Real-time Benign/Malignant prediction with confidence logic.

### 2. **📊 Population Analytics**
- **Radar Charts**: Compares the current patient's biomarkers against the *average Benign* and *average Malignant* profiles from the dataset.
- **Outlier Detection**: Visually identifies which specific features are abnormal.

### 3. **🔍 Explainable AI (XAI)**
- **Feature Contribution**: Bar charts visualizing *why* the model made its decision (e.g., "Clump Thickness contributed 40% to risk").
- **Transparency**: Ensuring black-box models are interpretable for clinicians.

### 4. **🤖 AI Medical Assistant (Google Gemini)**
- **Personalized Advice**: Generates specific next steps, test recommendations, and treatment topics based on the patient's unique data.
- **Contextual Awareness**: Uses specific biomarkers to tailor the response.

### 5. **🛠️ Maintenance & Feedback Loop**
- **Correction Logging**: Clinicians can flag incorrect predictions.
- **Data Collection**: Saves feedback to `feedback_data.csv` for future **model retraining/fine-tuning**.

### 6. **📄 Automated Reporting**
- **PDF Generation**: One-click download of a professional medical report including diagnosis, inputs, and AI recommendations.

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Breast-Cancer-Wisconsin-Classification
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   - Create a `.env` file in the root directory.
   - Add your Google Gemini API Key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

---

## ▶️ Usage

Run the web application locally:

```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`.

---

## 📂 Project Structure

- `app.py`: Main application logic (UI, Prediction, XAI, Analytics).
- `report_generator.py`: Module for PDF report creation.
- `breast-cancer-wisconsin.csv`: Dataset used for population analytics.
- `trained_model.sav`: The pre-trained machine learning model.
- `requirements.txt`: Python dependencies.

---

## 🔬 Dataset Info

**Breast Cancer Wisconsin (Original) Data Set**
- **Source**: UCI Machine Learning Repository
- **Attributes**: 10 quantitative features (Clump Thickness, Cell Size, Shape, etc.) computed from digitized image of a fine needle aspirate (FNA).

---

**Disclaimer**: This tool is for educational/research purposes (MSc SDLC) and should not replace professional medical diagnosis.