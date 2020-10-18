<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let h = 0;
  export let s = 0;
  export let l = 0;

  $: x = (s / 100) * width;
  $: y = height - (l / 100) * height;
  let width = 0;
  let height = 0;

  $: thumbStyle = `transform: translate(${x}px,${y}px);`;

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

  const dispatch = createEventDispatcher();
  let origin = { x: 0, y: 0, left: 0, top: 0 };

  function clamp(n, min = -Infinity, max = Infinity) {
    return Math.max(min, Math.min(n, max));
  }

  function dispatchChange(x, y) {
    const s = Math.floor((x / width) * 100);
    const l = Math.floor((y / height) * 100);
    dispatch("satlightchange", { s, l });
  }

  function onPointerDown(event) {
    origin.x = event.clientX;
    origin.y = event.clientY;
    origin.left = event.offsetX;
    origin.top = event.offsetY;
    dispatchChange(origin.left, height - origin.top);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  }
  function onPointerMove(event) {
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    const cx = clamp(dx + origin.left, 0, width);
    const cy = clamp(height - (dy + origin.top), 0, height);
    dispatchChange(cx, cy);
  }
  function onPointerUp() {
    window.removeEventListener("pointermove", onPointerMove);
  }
</script>

<div
  class="relative flex-none w-32 h-32 border border-gray-300"
  style={wellStyle}
  bind:clientWidth={width}
  bind:clientHeight={height}
  on:pointerdown={onPointerDown}>
  <span
    class="pointer-events-none block absolute w-6 h-6 -ml-3 -mt-3 bg-transparent rounded-full border-2 border-4 border-gray-200 shadow-md"
    style={thumbStyle} />
</div>
