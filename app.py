 
from flask import Flask, render_template, url_for, redirect
import os 
import pymongo
from pymongo import MongoClient
import pandas as pd

# Create instance of MongoClient
client = MongoClient()
# Connection URI
connStr = os.getenv('MONGO_CONN')
client = MongoClient(connStr)
# Select database
db = client['MSA']

############################
### Initialize flask app ###
############################
app = Flask(__name__)


##############
### ROUTES ###
##############
#-----------------------------------------------------------------
@app.route('/')
def go_home():
    return redirect('/index')
#-----------------------------------------------------------------
@app.route('/index')
def index():
    return render_template('index.html', title="MSA Prediction Model")
#-----------------------------------------------------------------
@app.route('/table')
def table():
    # Select the collection within the database
    gdp = db.GDP_raw
    # Convert entire collection to Pandas dataframe
    df_gdp = pd.DataFrame(list(gdp.find()))
    df_gdp.drop(columns=['_id'], inplace=True)
    html_table = df_gdp.to_html(header=True, table_id="table", index=False)
    return render_template('table.html', title="MSA Table")
#-----------------------------------------------------------------
@app.route('/map')
def map():
    return render_template('map.html', title="MSA Map")
#-----------------------------------------------------------------


# app import check
if __name__ == '__main__':
    app.run()              