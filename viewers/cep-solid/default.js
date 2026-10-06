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
var r = (e, t) => e === t, i = Symbol("solid-track"), a = { equals: r }, o = null, s = fe, c = 1, l = 2, u = {
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
	}, s = i ? e : () => e(() => T(() => M(o)));
	f = o, m = null;
	try {
		return j(s, !0);
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
	return [D.bind(n), (e) => (typeof e == "function" && (e = p && p.running && p.sources.has(n) ? e(n.tValue) : e(n.value)), O(n, e))];
}
function b(e, t, n) {
	k(ue(e, t, !0, c));
}
function x(e, t, n) {
	k(ue(e, t, !1, c));
}
function S(e, t, n) {
	s = pe;
	let r = ue(e, t, !1, c), i = ce && oe(ce);
	i && (r.suspense = i), (!n || !n.render) && (r.user = !0), g ? g.push(r) : k(r);
}
function C(e, t, n) {
	n = n ? Object.assign({}, a, n) : a;
	let r = ue(e, t, !0, 0);
	return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, k(r), D.bind(r);
}
function ee(e) {
	return e && typeof e == "object" && "then" in e;
}
function w(t, n, r) {
	let i, a, o;
	typeof n == "function" ? (i = t, a = n, o = r || {}) : (i = !0, a = t, o = n || {});
	let s = null, c = d, l = null, u = !1, h = !1, g = "initialValue" in o, _ = typeof i == "function" && C(i), v = /* @__PURE__ */ new Set(), [x, S] = (o.storage || y)(o.initialValue), [w, te] = y(void 0), [ne, ae] = y(void 0, { equals: !1 }), [E, se] = y(g ? "ready" : "unresolved");
	f && re(() => {
		for (let e of v.keys()) e.decrement();
		v.clear(), p && s && p.promises.delete(s), s = null;
	}), e.context && (l = e.getNextContextId(), o.ssrLoadFrom === "initial" ? c = o.initialValue : e.load && e.has(l) && (c = e.load(l)));
	function D(e, t, n, r) {
		return s === e && (s = null, r !== void 0 && (g = !0), (e === c || t === c) && o.onHydrated && queueMicrotask(() => o.onHydrated(r, { value: t })), c = d, p && e && u ? (p.promises.delete(e), u = !1, j(() => {
			p.running = !0, O(t, n);
		}, !1)) : O(t, n)), t;
	}
	function O(e, t) {
		j(() => {
			t === void 0 && S(() => e), se(t === void 0 ? g ? "ready" : "unresolved" : "errored"), te(t);
			for (let e of v.keys()) e.decrement();
			v.clear();
		}, !1);
	}
	function k() {
		let e = ce && oe(ce), t = x(), n = w();
		if (n !== void 0 && !s) throw n;
		return m && !m.user && e && b(() => {
			ne(), s && (e.resolved && p && u ? p.promises.add(s) : v.has(e) || (e.increment(), v.add(e)));
		}), t;
	}
	function le(e = !0) {
		if (e !== !1 && h) return;
		h = !1;
		let t = _ ? _() : i;
		if (u = p && p.running, t == null || t === !1) {
			D(s, T(x));
			return;
		}
		p && s && p.promises.delete(s);
		let n, r = c === d ? T(() => {
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
			D(s, void 0, _e(n), t);
			return;
		}
		return ee(r) ? (s = r, "v" in r ? (r.s === 1 ? D(s, r.v, void 0, t) : D(s, void 0, _e(r.v), t), r) : (h = !0, queueMicrotask(() => h = !1), j(() => {
			se(g ? "refreshing" : "pending"), ae();
		}, !1), r.then((e) => D(r, e, void 0, t), (e) => D(r, void 0, _e(e), t)))) : (D(s, r, void 0, t), r);
	}
	Object.defineProperties(k, {
		state: { get: () => E() },
		error: { get: () => w() },
		loading: { get() {
			let e = E();
			return e === "pending" || e === "refreshing";
		} },
		latest: { get() {
			if (!g) return k();
			let e = w();
			if (e && !s) throw e;
			return x();
		} }
	});
	let ue = f;
	return _ ? b(() => (ue = f, le(!1))) : le(!1), [k, {
		refetch: (e) => ie(ue, () => le(e)),
		mutate: S
	}];
}
function T(e) {
	if (m === null) return e();
	let t = m;
	m = null;
	try {
		return e();
	} finally {
		m = t;
	}
}
function te(e, t, n) {
	let r = Array.isArray(e), i, a = n && n.defer;
	return (n) => {
		let o;
		if (r) {
			o = Array(e.length);
			for (let t = 0; t < e.length; t++) o[t] = e[t]();
		} else o = e();
		if (a) return a = !1, n;
		let s = T(() => t(o, i, n));
		return i = o, s;
	};
}
function ne(e) {
	S(() => T(e));
}
function re(e) {
	return f === null || (f.cleanups === null ? f.cleanups = [e] : f.cleanups.push(e)), e;
}
function ie(e, t) {
	let n = f, r = m;
	f = e, m = null;
	try {
		return j(t, !0);
	} catch (e) {
		ye(e);
	} finally {
		f = n, m = r;
	}
}
var [ae, E] = /*@__PURE__*/ y(!1);
function oe(e) {
	let t;
	return f && f.context && (t = f.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function se(e) {
	let t = C(e), n = C(() => be(t()));
	return n.toArray = () => {
		let e = n();
		return Array.isArray(e) ? e : e == null ? [] : [e];
	}, n;
}
var ce;
function D() {
	let e = p && p.running;
	if (this.sources && (e ? this.tState : this.state)) {
		if ((e ? this.tState : this.state) === c) k(this);
		else {
			let e = h;
			h = null, j(() => me(this), !1), h = e;
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
function O(e, t, n) {
	let r = p && p.running && p.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (p) {
			let r = p.running;
			(r || !n && p.sources.has(e)) && (p.sources.add(e), e.tValue = t), r || (e.value = t);
		} else e.value = t;
		e.observers && e.observers.length && j(() => {
			for (let t = 0; t < e.observers.length; t += 1) {
				let n = e.observers[t], r = p && p.running;
				r && p.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? h.push(n) : g.push(n), n.observers && he(n)), r ? n.tState = c : n.state = c);
			}
			if (h.length > 1e6) throw h = [], Error();
		}, !1);
	}
	return t;
}
function k(e) {
	if (!e.fn) return;
	M(e);
	let t = _;
	le(e, p && p.running && p.sources.has(e) ? e.tValue : e.value, t), p && !p.running && p.sources.has(e) && queueMicrotask(() => {
		j(() => {
			p && (p.running = !0), m = f = e, le(e, e.tValue, t), m = f = null;
		}, !1);
	});
}
function le(e, t, n) {
	let r, i = f, a = m;
	m = f = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return e.pure && (p && p.running ? (e.tState = c, e.tOwned && e.tOwned.forEach(M), e.tOwned = void 0) : (e.state = c, e.owned && e.owned.forEach(M), e.owned = null)), e.updatedAt = n + 1, ye(t);
	} finally {
		m = a, f = i;
	}
	(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? O(e, r, !0) : p && p.running && e.pure ? (p.sources.has(e) || (e.value = r), p.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function ue(e, t, n, r = c, i) {
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
function A(e) {
	let t = p && p.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === l) return me(e);
	if (e.suspense && T(e.suspense.inFallback)) return e.suspense.effects.push(e);
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
		if ((t ? e.tState : e.state) === c) k(e);
		else if ((t ? e.tState : e.state) === l) {
			let t = h;
			h = null, j(() => me(e, n[0]), !1), h = t;
		}
	}
}
function j(e, t) {
	if (h) return e();
	let n = !1;
	t || (h = []), g ? n = !0 : g = [], _++;
	try {
		let t = e();
		return de(n), t;
	} catch (e) {
		n || (g = null), h = null, ye(e);
	}
}
function de(e) {
	if (h &&= (fe(h), null), e) return;
	let t;
	if (p) {
		if (!p.promises.size && !p.queue.size) {
			let e = p.sources, n = p.disposed;
			g.push.apply(g, p.effects), t = p.resolve;
			for (let e of g) "tState" in e && (e.state = e.tState), delete e.tState;
			p = null, j(() => {
				for (let e of n) M(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) M(t.owned[e]);
					t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0;
				}
				E(!1);
			}, !1);
		} else if (p.running) {
			p.running = !1, p.effects.push.apply(p.effects, g), g = null, E(!0);
			return;
		}
	}
	let n = g;
	g = null, n.length && j(() => s(n), !1), t && t();
}
function fe(e) {
	for (let t = 0; t < e.length; t++) A(e[t]);
}
function pe(t) {
	let r, i = 0;
	for (r = 0; r < t.length; r++) {
		let e = t[r];
		e.user ? t[i++] = e : A(e);
	}
	if (e.context) {
		if (e.count) {
			e.effects ||= [], e.effects.push(...t.slice(0, i));
			return;
		}
		n();
	}
	for (e.effects && (e.done || !e.count) && (t = [...e.effects, ...t], i += e.effects.length, delete e.effects), r = 0; r < i; r++) A(t[r]);
}
function me(e, t) {
	let n = p && p.running;
	n ? e.tState = 0 : e.state = 0;
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === c ? i !== t && (!i.updatedAt || i.updatedAt < _) && A(i) : e === l && me(i, t);
		}
	}
}
function he(e) {
	let t = p && p.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) && (t ? r.tState = l : r.state = l, r.pure ? h.push(r) : g.push(r), r.observers && he(r));
	}
}
function M(e) {
	let t;
	if (e.sources) for (; e.sources.length;) {
		let t = e.sources.pop(), n = e.sourceSlots.pop(), r = t.observers;
		if (r && r.length) {
			let e = r.pop(), i = t.observerSlots.pop();
			n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i);
		}
	}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) M(e.tOwned[t]);
		delete e.tOwned;
	}
	if (p && p.running && e.pure) ge(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) M(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	p && p.running ? e.tState = 0 : e.state = 0;
}
function ge(e, t) {
	if (t || (e.tState = 0, p.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) ge(e.owned[t]);
}
function _e(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function ve(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		ye(e, n && n.owner || null);
	}
}
function ye(e, t = f) {
	let n = o && t && t.context && t.context[o], r = _e(e);
	if (!n) throw r;
	g ? g.push({
		fn() {
			ve(r, n, t);
		},
		state: c
	}) : ve(r, n, t);
}
function be(e) {
	if (typeof e == "function" && !e.length) return be(e());
	if (Array.isArray(e)) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r = be(e[n]);
			if (Array.isArray(r)) {
				if (r.length < 32768) t.push.apply(t, r);
				else for (let e = 0; e < r.length; e++) t.push(r[e]);
			} else t.push(r);
		}
		return t;
	}
	return e;
}
var xe = Symbol("fallback");
function Se(e) {
	for (let t = 0; t < e.length; t++) e[t]();
}
function Ce(e, t, n = {}) {
	let r = [], a = [], o = [], s = 0, c = t.length > 1 ? [] : null;
	return re(() => Se(o)), () => {
		let l = e() || [], u = l.length, d, f;
		return l[i], T(() => {
			let e, t, i, m, h, g, _, y, b;
			if (u === 0) s !== 0 && (Se(o), o = [], r = [], a = [], s = 0, c &&= []), n.fallback && (r = [xe], a[0] = v((e) => (o[0] = e, n.fallback())), s = 1);
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
function N(e, t) {
	return T(() => e(t || {}));
}
var we = (e) => `Stale read from <${e}>.`;
function P(e) {
	let t = "fallback" in e && { fallback: () => e.fallback };
	return C(Ce(() => e.each, e.children, t || void 0));
}
function F(e) {
	let t = e.keyed, n = C(() => e.when, void 0, void 0), r = t ? n : C(n, void 0, { equals: (e, t) => !e == !t });
	return C(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? T(() => a(t ? i : () => {
				if (!T(r)) throw we("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
function Te(e) {
	let t = se(() => e.children), n = C(() => {
		let e = t(), n = Array.isArray(e) ? e : [e], r = () => void 0;
		for (let e = 0; e < n.length; e++) {
			let t = e, i = n[e], a = r, o = C(() => a() ? void 0 : i.when, void 0, void 0), s = i.keyed ? o : C(o, void 0, { equals: (e, t) => !e == !t });
			r = () => a() || (s() ? [
				t,
				o,
				i
			] : void 0);
		}
		return r;
	});
	return C(() => {
		let t = n()();
		if (!t) return e.fallback;
		let [r, i, a] = t, o = a.children;
		return typeof o == "function" && o.length > 0 ? T(() => o(a.keyed ? i() : () => {
			if (T(n)()?.[0] !== r) throw we("Match");
			return i();
		})) : o;
	}, void 0, void 0);
}
function Ee(e) {
	return e;
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
var I = (e) => C(() => e());
function De(e, t, n) {
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
var Oe = "_$DX_DELEGATE";
function ke(e, t, n, r = {}) {
	let i;
	return v((r) => {
		i = r, t === document ? e() : B(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function L(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => T(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function Ae(e, t = window.document) {
	let n = t[Oe] || (t[Oe] = /* @__PURE__ */ new Set());
	for (let r = 0, i = e.length; r < i; r++) {
		let i = e[r];
		n.has(i) || (n.add(i), t.addEventListener(i, Pe));
	}
}
function R(e, t, n) {
	Ne(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function z(e, t) {
	Ne(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function je(e, t, n) {
	n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n);
}
function Me(e, t, n) {
	return T(() => e(t, n));
}
function B(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return Fe(e, t, r, n);
	x((r) => Fe(e, t(), r, n), r);
}
function Ne(t) {
	return !!e.context && !e.done && (!t || t.isConnected);
}
function Pe(t) {
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
function Fe(e, t, n, r, i) {
	let a = Ne(e);
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
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = Re(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = Re(e, n, r);
	} else if (o === "function") return x(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = Fe(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (Ie(o, t, n, i)) return x(() => n = Fe(e, o, n, r, !0)), () => n;
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
			if (n = Re(e, n, r), s) return n;
		} else c ? n.length === 0 ? Le(e, o, r) : De(e, n, o) : (n && Re(e), Le(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = Re(e, n, r, t);
			Re(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function Ie(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = Ie(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = Ie(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function Le(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function Re(e, t, n, r) {
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
var ze = null, Be = null, Ve = null, He = null, Ue = null, We = null, Ge = null;
async function Ke() {
	return We ||= await (await fetch("/viewers/cep-solid/compiled-json/recentfanvideos.json")).json(), We;
}
async function qe() {
	return Ge ||= await (await fetch("/viewers/cep-solid/compiled-json/recentofficialvideos.json")).json(), Ge;
}
async function Je() {
	return ze ||= await (await fetch("/viewers/cep-solid/compiled-json/titleToFolderIDMap.json")).json(), ze;
}
async function Ye() {
	return Be ||= await (await fetch("/viewers/cep-js/compiled-json/views.json")).json(), Be;
}
async function Xe() {
	return Ve ||= await (await fetch("/viewers/cep-solid/compiled-json/typeToIDList.json")).json(), Ve;
}
async function Ze() {
	return He ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseNews.json")).json(), He;
}
async function Qe() {
	return Ue ||= await (await fetch("/viewers/cep-js/compiled-json/DiscourseRecent.json")).json(), Ue;
}
//#endregion
//#region ../../node_modules/marked/lib/marked.esm.js
function $e() {
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
var et = $e();
function tt(e) {
	et = e;
}
var nt = { exec: () => null };
function rt(e) {
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
var it = ((e = "") => {
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
	nextBulletRegex: rt((e) => RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: rt((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: rt((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: rt((e) => RegExp(`^ {0,${e}}#`)),
	htmlBeginRegex: rt((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: rt((e) => RegExp(`^ {0,${e}}>`))
}, at = /^(?:[ \t]*(?:\n|$))+/, ot = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, st = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ct = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, lt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ut = / {0,3}(?:[*+-]|\d{1,9}[.)])/, dt = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ft = V(dt).replace(/bull/g, ut).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), pt = V(dt).replace(/bull/g, ut).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), mt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, ht = /^[^\n]+/, gt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, _t = V(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", gt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), vt = V(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, ut).getRegex(), yt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", bt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, xt = V("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", bt).replace("tag", yt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), St = (e) => V(mt).replace("hr", ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", yt).getRegex(), Ct = St(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), wt = St(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), Tt = {
	blockquote: V(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", wt).getRegex(),
	code: ot,
	def: _t,
	fences: st,
	heading: lt,
	hr: ct,
	html: xt,
	lheading: ft,
	list: vt,
	newline: at,
	paragraph: Ct,
	table: nt,
	text: ht
}, Et = V("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", yt).getRegex(), Dt = {
	...Tt,
	lheading: pt,
	table: Et,
	paragraph: V(mt).replace("hr", ct).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Et).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", yt).getRegex()
}, Ot = {
	...Tt,
	html: V("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", bt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: nt,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: V(mt).replace("hr", ct).replace("heading", " *#{1,6} *[^\n]").replace("lheading", ft).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, kt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, At = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, jt = /^( {2,}|\\)\n(?!\s*$)/, Mt = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, U = /[\p{P}\p{S}]/u, Nt = /[\s\p{P}\p{S}]/u, Pt = /[^\s\p{P}\p{S}]/u, Ft = V(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Nt).getRegex(), It = /[\p{Pi}\p{Ps}"']/u, Lt = /(?!~)[\p{P}\p{S}]/u, Rt = /(?!~)[\s\p{P}\p{S}]/u, zt = /(?:[^\s\p{P}\p{S}]|~)/u, Bt = V(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", it ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Vt = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Ht = V(Vt, "u").replace(/punct/g, U).getRegex(), Ut = V(Vt, "u").replace(/punct/g, Lt).getRegex(), Wt = V(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, It).replace(/punct/g, U).getRegex(), Gt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Kt = V(Gt, "gu").replace(/notPunctSpace/g, Pt).replace(/punctSpace/g, Nt).replace(/punct/g, U).getRegex(), qt = V(Gt, "gu").replace(/notPunctSpace/g, zt).replace(/punctSpace/g, Rt).replace(/punct/g, Lt).getRegex(), Jt = V("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Pt).replace(/punctSpace/g, Nt).replace(/punct/g, U).getRegex(), Yt = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Pt).replace(/punctSpace/g, Nt).replace(/punct/g, U).getRegex(), Xt = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Pt).replace(/punctSpace/g, Nt).replace(/punct/g, U).getRegex(), Zt = V(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, U).getRegex(), Qt = V("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Pt).replace(/punctSpace/g, Nt).replace(/punct/g, U).getRegex(), $t = V(/\\(punct)/, "gu").replace(/punct/g, U).getRegex(), en = V(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), tn = V(bt).replace("(?:-->|$)", "-->").getRegex(), nn = V("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", tn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), rn = V(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", /\[(?:\\[\s\S]|[^\[\]\\])*\]/).getRegex(), an = V(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", rn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), on = V(/^!?\[(label)\]\[(ref)\]/).replace("label", rn).replace("ref", gt).getRegex(), sn = V(/^!?\[(ref)\](?:\[\])?/).replace("ref", gt).getRegex(), cn = V("reflink|nolink(?!\\()", "g").replace("reflink", on).replace("nolink", sn).getRegex(), ln = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, un = {
	_backpedal: nt,
	anyPunctuation: $t,
	autolink: en,
	blockSkip: Bt,
	br: jt,
	code: At,
	del: nt,
	delLDelim: nt,
	delRDelim: nt,
	emStrongLDelim: Ht,
	emStrongRDelimAst: Kt,
	emStrongRDelimUnd: Yt,
	escape: kt,
	link: an,
	nolink: sn,
	punctuation: Ft,
	reflink: on,
	reflinkSearch: cn,
	tag: nn,
	text: Mt,
	url: nt
}, dn = {
	...un,
	emStrongLDelim: Wt,
	emStrongRDelimAst: Jt,
	emStrongRDelimUnd: Xt,
	link: V(/^!?\[(label)\]\((.*?)\)/).replace("label", rn).getRegex(),
	reflink: V(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", rn).getRegex()
}, fn = {
	...un,
	emStrongRDelimAst: qt,
	emStrongLDelim: Ut,
	delLDelim: Zt,
	delRDelim: Qt,
	url: V(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ln).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: V(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ln).getRegex()
}, pn = {
	...fn,
	br: V(jt).replace("{2,}", "*").getRegex(),
	text: V(fn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, mn = {
	normal: Tt,
	gfm: Dt,
	pedantic: Ot
}, hn = {
	normal: un,
	gfm: fn,
	breaks: pn,
	pedantic: dn
}, gn = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, _n = (e) => gn[e];
function W(e, t) {
	if (t) {
		if (H.escapeTest.test(e)) return e.replace(H.escapeReplace, _n);
	} else if (H.escapeTestNoEncode.test(e)) return e.replace(H.escapeReplaceNoEncode, _n);
	return e;
}
function vn(e) {
	try {
		e = encodeURI(e).replace(H.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function yn(e, t) {
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
function bn(e) {
	let t = e.split("\n"), n = t.length - 1;
	for (; n >= 0 && H.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
}
function xn(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Sn(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function Cn(e, t, n, r, i) {
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
function wn(e, t, n) {
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
var Tn = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || et;
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
			let e = this.options.pedantic ? t[0] : bn(t[0]);
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
			let e = t[0], n = wn(e, t[3] || "", this.rules);
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
				let c = Sn(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
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
			let e = bn(t[0]);
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
		let n = yn(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
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
			for (let e of i) a.rows.push(yn(e, a.header.length).map((e, t) => ({
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
				let e = xn(t[2], "()");
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
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), Cn(t, {
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
			return Cn(n, e, n[0], this.lexer, this.rules);
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
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || et, this.options.tokenizer = this.options.tokenizer || new Tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			top: !0
		};
		let t = {
			other: H,
			block: mn.normal,
			inline: hn.normal
		};
		this.options.pedantic ? (t.block = mn.pedantic, t.inline = hn.pedantic) : this.options.gfm && (t.block = mn.gfm, t.inline = this.options.breaks ? hn.breaks : hn.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: mn,
			inline: hn
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
}, En = class {
	options;
	parser;
	constructor(e) {
		this.options = e || et;
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
		let a = i ? W(n, !0) : this.parser.parseInline(r), o = vn(e);
		if (o === null) return a;
		e = W(o, i);
		let s = "<a href=\"" + e + "\"";
		return t && (s += " title=\"" + W(t) + "\""), s += ">" + a + "</a>", s;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = vn(e);
		if (i === null) return W(n);
		e = i;
		let a = `<img src="${W(e)}" alt="${W(n)}"`;
		return t && (a += ` title="${W(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : W(e.text);
	}
}, Dn = class {
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
		this.options = e || et, this.options.renderer = this.options.renderer || new En(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Dn();
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
}, On = class {
	options;
	block;
	constructor(e) {
		this.options = e || et;
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
}, kn = new class {
	defaults = $e();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = q;
	Renderer = En;
	TextRenderer = Dn;
	Lexer = K;
	Tokenizer = Tn;
	Hooks = On;
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
				let t = this.defaults.renderer || new En(this.defaults);
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
				let t = this.defaults.tokenizer || new Tn(this.defaults);
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
				let t = this.defaults.hooks || new On();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = On.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async && On.passThroughHooksRespectAsync.has(n)) return (async () => {
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
	return kn.parse(e, t);
}
J.options = J.setOptions = function(e) {
	return kn.setOptions(e), J.defaults = kn.defaults, tt(J.defaults), J;
}, J.getDefaults = $e, J.defaults = et;
function An(...e) {
	return kn.use(...e), J.defaults = kn.defaults, tt(J.defaults), J;
}
J.use = An, J.walkTokens = function(e, t) {
	return kn.walkTokens(e, t);
}, J.parseInline = kn.parseInline, J.Parser = q, J.parser = q.parse, J.Renderer = En, J.TextRenderer = Dn, J.Lexer = K, J.lexer = K.lex, J.Tokenizer = Tn, J.Hooks = On, J.parse = J, J.options, J.setOptions, J.walkTokens, J.parseInline, q.parse, K.lex;
//#endregion
//#region src/MapRenderer.jsx
var jn = "/viewers/cep-solid/compiled-json/map_pins.json", Mn = "/viewers/cep-js/assets/Map Markers/", Nn = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", Pn = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", Fn = {
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
}, In = (e) => (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime(), Ln = (e) => String(e).padStart(2, "0"), Rn = (e) => `${e.getFullYear()}-${Ln(e.getMonth() + 1)}-${Ln(e.getDate())}`, zn = (e) => new Date(e, 1, 29).getDate() === 29, Bn = (e) => Math.floor((e - new Date(e.getFullYear(), 0, 0)) / 864e5);
function Vn(e, t) {
	let n = "c";
	for (let r of e._eras) {
		if (r.ts > t) break;
		n = r.pin;
	}
	return n;
}
function Hn() {
	return new Promise((e, t) => {
		if (window.L) return e();
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = Nn, document.head.appendChild(n);
		let r = document.createElement("script");
		r.src = Pn, r.onload = e, r.onerror = t, document.head.appendChild(r);
	});
}
function Un() {
	if (document.querySelector("#MapPinIconStyle")) return;
	let e = document.createElement("style");
	e.id = "MapPinIconStyle", e.textContent = ".MapPinIcon{transition:transform .15s ease;transform-origin:bottom center;}", document.head.appendChild(e);
}
function Wn(e, t) {
	let n = e.getElement();
	if (!n) return;
	let r = n.style.transform.replace(/\s*scale\([^)]*\)\s*$/, "");
	n.style.transform = t ? `${r} scale(2.5)` : r;
}
function Gn(e) {
	let t = new URLSearchParams(location.search).get("v") || "cep-js", n = document.createElement("a");
	return n.href = `/?v=${t}&=${encodeURIComponent(e)}`, n.textContent = "Loading…", fetch(`/content/${e}/meta.json`).then((e) => e.json()).then((e) => {
		n.textContent = e.title;
	}).catch(() => {
		n.textContent = "Open article";
	}), n;
}
var Kn = null;
function qn() {
	return Kn ||= fetch(jn).then((e) => e.json()).then((e) => {
		let t = e.locations.filter((e) => Array.isArray(e.c) && e.c.length === 2 && e.c.every(Number.isFinite) && e.s && e.e);
		return t.forEach((e) => {
			e._s = In(e.s), e._e = In(e.e), e._eras = (e.r || []).map(([e, t]) => ({
				pin: t,
				ts: In(e)
			}));
		}), t;
	}).catch((e) => (console.error("Map: failed to load map_pins.json", e), Kn = null, [])), Kn;
}
async function Jn(e, t, { single: n = !1, fit: r = !1 } = {}) {
	await Hn(), Un();
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
	let s = Object.fromEntries(Object.entries(Fn).map(([e, t]) => [e, i.icon({
		iconUrl: Mn + t,
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
		className: "MapPinIcon"
	})])), c = i.layerGroup().addTo(o), l = t.map((e) => {
		let t = i.marker(e.c).bindPopup(n ? e.c.join(", ") : () => Gn(e.p));
		return t.on("mouseover", () => {
			t.setZIndexOffset(1e3), Wn(t, !0);
		}), t.on("mouseout", () => {
			t.setZIndexOffset(0), Wn(t, !1);
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
			let o = Vn(e, i);
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
		let e = zn(+p.value) ? 366 : 365;
		m.max = e, +m.value > e && (m.value = e);
	}
	function v() {
		let e = new Date(+p.value, 0);
		e.setDate(+m.value), g.textContent = `${Ln(e.getMonth() + 1)}/${Ln(e.getDate())}/${e.getFullYear()}`, h.value = Rn(e), u(e);
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
		p.value = e.getFullYear(), _(), m.value = Bn(e), b();
	}), p.value = d.getFullYear(), _(), m.value = Bn(d), v(), { destroy: () => o.remove() };
}
//#endregion
//#region src/GlobalFunctions.jsx
var Yn = /*#__PURE__*/ L("<a><img alt loading=lazy class>", !0, !1, !1), Xn = /*#__PURE__*/ L("<a class=CardImageExcerpt>Error?"), Zn = /*#__PURE__*/ L("<a class=CardImageExcerpt>No Article Content. Come write some!"), Qn = /*#__PURE__*/ L("<a class=CardImageExcerpt>"), $n = /*#__PURE__*/ L("<a><img loading=lazy class>", !0, !1, !1), er = /*#__PURE__*/ L("<div class=\"MapContainer fade-in\">"), tr = /* @__PURE__ */ new Set(["locations", "cancelled locations"]), nr = [
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
async function rr(e) {
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
async function ir(e) {
	let t = await fetch(`/content/${e}/content.md`);
	if (!t.ok) throw Error(`content.md not found for "${e}"`);
	return t.text();
}
async function ar(e) {
	let t = await fetch(`/content/${e}/old.md`);
	return t.ok ? t.text() : "";
}
async function Y(e) {
	return (await Je())[e] ?? null;
}
function or() {
	return new URLSearchParams(location.search).get("v") || "cep-js";
}
function X(e) {
	return `/?v=${or()}&=${e}`;
}
function Z(e) {
	if (!e || e === "0000-00-00" || !e.trim()) return "???";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? nr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
function sr(e) {
	if (e === "0000-00-00") return "???";
	if (!e || !e.trim()) return "Present";
	let [t, n, r] = e.split("-"), i = parseInt(t, 10), a = parseInt(n, 10), o = parseInt(r, 10);
	if (!i) return "???";
	let s = a ? nr[a] : "", c = o ? String(o) : "";
	return s && c ? `${s} ${c}, ${i}` : s ? `${s} ${i}` : String(i);
}
async function cr(e) {
	return e ? (() => {
		var t = Yn(), n = t.firstChild;
		return Me((t) => {
			let n = `/content/${e}/lowphoto.avif`, r = `/content/${e}/photo.avif`;
			t.onload = () => {
				let e = new Image();
				e.onload = () => t.src = r, e.src = r;
			}, t.onerror = () => t.src = r, t.src = n;
		}, n), x(() => R(t, "href", X(e))), t;
	})() : null;
}
function lr(e) {
	let t = document.createElement("textarea");
	return t.innerHTML = e, t.value;
}
async function ur(e, t = 160) {
	let n = await Y(e.title);
	if (!n) return (() => {
		var e = Xn();
		return x(() => R(e, "href", X(n))), e;
	})();
	let r = await ir(n) || await ar(n);
	if (!r) return (() => {
		var e = Zn();
		return x(() => R(e, "href", X(n))), e;
	})();
	let i = lr(r).split("[").join("").split("]").join("").split("#").join("").replace(/\s+/g, " ").trim();
	if (!i) return (() => {
		var e = Zn();
		return x(() => R(e, "href", X(n))), e;
	})();
	let a = i.length <= t ? i : `${i.slice(0, i.slice(0, t).lastIndexOf(" "))}…`;
	return (() => {
		var e = Qn();
		return B(e, a), x(() => R(e, "href", X(n))), e;
	})();
}
function dr(e, t = null, n) {
	try {
		let r = localStorage.getItem(e);
		if (r === null) return t;
		let i = typeof t == "string" ? r : JSON.parse(r);
		return n && !n(i) ? t : i;
	} catch {
		return t;
	}
}
function fr(e, t) {
	try {
		return localStorage.setItem(e, typeof t == "string" ? t : JSON.stringify(t)), !0;
	} catch {
		return !1;
	}
}
async function pr(e) {
	let t = await Y(e.title);
	if (!t) return null;
	let n = null;
	if (e?.pageThumbnailFile ? n = await Y(e.pageThumbnailFile) : await new Promise((e) => {
		let n = new Image();
		n.onload = () => e(!0), n.onerror = () => e(!1), n.src = `/content/${t}/photo.avif`;
	}) && (n = t), !n) return null;
	let r = "", [i, a] = await Promise.all([ir(t).catch(() => ""), ar(t).catch(() => "")]), o = await gr(i || a || "");
	return r = (new DOMParser().parseFromString(J.parse(o), "text/html").body.textContent || "").trim(), (() => {
		var e = $n(), i = e.firstChild;
		return Me((e) => {
			let t = `/content/${n}/lowphoto.avif`, r = `/content/${n}/photo.avif`;
			e.onload = () => {
				let t = new Image();
				t.onload = () => e.src = r, t.src = r;
			}, e.onerror = () => e.src = r, e.src = t;
		}, i), R(i, "alt", r), x(() => R(e, "href", X(t))), e;
	})();
}
function mr(e) {
	return new Date(e).toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function hr(e) {
	return (() => {
		var t = er();
		return Me((t) => {
			let n = () => t.isConnected ? e(t) : requestAnimationFrame(n);
			requestAnimationFrame(n);
		}, t), t;
	})();
}
async function gr(e) {
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
async function _r(e) {
	if (!tr.has((e?.type || "").toLowerCase())) return null;
	let t = await Y(e?.title);
	if (!t) return null;
	let n = (await qn()).find((e) => e.p === t);
	return n ? hr((e) => Jn(e, [n], { single: !0 })) : null;
}
async function vr() {
	let e = await qn();
	return e.length ? hr((t) => Jn(t, e)) : null;
}
//#endregion
//#region src/Search.jsx
var yr = /*#__PURE__*/ L("<div class=s-no-results>No results"), br = /*#__PURE__*/ L("<div class=s-year-group><div class=s-year-header>"), xr = /*#__PURE__*/ L("<div class=PhotoGrid>"), Sr = /*#__PURE__*/ L("<div class=Carousel>"), Cr = /*#__PURE__*/ L("<div class=CardWrap>"), wr = /*#__PURE__*/ L("<div class=s-wrap><div class=s-suggest-wrap><div class=s-input-row id=sInputRow><span class=s-chips id=sChips></span><input class=s-input id=sInput placeholder=Search... autocomplete=off></div><div class=s-suggest id=sSuggest></div></div><div class=s-qtags id=sQtags><h4>Quick Tags</h4><div class=s-qtags-scroll id=sQtagsList></div></div><div id=sResultsWrap><div class=s-controls><label>Show: <select id=sPerPage><option value=20>20</option><option value=50>50</option><option value=100>100</option><option value=500>500</option><option value=all>All</option></select></label><label>Sort: <select id=sSort><option value=relevancy>Relevancy</option><option value=oldest>Oldest → Newest</option><option value=newest>Newest → Oldest</option><option value=newest-updated>Recently Updated</option><option value=oldest-updated>Least Recently Updated</option><option value=most-views>Most Views</option><option value=least-views>Least Views</option></select></label><label>Display: <select id=sDisplay><option value=card>Card</option><option value=compact>Compact</option><option value=list>List</option></select></label><label class=s-toggle><input type=checkbox id=sKeepTags> Quick Tags</label></div><div class=s-tab-btns id=sTabBtns></div><div id=sTabPanels>"), Tr = /*#__PURE__*/ L("<span><button class=s-chip-x>&#x2715;"), Er = /*#__PURE__*/ L("<span class=s-suggest-years>"), Dr = /*#__PURE__*/ L("<div class=s-suggest-item><span></span><span class=s-suggest-count>"), Or = /*#__PURE__*/ L("<button class=s-tab-btn>"), kr = /*#__PURE__*/ L("<div class=s-tab-panel><div class=s-results></div><div class=s-show-more><a href=#>Show more"), Ar = "/viewers/cep-js/compiled-json/search", jr = [
	{
		id: "articles",
		label: "Articles",
		types: null
	},
	{
		id: "photos",
		label: "Photos",
		types: ["Photos"]
	},
	{
		id: "videos",
		label: "Videos",
		types: ["Videos"]
	},
	{
		id: "reviews",
		label: "Reviews",
		types: ["Reviews"]
	}
], Mr = /* @__PURE__ */ "Pizza Time Theatre,ShowBiz Pizza Place,Chuck E. Cheese's,2026,1977,Locations,Showtapes,Animatronic Shows,Stage Variations,Animatronics,Animatronic Parts,Animatronic Preservation,Costumed Characters,Retrofits,History,Cancelled Locations,Remodels and Initiatives,Arcades and Attractions,Store Fixtures,Companies/Brands,Characters,Events,Animatronic Control Systems,Other Systems,Simulators,Programming Systems,Commercials,News Footage,Company Media,Movies,Puppets,Live Shows,ShowBiz Pizza Programs,Showtape Formats,Family Vision,Corporate Documents,Documents,Promotional Material,Social Media and Websites,Ad Vehicles,In-Store Merchandise,Products,Menu Items,Tickets,Tokens,Employee Wear,Video Games,Sally Corporation,Jim Henson's Creature Shop,Walt Disney Imagineering,Five Nights at Freddy's,Transcriptions,Unknown Year,User,Meta".split(","), Nr = {
	card: Yi,
	compact: Xi,
	list: Zi
}, Pr = "/viewers/cep-js/assets/Emoji/", Fr = {
	"Pizza Time Theatre": "#b7471bff",
	"ShowBiz Pizza Place": "#b7471bff",
	"Chuck E. Cheese's": "#b7471bff",
	Locations: "#c26827ff",
	Showtapes: "#7b4fd6",
	"Animatronic Shows": "#4a7bd1",
	Animatronics: "#4a7bd1",
	"Animatronic Parts": "#4a7bd1",
	"Animatronic Preservation": "#4a7bd1",
	"Stage Variations": "#4a7bd1",
	"Costumed Characters": "#4a7bd1",
	Characters: "#2e8857ff",
	Retrofits: "#4a7bd1",
	"Remodels and Initiatives": "#c26827ff",
	History: "#c26827ff",
	"Cancelled Locations": "#c26827ff",
	"Arcades and Attractions": "#c26827ff",
	"Store Fixtures": "#c26827ff",
	"Companies/Brands": "#2e8857ff",
	Events: "#2e8857ff",
	"Animatronic Control Systems": "#99852aff",
	"Other Systems": "#99852aff",
	Simulators: "#99852aff",
	"Programming Systems": "#99852aff",
	Commercials: "#d14a4a",
	"News Footage": "#d14a4a",
	"Company Media": "#d14a4a",
	Movies: "#d14a4a",
	Puppets: "#7b4fd6",
	"Live Shows": "#7b4fd6",
	"ShowBiz Pizza Programs": "#7b4fd6",
	"Showtape Formats": "#7b4fd6",
	"Family Vision": "#7b4fd6",
	"Corporate Documents": "#607f77ff",
	Documents: "#607f77ff",
	"Promotional Material": "#607f77ff",
	"Social Media and Websites": "#607f77ff",
	"Ad Vehicles": "#607f77ff",
	"In-Store Merchandise": "#0d9488",
	Products: "#0d9488",
	"Menu Items": "#0d9488",
	Tickets: "#0d9488",
	Tokens: "#0d9488",
	"Employee Wear": "#0d9488",
	"Video Games": "#0d9488",
	"Sally Corporation": "#b7471bff",
	"Jim Henson's Creature Shop": "#b7471bff",
	"Walt Disney Imagineering": "#b7471bff",
	"Five Nights at Freddy's": "#b7471bff",
	Transcriptions: "#5a5a5a",
	"Unknown Year": "#5a5a5a",
	2026: "#5a5a5a",
	1977: "#5a5a5a",
	User: "#5a5a5a",
	Meta: "#5a5a5a"
}, Ir = {
	Animatronics: "spiky_speech_bubble.svg",
	"Animatronic Shows": "bang.svg",
	"Animatronic Parts": "factory.svg",
	"Animatronic Preservation": "wrench.svg",
	"Stage Variations": "speaker.svg",
	"Costumed Characters": "back_of_hand_hoof_d1.svg",
	Characters: "thumbs_up_paw.svg",
	Locations: "world_map.svg",
	"Cancelled Locations": "bomb.svg",
	Showtapes: "music_notes.svg",
	"Showtape Formats": "vhs.svg",
	"ShowBiz Pizza Programs": "cassette.svg",
	"Family Vision": "projector.svg",
	"Live Shows": "music_note.svg",
	Puppets: "back_of_hand_paw_k2.svg",
	Commercials: "movie_camera.svg",
	"News Footage": "tv.svg",
	"Company Media": "dvd.svg",
	Movies: "cinema.svg",
	Transcriptions: "pencil.svg",
	"Video Games": "gamepad.svg",
	"Menu Items": "pizza.svg",
	Tickets: "cross.svg",
	Tokens: "cross.svg",
	Documents: "page.svg",
	"Corporate Documents": "page_with_pencil.svg",
	"Promotional Material": "curled_page.svg",
	Events: "tada.svg",
	"Remodels and Initiatives": "construction_sign.svg",
	Retrofits: "pirate_flag.svg",
	2026: "calendar.svg",
	1977: "calendar.svg",
	"Unknown Year": "calendar.svg",
	"Pizza Time Theatre": "pizza.svg",
	"ShowBiz Pizza Place": "bang.svg",
	"Chuck E. Cheese's": "birthday_cake.svg",
	History: "spider_web.svg",
	"Arcades and Attractions": "arcade_stick.svg",
	"Companies/Brands": "bomb.svg",
	"Animatronic Control Systems": "level_slider.svg",
	"Other Systems": "fax_machine.svg",
	"Programming Systems": "keyboard.svg",
	Simulators: "purple_sunset.svg",
	"Social Media and Websites": "globe.svg",
	"Ad Vehicles": "bus.svg",
	"In-Store Merchandise": "lp.svg",
	Products: "dollar.svg",
	"Employee Wear": "free.svg",
	"Sally Corporation": "briefcase.svg",
	"Jim Henson's Creature Shop": "cinema.svg",
	"Walt Disney Imagineering": "decreasing_graph.svg",
	"Five Nights at Freddy's": "crt_noise.svg",
	User: "furry_pride.svg",
	Meta: "red_question_mark.svg",
	"Store Fixtures": "package.svg"
}, Q = [], $ = {}, Lr = [], Rr = {}, zr = /* @__PURE__ */ new Map(), Br = /* @__PURE__ */ new Map(), Vr = /* @__PURE__ */ new Map(), Hr = /* @__PURE__ */ new Map(), Ur = {}, Wr = null;
function Gr(e) {
	e = "  " + Kr(e) + "  ";
	let t = /* @__PURE__ */ new Set();
	for (let n = 0; n + 3 <= e.length; n++) {
		let r = e.slice(n, n + 3);
		r.trim() && t.add(r);
	}
	return t;
}
var Kr = (e) => e ? String(e).toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() : "";
function qr(e) {
	let [t] = w(async () => {
		try {
			return await e.build();
		} catch (e) {
			return console.error("[Search] failed to build result:", e), null;
		}
	});
	return N(F, {
		get when() {
			return t();
		},
		get children() {
			return t();
		}
	});
}
function Jr(e) {
	if (!e) return "";
	let t = Date.now() / 1e3, n = Math.floor(t - e);
	if (n < 0 || n < 60) return "just now";
	if (n < 3600) {
		let e = Math.floor(n / 60);
		return `${e} minute${e === 1 ? "" : "s"} ago`;
	}
	if (n < 86400) {
		let e = Math.floor(n / 3600);
		return `${e} hour${e === 1 ? "" : "s"} ago`;
	}
	if (n < 604800) {
		let e = Math.floor(n / 86400);
		return `${e} day${e === 1 ? "" : "s"} ago`;
	}
	if (n < 2592e3) {
		let e = Math.floor(n / 604800);
		return `${e} week${e === 1 ? "" : "s"} ago`;
	}
	if (n < 31536e3) {
		let e = Math.floor(n / 2592e3);
		return `${e} month${e === 1 ? "" : "s"} ago`;
	}
	return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function Yr(e) {
	let t = parseDateParts(e);
	return t && t.y ? t.y : "Unknown";
}
function Xr(e, t, n) {
	let r = document.createElement("button");
	r.className = "s-qtag-btn", r.dataset.tag = e, r.onclick = () => t(e);
	let i = Fr[e];
	i && r.style.setProperty("--tag-color", i);
	let a = Ir[e];
	if (a) {
		let e = document.createElement("img");
		e.src = Pr + a, e.className = "s-qtag-icon", e.alt = "", e.setAttribute("aria-hidden", "true"), r.appendChild(e);
	}
	let o = document.createElement("span");
	if (o.textContent = e, r.appendChild(o), n != null) {
		let e = document.createElement("span");
		e.className = "s-qtag-count", e.textContent = `(${n})`, r.appendChild(e);
	}
	return r;
}
function Zr(e, t, n, r = {}) {
	(Array.isArray(t) ? t : [t]).forEach((t) => {
		e.appendChild(Xr(t, n, r[t] ?? null));
	});
}
function Qr(e, t) {
	if (!e.size || !t.size) return 0;
	let n = 0;
	for (let r of e) t.has(r) && n++;
	return n / (e.size + t.size - n);
}
function $r() {
	return Wr ??= (async () => {
		let [e, t, n] = await Promise.all([
			fetch(`${Ar}/docs.json`),
			fetch(`${Ar}/tags.json`),
			fetch("/viewers/cep-js/compiled-json/views.json")
		]);
		Q = await e.json(), $ = await t.json(), Rr = n.ok ? await n.json() : {}, Lr = Object.keys($).sort((e, t) => e.localeCompare(t, void 0, { sensitivity: "base" })), zr = new Map(Lr.map((e) => [e.toLowerCase(), e])), Br = /* @__PURE__ */ new Map();
		for (let e of Q) if (e) {
			let t = Kr(e.t || "");
			t && !Br.has(t) && Br.set(t, e);
		}
		Vr = /* @__PURE__ */ new Map();
		for (let e of Lr) {
			let t = Br.get(Kr(e)), n = "";
			if (t) {
				let e = t.d && !t.d.startsWith("0000") ? t.d.slice(0, 4) : null, r = t.de && !t.de.startsWith("0000") ? t.de.slice(0, 4) : null;
				e && r && r !== e ? n = `${e}–${r}` : e && !t.de ? n = t.d ? `${e}–Present` : "" : e ? n = e : r && (n = r);
			} else {
				let t = null, r = null;
				for (let n of $[e] || []) {
					let e = Q[n];
					if (!e || !e.d || e.d.startsWith("0000")) continue;
					let i = e.d.slice(0, 4);
					(!t || i < t) && (t = i), (!r || i > r) && (r = i);
				}
				t && r && r !== t ? n = `${t}–${r}` : t && (n = t);
			}
			n && Vr.set(e, n);
		}
		Hr = /* @__PURE__ */ new Map();
		for (let e of jr) if (e.types) for (let t of e.types) Hr.set(t.toLowerCase(), e.id);
		window.DOCS = Q, window.TAGS = $;
	})();
}
async function ei(e) {
	if (Ur[e] !== void 0) return Ur[e];
	try {
		let t = await fetch(`${Ar}/tri_${e}.json`);
		Ur[e] = t.ok ? await t.json() : {};
	} catch {
		Ur[e] = {};
	}
	return Ur[e];
}
var ti = null;
Promise.resolve();
var ni = (e) => ({
	title: e.t,
	type: e.tp,
	startDate: e.d,
	endDate: e.de
});
function ri(e, t, n) {
	if (n !== "newest-updated" && n !== "oldest-updated" || !t.mt) return;
	let r = e.querySelector(".s-item-meta") || e.querySelector(".CardText");
	if (!r) return;
	let i = [...r.childNodes].filter((e) => e.nodeType === Node.TEXT_NODE).pop(), a = "Updated " + Jr(t.mt) + " - ";
	i ? i.textContent = a : r.appendChild(document.createTextNode(a));
}
function ii() {
	let [e, t] = y([]), [n, r] = y(""), [i, a] = y([]), [o, s] = y(-1), [c, l] = y("articles"), [u, d] = y(null), [f, p] = y(!1), [m, h] = y("20"), [g, _] = y("relevancy"), [v, b] = y(localStorage.getItem("sDisplay") || "card"), [C, ee] = y(localStorage.getItem("sKeepTags") === "1"), w, T, ie, ae = null, E = 0, oe;
	new Promise((e) => oe = e);
	let se = () => e().length > 0, ce = () => se(), D = () => f() && (!se() || C());
	function O() {
		a([]), s(-1);
	}
	function k(n, i, a = !1) {
		if (!i) return;
		n === "tag" && (i = zr.get(i.toLowerCase()) || i);
		let o = i.toLowerCase(), s = e();
		if (s.some((e) => e.type === n && e.value.toLowerCase() === o && e.neg === a)) return;
		let c = s.filter((e) => e.type !== n || e.value.toLowerCase() !== o || e.neg === a);
		c.push({
			type: n,
			value: i,
			neg: a
		}), t(c), p(!0), r(""), O();
	}
	ti = k;
	function le(n) {
		t(e().filter((e, t) => t !== n)), p(!0);
	}
	function ue(e) {
		if (!e) {
			O();
			return;
		}
		let t = e.startsWith("-"), n = Kr(t ? e.slice(1) : e);
		if (!n) {
			O();
			return;
		}
		let r = Lr.filter((e) => Kr(e).includes(n)).map((e) => ({
			t: e,
			count: ($[e] || []).length,
			neg: t
		})).sort((e, t) => t.count - e.count).slice(0, 12);
		if (!r.length) {
			O();
			return;
		}
		a(r), s(-1);
	}
	function A(e) {
		T?.children[e]?.scrollIntoView({ block: "nearest" });
	}
	function j(e) {
		let t = i();
		if (e.key === "Enter" || e.key === "Tab") {
			e.preventDefault();
			let r = t[o()];
			if (r) k("tag", r.t, r.neg);
			else {
				let e = n().trim();
				if (e) {
					let t = e.startsWith("-"), n = t ? e.slice(1) : e, r = zr.get(n.toLowerCase());
					k(r ? "tag" : "fuzzy", r || n, t);
				}
			}
		} else if (e.key === "ArrowDown" && t.length) {
			e.preventDefault();
			let n = Math.min(o() + 1, t.length - 1);
			s(n), A(n);
		} else if (e.key === "ArrowUp" && t.length) {
			e.preventDefault();
			let t = Math.max(o() - 1, 0);
			s(t), A(t);
		} else e.key === "Escape" && O();
	}
	async function de() {
		if (!Q.length) return;
		let t = ++E, n = e().filter((e) => e.type === "tag"), r = e().filter((e) => e.type === "fuzzy").map((e) => e.value).join(" ");
		if (!n.length && !r) {
			d(null);
			return;
		}
		let i;
		if (r) {
			let e = Gr(r), a = Kr(r), o = new Set([...e].map((e) => e[0].match(/[a-z]/) ? e[0] : "_")), s = await Promise.all([...o].map(ei));
			if (t !== E) return;
			let c = Object.assign({}, ...s), l = {};
			for (let t of e) {
				let e = c[t];
				if (e) for (let t in e) l[t] = (l[t] || 0) + e[t];
			}
			let u = n.map((e) => ({
				neg: e.neg,
				ids: new Set($[e.value] || [])
			}));
			i = Object.entries(l).map(([t, n]) => {
				let r = Q[+t];
				if (!r) return null;
				for (let e of u) if (e.neg && e.ids.has(+t) || !e.neg && !e.ids.has(+t)) return null;
				return {
					score: n / e.size + (Kr(r.t || "").includes(a) ? .3 : 0),
					doc: r
				};
			}).filter(Boolean).sort((e, t) => t.score - e.score);
		} else {
			let e = null;
			for (let t of n) {
				let n = new Set(($[t.value] || []).map(Number));
				if (t.neg) {
					e ||= new Set(Q.map((e, t) => t));
					for (let t of n) e.delete(t);
				} else if (!e) e = new Set(n);
				else {
					let [t, r] = e.size < n.size ? [e, n] : [n, e], i = /* @__PURE__ */ new Set();
					for (let e of t) r.has(e) && i.add(e);
					e = i;
				}
			}
			i = [...e || []].map((e) => ({
				score: 0,
				doc: Q[e]
			})).filter((e) => e.doc);
			let t = n.find((e) => !e.neg);
			if (t) {
				let e = Gr(t.value);
				i.forEach((t) => t.score = Qr(Gr(t.doc.t || ""), e)), i.sort((e, t) => t.score - e.score);
			}
		}
		let a = g();
		a !== "relevancy" && i.sort((e, t) => {
			if (a === "most-views" || a === "least-views") {
				let n = Rr[e.doc.p] || 0, r = Rr[t.doc.p] || 0;
				return a === "most-views" ? r - n : n - r;
			}
			if (a === "newest-updated" || a === "oldest-updated") {
				let n = e.doc.mt || 0, r = t.doc.mt || 0;
				return a === "newest-updated" ? r - n : n - r;
			}
			let n = e.doc.d || "", r = t.doc.d || "", i = !n || n === "0000-00-00" || n.startsWith("0000"), o = !r || r === "0000-00-00" || r.startsWith("0000");
			return i && o ? 0 : i ? 1 : o ? -1 : a === "oldest" ? n.localeCompare(r) : r.localeCompare(n);
		});
		let o = {};
		jr.forEach((e) => o[e.id] = []);
		for (let e of i) o[Hr.get((e.doc.tp || "").toLowerCase()) || "articles"].push(e);
		let s = m() === "all" ? Infinity : parseInt(m()) || 10, c = a === "oldest" || a === "newest", l = {};
		for (let e of jr) {
			let t = o[e.id], n;
			if (s === Infinity) n = t;
			else if (c) {
				let e = t.slice(0, s);
				if (e.length < t.length) {
					let r = Yr(e[e.length - 1].doc.d), i = s;
					for (; i < t.length && Yr(t[i].doc.d) === r;) i++;
					n = t.slice(0, i);
				} else n = e;
			} else n = t.slice(0, s);
			l[e.id] = {
				total: t.length,
				shown: n,
				more: s !== Infinity && t.length > n.length
			};
		}
		t === E && d({
			tabs: l,
			byYear: c,
			sort: a,
			display: v()
		});
	}
	function fe() {
		clearTimeout(ae), ae = setTimeout(de, 150);
	}
	function pe(e, t, n, r) {
		let i = Nr[n] || Nr.card;
		return N(qr, { build: async () => {
			let t = await rr(e.p).catch(() => null) || ni(e), n = await i(t);
			return ri(n, e, r), n;
		} });
	}
	function me(e) {
		let t = u();
		if (!t) return null;
		let { total: n, shown: r } = t.tabs[e];
		if (!n) return yr();
		let i = e === "photos", a = e === "reviews", o = t.display === "card", s = (n) => n.map((n) => pe(n.doc, e, t.display, t.sort));
		if (t.byYear) {
			let e = {}, t = [];
			return r.forEach((n) => {
				let r = Yr(n.doc.d);
				e[r] || (e[r] = [], t.push(r)), e[r].push(n);
			}), t.map((t) => (() => {
				var n = br(), r = n.firstChild;
				return B(r, t), B(n, () => o && i ? (() => {
					var n = xr();
					return B(n, () => s(e[t])), n;
				})() : o && !a ? (() => {
					var n = Sr();
					return B(n, () => s(e[t])), n;
				})() : s(e[t]), null), n;
			})());
		}
		return o && i ? (() => {
			var e = xr();
			return B(e, () => s(r)), e;
		})() : o && !a ? (() => {
			var e = Cr();
			return B(e, () => s(r)), e;
		})() : s(r);
	}
	function he(e) {
		e.preventDefault();
		let t = [
			"20",
			"50",
			"100",
			"all"
		];
		h(t[Math.min(t.indexOf(m()) + 1, t.length - 1)]);
	}
	S(te(e, () => fe(), { defer: !0 })), S(te([
		g,
		m,
		v
	], () => {
		e().length && de();
	}, { defer: !0 })), ne(async () => {
		Zr(ie, Mr, (e) => k("tag", e, !1)), await $r(), ie.querySelectorAll(".s-qtag-btn").forEach((e) => {
			let t = ($[e.dataset.tag] || []).length;
			if (t) {
				let n = e.querySelector(".s-qtag-count");
				n || (n = document.createElement("span"), n.className = "s-qtag-count", e.appendChild(n)), n.textContent = `(${t})`;
			}
		}), oe(), e().length && de();
	});
	let M = (e) => {
		!T?.contains(e.target) && e.target !== w && O();
	};
	return document.addEventListener("click", M), re(() => {
		document.removeEventListener("click", M), clearTimeout(ae), ti === k && (ti = null);
	}), (() => {
		var t = wr(), a = t.firstChild, d = a.firstChild, f = d.firstChild, y = f.nextSibling, S = d.nextSibling, te = a.nextSibling, ne = te.firstChild.nextSibling, re = te.nextSibling, ae = re.firstChild, E = ae.firstChild, oe = E.firstChild.nextSibling, se = E.nextSibling, O = se.firstChild.nextSibling, A = se.nextSibling, de = A.firstChild.nextSibling, fe = A.nextSibling.firstChild, pe = ae.nextSibling, M = pe.nextSibling;
		d.$$click = (e) => {
			e.target.closest(".s-chip-x") || w.focus();
		}, B(f, N(P, {
			get each() {
				return e();
			},
			children: (e, t) => (() => {
				var n = Tr(), r = n.firstChild;
				return r.$$click = (e) => {
					e.stopPropagation(), le(t());
				}, B(n, () => (e.neg ? "-" : "") + (e.type === "fuzzy" ? "\"" + e.value + "\"" : e.value), null), x(() => z(n, "s-chip " + (e.type === "fuzzy" ? "s-chip-fuzzy" : e.neg ? "s-chip-neg" : "s-chip-tag"))), n;
			})()
		})), y.addEventListener("focus", () => p(!0)), y.$$keydown = j, y.$$input = (e) => {
			r(e.currentTarget.value), ue(e.currentTarget.value);
		};
		var ge = w;
		typeof ge == "function" ? Me(ge, y) : w = y;
		var _e = T;
		typeof _e == "function" ? Me(_e, S) : T = S, B(S, N(P, {
			get each() {
				return i();
			},
			children: (e, t) => (() => {
				var n = Dr(), r = n.firstChild, i = r.nextSibling;
				return n.$$mouseover = () => s(t()), n.$$mousedown = (t) => {
					t.preventDefault(), k("tag", e.t, e.neg);
				}, B(r, () => (e.neg ? "-" : "") + e.t), B(i, N(F, {
					get when() {
						return Vr.get(e.t);
					},
					get children() {
						var t = Er();
						return B(t, () => Vr.get(e.t)), t;
					}
				}), null), B(i, () => e.count, null), x(() => n.classList.toggle("active", o() === t())), n;
			})()
		}));
		var ve = ie;
		return typeof ve == "function" ? Me(ve, ne) : ie = ne, oe.addEventListener("change", (e) => h(e.currentTarget.value)), O.addEventListener("change", (e) => _(e.currentTarget.value)), de.addEventListener("change", (e) => {
			b(e.currentTarget.value), localStorage.setItem("sDisplay", e.currentTarget.value);
		}), fe.addEventListener("change", (e) => {
			ee(e.currentTarget.checked), localStorage.setItem("sKeepTags", e.currentTarget.checked ? "1" : "0"), p(!0);
		}), B(pe, N(P, {
			each: jr,
			children: (e) => (() => {
				var t = Or();
				return t.$$click = () => l(e.id), B(t, (() => {
					var t = I(() => !!u());
					return () => t() ? `${e.label} (${u().tabs[e.id].total})` : e.label;
				})()), x((n) => {
					var r = c() === e.id, i = e.id;
					return r !== n.e && t.classList.toggle("active", n.e = r), i !== n.t && R(t, "data-tab", n.t = i), n;
				}, {
					e: void 0,
					t: void 0
				}), t;
			})()
		})), B(M, N(P, {
			each: jr,
			children: (e) => (() => {
				var t = kr(), n = t.firstChild, r = n.nextSibling, i = r.firstChild;
				return B(n, () => me(e.id)), i.$$click = he, x((i) => {
					var a = c() === e.id, o = "panel-" + e.id, s = "list-" + e.id, l = "more-" + e.id, d = u()?.tabs[e.id].more ? "block" : "none";
					return a !== i.e && t.classList.toggle("active", i.e = a), o !== i.t && R(t, "id", i.t = o), s !== i.a && R(n, "id", i.a = s), l !== i.o && R(r, "id", i.o = l), d !== i.i && je(r, "display", i.i = d), i;
				}, {
					e: void 0,
					t: void 0,
					a: void 0,
					o: void 0,
					i: void 0
				}), t;
			})()
		})), x((e) => {
			var t = i().length ? "block" : "none", n = D() ? "block" : "none", r = ce() ? "block" : "none";
			return t !== e.e && je(S, "display", e.e = t), n !== e.t && je(te, "display", e.t = n), r !== e.a && je(re, "display", e.a = r), e;
		}, {
			e: void 0,
			t: void 0,
			a: void 0
		}), x(() => y.value = n()), x(() => oe.value = m()), x(() => O.value = g()), x(() => de.value = v()), x(() => fe.checked = C()), t;
	})();
}
Ae([
	"click",
	"input",
	"keydown",
	"mousedown",
	"mouseover"
]);
//#endregion
//#region src/Renderers.jsx
var ai = /*#__PURE__*/ L("<div class=\"Card fade-in\"><div class=CardImage></div><div class=CardTextArea><div class=CardLink><span><a></a></span></div><div class=CardText><strong></strong> 👁"), oi = /*#__PURE__*/ L("<a><img loading=lazy>", !0, !1, !1), si = /*#__PURE__*/ L("<a class=CardImageExcerpt>"), ci = /*#__PURE__*/ L("<div><div></div><div><div><span><a></a></span></div><div><strong></strong> 👁"), li = /*#__PURE__*/ L("<div class=404>You've found an article that doesn't exist yet! Click the logo to head back home."), ui = /*#__PURE__*/ L("<div class=Homepage><center>Welcome to Cheese-E-Pedia! This unofficial wiki is the archive for all things animatronics!<br>Use the search above to explore our site! Something not listed here? Help contribute or <a href=\"/?v=cep-editor\">create a new page!</a></center><h2>News</h2><h2>Wiki</h2><h2>Community"), di = /*#__PURE__*/ L("<div class=Carousel>"), fi = /*#__PURE__*/ L("<div class=Footer>Last build on: <span id=StatBuildDate>???</span>. Content is available under CC BY-SA 4.0. and rehostable. Cheese-E-Pedia is not associated with any person, company, or entity in its articles. <a href=https://youtu.be/Vce1hFNVI1o>All</a> rights <a href=https://vyletpony.bandcamp.com/track/falling-in-love-with-a-corporate-illustration>reserved</a> for <a href=https://youtu.be/y8LVM3rVSM4>our</a> lovely <a href=https://vyletpony.bandcamp.com/track/webpunk-ft-nekosnicker>trans</a> queers <a href=https://youtu.be/hdus_rz7O3o>forever</a>! <a href=https://www.tumblr.com/ytpforyouandme/728755424298401793>Corporations</a> should rot in <a href=https://stomachbook.bandcamp.com/track/my-diorama>hell</a>, keep things <a href=https://youtu.be/tkUgOT22F5s>independent</a> and <a href=https://crimethinc.com/>community</a> focused, and no <a href=https://consumerrights.wiki/w/Main_Page>gatekeepers!</a><br><br><a href=\"/?v=cep-solid&amp;=75z6oyfn7xf7t4ol\">About</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrgt\">Privacy Policy</a> • <a href=\"/?v=cep-solid&amp;=o2eldeduwff18fw2\">Rules</a> • <a href=\"/?v=cep-solid&amp;=v144sposbsi3z29v\">FAQ</a> • <a href=\"/?v=cep-solid&amp;page=stats\">Nerd Stuff</a> • <a href=\"/?v=cep-solid&amp;=434ngf34ngjktegrfh\">Manual</a> • <a href=\"/?v=cep-solid&amp;page=settings\">Settings"), pi = /*#__PURE__*/ L("<div class=Header><div class=SplashText id=SpashText>. . .</div><a href=\"/?v=cep-solid\"class=Logo><img alt=Cheesepedia></a><div class=FlavorText>Now at <strong><span id=StatArticles>????</span></strong> articles contributed by <strong><span id=StatContributors>???</span></strong> users.<br>Discussions available on the <strong><a href=https://forum.cheeseepedia.org/>Forums!</a></strong></div><div class=Search>"), mi = /*#__PURE__*/ L("<div>"), hi = /*#__PURE__*/ L("<button type=button class=PinButton>"), gi = /*#__PURE__*/ L("<div class=TabPanel>"), _i = /*#__PURE__*/ L("<h2>Cheese-E-Shuffle"), vi = /*#__PURE__*/ L("<div>Loading…"), yi = /*#__PURE__*/ L("<div>Nothing found."), bi = /*#__PURE__*/ L("<div id=RandomCards class=Carousel>"), xi = /*#__PURE__*/ L("<div class=infobox-list><strong>:</strong><ul>"), Si = /*#__PURE__*/ L("<iframe title=Video loading=lazy allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\"allowfullscreen referrerpolicy=strict-origin-when-cross-origin>", !0, !1, !1), Ci = /*#__PURE__*/ L("<video controls preload=metadata>"), wi = /*#__PURE__*/ L("<a class=VideoLink target=_blank rel=\"noopener noreferrer\">"), Ti = /*#__PURE__*/ L("<div class=\"VideoEmbed fade-in\">"), Ei = /*#__PURE__*/ L("<h1 class=article-title>"), Di = /*#__PURE__*/ L("<div class=OldWarning>The following article content is unsourced, in an old formatting, and needs to be rewritten. Any new text added to the page will hide this previous content."), Oi = /*#__PURE__*/ L("<div class=fade-in>"), ki = /*#__PURE__*/ L("<div class=\"ArticleBody type-video\"><div class=\"content fade-in type-video\"><h2>Video Transcription"), Ai = /*#__PURE__*/ L("<div class=\"NoContent fade-in\">No transcription provided by source."), ji = /*#__PURE__*/ L("<div class=\"ArticleBody type-photo\"><div class=\"ArticlePhoto fade-in type-photo\"></div><div class=\"content fade-in type-photo\"><h2>Image Description"), Mi = /*#__PURE__*/ L("<div class=\"NoContent fade-in\">No description provided. Help write one for accessibility."), Ni = /*#__PURE__*/ L("<tr><td><strong>Floorspace</strong></td><td>ft<sup>2</sup><div class=emoji>📐"), Pi = /*#__PURE__*/ L("<div class=infobox-list><strong>Credits:</strong><ul>"), Fi = /*#__PURE__*/ L("<div class=ArticleBody><div class=\"infobox fade-in\"><div class=infobox-thumbnail></div><table><tbody><tr><td><strong>Operated</strong></td><td><div class=emoji>🚧</div><br><div class=emoji>☠️</div></td></tr></tbody></table></div><div class=\"content fade-in\">"), Ii = /*#__PURE__*/ L("<li><strong></strong> (<!>)"), Li = /*#__PURE__*/ L("<div class=infobox-desc>"), Ri = /*#__PURE__*/ L("<li><strong></strong> (<!> – <!>)"), zi = /*#__PURE__*/ L("<li><a target=_blank rel=\"noopener noreferrer\">"), Bi = /*#__PURE__*/ L("<li>"), Vi = /*#__PURE__*/ L("<li><strong>:</strong> "), Hi = /*#__PURE__*/ L("<div class=\"NoContent fade-in\">No article content. Come write some!"), Ui = /* @__PURE__ */ new Set([
	"photos",
	"videos",
	"reviews",
	"user",
	"steam comments",
	"theories",
	"meta",
	"transcriptions"
]), Wi = {
	Articles: (e) => !Ui.has(e),
	Photos: (e) => e === "photos",
	Videos: (e) => e === "videos",
	Reviews: (e) => e === "reviews"
}, Gi = 15, Ki = {
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
function qi(e) {
	if (e.type === "home") return ea();
	if (e.type === "notfound") return Qi(e.folderID);
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
		case "Steam Comments": return da(e);
		case "Videos": return la(e);
		case "Photos": return ua(e);
		default: return da(e);
	}
}
function Ji({ link: e, thumbnailSrc: t, title: n, dateText: r, views: i, excerpt: a = n }) {
	return (() => {
		var o = ai(), s = o.firstChild, c = s.nextSibling.firstChild, l = c.firstChild.firstChild, u = c.nextSibling, d = u.firstChild;
		return d.nextSibling, B(s, t ? (() => {
			var r = oi(), i = r.firstChild;
			return R(r, "href", e), R(i, "src", t), R(i, "alt", n), r;
		})() : (() => {
			var t = si();
			return R(t, "href", e), B(t, a), t;
		})()), R(l, "href", e), B(l, n), B(d, r), B(u, i, null), o;
	})();
}
async function Yi(e) {
	let t = await Y(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await pr(e);
	i ||= await ur(e);
	let a = await Ye(), o = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (o = t);
		}
	} catch {}
	let s = r ? ` type-${r}` : "";
	return (() => {
		var r = ci(), c = r.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, z(r, `Card fade-in${s}`), z(c, `CardImage${s}`), B(c, i), z(l, `CardTextArea${s}`), z(u, `CardLink${s}`), B(d, o), z(f, `CardText${s}`), B(p, (() => {
			var t = I(() => !!Ui.has(n));
			return () => t() ? Z(e.startDate) : [
				I(() => Z(e.startDate)),
				" – ",
				I(() => sr(e.endDate))
			];
		})()), B(f, () => a[t], null), x(() => R(d, "href", X(t))), r;
	})();
}
async function Xi(e) {
	let t = await Y(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await pr(e);
	i ||= await ur(e);
	let a = await Ye(), o = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (o = t);
		}
	} catch {}
	let s = r ? ` type-${r}` : "";
	return (() => {
		var r = ci(), c = r.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, z(r, `Card fade-in${s}`), z(c, `CardImage${s}`), B(c, i), z(l, `CardTextArea${s}`), z(u, `CardLink${s}`), B(d, o), z(f, `CardText${s}`), B(p, (() => {
			var t = I(() => !!Ui.has(n));
			return () => t() ? Z(e.startDate) : [
				I(() => Z(e.startDate)),
				" – ",
				I(() => sr(e.endDate))
			];
		})()), B(f, () => a[t], null), x(() => R(d, "href", X(t))), r;
	})();
}
async function Zi(e) {
	let t = await Y(e.title), n = (e.type || "").toLowerCase(), r = n.replace(/s$/, "").replace(/[^a-z0-9]+/g, "-"), i = await pr(e);
	i ||= await ur(e);
	let a = await Ye(), o = e.title;
	if (n === "photos") try {
		let e = await fetch(`/content/${t}/content.md`), n = (e.headers.get("content-type") || "").includes("text/html");
		if (e.ok && !n) {
			let t = (await e.text()).trim();
			t && (o = t);
		}
	} catch {}
	let s = r ? ` type-${r}` : "";
	return (() => {
		var r = ci(), c = r.firstChild, l = c.nextSibling, u = l.firstChild, d = u.firstChild.firstChild, f = u.nextSibling, p = f.firstChild;
		return p.nextSibling, z(r, `Card fade-in${s}`), z(c, `CardImage${s}`), B(c, i), z(l, `CardTextArea${s}`), z(u, `CardLink${s}`), B(d, o), z(f, `CardText${s}`), B(p, (() => {
			var t = I(() => !!Ui.has(n));
			return () => t() ? Z(e.startDate) : [
				I(() => Z(e.startDate)),
				" – ",
				I(() => sr(e.endDate))
			];
		})()), B(f, () => a[t], null), x(() => R(d, "href", X(t))), r;
	})();
}
function Qi() {
	return li();
}
async function $i(e) {
	let t = await e(), n = await Promise.all(t.map((e) => rr(e).catch(() => null)));
	return Promise.all(n.filter(Boolean).map((e) => Yi(e)));
}
function ea() {
	let [e] = w(Ze), [t] = w(Qe), [n] = w(vr), [r] = w(() => $i(qe)), [i] = w(() => $i(Ke));
	return (() => {
		var a = ui(), o = a.firstChild.nextSibling.nextSibling, s = o.nextSibling;
		return B(a, N(ra, { tabs: [{
			name: "The News",
			content: () => (() => {
				var t = di();
				return B(t, N(P, {
					get each() {
						return e() || [];
					},
					children: (e) => Ji({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: mr(e.created_at),
						views: e.views
					})
				})), t;
			})()
		}, {
			name: "Official Videos",
			content: () => (() => {
				var e = di();
				return B(e, N(P, {
					get each() {
						return r() || [];
					},
					children: (e) => e
				})), e;
			})()
		}] }), o), B(a, N(ra, { tabs: [{
			name: "Map",
			content: () => N(F, {
				get when() {
					return I(() => !n.loading)() && n();
				},
				get children() {
					return n();
				}
			})
		}] }), s), B(a, N(ra, { tabs: [{
			name: "Fan Videos",
			content: () => (() => {
				var e = di();
				return B(e, N(P, {
					get each() {
						return i() || [];
					},
					children: (e) => e
				})), e;
			})()
		}, {
			name: "New Posts",
			content: () => (() => {
				var e = di();
				return B(e, N(P, {
					get each() {
						return t() || [];
					},
					children: (e) => Ji({
						link: e.url,
						thumbnailSrc: e.image_url,
						title: e.title,
						dateText: mr(e.created_at),
						views: e.views
					})
				})), e;
			})()
		}] }), null), a;
	})();
}
function ta() {
	return fi();
}
function na() {
	let e = Ki.standard;
	try {
		let t = localStorage.getItem("cep-theme") || "standard", n = JSON.parse(localStorage.getItem("cep-theme-custom") || "null");
		e = t === "custom" && n?.["--logo"] ? n["--logo"] : Ki[t] || Ki.standard;
	} catch {}
	return (() => {
		var t = pi(), n = t.firstChild.nextSibling, r = n.firstChild, i = n.nextSibling.nextSibling;
		return R(r, "src", "/viewers/cep-js/assets/Logos/" + e), B(i, N(ii, {})), t;
	})();
}
function ra(e) {
	let [t, n] = y(e.tabs[0].name);
	return [(() => {
		var r = mi();
		return B(r, N(P, {
			get each() {
				return e.tabs;
			},
			children: (e) => (() => {
				var r = hi();
				return r.$$click = () => n(e.name), B(r, () => e.name), x((n) => {
					var i = t() === e.name, a = t() === e.name;
					return i !== n.e && r.classList.toggle("active", n.e = i), a !== n.t && R(r, "aria-pressed", n.t = a), n;
				}, {
					e: void 0,
					t: void 0
				}), r;
			})()
		})), r;
	})(), N(P, {
		get each() {
			return e.tabs;
		},
		children: (e) => (() => {
			var n = gi();
			return B(n, () => e.content()), x((r) => je(n, "display", t() === e.name ? "" : "none")), n;
		})()
	})];
}
function ia(e) {
	for (let t = e.length - 1; t > 0; t--) {
		let n = Math.floor(Math.random() * (t + 1));
		[e[t], e[n]] = [e[n], e[t]];
	}
	return e;
}
function aa() {
	let [e, t] = y(dr("sRandomTab", "Articles", (e) => Object.hasOwn(Wi, e))), n = {};
	for (let e of Object.keys(Wi)) {
		let [t, r] = y([]), [i, a] = y(!1);
		n[e] = {
			entries: t,
			setEntries: r,
			loaded: i,
			setLoaded: a,
			started: !1
		};
	}
	let r = () => n[e()], i, a = () => i ??= Promise.all([Xe(), Ye()]);
	async function o(e) {
		let t = n[e];
		if (t.started) return;
		t.started = !0;
		let r = Wi[e], [i, o] = await a(), s = ia(Object.entries(i).filter(([e]) => r(e)).flatMap(([, e]) => e)), c = 0;
		for (let e = 0; e < s.length && c < Gi; e += 20) {
			let n = await Promise.all(s.slice(e, e + 20).map((e) => rr(e).catch(() => null))), r = [];
			for (let t = 0; t < n.length && c < Gi; t++) n[t] && (r.push({
				id: s[e + t],
				meta: n[t]
			}), c++);
			await Promise.all(r.map(async ({ id: e, meta: n }) => {
				let r = await Yi(n), i = o[e];
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
	return S(() => {
		let t = e();
		fr("sRandomTab", t), T(() => o(t));
	}), [
		_i(),
		(() => {
			var n = mi();
			return B(n, N(P, {
				get each() {
					return Object.keys(Wi);
				},
				children: (n) => (() => {
					var r = hi();
					return r.$$click = () => t(n), B(r, n), x((t) => {
						var i = e() === n, a = e() === n;
						return i !== t.e && r.classList.toggle("active", t.e = i), a !== t.t && R(r, "aria-pressed", t.t = a), t;
					}, {
						e: void 0,
						t: void 0
					}), r;
				})()
			})), n;
		})(),
		(() => {
			var e = bi();
			return B(e, N(P, {
				get each() {
					return r().entries();
				},
				children: (e) => e.card
			}), null), B(e, N(F, {
				get when() {
					return I(() => !r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return vi();
				}
			}), null), B(e, N(F, {
				get when() {
					return I(() => !!r().loaded())() && r().entries().length === 0;
				},
				get children() {
					return yi();
				}
			}), null), e;
		})()
	];
}
function oa(e) {
	return N(F, {
		get when() {
			return e.items?.length;
		},
		get children() {
			var t = xi(), n = t.firstChild, r = n.firstChild, i = n.nextSibling;
			return B(n, () => e.title, r), B(i, N(P, {
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
function sa(e) {
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
function ca(e) {
	let t = () => sa(e.url);
	return N(F, {
		get when() {
			return t();
		},
		get children() {
			var e = Ti();
			return B(e, N(Te, { get children() {
				return [
					N(Ee, {
						get when() {
							return t().kind === "iframe";
						},
						get children() {
							var e = Si();
							return x(() => R(e, "src", t().src)), e;
						}
					}),
					N(Ee, {
						get when() {
							return t().kind === "video";
						},
						get children() {
							var e = Ci();
							return x(() => R(e, "src", t().src)), e;
						}
					}),
					N(Ee, {
						get when() {
							return t().kind === "link";
						},
						get children() {
							var e = wi();
							return B(e, () => t().src), x(() => R(e, "href", t().src)), e;
						}
					})
				];
			} })), e;
		}
	});
}
function la(e) {
	let [t] = w(async () => cr(await Y(e.pageThumbnailFile))), [n] = w(() => _r(e)), [r] = w(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([ir(t).catch(() => ""), ar(t).catch(() => "")]);
		return {
			md: await gr(n),
			old: await gr(r)
		};
	});
	return [(() => {
		var t = Ei();
		return B(t, () => e.title), t;
	})(), (() => {
		var t = ki(), n = t.firstChild;
		return n.firstChild, B(t, N(ca, { get url() {
			return e.pageThumbnailVideo;
		} }), n), B(n, N(F, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return vi();
			},
			get children() {
				return N(F, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return Ai();
					},
					get children() {
						return [N(F, {
							get when() {
								return I(() => !r().md)() && r().old;
							},
							get children() {
								return Di();
							}
						}), (() => {
							var e = Oi();
							return x(() => e.innerHTML = J.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		}), null), t;
	})()];
}
function ua(e) {
	let [t] = w(() => pr(e)), [n] = w(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([ir(t).catch(() => ""), ar(t).catch(() => "")]);
		return {
			md: await gr(n),
			old: await gr(r)
		};
	});
	return [(() => {
		var t = Ei();
		return B(t, () => e.title), t;
	})(), (() => {
		var e = ji(), r = e.firstChild, i = r.nextSibling;
		return i.firstChild, B(r, N(F, {
			get when() {
				return I(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), B(i, N(F, {
			get when() {
				return !n.loading;
			},
			get fallback() {
				return vi();
			},
			get children() {
				return N(F, {
					get when() {
						return n()?.md || n()?.old;
					},
					get fallback() {
						return Mi();
					},
					get children() {
						return [N(F, {
							get when() {
								return I(() => !n().md)() && n().old;
							},
							get children() {
								return Di();
							}
						}), (() => {
							var e = Oi();
							return x(() => e.innerHTML = J.parse(n().md || n().old)), e;
						})()];
					}
				});
			}
		}), null), e;
	})()];
}
function da(e) {
	let [t] = w(async () => cr(await Y(e.pageThumbnailFile))), [n] = w(() => _r(e)), [r] = w(async () => {
		let t = e.folderID ?? await Y(e.title?.trim()), [n, r] = await Promise.all([ir(t).catch(() => ""), ar(t).catch(() => "")]);
		return {
			md: await gr(n),
			old: await gr(r)
		};
	});
	return [(() => {
		var t = Ei();
		return B(t, () => e.title), t;
	})(), (() => {
		var i = Fi(), a = i.firstChild, o = a.firstChild, s = o.nextSibling.firstChild, c = s.firstChild.firstChild.nextSibling, l = c.firstChild, u = l.nextSibling.nextSibling, d = a.nextSibling;
		return B(o, N(F, {
			get when() {
				return I(() => !t.loading)() && t();
			},
			get children() {
				return t();
			}
		})), B(c, () => Z(e.startDate), l), B(c, () => sr(e.endDate), u), B(s, N(F, {
			get when() {
				return e.sqft;
			},
			get children() {
				var t = Ni(), n = t.firstChild.nextSibling, r = n.firstChild;
				return B(n, () => e.sqft, r), t;
			}
		}), null), B(a, N(oa, {
			title: "Remodels",
			get items() {
				return e.remodels;
			},
			children: (e) => (() => {
				var t = Ii(), n = t.firstChild, r = n.nextSibling.nextSibling;
				return r.nextSibling, B(n, () => e.n), B(t, () => Z(e.s), r), t;
			})()
		}), null), B(a, N(oa, {
			title: "Stages",
			get items() {
				return e.stages;
			},
			children: (e) => (() => {
				var t = Ri(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, B(n, () => e.n), B(t, () => Z(e.s), r), B(t, () => sr(e.e), i), B(t, N(F, {
					get when() {
						return e.desc;
					},
					get children() {
						var t = Li();
						return B(t, () => e.desc), t;
					}
				}), null), t;
			})()
		}), null), B(a, N(oa, {
			title: "Franchisees",
			get items() {
				return e.franchisees;
			},
			children: (e) => (() => {
				var t = Ri(), n = t.firstChild, r = n.nextSibling.nextSibling, i = r.nextSibling.nextSibling;
				return i.nextSibling, B(n, () => e.n), B(t, () => Z(e.s), r), B(t, () => sr(e.e), i), t;
			})()
		}), null), B(a, N(oa, {
			title: "Downloads",
			get items() {
				return e.downloadLinks;
			},
			children: (e) => (() => {
				var t = zi(), n = t.firstChild;
				return B(n, () => e.label), x(() => R(n, "href", e.url)), t;
			})()
		}), null), B(a, N(oa, {
			title: "Showtape Formats",
			get items() {
				return e.showtapeFormats;
			},
			children: (e) => (() => {
				var t = Bi();
				return B(t, e), t;
			})()
		}), null), B(a, N(F, {
			get when() {
				return e.credits?.length;
			},
			get children() {
				var t = Pi(), n = t.firstChild.nextSibling;
				return B(n, N(P, {
					get each() {
						return e.credits;
					},
					children: (e) => (() => {
						var t = Vi(), n = t.firstChild, r = n.firstChild;
						return n.nextSibling, B(n, () => e.role, r), B(t, () => e.n, null), t;
					})()
				})), t;
			}
		}), null), B(a, N(F, {
			get when() {
				return I(() => !n.loading)() && n();
			},
			get children() {
				return n();
			}
		}), null), B(d, N(F, {
			get when() {
				return !r.loading;
			},
			get fallback() {
				return vi();
			},
			get children() {
				return N(F, {
					get when() {
						return r()?.md || r()?.old;
					},
					get fallback() {
						return Hi();
					},
					get children() {
						return [N(F, {
							get when() {
								return I(() => !r().md)() && r().old;
							},
							get children() {
								return Di();
							}
						}), (() => {
							var e = Oi();
							return x(() => e.innerHTML = J.parse(r().md || r().old)), e;
						})()];
					}
				});
			}
		})), i;
	})()];
}
Ae(["click"]);
//#endregion
//#region src/App.jsx
var fa = /*#__PURE__*/ L("<link rel=icon href=/viewers/cep-js/assets/Logos/favicon-cep.ico>"), pa = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/themes.css>"), ma = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/main.css>"), ha = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/extra.css>"), ga = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/fonts.css>"), _a = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/mobile-modifiers.css>"), va = /*#__PURE__*/ L("<link rel=stylesheet href=/viewers/cep-solid/css/theme-modifiers.css>");
function ya(e) {
	return [
		fa(),
		pa(),
		ma(),
		ha(),
		ga(),
		_a(),
		va(),
		I(na),
		I(() => qi(e)),
		I(aa),
		I(ta)
	];
}
//#endregion
//#region index.jsx
async function ba(e, t) {
	let n = await rr((e.get("") || "").replace(/^\/+|\/+$/g, ""));
	ke(() => ya(n), t);
}
//#endregion
export { ba as render };
