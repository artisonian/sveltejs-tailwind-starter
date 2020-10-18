import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;

const COLOR = {
  rgbToHsl(...rgb) {
    const [r, g, b] = rgb.map((n) => n / 255);
    const v = Math.max(r, g, b);
    const c = v - Math.min(r, g, b);
    const l = v - c / 2;

    let h;
    if (c === 0) {
      h = 0;
    } else if (v === r) {
      h = 60 * (0 + (g - b) / c);
    } else if (v === g) {
      h = 60 * (2 + (b - r) / c);
    } else if (v === b) {
      h = 60 * (4 + (r - g) / c);
    }

    let s = (v - l) / Math.min(l, 1 - l);
    if (Object.is(s, NaN)) {
      s = 0;
    }

    return [
      Math.floor(h < 0 ? 360 + h : h),
      Math.floor(s * 100),
      Math.floor(l * 100),
    ];
  },
  hslToRgb(...hsl) {
    const [h, s, l] = [hsl[0], hsl[1] / 100, hsl[2] / 100];

    const f = (n) => {
      const k = (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };

    return [f(0), f(8), f(4)].map((n) => Math.floor(n * 255));
  },
};

function createRgb(...rgb) {
  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
    toString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    },
    toHsl() {
      const hsl = COLOR.rgbToHsl(this.r, this.g, this.b);
      return createHsl(...hsl);
    },
  };
}

function createHsl(...hsl) {
  return {
    h: hsl[0],
    s: hsl[1],
    l: hsl[2],
    toString() {
      return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    },
    toRgb() {
      const rgb = COLOR.hslToRgb(this.h, this.s, this.l);
      return createRgb(...rgb);
    },
  };
}

const port = {};

port.application = function application({
  r = 0,
  g = 0,
  b = 0,
  mode = "hsl",
} = {}) {
  const rgb = createRgb(r, g, b);
  const hsl = rgb.toHsl();

  return {
    rgb,
    hsl,
    mode,

    init($dispatch) {
      for (const prop of ["rgb.r", "rgb.g", "rgb.b"]) {
        this.$watch(prop, () => {
          this.hsl = this.rgb.toHsl();
          $dispatch("color-change", { hsl: this.hsl, rgb: this.rgb });
        });
      }
      for (const prop of ["hsl.h", "hsl.s", "hsl.l"]) {
        this.$watch(prop, () => {
          this.rgb = this.hsl.toRgb();
          $dispatch("color-change", { hsl: this.hsl, rgb: this.rgb });
        });
      }
    },

    // handlers
    onToggleMode() {
      this.mode = this.mode === "hsl" ? "rgb" : "hsl";
    },
    onRequestProp($event) {
      if (this.hasOwnProperty($event.detail.key)) {
        $event.stopPropagation();
        $event.detail.value = this[$event.detail.key];
      }
    },
    onHueChange($event) {
      this.hsl.h = $event.detail.h;
    },
    onSaturationChange($event) {
      this.hsl.s = $event.detail.s;
    },
    onLightnessChange($event) {
      this.hsl.l = $event.detail.l;
    },

    // slots
    root: {
      ["@request-prop.window"]: "onRequestProp",
      ["@toggle-mode.window"]: "onToggleMode",
      ["@hue-change.window"]: "onHueChange",
      ["@saturation-change.window"]: "onSaturationChange",
      ["@lightness-change.window"]: "onLightnessChange",
    },
  };
};

