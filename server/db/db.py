
# ! <-------------- Clases -------------->
# ? ----------- Clase usuario ------------
class Usuario: 
    def __init__(self, id, foto, nombre,usuario,correo,clave,rol): 
        self.id = id 
        self.foto = foto 
        self.nombre = nombre 
        self.usuario = usuario
        self.correo = correo
        self.clave = clave
        self.rol = rol

    def get(self):
        return {
            'id':self.id,
            'nombre':self.nombre,
            'foto':self.foto,
            'nombre':self.nombre,
            'usuario':self.usuario,
            'correo':self.correo,
            'clave':self.clave,
            'rol':self.rol,
            }

# ! <-------------- SQL Scripts -------------->

def login(mysql,usuario,clave):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuario WHERE usuario = %s AND clave = %s", (usuario, clave))
    data = cur.fetchall()
    cur.close()
    data = data[0]
    data = Usuario(data[0],data[1],data[2],data[3],data[4],data[5],data[6])
    return data

def addClient(mysql,foto,name,email,phone):
    try:
        sql = "INSERT INTO cliente (foto,nombre,correo,telefono) VALUES('{}', '{}', '{}', {})".format(foto,name,email,phone)
        cur = mysql.connection.cursor()
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return True
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return False
    return False

def updateClient(mysql,name,email,id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE cliente SET nombre = %s, correo = %s WHERE id = %s", (name,email,id))
        mysql.connection.commit()
        cur.close()
        return True
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return False
    return False

def deleteClient(mysql,id):
    try:
        cur = mysql.connection.cursor()
        sql = "DELETE FROM cliente WHERE id = {}".format(id)
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return True
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return False
    return False
    
def addCar(mysql,marca,modelo,year):
    try:
        sql = "INSERT INTO cars (marca,modelo,anio) VALUES('{}', '{}', '{}')".format(marca,modelo,year)
        cur = mysql.connection.cursor()
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return True
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return False
    return False
        
def updateCar(mysql,id,brand,model,year):
    try:
        sql = "UPDATE cars SET marca = '{}', modelo = '{}', anio = '{}' WHERE id = {}".format(brand, model, year, id)
        cur = mysql.connection.cursor()
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return True
    except Exception as e:
        print("Problem inserting into db: " + str(e))
        return False
    return False