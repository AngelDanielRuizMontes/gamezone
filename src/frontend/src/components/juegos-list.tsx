import { component$, useStore, useTask$, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { Juego } from '~/models/juego';
import { Genero } from '~/models/genero';
import { addJuego, deleteJuegoByIdentificador, getClasicos, getRecientes, getJuegos, updateJuego } from '~/utils/juegos-provider';
import { getGeneros } from '~/utils/generos-provider';

export const GamesList = component$(() => {

    const store = useStore<{ juegos: Juego[], generos: Genero[]}>({
        juegos: [],
        generos: []
    })

    const form = useStore({
        identificador: '',
        titulo: '',
        genero: '',
        puntuacion: 0,
        fecha_salida: '',
        precio: 0,
    })

    const addOrModify = useSignal("Añadir")

    const oldIdentificador = useSignal("")

    const juegoByYear = useSignal("Todos")

    useTask$(async () =>{
        console.log("Desde useTask")
        
    })

    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.juegos = await getJuegos()
        store.generos = await getGeneros()
    })

    const handleSubmit = $(async (event) => {
        event.preventDefault() // Evita comportamiento por defecto
    if (addOrModify.value === 'Añadir') {
        await addJuego(form)
    } else {
        await updateJuego(oldIdentificador.value, form)
        addOrModify.value = "Añadir"
    }
        
    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })

    const copyForm = $((juego: Juego) => {
        form.identificador = juego.identificador
        form.titulo = juego.titulo
        form.genero = juego.genero
        form.puntuacion = juego.puntuacion
        form.fecha_salida = juego.fecha_salida
        form.precio = juego.precio
    })

    const cleanForm = $(() => {
        form.identificador = ""
        form.titulo = ""
        form.genero = ""
        form.puntuacion = 0
        form.fecha_salida = ""
        form.precio = 0
    })

    const deleteJuego = $(async (identificador: string) => {
        await deleteJuegoByIdentificador(identificador)
        store.juegos = await getJuegos()
    })

    return (
        <div class="flex justify-center">
        <div class="contenedor">
        <div>
            <table class="border-separate border-spacing-2 w-full">
                <thead>
                    <tr>
                        <th class="title">Identificador</th>
                        <th class="title">Título</th>
                        <th class="title">Género</th>
                        <th class="title">Puntuación</th>
                        <th class="title">Fecha Lanzamiento</th>
                        <th class="title">Precio</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    
                    {store.juegos.map((juego) => (
                    <tr key={juego.identificador}>
                        <td>{juego.identificador}</td>
                        <td>{juego.titulo}</td>
                        <td>{juego.genero}</td>
                        <td>{juego.puntuacion}</td>
                        <td>{juego.fecha_salida}</td>
                        <td>{juego.precio}<span class="ml-2">€</span></td>
                        <td>
                            <button 
                                class="bg-red-600"
                                onClick$={() => deleteJuego(juego.identificador)}>
                                <i class="fa-solid fa-trash"></i>
                                Borrar
                            </button>
                        </td>
                        <td>
                            <button 
                                class="bg-orange-600"
                                onClick$={() => {
                                addOrModify.value = 'Modificar'
                                oldIdentificador.value = juego.identificador
                                copyForm(juego)
                                }}>
                                <i class="fa-solid fa-pencil"></i>
                                Modificar
                            </button>
                        </td>
                    </tr>
                    ))}
                    <tr></tr>
                    </tbody>
                    </table>
                    <div>
                        <form onSubmit$={handleSubmit} class="ml-7">
                            
                                <input 
                                name='identificador' 
                                type="text" 
                                value={form.identificador} 
                                onInput$={handleInputChange} required/>
                            
                                <input 
                                name='titulo' 
                                type="text" 
                                value={form.titulo} 
                                onInput$={handleInputChange}/>
                            
                                <input
                                list = "generoList"
                                name='genero'
                                id='genero'
                                value={form.genero} 
                                onInput$={handleInputChange} autoComplete="off"/>
                                <datalist id="generoList">
                                {store.generos.map(genero => (
                                <option value={genero.genero}>{genero.genero}</option>
                                ))}
                                </datalist>
                            
                                <input 
                                name='puntuacion' 
                                type="number"
                                value={form.puntuacion} 
                                onInput$={handleInputChange}/>
                            
                                <input 
                                name='fecha_salida' 
                                type="date" 
                                value={form.fecha_salida} 
                                onInput$={handleInputChange}/>
                            
                                <input 
                                name='precio' 
                                type="number" 
                                value={form.precio} 
                                onInput$={handleInputChange} step="0.01"/>
                            
                                <button 
                                    class="bg-green-600"
                                    type='submit'>
                                        <i class="fa-solid fa-check"></i>
                                        Aceptar
                                </button>
                            
                                <span 
                                class="button bg-red-600 ml-2"
                                style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`}
                                onClick$={() => {addOrModify.value = "Añadir"; cleanForm();}}>
                                    <i class="fa-solid fa-xmark"></i>
                                    Cancelar
                                </span>
                            
                        </form>
                    </div>
                
        </div>

        <div class="flex justify-center mb-3">
        <button class={juegoByYear.value === 'Todos' ? 'button-filter-highlighted' : 'button-filter'}
        onClick$={async () => {juegoByYear.value = "Todos"; store.juegos = await getJuegos()}}>
            <div class="filter">
                <div><img src="/img/todos.png" alt="" /></div>
                <div class="pl-2">Todos</div>
            </div>
        </button>

        <button class={juegoByYear.value === 'Recientes' ? 'button-filter-highlighted' : 'button-filter'}
        onClick$={async () => {juegoByYear.value = "Recientes"; store.juegos = await getRecientes()}}>
            <div class="filter">
                <div><img src="/img/reciente.png" alt="" /></div>
                <div class="pl-2">Recientes</div>
            </div>
        </button>

        <button class={juegoByYear.value === 'Clasicos' ? 'button-filter-highlighted' : 'button-filter'}
        onClick$={async () => {juegoByYear.value = "Clasicos"; store.juegos = await getClasicos()}}>
            <div class="filter">
            <div><img src="/img/clasico.png" alt="" /></div>
            <div class="pl-2">Clasicos</div>
            </div>
        </button>
        </div>
        </div>
        </div>
    )
});