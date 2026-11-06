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
		i = r, t === document ? e() : z(t, e(), t.firstChild ? null : void 0, n);
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
	et(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ge(e, t, n, r) {
	et(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function Ke(e, t, n) {
	et(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function L(e, t) {
	et(e) || (t == null ? e.removeAttribute("class") : e.className = t);
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
	return r || C(() => i.children = at(e, t.children, i.children)), C(() => typeof t.ref == "function" && R(t.ref, e)), C(() => Qe(e, t, n, !0, i, !0)), i;
}
function R(e, t, n) {
	return E(() => e(t, n));
}
function z(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return at(e, t, r, n);
	C((r) => at(e, t(), r, n), r);
}
function Qe(e, t, n, r, i = {}, a = !1) {
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
function $e(e) {
	let n, r;
	return !et() || !(n = t.registry.get(r = lt())) ? e() : (t.completed && t.completed.add(n), t.registry.delete(r), n);
}
function et(e) {
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
		else if (et(e)) return n;
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
	let a = et(e);
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
				let r = ze.has(e), i = t.context ? $e() : dt(e, r, E(() => n.is));
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
var mt = null, ht = null, gt = null, _t = null, vt = null, yt = null, bt = null, xt = null, St = null, Ct = null, wt = null;
async function Tt() {
	return wt ||= await (await fetch("/viewers/cep-solid/compiled-json/folderIDToTags.json")).json(), wt;
}
async function Et() {
	return Ct ||= await (await fetch("/viewers/cep-solid/compiled-json/taggedByIDs.json")).json(), Ct;
}
async function Dt() {
	return St ||= await (await fetch("/viewers/cep-solid/compiled-json/sortKeys.json")).json(), St;
}
async function Ot() {
	return bt ||= await (await fetch("/viewers/cep-solid/compiled-json/recentfanvideos.json")).json(), bt;
}
async function kt() {
	return xt ||= await (await fetch("/viewers/cep-solid/compiled-json/recentofficialvideos.json")).json(), xt;
}
async function At() {
	return mt ||= await (await fetch("/viewers/cep-solid/compiled-json/titleToFolderIDMap.json")).json(), mt;
}
async function jt() {
	return ht ||= await (await fetch("/viewers/cep-solid/compiled-json/folderIDToTitleMap.json")).json(), ht;
}
async function Mt() {
	return gt ||= await (await fetch("/viewers/cep-js/compiled-json/views.json")).json(), gt;
}
async function Nt() {
	return _t ||= await (await fetch("/viewers/cep-solid/compiled-json/typeToIDList.json")).json(), _t;
}
async function Pt() {
	return vt ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseNews.json")).json(), vt;
}
async function Ft() {
	return yt ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseRecent.json")).json(), yt;
}
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
function W(e, t, n) {
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
function rr(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && V.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function ir(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function ar(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function or(e, t, n, r, i) {
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
function sr(e, t, n) {
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
var cr = class {
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
			let e = this.options.pedantic ? t[0] : rr(t[0]);
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
			let e = t[0], n = sr(e, t[3] || "", this.rules);
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
				let t = W(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: W(t[0], "\n"),
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
			raw: W(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = W(t[0], "\n").split("\n"), n = "", r = "", i = [];
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
				let c = ar(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = rr(t[0]);
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
				raw: W(t[0], "\n"),
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
			raw: W(t[0], "\n"),
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
				raw: W(t[0], "\n"),
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
				let t = W(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = ir(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), or(t, {
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
			return or(n, e, n[0], this.lexer, this.rules);
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
}, G = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || Lt, this.options.tokenizer = this.options.tokenizer || new cr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
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
}, lr = class {
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
}, ur = class {
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
}, K = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || Lt, this.options.renderer = this.options.renderer || new lr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ur();
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
}, dr = class {
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
		return e ? G.lex : G.lexInline;
	}
	provideParser(e = this.block) {
		return e ? K.parse : K.parseInline;
	}
}, fr = new class {
	defaults = It();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = K;
	Renderer = lr;
	TextRenderer = ur;
	Lexer = G;
	Tokenizer = cr;
	Hooks = dr;
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
				let t = this.defaults.renderer || new lr(this.defaults);
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
				let t = this.defaults.tokenizer || new cr(this.defaults);
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
				let t = this.defaults.hooks || new dr();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = dr.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && dr.passThroughHooksRespectAsync.has(n)) return (async () => {
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
		return G.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return K.parse(e, t ?? this.defaults);
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
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? G.lex : G.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? K.parse : K.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? G.lex : G.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? K.parse : K.parseInline)(n, i);
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
function q(e, t) {
	return fr.parse(e, t);
}
q.options = q.setOptions = function(e) {
	return fr.setOptions(e), q.defaults = fr.defaults, Rt(q.defaults), q;
}, q.getDefaults = It, q.defaults = Lt;
function pr(...e) {
	return fr.use(...e), q.defaults = fr.defaults, Rt(q.defaults), q;
}
q.use = pr, q.walkTokens = function(e, t) {
	return fr.walkTokens(e, t);
}, q.parseInline = fr.parseInline, q.Parser = K, q.parser = K.parse, q.Renderer = lr, q.TextRenderer = ur, q.Lexer = G, q.lexer = G.lex, q.Tokenizer = cr, q.Hooks = dr, q.parse = q, q.options, q.setOptions, q.walkTokens, q.parseInline, K.parse, G.lex;
//#endregion
//#region src/MapRenderer.jsx
var mr = "/viewers/cep-solid/compiled-json/map_pins.json", hr = "/viewers/cep-js/assets/Map Markers/", gr = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", _r = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", vr = {
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
}, yr = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), br = (e) => String(e).padStart(2, "0"), xr = (e) => `${e.getFullYear()}-${br(e.getMonth() + 1)}-${br(e.getDate())}`, Sr = (e) => new Date(e, 1, 29).getDate() === 29, Cr = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function wr(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function Tr() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = gr, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = _r, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function Er() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = ".MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}", document.head.appendChild(e);
}
function Dr(e, t) {
	let n = e.getElement();
	if (!n) return;
	let r = n.style.transform.replace(/\s*scale\([^)]*\)\s*$/, "");
	n.style.transform = t ? `${r} scale(2.5)` : r;
}
function Or(e) {
	let t = new URLSearchParams(location.search).get("v") || "cep-js", n = document.createElement("a");
	return n.href = `/?v=${t}&=${encodeURIComponent(e)}`, n.textContent = "Loading…", fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => {
		n.textContent = e.title;
	}).catch(() => {
		n.textContent = "Open article";
	}), n;
}
var kr = null;
function Ar() {
	return kr ||= fetch(mr).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = yr(e.s), e._e = yr(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: yr(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), kr = null, [])), kr;
}
async function jr(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await Tr(), Er();
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
	let s = Object.fromEntries(Object.entries(vr).map(([e, t]) => [e, i.icon({
		iconUrl: hr + t,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), c = i.layerGroup().addTo(o), l = t.map((e) => {
		let t = i.marker(e.c).bindPopup(n ? e.c.join(", ") : () => Or(e.p));
		return t.on("mouseover", () => {
			t.setZIndexOffset(1e3), Dr(t, !0);
		}), t.on("mouseout", () => {
			t.setZIndexOffset(0), Dr(t, !1);
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
			let o = wr(e, i);
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
		let e = Sr(+p.value) ? 366 : 365;
		m.max = e, +m.value > e && (m.value = e);
	}
	function v() {
		let e = new Date(+p.value, 0);
		e.setDate(+m.value), g.textContent = `${br(e.getMonth() + 1)}/${br(e.getDate())}/${e.getFullYear()}`, h.value = xr(e), u(e);
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
		p.value = e.getFullYear(), _(), m.value = Cr(e), b();
	}), p.value = d.getFullYear(), _(), m.value = Cr(d), v(), { destroy: () => o.remove() };
}
//#endregion
//#region src/GlobalFunctions.jsx
var Mr = /*#__PURE__*/ F("<a><img alt loading=lazy class>", !0, !1, !1), Nr = /*#__PURE__*/ F("<a class=CardImageExcerpt>Error?"), Pr = /*#__PURE__*/ F("<a class=CardImageExcerpt>No Article Content. Come write some!"), Fr = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), Ir = /*#__PURE__*/ F("<a><img loading=lazy class>", !0, !1, !1), Lr = /*#__PURE__*/ F("<mark>"), Rr = /*#__PURE__*/ F("<div class=\"MapContainer fade-in\">"), zr = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), Br = [
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
async function Vr(e) {
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
async function J(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Hr(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function Y(e) {
	return (await At())[e] ?? null;
}
function Ur() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function X(e) {
	return `/?v=${Ur()}&=${e}`;
}
function Z(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Br[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function Wr(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Br[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function Gr(e) {
	return e ? (() => {
		var t = Mr(), n = t.firstChild;
		return R((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), C(() => I(t, "href", X(e))), t;
	})() : null;
}
function Kr(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function qr(e, t = 160) {
	let n = await Y(e.title);
	if (!n) return (() => {
		var e = Nr();
		return C(() => I(e, "href", X(n))), e;
	})();
	let r = await J(n) || await Hr(n);
	if (!r) return (() => {
		var e = Pr();
		return C(() => I(e, "href", X(n))), e;
	})();
	let i = Kr(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = Pr();
		return C(() => I(e, "href", X(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = Fr();
		return z(e, a), C(() => I(e, "href", X(n))), e;
	})();
}
function Jr(e, t = null, n) {
	try {
		let r = localStorage.getItem(e);
		if (r === null) return t;
		let i = typeof t == "string" ? r : JSON.parse(r);
		return n && !n(i) ? t : i;
	} catch {
		return t;
	}
}
function Yr(e, t) {
	try {
		return localStorage.setItem(e, typeof t == "string" ? t : JSON.stringify(t)), !0;
	} catch {
		return !1;
	}
}
async function Xr(e) {
	let t = await Y(e.title);
	if (!t) return null;
	let n = null;
	if (e?.pageThumbnailFile ? n = await Y(e.pageThumbnailFile) : await new Promise((e) => {
		let n = new Image();
		n.onload = () => e(!0), n.onerror = () => e(!1), n.src = `/content/${t}/photo.avif`;
	}) && (n = t), !n) return null;
	let r = "", [i, a] = await Promise.all([J(t).catch(() => ""), Hr(t).catch(() => "")]), o = await Q(i || a || "");
	return r = (new DOMParser().parseFromString(q.parse(o), "text/html").body.textContent || "").trim(), (() => {
		var e = Ir(), i = e.firstChild;
		return R((e) => {
			let t = `/content/${n}/lowphoto.avif`, r = `/content/${n}/photo.avif`;
			e.onload = () => {
				let t = new Image();
				t.onload = () => e.src = r, t.src = r;
			}, e.onerror = () => e.src = r, e.src = t;
		}, i), I(i, "alt", r), C(() => I(e, "href", X(t))), e;
	})();
}
var Zr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Qr(e, t) {
	let n = (e || "").replace(/[‘’]/g, "'"), r = [...new Set((t || []).filter((e) => e.length > 1))].sort((e, t) => t.length - e.length);
	if (!r.length || !n) return [{
		text: n,
		hit: !1
	}];
	let i = RegExp(`(${r.map(Zr).join("|")})`, "gi");
	return n.split(i).map((e, t) => ({
		text: e,
		hit: t % 2 == 1
	})).filter((e) => e.text);
}
function $r(e, t) {
	return !t || !t.length ? e : Qr(e, t).map((e) => e.hit ? (() => {
		var t = Lr();
		return z(t, () => e.text), t;
	})() : e.text);
}
function ei(e) {
	return new Date(e).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function ti(e) {
	return (() => {
		var t = Rr();
		return R((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function Q(e) {
	let t = e.split(/(```[\s\S]*?```|`[^`\n]*`)/);
	return (await Promise.all(t.map(async (e, t) => {
		if (t % 2) return e;
		let n = [...e.matchAll(/(?<![\]\\])\[([^\[\]\n]+)\](?![(\[:])/g)], r = await Promise.all(n.map(async (e) => {
			let t = e[1].trim();
			if (!t || /^[xX]$/.test(t)) return e[0];
			if (/^\d+$/.test(t)) return `<sup><a href="#cite-${t}">(${t})</a></sup>`;
			let n = await Y(t);
			return n ? `[${t}](${X(n)})` : `<span class="BadLink">${t}</span>`;
		})), i = "", a = 0;
		return n.forEach((t, n) => {
			i += e.slice(a, t.index) + r[n], a = t.index + t[0].length;
		}), i + e.slice(a);
	}))).join("");
}
async function ni(e) {
	if (!zr.has((e?.type || "").toLowerCase())) return null;
	let t = await Y(e?.title);
	if (!t) return null;
	let n = (await Ar()).find((e) => e.p === t);
	return n ? ti((e) => jr(e, [n], { single: !0 })) : null;
}
async function ri() {
	let e = await Ar();
	return e.length ? ti((t) => jr(t, e)) : null;
}
//#endregion
//#region src/SearchPage.jsx
var ii = /*#__PURE__*/ F("<mark>"), ai = /*#__PURE__*/ F("<img alt loading=lazy>", !0, !1, !1), oi = /*#__PURE__*/ F("<button type=button class=\"ResultTag ResultTagMore\">. . ."), si = /*#__PURE__*/ F("<div class=ResultTags>"), ci = /*#__PURE__*/ F("<a class=ResultTag>"), li = /*#__PURE__*/ F("<strong>"), ui = /*#__PURE__*/ F("<span class=ResultTime>"), di = /*#__PURE__*/ F("<div class=ResultSummary>"), fi = /*#__PURE__*/ F("<div class=\"Result ResultList fade-in\"><div class=ResultThumb><a></a></div><div class=ResultBody><div class=ResultTitle><a></a></div><div class=ResultDates>"), pi = /*#__PURE__*/ F("<div>"), mi = /*#__PURE__*/ F("<button type=button class=PinButton>Prev"), hi = /*#__PURE__*/ F("<button type=button class=PinButton>Next"), gi = /*#__PURE__*/ F("<div class=SearchPager>"), _i = /*#__PURE__*/ F("<span>…"), vi = /*#__PURE__*/ F("<button type=button class=PinButton>"), yi = /*#__PURE__*/ F("<ul class=SearchSuggestions>"), bi = /*#__PURE__*/ F("<div class=SearchBar><div class=SearchBarField><input class=SearchInput type=text autocomplete=off></div><button type=button class=SearchButton>Search"), xi = /*#__PURE__*/ F("<span class=SearchChip><button type=button class=SearchChipRemove>×"), Si = /*#__PURE__*/ F("<li class=SearchSuggestion> <span class=SearchCount>"), Ci = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">Nothing found."), wi = /*#__PURE__*/ F("<div class=SearchLayout><aside class=SearchSidebar><div class=SearchFilterGroup><label>Sort: <select id=sSort></select></label><label>Display: <select id=sResultView></select></label></div><div class=\"SearchFilterGroup SearchTypeGroup\"></div></aside><main class=SearchResults><div class=SearchStatus>"), Ti = /*#__PURE__*/ F("<div class=SearchPage>"), Ei = /*#__PURE__*/ F("<div class=SearchStatus>Loading search…"), Di = /*#__PURE__*/ F("<option>"), Oi = /*#__PURE__*/ F("<li>…"), ki = /*#__PURE__*/ F("<ul class=SearchTypePreview>"), Ai = /*#__PURE__*/ F("<div class=SearchTypeFilter><button type=button class=SearchTypeButton> (<!>)"), ji = /*#__PURE__*/ F("<li>"), Mi = "/viewers/cep-solid/compiled-json/search.sqlite", Ni = "/viewers/cep-solid/compiled-json/sqlite.worker.js", Pi = "/viewers/cep-solid/compiled-json/sql-wasm.wasm", Fi = 1024, Ii = 3e3, Li = 24, Ri = 8, zi = 5, Bi = 200, Vi = .5, Hi = [
	["relevancy", "Relevancy"],
	["oldest", "Oldest → Newest"],
	["newest", "Newest → Oldest"],
	["newest-updated", "Recently Updated"],
	["oldest-updated", "Least Recently Updated"],
	["most-views", "Most Views"],
	["least-views", "Least Views"]
], Ui = Hi.map(([e]) => e), Wi = "var(--primary)", Gi = Object.fromEntries(Object.entries({
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
}).flatMap(([e, t]) => t.map((t) => [t, e]))), Ki = (e) => Gi[(e || "").toLowerCase()] || Wi, qi = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"theories",
	"meta",
	"transcriptions"
]), Ji = null, Yi = null, Xi = null, Zi = /* @__PURE__ */ new Map();
async function Qi() {
	return Ji ||= await (await fetch("/viewers/cep-solid/compiled-json/tags.json")).json(), Ji;
}
var $i = (e) => (e || "").toLowerCase().replace(/[‘’]/g, "'"), ea = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), ta = (e) => `'${e.replace(/'/g, "''")}'`, $ = (...e) => console.log("[search-debug]", ...e);
async function na(e, t, n) {
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
async function ra(e, t) {
	let n = ta(t), r = [
		["sqlite version", "SELECT sqlite_version() AS v"],
		["chunk row count", "SELECT count(*) AS n FROM chunks"],
		["match only", `SELECT folder FROM chunks WHERE chunks MATCH ${n} LIMIT 3`],
		["match + rank", `SELECT folder, rank FROM chunks WHERE chunks MATCH ${n} ORDER BY rank LIMIT 3`],
		["match + snippet", `SELECT folder, snippet(chunks, 0, char(1), char(2), '…', ${Li}) AS found FROM chunks WHERE chunks MATCH ${n} LIMIT 3`]
	];
	$("fts match string:", t);
	for (let [t, n] of r) try {
		$(t, await e.db.query(n));
	} catch (e) {
		$(t, "FAILED", e?.message || e);
	}
}
function ia(e) {
	return [...(e || "").matchAll(/"([^"]*)"|(\S+)/g)].map((e) => $i(e[1] ?? e[2]).trim()).filter(Boolean);
}
function aa(e, t = "phrase") {
	let n = (e) => $i(e).replace(/"/g, "").replace(/\s+/g, " ").trim();
	if (t === "phrase") {
		if ((e || "").includes("\"")) return ia(e).map(n).filter(Boolean).map((e) => `"${e}" *`).join(" ");
		let t = n(e);
		return t ? `"${t}" *` : "";
	}
	return ia(e).flatMap((e) => e.split(/\s+/)).map(n).filter(Boolean).map((e) => `"${e}" *`).join(t === "or" ? " OR " : " ");
}
function oa(e) {
	let t = `  ${e}  `, n = /* @__PURE__ */ new Set();
	for (let e = 0; e < t.length - 2; e++) n.add(t.slice(e, e + 3));
	return n;
}
function sa(e, t) {
	let [n, r] = e.size <= t.size ? [e, t] : [t, e], i = 0;
	for (let e of n) r.has(e) && i++;
	return 2 * i / (e.size + t.size);
}
function ca(e) {
	return (e || "").split(/(\u0001[^\u0002]*\u0002)/).map((e) => e.startsWith("") ? {
		text: e.slice(1, -1),
		hit: !0
	} : {
		text: e,
		hit: !1
	}).filter((e) => e.text);
}
function la(e = [], t = "") {
	let n = new URLSearchParams({
		v: Ur(),
		page: "search"
	});
	return e.length && n.set("tags", e.join("|")), t && n.set("q", t), `/?${n.toString()}`;
}
function ua() {
	let e = new URLSearchParams(location.search);
	return {
		tags: (e.get("tags") || "").split("|").map((e) => e.trim()).filter(Boolean),
		q: (e.get("q") || "").trim()
	};
}
function da() {
	return Yi ||= Promise.all([
		Qi(),
		Tt(),
		Nt(),
		Mt(),
		jt(),
		Dt(),
		At()
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
	}), Yi;
}
function fa() {
	if (!Xi) {
		let t = new URL(Mi, location.origin).href, n = new URL(Ni, location.origin).href, r = new URL(Pi, location.origin).href;
		na(t, n, r), Xi = import("./dist-DRMIypK3.js").then((t) => /* @__PURE__ */ e(t.default, 1)).then(({ createDbWorker: e }) => e([{
			from: "inline",
			config: {
				serverMode: "full",
				requestChunkSize: Fi,
				url: t
			}
		}], n, r)).then((e) => ($("search.sqlite worker", e ? "opened" : "missing"), e)).catch((e) => (console.error("Search: failed to open search.sqlite", e), $("open failed", e?.name, e?.message, e?.stack), Xi = null, null));
	}
	return Xi;
}
async function pa(e, t) {
	try {
		let n = await e.db.query(`SELECT folder, ts, snippet(chunks, 0, char(1), char(2), '…', ${Li}) AS found FROM chunks WHERE chunks MATCH ${ta(t)} ORDER BY rank LIMIT ${Ii}`), r = /* @__PURE__ */ new Set(), i = [];
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
async function ma(e) {
	let t = ia(e);
	if (!t.length) return [];
	let n = await fa();
	if (!n) return [];
	await ra(n, aa(e));
	let r = await pa(n, aa(e));
	if (r.length || t.length < 2) return r;
	let i = await pa(n, aa(e, "and"));
	return i.length ? i : pa(n, aa(e, "or"));
}
function ha(e, t) {
	let n = ia(e);
	if (!n.length) return [];
	t.titleIndex ||= Object.entries(t.idTitle).map(([e, t]) => {
		let n = $i(t);
		return [
			e,
			n,
			oa(n)
		];
	});
	let r = n.join(" "), i = oa(r), a = [];
	for (let [e, o, s] of t.titleIndex) {
		let t = 0;
		if (n.every((e) => o.includes(e))) t = 2 + +(o === r) + (o.startsWith(r) ? .5 : 0);
		else {
			let e = sa(i, s);
			e >= Vi && (t = e);
		}
		t && a.push({
			id: e,
			score: t
		});
	}
	return a;
}
async function ga({ tags: e, q: t }, n) {
	let r = null;
	e.length && (r = [...new Set(e.flatMap((e) => n.tagMap[n.tagLookup[e.toLowerCase()]] || []))]);
	let i = t.trim();
	if (!i) return (r ?? n.allIds).map((e) => ({
		id: e,
		score: n.views[e] || 0,
		found: null
	})).sort((e, t) => t.score - e.score);
	let [a, o] = await Promise.all([ma(i), ha(i, n)]);
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
function _a(e) {
	return Zi.has(e) || Zi.set(e, Vr(e).catch(() => ({
		type: "notfound",
		folderID: e
	}))), Zi.get(e);
}
async function va(e) {
	let [t, n] = await Promise.all([J(e).catch(() => ""), Hr(e).catch(() => "")]), r = (t || n || "").replace(/\{\d+:\d\d(?::\d\d)?\}/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[\[\]#*_`>]/g, "").replace(/\s+/g, " ").trim();
	return r ? r.length <= Bi ? r : `${r.slice(0, r.slice(0, Bi).lastIndexOf(" "))}…` : "";
}
function ya(e, t, n) {
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
function ba(e) {
	return P(() => $r(e.text, e.words));
}
function xa(e) {
	return j(M, {
		get each() {
			return ca(e.text);
		},
		children: (e) => e.hit ? (() => {
			var t = ii();
			return z(t, () => e.text), t;
		})() : e.text
	});
}
function Sa(e) {
	return (() => {
		var t = ai();
		return R((t) => {
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
function Ca(e) {
	let [t, n] = S(!1), r = () => t() ? e.tags : e.tags.slice(0, zi), i = () => new Set((e.active || []).map((e) => e.toLowerCase()));
	return j(N, {
		get when() {
			return e.tags?.length;
		},
		get children() {
			var a = si();
			return z(a, j(M, {
				get each() {
					return r();
				},
				children: (e) => (() => {
					var t = ci();
					return z(t, e), C((n) => {
						var r = !!i().has(e.toLowerCase()), a = la([e]);
						return r !== n.e && t.classList.toggle("active", n.e = r), a !== n.t && I(t, "href", n.t = a), n;
					}, {
						e: void 0,
						t: void 0
					}), t;
				})()
			}), null), z(a, j(N, {
				get when() {
					return P(() => !t())() && e.tags.length > zi;
				},
				get children() {
					var e = oi();
					return e.$$click = () => n(!0), e;
				}
			}), null), a;
		}
	});
}
function wa(e) {
	let t = e.entry.id, [n] = T(() => _a(t)), [r] = T(() => n(), async (e) => e.pageThumbnailFile ? await Y(e.pageThumbnailFile) : t), i = () => (n()?.type || e.data.idType[t] || "").toLowerCase(), a = () => i() === "photos", [o] = T(() => e.entry.found || a() ? !1 : t, va), [s] = T(() => a() ? t : !1, (e) => J(e).catch(() => "")), c = () => a() && s()?.trim() || n()?.title || e.data.idTitle[t] || t, l = () => e.data.idTags[t] || [];
	return (() => {
		var s = fi(), u = s.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild, m = p.firstChild, h = p.nextSibling;
		return z(d, j(N, {
			get when() {
				return r();
			},
			get children() {
				return j(Sa, { get id() {
					return r();
				} });
			}
		})), z(m, j(ba, {
			get text() {
				return c();
			},
			get words() {
				return e.words;
			}
		})), z(h, j(N, {
			get when() {
				return n();
			},
			get children() {
				return [
					(() => {
						var e = li();
						return z(e, (() => {
							var e = P(() => !!qi.has(i()));
							return () => e() ? Z(n().startDate) : [
								P(() => Z(n().startDate)),
								" – ",
								P(() => Wr(n().endDate))
							];
						})()), e;
					})(),
					" ",
					"👁",
					P(() => e.data.views[t] || 0)
				];
			}
		})), z(f, j(Ca, {
			get tags() {
				return l();
			},
			get active() {
				return e.tags;
			}
		}), null), z(f, j(N, {
			get when() {
				return !a();
			},
			get children() {
				var t = di();
				return z(t, j(N, {
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
									var t = ui();
									return z(t, () => e.entry.found.ts), t;
								})(), " "];
							}
						}), j(xa, { get text() {
							return e.entry.found.text;
						} })];
					}
				})), t;
			}
		}), null), C((e) => {
			var n = X(t), r = X(t);
			return n !== e.e && I(d, "href", e.e = n), r !== e.t && I(m, "href", e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), s;
	})();
}
function Ta(e) {
	return (t) => {
		let [n] = T(() => _a(t.entry.id)), [r] = T(() => n()?.title ? n() : !1, (n) => e(n, t.words));
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
var Ea = {
	"Detailed List": {
		item: wa,
		wrapper: ""
	},
	Cards: {
		item: (e) => j(vs, {
			get id() {
				return e.entry.id;
			},
			get words() {
				return e.words;
			},
			render: Ss
		}),
		wrapper: "ResultCards"
	},
	Compact: {
		item: Ta(Ks),
		wrapper: "ResultCompact"
	},
	List: {
		item: Ta(qs),
		wrapper: "ResultPlain"
	}
}, Da = Object.keys(Ea);
function Oa(e) {
	let t = () => Ea[e.shared.view];
	return (() => {
		var n = pi();
		return z(n, j(M, {
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
function ka(e) {
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
			var n = gi();
			return z(n, j(N, {
				get when() {
					return e.page > 0;
				},
				get children() {
					var t = mi();
					return t.$$click = () => e.onPage(e.page - 1), t;
				}
			}), null), z(n, j(M, {
				get each() {
					return t();
				},
				children: (t) => t < 0 ? _i() : (() => {
					var n = vi();
					return n.$$click = () => e.onPage(t), z(n, t + 1), C((r) => {
						var i = t === e.page, a = t === e.page;
						return i !== r.e && n.classList.toggle("active", r.e = i), a !== r.t && I(n, "aria-pressed", r.t = a), r;
					}, {
						e: void 0,
						t: void 0
					}), n;
				})()
			}), null), z(n, j(N, {
				get when() {
					return e.page < e.pages - 1;
				},
				get children() {
					var t = hi();
					return t.$$click = () => e.onPage(e.page + 1), t;
				}
			}), null), n;
		}
	});
}
function Aa(e) {
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
		return a.sort((e, t) => e.rank - t.rank || t.count - e.count || e.name.length - t.name.length), a.slice(0, Ri);
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
		var e = bi(), n = e.firstChild, h = n.firstChild, g = n.nextSibling;
		n.$$click = () => l?.focus(), z(n, j(M, {
			get each() {
				return t();
			},
			children: (e) => (() => {
				var t = xi(), n = t.firstChild;
				return z(t, e, n), n.$$click = () => f(e), I(n, "aria-label", `Remove ${e}`), t;
			})()
		}), h), h.addEventListener("blur", () => c(!1)), h.addEventListener("focus", () => c(!0)), h.$$keydown = m, h.$$input = (e) => {
			i(e.target.value), o(-1);
		};
		var _ = l;
		return typeof _ == "function" ? R(_, h) : l = h, z(n, j(N, {
			get when() {
				return P(() => !!s())() && u().length;
			},
			get children() {
				var e = yi();
				return z(e, j(M, {
					get each() {
						return u();
					},
					children: (e, t) => (() => {
						var n = Si(), r = n.firstChild, i = r.nextSibling;
						return n.$$mousedown = (t) => {
							t.preventDefault(), d(e.name);
						}, z(n, () => e.name, r), z(i, () => e.count), C(() => n.classList.toggle("active", a() === t())), n;
					})()
				})), e;
			}
		}), null), g.$$click = p, C(() => I(h, "placeholder", t().length ? "Add tags or search text…" : "Search articles, or type to find a tag…")), C(() => h.value = r()), e;
	})();
}
function ja() {
	let [e, t] = S(ua()), [n, r] = S(Jr("sSort", "relevancy", (e) => Ui.includes(e))), [i, a] = S(Jr("sResultView", Da[0], (e) => Da.includes(e))), [o, s] = S(""), [c, l] = S(null), [u, d] = S(0), [f] = T(da), [p] = T(() => f() ? e() : !1, (e) => ga(e, f())), m = w(() => f() ? e().tags.map((e) => f().titleLookup[e.toLowerCase()]).filter(Boolean) : []), h = w(() => f() ? ya(n(), f(), m()) : () => 0), g = w(() => {
		let e = /* @__PURE__ */ new Map();
		if (!f() || p.loading) return e;
		for (let t of p() || []) {
			let n = f().idType[t.id] || "other";
			e.has(n) || e.set(n, []), e.get(n).push(t);
		}
		return new Map([...e].sort((e, t) => t[1].length - e[1].length || e[0].localeCompare(t[0])));
	}), _ = w(() => [...g()].flatMap(([, e]) => e)), v = w(() => [{
		key: "",
		label: "All",
		list: _()
	}, ...[...g()].map(([e, t]) => ({
		key: e,
		label: ea(e),
		list: t
	}))]), y = () => o() === "" || g().has(o()) ? o() : "", b = w(() => [...y() === "" ? _() : g().get(y()) || []].sort(h())), x = (e) => [...e].sort(h()).slice(0, 3).map((e) => f().idTitle[e.id] || e.id), ee = w(() => ({
		data: f(),
		words: ia(e().q),
		tags: e().tags,
		view: i()
	}));
	te(() => Yr("sSort", n())), te(() => Yr("sResultView", i()));
	let ne = () => t(ua());
	window.addEventListener("popstate", ne), re(() => window.removeEventListener("popstate", ne));
	let ie = () => b().length, ae = () => Math.max(1, Math.ceil(ie() / 50)), oe = () => b().slice(u() * 50, (u() + 1) * 50);
	te(() => {
		b(), E(() => d(0));
	});
	function se(e) {
		d(e), window.scrollTo({ top: 0 });
	}
	function D(e) {
		history.pushState(null, "", la(e.tags, e.q)), t(e);
	}
	return (() => {
		var t = Ti();
		return z(t, j(N, {
			get when() {
				return f();
			},
			get fallback() {
				return Ei();
			},
			get children() {
				return [j(Aa, {
					get data() {
						return f();
					},
					get value() {
						return e();
					},
					onSubmit: D
				}), (() => {
					var e = wi(), t = e.firstChild, o = t.firstChild, d = o.firstChild, f = d.firstChild.nextSibling, m = d.nextSibling.firstChild.nextSibling, h = o.nextSibling, g = t.nextSibling, _ = g.firstChild;
					return f.addEventListener("change", (e) => r(e.target.value)), z(f, j(M, {
						each: Hi,
						children: ([e, t]) => (() => {
							var r = Di();
							return r.value = e, z(r, t), C(() => r.selected = n() === e), r;
						})()
					})), m.addEventListener("change", (e) => a(e.target.value)), z(m, j(M, {
						each: Da,
						children: (e) => (() => {
							var t = Di();
							return t.value = e, z(t, e), C(() => t.selected = i() === e), t;
						})()
					})), z(h, j(M, {
						get each() {
							return v();
						},
						children: (e) => (() => {
							var t = Ai(), n = t.firstChild, r = n.firstChild, i = r.nextSibling;
							return i.nextSibling, t.addEventListener("mouseleave", () => l(null)), n.$$click = () => {
								s(e.key), l(e.key), document.activeElement?.blur();
							}, z(n, () => e.label, r), z(n, () => e.list.length, i), z(t, j(N, {
								get when() {
									return P(() => e.key !== "")() && e.list.length;
								},
								get children() {
									var t = ki();
									return z(t, j(M, {
										get each() {
											return x(e.list);
										},
										children: (e) => (() => {
											var t = ji();
											return z(t, e), t;
										})()
									}), null), z(t, j(N, {
										get when() {
											return e.list.length > 3;
										},
										get children() {
											return Oi();
										}
									}), null), t;
								}
							}), null), C((r) => {
								var i = c() === e.key, a = y() === e.key, o = Ki(e.key), s = y() === e.key;
								return i !== r.e && t.classList.toggle("quiet", r.e = i), a !== r.t && n.classList.toggle("active", r.t = a), o !== r.a && Xe(n, "--chip", r.a = o), s !== r.o && I(n, "aria-pressed", r.o = s), r;
							}, {
								e: void 0,
								t: void 0,
								a: void 0,
								o: void 0
							}), t;
						})()
					})), z(_, j(N, {
						get when() {
							return !p.loading;
						},
						fallback: "Searching…",
						get children() {
							return `${ie()} result${ie() === 1 ? "" : "s"}`;
						}
					})), z(g, j(N, {
						get when() {
							return !p.loading;
						},
						get children() {
							return [
								j(N, {
									get when() {
										return u() > 0;
									},
									get children() {
										return j(ka, {
											get page() {
												return u();
											},
											get pages() {
												return ae();
											},
											onPage: se
										});
									}
								}),
								j(Oa, {
									get items() {
										return oe();
									},
									get shared() {
										return ee();
									}
								}),
								j(ka, {
									get page() {
										return u();
									},
									get pages() {
										return ae();
									},
									onPage: se
								}),
								j(N, {
									get when() {
										return ie() === 0;
									},
									get children() {
										return Ci();
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
var Ma = /*#__PURE__*/ F("<div class=ResultCards>"), Na = /*#__PURE__*/ F("<div>"), Pa = /*#__PURE__*/ F("<img>"), Fa = /*#__PURE__*/ F("<a class=CitationTitle target=_blank rel=noopener>. "), Ia = /*#__PURE__*/ F("<a class=CitationUrl target=_blank rel=noopener>"), La = /*#__PURE__*/ F("<div class=CitationItem><div class=CitationIcon></div><div class=CitationText>"), Ra = /*#__PURE__*/ F("<span class=CitationTitle>. "), za = /*#__PURE__*/ F("<div class=Citations><h2>Citations"), Ba = /*#__PURE__*/ F("<h2>Tags"), Va = /*#__PURE__*/ F("<div class=ArticleTabs><a class=PinButton>Edit Page"), Ha = /*#__PURE__*/ F("<button type=button class=PinButton>Article"), Ua = /*#__PURE__*/ F("<div class=ArticleTabs><select class=PinButton value><option value disabled hidden selected>Edit"), Wa = /*#__PURE__*/ F("<div class=\"TaggedList fade-in\">"), Ga = /*#__PURE__*/ F("<option>"), Ka = /*#__PURE__*/ F("<button type=button class=PinButton> (<!>)"), qa = /*#__PURE__*/ F("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong></strong> 👁"), Ja = /*#__PURE__*/ F("<a><img loading=lazy>", !0, !1, !1), Ya = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), Xa = /*#__PURE__*/ F("<span class=ReviewEmoji>"), Za = /*#__PURE__*/ F("<div class=\"ReviewCard fade-in\"><div class=ReviewTitle><a></a></div><div class=ReviewMeta></div><div class=ReviewBody>"), Qa = /*#__PURE__*/ F("<span class=PostTime>"), $a = /*#__PURE__*/ F("<span class=PostDeleted>[Deleted]"), eo = /*#__PURE__*/ F("<h3 class=PostTitle>"), to = /*#__PURE__*/ F("<div class=PostSubject>"), no = /*#__PURE__*/ F("<div class=SteamPostBox><div class=SteamAvatar></div><div class=SteamPostContent><div class=PostHeaderMeta><span class=PostAuthor>"), ro = /*#__PURE__*/ F("<span class=CommentTime>"), io = /*#__PURE__*/ F("<blockquote class=CommentQuote>"), ao = /*#__PURE__*/ F("<div class=CommentSubject>"), oo = /*#__PURE__*/ F("<div class=SteamPostBox><div class=SteamAvatar style=\"background-image:url('/viewers/cep-js/assets/Social Posts/Scott.jpg')\"></div><div class=SteamPostContent><div class=CommentHeaderMeta><span class=PostAuthor><span style=color:#aedd08>Scott</span> <span style=color:#e9d528>[developer]"), so = /*#__PURE__*/ F("<div class=\"SteamCommentBody fade-in\"><div class=SteamCommentHeader><a></a></div><div class=SteamCommentPreview>"), co = /*#__PURE__*/ F("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), lo = /*#__PURE__*/ F("<div><div></div><div><div><a></a></div><div><strong></strong> 👁"), uo = /*#__PURE__*/ F("<div><a></a><span class=ListMeta><strong></strong> 👁"), fo = /*#__PURE__*/ F("<div class=404>You've found an article that doesn't exist yet! Click the logo to head back home."), po = /*#__PURE__*/ F("<br>"), mo = /*#__PURE__*/ F("<div class=Homepage><center>Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!<br>Use the search above to explore our site! Something not listed here? Help contribute or <a href=\"/?v=cep-editor\">create a new page!</a><br><br><strong>IMPORTANT! You are using an in-development test version of the site, <a href=\"/?v=cep-js\">click here</a> to return to the default viewer! Otherwise thanks for testing this out, I hope this will give you a better experience searching and browsing through the pages. Leave feedback on the <a href=https://forum.cheeseepedia.org/t/cep-solid-wiki-overhaul/485/43>forum thread</a> as this will become the default by likely end of year!</strong></center><h2>News</h2><h2>Wiki</h2><h2>Community"), ho = /*#__PURE__*/ F("<div class=Carousel>"), go = /*#__PURE__*/ F("<nav class=Nav>"), _o = /*#__PURE__*/ F("<details><summary></summary><div>"), vo = /*#__PURE__*/ F("<a>"), yo = /*#__PURE__*/ F("<div class=Footer>Last build on: <span id=StatBuildDate>???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), bo = /*#__PURE__*/ F("<div class=SplashText>"), xo = /*#__PURE__*/ F("<div class=Header><a href=\"/?v=cep-solid\"class=Logo><img alt=Cheesepedia></a><div class=FlavorText>Now at <strong><span id=StatArticles>????</span></strong> articles contributed by <strong><span id=StatContributors>???</span></strong> users.<br>Discussions available on the <strong><a href=https://forum.cheeseepedia.org/>Forums!</a></strong><br><a href=\"/?v=cep-solid&amp;page=search\">Search Here!"), So = /*#__PURE__*/ F("<button type=button class=PinButton>"), Co = /*#__PURE__*/ F("<div class=TabPanel>"), wo = /*#__PURE__*/ F("<h2>Cheese-E-Shuffle"), To = /*#__PURE__*/ F("<div>Loading…"), Eo = /*#__PURE__*/ F("<div>Nothing found."), Do = /*#__PURE__*/ F("<div id=RandomCards class=Carousel>"), Oo = /*#__PURE__*/ F("<div class=infobox-list><strong>:</strong><ul>"), ko = /*#__PURE__*/ F("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), Ao = /*#__PURE__*/ F("<video controls preload=metadata>"), jo = /*#__PURE__*/ F("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), Mo = /*#__PURE__*/ F("<div class=\"VideoEmbed fade-in\">"), No = /*#__PURE__*/ F("<h1 class=article-title>"), Po = /*#__PURE__*/ F("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), Fo = /*#__PURE__*/ F("<div class=fade-in>"), Io = /*#__PURE__*/ F("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\"><h2>Video Transcription"), Lo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No transcription provided by source."), Ro = /*#__PURE__*/ F("<div class=\"PhotoCompact fade-in\"><a class=PhotoCompactImage><img loading=lazy></a><div class=PhotoCompactDate><strong></strong> 👁 ", !0, !1, !1), zo = /*#__PURE__*/ F("<div class=\"PhotoListItem fade-in\"><a><img loading=lazy class=PhotoListImg>", !0, !1, !1), Bo = /*#__PURE__*/ F("<div class=\"ArticleBody type-photo\"><div class=\"ArticlePhoto fade-in type-photo\"></div><div class=\"content fade-in type-photo\"><h2>Image Description"), Vo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No description provided. Help write one for accessibility."), Ho = /*#__PURE__*/ F("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), Uo = /*#__PURE__*/ F("<div class=infobox-list><strong>Credits:</strong><ul>"), Wo = /*#__PURE__*/ F("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), Go = /*#__PURE__*/ F("<li><strong></strong> (<!>)"), Ko = /*#__PURE__*/ F("<div class=infobox-desc>"), qo = /*#__PURE__*/ F("<li><strong></strong> (<!> – <!>)"), Jo = /*#__PURE__*/ F("<li><a target=_blank rel=\"noopener noreferrer\">"), Yo = /*#__PURE__*/ F("<li>"), Xo = /*#__PURE__*/ F("<li><strong>:</strong> "), Zo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No article content. Come write some!"), Qo = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"theories",
	"meta",
	"transcriptions"
]), $o = {
	Articles: (e) => !Qo.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos",
	Reviews: (e) => e === "reviews"
}, es = [
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
		tags: /* @__PURE__ */ "ShowBiz Pizza Place.Billy Bob's Wonderland.Volo Auto Museum.Looney Bird's.X-Site.Hannah Banana.Circus Pizza.Pistol Pete's Pizza.Chimpy's Pizza Safari.Billy Bob's Pizza Circus & Skating Center.Billy Bob's Pizza Theatre.Gulliver's.Adventure Landing.Animal House Pizza.Odyssey Fun World.Magic City.Rock-afire Arcade Bar.Billy Bob's Pizzatron.Tweetsie Railroad.Strike & Spare.Coolwalla Carnival.Rock-afire Pizza.Okefenokee Swamp Park.Circus.Fun Time Pizza.Fun Station USA.FunTime Pizza Circus.Party on! Pizza.Flamingo Land.Pleasure Island.Tuns-A-Fun Pizza.Billie Joe's Ice Cream Parlor & Restaurant.Mega Maze.KizBiz Pizza & Showplace.Stageshow Pizza.Zones.Sports Plus.Playrobics.Playkids Korea.Tokyo Summerland.Club Hotel Eliat.Funderland.Showtime Pizza.Scandia Golf & Games.Benson's Wild Animal Farm".split(".")
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
			"Great Wolf Lodge"
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
], ts = 15, ns = {
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
}, rs = "https://cheeseepedia.org/?v=cep-editor";
function is(e, t, n) {
	switch (e.toLowerCase()) {
		case "photos": return (() => {
			var e = Ma();
			return z(e, j(M, {
				each: t,
				children: (e) => j(vs, {
					id: e,
					render: Ss
				})
			})), e;
		})();
		case "reviews":
		case "steam comment": return (() => {
			var e = Na();
			return z(e, j(M, {
				each: t,
				children: (e) => j(vs, {
					id: e,
					render: Ss
				})
			})), e;
		})();
		default: return j(M, {
			each: t,
			children: (e) => j(wa, {
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
var as = "/viewers/cep-js/compiled-json/favicons", os = (e) => e.replace(/^https?:\/\/(www\.)?/, ""), ss = (e) => os(e).replace(/[^\w\-.]/g, "_") + ".png", cs = (e) => /^https?:\/\//i.test(e), ls = (e) => {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}, us = (e) => {
	try {
		return os(new URL(e).origin);
	} catch {
		return null;
	}
};
function ds(e) {
	let t = () => e.index + 1, n = () => cs(e.cite), r = () => n() ? ls(e.cite) : null;
	return (() => {
		var i = La(), a = i.firstChild, o = a.nextSibling;
		return z(a, j(N, {
			get when() {
				return r();
			},
			get children() {
				var e = Pa();
				return e.addEventListener("error", (e) => e.currentTarget.style.display = "none"), C((t) => {
					var n = r(), i = `${as}/${ss(r())}`;
					return n !== t.e && I(e, "alt", t.e = n), i !== t.t && I(e, "src", t.t = i), t;
				}, {
					e: void 0,
					t: void 0
				}), e;
			}
		})), z(o, j(N, {
			get when() {
				return n();
			},
			get fallback() {
				return (() => {
					var n = Ra(), r = n.firstChild;
					return z(n, t, r), z(n, () => e.cite, null), n;
				})();
			},
			get children() {
				return [(() => {
					var n = Fa(), i = n.firstChild;
					return z(n, t, i), z(n, () => us(e.cite) || r() || e.cite, null), C(() => I(n, "href", e.cite)), n;
				})(), (() => {
					var t = Ia();
					return z(t, () => os(e.cite)), C(() => I(t, "href", e.cite)), t;
				})()];
			}
		})), C(() => I(i, "id", `cite-${t()}`)), i;
	})();
}
function fs(e) {
	return j(N, {
		get when() {
			return e.citations?.length;
		},
		get children() {
			var t = za();
			return t.firstChild, z(t, j(M, {
				get each() {
					return e.citations;
				},
				children: (e, t) => j(ds, {
					cite: e,
					get index() {
						return t();
					}
				})
			}), null), t;
		}
	});
}
function ps(e) {
	let [t] = T(Tt);
	return j(N, {
		get when() {
			return t()?.[e.folderID]?.length;
		},
		get children() {
			return [Ba(), j(Ca, { get tags() {
				return t()[e.folderID];
			} })];
		}
	});
}
function ms(e) {
	return (() => {
		var t = Va(), n = t.firstChild;
		return C(() => I(n, "href", `${rs}&=${e.folderID}`)), t;
	})();
}
function hs(e) {
	let t = () => e.meta.folderID, [n, r] = S("Article"), [i, a] = S(0), o = (e) => {
		r(e), a(0);
	}, s = () => Math.max(1, Math.ceil((d().get(n())?.length || 0) / 50)), c = () => (d().get(n()) || []).slice(i() * 50, (i() + 1) * 50), l = (e) => {
		a(e), window.scrollTo({ top: 0 });
	}, [u] = T(() => Promise.all([Et(), da()])), d = w(() => {
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
	}), f = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), p = () => [
		{
			name: "Edit Page",
			href: `${rs}&=${t()}`
		},
		{
			name: "Add Review",
			href: `${rs}&type=Review&tag=${t()}`
		},
		{
			name: "Add Images",
			href: `${rs}&type=Photos&tag=${t()}`
		},
		{
			name: "Add Video",
			href: `${rs}&type=Videos&tag=${t()}`
		}
	];
	return [
		(() => {
			var e = Ua(), t = e.firstChild;
			return t.firstChild, t.addEventListener("change", (e) => {
				let t = e.target.value;
				e.target.value = "", t && (location.href = t);
			}), z(t, j(M, {
				get each() {
					return p();
				},
				children: (e) => (() => {
					var t = Ga();
					return z(t, () => e.name), C(() => t.value = e.href), t;
				})()
			}), null), z(e, j(N, {
				get when() {
					return d().size;
				},
				get children() {
					return [(() => {
						var e = Ha();
						return e.$$click = () => o("Article"), C((t) => {
							var r = n() === "Article", i = n() === "Article";
							return r !== t.e && e.classList.toggle("active", t.e = r), i !== t.t && I(e, "aria-pressed", t.t = i), t;
						}, {
							e: void 0,
							t: void 0
						}), e;
					})(), j(M, {
						get each() {
							return [...d()];
						},
						children: ([e, t]) => (() => {
							var r = Ka(), i = r.firstChild, a = i.nextSibling;
							return a.nextSibling, r.$$click = () => o(e), z(r, () => f(e), i), z(r, () => t.length, a), C((t) => {
								var i = n() === e, a = n() === e;
								return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && I(r, "aria-pressed", t.t = a), t;
							}, {
								e: void 0,
								t: void 0
							}), r;
						})()
					})];
				}
			}), null), e;
		})(),
		(() => {
			var t = Na();
			return z(t, () => e.children), C((e) => Xe(t, "display", n() === "Article" ? "" : "none")), t;
		})(),
		j(N, {
			get when() {
				return P(() => !!(n() !== "Article" && u()))() && d().get(n());
			},
			get children() {
				var e = Wa();
				return z(e, j(N, {
					get when() {
						return i() > 0;
					},
					get children() {
						return j(ka, {
							get page() {
								return i();
							},
							get pages() {
								return s();
							},
							onPage: l
						});
					}
				}), null), z(e, () => is(n(), c(), u()[1]), null), z(e, j(ka, {
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
function gs(e) {
	if (e.type === "home") return ks();
	if (e.type === "notfound") return Ds(e.folderID);
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
		case "Steam Comment": return Ys(e);
		case "Videos": return Us(e);
		case "Photos": return Js(e);
		default: return Ys(e);
	}
}
function _s({ link: e, thumbnailSrc: t, title: n, dateText: r, views: i, excerpt: a = n }) {
	return (() => {
		var o = qa(), s = o.firstChild, c = s.nextSibling.firstChild, l = c.firstChild.firstChild, u = c.nextSibling, d = u.firstChild;
		return d.nextSibling, z(s, t ? (() => {
			var r = Ja(), i = r.firstChild;
			return I(r, "href", e), I(i, "src", t), I(i, "alt", n), r;
		})() : (() => {
			var t = Ya();
			return I(t, "href", e), z(t, a), t;
		})()), I(l, "href", e), z(l, n), z(d, r), z(u, i, null), o;
	})();
}
function vs(e) {
	let [t] = T(async () => e.render(await Vr(e.id), e.words || []));
	return j(N, {
		get when() {
			return t();
		},
		get children() {
			return t();
		}
	});
}
async function ys(e) {
	let t = e.folderID ?? await Y(e.title), [n, r, i] = await Promise.all([
		J(t).catch(() => ""),
		Hr(t).catch(() => ""),
		Mt()
	]), a = await Q(n || r), o = e.recommend === !0 ? "👍" : e.recommend === !1 ? "👎" : "", s = [
		Z(e.startDate),
		e.contributors?.join(", "),
		`👁 ${i[t] || 0}`
	].filter(Boolean).join(" · ");
	return (() => {
		var n = Za(), r = n.firstChild, i = r.firstChild, c = r.nextSibling, l = c.nextSibling;
		return z(r, j(N, {
			when: o,
			get children() {
				var e = Xa();
				return z(e, o), e;
			}
		}), i), z(i, () => e.title), z(c, s), C((e) => {
			var n = X(t), r = q.parse(a);
			return n !== e.e && I(i, "href", e.e = n), r !== e.t && (l.innerHTML = e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function bs(e) {
	let t = () => e.meta, n = () => t().postTitle || t().postAuthor || t().postSubject || t().postTime || t().deleted === !0, r = () => t().commentQuote || t().commentSubject || t().commentTime || t().commentQuoteAuthor;
	return [j(N, {
		get when() {
			return n();
		},
		get children() {
			var e = no(), n = e.firstChild.nextSibling, r = n.firstChild, i = r.firstChild;
			return z(i, () => t().postAuthor || "Unknown User"), z(r, j(N, {
				get when() {
					return t().postTime;
				},
				get children() {
					var e = Qa();
					return z(e, () => t().postTime), e;
				}
			}), null), z(r, j(N, {
				get when() {
					return t().deleted === !0;
				},
				get children() {
					return $a();
				}
			}), null), z(n, j(N, {
				get when() {
					return t().postTitle;
				},
				get children() {
					var e = eo();
					return z(e, () => t().postTitle), e;
				}
			}), null), z(n, j(N, {
				get when() {
					return t().postSubject;
				},
				get children() {
					var e = to();
					return z(e, () => t().postSubject), e;
				}
			}), null), e;
		}
	}), j(N, {
		get when() {
			return r();
		},
		get children() {
			var e = oo(), n = e.firstChild.nextSibling, r = n.firstChild;
			return r.firstChild.firstChild.nextSibling.nextSibling, z(r, j(N, {
				get when() {
					return t().commentTime;
				},
				get children() {
					var e = ro();
					return z(e, () => t().commentTime), e;
				}
			}), null), z(n, j(N, {
				get when() {
					return t().commentQuote;
				},
				get children() {
					var e = io();
					return z(e, () => t().commentQuote), e;
				}
			}), null), z(n, j(N, {
				get when() {
					return t().commentSubject;
				},
				get children() {
					var e = ao();
					return z(e, () => t().commentSubject), e;
				}
			}), null), e;
		}
	})];
}
async function xs(e, t = []) {
	let n = e.folderID ?? await Y(e.title);
	return (() => {
		var r = so(), i = r.firstChild, a = i.firstChild, o = i.nextSibling;
		return z(a, () => $r(e.title || n, t)), z(o, j(bs, { meta: e })), C(() => I(a, "href", X(n))), r;
	})();
}
function Ss(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "reviews": return ys(e, t);
		case "steam comment": return xs(e, t);
		default: return Cs(e, t);
	}
}
async function Cs(e, t = []) {
	let n = await Y(e.title), r = (e.type || "").toLowerCase(), i = r.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), a = await Xr(e);
	a ||= await qr(e);
	let o = await Mt(), s = e.title;
	if (r === "photos") try {
		let e = await fetch(`/content/${n}/content.md`), t = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !t) {
			let t = (await e.text()).trim();
			t && (s = t);
		}
	} catch {}
	let c = i ? ` type-${i}` : "";
	return (() => {
		var i = co(), l = i.firstChild, u = l.nextSibling, d = u.firstChild, f = d.firstChild.firstChild, p = d.nextSibling, m = p.firstChild;
		return m.nextSibling, L(i, `Card fade-in${c}`), L(l, `CardImage${c}`), z(l, a), L(u, `CardTextArea${c}`), L(d, `CardLink${c}`), z(f, () => $r(s, t)), L(p, `CardText${c}`), z(m, (() => {
			var t = P(() => !!Qo.has(r));
			return () => t() ? Z(e.startDate) : [
				P(() => Z(e.startDate)),
				" – ",
				P(() => Wr(e.endDate))
			];
		})()), z(p, () => o[n], null), C(() => I(f, "href", X(n))), i;
	})();
}
async function ws(e) {
	let t = await Y(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await Mt(), a = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (a = t);
		}
	} catch {}
	let o = Qo.has(n) ? Z(e.startDate) : `${Z(e.startDate)} \u2013 ${Wr(e.endDate)}`;
	return {
		link: t,
		label: a,
		dates: o,
		views: i[t],
		t: r ? ` type-${r}` : ""
	};
}
async function Ts(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await ws(e), s = await Xr(e);
	return (() => {
		var e = lo(), c = e.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, L(e, `Compact fade-in${o}`), L(c, `CompactImage${o}`), z(c, s), L(l, `CompactText${o}`), L(u, `CompactTitle${o}`), z(d, () => $r(r, t)), L(f, `CompactMeta${o}`), z(p, i), z(f, a, null), C(() => I(d, "href", X(n))), e;
	})();
}
async function Es(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await ws(e);
	return (() => {
		var e = uo(), s = e.firstChild, c = s.nextSibling, l = c.firstChild;
		return l.nextSibling, L(e, `ListRow fade-in${o}`), z(s, () => $r(r, t)), z(l, i), z(c, a, null), C(() => I(s, "href", X(n))), e;
	})();
}
function Ds() {
	return fo();
}
async function Os(e) {
	let t = await e(), n = await Promise.all(t.map((e) => Vr(e).catch(() => null)));
	return Promise.all(n.filter(Boolean).map((e) => Cs(e)));
}
function ks() {
	let [e] = T(Pt), [t] = T(Ft), [n] = T(ri), [r] = T(() => Os(kt)), [i] = T(() => Os(Ot));
	return [po(), (() => {
		var a = mo(), o = a.firstChild.nextSibling.nextSibling, s = o.nextSibling;
		return z(a, j(Ls, { tabs: [{
			name: "The News",
			content: () => (() => {
				var t = ho();
				return z(t, j(M, {
					get each() {
						return e() || [];
					},
					children: (e) => _s({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: ei(e.created_at),
						views: e.views
					})
				})), t;
			})()
		}, {
			name: "Social Media",
			content: () => (() => {
				var e = ho();
				return z(e, j(M, {
					get each() {
						return r() || [];
					},
					children: (e) => e
				})), e;
			})()
		}] }), o), z(a, j(Ls, { tabs: [{
			name: "Navigation",
			content: () => (() => {
				var e = go();
				return z(e, j(M, {
					each: es,
					children: (e) => (() => {
						var t = _o(), n = t.firstChild, r = n.nextSibling;
						return z(n, () => e.name), z(r, j(M, {
							get each() {
								return e.tags;
							},
							children: (e) => (() => {
								var t = vo();
								return z(t, e), C(() => I(t, "href", la([e]))), t;
							})()
						})), t;
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
		}] }), s), z(a, j(Ls, { tabs: [{
			name: "Fan Videos",
			content: () => (() => {
				var e = ho();
				return z(e, j(M, {
					get each() {
						return i() || [];
					},
					children: (e) => e
				})), e;
			})()
		}, {
			name: "New Posts",
			content: () => (() => {
				var e = ho();
				return z(e, j(M, {
					get each() {
						return t() || [];
					},
					children: (e) => _s({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: ei(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}] }), null), a;
	})()];
}
function As() {
	return yo();
}
var js = [
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
	"RIP /cep-js/"
], Ms = {
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
function Ns() {
	let e = /* @__PURE__ */ new Date();
	return `"${Ms[`${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`] ?? js[Math.floor(Math.random() * js.length)]}"`;
}
function Ps(e) {
	e.style.fontSize = "";
	let t = parseFloat(getComputedStyle(e).fontSize);
	for (; e.scrollWidth > e.clientWidth && t > 8;) --t, e.style.fontSize = `${t}px`;
}
function Fs() {
	let e = Ns();
	return (() => {
		var t = bo();
		return R((e) => {
			let t = () => {
				if (!e.isConnected) return requestAnimationFrame(t);
				Ps(e), new ResizeObserver(() => Ps(e)).observe(e);
			};
			requestAnimationFrame(t);
		}, t), z(t, e), t;
	})();
}
function Is() {
	let e = ns.standard;
	try {
		let t = localStorage.getItem("cep-theme") || "standard", n = JSON.parse(localStorage.getItem("cep-theme-custom") || "null");
		e = t === "custom" && n?.["--logo"] ? n["--logo"] : ns[t] || ns.standard;
	} catch {}
	return (() => {
		var t = xo(), n = t.firstChild, r = n.firstChild;
		return z(t, Fs, n), I(r, "src", "/viewers/cep-js/assets/Logos/" + e), t;
	})();
}
function Ls(e) {
	let [t, n] = S(e.tabs[0].name);
	return [(() => {
		var r = Na();
		return z(r, j(M, {
			get each() {
				return e.tabs;
			},
			children: (e) => (() => {
				var r = So();
				return r.$$click = () => n(e.name), z(r, () => e.name), C((n) => {
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
			var n = Co();
			return z(n, () => e.content()), C((r) => Xe(n, "display", t() === e.name ? "" : "none")), n;
		})()
	})];
}
function Rs(e) {
	for (let t = e.length - 1; t > 0; t--) {
		let n = Math.floor(Math.random() * (t + 1));
		[e[t], e[n]] = [e[n], e[t]];
	}
	return e;
}
function zs() {
	let [e, t] = S(Jr("sRandomTab", "Articles", (e) => Object.hasOwn($o, e))), n = {};
	for (let e of Object.keys($o)) {
		let [t, r] = S([]), [i, a] = S(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([Nt(), Mt()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = $o[e], [i, o] = await a(), s = Rs(Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e)), c = 0;
		for (let e = 0; e < s.length && c < ts; e += 20) {
			let n = await Promise.all(s.slice(e, e + 20).map((e) => Vr(e).catch(() => null))), r = [];
			for (let t = 0; t < n.length && c < ts; t++) n[t] && (r.push({
				id: s[e + t],
				meta: n[t]
			}), c++);
			await Promise.all(r.map(async ({ id: e, meta: n }) => {
				let r = await Cs(n), i = o[e];
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
		Yr("sRandomTab", t), E(() => o(t));
	}), [
		wo(),
		(() => {
			var n = Na();
			return z(n, j(M, {
				get each() {
					return Object.keys($o);
				},
				children: (n) => (() => {
					var r = So();
					return r.$$click = () => t(n), z(r, n), C((t) => {
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
			var e = Do();
			return z(e, j(M, {
				get each() {
					return r().entries();
				},
				children: (e) => e.card
			}), null), z(e, j(N, {
				get when() {
					return P(() => !r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return To();
				}
			}), null), z(e, j(N, {
				get when() {
					return P(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return Eo();
				}
			}), null), e;
		})()
	];
}
function Bs(e) {
	return j(N, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = Oo(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
			return z(n, () => e.title, r), z(i, j(M, {
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
function Vs(e) {
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
function Hs(e) {
	let t = () => Vs(e.url);
	return j(N, {
		get when() {
			return t();
		},
		get children() {
			var e = Mo();
			return z(e, j(je, { get children() {
				return [
					j(Me, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = ko();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = Ao();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = jo();
							return z(e, () => t().src), C(() => I(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function Us(e) {
	let [t] = T(async () => Gr(await Y(e.pageThumbnailFile))), [n] = T(() => ni(e)), [r] = T(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([J(t).catch(() => ""), Hr(t).catch(() => "")]);
		return {
			md: await Q(n),
			old: await Q(r)
		};
	});
	return [
		(() => {
			var t = No();
			return z(t, () => e.title), t;
		})(),
		j(ms, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var t = Io(), n = t.firstChild;
			return n.firstChild, z(t, j(Hs, { get url() {
				return e.pageThumbnailVideo;
			} }), n), z(n, j(N, {
				get when() {
					return !r.loading;
				},
				get fallback() {
					return To();
				},
				get children() {
					return j(N, {
						get when() {
							return r()?.md || r()?.old;
						},
						get fallback() {
							return Lo();
						},
						get children() {
							return [j(N, {
								get when() {
									return P(() => !r().md)() && r().old;
								},
								get children() {
									return Po();
								}
							}), (() => {
								var e = Fo();
								return C(() => e.innerHTML = q.parse(r().md || r().old)), e;
							})()];
						}
					});
				}
			}), null), z(t, j(fs, { get citations() {
				return e.citations;
			} }), null), z(t, j(ps, { get folderID() {
				return e.folderID;
			} }), null), t;
		})()
	];
}
async function Ws(e) {
	let { link: t, dates: n, views: r } = await ws(e);
	return (() => {
		var i = Ro(), a = i.firstChild, o = a.firstChild, s = a.nextSibling, c = s.firstChild;
		return c.nextSibling, I(o, "src", `/content/${t}/photo.avif`), z(c, n), z(s, r || 0, null), C((n) => {
			var r = X(t), i = e.title;
			return r !== n.e && I(a, "href", n.e = r), i !== n.t && I(o, "alt", n.t = i), n;
		}, {
			e: void 0,
			t: void 0
		}), i;
	})();
}
async function Gs(e) {
	let t = e.folderID ?? await Y(e.title);
	return (() => {
		var n = zo(), r = n.firstChild, i = r.firstChild;
		return I(i, "src", `/content/${t}/photo.avif`), C((n) => {
			var a = X(t), o = e.title;
			return a !== n.e && I(r, "href", n.e = a), o !== n.t && I(i, "alt", n.t = o), n;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function Ks(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return Ws(e);
		default: return Ts(e, t);
	}
}
function qs(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return Gs(e);
		default: return Es(e, t);
	}
}
function Js(e) {
	let [t] = T(() => Xr(e)), [n] = T(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([J(t).catch(() => ""), Hr(t).catch(() => "")]);
		return {
			md: await Q(n),
			old: await Q(r)
		};
	});
	return [
		(() => {
			var t = No();
			return z(t, () => e.title), t;
		})(),
		j(ms, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var r = Bo(), i = r.firstChild, a = i.nextSibling;
			return a.firstChild, z(i, j(N, {
				get when() {
					return P(() => !t.loading)() && t();
				},
				get children() {
					return t();
				}
			})), z(a, j(N, {
				get when() {
					return !n.loading;
				},
				get fallback() {
					return To();
				},
				get children() {
					return j(N, {
						get when() {
							return n()?.md || n()?.old;
						},
						get fallback() {
							return Vo();
						},
						get children() {
							return [j(N, {
								get when() {
									return P(() => !n().md)() && n().old;
								},
								get children() {
									return Po();
								}
							}), (() => {
								var e = Fo();
								return C(() => e.innerHTML = q.parse(n().md || n().old)), e;
							})()];
						}
					});
				}
			}), null), z(r, j(fs, { get citations() {
				return e.citations;
			} }), null), z(r, j(ps, { get folderID() {
				return e.folderID;
			} }), null), r;
		})()
	];
}
function Ys(e) {
	let [t] = T(async () => Gr(await Y(e.pageThumbnailFile))), [n] = T(() => ni(e)), [r] = T(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([J(t).catch(() => ""), Hr(t).catch(() => "")]);
		return {
			md: await Q(n),
			old: await Q(r)
		};
	});
	return [
		(() => {
			var t = No();
			return z(t, () => e.title), t;
		})(),
		j(hs, {
			meta: e,
			get children() {
				var i = Wo(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
				return z(o, j(N, {
					get when() {
						return P(() => !t.loading)() && t();
					},
					get children() {
						return t();
					}
				})), z(c, () => Z(e.startDate), l), z(c, () => Wr(e.endDate), u), z(s, j(N, {
					get when() {
						return e.sqft;
					},
					get children() {
						var t = Ho(), n = t.firstChild.nextSibling, r = n.firstChild;
						return z(n, () => e.sqft, r), t;
					}
				}), null), z(a, j(Bs, {
					title: "Remodels",
					get items() {
						return e.remodels;
					},
					children: (e) => (() => {
						var t = Go(), n = t.firstChild, r = n.nextSibling.nextSibling;
						return r.nextSibling, z(n, () => e.n), z(t, () => Z(e.s), r), t;
					})()
				}), null), z(a, j(Bs, {
					title: "Stages",
					get items() {
						return e.stages;
					},
					children: (e) => (() => {
						var t = qo(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
						return i.nextSibling, z(n, () => e.n), z(t, () => Z(e.s), r), z(t, () => Wr(e.e), i), z(t, j(N, {
							get when() {
								return e.desc;
							},
							get children() {
								var t = Ko();
								return z(t, () => e.desc), t;
							}
						}), null), t;
					})()
				}), null), z(a, j(Bs, {
					title: "Franchisees",
					get items() {
						return e.franchisees;
					},
					children: (e) => (() => {
						var t = qo(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
						return i.nextSibling, z(n, () => e.n), z(t, () => Z(e.s), r), z(t, () => Wr(e.e), i), t;
					})()
				}), null), z(a, j(Bs, {
					title: "Downloads",
					get items() {
						return e.downloadLinks;
					},
					children: (e) => (() => {
						var t = Jo(), n = t.firstChild;
						return z(n, () => e.label), C(() => I(n, "href", e.url)), t;
					})()
				}), null), z(a, j(Bs, {
					title: "Showtape Formats",
					get items() {
						return e.showtapeFormats;
					},
					children: (e) => (() => {
						var t = Yo();
						return z(t, e), t;
					})()
				}), null), z(a, j(N, {
					get when() {
						return e.credits?.length;
					},
					get children() {
						var t = Uo(), n = t.firstChild.nextSibling;
						return z(n, j(M, {
							get each() {
								return e.credits;
							},
							children: (e) => (() => {
								var t = Xo(), n = t.firstChild, r = n.firstChild;
								return n.nextSibling, z(n, () => e.role, r), z(t, () => e.n, null), t;
							})()
						})), t;
					}
				}), null), z(a, j(N, {
					get when() {
						return P(() => !n.loading)() && n();
					},
					get children() {
						return n();
					}
				}), null), z(d, j(N, {
					get when() {
						return !r.loading;
					},
					get fallback() {
						return To();
					},
					get children() {
						return j(N, {
							get when() {
								return r()?.md || r()?.old;
							},
							get fallback() {
								return Zo();
							},
							get children() {
								return [j(N, {
									get when() {
										return P(() => !r().md)() && r().old;
									},
									get children() {
										return Po();
									}
								}), (() => {
									var e = Fo();
									return C(() => e.innerHTML = q.parse(r().md || r().old)), e;
								})()];
							}
						});
					}
				})), z(i, j(fs, { get citations() {
					return e.citations;
				} }), null), i;
			}
		}),
		j(ps, { get folderID() {
			return e.folderID;
		} })
	];
}
We(["click"]);
//#endregion
//#region src/App.jsx
var Xs = /*#__PURE__*/ F("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), Zs = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), Qs = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), $s = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), ec = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), tc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), nc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function rc(e) {
	return [
		Xs(),
		Zs(),
		Qs(),
		$s(),
		ec(),
		tc(),
		nc(),
		P(Is),
		P(() => P(() => e.type === "search")() ? ja() : gs(e)),
		P(zs),
		P(As)
	];
}
//#endregion
//#region index.jsx
var ic = /^[a-z0-9]{8,32}$/;
function ac(e) {
	ic.test(e) && fetch(`/track?p=${encodeURIComponent(e)}`).catch(() => {});
}
async function oc(e, t) {
	if (e.get("page") === "search") {
		Ue(() => rc({ type: "search" }), t);
		return;
	}
	let n = (e.get("") || "").replace(/^\/+|\/+$/g, ""), r = await Vr(n);
	Ue(() => rc(r), t), ac(n);
}
//#endregion
export { oc as render };
