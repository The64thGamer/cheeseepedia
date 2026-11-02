import { t as e } from "./rolldown-runtime-DtPi1Y-2.js";
//#region ../../node_modules/sql.js-httpvfs/dist/index.js
var t = /* @__PURE__ */ e(((e, t) => {
	(function(n, r) {
		if (typeof e == "object" && typeof t == "object") t.exports = r();
		else if (typeof define == "function" && define.amd) define([], r);
		else {
			var i = r();
			for (var a in i) (typeof e == "object" ? e : n)[a] = i[a];
		}
	})(e, (function() {
		return (() => {
			var e = {
				870: (e, t, n) => {
					n.r(t), n.d(t, {
						createEndpoint: () => i,
						expose: () => l,
						proxy: () => _,
						proxyMarker: () => r,
						releaseProxy: () => a,
						transfer: () => g,
						transferHandlers: () => c,
						windowEndpoint: () => v,
						wrap: () => d
					});
					let r = Symbol("Comlink.proxy"), i = Symbol("Comlink.endpoint"), a = Symbol("Comlink.releaseProxy"), o = Symbol("Comlink.thrown"), s = (e) => typeof e == "object" && !!e || typeof e == "function", c = /* @__PURE__ */ new Map([["proxy", {
						canHandle: (e) => s(e) && e[r],
						serialize(e) {
							let { port1: t, port2: n } = new MessageChannel();
							return l(e, t), [n, [n]];
						},
						deserialize: (e) => (e.start(), d(e))
					}], ["throw", {
						canHandle: (e) => s(e) && o in e,
						serialize({ value: e }) {
							let t;
							return t = e instanceof Error ? {
								isError: !0,
								value: {
									message: e.message,
									name: e.name,
									stack: e.stack
								}
							} : {
								isError: !1,
								value: e
							}, [t, []];
						},
						deserialize(e) {
							throw e.isError ? Object.assign(Error(e.value.message), e.value) : e.value;
						}
					}]]);
					function l(e, t = self) {
						t.addEventListener("message", (function n(r) {
							if (!r || !r.data) return;
							let { id: i, type: a, path: s } = Object.assign({ path: [] }, r.data), c = (r.data.argumentList || []).map(b), d;
							try {
								let t = s.slice(0, -1).reduce(((e, t) => e[t]), e), n = s.reduce(((e, t) => e[t]), e);
								switch (a) {
									case 0:
										d = n;
										break;
									case 1:
										t[s.slice(-1)[0]] = b(r.data.value), d = !0;
										break;
									case 2:
										d = n.apply(t, c);
										break;
									case 3:
										d = _(new n(...c));
										break;
									case 4:
										{
											let { port1: t, port2: n } = new MessageChannel();
											l(e, n), d = g(t, [t]);
										}
										break;
									case 5: d = void 0;
								}
							} catch (e) {
								d = {
									value: e,
									[o]: 0
								};
							}
							Promise.resolve(d).catch(((e) => ({
								value: e,
								[o]: 0
							}))).then(((e) => {
								let [r, o] = y(e);
								t.postMessage(Object.assign(Object.assign({}, r), { id: i }), o), a === 5 && (t.removeEventListener("message", n), u(t));
							}));
						})), t.start && t.start();
					}
					function u(e) {
						(function(e) {
							return e.constructor.name === "MessagePort";
						})(e) && e.close();
					}
					function d(e, t) {
						return p(e, [], t);
					}
					function f(e) {
						if (e) throw Error("Proxy has been released and is not useable");
					}
					function p(e, t = [], n = function() {}) {
						let r = !1, o = new Proxy(n, {
							get(n, i) {
								if (f(r), i === a) return () => x(e, {
									type: 5,
									path: t.map(((e) => e.toString()))
								}).then((() => {
									u(e), r = !0;
								}));
								if (i === "then") {
									if (t.length === 0) return { then: () => o };
									let n = x(e, {
										type: 0,
										path: t.map(((e) => e.toString()))
									}).then(b);
									return n.then.bind(n);
								}
								return p(e, [...t, i]);
							},
							set(n, i, a) {
								f(r);
								let [o, s] = y(a);
								return x(e, {
									type: 1,
									path: [...t, i].map(((e) => e.toString())),
									value: o
								}, s).then(b);
							},
							apply(n, a, o) {
								f(r);
								let s = t[t.length - 1];
								if (s === i) return x(e, { type: 4 }).then(b);
								if (s === "bind") return p(e, t.slice(0, -1));
								let [c, l] = m(o);
								return x(e, {
									type: 2,
									path: t.map(((e) => e.toString())),
									argumentList: c
								}, l).then(b);
							},
							construct(n, i) {
								f(r);
								let [a, o] = m(i);
								return x(e, {
									type: 3,
									path: t.map(((e) => e.toString())),
									argumentList: a
								}, o).then(b);
							}
						});
						return o;
					}
					function m(e) {
						let t = e.map(y);
						return [t.map(((e) => e[0])), (n = t.map(((e) => e[1])), Array.prototype.concat.apply([], n))];
						var n;
					}
					let h = /* @__PURE__ */ new WeakMap();
					function g(e, t) {
						return h.set(e, t), e;
					}
					function _(e) {
						return Object.assign(e, { [r]: !0 });
					}
					function v(e, t = self, n = "*") {
						return {
							postMessage: (t, r) => e.postMessage(t, n, r),
							addEventListener: t.addEventListener.bind(t),
							removeEventListener: t.removeEventListener.bind(t)
						};
					}
					function y(e) {
						for (let [t, n] of c) if (n.canHandle(e)) {
							let [r, i] = n.serialize(e);
							return [{
								type: 3,
								name: t,
								value: r
							}, i];
						}
						return [{
							type: 0,
							value: e
						}, h.get(e) || []];
					}
					function b(e) {
						switch (e.type) {
							case 3: return c.get(e.name).deserialize(e.value);
							case 0: return e.value;
						}
					}
					function x(e, t, n) {
						return new Promise(((r) => {
							let i = [
								,
								,
								,
								,
							].fill(0).map((() => Math.floor(Math.random() * (2 ** 53 - 1)).toString(16))).join("-");
							e.addEventListener("message", (function t(n) {
								n.data && n.data.id && n.data.id === i && (e.removeEventListener("message", t), r(n.data));
							})), e.start && e.start(), e.postMessage(Object.assign({ id: i }, t), n);
						}));
					}
				},
				162: function(e, t, n) {
					var r = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
						r === void 0 && (r = n), Object.defineProperty(e, r, {
							enumerable: !0,
							get: function() {
								return t[n];
							}
						});
					} : function(e, t, n, r) {
						r === void 0 && (r = n), e[r] = t[n];
					}), i = this && this.__setModuleDefault || (Object.create ? function(e, t) {
						Object.defineProperty(e, "default", {
							enumerable: !0,
							value: t
						});
					} : function(e, t) {
						e.default = t;
					}), a = this && this.__importStar || function(e) {
						if (e && e.__esModule) return e;
						var t = {};
						if (e != null) for (var n in e) n !== "default" && Object.prototype.hasOwnProperty.call(e, n) && r(t, e, n);
						return i(t, e), t;
					};
					Object.defineProperty(t, "__esModule", { value: !0 }), t.createDbWorker = void 0;
					let o = a(n(870));
					async function s(e) {
						if (e.data && e.data.action === "eval") {
							let t = new Int32Array(e.data.notify, 0, 2), n = new Uint8Array(e.data.notify, 8), r;
							try {
								r = { ok: await u(e.data.request) };
							} catch (t) {
								console.error("worker request error", e.data.request, t), r = { err: String(t) };
							}
							let i = new TextEncoder().encode(JSON.stringify(r));
							n.set(i, 0), t[1] = i.length, Atomics.notify(t, 0);
						}
					}
					function c(e) {
						if (e.tagName === "BODY") return "body";
						let t = [];
						for (; e.parentElement && e.tagName !== "BODY";) {
							if (e.id) {
								t.unshift("#" + e.id);
								break;
							}
							{
								let n = 1, r = e;
								for (; r.previousElementSibling;) r = r.previousElementSibling, n++;
								t.unshift(e.tagName.toLowerCase() + ":nth-child(" + n + ")");
							}
							e = e.parentElement;
						}
						return t.join(" > ");
					}
					function l(e) {
						return Object.keys(e);
					}
					async function u(e) {
						if (console.log("dom vtable request", e), e.type === "select") return [...document.querySelectorAll(e.selector)].map(((t) => {
							let n = {};
							for (let r of e.columns) r === "selector" ? n.selector = c(t) : r === "parent" ? t.parentElement && (n.parent = t.parentElement ? c(t.parentElement) : null) : r === "idx" || (n[r] = t[r]);
							return n;
						}));
						if (e.type === "insert") {
							if (!e.value.parent) throw Error("\"parent\" column must be set when inserting");
							let t = document.querySelectorAll(e.value.parent);
							if (t.length === 0) throw Error(`Parent element ${e.value.parent} could not be found`);
							if (t.length > 1) throw Error(`Parent element ${e.value.parent} ambiguous (${t.length} results)`);
							let n = t[0];
							if (!e.value.tagName) throw Error("tagName must be set for inserting");
							let r = document.createElement(e.value.tagName);
							for (let t of l(e.value)) if (e.value[t] !== null) {
								if (t === "tagName" || t === "parent") continue;
								if (t === "idx" || t === "selector") throw Error(`${t} can't be set`);
								r[t] = e.value[t];
							}
							return n.appendChild(r), null;
						}
						if (e.type === "update") {
							let t = document.querySelector(e.value.selector);
							if (!t) throw Error(`Element ${e.value.selector} not found!`);
							let n = [];
							for (let r of l(e.value)) {
								let i = e.value[r];
								if (r !== "parent") {
									if (r !== "idx" && r !== "selector" && i !== t[r]) {
										if (console.log("SETTING ", r, t[r], "->", i), r === "tagName") throw Error("can't change tagName");
										n.push(r);
									}
								} else if (i !== c(t.parentElement)) {
									let e = document.querySelectorAll(i);
									if (e.length !== 1) throw Error(`Invalid target parent: found ${e.length} matches`);
									e[0].appendChild(t);
								}
							}
							for (let r of n) t[r] = e.value[r];
							return null;
						}
						throw Error(`unknown request ${e.type}`);
					}
					o.transferHandlers.set("WORKERSQLPROXIES", {
						canHandle: (e) => !1,
						serialize(e) {
							throw Error("no");
						},
						deserialize: (e) => (e.start(), o.wrap(e))
					}), t.createDbWorker = async function(e, t, n, r = 1 / 0) {
						let i = new Worker(t), a = o.wrap(i), c = await a.SplitFileHttpDatabase(n, e, void 0, r);
						return i.addEventListener("message", s), {
							db: c,
							worker: a,
							configs: e
						};
					};
				},
				432: function(e, t, n) {
					var r = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
						r === void 0 && (r = n), Object.defineProperty(e, r, {
							enumerable: !0,
							get: function() {
								return t[n];
							}
						});
					} : function(e, t, n, r) {
						r === void 0 && (r = n), e[r] = t[n];
					}), i = this && this.__exportStar || function(e, t) {
						for (var n in e) n === "default" || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
					};
					Object.defineProperty(t, "__esModule", { value: !0 }), i(n(162), t);
				}
			}, t = {};
			function n(r) {
				var i = t[r];
				if (i !== void 0) return i.exports;
				var a = t[r] = { exports: {} };
				return e[r].call(a.exports, a, a.exports, n), a.exports;
			}
			return n.d = (e, t) => {
				for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
					enumerable: !0,
					get: t[r]
				});
			}, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = (e) => {
				typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
			}, n(432);
		})();
	}));
}));
//#endregion
export default t();
