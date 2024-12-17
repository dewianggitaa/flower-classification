import os
from flask import Flask, request, jsonify
from tensorflow.keras.layers import RandomFlip
from tensorflow.keras.models import load_model
import tensorflow as tf
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = load_model(
    'Flower_Recog_Model.h5',
    custom_objects={"RandomFlip": RandomFlip}
)

flower_names = ['daisy', 'dandelion', 'rose', 'sunflower', 'tulip']

def classify_images(image_path):
    input_image = tf.keras.utils.load_img(image_path, target_size=(180, 180))
    input_image_array = tf.keras.utils.img_to_array(input_image)
    input_image_exp_dim = tf.expand_dims(input_image_array, 0)

    predictions = model.predict(input_image_exp_dim)
    result = tf.nn.softmax(predictions[0])
    outcome = {
        "flower": flower_names[np.argmax(result)],
        "score": float(np.max(result) * 100)
    }
    return outcome

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file:
        file_path = os.path.join('upload', file.filename)
        file.save(file_path)

        # Predict using the model
        result = classify_images(file_path)
        os.remove(file_path)  # Hapus file setelah digunakan
        return jsonify(result)
    return jsonify({"error": "File upload failed"}), 400

if __name__ == '__main__':
    app.run(debug=True)
