
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

class Cliente:
    def __init__(self, id, foto, nombre, correo): 
        self.id = id 
        self.foto = foto 
        self.nombre = nombre 
        self.correo = correo

    def get(self):
        return {
            'id':self.id,
            'nombre':self.nombre,
            'foto':self.foto,
            'nombre':self.nombre,
            'correo':self.correo
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

def getClientes(mysql):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM cliente")
    data = cur.fetchall()
    cur.close()
    cliente = []
    for i in data:
        a = Cliente(i[0],i[1],i[2],i[3])
        cliente.append(a.get())
    return cliente

def addClient(mysql,foto,name,email):
    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO cliente (foto,nombre,correo) VALUES(%s, %s, %s)", (foto,name,email))
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
    
        