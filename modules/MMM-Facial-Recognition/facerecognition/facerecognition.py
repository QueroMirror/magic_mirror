#!/usr/bin/python
# coding: utf8
"""MMM-Facial-Recognition - MagicMirror Module
Face Recognition Script
The MIT License (MIT)

Copyright (c) 2016 Paul-Vincent Roll (MIT License)
Based on work by Tony DiCola (Copyright 2013) (MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""

import sys
import json
import time
import face
import cv2
import config
import signal
import os

def to_node(type, message):
    # convert to json and print (node helper will read from stdout)
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    # stdout has to be flushed manually to prevent delays in the node helper communication
    sys.stdout.flush()


to_node("status", "Facerecognition started...")

user_change_count = 0
pre_found_face = -1
face_identified_count = 0
face_not_identified_count = 0
face_not_found_count = 0
face_found_count = 0
# Setup variables
current_user = None
last_match = None
detection_active = True
login_timestamp = time.time()
same_user_detected_in_row = 0

# Load training data into model
to_node("status", 'Loading training data...')

# set algorithm to be used based on setting in config.js
if config.get("recognitionAlgorithm") == 1:
    to_node("status", "ALGORITHM: LBPH")
    model = cv2.createLBPHFaceRecognizer(threshold=config.get("lbphThreshold"))
elif config.get("recognitionAlgorithm") == 2:
    to_node("status", "ALGORITHM: Fisher")
    model = cv2.createFisherFaceRecognizer(threshold=config.get("fisherThreshold"))
else:
    to_node("status", "ALGORITHM: Eigen")
    model = cv2.createEigenFaceRecognizer(threshold=config.get("eigenThreshold"))

# Load training file specified in config.js
# it is possible to reload model?
    # how to handle that?
model.load(config.get("trainingFile"))
to_node("status", 'Training data loaded!')

to_node("status", '$$$$ GET CAMERA $$$')

# get camera
camera = config.get_camera()

to_node("status", '$$$$ CAMERA GOT $$$ PID: ' + str(os.getpid()))

pid_file = open("./face.pid", 'w')
pid_file.write(str(os.getpid()))
pid_file.close()

def reload_model(self, signum):
    to_node("status", 'reload_model')
    model.load(config.get("trainingFile"))

def shutdown(self, signum):
    to_node("status", 'Shutdown: Cleaning up camera...')
    camera.stop()
    quit()

signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGUSR1, reload_model)

to_node('add_user', { "user_name": 'Jao' })

# sleep for a second to let the camera warm up
time.sleep(1)

# Main Loop
while True:
    # Sleep for x seconds specified in module config
    time.sleep(config.get("interval"))
    # if detecion is true, will be used to disable detection if you use a PIR sensor and no motion is detected
    if detection_active is True:
        # Get image
        to_node("status", "CAMERA CAPTURE")

        image = camera.read()
        # Convert image to grayscale.
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        # Get coordinates of single face in captured image.
        result = face.detect_single(image)
        # to_node("status", "result data: ")        
        # to_node("status", result)
        # No face found, logout user?
        if result is None:
            pre_found_face = -1
            face_identified_count = 0
            face_not_identified_count = 0
            face_found_count = 0
            face_not_found_count = face_not_found_count + 1
            to_node("status", "NOT_FOUND: " + str(face_not_found_count) + " current_user: " + str(current_user)) 
            # 1 amostragem por segundo, 5 amostragens sem achar ninguem, desloga
            if (current_user is not None and face_not_found_count > 4):
            # if last detection exceeds timeout and there is someone logged in -> logout!
            # if (current_user is not None and time.time() - login_timestamp > config.get("logoutDelay")):
                # callback logout to node helper
                to_node("logout", {"user": current_user})
                same_user_detected_in_row = 0
                current_user = None
            continue
        # Set x,y coordinates, height and width from face detection result
        to_node("status", "FOUND: " + str(face_found_count) + " current_user: " + str(current_user))
        face_not_found_count = 0
        face_found_count = face_found_count + 1
        x, y, w, h = result
        # to_node("status", "result x: " + str(x) + " y: " + str(y) + " w: " + str(w) + " h: " + str(h))
        # Crop image on face. If algorithm is not LBPH also resize because in all other algorithms image resolution has to be the same as training image resolution.
        if config.get("recognitionAlgorithm") == 1:
            crop = face.crop(image, x, y, w, h)
        else:
            crop = face.resize(face.crop(image, x, y, w, h))
        # Test face against model.
        label, confidence = model.predict(crop)
        # to_node("status", "result label: " + str(label) + " confidence: " + str(confidence))
        # We have a match if the label is not "-1" which equals unknown because of exceeded threshold and is not "0" which are negtive training images (see training folder).
        if (label != -1 and label != 0):
            face_not_identified_count = 0
            face_identified_count = face_identified_count + 1
            # LOGICA RUIM! NAO IDENTIFICA DIREITO!
            # identificou, ja tinha login setado?
            if (current_user is None or current_user == 0):
                # pode mandar login ja?
                    # e se o current eh strange? 0 

                if face_identified_count > 1:
                    if pre_found_face == label:    
                        to_node("status", "pre_found_face: " + str(pre_found_face) + " label: " + str(label))
                        to_node("login", {"user": label, "confidence": str(confidence)})
                        current_user = label
            else:
                # eh o mesmo usuario?
                if current_user != label:
                    to_node("status", "troca de user user_change_count: " + str(user_change_count) + " label: " + str(label) + " current_user: " + str(current_user))
                    if user_change_count == 0:
                        user_change_count = 1
                    else:
                        if pre_found_face == label:
                            to_node("logout", {"user": current_user})
                            to_node("login", {"user": label, "confidence": str(confidence)})
                            current_user = label
            # # Set login time
            # login_timestamp = time.time()
            # # Routine to count how many times the same user is detected
            # if (label == last_match and same_user_detected_in_row < 2):
            #     # if same user as last time increment same_user_detected_in_row +1
            #     same_user_detected_in_row += 1
            # if label != last_match:
            #     # if the user is diffrent reset same_user_detected_in_row back to 0
            #     same_user_detected_in_row = 0
            # # A user only gets logged in if he is predicted twice in a row minimizing prediction errors.
            # if (label != current_user and same_user_detected_in_row > 1):
            #     current_user = label
            #     # Callback current user to node helper
            #     to_node("login", {"user": label, "confidence": str(confidence)})
            # # set last_match to current prediction
            # last_match = label
            pre_found_face = label
        # if label is -1 or 0, current_user is not already set to unknown and last prediction match was at least 5 seconds ago
        # (to prevent unknown detection of a known user if he moves for example and can't be detected correctly)
        else:
            face_identified_count = 0
            face_not_identified_count = face_not_identified_count + 1
            if current_user is None:
                if face_not_identified_count > 3:
                    current_user = 0
                    to_node("login", {"user": 0, "confidence": None})
            else:
                # ja tem usuario logado, esta em tempo de deslogar ele?
                if face_not_identified_count > 4:
                    if current_user != 0:
                        to_node("logout", {"user": current_user})
                        current_user = None
        # elif (current_user != 0 and time.time() - login_timestamp > 5):
        #     # Set login time
        #     login_timestamp = time.time()
        #     # set current_user to unknown
        #     current_user = 0
        #     # callback to node helper
        #     to_node("login", {"user": current_user, "confidence": None})
        