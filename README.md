# 🩺 Breast Cancer Wisconsin Classification

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.32.0+-FF4B4B.svg)](https://streamlit.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

An advanced, AI-powered medical diagnostic tool built for modern healthcare applications. This system predicts breast tumor malignancy using the Wisconsin Breast Cancer Dataset, featuring Explainable AI (XAI), Population Analytics, AI-powered recommendations, and comprehensive reporting capabilities.

## 🎯 Overview

This application demonstrates a complete machine learning pipeline for medical diagnostics, incorporating best practices in software engineering, data science, and user experience design. The system provides real-time predictions with transparency and actionable insights for healthcare professionals.

### 🌟 Live Demo
[View Application](https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification)

---

## 🚀 Features

### 🔬 **Core Functionality**
- **Real-time Prediction**: Instant benign/malignant classification with confidence scores
- **Intuitive Interface**: Modern, clean UI with numeric input grids (1-10 scale)
- **High Accuracy**: Machine learning model trained on Wisconsin Breast Cancer Dataset
- **Batch Processing**: Support for multiple patient records via predictive system

### 📊 **Advanced Analytics**
- **Population Comparison**: Interactive radar charts comparing patient biomarkers against population averages
- **Outlier Detection**: Visual identification of abnormal features
- **Statistical Insights**: Comprehensive analysis of patient data relative to historical trends
- **Interactive Visualizations**: Powered by Plotly for dynamic data exploration

### 🔍 **Explainable AI (XAI)**
- **Feature Importance**: Bar charts showing which biomarkers contributed to the prediction
- **Decision Transparency**: Clear visualization of model reasoning
- **Confidence Metrics**: Detailed probability scores for each prediction
- **Interpretable Results**: Making black-box models understandable for clinicians

### 🤖 **AI-Powered Recommendations**
- **Google Gemini Integration**: Personalized medical advice based on patient data
- **Contextual Insights**: Recommendations tailored to specific biomarker patterns
- **Next Steps Guidance**: Suggested tests and treatment considerations
- **Evidence-based Responses**: AI-generated advice grounded in medical context

### 🛠️ **Continuous Improvement**
- **Feedback Collection**: Clinician correction logging system
- **Model Maintenance**: Data collection for future retraining
- **Quality Assurance**: Built-in mechanisms for prediction validation
- **Audit Trail**: Comprehensive logging of predictions and corrections

### 📄 **Professional Reporting**
- **PDF Generation**: One-click download of comprehensive medical reports
- **Complete Documentation**: Includes all inputs, predictions, visualizations, and recommendations
- **Shareable Format**: Professional reports for medical records and consultations

---

## 🏗️ Technical Architecture

### Machine Learning Pipeline
- **Algorithm**: Support Vector Machine (SVM) / Logistic Regression
- **Training Data**: Wisconsin Breast Cancer Dataset (UCI ML Repository)
- **Features**: 10 quantitative biomarkers from fine needle aspirate (FNA) imaging
- **Performance**: Optimized for medical diagnostic accuracy

### Technology Stack
- **Backend**: Python 3.8+
- **Web Framework**: Streamlit
- **ML Libraries**: scikit-learn, NumPy, pandas
- **Visualization**: Matplotlib, Plotly
- **AI Integration**: Google Generative AI (Gemini)
- **PDF Generation**: FPDF
- **Environment Management**: python-dotenv

---

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Google Gemini API key (for AI recommendations feature)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification.git
   cd Breast-Cancer-Wisconsin-Classification
   ```

2. **Create Virtual Environment** (Recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   
   > **Note**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 🚀 Usage

### Running the Web Application

Start the Streamlit server:

```bash
streamlit run app.py
```

The application will open in your browser at `http://localhost:8501`

### Using the Predictive System

For batch predictions or integration with other systems:

```python
python predictive_system.py
```

### Input Parameters

The system accepts the following biomarkers (scale 1-10):

| Feature | Description |
|---------|-------------|
| Clump Thickness | Thickness of cell clumps |
| Uniformity of Cell Size | Consistency in cell dimensions |
| Uniformity of Cell Shape | Consistency in cell morphology |
| Marginal Adhesion | Cell-to-cell adhesion quality |
| Single Epithelial Cell Size | Size of individual epithelial cells |
| Bare Nuclei | Nuclei not surrounded by cytoplasm |
| Bland Chromatin | Chromatin texture uniformity |
| Normal Nucleoli | Nucleoli appearance |
| Mitoses | Rate of cell division |

---

## 📂 Project Structure

```
Breast-Cancer-Wisconsin-Classification/
│
├── app.py                              # Main Streamlit application
├── predictive_system.py                # Batch prediction script
├── report_generator.py                 # PDF report generation module
├── trained_model.sav                   # Trained ML model (pickle)
├── breast-cancer-wisconsin.csv         # Dataset for analytics
├── requirements.txt                    # Python dependencies
├── README.md                           # Project documentation
├── .env                                # Environment variables (not in repo)
└── __pycache__/                        # Python cache files
```

---

## 🔬 Dataset Information

**Wisconsin Breast Cancer Dataset (Original)**

- **Source**: UCI Machine Learning Repository
- **Instances**: 699 samples
- **Features**: 10 quantitative attributes
- **Classes**: Benign (2) / Malignant (4)
- **Missing Values**: Handled during preprocessing
- **Citation**: Wolberg, W.H., & Mangasarian, O.L. (1990)

### Feature Details
All features are scored on a 1-10 scale based on FNA imaging analysis:
- Values 1-3: Generally benign characteristics
- Values 4-6: Intermediate patterns
- Values 7-10: Typically malignant indicators

---

## 🎨 Screenshots

### Main Interface
Clean, intuitive input grid with real-time prediction

### Population Analytics
Radar chart comparison against benign/malignant averages

### Explainable AI
Feature contribution visualization showing model reasoning

### AI Recommendations
Personalized medical advice from Google Gemini

*(Add screenshots to your repository and link them here)*

---

## 🔧 Development

### Adding New Features

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Testing

Run the application in development mode:
```bash
streamlit run app.py --server.runOnSave true
```

---

## 📊 Model Performance

The trained model demonstrates strong performance on the Wisconsin dataset:
- High accuracy in binary classification
- Robust feature importance analysis
- Validated against clinical standards

*(Update with specific metrics if available)*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Contributors
- [Abdullah](https://github.com/abdull6771)

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ⚠️ Disclaimer

**IMPORTANT**: This application is designed for educational and research purposes only. It is NOT intended to replace professional medical diagnosis, advice, or treatment. Always consult qualified healthcare professionals for medical decisions.

The predictions made by this system should be used as supplementary information only and must be validated by licensed medical practitioners.

---

## 🙏 Acknowledgments

- **UCI Machine Learning Repository** for the Wisconsin Breast Cancer Dataset
- **Streamlit** for the amazing web framework
- **Google AI** for Gemini API access
- **scikit-learn** community for ML tools
- The open-source community for continuous inspiration

---

## 📧 Contact

**Abdullah**
- GitHub: [@abdull6771](https://github.com/abdull6771)
- Project Link: [https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification](https://github.com/abdull6771/Breast-Cancer-Wisconsin-Classification)

---

## 🗺️ Roadmap

- [ ] Add support for additional ML algorithms
- [ ] Implement model versioning and A/B testing
- [ ] Add user authentication and role-based access
- [ ] Expand dataset with more recent clinical data
- [ ] Create mobile-responsive design
- [ ] Add multi-language support
- [ ] Integrate with Electronic Health Records (EHR) systems
- [ ] Deploy to cloud platforms (AWS/Azure/GCP)

---

<div align="center">

**Made with ❤️ for advancing healthcare through AI**

⭐ Star this repository if you find it helpful!

</div>