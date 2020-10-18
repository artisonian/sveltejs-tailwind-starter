<script>
  export let h = 0;
  export let s = 0;
  export let l = 0;

  $: thumbStyle = `left: ${s}%; bottom: ${l}%;`;

  $: wellStyle = `
    touch-action: none;
    background: linear-gradient(to bottom,
      hsl(${h}, 0%, 100%) 0%,
      hsla(${h}, 0%, 100%, 0) 50%,
      hsla(${h}, 0%, 0%, 0) 50%,
      hsl(${h}, 0%, 0%) 100%
    ), linear-gradient(to right,
      hsl(${h}, 0%, 50%) 0%,
      hsla(${h}, 0%, 50%, 0) 100%
    );
    background-color: hsl(${h}, 100%, 50%);
  `;
</script>

<div
  class="relative flex-none w-32 h-32 border-2 border-gray-200"
  style={wellStyle}>
  <span
    class="block absolute w-6 h-6 -mb-3 -ml-3 bg-transparent rounded-full border border-4 border-gray-200 shadow-md"
    style={thumbStyle} />
</div>
