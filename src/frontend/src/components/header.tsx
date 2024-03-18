import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
    return (
        <header class="py-8 w-full flex justify-center text-center">
        {/* <h1 class="text-4xl font-bold text-alanturing-800">Alan Turing Bank</h1> */}
        <img class="h-20 w-58  text-center" src="/img/logo.svg" alt="" />
        {/* <h2 class="text-3xl text-alanturing-400">Gestión de usuarios</h2> */}
        </header>
    )
});