port.satLightPicker = function satLightPicker() {
  return {
    dragging: false,
    bounds: {},
    hue: 0,
    xy: [0, 0], // saturation, lightness (inverted)

    hslToCoords(hsl) {
      return [hsl.s, hsl.l];
    },
    init() {
      const event = new CustomEvent("request-prop", {
        bubbles: true,
        detail: { key: "hsl" },
      });
      this.$el.dispatchEvent(event);
      if (!event.detail.value) return;
      this.hue = event.detail.value.h;
      this.xy = this.hslToCoords(event.detail.value);
    },

    // handlers
    get wellStyle() {
      return `
        touch-action: none;
        background: linear-gradient(to bottom,
          hsl(${this.hue}, 0%, 100%) 0%,
          hsla(${this.hue}, 0%, 100%, 0) 50%,
          hsla(${this.hue}, 0%, 0%, 0) 50%,
          hsl(${this.hue}, 0%, 0%) 100%
        ), linear-gradient(to right,
          hsl(${this.hue}, 0%, 50%) 0%,
          hsla(${this.hue}, 0%, 50%, 0) 100%
        );
        background-color: hsl(${this.hue}, 100%, 50%);
      `;
    },
    get thumbStyle() {
      return `left: ${this.xy[0]}%; bottom: ${this.xy[1]}%;`;
    },
    onColorChange($event) {
      if (this.dragging) return;
      this.hue = $event.detail.hsl.h;
      this.xy = this.hslToCoords($event.detail.hsl);
    },
    onPointerDown() {
      this.dragging = true;
      this.bounds = this.$el.getBoundingClientRect();
    },
    onPointerMove($event) {
      if (this.dragging) {
        let delta = [
          Math.max(
            0,
            Math.min($event.clientX - this.bounds.left, this.bounds.width)
          ),
          Math.max(
            0,
            Math.min($event.clientY - this.bounds.top, this.bounds.height)
          ),
        ];
        this.xy = [
          Math.round((delta[0] / this.bounds.width) * 100),
          100 - Math.round((delta[1] / this.bounds.height) * 100),
        ];
        this.$el.dispatchEvent(
          new CustomEvent("saturation-change", {
            bubbles: true,
            detail: {
              s: this.xy[0],
            },
          })
        );
        this.$el.dispatchEvent(
          new CustomEvent("lightness-change", {
            bubbles: true,
            detail: {
              l: this.xy[1],
            },
          })
        );
      }
    },
    onPointerUp() {
      this.dragging = false;
    },

    // slots
    well: {
      [":style"]: "wellStyle",
    },
    thumb: {
      [":style"]: "thumbStyle",
      ["@color-change.window"]: "onColorChange",
      ["@pointerdown.prevent"]: "onPointerDown",
      ["@pointermove.window.prevent"]: "onPointerMove",
      ["@pointerup.window.prevent"]: "onPointerUp",
    },
  };
};

port.huePicker = function huePicker() {
  return {
    dragging: false,
    bounds: {},
    z: 0,

    hueToPos(h) {
      return Math.floor((h / 360) * 100);
    },
    init() {
      const event = new CustomEvent("request-prop", {
        bubbles: true,
        detail: { key: "hsl" },
      });
      this.$el.dispatchEvent(event);
      if (!event.detail.value) return;
      this.z = this.hueToPos(event.detail.value.h);
    },

    // handlers
    get wellStyle() {
      return `
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
    },
    get thumbStyle() {
      return `left: ${this.z}%; bottom: 50%;`;
    },
    onColorChange($event) {
      if (this.dragging) return;
      this.z = this.hueToPos(event.detail.hsl.h);
    },
    onPointerDown() {
      this.dragging = true;
      this.bounds = this.$el.getBoundingClientRect();
    },
    onPointerMove($event) {
      if (this.dragging) {
        let delta = [
          Math.max(
            0,
            Math.min($event.clientX - this.bounds.left, this.bounds.width)
          ),
        ];
        this.z = Math.round((delta[0] / this.bounds.width) * 100);
        const event = new CustomEvent("hue-change", {
          bubbles: true,
          detail: { h: Math.floor((this.z / 100) * 360) },
        });
        this.$el.dispatchEvent(event);
      }
    },
    onPointerUp() {
      this.dragging = false;
    },

    // slots
    well: {
      [":style"]: "wellStyle",
    },
    thumb: {
      [":style"]: "thumbStyle",
      ["@color-change.window"]: "onColorChange",
      ["@pointerdown.prevent"]: "onPointerDown",
      ["@pointermove.window.prevent"]: "onPointerMove",
      ["@pointerup.window.prevent"]: "onPointerUp",
    },
  };
};
