// Funciones de acceso a la API de usuarios.

import { Genero } from "~/models/genero"

// Obtiene todos los generos
export const getGeneros = async (): Promise<Genero[]>  => {
    try {
        const response = await fetch('http://localhost:8000/generos/')
        const generos = response.json()
        return generos
    } catch (error) {
        console.error(error)
    }

    return <Genero[]><unknown>null
}

// Añade un genero si no existe.
export const addGenero = async (genero: Genero)  => {
    try {
        await fetch('http://localhost:8000/generos/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(genero),
        })
        console.log("EL genero insertado vale: ", genero)
    } catch (error) {
        console.error(error)
    }
}