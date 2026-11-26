import { n as e } from "./rolldown-runtime-DtPi1Y-2.js";
//#region node_modules/solid-js/dist/solid.js
var t = {
	context: void 0,
	registry: void 0,
	effects: void 0,
	done: !1,
	getContextId() {
		return n(this.context.count);
	},
	getNextContextId() {
		return n(this.context.count++);
	}
};
function n(e) {
	let n = String(e), r = n.length - 1;
	return t.context.id + (r ? String.fromCharCode(96 + r) : "") + n;
}
function r(e) {
	t.context = e;
}
var i = (e, t) => e === t, a = Symbol("solid-proxy"), o = typeof Proxy == "function", s = Symbol("solid-track"), c = { equals: i }, l = null, u = he, d = 1, f = 2, p = {
	owned: null,
	cleanups: null,
	context: null,
	owner: null
}, m = {}, h = null, g = null, _ = null, v = null, y = null, b = 0;
function x(e, t) {
	let n = _, r = h, i = e.length === 0, a = t === void 0 ? r : t, o = i ? p : {
		owned: null,
		cleanups: null,
		context: a ? a.context : null,
		owner: a
	}, s = i ? e : () => e(() => E(() => ye(o)));
	h = o, _ = null;
	try {
		return k(s, !0);
	} finally {
		_ = n, h = r;
	}
}
function S(e, t) {
	t = t ? Object.assign({}, c, t) : c;
	let n = {
		value: e,
		observers: null,
		observerSlots: null,
		comparator: t.equals || void 0
	};
	return [le.bind(n), (e) => (typeof e == "function" && (e = g && g.running && g.sources.has(n) ? e(n.tValue) : e(n.value)), ue(n, e))];
}
function ee(e, t, n) {
	O(fe(e, t, !0, d));
}
function C(e, t, n) {
	O(fe(e, t, !1, d));
}
function te(e, t, n) {
	u = ge;
	let r = fe(e, t, !1, d), i = ce && se(ce);
	i && (r.suspense = i), (!n || !n.render) && (r.user = !0), y ? y.push(r) : O(r);
}
function w(e, t, n) {
	n = n ? Object.assign({}, c, n) : c;
	let r = fe(e, t, !0, 0);
	return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, O(r), le.bind(r);
}
function ne(e) {
	return e && typeof e == "object" && "then" in e;
}
function T(e, n, r) {
	let i, a, o;
	typeof n == "function" ? (i = e, a = n, o = r || {}) : (i = !0, a = e, o = n || {});
	let s = null, c = m, l = null, u = !1, d = !1, f = "initialValue" in o, p = typeof i == "function" && w(i), v = /* @__PURE__ */ new Set(), [y, b] = (o.storage || S)(o.initialValue), [x, C] = S(void 0), [te, T] = S(void 0, { equals: !1 }), [ae, oe] = S(f ? "ready" : "unresolved");
	h && re(() => {
		for (let e of v.keys()) e.decrement();
		v.clear(), g && s && g.promises.delete(s), s = null;
	}), t.context && (l = t.getNextContextId(), o.ssrLoadFrom === "initial" ? c = o.initialValue : t.load && t.has(l) && (c = t.load(l)));
	function D(e, t, n, r) {
		return s === e && (s = null, r !== void 0 && (f = !0), (e === c || t === c) && o.onHydrated && queueMicrotask(() => o.onHydrated(r, { value: t })), c = m, g && e && u ? (g.promises.delete(e), u = !1, k(() => {
			g.running = !0, le(t, n);
		}, !1)) : le(t, n)), t;
	}
	function le(e, t) {
		k(() => {
			t === void 0 && b(() => e), oe(t === void 0 ? f ? "ready" : "unresolved" : "errored"), C(t);
			for (let e of v.keys()) e.decrement();
			v.clear();
		}, !1);
	}
	function ue() {
		let e = ce && se(ce), t = y(), n = x();
		if (n !== void 0 && !s) throw n;
		return _ && !_.user && e && ee(() => {
			te(), s && (e.resolved && g && u ? g.promises.add(s) : v.has(e) || (e.increment(), v.add(e)));
		}), t;
	}
	function O(e = !0) {
		if (e !== !1 && d) return;
		d = !1;
		let t = p ? p() : i;
		if (u = g && g.running, t == null || t === !1) {
			D(s, E(y));
			return;
		}
		g && s && g.promises.delete(s);
		let n, r = c === m ? E(() => {
			try {
				return a(t, {
					value: y(),
					refetching: e
				});
			} catch (e) {
				n = e;
			}
		}) : c;
		if (n !== void 0) {
			D(s, void 0, xe(n), t);
			return;
		}
		return ne(r) ? (s = r, "v" in r ? (r.s === 1 ? D(s, r.v, void 0, t) : D(s, void 0, xe(r.v), t), r) : (d = !0, queueMicrotask(() => d = !1), k(() => {
			oe(f ? "refreshing" : "pending"), T();
		}, !1), r.then((e) => D(r, e, void 0, t), (e) => D(r, void 0, xe(e), t)))) : (D(s, r, void 0, t), r);
	}
	Object.defineProperties(ue, {
		state: { get: () => ae() },
		error: { get: () => x() },
		loading: { get() {
			let e = ae();
			return e === "pending" || e === "refreshing";
		} },
		latest: { get() {
			if (!f) return ue();
			let e = x();
			if (e && !s) throw e;
			return y();
		} }
	});
	let de = h;
	return p ? ee(() => (de = h, O(!1))) : O(!1), [ue, {
		refetch: (e) => ie(de, () => O(e)),
		mutate: b
	}];
}
function E(e) {
	if (_ === null) return e();
	let t = _;
	_ = null;
	try {
		return e();
	} finally {
		_ = t;
	}
}
function re(e) {
	return h === null || (h.cleanups === null ? h.cleanups = [e] : h.cleanups.push(e)), e;
}
function ie(e, t) {
	let n = h, r = _;
	h = e, _ = null;
	try {
		return k(t, !0);
	} catch (e) {
		Ce(e);
	} finally {
		h = n, _ = r;
	}
}
var [ae, oe] = /*@__PURE__*/ S(!1);
function se(e) {
	let t;
	return h && h.context && (t = h.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function D(e) {
	let t = w(e), n = w(() => we(t()));
	return n.toArray = () => {
		let e = n();
		return Array.isArray(e) ? e : e == null ? [] : [e];
	}, n;
}
var ce;
function le() {
	let e = g && g.running;
	if (this.sources && (e ? this.tState : this.state)) {
		if ((e ? this.tState : this.state) === d) O(this);
		else {
			let e = v;
			v = null, k(() => _e(this), !1), v = e;
		}
	}
	if (_) {
		let e = this.observers;
		if (!e || e[e.length - 1] !== _) {
			let t = e ? e.length : 0;
			_.sources ? (_.sources.push(this), _.sourceSlots.push(t)) : (_.sources = [this], _.sourceSlots = [t]), e ? (e.push(_), this.observerSlots.push(_.sources.length - 1)) : (this.observers = [_], this.observerSlots = [_.sources.length - 1]);
		}
	}
	return e && g.sources.has(this) ? this.tValue : this.value;
}
function ue(e, t, n) {
	let r = g && g.running && g.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (g) {
			let r = g.running;
			(r || !n && g.sources.has(e)) && (g.sources.add(e), e.tValue = t), r || (e.value = t);
		} else e.value = t;
		e.observers && e.observers.length && k(() => {
			for (let t = 0; t < e.observers.length; t += 1) {
				let n = e.observers[t], r = g && g.running;
				r && g.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? v.push(n) : y.push(n), n.observers && ve(n)), r ? n.tState = d : n.state = d);
			}
			if (v.length > 1e6) throw v = [], Error();
		}, !1);
	}
	return t;
}
function O(e) {
	if (!e.fn) return;
	ye(e);
	let t = b;
	de(e, g && g.running && g.sources.has(e) ? e.tValue : e.value, t), g && !g.running && g.sources.has(e) && queueMicrotask(() => {
		k(() => {
			g && (g.running = !0), _ = h = e, de(e, e.tValue, t), _ = h = null;
		}, !1);
	});
}
function de(e, t, n) {
	let r, i = h, a = _;
	_ = h = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return e.pure && (g && g.running ? (e.tState = d, e.tOwned && e.tOwned.forEach(ye), e.tOwned = void 0) : (e.state = d, e.owned && e.owned.forEach(ye), e.owned = null)), e.updatedAt = n + 1, Ce(t);
	} finally {
		_ = a, h = i;
	}
	(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? ue(e, r, !0) : g && g.running && e.pure ? (g.sources.has(e) || (e.value = r), g.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function fe(e, t, n, r = d, i) {
	let a = {
		fn: e,
		state: r,
		updatedAt: null,
		owned: null,
		sources: null,
		sourceSlots: null,
		cleanups: null,
		value: t,
		owner: h,
		context: h ? h.context : null,
		pure: n
	};
	return g && g.running && (a.state = 0, a.tState = r), h === null || h !== p && (g && g.running && h.pure ? h.tOwned ? h.tOwned.push(a) : h.tOwned = [a] : h.owned ? h.owned.push(a) : h.owned = [a]), a;
}
function pe(e) {
	let t = g && g.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === f) return _e(e);
	if (e.suspense && E(e.suspense.inFallback)) return e.suspense.effects.push(e);
	let n = [e];
	for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < b);) {
		if (t && g.disposed.has(e)) return;
		(t ? e.tState : e.state) && n.push(e);
	}
	for (let r = n.length - 1; r >= 0; r--) {
		if (e = n[r], t) {
			let t = e, i = n[r + 1];
			for (; (t = t.owner) && t !== i;) if (g.disposed.has(t)) return;
		}
		if ((t ? e.tState : e.state) === d) O(e);
		else if ((t ? e.tState : e.state) === f) {
			let t = v;
			v = null, k(() => _e(e, n[0]), !1), v = t;
		}
	}
}
function k(e, t) {
	if (v) return e();
	let n = !1;
	t || (v = []), y ? n = !0 : y = [], b++;
	try {
		let t = e();
		return me(n), t;
	} catch (e) {
		n || (y = null), v = null, Ce(e);
	}
}
function me(e) {
	if (v &&= (he(v), null), e) return;
	let t;
	if (g) {
		if (!g.promises.size && !g.queue.size) {
			let e = g.sources, n = g.disposed;
			y.push.apply(y, g.effects), t = g.resolve;
			for (let e of y) "tState" in e && (e.state = e.tState), delete e.tState;
			g = null, k(() => {
				for (let e of n) ye(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) ye(t.owned[e]);
					t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0;
				}
				oe(!1);
			}, !1);
		} else if (g.running) {
			g.running = !1, g.effects.push.apply(g.effects, y), y = null, oe(!0);
			return;
		}
	}
	let n = y;
	y = null, n.length && k(() => u(n), !1), t && t();
}
function he(e) {
	for (let t = 0; t < e.length; t++) pe(e[t]);
}
function ge(e) {
	let n, i = 0;
	for (n = 0; n < e.length; n++) {
		let t = e[n];
		t.user ? e[i++] = t : pe(t);
	}
	if (t.context) {
		if (t.count) {
			t.effects ||= [], t.effects.push(...e.slice(0, i));
			return;
		}
		r();
	}
	for (t.effects && (t.done || !t.count) && (e = [...t.effects, ...e], i += t.effects.length, delete t.effects), n = 0; n < i; n++) pe(e[n]);
}
function _e(e, t) {
	let n = g && g.running;
	n ? e.tState = 0 : e.state = 0;
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === d ? i !== t && (!i.updatedAt || i.updatedAt < b) && pe(i) : e === f && _e(i, t);
		}
	}
}
function ve(e) {
	let t = g && g.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) && (t ? r.tState = f : r.state = f, r.pure ? v.push(r) : y.push(r), r.observers && ve(r));
	}
}
function ye(e) {
	let t;
	if (e.sources) for (; e.sources.length;) {
		let t = e.sources.pop(), n = e.sourceSlots.pop(), r = t.observers;
		if (r && r.length) {
			let e = r.pop(), i = t.observerSlots.pop();
			n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i);
		}
	}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) ye(e.tOwned[t]);
		delete e.tOwned;
	}
	if (g && g.running && e.pure) be(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) ye(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	g && g.running ? e.tState = 0 : e.state = 0;
}
function be(e, t) {
	if (t || (e.tState = 0, g.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) be(e.owned[t]);
}
function xe(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function Se(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		Ce(e, n && n.owner || null);
	}
}
function Ce(e, t = h) {
	let n = l && t && t.context && t.context[l], r = xe(e);
	if (!n) throw r;
	y ? y.push({
		fn() {
			Se(r, n, t);
		},
		state: d
	}) : Se(r, n, t);
}
function we(e) {
	if (typeof e == "function" && !e.length) return we(e());
	if (Array.isArray(e)) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r = we(e[n]);
			if (Array.isArray(r)) {
				if (r.length < 32768) t.push.apply(t, r);
				else for (let e = 0; e < r.length; e++) t.push(r[e]);
			} else t.push(r);
		}
		return t;
	}
	return e;
}
var Te = Symbol("fallback");
function Ee(e) {
	for (let t = 0; t < e.length; t++) e[t]();
}
function De(e, t, n = {}) {
	let r = [], i = [], a = [], o = 0, c = t.length > 1 ? [] : null;
	return re(() => Ee(a)), () => {
		let l = e() || [], u = l.length, d, f;
		return l[s], E(() => {
			let e, t, s, m, h, g, _, v, y;
			if (u === 0) o !== 0 && (Ee(a), a = [], r = [], i = [], o = 0, c &&= []), n.fallback && (r = [Te], i[0] = x((e) => (a[0] = e, n.fallback())), o = 1);
			else if (o === 0) {
				for (i = Array(u), f = 0; f < u; f++) r[f] = l[f], i[f] = x(p);
				o = u;
			} else {
				for (s = Array(u), m = Array(u), c && (h = Array(u)), g = 0, _ = Math.min(o, u); g < _ && r[g] === l[g]; g++);
				for (_ = o - 1, v = u - 1; _ >= g && v >= g && r[_] === l[v]; _--, v--) s[v] = i[_], m[v] = a[_], c && (h[v] = c[_]);
				for (e = /* @__PURE__ */ new Map(), t = Array(v + 1), f = v; f >= g; f--) y = l[f], d = e.get(y), t[f] = d === void 0 ? -1 : d, e.set(y, f);
				for (d = g; d <= _; d++) y = r[d], f = e.get(y), f !== void 0 && f !== -1 ? (s[f] = i[d], m[f] = a[d], c && (h[f] = c[d]), f = t[f], e.set(y, f)) : a[d]();
				for (f = g; f < u; f++) f in s ? (i[f] = s[f], a[f] = m[f], c && (c[f] = h[f], c[f](f))) : i[f] = x(p);
				i = i.slice(0, o = u), r = l.slice(0);
			}
			return i;
		});
		function p(e) {
			if (a[f] = e, c) {
				let [e, n] = S(f);
				return c[f] = n, t(l[f], e);
			}
			return t(l[f]);
		}
	};
}
function A(e, t) {
	return E(() => e(t || {}));
}
function Oe() {
	return !0;
}
var ke = {
	get(e, t, n) {
		return t === a ? n : e.get(t);
	},
	has(e, t) {
		return t === a || e.has(t);
	},
	set: Oe,
	deleteProperty: Oe,
	getOwnPropertyDescriptor(e, t) {
		return {
			configurable: !0,
			enumerable: !0,
			get() {
				return e.get(t);
			},
			set: Oe,
			deleteProperty: Oe
		};
	},
	ownKeys(e) {
		return e.keys();
	}
};
function Ae(e, ...t) {
	let n = t.length;
	if (o && a in e) {
		let r = n > 1 ? t.flat() : t[0], i = /* @__PURE__ */ new Set(), a = t.map((t) => {
			let n = t.filter((e) => !i.has(e) && (i.add(e), !0));
			return new Proxy({
				get(t) {
					return n.includes(t) ? e[t] : void 0;
				},
				has(t) {
					return n.includes(t) && t in e;
				},
				keys() {
					return n.filter((t) => t in e);
				}
			}, ke);
		});
		return a.push(new Proxy({
			get(t) {
				return r.includes(t) ? void 0 : e[t];
			},
			has(t) {
				return !r.includes(t) && t in e;
			},
			keys() {
				return Object.keys(e).filter((e) => !r.includes(e));
			}
		}, ke)), a;
	}
	let r = [];
	for (let e = 0; e <= n; e++) r[e] = {};
	for (let i of Object.getOwnPropertyNames(e)) {
		let a = n;
		for (let e = 0; e < t.length; e++) if (t[e].includes(i)) {
			a = e;
			break;
		}
		let o = Object.getOwnPropertyDescriptor(e, i);
		!o.get && !o.set && o.enumerable && o.writable && o.configurable ? r[a][i] = o.value : Object.defineProperty(r[a], i, o);
	}
	return r;
}
var je = (e) => `Stale read from <${e}>.`;
function j(e) {
	let t = "fallback" in e && { fallback: () => e.fallback };
	return w(De(() => e.each, e.children, t || void 0));
}
function M(e) {
	let t = e.keyed, n = w(() => e.when, void 0, void 0), r = t ? n : w(n, void 0, { equals: (e, t) => !e == !t });
	return w(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? E(() => a(t ? i : () => {
				if (!E(r)) throw je("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
function Me(e) {
	let t = D(() => e.children), n = w(() => {
		let e = t(), n = Array.isArray(e) ? e : [e], r = () => void 0;
		for (let e = 0; e < n.length; e++) {
			let t = e, i = n[e], a = r, o = w(() => a() ? void 0 : i.when, void 0, void 0), s = i.keyed ? o : w(o, void 0, { equals: (e, t) => !e == !t });
			r = () => a() || (s() ? [
				t,
				o,
				i
			] : void 0);
		}
		return r;
	});
	return w(() => {
		let t = n()();
		if (!t) return e.fallback;
		let [r, i, a] = t, o = a.children;
		return typeof o == "function" && o.length > 0 ? E(() => o(a.keyed ? i() : () => {
			if (E(n)()?.[0] !== r) throw je("Match");
			return i();
		})) : o;
	}, void 0, void 0);
}
function Ne(e) {
	return e;
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
var Pe = /*#__PURE__*/ new Set([
	"className",
	"value",
	"readOnly",
	"noValidate",
	"formNoValidate",
	"isMap",
	"noModule",
	"playsInline",
	"adAuctionHeaders",
	"allowFullscreen",
	"browsingTopics",
	"defaultChecked",
	"defaultMuted",
	"defaultSelected",
	"disablePictureInPicture",
	"disableRemotePlayback",
	"preservesPitch",
	"shadowRootClonable",
	"shadowRootCustomElementRegistry",
	"shadowRootDelegatesFocus",
	"shadowRootSerializable",
	"sharedStorageWritable",
	.../* @__PURE__ */ "allowfullscreen.async.alpha.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.hidden.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.adauctionheaders.browsingtopics.credentialless.defaultchecked.defaultmuted.defaultselected.defer.disablepictureinpicture.disableremoteplayback.preservespitch.shadowrootclonable.shadowrootcustomelementregistry.shadowrootdelegatesfocus.shadowrootserializable.sharedstoragewritable".split(".")
]), Fe = /*#__PURE__*/ new Set([
	"innerHTML",
	"textContent",
	"innerText",
	"children"
]), Ie = /*#__PURE__*/ Object.assign(Object.create(null), {
	className: "class",
	htmlFor: "for"
}), Le = /*#__PURE__*/ Object.assign(Object.create(null), {
	class: "className",
	novalidate: {
		$: "noValidate",
		FORM: 1
	},
	formnovalidate: {
		$: "formNoValidate",
		BUTTON: 1,
		INPUT: 1
	},
	ismap: {
		$: "isMap",
		IMG: 1
	},
	nomodule: {
		$: "noModule",
		SCRIPT: 1
	},
	playsinline: {
		$: "playsInline",
		VIDEO: 1
	},
	readonly: {
		$: "readOnly",
		INPUT: 1,
		TEXTAREA: 1
	},
	adauctionheaders: {
		$: "adAuctionHeaders",
		IFRAME: 1
	},
	allowfullscreen: {
		$: "allowFullscreen",
		IFRAME: 1
	},
	browsingtopics: {
		$: "browsingTopics",
		IMG: 1
	},
	defaultchecked: {
		$: "defaultChecked",
		INPUT: 1
	},
	defaultmuted: {
		$: "defaultMuted",
		AUDIO: 1,
		VIDEO: 1
	},
	defaultselected: {
		$: "defaultSelected",
		OPTION: 1
	},
	disablepictureinpicture: {
		$: "disablePictureInPicture",
		VIDEO: 1
	},
	disableremoteplayback: {
		$: "disableRemotePlayback",
		AUDIO: 1,
		VIDEO: 1
	},
	preservespitch: {
		$: "preservesPitch",
		AUDIO: 1,
		VIDEO: 1
	},
	shadowrootclonable: {
		$: "shadowRootClonable",
		TEMPLATE: 1
	},
	shadowrootdelegatesfocus: {
		$: "shadowRootDelegatesFocus",
		TEMPLATE: 1
	},
	shadowrootserializable: {
		$: "shadowRootSerializable",
		TEMPLATE: 1
	},
	sharedstoragewritable: {
		$: "sharedStorageWritable",
		IFRAME: 1,
		IMG: 1
	}
});
function Re(e, t) {
	let n = Le[e];
	return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
var ze = /*#__PURE__*/ new Set([
	"beforeinput",
	"click",
	"dblclick",
	"contextmenu",
	"focusin",
	"focusout",
	"input",
	"keydown",
	"keyup",
	"mousedown",
	"mousemove",
	"mouseout",
	"mouseover",
	"mouseup",
	"pointerdown",
	"pointermove",
	"pointerout",
	"pointerover",
	"pointerup",
	"touchend",
	"touchmove",
	"touchstart"
]), Be = /*#__PURE__*/ new Set(/* @__PURE__ */ "altGlyph.altGlyphDef.altGlyphItem.animate.animateColor.animateMotion.animateTransform.circle.clipPath.color-profile.cursor.defs.desc.ellipse.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.filter.font.font-face.font-face-format.font-face-name.font-face-src.font-face-uri.foreignObject.g.glyph.glyphRef.hkern.image.line.linearGradient.marker.mask.metadata.missing-glyph.mpath.path.pattern.polygon.polyline.radialGradient.rect.set.stop.svg.switch.symbol.text.textPath.tref.tspan.use.view.vkern".split(".")), Ve = {
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace"
}, N = (e) => w(() => e());
function He(e, t, n) {
	let r = n.length, i = t.length, a = r, o = 0, s = 0, c = t[i - 1].nextSibling, l = null;
	for (; o < i || s < a;) {
		if (t[o] === n[s]) {
			o++, s++;
			continue;
		}
		for (; t[i - 1] === n[a - 1];) i--, a--;
		if (i === o) {
			let t = a < r ? s ? n[s - 1].nextSibling : n[a - s] : c;
			for (; s < a;) e.insertBefore(n[s++], t);
		} else if (a === s) for (; o < i;) (!l || !l.has(t[o])) && t[o].remove(), o++;
		else if (t[o] === n[a - 1] && n[s] === t[i - 1]) {
			let r = t[--i].nextSibling;
			e.insertBefore(n[s++], t[o++].nextSibling), e.insertBefore(n[--a], r), t[i] = n[a];
		} else {
			if (!l) {
				l = /* @__PURE__ */ new Map();
				let e = s;
				for (; e < a;) l.set(n[e], e++);
			}
			let r = l.get(t[o]);
			if (r != null) {
				if (s < r && r < a) {
					let c = o, u = 1, d;
					for (; ++c < i && c < a && (d = l.get(t[c])) != null && d === r + u;) u++;
					if (u > r - s) {
						let i = t[o];
						for (; s < r;) e.insertBefore(n[s++], i);
					} else e.replaceChild(n[s++], t[o++]);
				} else o++;
			} else t[o++].remove();
		}
	}
}
var Ue = "_$DX_DELEGATE";
function We(e, t, n, r = {}) {
	let i;
	return x((r) => {
		i = r, t === document ? e() : L(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function P(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => E(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function Ge(e, t = window.document) {
	let n = t[Ue] || (t[Ue] = /* @__PURE__ */ new Set());
	for (let r = 0, i = e.length; r < i; r++) {
		let i = e[r];
		n.has(i) || (n.add(i), t.addEventListener(i, ot));
	}
}
function F(e, t, n) {
	nt(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ke(e, t, n, r) {
	nt(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function qe(e, t, n) {
	nt(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function I(e, t) {
	nt(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function Je(e, t, n, r) {
	if (r) Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
	else if (Array.isArray(n)) {
		let r = n[0];
		e.addEventListener(t, n[0] = (t) => r.call(e, n[1], t));
	} else e.addEventListener(t, n, typeof n != "function" && n);
}
function Ye(e, t, n = {}) {
	let r = Object.keys(t || {}), i = Object.keys(n), a, o;
	for (a = 0, o = i.length; a < o; a++) {
		let r = i[a];
		r && r !== "undefined" && !t[r] && (it(e, r, !1), delete n[r]);
	}
	for (a = 0, o = r.length; a < o; a++) {
		let i = r[a], o = !!t[i];
		i && i !== "undefined" && n[i] !== o && o && (it(e, i, !0), n[i] = o);
	}
	return n;
}
function Xe(e, t, n) {
	if (!t) return n ? F(e, "style") : t;
	let r = e.style;
	if (typeof t == "string") return r.cssText = t;
	typeof n == "string" && (r.cssText = n = void 0), n ||= {}, t ||= {};
	let i, a;
	for (a in n) t[a] ?? r.removeProperty(a), delete n[a];
	for (a in t) i = t[a], i !== n[a] && (r.setProperty(a, i), n[a] = i);
	return n;
}
function Ze(e, t, n) {
	n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n);
}
function Qe(e, t = {}, n, r) {
	let i = {};
	return r || C(() => i.children = st(e, t.children, i.children)), C(() => typeof t.ref == "function" && $e(t.ref, e)), C(() => et(e, t, n, !0, i, !0)), i;
}
function $e(e, t, n) {
	return E(() => e(t, n));
}
function L(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return st(e, t, r, n);
	C((r) => st(e, t(), r, n), r);
}
function et(e, t, n, r, i = {}, a = !1) {
	t ||= {};
	for (let r in i) if (!(r in t)) {
		if (r === "children") continue;
		i[r] = at(e, r, null, i[r], n, a, t);
	}
	for (let o in t) {
		if (o === "children") {
			r || st(e, t.children);
			continue;
		}
		let s = t[o];
		i[o] = at(e, o, s, i[o], n, a, t);
	}
}
function tt(e) {
	let n, r;
	return !nt() || !(n = t.registry.get(r = dt())) ? e() : (t.completed && t.completed.add(n), t.registry.delete(r), n);
}
function nt(e) {
	return !!t.context && !t.done && (!e || e.isConnected);
}
function rt(e) {
	return e.toLowerCase().replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function it(e, t, n) {
	let r = t.trim().split(/\s+/);
	for (let t = 0, i = r.length; t < i; t++) e.classList.toggle(r[t], n);
}
function at(e, t, n, r, i, a, o) {
	let s, c, l, u, d;
	if (t === "style") return Xe(e, n, r);
	if (t === "classList") return Ye(e, n, r);
	if (n === r) return r;
	if (t === "ref") a || n(e);
	else if (t.slice(0, 3) === "on:") {
		let i = t.slice(3);
		r && e.removeEventListener(i, r, typeof r != "function" && r), n && e.addEventListener(i, n, typeof n != "function" && n);
	} else if (t.slice(0, 10) === "oncapture:") {
		let i = t.slice(10);
		r && e.removeEventListener(i, r, !0), n && e.addEventListener(i, n, !0);
	} else if (t.slice(0, 2) === "on") {
		let i = t.slice(2).toLowerCase(), a = ze.has(i);
		if (!a && r) {
			let t = Array.isArray(r) ? r[0] : r;
			e.removeEventListener(i, t);
		}
		(a || n) && (Je(e, i, n, a), a && Ge([i]));
	} else if (t.slice(0, 5) === "attr:") F(e, t.slice(5), n);
	else if (t.slice(0, 5) === "bool:") qe(e, t.slice(5), n);
	else if ((d = t.slice(0, 5) === "prop:") || (l = Fe.has(t)) || !i && ((u = Re(t, e.tagName)) || (c = Pe.has(t))) || (s = e.nodeName.includes("-") || "is" in o)) {
		if (d) t = t.slice(5), c = !0;
		else if (nt(e)) return n;
		t === "class" || t === "className" ? I(e, n) : s && !c && !l ? e[rt(t)] = n : (t === "value" || t === "defaultValue") && (e.nodeName === "INPUT" || e.nodeName === "TEXTAREA") ? e[u || t] = n ?? "" : e[u || t] = n;
	} else {
		let r = i && t.indexOf(":") > -1 && Ve[t.split(":")[0]];
		r ? Ke(e, r, t, n) : F(e, Ie[t] || t, n);
	}
	return n;
}
function ot(e) {
	if (t.registry && t.events && t.events.find(([t, n]) => n === e)) return;
	let n = e.target, r = `$$${e.type}`, i = e.target, a = e.currentTarget, o = (t) => Object.defineProperty(e, "target", {
		configurable: !0,
		value: t
	}), s = () => {
		let t = n[r];
		if (t && !n.disabled) {
			let i = n[`${r}Data`];
			if (i === void 0 ? t.call(n, e) : t.call(n, i, e), e.cancelBubble) return;
		}
		return n.host && typeof n.host != "string" && !n.host._$host && n.contains(e.target) && o(n.host), !0;
	}, c = () => {
		for (; s() && (n = n._$host || n.parentNode || n.host););
	};
	if (Object.defineProperty(e, "currentTarget", {
		configurable: !0,
		get() {
			return n || document;
		}
	}), t.registry && !t.done && (t.done = _$HY.done = !0), e.composedPath) {
		let t = e.composedPath();
		o(t[0]);
		for (let e = 0; e < t.length - 2 && (n = t[e], s()); e++) {
			if (n._$host) {
				n = n._$host, c();
				break;
			}
			if (n.parentNode === a) break;
		}
	} else c();
	o(i);
}
function st(e, t, n, r, i) {
	let a = nt(e);
	if (a) {
		!n && (n = [...e.childNodes]);
		let t = [];
		for (let e = 0; e < n.length; e++) {
			let r = n[e];
			r.nodeType === 8 && r.data.slice(0, 2) === "!$" ? r.remove() : t.push(r);
		}
		n = t;
	}
	for (; typeof n == "function";) n = n();
	if (t === n) return n;
	let o = typeof t, s = r !== void 0;
	if (e = s && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
		if (a || o === "number" && (t = t.toString(), t === n)) return n;
		if (s) {
			let i = n[0];
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = ut(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = ut(e, n, r);
	} else if (o === "function") return C(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = st(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (ct(o, t, n, i)) return C(() => n = st(e, o, n, r, !0)), () => n;
		if (a) {
			if (!o.length) return n;
			if (r === void 0) return n = [...e.childNodes];
			let t = o[0];
			if (t.parentNode !== e) return n;
			let i = [t];
			for (; (t = t.nextSibling) !== r;) i.push(t);
			return n = i;
		}
		if (o.length === 0) {
			if (n = ut(e, n, r), s) return n;
		} else c ? n.length === 0 ? lt(e, o, r) : He(e, n, o) : (n && ut(e), lt(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = ut(e, n, r, t);
			ut(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function ct(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = ct(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = ct(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function lt(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function ut(e, t, n, r) {
	if (n === void 0) return e.textContent = "";
	let i = r || document.createTextNode("");
	if (t.length) {
		let r = !1;
		for (let a = t.length - 1; a >= 0; a--) {
			let o = t[a];
			if (i !== o) {
				let t = o.parentNode === e;
				!r && !a ? t ? e.replaceChild(i, o) : e.insertBefore(i, n) : t && o.remove();
			} else r = !0;
		}
	} else e.insertBefore(i, n);
	return [i];
}
function dt() {
	return t.getNextContextId();
}
var ft = "http://www.w3.org/2000/svg";
function pt(e, t = !1, n = void 0) {
	return t ? document.createElementNS(ft, e) : document.createElement(e, { is: n });
}
function mt(e, n) {
	let r = w(e);
	return w(() => {
		let e = r();
		switch (typeof e) {
			case "function": return E(() => e(n));
			case "string":
				let r = Be.has(e), i = t.context ? tt() : pt(e, r, E(() => n.is));
				return Qe(i, n, r), i;
		}
	});
}
function ht(e) {
	let [, t] = Ae(e, ["component"]);
	return mt(() => e.component, t);
}
//#endregion
//#region src/GlobalJsonCache.jsx
var gt = /* @__PURE__ */ new Map();
function R(e) {
	if (!gt.has(e)) {
		let t = fetch(e).then((e) => e.json()).catch((t) => {
			throw gt.delete(e), t;
		});
		gt.set(e, t);
	}
	return gt.get(e);
}
var z = "/viewers/cep-solid/compiled-json/", _t = "/viewers/cep-solid/permanent-json/", vt = "/viewers/cep-js/compiled-json/", yt = () => R(`${z}InventoryIndex.json`), bt = () => R(`${z}folderIDToTags.json`), xt = () => R(`${z}taggedByIDs.json`), St = () => R(`${z}sortKeys.json`), Ct = () => R(`${z}recentfanvideos.json`), wt = () => R(`${z}recentofficialvideos.json`), Tt = () => R(`${z}titleToFolderIDMap.json`), Et = () => R(`${z}folderIDToTitleMap.json`), Dt = () => R(`${z}typeToIDList.json`), Ot = () => R(`${z}ExtraStatistics.json`), kt = () => R(`${z}contributors.json`), At = () => R(`${z}userProfiles.json`), jt = () => R(`${vt}views.json`), Mt = () => R(`${z}anniversaries.json`), Nt = () => R(`${z}DiscourseNews.json`), Pt = () => R(`${z}DiscourseRecent.json`), Ft = () => R(`${_t}user-submissions.json`);
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function It() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var Lt = It();
function Rt(e) {
	Lt = e;
}
var zt = { exec: () => null };
function Bt(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function B(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(V.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var Vt = ((e = "") => {
	try {
		return !!RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), V = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: Bt((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: Bt((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: Bt((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: Bt((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: Bt((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: Bt((e) => RegExp(`^ {0,${e}}>`))
}, Ht = /^(?:[ \t]*(?:\n|$))+/, Ut = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Wt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Gt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Kt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Jt = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Yt = B(Jt).replace(/bull/g, qt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Xt = B(Jt).replace(/bull/g, qt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Zt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Qt = /^[^\n]+/, $t = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, en = B(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", $t).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), tn = B(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, qt).getRegex(), nn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", rn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, an = B("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", rn).replace("tag", nn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), on = (e) => B(Zt).replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex(), sn = on(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), cn = on(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), ln = {
	blockquote: B(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", cn).getRegex(),
	code: Ut,
	def: en,
	fences: Wt,
	heading: Kt,
	hr: Gt,
	html: an,
	lheading: Yt,
	list: tn,
	newline: Ht,
	paragraph: sn,
	table: zt,
	text: Qt
}, un = B("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex(), dn = {
	...ln,
	lheading: Xt,
	table: un,
	paragraph: B(Zt).replace("hr", Gt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", un).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex()
}, fn = {
	...ln,
	html: B("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", rn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: zt,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: B(Zt).replace("hr", Gt).replace("heading", " *#{1,6} *[^\n]").replace("lheading", Yt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, pn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, mn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, hn = /^( {2,}|\\)\n(?!\s*$)/, gn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, H = /[\p{P}\p{S}]/u, _n = /[\s\p{P}\p{S}]/u, vn = /[^\s\p{P}\p{S}]/u, yn = B(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _n).getRegex(), bn = /[\p{Pi}\p{Ps}"']/u, xn = /(?!~)[\p{P}\p{S}]/u, Sn = /(?!~)[\s\p{P}\p{S}]/u, Cn = /(?:[^\s\p{P}\p{S}]|~)/u, wn = B(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Vt ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Tn = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, En = B(Tn, "u").replace(/punct/g, H).getRegex(), Dn = B(Tn, "u").replace(/punct/g, xn).getRegex(), On = B(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, bn).replace(/punct/g, H).getRegex(), kn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", An = B(kn, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, H).getRegex(), jn = B(kn, "gu").replace(/notPunctSpace/g, Cn).replace(/punctSpace/g, Sn).replace(/punct/g, xn).getRegex(), Mn = B("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, H).getRegex(), Nn = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, H).getRegex(), Pn = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, H).getRegex(), Fn = B(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, H).getRegex(), In = B("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, H).getRegex(), Ln = B(/\\(punct)/, "gu").replace(/punct/g, H).getRegex(), Rn = B(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), zn = B(rn).replace("(?:-->|$)", "-->").getRegex(), Bn = B("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", zn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Vn = B(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), Hn = B(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Vn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Un = B(/^!?\[(label)\]\[(ref)\]/).replace("label", Vn).replace("ref", $t).getRegex(), Wn = B(/^!?\[(ref)\](?:\[\])?/).replace("ref", $t).getRegex(), Gn = B("reflink|nolink(?!\\()", "g").replace("reflink", Un).replace("nolink", Wn).getRegex(), Kn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, qn = {
	_backpedal: zt,
	anyPunctuation: Ln,
	autolink: Rn,
	blockSkip: wn,
	br: hn,
	code: mn,
	del: zt,
	delLDelim: zt,
	delRDelim: zt,
	emStrongLDelim: En,
	emStrongRDelimAst: An,
	emStrongRDelimUnd: Nn,
	escape: pn,
	link: Hn,
	nolink: Wn,
	punctuation: yn,
	reflink: Un,
	reflinkSearch: Gn,
	tag: Bn,
	text: gn,
	url: zt
}, Jn = {
	...qn,
	emStrongLDelim: On,
	emStrongRDelimAst: Mn,
	emStrongRDelimUnd: Pn,
	link: B(/^!?\[(label)\]\((.*?)\)/).replace("label", Vn).getRegex(),
	reflink: B(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vn).getRegex()
}, Yn = {
	...qn,
	emStrongRDelimAst: jn,
	emStrongLDelim: Dn,
	delLDelim: Fn,
	delRDelim: In,
	url: B(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Kn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: B(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Kn).getRegex()
}, Xn = {
	...Yn,
	br: B(hn).replace("{2,}", "*").getRegex(),
	text: B(Yn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Zn = {
	normal: ln,
	gfm: dn,
	pedantic: fn
}, Qn = {
	normal: qn,
	gfm: Yn,
	breaks: Xn,
	pedantic: Jn
}, $n = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, er = (e) => $n[e];
function U(e, t) {
	if (t) {
		if (V.escapeTest.test(e)) return e.replace(V.escapeReplace, er);
	} else if (V.escapeTestNoEncode.test(e)) return e.replace(V.escapeReplaceNoEncode, er);
	return e;
}
function tr(e) {
	try {
		e = encodeURI(e).replace(V.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function nr(e, t) {
	let n = e.replace(V.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(V.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(V.slashPipe, "|");
	return n;
}
function rr(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function ir(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && V.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function ar(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function or(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function sr(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1"), c = e[0].charAt(0) === "!";
	r.state.inLink = !0;
	let l = r.state.linkEmitted, u = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let d = r.inlineTokens(s), f = r.state.linkEmitted;
	if (r.state.linkEmitted = l, r.state.inLink = !1, !c) {
		if (f) {
			r.state.inRawBlock = u;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: c ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: d
	};
}
function cr(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return e.slice(Math.min(r.length, i.length));
	}).join("\n");
}
var lr = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || Lt;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = this.options.pedantic ? t[0] : ir(t[0]);
			return {
				type: "code",
				raw: e,
				codeBlockStyle: "indented",
				text: e.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = cr(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = rr(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: rr(t[0], "\n"),
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: rr(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = rr(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o = 0;
				for (; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = e.join("\n"), o = t.raw + "\n" + a.replace(this.rules.other.blockquoteSetextReplace2, ""), s = this.blockquote(o);
					i[i.length - 1] = s, n = `${n}
${a}`, r = r.substring(0, r.length - t.text.length) + s.text;
					break;
				}
				if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = or(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
				if (this.options.pedantic ? (d = 2, s = c.trimStart()) : u ? d = t[1].length + 1 : (d = c.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, s = c.slice(d), d += t[1].length), u && this.rules.other.blankLine.test(l) && (r += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(d), n = this.rules.other.hrRegex(d), i = this.rules.other.fencesBeginRegex(d), a = this.rules.other.headingBeginRegex(d), o = this.rules.other.htmlBeginRegex(d), f = this.rules.other.blockquoteBeginRegex(d);
					for (; e;) {
						let p = e.split("\n", 1)[0], m;
						if (l = p, this.options.pedantic ? (l = l.replace(this.rules.other.listReplaceNesting, "  "), m = l) : m = l.replace(this.rules.other.tabCharGlobal, "    "), i.test(l) || a.test(l) || o.test(l) || f.test(l) || t.test(l) || n.test(l)) break;
						if (m.search(this.rules.other.nonSpaceChar) >= d || !l.trim()) s += "\n" + m.slice(d);
						else {
							if (u || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(c) || a.test(c) || n.test(c)) break;
							s += "\n" + l;
						}
						u = !l.trim(), r += p + "\n", e = e.substring(p.length + 1), c = m.slice(d);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), !i.loose) {
				let t = e.tokens.filter((e) => e.type === "space");
				i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
			}
			for (let e of i.items) {
				let t = e.tokens[0];
				if (e.task && (t?.type === "text" || t?.type === "paragraph")) {
					e.text = e.text.replace(this.rules.other.listReplaceTask, ""), t.raw = t.raw.replace(this.rules.other.listReplaceTask, ""), t.text = t.text.replace(this.rules.other.listReplaceTask, "");
					for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
						this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let n = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (n) {
						let t = {
							type: "checkbox",
							raw: n[0] + " ",
							checked: n[0] !== "[ ]"
						};
						e.checked = t.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = t.raw + e.tokens[0].raw, e.tokens[0].text = t.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(t)) : e.tokens.unshift({
							type: "paragraph",
							raw: t.raw,
							text: t.raw,
							tokens: [t]
						}) : e.tokens.unshift(t);
					}
				} else e.task &&= !1;
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let e = ir(t[0]);
			return {
				type: "html",
				block: !0,
				raw: e,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: e
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: rr(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = nr(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: rr(t[0], "\n"),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(nr(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: rr(t[0], "\n"),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
				if (!this.rules.other.endAngleBracket.test(e)) return;
				let t = rr(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = ar(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), sr(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return sr(n, e, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, a, o, s = i, c = 0, l = r[0][0], u = n === l, d = l === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = d.exec(t)) !== null;) {
				if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
				if (o = [...a].length, r[3] || r[4]) {
					s += o;
					continue;
				}
				if (r[5] || r[6]) {
					if (i % 3 && !((i + o) % 3)) {
						c += o;
						continue;
					}
					if (u) break;
				}
				if (s -= o, s > 0) continue;
				o = Math.min(o, o + s + c);
				let t = [...r[0]][0].length, n = e.slice(0, i + r.index + t + o);
				if (Math.min(i, o) % 2) {
					let e = n.slice(1, -1);
					return {
						type: "em",
						raw: n,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = n.slice(2, -2);
				return {
					type: "strong",
					raw: n,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) !== null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: e
			};
		}
	}
}, W = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || Lt, this.options.tokenizer = this.options.tokenizer || new lr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: V,
			block: Zn.normal,
			inline: Qn.normal
		};
		this.options.pedantic ? (t.block = Zn.pedantic, t.inline = Qn.pedantic) : this.options.gfm && (t.block = Zn.gfm, t.inline = this.options.breaks ? Qn.breaks : Qn.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Zn,
			inline: Qn
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(V.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(V.tabCharGlobal, "    ").replace(V.spaceLine, ""));
		let r = 1 / 0;
		for (; e;) {
			if (e.length < r) r = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let i;
			if (this.options.extensions?.block?.some((n) => (i = n.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
			if (i = this.tokenizer.space(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				i.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(i);
				continue;
			}
			if (i = this.tokenizer.code(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (i = this.tokenizer.fences(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.heading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.hr(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.blockquote(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.list(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.html(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.def(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
					href: i.href,
					title: i.title
				}, t.push(i));
				continue;
			}
			if (i = this.tokenizer.table(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			if (i = this.tokenizer.lheading(e)) {
				e = e.substring(i.raw.length), t.push(i);
				continue;
			}
			let a = e;
			if (this.options.extensions?.startBlock) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (a = e.substring(0, t + 1));
			}
			if (this.state.top && (i = this.tokenizer.paragraph(a))) {
				let r = t.at(-1);
				n && r?.type === "paragraph" ? (r.raw += (r.raw.endsWith("\n") ? "" : "\n") + i.raw, r.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : t.push(i), n = a.length !== e.length, e = e.substring(i.raw.length);
				continue;
			}
			if (i = this.tokenizer.text(e)) {
				e = e.substring(i.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + i.raw, n.text += "\n" + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(i);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let t = this.tokenizer.rules.inline.link;
		for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return !0;
		for (let t of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let e = t[0], n = e.lastIndexOf("[");
			if (e.charAt(0) !== "!" && Object.hasOwn(this.tokens.links, e.slice(n + 1, -1)) && !(n > 1 && this.linkInText(e.slice(1, n - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e;
		if (this.tokens.links && e.includes("[")) {
			let e = this.tokenizer.rules.inline.reflinkSearch, t = (n) => {
				let r = n.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, n.slice(r + 1, -1))) return n;
				if (r > 1 && n.charAt(0) !== "!") {
					let i = n.slice(1, r - 1);
					if (this.linkInText(i)) return "[" + i.replace(e, t) + "][" + "a".repeat(n.length - r - 2) + "]";
				}
				return "[" + "a".repeat(n.length - 2) + "]";
			};
			n = n.replace(e, t);
		}
		n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (e) => "+".repeat(e.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (e, t, n) => {
			let r = n ? n.length : 0;
			return e.slice(0, r) + "[" + "a".repeat(e.length - r - 2) + "]";
		}), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let r = !1, i = "", a = 1 / 0;
		for (; e;) {
			if (e.length < a) a = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			r || (i = ""), r = !1;
			let o;
			if (this.options.extensions?.inline?.some((n) => (o = n.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
			if (o = this.tokenizer.escape(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.tag(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.link(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(o.raw.length);
				let n = t.at(-1);
				o.type === "text" && n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (o = this.tokenizer.emStrong(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.codespan(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.br(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.del(e, n, i)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.autolink(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (!this.state.inLink && (o = this.tokenizer.url(e))) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			let s = e;
			if (this.options.extensions?.startInline) {
				let t = 1 / 0, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < 1 / 0 && t >= 0 && (s = e.substring(0, t + 1));
			}
			if (o = this.tokenizer.inlineText(s)) {
				e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (i = o.raw.slice(-1)), r = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += o.raw, n.text += o.text) : t.push(o);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return t;
	}
	infiniteLoopError(e) {
		let t = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(t);
		else throw Error(t);
	}
}, ur = class {
	options;
	parser;
	constructor(e) {
		this.options = e || Lt;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(V.notSpaceStart)?.[0], i = e ? e.replace(V.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + U(r) + "\">" + (n ? i : U(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : U(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${U(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? U(n, !0) : this.parser.parseInline(r), o = tr(e);
		if (o === null) return a;
		e = U(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + U(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = tr(e);
		if (i === null) return U(n);
		e = i;
		let a = `<img src="${U(e)}" alt="${U(n)}"`;
		return t && (a += ` title="${U(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : U(e.text);
	}
}, dr = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, G = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || Lt, this.options.renderer = this.options.renderer || new ur(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new dr();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, fr = class {
	options;
	block;
	constructor(e) {
		this.options = e || Lt;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? W.lex : W.lexInline;
	}
	provideParser(e = this.block) {
		return e ? G.parse : G.parseInline;
	}
}, pr = new class {
	defaults = It();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = G;
	Renderer = ur;
	TextRenderer = dr;
	Lexer = W;
	Tokenizer = lr;
	Hooks = fr;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(1 / 0);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new ur(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new lr(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new fr();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = fr.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && fr.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return W.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return G.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? W.lex : W.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? G.parse : G.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? W.lex : W.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? G.parse : G.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + U(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function K(e, t) {
	return pr.parse(e, t);
}
K.options = K.setOptions = function(e) {
	return pr.setOptions(e), K.defaults = pr.defaults, Rt(K.defaults), K;
}, K.getDefaults = It, K.defaults = Lt;
function mr(...e) {
	return pr.use(...e), K.defaults = pr.defaults, Rt(K.defaults), K;
}
K.use = mr, K.walkTokens = function(e, t) {
	return pr.walkTokens(e, t);
}, K.parseInline = pr.parseInline, K.Parser = G, K.parser = G.parse, K.Renderer = ur, K.TextRenderer = dr, K.Lexer = W, K.lexer = W.lex, K.Tokenizer = lr, K.Hooks = fr, K.parse = K, K.options, K.setOptions, K.walkTokens, K.parseInline, G.parse, W.lex;
//#endregion
//#region src/MapRenderer.jsx
var hr = "/viewers/cep-solid/compiled-json/map_pins.json", gr = "/viewers/cep-js/assets/Map Markers/", _r = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", vr = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", yr = {
	0: "ptt.png",
	1: "Montfort.avif",
	2: "IngramDrive.avif",
	3: "IDrive.avif",
	4: "Spokane.avif",
	5: "DiscoveryZone.avif",
	6: "PeterPiperPizza.avif",
	7: "other.png",
	8: "ptt.png",
	9: "other.png",
	a: "ptt.png",
	b: "other.png",
	c: "other.png",
	d: "Justiss.avif",
	e: "ShowbizIdkStore.avif"
}, br = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), xr = (e) => String(e).padStart(2, "0"), Sr = (e) => `${e.getFullYear()}-${xr(e.getMonth() + 1)}-${xr(e.getDate())}`, Cr = (e) => new Date(e, 1, 29).getDate() === 29, wr = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function Tr(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function Er() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = _r, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = vr, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function Dr() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = "\n    .MapPinIcon .MapPinImg{display:block;width:100%;height:100%;max-width:none;transition:transform .15s ease;transform-origin:bottom center;}\n    .MapPinIcon:hover .MapPinImg{transform:scale(2.5);}\n  ", document.head.appendChild(e);
}
var Or = /* @__PURE__ */ new Map();
function kr(e) {
	return Or.has(e) || Or.set(e, fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => e.title).catch(() => "Open article")), Or.get(e);
}
var Ar = /* @__PURE__ */ new Map();
function jr(e, t) {
	let n = new URLSearchParams(location.search).get("v") || "cep-js", r = document.createElement("a");
	return r.href = `/?v=${n}&=${encodeURIComponent(e)}`, Ar.has(e) ? (r.textContent = Ar.get(e), r) : (r.textContent = "Loading…", kr(e).then((n) => {
		Ar.set(e, n), r.textContent = n;
		let i = t.getPopup();
		i && i.isOpen() && i.update();
	}), r);
}
var Mr = null;
function Nr() {
	return Mr ||= fetch(hr).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = br(e.s), e._e = br(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: br(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), Mr = null, [])), Mr;
}
async function Pr(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await Er(), Dr();
	let i = window.L;
	e.innerHTML = "", e.style.display = "flex", e.style.flexDirection = "column";
	let a = document.createElement("div");
	a.style.cssText = `flex:1;min-height:${n ? 16 : 30}rem;border-radius:1em;overflow:clip;`, e.appendChild(a), a.addEventListener("scroll", () => {
		a.scrollLeft = 0, a.scrollTop = 0;
	});
	let o = i.map(a).setView(n ? t[0].c : [38, -96], n ? 10 : 4), s = new ResizeObserver(() => o.invalidateSize());
	s.observe(a), i.tileLayer("https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
		minZoom: 1,
		maxZoom: 16,
		attribution: "Tiles © Esri"
	}).addTo(o), r && t.length && o.fitBounds(t.map((e) => e.c), {
		padding: [40, 40],
		maxZoom: 12
	});
	let c = Object.fromEntries(Object.entries(yr).map(([e, t]) => [e, i.divIcon({
		html: `<img class="MapPinImg" src="${gr + t}" alt="" draggable="false">`,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), l = i.layerGroup().addTo(o), u = t.map((e) => {
		let t = i.marker(e.c, { keyboard: !1 });
		return t.bindPopup(n ? e.c.join(", ") : () => jr(e.p, t)), t.on("mouseover", () => {
			t.setZIndexOffset(1e3), !n && !Ar.has(e.p) && kr(e.p).then((t) => Ar.set(e.p, t));
		}), t.on("mouseout", () => t.setZIndexOffset(0)), t;
	});
	function d(e) {
		let r = e.getTime();
		t.forEach((e, t) => {
			let i = n ? Math.min(Math.max(r, e._s), e._e) : r, a = u[t];
			if (i < e._s || i > e._e) {
				l.removeLayer(a);
				return;
			}
			let o = Tr(e, i);
			a._pin !== o && (a.setIcon(c[o] || c.c), a._pin = o), l.addLayer(a);
		});
	}
	let f = /* @__PURE__ */ new Date();
	if (n) return d(f), { destroy: () => {
		s.disconnect(), o.remove();
	} };
	let p = document.createElement("div");
	p.className = "MapControls", p.innerHTML = `
    <output class="MapDateDisplay"></output>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Year</label>
      <input type="range" class="MapYearSlider" min="1970" max="${f.getFullYear()}" style="flex:1">
    </div>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Date</label>
      <input type="range" class="MapDaySlider" min="1" max="365" style="flex:1">
      <input type="date" class="MapDatePicker" style="flex-shrink:0;margin-left:0.75em">
    </div>
  `, e.appendChild(p);
	let m = p.querySelector(".MapYearSlider"), h = p.querySelector(".MapDaySlider"), g = p.querySelector(".MapDatePicker"), _ = p.querySelector(".MapDateDisplay");
	function v() {
		let e = Cr(+m.value) ? 366 : 365;
		h.max = e, +h.value > e && (h.value = e);
	}
	function y() {
		let e = new Date(+m.value, 0);
		e.setDate(+h.value), _.textContent = `${xr(e.getMonth() + 1)}/${xr(e.getDate())}/${e.getFullYear()}`, g.value = Sr(e), d(e);
	}
	let b = null;
	function x() {
		b ||= requestAnimationFrame(() => {
			b = null, y();
		});
	}
	return m.addEventListener("input", () => {
		v(), x();
	}), h.addEventListener("input", x), g.addEventListener("change", () => {
		if (!g.value) return;
		let e = /* @__PURE__ */ new Date(g.value + "T00:00:00");
		m.value = e.getFullYear(), v(), h.value = wr(e), x();
	}), m.value = f.getFullYear(), v(), h.value = wr(f), y(), { destroy: () => {
		s.disconnect(), o.remove();
	} };
}
//#endregion
//#region src/GlobalFunctions.jsx
var Fr = /*#__PURE__*/ P("<a><img alt loading=lazy class>", !0, !1, !1), Ir = /*#__PURE__*/ P("<a class=CardImageExcerpt>Error?"), Lr = /*#__PURE__*/ P("<a class=CardImageExcerpt>No Article Content. Come write some!"), Rr = /*#__PURE__*/ P("<a class=CardImageExcerpt>"), zr = /*#__PURE__*/ P("<mark>"), Br = /*#__PURE__*/ P("<div class=\"MapContainer fade-in\">"), Vr = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), Hr = [
	"",
	"Jan. ",
	"Feb. ",
	"Mar. ",
	"Apr. ",
	"May ",
	"Jun. ",
	"Jul. ",
	"Aug. ",
	"Sep. ",
	"Oct. ",
	"Nov. ",
	"Dec."
], Ur = [
	"2zcr9lyoaq2ifmmf",
	"bds7nm5tkdgnikq4",
	"w4vtcv03ctirl55h"
];
async function Wr(e) {
	if (!e) return { type: "home" };
	try {
		let t = await fetch(`/content/${e}/meta.json`), n = t.headers.get("content-type") || "";
		return !t.ok || !n.includes("json") ? {
			type: "notfound",
			folderID: e
		} : {
			type: "article",
			folderID: e,
			...await t.json()
		};
	} catch {
		return {
			type: "notfound",
			folderID: e
		};
	}
}
async function q(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Gr(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function J(e) {
	return (await Tt())[e] ?? null;
}
function Kr() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function Y(e) {
	return `/?v=${Kr()}&=${e}`;
}
function qr(e) {
	return `/?v=${Kr()}&user=${encodeURIComponent(e)}`;
}
var Jr = null;
function Yr() {
	return Jr ??= kt().then((e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) for (let e of [
			n.fu,
			n.name,
			n.fn
		]) {
			let r = (e || "").trim().toLowerCase();
			r && !t.has(r) && t.set(r, n);
		}
		return t;
	}), Jr;
}
var Xr = null;
function Zr() {
	return Xr ??= kt().then((e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) for (let e of n.articles || []) t.has(e) || t.set(e, []), t.get(e).push(n);
		return t;
	}), Xr;
}
function Qr(e) {
	return e ? e.replace("T", " ").replace(/:\d\dZ$/, " UTC") : "???";
}
function X(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Hr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function $r(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Hr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function ei(e) {
	return e ? (() => {
		var t = Fr(), n = t.firstChild;
		return $e((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), C(() => F(t, "href", Y(e))), t;
	})() : null;
}
function ti(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function ni(e, t = 160) {
	let n = await J(e.title);
	if (!n) return (() => {
		var e = Ir();
		return C(() => F(e, "href", Y(n))), e;
	})();
	let r = await q(n) || await Gr(n);
	if (!r) return (() => {
		var e = Lr();
		return C(() => F(e, "href", Y(n))), e;
	})();
	let i = ti(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = Lr();
		return C(() => F(e, "href", Y(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = Rr();
		return L(e, a), C(() => F(e, "href", Y(n))), e;
	})();
}
function Z(e, t = null, n) {
	try {
		let r = localStorage.getItem(e);
		if (r === null) return t;
		let i = typeof t == "string" ? r : JSON.parse(r);
		return n && !n(i) ? t : i;
	} catch {
		return t;
	}
}
function Q(e, t) {
	try {
		return localStorage.setItem(e, typeof t == "string" ? t : JSON.stringify(t)), !0;
	} catch {
		return !1;
	}
}
var ri = () => Z("Pins", Ur, Array.isArray);
function ii(e) {
	let t = ri(), n = t.includes(e) ? t.filter((t) => t !== e) : [...t, e];
	return Q("Pins", n), n.includes(e);
}
async function ai(e) {
	let t = await J(e.title);
	if (!t) return null;
	let n = null;
	if (e?.pageThumbnailFile ? n = await J(e.pageThumbnailFile) : await new Promise((e) => {
		let n = new Image();
		n.onload = () => e(!0), n.onerror = () => {
			let n = new Image();
			n.onload = () => e(!0), n.onerror = () => e(!1), n.src = `/content/${t}/photo.avif`;
		}, n.src = `/content/${t}/lowphoto.avif`;
	}) && (n = t), !n) return null;
	let r = async (e) => {
		let [n, r] = await Promise.all([q(t).catch(() => ""), Gr(t).catch(() => "")]), i = await di(n || r || "");
		e.alt = (new DOMParser().parseFromString(K.parse(i), "text/html").body.textContent || "").trim();
	};
	return (() => {
		var e = Fr(), i = e.firstChild;
		return $e((e) => {
			let t = `/content/${n}/lowphoto.avif`, i = `/content/${n}/photo.avif`;
			e.onload = () => {
				e.onload = null;
				let t = new Image();
				t.onload = () => e.src = i, t.src = i;
			}, e.onerror = () => {
				e.onerror = null, e.src = i;
			}, e.src = t, r(e);
		}, i), C(() => F(e, "href", Y(t))), e;
	})();
}
var oi = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function si(e, t) {
	let n = (e || "").replace(/[‘’]/g, "'"), r = [...new Set((t || []).filter((e) => e.length > 1))].sort((e, t) => t.length - e.length);
	if (!r.length || !n) return [{
		text: n,
		hit: !1
	}];
	let i = RegExp(`(${r.map(oi).join("|")})`, "gi");
	return n.split(i).map((e, t) => ({
		text: e,
		hit: t % 2 == 1
	})).filter((e) => e.text);
}
function ci(e, t) {
	return !t || !t.length ? e : si(e, t).map((e) => e.hit ? (() => {
		var t = zr();
		return L(t, () => e.text), t;
	})() : e.text);
}
function li(e) {
	return new Date(e).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function ui(e) {
	return (() => {
		var t = Br();
		return $e((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function di(e) {
	let t = e.split(/(```[\s\S]*?```|`[^`\n]*`)/);
	return (await Promise.all(t.map(async (e, t) => {
		if (t % 2) return e;
		let n = [...e.matchAll(/(?<![\]\\])\[([^\[\]\n]+)\](?![(\[:])/g)], r = await Promise.all(n.map(async (e) => {
			let t = e[1].trim();
			if (!t || /^[xX]$/.test(t)) return e[0];
			if (/^\d+$/.test(t)) return `<sup><a href="#cite-${t}">(${t})</a></sup>`;
			let n = await J(t);
			return n ? `[${t}](${Y(n)})` : `<span class="BadLink">${t}</span>`;
		})), i = "", a = 0;
		return n.forEach((t, n) => {
			i += e.slice(a, t.index) + r[n], a = t.index + t[0].length;
		}), i + e.slice(a);
	}))).join("");
}
async function fi(e) {
	if (!Vr.has((e?.type || "").toLowerCase())) return null;
	let t = await J(e?.title);
	if (!t) return null;
	let n = (await Nr()).find((e) => e.p === t);
	return n ? ui((e) => Pr(e, [n], { single: !0 })) : null;
}
async function pi() {
	let e = await Nr();
	return e.length ? ui((t) => Pr(t, e)) : null;
}
//#endregion
//#region src/SearchPage.jsx
var mi = /*#__PURE__*/ P("<mark>"), hi = /*#__PURE__*/ P("<img alt loading=lazy>", !0, !1, !1), gi = /*#__PURE__*/ P("<button type=button class=\"ResultTag ResultTagMore\">. . ."), _i = /*#__PURE__*/ P("<div class=ResultTags>"), vi = /*#__PURE__*/ P("<a class=ResultTag>"), yi = /*#__PURE__*/ P("<strong>"), bi = /*#__PURE__*/ P("<span class=ResultTime>"), xi = /*#__PURE__*/ P("<div class=ResultSummary>"), Si = /*#__PURE__*/ P("<div class=\"Result ResultList fade-in\"><div class=ResultThumb><a></a></div><div class=ResultBody><div class=ResultTitle><a></a></div><div class=ResultDates>"), Ci = /*#__PURE__*/ P("<div>"), wi = /*#__PURE__*/ P("<button type=button class=PinButton>Prev"), Ti = /*#__PURE__*/ P("<button type=button class=PinButton>Next"), Ei = /*#__PURE__*/ P("<div class=SearchPager>"), Di = /*#__PURE__*/ P("<span>…"), Oi = /*#__PURE__*/ P("<button type=button class=PinButton>"), ki = /*#__PURE__*/ P("<ul class=SearchSuggestions>"), Ai = /*#__PURE__*/ P("<div class=SearchBar><div class=SearchBarField><input class=SearchInput type=text autocomplete=off></div><button type=button class=SearchButton>Search"), ji = /*#__PURE__*/ P("<span class=SearchChip><button type=button class=SearchChipRemove>×"), Mi = /*#__PURE__*/ P("<li class=SearchSuggestion> <span class=SearchCount>"), Ni = /*#__PURE__*/ P("<div class=\"NoContent fade-in\">Nothing found."), Pi = /*#__PURE__*/ P("<div class=SearchLayout><aside class=SearchSidebar><div class=SearchFilterGroup><label>Sort: <select id=sSort></select></label><label>Display: <select id=sResultView></select></label><label>Tags: <select id=sTagMode></select></label></div><div class=\"SearchFilterGroup SearchTypeGroup\"></div></aside><main class=SearchResults><div class=SearchStatus>"), Fi = /*#__PURE__*/ P("<div class=SearchPage>"), Ii = /*#__PURE__*/ P("<div class=SearchStatus>Loading search…"), Li = /*#__PURE__*/ P("<option>"), Ri = /*#__PURE__*/ P("<li>…"), zi = /*#__PURE__*/ P("<ul class=SearchTypePreview>"), Bi = /*#__PURE__*/ P("<div class=SearchTypeFilter><button type=button class=SearchTypeButton> (<!>)"), Vi = /*#__PURE__*/ P("<li>"), Hi = "/viewers/cep-solid/compiled-json/search.sqlite", Ui = "/viewers/cep-solid/compiled-json/sqlite.worker.js", Wi = "/viewers/cep-solid/compiled-json/sql-wasm.wasm", Gi = 1024, Ki = 3e3, qi = 24, Ji = 8, Yi = 5, Xi = 200, Zi = .5, Qi = [
	["relevancy", "Relevancy"],
	["oldest", "Oldest → Newest"],
	["newest", "Newest → Oldest"],
	["newest-updated", "Recently Updated"],
	["oldest-updated", "Least Recently Updated"],
	["most-views", "Most Views"],
	["least-views", "Least Views"]
], $i = Qi.map(([e]) => e), ea = [["or", "OR Search"], ["and", "AND Search"]], ta = ea.map(([e]) => e), na = "var(--primary)", ra = Object.fromEntries(Object.entries({
	"#4a7bd1": [
		"animatronic shows",
		"stage variations",
		"animatronics",
		"animatronic parts",
		"animatronic preservation",
		"retrofits"
	],
	"#6354c7": [
		"showtapes",
		"live shows",
		"showbiz pizza programs",
		"showtape formats",
		"family vision"
	],
	"#d25931": [
		"locations",
		"cancelled locations",
		"remodels and initiatives",
		"arcades and attractions",
		"store fixtures",
		"menu items",
		"tickets",
		"tokens",
		"walkarounds",
		"employee wear"
	],
	"#0d9488": [
		"in-store merchandise",
		"movies",
		"video games",
		"products",
		"simulators"
	],
	"#db7e2d": [
		"animatronic control systems",
		"programming systems",
		"other systems",
		"company media",
		"puppets",
		"documents"
	],
	"#607f77ff": [
		"social media and websites",
		"ad vehicles",
		"events",
		"commercials"
	],
	"#2e8857ff": [
		"companies/brands",
		"history",
		"characters",
		"news footage"
	]
}).flatMap(([e, t]) => t.map((t) => [t, e]))), ia = (e) => ra[(e || "").toLowerCase()] || na, aa = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"theories",
	"meta",
	"transcriptions"
]), oa = null, sa = null, ca = null, la = /* @__PURE__ */ new Map();
async function ua() {
	return oa ||= await (await fetch("/viewers/cep-solid/compiled-json/tags.json")).json(), oa;
}
var da = (e) => (e || "").toLowerCase().replace(/[‘’]/g, "'"), fa = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), pa = (e) => `'${e.replace(/'/g, "''")}'`, $ = (...e) => console.log("[search-debug]", ...e);
async function ma(e, t, n) {
	$("db url", e), $("worker url", t.slice(0, 80)), $("wasm url", n.slice(0, 80));
	try {
		let t = await fetch(e, { headers: { Range: "bytes=0-99" } });
		$("range request", {
			status: t.status,
			acceptRanges: t.headers.get("accept-ranges"),
			contentRange: t.headers.get("content-range"),
			contentEncoding: t.headers.get("content-encoding"),
			contentLength: t.headers.get("content-length"),
			contentType: t.headers.get("content-type")
		});
	} catch (e) {
		$("range request FAILED", e?.message || e);
	}
}
async function ha(e, t) {
	let n = pa(t), r = [
		["sqlite version", "SELECT sqlite_version() AS v"],
		["chunk row count", "SELECT count(*) AS n FROM chunks"],
		["match only", `SELECT folder FROM chunks WHERE chunks MATCH ${n} LIMIT 3`],
		["match + rank", `SELECT folder, rank FROM chunks WHERE chunks MATCH ${n} ORDER BY rank LIMIT 3`],
		["match + snippet", `SELECT folder, snippet(chunks, 0, char(1), char(2), '…', ${qi}) AS found FROM chunks WHERE chunks MATCH ${n} LIMIT 3`]
	];
	$("fts match string:", t);
	for (let [t, n] of r) try {
		$(t, await e.db.query(n));
	} catch (e) {
		$(t, "FAILED", e?.message || e);
	}
}
function ga(e) {
	return [...(e || "").matchAll(/"([^"]*)"|(\S+)/g)].map((e) => da(e[1] ?? e[2]).trim()).filter(Boolean);
}
function _a(e, t = "phrase") {
	let n = (e) => da(e).replace(/"/g, "").replace(/\s+/g, " ").trim();
	if (t === "phrase") {
		if ((e || "").includes("\"")) return ga(e).map(n).filter(Boolean).map((e) => `"${e}" *`).join(" ");
		let t = n(e);
		return t ? `"${t}" *` : "";
	}
	return ga(e).flatMap((e) => e.split(/\s+/)).map(n).filter(Boolean).map((e) => `"${e}" *`).join(t === "or" ? " OR " : " ");
}
function va(e) {
	let t = `  ${e}  `, n = /* @__PURE__ */ new Set();
	for (let e = 0; e < t.length - 2; e++) n.add(t.slice(e, e + 3));
	return n;
}
function ya(e, t) {
	let [n, r] = e.size <= t.size ? [e, t] : [t, e], i = 0;
	for (let e of n) r.has(e) && i++;
	return 2 * i / (e.size + t.size);
}
function ba(e) {
	return (e || "").split(/(\u0001[^\u0002]*\u0002)/).map((e) => e.startsWith("") ? {
		text: e.slice(1, -1),
		hit: !0
	} : {
		text: e,
		hit: !1
	}).filter((e) => e.text);
}
function xa(e = [], t = "") {
	let n = new URLSearchParams({
		v: Kr(),
		page: "search"
	});
	return e.length && n.set("tags", e.join("|")), t && n.set("q", t), `/?${n.toString()}`;
}
function Sa() {
	let e = new URLSearchParams(location.search);
	return {
		tags: (e.get("tags") || "").split("|").map((e) => e.trim()).filter(Boolean),
		q: (e.get("q") || "").trim()
	};
}
function Ca() {
	return sa ||= Promise.all([
		ua(),
		bt(),
		Dt(),
		jt(),
		Et(),
		St(),
		Tt()
	]).then(([e, t, n, r, i, a, o]) => {
		let s = {};
		for (let [e, t] of Object.entries(n)) for (let n of t) s[n] = e;
		let c = Object.keys(e);
		return {
			tagMap: e,
			idTags: t,
			typeMap: n,
			views: r,
			idTitle: i,
			sortKeys: a,
			idType: s,
			allIds: Object.keys(s),
			types: Object.keys(n).sort(),
			tagPairs: c.map((e) => [e.toLowerCase(), e]),
			tagLookup: Object.fromEntries(c.map((e) => [e.toLowerCase(), e])),
			titleLookup: Object.fromEntries(Object.entries(o).map(([e, t]) => [e.toLowerCase(), t])),
			titleIndex: null
		};
	}), sa;
}
function wa() {
	if (!ca) {
		let t = new URL(Hi, location.origin).href, n = new URL(Ui, location.origin).href, r = new URL(Wi, location.origin).href;
		ma(t, n, r), ca = import("./dist-DRMIypK3.js").then((t) => /* @__PURE__ */ e(t.default, 1)).then(({ createDbWorker: e }) => e([{
			from: "inline",
			config: {
				serverMode: "full",
				requestChunkSize: Gi,
				url: t
			}
		}], n, r)).then((e) => ($("search.sqlite worker", e ? "opened" : "missing"), e)).catch((e) => (console.error("Search: failed to open search.sqlite", e), $("open failed", e?.name, e?.message, e?.stack), ca = null, null));
	}
	return ca;
}
async function Ta(e, t) {
	try {
		let n = await e.db.query(`SELECT folder, ts, snippet(chunks, 0, char(1), char(2), '…', ${qi}) AS found FROM chunks WHERE chunks MATCH ${pa(t)} ORDER BY rank LIMIT ${Ki}`), r = /* @__PURE__ */ new Set(), i = [];
		for (let e of n) r.has(e.folder) || (r.add(e.folder), i.push({
			id: e.folder,
			ts: e.ts,
			found: e.found
		}));
		return $("query returned", n.length, "rows,", i.length, "unique articles for", t), i;
	} catch (e) {
		return console.error("Search: text query failed", e), [];
	}
}
async function Ea(e) {
	let t = ga(e);
	if (!t.length) return [];
	let n = await wa();
	if (!n) return [];
	await ha(n, _a(e));
	let r = await Ta(n, _a(e));
	if (r.length || t.length < 2) return r;
	let i = await Ta(n, _a(e, "and"));
	return i.length ? i : Ta(n, _a(e, "or"));
}
function Da(e, t) {
	let n = ga(e);
	if (!n.length) return [];
	t.titleIndex ||= Object.entries(t.idTitle).map(([e, t]) => {
		let n = da(t);
		return [
			e,
			n,
			va(n)
		];
	});
	let r = n.join(" "), i = va(r), a = [];
	for (let [e, o, s] of t.titleIndex) {
		let t = 0;
		if (n.every((e) => o.includes(e))) t = 2 + +(o === r) + (o.startsWith(r) ? .5 : 0);
		else {
			let e = ya(i, s);
			e >= Zi && (t = e);
		}
		t && a.push({
			id: e,
			score: t
		});
	}
	return a;
}
async function Oa({ tags: e, q: t }, n, r) {
	let i = null;
	if (e.length) {
		let t = e.map((e) => n.tagMap[n.tagLookup[e.toLowerCase()]] || []);
		i = r === "and" ? t.reduce((e, t) => {
			let n = new Set(t);
			return e.filter((e) => n.has(e));
		}) : [...new Set(t.flat())];
	}
	let a = t.trim();
	if (!a) return (i ?? n.allIds).map((e) => ({
		id: e,
		score: n.views[e] || 0,
		found: null
	})).sort((e, t) => t.score - e.score);
	let [o, s] = await Promise.all([Ea(a), Da(a, n)]);
	$("text hits", o.length, "title hits", s.length);
	let c = i ? new Set(i) : null, l = /* @__PURE__ */ new Map();
	o.forEach((e, t) => {
		(!c || c.has(e.id)) && l.set(e.id, {
			id: e.id,
			score: 1 - t / o.length,
			found: {
				text: e.found,
				ts: e.ts
			}
		});
	});
	for (let { id: e, score: t } of s) {
		if (c && !c.has(e)) continue;
		let n = l.get(e);
		n ? n.score += t : l.set(e, {
			id: e,
			score: t,
			found: null
		});
	}
	return [...l.values()].sort((e, t) => t.score - e.score);
}
function ka(e) {
	return la.has(e) || la.set(e, Wr(e).catch(() => ({
		type: "notfound",
		folderID: e
	}))), la.get(e);
}
async function Aa(e) {
	let [t, n] = await Promise.all([q(e).catch(() => ""), Gr(e).catch(() => "")]), r = (t || n || "").replace(/\{\d+:\d\d(?::\d\d)?\}/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[\[\]#*_`>]/g, "").replace(/\s+/g, " ").trim();
	return r ? r.length <= Xi ? r : `${r.slice(0, r.slice(0, Xi).lastIndexOf(" "))}…` : "";
}
function ja(e, t, n) {
	let r = (e) => {
		let t = n.indexOf(e.id);
		return t < 0 ? n.length : t;
	}, i = (e) => t.views[e.id] || 0, a = (e) => t.sortKeys[e.id]?.[0] || 0, o = (e) => t.sortKeys[e.id]?.[1] || 0, s = (e) => (t, n) => {
		let r = a(t), i = a(n);
		return r === i ? 0 : r ? i ? e * (r - i) : -1 : 1;
	};
	switch (e) {
		case "oldest": return s(1);
		case "newest": return s(-1);
		case "newest-updated": return (e, t) => o(t) - o(e);
		case "oldest-updated": return (e, t) => o(e) - o(t);
		case "most-views": return (e, t) => i(t) - i(e);
		case "least-views": return (e, t) => i(e) - i(t);
		default: return (e, t) => r(e) - r(t);
	}
}
function Ma(e) {
	return N(() => ci(e.text, e.words));
}
function Na(e) {
	return A(j, {
		get each() {
			return ba(e.text);
		},
		children: (e) => e.hit ? (() => {
			var t = mi();
			return L(t, () => e.text), t;
		})() : e.text
	});
}
function Pa(e) {
	return (() => {
		var t = hi();
		return $e((t) => {
			let n = `/content/${e.id}/lowphoto.avif`, r = `/content/${e.id}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => {
				t.onerror = () => t.style.visibility = "hidden", t.src = r;
			}, t.src = n;
		}, t), t;
	})();
}
function Fa(e) {
	let [t, n] = S(!1), r = () => t() ? e.tags : e.tags.slice(0, Yi), i = () => new Set((e.active || []).map((e) => e.toLowerCase()));
	return A(M, {
		get when() {
			return e.tags?.length;
		},
		get children() {
			var a = _i();
			return L(a, A(j, {
				get each() {
					return r();
				},
				children: (e) => (() => {
					var t = vi();
					return L(t, e), C((n) => {
						var r = !!i().has(e.toLowerCase()), a = xa([e]);
						return r !== n.e && t.classList.toggle("active", n.e = r), a !== n.t && F(t, "href", n.t = a), n;
					}, {
						e: void 0,
						t: void 0
					}), t;
				})()
			}), null), L(a, A(M, {
				get when() {
					return N(() => !t())() && e.tags.length > Yi;
				},
				get children() {
					var e = gi();
					return e.$$click = () => n(!0), e;
				}
			}), null), a;
		}
	});
}
function Ia(e) {
	let t = e.entry.id, [n] = T(() => ka(t)), [r] = T(() => n(), async (e) => e.pageThumbnailFile ? await J(e.pageThumbnailFile) : t), i = () => (n()?.type || e.data.idType[t] || "").toLowerCase(), a = () => i() === "photos", [o] = T(() => e.entry.found || a() ? !1 : t, Aa), [s] = T(() => a() ? t : !1, (e) => q(e).catch(() => "")), c = () => a() && s()?.trim() || n()?.title || e.data.idTitle[t] || t, l = () => e.data.idTags[t] || [];
	return (() => {
		var s = Si(), u = s.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild, m = p.firstChild, h = p.nextSibling;
		return L(d, A(M, {
			get when() {
				return r();
			},
			get children() {
				return A(Pa, { get id() {
					return r();
				} });
			}
		})), L(m, A(Ma, {
			get text() {
				return c();
			},
			get words() {
				return e.words;
			}
		})), L(h, A(M, {
			get when() {
				return n();
			},
			get children() {
				return [
					(() => {
						var e = yi();
						return L(e, (() => {
							var e = N(() => !!aa.has(i()));
							return () => e() ? X(n().startDate) : [
								N(() => X(n().startDate)),
								" – ",
								N(() => $r(n().endDate))
							];
						})()), e;
					})(),
					" ",
					"👁",
					N(() => e.data.views[t] || 0)
				];
			}
		})), L(f, A(Fa, {
			get tags() {
				return l();
			},
			get active() {
				return e.tags;
			}
		}), null), L(f, A(M, {
			get when() {
				return !a();
			},
			get children() {
				var t = xi();
				return L(t, A(M, {
					get when() {
						return e.entry.found;
					},
					get fallback() {
						return A(M, {
							get when() {
								return !o.loading;
							},
							get children() {
								return o();
							}
						});
					},
					get children() {
						return [A(M, {
							get when() {
								return e.entry.found.ts;
							},
							get children() {
								return [(() => {
									var t = bi();
									return L(t, () => e.entry.found.ts), t;
								})(), " "];
							}
						}), A(Na, { get text() {
							return e.entry.found.text;
						} })];
					}
				})), t;
			}
		}), null), C((e) => {
			var n = Y(t), r = Y(t);
			return n !== e.e && F(d, "href", e.e = n), r !== e.t && F(m, "href", e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), s;
	})();
}
function La(e) {
	return (t) => {
		let [n] = T(() => ka(t.entry.id)), [r] = T(() => n()?.title ? n() : !1, (n) => e(n, t.words));
		return A(M, {
			get when() {
				return r();
			},
			get children() {
				return r();
			}
		});
	};
}
var Ra = {
	"Detailed List": {
		item: Ia,
		wrapper: ""
	},
	Cards: {
		item: (e) => A(Ll, {
			get id() {
				return e.entry.id;
			},
			get words() {
				return e.words;
			},
			render: eu
		}),
		wrapper: "ResultCards"
	},
	Compact: {
		item: La(Ou),
		wrapper: "ResultCompact"
	},
	List: {
		item: La(ku),
		wrapper: "ResultPlain"
	}
}, za = Object.keys(Ra);
function Ba(e) {
	let t = () => Ra[e.shared.view];
	return (() => {
		var n = Ci();
		return L(n, A(j, {
			get each() {
				return e.items;
			},
			children: (n) => A(ht, {
				get component() {
					return t().item;
				},
				entry: n,
				get data() {
					return e.shared.data;
				},
				get words() {
					return e.shared.words;
				},
				get tags() {
					return e.shared.tags;
				}
			})
		})), C(() => I(n, t().wrapper)), n;
	})();
}
function Va(e) {
	let t = () => {
		let t = [], n = -1;
		for (let r = 0; r < e.pages; r++) (r === 0 || r === e.pages - 1 || Math.abs(r - e.page) <= 2) && (n >= 0 && r - n > 1 && t.push(-1), t.push(r), n = r);
		return t;
	};
	return A(M, {
		get when() {
			return e.pages > 1;
		},
		get children() {
			var n = Ei();
			return L(n, A(M, {
				get when() {
					return e.page > 0;
				},
				get children() {
					var t = wi();
					return t.$$click = () => e.onPage(e.page - 1), t;
				}
			}), null), L(n, A(j, {
				get each() {
					return t();
				},
				children: (t) => t < 0 ? Di() : (() => {
					var n = Oi();
					return n.$$click = () => e.onPage(t), L(n, t + 1), C((r) => {
						var i = t === e.page, a = t === e.page;
						return i !== r.e && n.classList.toggle("active", r.e = i), a !== r.t && F(n, "aria-pressed", r.t = a), r;
					}, {
						e: void 0,
						t: void 0
					}), n;
				})()
			}), null), L(n, A(M, {
				get when() {
					return e.page < e.pages - 1;
				},
				get children() {
					var t = Ti();
					return t.$$click = () => e.onPage(e.page + 1), t;
				}
			}), null), n;
		}
	});
}
function Ha(e) {
	let [t, n] = S(e.value.tags), [r, i] = S(e.value.q), [a, o] = S(-1), [s, c] = S(!1), l;
	te(() => {
		let t = e.value;
		n(t.tags), i(t.q);
	});
	let u = w(() => {
		let n = r().trim().toLowerCase();
		if (!n) return [];
		let i = new Set(t().map((e) => e.toLowerCase())), a = [];
		for (let [t, r] of e.data.tagPairs) t.includes(n) && !i.has(t) && a.push({
			name: r,
			rank: +!t.startsWith(n),
			count: e.data.tagMap[r].length
		});
		return a.sort((e, t) => e.rank - t.rank || t.count - e.count || e.name.length - t.name.length), a.slice(0, Ji);
	});
	function d(e) {
		t().some((t) => t.toLowerCase() === e.toLowerCase()) || n([...t(), e]), i(""), o(-1), l?.focus();
	}
	function f(e) {
		n(t().filter((t) => t !== e)), l?.focus();
	}
	function p() {
		o(-1), e.onSubmit({
			tags: t(),
			q: r().trim()
		});
	}
	function m(e) {
		let i = u();
		if (e.key === "ArrowDown" || e.key === "Tab" && !e.shiftKey && i.length) {
			if (!i.length) return;
			e.preventDefault(), o((a() + 1) % i.length);
		} else if (e.key === "ArrowUp" || e.key === "Tab" && e.shiftKey && i.length) {
			if (!i.length) return;
			e.preventDefault(), o(a() <= 0 ? i.length - 1 : a() - 1);
		} else e.key === "Enter" ? (e.preventDefault(), a() >= 0 && i[a()] ? d(i[a()].name) : p()) : e.key === "Escape" ? (o(-1), c(!1)) : e.key === "Backspace" && !r() && t().length && n(t().slice(0, -1));
	}
	return (() => {
		var e = Ai(), n = e.firstChild, h = n.firstChild, g = n.nextSibling;
		n.$$click = () => l?.focus(), L(n, A(j, {
			get each() {
				return t();
			},
			children: (e) => (() => {
				var t = ji(), n = t.firstChild;
				return L(t, e, n), n.$$click = () => f(e), F(n, "aria-label", `Remove ${e}`), t;
			})()
		}), h), h.addEventListener("blur", () => c(!1)), h.addEventListener("focus", () => c(!0)), h.$$keydown = m, h.$$input = (e) => {
			i(e.target.value), o(-1);
		};
		var _ = l;
		return typeof _ == "function" ? $e(_, h) : l = h, L(n, A(M, {
			get when() {
				return N(() => !!s())() && u().length;
			},
			get children() {
				var e = ki();
				return L(e, A(j, {
					get each() {
						return u();
					},
					children: (e, t) => (() => {
						var n = Mi(), r = n.firstChild, i = r.nextSibling;
						return n.$$mousedown = (t) => {
							t.preventDefault(), d(e.name);
						}, L(n, () => e.name, r), L(i, () => e.count), C(() => n.classList.toggle("active", a() === t())), n;
					})()
				})), e;
			}
		}), null), g.$$click = p, C(() => F(h, "placeholder", t().length ? "Add tags or search text…" : "Search articles, or type to find a tag…")), C(() => h.value = r()), e;
	})();
}
function Ua() {
	let [e, t] = S(Sa()), [n, r] = S(Z("sSort", "relevancy", (e) => $i.includes(e))), [i, a] = S(Z("sResultView", za[0], (e) => za.includes(e))), [o, s] = S(Z("sTagMode", ta[0], (e) => ta.includes(e))), [c, l] = S(""), [u, d] = S(null), [f, p] = S(0), [m] = T(Ca), [h] = T(() => m() ? {
		...e(),
		mode: o()
	} : !1, (e) => Oa(e, m(), e.mode)), g = w(() => m() ? e().tags.map((e) => m().titleLookup[e.toLowerCase()]).filter(Boolean) : []), _ = w(() => m() ? ja(n(), m(), g()) : () => 0), v = w(() => {
		let e = /* @__PURE__ */ new Map();
		if (!m() || h.loading) return e;
		for (let t of h() || []) {
			let n = m().idType[t.id] || "other";
			e.has(n) || e.set(n, []), e.get(n).push(t);
		}
		return new Map([...e].sort((e, t) => t[1].length - e[1].length || e[0].localeCompare(t[0])));
	}), y = w(() => [...v()].flatMap(([, e]) => e)), b = w(() => [{
		key: "",
		label: "All",
		list: y()
	}, ...[...v()].map(([e, t]) => ({
		key: e,
		label: fa(e),
		list: t
	}))]), x = () => c() === "" || v().has(c()) ? c() : "", ee = w(() => [...x() === "" ? y() : v().get(x()) || []].sort(_())), ne = (e) => [...e].sort(_()).slice(0, 3).map((e) => m().idTitle[e.id] || e.id), ie = w(() => ({
		data: m(),
		words: ga(e().q),
		tags: e().tags,
		view: i()
	}));
	te(() => Q("sSort", n())), te(() => Q("sResultView", i())), te(() => Q("sTagMode", o()));
	let ae = () => t(Sa());
	window.addEventListener("popstate", ae), re(() => window.removeEventListener("popstate", ae));
	let oe = () => ee().length, se = () => Math.max(1, Math.ceil(oe() / 50)), D = () => ee().slice(f() * 50, (f() + 1) * 50);
	te(() => {
		ee(), E(() => p(0));
	});
	function ce(e) {
		p(e), window.scrollTo({ top: 0 });
	}
	function le(e) {
		history.pushState(null, "", xa(e.tags, e.q)), t(e);
	}
	return (() => {
		var t = Fi();
		return L(t, A(M, {
			get when() {
				return m();
			},
			get fallback() {
				return Ii();
			},
			get children() {
				return [A(Ha, {
					get data() {
						return m();
					},
					get value() {
						return e();
					},
					onSubmit: le
				}), (() => {
					var e = Pi(), t = e.firstChild, c = t.firstChild, p = c.firstChild, m = p.firstChild.nextSibling, g = p.nextSibling, _ = g.firstChild.nextSibling, v = g.nextSibling.firstChild.nextSibling, y = c.nextSibling, S = t.nextSibling, ee = S.firstChild;
					return m.addEventListener("change", (e) => r(e.target.value)), L(m, A(j, {
						each: Qi,
						children: ([e, t]) => (() => {
							var r = Li();
							return r.value = e, L(r, t), C(() => r.selected = n() === e), r;
						})()
					})), _.addEventListener("change", (e) => a(e.target.value)), L(_, A(j, {
						each: za,
						children: (e) => (() => {
							var t = Li();
							return t.value = e, L(t, e), C(() => t.selected = i() === e), t;
						})()
					})), v.addEventListener("change", (e) => s(e.target.value)), L(v, A(j, {
						each: ea,
						children: ([e, t]) => (() => {
							var n = Li();
							return n.value = e, L(n, t), C(() => n.selected = o() === e), n;
						})()
					})), L(y, A(j, {
						get each() {
							return b();
						},
						children: (e) => (() => {
							var t = Bi(), n = t.firstChild, r = n.firstChild, i = r.nextSibling;
							return i.nextSibling, t.addEventListener("mouseleave", () => d(null)), n.$$click = () => {
								l(e.key), d(e.key), document.activeElement?.blur();
							}, L(n, () => e.label, r), L(n, () => e.list.length, i), L(t, A(M, {
								get when() {
									return N(() => e.key !== "")() && e.list.length;
								},
								get children() {
									var t = zi();
									return L(t, A(j, {
										get each() {
											return ne(e.list);
										},
										children: (e) => (() => {
											var t = Vi();
											return L(t, e), t;
										})()
									}), null), L(t, A(M, {
										get when() {
											return e.list.length > 3;
										},
										get children() {
											return Ri();
										}
									}), null), t;
								}
							}), null), C((r) => {
								var i = u() === e.key, a = x() === e.key, o = ia(e.key), s = x() === e.key;
								return i !== r.e && t.classList.toggle("quiet", r.e = i), a !== r.t && n.classList.toggle("active", r.t = a), o !== r.a && Ze(n, "--chip", r.a = o), s !== r.o && F(n, "aria-pressed", r.o = s), r;
							}, {
								e: void 0,
								t: void 0,
								a: void 0,
								o: void 0
							}), t;
						})()
					})), L(ee, A(M, {
						get when() {
							return !h.loading;
						},
						fallback: "Searching. . . Please be patient, your own PC/Phone is computing this not any server!",
						get children() {
							return `${oe()} result${oe() === 1 ? "" : "s"}`;
						}
					})), L(S, A(M, {
						get when() {
							return !h.loading;
						},
						get children() {
							return [
								A(M, {
									get when() {
										return f() > 0;
									},
									get children() {
										return A(Va, {
											get page() {
												return f();
											},
											get pages() {
												return se();
											},
											onPage: ce
										});
									}
								}),
								A(Ba, {
									get items() {
										return D();
									},
									get shared() {
										return ie();
									}
								}),
								A(Va, {
									get page() {
										return f();
									},
									get pages() {
										return se();
									},
									onPage: ce
								}),
								A(M, {
									get when() {
										return oe() === 0;
									},
									get children() {
										return Ni();
									}
								})
							];
						}
					}), null), e;
				})()];
			}
		})), t;
	})();
}
Ge([
	"click",
	"input",
	"keydown",
	"mousedown"
]);
//#endregion
//#region src/Renderers.jsx
var Wa = /*#__PURE__*/ P("<span>"), Ga = /*#__PURE__*/ P("<img class=UserAvatar>"), Ka = /*#__PURE__*/ P("<div class=UserBubble>"), qa = /*#__PURE__*/ P("<div class=UserCard><a class=UserLink><span class=UserLabel><span class=UserName></span><span class=UserCount>(+<!>)"), Ja = /*#__PURE__*/ P("<div>Loading…"), Ya = /*#__PURE__*/ P("<div class=NoContent>No user found with that name."), Xa = /*#__PURE__*/ P("<img class=UserProfileAvatar>"), Za = /*#__PURE__*/ P("<a target=_blank rel=\"noopener noreferrer\">"), Qa = /*#__PURE__*/ P("<div class=UserProfileBio>"), $a = /*#__PURE__*/ P("<div class=UserProfileJoined>Joined "), eo = /*#__PURE__*/ P("<div class=\"UserProfile fade-in\"><div class=UserBanner></div><div class=UserProfileHead><div><h1 class=article-title></h1><div><span class=UserRank> (+<!>)</span></div></div></div><div class=ArticleTabs></div><div class=\"TaggedList fade-in\">"), to = /*#__PURE__*/ P("<button type=button class=PinButton> (<!>)"), no = /*#__PURE__*/ P("<div class=ResultCards>"), ro = /*#__PURE__*/ P("<div class=ResultCompact>"), io = /*#__PURE__*/ P("<div>"), ao = /*#__PURE__*/ P("<img>"), oo = /*#__PURE__*/ P("<a class=CitationTitle target=_blank rel=noopener>. "), so = /*#__PURE__*/ P("<a class=CitationUrl target=_blank rel=noopener>"), co = /*#__PURE__*/ P("<div class=CitationItem><div class=CitationIcon></div><div class=CitationText>"), lo = /*#__PURE__*/ P("<span class=CitationTitle>. "), uo = /*#__PURE__*/ P("<div class=ResultTags>"), fo = /*#__PURE__*/ P("<span class=ChangeAdd>+"), po = /*#__PURE__*/ P("<span class=ChangeDel>-"), mo = /*#__PURE__*/ P("<div class=Citations><h2>Citations"), ho = /*#__PURE__*/ P("<h2>Tags"), go = /*#__PURE__*/ P("<h2>Contributors"), _o = /*#__PURE__*/ P("<div class=UserCards>"), vo = /*#__PURE__*/ P("<button type=button class=PinButton>📌"), yo = /*#__PURE__*/ P("<div class=ArticleTabs><a class=PinButton>Edit Page"), bo = /*#__PURE__*/ P("<a>"), xo = /*#__PURE__*/ P("<th>End"), So = /*#__PURE__*/ P("<div class=InventoryTableWrap><table class=InventoryTable><thead><tr><th></th><th>Start</th></tr></thead><tbody>"), Co = /*#__PURE__*/ P("<th>"), wo = /*#__PURE__*/ P("<td class=InventoryDate>"), To = /*#__PURE__*/ P("<tr><td></td><td class=InventoryDate>"), Eo = /*#__PURE__*/ P("<td>"), Do = /*#__PURE__*/ P("<h2>Locations"), Oo = /*#__PURE__*/ P("<div class=\"InventoryTab fade-in\">"), ko = /*#__PURE__*/ P("<h2>"), Ao = /*#__PURE__*/ P("<h3>"), jo = /*#__PURE__*/ P("<button type=button class=PinButton>Article"), Mo = /*#__PURE__*/ P("<button type=button class=PinButton>Inventory"), No = /*#__PURE__*/ P("<div class=ArticleTabs><select class=PinButton value><option value disabled hidden selected>Edit"), Po = /*#__PURE__*/ P("<div class=\"TaggedList fade-in\">"), Fo = /*#__PURE__*/ P("<option>"), Io = /*#__PURE__*/ P("<h1 class=article-title>Settings"), Lo = /*#__PURE__*/ P("<div class=SettingsNote>Holiday theme active: <!>. Your selected theme returns when the holiday period ends."), Ro = /*#__PURE__*/ P("<div class=SettingsCustomPanel><div class=SettingsColorGrid></div><div class=SettingsFontRow></div><div class=SettingsRow><label class=SettingsLabel>Logo</label><select class=SettingsSelect>"), zo = /*#__PURE__*/ P("<div class=\"SettingsPage fade-in\"><div class=SettingsSection><h2 class=SettingsSectionTitle>Theme</h2><div class=SettingsRow><label class=SettingsLabel>Holiday Theming</label><input type=checkbox class=SettingsToggle></div><div class=SettingsRow><label class=SettingsLabel>Theme</label><select class=SettingsSelect></select></div></div><div class=SettingsSection><h2 class=SettingsSectionTitle>Layout</h2><div class=SettingsRow><label class=SettingsLabel>Wide Pages</label><input type=checkbox class=SettingsToggle>"), Bo = /*#__PURE__*/ P("<div class=SettingsColorCell><label class=SettingsColorLabel></label><input type=color class=SettingsColorPicker>"), Vo = /*#__PURE__*/ P("<div class=SettingsFontCell><label class=SettingsLabel></label><select class=SettingsSelect>"), Ho = /*#__PURE__*/ P("<h1 class=article-title>Nerd Stuff"), Uo = /*#__PURE__*/ P("<div class=StatsPage>"), Wo = /*#__PURE__*/ P("<div>Loading stats…"), Go = /*#__PURE__*/ P("<div class=Citations>"), Ko = /*#__PURE__*/ P("<table class=DownloadsTable><thead><tr><th>Article</th><th>Download</th></tr></thead><tbody>"), qo = /*#__PURE__*/ P("<tr><td><a target=_blank rel=\"noopener noreferrer\">"), Jo = /*#__PURE__*/ P("<br>"), Yo = /*#__PURE__*/ P("<div class=SiteDetails><div><strong>Total Homepage Views:</strong> </div><div><strong>Total Searches:</strong> </div><h3>Homepage Views by Month</h3><ul>"), Xo = /*#__PURE__*/ P("<li>: "), Zo = /*#__PURE__*/ P("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong></strong> 👁"), Qo = /*#__PURE__*/ P("<a><img loading=lazy>", !0, !1, !1), $o = /*#__PURE__*/ P("<a class=CardImageExcerpt>"), es = /*#__PURE__*/ P("<span class=ReviewEmoji>"), ts = /*#__PURE__*/ P("<div class=\"ReviewCard fade-in\"><div class=ReviewTitle><a></a></div><div class=ReviewMeta></div><div class=ReviewBody>"), ns = /*#__PURE__*/ P("<span class=PostTime>"), rs = /*#__PURE__*/ P("<span class=PostDeleted>[Deleted]"), is = /*#__PURE__*/ P("<h3 class=PostTitle>"), as = /*#__PURE__*/ P("<div class=PostSubject>"), os = /*#__PURE__*/ P("<div class=SteamPostBox><div class=SteamAvatar></div><div class=SteamPostContent><div class=PostHeaderMeta><span class=PostAuthor>"), ss = /*#__PURE__*/ P("<span class=CommentTime>"), cs = /*#__PURE__*/ P("<blockquote class=CommentQuote>"), ls = /*#__PURE__*/ P("<div class=CommentSubject>"), us = /*#__PURE__*/ P("<div class=SteamPostBox><div class=SteamAvatar style=\"background-image:url('/viewers/cep-js/assets/Social Posts/Scott.jpg')\"></div><div class=SteamPostContent><div class=CommentHeaderMeta><span class=PostAuthor><span style=color:#aedd08>Scott</span> <span style=color:#e9d528>[developer]"), ds = /*#__PURE__*/ P("<div class=\"SteamCommentBody fade-in\"><div class=SteamCommentHeader><a></a></div><div class=SteamCommentPreview>"), fs = /*#__PURE__*/ P("<div class=LIText>"), ps = /*#__PURE__*/ P("<span class=LIHashtag>"), ms = /*#__PURE__*/ P("<span class=LIPhotoMore>+"), hs = /*#__PURE__*/ P("<a class=LIPhoto><img loading=lazy>", !0, !1, !1), gs = /*#__PURE__*/ P("<div class=LILinks>"), _s = /*#__PURE__*/ P("<a target=_blank rel=\"noopener noreferrer\">Watch on LinkedIn"), vs = /*#__PURE__*/ P("<div class=LINotice><span>▶ This post includes a video."), ys = /*#__PURE__*/ P("<div class=LINotice>📄 This post includes a document."), bs = /*#__PURE__*/ P("<div class=LINotice>📊 This post includes a poll."), xs = /*#__PURE__*/ P("<a class=LILink target=_blank rel=\"noopener noreferrer\"><span class=LILinkDomain></span><span class=LILinkUrl>"), Ss = /*#__PURE__*/ P("<div class=LIHeader><div class=LIAvatar></div><div class=LIHeaderText><div class=LIName></div><div class=LIMeta><svg class=LIGlobe viewBox=\"0 0 16 16\"width=14 height=14 aria-label=Public fill=none stroke=currentColor stroke-width=1.2><circle cx=8 cy=8 r=6.5></circle><ellipse cx=8 cy=8 rx=2.8 ry=6.5></ellipse><line x1=1.5 y1=8 x2=14.5 y2=8>"), Cs = /*#__PURE__*/ P("<a class=LIQuoteAuthor target=_blank rel=\"noopener noreferrer\">"), ws = /*#__PURE__*/ P("<div class=LIQuoteFoot><a target=_blank rel=\"noopener noreferrer\">View original post"), Ts = /*#__PURE__*/ P("<div class=LIQuote><div class=LIQuoteHead>"), Es = /*#__PURE__*/ P("<div class=LIFooter><a target=_blank rel=\"noopener noreferrer\">View on LinkedIn"), Ds = /*#__PURE__*/ P("<div class=LILoading>Loading…"), Os = /*#__PURE__*/ P("<span class=LIQuoteAuthor>Quoted post"), ks = /*#__PURE__*/ P("<span class=LIQuoteAuthor>"), As = /*#__PURE__*/ P("<div class=\"LinkedInCardWrap fade-in\"><div class=\"SteamCommentHeader LICardHeader\"><a></a></div><div class=LinkedInCard>"), js = /*#__PURE__*/ P("<h1 class=article-title>"), Ms = /*#__PURE__*/ P("<div class=\"ArticleBody type-linkedin-post\"><div class=\"LinkedInCard LinkedInArticle fade-in\">"), Ns = /*#__PURE__*/ P("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), Ps = /*#__PURE__*/ P("<div><div></div><div><div><a></a></div><div><strong></strong> 👁"), Fs = /*#__PURE__*/ P("<div><a></a><span class=ListMeta><strong></strong> 👁"), Is = /*#__PURE__*/ P("<div class=404>You've found an article that doesn't exist yet! Click the logo to head back home."), Ls = /*#__PURE__*/ P("<div class=RecentChangeThumb>"), Rs = /*#__PURE__*/ P("<div class=RecentChangeRow><div class=RecentChangeBody><div class=RecentChangeMetaLine><span>"), zs = /*#__PURE__*/ P("<div class=Homepage><center>Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!<br>Use the search above to explore our site! Something not listed here? Help contribute or <a href=\"/?v=cep-editor\">create a new page!</a><br><br><strong>11/17/26: Welcome to the new CEP remodel! <a href=\"/?v=cep-js\">click here if you need to return</a> to the old viewer. Since this layout is new, leave feedback on the <a href=https://forum.cheeseepedia.org/t/cep-solid-wiki-overhaul/485/43>forum thread</a>, as the old renderer will be phased out later on.</strong></center><h2>News</h2><h2>Wiki</h2><h2>Community"), Bs = /*#__PURE__*/ P("<div class=Carousel>"), Vs = /*#__PURE__*/ P("<nav class=Nav>"), Hs = /*#__PURE__*/ P("<details><summary></summary><div>"), Us = /*#__PURE__*/ P("<div class=NoContent>No pinned pages yet. Use the 📌 button on any page to pin it."), Ws = /*#__PURE__*/ P("<h3>Started on This Day"), Gs = /*#__PURE__*/ P("<h3>Ended on This Day"), Ks = /*#__PURE__*/ P("<div class=NoContent>No pages started or ended on this day."), qs = /*#__PURE__*/ P("<div class=RecentChanges>"), Js = /*#__PURE__*/ P("<ul>"), Ys = /*#__PURE__*/ P("<div class=RecentChangesItem><div class=ListMeta>"), Xs = /*#__PURE__*/ P("<li>"), Zs = /*#__PURE__*/ P("<div class=Footer>Last Updated: <!>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), Qs = /*#__PURE__*/ P("<div class=SplashText>"), $s = /*#__PURE__*/ P("<div class=Header><a href=\"/?v=cep-solid\"class=Logo><img alt=Cheesepedia></a><div class=FlavorText>Now at<div class=roller-container><div class=roller-track><span><strong></strong> articles</span><span><strong></strong> photos</span><span><strong></strong> videos</span><span><strong></strong> tags</span><span><strong></strong> articles</span></div></div>contributed by <strong><a href=https://forum.cheeseepedia.org/> users!</a></strong><br>"), ec = /*#__PURE__*/ P("<button class=FakeSearchBar>Search..."), tc = /*#__PURE__*/ P("<button type=button class=PinButton>"), nc = /*#__PURE__*/ P("<div class=TabPanel>"), rc = /*#__PURE__*/ P("<h2>Cheese-E-Shuffle"), ic = /*#__PURE__*/ P("<div>Nothing found."), ac = /*#__PURE__*/ P("<div id=RandomCards class=Carousel>"), oc = /*#__PURE__*/ P("<div class=infobox-list><strong>:</strong><ul>"), sc = /*#__PURE__*/ P("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), cc = /*#__PURE__*/ P("<video controls preload=metadata>"), lc = /*#__PURE__*/ P("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), uc = /*#__PURE__*/ P("<div class=\"VideoEmbed fade-in\">"), dc = /*#__PURE__*/ P("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), fc = /*#__PURE__*/ P("<div class=fade-in>"), pc = /*#__PURE__*/ P("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\"><h2>Video Transcription"), mc = /*#__PURE__*/ P("<div class=\"NoContent fade-in\">No transcription provided by source."), hc = /*#__PURE__*/ P("<div class=\"PhotoCompact fade-in\"><a class=PhotoCompactImage><img loading=lazy></a><div class=PhotoCompactDate><strong></strong> 👁 ", !0, !1, !1), gc = /*#__PURE__*/ P("<div class=\"PhotoListItem fade-in\"><a><img loading=lazy class=PhotoListImg>", !0, !1, !1), _c = /*#__PURE__*/ P("<div class=\"ArticleBody type-photo\"><div class=\"ArticlePhoto fade-in type-photo\"></div><div class=\"content fade-in type-photo\"><h2>Image Description"), vc = /*#__PURE__*/ P("<div class=\"NoContent fade-in\">No description provided. Help write one for accessibility."), yc = /*#__PURE__*/ P("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), bc = /*#__PURE__*/ P("<div class=infobox-list><strong>Credits:</strong><ul>"), xc = /*#__PURE__*/ P("<div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️"), Sc = /*#__PURE__*/ P("<div class=ArticleBody><div class=\"content fade-in\">"), Cc = /*#__PURE__*/ P("<li><strong></strong> (<!>)"), wc = /*#__PURE__*/ P("<div class=infobox-desc>"), Tc = /*#__PURE__*/ P("<li><strong></strong> (<!> – <!>)"), Ec = /*#__PURE__*/ P("<li><a target=_blank rel=\"noopener noreferrer\">"), Dc = /*#__PURE__*/ P("<li><strong>:</strong> "), Oc = /*#__PURE__*/ P("<div class=\"NoContent fade-in\">No article content. Come write some!"), kc = "/viewers/cep-solid/compiled-json/avatars", Ac = "/viewers/cep-solid/compiled-json/backgrounds", jc = [
	{
		min: 0,
		max: 1,
		start: "#464141",
		end: "#464141",
		rank: "Bankruptcy"
	},
	{
		min: 2,
		max: 4,
		start: "#613583",
		end: "#613583",
		rank: "Toddler Zone"
	},
	{
		min: 5,
		max: 9,
		start: "#3b538a",
		end: "#3b538a",
		rank: "Crusty & Greasy"
	},
	{
		min: 10,
		max: 24,
		start: "#26a269",
		end: "#26a269",
		rank: "Jumpscare Fodder"
	},
	{
		min: 25,
		max: 49,
		start: "#d3b31c",
		end: "#d3b31c",
		rank: "Store Tourist"
	},
	{
		min: 50,
		max: 74,
		start: "#ff7800",
		end: "#ff7800",
		rank: "Wiki Wanderer"
	},
	{
		min: 75,
		max: 99,
		start: "#e01b24",
		end: "#e01b24",
		rank: "Article Wizard"
	},
	{
		min: 100,
		max: 149,
		start: "#ff8383",
		end: "#ff006d",
		rank: "Historian"
	},
	{
		min: 150,
		max: 299,
		start: "#aaa8bc",
		end: "#241f31",
		rank: "Guest Star"
	},
	{
		min: 300,
		max: 499,
		start: "#c97e3c",
		end: "#3c6f50",
		rank: "Super Chuck"
	},
	{
		min: 500,
		max: 749,
		start: "#ff7800",
		end: "#703820",
		rank: "Phase IV"
	},
	{
		min: 750,
		max: 999,
		start: "#e3e9e8",
		end: "#5b5f60",
		rank: "CEC Master"
	},
	{
		min: 1e3,
		max: 99999,
		start: "#d9d15a",
		end: "#ce6923",
		rank: "The Giant Rat That Makes All of the Rules"
	}
], Mc = (e) => jc.find((t) => e >= t.min && e <= t.max) || jc[0], Nc = (e) => e.start === e.end ? e.start : `linear-gradient(0deg, ${e.start}, ${e.end})`, Pc = [
	{
		key: "animatronics",
		title: "Animatronics"
	},
	{
		key: "attractions",
		title: "Attractions"
	},
	{
		key: "fixtures",
		title: "Fixtures"
	},
	{
		key: "walkarounds",
		title: "Walkarounds"
	}
], Fc = [
	{
		key: "stages",
		title: "Stages"
	},
	{
		key: "remodels",
		title: "Remodels"
	},
	{
		key: "animatronics",
		title: "Animatronics"
	},
	{
		key: "attractions",
		title: "Attractions"
	},
	{
		key: "fixtures",
		title: "Fixtures"
	},
	{
		key: "walkarounds",
		title: "Walkarounds"
	}
], Ic = [
	{
		key: "st",
		label: "Serial"
	},
	{
		key: "l",
		label: "Serial"
	},
	{
		key: "desc",
		label: "Notes"
	}
];
function Lc(e) {
	let [t] = T(() => e.user ?? e.username, async (e) => typeof e == "object" ? e : (await Yr()).get(String(e).trim().toLowerCase()) || null);
	return A(M, {
		get when() {
			return t();
		},
		get fallback() {
			return (() => {
				var t = Wa();
				return L(t, () => e.username ?? e.user?.name), t;
			})();
		},
		children: (e) => {
			let [t, n] = S(!1), r = () => Mc(e().count || 0), i = () => e().fn || e().name || e().fu || "?", a = () => e().bio || null;
			return (() => {
				var o = qa(), s = o.firstChild, c = s.firstChild.firstChild, l = c.nextSibling, u = l.firstChild.nextSibling;
				return u.nextSibling, o.addEventListener("mouseleave", () => n(!1)), o.addEventListener("mouseenter", () => n(!0)), L(o, A(M, {
					get when() {
						return e().av;
					},
					get children() {
						var t = Ga();
						return t.addEventListener("error", (e) => e.currentTarget.style.display = "none"), C((n) => {
							var r = `${kc}/${e().av}`, a = i();
							return r !== n.e && F(t, "src", n.e = r), a !== n.t && F(t, "alt", n.t = a), n;
						}, {
							e: void 0,
							t: void 0
						}), t;
					}
				}), s), L(c, i), L(l, () => e().count || 0, u), L(o, A(M, {
					get when() {
						return a();
					},
					get children() {
						var e = Ka();
						return L(e, a), C(() => e.classList.toggle("UserBubbleVisible", !!t())), e;
					}
				}), null), C((t) => {
					var n = Nc(r()), i = `Rank: ${r().rank}`, a = qr(e().fu || e().name);
					return n !== t.e && Ze(o, "background", t.e = n), i !== t.t && F(o, "title", t.t = i), a !== t.a && F(s, "href", t.a = a), t;
				}, {
					e: void 0,
					t: void 0,
					a: void 0
				}), o;
			})();
		}
	});
}
function Rc(e) {
	return A(Lc, { username: e });
}
function zc(e) {
	let [t, n] = S("Articles"), [r, i] = S(0), [a] = T(async () => {
		let [t, n, r] = await Promise.all([
			Yr(),
			At(),
			Ca()
		]), i = t.get(String(e.username || "").trim().toLowerCase()) || null;
		if (!i) return { user: null };
		let a = (e) => r.sortKeys?.[e] || [0, 0], o = [...i.articles || []].sort((e, t) => a(t)[0] - a(e)[0] || a(t)[1] - a(e)[1]);
		return {
			user: i,
			data: r,
			profile: n[(i.fu || "").toLowerCase()] || null,
			lists: {
				Articles: o,
				Reviews: o.filter((e) => (r.idType[e] || "").toLowerCase() === "reviews")
			}
		};
	}), o = () => a()?.lists?.[t()] || [], s = () => Math.max(1, Math.ceil(o().length / 50)), c = () => o().slice(r() * 50, (r() + 1) * 50), l = (e) => {
		n(e), i(0);
	}, u = (e) => {
		i(e), window.scrollTo({ top: 0 });
	};
	return A(M, {
		get when() {
			return !a.loading;
		},
		get fallback() {
			return Ja();
		},
		get children() {
			return A(M, {
				get when() {
					return a()?.user;
				},
				get fallback() {
					return Ya();
				},
				get children() {
					return (() => {
						let { user: e, profile: n, data: i } = a(), o = Mc(e.count || 0), d = e.fu || e.name;
						return (() => {
							var f = eo(), p = f.firstChild, m = p.nextSibling, h = m.firstChild, g = h.firstChild, _ = g.nextSibling.firstChild, v = _.firstChild, y = v.nextSibling;
							y.nextSibling;
							var b = m.nextSibling, x = b.nextSibling;
							return L(m, A(M, {
								get when() {
									return e.av;
								},
								get children() {
									var t = Xa();
									return F(t, "alt", d), C(() => F(t, "src", `${kc}/${e.av}`)), t;
								}
							}), h), L(g, A(M, {
								get when() {
									return e.url;
								},
								fallback: d,
								get children() {
									var t = Za();
									return L(t, d), C(() => F(t, "href", e.url)), t;
								}
							})), L(_, () => o.rank, v), L(_, () => e.count || 0, y), L(h, A(M, {
								get when() {
									return n?.bio;
								},
								get children() {
									var e = Qa();
									return L(e, () => n.bio), e;
								}
							}), null), L(h, A(M, {
								get when() {
									return n?.joined;
								},
								get children() {
									var e = $a();
									return e.firstChild, L(e, () => X(n.joined.slice(0, 10)), null), e;
								}
							}), null), L(b, A(j, {
								get each() {
									return Object.keys(a().lists);
								},
								children: (e) => (() => {
									var n = to(), r = n.firstChild, i = r.nextSibling;
									return i.nextSibling, n.$$click = () => l(e), L(n, e, r), L(n, () => a().lists[e].length, i), C((r) => {
										var i = t() === e, a = t() === e;
										return i !== r.e && n.classList.toggle("active", r.e = i), a !== r.t && F(n, "aria-pressed", r.t = a), r;
									}, {
										e: void 0,
										t: void 0
									}), n;
								})()
							})), L(x, A(M, {
								get when() {
									return r() > 0;
								},
								get children() {
									return A(Va, {
										get page() {
											return r();
										},
										get pages() {
											return s();
										},
										onPage: u
									});
								}
							}), null), L(x, () => qc(t() === "Reviews" ? "reviews" : "compact", c(), i), null), L(x, A(Va, {
								get page() {
									return r();
								},
								get pages() {
									return s();
								},
								onPage: u
							}), null), C((e) => {
								var t = n?.bg ? { "background-image": `url('${Ac}/${n.bg}')` } : {}, r = Nc(o);
								return e.e = Xe(p, t, e.e), r !== e.t && Ze(_, "background", e.t = r), e;
							}, {
								e: void 0,
								t: void 0
							}), f;
						})();
					})();
				}
			});
		}
	});
}
function Bc(e) {
	return A(zc, { username: e });
}
var Vc = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"linkedin post",
	"theories",
	"meta",
	"transcriptions"
]), Hc = {
	Articles: (e) => !Vc.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos"
}, Uc = [
	{
		name: "Chuck E. Cheese FEC's",
		tags: [
			"Chuck E. Cheese's",
			"Chuck's Arcade",
			"Chuck E. Cheese Adventure World",
			"Chuck E. Cheese Pizza",
			"Discovery Zone",
			"Peter Piper Pizza",
			"TJ Hartford's Sports Grille",
			"Monterey's"
		]
	},
	{
		name: "Pizza Time Theatre FEC's",
		tags: [
			"Pizza Time Theatre",
			"Charlie Cheese's Pizza Playhouse",
			"Zapp's Bar & Grill",
			"Atari Family Game Center",
			"Chuck E. Mouse's Pizza Paradise (出奇老鼠薄餅樂園)",
			"Pizza Show Biz"
		]
	},
	{
		name: "ShowBiz Pizza Place / Creative Engineering FEC's",
		tags: /* @__PURE__ */ "ShowBiz Pizza Place.Billy Bob's Wonderland.Volo Auto Museum.Looney Bird's.X-Site.Hannah Banana.Circus Pizza.Pistol Pete's Pizza.Chimpy's Pizza Safari.Billy Bob's Pizza Circus & Skating Center.Billy Bob's Pizza Theatre.Gulliver's.Adventure Landing.Animal House Pizza.Odyssey Fun World.Magic City.Kansas City, MO (334 E 31st St).Billy Bob's Pizzatron.Tweetsie Railroad.Strike & Spare.Coolwalla Carnival.Rock-afire Pizza.Okefenokee Swamp Park.Circus.Fun Time Pizza.Fun Station USA.FunTime Pizza Circus.Party on! Pizza.Flamingo Land.Pleasure Island.Tuns-A-Fun Pizza.Billie Joe's Ice Cream Parlor & Restaurant.Mega Maze.KizBiz Pizza & Showplace.Stageshow Pizza.Zones.Sports Plus.Playrobics.Playkids Korea.Tokyo Summerland.Club Hotel Eliat.Funderland.Showtime Pizza.Scandia Golf & Games.Benson's Wild Animal Farm".split(".")
	},
	{
		name: "Other Family Entertainment Centers",
		tags: [
			"Celebration Station",
			"Sgt. Singer's Pizza Circus",
			"Captain Andy's Rivertowne",
			"Captain Carnival",
			"Paul E. Parrott",
			"Major Magic's All Star Pizza Revue",
			"Jungle Jim's International Market",
			"Gigglebee's",
			"Gadgets",
			"Marc's Funtime Pizza Palace",
			"Bugaboo Creek Steakhouse",
			"Rainforest Cafe",
			"Great Wolf Lodge",
			"Bullwinkle's Family Food N' Fun",
			"Oaks, PA (One American Treasure Way, 422 Business Center)"
		]
	},
	{
		name: "Animatronic Manufacturers",
		tags: [
			"Fantasy Forest",
			"Cyan Engineering",
			"AVG Technologies",
			"Creative Presentations",
			"Animation World",
			"Life Formations",
			"Creative Engineering",
			"Sally Corporation",
			"Jim Henson's Creature Shop",
			"Walt Disney Imagineering",
			"Setmakers",
			"AnimatedFX",
			"Kinetix Group",
			"Advanced Animations",
			"VP Animations",
			"Hofmann Figuren",
			"KX International"
		]
	}
], Wc = 15, Gc = {
	standard: "CEPLogo.avif",
	dark: "LogoDark.avif",
	light: "LogoLight.avif",
	classic: "LogoClassic.avif",
	funnet: "LogoFunNet.avif",
	showbiz: "LogoShowBiz.avif",
	fnaf: "LogoFNaF.avif",
	italy: "LogoPasqually.avif",
	winter: "LogoWinter.avif",
	halloween: "LogoHalloween.avif",
	pride: "LogoPride.avif",
	anniversary: "LogoAnniversary.avif"
}, Kc = "https://cheeseepedia.org/?v=cep-editor";
function qc(e, t, n) {
	switch (e.toLowerCase()) {
		case "photos": return (() => {
			var e = no();
			return L(e, A(j, {
				each: t,
				children: (e) => A(Ll, {
					id: e,
					render: eu
				})
			})), e;
		})();
		case "compact": return (() => {
			var e = ro();
			return L(e, A(j, {
				each: t,
				children: (e) => A(Ll, {
					id: e,
					render: Ou
				})
			})), e;
		})();
		case "reviews":
		case "steam comment":
		case "linkedin post": return (() => {
			var e = io();
			return L(e, A(j, {
				each: t,
				children: (e) => A(Ll, {
					id: e,
					render: eu
				})
			})), e;
		})();
		default: return A(j, {
			each: t,
			children: (e) => A(Ia, {
				entry: {
					id: e,
					found: null
				},
				data: n,
				words: [],
				tags: []
			})
		});
	}
}
var Jc = "/viewers/cep-js/compiled-json/favicons", Yc = (e, t) => `${e} ${t}${e === 1 ? "" : "s"} ago`, Xc = (e) => e.accepted === !0 ? "Accepted" : e.accepted === !1 ? "Rejected" : "Pending", Zc = (e) => e.replace(/^https?:\/\/(www\.)?/, ""), Qc = (e) => Zc(e).replace(/[^\w\-.]/g, "_") + ".png", $c = (e) => /^https?:\/\//i.test(e), el = (e) => {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}, tl = (e) => {
	try {
		return Zc(new URL(e).origin);
	} catch {
		return null;
	}
};
function nl(e) {
	let t = () => e.index + 1, n = () => $c(e.cite), r = () => n() ? el(e.cite) : null;
	return (() => {
		var i = co(), a = i.firstChild, o = a.nextSibling;
		return L(a, A(M, {
			get when() {
				return r();
			},
			get children() {
				var e = ao();
				return e.addEventListener("error", (e) => e.currentTarget.style.display = "none"), C((t) => {
					var n = r(), i = `${Jc}/${Qc(r())}`;
					return n !== t.e && F(e, "alt", t.e = n), i !== t.t && F(e, "src", t.t = i), t;
				}, {
					e: void 0,
					t: void 0
				}), e;
			}
		})), L(o, A(M, {
			get when() {
				return n();
			},
			get fallback() {
				return (() => {
					var n = lo(), r = n.firstChild;
					return L(n, t, r), L(n, () => e.cite, null), n;
				})();
			},
			get children() {
				return [(() => {
					var n = oo(), i = n.firstChild;
					return L(n, t, i), L(n, () => tl(e.cite) || r() || e.cite, null), C(() => F(n, "href", e.cite)), n;
				})(), (() => {
					var t = so();
					return L(t, () => Zc(e.cite)), C(() => F(t, "href", e.cite)), t;
				})()];
			}
		})), C(() => F(i, "id", `cite-${t()}`)), i;
	})();
}
function rl(e) {
	return A(M, {
		get when() {
			return e.files?.length;
		},
		get children() {
			var t = uo();
			return L(t, A(j, {
				get each() {
					return e.files;
				},
				children: (e) => (() => {
					var t = Wa();
					return L(t, () => e.name, null), L(t, A(M, {
						get when() {
							return e.add || e.del;
						},
						get children() {
							return [
								" (",
								A(M, {
									get when() {
										return e.add;
									},
									get children() {
										var t = fo();
										return t.firstChild, L(t, () => e.add, null), t;
									}
								}),
								A(M, {
									get when() {
										return N(() => !!e.add)() && e.del;
									},
									children: " "
								}),
								A(M, {
									get when() {
										return e.del;
									},
									get children() {
										var t = po();
										return t.firstChild, L(t, () => e.del, null), t;
									}
								}),
								")"
							];
						}
					}), null), C(() => I(t, `ResultTag ChangeTag ${e.status}`)), t;
				})()
			})), t;
		}
	});
}
function il(e) {
	return A(M, {
		get when() {
			return e.citations?.length;
		},
		get children() {
			var t = mo();
			return t.firstChild, L(t, A(j, {
				get each() {
					return e.citations;
				},
				children: (e, t) => A(nl, {
					cite: e,
					get index() {
						return t();
					}
				})
			}), null), t;
		}
	});
}
function al(e) {
	let [t] = T(bt);
	return A(M, {
		get when() {
			return t()?.[e.folderID]?.length;
		},
		get children() {
			return [ho(), A(Fa, { get tags() {
				return t()[e.folderID];
			} })];
		}
	});
}
function ol(e) {
	let [t] = T(async () => (await Zr()).get(e.folderID) || []);
	return A(M, {
		get when() {
			return t()?.length;
		},
		get children() {
			return [go(), (() => {
				var e = _o();
				return L(e, A(j, {
					get each() {
						return t();
					},
					children: (e) => A(Lc, { user: e })
				})), e;
			})()];
		}
	});
}
function sl(e) {
	let [t, n] = S(ri().includes(e.folderID));
	return (() => {
		var r = vo();
		return r.$$click = () => n(ii(e.folderID)), C((e) => {
			var n = t() ? "Unpin page" : "Pin page", i = t(), a = t() ? "var(--primary)" : "var(--background)";
			return n !== e.e && F(r, "title", e.e = n), i !== e.t && F(r, "aria-pressed", e.t = i), a !== e.a && Ze(r, "background", e.a = a), e;
		}, {
			e: void 0,
			t: void 0,
			a: void 0
		}), r;
	})();
}
function cl(e) {
	return (() => {
		var t = yo(), n = t.firstChild;
		return L(t, A(sl, { get folderID() {
			return e.folderID;
		} }), null), C(() => F(n, "href", `${Kc}&=${e.folderID}`)), t;
	})();
}
function ll(e) {
	return (e?.type || "").toLowerCase() === "locations" ? Pc.map((t) => ({
		...t,
		rows: (Array.isArray(e[t.key]) ? e[t.key] : []).filter((e) => e && typeof e == "object")
	})).filter((e) => e.rows.length) : [];
}
function ul(e) {
	return Fc.map((t) => ({
		...t,
		rows: (e || []).filter((e) => e.field === t.key)
	})).filter((e) => e.rows.length);
}
function dl(e) {
	let [t] = T(() => (e.title || "").trim() || null, J);
	return A(M, {
		get when() {
			return t();
		},
		get fallback() {
			return e.title || "";
		},
		get children() {
			var n = bo();
			return L(n, () => e.title), C(() => F(n, "href", Y(t()))), n;
		}
	});
}
function fl(e) {
	let t = () => Ic.filter((t) => e.rows.some((e) => e[t.key])), n = () => e.showEnd !== !1;
	return (() => {
		var r = So(), i = r.firstChild.firstChild, a = i.firstChild, o = a.firstChild;
		o.nextSibling;
		var s = i.nextSibling;
		return L(o, () => e.nameLabel), L(a, A(M, {
			get when() {
				return n();
			},
			get children() {
				return xo();
			}
		}), null), L(a, A(j, {
			get each() {
				return t();
			},
			children: (e) => (() => {
				var t = Co();
				return L(t, () => e.label), t;
			})()
		}), null), L(s, A(j, {
			get each() {
				return e.rows;
			},
			children: (r) => (() => {
				var i = To(), a = i.firstChild, o = a.nextSibling;
				return L(a, () => e.renderName(r)), L(o, () => X(r.s)), L(i, A(M, {
					get when() {
						return n();
					},
					get children() {
						var e = wo();
						return L(e, () => $r(r.e)), e;
					}
				}), null), L(i, A(j, {
					get each() {
						return t();
					},
					children: (e) => (() => {
						var t = Eo();
						return L(t, () => r[e.key] ?? ""), t;
					})()
				}), null), i;
			})()
		})), r;
	})();
}
function pl(e) {
	return (() => {
		var t = Oo();
		return L(t, A(j, {
			get each() {
				return e.own;
			},
			children: (e) => [(() => {
				var t = ko();
				return L(t, () => e.title), t;
			})(), A(fl, {
				get rows() {
					return e.rows;
				},
				nameLabel: "Name",
				get showEnd() {
					return e.end;
				},
				renderName: (e) => A(dl, { get title() {
					return e.n;
				} })
			})]
		}), null), L(t, A(M, {
			get when() {
				return e.usedIn.length;
			},
			get children() {
				return [Do(), A(j, {
					get each() {
						return e.usedIn;
					},
					children: (t) => [A(M, {
						get when() {
							return e.usedIn.length > 1;
						},
						get children() {
							var e = Ao();
							return L(e, () => t.title), e;
						}
					}), A(fl, {
						get rows() {
							return t.rows;
						},
						nameLabel: "Location",
						get showEnd() {
							return t.end;
						},
						renderName: (e) => (() => {
							var t = bo();
							return L(t, () => e.title), C(() => F(t, "href", Y(e.p))), t;
						})()
					})]
				})];
			}
		}), null), t;
	})();
}
function ml(e) {
	let t = () => e.meta.folderID, [n, r] = S("Article"), [i, a] = S(0), o = (e) => {
		r(e), a(0);
	}, s = () => Math.max(1, Math.ceil((h().get(n())?.length || 0) / 50)), c = () => (h().get(n()) || []).slice(i() * 50, (i() + 1) * 50), l = (e) => {
		a(e), window.scrollTo({ top: 0 });
	}, [u] = T(() => Promise.all([xt(), Ca()])), [d] = T(() => yt().catch(() => ({}))), f = w(() => ul((d() || {})[(e.meta.title || "").trim()])), p = ll(e.meta), m = () => p.length > 0 || f().length > 0, h = w(() => {
		let e = /* @__PURE__ */ new Map();
		if (!u()) return e;
		let [n, r] = u();
		for (let i of n[t()] || []) {
			let t = r.idType[i] || "other";
			e.has(t) || e.set(t, []), e.get(t).push(i);
		}
		let i = (e) => r.sortKeys?.[e]?.[0] || 0;
		for (let t of e.values()) t.sort((e, t) => {
			let n = i(e), r = i(t);
			return n === r ? 0 : n ? r ? n - r : -1 : 1;
		});
		return e;
	}), g = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), _ = () => [
		{
			name: "Edit Page",
			href: `${Kc}&=${t()}`
		},
		{
			name: "Add Review",
			href: `${Kc}&type=Review&tag=${t()}`
		},
		{
			name: "Add Images",
			href: `${Kc}&type=Photos&tag=${t()}`
		},
		{
			name: "Add Video",
			href: `${Kc}&type=Videos&tag=${t()}`
		}
	];
	return [
		(() => {
			var e = No(), r = e.firstChild;
			return r.firstChild, r.addEventListener("change", (e) => {
				let t = e.target.value;
				e.target.value = "", t && (location.href = t);
			}), L(r, A(j, {
				get each() {
					return _();
				},
				children: (e) => (() => {
					var t = Fo();
					return L(t, () => e.name), C(() => t.value = e.href), t;
				})()
			}), null), L(e, A(sl, { get folderID() {
				return t();
			} }), null), L(e, A(M, {
				get when() {
					return h().size || m();
				},
				get children() {
					return [
						(() => {
							var e = jo();
							return e.$$click = () => o("Article"), C((t) => {
								var r = n() === "Article", i = n() === "Article";
								return r !== t.e && e.classList.toggle("active", t.e = r), i !== t.t && F(e, "aria-pressed", t.t = i), t;
							}, {
								e: void 0,
								t: void 0
							}), e;
						})(),
						A(M, {
							get when() {
								return m();
							},
							get children() {
								var e = Mo();
								return e.$$click = () => o("Inventory"), C((t) => {
									var r = n() === "Inventory", i = n() === "Inventory";
									return r !== t.e && e.classList.toggle("active", t.e = r), i !== t.t && F(e, "aria-pressed", t.t = i), t;
								}, {
									e: void 0,
									t: void 0
								}), e;
							}
						}),
						A(j, {
							get each() {
								return [...h()];
							},
							children: ([e, t]) => (() => {
								var r = to(), i = r.firstChild, a = i.nextSibling;
								return a.nextSibling, r.$$click = () => o(e), L(r, () => g(e), i), L(r, () => t.length, a), C((t) => {
									var i = n() === e, a = n() === e;
									return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && F(r, "aria-pressed", t.t = a), t;
								}, {
									e: void 0,
									t: void 0
								}), r;
							})()
						})
					];
				}
			}), null), e;
		})(),
		(() => {
			var t = io();
			return L(t, () => e.children), C((e) => Ze(t, "display", n() === "Article" ? "" : "none")), t;
		})(),
		A(M, {
			get when() {
				return n() === "Inventory";
			},
			get children() {
				return A(pl, {
					own: p,
					get usedIn() {
						return f();
					}
				});
			}
		}),
		A(M, {
			get when() {
				return N(() => !!(n() !== "Article" && u()))() && h().get(n());
			},
			get children() {
				var e = Po();
				return L(e, A(M, {
					get when() {
						return i() > 0;
					},
					get children() {
						return A(Va, {
							get page() {
								return i();
							},
							get pages() {
								return s();
							},
							onPage: l
						});
					}
				}), null), L(e, () => qc(n(), c(), u()[1]), null), L(e, A(Va, {
					get page() {
						return i();
					},
					get pages() {
						return s();
					},
					onPage: l
				}), null), e;
			}
		})
	];
}
function hl(e) {
	if (e.type === "home") return du();
	if (e.type === "notfound") return au(e.folderID);
	switch (e.type) {
		case "Animatronics":
		case "Animatronic Shows":
		case "Animatronic Parts":
		case "Animatronic Preservation":
		case "Stage Variations":
		case "Walkarounds":
		case "Characters":
		case "Locations":
		case "Cancelled Locations":
		case "Showtapes":
		case "Showtape Formats":
		case "ShowBiz Pizza Programs":
		case "Family Vision":
		case "Live Shows":
		case "Puppets":
		case "Commercials":
		case "News Footage":
		case "Company Media":
		case "Movies":
		case "Transcriptions":
		case "Video Games":
		case "Menu Items":
		case "Tickets":
		case "Tokens":
		case "Documents":
		case "Events":
		case "Remodels and Initiatives":
		case "Retrofits":
		case "History":
		case "Arcades and Attractions":
		case "Companies/Brands":
		case "Animatronic Control Systems":
		case "Other Systems":
		case "Programming Systems":
		case "Simulators":
		case "Social Media and Websites":
		case "Ad Vehicles":
		case "In-Store Merchandise":
		case "Products":
		case "Employee Wear":
		case "Meta":
		case "Store Fixtures":
		case "Reviews":
		case "Steam Comment": return ju(e);
		case "LinkedIn Post": return $l(e);
		case "Videos": return Tu(e);
		case "Photos": return Au(e);
		default: return ju(e);
	}
}
var gl = "cep-theme", _l = "cep-theme-custom", vl = "cep-wide", yl = "cep-holiday", bl = "/viewers/cep-js/assets/Logos/", xl = [
	"standard",
	"dark",
	"light",
	"classic",
	"funnet",
	"showbiz",
	"fnaf",
	"italy",
	"winter",
	"halloween",
	"pride",
	"anniversary"
], Sl = [
	{
		key: "--background",
		label: "Background"
	},
	{
		key: "--text",
		label: "Text"
	},
	{
		key: "--primary",
		label: "Primary"
	},
	{
		key: "--secondary",
		label: "Secondary"
	},
	{
		key: "--good-link",
		label: "Good Link"
	},
	{
		key: "--bad-link",
		label: "Bad Link"
	},
	{
		key: "--distant",
		label: "Distant"
	},
	{
		key: "--edit-background",
		label: "Editor Background"
	},
	{
		key: "--dark",
		label: "Dark"
	}
], Cl = [{
	key: "--font-body",
	label: "Body Font"
}, {
	key: "--font-display",
	label: "Display Font"
}], wl = [
	"Aleo",
	"RockoFLF",
	"Stalker",
	"Sylvar",
	"Octobre",
	"Unutterable",
	"sans-serif",
	"serif",
	"monospace",
	"RBYGSC"
], Tl = [
	"CEPLogo.avif",
	"LogoDark.avif",
	"LogoLight.avif",
	"LogoClassic.avif",
	"LogoFunNet.avif",
	"LogoFunNetLow.avif",
	"LogoShowBiz.avif",
	"LogoFNaF.avif",
	"LogoPasqually.avif",
	"LogoWinter.avif",
	"LogoHalloween.avif",
	"LogoPride.avif",
	"LogoAnniversary.avif"
], El = {
	"--background": "#233355",
	"--edit-background": "#234555",
	"--text": "#dbd1b1",
	"--primary": "#e0961f",
	"--secondary": "#D44A02",
	"--good-link": "#39A481",
	"--bad-link": "#D44A02",
	"--distant": "#993b08",
	"--dark": "#2c2422",
	"--font-body": "Aleo",
	"--font-display": "RockoFLF",
	"--logo": "CEPLogo.avif"
}, Dl = (e) => {
	let t = (e || "").replace(/['"]/g, "").trim();
	return /^#[0-9a-f]{6}$/i.test(t) ? t : /^#[0-9a-f]{8}$/i.test(t) ? t.slice(0, 7) : "#000000";
}, Ol = (e) => {
	let t = document.querySelector(".Logo img");
	t && (t.src = bl + e);
};
function kl(e, t = null) {
	let n = document.documentElement;
	[...Sl, ...Cl].forEach(({ key: e }) => n.style.removeProperty(e)), e === "custom" && t ? (n.removeAttribute("data-theme"), Object.entries(t).forEach(([e, t]) => n.style.setProperty(e, t))) : e === "standard" ? n.removeAttribute("data-theme") : n.setAttribute("data-theme", e);
}
function Al(e) {
	document.documentElement.toggleAttribute("data-wide", !!e);
}
function jl(e = /* @__PURE__ */ new Date()) {
	let t = e.getMonth() + 1, n = e.getDate();
	return t === 12 || t === 1 ? "winter" : t === 10 && n >= 25 ? "halloween" : t === 6 ? "pride" : t === 5 && n === 17 ? "anniversary" : t === 8 && n === 8 ? "fnaf" : t === 3 && n === 2 ? "showbiz" : t === 7 && n === 14 ? "classic" : null;
}
function Ml() {
	return (Z(yl, "1") === "1" ? jl() : null) || Z(gl, "standard");
}
function Nl() {
	kl(Ml(), Z(_l, null)), Al(Z(vl, "0") === "1");
}
function Pl() {
	let [e, t] = S(Z(gl, "standard")), [n, r] = S(Z(vl, "0") === "1"), [i, a] = S(Z(yl, "1") === "1"), o = Z(_l, null) || {}, [s, c] = S(Object.fromEntries(Object.entries(El).map(([e, t]) => {
		let n = o[e] || t;
		return [e, e.startsWith("--font") || e === "--logo" ? n : Dl(n)];
	}))), l = () => {
		let e = Ml();
		kl(e, s()), Ol(e === "custom" ? s()["--logo"] : Gc[e] || Gc.standard);
	}, u = (e) => {
		t(e), Q(gl, e), l();
	}, d = (e) => {
		a(e), Q(yl, e ? "1" : "0"), l();
	}, f = (e, t) => {
		c((n) => ({
			...n,
			[e]: t
		})), Q(_l, s()), Ml() === "custom" && l();
	}, p = (e) => {
		r(e), Q(vl, e ? "1" : "0"), Al(e);
	}, m = (e) => e.charAt(0).toUpperCase() + e.slice(1);
	return [Io(), (() => {
		var t = zo(), r = t.firstChild, a = r.firstChild.nextSibling, o = a.firstChild.nextSibling, c = a.nextSibling, l = c.firstChild.nextSibling, h = r.nextSibling.firstChild.nextSibling.firstChild.nextSibling;
		return o.addEventListener("change", (e) => d(e.target.checked)), L(r, A(M, {
			get when() {
				return N(() => !!i())() && jl();
			},
			get children() {
				var e = Lo(), t = e.firstChild.nextSibling;
				return t.nextSibling, L(e, () => m(jl()), t), e;
			}
		}), c), l.addEventListener("change", (e) => u(e.target.value)), L(l, A(j, {
			get each() {
				return [...xl, "custom"];
			},
			children: (t) => (() => {
				var n = Fo();
				return n.value = t, L(n, () => m(t)), C(() => n.selected = t === e()), n;
			})()
		})), L(r, A(M, {
			get when() {
				return e() === "custom";
			},
			get children() {
				var e = Ro(), t = e.firstChild, n = t.nextSibling, r = n.nextSibling.firstChild.nextSibling;
				return L(t, A(j, {
					each: Sl,
					children: ({ key: e, label: t }) => (() => {
						var n = Bo(), r = n.firstChild, i = r.nextSibling;
						return L(r, t), i.$$input = (t) => f(e, t.target.value), C(() => i.value = s()[e]), n;
					})()
				})), L(n, A(j, {
					each: Cl,
					children: ({ key: e, label: t }) => (() => {
						var n = Vo(), r = n.firstChild, i = r.nextSibling;
						return L(r, t), i.addEventListener("change", (t) => f(e, t.target.value)), L(i, A(j, {
							each: wl,
							children: (t) => (() => {
								var n = Fo();
								return n.value = t, L(n, t), C(() => n.selected = t === s()[e]), n;
							})()
						})), n;
					})()
				})), r.addEventListener("change", (e) => f("--logo", e.target.value)), L(r, A(j, {
					each: Tl,
					children: (e) => (() => {
						var t = Fo();
						return t.value = e, L(t, () => e.replace(".avif", "").replace("Logo", "")), C(() => t.selected = e === s()["--logo"]), t;
					})()
				})), e;
			}
		}), null), h.addEventListener("change", (e) => p(e.target.checked)), C(() => o.checked = i()), C(() => h.checked = n()), t;
	})()];
}
function Fl() {
	let e = async (e) => {
		let t = await fetch(`/viewers/cep-js/compiled-json/${e}.json`);
		return t.ok ? t.json() : [];
	}, [t] = T(async () => {
		let [t, n, r, i] = await Promise.all([
			e("citation_links"),
			e("download_links"),
			kt(),
			jt()
		]), a = Object.entries(i).map(([e, t]) => {
			let n = e.match(/^_home_(\d{2})_(\d{2})$/);
			return n && {
				year: 2e3 + Number(n[2]),
				month: Number(n[1]),
				count: t
			};
		}).filter(Boolean).sort((e, t) => t.year - e.year || t.month - e.month);
		return {
			links: t,
			downloads: await Promise.all(n.map(async (e) => ({
				...e,
				pageID: e.pageTitle ? await J(e.pageTitle) : null
			}))),
			contributors: r.filter((e) => e.articles?.length).sort((e, t) => (t.count || 0) - (e.count || 0)),
			homeMonths: a,
			homeTotal: a.reduce((e, t) => e + t.count, 0),
			searchTotal: i._search || 0
		};
	}), n = (e) => new Date(e.year, e.month - 1).toLocaleDateString(void 0, {
		month: "long",
		year: "numeric"
	}), [r] = T(Ot);
	return [Ho(), (() => {
		var e = Uo();
		return L(e, A(M, {
			get when() {
				return t();
			},
			get fallback() {
				return Wo();
			},
			get children() {
				return A(yu, { get tabs() {
					return [
						{
							name: `Citations (${t().links.length.toLocaleString()})`,
							content: () => ["Every single citation on the site! We reccomend scraping this information and crawling all the sites for archival, you'll never know when this stuff will become lost!", (() => {
								var e = Go();
								return L(e, A(j, {
									get each() {
										return t().links;
									},
									children: (e, t) => A(nl, {
										get cite() {
											return typeof e == "string" ? e : e.url;
										},
										get index() {
											return t();
										}
									})
								})), e;
							})()]
						},
						{
							name: `Downloads (${t().downloads.length.toLocaleString()})`,
							content: () => ["All downloads found across the site's articles.", (() => {
								var e = Ko(), n = e.firstChild.nextSibling;
								return L(n, A(j, {
									get each() {
										return t().downloads;
									},
									children: (e) => (() => {
										var t = qo(), n = t.firstChild, r = n.firstChild;
										return L(t, A(M, {
											get when() {
												return e.pageID;
											},
											get fallback() {
												return e.pageTitle;
											},
											get children() {
												var t = bo();
												return L(t, () => e.pageTitle), C(() => F(t, "href", Y(e.pageID))), t;
											}
										}), n), L(r, () => e.label || e.url), C(() => F(r, "href", e.url)), t;
									})()
								})), e;
							})()]
						},
						{
							name: `Contributors (${t().contributors.length.toLocaleString()})`,
							content: () => ["Every single contributor on the site!", (() => {
								var e = _o();
								return L(e, A(j, {
									get each() {
										return t().contributors;
									},
									children: (e) => Rc(e.name)
								})), e;
							})()]
						},
						{
							name: "Site Details",
							content: () => [
								Jo(),
								"Additional info of the site idk where else to put.",
								(() => {
									var e = Yo(), r = e.firstChild;
									r.firstChild.nextSibling;
									var i = r.nextSibling;
									i.firstChild.nextSibling;
									var a = i.nextSibling.nextSibling;
									return L(r, () => t().homeTotal.toLocaleString(), null), L(i, () => t().searchTotal.toLocaleString(), null), L(a, A(j, {
										get each() {
											return t().homeMonths;
										},
										children: (e) => (() => {
											var t = Xo(), r = t.firstChild;
											return L(t, () => n(e), r), L(t, () => e.count.toLocaleString(), null), t;
										})()
									})), e;
								})()
							]
						}
					];
				} });
			}
		})), e;
	})()];
}
function Il({ link: e, thumbnailSrc: t, title: n, dateText: r, views: i, excerpt: a = n }) {
	return (() => {
		var o = Zo(), s = o.firstChild, c = s.nextSibling.firstChild, l = c.firstChild.firstChild, u = c.nextSibling, d = u.firstChild;
		return d.nextSibling, L(s, t ? (() => {
			var r = Qo(), i = r.firstChild;
			return F(r, "href", e), F(i, "src", t), F(i, "alt", n), r;
		})() : (() => {
			var t = $o();
			return F(t, "href", e), L(t, a), t;
		})()), F(l, "href", e), L(l, n), L(d, r), L(u, i, null), o;
	})();
}
function Ll(e) {
	let [t] = T(async () => e.render(await Wr(e.id), e.words || []));
	return A(M, {
		get when() {
			return t();
		},
		get children() {
			return t();
		}
	});
}
async function Rl(e) {
	let t = e.folderID ?? await J(e.title), [n, r, i] = await Promise.all([
		q(t).catch(() => ""),
		Gr(t).catch(() => ""),
		jt()
	]), a = await di(n || r), o = e.recommend === !0 ? "👍" : e.recommend === !1 ? "👎" : "", s = [
		X(e.startDate),
		e.contributors?.join(", "),
		`👁 ${i[t] || 0}`
	].filter(Boolean).join(" · ");
	return (() => {
		var n = ts(), r = n.firstChild, i = r.firstChild, c = r.nextSibling, l = c.nextSibling;
		return L(r, A(M, {
			when: o,
			get children() {
				var e = es();
				return L(e, o), e;
			}
		}), i), L(i, () => e.title), L(c, s), C((e) => {
			var n = Y(t), r = K.parse(a);
			return n !== e.e && F(i, "href", e.e = n), r !== e.t && (l.innerHTML = e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function zl(e) {
	let t = () => e.meta, n = () => t().postTitle || t().postAuthor || t().postSubject || t().postTime || t().deleted === !0, r = () => t().commentQuote || t().commentSubject || t().commentTime || t().commentQuoteAuthor;
	return [A(M, {
		get when() {
			return n();
		},
		get children() {
			var e = os(), n = e.firstChild.nextSibling, r = n.firstChild, i = r.firstChild;
			return L(i, () => t().postAuthor || "Unknown User"), L(r, A(M, {
				get when() {
					return t().postTime;
				},
				get children() {
					var e = ns();
					return L(e, () => t().postTime), e;
				}
			}), null), L(r, A(M, {
				get when() {
					return t().deleted === !0;
				},
				get children() {
					return rs();
				}
			}), null), L(n, A(M, {
				get when() {
					return t().postTitle;
				},
				get children() {
					var e = is();
					return L(e, () => t().postTitle), e;
				}
			}), null), L(n, A(M, {
				get when() {
					return t().postSubject;
				},
				get children() {
					var e = as();
					return L(e, () => t().postSubject), e;
				}
			}), null), e;
		}
	}), A(M, {
		get when() {
			return r();
		},
		get children() {
			var e = us(), n = e.firstChild.nextSibling, r = n.firstChild;
			return r.firstChild.firstChild.nextSibling.nextSibling, L(r, A(M, {
				get when() {
					return t().commentTime;
				},
				get children() {
					var e = ss();
					return L(e, () => t().commentTime), e;
				}
			}), null), L(n, A(M, {
				get when() {
					return t().commentQuote;
				},
				get children() {
					var e = cs();
					return L(e, () => t().commentQuote), e;
				}
			}), null), L(n, A(M, {
				get when() {
					return t().commentSubject;
				},
				get children() {
					var e = ls();
					return L(e, () => t().commentSubject), e;
				}
			}), null), e;
		}
	})];
}
async function Bl(e, t = []) {
	let n = e.folderID ?? await J(e.title);
	return (() => {
		var r = ds(), i = r.firstChild, a = i.firstChild, o = i.nextSibling;
		return L(a, () => ci(e.title || n, t)), L(o, A(zl, { meta: e })), C(() => F(a, "href", Y(n))), r;
	})();
}
var Vl = "/viewers/cep-js/assets/Social Posts", Hl = {
	"Chuck E. Cheese LinkedIn Account": {
		name: "Chuck E. Cheese",
		avatar: `${Vl}/LinkedInChuckECheese.jpg`
	},
	"Chuck E. Cheese Chile LinkedIn Account": {
		name: "Chuck E. Cheese Chile",
		avatar: `${Vl}/LinkedInChuckECheeseChile.jpg`
	}
}, Ul = /(https?:\/\/[^\s]+|#[\p{L}\p{N}_]+)/gu, Wl = /^(.*?)([.,;:!?)\]]*)$/s, Gl = (e) => {
	let t = (e.tags || []).map((e) => String(e).split("|")[0].trim()), n = t.find((e) => Hl[e]) || t[0] || "";
	return Hl[n] || {
		name: n.replace(/\s*LinkedIn Account$/i, "") || "LinkedIn",
		avatar: null
	};
}, Kl = (e) => {
	let t = /(^|\n\n)>/.exec(e);
	return t ? e.slice(0, t.index).trim() : e.trim();
};
async function ql(e) {
	return (await Promise.all((e || []).map(async (e) => {
		try {
			let t = await J(e);
			return t ? {
				id: t,
				title: e
			} : null;
		} catch {
			return null;
		}
	}))).filter(Boolean);
}
function Jl(e) {
	let t = () => String(e.text || "").split(Ul);
	return (() => {
		var n = fs();
		return L(n, A(j, {
			get each() {
				return t();
			},
			children: (t) => {
				if (/^https?:\/\//.test(t)) {
					let [, e, n] = Wl.exec(t);
					return [(() => {
						var t = Za();
						return F(t, "href", e), L(t, e), t;
					})(), n];
				}
				return /^#/.test(t) ? (() => {
					var e = ps();
					return L(e, t), e;
				})() : N(() => ci(t, e.words || []));
			}
		})), n;
	})();
}
function Yl(e) {
	let t = () => e.photos || [];
	return A(M, {
		get when() {
			return t().length;
		},
		get children() {
			var e = io();
			return L(e, A(j, {
				get each() {
					return t().slice(0, 4);
				},
				children: (e, n) => (() => {
					var r = hs(), i = r.firstChild;
					return L(r, A(M, {
						get when() {
							return N(() => t().length > 4)() && n() === 3;
						},
						get children() {
							var e = ms();
							return e.firstChild, L(e, () => t().length - 4, null), e;
						}
					}), null), C((t) => {
						var n = Y(e.id), a = e.title, o = `/content/${e.id}/photo.avif`;
						return n !== t.e && F(r, "href", t.e = n), a !== t.t && F(i, "alt", t.t = a), o !== t.a && F(i, "src", t.a = o), t;
					}, {
						e: void 0,
						t: void 0,
						a: void 0
					}), r;
				})()
			})), C(() => I(e, `LIPhotos LIPhotos${Math.min(t().length, 4)}`)), e;
		}
	});
}
function Xl(e) {
	let t = () => (e.links || []).filter($c);
	return [
		A(M, {
			get when() {
				return t().length;
			},
			get children() {
				var e = gs();
				return L(e, A(j, {
					get each() {
						return t();
					},
					children: (e) => (() => {
						var t = xs(), n = t.firstChild, r = n.nextSibling;
						return F(t, "href", e), L(n, () => el(e) || e), L(r, e), t;
					})()
				})), e;
			}
		}),
		A(M, {
			get when() {
				return e.hasVideo;
			},
			get children() {
				var t = vs();
				return t.firstChild, L(t, A(M, {
					get when() {
						return $c(e.videoUrl || "");
					},
					get children() {
						return [" ", (() => {
							var t = _s();
							return C(() => F(t, "href", e.videoUrl)), t;
						})()];
					}
				}), null), t;
			}
		}),
		A(M, {
			get when() {
				return e.hasDocument;
			},
			get children() {
				return ys();
			}
		}),
		A(M, {
			get when() {
				return e.hasPoll;
			},
			get children() {
				return bs();
			}
		})
	];
}
function Zl(e) {
	let t = () => e.meta, n = () => Gl(t()), r = () => t().postReshareAuthor !== void 0 || !!t().postReshareText, i = () => (t().citations || []).find((e) => /^https?:\/\/(www\.)?linkedin\.com\//i.test(e)), [a] = T(async () => {
		let n = await q(e.link ?? t().folderID ?? await J(t().title)).catch(() => ""), [i, a] = await Promise.all([ql(t().postImages), ql(t().postReshareImages)]);
		return {
			text: r() ? Kl(n || "") : (n || "").trim(),
			photos: i,
			quotedPhotos: a
		};
	});
	return [(() => {
		var r = Ss(), i = r.firstChild, a = i.nextSibling.firstChild, o = a.nextSibling, s = o.firstChild;
		return L(i, A(M, {
			get when() {
				return !n().avatar;
			},
			get children() {
				return n().name.charAt(0);
			}
		})), L(a, () => n().name), L(o, A(M, {
			get when() {
				return e.link;
			},
			get fallback() {
				return (() => {
					var e = Wa();
					return L(e, () => X(t().startDate)), e;
				})();
			},
			get children() {
				var n = bo();
				return L(n, () => X(t().startDate)), C(() => F(n, "href", Y(e.link))), n;
			}
		}), s), C((e) => Xe(i, n().avatar ? { "background-image": `url('${n().avatar}')` } : {}, e)), r;
	})(), A(M, {
		get when() {
			return !a.loading;
		},
		get fallback() {
			return Ds();
		},
		get children() {
			return [
				A(M, {
					get when() {
						return a()?.text;
					},
					get children() {
						return A(Jl, {
							get text() {
								return a().text;
							},
							get words() {
								return e.words;
							}
						});
					}
				}),
				A(Yl, { get photos() {
					return a()?.photos;
				} }),
				A(Xl, {
					get links() {
						return t().postLinks;
					},
					get hasVideo() {
						return t().postHasVideo;
					},
					get videoUrl() {
						return t().postVideoUrl;
					},
					get hasDocument() {
						return t().postHasDocument;
					},
					get hasPoll() {
						return t().postHasPoll;
					}
				}),
				A(M, {
					get when() {
						return r();
					},
					get children() {
						var n = Ts(), r = n.firstChild;
						return L(r, A(M, {
							get when() {
								return t().postReshareAuthor;
							},
							get fallback() {
								return Os();
							},
							get children() {
								return A(M, {
									get when() {
										return $c(t().postReshareAuthorUrl || "");
									},
									get fallback() {
										return (() => {
											var e = ks();
											return L(e, () => t().postReshareAuthor), e;
										})();
									},
									get children() {
										var e = Cs();
										return L(e, () => t().postReshareAuthor), C(() => F(e, "href", t().postReshareAuthorUrl)), e;
									}
								});
							}
						})), L(n, A(M, {
							get when() {
								return t().postReshareText;
							},
							get children() {
								return A(Jl, {
									get text() {
										return t().postReshareText;
									},
									get words() {
										return e.words;
									}
								});
							}
						}), null), L(n, A(Yl, { get photos() {
							return a()?.quotedPhotos;
						} }), null), L(n, A(Xl, {
							get links() {
								return t().postReshareLinks;
							},
							get hasVideo() {
								return t().postReshareHasVideo;
							},
							get hasDocument() {
								return t().postReshareHasDocument;
							},
							get hasPoll() {
								return t().postReshareHasPoll;
							}
						}), null), L(n, A(M, {
							get when() {
								return $c(t().postReshareUrl || "");
							},
							get children() {
								var e = ws(), n = e.firstChild;
								return C(() => F(n, "href", t().postReshareUrl)), e;
							}
						}), null), n;
					}
				}),
				A(M, {
					get when() {
						return i();
					},
					get children() {
						var e = Es(), t = e.firstChild;
						return C(() => F(t, "href", i())), e;
					}
				})
			];
		}
	})];
}
async function Ql(e, t = []) {
	let n = e.folderID ?? await J(e.title), r = Gl(e);
	return (() => {
		var i = As(), a = i.firstChild, o = a.firstChild, s = a.nextSibling;
		return L(o, () => ci(`${r.name} – ${X(e.startDate)}`, t)), L(s, A(Zl, {
			meta: e,
			link: n,
			words: t
		})), C(() => F(o, "href", Y(n))), i;
	})();
}
function $l(e) {
	let t = Gl(e);
	return [
		(() => {
			var n = js();
			return L(n, () => `${t.name} – ${X(e.startDate)}`), n;
		})(),
		A(cl, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var t = Ms(), n = t.firstChild;
			return L(n, A(Zl, { meta: e })), L(t, A(il, { get citations() {
				return e.citations;
			} }), null), L(t, A(al, { get folderID() {
				return e.folderID;
			} }), null), L(t, A(ol, { get folderID() {
				return e.folderID;
			} }), null), t;
		})()
	];
}
function eu(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "reviews": return Rl(e, t);
		case "steam comment": return Bl(e, t);
		case "linkedin post": return Ql(e, t);
		default: return tu(e, t);
	}
}
async function tu(e, t = []) {
	let n = await J(e.title), r = (e.type || "").toLowerCase(), i = r.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), a = await ai(e);
	a ||= await ni(e);
	let o = await jt(), s = e.title;
	if (r === "photos") try {
		let e = await fetch(`/content/${n}/content.md`), t = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !t) {
			let t = (await e.text()).trim();
			t && (s = t);
		}
	} catch {}
	let c = i ? ` type-${i}` : "";
	return (() => {
		var i = Ns(), l = i.firstChild, u = l.nextSibling, d = u.firstChild, f = d.firstChild.firstChild, p = d.nextSibling, m = p.firstChild;
		return m.nextSibling, I(i, `Card fade-in${c}`), I(l, `CardImage${c}`), L(l, a), I(u, `CardTextArea${c}`), I(d, `CardLink${c}`), L(f, () => ci(s, t)), I(p, `CardText${c}`), L(m, (() => {
			var t = N(() => !!Vc.has(r));
			return () => t() ? X(e.startDate) : [
				N(() => X(e.startDate)),
				" – ",
				N(() => $r(e.endDate))
			];
		})()), L(p, () => o[n], null), C(() => F(f, "href", Y(n))), i;
	})();
}
async function nu(e) {
	let t = await J(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await jt(), a = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (a = t);
		}
	} catch {}
	let o = Vc.has(n) ? X(e.startDate) : `${X(e.startDate)} \u2013 ${$r(e.endDate)}`;
	return {
		link: t,
		label: a,
		dates: o,
		views: i[t],
		t: r ? ` type-${r}` : ""
	};
}
async function ru(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await nu(e), s = await ai(e);
	return (() => {
		var e = Ps(), c = e.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, I(e, `Compact fade-in${o}`), I(c, `CompactImage${o}`), L(c, s), I(l, `CompactText${o}`), I(u, `CompactTitle${o}`), L(d, () => ci(r, t)), I(f, `CompactMeta${o}`), L(p, i), L(f, a, null), C(() => F(d, "href", Y(n))), e;
	})();
}
async function iu(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await nu(e);
	return (() => {
		var e = Fs(), s = e.firstChild, c = s.nextSibling, l = c.firstChild;
		return l.nextSibling, I(e, `ListRow fade-in${o}`), L(s, () => ci(r, t)), L(l, i), L(c, a, null), C(() => F(s, "href", Y(n))), e;
	})();
}
function au() {
	return Is();
}
async function ou(e) {
	let t = await e(), n = await Promise.all(t.map((e) => Wr(e).catch(() => null)));
	return Promise.all(n.filter(Boolean).map((e) => tu(e)));
}
function su(e) {
	let t = e.replace(/(\.\d{3})\d+/, "$1"), n = /(Z|[+-]\d\d:\d\d)$/.test(t) ? t : `${t}Z`, r = Math.max(0, Math.floor((Date.now() - new Date(n).getTime()) / 6e4));
	if (r < 1) return "Just now";
	if (r < 60) return Yc(r, "min");
	let i = Math.floor(r / 60);
	if (i < 24) return Yc(i, "hour");
	let a = Math.floor(i / 24);
	return a < 7 ? Yc(a, "day") : Yc(Math.floor(a / 7), "week");
}
function cu(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = su(r.submittedAt), i = `${r.username}|${e}`, a = n.get(i);
		a || (a = {
			username: r.username,
			label: e,
			items: []
		}, n.set(i, a), t.push(a)), a.items.push(r);
	}
	return t;
}
function lu(e) {
	let [t] = T(() => e.s.pageID, async (e) => ai(await Wr(e)));
	return (() => {
		var n = Rs(), r = n.firstChild, i = r.firstChild, a = i.firstChild;
		return L(n, A(M, {
			get when() {
				return t();
			},
			get children() {
				var e = Ls();
				return L(e, t), e;
			}
		}), r), L(r, A(M, {
			get when() {
				return e.s.pageID;
			},
			get fallback() {
				return e.s.title?.trim() || "New Article";
			},
			get children() {
				var t = bo();
				return L(t, () => e.s.title.trim()), C(() => F(t, "href", Y(e.s.pageID))), t;
			}
		}), i), L(a, () => Xc(e.s)), L(i, A(rl, { get files() {
			return e.s.files;
		} }), null), C(() => I(a, `RecentChangesStatus ${Xc(e.s).toLowerCase()}`)), n;
	})();
}
function uu() {
	let e = /* @__PURE__ */ new Date();
	return `${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function du() {
	let [e] = T(async () => {
		let e = (await Mt())[uu()] || {}, [t, n] = await Promise.all([ou(() => e.s || []), ou(() => e.e || [])]);
		return {
			started: t,
			ended: n
		};
	}), [t] = T(() => ou(ri)), [n] = T(Nt), [r] = T(Pt), [i] = T(pi), [a] = T(() => ou(wt)), [o] = T(() => ou(Ct)), [s] = T(async () => {
		let e = [...await Ft()].sort((e, t) => new Date(t.submittedAt) - new Date(e.submittedAt));
		return Promise.all(e.map(async (e) => ({
			...e,
			pageID: e.title?.trim() ? await J(e.title.trim()) : null
		})));
	});
	return [Jo(), (() => {
		var c = zs(), l = c.firstChild.nextSibling.nextSibling, u = l.nextSibling;
		return L(c, A(yu, { tabs: [{
			name: "The News",
			content: () => (() => {
				var e = Bs();
				return L(e, A(j, {
					get each() {
						return n() || [];
					},
					children: (e) => Il({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: li(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}, {
			name: "Social Media",
			content: () => (() => {
				var e = Bs();
				return L(e, A(j, {
					get each() {
						return a() || [];
					},
					children: (e) => e
				})), e;
			})()
		}] }), l), L(c, A(yu, { tabs: [
			{
				name: "Navigation",
				content: () => (() => {
					var e = Vs();
					return L(e, A(j, {
						each: Uc,
						children: (e) => (() => {
							var t = Hs(), n = t.firstChild, r = n.nextSibling;
							return L(n, () => e.name), L(r, A(j, {
								get each() {
									return e.tags;
								},
								children: (e) => (() => {
									var t = bo();
									return L(t, e), C(() => F(t, "href", xa([e]))), t;
								})()
							})), t;
						})()
					})), e;
				})()
			},
			{
				name: "Pinned",
				content: () => A(M, {
					get when() {
						return t();
					},
					get fallback() {
						return Ja();
					},
					get children() {
						return A(M, {
							get when() {
								return t().length;
							},
							get fallback() {
								return Us();
							},
							get children() {
								return [Jo(), (() => {
									var e = no();
									return L(e, A(j, {
										get each() {
											return t();
										},
										children: (e) => e
									})), e;
								})()];
							}
						});
					}
				})
			},
			{
				name: "Map",
				content: () => A(M, {
					get when() {
						return N(() => !i.loading)() && i();
					},
					get children() {
						return i();
					}
				})
			},
			{
				name: "Anniversaries",
				content: () => A(M, {
					get when() {
						return e();
					},
					get fallback() {
						return Ja();
					},
					get children() {
						return A(M, {
							get when() {
								return e().started.length || e().ended.length;
							},
							get fallback() {
								return Ks();
							},
							get children() {
								return [A(M, {
									get when() {
										return e().started.length;
									},
									get children() {
										return [Ws(), (() => {
											var t = Bs();
											return L(t, A(j, {
												get each() {
													return e().started;
												},
												children: (e) => e
											})), t;
										})()];
									}
								}), A(M, {
									get when() {
										return e().ended.length;
									},
									get children() {
										return [Gs(), (() => {
											var t = Bs();
											return L(t, A(j, {
												get each() {
													return e().ended;
												},
												children: (e) => e
											})), t;
										})()];
									}
								})];
							}
						});
					}
				})
			},
			{
				name: "Recent Changes",
				content: () => (() => {
					var e = qs();
					return L(e, A(j, {
						get each() {
							return cu(s() || []);
						},
						children: (e) => (() => {
							var t = Ys(), n = t.firstChild;
							return L(t, () => Rc(e.username), n), L(n, () => e.label), L(t, A(M, {
								get when() {
									return e.items.length > 1;
								},
								get fallback() {
									return A(lu, { get s() {
										return e.items[0];
									} });
								},
								get children() {
									var t = Js();
									return L(t, A(j, {
										get each() {
											return e.items;
										},
										children: (e) => (() => {
											var t = Xs();
											return L(t, A(lu, { s: e })), t;
										})()
									})), t;
								}
							}), null), t;
						})()
					})), e;
				})()
			}
		] }), u), L(c, A(yu, { tabs: [{
			name: "Fan Videos",
			content: () => (() => {
				var e = Bs();
				return L(e, A(j, {
					get each() {
						return o() || [];
					},
					children: (e) => e
				})), e;
			})()
		}, {
			name: "New Posts",
			content: () => (() => {
				var e = Bs();
				return L(e, A(j, {
					get each() {
						return r() || [];
					},
					children: (e) => Il({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: li(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}] }), null), c;
	})()];
}
function fu() {
	let [e] = T(Ot);
	return (() => {
		var t = Zs(), n = t.firstChild.nextSibling;
		return n.nextSibling, L(t, () => Qr(e()?.generated), n), t;
	})();
}
var pu = [
	"CEC Master is watching",
	"Set for a remodel soon!",
	"Set to be demolished soon!",
	"Unacceptable Crust!",
	"Hasta la pasta!",
	"Born on May 17th, 445 B.P. (Before Pasqually)",
	"Sponsored by Winchester Grandma",
	"Formerly Pizza Time Techs",
	"Formerly Chuck-E-Pedia",
	"DRUM SOLO",
	"Poggers...",
	"I was afraid to speak when I was just a lad",
	"Turn off the fruitcake dog!",
	"Bring back Crusty!",
	"Bring back Rick Rat!",
	"Sanctioned by the city of Irving!",
	"Not to be confused with that other site",
	"Fully open sourced!",
	"We canonize trans Beach Bear",
	"Conceptually Unified!",
	"Orange-carpet free!",
	"Sorry about your local",
	"Forever indebted to Miraheze",
	"The articles get a bit quirky at night",
	"Hello? Hello hello?",
	"Thaaaat's me!",
	"Better than any university!",
	"For animatronic lovers",
	"For Uncle Klunk lovers",
	"DONT. SMOKE. CRAYOLAS.",
	"Found out by the dumpster!",
	"Full of non-merch!",
	"Not an encyclopedia of cheese",
	"Formerly an encyclopedia of cheese",
	"Read by Mark Kupferman!",
	"Written by employees!",
	"Save Your Family.",
	"Scan or Ban",
	"Come for the cheese, stay for the pedia!",
	"Nolan did nothing to shape PTT! It was Gene Landrum and Bob Black!",
	"The only (semi complete) showtape archive!",
	"We'll finish the articles some day!",
	"Ar ar ar ar ar",
	"The #10th source for animatronic information",
	"Archive everything!!!",
	"Not to be confused for the FNaF Wiki",
	"Formerly a MediaWiki site!",
	"Wow thats uh, a lot of articles.",
	"Home of your favorite rockabilly relative",
	"Publishers of 'What is This Thing on My Head' by Dook Larue",
	"Able to make every sound in the whole world at the same time but backwards.",
	"The secret FNaF lore!",
	"Just a theory!",
	"The pizza may be recycled but not the articles!",
	"Lovingly crafted by the community",
	"Fixing names like 'Phase 4' and 'The Shelf' since 2022.",
	"The cult of Pasqually",
	"Powered by Gas-O-Hol!",
	"Featured in the news!",
	"The Mult-Eye-Media En-Cy-Clopedia Chuck E. Chees-Ia",
	"Your name is 'Exit'?",
	"Powered by the Awesome Adventure Machine",
	"Paper or Plastic?",
	"Our Community Garden",
	"Santa Lucia! I'ma goin'a crazy! I quit! I go back to Italia!",
	"Pizza, Pizza, Pizza in the Air!",
	"Answers how many electrons can fit in a teaspoon.",
	"Dumpster Diving Experts",
	"Strike It Up FOUND MEDIA!! youtube.com/watch?v=dQw4w9WgXcQ",
	"Down the Rabbit Hole, Into the Pit",
	"I'm- the star of the show, you are -not.",
	"Mr. Munch is ticklin' the cheese.",
	"There's Drum, pasquallin away!",
	"As heard on K-PIZZA and K-CEC",
	"You gave Larry a laserbeam?!?",
	"Pasqually has been banned from Amatuer Hour",
	"Pasqually has canonically committed tax fraud",
	"PROTECT TRANS KIDS!",
	"TRANS RIGHTS!",
	"Even we can't explain the Fun Pass",
	"You're gonna buy the Fun Pass OR ELSE",
	"The false prophet will come bearing the Fun Pass",
	"YOU get a Fun Pass and YOU get a Fun Pass",
	"Mere days from bankrupcy",
	"oh hi mark",
	"Secretly a dough mixer",
	"Home of the Bankrupcy Believers",
	"For the People of the Pizza",
	"Home of the secret last Road Stage!",
	"There's settings on the bottom right!",
	"Featuring your favorite taxidermies!",
	"Not AI slop!",
	"Where lost media becomes found",
	"Home of The Big Cheese",
	"Falling in Love With a Corporate Illustration",
	"Companies are not your friend, steal everything.",
	"Love yourself",
	"Chuck A.I. Cheese",
	"CEC AI World",
	"Let's replace Mark and David with AI",
	"Alright, alright! Who's got my master remote?",
	"Please DON'T call 1-800-NO-MO-ADS today!",
	"Funner than ever!",
	"Who writes this stuff?!",
	"Will be finished by the summer of 2011!",
	"Stay out of chimneys, they could be dangerous.",
	"In Pizza We Trust",
	"Fun Fact: Pasqually's mustache is fake!",
	"What'yall doin'? Playin' games? Eatin' pizza?",
	"1 Minute 'Til Next Show",
	"That's a Deal!",
	"BLLUUUUUUUUUEEEEEEEEEE!!!!",
	"Yeah, we've just been takin' care of business",
	"It's Bluescreen time! Yeah!",
	"Sit back, relax, and soak up the best of CEC TV",
	"Have fun! Be cool!",
	"Don't hurry to worry!",
	"Thank you, thank you Mr. Munch",
	"Chuck E. chose the cheddar and he chewed the cheese he chose",
	"There should be seatbelts in this thing!",
	"WARNING What you are about to see may shock you.",
	"If my lips ain't movin' it ain't working!",
	"Welcome to Showbiz it's all happening here!",
	"Destroy these props as they will not be used again",
	"Peekaboo, we caught you!",
	"If you are here for a birthday party please return to your table in the showroom",
	"Lightly sauce the pizza dough and sprinkle the cheese. Then, choose the toppings of your choice and place evenly over the top of the pizza.",
	"Unbolt Billy Bob and remove from the stage",
	"randy: no fun allowed",
	"Bankruptcy Imminent",
	"cereal... pajamas... movie...",
	"I stopped worrying about what my legacy with the Rock-A-Fire Explosion would be before I found out there were fans.",
	"Majorly Magic",
	"Where A Historian Can Be A Historian",
	"Hater of Discord",
	"It's called a residency.",
	"All Pages, Zero Tokens",
	"Let the enter-train-ment begin!",
	"Every Guest Leaves Happy",
	"Just another Pizza Place...",
	"The Secrets of the Mimic",
	"You always come back.",
	"6AM",
	"Unaffiliated with freddysfanzone.com",
	"What a deceptive calling, I knew Phase 4 was a lie the moment I heard it, obviously.",
	"Help Wanted",
	"My name is David, Dad, I want some bankruptcy, David, that is my name.",
	"They call me The Bomb Thief, uh",
	"Originator of The Goongalar (really)",
	"Honey you mean Helpules",
	"Rule 6: Don't touch Freddy.",
	"Please shout out the contributors if you're doing research for a video!",
	"Toy Chica is William Afton",
	"FNaF: Making more money than CEC since 2014.",
	"We were here before Adventure World became the new 2.0",
	"RIP /cep-js/",
	"Its more like 40 years of fun + 10 years of hell."
], mu = {
	"01-01": "Enjoy A New Year!",
	"01-04": "Happy Rock-afire Replay deletion Day!",
	"01-06": "RIP Kansas City State Line, you died 3 times.",
	"02-14": "Happy Valentines Day from Cheese-E-Pedia!",
	"03-01": "Happy Birthday Mr. Munch!",
	"03-02": "Today's the anniversary of the first ShowBiz location, Kansas City!",
	"03-25": "Today's the anniversary of the CEC Future Planning Survey!",
	"04-20": "Haha look at the date",
	"05-17": "Today's the anniversary of the first CEC location, Winchester!",
	"05-27": "Happy Birthday Helen Henny!",
	"06-01": "Happy Pride Month! Trans Rights!",
	"06-23": "Happy Birthday Billy Bob!",
	"07-01": "Happy Wrath Month! Trans Rights!",
	"07-14": "Today's the anniversary of Cheese-E-Pedia!",
	"07-24": "Today's the anniversary of Reel to Real!",
	"08-08": "Happy Anniversary FNaF!",
	"08-25": "Happy Rock-afire Replay Anniversary!",
	"08-26": "Happy Birthday Jasper T. Jowls!",
	"09-26": "Happy Anniversary to CEC's 2030 Credit Extension, RIP Bankruptcy Believers.",
	"09-27": "Happy Anniversary RAE Documentary!",
	"10-05": "Happy Anniversary CEC In The Galaxy 5000!",
	"10-27": "Happy Anniversary FNaF Movie!",
	"10-31": "Happy Halloween and Chuck E. Cheese Pizza (Mall Chain) Anniversary!",
	"11-06": "Happy Infinite Fun Pass Glitch Day!",
	"11-07": "Happy CEC Adventure World Anniversary!",
	"11-10": "Happy Anniversary of the first Legacy Location re-opening, Northridge!",
	"11-13": "Look for the Gummy Bear album in stores on November 13th, with lots of music, videos and extras.",
	"11-27": "Happy Chuck E. Cheese Christmas Anniversary!",
	"12-02": "Today's the anniversary of the second CEC location, Kooser!",
	"12-05": "Happy Anniversary FNaF Movie 2!",
	"12-09": "Happy Reel to Real Cease & Desist Day!",
	"12-12": "Happy Birthday Pasqually!",
	"12-25": "Merry Christmas from Cheese-E-Pedia!",
	"12-31": "Happy New Year from Cheese-E-Pedia!"
};
function hu() {
	let e = /* @__PURE__ */ new Date();
	return `"${mu[`${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`] ?? pu[Math.floor(Math.random() * pu.length)]}"`;
}
function gu(e) {
	e.style.fontSize = "";
	let t = parseFloat(getComputedStyle(e).fontSize);
	for (; e.scrollWidth > e.clientWidth && t > 8;) --t, e.style.fontSize = `${t}px`;
}
function _u() {
	let e = hu();
	return (() => {
		var t = Qs();
		return $e((e) => {
			let t = () => {
				if (!e.isConnected) return requestAnimationFrame(t);
				gu(e), new ResizeObserver(() => gu(e)).observe(e);
			};
			requestAnimationFrame(t);
		}, t), L(t, e), t;
	})();
}
function vu() {
	let [e] = T(Ot), t = (t) => e()?.[t]?.toLocaleString() ?? "????", n = Gc.standard;
	try {
		let e = Ml(), t = JSON.parse(localStorage.getItem("cep-theme-custom") || "null");
		n = e === "custom" && t?.["--logo"] ? t["--logo"] : Gc[e] || Gc.standard;
	} catch {}
	let r = new URLSearchParams(window.location.search).get("page") === "search";
	return (() => {
		var e = $s(), i = e.firstChild, a = i.firstChild, o = i.nextSibling, s = o.firstChild.nextSibling, c = s.firstChild.firstChild, l = c.firstChild, u = c.nextSibling, d = u.firstChild, f = u.nextSibling, p = f.firstChild, m = f.nextSibling, h = m.firstChild, g = m.nextSibling.firstChild, _ = s.nextSibling.nextSibling, v = _.firstChild, y = v.firstChild;
		return _.nextSibling, L(e, _u, i), F(a, "src", "/viewers/cep-js/assets/Logos/" + n), L(l, () => t("articles")), L(d, () => t("photos")), L(p, () => t("videos")), L(h, () => t("tags")), L(g, () => t("articles")), L(v, () => t("contributors"), y), L(o, !r && (() => {
			var e = ec();
			return e.$$click = () => window.location.href = "/?v=cep-solid&page=search", e;
		})(), null), e;
	})();
}
function yu(e) {
	let [t, n] = S(e.tabs[0].name);
	return [(() => {
		var r = io();
		return L(r, A(j, {
			get each() {
				return e.tabs;
			},
			children: (e) => (() => {
				var r = tc();
				return r.$$click = () => n(e.name), L(r, () => e.name), C((n) => {
					var i = t() === e.name, a = t() === e.name;
					return i !== n.e && r.classList.toggle("active", n.e = i), a !== n.t && F(r, "aria-pressed", n.t = a), n;
				}, {
					e: void 0,
					t: void 0
				}), r;
			})()
		})), r;
	})(), A(j, {
		get each() {
			return e.tabs;
		},
		children: (e) => (() => {
			var n = nc();
			return L(n, () => e.content()), C((r) => Ze(n, "display", t() === e.name ? "" : "none")), n;
		})()
	})];
}
function bu(e) {
	for (let t = e.length - 1; t > 0; t--) {
		let n = Math.floor(Math.random() * (t + 1));
		[e[t], e[n]] = [e[n], e[t]];
	}
	return e;
}
function xu() {
	let [e, t] = S(Z("sRandomTab", "Articles", (e) => Object.hasOwn(Hc, e))), n = {};
	for (let e of Object.keys(Hc)) {
		let [t, r] = S([]), [i, a] = S(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([Dt(), jt()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = Hc[e], [i, o] = await a(), s = bu(Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e)), c = 0;
		for (let e = 0; e < s.length && c < Wc; e += 20) {
			let n = await Promise.all(s.slice(e, e + 20).map((e) => Wr(e).catch(() => null))), r = [];
			for (let t = 0; t < n.length && c < Wc; t++) n[t] && (r.push({
				id: s[e + t],
				meta: n[t]
			}), c++);
			await Promise.all(r.map(async ({ id: e, meta: n }) => {
				let r = await tu(n), i = o[e];
				t.setEntries((e) => {
					let t = [...e, {
						views: i,
						card: r
					}];
					return t.sort((e, t) => t.views - e.views), t;
				});
			}));
		}
		t.setLoaded(!0);
	}
	return te(() => {
		let t = e();
		Q("sRandomTab", t), E(() => o(t));
	}), [
		rc(),
		(() => {
			var n = io();
			return L(n, A(j, {
				get each() {
					return Object.keys(Hc);
				},
				children: (n) => (() => {
					var r = tc();
					return r.$$click = () => t(n), L(r, n), C((t) => {
						var i = e() === n, a = e() === n;
						return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && F(r, "aria-pressed", t.t = a), t;
					}, {
						e: void 0,
						t: void 0
					}), r;
				})()
			})), n;
		})(),
		(() => {
			var e = ac();
			return L(e, A(j, {
				get each() {
					return r().entries();
				},
				children: (e) => e.card
			}), null), L(e, A(M, {
				get when() {
					return N(() => !r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return Ja();
				}
			}), null), L(e, A(M, {
				get when() {
					return N(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return ic();
				}
			}), null), e;
		})()
	];
}
function Su(e) {
	return A(M, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = oc(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
			return L(n, () => e.title, r), L(i, A(j, {
				get each() {
					return e.items;
				},
				get children() {
					return e.children;
				}
			})), t;
		}
	});
}
function Cu(e) {
	if (!e) return null;
	let t;
	try {
		t = new URL(e.trim());
	} catch {
		return null;
	}
	if (!/^https?:$/.test(t.protocol)) return null;
	let n = t.hostname.replace(/^www\./, ""), r = t.pathname.split("/").filter(Boolean);
	if (n === "youtu.be" && r[0]) return {
		kind: "iframe",
		src: `https://www.youtube-nocookie.com/embed/${r[0]}`
	};
	if (n.endsWith("youtube.com")) {
		let e = t.searchParams.get("v");
		if (!e && [
			"embed",
			"shorts",
			"live"
		].includes(r[0]) && (e = r[1]), e) return {
			kind: "iframe",
			src: `https://www.youtube-nocookie.com/embed/${e}`
		};
	}
	if (n === "vimeo.com" || n === "player.vimeo.com") {
		let e = r.find((e) => /^\d+$/.test(e));
		if (e) return {
			kind: "iframe",
			src: `https://player.vimeo.com/video/${e}`
		};
	}
	if (n === "archive.org" && ["details", "embed"].includes(r[0]) && r[1]) return {
		kind: "iframe",
		src: `https://archive.org/embed/${r[1]}`
	};
	if (n === "dailymotion.com" && r[0] === "video" && r[1]) return {
		kind: "iframe",
		src: `https://www.dailymotion.com/embed/video/${r[1]}`
	};
	if (n === "dai.ly" && r[0]) return {
		kind: "iframe",
		src: `https://www.dailymotion.com/embed/video/${r[0]}`
	};
	if (n === "streamable.com" && r[0]) {
		let e = r[0] === "e" ? r[1] : r[0];
		if (e) return {
			kind: "iframe",
			src: `https://streamable.com/e/${e}`
		};
	}
	return {
		kind: "link",
		src: t.href
	};
}
function wu(e) {
	let t = () => Cu(e.url);
	return A(M, {
		get when() {
			return t();
		},
		get children() {
			var e = uc();
			return L(e, A(Me, { get children() {
				return [
					A(Ne, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = sc();
							return C(() => F(e, "src", t().src)), e;
						}
					}),
					A(Ne, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = cc();
							return C(() => F(e, "src", t().src)), e;
						}
					}),
					A(Ne, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = lc();
							return L(e, () => t().src), C(() => F(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function Tu(e) {
	let [t] = T(async () => ei(await J(e.pageThumbnailFile))), [n] = T(() => fi(e)), [r] = T(async () => {
		let t = e.folderID ?? await J(e.title?.trim()), [n, r] = await Promise.all([q(t).catch(() => ""), Gr(t).catch(() => "")]);
		return {
			md: await di(n),
			old: await di(r)
		};
	});
	return [
		(() => {
			var t = js();
			return L(t, () => e.title), t;
		})(),
		A(cl, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var t = pc(), n = t.firstChild;
			return n.firstChild, L(t, A(wu, { get url() {
				return e.pageThumbnailVideo;
			} }), n), L(n, A(M, {
				get when() {
					return !r.loading;
				},
				get fallback() {
					return Ja();
				},
				get children() {
					return A(M, {
						get when() {
							return r()?.md || r()?.old;
						},
						get fallback() {
							return mc();
						},
						get children() {
							return [A(M, {
								get when() {
									return N(() => !r().md)() && r().old;
								},
								get children() {
									return dc();
								}
							}), (() => {
								var e = fc();
								return C(() => e.innerHTML = K.parse(r().md || r().old)), e;
							})()];
						}
					});
				}
			}), null), L(t, A(il, { get citations() {
				return e.citations;
			} }), null), L(t, A(al, { get folderID() {
				return e.folderID;
			} }), null), L(t, A(ol, { get folderID() {
				return e.folderID;
			} }), null), t;
		})()
	];
}
async function Eu(e) {
	let { link: t, dates: n, views: r } = await nu(e);
	return (() => {
		var i = hc(), a = i.firstChild, o = a.firstChild, s = a.nextSibling, c = s.firstChild;
		return c.nextSibling, F(o, "src", `/content/${t}/photo.avif`), L(c, n), L(s, r || 0, null), C((n) => {
			var r = Y(t), i = e.title;
			return r !== n.e && F(a, "href", n.e = r), i !== n.t && F(o, "alt", n.t = i), n;
		}, {
			e: void 0,
			t: void 0
		}), i;
	})();
}
async function Du(e) {
	let t = e.folderID ?? await J(e.title);
	return (() => {
		var n = gc(), r = n.firstChild, i = r.firstChild;
		return F(i, "src", `/content/${t}/photo.avif`), C((n) => {
			var a = Y(t), o = e.title;
			return a !== n.e && F(r, "href", n.e = a), o !== n.t && F(i, "alt", n.t = o), n;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function Ou(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return Eu(e);
		default: return ru(e, t);
	}
}
function ku(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return Du(e);
		default: return iu(e, t);
	}
}
function Au(e) {
	let [t] = T(() => ai(e)), [n] = T(async () => {
		let t = e.folderID ?? await J(e.title?.trim()), [n, r] = await Promise.all([q(t).catch(() => ""), Gr(t).catch(() => "")]);
		return {
			md: await di(n),
			old: await di(r)
		};
	});
	return [
		(() => {
			var t = js();
			return L(t, () => e.title), t;
		})(),
		A(cl, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var r = _c(), i = r.firstChild, a = i.nextSibling;
			return a.firstChild, L(i, A(M, {
				get when() {
					return N(() => !t.loading)() && t();
				},
				get children() {
					return t();
				}
			})), L(a, A(M, {
				get when() {
					return !n.loading;
				},
				get fallback() {
					return Ja();
				},
				get children() {
					return A(M, {
						get when() {
							return n()?.md || n()?.old;
						},
						get fallback() {
							return vc();
						},
						get children() {
							return [A(M, {
								get when() {
									return N(() => !n().md)() && n().old;
								},
								get children() {
									return dc();
								}
							}), (() => {
								var e = fc();
								return C(() => e.innerHTML = K.parse(n().md || n().old)), e;
							})()];
						}
					});
				}
			}), null), L(r, A(il, { get citations() {
				return e.citations;
			} }), null), L(r, A(al, { get folderID() {
				return e.folderID;
			} }), null), L(r, A(ol, { get folderID() {
				return e.folderID;
			} }), null), r;
		})()
	];
}
function ju(e) {
	let [t] = T(async () => ei(await J(e.pageThumbnailFile))), [n] = T(() => fi(e)), [r] = T(async () => {
		let t = e.folderID ?? await J(e.title?.trim()), [n, r] = await Promise.all([q(t).catch(() => ""), Gr(t).catch(() => "")]);
		return {
			md: await di(n),
			old: await di(r)
		};
	});
	return [
		(() => {
			var t = js();
			return L(t, () => e.title), t;
		})(),
		A(ml, {
			meta: e,
			get children() {
				var i = Sc(), a = i.firstChild;
				return L(i, A(M, {
					get when() {
						return (e.type || "").toLowerCase() !== "meta";
					},
					get children() {
						var r = xc(), i = r.firstChild, a = i.nextSibling.firstChild, o = a.firstChild.firstChild.nextSibling, s = o.firstChild, c = s.nextSibling.nextSibling;
						return L(i, A(M, {
							get when() {
								return N(() => !t.loading)() && t();
							},
							get children() {
								return t();
							}
						})), L(o, () => X(e.startDate), s), L(o, () => $r(e.endDate), c), L(a, A(M, {
							get when() {
								return e.sqft;
							},
							get children() {
								var t = yc(), n = t.firstChild.nextSibling, r = n.firstChild;
								return L(n, () => e.sqft, r), t;
							}
						}), null), L(r, A(Su, {
							title: "Remodels",
							get items() {
								return e.remodels;
							},
							children: (e) => (() => {
								var t = Cc(), n = t.firstChild, r = n.nextSibling.nextSibling;
								return r.nextSibling, L(n, () => e.n), L(t, () => X(e.s), r), t;
							})()
						}), null), L(r, A(Su, {
							title: "Stages",
							get items() {
								return e.stages;
							},
							children: (e) => (() => {
								var t = Tc(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
								return i.nextSibling, L(n, () => e.n), L(t, () => X(e.s), r), L(t, () => $r(e.e), i), L(t, A(M, {
									get when() {
										return e.desc;
									},
									get children() {
										var t = wc();
										return L(t, () => e.desc), t;
									}
								}), null), t;
							})()
						}), null), L(r, A(Su, {
							title: "Franchisees",
							get items() {
								return e.franchisees;
							},
							children: (e) => (() => {
								var t = Tc(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
								return i.nextSibling, L(n, () => e.n), L(t, () => X(e.s), r), L(t, () => $r(e.e), i), t;
							})()
						}), null), L(r, A(Su, {
							title: "Downloads",
							get items() {
								return e.downloadLinks;
							},
							children: (e) => (() => {
								var t = Ec(), n = t.firstChild;
								return L(n, () => e.label), C(() => F(n, "href", e.url)), t;
							})()
						}), null), L(r, A(Su, {
							title: "Showtape Formats",
							get items() {
								return e.showtapeFormats;
							},
							children: (e) => (() => {
								var t = Xs();
								return L(t, e), t;
							})()
						}), null), L(r, A(M, {
							get when() {
								return e.credits?.length;
							},
							get children() {
								var t = bc(), n = t.firstChild.nextSibling;
								return L(n, A(j, {
									get each() {
										return e.credits;
									},
									children: (e) => (() => {
										var t = Dc(), n = t.firstChild, r = n.firstChild;
										return n.nextSibling, L(n, () => e.role, r), L(t, () => e.n, null), t;
									})()
								})), t;
							}
						}), null), L(r, A(M, {
							get when() {
								return N(() => !n.loading)() && n();
							},
							get children() {
								return n();
							}
						}), null), r;
					}
				}), a), L(a, A(M, {
					get when() {
						return !r.loading;
					},
					get fallback() {
						return Ja();
					},
					get children() {
						return A(M, {
							get when() {
								return r()?.md || r()?.old;
							},
							get fallback() {
								return Oc();
							},
							get children() {
								return [A(M, {
									get when() {
										return N(() => !r().md)() && r().old;
									},
									get children() {
										return dc();
									}
								}), (() => {
									var e = fc();
									return C(() => e.innerHTML = K.parse(r().md || r().old)), e;
								})()];
							}
						});
					}
				})), L(i, A(il, { get citations() {
					return e.citations;
				} }), null), i;
			}
		}),
		A(al, { get folderID() {
			return e.folderID;
		} }),
		A(ol, { get folderID() {
			return e.folderID;
		} })
	];
}
Ge(["click", "input"]);
//#endregion
//#region src/App.jsx
var Mu = /*#__PURE__*/ P("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), Nu = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), Pu = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), Fu = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), Iu = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), Lu = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), Ru = /*#__PURE__*/ P("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function zu(e) {
	return [
		Mu(),
		Nu(),
		Pu(),
		Fu(),
		Iu(),
		Lu(),
		Ru(),
		N(vu),
		N(() => N(() => e.type === "search")() ? Ua() : N(() => e.type === "stats")() ? Fl() : N(() => e.type === "settings")() ? Pl() : N(() => e.type === "userpage")() ? Bc(e.user) : hl(e)),
		N(xu),
		N(fu)
	];
}
//#endregion
//#region index.jsx
var Bu = /^[a-z0-9]{8,32}$/;
function Vu(e) {
	fetch(`/track?p=${encodeURIComponent(e)}`).catch(() => {});
}
async function Hu(e, t) {
	if (Nl(), e.get("page") === "search") {
		We(() => zu({ type: "search" }), t), Vu("_search");
		return;
	}
	let n = e.get("user");
	if (n) {
		We(() => zu({
			type: "userpage",
			user: n
		}), t);
		return;
	}
	if (e.get("page") === "stats") {
		We(() => zu({ type: "stats" }), t);
		return;
	}
	if (e.get("page") === "settings") {
		We(() => zu({ type: "settings" }), t);
		return;
	}
	let r = (e.get("") || "").replace(/^\/+|\/+$/g, ""), i = await Wr(r);
	We(() => zu(i), t);
	let a = r === "" ? "_home" : r;
	(a === "_home" || Bu.test(a)) && Vu(a);
}
//#endregion
export { Hu as render };
