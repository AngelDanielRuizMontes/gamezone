// Funciones de acceso a la API de usuarios.

import { Juego } from "~/models/juego"
import { addGenero } from "./generos-provider"
import { Genero } from "~/models/genero"

// Obtiene todos los juegos
export const getJuegos = async (): Promise<Juego[]>  => {
    try {
        const response = await fetch('http://localhost:8000/juegos/')
        const juegos = response.json()
        return juegos
    } catch (error) {
        console.error(error)
    }

    return <Juego[]><unknown>null
}

// Obtiene los juegos de los ultimos 2 años
export const getRecientes = async (): Promise<Juego[]>  => {
    try {
        const response = await fetch('http://localhost:8000/juegos/recientes/')
        const recientes = response.json()
        return recientes
    } catch (error) {
        console.error(error)
    }

    return <Juego[]><unknown>null
}

// Obtiene los juegos con mas de 10 años
export const getClasicos = async (): Promise<Juego[]>  => {
    try {
        const response = await fetch('http://localhost:8000/juegos/clasicos/')
        const clasicos = response.json()
        return clasicos
    } catch (error) {
        console.error(error)
    }

    return <Juego[]><unknown>null
}

// Añade un juego.
export const addJuego = async (juego: Juego)  => {
    try {
        await fetch('http://localhost:8000/juegos/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(juego),
        })
        await addGenero(<Genero>{genero: juego.genero})
    } catch (error) {
        console.error(error)
    }
    
}

// Modifica un juego.
export const updateJuego = async (identificador: string, juego: Juego)  => {
    try {
        await fetch(`http://localhost:8000/juegos/${identificador}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(juego),
        })
        
    } catch (error) {
        console.error(error)
    }
}

// Elimina un juego.
export const deleteJuegoByIdentificador = async (identificador: string)  => {
    try {
        await fetch(`http://localhost:8000/juegos/${identificador}`,
        {
            method: 'DELETE'
        })
        
    } catch (error) {
        console.error(error)
    }
}