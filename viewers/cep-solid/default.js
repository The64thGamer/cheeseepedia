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
	}, s = i ? e : () => e(() => E(() => A(o)));
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
			D(s, void 0, be(n), t);
			return;
		}
		return ne(r) ? (s = r, "v" in r ? (r.s === 1 ? D(s, r.v, void 0, t) : D(s, void 0, be(r.v), t), r) : (d = !0, queueMicrotask(() => d = !1), k(() => {
			oe(f ? "refreshing" : "pending"), T();
		}, !1), r.then((e) => D(r, e, void 0, t), (e) => D(r, void 0, be(e), t)))) : (D(s, r, void 0, t), r);
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
		Se(e);
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
	let t = w(e), n = w(() => Ce(t()));
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
	A(e);
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
		return e.pure && (g && g.running ? (e.tState = d, e.tOwned && e.tOwned.forEach(A), e.tOwned = void 0) : (e.state = d, e.owned && e.owned.forEach(A), e.owned = null)), e.updatedAt = n + 1, Se(t);
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
		n || (y = null), v = null, Se(e);
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
				for (let e of n) A(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) A(t.owned[e]);
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
function A(e) {
	let t;
	if (e.sources) for (; e.sources.length;) {
		let t = e.sources.pop(), n = e.sourceSlots.pop(), r = t.observers;
		if (r && r.length) {
			let e = r.pop(), i = t.observerSlots.pop();
			n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i);
		}
	}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) A(e.tOwned[t]);
		delete e.tOwned;
	}
	if (g && g.running && e.pure) ye(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) A(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	g && g.running ? e.tState = 0 : e.state = 0;
}
function ye(e, t) {
	if (t || (e.tState = 0, g.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) ye(e.owned[t]);
}
function be(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function xe(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		Se(e, n && n.owner || null);
	}
}
function Se(e, t = h) {
	let n = l && t && t.context && t.context[l], r = be(e);
	if (!n) throw r;
	y ? y.push({
		fn() {
			xe(r, n, t);
		},
		state: d
	}) : xe(r, n, t);
}
function Ce(e) {
	if (typeof e == "function" && !e.length) return Ce(e());
	if (Array.isArray(e)) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r = Ce(e[n]);
			if (Array.isArray(r)) {
				if (r.length < 32768) t.push.apply(t, r);
				else for (let e = 0; e < r.length; e++) t.push(r[e]);
			} else t.push(r);
		}
		return t;
	}
	return e;
}
var we = Symbol("fallback");
function Te(e) {
	for (let t = 0; t < e.length; t++) e[t]();
}
function Ee(e, t, n = {}) {
	let r = [], i = [], a = [], o = 0, c = t.length > 1 ? [] : null;
	return re(() => Te(a)), () => {
		let l = e() || [], u = l.length, d, f;
		return l[s], E(() => {
			let e, t, s, m, h, g, _, v, y;
			if (u === 0) o !== 0 && (Te(a), a = [], r = [], i = [], o = 0, c &&= []), n.fallback && (r = [we], i[0] = x((e) => (a[0] = e, n.fallback())), o = 1);
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
function j(e, t) {
	return E(() => e(t || {}));
}
function De() {
	return !0;
}
var Oe = {
	get(e, t, n) {
		return t === a ? n : e.get(t);
	},
	has(e, t) {
		return t === a || e.has(t);
	},
	set: De,
	deleteProperty: De,
	getOwnPropertyDescriptor(e, t) {
		return {
			configurable: !0,
			enumerable: !0,
			get() {
				return e.get(t);
			},
			set: De,
			deleteProperty: De
		};
	},
	ownKeys(e) {
		return e.keys();
	}
};
function ke(e, ...t) {
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
			}, Oe);
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
		}, Oe)), a;
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
var Ae = (e) => `Stale read from <${e}>.`;
function M(e) {
	let t = "fallback" in e && { fallback: () => e.fallback };
	return w(Ee(() => e.each, e.children, t || void 0));
}
function N(e) {
	let t = e.keyed, n = w(() => e.when, void 0, void 0), r = t ? n : w(n, void 0, { equals: (e, t) => !e == !t });
	return w(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? E(() => a(t ? i : () => {
				if (!E(r)) throw Ae("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
function je(e) {
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
			if (E(n)()?.[0] !== r) throw Ae("Match");
			return i();
		})) : o;
	}, void 0, void 0);
}
function Me(e) {
	return e;
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
var Ne = /*#__PURE__*/ new Set([
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
]), Pe = /*#__PURE__*/ new Set([
	"innerHTML",
	"textContent",
	"innerText",
	"children"
]), Fe = /*#__PURE__*/ Object.assign(Object.create(null), {
	className: "class",
	htmlFor: "for"
}), Ie = /*#__PURE__*/ Object.assign(Object.create(null), {
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
function Le(e, t) {
	let n = Ie[e];
	return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
var Re = /*#__PURE__*/ new Set([
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
]), ze = /*#__PURE__*/ new Set(/* @__PURE__ */ "altGlyph.altGlyphDef.altGlyphItem.animate.animateColor.animateMotion.animateTransform.circle.clipPath.color-profile.cursor.defs.desc.ellipse.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.filter.font.font-face.font-face-format.font-face-name.font-face-src.font-face-uri.foreignObject.g.glyph.glyphRef.hkern.image.line.linearGradient.marker.mask.metadata.missing-glyph.mpath.path.pattern.polygon.polyline.radialGradient.rect.set.stop.svg.switch.symbol.text.textPath.tref.tspan.use.view.vkern".split(".")), Be = {
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace"
}, P = (e) => w(() => e());
function Ve(e, t, n) {
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
var He = "_$DX_DELEGATE";
function Ue(e, t, n, r = {}) {
	let i;
	return x((r) => {
		i = r, t === document ? e() : R(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function F(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => E(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function We(e, t = window.document) {
	let n = t[He] || (t[He] = /* @__PURE__ */ new Set());
	for (let r = 0, i = e.length; r < i; r++) {
		let i = e[r];
		n.has(i) || (n.add(i), t.addEventListener(i, it));
	}
}
function I(e, t, n) {
	z(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ge(e, t, n, r) {
	z(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function Ke(e, t, n) {
	z(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function L(e, t) {
	z(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function qe(e, t, n, r) {
	if (r) Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
	else if (Array.isArray(n)) {
		let r = n[0];
		e.addEventListener(t, n[0] = (t) => r.call(e, n[1], t));
	} else e.addEventListener(t, n, typeof n != "function" && n);
}
function Je(e, t, n = {}) {
	let r = Object.keys(t || {}), i = Object.keys(n), a, o;
	for (a = 0, o = i.length; a < o; a++) {
		let r = i[a];
		r && r !== "undefined" && !t[r] && (nt(e, r, !1), delete n[r]);
	}
	for (a = 0, o = r.length; a < o; a++) {
		let i = r[a], o = !!t[i];
		i && i !== "undefined" && n[i] !== o && o && (nt(e, i, !0), n[i] = o);
	}
	return n;
}
function Ye(e, t, n) {
	if (!t) return n ? I(e, "style") : t;
	let r = e.style;
	if (typeof t == "string") return r.cssText = t;
	typeof n == "string" && (r.cssText = n = void 0), n ||= {}, t ||= {};
	let i, a;
	for (a in n) t[a] ?? r.removeProperty(a), delete n[a];
	for (a in t) i = t[a], i !== n[a] && (r.setProperty(a, i), n[a] = i);
	return n;
}
function Xe(e, t, n) {
	n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n);
}
function Ze(e, t = {}, n, r) {
	let i = {};
	return r || C(() => i.children = at(e, t.children, i.children)), C(() => typeof t.ref == "function" && Qe(t.ref, e)), C(() => $e(e, t, n, !0, i, !0)), i;
}
function Qe(e, t, n) {
	return E(() => e(t, n));
}
function R(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return at(e, t, r, n);
	C((r) => at(e, t(), r, n), r);
}
function $e(e, t, n, r, i = {}, a = !1) {
	t ||= {};
	for (let r in i) if (!(r in t)) {
		if (r === "children") continue;
		i[r] = rt(e, r, null, i[r], n, a, t);
	}
	for (let o in t) {
		if (o === "children") {
			r || at(e, t.children);
			continue;
		}
		let s = t[o];
		i[o] = rt(e, o, s, i[o], n, a, t);
	}
}
function et(e) {
	let n, r;
	return !z() || !(n = t.registry.get(r = lt())) ? e() : (t.completed && t.completed.add(n), t.registry.delete(r), n);
}
function z(e) {
	return !!t.context && !t.done && (!e || e.isConnected);
}
function tt(e) {
	return e.toLowerCase().replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function nt(e, t, n) {
	let r = t.trim().split(/\s+/);
	for (let t = 0, i = r.length; t < i; t++) e.classList.toggle(r[t], n);
}
function rt(e, t, n, r, i, a, o) {
	let s, c, l, u, d;
	if (t === "style") return Ye(e, n, r);
	if (t === "classList") return Je(e, n, r);
	if (n === r) return r;
	if (t === "ref") a || n(e);
	else if (t.slice(0, 3) === "on:") {
		let i = t.slice(3);
		r && e.removeEventListener(i, r, typeof r != "function" && r), n && e.addEventListener(i, n, typeof n != "function" && n);
	} else if (t.slice(0, 10) === "oncapture:") {
		let i = t.slice(10);
		r && e.removeEventListener(i, r, !0), n && e.addEventListener(i, n, !0);
	} else if (t.slice(0, 2) === "on") {
		let i = t.slice(2).toLowerCase(), a = Re.has(i);
		if (!a && r) {
			let t = Array.isArray(r) ? r[0] : r;
			e.removeEventListener(i, t);
		}
		(a || n) && (qe(e, i, n, a), a && We([i]));
	} else if (t.slice(0, 5) === "attr:") I(e, t.slice(5), n);
	else if (t.slice(0, 5) === "bool:") Ke(e, t.slice(5), n);
	else if ((d = t.slice(0, 5) === "prop:") || (l = Pe.has(t)) || !i && ((u = Le(t, e.tagName)) || (c = Ne.has(t))) || (s = e.nodeName.includes("-") || "is" in o)) {
		if (d) t = t.slice(5), c = !0;
		else if (z(e)) return n;
		t === "class" || t === "className" ? L(e, n) : s && !c && !l ? e[tt(t)] = n : (t === "value" || t === "defaultValue") && (e.nodeName === "INPUT" || e.nodeName === "TEXTAREA") ? e[u || t] = n ?? "" : e[u || t] = n;
	} else {
		let r = i && t.indexOf(":") > -1 && Be[t.split(":")[0]];
		r ? Ge(e, r, t, n) : I(e, Fe[t] || t, n);
	}
	return n;
}
function it(e) {
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
function at(e, t, n, r, i) {
	let a = z(e);
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
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = ct(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = ct(e, n, r);
	} else if (o === "function") return C(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = at(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (ot(o, t, n, i)) return C(() => n = at(e, o, n, r, !0)), () => n;
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
			if (n = ct(e, n, r), s) return n;
		} else c ? n.length === 0 ? st(e, o, r) : Ve(e, n, o) : (n && ct(e), st(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = ct(e, n, r, t);
			ct(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function ot(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = ot(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = ot(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function st(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function ct(e, t, n, r) {
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
function lt() {
	return t.getNextContextId();
}
var ut = "http://www.w3.org/2000/svg";
function dt(e, t = !1, n = void 0) {
	return t ? document.createElementNS(ut, e) : document.createElement(e, { is: n });
}
function ft(e, n) {
	let r = w(e);
	return w(() => {
		let e = r();
		switch (typeof e) {
			case "function": return E(() => e(n));
			case "string":
				let r = ze.has(e), i = t.context ? et() : dt(e, r, E(() => n.is));
				return Ze(i, n, r), i;
		}
	});
}
function pt(e) {
	let [, t] = ke(e, ["component"]);
	return ft(() => e.component, t);
}
//#endregion
//#region src/GlobalJsonCache.jsx
var mt = null, ht = null, gt = null, _t = null, vt = null, yt = null, bt = null, xt = null, St = null;
async function Ct() {
	return St ||= await (await fetch("/viewers/cep-solid/compiled-json/sortKeys.json")).json(), St;
}
async function wt() {
	return bt ||= await (await fetch("/viewers/cep-solid/compiled-json/recentfanvideos.json")).json(), bt;
}
async function Tt() {
	return xt ||= await (await fetch("/viewers/cep-solid/compiled-json/recentofficialvideos.json")).json(), xt;
}
async function Et() {
	return mt ||= await (await fetch("/viewers/cep-solid/compiled-json/titleToFolderIDMap.json")).json(), mt;
}
async function Dt() {
	return ht ||= await (await fetch("/viewers/cep-solid/compiled-json/folderIDToTitleMap.json")).json(), ht;
}
async function Ot() {
	return gt ||= await (await fetch("/viewers/cep-js/compiled-json/views.json")).json(), gt;
}
async function kt() {
	return _t ||= await (await fetch("/viewers/cep-solid/compiled-json/typeToIDList.json")).json(), _t;
}
async function At() {
	return vt ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseNews.json")).json(), vt;
}
async function jt() {
	return yt ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseRecent.json")).json(), yt;
}
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function Mt() {
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
var Nt = Mt();
function Pt(e) {
	Nt = e;
}
var B = { exec: () => null };
function Ft(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function V(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(H.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var It = ((e = "") => {
	try {
		return !!RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), H = {
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
	nextBulletRegex: Ft((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: Ft((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: Ft((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: Ft((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: Ft((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: Ft((e) => RegExp(`^ {0,${e}}>`))
}, Lt = /^(?:[ \t]*(?:\n|$))+/, Rt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, zt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Bt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Vt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ht = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ut = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Wt = V(Ut).replace(/bull/g, Ht).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Gt = V(Ut).replace(/bull/g, Ht).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Kt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, qt = /^[^\n]+/, Jt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Yt = V(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Jt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Xt = V(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Ht).getRegex(), Zt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, $t = V("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Qt).replace("tag", Zt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), en = (e) => V(Kt).replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Zt).getRegex(), tn = en(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), nn = en(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), rn = {
	blockquote: V(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", nn).getRegex(),
	code: Rt,
	def: Yt,
	fences: zt,
	heading: Vt,
	hr: Bt,
	html: $t,
	lheading: Wt,
	list: Xt,
	newline: Lt,
	paragraph: tn,
	table: B,
	text: qt
}, an = V("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Zt).getRegex(), on = {
	...rn,
	lheading: Gt,
	table: an,
	paragraph: V(Kt).replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", an).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Zt).getRegex()
}, sn = {
	...rn,
	html: V("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", Qt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: B,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: V(Kt).replace("hr", Bt).replace("heading", " *#{1,6} *[^\n]").replace("lheading", Wt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ln = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, un = /^( {2,}|\\)\n(?!\s*$)/, dn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, U = /[\p{P}\p{S}]/u, fn = /[\s\p{P}\p{S}]/u, pn = /[^\s\p{P}\p{S}]/u, mn = V(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, fn).getRegex(), hn = /[\p{Pi}\p{Ps}"']/u, gn = /(?!~)[\p{P}\p{S}]/u, _n = /(?!~)[\s\p{P}\p{S}]/u, vn = /(?:[^\s\p{P}\p{S}]|~)/u, yn = V(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", It ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), bn = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, xn = V(bn, "u").replace(/punct/g, U).getRegex(), Sn = V(bn, "u").replace(/punct/g, gn).getRegex(), Cn = V(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, hn).replace(/punct/g, U).getRegex(), wn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Tn = V(wn, "gu").replace(/notPunctSpace/g, pn).replace(/punctSpace/g, fn).replace(/punct/g, U).getRegex(), En = V(wn, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, _n).replace(/punct/g, gn).getRegex(), Dn = V("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, pn).replace(/punctSpace/g, fn).replace(/punct/g, U).getRegex(), On = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pn).replace(/punctSpace/g, fn).replace(/punct/g, U).getRegex(), kn = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, pn).replace(/punctSpace/g, fn).replace(/punct/g, U).getRegex(), An = V(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, U).getRegex(), jn = V("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, pn).replace(/punctSpace/g, fn).replace(/punct/g, U).getRegex(), Mn = V(/\\(punct)/, "gu").replace(/punct/g, U).getRegex(), Nn = V(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Pn = V(Qt).replace("(?:-->|$)", "-->").getRegex(), Fn = V("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Pn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), In = V(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), Ln = V(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", In).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Rn = V(/^!?\[(label)\]\[(ref)\]/).replace("label", In).replace("ref", Jt).getRegex(), zn = V(/^!?\[(ref)\](?:\[\])?/).replace("ref", Jt).getRegex(), Bn = V("reflink|nolink(?!\\()", "g").replace("reflink", Rn).replace("nolink", zn).getRegex(), Vn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Hn = {
	_backpedal: B,
	anyPunctuation: Mn,
	autolink: Nn,
	blockSkip: yn,
	br: un,
	code: ln,
	del: B,
	delLDelim: B,
	delRDelim: B,
	emStrongLDelim: xn,
	emStrongRDelimAst: Tn,
	emStrongRDelimUnd: On,
	escape: cn,
	link: Ln,
	nolink: zn,
	punctuation: mn,
	reflink: Rn,
	reflinkSearch: Bn,
	tag: Fn,
	text: dn,
	url: B
}, Un = {
	...Hn,
	emStrongLDelim: Cn,
	emStrongRDelimAst: Dn,
	emStrongRDelimUnd: kn,
	link: V(/^!?\[(label)\]\((.*?)\)/).replace("label", In).getRegex(),
	reflink: V(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", In).getRegex()
}, Wn = {
	...Hn,
	emStrongRDelimAst: En,
	emStrongLDelim: Sn,
	delLDelim: An,
	delRDelim: jn,
	url: V(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Vn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: V(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Vn).getRegex()
}, Gn = {
	...Wn,
	br: V(un).replace("{2,}", "*").getRegex(),
	text: V(Wn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Kn = {
	normal: rn,
	gfm: on,
	pedantic: sn
}, qn = {
	normal: Hn,
	gfm: Wn,
	breaks: Gn,
	pedantic: Un
}, Jn = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Yn = (e) => Jn[e];
function W(e, t) {
	if (t) {
		if (H.escapeTest.test(e)) return e.replace(H.escapeReplace, Yn);
	} else if (H.escapeTestNoEncode.test(e)) return e.replace(H.escapeReplaceNoEncode, Yn);
	return e;
}
function Xn(e) {
	try {
		e = encodeURI(e).replace(H.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Zn(e, t) {
	let n = e.replace(H.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(H.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(H.slashPipe, "|");
	return n;
}
function G(e, t, n) {
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
function Qn(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && H.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function $n(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function er(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function tr(e, t, n, r, i) {
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
function nr(e, t, n) {
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
var rr = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || Nt;
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
			let e = this.options.pedantic ? t[0] : Qn(t[0]);
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
			let e = t[0], n = nr(e, t[3] || "", this.rules);
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
				let t = G(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: G(t[0], "\n"),
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
			raw: G(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = G(t[0], "\n").split("\n"), n = "", r = "", i = [];
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
				let c = er(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = Qn(t[0]);
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
				raw: G(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = Zn(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: G(t[0], "\n"),
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
			for (let e of i) a.rows.push(Zn(e, a.header.length).map((e, t) => ({
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
				raw: G(t[0], "\n"),
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
				let t = G(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = $n(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), tr(t, {
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
			return tr(n, e, n[0], this.lexer, this.rules);
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
}, K = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || Nt, this.options.tokenizer = this.options.tokenizer || new rr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: H,
			block: Kn.normal,
			inline: qn.normal
		};
		this.options.pedantic ? (t.block = Kn.pedantic, t.inline = qn.pedantic) : this.options.gfm && (t.block = Kn.gfm, t.inline = this.options.breaks ? qn.breaks : qn.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Kn,
			inline: qn
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(H.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(H.tabCharGlobal, "    ").replace(H.spaceLine, ""));
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
}, ir = class {
	options;
	parser;
	constructor(e) {
		this.options = e || Nt;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(H.notSpaceStart)?.[0], i = e ? e.replace(H.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + W(r) + "\">" + (n ? i : W(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : W(i, !0)) + "</code></pre>\n";
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
		return `<code>${W(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? W(n, !0) : this.parser.parseInline(r), o = Xn(e);
		if (o === null) return a;
		e = W(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + W(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Xn(e);
		if (i === null) return W(n);
		e = i;
		let a = `<img src="${W(e)}" alt="${W(n)}"`;
		return t && (a += ` title="${W(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : W(e.text);
	}
}, ar = class {
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
}, q = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || Nt, this.options.renderer = this.options.renderer || new ir(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ar();
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
}, or = class {
	options;
	block;
	constructor(e) {
		this.options = e || Nt;
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
		return e ? K.lex : K.lexInline;
	}
	provideParser(e = this.block) {
		return e ? q.parse : q.parseInline;
	}
}, J = new class {
	defaults = Mt();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = q;
	Renderer = ir;
	TextRenderer = ar;
	Lexer = K;
	Tokenizer = rr;
	Hooks = or;
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
				let t = this.defaults.renderer || new ir(this.defaults);
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
				let t = this.defaults.tokenizer || new rr(this.defaults);
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
				let t = this.defaults.hooks || new or();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = or.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && or.passThroughHooksRespectAsync.has(n)) return (async () => {
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
		return K.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return q.parse(e, t ?? this.defaults);
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
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? K.lex : K.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? q.parse : q.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? K.lex : K.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? q.parse : q.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + W(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function Y(e, t) {
	return J.parse(e, t);
}
Y.options = Y.setOptions = function(e) {
	return J.setOptions(e), Y.defaults = J.defaults, Pt(Y.defaults), Y;
}, Y.getDefaults = Mt, Y.defaults = Nt;
function sr(...e) {
	return J.use(...e), Y.defaults = J.defaults, Pt(Y.defaults), Y;
}
Y.use = sr, Y.walkTokens = function(e, t) {
	return J.walkTokens(e, t);
}, Y.parseInline = J.parseInline, Y.Parser = q, Y.parser = q.parse, Y.Renderer = ir, Y.TextRenderer = ar, Y.Lexer = K, Y.lexer = K.lex, Y.Tokenizer = rr, Y.Hooks = or, Y.parse = Y, Y.options, Y.setOptions, Y.walkTokens, Y.parseInline, q.parse, K.lex;
//#endregion
//#region src/MapRenderer.jsx
var cr = "/viewers/cep-solid/compiled-json/map_pins.json", lr = "/viewers/cep-js/assets/Map Markers/", ur = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", dr = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", fr = {
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
}, pr = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), mr = (e) => String(e).padStart(2, "0"), hr = (e) => `${e.getFullYear()}-${mr(e.getMonth() + 1)}-${mr(e.getDate())}`, gr = (e) => new Date(e, 1, 29).getDate() === 29, _r = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function vr(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function yr() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = ur, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = dr, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function br() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = ".MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}", document.head.appendChild(e);
}
function xr(e, t) {
	let n = e.getElement();
	if (!n) return;
	let r = n.style.transform.replace(/\s*scale\([^)]*\)\s*$/, "");
	n.style.transform = t ? `${r} scale(2.5)` : r;
}
function Sr(e) {
	let t = new URLSearchParams(location.search).get("v") || "cep-js", n = document.createElement("a");
	return n.href = `/?v=${t}&=${encodeURIComponent(e)}`, n.textContent = "Loading…", fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => {
		n.textContent = e.title;
	}).catch(() => {
		n.textContent = "Open article";
	}), n;
}
var Cr = null;
function wr() {
	return Cr ||= fetch(cr).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = pr(e.s), e._e = pr(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: pr(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), Cr = null, [])), Cr;
}
async function Tr(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await yr(), br();
	let i = window.L;
	e.innerHTML = "", e.style.display = "flex", e.style.flexDirection = "column";
	let a = document.createElement("div");
	a.style.cssText = `flex:1;min-height:${n ? 16 : 30}rem;border-radius:1em;overflow:hidden;`, e.appendChild(a);
	let o = i.map(a).setView(n ? t[0].c : [38, -96], n ? 10 : 4);
	i.tileLayer("https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
		minZoom: 1,
		maxZoom: 16,
		attribution: "Tiles © Esri"
	}).addTo(o), r && t.length && o.fitBounds(t.map((e) => e.c), {
		padding: [40, 40],
		maxZoom: 12
	});
	let s = Object.fromEntries(Object.entries(fr).map(([e, t]) => [e, i.icon({
		iconUrl: lr + t,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), c = i.layerGroup().addTo(o), l = t.map((e) => {
		let t = i.marker(e.c).bindPopup(n ? e.c.join(", ") : () => Sr(e.p));
		return t.on("mouseover", () => {
			t.setZIndexOffset(1e3), xr(t, !0);
		}), t.on("mouseout", () => {
			t.setZIndexOffset(0), xr(t, !1);
		}), t;
	});
	function u(e) {
		let r = e.getTime();
		t.forEach((e, t) => {
			let i = n ? Math.min(Math.max(r, e._s), e._e) : r, a = l[t];
			if (i < e._s || i > e._e) {
				c.removeLayer(a);
				return;
			}
			let o = vr(e, i);
			a._pin !== o && (a.setIcon(s[o] || s.c), a._pin = o), c.addLayer(a);
		});
	}
	let d = /* @__PURE__ */ new Date();
	if (n) return u(d), { destroy: () => o.remove() };
	let f = document.createElement("div");
	f.className = "MapControls", f.innerHTML = `
    <output class="MapDateDisplay"></output>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Year</label>
      <input type="range" class="MapYearSlider" min="1970" max="${d.getFullYear()}" style="flex:1">
    </div>
    <div class="MapSliderRow">
      <label class="MapSliderLabel">Date</label>
      <input type="range" class="MapDaySlider" min="1" max="365" style="flex:1">
      <input type="date" class="MapDatePicker" style="flex-shrink:0;margin-left:0.75em">
    </div>
  `, e.appendChild(f);
	let p = f.querySelector(".MapYearSlider"), m = f.querySelector(".MapDaySlider"), h = f.querySelector(".MapDatePicker"), g = f.querySelector(".MapDateDisplay");
	function _() {
		let e = gr(+p.value) ? 366 : 365;
		m.max = e, +m.value > e && (m.value = e);
	}
	function v() {
		let e = new Date(+p.value, 0);
		e.setDate(+m.value), g.textContent = `${mr(e.getMonth() + 1)}/${mr(e.getDate())}/${e.getFullYear()}`, h.value = hr(e), u(e);
	}
	let y = null;
	function b() {
		y ||= requestAnimationFrame(() => {
			y = null, v();
		});
	}
	return p.addEventListener("input", () => {
		_(), b();
	}), m.addEventListener("input", b), h.addEventListener("change", () => {
		if (!h.value) return;
		let e = /* @__PURE__ */ new Date(h.value + "T00:00:00");
		p.value = e.getFullYear(), _(), m.value = _r(e), b();
	}), p.value = d.getFullYear(), _(), m.value = _r(d), v(), { destroy: () => o.remove() };
}
//#endregion
//#region src/GlobalFunctions.jsx
var Er = /*#__PURE__*/ F("<a><img alt loading=lazy class>", !0, !1, !1), Dr = /*#__PURE__*/ F("<a class=CardImageExcerpt>Error?"), Or = /*#__PURE__*/ F("<a class=CardImageExcerpt>No Article Content. Come write some!"), kr = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), Ar = /*#__PURE__*/ F("<a><img loading=lazy class>", !0, !1, !1), jr = /*#__PURE__*/ F("<div class=\"MapContainer fade-in\">"), Mr = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), Nr = [
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
];
async function Pr(e) {
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
async function Fr(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Ir(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function X(e) {
	return (await Et())[e] ?? null;
}
function Lr() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function Z(e) {
	return `/?v=${Lr()}&=${e}`;
}
function Q(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Nr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function Rr(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Nr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function zr(e) {
	return e ? (() => {
		var t = Er(), n = t.firstChild;
		return Qe((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), C(() => I(t, "href", Z(e))), t;
	})() : null;
}
function Br(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function Vr(e, t = 160) {
	let n = await X(e.title);
	if (!n) return (() => {
		var e = Dr();
		return C(() => I(e, "href", Z(n))), e;
	})();
	let r = await Fr(n) || await Ir(n);
	if (!r) return (() => {
		var e = Or();
		return C(() => I(e, "href", Z(n))), e;
	})();
	let i = Br(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = Or();
		return C(() => I(e, "href", Z(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = kr();
		return R(e, a), C(() => I(e, "href", Z(n))), e;
	})();
}
function Hr(e, t = null, n) {
	try {
		let r = localStorage.getItem(e);
		if (r === null) return t;
		let i = typeof t == "string" ? r : JSON.parse(r);
		return n && !n(i) ? t : i;
	} catch {
		return t;
	}
}
function Ur(e, t) {
	try {
		return localStorage.setItem(e, typeof t == "string" ? t : JSON.stringify(t)), !0;
	} catch {
		return !1;
	}
}
async function Wr(e) {
	let t = await X(e.title);
	if (!t) return null;
	let n = null;
	if (e?.pageThumbnailFile ? n = await X(e.pageThumbnailFile) : await new Promise((e) => {
		let n = new Image();
		n.onload = () => e(!0), n.onerror = () => e(!1), n.src = `/content/${t}/photo.avif`;
	}) && (n = t), !n) return null;
	let r = "", [i, a] = await Promise.all([Fr(t).catch(() => ""), Ir(t).catch(() => "")]), o = await qr(i || a || "");
	return r = (new DOMParser().parseFromString(Y.parse(o), "text/html").body.textContent || "").trim(), (() => {
		var e = Ar(), i = e.firstChild;
		return Qe((e) => {
			let t = `/content/${n}/lowphoto.avif`, r = `/content/${n}/photo.avif`;
			e.onload = () => {
				let t = new Image();
				t.onload = () => e.src = r, t.src = r;
			}, e.onerror = () => e.src = r, e.src = t;
		}, i), I(i, "alt", r), C(() => I(e, "href", Z(t))), e;
	})();
}
function Gr(e) {
	return new Date(e).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function Kr(e) {
	return (() => {
		var t = jr();
		return Qe((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function qr(e) {
	let t = e.split(/(```[\s\S]*?```|`[^`\n]*`)/);
	return (await Promise.all(t.map(async (e, t) => {
		if (t % 2) return e;
		let n = [...e.matchAll(/(?<![\]\\])\[([^\[\]\n]+)\](?![(\[:])/g)], r = await Promise.all(n.map(async (e) => {
			let t = e[1].trim();
			if (!t || /^[xX]$/.test(t)) return e[0];
			if (/^\d+$/.test(t)) return `<sup><a href="#cite-${t}">(${t})</a></sup>`;
			let n = await X(t);
			return n ? `[${t}](${Z(n)})` : `<span class="BadLink">${t}</span>`;
		})), i = "", a = 0;
		return n.forEach((t, n) => {
			i += e.slice(a, t.index) + r[n], a = t.index + t[0].length;
		}), i + e.slice(a);
	}))).join("");
}
async function Jr(e) {
	if (!Mr.has((e?.type || "").toLowerCase())) return null;
	let t = await X(e?.title);
	if (!t) return null;
	let n = (await wr()).find((e) => e.p === t);
	return n ? Kr((e) => Tr(e, [n], { single: !0 })) : null;
}
async function Yr() {
	let e = await wr();
	return e.length ? Kr((t) => Tr(t, e)) : null;
}
//#endregion
//#region src/SearchPage.jsx
var Xr = /*#__PURE__*/ F("<mark>"), Zr = /*#__PURE__*/ F("<img alt loading=lazy>", !0, !1, !1), Qr = /*#__PURE__*/ F("<strong>"), $r = /*#__PURE__*/ F("<button type=button class=\"ResultTag ResultTagMore\">. . ."), ei = /*#__PURE__*/ F("<span class=ResultTime>"), ti = /*#__PURE__*/ F("<div class=ResultSummary>"), ni = /*#__PURE__*/ F("<div class=\"Result ResultList fade-in\"><div class=ResultThumb><a></a></div><div class=ResultBody><div class=ResultTitle><a></a></div><div class=ResultDates></div><div class=ResultTags>"), ri = /*#__PURE__*/ F("<a class=ResultTag>"), ii = /*#__PURE__*/ F("<div>"), ai = /*#__PURE__*/ F("<button type=button class=PinButton>Prev"), oi = /*#__PURE__*/ F("<button type=button class=PinButton>Next"), si = /*#__PURE__*/ F("<div class=SearchPager>"), ci = /*#__PURE__*/ F("<span>…"), li = /*#__PURE__*/ F("<button type=button class=PinButton>"), ui = /*#__PURE__*/ F("<ul class=SearchSuggestions>"), di = /*#__PURE__*/ F("<div class=SearchBar><div class=SearchBarField><input class=SearchInput type=text autocomplete=off></div><button type=button class=SearchButton>Search"), fi = /*#__PURE__*/ F("<span class=SearchChip><button type=button class=SearchChipRemove>×"), pi = /*#__PURE__*/ F("<li class=SearchSuggestion> <span class=SearchCount>"), mi = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">Nothing found."), hi = /*#__PURE__*/ F("<div class=SearchLayout><aside class=SearchSidebar><div class=SearchFilterGroup><label>Sort: <select id=sSort></select></label><label>Display: <select id=sResultView></select></label></div><div class=SearchFilterGroup></div></aside><main class=SearchResults><div class=SearchStatus>"), gi = /*#__PURE__*/ F("<div class=SearchPage>"), _i = /*#__PURE__*/ F("<div class=SearchStatus>Loading search…"), vi = /*#__PURE__*/ F("<option>"), yi = /*#__PURE__*/ F("<li>…"), bi = /*#__PURE__*/ F("<ul class=SearchTypePreview>"), xi = /*#__PURE__*/ F("<div class=SearchTypeFilter><button type=button class=PinButton> (<!>)"), Si = /*#__PURE__*/ F("<li>"), Ci = "/viewers/cep-solid/compiled-json/search.sqlite", wi = "/viewers/cep-solid/compiled-json/sqlite.worker.js", Ti = "/viewers/cep-solid/compiled-json/sql-wasm.wasm", Ei = 1024, Di = 3e3, Oi = 24, ki = 8, Ai = 5, ji = 200, Mi = .5, Ni = 50, Pi = [
	["relevancy", "Relevancy"],
	["oldest", "Oldest → Newest"],
	["newest", "Newest → Oldest"],
	["newest-updated", "Recently Updated"],
	["oldest-updated", "Least Recently Updated"],
	["most-views", "Most Views"],
	["least-views", "Least Views"]
], Fi = Pi.map(([e]) => e), Ii = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comments",
	"theories",
	"meta",
	"transcriptions"
]), Li = null, Ri = null, zi = null, Bi = null, Vi = /* @__PURE__ */ new Map();
async function Hi() {
	return Li ||= await (await fetch("/viewers/cep-solid/compiled-json/tags.json")).json(), Li;
}
async function Ui() {
	return Ri ||= await (await fetch("/viewers/cep-solid/compiled-json/folderIDToTags.json")).json(), Ri;
}
var Wi = (e) => (e || "").toLowerCase().replace(/[‘’]/g, "'"), Gi = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Ki = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), qi = (e) => `'${e.replace(/'/g, "''")}'`, $ = (...e) => console.log("[search-debug]", ...e);
async function Ji(e, t, n) {
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
async function Yi(e, t) {
	let n = qi(t), r = [
		["sqlite version", "SELECT sqlite_version() AS v"],
		["chunk row count", "SELECT count(*) AS n FROM chunks"],
		["match only", `SELECT folder FROM chunks WHERE chunks MATCH ${n} LIMIT 3`],
		["match + rank", `SELECT folder, rank FROM chunks WHERE chunks MATCH ${n} ORDER BY rank LIMIT 3`],
		["match + snippet", `SELECT folder, snippet(chunks, 0, char(1), char(2), '…', ${Oi}) AS found FROM chunks WHERE chunks MATCH ${n} LIMIT 3`]
	];
	$("fts match string:", t);
	for (let [t, n] of r) try {
		$(t, await e.db.query(n));
	} catch (e) {
		$(t, "FAILED", e?.message || e);
	}
}
function Xi(e) {
	return [...(e || "").matchAll(/"([^"]*)"|(\S+)/g)].map((e) => Wi(e[1] ?? e[2]).trim()).filter(Boolean);
}
function Zi(e, t = " ") {
	return Xi(e).map((e) => `"${e.replace(/"/g, "")}" *`).join(t);
}
function Qi(e) {
	let t = `  ${e}  `, n = /* @__PURE__ */ new Set();
	for (let e = 0; e < t.length - 2; e++) n.add(t.slice(e, e + 3));
	return n;
}
function $i(e, t) {
	let [n, r] = e.size <= t.size ? [e, t] : [t, e], i = 0;
	for (let e of n) r.has(e) && i++;
	return 2 * i / (e.size + t.size);
}
function ea(e, t) {
	let n = (e || "").replace(/[‘’]/g, "'"), r = [...new Set(t.filter((e) => e.length > 1))].sort((e, t) => t.length - e.length);
	if (!r.length || !n) return [{
		text: n,
		hit: !1
	}];
	let i = RegExp(`(${r.map(Gi).join("|")})`, "gi");
	return n.split(i).map((e, t) => ({
		text: e,
		hit: t % 2 == 1
	})).filter((e) => e.text);
}
function ta(e) {
	return (e || "").split(/(\u0001[^\u0002]*\u0002)/).map((e) => e.startsWith("") ? {
		text: e.slice(1, -1),
		hit: !0
	} : {
		text: e,
		hit: !1
	}).filter((e) => e.text);
}
function na(e = [], t = "") {
	let n = new URLSearchParams({
		v: Lr(),
		page: "search"
	});
	return e.length && n.set("tags", e.join("|")), t && n.set("q", t), `/?${n.toString()}`;
}
function ra() {
	let e = new URLSearchParams(location.search);
	return {
		tags: (e.get("tags") || "").split("|").map((e) => e.trim()).filter(Boolean),
		q: (e.get("q") || "").trim()
	};
}
function ia() {
	return zi ||= Promise.all([
		Hi(),
		Ui(),
		kt(),
		Ot(),
		Dt(),
		Ct(),
		Et()
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
	}), zi;
}
function aa() {
	if (!Bi) {
		let t = new URL(Ci, location.origin).href, n = new URL(wi, location.origin).href, r = new URL(Ti, location.origin).href;
		Ji(t, n, r), Bi = import("./dist-DRMIypK3.js").then((t) => /* @__PURE__ */ e(t.default, 1)).then(({ createDbWorker: e }) => e([{
			from: "inline",
			config: {
				serverMode: "full",
				requestChunkSize: Ei,
				url: t
			}
		}], n, r)).then((e) => ($("search.sqlite worker", e ? "opened" : "missing"), e)).catch((e) => (console.error("Search: failed to open search.sqlite", e), $("open failed", e?.name, e?.message, e?.stack), Bi = null, null));
	}
	return Bi;
}
async function oa(e, t) {
	try {
		let n = await e.db.query(`SELECT folder, ts, snippet(chunks, 0, char(1), char(2), '…', ${Oi}) AS found FROM chunks WHERE chunks MATCH ${qi(t)} ORDER BY rank LIMIT ${Di}`), r = /* @__PURE__ */ new Set(), i = [];
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
async function sa(e) {
	let t = Xi(e);
	if (!t.length) return [];
	let n = await aa();
	if (!n) return [];
	await Yi(n, Zi(e));
	let r = await oa(n, Zi(e));
	return r.length || t.length < 2 ? r : oa(n, Zi(e, " OR "));
}
function ca(e, t) {
	let n = Xi(e);
	if (!n.length) return [];
	t.titleIndex ||= Object.entries(t.idTitle).map(([e, t]) => {
		let n = Wi(t);
		return [
			e,
			n,
			Qi(n)
		];
	});
	let r = n.join(" "), i = Qi(r), a = [];
	for (let [e, o, s] of t.titleIndex) {
		let t = 0;
		if (n.every((e) => o.includes(e))) t = 2 + +(o === r) + (o.startsWith(r) ? .5 : 0);
		else {
			let e = $i(i, s);
			e >= Mi && (t = e);
		}
		t && a.push({
			id: e,
			score: t
		});
	}
	return a;
}
async function la({ tags: e, q: t }, n) {
	let r = null;
	e.length && (r = [...new Set(e.flatMap((e) => n.tagMap[n.tagLookup[e.toLowerCase()]] || []))]);
	let i = t.trim();
	if (!i) return (r ?? n.allIds).map((e) => ({
		id: e,
		score: n.views[e] || 0,
		found: null
	})).sort((e, t) => t.score - e.score);
	let [a, o] = await Promise.all([sa(i), ca(i, n)]);
	$("text hits", a.length, "title hits", o.length);
	let s = r ? new Set(r) : null, c = /* @__PURE__ */ new Map();
	a.forEach((e, t) => {
		(!s || s.has(e.id)) && c.set(e.id, {
			id: e.id,
			score: 1 - t / a.length,
			found: {
				text: e.found,
				ts: e.ts
			}
		});
	});
	for (let { id: e, score: t } of o) {
		if (s && !s.has(e)) continue;
		let n = c.get(e);
		n ? n.score += t : c.set(e, {
			id: e,
			score: t,
			found: null
		});
	}
	return [...c.values()].sort((e, t) => t.score - e.score);
}
function ua(e) {
	return Vi.has(e) || Vi.set(e, Pr(e).catch(() => ({
		type: "notfound",
		folderID: e
	}))), Vi.get(e);
}
async function da(e) {
	let [t, n] = await Promise.all([Fr(e).catch(() => ""), Ir(e).catch(() => "")]), r = (t || n || "").replace(/\{\d+:\d\d(?::\d\d)?\}/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[\[\]#*_`>]/g, "").replace(/\s+/g, " ").trim();
	return r ? r.length <= ji ? r : `${r.slice(0, r.slice(0, ji).lastIndexOf(" "))}…` : "";
}
function fa(e, t, n) {
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
function pa(e) {
	return j(M, {
		get each() {
			return ea(e.text, e.words);
		},
		children: (e) => e.hit ? (() => {
			var t = Xr();
			return R(t, () => e.text), t;
		})() : e.text
	});
}
function ma(e) {
	return j(M, {
		get each() {
			return ta(e.text);
		},
		children: (e) => e.hit ? (() => {
			var t = Xr();
			return R(t, () => e.text), t;
		})() : e.text
	});
}
function ha(e) {
	return (() => {
		var t = Zr();
		return Qe((t) => {
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
function ga(e) {
	let t = e.entry.id, [n] = T(() => ua(t)), [r] = T(() => n(), async (e) => e.pageThumbnailFile ? await X(e.pageThumbnailFile) : t), i = () => (n()?.type || e.data.idType[t] || "").toLowerCase(), a = () => i() === "photos", [o] = T(() => e.entry.found || a() ? !1 : t, da), [s] = T(() => a() ? t : !1, (e) => Fr(e).catch(() => "")), [c, l] = S(!1), u = () => a() && s()?.trim() || n()?.title || e.data.idTitle[t] || t, d = () => e.data.idTags[t] || [], f = () => c() ? d() : d().slice(0, Ai), p = () => new Set(e.tags.map((e) => e.toLowerCase()));
	return (() => {
		var s = ni(), m = s.firstChild, h = m.firstChild, g = m.nextSibling, _ = g.firstChild, v = _.firstChild, y = _.nextSibling, b = y.nextSibling;
		return R(h, j(N, {
			get when() {
				return r();
			},
			get children() {
				return j(ha, { get id() {
					return r();
				} });
			}
		})), R(v, j(pa, {
			get text() {
				return u();
			},
			get words() {
				return e.words;
			}
		})), R(y, j(N, {
			get when() {
				return n();
			},
			get children() {
				return [
					(() => {
						var e = Qr();
						return R(e, (() => {
							var e = P(() => !!Ii.has(i()));
							return () => e() ? Q(n().startDate) : [
								P(() => Q(n().startDate)),
								" – ",
								P(() => Rr(n().endDate))
							];
						})()), e;
					})(),
					" ",
					"👁",
					P(() => e.data.views[t] || 0)
				];
			}
		})), R(b, j(M, {
			get each() {
				return f();
			},
			children: (e) => (() => {
				var t = ri();
				return R(t, e), C((n) => {
					var r = !!p().has(e.toLowerCase()), i = na([e]);
					return r !== n.e && t.classList.toggle("active", n.e = r), i !== n.t && I(t, "href", n.t = i), n;
				}, {
					e: void 0,
					t: void 0
				}), t;
			})()
		}), null), R(b, j(N, {
			get when() {
				return P(() => !c())() && d().length > Ai;
			},
			get children() {
				var e = $r();
				return e.$$click = () => l(!0), e;
			}
		}), null), R(g, j(N, {
			get when() {
				return !a();
			},
			get children() {
				var t = ti();
				return R(t, j(N, {
					get when() {
						return e.entry.found;
					},
					get fallback() {
						return j(N, {
							get when() {
								return !o.loading;
							},
							get children() {
								return o();
							}
						});
					},
					get children() {
						return [j(N, {
							get when() {
								return e.entry.found.ts;
							},
							get children() {
								return [(() => {
									var t = ei();
									return R(t, () => e.entry.found.ts), t;
								})(), " "];
							}
						}), j(ma, { get text() {
							return e.entry.found.text;
						} })];
					}
				})), t;
			}
		}), null), C((e) => {
			var n = Z(t), r = Z(t);
			return n !== e.e && I(h, "href", e.e = n), r !== e.t && I(v, "href", e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), s;
	})();
}
function _a(e) {
	return (t) => {
		let [n] = T(() => ua(t.entry.id)), [r] = T(() => n()?.title ? n() : !1, (t) => e(t));
		return j(N, {
			get when() {
				return r();
			},
			get children() {
				return r();
			}
		});
	};
}
var va = {
	"Detailed List": {
		item: ga,
		wrapper: ""
	},
	Cards: {
		item: _a(So),
		wrapper: "ResultCards"
	},
	Compact: {
		item: _a(wo),
		wrapper: "ResultCompact"
	},
	List: {
		item: _a(To),
		wrapper: "ResultPlain"
	}
}, ya = Object.keys(va);
function ba(e) {
	let t = () => va[e.shared.view];
	return (() => {
		var n = ii();
		return R(n, j(M, {
			get each() {
				return e.items;
			},
			children: (n) => j(pt, {
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
		})), C(() => L(n, t().wrapper)), n;
	})();
}
function xa(e) {
	let t = () => {
		let t = [], n = -1;
		for (let r = 0; r < e.pages; r++) (r === 0 || r === e.pages - 1 || Math.abs(r - e.page) <= 2) && (n >= 0 && r - n > 1 && t.push(-1), t.push(r), n = r);
		return t;
	};
	return j(N, {
		get when() {
			return e.pages > 1;
		},
		get children() {
			var n = si();
			return R(n, j(N, {
				get when() {
					return e.page > 0;
				},
				get children() {
					var t = ai();
					return t.$$click = () => e.onPage(e.page - 1), t;
				}
			}), null), R(n, j(M, {
				get each() {
					return t();
				},
				children: (t) => t < 0 ? ci() : (() => {
					var n = li();
					return n.$$click = () => e.onPage(t), R(n, t + 1), C((r) => {
						var i = t === e.page, a = t === e.page;
						return i !== r.e && n.classList.toggle("active", r.e = i), a !== r.t && I(n, "aria-pressed", r.t = a), r;
					}, {
						e: void 0,
						t: void 0
					}), n;
				})()
			}), null), R(n, j(N, {
				get when() {
					return e.page < e.pages - 1;
				},
				get children() {
					var t = oi();
					return t.$$click = () => e.onPage(e.page + 1), t;
				}
			}), null), n;
		}
	});
}
function Sa(e) {
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
		return a.sort((e, t) => e.rank - t.rank || t.count - e.count || e.name.length - t.name.length), a.slice(0, ki);
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
		var e = di(), n = e.firstChild, h = n.firstChild, g = n.nextSibling;
		n.$$click = () => l?.focus(), R(n, j(M, {
			get each() {
				return t();
			},
			children: (e) => (() => {
				var t = fi(), n = t.firstChild;
				return R(t, e, n), n.$$click = () => f(e), I(n, "aria-label", `Remove ${e}`), t;
			})()
		}), h), h.addEventListener("blur", () => c(!1)), h.addEventListener("focus", () => c(!0)), h.$$keydown = m, h.$$input = (e) => {
			i(e.target.value), o(-1);
		};
		var _ = l;
		return typeof _ == "function" ? Qe(_, h) : l = h, R(n, j(N, {
			get when() {
				return P(() => !!s())() && u().length;
			},
			get children() {
				var e = ui();
				return R(e, j(M, {
					get each() {
						return u();
					},
					children: (e, t) => (() => {
						var n = pi(), r = n.firstChild, i = r.nextSibling;
						return n.$$mousedown = (t) => {
							t.preventDefault(), d(e.name);
						}, R(n, () => e.name, r), R(i, () => e.count), C(() => n.classList.toggle("active", a() === t())), n;
					})()
				})), e;
			}
		}), null), g.$$click = p, C(() => I(h, "placeholder", t().length ? "Add tags or search text…" : "Search articles, or type to find a tag…")), C(() => h.value = r()), e;
	})();
}
function Ca() {
	let [e, t] = S(ra()), [n, r] = S(Hr("sSort", "relevancy", (e) => Fi.includes(e))), [i, a] = S(Hr("sResultView", ya[0], (e) => ya.includes(e))), [o, s] = S(""), [c, l] = S(0), [u] = T(ia), [d] = T(() => u() ? e() : !1, (e) => la(e, u())), f = w(() => u() ? e().tags.map((e) => u().titleLookup[e.toLowerCase()]).filter(Boolean) : []), p = w(() => u() ? fa(n(), u(), f()) : () => 0), m = w(() => {
		let e = /* @__PURE__ */ new Map();
		if (!u() || d.loading) return e;
		for (let t of d() || []) {
			let n = u().idType[t.id] || "other";
			e.has(n) || e.set(n, []), e.get(n).push(t);
		}
		return new Map([...e].sort((e, t) => t[1].length - e[1].length || e[0].localeCompare(t[0])));
	}), h = w(() => [...m()].flatMap(([, e]) => e)), g = w(() => [{
		key: "",
		label: "All",
		list: h()
	}, ...[...m()].map(([e, t]) => ({
		key: e,
		label: Ki(e),
		list: t
	}))]), _ = () => o() === "" || m().has(o()) ? o() : "", v = w(() => [..._() === "" ? h() : m().get(_()) || []].sort(p())), y = (e) => [...e].sort(p()).slice(0, 3).map((e) => u().idTitle[e.id] || e.id), b = w(() => ({
		data: u(),
		words: Xi(e().q),
		tags: e().tags,
		view: i()
	}));
	te(() => Ur("sSort", n())), te(() => Ur("sResultView", i()));
	let x = () => t(ra());
	window.addEventListener("popstate", x), re(() => window.removeEventListener("popstate", x));
	let ee = () => v().length, ne = () => Math.max(1, Math.ceil(ee() / Ni)), ie = () => v().slice(c() * Ni, (c() + 1) * Ni);
	te(() => {
		v(), E(() => l(0));
	});
	function ae(e) {
		l(e), window.scrollTo({ top: 0 });
	}
	function oe(e) {
		history.pushState(null, "", na(e.tags, e.q)), t(e);
	}
	return (() => {
		var t = gi();
		return R(t, j(N, {
			get when() {
				return u();
			},
			get fallback() {
				return _i();
			},
			get children() {
				return [j(Sa, {
					get data() {
						return u();
					},
					get value() {
						return e();
					},
					onSubmit: oe
				}), (() => {
					var e = hi(), t = e.firstChild, o = t.firstChild, l = o.firstChild, u = l.firstChild.nextSibling, f = l.nextSibling.firstChild.nextSibling, p = o.nextSibling, m = t.nextSibling, h = m.firstChild;
					return u.addEventListener("change", (e) => r(e.target.value)), R(u, j(M, {
						each: Pi,
						children: ([e, t]) => (() => {
							var r = vi();
							return r.value = e, R(r, t), C(() => r.selected = n() === e), r;
						})()
					})), f.addEventListener("change", (e) => a(e.target.value)), R(f, j(M, {
						each: ya,
						children: (e) => (() => {
							var t = vi();
							return t.value = e, R(t, e), C(() => t.selected = i() === e), t;
						})()
					})), R(p, j(M, {
						get each() {
							return g();
						},
						children: (e) => (() => {
							var t = xi(), n = t.firstChild, r = n.firstChild, i = r.nextSibling;
							return i.nextSibling, n.$$click = () => s(e.key), R(n, () => e.label, r), R(n, () => e.list.length, i), R(t, j(N, {
								get when() {
									return P(() => e.key !== "")() && e.list.length;
								},
								get children() {
									var t = bi();
									return R(t, j(M, {
										get each() {
											return y(e.list);
										},
										children: (e) => (() => {
											var t = Si();
											return R(t, e), t;
										})()
									}), null), R(t, j(N, {
										get when() {
											return e.list.length > 3;
										},
										get children() {
											return yi();
										}
									}), null), t;
								}
							}), null), C((t) => {
								var r = _() === e.key, i = _() === e.key;
								return r !== t.e && n.classList.toggle("active", t.e = r), i !== t.t && I(n, "aria-pressed", t.t = i), t;
							}, {
								e: void 0,
								t: void 0
							}), t;
						})()
					})), R(h, j(N, {
						get when() {
							return !d.loading;
						},
						fallback: "Searching…",
						get children() {
							return `${ee()} result${ee() === 1 ? "" : "s"}`;
						}
					})), R(m, j(N, {
						get when() {
							return !d.loading;
						},
						get children() {
							return [
								j(N, {
									get when() {
										return c() > 0;
									},
									get children() {
										return j(xa, {
											get page() {
												return c();
											},
											get pages() {
												return ne();
											},
											onPage: ae
										});
									}
								}),
								j(ba, {
									get items() {
										return ie();
									},
									get shared() {
										return b();
									}
								}),
								j(xa, {
									get page() {
										return c();
									},
									get pages() {
										return ne();
									},
									onPage: ae
								}),
								j(N, {
									get when() {
										return ee() === 0;
									},
									get children() {
										return mi();
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
We([
	"click",
	"input",
	"keydown",
	"mousedown"
]);
//#endregion
//#region src/Renderers.jsx
var wa = /*#__PURE__*/ F("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong></strong> 👁"), Ta = /*#__PURE__*/ F("<a><img loading=lazy>", !0, !1, !1), Ea = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), Da = /*#__PURE__*/ F("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), Oa = /*#__PURE__*/ F("<div><div></div><div><div><a></a></div><div><strong></strong> 👁"), ka = /*#__PURE__*/ F("<div><a></a><span class=ListMeta><strong></strong> 👁"), Aa = /*#__PURE__*/ F("<div class=404>You've found an article that doesn't exist yet! Click the logo to head back home."), ja = /*#__PURE__*/ F("<br>"), Ma = /*#__PURE__*/ F("<div class=Homepage><center>Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!<br>Use the search above to explore our site! Something not listed here? Help contribute or <a href=\"/?v=cep-editor\">create a new page!</a><br>IMPORTANT! You're using a test version of the site, <a href=\"/?v=cep-js\">click here</a> to return to the default viewer!</center><h2>News</h2><h2>Wiki</h2><h2>Community"), Na = /*#__PURE__*/ F("<div class=Carousel>"), Pa = /*#__PURE__*/ F("<nav class=Nav>"), Fa = /*#__PURE__*/ F("<details><summary><a></a></summary><div>"), Ia = /*#__PURE__*/ F("<a>"), La = /*#__PURE__*/ F("<div class=Footer>Last build on: <span id=StatBuildDate>???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), Ra = /*#__PURE__*/ F("<div class=Header><div class=SplashText id=SpashText>. . .</div><a href=\"/?v=cep-solid\"class=Logo><img alt=Cheesepedia></a><div class=FlavorText>Now at <strong><span id=StatArticles>????</span></strong> articles contributed by <strong><span id=StatContributors>???</span></strong> users.<br>Discussions available on the <strong><a href=https://forum.cheeseepedia.org/>Forums!"), za = /*#__PURE__*/ F("<div>"), Ba = /*#__PURE__*/ F("<button type=button class=PinButton>"), Va = /*#__PURE__*/ F("<div class=TabPanel>"), Ha = /*#__PURE__*/ F("<h2>Cheese-E-Shuffle"), Ua = /*#__PURE__*/ F("<div>Loading…"), Wa = /*#__PURE__*/ F("<div>Nothing found."), Ga = /*#__PURE__*/ F("<div id=RandomCards class=Carousel>"), Ka = /*#__PURE__*/ F("<div class=infobox-list><strong>:</strong><ul>"), qa = /*#__PURE__*/ F("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), Ja = /*#__PURE__*/ F("<video controls preload=metadata>"), Ya = /*#__PURE__*/ F("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), Xa = /*#__PURE__*/ F("<div class=\"VideoEmbed fade-in\">"), Za = /*#__PURE__*/ F("<h1 class=article-title>"), Qa = /*#__PURE__*/ F("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), $a = /*#__PURE__*/ F("<div class=fade-in>"), eo = /*#__PURE__*/ F("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\"><h2>Video Transcription"), to = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No transcription provided by source."), no = /*#__PURE__*/ F("<div class=\"ArticleBody type-photo\"><div class=\"ArticlePhoto fade-in type-photo\"></div><div class=\"content fade-in type-photo\"><h2>Image Description"), ro = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No description provided. Help write one for accessibility."), io = /*#__PURE__*/ F("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), ao = /*#__PURE__*/ F("<div class=infobox-list><strong>Credits:</strong><ul>"), oo = /*#__PURE__*/ F("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), so = /*#__PURE__*/ F("<li><strong></strong> (<!>)"), co = /*#__PURE__*/ F("<div class=infobox-desc>"), lo = /*#__PURE__*/ F("<li><strong></strong> (<!> – <!>)"), uo = /*#__PURE__*/ F("<li><a target=_blank rel=\"noopener noreferrer\">"), fo = /*#__PURE__*/ F("<li>"), po = /*#__PURE__*/ F("<li><strong>:</strong> "), mo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No article content. Come write some!"), ho = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comments",
	"theories",
	"meta",
	"transcriptions"
]), go = {
	Articles: (e) => !ho.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos",
	Reviews: (e) => e === "reviews"
}, _o = [
	{
		name: "Companies",
		tags: [
			"Pizza Time Theatre",
			"ShowBiz Pizza Place",
			"Chuck E. Cheese's",
			"Creative Engineering",
			"Peter Piper Pizza",
			"Discovery Zone",
			"Zapp's Bar & Grill",
			"Monterey's",
			"Sally Corporation",
			"Jim Henson's Creature Shop",
			"Walt Disney Imagineering"
		]
	},
	{
		name: "Animatronics",
		tags: [
			"Animatronic Shows",
			"Stage Variations",
			"Animatronics",
			"Animatronic Parts",
			"Animatronic Preservation",
			"Retrofits"
		]
	},
	{
		name: "Showtapes",
		tags: [
			"Showtapes",
			"Live Shows",
			"ShowBiz Pizza Programs",
			"Showtape Formats",
			"Family Vision"
		]
	},
	{
		name: "Locations",
		tags: [
			"Locations",
			"Cancelled Locations",
			"Remodels and Initiatives",
			"Arcades and Attractions",
			"Store Fixtures",
			"Menu Items",
			"Tickets",
			"Tokens",
			"Walkarounds",
			"Employee Wear"
		]
	},
	{
		name: "Merchandise",
		tags: [
			"In-Store Merchandise",
			"Movies",
			"Video Games",
			"Products",
			"Simulators"
		]
	},
	{
		name: "Corporate",
		tags: [
			"Animatronic Control Systems",
			"Programming Systems",
			"Other Systems",
			"Company Media",
			"Puppets",
			"Corporate Documents",
			"Documents"
		]
	},
	{
		name: "Advertising",
		tags: [
			"Social Media and Websites",
			"Promotional Material",
			"Ad Vehicles",
			"Events",
			"Commercials"
		]
	},
	{
		name: "History",
		tags: [
			"Companies/Brands",
			"History",
			"Characters",
			"News Footage"
		]
	}
], vo = 15, yo = {
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
};
function bo(e) {
	if (e.type === "home") return Oo();
	if (e.type === "notfound") return Eo(e.folderID);
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
		case "Corporate Documents":
		case "Promotional Material":
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
		case "Steam Comments": return zo(e);
		case "Videos": return Lo(e);
		case "Photos": return Ro(e);
		default: return zo(e);
	}
}
function xo({ link: e, thumbnailSrc: t, title: n, dateText: r, views: i, excerpt: a = n }) {
	return (() => {
		var o = wa(), s = o.firstChild, c = s.nextSibling.firstChild, l = c.firstChild.firstChild, u = c.nextSibling, d = u.firstChild;
		return d.nextSibling, R(s, t ? (() => {
			var r = Ta(), i = r.firstChild;
			return I(r, "href", e), I(i, "src", t), I(i, "alt", n), r;
		})() : (() => {
			var t = Ea();
			return I(t, "href", e), R(t, a), t;
		})()), I(l, "href", e), R(l, n), R(d, r), R(u, i, null), o;
	})();
}
async function So(e) {
	let t = await X(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await Wr(e);
	i ||= await Vr(e);
	let a = await Ot(), o = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (o = t);
		}
	} catch {}
	let s = r ? ` type-${r}` : "";
	return (() => {
		var r = Da(), c = r.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, L(r, `Card fade-in${s}`), L(c, `CardImage${s}`), R(c, i), L(l, `CardTextArea${s}`), L(u, `CardLink${s}`), R(d, o), L(f, `CardText${s}`), R(p, (() => {
			var t = P(() => !!ho.has(n));
			return () => t() ? Q(e.startDate) : [
				P(() => Q(e.startDate)),
				" – ",
				P(() => Rr(e.endDate))
			];
		})()), R(f, () => a[t], null), C(() => I(d, "href", Z(t))), r;
	})();
}
async function Co(e) {
	let t = await X(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await Ot(), a = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (a = t);
		}
	} catch {}
	let o = ho.has(n) ? Q(e.startDate) : `${Q(e.startDate)} \u2013 ${Rr(e.endDate)}`;
	return {
		link: t,
		label: a,
		dates: o,
		views: i[t],
		t: r ? ` type-${r}` : ""
	};
}
async function wo(e) {
	let { link: t, label: n, dates: r, views: i, t: a } = await Co(e), o = await Wr(e);
	return (() => {
		var e = Oa(), s = e.firstChild, c = s.nextSibling, l = c.firstChild, u = l.firstChild, d = l.nextSibling, f = d.firstChild;
		return f.nextSibling, L(e, `Compact fade-in${a}`), L(s, `CompactImage${a}`), R(s, o), L(c, `CompactText${a}`), L(l, `CompactTitle${a}`), R(u, n), L(d, `CompactMeta${a}`), R(f, r), R(d, i, null), C(() => I(u, "href", Z(t))), e;
	})();
}
async function To(e) {
	let { link: t, label: n, dates: r, views: i, t: a } = await Co(e);
	return (() => {
		var e = ka(), o = e.firstChild, s = o.nextSibling, c = s.firstChild;
		return c.nextSibling, L(e, `ListRow fade-in${a}`), R(o, n), R(c, r), R(s, i, null), C(() => I(o, "href", Z(t))), e;
	})();
}
function Eo() {
	return Aa();
}
async function Do(e) {
	let t = await e(), n = await Promise.all(t.map((e) => Pr(e).catch(() => null)));
	return Promise.all(n.filter(Boolean).map((e) => So(e)));
}
function Oo() {
	let [e] = T(At), [t] = T(jt), [n] = T(Yr), [r] = T(() => Do(Tt)), [i] = T(() => Do(wt));
	return [ja(), (() => {
		var a = Ma(), o = a.firstChild.nextSibling.nextSibling, s = o.nextSibling;
		return R(a, j(jo, { tabs: [{
			name: "The News",
			content: () => (() => {
				var t = Na();
				return R(t, j(M, {
					get each() {
						return e() || [];
					},
					children: (e) => xo({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: Gr(e.created_at),
						views: e.views
					})
				})), t;
			})()
		}, {
			name: "Social Media",
			content: () => (() => {
				var e = Na();
				return R(e, j(M, {
					get each() {
						return r() || [];
					},
					children: (e) => e
				})), e;
			})()
		}] }), o), R(a, j(jo, { tabs: [{
			name: "Navigation",
			content: () => (() => {
				var e = Pa();
				return R(e, j(M, {
					each: _o,
					children: (e) => (() => {
						var t = Fa(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
						return R(r, () => e.name), R(i, j(M, {
							get each() {
								return e.tags;
							},
							children: (e) => (() => {
								var t = Ia();
								return R(t, e), C(() => I(t, "href", na([e]))), t;
							})()
						})), C(() => I(r, "href", na(e.tags))), t;
					})()
				})), e;
			})()
		}, {
			name: "Map",
			content: () => j(N, {
				get when() {
					return P(() => !n.loading)() && n();
				},
				get children() {
					return n();
				}
			})
		}] }), s), R(a, j(jo, { tabs: [{
			name: "Fan Videos",
			content: () => (() => {
				var e = Na();
				return R(e, j(M, {
					get each() {
						return i() || [];
					},
					children: (e) => e
				})), e;
			})()
		}, {
			name: "New Posts",
			content: () => (() => {
				var e = Na();
				return R(e, j(M, {
					get each() {
						return t() || [];
					},
					children: (e) => xo({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: Gr(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}] }), null), a;
	})()];
}
function ko() {
	return La();
}
function Ao() {
	let e = yo.standard;
	try {
		let t = localStorage.getItem("cep-theme") || "standard", n = JSON.parse(localStorage.getItem("cep-theme-custom") || "null");
		e = t === "custom" && n?.["--logo"] ? n["--logo"] : yo[t] || yo.standard;
	} catch {}
	return (() => {
		var t = Ra(), n = t.firstChild.nextSibling.firstChild;
		return I(n, "src", "/viewers/cep-js/assets/Logos/" + e), t;
	})();
}
function jo(e) {
	let [t, n] = S(e.tabs[0].name);
	return [(() => {
		var r = za();
		return R(r, j(M, {
			get each() {
				return e.tabs;
			},
			children: (e) => (() => {
				var r = Ba();
				return r.$$click = () => n(e.name), R(r, () => e.name), C((n) => {
					var i = t() === e.name, a = t() === e.name;
					return i !== n.e && r.classList.toggle("active", n.e = i), a !== n.t && I(r, "aria-pressed", n.t = a), n;
				}, {
					e: void 0,
					t: void 0
				}), r;
			})()
		})), r;
	})(), j(M, {
		get each() {
			return e.tabs;
		},
		children: (e) => (() => {
			var n = Va();
			return R(n, () => e.content()), C((r) => Xe(n, "display", t() === e.name ? "" : "none")), n;
		})()
	})];
}
function Mo(e) {
	for (let t = e.length - 1; t > 0; t--) {
		let n = Math.floor(Math.random() * (t + 1));
		[e[t], e[n]] = [e[n], e[t]];
	}
	return e;
}
function No() {
	let [e, t] = S(Hr("sRandomTab", "Articles", (e) => Object.hasOwn(go, e))), n = {};
	for (let e of Object.keys(go)) {
		let [t, r] = S([]), [i, a] = S(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([kt(), Ot()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = go[e], [i, o] = await a(), s = Mo(Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e)), c = 0;
		for (let e = 0; e < s.length && c < vo; e += 20) {
			let n = await Promise.all(s.slice(e, e + 20).map((e) => Pr(e).catch(() => null))), r = [];
			for (let t = 0; t < n.length && c < vo; t++) n[t] && (r.push({
				id: s[e + t],
				meta: n[t]
			}), c++);
			await Promise.all(r.map(async ({ id: e, meta: n }) => {
				let r = await So(n), i = o[e];
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
		Ur("sRandomTab", t), E(() => o(t));
	}), [
		Ha(),
		(() => {
			var n = za();
			return R(n, j(M, {
				get each() {
					return Object.keys(go);
				},
				children: (n) => (() => {
					var r = Ba();
					return r.$$click = () => t(n), R(r, n), C((t) => {
						var i = e() === n, a = e() === n;
						return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && I(r, "aria-pressed", t.t = a), t;
					}, {
						e: void 0,
						t: void 0
					}), r;
				})()
			})), n;
		})(),
		(() => {
			var e = Ga();
			return R(e, j(M, {
				get each() {
					return r().entries();
				},
				children: (e) => e.card
			}), null), R(e, j(N, {
				get when() {
					return P(() => !r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return Ua();
				}
			}), null), R(e, j(N, {
				get when() {
					return P(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return Wa();
				}
			}), null), e;
		})()
	];
}
function Po(e) {
	return j(N, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = Ka(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
			return R(n, () => e.title, r), R(i, j(M, {
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
function Fo(e) {
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
function Io(e) {
	let t = () => Fo(e.url);
	return j(N, {
		get when() {
			return t();
		},
		get children() {
			var e = Xa();
			return R(e, j(je, { get children() {
				return [
					j(Me, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = qa();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = Ja();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = Ya();
							return R(e, () => t().src), C(() => I(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function Lo(e) {
	let [t] = T(async () => zr(await X(e.pageThumbnailFile))), [n] = T(() => Jr(e)), [r] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Fr(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await qr(n),
			old: await qr(r)
		};
	});
	return [(() => {
		var t = Za();
		return R(t, () => e.title), t;
	})(), (() => {
		var t = eo(), n = t.firstChild;
		return n.firstChild, R(t, j(Io, { get url() {
			return e.pageThumbnailVideo;
		} }), n), R(n, j(N, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return Ua();
			},
			get children() {
				return j(N, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return to();
					},
					get children() {
						return [j(N, {
							get when() {
								return P(() => !r().md)() && r().old;
							},
							get children() {
								return Qa();
							}
						}), (() => {
							var e = $a();
							return C(() => e.innerHTML = Y.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		}), null), t;
	})()];
}
function Ro(e) {
	let [t] = T(() => Wr(e)), [n] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Fr(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await qr(n),
			old: await qr(r)
		};
	});
	return [(() => {
		var t = Za();
		return R(t, () => e.title), t;
	})(), (() => {
		var e = no(), r = e.firstChild, i = r.nextSibling;
		return i.firstChild, R(r, j(N, {
			get when() {
				return P(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), R(i, j(N, {
			get when() {
				return !n.loading;
			},
			get fallback() {
				return Ua();
			},
			get children() {
				return j(N, {
					get when() {
						return n()?.md || n()?.old;
					},
					get fallback() {
						return ro();
					},
					get children() {
						return [j(N, {
							get when() {
								return P(() => !n().md)() && n().old;
							},
							get children() {
								return Qa();
							}
						}), (() => {
							var e = $a();
							return C(() => e.innerHTML = Y.parse(n().md || n().old)), e;
						})()];
					}
				});
			}
		}), null), e;
	})()];
}
function zo(e) {
	let [t] = T(async () => zr(await X(e.pageThumbnailFile))), [n] = T(() => Jr(e)), [r] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Fr(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await qr(n),
			old: await qr(r)
		};
	});
	return [(() => {
		var t = Za();
		return R(t, () => e.title), t;
	})(), (() => {
		var i = oo(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
		return R(o, j(N, {
			get when() {
				return P(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), R(c, () => Q(e.startDate), l), R(c, () => Rr(e.endDate), u), R(s, j(N, {
			get when() {
				return e.sqft;
			},
			get children() {
				var t = io(), n = t.firstChild.nextSibling, r = n.firstChild;
				return R(n, () => e.sqft, r), t;
			}
		}), null), R(a, j(Po, {
			title: "Remodels",
			get items() {
				return e.remodels;
			},
			children: (e) => (() => {
				var t = so(), n = t.firstChild, r = n.nextSibling.nextSibling;
				return r.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), t;
			})()
		}), null), R(a, j(Po, {
			title: "Stages",
			get items() {
				return e.stages;
			},
			children: (e) => (() => {
				var t = lo(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), R(t, () => Rr(e.e), i), R(t, j(N, {
					get when() {
						return e.desc;
					},
					get children() {
						var t = co();
						return R(t, () => e.desc), t;
					}
				}), null), t;
			})()
		}), null), R(a, j(Po, {
			title: "Franchisees",
			get items() {
				return e.franchisees;
			},
			children: (e) => (() => {
				var t = lo(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), R(t, () => Rr(e.e), i), t;
			})()
		}), null), R(a, j(Po, {
			title: "Downloads",
			get items() {
				return e.downloadLinks;
			},
			children: (e) => (() => {
				var t = uo(), n = t.firstChild;
				return R(n, () => e.label), C(() => I(n, "href", e.url)), t;
			})()
		}), null), R(a, j(Po, {
			title: "Showtape Formats",
			get items() {
				return e.showtapeFormats;
			},
			children: (e) => (() => {
				var t = fo();
				return R(t, e), t;
			})()
		}), null), R(a, j(N, {
			get when() {
				return e.credits?.length;
			},
			get children() {
				var t = ao(), n = t.firstChild.nextSibling;
				return R(n, j(M, {
					get each() {
						return e.credits;
					},
					children: (e) => (() => {
						var t = po(), n = t.firstChild, r = n.firstChild;
						return n.nextSibling, R(n, () => e.role, r), R(t, () => e.n, null), t;
					})()
				})), t;
			}
		}), null), R(a, j(N, {
			get when() {
				return P(() => !n.loading)() && n();
			},
			get children() {
				return n();
			}
		}), null), R(d, j(N, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return Ua();
			},
			get children() {
				return j(N, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return mo();
					},
					get children() {
						return [j(N, {
							get when() {
								return P(() => !r().md)() && r().old;
							},
							get children() {
								return Qa();
							}
						}), (() => {
							var e = $a();
							return C(() => e.innerHTML = Y.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		})), i;
	})()];
}
We(["click"]);
//#endregion
//#region src/App.jsx
var Bo = /*#__PURE__*/ F("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), Vo = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), Ho = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), Uo = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), Wo = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), Go = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), Ko = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function qo(e) {
	return [
		Bo(),
		Vo(),
		Ho(),
		Uo(),
		Wo(),
		Go(),
		Ko(),
		P(Ao),
		P(() => P(() => e.type === "search")() ? Ca() : bo(e)),
		P(No),
		P(ko)
	];
}
//#endregion
//#region index.jsx
async function Jo(e, t) {
	if (e.get("page") === "search") {
		Ue(() => qo({ type: "search" }), t);
		return;
	}
	let n = await Pr((e.get("") || "").replace(/^\/+|\/+$/g, ""));
	Ue(() => qo(n), t);
}
//#endregion
export { Jo as render };
