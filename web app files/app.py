import os
import json
import csv
from flask import Flask, render_template, send_from_directory, request, make_response, jsonify, session, abort, send_file, safe_join, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from flask_marshmallow import Marshmallow




#------------------------------------------------------------------------------------------
# Set name of file to be run by Flask (app.py will be run when promting 'flask run')
app = Flask(__name__)
#------------------------------------------------------------------------------------------



#CHANGE THIS TO SOMETHING MORE SECURE : NEEDED FOR SESSION VARIABLE
app.secret_key = 'hello'
#------------------------------------------------------------------------------------------


#change to ENC = 'prod' when going into development
ENV = 'dev'

if ENV == 'prod':
    app.debug = True
    #check port number for postgress it may not be set up to local host
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/testdb'
else:
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://wyduigvztzxvqb:42299ddff2f938f9403eba7da60537a248003c984530af3a2e9563ba689bb65c@ec2-44-198-126-181.compute-1.amazonaws.com:5432/d822ifjuiotc3n'

    

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

#------------------------------------------------------------------------------------------
ma = Marshmallow(app)
#------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------
####################################### MODELS ############################################
#------------------------------------------------------------------------------------------

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key = True)
    filename = db.Column(db.String(100))
    url = db.Column(db.String(100))
    toRemove = db.Column(db.Boolean)
    #data = db.Column(db.JSON) 
            
    def __init__(self,filename,url,toRemove):
        self.filename = filename
        self.url = url
        self.toRemove = toRemove
        #self.data = data


#------------------------------------------------------------------------------------------
####################################### SCHEMA ############################################
#------------------------------------------------------------------------------------------

#Product Schema
class ProductSchema(ma.Schema):
    class Meta:
        fields = ('id', 'filename', 'url', 'toRemove')


#init schema
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

#------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------
##################################### ROUTES ##############################################
#------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------
# Calls to render "index.html" at the stat of webpage loading at web path: "/"

@app.route("/")
def index():
    image_names = os.listdir('./static/images')
    
   
    
    # Removes the .DS_Store file from out list , which is created in folder by the os whenever we make or edit a folder
    if '.DS_Store' in image_names :
        image_names.remove('.DS_Store')
    


    containsF = Image.query.filter_by(toRemove=False).first()
    containsT = Image.query.filter_by(toRemove=True).first()
    
    emptyDb = containsF is None == containsT is None

    if emptyDb :
        for file in image_names:
            a = Image(filename= file, url= f'static/images/{file}', toRemove = False)   
            db.session.add(a)
            db.session.commit()


    # Render the index.html file 
    return render_template("index.html")
#------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------
#sends api info on db values for Image
@app.route("/get_imgobj")
def get_imgobj():
  
    all_images = Image.query.all()
    result = products_schema.dump(all_images)
    objectApi = jsonify(result)
    return objectApi
#------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------
#updates db model values from selection values fetched from the client side as a PUT request
@app.route("/input", methods=["PUT"])
def input():

    req = request.get_json()

    print(req)
    session['jobject'] = req
    with open('static/client/files/imageObject.json', 'w', encoding='utf-8') as output:
        json.dump(req, output, ensure_ascii=False, indent=4)

    # grab all objects in Image model and use a for loop to update each objects values coming from the client side
    #######################    
    images = Image.query.all()
    
    #######################    
    counter = 0
    ##########################
    for image in images: 
        
        #set fetched data from client to python variables
 
        id = req[counter]['id']
        file_name = req[counter]['filename']
        url_path = req[counter]['url']
        toRemove_bool = req[counter]['toRemove']

        #set 'update' to filter object by id, because ID of model starts as 1, use id = counter+1 for correct object
        update = Image.query.filter_by(id = counter+1).first()
        
        #update all values in object and then commit
        update.filename = file_name
        db.session.commit()

        update.url = url_path
        db.session.commit()

        update.toRemove = toRemove_bool
        db.session.commit()
    #######################    
        counter += 1
    #######################    


    res = make_response(jsonify({"message": "OK"}), 200)
    #res = make_response(jsonify(req), 200)
    
    return res

#------------------------------------------------------------------------------------------

#------------------------------------------------------------------------------------------
@app.route("/cloudatlas-json-file/")
def cloudatlas_json_file():

    try:
        return send_from_directory(
            "static/client/files", mimetype='application/json', filename = 'imageObject.json', as_attachment = True, cache_timeout=0
        )
    except FileNotFoundError:
        abort(404)

#------------------------------------------------------------------------------------------

#------------------------------------------------------------------------------------------
@app.route("/cloudatlas-csv-file/")
def cloudatlas_csv_file():
    
    #open json file and use to write csv file and then downloads file 
    infile = open('static/client/files/imageObject.json', 'r')
    outfile = open('static/client/files/object.csv', 'w')

    writer = csv.writer(outfile)

    count = 0

    for obj in json.loads(infile.read()):
        
        if count == 0:

                header = obj.keys()

                writer.writerow(header)

                count += 1

        writer.writerow(obj.values())
    


    try:
        return send_from_directory(
            "static/client/files", mimetype='text/csv' , filename = 'object.csv', as_attachment = True, cache_timeout=0
        )
    except FileNotFoundError:
        abort(404)

#------------------------------------------------------------------------------------------

#------------------------------------------------------------------------------------------
@app.route('/csv')
def get_csv():

    infile = open('static/client/files/imageObject.json', 'r')
    outfile = open('static/client/files/object.csv', 'w')

    writer = csv.writer(outfile)

    count = 0

    for obj in json.loads(infile.read()):
        
        if count == 0:

                header = obj.keys()

                writer.writerow(header)

                count += 1

        writer.writerow(obj.values())

    return 'done'

#------------------------------------------------------------------------------------------

#------------------------------------------------------------------------------------------
if __name__ == "__main__":
    db.create_all()
# Debug= True allows the flask server to update on refresh, no need to rerun the app everytime we make changes.
    app.run()
#------------------------------------------------------------------------------------------
