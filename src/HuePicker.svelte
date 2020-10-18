<script>
  import { createEventDispatcher } from "svelte";

  export let h = 0;

  $: x = Math.floor((h / 360) * width);
  let width = 0;
  let height = 0;

  $: thumbStyle = `transform: translate(${x}px, -2px)`;

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

  const dispatch = createEventDispatcher();
  let origin = { x: 0, left: 0 };

  function clamp(n, min = -Infinity, max = Infinity) {
    return Math.max(min, Math.min(n, max));
  }

  function dispatchChange(x) {
    const h = Math.floor((x / width) * 360);
    dispatch("huechange", { h });
  }

  function onPointerDown(event) {
    origin.x = event.clientX;
    origin.left = event.offsetX;
    dispatchChange(origin.left);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  }
  function onPointerMove(event) {
    const dx = event.clientX - origin.x;
    const cx = clamp(dx + origin.left, 0, width);
    dispatchChange(cx);
  }
  function onPointerUp() {
    window.removeEventListener("pointermove", onPointerMove);
  }
</script>

<div
  class="relative flex-none mt-3 w-32 h-6 border border-gray-300"
  style={wellStyle}
  bind:clientWidth={width}
  on:pointerdown={onPointerDown}>
  <span
    class="pointer-events-none block absolute w-6 h-6 -ml-3 bg-transparent rounded-full border-2 border-4 border-gray-200 shadow-md"
    style={thumbStyle} />
</div>
