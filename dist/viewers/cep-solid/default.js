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
var n = { equals: (e, t) => e === t }, r = null, i = F, a = 1, o = 2, s = {
	owned: null,
	cleanups: null,
	context: null,
	owner: null
}, c = {}, l = null, u = null, d = null, f = null, p = null, m = 0;
function h(e, t) {
	let n = d, r = l, i = e.length === 0, a = t === void 0 ? r : t, o = i ? s : {
		owned: null,
		cleanups: null,
		context: a ? a.context : null,
		owner: a
	}, c = i ? e : () => e(() => x(() => R(o)));
	l = o, d = null;
	try {
		return N(c, !0);
	} finally {
		d = n, l = r;
	}
}
function g(e, t) {
	t = t ? Object.assign({}, n, t) : n;
	let r = {
		value: e,
		observers: null,
		observerSlots: null,
		comparator: t.equals || void 0
	};
	return [D.bind(r), (e) => (typeof e == "function" && (e = u && u.running && u.sources.has(r) ? e(r.tValue) : e(r.value)), O(r, e))];
}
function _(e, t, n) {
	k(j(e, t, !0, a));
}
function v(e, t, n) {
	k(j(e, t, !1, a));
}
function y(e, t, r) {
	r = r ? Object.assign({}, n, r) : n;
	let i = j(e, t, !0, 0);
	return i.observers = null, i.observerSlots = null, i.comparator = r.equals || void 0, k(i), D.bind(i);
}
function ee(e) {
	return e && typeof e == "object" && "then" in e;
}
function b(t, n, r) {
	let i, a, o;
	typeof n == "function" ? (i = t, a = n, o = r || {}) : (i = !0, a = t, o = n || {});
	let s = null, f = c, p = null, m = !1, h = !1, v = "initialValue" in o, b = typeof i == "function" && y(i), w = /* @__PURE__ */ new Set(), [T, D] = (o.storage || g)(o.initialValue), [O, k] = g(void 0), [A, j] = g(void 0, { equals: !1 }), [M, P] = g(v ? "ready" : "unresolved");
	l && S(() => {
		for (let e of w.keys()) e.decrement();
		w.clear(), u && s && u.promises.delete(s), s = null;
	}), e.context && (p = e.getNextContextId(), o.ssrLoadFrom === "initial" ? f = o.initialValue : e.load && e.has(p) && (f = e.load(p)));
	function F(e, t, n, r) {
		return s === e && (s = null, r !== void 0 && (v = !0), (e === f || t === f) && o.onHydrated && queueMicrotask(() => o.onHydrated(r, { value: t })), f = c, u && e && m ? (u.promises.delete(e), m = !1, N(() => {
			u.running = !0, I(t, n);
		}, !1)) : I(t, n)), t;
	}
	function I(e, t) {
		N(() => {
			t === void 0 && D(() => e), P(t === void 0 ? v ? "ready" : "unresolved" : "errored"), k(t);
			for (let e of w.keys()) e.decrement();
			w.clear();
		}, !1);
	}
	function L() {
		let e = E && te(E), t = T(), n = O();
		if (n !== void 0 && !s) throw n;
		return d && !d.user && e && _(() => {
			A(), s && (e.resolved && u && m ? u.promises.add(s) : w.has(e) || (e.increment(), w.add(e)));
		}), t;
	}
	function R(e = !0) {
		if (e !== !1 && h) return;
		h = !1;
		let t = b ? b() : i;
		if (m = u && u.running, t == null || t === !1) {
			F(s, x(T));
			return;
		}
		u && s && u.promises.delete(s);
		let n, r = f === c ? x(() => {
			try {
				return a(t, {
					value: T(),
					refetching: e
				});
			} catch (e) {
				n = e;
			}
		}) : f;
		if (n !== void 0) {
			F(s, void 0, B(n), t);
			return;
		}
		return ee(r) ? (s = r, "v" in r ? (r.s === 1 ? F(s, r.v, void 0, t) : F(s, void 0, B(r.v), t), r) : (h = !0, queueMicrotask(() => h = !1), N(() => {
			P(v ? "refreshing" : "pending"), j();
		}, !1), r.then((e) => F(r, e, void 0, t), (e) => F(r, void 0, B(e), t)))) : (F(s, r, void 0, t), r);
	}
	Object.defineProperties(L, {
		state: { get: () => M() },
		error: { get: () => O() },
		loading: { get() {
			let e = M();
			return e === "pending" || e === "refreshing";
		} },
		latest: { get() {
			if (!v) return L();
			let e = O();
			if (e && !s) throw e;
			return T();
		} }
	});
	let z = l;
	return b ? _(() => (z = l, R(!1))) : R(!1), [L, {
		refetch: (e) => C(z, () => R(e)),
		mutate: D
	}];
}
function x(e) {
	if (d === null) return e();
	let t = d;
	d = null;
	try {
		return e();
	} finally {
		d = t;
	}
}
function S(e) {
	return l === null || (l.cleanups === null ? l.cleanups = [e] : l.cleanups.push(e)), e;
}
function C(e, t) {
	let n = l, r = d;
	l = e, d = null;
	try {
		return N(t, !0);
	} catch (e) {
		H(e);
	} finally {
		l = n, d = r;
	}
}
var [w, T] = /*@__PURE__*/ g(!1);
function te(e) {
	let t;
	return l && l.context && (t = l.context[e.id]) !== void 0 ? t : e.defaultValue;
}
var E;
function D() {
	let e = u && u.running;
	if (this.sources && (e ? this.tState : this.state)) {
		if ((e ? this.tState : this.state) === a) k(this);
		else {
			let e = f;
			f = null, N(() => I(this), !1), f = e;
		}
	}
	if (d) {
		let e = this.observers;
		if (!e || e[e.length - 1] !== d) {
			let t = e ? e.length : 0;
			d.sources ? (d.sources.push(this), d.sourceSlots.push(t)) : (d.sources = [this], d.sourceSlots = [t]), e ? (e.push(d), this.observerSlots.push(d.sources.length - 1)) : (this.observers = [d], this.observerSlots = [d.sources.length - 1]);
		}
	}
	return e && u.sources.has(this) ? this.tValue : this.value;
}
function O(e, t, n) {
	let r = u && u.running && u.sources.has(e) ? e.tValue : e.value;
	if (!e.comparator || !e.comparator(r, t)) {
		if (u) {
			let r = u.running;
			(r || !n && u.sources.has(e)) && (u.sources.add(e), e.tValue = t), r || (e.value = t);
		} else e.value = t;
		e.observers && e.observers.length && N(() => {
			for (let t = 0; t < e.observers.length; t += 1) {
				let n = e.observers[t], r = u && u.running;
				r && u.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? f.push(n) : p.push(n), n.observers && L(n)), r ? n.tState = a : n.state = a);
			}
			if (f.length > 1e6) throw f = [], Error();
		}, !1);
	}
	return t;
}
function k(e) {
	if (!e.fn) return;
	R(e);
	let t = m;
	A(e, u && u.running && u.sources.has(e) ? e.tValue : e.value, t), u && !u.running && u.sources.has(e) && queueMicrotask(() => {
		N(() => {
			u && (u.running = !0), d = l = e, A(e, e.tValue, t), d = l = null;
		}, !1);
	});
}
function A(e, t, n) {
	let r, i = l, o = d;
	d = l = e;
	try {
		r = e.fn(t);
	} catch (t) {
		return e.pure && (u && u.running ? (e.tState = a, e.tOwned && e.tOwned.forEach(R), e.tOwned = void 0) : (e.state = a, e.owned && e.owned.forEach(R), e.owned = null)), e.updatedAt = n + 1, H(t);
	} finally {
		d = o, l = i;
	}
	(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? O(e, r, !0) : u && u.running && e.pure ? (u.sources.has(e) || (e.value = r), u.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function j(e, t, n, r = a, i) {
	let o = {
		fn: e,
		state: r,
		updatedAt: null,
		owned: null,
		sources: null,
		sourceSlots: null,
		cleanups: null,
		value: t,
		owner: l,
		context: l ? l.context : null,
		pure: n
	};
	return u && u.running && (o.state = 0, o.tState = r), l === null || l !== s && (u && u.running && l.pure ? l.tOwned ? l.tOwned.push(o) : l.tOwned = [o] : l.owned ? l.owned.push(o) : l.owned = [o]), o;
}
function M(e) {
	let t = u && u.running;
	if ((t ? e.tState : e.state) === 0) return;
	if ((t ? e.tState : e.state) === o) return I(e);
	if (e.suspense && x(e.suspense.inFallback)) return e.suspense.effects.push(e);
	let n = [e];
	for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < m);) {
		if (t && u.disposed.has(e)) return;
		(t ? e.tState : e.state) && n.push(e);
	}
	for (let r = n.length - 1; r >= 0; r--) {
		if (e = n[r], t) {
			let t = e, i = n[r + 1];
			for (; (t = t.owner) && t !== i;) if (u.disposed.has(t)) return;
		}
		if ((t ? e.tState : e.state) === a) k(e);
		else if ((t ? e.tState : e.state) === o) {
			let t = f;
			f = null, N(() => I(e, n[0]), !1), f = t;
		}
	}
}
function N(e, t) {
	if (f) return e();
	let n = !1;
	t || (f = []), p ? n = !0 : p = [], m++;
	try {
		let t = e();
		return P(n), t;
	} catch (e) {
		n || (p = null), f = null, H(e);
	}
}
function P(e) {
	if (f &&= (F(f), null), e) return;
	let t;
	if (u) {
		if (!u.promises.size && !u.queue.size) {
			let e = u.sources, n = u.disposed;
			p.push.apply(p, u.effects), t = u.resolve;
			for (let e of p) "tState" in e && (e.state = e.tState), delete e.tState;
			u = null, N(() => {
				for (let e of n) R(e);
				for (let t of e) {
					if (t.value = t.tValue, t.owned) for (let e = 0, n = t.owned.length; e < n; e++) R(t.owned[e]);
					t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0;
				}
				T(!1);
			}, !1);
		} else if (u.running) {
			u.running = !1, u.effects.push.apply(u.effects, p), p = null, T(!0);
			return;
		}
	}
	let n = p;
	p = null, n.length && N(() => i(n), !1), t && t();
}
function F(e) {
	for (let t = 0; t < e.length; t++) M(e[t]);
}
function I(e, t) {
	let n = u && u.running;
	n ? e.tState = 0 : e.state = 0;
	for (let r = 0; r < e.sources.length; r += 1) {
		let i = e.sources[r];
		if (i.sources) {
			let e = n ? i.tState : i.state;
			e === a ? i !== t && (!i.updatedAt || i.updatedAt < m) && M(i) : e === o && I(i, t);
		}
	}
}
function L(e) {
	let t = u && u.running;
	for (let n = 0; n < e.observers.length; n += 1) {
		let r = e.observers[n];
		(t ? !r.tState : !r.state) && (t ? r.tState = o : r.state = o, r.pure ? f.push(r) : p.push(r), r.observers && L(r));
	}
}
function R(e) {
	let t;
	if (e.sources) for (; e.sources.length;) {
		let t = e.sources.pop(), n = e.sourceSlots.pop(), r = t.observers;
		if (r && r.length) {
			let e = r.pop(), i = t.observerSlots.pop();
			n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i);
		}
	}
	if (e.tOwned) {
		for (t = e.tOwned.length - 1; t >= 0; t--) R(e.tOwned[t]);
		delete e.tOwned;
	}
	if (u && u.running && e.pure) z(e, !0);
	else if (e.owned) {
		for (t = e.owned.length - 1; t >= 0; t--) R(e.owned[t]);
		e.owned = null;
	}
	if (e.cleanups) {
		for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
		e.cleanups = null;
	}
	u && u.running ? e.tState = 0 : e.state = 0;
}
function z(e, t) {
	if (t || (e.tState = 0, u.disposed.add(e)), e.owned) for (let t = 0; t < e.owned.length; t++) z(e.owned[t]);
}
function B(e) {
	return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function V(e, t, n) {
	try {
		for (let n of t) n(e);
	} catch (e) {
		H(e, n && n.owner || null);
	}
}
function H(e, t = l) {
	let n = r && t && t.context && t.context[r], i = B(e);
	if (!n) throw i;
	p ? p.push({
		fn() {
			V(i, n, t);
		},
		state: a
	}) : V(i, n, t);
}
function U(e, t) {
	return x(() => e(t || {}));
}
var W = (e) => `Stale read from <${e}>.`;
function G(e) {
	let t = e.keyed, n = y(() => e.when, void 0, void 0), r = t ? n : y(n, void 0, { equals: (e, t) => !e == !t });
	return y(() => {
		let i = r();
		if (i) {
			let a = e.children;
			return typeof a == "function" && a.length > 0 ? x(() => a(t ? i : () => {
				if (!x(r)) throw W("Show");
				return n();
			})) : a;
		}
		return e.fallback;
	}, void 0, void 0);
}
//#endregion
//#region node_modules/solid-js/web/dist/web.js
function K(e, t, n) {
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
function q(e, t, n, r = {}) {
	let i;
	return h((r) => {
		i = r, t === document ? e() : Y(t, e(), t.firstChild ? null : void 0, n);
	}, r.owner), () => {
		i(), t.textContent = "";
	};
}
function J(e, t, n, r) {
	let i, a = () => {
		let t = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
		return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild;
	}, o = t ? () => x(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
	return o.cloneNode = o, o;
}
function Y(e, t, n, r) {
	if (n !== void 0 && !r && (r = []), typeof t != "function") return X(e, t, r, n);
	v((r) => X(e, t(), r, n), r);
}
function ne(t) {
	return !!e.context && !e.done && (!t || t.isConnected);
}
function X(e, t, n, r, i) {
	let a = ne(e);
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
			i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = $(e, n, r, i);
		} else n = n !== "" && typeof n == "string" ? e.firstChild.data = t : e.textContent = t;
	} else if (t == null || o === "boolean") {
		if (a) return n;
		n = $(e, n, r);
	} else if (o === "function") return v(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = X(e, i, n, r);
	}), () => n;
	else if (Array.isArray(t)) {
		let o = [], c = n && Array.isArray(n);
		if (Z(o, t, n, i)) return v(() => n = X(e, o, n, r, !0)), () => n;
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
			if (n = $(e, n, r), s) return n;
		} else c ? n.length === 0 ? Q(e, o, r) : K(e, n, o) : (n && $(e), Q(e, o));
		n = o;
	} else if (t.nodeType) {
		if (a && t.parentNode) return n = s ? [t] : t;
		if (Array.isArray(n)) {
			if (s) return n = $(e, n, r, t);
			$(e, n, null, t);
		} else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
		n = t;
	}
	return n;
}
function Z(e, t, n, r) {
	let i = !1;
	for (let a = 0, o = t.length; a < o; a++) {
		let o = t[a], s = n && n[e.length], c;
		if (o != null && o !== !0 && o !== !1) {
			if ((c = typeof o) == "object" && o.nodeType) e.push(o);
			else if (Array.isArray(o)) i = Z(e, o, s) || i;
			else if (c === "function") {
				if (r) {
					for (; typeof o == "function";) o = o();
					i = Z(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i;
				} else e.push(o), i = !0;
			} else {
				let t = String(o);
				s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t));
			}
		}
	}
	return i;
}
function Q(e, t, n = null) {
	for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function $(e, t, n, r) {
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
//#region src/lib/content.js
async function re(e) {
	let t = await fetch(`/content/${e}/meta.json`);
	if (!t.ok) throw Error(`meta.json not found for "${e}"`);
	return t.json();
}
//#endregion
//#region src/App.jsx
var ie = /*#__PURE__*/ J("<div class=page-title>"), ae = /*#__PURE__*/ J("<div>Loading…"), oe = /*#__PURE__*/ J("<div>Error: ");
function se(e) {
	let t = e.get(""), [n] = b(() => re(t));
	return U(G, {
		get when() {
			return !n.loading;
		},
		get fallback() {
			return ae();
		},
		get children() {
			return U(G, {
				get when() {
					return !n.error;
				},
				get fallback() {
					return (() => {
						var e = oe();
						return e.firstChild, Y(e, () => n.error?.message, null), e;
					})();
				},
				get children() {
					var e = ie();
					return Y(e, () => n()?.title), e;
				}
			});
		}
	});
}
//#endregion
//#region index.jsx
function ce(e, t) {
	return q(() => se(e), t);
}
//#endregion
export { ce as render };
