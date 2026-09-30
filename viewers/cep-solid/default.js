//#region node_modules/solid-js/dist/solid.js
var e = {
	context: void 0,
	registry: void 0,
	effects: void 0,
	done: !1,
	getContextId() {
		return t(this.context.count);
	},
	getNextContextId() {
		return t(this.context.count++);
	}
};
function t(t) {
	let n = String(t), r = n.length - 1;
	return e.context.id + (r ? String.fromCharCode(96 + r) : "") + n;
}
var n = (e, t) => e === t, r = Symbol("solid-track"), i = { equals: n }, a = null, o = de, s = 1, c = 2, l = {
	owned: null,
	cleanups: null,
	context: null,
	owner: null
}, u = {}, d = null, f = null, p = null, m = null, h = null, g = 0;
function _(e, t) {
	let n = p, r = d, i = e.length === 0, a = t === void 0 ? r : t, o = i ? l : {
		owned: null,
		cleanups: null,
		context: a ? a.context : null,
		owner: a
	}, s = i ? e : () => e(() => C(() => k(o)));
	d = o, p = null;
	try {
		return D(s, !0);
	} finally {
		p = n, d = r;
	}
}
function v(e, t) {
	t = t ? Object.assign({}, i, t) : i;
	let n = {
		value: e,
		observers: null,
		observerSlots: null,
		comparator: t.equals || void 0
	};
	return [se.bind(n), (e) => (typeof e == "function" && (e = f && f.running && f.sources.has(n) ? e(n.tValue) : e(n.value)), ce(n, e))];
}
function y(e, t, n) {
	w(T(e, t, !0, s));
}
function b(e, t, n) {
	w(T(e, t, !1, s));
}
function x(e, t, n) {
	n = n ? Object.assign({}, i, n) : i;
	let r = T(e, t, !0, 0);
	return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, w(r), se.bind(r);
}
function ee(e) {
	return e && typeof e == "object" && "then" in e;
}
function S(t, n, r) {
	let i, a, o;
	typeof n == "function" ? (i = t, a = n, o = r || {}) : (i = !0, a = t, o = n || {});
	let s = null, c = u, l = null, m = !1, h = !1, g = "initialValue" in o, _ = typeof i == "function" && x(i), b = /* @__PURE__ */ new Set(), [S, re] = (o.storage || v)(o.initialValue), [ie, se] = v(void 0), [ce, w] = v(void 0, { equals: !1 }), [le, T] = v(g ? "ready" : "unresolved");
	d && te(() => {
		for (let e of b.keys()) e.decrement();
		b.clear(), f && s && f.promises.delete(s), s = null;
	}), e.context && (l = e.getNextContextId(), o.ssrLoadFrom === "initial" ? c = o.initialValue : e.load && e.has(l) && (c = e.load(l)));
	function E(e, t, n, r) {
		return s === e && (s = null, r !== void 0 && (g = !0), (e === c || t === c) && o.onHydrated && queueMicrotask(() => o.onHydrated(r, { value: t })), c = u, f && e && m ? (f.promises.delete(e), m = !1, D(() => {
			f.running = !0, ue(t, n);
		}, !1)) : ue(t, n)), t;
	}
	function ue(e, t) {
		D(() => {
			t === void 0 && re(() => e), T(t === void 0 ? g ? "ready" : "unresolved" : "errored"), se(t);
			for (let e of b.keys()) e.decrement();
			b.clear();
		}, !1);
	}
	function de() {
		let e = oe && ae(oe), t = S(), n = ie();
		if (n !== void 0 && !s) throw n;
		return p && !p.user && e && y(() => {
			ce(), s && (e.resolved && f && m ? f.promises.add(s) : b.has(e) || (e.increment(), b.add(e)));
		}), t;
	}
	function O(e = !0) {
		if (e !== !1 && h) return;
		h = !1;
		let t = _ ? _() : i;
		if (m = f && f.running, t == null || t === !1) {
			E(s, C(S));
			return;
		}
		f && s && f.promises.delete(s);
		let n, r = c === u ? C(() => {
			try {
				return a(t, {
					value: S(),
					refetching: e
				});
			} catch (e) {
				n = e;
			}
		}) : c;
		if (n !== void 0) {
			E(s, void 0, me(n), t);
			return;
		}
		return ee(r) ? (s = r, "v" in r ? (r.s === 1 ? E(s, r.v, void 0, t) : E(s, void 0, me(r.v), t), r) : (h = !0, queueMicrotask(() => h = !1), D(() => {
			T(g ? "refreshing" : "pending"), w();
		}, !1), r.then((e) => E(r, e, void 0, t), (e) => E(r, void 0, me(e), t)))) : (E(s, r, void 0, t), r);
	}
	Object.defineProperties(de, {
		state: { get: () => le() },
		error: { get: () => ie() },
		loading: { get() {
			let e = le();
			return e === "pending" || e === "refreshing";
		} },
		latest: { get() {
			if (!g) return de();
			let e = ie();
			if (e && !s) throw e;
			return S();
		} }
	});
	let fe = d;
	return _ ? y(() => (fe = d, O(!1))) : O(!1), [de, {
		refetch: (e) => ne(fe, () => O(e)),
		mutate: re
	}];
}
function C(e) {
	if (p === null) return e();
	let t = p;
	p = null;
	try {
		return e();
	} finally {
		p = t;
	}
}
function te(e) {
	return d === null || (d.cleanups === null ? d.cleanups = [e] : d.cleanups.push(e)), e;
}
function ne(e, t) {
	let n = d, r = p;
	d = e, p = null;
	try {
		return D(t, !0);
	} catch (e) {
		ge(e);
	} finally {
		d = n, p = r;
	}
}
var [re, ie] = /*@__PURE__*/ v(!1);
function ae(e) {
	let t;
	return d && d.context && (t = d.context[e.id]) !== void 0 ? t : e.defaultValue;
}
var oe;
function se() {
	let e = f && f.running;
	if (this.sources && (e ? this.tState : this.state)) {
		if ((e ? this.tState : this.state) === s) w(this);
		else {
			let e = m;
			m = null, D(() => O(this), !1), m = e;
		}
	}
	if (p) {
		let e = this.observers;
		if (!e || e[e.length - 1] !== p) {
			let t = e ? e.length : 0;
			p.sources ? (p.sources.push(this), p.sourceSlots.push(t)) : (p.sources = [this], p.sourceSlots = [t]), e ? (e.push(p), this.observerSlots.push(p.sources.length - 1)) : (this.observers = [p], this.observerSlots = [p.sources.length - 1]);
		}
	}
	return e && f.sources.has(this) ? this.tValue : this.value;
}
function ce(e, t, n) {
	let r = f && f.running && f.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (f) {
			let r = f.running;
			(r || !n && f.sources.has(e)) && (f.sources.add(e), e.tValue = t), r || (e.value = t);
		} else e.value = t;
		e.observers && e.observers.length && D(() => {
			for (let t = 0; t < e.observers.length; t += 1) {
				let n = e.observers[t], r = f && f.running;
				r && f.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? m.push(n) : h.push(n), n.observers && fe(n)), r ? n.tState = s : n.state = s);
			}
			if (m.length > 1e6) throw m = [], Error();
		}, !1);
	}
	return t;
}
function w(e) {
	if (!e.fn) return;
	k(e);
	let t = g;
	le(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t), f && !f.running && f.sources.has(e) && queueMicrotask(() => {
		D(() => {
			f && (f.running = !0), p = d = e, le(e, e.tValue, t), p = d = null;
		}, !1);
	});
}
function le(e, t, n) {
	let r, i = d, a = p;
	p = d = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return e.pure && (f && f.running ? (e.tState = s, e.tOwned && e.tOwned.forEach(k), e.tOwned = void 0) : (e.state = s, e.owned && e.owned.forEach(k), e.owned = null)), e.updatedAt = n + 1, ge(t);
	} finally {
		p = a, d = i;
	}
	(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? ce(e, r, !0) : f && f.running && e.pure ? (f.sources.has(e) || (e.value = r), f.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function T(e, t, n, r = s, i) {
	let a = {
		fn: e,
		state: r,
		updatedAt: null,
		owned: null,
		sources: null,
		sourceSlots: null,
		cleanups: null,
		value: t,
		owner: d,
		context: d ? d.context : null,
		pure: n
	};
	return f && f.running && (a.state = 0, a.tState = r), d === null || d !== l && (f && f.running && d.pure ? d.tOwned ? d.tOwned.push(a) : d.tOwned = [a] : d.owned ? d.owned.push(a) : d.owned = [a]), a;
}
function E(e) {
	let t = f && f.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === c) return O(e);
	if (e.suspense && C(e.suspense.inFallback)) return e.suspense.effects.push(e);
	let n = [e];
	for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < g);) {
		if (t && f.disposed.has(e)) return;
		(t ? e.tState : e.state) && n.push(e);
	}
	for (let r = n.length - 1; r >= 0; r--) {
		if (e = n[r], t) {
			let t = e, i = n[r + 1];
			for (; (t = t.owner) && t !== i;) if (f.disposed.has(t)) return;
		}
		if ((t ? e.tState : e.state) === s) w(e);
		else if ((t ? e.tState : e.state) === c) {
			let t = m;
			m = null, D(() => O(e, n[0]), !1), m = t;
		}
	}
}
function D(e, t) {
	if (m) return e();
	let n = !1;
	t || (m = []), h ? n = !0 : h = [], g++;
	try {
		let t = e();
		return ue(n), t;
	} catch (e) {
		n || (h = null), m = null, ge(e);
	}
}
function ue(e) {
	if (m &&= (de(m), null), e) return;
	let t;
	if (f) {
		if (!f.promises.size && !f.queue.size) {
			let e = f.sources, n = f.disposed;
			h.push.apply(h, f.effects), t = f.resolve;
			for (let e of h) "tState" in e && (e.state = e.tState), delete e.tState;
			f = null, D(() => {
				for (let e of n) k(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) k(t.owned[e]);
					t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0;
				}
				ie(!1);
			}, !1);
		} else if (f.running) {
			f.running = !1, f.effects.push.apply(f.effects, h), h = null, ie(!0);
			return;
		}
	}
	let n = h;
	h = null, n.length && D(() => o(n), !1), t && t();
}
function de(e) {
	for (let t = 0; t < e.length; t++) E(e[t]);
}
function O(e, t) {
	let n = f && f.running;
	n ? e.tState = 0 : e.state = 0;
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === s ? i !== t && (!i.updatedAt || i.updatedAt < g) && E(i) : e === c && O(i, t);
		}
	}
}
function fe(e) {
	let t = f && f.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) && (t ? r.tState = c : r.state = c, r.pure ? m.push(r) : h.push(r), r.observers && fe(r));
	}
}
function k(e) {
	let t;
	if (e.sources) for (; e.sources.length;) {
		let t = e.sources.pop(), n = e.sourceSlots.pop(), r = t.observers;
		if (r && r.length) {
			let e = r.pop(), i = t.observerSlots.pop();
			n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i);
		}
	}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) k(e.tOwned[t]);
		delete e.tOwned;
	}
	if (f && f.running && e.pure) pe(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) k(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	f && f.running ? e.tState = 0 : e.state = 0;
}
function pe(e, t) {
	if (t || (e.tState = 0, f.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) pe(e.owned[t]);
}
function me(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function he(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		ge(e, n && n.owner || null);
	}
}
function ge(e, t = d) {
	let n = a && t && t.context && t.context[a], r = me(e);
	if (!n) throw r;
	h ? h.push({
		fn() {
			he(r, n, t);
		},
		state: s
	}) : he(r, n, t);
}
var _e = Symbol("fallback");
function ve(e) {
	for (let t = 0; t < e.length; t++) e[t]();
}
function ye(e, t, n = {}) {
	let i = [], a = [], o = [], s = 0, c = t.length > 1 ? [] : null;
	return te(() => ve(o)), () => {
		let l = e() || [], u = l.length, d, f;
		return l[r], C(() => {
			let e, t, r, m, h, g, v, y, b;
			if (u === 0) s !== 0 && (ve(o), o = [], i = [], a = [], s = 0, c &&= []), n.fallback && (i = [_e], a[0] = _((e) => (o[0] = e, n.fallback())), s = 1);
			else if (s === 0) {
				for (a = Array(u), f = 0; f < u; f++) i[f] = l[f], a[f] = _(p);
				s = u;
			} else {
				for (r = Array(u), m = Array(u), c && (h = Array(u)), g = 0, v = Math.min(s, u); g < v && i[g] === l[g]; g++);
				for (v = s - 1, y = u - 1; v >= g && y >= g && i[v] === l[y]; v--, y--) r[y] = a[v], m[y] = o[v], c && (h[y] = c[v]);
				for (e = /* @__PURE__ */ new Map(), t = Array(y + 1), f = y; f >= g; f--) b = l[f], d = e.get(b), t[f] = d === void 0 ? -1 : d, e.set(b, f);
				for (d = g; d <= v; d++) b = i[d], f = e.get(b), f !== void 0 && f !== -1 ? (r[f] = a[d], m[f] = o[d], c && (h[f] = c[d]), f = t[f], e.set(b, f)) : o[d]();
				for (f = g; f < u; f++) f in r ? (a[f] = r[f], o[f] = m[f], c && (c[f] = h[f], c[f](f))) : a[f] = _(p);
				a = a.slice(0, s = u), i = l.slice(0);
			}
			return a;
		});
		function p(e) {
			if (o[f] = e, c) {
				let [e, n] = v(f);
				return c[f] = n, t(l[f], e);
			}
			return t(l[f]);
		}
	};
}
function A(e, t) {
	return C(() => e(t || {}));
}
var be = (e) => `Stale read from <${e}>.`;
function xe(e) {
	let t = "fallback" in e && { fallback: () => e.fallback };
	return x(ye(() => e.each, e.children, t || void 0));
}
function j(e) {
	let t = e.keyed, n = x(() => e.when, void 0, void 0), r = t ? n : x(n, void 0, { equals: (e, t) => !e == !t });
	return x(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? C(() => a(t ? i : () => {
				if (!C(r)) throw be("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
var M = (e) => x(() => e());
function Se(e, t, n) {
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
function Ce(e, t, n, r = {}) {
	let i;
	return _((r) => {
		i = r, t === document ? e() : F(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function N(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => C(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function P(e, t, n) {
	Te(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function we(e, t, n) {
	return C(() => e(t, n));
}
function F(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return Ee(e, t, r, n);
	b((r) => Ee(e, t(), r, n), r);
}
function Te(t) {
	return !!e.context && !e.done && (!t || t.isConnected);
}
function Ee(e, t, n, r, i) {
	let a = Te(e);
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
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = I(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = I(e, n, r);
	} else if (o === "function") return b(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = Ee(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (De(o, t, n, i)) return b(() => n = Ee(e, o, n, r, !0)), () => n;
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
			if (n = I(e, n, r), s) return n;
		} else c ? n.length === 0 ? Oe(e, o, r) : Se(e, n, o) : (n && I(e), Oe(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = I(e, n, r, t);
			I(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function De(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = De(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = De(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function Oe(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function I(e, t, n, r) {
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
//#endregion
//#region src/GlobalJsonCache.jsx
var ke = null, Ae = null, je = null;
async function Me() {
	return ke ||= await (await fetch("/viewers/cep-solid/compiled-json/titleToFolderIDMap.json")).json(), ke;
}
async function Ne() {
	return Ae ||= await (await fetch("/viewers/cep-solid/compiled-json/folderIDToTitleMap.json")).json(), Ae;
}
async function Pe() {
	return je ||= await (await fetch("/viewers/cep-js/compiled-json/views.json")).json(), je;
}
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function Fe() {
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
var L = Fe();
function Ie(e) {
	L = e;
}
var R = { exec: () => null };
function z(e) {
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
var Le = ((e = "") => {
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
	nextBulletRegex: z((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: z((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: z((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: z((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: z((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: z((e) => RegExp(`^ {0,${e}}>`))
}, Re = /^(?:[ \t]*(?:\n|$))+/, ze = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Be = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, H = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ve = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, He = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ue = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, We = B(Ue).replace(/bull/g, He).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ge = B(Ue).replace(/bull/g, He).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ke = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, qe = /^[^\n]+/, Je = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ye = B(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Je).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Xe = B(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, He).getRegex(), Ze = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Qe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, $e = B("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Qe).replace("tag", Ze).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), et = (e) => B(Ke).replace("hr", H).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ze).getRegex(), tt = et(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), nt = et(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), rt = {
	blockquote: B(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", nt).getRegex(),
	code: ze,
	def: Ye,
	fences: Be,
	heading: Ve,
	hr: H,
	html: $e,
	lheading: We,
	list: Xe,
	newline: Re,
	paragraph: tt,
	table: R,
	text: qe
}, it = B("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", H).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ze).getRegex(), at = {
	...rt,
	lheading: Ge,
	table: it,
	paragraph: B(Ke).replace("hr", H).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", it).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ze).getRegex()
}, ot = {
	...rt,
	html: B("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", Qe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: R,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: B(Ke).replace("hr", H).replace("heading", " *#{1,6} *[^\n]").replace("lheading", We).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, st = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ct = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, lt = /^( {2,}|\\)\n(?!\s*$)/, ut = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, U = /[\p{P}\p{S}]/u, W = /[\s\p{P}\p{S}]/u, G = /[^\s\p{P}\p{S}]/u, dt = B(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex(), ft = /[\p{Pi}\p{Ps}"']/u, pt = /(?!~)[\p{P}\p{S}]/u, mt = /(?!~)[\s\p{P}\p{S}]/u, ht = /(?:[^\s\p{P}\p{S}]|~)/u, gt = B(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Le ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), _t = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, vt = B(_t, "u").replace(/punct/g, U).getRegex(), yt = B(_t, "u").replace(/punct/g, pt).getRegex(), bt = B(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, ft).replace(/punct/g, U).getRegex(), xt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", St = B(xt, "gu").replace(/notPunctSpace/g, G).replace(/punctSpace/g, W).replace(/punct/g, U).getRegex(), Ct = B(xt, "gu").replace(/notPunctSpace/g, ht).replace(/punctSpace/g, mt).replace(/punct/g, pt).getRegex(), wt = B("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, G).replace(/punctSpace/g, W).replace(/punct/g, U).getRegex(), Tt = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, G).replace(/punctSpace/g, W).replace(/punct/g, U).getRegex(), Et = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, G).replace(/punctSpace/g, W).replace(/punct/g, U).getRegex(), Dt = B(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, U).getRegex(), Ot = B("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, G).replace(/punctSpace/g, W).replace(/punct/g, U).getRegex(), kt = B(/\\(punct)/, "gu").replace(/punct/g, U).getRegex(), At = B(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), jt = B(Qe).replace("(?:-->|$)", "-->").getRegex(), Mt = B("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", jt).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Nt = B(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), Pt = B(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Nt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ft = B(/^!?\[(label)\]\[(ref)\]/).replace("label", Nt).replace("ref", Je).getRegex(), It = B(/^!?\[(ref)\](?:\[\])?/).replace("ref", Je).getRegex(), Lt = B("reflink|nolink(?!\\()", "g").replace("reflink", Ft).replace("nolink", It).getRegex(), Rt = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, zt = {
	_backpedal: R,
	anyPunctuation: kt,
	autolink: At,
	blockSkip: gt,
	br: lt,
	code: ct,
	del: R,
	delLDelim: R,
	delRDelim: R,
	emStrongLDelim: vt,
	emStrongRDelimAst: St,
	emStrongRDelimUnd: Tt,
	escape: st,
	link: Pt,
	nolink: It,
	punctuation: dt,
	reflink: Ft,
	reflinkSearch: Lt,
	tag: Mt,
	text: ut,
	url: R
}, Bt = {
	...zt,
	emStrongLDelim: bt,
	emStrongRDelimAst: wt,
	emStrongRDelimUnd: Et,
	link: B(/^!?\[(label)\]\((.*?)\)/).replace("label", Nt).getRegex(),
	reflink: B(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Nt).getRegex()
}, Vt = {
	...zt,
	emStrongRDelimAst: Ct,
	emStrongLDelim: yt,
	delLDelim: Dt,
	delRDelim: Ot,
	url: B(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Rt).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: B(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Rt).getRegex()
}, Ht = {
	...Vt,
	br: B(lt).replace("{2,}", "*").getRegex(),
	text: B(Vt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Ut = {
	normal: rt,
	gfm: at,
	pedantic: ot
}, Wt = {
	normal: zt,
	gfm: Vt,
	breaks: Ht,
	pedantic: Bt
}, Gt = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, Kt = (e) => Gt[e];
function K(e, t) {
	if (t) {
		if (V.escapeTest.test(e)) return e.replace(V.escapeReplace, Kt);
	} else if (V.escapeTestNoEncode.test(e)) return e.replace(V.escapeReplaceNoEncode, Kt);
	return e;
}
function qt(e) {
	try {
		e = encodeURI(e).replace(V.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Jt(e, t) {
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
function q(e, t, n) {
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
function Yt(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && V.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function Xt(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Zt(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function Qt(e, t, n, r, i) {
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
function $t(e, t, n) {
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
var en = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || L;
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
			let e = this.options.pedantic ? t[0] : Yt(t[0]);
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
			let e = t[0], n = $t(e, t[3] || "", this.rules);
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
				let t = q(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceTabChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: q(t[0], "\n"),
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
			raw: q(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = q(t[0], "\n").split("\n"), n = "", r = "", i = [];
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
				let c = Zt(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = Yt(t[0]);
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
				raw: q(t[0], "\n"),
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = Jt(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: q(t[0], "\n"),
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
			for (let e of i) a.rows.push(Jt(e, a.header.length).map((e, t) => ({
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
				raw: q(t[0], "\n"),
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
				let t = q(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = Xt(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), Qt(t, {
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
			return Qt(n, e, n[0], this.lexer, this.rules);
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
}, J = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || L, this.options.tokenizer = this.options.tokenizer || new en(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: V,
			block: Ut.normal,
			inline: Wt.normal
		};
		this.options.pedantic ? (t.block = Ut.pedantic, t.inline = Wt.pedantic) : this.options.gfm && (t.block = Ut.gfm, t.inline = this.options.breaks ? Wt.breaks : Wt.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: Ut,
			inline: Wt
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
}, tn = class {
	options;
	parser;
	constructor(e) {
		this.options = e || L;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(V.notSpaceStart)?.[0], i = e ? e.replace(V.endingNewline, "") + "\n" : "";
		return r ? "<pre><code class=\"language-" + K(r) + "\">" + (n ? i : K(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : K(i, !0)) + "</code></pre>\n";
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
		return `<code>${K(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let a = i ? K(n, !0) : this.parser.parseInline(r), o = qt(e);
		if (o === null) return a;
		e = K(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + K(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = qt(e);
		if (i === null) return K(n);
		e = i;
		let a = `<img src="${K(e)}" alt="${K(n)}"`;
		return t && (a += ` title="${K(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : K(e.text);
	}
}, nn = class {
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
}, Y = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || L, this.options.renderer = this.options.renderer || new tn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new nn();
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
}, rn = class {
	options;
	block;
	constructor(e) {
		this.options = e || L;
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
		return e ? J.lex : J.lexInline;
	}
	provideParser(e = this.block) {
		return e ? Y.parse : Y.parseInline;
	}
}, X = new class {
	defaults = Fe();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Y;
	Renderer = tn;
	TextRenderer = nn;
	Lexer = J;
	Tokenizer = en;
	Hooks = rn;
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
				let t = this.defaults.renderer || new tn(this.defaults);
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
				let t = this.defaults.tokenizer || new en(this.defaults);
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
				let t = this.defaults.hooks || new rn();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = rn.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && rn.passThroughHooksRespectAsync.has(n)) return (async () => {
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
		return J.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Y.parse(e, t ?? this.defaults);
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
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? J.lex : J.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser(e) : e ? Y.parse : Y.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer(e) : e ? J.lex : J.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser(e) : e ? Y.parse : Y.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + K(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function Z(e, t) {
	return X.parse(e, t);
}
Z.options = Z.setOptions = function(e) {
	return X.setOptions(e), Z.defaults = X.defaults, Ie(Z.defaults), Z;
}, Z.getDefaults = Fe, Z.defaults = L;
function an(...e) {
	return X.use(...e), Z.defaults = X.defaults, Ie(Z.defaults), Z;
}
Z.use = an, Z.walkTokens = function(e, t) {
	return X.walkTokens(e, t);
}, Z.parseInline = X.parseInline, Z.Parser = Y, Z.parser = Y.parse, Z.Renderer = tn, Z.TextRenderer = nn, Z.Lexer = J, Z.lexer = J.lex, Z.Tokenizer = en, Z.Hooks = rn, Z.parse = Z, Z.options, Z.setOptions, Z.walkTokens, Z.parseInline, Y.parse, J.lex;
//#endregion
//#region src/MapRenderer.jsx
var on = "/viewers/cep-solid/compiled-json/map_pins.json", sn = "/viewers/cep-js/assets/Map Markers/", cn = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", ln = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", un = {
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
}, dn = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), fn = (e) => String(e).padStart(2, "0"), pn = (e) => `${e.getFullYear()}-${fn(e.getMonth() + 1)}-${fn(e.getDate())}`, mn = (e) => new Date(e, 1, 29).getDate() === 29, hn = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function gn(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function _n() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = cn, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = ln, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function vn() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = ".MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}", document.head.appendChild(e);
}
function yn(e, t) {
	let n = e.getElement();
	if (!n) return;
	let r = n.style.transform.replace(/\s*scale\([^)]*\)\s*$/, "");
	n.style.transform = t ? `${r} scale(2.5)` : r;
}
function bn(e) {
	let t = new URLSearchParams(location.search).get("v") || "cep-js", n = document.createElement("a");
	return n.href = `/?v=${t}&=${encodeURIComponent(e)}`, n.textContent = "Loading…", fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => {
		n.textContent = e.title;
	}).catch(() => {
		n.textContent = "Open article";
	}), n;
}
var xn = null;
function Sn() {
	return xn ||= fetch(on).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = dn(e.s), e._e = dn(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: dn(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), xn = null, [])), xn;
}
async function Cn(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await _n(), vn();
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
	let s = Object.fromEntries(Object.entries(un).map(([e, t]) => [e, i.icon({
		iconUrl: sn + t,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), c = i.layerGroup().addTo(o), l = t.map((e) => {
		let t = i.marker(e.c).bindPopup(n ? e.c.join(", ") : () => bn(e.p));
		return t.on("mouseover", () => {
			t.setZIndexOffset(1e3), yn(t, !0);
		}), t.on("mouseout", () => {
			t.setZIndexOffset(0), yn(t, !1);
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
			let o = gn(e, i);
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
		let e = mn(+p.value) ? 366 : 365;
		m.max = e, +m.value > e && (m.value = e);
	}
	function v() {
		let e = new Date(+p.value, 0);
		e.setDate(+m.value), g.textContent = `${fn(e.getMonth() + 1)}/${fn(e.getDate())}/${e.getFullYear()}`, h.value = pn(e), u(e);
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
		p.value = e.getFullYear(), _(), m.value = hn(e), b();
	}), p.value = d.getFullYear(), _(), m.value = hn(d), v(), { destroy: () => o.remove() };
}
//#endregion
//#region src/GlobalFunctions.jsx
var wn = /*#__PURE__*/ N("<a><img alt loading=lazy class>", !0, !1, !1), Tn = /*#__PURE__*/ N("<a class=CardImageExcerpt>Error?"), En = /*#__PURE__*/ N("<a class=CardImageExcerpt>No Article Content. Come write some!"), Dn = /*#__PURE__*/ N("<a class=CardImageExcerpt>"), On = /*#__PURE__*/ N("<div class=\"MapContainer fade-in\">"), kn = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), An = [
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
async function jn(e) {
	let t = await fetch(`/content/${e}/meta.json`);
	if (!t.ok) throw Error(`meta.json not found for "${e}"`);
	return t.json();
}
async function Mn(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Nn(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function Q(e) {
	return (await Me())[e] ?? null;
}
function Pn() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function $(e) {
	return `/?v=${Pn()}&=${e}`;
}
function Fn(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? An[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function In(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? An[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function Ln(e) {
	return e ? (() => {
		var t = wn(), n = t.firstChild;
		return we((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), b(() => P(t, "href", $(e))), t;
	})() : null;
}
function Rn(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function zn(e, t = 160) {
	let n = await Q(e.title);
	if (!n) return (() => {
		var e = Tn();
		return b(() => P(e, "href", $(n))), e;
	})();
	let r = await Mn(n) || await Nn(n);
	if (!r) return (() => {
		var e = En();
		return b(() => P(e, "href", $(n))), e;
	})();
	let i = Rn(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = En();
		return b(() => P(e, "href", $(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = Dn();
		return F(e, a), b(() => P(e, "href", $(n))), e;
	})();
}
async function Bn(e) {
	if (!e?.pageThumbnailFile) return null;
	let t = await Q(e.title), n = await Q(e.pageThumbnailFile);
	return n ? (() => {
		var e = wn(), r = e.firstChild;
		return we((e) => {
			let t = `/content/${n}/lowphoto.avif`, r = `/content/${n}/photo.avif`;
			e.onload = () => {
				let t = new Image();
				t.onload = () => e.src = r, t.src = r;
			}, e.onerror = () => e.src = r, e.src = t;
		}, r), b(() => P(e, "href", $(t))), e;
	})() : null;
}
function Vn(e) {
	return (() => {
		var t = On();
		return we((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function Hn(e) {
	let t = e.split(/(```[\s\S]*?```|`[^`\n]*`)/);
	return (await Promise.all(t.map(async (e, t) => {
		if (t % 2) return e;
		let n = [...e.matchAll(/(?<![\]\\])\[([^\[\]\n]+)\](?![(\[:])/g)], r = await Promise.all(n.map(async (e) => {
			let t = e[1].trim();
			if (!t || /^[xX]$/.test(t)) return e[0];
			if (/^\d+$/.test(t)) return `<sup><a href="#cite-${t}">(${t})</a></sup>`;
			let n = await Q(t);
			return n ? `[${t}](${$(n)})` : `<div class="BadLink">${t}</div>`;
		})), i = "", a = 0;
		return n.forEach((t, n) => {
			i += e.slice(a, t.index) + r[n], a = t.index + t[0].length;
		}), i + e.slice(a);
	}))).join("");
}
async function Un(e) {
	if (!kn.has((e?.type || "").toLowerCase())) return null;
	let t = await Q(e?.title);
	if (!t) return null;
	let n = (await Sn()).find((e) => e.p === t);
	return n ? Vn((e) => Cn(e, [n], { single: !0 })) : null;
}
//#endregion
//#region src/Renderers.jsx
var Wn = /*#__PURE__*/ N("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong> – </strong> 👁"), Gn = /*#__PURE__*/ N("<h2>Random Articles"), Kn = /*#__PURE__*/ N("<div>Loading…"), qn = /*#__PURE__*/ N("<div id=RandomCards class=Carousel>"), Jn = /*#__PURE__*/ N("<h1 class=article-title>"), Yn = /*#__PURE__*/ N("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), Xn = /*#__PURE__*/ N("<tr><td colspan=2>"), Zn = /*#__PURE__*/ N("<div class=infobox-list><strong>Credits:</strong><ul>"), Qn = /*#__PURE__*/ N("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), $n = /*#__PURE__*/ N("<div class=fade-in>"), er = /*#__PURE__*/ N("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), tr = /*#__PURE__*/ N("<li><strong>:</strong> "), nr = /*#__PURE__*/ N("<div class=\"NoContent fade-in\">No article content. Come write some!"), rr = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comments",
	"theories",
	"meta",
	"transcriptions"
]), ir = 15, ar = 20;
function or(e) {
	switch (e.type) {
		case "Animatronics":
		case "Animatronic Shows":
		case "Animatronic Parts":
		case "Animatronic Preservation":
		case "Stage Variations":
		case "Costumed Characters":
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
		case "Videos":
		case "Steam Comments": return lr(e);
		default: return lr(e);
	}
}
async function sr(e) {
	let t = await Bn(e);
	t ||= await zn(e);
	let n = await Q(e.title), r = await Pe();
	return (() => {
		var i = Wn(), a = i.firstChild, o = a.nextSibling.firstChild, s = o.firstChild.firstChild, c = o.nextSibling, l = c.firstChild, u = l.firstChild;
		return l.nextSibling, F(a, t), F(s, () => e.title), F(l, () => Fn(e.startDate), u), F(l, () => In(e.endDate), null), F(c, () => r[n], null), b(() => P(s, "href", $(n))), i;
	})();
}
function cr() {
	let [e, t] = v([]), [n, r] = v(!1);
	return (async () => {
		let [e, n] = await Promise.all([Ne(), Pe()]), i = Object.keys(e).sort(() => Math.random() - .5), a = 0;
		for (let e = 0; e < i.length && a < ir; e += 20) await Promise.all(i.slice(e, e + 20).map(async (e) => {
			if (a >= ir || !(n[e] > ar)) return;
			let r = await jn(e).catch(() => null);
			if (!r || rr.has((r.type || "").toLowerCase()) || a >= ir) return;
			a++;
			let i = await sr(r), o = n[e];
			t((e) => {
				let t = [...e, {
					views: o,
					card: i
				}];
				return t.sort((e, t) => t.views - e.views), t;
			});
		}));
		r(!0);
	})(), [Gn(), (() => {
		var t = qn();
		return F(t, A(xe, {
			get each() {
				return e();
			},
			children: (e) => e.card
		}), null), F(t, A(j, {
			get when() {
				return M(() => !n())() && e().length === 0;
			},
			get children() {
				return Kn();
			}
		}), null), t;
	})()];
}
function lr(e) {
	let [t] = S(async () => Ln(await Q(e.pageThumbnailFile))), [n] = S(() => Un(e)), [r] = S(async () => {
		let t = await Q(e.title), [n, r] = await Promise.all([Mn(t).catch(() => ""), Nn(t).catch(() => "")]);
		return {
			md: await Hn(n),
			old: await Hn(r)
		};
	});
	return [(() => {
		var t = Jn();
		return F(t, () => e.title), t;
	})(), (() => {
		var i = er(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
		return F(o, A(j, {
			get when() {
				return M(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), F(c, () => Fn(e.startDate), l), F(c, () => In(e.endDate), u), F(s, A(j, {
			get when() {
				return e.sqft;
			},
			get children() {
				var t = Yn(), n = t.firstChild.nextSibling, r = n.firstChild;
				return F(n, () => e.sqft, r), t;
			}
		}), null), F(s, A(j, {
			get when() {
				return M(() => !n.loading)() && n();
			},
			get children() {
				var e = Xn(), t = e.firstChild;
				return F(t, n), e;
			}
		}), null), F(a, A(j, {
			get when() {
				return e.credits?.length;
			},
			get children() {
				var t = Zn(), n = t.firstChild.nextSibling;
				return F(n, A(xe, {
					get each() {
						return e.credits;
					},
					children: (e) => (() => {
						var t = tr(), n = t.firstChild, r = n.firstChild;
						return n.nextSibling, F(n, () => e.role, r), F(t, () => e.n, null), t;
					})()
				})), t;
			}
		}), null), F(d, A(j, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return Kn();
			},
			get children() {
				return A(j, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return nr();
					},
					get children() {
						return [A(j, {
							get when() {
								return M(() => !r().md)() && r().old;
							},
							get children() {
								return Qn();
							}
						}), (() => {
							var e = $n();
							return b(() => e.innerHTML = Z.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		})), i;
	})()];
}
//#endregion
//#region src/App.jsx
var ur = /*#__PURE__*/ N("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), dr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), fr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), pr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), mr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), hr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), gr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function _r(e) {
	return [
		ur(),
		dr(),
		fr(),
		pr(),
		mr(),
		hr(),
		gr(),
		M(() => or(e)),
		M(cr)
	];
}
//#endregion
//#region index.jsx
async function vr(e, t) {
	let n = await jn(e.get(""));
	Ce(() => _r(n), t);
}
//#endregion
export { vr as render };
