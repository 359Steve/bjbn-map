import { onMounted as V, nextTick as L, getCurrentScope as $, onScopeDispose as Q, getCurrentInstance as A, watch as z, hasInjectionContext as B, inject as Y, shallowRef as y, computed as S, toValue as b, readonly as q, watchEffect as J, unref as K, defineComponent as U, ref as M, createElementBlock as X, openBlock as Z, normalizeStyle as ee, createElementVNode as te } from "vue";
function ne(e, t) {
  return $() ? (Q(e, t), !0) : !1;
}
const _ = /* @__PURE__ */ new WeakMap(), ie = /* @__NO_SIDE_EFFECTS__ */ (...e) => {
  var t;
  const o = e[0], a = (t = A()) === null || t === void 0 ? void 0 : t.proxy, n = a ?? $();
  if (n == null && !B()) throw new Error("injectLocal must be called in setup");
  return n && _.has(n) && o in _.get(n) ? _.get(n)[o] : Y(...e);
}, oe = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const ae = Object.prototype.toString, le = (e) => ae.call(e) === "[object Object]";
function j(e) {
  return e.endsWith("rem") ? Number.parseFloat(e) * 16 : Number.parseFloat(e);
}
function N(e) {
  return Array.isArray(e) ? e : [e];
}
function ue(e) {
  return A();
}
function re(e, t = !0, o) {
  ue() ? V(e, o) : t ? e() : L(e);
}
function se(e, t, o) {
  return z(e, t, {
    ...o,
    immediate: !0
  });
}
const T = oe ? window : void 0;
function ce(e) {
  var t;
  const o = b(e);
  return (t = o?.$el) !== null && t !== void 0 ? t : o;
}
function P(...e) {
  const t = (a, n, r, i) => (a.addEventListener(n, r, i), () => a.removeEventListener(n, r, i)), o = S(() => {
    const a = N(b(e[0])).filter((n) => n != null);
    return a.every((n) => typeof n != "string") ? a : void 0;
  });
  return se(() => {
    var a, n;
    return [
      (a = (n = o.value) === null || n === void 0 ? void 0 : n.map((r) => ce(r))) !== null && a !== void 0 ? a : [T].filter((r) => r != null),
      N(b(o.value ? e[1] : e[0])),
      N(K(o.value ? e[2] : e[1])),
      b(o.value ? e[3] : e[2])
    ];
  }, ([a, n, r, i], f, v) => {
    if (!a?.length || !n?.length || !r?.length) return;
    const u = le(i) ? { ...i } : i, c = a.flatMap((d) => n.flatMap((h) => r.map((s) => t(d, h, s, u))));
    v(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function ve() {
  const e = y(!1), t = A();
  return t && V(() => {
    e.value = !0;
  }, t), e;
}
// @__NO_SIDE_EFFECTS__
function de(e) {
  const t = /* @__PURE__ */ ve();
  return S(() => (t.value, !!e()));
}
function fe(e, t = {}) {
  const { immediate: o = !0, fpsLimit: a = null, window: n = T, once: r = !1 } = t, i = y(!1), f = S(() => {
    const s = b(a);
    return s ? 1e3 / s : null;
  });
  let v = 0, u = null;
  function c(s) {
    if (!i.value || !n) return;
    v || (v = s);
    const E = s - v;
    if (f.value && E < f.value) {
      u = n.requestAnimationFrame(c);
      return;
    }
    if (v = s, e({
      delta: E,
      timestamp: s
    }), r) {
      i.value = !1, u = null;
      return;
    }
    u = n.requestAnimationFrame(c);
  }
  function d() {
    !i.value && n && (i.value = !0, v = 0, u = n.requestAnimationFrame(c));
  }
  function h() {
    i.value = !1, u != null && n && (n.cancelAnimationFrame(u), u = null);
  }
  return o && d(), ne(h), {
    isActive: q(i),
    pause: h,
    resume: d
  };
}
const he = Symbol("vueuse-ssr-width");
// @__NO_SIDE_EFFECTS__
function me() {
  const e = B() ? /* @__PURE__ */ ie(he, null) : null;
  return typeof e == "number" ? e : void 0;
}
function pe(e, t = {}) {
  const { window: o = T, ssrWidth: a = /* @__PURE__ */ me() } = t, n = /* @__PURE__ */ de(() => o && "matchMedia" in o && typeof o.matchMedia == "function"), r = y(typeof a == "number"), i = y(), f = y(!1), v = (u) => {
    f.value = u.matches;
  };
  return J(() => {
    if (r.value) {
      r.value = !n.value, f.value = b(e).split(",").some((u) => {
        const c = u.includes("not all"), d = u.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/), h = u.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let s = !!(d || h);
        return d && s && (s = a >= j(d[1])), h && s && (s = a <= j(h[1])), c ? !s : s;
      });
      return;
    }
    n.value && (i.value = o.matchMedia(b(e)), f.value = i.value.matches);
  }), P(i, "change", v, { passive: !0 }), S(() => f.value);
}
// @__NO_SIDE_EFFECTS__
function we(e = {}) {
  const { window: t = T, initialWidth: o = Number.POSITIVE_INFINITY, initialHeight: a = Number.POSITIVE_INFINITY, listenOrientation: n = !0, includeScrollbar: r = !0, type: i = "inner" } = e, f = y(o), v = y(a), u = () => {
    if (t) if (i === "outer")
      f.value = t.outerWidth, v.value = t.outerHeight;
    else if (i === "visual" && t.visualViewport) {
      const { width: d, height: h, scale: s } = t.visualViewport;
      f.value = Math.round(d * s), v.value = Math.round(h * s);
    } else r ? (f.value = t.innerWidth, v.value = t.innerHeight) : (f.value = t.document.documentElement.clientWidth, v.value = t.document.documentElement.clientHeight);
  };
  u(), re(u);
  const c = { passive: !0 };
  return P("resize", u, c), t && i === "visual" && t.visualViewport && P(t.visualViewport, "resize", u, c), n && z(pe("(orientation: portrait)"), () => u()), {
    width: f,
    height: v
  };
}
const ge = "#88888825", ye = 30, Me = 1e3 / 40, be = /* @__PURE__ */ U({
  __name: "BranchCanvas",
  setup(e) {
    const t = Math.PI, o = Math.PI / 2, a = Math.PI / 12, n = M(null), { random: r } = Math, i = M({
      width: y(0),
      height: y(0)
    }), f = M(6), v = M(!1), u = M(), c = M([]), d = M([]), h = M(0), s = S(() => r() * 0.6 + 0.2);
    function E(l, m = 400, p = 400) {
      const w = l.getContext("2d"), g = window.devicePixelRatio || 1;
      return l.width = m * g, l.height = p * g, l.style.width = `${m}px`, l.style.height = `${p}px`, w.scale(g, g), w;
    }
    function H(l = 0, m = 0, p = 0, w = 0) {
      const g = p * Math.cos(w), C = p * Math.sin(w);
      return [l + g, m + C];
    }
    function I(l, m, p, w, g = { value: 0 }) {
      const C = r() * f.value;
      g.value += 1;
      const [W, k] = H(m, p, C, w);
      l.beginPath(), l.moveTo(m, p), l.lineTo(W, k), l.stroke();
      const D = w + r() * a, G = w - r() * a;
      if (W < -100 || W > i.value.width + 100 || k < -100 || k > i.value.height + 100) return;
      const O = g.value <= ye ? 0.8 : 0.5;
      r() < O && c.value.push(() => I(l, W, k, D, g)), r() < O && c.value.push(() => I(l, W, k, G, g));
    }
    function R() {
      u.value && (performance.now() - h.value < Me || (d.value = c.value, c.value = [], h.value = performance.now(), d.value.length || (u.value.pause(), v.value = !0), d.value.forEach((l) => {
        r() < 0.5 ? c.value.push(l) : l();
      })));
    }
    function x(l, m, p) {
      u.value && (u.value.pause(), l.clearRect(0, 0, m, p), l.lineWidth = 1, l.strokeStyle = ge, d.value = [], c.value = [
        // 上方
        () => I(l, s.value * i.value.width, 0, o),
        // 下方
        () => I(l, s.value * i.value.width, i.value.height, -o),
        // 左方
        () => I(l, 0, s.value * i.value.height, 0),
        // 右方
        () => I(l, i.value.width, s.value * i.value.height, t)
      ], i.value.width < 500 && (c.value = c.value.slice(0, 2)), u.value.resume(), v.value = !1);
    }
    V(async () => {
      L(() => {
        i.value = /* @__PURE__ */ we();
        const l = n.value, m = E(l, i.value.width, i.value.height), { width: p, height: w } = l;
        h.value = performance.now(), u.value = fe(R, { immediate: !1 }), x(m, p, w);
      });
    });
    const F = S(() => "radial-gradient(circle, transparent, black);");
    return (l, m) => (Z(), X("div", {
      class: "branch-class",
      style: ee(`mask-image: ${F.value};--webkit-mask-image: ${F.value};`)
    }, [
      te("canvas", {
        ref_key: "el",
        ref: n,
        width: "400",
        height: "400"
      }, null, 512)
    ], 4));
  }
}), Ie = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [a, n] of t)
    o[a] = n;
  return o;
}, We = /* @__PURE__ */ Ie(be, [["__scopeId", "data-v-14b99e8f"]]);
export {
  We as BranchCanvas,
  We as default
};
