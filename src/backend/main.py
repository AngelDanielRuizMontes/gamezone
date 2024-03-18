from fastapi import FastAPI, HTTPException

# Para poder utilizar campos con fecha
from datetime import date, datetime

# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel

from typing import List

# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

# Para aceptar peticiones de diferentes dominios.
from fastapi.middleware.cors import CORSMiddleware


# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
class Juego(BaseModel):
    identificador: str
    titulo: str
    genero: str
    puntuacion: int
    fecha_salida: date
    precio: float

# Crea la instancia de la aplicación FastAPI
app = FastAPI()

# Lista de origenes permitidos.
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Método permitidos
    allow_headers=["*"], # Cabeceras permitidas
)

# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.gamesdb

# Endpoint para listar todos los juegos.
@app.get("/juegos/", response_description="Lista todos los juegos", response_model=List[Juego])
async def list_juegos():
    juegos = await db["juegos"].find().to_list(1000)
    return juegos

#Endpoint para crear un nuevo juego
@app.post("/juegos/", response_description="Añade un nuevo juego", response_model=Juego) 
async def create_juego(juego: Juego):
    juego_dict = juego.dict()
    juego_dict["fecha_salida"] = datetime.combine(juego.fecha_salida, datetime.min.time())
    await db["juegos"].insert_one(juego_dict)
    return juego

# Endpoint praa obtener un juego específico por identificador.
@app.get("/juegos/{identificador}", response_description="Obtiene un juego", response_model=Juego)
async def find_juego(identificador: str):
    juego = await db["juegos"].find_one({"identificador": identificador})
    if juego is not None:
        return juego
    raise HTTPException(status_code=404, detail=f"Juego con Identificador {identificador} no se ha encontrado.")

# Endpoint para borrar un juego especifico por identificador.
@app.delete("/juegos/{identificador}", response_description="Borra un usuario", status_code=204)
async def delete_juego(identificador: str):
    delete_result = await db["juegos"].delete_one({"identificador": identificador})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Usuario con identificador {identificador} no se ha encontrado.")

# Endpoint para actualizar un juego especifico por identificador.
@app.put("/juegos/{identificador}", response_description="Actualiza un usuario por el identificador", status_code=204)
async def update_juego(identificador: str, juego: Juego):
    juego_dict = juego.dict()
    juego_dict["fecha_salida"] = datetime.combine(juego.fecha_salida, datetime.min.time())
    await db["juegos"].update_one({"identificador": identificador}, {"$set": juego_dict})
    return juego

# Endpoint para listar todos los juegos de los 2 ultimos años.
@app.get("/juegos/recientes/", response_description="Lista todos los juegos estrenados los 2 ultimos años.", response_model=List[Juego])
async def list_recientes():
    now = datetime.now()

    pipeline = [
        {
            "$project": {
                "identificador": 1,
                "titulo": 1,
                "genero": 1,
                "puntuacion": 1,
                "fecha_salida": 1,
                "precio": 1,
                "antiguedad": {
                    "$divide": [
                    {"$subtract": [now, "$fecha_salida"]},
                    365 * 24 * 60 * 60 * 1000
                    ]
                }
            }
        },
        {
            "$match": {
                "antiguedad": {"$lt": 3}
            }
        }
    ]

    recientes = await db["juegos"].aggregate(pipeline).to_list(1000)
    return recientes

# Endpoint para listar todos los juegos clasicos (mas de 10 años).
@app.get("/juegos/clasicos/", response_description="Lista todos los mayores de edad.", response_model=List[Juego])
async def list_clasicos():
    now = datetime.now()

    pipeline = [
        {
            "$project": {
                "identificador": 1,
                "titulo": 1,
                "genero": 1,
                "puntuacion": 1,
                "fecha_salida": 1,
                "precio": 1,
                "antiguedad": {
                    "$divide": [
                    {"$subtract": [now, "$fecha_salida"]},
                    365 * 24 * 60 * 60 * 1000
                    ]
                }
            }
        },
        {
            "$match": {
                "antiguedad": {"$gte": 10}
            }
        }
    ]

    clasicos = await db["juegos"].aggregate(pipeline).to_list(1000)
    return clasicos

class Genero(BaseModel):
    genero: str


# Endpoint para listar todos los generos.
@app.get("/generos/", response_description="Lista todos los generos", response_model=List[Genero])
async def list_generos():
    generos = await db["generos"].find().to_list(1000)
    return generos

# Endpoint para agregar genero.
@app.post("/generos/", response_description="Añade un nuevo genero", response_model=Genero) 
async def create_genero(genero: Genero):
    consulta = await db["generos"].find_one({"genero": genero.genero})
    if consulta is None:
        genero_dict = genero.dict()
        await db["generos"].insert_one(genero_dict)
    return genero