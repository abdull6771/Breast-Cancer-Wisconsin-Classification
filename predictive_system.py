# -*- coding: utf-8 -*-
"""
Created on Sun May 22 09:33:55 2022

@author: USER
"""

import numpy as np
import pickle



#loading the saved model
loaded_model = pickle.load(open('C:/Users/USER\Desktop/deploy/trained_model.sav','rb'))

features =np.array([[1,1,1,1,2,1,1,1]])

features = features.astype(int)

pre = loaded_model.predict(features)

print(f"The Cancer class of this Features is {pre}.")