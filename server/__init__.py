import os
from flask import Flask, render_template, request, redirect, url_for,flash, session, escape, jsonify
from flask_mysqldb import MySQL
import json
from werkzeug.utils import secure_filename
app = Flask(__name__,template_folder='templates')
from db import db

app.secret_key = 'SecretKey'

UPLOAD_FOLDER = 'static/images/profile'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_PATH'] = '10024'


from flask_mysqldb import MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'flask'
mysql = MySQL(app)


@app.route('/')
def index():
   return render_template('index.html')

@app.route('/admin')
def admin():
   data = {'page':'Dashboard','user':session['user']}
   return render_template('admin.html',data=data)

# ? -------------------------------- Clients --------------------------------
@app.route('/admin/clientes')
def admin_clientes():
   data = {'page':'Clients','user':session['user']}
   return render_template('clientes.html',data=data)

@app.route('/api/admin/clientes')
def admin_clientes_api_node():
   return redirect('http://localhost:1003/api/clients/get')

@app.route('/admin/clientes/add',methods=['GET', 'POST'])
def admin_clientes_add():
   if request.method == "POST":
      details = request.form
      if db.addClient(mysql,details['foto'], details['name'], details['email'], details['phone']):
         data = {'page':'Clients','user':session['user']}
         return render_template('clientes.html',data=data)
      else:
         data = {'page':'Clients','user':session['user'],'err':'Database error'}
         return render_template('clientes.html',data=data)

@app.route('/admin/clientes/delete',methods=['GET', 'POST'])
def admin_clientes_delete():
   if request.method == "POST":
      id = request.get_json()
      if db.deleteClient(mysql,id['id']):
         data = {'res':"deleted",'status':201}
         return jsonify(data)
      else:
         data = {'res':"not_deleted",'status':403}
         return jsonify(data)

@app.route('/admin/clientes/update',methods=['GET', 'POST'])
def admin_clientes_update():
   if request.method == "POST":
      data = request.get_json()
      if db.updateClient(mysql,data['name'],data['email'],data['id']):
         return "updated"
      else:
         return "not_updated"

# ? -------------------------------- Employees --------------------------------
@app.route('/admin/empleados')
def admin_empleados():
   data = {'page':'Employees','user':session['user']}
   return render_template('empleados.html',data=data)

# ? -------------------------------- Cars --------------------------------
@app.route('/admin/carros')
def admin_carros():
   data = {'page':'Cars','user':session['user']}
   return render_template('carros.html',data=data)

@app.route('/api/admin/carros')
def admin_cars_api_node():
   return redirect('http://localhost:1003/api/carros/get')

@app.route('/admin/cars/add',methods=['GET', 'POST'])
def admin_cars_add():
   if request.method == "POST":
      details = request.form
      if db.addCar(mysql,details['brand'], details['model'], details['year']):
         data = {'page':'Cars','user':session['user']}
         return redirect(url_for('admin_carros'))
      else:
         data = {'page':'Cars','user':session['user'],'err':'Database error'}
         return redirect(url_for('admin_carros'))
      
@app.route('/admin/car/update',methods=['GET', 'POST'])
def admin_car_update():
   if request.method == "POST":
      data = request.get_json()
      if db.updateCar(mysql,data['id'],data['brand'],data['model'],data['year']):
         return "updated"
      else:
         return "not_updated"

# ? -------------------------------- Oil Change --------------------------------
@app.route('/admin/cambiosAceite')
def admin_cambiosAceite():
   data = {'page':'Oil Change','user':session['user']}
   return render_template('cambiosAceite.html',data=data)


@app.route('/login', methods=['GET', 'POST'])
def loginAlt():
    if request.method == "POST":
        details = request.form
        data = db.login(mysql, details['usuario'], details['clave'])
        if(data.rol == 2):
            session['user'] = data.get()
            return redirect(url_for('admin'))
        else:
            return render_template('profile.html',data=data)
    
@app.route('/logout')
def logout():
   # remove the username from the session if it is there
   session.pop('user', None)
   return redirect(url_for('index'))


# ! ----------------------------------------------------------------

def allowed_file(filename):
   return '.' in filename and \
      filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug = True)