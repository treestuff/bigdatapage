# -*- coding: utf-8 -*-

import pandas as pd


from flask import Flask
from flask import render_template
import json


data_path = './input/'
n_samples = 100

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def get_data():
    df_clean = pd.read_csv(data_path + 'deadTrees.csv')
    return df_clean.to_json(orient='records')


if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(host='0.0.0.0',port=5000,debug=True)