<script>
  export let h = 0;

  $: z = Math.floor((h / 360) * 100);

  $: thumbStyle = `left: ${z}%; bottom: 50%;`;

  const wellStyle = `
    touch-action: none;
    background: linear-gradient(to right,
      hsl(0, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(360, 100%, 50%)
    );
  `;
</script>

<div
  class="relative flex-none mt-3 w-32 h-8 border-2 border-gray-100"
  style={wellStyle}>
  <span
    class="block absolute w-6 h-6 -mb-3 -ml-3 border border-gray-200 rounded-full bg-gray-100 shadow-lg"
    style={thumbStyle} />
</div>
