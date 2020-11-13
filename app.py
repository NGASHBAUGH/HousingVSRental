from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
from sqlalchemy import create_engine
import json

engine = create_engine('postgresql://admin2:12345@localhost:5432/Project_2')
connection = engine.connect()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sql")  
def sql():
    C2018 = pd.read_sql('select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from census_2018', connection)
    return C2018.to_json() 

@app.route("/sqlsearch/<zipcode>")  
def sqlsearch(zipcode):
    C2018 = pd.read_sql(f'select zipcode, median_age, median_household_income, poverty_rate, lat, lng, city, state_id from census_2018 where zipcode={zipcode}', connection)
    return C2018.to_json() 


if __name__ == '__main__':
    app.run(debug=True)