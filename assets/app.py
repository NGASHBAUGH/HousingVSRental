from bs4 import BeautifulSoup
from splinter import Browser
import requests
import pandas as pd
import os 
import numpy as np
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session
from flask import Flask

engine = create_engine('postgresql://scott:tiger@localhost/mydatabase')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)


session = Session(engine)

app = Flask(__name__)







if __name__ == '__main__':
    app.run()