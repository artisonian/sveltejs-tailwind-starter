<script>
  export let name;
</script>

<style global>
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */
  @tailwind utilities;
</style>

<main class="max-w-sm mx-auto p-4 antialiased text-center">
  <h1 class="text-6xl text-red-500 font-hairline uppercase">Hello {name}!</h1>
  <p class="mt-4">
    Visit the
    <a
      class="text-blue-500 hover:underline"
      href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
</main>
