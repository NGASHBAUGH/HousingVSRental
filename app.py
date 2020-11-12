from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
import json

engine = create_engine('postgresql://admin2:12345@localhost:5342/Project_2')
connection = engine.connect()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sql")  
def sql():
    C2018 = pd.read_sql('select * from census_2018', connection)
    return C2018.to_json()



if __name__ == '__main__':
    app.run(debug=True)