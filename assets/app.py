from bs4 import BeautifulSoup
from splinter import Browser
from flask import Flask, jsonify, render_template, redirect, url_for, Response
import requests
import pandas as pd
import os 
import numpy as np
from sqlalchemy import create_engine
import json

app = Flask(__name__)

