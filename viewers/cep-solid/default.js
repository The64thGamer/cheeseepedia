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
function n(t) {
	e.context = t;
}
var r = (e, t) => e === t, i = Symbol("solid-track"), a = { equals: r }, o = null, s = pe, c = 1, l = 2, u = {
	owned: null,
	cleanups: null,
	context: null,
	owner: null
}, d = {}, f = null, p = null, m = null, h = null, g = null, _ = 0;
function v(e, t) {
	let n = m, r = f, i = e.length === 0, a = t === void 0 ? r : t, o = i ? u : {
		owned: null,
		cleanups: null,
		context: a ? a.context : null,
		owner: a
	}, s = i ? e : () => e(() => w(() => k(o)));
	f = o, m = null;
	try {
		return O(s, !0);
	} finally {
		m = n, f = r;
	}
}
function y(e, t) {
	t = t ? Object.assign({}, a, t) : a;
	let n = {
		value: e,
		observers: null,
		observerSlots: null,
		comparator: t.equals || void 0
	};
	return [le.bind(n), (e) => (typeof e == "function" && (e = p && p.running && p.sources.has(n) ? e(n.tValue) : e(n.value)), ue(n, e))];
}
function b(e, t, n) {
	T(E(e, t, !0, c));
}
function x(e, t, n) {
	T(E(e, t, !1, c));
}
function ee(e, t, n) {
	s = me;
	let r = E(e, t, !1, c), i = ce && oe(ce);
	i && (r.suspense = i), (!n || !n.render) && (r.user = !0), g ? g.push(r) : T(r);
}
function S(e, t, n) {
	n = n ? Object.assign({}, a, n) : a;
	let r = E(e, t, !0, 0);
	return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, T(r), le.bind(r);
}
function te(e) {
	return e && typeof e == "object" && "then" in e;
}
function C(t, n, r) {
	let i, a, o;
	typeof n == "function" ? (i = t, a = n, o = r || {}) : (i = !0, a = t, o = n || {});
	let s = null, c = d, l = null, u = !1, h = !1, g = "initialValue" in o, _ = typeof i == "function" && S(i), v = /* @__PURE__ */ new Set(), [x, ee] = (o.storage || y)(o.initialValue), [C, ie] = y(void 0), [ae, se] = y(void 0, { equals: !1 }), [le, ue] = y(g ? "ready" : "unresolved");
	f && ne(() => {
		for (let e of v.keys()) e.decrement();
		v.clear(), p && s && p.promises.delete(s), s = null;
	}), e.context && (l = e.getNextContextId(), o.ssrLoadFrom === "initial" ? c = o.initialValue : e.load && e.has(l) && (c = e.load(l)));
	function T(e, t, n, r) {
		return s === e && (s = null, r !== void 0 && (g = !0), (e === c || t === c) && o.onHydrated && queueMicrotask(() => o.onHydrated(r, { value: t })), c = d, p && e && u ? (p.promises.delete(e), u = !1, O(() => {
			p.running = !0, de(t, n);
		}, !1)) : de(t, n)), t;
	}
	function de(e, t) {
		O(() => {
			t === void 0 && ee(() => e), ue(t === void 0 ? g ? "ready" : "unresolved" : "errored"), ie(t);
			for (let e of v.keys()) e.decrement();
			v.clear();
		}, !1);
	}
	function E() {
		let e = ce && oe(ce), t = x(), n = C();
		if (n !== void 0 && !s) throw n;
		return m && !m.user && e && b(() => {
			ae(), s && (e.resolved && p && u ? p.promises.add(s) : v.has(e) || (e.increment(), v.add(e)));
		}), t;
	}
	function D(e = !0) {
		if (e !== !1 && h) return;
		h = !1;
		let t = _ ? _() : i;
		if (u = p && p.running, t == null || t === !1) {
			T(s, w(x));
			return;
		}
		p && s && p.promises.delete(s);
		let n, r = c === d ? w(() => {
			try {
				return a(t, {
					value: x(),
					refetching: e
				});
			} catch (e) {
				n = e;
			}
		}) : c;
		if (n !== void 0) {
			T(s, void 0, ve(n), t);
			return;
		}
		return te(r) ? (s = r, "v" in r ? (r.s === 1 ? T(s, r.v, void 0, t) : T(s, void 0, ve(r.v), t), r) : (h = !0, queueMicrotask(() => h = !1), O(() => {
			ue(g ? "refreshing" : "pending"), se();
		}, !1), r.then((e) => T(r, e, void 0, t), (e) => T(r, void 0, ve(e), t)))) : (T(s, r, void 0, t), r);
	}
	Object.defineProperties(E, {
		state: { get: () => le() },
		error: { get: () => C() },
		loading: { get() {
			let e = le();
			return e === "pending" || e === "refreshing";
		} },
		latest: { get() {
			if (!g) return E();
			let e = C();
			if (e && !s) throw e;
			return x();
		} }
	});
	let fe = f;
	return _ ? b(() => (fe = f, D(!1))) : D(!1), [E, {
		refetch: (e) => re(fe, () => D(e)),
		mutate: ee
	}];
}
function w(e) {
	if (m === null) return e();
	let t = m;
	m = null;
	try {
		return e();
	} finally {
		m = t;
	}
}
function ne(e) {
	return f === null || (f.cleanups === null ? f.cleanups = [e] : f.cleanups.push(e)), e;
}
function re(e, t) {
	let n = f, r = m;
	f = e, m = null;
	try {
		return O(t, !0);
	} catch (e) {
		be(e);
	} finally {
		f = n, m = r;
	}
}
var [ie, ae] = /*@__PURE__*/ y(!1);
function oe(e) {
	let t;
	return f && f.context && (t = f.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function se(e) {
	let t = S(e), n = S(() => xe(t()));
	return n.toArray = () => {
		let e = n();
		return Array.isArray(e) ? e : e == null ? [] : [e];
	}, n;
}
var ce;
function le() {
	let e = p && p.running;
	if (this.sources && (e ? this.tState : this.state)) {
		if ((e ? this.tState : this.state) === c) T(this);
		else {
			let e = h;
			h = null, O(() => he(this), !1), h = e;
		}
	}
	if (m) {
		let e = this.observers;
		if (!e || e[e.length - 1] !== m) {
			let t = e ? e.length : 0;
			m.sources ? (m.sources.push(this), m.sourceSlots.push(t)) : (m.sources = [this], m.sourceSlots = [t]), e ? (e.push(m), this.observerSlots.push(m.sources.length - 1)) : (this.observers = [m], this.observerSlots = [m.sources.length - 1]);
		}
	}
	return e && p.sources.has(this) ? this.tValue : this.value;
}
function ue(e, t, n) {
	let r = p && p.running && p.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (p) {
			let r = p.running;
			(r || !n && p.sources.has(e)) && (p.sources.add(e), e.tValue = t), r || (e.value = t);
		} else e.value = t;
		e.observers && e.observers.length && O(() => {
			for (let t = 0; t < e.observers.length; t += 1) {
				let n = e.observers[t], r = p && p.running;
				r && p.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? h.push(n) : g.push(n), n.observers && ge(n)), r ? n.tState = c : n.state = c);
			}
			if (h.length > 1e6) throw h = [], Error();
		}, !1);
	}
	return t;
}
function T(e) {
	if (!e.fn) return;
	k(e);
	let t = _;
	de(e, p && p.running && p.sources.has(e) ? e.tValue : e.value, t), p && !p.running && p.sources.has(e) && queueMicrotask(() => {
		O(() => {
			p && (p.running = !0), m = f = e, de(e, e.tValue, t), m = f = null;
		}, !1);
	});
}
function de(e, t, n) {
	let r, i = f, a = m;
	m = f = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return e.pure && (p && p.running ? (e.tState = c, e.tOwned && e.tOwned.forEach(k), e.tOwned = void 0) : (e.state = c, e.owned && e.owned.forEach(k), e.owned = null)), e.updatedAt = n + 1, be(t);
	} finally {
		m = a, f = i;
	}
	(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? ue(e, r, !0) : p && p.running && e.pure ? (p.sources.has(e) || (e.value = r), p.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function E(e, t, n, r = c, i) {
	let a = {
		fn: e,
		state: r,
		updatedAt: null,
		owned: null,
		sources: null,
		sourceSlots: null,
		cleanups: null,
		value: t,
		owner: f,
		context: f ? f.context : null,
		pure: n
	};
	return p && p.running && (a.state = 0, a.tState = r), f === null || f !== u && (p && p.running && f.pure ? f.tOwned ? f.tOwned.push(a) : f.tOwned = [a] : f.owned ? f.owned.push(a) : f.owned = [a]), a;
}
function D(e) {
	let t = p && p.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === l) return he(e);
	if (e.suspense && w(e.suspense.inFallback)) return e.suspense.effects.push(e);
	let n = [e];
	for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < _);) {
		if (t && p.disposed.has(e)) return;
		(t ? e.tState : e.state) && n.push(e);
	}
	for (let r = n.length - 1; r >= 0; r--) {
		if (e = n[r], t) {
			let t = e, i = n[r + 1];
			for (; (t = t.owner) && t !== i;) if (p.disposed.has(t)) return;
		}
		if ((t ? e.tState : e.state) === c) T(e);
		else if ((t ? e.tState : e.state) === l) {
			let t = h;
			h = null, O(() => he(e, n[0]), !1), h = t;
		}
	}
}
function O(e, t) {
	if (h) return e();
	let n = !1;
	t || (h = []), g ? n = !0 : g = [], _++;
	try {
		let t = e();
		return fe(n), t;
	} catch (e) {
		n || (g = null), h = null, be(e);
	}
}
function fe(e) {
	if (h &&= (pe(h), null), e) return;
	let t;
	if (p) {
		if (!p.promises.size && !p.queue.size) {
			let e = p.sources, n = p.disposed;
			g.push.apply(g, p.effects), t = p.resolve;
			for (let e of g) "tState" in e && (e.state = e.tState), delete e.tState;
			p = null, O(() => {
				for (let e of n) k(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) k(t.owned[e]);
					t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0;
				}
				ae(!1);
			}, !1);
		} else if (p.running) {
			p.running = !1, p.effects.push.apply(p.effects, g), g = null, ae(!0);
			return;
		}
	}
	let n = g;
	g = null, n.length && O(() => s(n), !1), t && t();
}
function pe(e) {
	for (let t = 0; t < e.length; t++) D(e[t]);
}
function me(t) {
	let r, i = 0;
	for (r = 0; r < t.length; r++) {
		let e = t[r];
		e.user ? t[i++] = e : D(e);
	}
	if (e.context) {
		if (e.count) {
			e.effects ||= [], e.effects.push(...t.slice(0, i));
			return;
		}
		n();
	}
	for (e.effects && (e.done || !e.count) && (t = [...e.effects, ...t], i += e.effects.length, delete e.effects), r = 0; r < i; r++) D(t[r]);
}
function he(e, t) {
	let n = p && p.running;
	n ? e.tState = 0 : e.state = 0;
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === c ? i !== t && (!i.updatedAt || i.updatedAt < _) && D(i) : e === l && he(i, t);
		}
	}
}
function ge(e) {
	let t = p && p.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) && (t ? r.tState = l : r.state = l, r.pure ? h.push(r) : g.push(r), r.observers && ge(r));
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
	if (p && p.running && e.pure) _e(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) k(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	p && p.running ? e.tState = 0 : e.state = 0;
}
function _e(e, t) {
	if (t || (e.tState = 0, p.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) _e(e.owned[t]);
}
function ve(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function ye(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		be(e, n && n.owner || null);
	}
}
function be(e, t = f) {
	let n = o && t && t.context && t.context[o], r = ve(e);
	if (!n) throw r;
	g ? g.push({
		fn() {
			ye(r, n, t);
		},
		state: c
	}) : ye(r, n, t);
}
function xe(e) {
	if (typeof e == "function" && !e.length) return xe(e());
	if (Array.isArray(e)) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r = xe(e[n]);
			if (Array.isArray(r)) {
				if (r.length < 32768) t.push.apply(t, r);
				else for (let e = 0; e < r.length; e++) t.push(r[e]);
			} else t.push(r);
		}
		return t;
	}
	return e;
}
var Se = Symbol("fallback");
function Ce(e) {
	for (let t = 0; t < e.length; t++) e[t]();
}
function we(e, t, n = {}) {
	let r = [], a = [], o = [], s = 0, c = t.length > 1 ? [] : null;
	return ne(() => Ce(o)), () => {
		let l = e() || [], u = l.length, d, f;
		return l[i], w(() => {
			let e, t, i, m, h, g, _, y, b;
			if (u === 0) s !== 0 && (Ce(o), o = [], r = [], a = [], s = 0, c &&= []), n.fallback && (r = [Se], a[0] = v((e) => (o[0] = e, n.fallback())), s = 1);
			else if (s === 0) {
				for (a = Array(u), f = 0; f < u; f++) r[f] = l[f], a[f] = v(p);
				s = u;
			} else {
				for (i = Array(u), m = Array(u), c && (h = Array(u)), g = 0, _ = Math.min(s, u); g < _ && r[g] === l[g]; g++);
				for (_ = s - 1, y = u - 1; _ >= g && y >= g && r[_] === l[y]; _--, y--) i[y] = a[_], m[y] = o[_], c && (h[y] = c[_]);
				for (e = /* @__PURE__ */ new Map(), t = Array(y + 1), f = y; f >= g; f--) b = l[f], d = e.get(b), t[f] = d === void 0 ? -1 : d, e.set(b, f);
				for (d = g; d <= _; d++) b = r[d], f = e.get(b), f !== void 0 && f !== -1 ? (i[f] = a[d], m[f] = o[d], c && (h[f] = c[d]), f = t[f], e.set(b, f)) : o[d]();
				for (f = g; f < u; f++) f in i ? (a[f] = i[f], o[f] = m[f], c && (c[f] = h[f], c[f](f))) : a[f] = v(p);
				a = a.slice(0, s = u), r = l.slice(0);
			}
			return a;
		});
		function p(e) {
			if (o[f] = e, c) {
				let [e, n] = y(f);
				return c[f] = n, t(l[f], e);
			}
			return t(l[f]);
		}
	};
}
function A(e, t) {
	return w(() => e(t || {}));
}
var Te = (e) => `Stale read from <${e}>.`;
function Ee(e) {
	let t = "fallback" in e && { fallback: () => e.fallback };
	return S(we(() => e.each, e.children, t || void 0));
}
function j(e) {
	let t = e.keyed, n = S(() => e.when, void 0, void 0), r = t ? n : S(n, void 0, { equals: (e, t) => !e == !t });
	return S(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? w(() => a(t ? i : () => {
				if (!w(r)) throw Te("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
function De(e) {
	let t = se(() => e.children), n = S(() => {
		let e = t(), n = Array.isArray(e) ? e : [e], r = () => void 0;
		for (let e = 0; e < n.length; e++) {
			let t = e, i = n[e], a = r, o = S(() => a() ? void 0 : i.when, void 0, void 0), s = i.keyed ? o : S(o, void 0, { equals: (e, t) => !e == !t });
			r = () => a() || (s() ? [
				t,
				o,
				i
			] : void 0);
		}
		return r;
	});
	return S(() => {
		let t = n()();
		if (!t) return e.fallback;
		let [r, i, a] = t, o = a.children;
		return typeof o == "function" && o.length > 0 ? w(() => o(a.keyed ? i() : () => {
			if (w(n)()?.[0] !== r) throw Te("Match");
			return i();
		})) : o;
	}, void 0, void 0);
}
function Oe(e) {
	return e;
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
var M = (e) => S(() => e());
function ke(e, t, n) {
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
var Ae = "_$DX_DELEGATE";
function je(e, t, n, r = {}) {
	let i;
	return v((r) => {
		i = r, t === document ? e() : F(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function N(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => w(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function Me(e, t = window.document) {
	let n = t[Ae] || (t[Ae] = /* @__PURE__ */ new Set());
	for (let r = 0, i = e.length; r < i; r++) {
		let i = e[r];
		n.has(i) || (n.add(i), t.addEventListener(i, Ie));
	}
}
function P(e, t, n) {
	Fe(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ne(e, t) {
	Fe(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function Pe(e, t, n) {
	return w(() => e(t, n));
}
function F(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return Le(e, t, r, n);
	x((r) => Le(e, t(), r, n), r);
}
function Fe(t) {
	return !!e.context && !e.done && (!t || t.isConnected);
}
function Ie(t) {
	if (e.registry && e.events && e.events.find(([e, n]) => n === t)) return;
	let n = t.target, r = `$$${t.type}`, i = t.target, a = t.currentTarget, o = (e) => Object.defineProperty(t, "target", {
		configurable: !0,
		value: e
	}), s = () => {
		let e = n[r];
		if (e && !n.disabled) {
			let i = n[`${r}Data`];
			if (i === void 0 ? e.call(n, t) : e.call(n, i, t), t.cancelBubble) return;
		}
		return n.host && typeof n.host != "string" && !n.host._$host && n.contains(t.target) && o(n.host), !0;
	}, c = () => {
		for (; s() && (n = n._$host || n.parentNode || n.host););
	};
	if (Object.defineProperty(t, "currentTarget", {
		configurable: !0,
		get() {
			return n || document;
		}
	}), e.registry && !e.done && (e.done = _$HY.done = !0), t.composedPath) {
		let e = t.composedPath();
		o(e[0]);
		for (let t = 0; t < e.length - 2 && (n = e[t], s()); t++) {
			if (n._$host) {
				n = n._$host, c();
				break;
			}
			if (n.parentNode === a) break;
		}
	} else c();
	o(i);
}
function Le(e, t, n, r, i) {
	let a = Fe(e);
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
	} else if (o === "function") return x(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = Le(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (Re(o, t, n, i)) return x(() => n = Le(e, o, n, r, !0)), () => n;
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
		} else c ? n.length === 0 ? ze(e, o, r) : ke(e, n, o) : (n && I(e), ze(e, o));
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
function Re(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = Re(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = Re(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function ze(e, t, n = null) {
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
var Be = null, Ve = null, He = null;
async function Ue() {
	return Be ||= await (await fetch("/viewers/cep-solid/compiled-json/titleToFolderIDMap.json")).json(), Be;
}
async function We() {
	return Ve ||= await (await fetch("/viewers/cep-js/compiled-json/views.json")).json(), Ve;
}
async function Ge() {
	return He ||= await (await fetch("/viewers/cep-solid/compiled-json/typeToIDList.json")).json(), He;
}
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function Ke() {
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
var L = Ke();
function qe(e) {
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
var Je = ((e = "") => {
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
}, Ye = /^(?:[ \t]*(?:\n|$))+/, Xe = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ze = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Qe = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, $e = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, et = / {0,3}(?:[*+-]|\d{1,9}[.)])/, tt = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, nt = B(tt).replace(/bull/g, et).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), rt = B(tt).replace(/bull/g, et).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), it = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, at = /^[^\n]+/, ot = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, st = B(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ot).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ct = B(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, et).getRegex(), lt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ut = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, dt = B("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ut).replace("tag", lt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ft = (e) => B(it).replace("hr", Qe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lt).getRegex(), pt = ft(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), mt = ft(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), ht = {
	blockquote: B(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", mt).getRegex(),
	code: Xe,
	def: st,
	fences: Ze,
	heading: $e,
	hr: Qe,
	html: dt,
	lheading: nt,
	list: ct,
	newline: Ye,
	paragraph: pt,
	table: R,
	text: at
}, gt = B("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Qe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lt).getRegex(), _t = {
	...ht,
	lheading: rt,
	table: gt,
	paragraph: B(it).replace("hr", Qe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gt).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", lt).getRegex()
}, vt = {
	...ht,
	html: B("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", ut).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: R,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: B(it).replace("hr", Qe).replace("heading", " *#{1,6} *[^\n]").replace("lheading", nt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, yt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, bt = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, xt = /^( {2,}|\\)\n(?!\s*$)/, St = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, H = /[\p{P}\p{S}]/u, U = /[\s\p{P}\p{S}]/u, Ct = /[^\s\p{P}\p{S}]/u, wt = B(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, U).getRegex(), Tt = /[\p{Pi}\p{Ps}"']/u, Et = /(?!~)[\p{P}\p{S}]/u, Dt = /(?!~)[\s\p{P}\p{S}]/u, Ot = /(?:[^\s\p{P}\p{S}]|~)/u, kt = B(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Je ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), At = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, jt = B(At, "u").replace(/punct/g, H).getRegex(), Mt = B(At, "u").replace(/punct/g, Et).getRegex(), Nt = B(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, Tt).replace(/punct/g, H).getRegex(), Pt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Ft = B(Pt, "gu").replace(/notPunctSpace/g, Ct).replace(/punctSpace/g, U).replace(/punct/g, H).getRegex(), It = B(Pt, "gu").replace(/notPunctSpace/g, Ot).replace(/punctSpace/g, Dt).replace(/punct/g, Et).getRegex(), Lt = B("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Ct).replace(/punctSpace/g, U).replace(/punct/g, H).getRegex(), Rt = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ct).replace(/punctSpace/g, U).replace(/punct/g, H).getRegex(), zt = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Ct).replace(/punctSpace/g, U).replace(/punct/g, H).getRegex(), Bt = B(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, H).getRegex(), Vt = B("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Ct).replace(/punctSpace/g, U).replace(/punct/g, H).getRegex(), Ht = B(/\\(punct)/, "gu").replace(/punct/g, H).getRegex(), Ut = B(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Wt = B(ut).replace("(?:-->|$)", "-->").getRegex(), Gt = B("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Wt).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Kt = B(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), qt = B(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Kt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Jt = B(/^!?\[(label)\]\[(ref)\]/).replace("label", Kt).replace("ref", ot).getRegex(), Yt = B(/^!?\[(ref)\](?:\[\])?/).replace("ref", ot).getRegex(), Xt = B("reflink|nolink(?!\\()", "g").replace("reflink", Jt).replace("nolink", Yt).getRegex(), Zt = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Qt = {
	_backpedal: R,
	anyPunctuation: Ht,
	autolink: Ut,
	blockSkip: kt,
	br: xt,
	code: bt,
	del: R,
	delLDelim: R,
	delRDelim: R,
	emStrongLDelim: jt,
	emStrongRDelimAst: Ft,
	emStrongRDelimUnd: Rt,
	escape: yt,
	link: qt,
	nolink: Yt,
	punctuation: wt,
	reflink: Jt,
	reflinkSearch: Xt,
	tag: Gt,
	text: St,
	url: R
}, $t = {
	...Qt,
	emStrongLDelim: Nt,
	emStrongRDelimAst: Lt,
	emStrongRDelimUnd: zt,
	link: B(/^!?\[(label)\]\((.*?)\)/).replace("label", Kt).getRegex(),
	reflink: B(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Kt).getRegex()
}, en = {
	...Qt,
	emStrongRDelimAst: It,
	emStrongLDelim: Mt,
	delLDelim: Bt,
	delRDelim: Vt,
	url: B(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Zt).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: B(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Zt).getRegex()
}, tn = {
	...en,
	br: B(xt).replace("{2,}", "*").getRegex(),
	text: B(en.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, nn = {
	normal: ht,
	gfm: _t,
	pedantic: vt
}, rn = {
	normal: Qt,
	gfm: en,
	breaks: tn,
	pedantic: $t
}, an = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, on = (e) => an[e];
function W(e, t) {
	if (t) {
		if (V.escapeTest.test(e)) return e.replace(V.escapeReplace, on);
	} else if (V.escapeTestNoEncode.test(e)) return e.replace(V.escapeReplaceNoEncode, on);
	return e;
}
function sn(e) {
	try {
		e = encodeURI(e).replace(V.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function cn(e, t) {
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
function ln(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && V.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function un(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function dn(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function fn(e, t, n, r, i) {
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
function pn(e, t, n) {
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
var mn = class {
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
			let e = this.options.pedantic ? t[0] : ln(t[0]);
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
			let e = t[0], n = pn(e, t[3] || "", this.rules);
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
				let c = dn(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = ln(t[0]);
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
		let n = cn(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
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
			for (let e of i) a.rows.push(cn(e, a.header.length).map((e, t) => ({
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
				let e = un(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), fn(t, {
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
			return fn(n, e, n[0], this.lexer, this.rules);
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
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || L, this.options.tokenizer = this.options.tokenizer || new mn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: V,
			block: nn.normal,
			inline: rn.normal
		};
		this.options.pedantic ? (t.block = nn.pedantic, t.inline = rn.pedantic) : this.options.gfm && (t.block = nn.gfm, t.inline = this.options.breaks ? rn.breaks : rn.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: nn,
			inline: rn
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
}, hn = class {
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
		let a = i ? W(n, !0) : this.parser.parseInline(r), o = sn(e);
		if (o === null) return a;
		e = W(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + W(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = sn(e);
		if (i === null) return W(n);
		e = i;
		let a = `<img src="${W(e)}" alt="${W(n)}"`;
		return t && (a += ` title="${W(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : W(e.text);
	}
}, gn = class {
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
		this.options = e || L, this.options.renderer = this.options.renderer || new hn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new gn();
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
}, _n = class {
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
		return e ? K.lex : K.lexInline;
	}
	provideParser(e = this.block) {
		return e ? q.parse : q.parseInline;
	}
}, J = new class {
	defaults = Ke();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = q;
	Renderer = hn;
	TextRenderer = gn;
	Lexer = K;
	Tokenizer = mn;
	Hooks = _n;
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
				let t = this.defaults.renderer || new hn(this.defaults);
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
				let t = this.defaults.tokenizer || new mn(this.defaults);
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
				let t = this.defaults.hooks || new _n();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = _n.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && _n.passThroughHooksRespectAsync.has(n)) return (async () => {
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
	return J.setOptions(e), Y.defaults = J.defaults, qe(Y.defaults), Y;
}, Y.getDefaults = Ke, Y.defaults = L;
function vn(...e) {
	return J.use(...e), Y.defaults = J.defaults, qe(Y.defaults), Y;
}
Y.use = vn, Y.walkTokens = function(e, t) {
	return J.walkTokens(e, t);
}, Y.parseInline = J.parseInline, Y.Parser = q, Y.parser = q.parse, Y.Renderer = hn, Y.TextRenderer = gn, Y.Lexer = K, Y.lexer = K.lex, Y.Tokenizer = mn, Y.Hooks = _n, Y.parse = Y, Y.options, Y.setOptions, Y.walkTokens, Y.parseInline, q.parse, K.lex;
//#endregion
//#region src/MapRenderer.jsx
var yn = "/viewers/cep-solid/compiled-json/map_pins.json", bn = "/viewers/cep-js/assets/Map Markers/", xn = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", Sn = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", Cn = {
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
}, wn = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), Tn = (e) => String(e).padStart(2, "0"), En = (e) => `${e.getFullYear()}-${Tn(e.getMonth() + 1)}-${Tn(e.getDate())}`, Dn = (e) => new Date(e, 1, 29).getDate() === 29, On = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function kn(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function An() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = xn, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = Sn, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function jn() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = ".MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}", document.head.appendChild(e);
}
function Mn(e, t) {
	let n = e.getElement();
	if (!n) return;
	let r = n.style.transform.replace(/\s*scale\([^)]*\)\s*$/, "");
	n.style.transform = t ? `${r} scale(2.5)` : r;
}
function Nn(e) {
	let t = new URLSearchParams(location.search).get("v") || "cep-js", n = document.createElement("a");
	return n.href = `/?v=${t}&=${encodeURIComponent(e)}`, n.textContent = "Loading…", fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => {
		n.textContent = e.title;
	}).catch(() => {
		n.textContent = "Open article";
	}), n;
}
var Pn = null;
function Fn() {
	return Pn ||= fetch(yn).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = wn(e.s), e._e = wn(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: wn(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), Pn = null, [])), Pn;
}
async function In(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await An(), jn();
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
	let s = Object.fromEntries(Object.entries(Cn).map(([e, t]) => [e, i.icon({
		iconUrl: bn + t,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), c = i.layerGroup().addTo(o), l = t.map((e) => {
		let t = i.marker(e.c).bindPopup(n ? e.c.join(", ") : () => Nn(e.p));
		return t.on("mouseover", () => {
			t.setZIndexOffset(1e3), Mn(t, !0);
		}), t.on("mouseout", () => {
			t.setZIndexOffset(0), Mn(t, !1);
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
			let o = kn(e, i);
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
		let e = Dn(+p.value) ? 366 : 365;
		m.max = e, +m.value > e && (m.value = e);
	}
	function v() {
		let e = new Date(+p.value, 0);
		e.setDate(+m.value), g.textContent = `${Tn(e.getMonth() + 1)}/${Tn(e.getDate())}/${e.getFullYear()}`, h.value = En(e), u(e);
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
		p.value = e.getFullYear(), _(), m.value = On(e), b();
	}), p.value = d.getFullYear(), _(), m.value = On(d), v(), { destroy: () => o.remove() };
}
//#endregion
//#region src/GlobalFunctions.jsx
var Ln = /*#__PURE__*/ N("<a><img alt loading=lazy class>", !0, !1, !1), Rn = /*#__PURE__*/ N("<a class=CardImageExcerpt>Error?"), zn = /*#__PURE__*/ N("<a class=CardImageExcerpt>No Article Content. Come write some!"), Bn = /*#__PURE__*/ N("<a class=CardImageExcerpt>"), Vn = /*#__PURE__*/ N("<div class=\"MapContainer fade-in\">"), Hn = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), Un = [
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
async function Wn(e) {
	let t = await fetch(`/content/${e}/meta.json`);
	if (!t.ok) throw Error(`meta.json not found for "${e}"`);
	return t.json();
}
async function Gn(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function Kn(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function X(e) {
	return (await Ue())[e] ?? null;
}
function qn() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function Z(e) {
	return `/?v=${qn()}&=${e}`;
}
function Q(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Un[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function Jn(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? Un[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function Yn(e) {
	return e ? (() => {
		var t = Ln(), n = t.firstChild;
		return Pe((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), x(() => P(t, "href", Z(e))), t;
	})() : null;
}
function Xn(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function Zn(e, t = 160) {
	let n = await X(e.title);
	if (!n) return (() => {
		var e = Rn();
		return x(() => P(e, "href", Z(n))), e;
	})();
	let r = await Gn(n) || await Kn(n);
	if (!r) return (() => {
		var e = zn();
		return x(() => P(e, "href", Z(n))), e;
	})();
	let i = Xn(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = zn();
		return x(() => P(e, "href", Z(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = Bn();
		return F(e, a), x(() => P(e, "href", Z(n))), e;
	})();
}
function Qn(e, t = null, n) {
	try {
		let r = localStorage.getItem(e);
		if (r === null) return t;
		let i = typeof t == "string" ? r : JSON.parse(r);
		return n && !n(i) ? t : i;
	} catch {
		return t;
	}
}
function $n(e, t) {
	try {
		return localStorage.setItem(e, typeof t == "string" ? t : JSON.stringify(t)), !0;
	} catch {
		return !1;
	}
}
async function er(e) {
	let t = await X(e.title);
	if (!t) return null;
	let n = null;
	return e?.pageThumbnailFile ? n = await X(e.pageThumbnailFile) : await new Promise((e) => {
		let n = new Image();
		n.onload = () => e(!0), n.onerror = () => e(!1), n.src = `/content/${t}/photo.avif`;
	}) && (n = t), n ? (() => {
		var e = Ln(), r = e.firstChild;
		return Pe((e) => {
			let t = `/content/${n}/lowphoto.avif`, r = `/content/${n}/photo.avif`;
			e.onload = () => {
				let t = new Image();
				t.onload = () => e.src = r, t.src = r;
			}, e.onerror = () => e.src = r, e.src = t;
		}, r), x(() => P(e, "href", Z(t))), e;
	})() : null;
}
function tr(e) {
	return (() => {
		var t = Vn();
		return Pe((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function nr(e) {
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
async function rr(e) {
	if (!Hn.has((e?.type || "").toLowerCase())) return null;
	let t = await X(e?.title);
	if (!t) return null;
	let n = (await Fn()).find((e) => e.p === t);
	return n ? tr((e) => In(e, [n], { single: !0 })) : null;
}
//#endregion
//#region src/Renderers.jsx
var ir = /*#__PURE__*/ N("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), ar = /*#__PURE__*/ N("<div class=Footer>Last build on: <span id=StatBuildDate>???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), or = /*#__PURE__*/ N("<div class=Header><div class=SplashText id=SpashText>. . .</div><a href=/ class=Logo></a><div class=FlavorText>Now at <strong><span id=StatArticles>????</span></strong> articles contributed by <strong><span id=StatContributors>???</span></strong> users.<br>Discussions available on the <strong><a href=https://forum.cheeseepedia.org/>Forums!</a></strong></div><div class=Search>"), sr = /*#__PURE__*/ N("<h2>Cheese-E-Shuffle"), cr = /*#__PURE__*/ N("<div>"), lr = /*#__PURE__*/ N("<div>Loading…"), ur = /*#__PURE__*/ N("<div>Nothing found."), dr = /*#__PURE__*/ N("<div id=RandomCards class=Carousel>"), fr = /*#__PURE__*/ N("<button type=button class=PinButton>"), pr = /*#__PURE__*/ N("<div class=infobox-list><strong>:</strong><ul>"), mr = /*#__PURE__*/ N("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), hr = /*#__PURE__*/ N("<video controls preload=metadata>"), gr = /*#__PURE__*/ N("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), _r = /*#__PURE__*/ N("<div class=\"VideoEmbed fade-in\">"), vr = /*#__PURE__*/ N("<h1 class=article-title>"), yr = /*#__PURE__*/ N("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), br = /*#__PURE__*/ N("<div class=fade-in>"), xr = /*#__PURE__*/ N("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\">"), Sr = /*#__PURE__*/ N("<div class=\"NoContent fade-in\">No transcription provided by source."), Cr = /*#__PURE__*/ N("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), wr = /*#__PURE__*/ N("<div class=infobox-list><strong>Credits:</strong><ul>"), Tr = /*#__PURE__*/ N("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), Er = /*#__PURE__*/ N("<li><strong></strong> (<!>)"), Dr = /*#__PURE__*/ N("<div class=infobox-desc>"), Or = /*#__PURE__*/ N("<li><strong></strong> (<!> – <!>)"), kr = /*#__PURE__*/ N("<li><a target=_blank rel=\"noopener noreferrer\">"), Ar = /*#__PURE__*/ N("<li>"), jr = /*#__PURE__*/ N("<li><strong>:</strong> "), Mr = /*#__PURE__*/ N("<div class=\"NoContent fade-in\">No article content. Come write some!"), Nr = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comments",
	"theories",
	"meta",
	"transcriptions"
]), Pr = {
	Articles: (e) => !Nr.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos",
	Reviews: (e) => e === "reviews"
}, Fr = 15;
function Ir(e) {
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
		case "Steam Comments": return Wr(e);
		case "Videos": return Ur(e);
		default: return Wr(e);
	}
}
async function Lr(e) {
	let t = await X(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await er(e);
	i ||= await Zn(e);
	let a = await We(), o = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (o = t);
		}
	} catch {}
	let s = r ? ` type-${r}` : "";
	return (() => {
		var r = ir(), c = r.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, Ne(r, `Card fade-in${s}`), Ne(c, `CardImage${s}`), F(c, i), Ne(l, `CardTextArea${s}`), Ne(u, `CardLink${s}`), F(d, o), Ne(f, `CardText${s}`), F(p, (() => {
			var t = M(() => !!Nr.has(n));
			return () => t() ? Q(e.startDate) : [
				M(() => Q(e.startDate)),
				" – ",
				M(() => Jn(e.endDate))
			];
		})()), F(f, () => a[t], null), x(() => P(d, "href", Z(t))), r;
	})();
}
function Rr() {
	return ar();
}
function zr() {
	return or();
}
function Br() {
	let [e, t] = y(Qn("sRandomTab", "Articles", (e) => Object.hasOwn(Pr, e))), n = {};
	for (let e of Object.keys(Pr)) {
		let [t, r] = y([]), [i, a] = y(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([Ge(), We()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = Pr[e], [i, o] = await a(), s = Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e).sort(() => Math.random() - .5), c = 0;
		for (let e = 0; e < s.length && c < Fr; e += 20) await Promise.all(s.slice(e, e + 20).map(async (e) => {
			if (c >= Fr) return;
			let n = await Wn(e).catch(() => null);
			if (!n || c >= Fr) return;
			c++;
			let r = await Lr(n), i = o[e];
			t.setEntries((e) => {
				let t = [...e, {
					views: i,
					card: r
				}];
				return t.sort((e, t) => t.views - e.views), t;
			});
		}));
		t.setLoaded(!0);
	}
	return ee(() => {
		let t = e();
		$n("sRandomTab", t), w(() => o(t));
	}), [
		sr(),
		(() => {
			var n = cr();
			return F(n, A(Ee, {
				get each() {
					return Object.keys(Pr);
				},
				children: (n) => (() => {
					var r = fr();
					return r.$$click = () => t(n), F(r, n), x((t) => {
						var i = e() === n, a = e() === n;
						return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && P(r, "aria-pressed", t.t = a), t;
					}, {
						e: void 0,
						t: void 0
					}), r;
				})()
			})), n;
		})(),
		(() => {
			var e = dr();
			return F(e, A(Ee, {
				get each() {
					return r().entries();
				},
				children: (e) => e.card
			}), null), F(e, A(j, {
				get when() {
					return M(() => !r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return lr();
				}
			}), null), F(e, A(j, {
				get when() {
					return M(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return ur();
				}
			}), null), e;
		})()
	];
}
function $(e) {
	return A(j, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = pr(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
			return F(n, () => e.title, r), F(i, A(Ee, {
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
function Vr(e) {
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
function Hr(e) {
	let t = () => Vr(e.url);
	return A(j, {
		get when() {
			return t();
		},
		get children() {
			var e = _r();
			return F(e, A(De, { get children() {
				return [
					A(Oe, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = mr();
							return x(() => P(e, "src", t().src)), e;
						}
					}),
					A(Oe, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = hr();
							return x(() => P(e, "src", t().src)), e;
						}
					}),
					A(Oe, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = gr();
							return F(e, () => t().src), x(() => P(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function Ur(e) {
	let [t] = C(async () => Yn(await X(e.pageThumbnailFile))), [n] = C(() => rr(e)), [r] = C(async () => {
		let t = await X(e.title), [n, r] = await Promise.all([Gn(t).catch(() => ""), Kn(t).catch(() => "")]);
		return {
			md: await nr(n),
			old: await nr(r)
		};
	});
	return [(() => {
		var t = vr();
		return F(t, () => e.title), t;
	})(), (() => {
		var t = xr(), n = t.firstChild;
		return F(t, A(Hr, { get url() {
			return e.pageThumbnailVideo;
		} }), n), F(n, A(j, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return lr();
			},
			get children() {
				return A(j, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return Sr();
					},
					get children() {
						return [A(j, {
							get when() {
								return M(() => !r().md)() && r().old;
							},
							get children() {
								return yr();
							}
						}), (() => {
							var e = br();
							return x(() => e.innerHTML = Y.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		})), t;
	})()];
}
function Wr(e) {
	let [t] = C(async () => Yn(await X(e.pageThumbnailFile))), [n] = C(() => rr(e)), [r] = C(async () => {
		let t = await X(e.title), [n, r] = await Promise.all([Gn(t).catch(() => ""), Kn(t).catch(() => "")]);
		return {
			md: await nr(n),
			old: await nr(r)
		};
	});
	return [(() => {
		var t = vr();
		return F(t, () => e.title), t;
	})(), (() => {
		var i = Tr(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
		return F(o, A(j, {
			get when() {
				return M(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), F(c, () => Q(e.startDate), l), F(c, () => Jn(e.endDate), u), F(s, A(j, {
			get when() {
				return e.sqft;
			},
			get children() {
				var t = Cr(), n = t.firstChild.nextSibling, r = n.firstChild;
				return F(n, () => e.sqft, r), t;
			}
		}), null), F(a, A($, {
			title: "Remodels",
			get items() {
				return e.remodels;
			},
			children: (e) => (() => {
				var t = Er(), n = t.firstChild, r = n.nextSibling.nextSibling;
				return r.nextSibling, F(n, () => e.n), F(t, () => Q(e.s), r), t;
			})()
		}), null), F(a, A($, {
			title: "Stages",
			get items() {
				return e.stages;
			},
			children: (e) => (() => {
				var t = Or(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, F(n, () => e.n), F(t, () => Q(e.s), r), F(t, () => Jn(e.e), i), F(t, A(j, {
					get when() {
						return e.desc;
					},
					get children() {
						var t = Dr();
						return F(t, () => e.desc), t;
					}
				}), null), t;
			})()
		}), null), F(a, A($, {
			title: "Franchisees",
			get items() {
				return e.franchisees;
			},
			children: (e) => (() => {
				var t = Or(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, F(n, () => e.n), F(t, () => Q(e.s), r), F(t, () => Jn(e.e), i), t;
			})()
		}), null), F(a, A($, {
			title: "Downloads",
			get items() {
				return e.downloadLinks;
			},
			children: (e) => (() => {
				var t = kr(), n = t.firstChild;
				return F(n, () => e.label), x(() => P(n, "href", e.url)), t;
			})()
		}), null), F(a, A($, {
			title: "Showtape Formats",
			get items() {
				return e.showtapeFormats;
			},
			children: (e) => (() => {
				var t = Ar();
				return F(t, e), t;
			})()
		}), null), F(a, A(j, {
			get when() {
				return e.credits?.length;
			},
			get children() {
				var t = wr(), n = t.firstChild.nextSibling;
				return F(n, A(Ee, {
					get each() {
						return e.credits;
					},
					children: (e) => (() => {
						var t = jr(), n = t.firstChild, r = n.firstChild;
						return n.nextSibling, F(n, () => e.role, r), F(t, () => e.n, null), t;
					})()
				})), t;
			}
		}), null), F(a, A(j, {
			get when() {
				return M(() => !n.loading)() && n();
			},
			get children() {
				return n();
			}
		}), null), F(d, A(j, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return lr();
			},
			get children() {
				return A(j, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return Mr();
					},
					get children() {
						return [A(j, {
							get when() {
								return M(() => !r().md)() && r().old;
							},
							get children() {
								return yr();
							}
						}), (() => {
							var e = br();
							return x(() => e.innerHTML = Y.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		})), i;
	})()];
}
Me(["click"]);
//#endregion
//#region src/App.jsx
var Gr = /*#__PURE__*/ N("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), Kr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), qr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), Jr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), Yr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), Xr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), Zr = /*#__PURE__*/ N("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function Qr(e) {
	return [
		Gr(),
		Kr(),
		qr(),
		Jr(),
		Yr(),
		Xr(),
		Zr(),
		M(zr),
		M(() => Ir(e)),
		M(Br),
		M(Rr)
	];
}
//#endregion
//#region index.jsx
async function $r(e, t) {
	let n = await Wn(e.get(""));
	je(() => Qr(n), t);
}
//#endregion
export { $r as render };
