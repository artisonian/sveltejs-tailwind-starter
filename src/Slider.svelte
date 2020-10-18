<script>
  let className = "";

  export { className as class };
  export let value;
  export let label;
  export let min = 0;
  export let max = 100;
  export let adorn = "";

  $: adornment = typeof adorn === "function" ? adorn(value) : adorn;
</script>

<div class="{className} flex items-center">
  <label
    class="flex items-center text-xs uppercase tracking-wide text-gray-600 font-bold">{label}
    <input type="range" {min} {max} class="ml-3 flex-auto" {value} on:input />
  </label>
  <div
    class="ml-4 px-2 py-1 flex items-baseline rounded bg-gray-100 shadow-inner focus-within:shadow-outline">
    <input
      type="number"
      {min}
      {max}
      {value}
      class="flex-auto appearance-none bg-transparent outline-none text-right"
      on:input />
    <span class="ml-1 w-4 font-mono text-sm text-gray-600">{adornment}</span>
  </div>
</div>
