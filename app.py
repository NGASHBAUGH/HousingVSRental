from bs4 import BeautifulSoup
from splinter import Browser
from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
import os 
import numpy as np
from sqlalchemy import create_engine

from sqlalchemy.orm import Session
import json

# engine = create_engine('postgresql://postgresql:admin22:12345@localhost5342/mydatabase')
# connection = engine.connect()

# session = Session(engine)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/buy")
def buy():
    "Hello World"






if __name__ == '__main__':
    app.run(debug=True)