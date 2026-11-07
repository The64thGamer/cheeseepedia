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
		n.has(i) || (n.add(i), t.addEventListener(i, at));
	}
}
function I(e, t, n) {
	tt(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ge(e, t, n, r) {
	tt(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function Ke(e, t, n) {
	tt(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function L(e, t) {
	tt(e) || (t == null ? e.removeAttribute("class") : e.className = t);
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
		r && r !== "undefined" && !t[r] && (rt(e, r, !1), delete n[r]);
	}
	for (a = 0, o = r.length; a < o; a++) {
		let i = r[a], o = !!t[i];
		i && i !== "undefined" && n[i] !== o && o && (rt(e, i, !0), n[i] = o);
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
	return r || C(() => i.children = ot(e, t.children, i.children)), C(() => typeof t.ref == "function" && Qe(t.ref, e)), C(() => $e(e, t, n, !0, i, !0)), i;
}
function Qe(e, t, n) {
	return E(() => e(t, n));
}
function R(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return ot(e, t, r, n);
	C((r) => ot(e, t(), r, n), r);
}
function $e(e, t, n, r, i = {}, a = !1) {
	t ||= {};
	for (let r in i) if (!(r in t)) {
		if (r === "children") continue;
		i[r] = it(e, r, null, i[r], n, a, t);
	}
	for (let o in t) {
		if (o === "children") {
			r || ot(e, t.children);
			continue;
		}
		let s = t[o];
		i[o] = it(e, o, s, i[o], n, a, t);
	}
}
function et(e) {
	let n, r;
	return !tt() || !(n = t.registry.get(r = ut())) ? e() : (t.completed && t.completed.add(n), t.registry.delete(r), n);
}
function tt(e) {
	return !!t.context && !t.done && (!e || e.isConnected);
}
function nt(e) {
	return e.toLowerCase().replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function rt(e, t, n) {
	let r = t.trim().split(/\s+/);
	for (let t = 0, i = r.length; t < i; t++) e.classList.toggle(r[t], n);
}
function it(e, t, n, r, i, a, o) {
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
		else if (tt(e)) return n;
		t === "class" || t === "className" ? L(e, n) : s && !c && !l ? e[nt(t)] = n : (t === "value" || t === "defaultValue") && (e.nodeName === "INPUT" || e.nodeName === "TEXTAREA") ? e[u || t] = n ?? "" : e[u || t] = n;
	} else {
		let r = i && t.indexOf(":") > -1 && Be[t.split(":")[0]];
		r ? Ge(e, r, t, n) : I(e, Fe[t] || t, n);
	}
	return n;
}
function at(e) {
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
function ot(e, t, n, r, i) {
	let a = tt(e);
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
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = lt(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = lt(e, n, r);
	} else if (o === "function") return C(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = ot(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (st(o, t, n, i)) return C(() => n = ot(e, o, n, r, !0)), () => n;
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
			if (n = lt(e, n, r), s) return n;
		} else c ? n.length === 0 ? ct(e, o, r) : Ve(e, n, o) : (n && lt(e), ct(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = lt(e, n, r, t);
			lt(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function st(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = st(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = st(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function ct(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function lt(e, t, n, r) {
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
function ut() {
	return t.getNextContextId();
}
var dt = "http://www.w3.org/2000/svg";
function ft(e, t = !1, n = void 0) {
	return t ? document.createElementNS(dt, e) : document.createElement(e, { is: n });
}
function pt(e, n) {
	let r = w(e);
	return w(() => {
		let e = r();
		switch (typeof e) {
			case "function": return E(() => e(n));
			case "string":
				let r = ze.has(e), i = t.context ? et() : ft(e, r, E(() => n.is));
				return Ze(i, n, r), i;
		}
	});
}
function mt(e) {
	let [, t] = ke(e, ["component"]);
	return pt(() => e.component, t);
}
//#endregion
//#region src/GlobalJsonCache.jsx
var ht = /* @__PURE__ */ new Map();
function z(e) {
	if (!ht.has(e)) {
		let t = fetch(e).then((e) => e.json()).catch((t) => {
			throw ht.delete(e), t;
		});
		ht.set(e, t);
	}
	return ht.get(e);
}
var B = "/viewers/cep-solid/compiled-json/", gt = "/viewers/cep-solid/permanent-json/", _t = "/viewers/cep-js/compiled-json/", vt = () => z(`${B}folderIDToTags.json`), yt = () => z(`${B}taggedByIDs.json`), bt = () => z(`${B}sortKeys.json`), xt = () => z(`${B}recentfanvideos.json`), St = () => z(`${B}recentofficialvideos.json`), Ct = () => z(`${B}titleToFolderIDMap.json`), wt = () => z(`${B}folderIDToTitleMap.json`), Tt = () => z(`${B}typeToIDList.json`), Et = () => z(`${_t}views.json`), Dt = () => z(`${_t}DiscourseNews.json`), Ot = () => z(`${_t}DiscourseRecent.json`), kt = () => z(`${gt}user-submissions.json`);
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function At() {
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
var jt = At();
function Mt(e) {
	jt = e;
}
var Nt = { exec: () => null };
function Pt(e) {
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
var Ft = ((e = "") => {
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
	nextBulletRegex: Pt((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: Pt((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: Pt((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: Pt((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: Pt((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: Pt((e) => RegExp(`^ {0,${e}}>`))
}, It = /^(?:[ \t]*(?:\n|$))+/, Lt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Rt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, zt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Bt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Vt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ht = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ut = V(Ht).replace(/bull/g, Vt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Wt = V(Ht).replace(/bull/g, Vt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Gt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Kt = /^[^\n]+/, qt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Jt = V(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Yt = V(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Vt).getRegex(), Xt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Zt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Qt = V("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Zt).replace("tag", Xt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), $t = (e) => V(Gt).replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex(), en = $t(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), tn = $t(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), nn = {
	blockquote: V(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", tn).getRegex(),
	code: Lt,
	def: Jt,
	fences: Rt,
	heading: Bt,
	hr: zt,
	html: Qt,
	lheading: Ut,
	list: Yt,
	newline: It,
	paragraph: en,
	table: Nt,
	text: Kt
}, rn = V("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex(), an = {
	...nn,
	lheading: Wt,
	table: rn,
	paragraph: V(Gt).replace("hr", zt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", rn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex()
}, on = {
	...nn,
	html: V("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", Zt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: Nt,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: V(Gt).replace("hr", zt).replace("heading", " *#{1,6} *[^\n]").replace("lheading", Ut).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, sn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, cn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ln = /^( {2,}|\\)\n(?!\s*$)/, un = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, U = /[\p{P}\p{S}]/u, dn = /[\s\p{P}\p{S}]/u, fn = /[^\s\p{P}\p{S}]/u, pn = V(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, dn).getRegex(), mn = /[\p{Pi}\p{Ps}"']/u, hn = /(?!~)[\p{P}\p{S}]/u, gn = /(?!~)[\s\p{P}\p{S}]/u, _n = /(?:[^\s\p{P}\p{S}]|~)/u, vn = V(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ft ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), yn = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, bn = V(yn, "u").replace(/punct/g, U).getRegex(), xn = V(yn, "u").replace(/punct/g, hn).getRegex(), Sn = V(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, mn).replace(/punct/g, U).getRegex(), Cn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wn = V(Cn, "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, dn).replace(/punct/g, U).getRegex(), Tn = V(Cn, "gu").replace(/notPunctSpace/g, _n).replace(/punctSpace/g, gn).replace(/punct/g, hn).getRegex(), En = V("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, dn).replace(/punct/g, U).getRegex(), Dn = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, dn).replace(/punct/g, U).getRegex(), On = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, dn).replace(/punct/g, U).getRegex(), kn = V(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, U).getRegex(), An = V("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, dn).replace(/punct/g, U).getRegex(), jn = V(/\\(punct)/, "gu").replace(/punct/g, U).getRegex(), Mn = V(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Nn = V(Zt).replace("(?:-->|$)", "-->").getRegex(), Pn = V("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Nn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Fn = V(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), In = V(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Fn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ln = V(/^!?\[(label)\]\[(ref)\]/).replace("label", Fn).replace("ref", qt).getRegex(), Rn = V(/^!?\[(ref)\](?:\[\])?/).replace("ref", qt).getRegex(), zn = V("reflink|nolink(?!\\()", "g").replace("reflink", Ln).replace("nolink", Rn).getRegex(), Bn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Vn = {
	_backpedal: Nt,
	anyPunctuation: jn,
	autolink: Mn,
	blockSkip: vn,
	br: ln,
	code: cn,
	del: Nt,
	delLDelim: Nt,
	delRDelim: Nt,
	emStrongLDelim: bn,
	emStrongRDelimAst: wn,
	emStrongRDelimUnd: Dn,
	escape: sn,
	link: In,
	nolink: Rn,
	punctuation: pn,
	reflink: Ln,
	reflinkSearch: zn,
	tag: Pn,
	text: un,
	url: Nt
}, Hn = {
	...Vn,
	emStrongLDelim: Sn,
	emStrongRDelimAst: En,
	emStrongRDelimUnd: On,
	link: V(/^!?\[(label)\]\((.*?)\)/).replace("label", Fn).getRegex(),
	reflink: V(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Fn).getRegex()
}, Un = {
	...Vn,
	emStrongRDelimAst: Tn,
	emStrongLDelim: xn,
	delLDelim: kn,
	delRDelim: An,
	url: V(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Bn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: V(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Bn).getRegex()
}, Wn = {
	...Un,
	br: V(ln).replace("{2,}", "*").getRegex(),
	text: V(Un.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Gn = {
	normal: nn,
	gfm: an,
	pedantic: on
}, Kn = {
	normal: Vn,
	gfm: Un,
	breaks: Wn,
	pedantic: Hn
}, qn = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Jn = (e) => qn[e];
function W(e, t) {
	if (t) {
		if (H.escapeTest.test(e)) return e.replace(H.escapeReplace, Jn);
	} else if (H.escapeTestNoEncode.test(e)) return e.replace(H.escapeReplaceNoEncode, Jn);
	return e;
}
function Yn(e) {
	try {
		e = encodeURI(e).replace(H.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Xn(e, t) {
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
function Zn(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && H.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function Qn(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function $n(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function er(e, t, n, r, i) {
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
function tr(e, t, n) {
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
var nr = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || jt;
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
			let e = this.options.pedantic ? t[0] : Zn(t[0]);
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
			let e = t[0], n = tr(e, t[3] || "", this.rules);
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
				let c = $n(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = Zn(t[0]);
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
		let n = Xn(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
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
			for (let e of i) a.rows.push(Xn(e, a.header.length).map((e, t) => ({
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
				let e = Qn(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), er(t, {
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
			return er(n, e, n[0], this.lexer, this.rules);
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
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || jt, this.options.tokenizer = this.options.tokenizer || new nr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: H,
			block: Gn.normal,
			inline: Kn.normal
		};
		this.options.pedantic ? (t.block = Gn.pedantic, t.inline = Kn.pedantic) : this.options.gfm && (t.block = Gn.gfm, t.inline = this.options.breaks ? Kn.breaks : Kn.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Gn,
			inline: Kn
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
}, rr = class {
	options;
	parser;
	constructor(e) {
		this.options = e || jt;
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
		let a = i ? W(n, !0) : this.parser.parseInline(r), o = Yn(e);
		if (o === null) return a;
		e = W(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + W(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Yn(e);
		if (i === null) return W(n);
		e = i;
		let a = `<img src="${W(e)}" alt="${W(n)}"`;
		return t && (a += ` title="${W(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : W(e.text);
	}
}, ir = class {
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
		this.options = e || jt, this.options.renderer = this.options.renderer || new rr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ir();
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
}, ar = class {
	options;
	block;
	constructor(e) {
		this.options = e || jt;
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
}, or = new class {
	defaults = At();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = q;
	Renderer = rr;
	TextRenderer = ir;
	Lexer = K;
	Tokenizer = nr;
	Hooks = ar;
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
				let t = this.defaults.renderer || new rr(this.defaults);
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
				let t = this.defaults.tokenizer || new nr(this.defaults);
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
				let t = this.defaults.hooks || new ar();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = ar.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && ar.passThroughHooksRespectAsync.has(n)) return (async () => {
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
function J(e, t) {
	return or.parse(e, t);
}
J.options = J.setOptions = function(e) {
	return or.setOptions(e), J.defaults = or.defaults, Mt(J.defaults), J;
}, J.getDefaults = At, J.defaults = jt;
function sr(...e) {
	return or.use(...e), J.defaults = or.defaults, Mt(J.defaults), J;
}
J.use = sr, J.walkTokens = function(e, t) {
	return or.walkTokens(e, t);
}, J.parseInline = or.parseInline, J.Parser = q, J.parser = q.parse, J.Renderer = rr, J.TextRenderer = ir, J.Lexer = K, J.lexer = K.lex, J.Tokenizer = nr, J.Hooks = ar, J.parse = J, J.options, J.setOptions, J.walkTokens, J.parseInline, q.parse, K.lex;
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
var Er = /*#__PURE__*/ F("<a><img alt loading=lazy class>", !0, !1, !1), Dr = /*#__PURE__*/ F("<a class=CardImageExcerpt>Error?"), Or = /*#__PURE__*/ F("<a class=CardImageExcerpt>No Article Content. Come write some!"), kr = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), Ar = /*#__PURE__*/ F("<a><img loading=lazy class>", !0, !1, !1), jr = /*#__PURE__*/ F("<mark>"), Mr = /*#__PURE__*/ F("<div class=\"MapContainer fade-in\">"), Nr = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), Pr = [
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
async function Fr(e) {
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
async function Y(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Ir(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function X(e) {
	return (await Ct())[e] ?? null;
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
	let s = a ? Pr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function Rr(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Pr[a] : "", c = o ? String(o) : "";
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
	let r = await Y(n) || await Ir(n);
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
	let r = "", [i, a] = await Promise.all([Y(t).catch(() => ""), Ir(t).catch(() => "")]), o = await Xr(i || a || "");
	return r = (new DOMParser().parseFromString(J.parse(o), "text/html").body.textContent || "").trim(), (() => {
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
var Gr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Kr(e, t) {
	let n = (e || "").replace(/[‘’]/g, "'"), r = [...new Set((t || []).filter((e) => e.length > 1))].sort((e, t) => t.length - e.length);
	if (!r.length || !n) return [{
		text: n,
		hit: !1
	}];
	let i = RegExp(`(${r.map(Gr).join("|")})`, "gi");
	return n.split(i).map((e, t) => ({
		text: e,
		hit: t % 2 == 1
	})).filter((e) => e.text);
}
function qr(e, t) {
	return !t || !t.length ? e : Kr(e, t).map((e) => e.hit ? (() => {
		var t = jr();
		return R(t, () => e.text), t;
	})() : e.text);
}
function Jr(e) {
	return new Date(e).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function Yr(e) {
	return (() => {
		var t = Mr();
		return Qe((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function Xr(e) {
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
async function Zr(e) {
	if (!Nr.has((e?.type || "").toLowerCase())) return null;
	let t = await X(e?.title);
	if (!t) return null;
	let n = (await wr()).find((e) => e.p === t);
	return n ? Yr((e) => Tr(e, [n], { single: !0 })) : null;
}
async function Qr() {
	let e = await wr();
	return e.length ? Yr((t) => Tr(t, e)) : null;
}
//#endregion
//#region src/SearchPage.jsx
var $r = /*#__PURE__*/ F("<mark>"), ei = /*#__PURE__*/ F("<img alt loading=lazy>", !0, !1, !1), ti = /*#__PURE__*/ F("<button type=button class=\"ResultTag ResultTagMore\">. . ."), ni = /*#__PURE__*/ F("<div class=ResultTags>"), ri = /*#__PURE__*/ F("<a class=ResultTag>"), ii = /*#__PURE__*/ F("<strong>"), ai = /*#__PURE__*/ F("<span class=ResultTime>"), oi = /*#__PURE__*/ F("<div class=ResultSummary>"), si = /*#__PURE__*/ F("<div class=\"Result ResultList fade-in\"><div class=ResultThumb><a></a></div><div class=ResultBody><div class=ResultTitle><a></a></div><div class=ResultDates>"), ci = /*#__PURE__*/ F("<div>"), li = /*#__PURE__*/ F("<button type=button class=PinButton>Prev"), ui = /*#__PURE__*/ F("<button type=button class=PinButton>Next"), di = /*#__PURE__*/ F("<div class=SearchPager>"), fi = /*#__PURE__*/ F("<span>…"), pi = /*#__PURE__*/ F("<button type=button class=PinButton>"), mi = /*#__PURE__*/ F("<ul class=SearchSuggestions>"), hi = /*#__PURE__*/ F("<div class=SearchBar><div class=SearchBarField><input class=SearchInput type=text autocomplete=off></div><button type=button class=SearchButton>Search"), gi = /*#__PURE__*/ F("<span class=SearchChip><button type=button class=SearchChipRemove>×"), _i = /*#__PURE__*/ F("<li class=SearchSuggestion> <span class=SearchCount>"), vi = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">Nothing found."), yi = /*#__PURE__*/ F("<div class=SearchLayout><aside class=SearchSidebar><div class=SearchFilterGroup><label>Sort: <select id=sSort></select></label><label>Display: <select id=sResultView></select></label></div><div class=\"SearchFilterGroup SearchTypeGroup\"></div></aside><main class=SearchResults><div class=SearchStatus>"), bi = /*#__PURE__*/ F("<div class=SearchPage>"), xi = /*#__PURE__*/ F("<div class=SearchStatus>Loading search…"), Si = /*#__PURE__*/ F("<option>"), Ci = /*#__PURE__*/ F("<li>…"), wi = /*#__PURE__*/ F("<ul class=SearchTypePreview>"), Ti = /*#__PURE__*/ F("<div class=SearchTypeFilter><button type=button class=SearchTypeButton> (<!>)"), Ei = /*#__PURE__*/ F("<li>"), Di = "/viewers/cep-solid/compiled-json/search.sqlite", Oi = "/viewers/cep-solid/compiled-json/sqlite.worker.js", ki = "/viewers/cep-solid/compiled-json/sql-wasm.wasm", Ai = 1024, ji = 3e3, Mi = 24, Ni = 8, Pi = 5, Fi = 200, Ii = .5, Li = [
	["relevancy", "Relevancy"],
	["oldest", "Oldest → Newest"],
	["newest", "Newest → Oldest"],
	["newest-updated", "Recently Updated"],
	["oldest-updated", "Least Recently Updated"],
	["most-views", "Most Views"],
	["least-views", "Least Views"]
], Ri = Li.map(([e]) => e), zi = "var(--primary)", Bi = Object.fromEntries(Object.entries({
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
}).flatMap(([e, t]) => t.map((t) => [t, e]))), Vi = (e) => Bi[(e || "").toLowerCase()] || zi, Hi = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"theories",
	"meta",
	"transcriptions"
]), Ui = null, Wi = null, Gi = null, Ki = /* @__PURE__ */ new Map();
async function qi() {
	return Ui ||= await (await fetch("/viewers/cep-solid/compiled-json/tags.json")).json(), Ui;
}
var Ji = (e) => (e || "").toLowerCase().replace(/[‘’]/g, "'"), Yi = (e) => e.replace(/\b\w/g, (e) => e.toUpperCase()), Xi = (e) => `'${e.replace(/'/g, "''")}'`, $ = (...e) => console.log("[search-debug]", ...e);
async function Zi(e, t, n) {
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
async function Qi(e, t) {
	let n = Xi(t), r = [
		["sqlite version", "SELECT sqlite_version() AS v"],
		["chunk row count", "SELECT count(*) AS n FROM chunks"],
		["match only", `SELECT folder FROM chunks WHERE chunks MATCH ${n} LIMIT 3`],
		["match + rank", `SELECT folder, rank FROM chunks WHERE chunks MATCH ${n} ORDER BY rank LIMIT 3`],
		["match + snippet", `SELECT folder, snippet(chunks, 0, char(1), char(2), '…', ${Mi}) AS found FROM chunks WHERE chunks MATCH ${n} LIMIT 3`]
	];
	$("fts match string:", t);
	for (let [t, n] of r) try {
		$(t, await e.db.query(n));
	} catch (e) {
		$(t, "FAILED", e?.message || e);
	}
}
function $i(e) {
	return [...(e || "").matchAll(/"([^"]*)"|(\S+)/g)].map((e) => Ji(e[1] ?? e[2]).trim()).filter(Boolean);
}
function ea(e, t = "phrase") {
	let n = (e) => Ji(e).replace(/"/g, "").replace(/\s+/g, " ").trim();
	if (t === "phrase") {
		if ((e || "").includes("\"")) return $i(e).map(n).filter(Boolean).map((e) => `"${e}" *`).join(" ");
		let t = n(e);
		return t ? `"${t}" *` : "";
	}
	return $i(e).flatMap((e) => e.split(/\s+/)).map(n).filter(Boolean).map((e) => `"${e}" *`).join(t === "or" ? " OR " : " ");
}
function ta(e) {
	let t = `  ${e}  `, n = /* @__PURE__ */ new Set();
	for (let e = 0; e < t.length - 2; e++) n.add(t.slice(e, e + 3));
	return n;
}
function na(e, t) {
	let [n, r] = e.size <= t.size ? [e, t] : [t, e], i = 0;
	for (let e of n) r.has(e) && i++;
	return 2 * i / (e.size + t.size);
}
function ra(e) {
	return (e || "").split(/(\u0001[^\u0002]*\u0002)/).map((e) => e.startsWith("") ? {
		text: e.slice(1, -1),
		hit: !0
	} : {
		text: e,
		hit: !1
	}).filter((e) => e.text);
}
function ia(e = [], t = "") {
	let n = new URLSearchParams({
		v: Lr(),
		page: "search"
	});
	return e.length && n.set("tags", e.join("|")), t && n.set("q", t), `/?${n.toString()}`;
}
function aa() {
	let e = new URLSearchParams(location.search);
	return {
		tags: (e.get("tags") || "").split("|").map((e) => e.trim()).filter(Boolean),
		q: (e.get("q") || "").trim()
	};
}
function oa() {
	return Wi ||= Promise.all([
		qi(),
		vt(),
		Tt(),
		Et(),
		wt(),
		bt(),
		Ct()
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
	}), Wi;
}
function sa() {
	if (!Gi) {
		let t = new URL(Di, location.origin).href, n = new URL(Oi, location.origin).href, r = new URL(ki, location.origin).href;
		Zi(t, n, r), Gi = import("./dist-DRMIypK3.js").then((t) => /* @__PURE__ */ e(t.default, 1)).then(({ createDbWorker: e }) => e([{
			from: "inline",
			config: {
				serverMode: "full",
				requestChunkSize: Ai,
				url: t
			}
		}], n, r)).then((e) => ($("search.sqlite worker", e ? "opened" : "missing"), e)).catch((e) => (console.error("Search: failed to open search.sqlite", e), $("open failed", e?.name, e?.message, e?.stack), Gi = null, null));
	}
	return Gi;
}
async function ca(e, t) {
	try {
		let n = await e.db.query(`SELECT folder, ts, snippet(chunks, 0, char(1), char(2), '…', ${Mi}) AS found FROM chunks WHERE chunks MATCH ${Xi(t)} ORDER BY rank LIMIT ${ji}`), r = /* @__PURE__ */ new Set(), i = [];
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
async function la(e) {
	let t = $i(e);
	if (!t.length) return [];
	let n = await sa();
	if (!n) return [];
	await Qi(n, ea(e));
	let r = await ca(n, ea(e));
	if (r.length || t.length < 2) return r;
	let i = await ca(n, ea(e, "and"));
	return i.length ? i : ca(n, ea(e, "or"));
}
function ua(e, t) {
	let n = $i(e);
	if (!n.length) return [];
	t.titleIndex ||= Object.entries(t.idTitle).map(([e, t]) => {
		let n = Ji(t);
		return [
			e,
			n,
			ta(n)
		];
	});
	let r = n.join(" "), i = ta(r), a = [];
	for (let [e, o, s] of t.titleIndex) {
		let t = 0;
		if (n.every((e) => o.includes(e))) t = 2 + +(o === r) + (o.startsWith(r) ? .5 : 0);
		else {
			let e = na(i, s);
			e >= Ii && (t = e);
		}
		t && a.push({
			id: e,
			score: t
		});
	}
	return a;
}
async function da({ tags: e, q: t }, n) {
	let r = null;
	e.length && (r = [...new Set(e.flatMap((e) => n.tagMap[n.tagLookup[e.toLowerCase()]] || []))]);
	let i = t.trim();
	if (!i) return (r ?? n.allIds).map((e) => ({
		id: e,
		score: n.views[e] || 0,
		found: null
	})).sort((e, t) => t.score - e.score);
	let [a, o] = await Promise.all([la(i), ua(i, n)]);
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
function fa(e) {
	return Ki.has(e) || Ki.set(e, Fr(e).catch(() => ({
		type: "notfound",
		folderID: e
	}))), Ki.get(e);
}
async function pa(e) {
	let [t, n] = await Promise.all([Y(e).catch(() => ""), Ir(e).catch(() => "")]), r = (t || n || "").replace(/\{\d+:\d\d(?::\d\d)?\}/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[\[\]#*_`>]/g, "").replace(/\s+/g, " ").trim();
	return r ? r.length <= Fi ? r : `${r.slice(0, r.slice(0, Fi).lastIndexOf(" "))}…` : "";
}
function ma(e, t, n) {
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
function ha(e) {
	return P(() => qr(e.text, e.words));
}
function ga(e) {
	return j(M, {
		get each() {
			return ra(e.text);
		},
		children: (e) => e.hit ? (() => {
			var t = $r();
			return R(t, () => e.text), t;
		})() : e.text
	});
}
function _a(e) {
	return (() => {
		var t = ei();
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
function va(e) {
	let [t, n] = S(!1), r = () => t() ? e.tags : e.tags.slice(0, Pi), i = () => new Set((e.active || []).map((e) => e.toLowerCase()));
	return j(N, {
		get when() {
			return e.tags?.length;
		},
		get children() {
			var a = ni();
			return R(a, j(M, {
				get each() {
					return r();
				},
				children: (e) => (() => {
					var t = ri();
					return R(t, e), C((n) => {
						var r = !!i().has(e.toLowerCase()), a = ia([e]);
						return r !== n.e && t.classList.toggle("active", n.e = r), a !== n.t && I(t, "href", n.t = a), n;
					}, {
						e: void 0,
						t: void 0
					}), t;
				})()
			}), null), R(a, j(N, {
				get when() {
					return P(() => !t())() && e.tags.length > Pi;
				},
				get children() {
					var e = ti();
					return e.$$click = () => n(!0), e;
				}
			}), null), a;
		}
	});
}
function ya(e) {
	let t = e.entry.id, [n] = T(() => fa(t)), [r] = T(() => n(), async (e) => e.pageThumbnailFile ? await X(e.pageThumbnailFile) : t), i = () => (n()?.type || e.data.idType[t] || "").toLowerCase(), a = () => i() === "photos", [o] = T(() => e.entry.found || a() ? !1 : t, pa), [s] = T(() => a() ? t : !1, (e) => Y(e).catch(() => "")), c = () => a() && s()?.trim() || n()?.title || e.data.idTitle[t] || t, l = () => e.data.idTags[t] || [];
	return (() => {
		var s = si(), u = s.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild, m = p.firstChild, h = p.nextSibling;
		return R(d, j(N, {
			get when() {
				return r();
			},
			get children() {
				return j(_a, { get id() {
					return r();
				} });
			}
		})), R(m, j(ha, {
			get text() {
				return c();
			},
			get words() {
				return e.words;
			}
		})), R(h, j(N, {
			get when() {
				return n();
			},
			get children() {
				return [
					(() => {
						var e = ii();
						return R(e, (() => {
							var e = P(() => !!Hi.has(i()));
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
		})), R(f, j(va, {
			get tags() {
				return l();
			},
			get active() {
				return e.tags;
			}
		}), null), R(f, j(N, {
			get when() {
				return !a();
			},
			get children() {
				var t = oi();
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
									var t = ai();
									return R(t, () => e.entry.found.ts), t;
								})(), " "];
							}
						}), j(ga, { get text() {
							return e.entry.found.text;
						} })];
					}
				})), t;
			}
		}), null), C((e) => {
			var n = Z(t), r = Z(t);
			return n !== e.e && I(d, "href", e.e = n), r !== e.t && I(m, "href", e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), s;
	})();
}
function ba(e) {
	return (t) => {
		let [n] = T(() => fa(t.entry.id)), [r] = T(() => n()?.title ? n() : !1, (n) => e(n, t.words));
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
var xa = {
	"Detailed List": {
		item: ya,
		wrapper: ""
	},
	Cards: {
		item: (e) => j(Os, {
			get id() {
				return e.entry.id;
			},
			get words() {
				return e.words;
			},
			render: Ms
		}),
		wrapper: "ResultCards"
	},
	Compact: {
		item: ba(rc),
		wrapper: "ResultCompact"
	},
	List: {
		item: ba(ic),
		wrapper: "ResultPlain"
	}
}, Sa = Object.keys(xa);
function Ca(e) {
	let t = () => xa[e.shared.view];
	return (() => {
		var n = ci();
		return R(n, j(M, {
			get each() {
				return e.items;
			},
			children: (n) => j(mt, {
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
function wa(e) {
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
			var n = di();
			return R(n, j(N, {
				get when() {
					return e.page > 0;
				},
				get children() {
					var t = li();
					return t.$$click = () => e.onPage(e.page - 1), t;
				}
			}), null), R(n, j(M, {
				get each() {
					return t();
				},
				children: (t) => t < 0 ? fi() : (() => {
					var n = pi();
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
					var t = ui();
					return t.$$click = () => e.onPage(e.page + 1), t;
				}
			}), null), n;
		}
	});
}
function Ta(e) {
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
		return a.sort((e, t) => e.rank - t.rank || t.count - e.count || e.name.length - t.name.length), a.slice(0, Ni);
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
		var e = hi(), n = e.firstChild, h = n.firstChild, g = n.nextSibling;
		n.$$click = () => l?.focus(), R(n, j(M, {
			get each() {
				return t();
			},
			children: (e) => (() => {
				var t = gi(), n = t.firstChild;
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
				var e = mi();
				return R(e, j(M, {
					get each() {
						return u();
					},
					children: (e, t) => (() => {
						var n = _i(), r = n.firstChild, i = r.nextSibling;
						return n.$$mousedown = (t) => {
							t.preventDefault(), d(e.name);
						}, R(n, () => e.name, r), R(i, () => e.count), C(() => n.classList.toggle("active", a() === t())), n;
					})()
				})), e;
			}
		}), null), g.$$click = p, C(() => I(h, "placeholder", t().length ? "Add tags or search text…" : "Search articles, or type to find a tag…")), C(() => h.value = r()), e;
	})();
}
function Ea() {
	let [e, t] = S(aa()), [n, r] = S(Hr("sSort", "relevancy", (e) => Ri.includes(e))), [i, a] = S(Hr("sResultView", Sa[0], (e) => Sa.includes(e))), [o, s] = S(""), [c, l] = S(null), [u, d] = S(0), [f] = T(oa), [p] = T(() => f() ? e() : !1, (e) => da(e, f())), m = w(() => f() ? e().tags.map((e) => f().titleLookup[e.toLowerCase()]).filter(Boolean) : []), h = w(() => f() ? ma(n(), f(), m()) : () => 0), g = w(() => {
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
		label: Yi(e),
		list: t
	}))]), y = () => o() === "" || g().has(o()) ? o() : "", b = w(() => [...y() === "" ? _() : g().get(y()) || []].sort(h())), x = (e) => [...e].sort(h()).slice(0, 3).map((e) => f().idTitle[e.id] || e.id), ee = w(() => ({
		data: f(),
		words: $i(e().q),
		tags: e().tags,
		view: i()
	}));
	te(() => Ur("sSort", n())), te(() => Ur("sResultView", i()));
	let ne = () => t(aa());
	window.addEventListener("popstate", ne), re(() => window.removeEventListener("popstate", ne));
	let ie = () => b().length, ae = () => Math.max(1, Math.ceil(ie() / 50)), oe = () => b().slice(u() * 50, (u() + 1) * 50);
	te(() => {
		b(), E(() => d(0));
	});
	function se(e) {
		d(e), window.scrollTo({ top: 0 });
	}
	function D(e) {
		history.pushState(null, "", ia(e.tags, e.q)), t(e);
	}
	return (() => {
		var t = bi();
		return R(t, j(N, {
			get when() {
				return f();
			},
			get fallback() {
				return xi();
			},
			get children() {
				return [j(Ta, {
					get data() {
						return f();
					},
					get value() {
						return e();
					},
					onSubmit: D
				}), (() => {
					var e = yi(), t = e.firstChild, o = t.firstChild, d = o.firstChild, f = d.firstChild.nextSibling, m = d.nextSibling.firstChild.nextSibling, h = o.nextSibling, g = t.nextSibling, _ = g.firstChild;
					return f.addEventListener("change", (e) => r(e.target.value)), R(f, j(M, {
						each: Li,
						children: ([e, t]) => (() => {
							var r = Si();
							return r.value = e, R(r, t), C(() => r.selected = n() === e), r;
						})()
					})), m.addEventListener("change", (e) => a(e.target.value)), R(m, j(M, {
						each: Sa,
						children: (e) => (() => {
							var t = Si();
							return t.value = e, R(t, e), C(() => t.selected = i() === e), t;
						})()
					})), R(h, j(M, {
						get each() {
							return v();
						},
						children: (e) => (() => {
							var t = Ti(), n = t.firstChild, r = n.firstChild, i = r.nextSibling;
							return i.nextSibling, t.addEventListener("mouseleave", () => l(null)), n.$$click = () => {
								s(e.key), l(e.key), document.activeElement?.blur();
							}, R(n, () => e.label, r), R(n, () => e.list.length, i), R(t, j(N, {
								get when() {
									return P(() => e.key !== "")() && e.list.length;
								},
								get children() {
									var t = wi();
									return R(t, j(M, {
										get each() {
											return x(e.list);
										},
										children: (e) => (() => {
											var t = Ei();
											return R(t, e), t;
										})()
									}), null), R(t, j(N, {
										get when() {
											return e.list.length > 3;
										},
										get children() {
											return Ci();
										}
									}), null), t;
								}
							}), null), C((r) => {
								var i = c() === e.key, a = y() === e.key, o = Vi(e.key), s = y() === e.key;
								return i !== r.e && t.classList.toggle("quiet", r.e = i), a !== r.t && n.classList.toggle("active", r.t = a), o !== r.a && Xe(n, "--chip", r.a = o), s !== r.o && I(n, "aria-pressed", r.o = s), r;
							}, {
								e: void 0,
								t: void 0,
								a: void 0,
								o: void 0
							}), t;
						})()
					})), R(_, j(N, {
						get when() {
							return !p.loading;
						},
						fallback: "Searching…",
						get children() {
							return `${ie()} result${ie() === 1 ? "" : "s"}`;
						}
					})), R(g, j(N, {
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
										return j(wa, {
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
								j(Ca, {
									get items() {
										return oe();
									},
									get shared() {
										return ee();
									}
								}),
								j(wa, {
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
										return vi();
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
var Da = /*#__PURE__*/ F("<div class=ResultCards>"), Oa = /*#__PURE__*/ F("<div>"), ka = /*#__PURE__*/ F("<img>"), Aa = /*#__PURE__*/ F("<a class=CitationTitle target=_blank rel=noopener>. "), ja = /*#__PURE__*/ F("<a class=CitationUrl target=_blank rel=noopener>"), Ma = /*#__PURE__*/ F("<div class=CitationItem><div class=CitationIcon></div><div class=CitationText>"), Na = /*#__PURE__*/ F("<span class=CitationTitle>. "), Pa = /*#__PURE__*/ F("<div class=Citations><h2>Citations"), Fa = /*#__PURE__*/ F("<h2>Tags"), Ia = /*#__PURE__*/ F("<div class=ArticleTabs><a class=PinButton>Edit Page"), La = /*#__PURE__*/ F("<button type=button class=PinButton>Article"), Ra = /*#__PURE__*/ F("<div class=ArticleTabs><select class=PinButton value><option value disabled hidden selected>Edit"), za = /*#__PURE__*/ F("<div class=\"TaggedList fade-in\">"), Ba = /*#__PURE__*/ F("<option>"), Va = /*#__PURE__*/ F("<button type=button class=PinButton> (<!>)"), Ha = /*#__PURE__*/ F("<h1 class=article-title>Nerd Stuff"), Ua = /*#__PURE__*/ F("<div class=StatsPage>"), Wa = /*#__PURE__*/ F("<div>Loading stats…"), Ga = /*#__PURE__*/ F("<div class=Citations>"), Ka = /*#__PURE__*/ F("<table class=DownloadsTable><thead><tr><th>Article</th><th>Download</th></tr></thead><tbody>"), qa = /*#__PURE__*/ F("<a>"), Ja = /*#__PURE__*/ F("<tr><td><a target=_blank rel=\"noopener noreferrer\">"), Ya = /*#__PURE__*/ F("<div class=ContributorsList>"), Xa = /*#__PURE__*/ F("<div class=ContributorsItem><strong></strong> "), Za = /*#__PURE__*/ F("<div class=SiteDetails><div><strong>Total home views:</strong> </div><div><strong>Total search views:</strong> </div><h3>Home views by month</h3><ul>"), Qa = /*#__PURE__*/ F("<li>: "), $a = /*#__PURE__*/ F("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong></strong> 👁"), eo = /*#__PURE__*/ F("<a><img loading=lazy>", !0, !1, !1), to = /*#__PURE__*/ F("<a class=CardImageExcerpt>"), no = /*#__PURE__*/ F("<span class=ReviewEmoji>"), ro = /*#__PURE__*/ F("<div class=\"ReviewCard fade-in\"><div class=ReviewTitle><a></a></div><div class=ReviewMeta></div><div class=ReviewBody>"), io = /*#__PURE__*/ F("<span class=PostTime>"), ao = /*#__PURE__*/ F("<span class=PostDeleted>[Deleted]"), oo = /*#__PURE__*/ F("<h3 class=PostTitle>"), so = /*#__PURE__*/ F("<div class=PostSubject>"), co = /*#__PURE__*/ F("<div class=SteamPostBox><div class=SteamAvatar></div><div class=SteamPostContent><div class=PostHeaderMeta><span class=PostAuthor>"), lo = /*#__PURE__*/ F("<span class=CommentTime>"), uo = /*#__PURE__*/ F("<blockquote class=CommentQuote>"), fo = /*#__PURE__*/ F("<div class=CommentSubject>"), po = /*#__PURE__*/ F("<div class=SteamPostBox><div class=SteamAvatar style=\"background-image:url('/viewers/cep-js/assets/Social Posts/Scott.jpg')\"></div><div class=SteamPostContent><div class=CommentHeaderMeta><span class=PostAuthor><span style=color:#aedd08>Scott</span> <span style=color:#e9d528>[developer]"), mo = /*#__PURE__*/ F("<div class=\"SteamCommentBody fade-in\"><div class=SteamCommentHeader><a></a></div><div class=SteamCommentPreview>"), ho = /*#__PURE__*/ F("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), go = /*#__PURE__*/ F("<div><div></div><div><div><a></a></div><div><strong></strong> 👁"), _o = /*#__PURE__*/ F("<div><a></a><span class=ListMeta><strong></strong> 👁"), vo = /*#__PURE__*/ F("<div class=404>You've found an article that doesn't exist yet! Click the logo to head back home."), yo = /*#__PURE__*/ F("<br>"), bo = /*#__PURE__*/ F("<div class=Homepage><center>Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!<br>Use the search above to explore our site! Something not listed here? Help contribute or <a href=\"/?v=cep-editor\">create a new page!</a><br><br><strong>IMPORTANT! You are using an in-development test version of the site, <a href=\"/?v=cep-js\">click here</a> to return to the default viewer! Otherwise thanks for testing this out, I hope this will give you a better experience searching and browsing through the pages. Leave feedback on the <a href=https://forum.cheeseepedia.org/t/cep-solid-wiki-overhaul/485/43>forum thread</a> as this will become the default by likely end of year!</strong></center><h2>News</h2><h2>Wiki</h2><h2>Community"), xo = /*#__PURE__*/ F("<div class=Carousel>"), So = /*#__PURE__*/ F("<nav class=Nav>"), Co = /*#__PURE__*/ F("<details><summary></summary><div>"), wo = /*#__PURE__*/ F("<ul class=RecentChanges>"), To = /*#__PURE__*/ F("<li class=RecentChangesItem><strong></strong> - <div> "), Eo = /*#__PURE__*/ F("<div class=Footer>Last build on: <span id=StatBuildDate>???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), Do = /*#__PURE__*/ F("<div class=SplashText>"), Oo = /*#__PURE__*/ F("<div class=Header><a href=\"/?v=cep-solid\"class=Logo><img alt=Cheesepedia></a><div class=FlavorText>Now at <strong><span id=StatArticles>????</span></strong> articles contributed by <strong><span id=StatContributors>???</span></strong> users.<br>Discussions available on the <strong><a href=https://forum.cheeseepedia.org/>Forums!</a></strong><br><a href=\"/?v=cep-solid&amp;page=search\">Search Here!"), ko = /*#__PURE__*/ F("<button type=button class=PinButton>"), Ao = /*#__PURE__*/ F("<div class=TabPanel>"), jo = /*#__PURE__*/ F("<h2>Cheese-E-Shuffle"), Mo = /*#__PURE__*/ F("<div>Loading…"), No = /*#__PURE__*/ F("<div>Nothing found."), Po = /*#__PURE__*/ F("<div id=RandomCards class=Carousel>"), Fo = /*#__PURE__*/ F("<div class=infobox-list><strong>:</strong><ul>"), Io = /*#__PURE__*/ F("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), Lo = /*#__PURE__*/ F("<video controls preload=metadata>"), Ro = /*#__PURE__*/ F("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), zo = /*#__PURE__*/ F("<div class=\"VideoEmbed fade-in\">"), Bo = /*#__PURE__*/ F("<h1 class=article-title>"), Vo = /*#__PURE__*/ F("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), Ho = /*#__PURE__*/ F("<div class=fade-in>"), Uo = /*#__PURE__*/ F("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\"><h2>Video Transcription"), Wo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No transcription provided by source."), Go = /*#__PURE__*/ F("<div class=\"PhotoCompact fade-in\"><a class=PhotoCompactImage><img loading=lazy></a><div class=PhotoCompactDate><strong></strong> 👁 ", !0, !1, !1), Ko = /*#__PURE__*/ F("<div class=\"PhotoListItem fade-in\"><a><img loading=lazy class=PhotoListImg>", !0, !1, !1), qo = /*#__PURE__*/ F("<div class=\"ArticleBody type-photo\"><div class=\"ArticlePhoto fade-in type-photo\"></div><div class=\"content fade-in type-photo\"><h2>Image Description"), Jo = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No description provided. Help write one for accessibility."), Yo = /*#__PURE__*/ F("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), Xo = /*#__PURE__*/ F("<div class=infobox-list><strong>Credits:</strong><ul>"), Zo = /*#__PURE__*/ F("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), Qo = /*#__PURE__*/ F("<li><strong></strong> (<!>)"), $o = /*#__PURE__*/ F("<div class=infobox-desc>"), es = /*#__PURE__*/ F("<li><strong></strong> (<!> – <!>)"), ts = /*#__PURE__*/ F("<li><a target=_blank rel=\"noopener noreferrer\">"), ns = /*#__PURE__*/ F("<li>"), rs = /*#__PURE__*/ F("<li><strong>:</strong> "), is = /*#__PURE__*/ F("<div class=\"NoContent fade-in\">No article content. Come write some!"), as = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comment",
	"theories",
	"meta",
	"transcriptions"
]), os = {
	Articles: (e) => !as.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos",
	Reviews: (e) => e === "reviews"
}, ss = [
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
], cs = 15, ls = {
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
}, us = "https://cheeseepedia.org/?v=cep-editor";
function ds(e, t, n) {
	switch (e.toLowerCase()) {
		case "photos": return (() => {
			var e = Da();
			return R(e, j(M, {
				each: t,
				children: (e) => j(Os, {
					id: e,
					render: Ms
				})
			})), e;
		})();
		case "reviews":
		case "steam comment": return (() => {
			var e = Oa();
			return R(e, j(M, {
				each: t,
				children: (e) => j(Os, {
					id: e,
					render: Ms
				})
			})), e;
		})();
		default: return j(M, {
			each: t,
			children: (e) => j(ya, {
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
var fs = "/viewers/cep-js/compiled-json/favicons", ps = (e, t) => `${e} ${t}${e === 1 ? "" : "s"} ago`, ms = (e) => e.accepted === !0 ? "Accepted" : e.accepted === !1 ? "Rejected" : "Pending", hs = (e) => e.replace(/^https?:\/\/(www\.)?/, ""), gs = (e) => hs(e).replace(/[^\w\-.]/g, "_") + ".png", _s = (e) => /^https?:\/\//i.test(e), vs = (e) => {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
}, ys = (e) => {
	try {
		return hs(new URL(e).origin);
	} catch {
		return null;
	}
};
function bs(e) {
	let t = () => e.index + 1, n = () => _s(e.cite), r = () => n() ? vs(e.cite) : null;
	return (() => {
		var i = Ma(), a = i.firstChild, o = a.nextSibling;
		return R(a, j(N, {
			get when() {
				return r();
			},
			get children() {
				var e = ka();
				return e.addEventListener("error", (e) => e.currentTarget.style.display = "none"), C((t) => {
					var n = r(), i = `${fs}/${gs(r())}`;
					return n !== t.e && I(e, "alt", t.e = n), i !== t.t && I(e, "src", t.t = i), t;
				}, {
					e: void 0,
					t: void 0
				}), e;
			}
		})), R(o, j(N, {
			get when() {
				return n();
			},
			get fallback() {
				return (() => {
					var n = Na(), r = n.firstChild;
					return R(n, t, r), R(n, () => e.cite, null), n;
				})();
			},
			get children() {
				return [(() => {
					var n = Aa(), i = n.firstChild;
					return R(n, t, i), R(n, () => ys(e.cite) || r() || e.cite, null), C(() => I(n, "href", e.cite)), n;
				})(), (() => {
					var t = ja();
					return R(t, () => hs(e.cite)), C(() => I(t, "href", e.cite)), t;
				})()];
			}
		})), C(() => I(i, "id", `cite-${t()}`)), i;
	})();
}
function xs(e) {
	return j(N, {
		get when() {
			return e.citations?.length;
		},
		get children() {
			var t = Pa();
			return t.firstChild, R(t, j(M, {
				get each() {
					return e.citations;
				},
				children: (e, t) => j(bs, {
					cite: e,
					get index() {
						return t();
					}
				})
			}), null), t;
		}
	});
}
function Ss(e) {
	let [t] = T(vt);
	return j(N, {
		get when() {
			return t()?.[e.folderID]?.length;
		},
		get children() {
			return [Fa(), j(va, { get tags() {
				return t()[e.folderID];
			} })];
		}
	});
}
function Cs(e) {
	return (() => {
		var t = Ia(), n = t.firstChild;
		return C(() => I(n, "href", `${us}&=${e.folderID}`)), t;
	})();
}
function ws(e) {
	let t = () => e.meta.folderID, [n, r] = S("Article"), [i, a] = S(0), o = (e) => {
		r(e), a(0);
	}, s = () => Math.max(1, Math.ceil((d().get(n())?.length || 0) / 50)), c = () => (d().get(n()) || []).slice(i() * 50, (i() + 1) * 50), l = (e) => {
		a(e), window.scrollTo({ top: 0 });
	}, [u] = T(() => Promise.all([yt(), oa()])), d = w(() => {
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
			href: `${us}&=${t()}`
		},
		{
			name: "Add Review",
			href: `${us}&type=Review&tag=${t()}`
		},
		{
			name: "Add Images",
			href: `${us}&type=Photos&tag=${t()}`
		},
		{
			name: "Add Video",
			href: `${us}&type=Videos&tag=${t()}`
		}
	];
	return [
		(() => {
			var e = Ra(), t = e.firstChild;
			return t.firstChild, t.addEventListener("change", (e) => {
				let t = e.target.value;
				e.target.value = "", t && (location.href = t);
			}), R(t, j(M, {
				get each() {
					return p();
				},
				children: (e) => (() => {
					var t = Ba();
					return R(t, () => e.name), C(() => t.value = e.href), t;
				})()
			}), null), R(e, j(N, {
				get when() {
					return d().size;
				},
				get children() {
					return [(() => {
						var e = La();
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
							var r = Va(), i = r.firstChild, a = i.nextSibling;
							return a.nextSibling, r.$$click = () => o(e), R(r, () => f(e), i), R(r, () => t.length, a), C((t) => {
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
			var t = Oa();
			return R(t, () => e.children), C((e) => Xe(t, "display", n() === "Article" ? "" : "none")), t;
		})(),
		j(N, {
			get when() {
				return P(() => !!(n() !== "Article" && u()))() && d().get(n());
			},
			get children() {
				var e = za();
				return R(e, j(N, {
					get when() {
						return i() > 0;
					},
					get children() {
						return j(wa, {
							get page() {
								return i();
							},
							get pages() {
								return s();
							},
							onPage: l
						});
					}
				}), null), R(e, () => ds(n(), c(), u()[1]), null), R(e, j(wa, {
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
function Ts(e) {
	if (e.type === "home") return Bs();
	if (e.type === "notfound") return Ls(e.folderID);
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
		case "Steam Comment": return oc(e);
		case "Videos": return ec(e);
		case "Photos": return ac(e);
		default: return oc(e);
	}
}
function Es() {
	let e = async (e) => {
		let t = await fetch(`/viewers/cep-js/compiled-json/${e}.json`);
		return t.ok ? t.json() : [];
	}, [t] = T(async () => {
		let [t, n, r, i] = await Promise.all([
			e("citation_links"),
			e("download_links"),
			e("contributors"),
			Et()
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
				pageID: e.pageTitle ? await X(e.pageTitle) : null
			}))),
			contributors: [...r].sort((e, t) => (t.count || 0) - (e.count || 0)),
			homeMonths: a,
			homeTotal: a.reduce((e, t) => e + t.count, 0),
			searchTotal: i._search || 0
		};
	}), n = (e) => new Date(e.year, e.month - 1).toLocaleDateString(void 0, {
		month: "long",
		year: "numeric"
	});
	return [Ha(), (() => {
		var e = Ua();
		return R(e, j(N, {
			get when() {
				return t();
			},
			get fallback() {
				return Wa();
			},
			get children() {
				return j(Js, { get tabs() {
					return [
						{
							name: `Citations (${t().links.length.toLocaleString()})`,
							content: () => ["Every single citation on the site! We reccomend scraping this information and crawling all the sites for archival, you'll never know when this stuff will become lost!", (() => {
								var e = Ga();
								return R(e, j(M, {
									get each() {
										return t().links;
									},
									children: (e, t) => j(bs, {
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
								var e = Ka(), n = e.firstChild.nextSibling;
								return R(n, j(M, {
									get each() {
										return t().downloads;
									},
									children: (e) => (() => {
										var t = Ja(), n = t.firstChild, r = n.firstChild;
										return R(t, j(N, {
											get when() {
												return e.pageID;
											},
											get fallback() {
												return e.pageTitle;
											},
											get children() {
												var t = qa();
												return R(t, () => e.pageTitle), C(() => I(t, "href", Z(e.pageID))), t;
											}
										}), n), R(r, () => e.label || e.url), C(() => I(r, "href", e.url)), t;
									})()
								})), e;
							})()]
						},
						{
							name: `Contributors (${t().contributors.length.toLocaleString()})`,
							content: () => ["Every single contributor on the site!", (() => {
								var e = Ya();
								return R(e, j(M, {
									get each() {
										return t().contributors;
									},
									children: (e) => (() => {
										var t = Xa(), n = t.firstChild;
										return n.nextSibling, R(n, () => e.name), R(t, () => e.count || 0, null), t;
									})()
								})), e;
							})()]
						},
						{
							name: "Site Details",
							content: () => ["Additional info of the site idk where else to put.", (() => {
								var e = Za(), r = e.firstChild;
								r.firstChild.nextSibling;
								var i = r.nextSibling;
								i.firstChild.nextSibling;
								var a = i.nextSibling.nextSibling;
								return R(r, () => t().homeTotal.toLocaleString(), null), R(i, () => t().searchTotal.toLocaleString(), null), R(a, j(M, {
									get each() {
										return t().homeMonths;
									},
									children: (e) => (() => {
										var t = Qa(), r = t.firstChild;
										return R(t, () => n(e), r), R(t, () => e.count.toLocaleString(), null), t;
									})()
								})), e;
							})()]
						}
					];
				} });
			}
		})), e;
	})()];
}
function Ds({ link: e, thumbnailSrc: t, title: n, dateText: r, views: i, excerpt: a = n }) {
	return (() => {
		var o = $a(), s = o.firstChild, c = s.nextSibling.firstChild, l = c.firstChild.firstChild, u = c.nextSibling, d = u.firstChild;
		return d.nextSibling, R(s, t ? (() => {
			var r = eo(), i = r.firstChild;
			return I(r, "href", e), I(i, "src", t), I(i, "alt", n), r;
		})() : (() => {
			var t = to();
			return I(t, "href", e), R(t, a), t;
		})()), I(l, "href", e), R(l, n), R(d, r), R(u, i, null), o;
	})();
}
function Os(e) {
	let [t] = T(async () => e.render(await Fr(e.id), e.words || []));
	return j(N, {
		get when() {
			return t();
		},
		get children() {
			return t();
		}
	});
}
async function ks(e) {
	let t = e.folderID ?? await X(e.title), [n, r, i] = await Promise.all([
		Y(t).catch(() => ""),
		Ir(t).catch(() => ""),
		Et()
	]), a = await Xr(n || r), o = e.recommend === !0 ? "👍" : e.recommend === !1 ? "👎" : "", s = [
		Q(e.startDate),
		e.contributors?.join(", "),
		`👁 ${i[t] || 0}`
	].filter(Boolean).join(" · ");
	return (() => {
		var n = ro(), r = n.firstChild, i = r.firstChild, c = r.nextSibling, l = c.nextSibling;
		return R(r, j(N, {
			when: o,
			get children() {
				var e = no();
				return R(e, o), e;
			}
		}), i), R(i, () => e.title), R(c, s), C((e) => {
			var n = Z(t), r = J.parse(a);
			return n !== e.e && I(i, "href", e.e = n), r !== e.t && (l.innerHTML = e.t = r), e;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function As(e) {
	let t = () => e.meta, n = () => t().postTitle || t().postAuthor || t().postSubject || t().postTime || t().deleted === !0, r = () => t().commentQuote || t().commentSubject || t().commentTime || t().commentQuoteAuthor;
	return [j(N, {
		get when() {
			return n();
		},
		get children() {
			var e = co(), n = e.firstChild.nextSibling, r = n.firstChild, i = r.firstChild;
			return R(i, () => t().postAuthor || "Unknown User"), R(r, j(N, {
				get when() {
					return t().postTime;
				},
				get children() {
					var e = io();
					return R(e, () => t().postTime), e;
				}
			}), null), R(r, j(N, {
				get when() {
					return t().deleted === !0;
				},
				get children() {
					return ao();
				}
			}), null), R(n, j(N, {
				get when() {
					return t().postTitle;
				},
				get children() {
					var e = oo();
					return R(e, () => t().postTitle), e;
				}
			}), null), R(n, j(N, {
				get when() {
					return t().postSubject;
				},
				get children() {
					var e = so();
					return R(e, () => t().postSubject), e;
				}
			}), null), e;
		}
	}), j(N, {
		get when() {
			return r();
		},
		get children() {
			var e = po(), n = e.firstChild.nextSibling, r = n.firstChild;
			return r.firstChild.firstChild.nextSibling.nextSibling, R(r, j(N, {
				get when() {
					return t().commentTime;
				},
				get children() {
					var e = lo();
					return R(e, () => t().commentTime), e;
				}
			}), null), R(n, j(N, {
				get when() {
					return t().commentQuote;
				},
				get children() {
					var e = uo();
					return R(e, () => t().commentQuote), e;
				}
			}), null), R(n, j(N, {
				get when() {
					return t().commentSubject;
				},
				get children() {
					var e = fo();
					return R(e, () => t().commentSubject), e;
				}
			}), null), e;
		}
	})];
}
async function js(e, t = []) {
	let n = e.folderID ?? await X(e.title);
	return (() => {
		var r = mo(), i = r.firstChild, a = i.firstChild, o = i.nextSibling;
		return R(a, () => qr(e.title || n, t)), R(o, j(As, { meta: e })), C(() => I(a, "href", Z(n))), r;
	})();
}
function Ms(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "reviews": return ks(e, t);
		case "steam comment": return js(e, t);
		default: return Ns(e, t);
	}
}
async function Ns(e, t = []) {
	let n = await X(e.title), r = (e.type || "").toLowerCase(), i = r.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), a = await Wr(e);
	a ||= await Vr(e);
	let o = await Et(), s = e.title;
	if (r === "photos") try {
		let e = await fetch(`/content/${n}/content.md`), t = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !t) {
			let t = (await e.text()).trim();
			t && (s = t);
		}
	} catch {}
	let c = i ? ` type-${i}` : "";
	return (() => {
		var i = ho(), l = i.firstChild, u = l.nextSibling, d = u.firstChild, f = d.firstChild.firstChild, p = d.nextSibling, m = p.firstChild;
		return m.nextSibling, L(i, `Card fade-in${c}`), L(l, `CardImage${c}`), R(l, a), L(u, `CardTextArea${c}`), L(d, `CardLink${c}`), R(f, () => qr(s, t)), L(p, `CardText${c}`), R(m, (() => {
			var t = P(() => !!as.has(r));
			return () => t() ? Q(e.startDate) : [
				P(() => Q(e.startDate)),
				" – ",
				P(() => Rr(e.endDate))
			];
		})()), R(p, () => o[n], null), C(() => I(f, "href", Z(n))), i;
	})();
}
async function Ps(e) {
	let t = await X(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await Et(), a = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (a = t);
		}
	} catch {}
	let o = as.has(n) ? Q(e.startDate) : `${Q(e.startDate)} \u2013 ${Rr(e.endDate)}`;
	return {
		link: t,
		label: a,
		dates: o,
		views: i[t],
		t: r ? ` type-${r}` : ""
	};
}
async function Fs(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await Ps(e), s = await Wr(e);
	return (() => {
		var e = go(), c = e.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, L(e, `Compact fade-in${o}`), L(c, `CompactImage${o}`), R(c, s), L(l, `CompactText${o}`), L(u, `CompactTitle${o}`), R(d, () => qr(r, t)), L(f, `CompactMeta${o}`), R(p, i), R(f, a, null), C(() => I(d, "href", Z(n))), e;
	})();
}
async function Is(e, t = []) {
	let { link: n, label: r, dates: i, views: a, t: o } = await Ps(e);
	return (() => {
		var e = _o(), s = e.firstChild, c = s.nextSibling, l = c.firstChild;
		return l.nextSibling, L(e, `ListRow fade-in${o}`), R(s, () => qr(r, t)), R(l, i), R(c, a, null), C(() => I(s, "href", Z(n))), e;
	})();
}
function Ls() {
	return vo();
}
async function Rs(e) {
	let t = await e(), n = await Promise.all(t.map((e) => Fr(e).catch(() => null)));
	return Promise.all(n.filter(Boolean).map((e) => Ns(e)));
}
function zs(e) {
	let t = e.replace(/(\.\d{3})\d+/, "$1"), n = /(Z|[+-]\d\d:\d\d)$/.test(t) ? t : `${t}Z`, r = Math.max(0, Math.floor((Date.now() - new Date(n).getTime()) / 6e4));
	if (r < 1) return "Just now";
	if (r < 60) return ps(r, "min");
	let i = Math.floor(r / 60);
	return i < 24 ? ps(i, "hour") : ps(Math.floor(i / 24), "day");
}
function Bs() {
	let [e] = T(Dt), [t] = T(Ot), [n] = T(Qr), [r] = T(() => Rs(St)), [i] = T(() => Rs(xt)), [a] = T(async () => {
		let e = [...await kt()].sort((e, t) => new Date(t.submittedAt) - new Date(e.submittedAt));
		return Promise.all(e.map(async (e) => ({
			...e,
			pageID: e.title?.trim() ? await X(e.title.trim()) : null
		})));
	});
	return [yo(), (() => {
		var o = bo(), s = o.firstChild.nextSibling.nextSibling, c = s.nextSibling;
		return R(o, j(Js, { tabs: [{
			name: "The News",
			content: () => (() => {
				var t = xo();
				return R(t, j(M, {
					get each() {
						return e() || [];
					},
					children: (e) => Ds({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: Jr(e.created_at),
						views: e.views
					})
				})), t;
			})()
		}, {
			name: "Social Media",
			content: () => (() => {
				var e = xo();
				return R(e, j(M, {
					get each() {
						return r() || [];
					},
					children: (e) => e
				})), e;
			})()
		}] }), s), R(o, j(Js, { tabs: [
			{
				name: "Navigation",
				content: () => (() => {
					var e = So();
					return R(e, j(M, {
						each: ss,
						children: (e) => (() => {
							var t = Co(), n = t.firstChild, r = n.nextSibling;
							return R(n, () => e.name), R(r, j(M, {
								get each() {
									return e.tags;
								},
								children: (e) => (() => {
									var t = qa();
									return R(t, e), C(() => I(t, "href", ia([e]))), t;
								})()
							})), t;
						})()
					})), e;
				})()
			},
			{
				name: "Map",
				content: () => j(N, {
					get when() {
						return P(() => !n.loading)() && n();
					},
					get children() {
						return n();
					}
				})
			},
			{
				name: "Recent Changes",
				content: () => (() => {
					var e = wo();
					return R(e, j(M, {
						get each() {
							return a() || [];
						},
						children: (e) => (() => {
							var t = To(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.firstChild;
							return R(n, () => e.username), R(t, j(N, {
								get when() {
									return e.pageID;
								},
								get fallback() {
									return e.title?.trim() || "New Article";
								},
								get children() {
									var t = qa();
									return R(t, () => e.title.trim()), C(() => I(t, "href", Z(e.pageID))), t;
								}
							}), r), R(r, () => ms(e), i), R(r, () => zs(e.submittedAt), null), C(() => L(r, `RecentChangesStatus ${ms(e).toLowerCase()}`)), t;
						})()
					})), e;
				})()
			}
		] }), c), R(o, j(Js, { tabs: [{
			name: "Fan Videos",
			content: () => (() => {
				var e = xo();
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
				var e = xo();
				return R(e, j(M, {
					get each() {
						return t() || [];
					},
					children: (e) => Ds({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: Jr(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}] }), null), o;
	})()];
}
function Vs() {
	return Eo();
}
var Hs = [
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
], Us = {
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
function Ws() {
	let e = /* @__PURE__ */ new Date();
	return `"${Us[`${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`] ?? Hs[Math.floor(Math.random() * Hs.length)]}"`;
}
function Gs(e) {
	e.style.fontSize = "";
	let t = parseFloat(getComputedStyle(e).fontSize);
	for (; e.scrollWidth > e.clientWidth && t > 8;) --t, e.style.fontSize = `${t}px`;
}
function Ks() {
	let e = Ws();
	return (() => {
		var t = Do();
		return Qe((e) => {
			let t = () => {
				if (!e.isConnected) return requestAnimationFrame(t);
				Gs(e), new ResizeObserver(() => Gs(e)).observe(e);
			};
			requestAnimationFrame(t);
		}, t), R(t, e), t;
	})();
}
function qs() {
	let e = ls.standard;
	try {
		let t = localStorage.getItem("cep-theme") || "standard", n = JSON.parse(localStorage.getItem("cep-theme-custom") || "null");
		e = t === "custom" && n?.["--logo"] ? n["--logo"] : ls[t] || ls.standard;
	} catch {}
	return (() => {
		var t = Oo(), n = t.firstChild, r = n.firstChild;
		return R(t, Ks, n), I(r, "src", "/viewers/cep-js/assets/Logos/" + e), t;
	})();
}
function Js(e) {
	let [t, n] = S(e.tabs[0].name);
	return [(() => {
		var r = Oa();
		return R(r, j(M, {
			get each() {
				return e.tabs;
			},
			children: (e) => (() => {
				var r = ko();
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
			var n = Ao();
			return R(n, () => e.content()), C((r) => Xe(n, "display", t() === e.name ? "" : "none")), n;
		})()
	})];
}
function Ys(e) {
	for (let t = e.length - 1; t > 0; t--) {
		let n = Math.floor(Math.random() * (t + 1));
		[e[t], e[n]] = [e[n], e[t]];
	}
	return e;
}
function Xs() {
	let [e, t] = S(Hr("sRandomTab", "Articles", (e) => Object.hasOwn(os, e))), n = {};
	for (let e of Object.keys(os)) {
		let [t, r] = S([]), [i, a] = S(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([Tt(), Et()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = os[e], [i, o] = await a(), s = Ys(Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e)), c = 0;
		for (let e = 0; e < s.length && c < cs; e += 20) {
			let n = await Promise.all(s.slice(e, e + 20).map((e) => Fr(e).catch(() => null))), r = [];
			for (let t = 0; t < n.length && c < cs; t++) n[t] && (r.push({
				id: s[e + t],
				meta: n[t]
			}), c++);
			await Promise.all(r.map(async ({ id: e, meta: n }) => {
				let r = await Ns(n), i = o[e];
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
		jo(),
		(() => {
			var n = Oa();
			return R(n, j(M, {
				get each() {
					return Object.keys(os);
				},
				children: (n) => (() => {
					var r = ko();
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
			var e = Po();
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
					return Mo();
				}
			}), null), R(e, j(N, {
				get when() {
					return P(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return No();
				}
			}), null), e;
		})()
	];
}
function Zs(e) {
	return j(N, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = Fo(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
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
function Qs(e) {
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
function $s(e) {
	let t = () => Qs(e.url);
	return j(N, {
		get when() {
			return t();
		},
		get children() {
			var e = zo();
			return R(e, j(je, { get children() {
				return [
					j(Me, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = Io();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = Lo();
							return C(() => I(e, "src", t().src)), e;
						}
					}),
					j(Me, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = Ro();
							return R(e, () => t().src), C(() => I(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function ec(e) {
	let [t] = T(async () => zr(await X(e.pageThumbnailFile))), [n] = T(() => Zr(e)), [r] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Y(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await Xr(n),
			old: await Xr(r)
		};
	});
	return [
		(() => {
			var t = Bo();
			return R(t, () => e.title), t;
		})(),
		j(Cs, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var t = Uo(), n = t.firstChild;
			return n.firstChild, R(t, j($s, { get url() {
				return e.pageThumbnailVideo;
			} }), n), R(n, j(N, {
				get when() {
					return !r.loading;
				},
				get fallback() {
					return Mo();
				},
				get children() {
					return j(N, {
						get when() {
							return r()?.md || r()?.old;
						},
						get fallback() {
							return Wo();
						},
						get children() {
							return [j(N, {
								get when() {
									return P(() => !r().md)() && r().old;
								},
								get children() {
									return Vo();
								}
							}), (() => {
								var e = Ho();
								return C(() => e.innerHTML = J.parse(r().md || r().old)), e;
							})()];
						}
					});
				}
			}), null), R(t, j(xs, { get citations() {
				return e.citations;
			} }), null), R(t, j(Ss, { get folderID() {
				return e.folderID;
			} }), null), t;
		})()
	];
}
async function tc(e) {
	let { link: t, dates: n, views: r } = await Ps(e);
	return (() => {
		var i = Go(), a = i.firstChild, o = a.firstChild, s = a.nextSibling, c = s.firstChild;
		return c.nextSibling, I(o, "src", `/content/${t}/photo.avif`), R(c, n), R(s, r || 0, null), C((n) => {
			var r = Z(t), i = e.title;
			return r !== n.e && I(a, "href", n.e = r), i !== n.t && I(o, "alt", n.t = i), n;
		}, {
			e: void 0,
			t: void 0
		}), i;
	})();
}
async function nc(e) {
	let t = e.folderID ?? await X(e.title);
	return (() => {
		var n = Ko(), r = n.firstChild, i = r.firstChild;
		return I(i, "src", `/content/${t}/photo.avif`), C((n) => {
			var a = Z(t), o = e.title;
			return a !== n.e && I(r, "href", n.e = a), o !== n.t && I(i, "alt", n.t = o), n;
		}, {
			e: void 0,
			t: void 0
		}), n;
	})();
}
function rc(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return tc(e);
		default: return Fs(e, t);
	}
}
function ic(e, t = []) {
	switch ((e.type || "").toLowerCase()) {
		case "photos": return nc(e);
		default: return Is(e, t);
	}
}
function ac(e) {
	let [t] = T(() => Wr(e)), [n] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Y(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await Xr(n),
			old: await Xr(r)
		};
	});
	return [
		(() => {
			var t = Bo();
			return R(t, () => e.title), t;
		})(),
		j(Cs, { get folderID() {
			return e.folderID;
		} }),
		(() => {
			var r = qo(), i = r.firstChild, a = i.nextSibling;
			return a.firstChild, R(i, j(N, {
				get when() {
					return P(() => !t.loading)() && t();
				},
				get children() {
					return t();
				}
			})), R(a, j(N, {
				get when() {
					return !n.loading;
				},
				get fallback() {
					return Mo();
				},
				get children() {
					return j(N, {
						get when() {
							return n()?.md || n()?.old;
						},
						get fallback() {
							return Jo();
						},
						get children() {
							return [j(N, {
								get when() {
									return P(() => !n().md)() && n().old;
								},
								get children() {
									return Vo();
								}
							}), (() => {
								var e = Ho();
								return C(() => e.innerHTML = J.parse(n().md || n().old)), e;
							})()];
						}
					});
				}
			}), null), R(r, j(xs, { get citations() {
				return e.citations;
			} }), null), R(r, j(Ss, { get folderID() {
				return e.folderID;
			} }), null), r;
		})()
	];
}
function oc(e) {
	let [t] = T(async () => zr(await X(e.pageThumbnailFile))), [n] = T(() => Zr(e)), [r] = T(async () => {
		let t = e.folderID ?? await X(e.title?.trim()), [n, r] = await Promise.all([Y(t).catch(() => ""), Ir(t).catch(() => "")]);
		return {
			md: await Xr(n),
			old: await Xr(r)
		};
	});
	return [
		(() => {
			var t = Bo();
			return R(t, () => e.title), t;
		})(),
		j(ws, {
			meta: e,
			get children() {
				var i = Zo(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
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
						var t = Yo(), n = t.firstChild.nextSibling, r = n.firstChild;
						return R(n, () => e.sqft, r), t;
					}
				}), null), R(a, j(Zs, {
					title: "Remodels",
					get items() {
						return e.remodels;
					},
					children: (e) => (() => {
						var t = Qo(), n = t.firstChild, r = n.nextSibling.nextSibling;
						return r.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), t;
					})()
				}), null), R(a, j(Zs, {
					title: "Stages",
					get items() {
						return e.stages;
					},
					children: (e) => (() => {
						var t = es(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
						return i.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), R(t, () => Rr(e.e), i), R(t, j(N, {
							get when() {
								return e.desc;
							},
							get children() {
								var t = $o();
								return R(t, () => e.desc), t;
							}
						}), null), t;
					})()
				}), null), R(a, j(Zs, {
					title: "Franchisees",
					get items() {
						return e.franchisees;
					},
					children: (e) => (() => {
						var t = es(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
						return i.nextSibling, R(n, () => e.n), R(t, () => Q(e.s), r), R(t, () => Rr(e.e), i), t;
					})()
				}), null), R(a, j(Zs, {
					title: "Downloads",
					get items() {
						return e.downloadLinks;
					},
					children: (e) => (() => {
						var t = ts(), n = t.firstChild;
						return R(n, () => e.label), C(() => I(n, "href", e.url)), t;
					})()
				}), null), R(a, j(Zs, {
					title: "Showtape Formats",
					get items() {
						return e.showtapeFormats;
					},
					children: (e) => (() => {
						var t = ns();
						return R(t, e), t;
					})()
				}), null), R(a, j(N, {
					get when() {
						return e.credits?.length;
					},
					get children() {
						var t = Xo(), n = t.firstChild.nextSibling;
						return R(n, j(M, {
							get each() {
								return e.credits;
							},
							children: (e) => (() => {
								var t = rs(), n = t.firstChild, r = n.firstChild;
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
						return Mo();
					},
					get children() {
						return j(N, {
							get when() {
								return r()?.md || r()?.old;
							},
							get fallback() {
								return is();
							},
							get children() {
								return [j(N, {
									get when() {
										return P(() => !r().md)() && r().old;
									},
									get children() {
										return Vo();
									}
								}), (() => {
									var e = Ho();
									return C(() => e.innerHTML = J.parse(r().md || r().old)), e;
								})()];
							}
						});
					}
				})), R(i, j(xs, { get citations() {
					return e.citations;
				} }), null), i;
			}
		}),
		j(Ss, { get folderID() {
			return e.folderID;
		} })
	];
}
We(["click"]);
//#endregion
//#region src/App.jsx
var sc = /*#__PURE__*/ F("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), cc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), lc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), uc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), dc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), fc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), pc = /*#__PURE__*/ F("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function mc(e) {
	return [
		sc(),
		cc(),
		lc(),
		uc(),
		dc(),
		fc(),
		pc(),
		P(qs),
		P(() => P(() => e.type === "search")() ? Ea() : P(() => e.type === "stats")() ? Es() : Ts(e)),
		P(Xs),
		P(Vs)
	];
}
//#endregion
//#region index.jsx
var hc = /^[a-z0-9]{8,32}$/;
function gc(e) {
	fetch(`/track?p=${encodeURIComponent(e)}`).catch(() => {});
}
async function _c(e, t) {
	if (e.get("page") === "search") {
		Ue(() => mc({ type: "search" }), t), gc("_search");
		return;
	}
	if (e.get("page") === "stats") {
		Ue(() => mc({ type: "stats" }), t), gc("_stats");
		return;
	}
	let n = (e.get("") || "").replace(/^\/+|\/+$/g, ""), r = await Fr(n);
	Ue(() => mc(r), t);
	let i = n === "" ? "_home" : n;
	(i === "_home" || hc.test(i)) && gc(i);
}
//#endregion
export { _c as render };
