<script>
  let [h, s, l] = [34, 100, 50];
  let [r, g, b] = [255, 153, 0];

  $: hsl = `hsl(${h}, ${s}%, ${l}%)`;
  $: rgb = `rgb(${r}, ${g}, ${b})`;

  let mode = "rgb";
  function switchMode() {
    mode = mode === "rgb" ? "hsl" : "rgb";
  }
</script>

<style global>
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */
  @tailwind utilities;
</style>

<svelte:body class="antialiased text-gray-900 bg-gray-100" />

<main class="max-w-md mx-auto p-4">
  <header class="w-full px-5 py-3">
    <h1 class="text-gray-600 font-bold">Swatches</h1>
  </header>

  <div
    class="max-w-md mx-4 mx-auto mt-4 overflow-hidden bg-white rounded shadow-md">
    <div class="w-full h-64" style="background: {hsl}" />

    <div class="flex items-center p-4 border-t-2 border-gray-200">
      <div>
        <div
          x-data="app.satLightPicker()"
          x-init="init()"
          x-spread="well"
          class="relative flex-none w-32 h-32 border-2 border-gray-200">
          <span
            x-spread="thumb"
            class="block absolute w-6 h-6 -mb-3 -ml-3 bg-transparent rounded-full border border-4 border-gray-200 shadow-md" />
        </div>

        <div
          x-data="app.huePicker()"
          x-init="init()"
          x-spread="well"
          class="relative flex-none mt-3 w-32 h-8 border-2 border-gray-100">
          <span
            x-spread="thumb"
            class="block absolute w-6 h-6 -mb-3 -ml-3 border border-gray-200 rounded-full bg-gray-100 shadow-lg" />
        </div>
      </div>

      {#if mode === 'hsl'}
        <div class="ml-4 flex-auto">
          <div class="flex items-center">
            <label
              class="block text-xs uppercase tracking-wide text-gray-600 font-bold">H</label>
            <input
              type="range"
              min="0"
              max="360"
              class="ml-3 flex-auto"
              bind:value={h} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="360"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={h} />
              <span class="ml-1 w-4 font-mono text-sm text-gray-600">°</span>
            </div>
          </div>
          <div class="mt-2 flex items-center">
            <label
              class="block text-xs uppercase tracking-wide text-gray-600 font-bold">S</label>
            <input
              type="range"
              min="0"
              max="100"
              class="ml-3 flex-auto"
              bind:value={s} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="100"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={s} />
              <span class="ml-1 w-4 font-mono text-sm text-gray-600">%</span>
            </div>
          </div>
          <div class="mt-2 flex items-center">
            <label
              class="block text-sm uppercase tracking-wide text-gray-600 font-bold">L</label>
            <input
              type="range"
              min="0"
              max="100"
              class="ml-3 flex-auto"
              bind:value={l} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="100"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={l} />
              <span class="ml-1 w-4 font-mono text-sm text-gray-600">%</span>
            </div>
          </div>
        </div>
      {:else if mode === 'rgb'}
        <div class="ml-4 flex-auto">
          <div class="flex items-center">
            <label
              class="block text-xs uppercase tracking-wide text-gray-600 font-bold">R</label>
            <input
              type="range"
              min="0"
              max="255"
              list="hex-markers"
              class="ml-3 flex-auto"
              bind:value={r} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="255"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={r} />
              <span
                class="ml-1 w-4 font-mono text-sm text-gray-600">{r
                  .toString(16)
                  .padStart(2, '0')}</span>
            </div>
          </div>
          <div class="mt-2 flex items-center">
            <label
              class="block text-xs uppercase tracking-wide text-gray-600 font-bold">G</label>
            <input
              type="range"
              min="0"
              max="255"
              list="hex-markers"
              class="ml-3 flex-auto"
              bind:value={g} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="255"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={g} />
              <span
                class="ml-1 w-4 font-mono text-sm text-gray-600">{g
                  .toString(16)
                  .padStart(2, '0')}</span>
            </div>
          </div>
          <div class="mt-2 flex items-center">
            <label
              class="block text-xs uppercase tracking-wide text-gray-600 font-bold">B</label>
            <input
              type="range"
              min="0"
              max="255"
              list="hex-markers"
              class="ml-3 flex-auto"
              bind:value={b} />
            <div
              class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
              <input
                type="number"
                min="0"
                max="255"
                class="flex-auto appearance-none bg-transparent outline-none text-right"
                bind:value={b} />
              <span
                class="ml-1 w-4 font-mono text-sm text-gray-600">{b
                  .toString(16)
                  .padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="px-4 py-5 bg-gray-200 flex items-center justify-between">
      <div>
        <span
          class="block text-xs uppercase tracking-wide text-gray-600 font-bold">CSS</span>
        <span class="font-mono text-sm"> {mode === 'hsl' ? rgb : hsl} </span>
      </div>
      <button
        class="px-3 py-2 bg-gray-200 rounded-lg border-2 border-gray-400 font-bold text-sm text-gray-600 hover:bg-white"
        on:click={switchMode}>
        Switch Mode
      </button>
    </div>
  </div>
</main>
