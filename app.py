from __future__ import division, print_function
# coding=utf-8
import sys
import os
import glob

# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.applications.vgg16 import VGG16
from sklearn.decomposition import PCA
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model

# Others
import cv2
import matplotlib.pyplot as plt
from sklearn import preprocessing
import numpy as np

# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer


# Define a flask app
app = Flask(__name__)

# Model saved with Keras model.save()

SIZE = 100
VGG_model = VGG16(weights='imagenet', include_top=False, input_shape=(SIZE, SIZE, 3))
loaded_model = tf.keras.models.load_model('Model/model_weigths.h5')
with open('Model/pcaIT', 'rb') as f:
    pca= pickle.load(f)
with open('Model/leIT', 'rb') as l:
    le = pickle.load(l)


print('Model loaded. Check http://127.0.0.1:5000/')


def model_predict(path):
    img_path = path
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)       
    img = cv2.resize(img, (SIZE, SIZE))
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img = img / 255.0

    input_img = np.expand_dims(img, axis=0)
    #Expand dims so the input is (num images, x, y, c)
    input_img_feature=VGG_model.predict(input_img)
    input_img_features=input_img_feature.reshape(input_img_feature.shape[0], -1)
    input_img_PCA = pca.transform(input_img_features)

    prediction_img = loaded_model.predict(input_img_PCA)
    prediction_img = np.argmax(prediction_img, axis=1)
    prediction_img = le.inverse_transform(prediction_img) 
    #Reverse the label encoder to original name
    print("The prediction for this image is: ", prediction_img)
    label = prediction_img[0]
    return label



@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        preds = model_predict(file_path)

        result = str(preds) 
        return result
    return None



if __name__ == '__main__':
    app.run(debug=True)