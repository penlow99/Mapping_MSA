 
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
    db_data = db.Predicted_2024_ROC_rank_total
    # Convert entire collection to Pandas dataframe
    df = pd.DataFrame(list(db_data.find()))
    df.drop(columns=['_id'], inplace=True)
    html_table = df.to_html(header=True, table_id="table_data", index=False)
    return render_template('table.html', title="MSA Table", table=html_table)
#-----------------------------------------------------------------
@app.route('/map')
def map():
    return render_template('map.html', title="MSA Map")
#-----------------------------------------------------------------


# app import check
if __name__ == '__main__':
    app.run()              