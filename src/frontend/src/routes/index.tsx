import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { GamesList } from "~/components/juegos-list";

export default component$(() => {
  return (
    <GamesList/>
  );
});

export const head: DocumentHead = {
  title: "GameZone",
  meta: [
    {
      name: "description",
      content: "Gestión de videojuegos de GameZone",
    },
  ],
};