<script>
  import HuePicker from "./HuePicker.svelte";
  import SatLightPicker from "./SatLightPicker.svelte";
  import Slider from "./Slider.svelte";
  import Tailwind from "./Tailwind.svelte";

  let [h, s, l] = [36, 100, 50];
  let [r, g, b] = [255, 153, 0];

  $: hsl = `hsl(${h}, ${s}%, ${l}%)`;
  $: rgb = `rgb(${r}, ${g}, ${b})`;

  let mode = "rgb";
  function switchMode() {
    mode = mode === "rgb" ? "hsl" : "rgb";
  }

  function setFromRgb(rgb) {
    r = +rgb.r;
    g = +rgb.g;
    b = +rgb.b;

    const unit = [r, g, b].map((n) => n / 255);
    const v = Math.max(...unit);
    const c = v - Math.min(...unit);

    let data = { l: v - c / 2 };

    if (c === 0) {
      data.h = 0;
    } else if (v === unit[0]) {
      data.h = 60 * (0 + (unit[1] - unit[2]) / c);
    } else if (v === unit[1]) {
      data.h = 60 * (2 + (unit[2] - unit[0]) / c);
    } else if (v === unit[2]) {
      data.h = 60 * (4 + (unit[0] - unit[1]) / c);
    }

    data.s = (v - data.l) / Math.min(data.l, 1 - data.l);
    if (Object.is(data.s, NaN)) {
      data.s = 0;
    }

    h = Math.floor(data.h < 0 ? 360 + data.h : data.h);
    s = Math.floor(data.s * 100);
    l = Math.floor(data.l * 100);
  }

  function setFromHsl(hsl) {
    h = +hsl.h;
    s = +hsl.s;
    l = +hsl.l;

    const unit = [h, s / 100, l / 100];

    const f = (n) => {
      const k = (n + unit[0] / 30) % 12;
      const a = unit[1] * Math.min(unit[2], 1 - unit[2]);
      return unit[2] - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };

    r = Math.floor(f(0) * 255);
    g = Math.floor(f(8) * 255);
    b = Math.floor(f(4) * 255);
  }
</script>

<Tailwind />

<main class="max-w-md mx-auto p-4">
  <header class="w-full px-5 py-3">
    <h1 class="text-gray-600 font-bold">Swatches</h1>
  </header>

  <div
    class="max-w-md mx-4 mx-auto mt-4 overflow-hidden bg-white rounded shadow-md">
    <div class="w-full h-64" style="background: {hsl}" />

    <div class="flex items-center p-4 border-t-2 border-gray-200">
      <div>
        <SatLightPicker
          {h}
          {s}
          {l}
          on:satlightchange={(e) => setFromHsl({
              h,
              s: e.detail.s,
              l: e.detail.l,
            })} />
        <HuePicker
          {h}
          on:huechange={(e) => setFromHsl({ h: e.detail.h, s, l })} />
      </div>

      {#if mode === 'hsl'}
        <div class="ml-4 flex-auto">
          <Slider
            label="H"
            max="360"
            value={h}
            adorn="°"
            on:input={(e) => setFromHsl({ h: e.target.value, s, l })} />
          <Slider
            class="mt-2"
            label="S"
            value={s}
            adorn="%"
            on:input={(e) => setFromHsl({ h, s: e.target.value, l })} />
          <Slider
            class="mt-2"
            label="L"
            value={l}
            adorn="%"
            on:input={(e) => setFromHsl({ h, s, l: e.target.value })} />
        </div>
      {:else if mode === 'rgb'}
        <div class="ml-4 flex-auto">
          <Slider
            label="R"
            max="255"
            value={r}
            adorn={(value) => value.toString(16).padStart(2, '0')}
            on:input={(e) => setFromRgb({ r: e.target.value, g, b })} />
          <Slider
            class="mt-2"
            label="G"
            max="255"
            value={g}
            adorn={(value) => value.toString(16).padStart(2, '0')}
            on:input={(e) => setFromRgb({ r, g: e.target.value, b })} />
          <Slider
            class="mt-2"
            label="B"
            max="255"
            value={b}
            adorn={(value) => value.toString(16).padStart(2, '0')}
            on:input={(e) => setFromRgb({ r, g, b: e.target.value })} />
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
