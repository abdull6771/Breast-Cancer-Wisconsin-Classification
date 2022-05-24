# -*- coding: utf-8 -*-
"""
Created on Sun May 22 09:40:18 2022

@author: USER
"""

import numpy as np
import pickle
import streamlit as st


#loading the saved model
file = open('C:/Users/USER\Desktop/deploy/trained_model.sav','rb') 
loaded_model = pickle.load(file) 
file.close()
 #creating fuction prediction
def cancer_prediction(input_data):
     input_data_array = np.asarray(input_data)
     input_data_array_reshaped = input_data_array.reshape(1,-1)
     prediction = loaded_model.predict(input_data_array_reshaped)
     if (prediction[0]==2): 
        return "The Person has benign" 
     return "The Person has malignant"
  
def main():
    st.title("BREAST CANCER PREDICTION WEB APP")
    html_temp = """
    <div style ="background-color:tomato;padding:10px">
    <h2 style="color:white;text-align:center;">Streamlit Breast Cancer Machile Learnig App</h2>
    """
    st.markdown(html_temp,unsafe_allow_html=True)
    st.write("We need some information from you")
    Clump_Thickness=st.text_input("Clump_Thickness")
    Uniformity_of_Cell_Size=st.text_input(" Uniformity_of_Cell_Size")
    Uniformity_of_Cell_Shape = st.text_input("Uniformity_of_Cell_Shape")
    Marginal_Adhesion= st.text_input("Marginal_Adhesion")
    Single_Epithelial_Cell_Size=st.text_input(" Single_Epithelial_Cell_Size")
    Bland_Chromatin=st.text_input("Bland_Chromatin")
    Normal_Nucleoli=st.text_input("Normal_Nucleoli")
    Mitoses=st.text_input("Mitoses")

    
    diagnosis= " "
    
    #Creating
    if st.button("Disease Type"):
        diagnosis = cancer_prediction([Clump_Thickness,Uniformity_of_Cell_Size,Uniformity_of_Cell_Shape,Marginal_Adhesion,Single_Epithelial_Cell_Size,
                    Bland_Chromatin,Normal_Nucleoli,Mitoses])
    st.success(diagnosis)
    if st.button("About"):
        st.text("Created By Abdullahi Ahmad Babura")
        st.text("Reach me through +2348067718392")
        st.text("@abdull6771/twiter")
        st.text("Abdull6771@Github")
if __name__ == '__main__':
    main()