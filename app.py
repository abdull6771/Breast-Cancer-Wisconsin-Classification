# -*- coding: utf-8 -*-
import numpy as np
import pickle
import streamlit as st
import os
import pandas as pd
import matplotlib.pyplot as plt
import google.generativeai as genai
import plotly.graph_objects as go
from dotenv import load_dotenv
from report_generator import create_download_link

# Load environment variables
load_dotenv()

# Set page config first
st.set_page_config(
    page_title="Breast Cancer Prediction",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .stButton>button {
        width: 100%;
        background-color: #ff4b4b;
        color: white;
        border-radius: 8px;
        height: 50px;
        font-weight: bold;
        border: none;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #ff3333;
        color: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
        text-align: center;
        font-family: 'Helvetica Neue', sans-serif;
        margin-bottom: 30px;
    }
    .prediction-box {
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .benign {
        background-color: #28a745;
        color: white;
    }
    .malignant {
        background-color: #dc3545;
        color: white;
    }
    .stSlider > label {
        font-size: 16px;
        font-weight: 600;
        color: inherit; 
    }
</style>
""", unsafe_allow_html=True)

# Function to load model
@st.cache_resource
def load_model():
    try:
        if os.path.exists('trained_model.sav'):
            return pickle.load(open('trained_model.sav', 'rb'))
        else:
            return None
    except Exception as e:
        return None

loaded_model = load_model()

# Function to load and prepare population data for analytics
@st.cache_data
def get_population_stats():
    try:
        # Define columns based on Wisconsin dataset structure
        col_names = [
            'id', 'clump_thickness', 'uniformity_cell_size', 'uniformity_cell_shape',
            'marginal_adhesion', 'single_epithelial_size', 'bare_nuclei', 
            'bland_chromatin', 'normal_nucleoli', 'mitoses', 'class'
        ]
        
        if os.path.exists('breast-cancer-wisconsin.csv'):
            df = pd.read_csv('breast-cancer-wisconsin.csv', names=col_names)
            # Drop ID and Bare Nuclei 
            df_clean = df.drop(columns=['id', 'bare_nuclei'])
            # Convert class to readable labels
            df_clean['class'] = df_clean['class'].map({2: 'Benign', 4: 'Malignant'})
            group_means = df_clean.groupby('class').mean()
            return group_means
        return None
    except Exception as e:
        return None

def plot_radar_chart(input_data, population_means):
    categories = [
        'Clump Thickness', 'Cell Size', 'Cell Shape', 'Marginal Adhesion',
        'Epith. Cell Size', 'Bland Chromatin', 'Normal Nucleoli', 'Mitoses'
    ]
    
    fig = go.Figure()

    # Patient Data
    fig.add_trace(go.Scatterpolar(
        r=input_data,
        theta=categories,
        fill='toself',
        name='Current Patient',
        line_color='#2E86C1'
    ))

    if population_means is not None:
        if 'Malignant' in population_means.index:
            fig.add_trace(go.Scatterpolar(
                r=population_means.loc['Malignant'].values,
                theta=categories,
                name='Avg Malignant',
                line_color='#E74C3C',
                line_dash='dot'
            ))
        
        if 'Benign' in population_means.index:
            fig.add_trace(go.Scatterpolar(
                r=population_means.loc['Benign'].values,
                theta=categories,
                name='Avg Benign',
                line_color='#2ECC71',
                line_dash='dot'
            ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10]
            )),
        showlegend=True,
        title="Patient vs Population Profiles"
    )
    return fig

# Gemini Recommendation Function
def get_gemini_recommendation(api_key, diagnosis, col_values):
    if not api_key:
        return "⚠️ Please enter a valid Google Gemini API Key in the sidebar to get recommendations."
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        You are an expert medical assistant specializing in oncology.
        
        Patient Condition:
        - Diagnosis: {diagnosis}
        - Clinical Features: {col_values}
        
        Based on this, provide:
        1. A brief explanation of what this diagnosis means in simple terms.
        2. General recommended next steps (e.g., specific tests, types of specialists to see).
        3. Potential treatment options to discuss with a doctor (Disclaimer: NOT medical advice).
        
        Keep the response professional, empathetic, and structured (use markdown).
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error contacting Gemini: {str(e)}"

def log_feedback(inputs, prediction, create_correct, comments):
    feedback_file = 'feedback_data.csv'
    timestamp = pd.Timestamp.now()
    
    data = {
        'timestamp': [timestamp],
        'inputs': [str(inputs)],
        'model_prediction': [prediction],
        'user_correction': [create_correct],
        'comments': [comments]
    }
    
    df = pd.DataFrame(data)
    
    if not os.path.exists(feedback_file):
        df.to_csv(feedback_file, index=False)
    else:
        df.to_csv(feedback_file, mode='a', header=False, index=False)

def cancer_prediction(input_data):
    if loaded_model is None:
        return "Model not loaded", "", None
    
    input_data_array = np.asarray(input_data)
    input_data_array_reshaped = input_data_array.reshape(1, -1)
    
    prediction = loaded_model.predict(input_data_array_reshaped)
    
    contributions = None
    if hasattr(loaded_model, 'coef_'):
        coefficients = loaded_model.coef_[0]
        if len(coefficients) == len(input_data):
            contributions = coefficients * input_data_array
    
    if prediction[0] == 2:
        return "The tumor is BENIGN", "benign", contributions
    else:
        return "The tumor is MALIGNANT", "malignant", contributions

def main():
    # Sidebar Env Logic
    env_api_key = os.getenv("GEMINI_API_KEY")

    # Sidebar
    with st.sidebar:
        st.image("https://cdn-icons-png.flaticon.com/512/2966/2966486.png", width=100)
        st.title("About App")
        st.info("Predicts breast cancer malignancy using Wisconsin Dataset features.")
        st.markdown("### 🤖 AI Assistant")
        if env_api_key:
            st.success("API Key loaded from .env")
            gemini_api_key = env_api_key
        else:
            gemini_api_key = st.text_input("Gemini API Key", type="password", help="Get key from ai.google.dev")

    st.title("🩺 Breast Cancer Prediction System")
    st.markdown("### Please enter the tumor metrics (1-10 scale)")

    # Input Form
    with st.form(key='prediction_form'):
        col1, col2 = st.columns(2, gap="large")

        with col1:
            clump_thickness = st.number_input("Clump Thickness", min_value=1, max_value=10, value=1, step=1)
            uniformity_cell_size = st.number_input("Uniformity of Cell Size", min_value=1, max_value=10, value=1, step=1)
            uniformity_cell_shape = st.number_input("Uniformity of Cell Shape", min_value=1, max_value=10, value=1, step=1)
            marginal_adhesion = st.number_input("Marginal Adhesion", min_value=1, max_value=10, value=1, step=1)

        with col2:
            single_epithelial_size = st.number_input("Single Epithelial Cell Size", min_value=1, max_value=10, value=1, step=1)
            bland_chromatin = st.number_input("Bland Chromatin", min_value=1, max_value=10, value=1, step=1)
            normal_nucleoli = st.number_input("Normal Nucleoli", min_value=1, max_value=10, value=1, step=1)
            mitoses = st.number_input("Mitoses", min_value=1, max_value=10, value=1, step=1)

        submit_button = st.form_submit_button(label='Analyze Tumor')

    # Session State
    if 'prediction_made' not in st.session_state:
        st.session_state.prediction_made = False
    
    if submit_button:
        if loaded_model:
            input_list = [
                clump_thickness, uniformity_cell_size, uniformity_cell_shape,
                marginal_adhesion, single_epithelial_size, bland_chromatin,
                normal_nucleoli, mitoses
            ]
            
            result_text, result_class, xai_data = cancer_prediction(input_list)
            
            st.session_state.last_inputs = input_list
            st.session_state.last_prediction = result_text
            st.session_state.prediction_made = True
            
            # 1. Result Display
            st.markdown(f"""
            <div class="prediction-box {result_class}">
                {result_text}
            </div>
            """, unsafe_allow_html=True)

            # 2. Population Analytics (Radar Chart)
            st.markdown("### 📊 Population Analytics")
            pop_stats = get_population_stats()
            
            if pop_stats is not None:
                radar_fig = plot_radar_chart(input_list, pop_stats)
                st.plotly_chart(radar_fig, use_container_width=True)
                st.caption("Compare the patient's pattern (Blue) against typical Benign (Green) and Malignant (Red) profiles.")
            else:
                st.error("Could not load dataset for population comparison. Ensure 'breast-cancer-wisconsin.csv' is in the directory.")

            # 3. XAI Visualizer
            st.markdown("### 🔍 Model Explanation (XAI)")
            if xai_data is not None:
                feature_names = [
                    "Clump Thickness", "Cell Size", "Cell Shape",
                    "Marginal Adhesion", "Epith. Cell Size", "Bland Chromatin",
                    "Normal Nucleoli", "Mitoses"
                ]
                
                if len(xai_data.flatten()) == len(feature_names):
                    importance_df = pd.DataFrame({
                        'Feature': feature_names,
                        'Contribution': xai_data.flatten()
                    }).sort_values(by='Contribution', ascending=True)

                    st.bar_chart(importance_df.set_index('Feature'))
                    st.caption("Positive values suggest Malignancy, negative suggest Benign.")
                else:
                    st.warning("Model features do not match input count. Skipping XAI chart.")
            else:
                st.info("Visual explanation not available for this model type.")
            
            # 4. Gemini Recommendation
            recommendation_text = None
            st.markdown("### 🤖 AI Recommendation (Gemini)")
            if gemini_api_key:
                with st.spinner("Consulting AI Assistant..."):
                    recommendation_text = get_gemini_recommendation(
                        gemini_api_key, 
                        result_text, 
                        {
                            "Clump Thickness": clump_thickness,
                            "Cell Size": uniformity_cell_size,
                            "Cell Shape": uniformity_cell_shape,
                            "Marginal Adhesion": marginal_adhesion,
                            "Epithelial Size": single_epithelial_size,
                            "Bland Chromatin": bland_chromatin,
                            "Normal Nucleoli": normal_nucleoli,
                            "Mitoses": mitoses
                        }
                    )
                    st.info(recommendation_text)
            else:
                 st.warning("Enter a Gemini API Key in the sidebar or .env file to get treatment recommendations.")

            # 5. Report Generation
            st.markdown("### 📄 Reporting")
            pdf_bytes = create_download_link(input_list, result_text, recommendation_text)
            st.download_button(
                label="Download Medical Report (PDF)",
                data=pdf_bytes,
                file_name="medical_report.pdf",
                mime="application/pdf"
            )

    # 6. Feedback Loop
    if st.session_state.prediction_made:
        with st.expander("🛠️ Maintenance: Report Incorrect Prediction"):
            st.write("Help us improve the model. If this diagnosis seems wrong based on clinical evidence, flag it here.")
            with st.form(key='feedback_form'):
                actual_dx = st.selectbox("Actual Diagnosis", ["Benign", "Malignant"])
                comments = st.text_area("Clinical Notes")
                submit_feedback = st.form_submit_button("Submit Feedback")
                
                if submit_feedback:
                    log_feedback(
                        st.session_state.last_inputs,
                        st.session_state.last_prediction,
                        actual_dx,
                        comments
                    )
                    st.success("Thank you! Data logged for next training cycle.")

if __name__ == '__main__':
    main()