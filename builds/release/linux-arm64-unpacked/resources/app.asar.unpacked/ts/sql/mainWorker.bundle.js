var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports2, module2) {
    var path = require("path");
    var fs = require("fs");
    var _0777 = parseInt("0777", 8);
    module2.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777 & ~process.umask();
      }
      if (!made)
        made = null;
      var cb = f || function() {
      };
      p = path.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            mkdirP(path.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    __name(mkdirP, "mkdirP");
    mkdirP.sync = /* @__PURE__ */ __name(function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777 & ~process.umask();
      }
      if (!made)
        made = null;
      p = path.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    }, "sync");
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports2) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      __name(debugCallback, "debugCallback");
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
      __name(missingCallback, "missingCallback");
    }
    __name(rethrow, "rethrow");
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    __name(maybeCallback, "maybeCallback");
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports2.realpathSync = /* @__PURE__ */ __name(function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstatSync(base);
          knownHard[base] = true;
        }
      }
      __name(start, "start");
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs.statSync(base);
            linkTarget = fs.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    }, "realpathSync");
    exports2.realpath = /* @__PURE__ */ __name(function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      __name(start, "start");
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs.lstat(base, gotStat);
      }
      __name(LOOP, "LOOP");
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      __name(gotStat, "gotStat");
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      __name(gotTarget, "gotTarget");
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      __name(gotResolvedLink, "gotResolvedLink");
    }, "realpath");
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports2, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs = require("fs");
    var origRealpath = fs.realpath;
    var origRealpathSync = fs.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    __name(newError, "newError");
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    __name(realpath, "realpath");
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    __name(realpathSync, "realpathSync");
    function monkeypatch() {
      fs.realpath = realpath;
      fs.realpathSync = realpathSync;
    }
    __name(monkeypatch, "monkeypatch");
    function unmonkeypatch() {
      fs.realpath = origRealpath;
      fs.realpathSync = origRealpathSync;
    }
    __name(unmonkeypatch, "unmonkeypatch");
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports2, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports2, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    __name(balanced, "balanced");
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    __name(maybeMatch, "maybeMatch");
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
    __name(range, "range");
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports2, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    __name(numeric, "numeric");
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    __name(escapeBraces, "escapeBraces");
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    __name(unescapeBraces, "unescapeBraces");
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    __name(parseCommaParts, "parseCommaParts");
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    __name(expandTop, "expandTop");
    function embrace(str) {
      return "{" + str + "}";
    }
    __name(embrace, "embrace");
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    __name(isPadded, "isPadded");
    function lte(i, y) {
      return i <= y;
    }
    __name(lte, "lte");
    function gte(i, y) {
      return i >= y;
    }
    __name(gte, "gte");
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
    __name(expand, "expand");
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports2, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path = { sep: "/" };
    try {
      path = require("path");
    } catch (er) {
    }
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    __name(charSet, "charSet");
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    __name(filter, "filter");
    function ext(a, b) {
      a = a || {};
      b = b || {};
      var t = {};
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      return t;
    }
    __name(ext, "ext");
    minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return minimatch;
      var orig = minimatch;
      var m = /* @__PURE__ */ __name(function minimatch2(p, pattern, options) {
        return orig.minimatch(p, pattern, ext(def, options));
      }, "minimatch");
      m.Minimatch = /* @__PURE__ */ __name(function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      }, "Minimatch");
      return m;
    };
    Minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return Minimatch;
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      if (pattern.trim() === "")
        return p === "";
      return new Minimatch(pattern, options).match(p);
    }
    __name(minimatch, "minimatch");
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (path.sep !== "/") {
        pattern = pattern.split(path.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.make();
    }
    __name(Minimatch, "Minimatch");
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      if (this._made)
        return;
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = console.error;
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    __name(make, "make");
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    __name(parseNegate, "parseNegate");
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      if (typeof pattern === "undefined") {
        throw new TypeError("undefined pattern");
      }
      if (options.nobrace || !pattern.match(/\{.*\}/)) {
        return [pattern];
      }
      return expand(pattern);
    }
    __name(braceExpand, "braceExpand");
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      if (pattern.length > 1024 * 64) {
        throw new TypeError("pattern is too long");
      }
      var options = this.options;
      if (!options.noglobstar && pattern === "**")
        return GLOBSTAR;
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self2 = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self2.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      __name(clearStateChar, "clearStateChar");
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/":
            return false;
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self2.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            if (inClass) {
              var cs = pattern.substring(classStart + 1, i);
              try {
                RegExp("[" + cs + "]");
              } catch (er) {
                var sp = this.parse(cs, SUBPARSE);
                re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
                hasMagic = hasMagic || sp[1];
                inClass = false;
                continue;
              }
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case ".":
        case "[":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    __name(parse, "parse");
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    __name(makeRe, "makeRe");
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = match;
    function match(f, partial) {
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path.sep !== "/") {
        f = f.split(path.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    }
    __name(match, "match");
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug("matchOne", { "this": this, file, pattern });
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          if (options.nocase) {
            hit = f.toLowerCase() === p.toLowerCase();
          } else {
            hit = f === p;
          }
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        var emptyFileEnd = fi === fl - 1 && file[fi] === "";
        return emptyFileEnd;
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    __name(globUnescape, "globUnescape");
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    __name(regExpEscape, "regExpEscape");
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      }, "inherits");
    } else {
      module2.exports = /* @__PURE__ */ __name(function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = /* @__PURE__ */ __name(function() {
          }, "TempCtor");
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      }, "inherits");
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports2, module2) {
    "use strict";
    function posix(path) {
      return path.charAt(0) === "/";
    }
    __name(posix, "posix");
    function win32(path) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    __name(win32, "win32");
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/rimraf/node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/rimraf/node_modules/glob/common.js"(exports2) {
    exports2.setopts = setopts;
    exports2.ownProp = ownProp;
    exports2.makeAbs = makeAbs;
    exports2.finish = finish;
    exports2.mark = mark;
    exports2.isIgnored = isIgnored;
    exports2.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    __name(ownProp, "ownProp");
    var path = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    __name(alphasort, "alphasort");
    function setupIgnores(self2, options) {
      self2.ignore = options.ignore || [];
      if (!Array.isArray(self2.ignore))
        self2.ignore = [self2.ignore];
      if (self2.ignore.length) {
        self2.ignore = self2.ignore.map(ignoreMap);
      }
    }
    __name(setupIgnores, "setupIgnores");
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    __name(ignoreMap, "ignoreMap");
    function setopts(self2, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && pattern.indexOf("/") === -1) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self2.silent = !!options.silent;
      self2.pattern = pattern;
      self2.strict = options.strict !== false;
      self2.realpath = !!options.realpath;
      self2.realpathCache = options.realpathCache || Object.create(null);
      self2.follow = !!options.follow;
      self2.dot = !!options.dot;
      self2.mark = !!options.mark;
      self2.nodir = !!options.nodir;
      if (self2.nodir)
        self2.mark = true;
      self2.sync = !!options.sync;
      self2.nounique = !!options.nounique;
      self2.nonull = !!options.nonull;
      self2.nosort = !!options.nosort;
      self2.nocase = !!options.nocase;
      self2.stat = !!options.stat;
      self2.noprocess = !!options.noprocess;
      self2.absolute = !!options.absolute;
      self2.maxLength = options.maxLength || Infinity;
      self2.cache = options.cache || Object.create(null);
      self2.statCache = options.statCache || Object.create(null);
      self2.symlinks = options.symlinks || Object.create(null);
      setupIgnores(self2, options);
      self2.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self2.cwd = cwd;
      else {
        self2.cwd = path.resolve(options.cwd);
        self2.changedCwd = self2.cwd !== cwd;
      }
      self2.root = options.root || path.resolve(self2.cwd, "/");
      self2.root = path.resolve(self2.root);
      if (process.platform === "win32")
        self2.root = self2.root.replace(/\\/g, "/");
      self2.cwdAbs = isAbsolute(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
      if (process.platform === "win32")
        self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
      self2.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      self2.minimatch = new Minimatch(pattern, options);
      self2.options = self2.minimatch.options;
    }
    __name(setopts, "setopts");
    function finish(self2) {
      var nou = self2.nounique;
      var all = nou ? [] : Object.create(null);
      for (var i = 0, l = self2.matches.length; i < l; i++) {
        var matches = self2.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self2.nonull) {
            var literal = self2.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self2.nosort)
        all = all.sort(alphasort);
      if (self2.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self2._mark(all[i]);
        }
        if (self2.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self2.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self2, m2);
        });
      self2.found = all;
    }
    __name(finish, "finish");
    function mark(self2, p) {
      var abs = makeAbs(self2, p);
      var c = self2.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self2, m);
          self2.statCache[mabs] = self2.statCache[abs];
          self2.cache[mabs] = self2.cache[abs];
        }
      }
      return m;
    }
    __name(mark, "mark");
    function makeAbs(self2, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path.join(self2.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self2.changedCwd) {
        abs = path.resolve(self2.cwd, f);
      } else {
        abs = path.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    __name(makeAbs, "makeAbs");
    function isIgnored(self2, path2) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    __name(isIgnored, "isIgnored");
    function childrenIgnored(self2, path2) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    __name(childrenIgnored, "childrenIgnored");
  }
});

// node_modules/rimraf/node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/rimraf/node_modules/glob/sync.js"(exports2, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var fs = require("fs");
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path = require("path");
    var assert2 = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    __name(globSync, "globSync");
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    __name(GlobSync, "GlobSync");
    GlobSync.prototype._finish = function() {
      assert2(this instanceof GlobSync);
      if (this.realpath) {
        var self2 = this;
        this.matches.forEach(function(matchset, index) {
          var set = self2.matches[index] = Object.create(null);
          for (var p in matchset) {
            try {
              p = self2._makeAbs(p);
              var real = rp.realpathSync(p, self2.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self2._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert2(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error2 = new Error(er.code + " invalid cwd " + this.cwd);
            error2.path = this.cwd;
            error2.code = er.code;
            throw error2;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
      __name(wrapper, "wrapper");
    }
    __name(wrappy, "wrappy");
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = /* @__PURE__ */ __name(function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      }, "f");
      f.called = false;
      return f;
    }
    __name(once, "once");
    function onceStrict(fn) {
      var f = /* @__PURE__ */ __name(function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      }, "f");
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
    __name(onceStrict, "onceStrict");
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports2, module2) {
    var wrappy = require_wrappy();
    var reqs = Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    __name(inflight, "inflight");
    function makeres(key) {
      return once(/* @__PURE__ */ __name(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      }, "RES"));
    }
    __name(makeres, "makeres");
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
    __name(slice, "slice");
  }
});

// node_modules/rimraf/node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/rimraf/node_modules/glob/glob.js"(exports2, module2) {
    module2.exports = glob;
    var fs = require("fs");
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path = require("path");
    var assert2 = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    __name(glob, "glob");
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    __name(extend, "extend");
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self2 = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self2._processing;
        if (self2._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self2._finish();
            });
          } else {
            self2._finish();
          }
        }
      }
      __name(done, "done");
    }
    __name(Glob, "Glob");
    Glob.prototype._finish = function() {
      assert2(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self2 = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self2._finish();
      }
      __name(next, "next");
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self2 = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = Object.create(null);
      found.forEach(function(p, i) {
        p = self2._makeAbs(p);
        rp.realpath(p, self2.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self2.emit("error", er);
          if (--n === 0) {
            self2.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert2(this instanceof Glob);
      assert2(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self2 = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self2.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self2.cache[abs] = "FILE";
          cb();
        } else
          self2._readdir(abs, false, cb);
      }
      __name(lstatcb_, "lstatcb_");
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self2 = this;
      fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self2, abs, cb) {
      return function(er, entries) {
        if (er)
          self2._readdirError(abs, er, cb);
        else
          self2._readdirEntries(abs, entries, cb);
      };
    }
    __name(readdirCb, "readdirCb");
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error2 = new Error(er.code + " invalid cwd " + this.cwd);
            error2.path = this.cwd;
            error2.code = er.code;
            this.emit("error", error2);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self2 = this;
      this._stat(prefix, function(er, exists) {
        self2._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self2 = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return fs.stat(abs, function(er2, stat2) {
            if (er2)
              self2._stat2(f, abs, null, lstat, cb);
            else
              self2._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self2._stat2(f, abs, er, lstat, cb);
        }
      }
      __name(lstatcb_, "lstatcb_");
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/rimraf/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/rimraf/rimraf.js"(exports2, module2) {
    module2.exports = rimraf2;
    rimraf2.sync = rimrafSync;
    var assert2 = require("assert");
    var path = require("path");
    var fs = require("fs");
    var glob = require_glob();
    var _0666 = parseInt("666", 8);
    var defaultGlobOpts = {
      nosort: true,
      silent: true
    };
    var timeout = 0;
    var isWindows = process.platform === "win32";
    function defaults(options) {
      var methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach(function(m) {
        options[m] = options[m] || fs[m];
        m = m + "Sync";
        options[m] = options[m] || fs[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
      options.emfileWait = options.emfileWait || 1e3;
      if (options.glob === false) {
        options.disableGlob = true;
      }
      options.disableGlob = options.disableGlob || false;
      options.glob = options.glob || defaultGlobOpts;
    }
    __name(defaults, "defaults");
    function rimraf2(p, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert2(p, "rimraf: missing path");
      assert2.equal(typeof p, "string", "rimraf: path should be a string");
      assert2.equal(typeof cb, "function", "rimraf: callback function required");
      assert2(options, "rimraf: invalid options argument provided");
      assert2.equal(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      var busyTries = 0;
      var errState = null;
      var n = 0;
      if (options.disableGlob || !glob.hasMagic(p))
        return afterGlob(null, [p]);
      options.lstat(p, function(er, stat) {
        if (!er)
          return afterGlob(null, [p]);
        glob(p, options.glob, afterGlob);
      });
      function next(er) {
        errState = errState || er;
        if (--n === 0)
          cb(errState);
      }
      __name(next, "next");
      function afterGlob(er, results) {
        if (er)
          return cb(er);
        n = results.length;
        if (n === 0)
          return cb();
        results.forEach(function(p2) {
          rimraf_(p2, options, /* @__PURE__ */ __name(function CB(er2) {
            if (er2) {
              if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
                busyTries++;
                var time = busyTries * 100;
                return setTimeout(function() {
                  rimraf_(p2, options, CB);
                }, time);
              }
              if (er2.code === "EMFILE" && timeout < options.emfileWait) {
                return setTimeout(function() {
                  rimraf_(p2, options, CB);
                }, timeout++);
              }
              if (er2.code === "ENOENT")
                er2 = null;
            }
            timeout = 0;
            next(er2);
          }, "CB"));
        });
      }
      __name(afterGlob, "afterGlob");
    }
    __name(rimraf2, "rimraf");
    function rimraf_(p, options, cb) {
      assert2(p);
      assert2(options);
      assert2(typeof cb === "function");
      options.lstat(p, function(er, st) {
        if (er && er.code === "ENOENT")
          return cb(null);
        if (er && er.code === "EPERM" && isWindows)
          fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory())
          return rmdir(p, options, er, cb);
        options.unlink(p, function(er2) {
          if (er2) {
            if (er2.code === "ENOENT")
              return cb(null);
            if (er2.code === "EPERM")
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            if (er2.code === "EISDIR")
              return rmdir(p, options, er2, cb);
          }
          return cb(er2);
        });
      });
    }
    __name(rimraf_, "rimraf_");
    function fixWinEPERM(p, options, er, cb) {
      assert2(p);
      assert2(options);
      assert2(typeof cb === "function");
      if (er)
        assert2(er instanceof Error);
      options.chmod(p, _0666, function(er2) {
        if (er2)
          cb(er2.code === "ENOENT" ? null : er);
        else
          options.stat(p, function(er3, stats) {
            if (er3)
              cb(er3.code === "ENOENT" ? null : er);
            else if (stats.isDirectory())
              rmdir(p, options, er, cb);
            else
              options.unlink(p, cb);
          });
      });
    }
    __name(fixWinEPERM, "fixWinEPERM");
    function fixWinEPERMSync(p, options, er) {
      assert2(p);
      assert2(options);
      if (er)
        assert2(er instanceof Error);
      try {
        options.chmodSync(p, _0666);
      } catch (er2) {
        if (er2.code === "ENOENT")
          return;
        else
          throw er;
      }
      try {
        var stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT")
          return;
        else
          throw er;
      }
      if (stats.isDirectory())
        rmdirSync(p, options, er);
      else
        options.unlinkSync(p);
    }
    __name(fixWinEPERMSync, "fixWinEPERMSync");
    function rmdir(p, options, originalEr, cb) {
      assert2(p);
      assert2(options);
      if (originalEr)
        assert2(originalEr instanceof Error);
      assert2(typeof cb === "function");
      options.rmdir(p, function(er) {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
          rmkids(p, options, cb);
        else if (er && er.code === "ENOTDIR")
          cb(originalEr);
        else
          cb(er);
      });
    }
    __name(rmdir, "rmdir");
    function rmkids(p, options, cb) {
      assert2(p);
      assert2(options);
      assert2(typeof cb === "function");
      options.readdir(p, function(er, files) {
        if (er)
          return cb(er);
        var n = files.length;
        if (n === 0)
          return options.rmdir(p, cb);
        var errState;
        files.forEach(function(f) {
          rimraf2(path.join(p, f), options, function(er2) {
            if (errState)
              return;
            if (er2)
              return cb(errState = er2);
            if (--n === 0)
              options.rmdir(p, cb);
          });
        });
      });
    }
    __name(rmkids, "rmkids");
    function rimrafSync(p, options) {
      options = options || {};
      defaults(options);
      assert2(p, "rimraf: missing path");
      assert2.equal(typeof p, "string", "rimraf: path should be a string");
      assert2(options, "rimraf: missing options");
      assert2.equal(typeof options, "object", "rimraf: options should be object");
      var results;
      if (options.disableGlob || !glob.hasMagic(p)) {
        results = [p];
      } else {
        try {
          options.lstatSync(p);
          results = [p];
        } catch (er) {
          results = glob.sync(p, options.glob);
        }
      }
      if (!results.length)
        return;
      for (var i = 0; i < results.length; i++) {
        var p = results[i];
        try {
          var st = options.lstatSync(p);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM" && isWindows)
            fixWinEPERMSync(p, options, er);
        }
        try {
          if (st && st.isDirectory())
            rmdirSync(p, options, null);
          else
            options.unlinkSync(p);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM")
            return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
          if (er.code !== "EISDIR")
            throw er;
          rmdirSync(p, options, er);
        }
      }
    }
    __name(rimrafSync, "rimrafSync");
    function rmdirSync(p, options, originalEr) {
      assert2(p);
      assert2(options);
      if (originalEr)
        assert2(originalEr instanceof Error);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "ENOTDIR")
          throw originalEr;
        if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
          rmkidsSync(p, options);
      }
    }
    __name(rmdirSync, "rmdirSync");
    function rmkidsSync(p, options) {
      assert2(p);
      assert2(options);
      options.readdirSync(p).forEach(function(f) {
        rimrafSync(path.join(p, f), options);
      });
      var retries = isWindows ? 100 : 1;
      var i = 0;
      do {
        var threw = true;
        try {
          var ret = options.rmdirSync(p, options);
          threw = false;
          return ret;
        } finally {
          if (++i < retries && threw)
            continue;
        }
      } while (true);
    }
    __name(rmkidsSync, "rmkidsSync");
  }
});

// node_modules/better-sqlite3/lib/util.js
var require_util = __commonJS({
  "node_modules/better-sqlite3/lib/util.js"(exports2) {
    "use strict";
    exports2.getBooleanOption = (options, key) => {
      let value = false;
      if (key in options && typeof (value = options[key]) !== "boolean") {
        throw new TypeError(`Expected the "${key}" option to be a boolean`);
      }
      return value;
    };
    exports2.cppdb = Symbol();
    exports2.inspect = Symbol.for("nodejs.util.inspect.custom");
  }
});

// ts/sql/mainWorkerBindings.ts
var require_mainWorkerBindings = __commonJS({
  "ts/sql/mainWorkerBindings.ts"(exports2, module2) {
    module2.exports = (binding) => {
      if (binding === "better_sqlite3.node") {
        return require("../../node_modules/better-sqlite3/build/Release/better_sqlite3.node");
      }
      throw new Error(`Unknown binding ${binding}`);
    };
  }
});

// node_modules/better-sqlite3/lib/methods/wrappers.js
var require_wrappers = __commonJS({
  "node_modules/better-sqlite3/lib/methods/wrappers.js"(exports2) {
    "use strict";
    var { cppdb } = require_util();
    exports2.prepare = /* @__PURE__ */ __name(function prepare2(sql) {
      return this[cppdb].prepare(sql, this, false);
    }, "prepare");
    exports2.exec = /* @__PURE__ */ __name(function exec(sql) {
      this[cppdb].exec(sql);
      return this;
    }, "exec");
    exports2.close = /* @__PURE__ */ __name(function close2() {
      this[cppdb].close();
      return this;
    }, "close");
    exports2.loadExtension = /* @__PURE__ */ __name(function loadExtension(...args) {
      this[cppdb].loadExtension(...args);
      return this;
    }, "loadExtension");
    exports2.defaultSafeIntegers = /* @__PURE__ */ __name(function defaultSafeIntegers(...args) {
      this[cppdb].defaultSafeIntegers(...args);
      return this;
    }, "defaultSafeIntegers");
    exports2.unsafeMode = /* @__PURE__ */ __name(function unsafeMode(...args) {
      this[cppdb].unsafeMode(...args);
      return this;
    }, "unsafeMode");
    exports2.getters = {
      name: {
        get: /* @__PURE__ */ __name(function name() {
          return this[cppdb].name;
        }, "name"),
        enumerable: true
      },
      open: {
        get: /* @__PURE__ */ __name(function open() {
          return this[cppdb].open;
        }, "open"),
        enumerable: true
      },
      inTransaction: {
        get: /* @__PURE__ */ __name(function inTransaction() {
          return this[cppdb].inTransaction;
        }, "inTransaction"),
        enumerable: true
      },
      readonly: {
        get: /* @__PURE__ */ __name(function readonly() {
          return this[cppdb].readonly;
        }, "readonly"),
        enumerable: true
      },
      memory: {
        get: /* @__PURE__ */ __name(function memory() {
          return this[cppdb].memory;
        }, "memory"),
        enumerable: true
      }
    };
  }
});

// node_modules/better-sqlite3/lib/methods/transaction.js
var require_transaction = __commonJS({
  "node_modules/better-sqlite3/lib/methods/transaction.js"(exports2, module2) {
    "use strict";
    var { cppdb } = require_util();
    var controllers = new WeakMap();
    module2.exports = /* @__PURE__ */ __name(function transaction(fn) {
      if (typeof fn !== "function")
        throw new TypeError("Expected first argument to be a function");
      const db = this[cppdb];
      const controller = getController(db, this);
      const { apply } = Function.prototype;
      const properties = {
        default: { value: wrapTransaction(apply, fn, db, controller.default) },
        deferred: { value: wrapTransaction(apply, fn, db, controller.deferred) },
        immediate: { value: wrapTransaction(apply, fn, db, controller.immediate) },
        exclusive: { value: wrapTransaction(apply, fn, db, controller.exclusive) },
        database: { value: this, enumerable: true }
      };
      Object.defineProperties(properties.default.value, properties);
      Object.defineProperties(properties.deferred.value, properties);
      Object.defineProperties(properties.immediate.value, properties);
      Object.defineProperties(properties.exclusive.value, properties);
      return properties.default.value;
    }, "transaction");
    var getController = /* @__PURE__ */ __name((db, self2) => {
      let controller = controllers.get(db);
      if (!controller) {
        const shared = {
          commit: db.prepare("COMMIT", self2, false),
          rollback: db.prepare("ROLLBACK", self2, false),
          savepoint: db.prepare("SAVEPOINT `	_bs3.	`", self2, false),
          release: db.prepare("RELEASE `	_bs3.	`", self2, false),
          rollbackTo: db.prepare("ROLLBACK TO `	_bs3.	`", self2, false)
        };
        controllers.set(db, controller = {
          default: Object.assign({ begin: db.prepare("BEGIN", self2, false) }, shared),
          deferred: Object.assign({ begin: db.prepare("BEGIN DEFERRED", self2, false) }, shared),
          immediate: Object.assign({ begin: db.prepare("BEGIN IMMEDIATE", self2, false) }, shared),
          exclusive: Object.assign({ begin: db.prepare("BEGIN EXCLUSIVE", self2, false) }, shared)
        });
      }
      return controller;
    }, "getController");
    var wrapTransaction = /* @__PURE__ */ __name((apply, fn, db, { begin, commit, rollback, savepoint, release, rollbackTo }) => /* @__PURE__ */ __name(function sqliteTransaction() {
      let before, after, undo;
      if (db.inTransaction) {
        before = savepoint;
        after = release;
        undo = rollbackTo;
      } else {
        before = begin;
        after = commit;
        undo = rollback;
      }
      before.run();
      try {
        const result = apply.call(fn, this, arguments);
        after.run();
        return result;
      } catch (ex) {
        if (db.inTransaction) {
          undo.run();
          if (undo !== rollback)
            after.run();
        }
        throw ex;
      }
    }, "sqliteTransaction"), "wrapTransaction");
  }
});

// node_modules/better-sqlite3/lib/methods/pragma.js
var require_pragma = __commonJS({
  "node_modules/better-sqlite3/lib/methods/pragma.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = /* @__PURE__ */ __name(function pragma(source, options) {
      if (options == null)
        options = {};
      if (typeof source !== "string")
        throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object")
        throw new TypeError("Expected second argument to be an options object");
      const simple = getBooleanOption(options, "simple");
      const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
      return simple ? stmt.pluck().get() : stmt.all();
    }, "pragma");
  }
});

// node_modules/better-sqlite3/lib/methods/backup.js
var require_backup = __commonJS({
  "node_modules/better-sqlite3/lib/methods/backup.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var { promisify } = require("util");
    var { cppdb } = require_util();
    var fsAccess = promisify(fs.access);
    module2.exports = /* @__PURE__ */ __name(async function backup(filename, options) {
      if (options == null)
        options = {};
      if (typeof filename !== "string")
        throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object")
        throw new TypeError("Expected second argument to be an options object");
      filename = filename.trim();
      const attachedName = "attached" in options ? options.attached : "main";
      const handler = "progress" in options ? options.progress : null;
      if (!filename)
        throw new TypeError("Backup filename cannot be an empty string");
      if (filename === ":memory:")
        throw new TypeError('Invalid backup filename ":memory:"');
      if (typeof attachedName !== "string")
        throw new TypeError('Expected the "attached" option to be a string');
      if (!attachedName)
        throw new TypeError('The "attached" option cannot be an empty string');
      if (handler != null && typeof handler !== "function")
        throw new TypeError('Expected the "progress" option to be a function');
      await fsAccess(path.dirname(filename)).catch(() => {
        throw new TypeError("Cannot save backup because the directory does not exist");
      });
      const isNewFile = await fsAccess(filename).then(() => false, () => true);
      return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
    }, "backup");
    var runBackup = /* @__PURE__ */ __name((backup, handler) => {
      let rate = 0;
      let useDefault = true;
      return new Promise((resolve, reject) => {
        setImmediate(/* @__PURE__ */ __name(function step() {
          try {
            const progress = backup.transfer(rate);
            if (!progress.remainingPages) {
              backup.close();
              resolve(progress);
              return;
            }
            if (useDefault) {
              useDefault = false;
              rate = 100;
            }
            if (handler) {
              const ret = handler(progress);
              if (ret !== void 0) {
                if (typeof ret === "number" && ret === ret)
                  rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
                else
                  throw new TypeError("Expected progress callback to return a number or undefined");
              }
            }
            setImmediate(step);
          } catch (err) {
            backup.close();
            reject(err);
          }
        }, "step"));
      });
    }, "runBackup");
  }
});

// node_modules/better-sqlite3/lib/methods/function.js
var require_function = __commonJS({
  "node_modules/better-sqlite3/lib/methods/function.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = /* @__PURE__ */ __name(function defineFunction(name, options, fn) {
      if (options == null)
        options = {};
      if (typeof options === "function") {
        fn = options;
        options = {};
      }
      if (typeof name !== "string")
        throw new TypeError("Expected first argument to be a string");
      if (typeof fn !== "function")
        throw new TypeError("Expected last argument to be a function");
      if (typeof options !== "object")
        throw new TypeError("Expected second argument to be an options object");
      if (!name)
        throw new TypeError("User-defined function name cannot be an empty string");
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = fn.length;
        if (!Number.isInteger(argCount) || argCount < 0)
          throw new TypeError("Expected function.length to be a positive integer");
        if (argCount > 100)
          throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].function(fn, name, argCount, safeIntegers, deterministic);
      return this;
    }, "defineFunction");
  }
});

// node_modules/better-sqlite3/lib/methods/aggregate.js
var require_aggregate = __commonJS({
  "node_modules/better-sqlite3/lib/methods/aggregate.js"(exports2, module2) {
    "use strict";
    var { getBooleanOption, cppdb } = require_util();
    module2.exports = /* @__PURE__ */ __name(function defineAggregate(name, options) {
      if (typeof name !== "string")
        throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object" || options === null)
        throw new TypeError("Expected second argument to be an options object");
      if (!name)
        throw new TypeError("User-defined function name cannot be an empty string");
      const start = "start" in options ? options.start : null;
      const step = getFunctionOption(options, "step", true);
      const inverse = getFunctionOption(options, "inverse", false);
      const result = getFunctionOption(options, "result", false);
      const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
      const deterministic = getBooleanOption(options, "deterministic");
      const varargs = getBooleanOption(options, "varargs");
      let argCount = -1;
      if (!varargs) {
        argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
        if (argCount > 0)
          argCount -= 1;
        if (argCount > 100)
          throw new RangeError("User-defined functions cannot have more than 100 arguments");
      }
      this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic);
      return this;
    }, "defineAggregate");
    var getFunctionOption = /* @__PURE__ */ __name((options, key, required) => {
      const value = key in options ? options[key] : null;
      if (typeof value === "function")
        return value;
      if (value != null)
        throw new TypeError(`Expected the "${key}" option to be a function`);
      if (required)
        throw new TypeError(`Missing required option "${key}"`);
      return null;
    }, "getFunctionOption");
    var getLength = /* @__PURE__ */ __name(({ length }) => {
      if (Number.isInteger(length) && length >= 0)
        return length;
      throw new TypeError("Expected function.length to be a positive integer");
    }, "getLength");
  }
});

// node_modules/better-sqlite3/lib/methods/inspect.js
var require_inspect = __commonJS({
  "node_modules/better-sqlite3/lib/methods/inspect.js"(exports2, module2) {
    "use strict";
    var DatabaseInspection = /* @__PURE__ */ __name(function Database() {
    }, "Database");
    module2.exports = /* @__PURE__ */ __name(function inspect(depth, opts) {
      return Object.assign(new DatabaseInspection(), this);
    }, "inspect");
  }
});

// node_modules/better-sqlite3/lib/sqlite-error.js
var require_sqlite_error = __commonJS({
  "node_modules/better-sqlite3/lib/sqlite-error.js"(exports2, module2) {
    "use strict";
    var descriptor = { value: "SqliteError", writable: true, enumerable: false, configurable: true };
    function SqliteError(message, code) {
      if (new.target !== SqliteError) {
        return new SqliteError(message, code);
      }
      if (typeof code !== "string") {
        throw new TypeError("Expected second argument to be a string");
      }
      Error.call(this, message);
      descriptor.value = "" + message;
      Object.defineProperty(this, "message", descriptor);
      Error.captureStackTrace(this, SqliteError);
      descriptor.value = code;
      Object.defineProperty(this, "code", descriptor);
    }
    __name(SqliteError, "SqliteError");
    Object.setPrototypeOf(SqliteError, Error);
    Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
    Object.defineProperty(SqliteError.prototype, "name", descriptor);
    module2.exports = SqliteError;
  }
});

// node_modules/better-sqlite3/lib/database.js
var require_database = __commonJS({
  "node_modules/better-sqlite3/lib/database.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var util = require_util();
    var {
      Database: CPPDatabase,
      setErrorConstructor,
      setCorruptionLogger
    } = require_mainWorkerBindings()("better_sqlite3.node");
    function Database(filenameGiven, options) {
      if (new.target !== Database) {
        return new Database(filenameGiven, options);
      }
      if (filenameGiven == null)
        filenameGiven = "";
      if (options == null)
        options = {};
      if (typeof filenameGiven !== "string")
        throw new TypeError("Expected first argument to be a string");
      if (typeof options !== "object")
        throw new TypeError("Expected second argument to be an options object");
      if ("readOnly" in options)
        throw new TypeError('Misspelled option "readOnly" should be "readonly"');
      if ("memory" in options)
        throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
      const filename = filenameGiven.trim();
      const anonymous = filename === "" || filename === ":memory:";
      const readonly = util.getBooleanOption(options, "readonly");
      const fileMustExist = util.getBooleanOption(options, "fileMustExist");
      const timeout = "timeout" in options ? options.timeout : 5e3;
      const verbose = "verbose" in options ? options.verbose : null;
      if (readonly && anonymous)
        throw new TypeError("In-memory/temporary databases cannot be readonly");
      if (!Number.isInteger(timeout) || timeout < 0)
        throw new TypeError('Expected the "timeout" option to be a positive integer');
      if (timeout > 2147483647)
        throw new RangeError('Option "timeout" cannot be greater than 2147483647');
      if (verbose != null && typeof verbose !== "function")
        throw new TypeError('Expected the "verbose" option to be a function');
      if (!anonymous && !fs.existsSync(path.dirname(filename))) {
        throw new TypeError("Cannot open database because the directory does not exist");
      }
      Object.defineProperties(this, __spreadValues({
        [util.cppdb]: { value: new CPPDatabase(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null) }
      }, wrappers.getters));
    }
    __name(Database, "Database");
    var wrappers = require_wrappers();
    Database.prototype.prepare = wrappers.prepare;
    Database.prototype.transaction = require_transaction();
    Database.prototype.pragma = require_pragma();
    Database.prototype.backup = require_backup();
    Database.prototype.function = require_function();
    Database.prototype.aggregate = require_aggregate();
    Database.prototype.loadExtension = wrappers.loadExtension;
    Database.prototype.exec = wrappers.exec;
    Database.prototype.close = wrappers.close;
    Database.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
    Database.prototype.unsafeMode = wrappers.unsafeMode;
    Database.prototype[util.inspect] = require_inspect();
    Database.setCorruptionLogger = setCorruptionLogger;
    module2.exports = Database;
    setErrorConstructor(require_sqlite_error());
  }
});

// node_modules/better-sqlite3/lib/index.js
var require_lib = __commonJS({
  "node_modules/better-sqlite3/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_database();
    module2.exports.SqliteError = require_sqlite_error();
  }
});

// node_modules/indent-string/index.js
var require_indent_string = __commonJS({
  "node_modules/indent-string/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (string, count = 1, options) => {
      options = __spreadValues({
        indent: " ",
        includeEmptyLines: false
      }, options);
      if (typeof string !== "string") {
        throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string}\``);
      }
      if (typeof count !== "number") {
        throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
      }
      if (typeof options.indent !== "string") {
        throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``);
      }
      if (count === 0) {
        return string;
      }
      const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
      return string.replace(regex, options.indent.repeat(count));
    };
  }
});

// node_modules/clean-stack/index.js
var require_clean_stack = __commonJS({
  "node_modules/clean-stack/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/;
    var pathRegex = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)\.js:\d+:\d+)|native)/;
    var homeDir = typeof os.homedir === "undefined" ? "" : os.homedir();
    module2.exports = (stack, options) => {
      options = Object.assign({ pretty: false }, options);
      return stack.replace(/\\/g, "/").split("\n").filter((line) => {
        const pathMatches = line.match(extractPathRegex);
        if (pathMatches === null || !pathMatches[1]) {
          return true;
        }
        const match = pathMatches[1];
        if (match.includes(".app/Contents/Resources/electron.asar") || match.includes(".app/Contents/Resources/default_app.asar")) {
          return false;
        }
        return !pathRegex.test(match);
      }).filter((line) => line.trim() !== "").map((line) => {
        if (options.pretty) {
          return line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDir, "~")));
        }
        return line;
      }).join("\n");
    };
  }
});

// node_modules/aggregate-error/index.js
var require_aggregate_error = __commonJS({
  "node_modules/aggregate-error/index.js"(exports2, module2) {
    "use strict";
    var indentString = require_indent_string();
    var cleanStack = require_clean_stack();
    var cleanInternalStack = /* @__PURE__ */ __name((stack) => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, ""), "cleanInternalStack");
    var AggregateError = class extends Error {
      constructor(errors) {
        if (!Array.isArray(errors)) {
          throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
        }
        errors = [...errors].map((error2) => {
          if (error2 instanceof Error) {
            return error2;
          }
          if (error2 !== null && typeof error2 === "object") {
            return Object.assign(new Error(error2.message), error2);
          }
          return new Error(error2);
        });
        let message = errors.map((error2) => {
          return typeof error2.stack === "string" ? cleanInternalStack(cleanStack(error2.stack)) : String(error2);
        }).join("\n");
        message = "\n" + indentString(message, 4);
        super(message);
        this.name = "AggregateError";
        Object.defineProperty(this, "_errors", { value: errors });
      }
      *[Symbol.iterator]() {
        for (const error2 of this._errors) {
          yield error2;
        }
      }
    };
    __name(AggregateError, "AggregateError");
    module2.exports = AggregateError;
  }
});

// node_modules/p-props/node_modules/p-map/index.js
var require_p_map = __commonJS({
  "node_modules/p-props/node_modules/p-map/index.js"(exports2, module2) {
    "use strict";
    var AggregateError = require_aggregate_error();
    module2.exports = async (iterable, mapper, {
      concurrency = Infinity,
      stopOnError = true
    } = {}) => {
      return new Promise((resolve, reject) => {
        if (typeof mapper !== "function") {
          throw new TypeError("Mapper function is required");
        }
        if (!((Number.isSafeInteger(concurrency) || concurrency === Infinity) && concurrency >= 1)) {
          throw new TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
        }
        const result = [];
        const errors = [];
        const iterator = iterable[Symbol.iterator]();
        let isRejected = false;
        let isIterableDone = false;
        let resolvingCount = 0;
        let currentIndex = 0;
        const next = /* @__PURE__ */ __name(() => {
          if (isRejected) {
            return;
          }
          const nextItem = iterator.next();
          const index = currentIndex;
          currentIndex++;
          if (nextItem.done) {
            isIterableDone = true;
            if (resolvingCount === 0) {
              if (!stopOnError && errors.length !== 0) {
                reject(new AggregateError(errors));
              } else {
                resolve(result);
              }
            }
            return;
          }
          resolvingCount++;
          (async () => {
            try {
              const element = await nextItem.value;
              result[index] = await mapper(element, index);
              resolvingCount--;
              next();
            } catch (error2) {
              if (stopOnError) {
                isRejected = true;
                reject(error2);
              } else {
                errors.push(error2);
                resolvingCount--;
                next();
              }
            }
          })();
        }, "next");
        for (let i = 0; i < concurrency; i++) {
          next();
          if (isIterableDone) {
            break;
          }
        }
      });
    };
  }
});

// node_modules/p-props/index.js
var require_p_props = __commonJS({
  "node_modules/p-props/index.js"(exports2, module2) {
    "use strict";
    var pMap = require_p_map();
    var map2 = /* @__PURE__ */ __name(async (map3, mapper, options) => {
      const awaitedEntries = [...map3.entries()].map(async ([key, value]) => [key, await value]);
      const values = await pMap(awaitedEntries, ([key, value]) => mapper(value, key), options);
      const result = /* @__PURE__ */ new Map();
      for (const [index, key] of [...map3.keys()].entries()) {
        result.set(key, values[index]);
      }
      return result;
    }, "map");
    var object = /* @__PURE__ */ __name(async (map3, mapper, options) => {
      const awaitedEntries = Object.entries(map3).map(async ([key, value]) => [key, await value]);
      const values = await pMap(awaitedEntries, ([key, value]) => mapper(value, key), options);
      const result = {};
      for (const [index, key] of Object.keys(map3).entries()) {
        result[key] = values[index];
      }
      return result;
    }, "object");
    var pProps2 = /* @__PURE__ */ __name((input, mapper = (value) => value, options) => {
      return input instanceof Map ? map2(input, mapper, options) : object(input, mapper, options);
    }, "pProps");
    module2.exports = pProps2;
  }
});

// node_modules/lodash/lodash.js
var require_lodash = __commonJS({
  "node_modules/lodash/lodash.js"(exports2, module2) {
    (function() {
      var undefined2;
      var VERSION = "4.17.21";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG],
        ["bind", WRAP_BIND_FLAG],
        ["bindKey", WRAP_BIND_KEY_FLAG],
        ["curry", WRAP_CURRY_FLAG],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG],
        ["flip", WRAP_FLIP_FLAG],
        ["partial", WRAP_PARTIAL_FLAG],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
        ["rearg", WRAP_REARG_FLAG]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
      var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types = freeModule && freeModule.require && freeModule.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      __name(apply, "apply");
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          var value = array[index];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      __name(arrayAggregator, "arrayAggregator");
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      __name(arrayEach, "arrayEach");
      function arrayEachRight(array, iteratee) {
        var length = array == null ? 0 : array.length;
        while (length--) {
          if (iteratee(array[length], length, array) === false) {
            break;
          }
        }
        return array;
      }
      __name(arrayEachRight, "arrayEachRight");
      function arrayEvery(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
      __name(arrayEvery, "arrayEvery");
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      __name(arrayFilter, "arrayFilter");
      function arrayIncludes(array, value) {
        var length = array == null ? 0 : array.length;
        return !!length && baseIndexOf(array, value, 0) > -1;
      }
      __name(arrayIncludes, "arrayIncludes");
      function arrayIncludesWith(array, value, comparator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (comparator(value, array[index])) {
            return true;
          }
        }
        return false;
      }
      __name(arrayIncludesWith, "arrayIncludesWith");
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      __name(arrayMap, "arrayMap");
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      __name(arrayPush, "arrayPush");
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      __name(arrayReduce, "arrayReduce");
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array[length], length, array);
        }
        return accumulator;
      }
      __name(arrayReduceRight, "arrayReduceRight");
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      __name(arraySome, "arraySome");
      var asciiSize = baseProperty("length");
      function asciiToArray(string) {
        return string.split("");
      }
      __name(asciiToArray, "asciiToArray");
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      __name(asciiWords, "asciiWords");
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key, collection2) {
          if (predicate(value, key, collection2)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      __name(baseFindKey, "baseFindKey");
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      __name(baseFindIndex, "baseFindIndex");
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      __name(baseIndexOf, "baseIndexOf");
      function baseIndexOfWith(array, value, fromIndex, comparator) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (comparator(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      __name(baseIndexOfWith, "baseIndexOfWith");
      function baseIsNaN(value) {
        return value !== value;
      }
      __name(baseIsNaN, "baseIsNaN");
      function baseMean(array, iteratee) {
        var length = array == null ? 0 : array.length;
        return length ? baseSum(array, iteratee) / length : NAN;
      }
      __name(baseMean, "baseMean");
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined2 : object[key];
        };
      }
      __name(baseProperty, "baseProperty");
      function basePropertyOf(object) {
        return function(key) {
          return object == null ? undefined2 : object[key];
        };
      }
      __name(basePropertyOf, "basePropertyOf");
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
        });
        return accumulator;
      }
      __name(baseReduce, "baseReduce");
      function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
      __name(baseSortBy, "baseSortBy");
      function baseSum(array, iteratee) {
        var result, index = -1, length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== undefined2) {
            result = result === undefined2 ? current : result + current;
          }
        }
        return result;
      }
      __name(baseSum, "baseSum");
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      __name(baseTimes, "baseTimes");
      function baseToPairs(object, props) {
        return arrayMap(props, function(key) {
          return [key, object[key]];
        });
      }
      __name(baseToPairs, "baseToPairs");
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      __name(baseTrim, "baseTrim");
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      __name(baseUnary, "baseUnary");
      function baseValues(object, props) {
        return arrayMap(props, function(key) {
          return object[key];
        });
      }
      __name(baseValues, "baseValues");
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      __name(cacheHas, "cacheHas");
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1, length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      __name(charsStartIndex, "charsStartIndex");
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      __name(charsEndIndex, "charsEndIndex");
      function countHolders(array, placeholder) {
        var length = array.length, result = 0;
        while (length--) {
          if (array[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      __name(countHolders, "countHolders");
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      __name(escapeStringChar, "escapeStringChar");
      function getValue(object, key) {
        return object == null ? undefined2 : object[key];
      }
      __name(getValue, "getValue");
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      __name(hasUnicode, "hasUnicode");
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      __name(hasUnicodeWord, "hasUnicodeWord");
      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      __name(iteratorToArray, "iteratorToArray");
      function mapToArray(map2) {
        var index = -1, result = Array(map2.size);
        map2.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      __name(mapToArray, "mapToArray");
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      __name(overArg, "overArg");
      function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index] = PLACEHOLDER;
            result[resIndex++] = index;
          }
        }
        return result;
      }
      __name(replaceHolders, "replaceHolders");
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      __name(setToArray, "setToArray");
      function setToPairs(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = [value, value];
        });
        return result;
      }
      __name(setToPairs, "setToPairs");
      function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      __name(strictIndexOf, "strictIndexOf");
      function strictLastIndexOf(array, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return index;
      }
      __name(strictLastIndexOf, "strictLastIndexOf");
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      __name(stringSize, "stringSize");
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      __name(stringToArray, "stringToArray");
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {
        }
        return index;
      }
      __name(trimmedEndIndex, "trimmedEndIndex");
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      __name(unicodeSize, "unicodeSize");
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      __name(unicodeToArray, "unicodeToArray");
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      __name(unicodeWords, "unicodeWords");
      var runInContext = /* @__PURE__ */ __name(function runInContext2(context) {
        context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
        var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid ? "Symbol(src)_1." + uid : "";
        }();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2, symIterator = Symbol2 ? Symbol2.iterator : undefined2, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
        var defineProperty = function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e) {
          }
        }();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap2 && new WeakMap2();
        var realNames = {};
        var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
        var symbolProto = Symbol2 ? Symbol2.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
        function lodash(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        __name(lodash, "lodash");
        var baseCreate = function() {
          function object() {
          }
          __name(object, "object");
          return function(proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined2;
            return result2;
          };
        }();
        function baseLodash() {
        }
        __name(baseLodash, "baseLodash");
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined2;
        }
        __name(LodashWrapper, "LodashWrapper");
        lodash.templateSettings = {
          "escape": reEscape,
          "evaluate": reEvaluate,
          "interpolate": reInterpolate,
          "variable": "",
          "imports": {
            "_": lodash
          }
        };
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        __name(LazyWrapper, "LazyWrapper");
        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }
        __name(lazyClone, "lazyClone");
        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }
        __name(lazyReverse, "lazyReverse");
        function lazyValue() {
          var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length && takeCount == length) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1, value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }
        __name(lazyValue, "lazyValue");
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        __name(Hash, "Hash");
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        __name(hashClear, "hashClear");
        function hashDelete(key) {
          var result2 = this.has(key) && delete this.__data__[key];
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        __name(hashDelete, "hashDelete");
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key];
            return result2 === HASH_UNDEFINED ? undefined2 : result2;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined2;
        }
        __name(hashGet, "hashGet");
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
        }
        __name(hashHas, "hashHas");
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
          return this;
        }
        __name(hashSet, "hashSet");
        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        __name(ListCache, "ListCache");
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        __name(listCacheClear, "listCacheClear");
        function listCacheDelete(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          --this.size;
          return true;
        }
        __name(listCacheDelete, "listCacheDelete");
        function listCacheGet(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          return index < 0 ? undefined2 : data[index][1];
        }
        __name(listCacheGet, "listCacheGet");
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        __name(listCacheHas, "listCacheHas");
        function listCacheSet(key, value) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            ++this.size;
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }
        __name(listCacheSet, "listCacheSet");
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        __name(MapCache, "MapCache");
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }
        __name(mapCacheClear, "mapCacheClear");
        function mapCacheDelete(key) {
          var result2 = getMapData(this, key)["delete"](key);
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        __name(mapCacheDelete, "mapCacheDelete");
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        __name(mapCacheGet, "mapCacheGet");
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        __name(mapCacheHas, "mapCacheHas");
        function mapCacheSet(key, value) {
          var data = getMapData(this, key), size2 = data.size;
          data.set(key, value);
          this.size += data.size == size2 ? 0 : 1;
          return this;
        }
        __name(mapCacheSet, "mapCacheSet");
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values2) {
          var index = -1, length = values2 == null ? 0 : values2.length;
          this.__data__ = new MapCache();
          while (++index < length) {
            this.add(values2[index]);
          }
        }
        __name(SetCache, "SetCache");
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        __name(setCacheAdd, "setCacheAdd");
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        __name(setCacheHas, "setCacheHas");
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        __name(Stack, "Stack");
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        __name(stackClear, "stackClear");
        function stackDelete(key) {
          var data = this.__data__, result2 = data["delete"](key);
          this.size = data.size;
          return result2;
        }
        __name(stackDelete, "stackDelete");
        function stackGet(key) {
          return this.__data__.get(key);
        }
        __name(stackGet, "stackGet");
        function stackHas(key) {
          return this.__data__.has(key);
        }
        __name(stackHas, "stackHas");
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        __name(stackSet, "stackSet");
        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        __name(arrayLikeKeys, "arrayLikeKeys");
        function arraySample(array) {
          var length = array.length;
          return length ? array[baseRandom(0, length - 1)] : undefined2;
        }
        __name(arraySample, "arraySample");
        function arraySampleSize(array, n) {
          return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
        }
        __name(arraySampleSize, "arraySampleSize");
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        __name(arrayShuffle, "arrayShuffle");
        function assignMergeValue(object, key, value) {
          if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        __name(assignMergeValue, "assignMergeValue");
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        __name(assignValue, "assignValue");
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }
        __name(assocIndexOf, "assocIndexOf");
        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }
        __name(baseAggregator, "baseAggregator");
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        __name(baseAssign, "baseAssign");
        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }
        __name(baseAssignIn, "baseAssignIn");
        function baseAssignValue(object, key, value) {
          if (key == "__proto__" && defineProperty) {
            defineProperty(object, key, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key] = value;
          }
        }
        __name(baseAssignValue, "baseAssignValue");
        function baseAt(object, paths) {
          var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
          while (++index < length) {
            result2[index] = skip ? undefined2 : get(object, paths[index]);
          }
          return result2;
        }
        __name(baseAt, "baseAt");
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined2) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined2) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        __name(baseClamp, "baseClamp");
        function baseClone(value, bitmask, customizer, key, object, stack) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key, object, stack) : customizer(value);
          }
          if (result2 !== undefined2) {
            return result2;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result2);
          if (isSet(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
            });
          } else if (isMap(value)) {
            value.forEach(function(subValue, key2) {
              result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined2 : keysFunc(value);
          arrayEach(props || value, function(subValue, key2) {
            if (props) {
              key2 = subValue;
              subValue = value[key2];
            }
            assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
          return result2;
        }
        __name(baseClone, "baseClone");
        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }
        __name(baseConforms, "baseConforms");
        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (length--) {
            var key = props[length], predicate = source[key], value = object[key];
            if (value === undefined2 && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        __name(baseConformsTo, "baseConformsTo");
        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout2(function() {
            func.apply(undefined2, args);
          }, wait);
        }
        __name(baseDelay, "baseDelay");
        function baseDifference(array, values2, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
          if (!length) {
            return result2;
          }
          if (iteratee2) {
            values2 = arrayMap(values2, baseUnary(iteratee2));
          }
          if (comparator) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values2.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values2 = new SetCache(values2);
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values2[valuesIndex] === computed) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values2, computed, comparator)) {
                result2.push(value);
              }
            }
          return result2;
        }
        __name(baseDifference, "baseDifference");
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index, collection2) {
            result2 = !!predicate(value, index, collection2);
            return result2;
          });
          return result2;
        }
        __name(baseEvery, "baseEvery");
        function baseExtremum(array, iteratee2, comparator) {
          var index = -1, length = array.length;
          while (++index < length) {
            var value = array[index], current = iteratee2(value);
            if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current, result2 = value;
            }
          }
          return result2;
        }
        __name(baseExtremum, "baseExtremum");
        function baseFill(array, value, start, end) {
          var length = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined2 || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array[start++] = value;
          }
          return array;
        }
        __name(baseFill, "baseFill");
        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index, collection2) {
            if (predicate(value, index, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }
        __name(baseFilter, "baseFilter");
        function baseFlatten(array, depth, predicate, isStrict, result2) {
          var index = -1, length = array.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index < length) {
            var value = array[index];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }
        __name(baseFlatten, "baseFlatten");
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }
        __name(baseForOwn, "baseForOwn");
        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }
        __name(baseForOwnRight, "baseForOwnRight");
        function baseFunctions(object, props) {
          return arrayFilter(props, function(key) {
            return isFunction(object[key]);
          });
        }
        __name(baseFunctions, "baseFunctions");
        function baseGet(object, path) {
          path = castPath(path, object);
          var index = 0, length = path.length;
          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return index && index == length ? object : undefined2;
        }
        __name(baseGet, "baseGet");
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }
        __name(baseGetAllKeys, "baseGetAllKeys");
        function baseGetTag(value) {
          if (value == null) {
            return value === undefined2 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
        }
        __name(baseGetTag, "baseGetTag");
        function baseGt(value, other) {
          return value > other;
        }
        __name(baseGt, "baseGt");
        function baseHas(object, key) {
          return object != null && hasOwnProperty.call(object, key);
        }
        __name(baseHas, "baseHas");
        function baseHasIn(object, key) {
          return object != null && key in Object2(object);
        }
        __name(baseHasIn, "baseHasIn");
        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }
        __name(baseInRange, "baseInRange");
        function baseIntersection(arrays, iteratee2, comparator) {
          var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee2) {
              array = arrayMap(array, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
          }
          array = arrays[0];
          var index = -1, seen = caches[0];
          outer:
            while (++index < length && result2.length < maxLength) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        __name(baseIntersection, "baseIntersection");
        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key, object2) {
            setter(accumulator, iteratee2(value), key, object2);
          });
          return accumulator;
        }
        __name(baseInverter, "baseInverter");
        function baseInvoke(object, path, args) {
          path = castPath(path, object);
          object = parent(object, path);
          var func = object == null ? object : object[toKey(last3(path))];
          return func == null ? undefined2 : apply(func, object, args);
        }
        __name(baseInvoke, "baseInvoke");
        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }
        __name(baseIsArguments, "baseIsArguments");
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }
        __name(baseIsArrayBuffer, "baseIsArrayBuffer");
        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }
        __name(baseIsDate, "baseIsDate");
        function baseIsEqual(value, other, bitmask, customizer, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }
        __name(baseIsEqual, "baseIsEqual");
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
          var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
          objTag = objTag == argsTag ? objectTag : objTag;
          othTag = othTag == argsTag ? objectTag : othTag;
          var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
          if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) {
              return false;
            }
            objIsArr = true;
            objIsObj = false;
          }
          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }
        __name(baseIsEqualDeep, "baseIsEqualDeep");
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        __name(baseIsMap, "baseIsMap");
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length, length = index, noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined2 && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                return false;
              }
            }
          }
          return true;
        }
        __name(baseIsMatch, "baseIsMatch");
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        __name(baseIsNative, "baseIsNative");
        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }
        __name(baseIsRegExp, "baseIsRegExp");
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        __name(baseIsSet, "baseIsSet");
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        __name(baseIsTypedArray, "baseIsTypedArray");
        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        __name(baseIteratee, "baseIteratee");
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key in Object2(object)) {
            if (hasOwnProperty.call(object, key) && key != "constructor") {
              result2.push(key);
            }
          }
          return result2;
        }
        __name(baseKeys, "baseKeys");
        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key in object) {
            if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        __name(baseKeysIn, "baseKeysIn");
        function baseLt(value, other) {
          return value < other;
        }
        __name(baseLt, "baseLt");
        function baseMap(collection, iteratee2) {
          var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key, collection2) {
            result2[++index] = iteratee2(value, key, collection2);
          });
          return result2;
        }
        __name(baseMap, "baseMap");
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        __name(baseMatches, "baseMatches");
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get(object, path);
            return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }
        __name(baseMatchesProperty, "baseMatchesProperty");
        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
              if (newValue === undefined2) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          }, keysIn);
        }
        __name(baseMerge, "baseMerge");
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
          var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
          var isCommon = newValue === undefined2;
          if (isCommon) {
            var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else {
                newValue = [];
              }
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || isFunction(objValue)) {
                newValue = initCloneObject(srcValue);
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
            stack["delete"](srcValue);
          }
          assignMergeValue(object, key, newValue);
        }
        __name(baseMergeDeep, "baseMergeDeep");
        function baseNth(array, n) {
          var length = array.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array[n] : undefined2;
        }
        __name(baseNth, "baseNth");
        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [identity];
          }
          var index = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return { "criteria": criteria, "index": ++index, "value": value };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        __name(baseOrderBy, "baseOrderBy");
        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path) {
            return hasIn(object, path);
          });
        }
        __name(basePick, "basePick");
        function basePickBy(object, paths, predicate) {
          var index = -1, length = paths.length, result2 = {};
          while (++index < length) {
            var path = paths[index], value = baseGet(object, path);
            if (predicate(value, path)) {
              baseSet(result2, castPath(path, object), value);
            }
          }
          return result2;
        }
        __name(basePickBy, "basePickBy");
        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }
        __name(basePropertyDeep, "basePropertyDeep");
        function basePullAll(array, values2, iteratee2, comparator) {
          var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
          if (array === values2) {
            values2 = copyArray(values2);
          }
          if (iteratee2) {
            seen = arrayMap(array, baseUnary(iteratee2));
          }
          while (++index < length) {
            var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        __name(basePullAll, "basePullAll");
        function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0, lastIndex = length - 1;
          while (length--) {
            var index = indexes[length];
            if (length == lastIndex || index !== previous) {
              var previous = index;
              if (isIndex(index)) {
                splice.call(array, index, 1);
              } else {
                baseUnset(array, index);
              }
            }
          }
          return array;
        }
        __name(basePullAt, "basePullAt");
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        __name(baseRandom, "baseRandom");
        function baseRange(start, end, step, fromRight) {
          var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
          while (length--) {
            result2[fromRight ? length : ++index] = start;
            start += step;
          }
          return result2;
        }
        __name(baseRange, "baseRange");
        function baseRepeat(string, n) {
          var result2 = "";
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n % 2) {
              result2 += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result2;
        }
        __name(baseRepeat, "baseRepeat");
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }
        __name(baseRest, "baseRest");
        function baseSample(collection) {
          return arraySample(values(collection));
        }
        __name(baseSample, "baseSample");
        function baseSampleSize(collection, n) {
          var array = values(collection);
          return shuffleSelf(array, baseClamp(n, 0, array.length));
        }
        __name(baseSampleSize, "baseSampleSize");
        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = castPath(path, object);
          var index = -1, length = path.length, lastIndex = length - 1, nested = object;
          while (nested != null && ++index < length) {
            var key = toKey(path[index]), newValue = value;
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              return object;
            }
            if (index != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined2;
              if (newValue === undefined2) {
                newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        __name(baseSet, "baseSet");
        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty ? identity : function(func, string) {
          return defineProperty(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }
        __name(baseShuffle, "baseShuffle");
        function baseSlice(array, start, end) {
          var index = -1, length = array.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length);
          while (++index < length) {
            result2[index] = array[index + start];
          }
          return result2;
        }
        __name(baseSlice, "baseSlice");
        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index, collection2) {
            result2 = predicate(value, index, collection2);
            return !result2;
          });
          return !!result2;
        }
        __name(baseSome, "baseSome");
        function baseSortedIndex(array, value, retHighest) {
          var low = 0, high = array == null ? low : array.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed = array[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        __name(baseSortedIndex, "baseSortedIndex");
        function baseSortedIndexBy(array, value, iteratee2, retHighest) {
          var low = 0, high = array == null ? 0 : array.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        __name(baseSortedIndexBy, "baseSortedIndexBy");
        function baseSortedUniq(array, iteratee2) {
          var index = -1, length = array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            if (!index || !eq(computed, seen)) {
              var seen = computed;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }
        __name(baseSortedUniq, "baseSortedUniq");
        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }
        __name(baseToNumber, "baseToNumber");
        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        __name(baseToString, "baseToString");
        function baseUniq(array, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
          if (comparator) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set2 = iteratee2 ? null : createSet(array);
            if (set2) {
              return setToArray(set2);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed);
                }
                result2.push(value);
              } else if (!includes2(seen, computed, comparator)) {
                if (seen !== result2) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        __name(baseUniq, "baseUniq");
        function baseUnset(object, path) {
          path = castPath(path, object);
          object = parent(object, path);
          return object == null || delete object[toKey(last3(path))];
        }
        __name(baseUnset, "baseUnset");
        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }
        __name(baseUpdate, "baseUpdate");
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length = array.length, index = fromRight ? length : -1;
          while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
          }
          return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        __name(baseWhile, "baseWhile");
        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([result3], action.args));
          }, result2);
        }
        __name(baseWrapperValue, "baseWrapperValue");
        function baseXor(arrays, iteratee2, comparator) {
          var length = arrays.length;
          if (length < 2) {
            return length ? baseUniq(arrays[0]) : [];
          }
          var index = -1, result2 = Array2(length);
          while (++index < length) {
            var array = arrays[index], othIndex = -1;
            while (++othIndex < length) {
              if (othIndex != index) {
                result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
        }
        __name(baseXor, "baseXor");
        function baseZipObject(props, values2, assignFunc) {
          var index = -1, length = props.length, valsLength = values2.length, result2 = {};
          while (++index < length) {
            var value = index < valsLength ? values2[index] : undefined2;
            assignFunc(result2, props[index], value);
          }
          return result2;
        }
        __name(baseZipObject, "baseZipObject");
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        __name(castArrayLikeObject, "castArrayLikeObject");
        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }
        __name(castFunction, "castFunction");
        function castPath(value, object) {
          if (isArray(value)) {
            return value;
          }
          return isKey(value, object) ? [value] : stringToPath(toString(value));
        }
        __name(castPath, "castPath");
        var castRest = baseRest;
        function castSlice(array, start, end) {
          var length = array.length;
          end = end === undefined2 ? length : end;
          return !start && end >= length ? array : baseSlice(array, start, end);
        }
        __name(castSlice, "castSlice");
        var clearTimeout = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result2);
          return result2;
        }
        __name(cloneBuffer, "cloneBuffer");
        function cloneArrayBuffer(arrayBuffer2) {
          var result2 = new arrayBuffer2.constructor(arrayBuffer2.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer2));
          return result2;
        }
        __name(cloneArrayBuffer, "cloneArrayBuffer");
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        __name(cloneDataView, "cloneDataView");
        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }
        __name(cloneRegExp, "cloneRegExp");
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }
        __name(cloneSymbol, "cloneSymbol");
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        __name(cloneTypedArray, "cloneTypedArray");
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        __name(compareAscending, "compareAscending");
        function compareMultiple(object, other, orders) {
          var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
          while (++index < length) {
            var result2 = compareAscending(objCriteria[index], othCriteria[index]);
            if (result2) {
              if (index >= ordersLength) {
                return result2;
              }
              var order = orders[index];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        __name(compareMultiple, "compareMultiple");
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }
        __name(composeArgs, "composeArgs");
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }
        __name(composeArgsRight, "composeArgsRight");
        function copyArray(source, array) {
          var index = -1, length = source.length;
          array || (array = Array2(length));
          while (++index < length) {
            array[index] = source[index];
          }
          return array;
        }
        __name(copyArray, "copyArray");
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index = -1, length = props.length;
          while (++index < length) {
            var key = props[index];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
            if (newValue === undefined2) {
              newValue = source[key];
            }
            if (isNew) {
              baseAssignValue(object, key, newValue);
            } else {
              assignValue(object, key, newValue);
            }
          }
          return object;
        }
        __name(copyObject, "copyObject");
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        __name(copySymbols, "copySymbols");
        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }
        __name(copySymbolsIn, "copySymbolsIn");
        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }
        __name(createAggregator, "createAggregator");
        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined2 : customizer;
              length = 1;
            }
            object = Object2(object);
            while (++index < length) {
              var source = sources[index];
              if (source) {
                assigner(object, source, index, customizer);
              }
            }
            return object;
          });
        }
        __name(createAssigner, "createAssigner");
        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
            while (fromRight ? index-- : ++index < length) {
              if (iteratee2(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        __name(createBaseEach, "createBaseEach");
        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee2(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        __name(createBaseFor, "createBaseFor");
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          __name(wrapper, "wrapper");
          return wrapper;
        }
        __name(createBind, "createBind");
        function createCaseFirst(methodName) {
          return function(string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        __name(createCaseFirst, "createCaseFirst");
        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }
        __name(createCompounder, "createCompounder");
        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject(result2) ? result2 : thisBinding;
          };
        }
        __name(createCtor, "createCtor");
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
            while (index--) {
              args[index] = arguments[index];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }
          __name(wrapper, "wrapper");
          return wrapper;
        }
        __name(createCurry, "createCurry");
        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = /* @__PURE__ */ __name(function(key) {
                return iteratee2(iterable[key], key, iterable);
              }, "predicate");
            }
            var index = findIndexFunc(collection, predicate, fromIndex);
            return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
          };
        }
        __name(createFind, "createFind");
        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index--) {
              var func = funcs[index];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index = wrapper ? index : length;
            while (++index < length) {
              func = funcs[index];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper && args.length == 1 && isArray(value)) {
                return wrapper.plant(value).value();
              }
              var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
              while (++index2 < length) {
                result2 = funcs[index2].call(this, result2);
              }
              return result2;
            };
          });
        }
        __name(createFlow, "createFlow");
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length;
            while (index--) {
              args[index] = arguments[index];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          __name(wrapper, "wrapper");
          return wrapper;
        }
        __name(createHybrid, "createHybrid");
        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }
        __name(createInverter, "createInverter");
        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined2 && other === undefined2) {
              return defaultValue;
            }
            if (value !== undefined2) {
              result2 = value;
            }
            if (other !== undefined2) {
              if (result2 === undefined2) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }
        __name(createMathOperation, "createMathOperation");
        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply(iteratee2, thisArg, args);
              });
            });
          });
        }
        __name(createOver, "createOver");
        function createPadding(length, chars) {
          chars = chars === undefined2 ? " " : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
          }
          var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
        }
        __name(createPadding, "createPadding");
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }
          __name(wrapper, "wrapper");
          return wrapper;
        }
        __name(createPartial, "createPartial");
        function createRange(fromRight) {
          return function(start, end, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
              end = step = undefined2;
            }
            start = toFinite(start);
            if (end === undefined2) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }
        __name(createRange, "createRange");
        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        __name(createRelationalOperation, "createRelationalOperation");
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined2, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }
        __name(createRecurry, "createRecurry");
        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        __name(createRound, "createRound");
        var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop2 : function(values2) {
          return new Set2(values2);
        };
        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        __name(createToPairs, "createToPairs");
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined2;
          }
          ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined2 ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined2;
          }
          var data = isBindKey ? undefined2 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined2, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }
        __name(createWrap, "createWrap");
        function customDefaultsAssignIn(objValue, srcValue, key, object) {
          if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        __name(customDefaultsAssignIn, "customDefaultsAssignIn");
        function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
            stack["delete"](srcValue);
          }
          return objValue;
        }
        __name(customDefaultsMerge, "customDefaultsMerge");
        function customOmitClone(value) {
          return isPlainObject(value) ? undefined2 : value;
        }
        __name(customOmitClone, "customOmitClone");
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack.get(array);
          var othStacked = stack.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array;
          }
          var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
          stack.set(array, other);
          stack.set(other, array);
          while (++index < arrLength) {
            var arrValue = array[index], othValue = other[index];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
            }
            if (compared !== undefined2) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              result2 = false;
              break;
            }
          }
          stack["delete"](array);
          stack["delete"](other);
          return result2;
        }
        __name(equalArrays, "equalArrays");
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + "";
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        __name(equalByTag, "equalByTag");
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          var objStacked = stack.get(object);
          var othStacked = stack.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key], othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            }
            if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack["delete"](object);
          stack["delete"](other);
          return result2;
        }
        __name(equalObjects, "equalObjects");
        function flatRest(func) {
          return setToString(overRest(func, undefined2, flatten), func + "");
        }
        __name(flatRest, "flatRest");
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        __name(getAllKeys, "getAllKeys");
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        __name(getAllKeysIn, "getAllKeysIn");
        var getData = !metaMap ? noop2 : function(func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
          while (length--) {
            var data = array[length], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }
        __name(getFuncName, "getFuncName");
        function getHolder(func) {
          var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
          return object.placeholder;
        }
        __name(getHolder, "getHolder");
        function getIteratee() {
          var result2 = lodash.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }
        __name(getIteratee, "getIteratee");
        function getMapData(map3, key) {
          var data = map3.__data__;
          return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
        }
        __name(getMapData, "getMapData");
        function getMatchData(object) {
          var result2 = keys(object), length = result2.length;
          while (length--) {
            var key = result2[length], value = object[key];
            result2[length] = [key, value, isStrictComparable(value)];
          }
          return result2;
        }
        __name(getMatchData, "getMatchData");
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined2;
        }
        __name(getNative, "getNative");
        function getRawTag(value) {
          var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined2;
            var unmasked = true;
          } catch (e) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }
        __name(getRawTag, "getRawTag");
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
          getTag = /* @__PURE__ */ __name(function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result2;
          }, "getTag");
        }
        function getView(start, end, transforms) {
          var index = -1, length = transforms.length;
          while (++index < length) {
            var data = transforms[index], size2 = data.size;
            switch (data.type) {
              case "drop":
                start += size2;
                break;
              case "dropRight":
                end -= size2;
                break;
              case "take":
                end = nativeMin(end, start + size2);
                break;
              case "takeRight":
                start = nativeMax(start, end - size2);
                break;
            }
          }
          return { "start": start, "end": end };
        }
        __name(getView, "getView");
        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }
        __name(getWrapDetails, "getWrapDetails");
        function hasPath(object, path, hasFunc) {
          path = castPath(path, object);
          var index = -1, length = path.length, result2 = false;
          while (++index < length) {
            var key = toKey(path[index]);
            if (!(result2 = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result2 || ++index != length) {
            return result2;
          }
          length = object == null ? 0 : object.length;
          return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
        }
        __name(hasPath, "hasPath");
        function initCloneArray(array) {
          var length = array.length, result2 = new array.constructor(length);
          if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
            result2.index = array.index;
            result2.input = array.input;
          }
          return result2;
        }
        __name(initCloneArray, "initCloneArray");
        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        __name(initCloneObject, "initCloneObject");
        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        __name(initCloneByTag, "initCloneByTag");
        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }
        __name(insertWrapDetails, "insertWrapDetails");
        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        __name(isFlattenable, "isFlattenable");
        function isIndex(value, length) {
          var type = typeof value;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
        }
        __name(isIndex, "isIndex");
        function isIterateeCall(value, index, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index;
          if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
            return eq(object[index], value);
          }
          return false;
        }
        __name(isIterateeCall, "isIterateeCall");
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }
        __name(isKey, "isKey");
        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }
        __name(isKeyable, "isKeyable");
        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        __name(isLaziable, "isLaziable");
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        __name(isMasked, "isMasked");
        var isMaskable = coreJsData ? isFunction : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }
        __name(isPrototype, "isPrototype");
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }
        __name(isStrictComparable, "isStrictComparable");
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
          };
        }
        __name(matchesStrictComparable, "matchesStrictComparable");
        function memoizeCapped(func) {
          var result2 = memoize(func, function(key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result2.cache;
          return result2;
        }
        __name(memoizeCapped, "memoizeCapped");
        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        __name(mergeData, "mergeData");
        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key in Object2(object)) {
              result2.push(key);
            }
          }
          return result2;
        }
        __name(nativeKeysIn, "nativeKeysIn");
        function objectToString(value) {
          return nativeObjectToString.call(value);
        }
        __name(objectToString, "objectToString");
        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
            while (++index < length) {
              array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array2(start + 1);
            while (++index < start) {
              otherArgs[index] = args[index];
            }
            otherArgs[start] = transform2(array);
            return apply(func, this, otherArgs);
          };
        }
        __name(overRest, "overRest");
        function parent(object, path) {
          return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
        }
        __name(parent, "parent");
        function reorder(array, indexes) {
          var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
          while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
          }
          return array;
        }
        __name(reorder, "reorder");
        function safeGet(object, key) {
          if (key === "constructor" && typeof object[key] === "function") {
            return;
          }
          if (key == "__proto__") {
            return;
          }
          return object[key];
        }
        __name(safeGet, "safeGet");
        var setData = shortOut(baseSetData);
        var setTimeout2 = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        __name(setWrapToString, "setWrapToString");
        function shortOut(func) {
          var count = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined2, arguments);
          };
        }
        __name(shortOut, "shortOut");
        function shuffleSelf(array, size2) {
          var index = -1, length = array.length, lastIndex = length - 1;
          size2 = size2 === undefined2 ? length : size2;
          while (++index < size2) {
            var rand = baseRandom(index, lastIndex), value = array[rand];
            array[rand] = array[index];
            array[index] = value;
          }
          array.length = size2;
          return array;
        }
        __name(shuffleSelf, "shuffleSelf");
        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
          });
          return result2;
        });
        function toKey(value) {
          if (typeof value == "string" || isSymbol(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        __name(toKey, "toKey");
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {
            }
            try {
              return func + "";
            } catch (e) {
            }
          }
          return "";
        }
        __name(toSource, "toSource");
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        __name(updateWrapDetails, "updateWrapDetails");
        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result2.__actions__ = copyArray(wrapper.__actions__);
          result2.__index__ = wrapper.__index__;
          result2.__values__ = wrapper.__values__;
          return result2;
        }
        __name(wrapperClone, "wrapperClone");
        function chunk(array, size2, guard) {
          if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
            size2 = 1;
          } else {
            size2 = nativeMax(toInteger(size2), 0);
          }
          var length = array == null ? 0 : array.length;
          if (!length || size2 < 1) {
            return [];
          }
          var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
          while (index < length) {
            result2[resIndex++] = baseSlice(array, index, index += size2);
          }
          return result2;
        }
        __name(chunk, "chunk");
        function compact(array) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }
        __name(compact, "compact");
        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array2(length - 1), array = arguments[0], index = length;
          while (index--) {
            args[index - 1] = arguments[index];
          }
          return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
        }
        __name(concat, "concat");
        var difference = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array, values2) {
          var iteratee2 = last3(values2);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array, values2) {
          var comparator = last3(values2);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
        });
        function drop(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        __name(drop, "drop");
        function dropRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        __name(dropRight, "dropRight");
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        __name(dropRightWhile, "dropRightWhile");
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        __name(dropWhile, "dropWhile");
        function fill(array, value, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array, value, start, end);
        }
        __name(fill, "fill");
        function findIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index);
        }
        __name(findIndex, "findIndex");
        function findLastIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length - 1;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index, true);
        }
        __name(findLastIndex, "findLastIndex");
        function flatten(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, 1) : [];
        }
        __name(flatten, "flatten");
        function flattenDeep(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, INFINITY) : [];
        }
        __name(flattenDeep, "flattenDeep");
        function flattenDepth(array, depth) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        __name(flattenDepth, "flattenDepth");
        function fromPairs2(pairs) {
          var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index < length) {
            var pair = pairs[index];
            result2[pair[0]] = pair[1];
          }
          return result2;
        }
        __name(fromPairs2, "fromPairs");
        function head(array) {
          return array && array.length ? array[0] : undefined2;
        }
        __name(head, "head");
        function indexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseIndexOf(array, value, index);
        }
        __name(indexOf, "indexOf");
        function initial(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 0, -1) : [];
        }
        __name(initial, "initial");
        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last3(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last3(mapped)) {
            iteratee2 = undefined2;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator = last3(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          if (comparator) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
        });
        function join2(array, separator) {
          return array == null ? "" : nativeJoin.call(array, separator);
        }
        __name(join2, "join");
        function last3(array) {
          var length = array == null ? 0 : array.length;
          return length ? array[length - 1] : undefined2;
        }
        __name(last3, "last");
        function lastIndexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
        }
        __name(lastIndexOf, "lastIndexOf");
        function nth(array, n) {
          return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
        }
        __name(nth, "nth");
        var pull = baseRest(pullAll);
        function pullAll(array, values2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
        }
        __name(pullAll, "pullAll");
        function pullAllBy(array, values2, iteratee2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
        }
        __name(pullAllBy, "pullAllBy");
        function pullAllWith(array, values2, comparator) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
        }
        __name(pullAllWith, "pullAllWith");
        var pullAt = flatRest(function(array, indexes) {
          var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function(index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending));
          return result2;
        });
        function remove(array, predicate) {
          var result2 = [];
          if (!(array && array.length)) {
            return result2;
          }
          var index = -1, indexes = [], length = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result2.push(value);
              indexes.push(index);
            }
          }
          basePullAt(array, indexes);
          return result2;
        }
        __name(remove, "remove");
        function reverse(array) {
          return array == null ? array : nativeReverse.call(array);
        }
        __name(reverse, "reverse");
        function slice(array, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined2 ? length : toInteger(end);
          }
          return baseSlice(array, start, end);
        }
        __name(slice, "slice");
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        __name(sortedIndex, "sortedIndex");
        function sortedIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
        }
        __name(sortedIndexBy, "sortedIndexBy");
        function sortedIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value);
            if (index < length && eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        __name(sortedIndexOf, "sortedIndexOf");
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        __name(sortedLastIndex, "sortedLastIndex");
        function sortedLastIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
        }
        __name(sortedLastIndexBy, "sortedLastIndexBy");
        function sortedLastIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        __name(sortedLastIndexOf, "sortedLastIndexOf");
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        __name(sortedUniq, "sortedUniq");
        function sortedUniqBy(array, iteratee2) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        __name(sortedUniqBy, "sortedUniqBy");
        function tail(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 1, length) : [];
        }
        __name(tail, "tail");
        function take(array, n, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        __name(take, "take");
        function takeRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        __name(takeRight, "takeRight");
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        __name(takeRightWhile, "takeRightWhile");
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        __name(takeWhile, "takeWhile");
        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last3(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator = last3(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
        });
        function uniq(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        __name(uniq, "uniq");
        function uniqBy(array, iteratee2) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        __name(uniqBy, "uniqBy");
        function uniqWith(array, comparator) {
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return array && array.length ? baseUniq(array, undefined2, comparator) : [];
        }
        __name(uniqWith, "uniqWith");
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length = 0;
          array = arrayFilter(array, function(group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function(index) {
            return arrayMap(array, baseProperty(index));
          });
        }
        __name(unzip, "unzip");
        function unzipWith(array, iteratee2) {
          if (!(array && array.length)) {
            return [];
          }
          var result2 = unzip(array);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply(iteratee2, undefined2, group);
          });
        }
        __name(unzipWith, "unzipWith");
        var without = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last3(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator = last3(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values2) {
          return baseZipObject(props || [], values2 || [], assignValue);
        }
        __name(zipObject, "zipObject");
        function zipObjectDeep(props, values2) {
          return baseZipObject(props || [], values2 || [], baseSet);
        }
        __name(zipObjectDeep, "zipObjectDeep");
        var zipWith = baseRest(function(arrays) {
          var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
          return unzipWith(arrays, iteratee2);
        });
        function chain(value) {
          var result2 = lodash(value);
          result2.__chain__ = true;
          return result2;
        }
        __name(chain, "chain");
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        __name(tap, "tap");
        function thru(value, interceptor) {
          return interceptor(value);
        }
        __name(thru, "thru");
        var wrapperAt = flatRest(function(paths) {
          var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = /* @__PURE__ */ __name(function(object) {
            return baseAt(object, paths);
          }, "interceptor");
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [interceptor],
            "thisArg": undefined2
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array) {
            if (length && !array.length) {
              array.push(undefined2);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        __name(wrapperChain, "wrapperChain");
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        __name(wrapperCommit, "wrapperCommit");
        function wrapperNext() {
          if (this.__values__ === undefined2) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
          return { "done": done, "value": value };
        }
        __name(wrapperNext, "wrapperNext");
        function wrapperToIterator() {
          return this;
        }
        __name(wrapperToIterator, "wrapperToIterator");
        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone2 = wrapperClone(parent2);
            clone2.__index__ = 0;
            clone2.__values__ = undefined2;
            if (result2) {
              previous.__wrapped__ = clone2;
            } else {
              result2 = clone2;
            }
            var previous = clone2;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }
        __name(wrapperPlant, "wrapperPlant");
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [reverse],
              "thisArg": undefined2
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        __name(wrapperReverse, "wrapperReverse");
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        __name(wrapperValue, "wrapperValue");
        var countBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            ++result2[key];
          } else {
            baseAssignValue(result2, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        __name(every, "every");
        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        __name(filter, "filter");
        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee2) {
          return baseFlatten(map2(collection, iteratee2), 1);
        }
        __name(flatMap, "flatMap");
        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map2(collection, iteratee2), INFINITY);
        }
        __name(flatMapDeep, "flatMapDeep");
        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(map2(collection, iteratee2), depth);
        }
        __name(flatMapDepth, "flatMapDepth");
        function forEach2(collection, iteratee2) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }
        __name(forEach2, "forEach");
        function forEachRight(collection, iteratee2) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }
        __name(forEachRight, "forEachRight");
        var groupBy2 = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            result2[key].push(value);
          } else {
            baseAssignValue(result2, key, [value]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString2(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }
        __name(includes, "includes");
        var invokeMap = baseRest(function(collection, path, args) {
          var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
          });
          return result2;
        });
        var keyBy2 = createAggregator(function(result2, value, key) {
          baseAssignValue(result2, key, value);
        });
        function map2(collection, iteratee2) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }
        __name(map2, "map");
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined2 : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        __name(orderBy, "orderBy");
        var partition = createAggregator(function(result2, value, key) {
          result2[key ? 0 : 1].push(value);
        }, function() {
          return [[], []];
        });
        function reduce(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }
        __name(reduce, "reduce");
        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }
        __name(reduceRight, "reduceRight");
        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }
        __name(reject, "reject");
        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }
        __name(sample, "sample");
        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }
        __name(sampleSize, "sampleSize");
        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        __name(shuffle, "shuffle");
        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString2(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        __name(size, "size");
        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        __name(some, "some");
        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };
        function after(n, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        __name(after, "after");
        function ary(func, n, guard) {
          n = guard ? undefined2 : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
        }
        __name(ary, "ary");
        function before(n, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined2;
            }
            return result2;
          };
        }
        __name(before, "before");
        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }
        __name(curry, "curry");
        function curryRight(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }
        __name(curryRight, "curryRight");
        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined2;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }
          __name(invokeFunc, "invokeFunc");
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout2(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }
          __name(leadingEdge, "leadingEdge");
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }
          __name(remainingWait, "remainingWait");
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          __name(shouldInvoke, "shouldInvoke");
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout2(timerExpired, remainingWait(time));
          }
          __name(timerExpired, "timerExpired");
          function trailingEdge(time) {
            timerId = undefined2;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined2;
            return result2;
          }
          __name(trailingEdge, "trailingEdge");
          function cancel() {
            if (timerId !== undefined2) {
              clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined2;
          }
          __name(cancel, "cancel");
          function flush() {
            return timerId === undefined2 ? result2 : trailingEdge(now());
          }
          __name(flush, "flush");
          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined2) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout(timerId);
                timerId = setTimeout2(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined2) {
              timerId = setTimeout2(timerExpired, wait);
            }
            return result2;
          }
          __name(debounced, "debounced");
          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        __name(debounce, "debounce");
        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }
        __name(flip, "flip");
        function memoize(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = /* @__PURE__ */ __name(function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key, result2) || cache;
            return result2;
          }, "memoized");
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }
        __name(memoize, "memoize");
        memoize.Cache = MapCache;
        function negate(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        __name(negate, "negate");
        function once(func) {
          return before(2, func);
        }
        __name(once, "once");
        var overArgs = castRest(function(func, transforms) {
          transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function(args) {
            var index = -1, length = nativeMin(args.length, funcsLength);
            while (++index < length) {
              args[index] = transforms[index].call(this, args[index]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
        });
        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined2 ? start : toInteger(start);
          return baseRest(func, start);
        }
        __name(rest, "rest");
        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array = args[start], otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply(func, this, otherArgs);
          });
        }
        __name(spread, "spread");
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }
        __name(throttle, "throttle");
        function unary(func) {
          return ary(func, 1);
        }
        __name(unary, "unary");
        function wrap(value, wrapper) {
          return partial(castFunction(wrapper), value);
        }
        __name(wrap, "wrap");
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }
        __name(castArray, "castArray");
        function clone(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }
        __name(clone, "clone");
        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }
        __name(cloneWith, "cloneWith");
        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        __name(cloneDeep, "cloneDeep");
        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }
        __name(cloneDeepWith, "cloneDeepWith");
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        __name(conformsTo, "conformsTo");
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        __name(eq, "eq");
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(function() {
          return arguments;
        }()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }
        __name(isArrayLike, "isArrayLike");
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        __name(isArrayLikeObject, "isArrayLikeObject");
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }
        __name(isBoolean, "isBoolean");
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
        }
        __name(isElement, "isElement");
        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        __name(isEmpty, "isEmpty");
        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }
        __name(isEqual, "isEqual");
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          var result2 = customizer ? customizer(value, other) : undefined2;
          return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
        }
        __name(isEqualWith, "isEqualWith");
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
        }
        __name(isError, "isError");
        function isFinite(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }
        __name(isFinite, "isFinite");
        function isFunction(value) {
          if (!isObject(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        __name(isFunction, "isFunction");
        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }
        __name(isInteger, "isInteger");
        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        __name(isLength, "isLength");
        function isObject(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }
        __name(isObject, "isObject");
        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }
        __name(isObjectLike, "isObjectLike");
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        __name(isMatch, "isMatch");
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        __name(isMatchWith, "isMatchWith");
        function isNaN(value) {
          return isNumber3(value) && value != +value;
        }
        __name(isNaN, "isNaN");
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error2(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        __name(isNative, "isNative");
        function isNull(value) {
          return value === null;
        }
        __name(isNull, "isNull");
        function isNil2(value) {
          return value == null;
        }
        __name(isNil2, "isNil");
        function isNumber3(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }
        __name(isNumber3, "isNumber");
        function isPlainObject(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        __name(isPlainObject, "isPlainObject");
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        __name(isSafeInteger, "isSafeInteger");
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString2(value) {
          return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        __name(isString2, "isString");
        function isSymbol(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        __name(isSymbol, "isSymbol");
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined2;
        }
        __name(isUndefined, "isUndefined");
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        __name(isWeakMap, "isWeakMap");
        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }
        __name(isWeakSet, "isWeakSet");
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });
        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString2(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }
        __name(toArray, "toArray");
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        __name(toFinite, "toFinite");
        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }
        __name(toInteger, "toInteger");
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        __name(toLength, "toLength");
        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        __name(toNumber, "toNumber");
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        __name(toPlainObject, "toPlainObject");
        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }
        __name(toSafeInteger, "toSafeInteger");
        function toString(value) {
          return value == null ? "" : baseToString(value);
        }
        __name(toString, "toString");
        var assign = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create(prototype, properties) {
          var result2 = baseCreate(prototype);
          return properties == null ? result2 : baseAssign(result2, properties);
        }
        __name(create, "create");
        var defaults = baseRest(function(object, sources) {
          object = Object2(object);
          var index = -1;
          var length = sources.length;
          var guard = length > 2 ? sources[2] : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length = 1;
          }
          while (++index < length) {
            var source = sources[index];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key = props[propsIndex];
              var value = object[key];
              if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                object[key] = source[key];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined2, customDefaultsMerge);
          return apply(mergeWith, undefined2, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        __name(findKey, "findKey");
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        __name(findLastKey, "findLastKey");
        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }
        __name(forIn, "forIn");
        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }
        __name(forInRight, "forInRight");
        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }
        __name(forOwn, "forOwn");
        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }
        __name(forOwnRight, "forOwnRight");
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        __name(functions, "functions");
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        __name(functionsIn, "functionsIn");
        function get(object, path, defaultValue) {
          var result2 = object == null ? undefined2 : baseGet(object, path);
          return result2 === undefined2 ? defaultValue : result2;
        }
        __name(get, "get");
        function has(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }
        __name(has, "has");
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }
        __name(hasIn, "hasIn");
        var invert = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty.call(result2, value)) {
            result2[value].push(key);
          } else {
            result2[value] = [key];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        __name(keys, "keys");
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        __name(keysIn, "keysIn");
        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, iteratee2(value, key, object2), value);
          });
          return result2;
        }
        __name(mapKeys, "mapKeys");
        function mapValues2(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, key, iteratee2(value, key, object2));
          });
          return result2;
        }
        __name(mapValues2, "mapValues");
        var merge = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit3 = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path) {
            path = castPath(path, object);
            isDeep || (isDeep = path.length > 1);
            return path;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length = paths.length;
          while (length--) {
            baseUnset(result2, paths[length]);
          }
          return result2;
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }
        __name(omitBy, "omitBy");
        var pick2 = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });
        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [prop];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path) {
            return predicate(value, path[0]);
          });
        }
        __name(pickBy, "pickBy");
        function result(object, path, defaultValue) {
          path = castPath(path, object);
          var index = -1, length = path.length;
          if (!length) {
            length = 1;
            object = undefined2;
          }
          while (++index < length) {
            var value = object == null ? undefined2 : object[toKey(path[index])];
            if (value === undefined2) {
              index = length;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }
        __name(result, "result");
        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }
        __name(set, "set");
        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseSet(object, path, value, customizer);
        }
        __name(setWith, "setWith");
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee2, accumulator) {
          var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject(object)) {
              accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
            return iteratee2(accumulator, value, index, object2);
          });
          return accumulator;
        }
        __name(transform, "transform");
        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }
        __name(unset, "unset");
        function update(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }
        __name(update, "update");
        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }
        __name(updateWith, "updateWith");
        function values(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }
        __name(values, "values");
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        __name(valuesIn, "valuesIn");
        function clamp(number, lower, upper) {
          if (upper === undefined2) {
            upper = lower;
            lower = undefined2;
          }
          if (upper !== undefined2) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined2) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        __name(clamp, "clamp");
        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }
        __name(inRange, "inRange");
        function random(lower, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined2;
          }
          if (floating === undefined2) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined2;
            } else if (typeof lower == "boolean") {
              floating = lower;
              lower = undefined2;
            }
          }
          if (lower === undefined2 && upper === undefined2) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined2) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        __name(random, "random");
        var camelCase = createCompounder(function(result2, word, index) {
          word = word.toLowerCase();
          return result2 + (index ? capitalize(word) : word);
        });
        function capitalize(string) {
          return upperFirst(toString(string).toLowerCase());
        }
        __name(capitalize, "capitalize");
        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }
        __name(deburr, "deburr");
        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }
        __name(endsWith, "endsWith");
        function escape(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        __name(escape, "escape");
        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }
        __name(escapeRegExp, "escapeRegExp");
        var kebabCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");
        function pad(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        __name(pad, "pad");
        function padEnd(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
        }
        __name(padEnd, "padEnd");
        function padStart(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
        }
        __name(padStart, "padStart");
        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
        }
        __name(parseInt2, "parseInt");
        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }
        __name(repeat, "repeat");
        function replace() {
          var args = arguments, string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        __name(replace, "replace");
        var snakeCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "_" : "") + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined2;
          }
          limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        __name(split, "split");
        var startCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + upperFirst(word);
        });
        function startsWith(string, target, position) {
          string = toString(string);
          position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }
        __name(startsWith, "startsWith");
        function template(string, options, guard) {
          var settings = lodash.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined2;
          }
          string = toString(string);
          options = assignInWith({}, options, settings, customDefaultsAssignIn);
          var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
          var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = hasOwnProperty.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }
        __name(template, "template");
        function toLower(value) {
          return toString(value).toLowerCase();
        }
        __name(toLower, "toLower");
        function toUpper(value) {
          return toString(value).toUpperCase();
        }
        __name(toUpper, "toUpper");
        function trim(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return baseTrim(string);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join("");
        }
        __name(trim, "trim");
        function trimEnd(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end).join("");
        }
        __name(trimEnd, "trimEnd");
        function trimStart(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join("");
        }
        __name(trimStart, "trimStart");
        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length = "length" in options ? toInteger(options.length) : length;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
          if (separator === undefined2) {
            return result2 + omission;
          }
          if (strSymbols) {
            end += result2.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index = result2.lastIndexOf(separator);
            if (index > -1) {
              result2 = result2.slice(0, index);
            }
          }
          return result2 + omission;
        }
        __name(truncate, "truncate");
        function unescape(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        __name(unescape, "unescape");
        var upperCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");
        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined2 : pattern;
          if (pattern === undefined2) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        __name(words, "words");
        var attempt = baseRest(function(func, args) {
          try {
            return apply(func, undefined2, args);
          } catch (e) {
            return isError(e) ? e : new Error2(e);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function(args) {
            var index = -1;
            while (++index < length) {
              var pair = pairs[index];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }
        __name(cond, "cond");
        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }
        __name(conforms, "conforms");
        function constant(value) {
          return function() {
            return value;
          };
        }
        __name(constant, "constant");
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        __name(defaultTo, "defaultTo");
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        __name(identity, "identity");
        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }
        __name(iteratee, "iteratee");
        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }
        __name(matches, "matches");
        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
        }
        __name(matchesProperty, "matchesProperty");
        var method = baseRest(function(path, args) {
          return function(object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path) {
            return baseInvoke(object, path, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({ "func": func, "args": arguments, "thisArg": object });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }
        __name(mixin, "mixin");
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        __name(noConflict, "noConflict");
        function noop2() {
        }
        __name(noop2, "noop");
        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function(args) {
            return baseNth(args, n);
          });
        }
        __name(nthArg, "nthArg");
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        __name(property, "property");
        function propertyOf(object) {
          return function(path) {
            return object == null ? undefined2 : baseGet(object, path);
          };
        }
        __name(propertyOf, "propertyOf");
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        __name(stubArray, "stubArray");
        function stubFalse() {
          return false;
        }
        __name(stubFalse, "stubFalse");
        function stubObject() {
          return {};
        }
        __name(stubObject, "stubObject");
        function stubString() {
          return "";
        }
        __name(stubString, "stubString");
        function stubTrue() {
          return true;
        }
        __name(stubTrue, "stubTrue");
        function times(n, iteratee2) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length, iteratee2);
          while (++index < n) {
            iteratee2(index);
          }
          return result2;
        }
        __name(times, "times");
        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
        }
        __name(toPath, "toPath");
        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }
        __name(uniqueId, "uniqueId");
        var add = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
        }
        __name(max, "max");
        function maxBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
        }
        __name(maxBy, "maxBy");
        function mean(array) {
          return baseMean(array, identity);
        }
        __name(mean, "mean");
        function meanBy(array, iteratee2) {
          return baseMean(array, getIteratee(iteratee2, 2));
        }
        __name(meanBy, "meanBy");
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
        }
        __name(min, "min");
        function minBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
        }
        __name(minBy, "minBy");
        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound("round");
        var subtract = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        __name(sum, "sum");
        function sumBy(array, iteratee2) {
          return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
        }
        __name(sumBy, "sumBy");
        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.assignIn = assignIn;
        lodash.assignInWith = assignInWith;
        lodash.assignWith = assignWith;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.castArray = castArray;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.concat = concat;
        lodash.cond = cond;
        lodash.conforms = conforms;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defaultsDeep = defaultsDeep;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.differenceBy = differenceBy;
        lodash.differenceWith = differenceWith;
        lodash.drop = drop;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatMap = flatMap;
        lodash.flatMapDeep = flatMapDeep;
        lodash.flatMapDepth = flatMapDepth;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flattenDepth = flattenDepth;
        lodash.flip = flip;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.fromPairs = fromPairs2;
        lodash.functions = functions;
        lodash.functionsIn = functionsIn;
        lodash.groupBy = groupBy2;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.intersectionBy = intersectionBy;
        lodash.intersectionWith = intersectionWith;
        lodash.invert = invert;
        lodash.invertBy = invertBy;
        lodash.invokeMap = invokeMap;
        lodash.iteratee = iteratee;
        lodash.keyBy = keyBy2;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map2;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues2;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.mergeWith = mergeWith;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.nthArg = nthArg;
        lodash.omit = omit3;
        lodash.omitBy = omitBy;
        lodash.once = once;
        lodash.orderBy = orderBy;
        lodash.over = over;
        lodash.overArgs = overArgs;
        lodash.overEvery = overEvery;
        lodash.overSome = overSome;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick2;
        lodash.pickBy = pickBy;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAll = pullAll;
        lodash.pullAllBy = pullAllBy;
        lodash.pullAllWith = pullAllWith;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rangeRight = rangeRight;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.reverse = reverse;
        lodash.sampleSize = sampleSize;
        lodash.set = set;
        lodash.setWith = setWith;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortedUniq = sortedUniq;
        lodash.sortedUniqBy = sortedUniqBy;
        lodash.split = split;
        lodash.spread = spread;
        lodash.tail = tail;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.toArray = toArray;
        lodash.toPairs = toPairs;
        lodash.toPairsIn = toPairsIn;
        lodash.toPath = toPath;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.unary = unary;
        lodash.union = union;
        lodash.unionBy = unionBy;
        lodash.unionWith = unionWith;
        lodash.uniq = uniq;
        lodash.uniqBy = uniqBy;
        lodash.uniqWith = uniqWith;
        lodash.unset = unset;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.update = update;
        lodash.updateWith = updateWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.without = without;
        lodash.words = words;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.xorBy = xorBy;
        lodash.xorWith = xorWith;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipObjectDeep = zipObjectDeep;
        lodash.zipWith = zipWith;
        lodash.entries = toPairs;
        lodash.entriesIn = toPairsIn;
        lodash.extend = assignIn;
        lodash.extendWith = assignInWith;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.ceil = ceil;
        lodash.clamp = clamp;
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.cloneDeepWith = cloneDeepWith;
        lodash.cloneWith = cloneWith;
        lodash.conformsTo = conformsTo;
        lodash.deburr = deburr;
        lodash.defaultTo = defaultTo;
        lodash.divide = divide;
        lodash.endsWith = endsWith;
        lodash.eq = eq;
        lodash.escape = escape;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.floor = floor;
        lodash.forEach = forEach2;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.get = get;
        lodash.gt = gt;
        lodash.gte = gte;
        lodash.has = has;
        lodash.hasIn = hasIn;
        lodash.head = head;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.invoke = invoke;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isArrayBuffer = isArrayBuffer;
        lodash.isArrayLike = isArrayLike;
        lodash.isArrayLikeObject = isArrayLikeObject;
        lodash.isBoolean = isBoolean;
        lodash.isBuffer = isBuffer;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isEqualWith = isEqualWith;
        lodash.isError = isError;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isInteger = isInteger;
        lodash.isLength = isLength;
        lodash.isMap = isMap;
        lodash.isMatch = isMatch;
        lodash.isMatchWith = isMatchWith;
        lodash.isNaN = isNaN;
        lodash.isNative = isNative;
        lodash.isNil = isNil2;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber3;
        lodash.isObject = isObject;
        lodash.isObjectLike = isObjectLike;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isSafeInteger = isSafeInteger;
        lodash.isSet = isSet;
        lodash.isString = isString2;
        lodash.isSymbol = isSymbol;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.isWeakMap = isWeakMap;
        lodash.isWeakSet = isWeakSet;
        lodash.join = join2;
        lodash.kebabCase = kebabCase;
        lodash.last = last3;
        lodash.lastIndexOf = lastIndexOf;
        lodash.lowerCase = lowerCase;
        lodash.lowerFirst = lowerFirst;
        lodash.lt = lt;
        lodash.lte = lte;
        lodash.max = max;
        lodash.maxBy = maxBy;
        lodash.mean = mean;
        lodash.meanBy = meanBy;
        lodash.min = min;
        lodash.minBy = minBy;
        lodash.stubArray = stubArray;
        lodash.stubFalse = stubFalse;
        lodash.stubObject = stubObject;
        lodash.stubString = stubString;
        lodash.stubTrue = stubTrue;
        lodash.multiply = multiply;
        lodash.nth = nth;
        lodash.noConflict = noConflict;
        lodash.noop = noop2;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padEnd = padEnd;
        lodash.padStart = padStart;
        lodash.parseInt = parseInt2;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.replace = replace;
        lodash.result = result;
        lodash.round = round;
        lodash.runInContext = runInContext2;
        lodash.sample = sample;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedIndexBy = sortedIndexBy;
        lodash.sortedIndexOf = sortedIndexOf;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.sortedLastIndexBy = sortedLastIndexBy;
        lodash.sortedLastIndexOf = sortedLastIndexOf;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.subtract = subtract;
        lodash.sum = sum;
        lodash.sumBy = sumBy;
        lodash.template = template;
        lodash.times = times;
        lodash.toFinite = toFinite;
        lodash.toInteger = toInteger;
        lodash.toLength = toLength;
        lodash.toLower = toLower;
        lodash.toNumber = toNumber;
        lodash.toSafeInteger = toSafeInteger;
        lodash.toString = toString;
        lodash.toUpper = toUpper;
        lodash.trim = trim;
        lodash.trimEnd = trimEnd;
        lodash.trimStart = trimStart;
        lodash.truncate = truncate;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.upperCase = upperCase;
        lodash.upperFirst = upperFirst;
        lodash.each = forEach2;
        lodash.eachRight = forEachRight;
        lodash.first = head;
        mixin(lodash, function() {
          var source = {};
          baseForOwn(lodash, function(func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), { "chain": false });
        lodash.VERSION = VERSION;
        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
          lodash[methodName].placeholder = lodash;
        });
        arrayEach(["drop", "take"], function(methodName, index) {
          LazyWrapper.prototype[methodName] = function(n) {
            n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
            var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
          var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach(["head", "last"], function(methodName, index) {
          var takeName = "take" + (index ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(["initial", "tail"], function(methodName, index) {
          var dropName = "drop" + (index ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
          if (typeof path == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end !== undefined2) {
            end = toInteger(end);
            result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
            var interceptor = /* @__PURE__ */ __name(function(value2) {
              var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
              return isTaker && chainAll ? result3[0] : result3;
            }, "interceptor");
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + "";
            if (!hasOwnProperty.call(realNames, key)) {
              realNames[key] = [];
            }
            realNames[key].push({ "name": methodName, "func": lodashFunc });
          }
        });
        realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
          "name": "wrapper",
          "func": undefined2
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.at = wrapperAt;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.next = wrapperNext;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.first = lodash.prototype.head;
        if (symIterator) {
          lodash.prototype[symIterator] = wrapperToIterator;
        }
        return lodash;
      }, "runInContext");
      var _ = runInContext();
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        root._ = _;
        define(function() {
          return _;
        });
      } else if (freeModule) {
        (freeModule.exports = _)._ = _;
        freeExports._ = _;
      } else {
        root._ = _;
      }
    }).call(exports2);
  }
});

// node_modules/uuid/lib/rng.js
var require_rng = __commonJS({
  "node_modules/uuid/lib/rng.js"(exports2, module2) {
    var crypto = require("crypto");
    module2.exports = /* @__PURE__ */ __name(function nodeRNG() {
      return crypto.randomBytes(16);
    }, "nodeRNG");
  }
});

// node_modules/uuid/lib/bytesToUuid.js
var require_bytesToUuid = __commonJS({
  "node_modules/uuid/lib/bytesToUuid.js"(exports2, module2) {
    var byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 256).toString(16).substr(1);
    }
    var i;
    function bytesToUuid(buf, offset) {
      var i2 = offset || 0;
      var bth = byteToHex;
      return [
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        "-",
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]],
        bth[buf[i2++]]
      ].join("");
    }
    __name(bytesToUuid, "bytesToUuid");
    module2.exports = bytesToUuid;
  }
});

// node_modules/uuid/v1.js
var require_v1 = __commonJS({
  "node_modules/uuid/v1.js"(exports2, module2) {
    var rng = require_rng();
    var bytesToUuid = require_bytesToUuid();
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        var seedBytes = rng();
        if (node == null) {
          node = _nodeId = [
            seedBytes[0] | 1,
            seedBytes[1],
            seedBytes[2],
            seedBytes[3],
            seedBytes[4],
            seedBytes[5]
          ];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      var msecs = options.msecs !== void 0 ? options.msecs : new Date().getTime();
      var nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i++] = tl >>> 24 & 255;
      b[i++] = tl >>> 16 & 255;
      b[i++] = tl >>> 8 & 255;
      b[i++] = tl & 255;
      var tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i++] = tmh >>> 8 & 255;
      b[i++] = tmh & 255;
      b[i++] = tmh >>> 24 & 15 | 16;
      b[i++] = tmh >>> 16 & 255;
      b[i++] = clockseq >>> 8 | 128;
      b[i++] = clockseq & 255;
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
      return buf ? buf : bytesToUuid(b);
    }
    __name(v1, "v1");
    module2.exports = v1;
  }
});

// node_modules/uuid/v4.js
var require_v4 = __commonJS({
  "node_modules/uuid/v4.js"(exports2, module2) {
    var rng = require_rng();
    var bytesToUuid = require_bytesToUuid();
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
      if (typeof options == "string") {
        buf = options === "binary" ? new Array(16) : null;
        options = null;
      }
      options = options || {};
      var rnds = options.random || (options.rng || rng)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
      return buf || bytesToUuid(rnds);
    }
    __name(v4, "v4");
    module2.exports = v4;
  }
});

// node_modules/uuid/index.js
var require_uuid = __commonJS({
  "node_modules/uuid/index.js"(exports2, module2) {
    var v1 = require_v1();
    var v4 = require_v4();
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    module2.exports = uuid;
  }
});

// ts/sql/mainWorker.ts
var import_worker_threads = __toModule(require("worker_threads"));

// ts/sql/Server.ts
var import_path = __toModule(require("path"));
var import_mkdirp = __toModule(require_mkdirp());
var import_rimraf = __toModule(require_rimraf());
var import_better_sqlite3 = __toModule(require_lib());
var import_p_props = __toModule(require_p_props());
var import_lodash5 = __toModule(require_lodash());

// ts/messages/MessageReadStatus.ts
var ReadStatus = /* @__PURE__ */ ((ReadStatus2) => {
  ReadStatus2[ReadStatus2["Unread"] = 1] = "Unread";
  ReadStatus2[ReadStatus2["Read"] = 0] = "Read";
  ReadStatus2[ReadStatus2["Viewed"] = 2] = "Viewed";
  return ReadStatus2;
})(ReadStatus || {});
var STATUS_NUMBERS = {
  [1 /* Unread */]: 0,
  [0 /* Read */]: 1,
  [2 /* Viewed */]: 2
};

// ts/types/StorageUIKeys.ts
var STORAGE_UI_KEYS = [
  "always-relay-calls",
  "audio-notification",
  "auto-download-update",
  "badge-count-muted-conversations",
  "call-ringtone-notification",
  "call-system-notification",
  "hide-menu-bar",
  "system-tray-setting",
  "incoming-call-notification",
  "notification-draw-attention",
  "notification-setting",
  "spell-check",
  "theme-setting",
  "defaultConversationColor",
  "customColors",
  "showStickerPickerHint",
  "showStickersIntroduction",
  "preferred-video-input-device",
  "preferred-audio-input-device",
  "preferred-audio-output-device",
  "preferredLeftPaneWidth",
  "preferredReactionEmoji",
  "previousAudioDeviceModule",
  "skinTone",
  "zoomFactor"
];

// ts/types/UUID.ts
var import_uuid = __toModule(require_uuid());

// ts/util/enum.ts
function makeEnumParser(enumToParse, defaultValue) {
  const enumValues = new Set(Object.values(enumToParse));
  const isEnumValue = /* @__PURE__ */ __name((value) => typeof value === "string" && enumValues.has(value), "isEnumValue");
  return (value) => isEnumValue(value) ? value : defaultValue;
}
__name(makeEnumParser, "makeEnumParser");

// ts/environment.ts
var Environment = /* @__PURE__ */ ((Environment2) => {
  Environment2["Development"] = "development";
  Environment2["Production"] = "production";
  Environment2["Staging"] = "staging";
  Environment2["Test"] = "test";
  return Environment2;
})(Environment || {});
var environment;
function getEnvironment() {
  if (environment === void 0) {
    return "production" /* Production */;
  }
  return environment;
}
__name(getEnvironment, "getEnvironment");
var parseEnvironment = makeEnumParser(Environment, "production" /* Production */);

// ts/logging/log.ts
var import_lodash = __toModule(require_lodash());

// ts/types/Logging.ts
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["Fatal"] = 60] = "Fatal";
  LogLevel2[LogLevel2["Error"] = 50] = "Error";
  LogLevel2[LogLevel2["Warn"] = 40] = "Warn";
  LogLevel2[LogLevel2["Info"] = 30] = "Info";
  LogLevel2[LogLevel2["Debug"] = 20] = "Debug";
  LogLevel2[LogLevel2["Trace"] = 10] = "Trace";
  return LogLevel2;
})(LogLevel || {});

// ts/logging/log.ts
var logAtLevel = import_lodash.noop;
var error = /* @__PURE__ */ __name((...args) => logAtLevel(LogLevel.Error, ...args), "error");
var warn = /* @__PURE__ */ __name((...args) => logAtLevel(LogLevel.Warn, ...args), "warn");

// ts/util/assert.ts
function assert(condition, message) {
  if (!condition) {
    const err = new Error(message);
    if (getEnvironment() !== Environment.Production) {
      if (getEnvironment() === Environment.Development) {
        debugger;
      }
      throw err;
    }
    error("assert failure:", err && err.stack ? err.stack : err);
  }
}
__name(assert, "assert");
function strictAssert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
__name(strictAssert, "strictAssert");
function assertSync(value) {
  return value;
}
__name(assertSync, "assertSync");

// ts/types/UUID.ts
var isValidUuid = /* @__PURE__ */ __name((value) => typeof value === "string" && /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value), "isValidUuid");
var UUID = class {
  constructor(value) {
    this.value = value;
    strictAssert(isValidUuid(value), `Invalid UUID: ${value}`);
  }
  toString() {
    return this.value;
  }
  isEqual(other) {
    return this.value === other.value;
  }
  static parse(value) {
    return new UUID(value);
  }
  static lookup(identifier) {
    const conversation = window.ConversationController.get(identifier);
    const uuid = conversation == null ? void 0 : conversation.get("uuid");
    if (uuid === void 0) {
      return void 0;
    }
    return new UUID(uuid);
  }
  static checkedLookup(identifier) {
    const uuid = UUID.lookup(identifier);
    strictAssert(uuid !== void 0, `Conversation ${identifier} not found or has no uuid`);
    return uuid;
  }
  static generate() {
    return new UUID((0, import_uuid.v4)());
  }
  static cast(value) {
    return new UUID(value.toLowerCase()).toString();
  }
  static fromPrefix(value) {
    let padded = value;
    while (padded.length < 8) {
      padded += "0";
    }
    return new UUID(`${padded}-0000-4000-8000-${"0".repeat(12)}`);
  }
};
__name(UUID, "UUID");

// ts/util/combineNames.ts
var CJK_Compatibility = /[\u3300-\u33FF]/;
var CJK_Compatibility_Forms = /[\uFE30-\uFE4F]/;
var CJK_Compatibility_Ideographs = /[\uF900-\uFAFF]/;
var CJK_Compatibility_Ideographs_Supplement = /\uD87E[\uDC00-\uDE1F]/;
var CJK_Radicals_Supplement = /[\u2E80-\u2EFF]/;
var CJK_Strokes = /[\u31C0-\u31EF]/;
var CJK_Symbols_And_Punctuation = /[\u3000-\u303F]/;
var CJK_Unified_Ideographs = /[\u4E00-\u9FFF]/;
var CJK_Unified_Ideographs_Extension_A = /[\u3400-\u4DBF]/;
var CJK_Unified_Ideographs_Extension_B = /[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF]/;
var CJK_Unified_Ideographs_Extension_C = /\uD869[\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF3F]/;
var CJK_Unified_Ideographs_Extension_D = /\uD86D[\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1F]/;
var CJK_Unified_Ideographs_Extension_E = /\uD86E[\uDC20-\uDFFF]|[\uD86F-\uD872][\uDC00-\uDFFF]|\uD873[\uDC00-\uDEAF]/;
var Enclosed_CJK_Letters_And_Months = /[\u3200-\u32FF]/;
var Kangxi_Radicals = /[\u2F00-\u2FDF]/;
var Ideographic_Description_Characters = /[\u2FF0-\u2FFF]/;
var Hiragana = /[\u3040-\u309F]/;
var Katakana = /[\u30A0-\u30FF]/;
var Katakana_Phonetic_Extensions = /[\u31F0-\u31FF]/;
var Hangul_Compatibility_Jamo = /[\u3130-\u318F]/;
var Hangul_Jamo = /[\u1100-\u11FF]/;
var Hangul_Jamo_Extended_A = /[\uA960-\uA97F]/;
var Hangul_Jamo_Extended_B = /[\uD7B0-\uD7FF]/;
var Hangul_Syllables = /[\uAC00-\uD7AF]/;
var isIdeographic = /[\u3006\u3007\u3021-\u3029\u3038-\u303A\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD821[\uDC00-\uDFF7]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDD70-\uDEFB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
function combineNames(given, family) {
  if (!given) {
    return void 0;
  }
  if (!family) {
    return given;
  }
  if (isAllCKJV(family) && isAllCKJV(given)) {
    return `${family}${given}`;
  }
  return `${given} ${family}`;
}
__name(combineNames, "combineNames");
function isAllCKJV(name) {
  for (const codePoint of name) {
    if (!isCKJV(codePoint)) {
      return false;
    }
  }
  return true;
}
__name(isAllCKJV, "isAllCKJV");
function isCKJV(codePoint) {
  if (codePoint === " ") {
    return true;
  }
  return CJK_Compatibility.test(codePoint) || CJK_Compatibility_Forms.test(codePoint) || CJK_Compatibility_Ideographs.test(codePoint) || CJK_Compatibility_Ideographs_Supplement.test(codePoint) || CJK_Radicals_Supplement.test(codePoint) || CJK_Strokes.test(codePoint) || CJK_Symbols_And_Punctuation.test(codePoint) || CJK_Unified_Ideographs.test(codePoint) || CJK_Unified_Ideographs_Extension_A.test(codePoint) || CJK_Unified_Ideographs_Extension_B.test(codePoint) || CJK_Unified_Ideographs_Extension_C.test(codePoint) || CJK_Unified_Ideographs_Extension_D.test(codePoint) || CJK_Unified_Ideographs_Extension_E.test(codePoint) || Enclosed_CJK_Letters_And_Months.test(codePoint) || Kangxi_Radicals.test(codePoint) || Ideographic_Description_Characters.test(codePoint) || Hiragana.test(codePoint) || Katakana.test(codePoint) || Katakana_Phonetic_Extensions.test(codePoint) || Hangul_Compatibility_Jamo.test(codePoint) || Hangul_Jamo.test(codePoint) || Hangul_Jamo_Extended_A.test(codePoint) || Hangul_Jamo_Extended_B.test(codePoint) || Hangul_Syllables.test(codePoint) || isIdeographic.test(codePoint);
}
__name(isCKJV, "isCKJV");

// ts/util/consoleLogger.ts
var consoleLogger = {
  fatal(...args) {
    console.error(...args);
  },
  error(...args) {
    console.error(...args);
  },
  warn(...args) {
    console.warn(...args);
  },
  info(...args) {
    console.info(...args);
  },
  debug(...args) {
    console.debug(...args);
  },
  trace(...args) {
    console.log(...args);
  }
};

// ts/util/dropNull.ts
function dropNull(value) {
  if (value === null) {
    return void 0;
  }
  return value;
}
__name(dropNull, "dropNull");

// ts/util/isNormalNumber.ts
function isNormalNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
}
__name(isNormalNumber, "isNormalNumber");

// ts/util/isNotNil.ts
function isNotNil(value) {
  if (value === null || value === void 0) {
    return false;
  }
  return true;
}
__name(isNotNil, "isNotNil");

// ts/util/reallyJsonStringify.ts
function reallyJsonStringify(value) {
  let result;
  try {
    result = JSON.stringify(value);
  } catch (_err) {
    result = void 0;
  }
  return typeof result === "string" ? result : Object.prototype.toString.call(value);
}
__name(reallyJsonStringify, "reallyJsonStringify");

// ts/util/missingCaseError.ts
var missingCaseError = /* @__PURE__ */ __name((x) => new TypeError(`Unhandled case: ${reallyJsonStringify(x)}`), "missingCaseError");

// ts/util/parseIntOrThrow.ts
function parseIntOrThrow(value, message) {
  let result;
  switch (typeof value) {
    case "number":
      result = value;
      break;
    case "string":
      result = parseInt(value, 10);
      break;
    default:
      result = NaN;
      break;
  }
  if (!Number.isInteger(result)) {
    throw new Error(message);
  }
  return result;
}
__name(parseIntOrThrow, "parseIntOrThrow");

// ts/util/durations.ts
var SECOND = 1e3;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;

// ts/logging/formatCountForLogging.ts
var formatCountForLogging = /* @__PURE__ */ __name((count) => {
  if (count === 0 || Number.isNaN(count)) {
    return String(count);
  }
  return `at least ${10 ** Math.floor(Math.log10(count))}`;
}, "formatCountForLogging");

// ts/types/Calling.ts
var ProcessGroupCallRingRequestResult = /* @__PURE__ */ ((ProcessGroupCallRingRequestResult2) => {
  ProcessGroupCallRingRequestResult2[ProcessGroupCallRingRequestResult2["ShouldRing"] = 0] = "ShouldRing";
  ProcessGroupCallRingRequestResult2[ProcessGroupCallRingRequestResult2["RingWasPreviouslyCanceled"] = 1] = "RingWasPreviouslyCanceled";
  ProcessGroupCallRingRequestResult2[ProcessGroupCallRingRequestResult2["ThereIsAnotherActiveRing"] = 2] = "ThereIsAnotherActiveRing";
  return ProcessGroupCallRingRequestResult2;
})(ProcessGroupCallRingRequestResult || {});

// ts/types/RemoveAllConfiguration.ts
var RemoveAllConfiguration = /* @__PURE__ */ ((RemoveAllConfiguration2) => {
  RemoveAllConfiguration2["Full"] = "Full";
  RemoveAllConfiguration2["Soft"] = "Soft";
  return RemoveAllConfiguration2;
})(RemoveAllConfiguration || {});

// ts/badges/BadgeCategory.ts
var BadgeCategory = /* @__PURE__ */ ((BadgeCategory2) => {
  BadgeCategory2["Donor"] = "donor";
  BadgeCategory2["Other"] = "other";
  return BadgeCategory2;
})(BadgeCategory || {});
var parseBadgeCategory = makeEnumParser(BadgeCategory, "other" /* Other */);

// ts/badges/BadgeImageTheme.ts
var BadgeImageTheme = /* @__PURE__ */ ((BadgeImageTheme2) => {
  BadgeImageTheme2["Light"] = "light";
  BadgeImageTheme2["Dark"] = "dark";
  BadgeImageTheme2["Transparent"] = "transparent";
  return BadgeImageTheme2;
})(BadgeImageTheme || {});
var parseBadgeImageTheme = makeEnumParser(BadgeImageTheme, "transparent" /* Transparent */);

// ts/sql/util.ts
var import_lodash2 = __toModule(require_lodash());
var MAX_VARIABLE_COUNT = 100;
function objectToJSON(data) {
  return JSON.stringify(data);
}
__name(objectToJSON, "objectToJSON");
function jsonToObject(json) {
  return JSON.parse(json);
}
__name(jsonToObject, "jsonToObject");
function getSQLiteVersion(db) {
  const { sqlite_version: version } = db.prepare("select sqlite_version() AS sqlite_version").get();
  return version;
}
__name(getSQLiteVersion, "getSQLiteVersion");
function getSchemaVersion(db) {
  return db.pragma("schema_version", { simple: true });
}
__name(getSchemaVersion, "getSchemaVersion");
function setUserVersion(db, version) {
  if (!(0, import_lodash2.isNumber)(version)) {
    throw new Error(`setUserVersion: version ${version} is not a number`);
  }
  db.pragma(`user_version = ${version}`);
}
__name(setUserVersion, "setUserVersion");
function getUserVersion(db) {
  return db.pragma("user_version", { simple: true });
}
__name(getUserVersion, "getUserVersion");
function getSQLCipherVersion(db) {
  return db.pragma("cipher_version", { simple: true });
}
__name(getSQLCipherVersion, "getSQLCipherVersion");
function batchMultiVarQuery(db, values, query) {
  if (values.length > MAX_VARIABLE_COUNT) {
    const result2 = [];
    db.transaction(() => {
      for (let i = 0; i < values.length; i += MAX_VARIABLE_COUNT) {
        const batch = values.slice(i, i + MAX_VARIABLE_COUNT);
        const batchResult = query(batch);
        if (Array.isArray(batchResult)) {
          result2.push(...batchResult);
        }
      }
    })();
    return result2;
  }
  const result = query(values);
  return Array.isArray(result) ? result : [];
}
__name(batchMultiVarQuery, "batchMultiVarQuery");
function createOrUpdate(db, table, data) {
  const { id } = data;
  if (!id) {
    throw new Error("createOrUpdate: Provided data did not have a truthy id");
  }
  db.prepare(`
    INSERT OR REPLACE INTO ${table} (
      id,
      json
    ) values (
      $id,
      $json
    )
    `).run({
    id,
    json: objectToJSON(data)
  });
}
__name(createOrUpdate, "createOrUpdate");
function bulkAdd(db, table, array) {
  db.transaction(() => {
    for (const data of array) {
      createOrUpdate(db, table, data);
    }
  })();
}
__name(bulkAdd, "bulkAdd");
function getById(db, table, id) {
  const row = db.prepare(`
      SELECT *
      FROM ${table}
      WHERE id = $id;
      `).get({
    id
  });
  if (!row) {
    return void 0;
  }
  return jsonToObject(row.json);
}
__name(getById, "getById");
function removeById(db, table, id) {
  if (!Array.isArray(id)) {
    db.prepare(`
      DELETE FROM ${table}
      WHERE id = $id;
      `).run({ id });
    return;
  }
  if (!id.length) {
    throw new Error("removeById: No ids to delete!");
  }
  const removeByIdsSync = /* @__PURE__ */ __name((ids) => {
    db.prepare(`
      DELETE FROM ${table}
      WHERE id IN ( ${id.map(() => "?").join(", ")} );
      `).run(ids);
  }, "removeByIdsSync");
  batchMultiVarQuery(db, id, removeByIdsSync);
}
__name(removeById, "removeById");
function removeAllFromTable(db, table) {
  db.prepare(`DELETE FROM ${table};`).run();
}
__name(removeAllFromTable, "removeAllFromTable");
function getAllFromTable(db, table) {
  const rows = db.prepare(`SELECT json FROM ${table};`).all();
  return rows.map((row) => jsonToObject(row.json));
}
__name(getAllFromTable, "getAllFromTable");
function getCountFromTable(db, table) {
  const result = db.prepare(`SELECT count(*) from ${table};`).pluck(true).get();
  if ((0, import_lodash2.isNumber)(result)) {
    return result;
  }
  throw new Error(`getCountFromTable: Unable to get count from table ${table}`);
}
__name(getCountFromTable, "getCountFromTable");
var TableIterator = class {
  constructor(db, table, pageSize = 500) {
    this.db = db;
    this.table = table;
    this.pageSize = pageSize;
  }
  *[Symbol.iterator]() {
    const fetchObject = this.db.prepare(`
        SELECT json FROM ${this.table}
        WHERE id > $id
        ORDER BY id ASC
        LIMIT $pageSize;
      `);
    let complete = false;
    let id = "";
    while (!complete) {
      const rows = fetchObject.all({
        id,
        pageSize: this.pageSize
      });
      const messages = rows.map((row) => jsonToObject(row.json));
      yield* messages;
      const lastMessage = (0, import_lodash2.last)(messages);
      if (lastMessage) {
        ({ id } = lastMessage);
      }
      complete = messages.length < this.pageSize;
    }
  }
};
__name(TableIterator, "TableIterator");

// ts/sql/migrations/index.ts
var import_lodash4 = __toModule(require_lodash());

// ts/textsecure/Helpers.ts
var arrayBuffer = new ArrayBuffer(0);
var uint8Array = new Uint8Array();
var StaticArrayBufferProto = arrayBuffer.__proto__;
var StaticUint8ArrayProto = uint8Array.__proto__;
function getString(thing) {
  if (thing === Object(thing)) {
    if (thing.__proto__ === StaticUint8ArrayProto) {
      return String.fromCharCode.apply(null, thing);
    }
    if (thing.__proto__ === StaticArrayBufferProto) {
      return getString(new Uint8Array(thing));
    }
  }
  return thing;
}
__name(getString, "getString");
function getStringable(thing) {
  return typeof thing === "string" || typeof thing === "number" || typeof thing === "boolean" || thing === Object(thing) && (thing.__proto__ === StaticArrayBufferProto || thing.__proto__ === StaticUint8ArrayProto);
}
__name(getStringable, "getStringable");
function ensureStringed(thing) {
  if (getStringable(thing)) {
    return getString(thing);
  }
  if (thing instanceof Array) {
    const res = [];
    for (let i = 0; i < thing.length; i += 1) {
      res[i] = ensureStringed(thing[i]);
    }
    return res;
  }
  if (thing === Object(thing)) {
    const res = {};
    for (const key in thing) {
      res[key] = ensureStringed(thing[key]);
    }
    return res;
  }
  if (thing === null) {
    return null;
  }
  throw new Error(`unsure of how to jsonify object of type ${typeof thing}`);
}
__name(ensureStringed, "ensureStringed");
var utils = {
  getString,
  isNumberSane: (number) => number[0] === "+" && /^[0-9]+$/.test(number.substring(1)),
  jsonThing: (thing) => JSON.stringify(ensureStringed(thing)),
  unencodeNumber: (number) => number.split(".")
};
var Helpers_default = utils;

// ts/sql/migrations/41-uuid-keys.ts
function getOurUuid(db) {
  const UUID_ID = "uuid_id";
  const row = db.prepare("SELECT json FROM items WHERE id = $id;").get({ id: UUID_ID });
  if (!row) {
    return void 0;
  }
  const { value } = JSON.parse(row.json);
  const [ourUuid] = Helpers_default.unencodeNumber(String(value).toLowerCase());
  return ourUuid;
}
__name(getOurUuid, "getOurUuid");
function updateToSchemaVersion41(currentVersion, db, logger3) {
  if (currentVersion >= 41) {
    return;
  }
  const getConversationUuid = db.prepare(`
      SELECT uuid
      FROM
        conversations
      WHERE
        id = $conversationId
      `).pluck();
  const getConversationStats = db.prepare(`
      SELECT uuid, e164, active_at
      FROM
        conversations
      WHERE
        id = $conversationId
    `);
  const compareConvoRecency = /* @__PURE__ */ __name((a, b) => {
    const aStats = getConversationStats.get({ conversationId: a });
    const bStats = getConversationStats.get({ conversationId: b });
    const isAComplete = Boolean((aStats == null ? void 0 : aStats.uuid) && (aStats == null ? void 0 : aStats.e164));
    const isBComplete = Boolean((bStats == null ? void 0 : bStats.uuid) && (bStats == null ? void 0 : bStats.e164));
    if (!isAComplete && !isBComplete) {
      return 0;
    }
    if (!isAComplete) {
      return -1;
    }
    if (!isBComplete) {
      return 1;
    }
    return aStats.active_at - bStats.active_at;
  }, "compareConvoRecency");
  const clearSessionsAndKeys = /* @__PURE__ */ __name(() => {
    const keyCount = [
      db.prepare("DELETE FROM senderKeys").run().changes,
      db.prepare("DELETE FROM sessions").run().changes,
      db.prepare("DELETE FROM signedPreKeys").run().changes,
      db.prepare("DELETE FROM preKeys").run().changes
    ].reduce((a, b) => a + b);
    assertSync(removeById(db, "items", "identityKey"));
    assertSync(removeById(db, "items", "registrationId"));
    return keyCount;
  }, "clearSessionsAndKeys");
  const moveIdentityKeyToMap = /* @__PURE__ */ __name((ourUuid) => {
    const identityKey = assertSync(getById(db, "items", "identityKey"));
    const registrationId = assertSync(getById(db, "items", "registrationId"));
    if (identityKey) {
      assertSync(createOrUpdate(db, "items", {
        id: "identityKeyMap",
        value: {
          [ourUuid]: identityKey.value
        }
      }));
    }
    if (registrationId) {
      assertSync(createOrUpdate(db, "items", {
        id: "registrationIdMap",
        value: {
          [ourUuid]: registrationId.value
        }
      }));
    }
    db.exec(`
      DELETE FROM items WHERE id = "identityKey" OR id = "registrationId";
      `);
  }, "moveIdentityKeyToMap");
  const prefixKeys = /* @__PURE__ */ __name((ourUuid) => {
    for (const table of ["signedPreKeys", "preKeys"]) {
      db.prepare(`
        UPDATE ${table}
        SET
          id = $ourUuid || ':' || id,
          json = json_set(
            json,
            '$.id',
            $ourUuid || ':' || json_extract(json, '$.id'),
            '$.keyId',
            json_extract(json, '$.id'),
            '$.ourUuid',
            $ourUuid
          )
        `).run({ ourUuid });
    }
  }, "prefixKeys");
  const updateSenderKeys = /* @__PURE__ */ __name((ourUuid) => {
    const senderKeys = db.prepare("SELECT id, senderId, lastUpdatedDate FROM senderKeys").all();
    logger3.info(`Updating ${senderKeys.length} sender keys`);
    const updateSenderKey = db.prepare(`
      UPDATE senderKeys
      SET
        id = $newId,
        senderId = $newSenderId
      WHERE
        id = $id
      `);
    const deleteSenderKey = db.prepare("DELETE FROM senderKeys WHERE id = $id");
    const pastKeys = /* @__PURE__ */ new Map();
    let updated = 0;
    let deleted = 0;
    let skipped = 0;
    for (const { id, senderId, lastUpdatedDate } of senderKeys) {
      const [conversationId] = Helpers_default.unencodeNumber(senderId);
      const uuid = getConversationUuid.get({ conversationId });
      if (!uuid) {
        deleted += 1;
        deleteSenderKey.run({ id });
        continue;
      }
      const newId = `${ourUuid}:${id.replace(conversationId, uuid)}`;
      const existing = pastKeys.get(newId);
      if (existing) {
        skipped += 1;
      } else {
        updated += 1;
      }
      const isOlder = existing && (lastUpdatedDate < existing.lastUpdatedDate || compareConvoRecency(conversationId, existing.conversationId) < 0);
      if (isOlder) {
        deleteSenderKey.run({ id });
        continue;
      } else if (existing) {
        deleteSenderKey.run({ id: newId });
      }
      pastKeys.set(newId, { conversationId, lastUpdatedDate });
      updateSenderKey.run({
        id,
        newId,
        newSenderId: `${senderId.replace(conversationId, uuid)}`
      });
    }
    logger3.info(`Updated ${senderKeys.length} sender keys: updated: ${updated}, deleted: ${deleted}, skipped: ${skipped}`);
  }, "updateSenderKeys");
  const updateSessions = /* @__PURE__ */ __name((ourUuid) => {
    const allSessions = db.prepare("SELECT id, conversationId FROM SESSIONS").all();
    logger3.info(`Updating ${allSessions.length} sessions`);
    const updateSession = db.prepare(`
      UPDATE sessions
      SET
        id = $newId,
        ourUuid = $ourUuid,
        uuid = $uuid,
        json = json_set(
          sessions.json,
          '$.id',
          $newId,
          '$.uuid',
          $uuid,
          '$.ourUuid',
          $ourUuid
        )
      WHERE
        id = $id
      `);
    const deleteSession = db.prepare("DELETE FROM sessions WHERE id = $id");
    const pastSessions = /* @__PURE__ */ new Map();
    let updated = 0;
    let deleted = 0;
    let skipped = 0;
    for (const { id, conversationId } of allSessions) {
      const uuid = getConversationUuid.get({ conversationId });
      if (!uuid) {
        deleted += 1;
        deleteSession.run({ id });
        continue;
      }
      const newId = `${ourUuid}:${id.replace(conversationId, uuid)}`;
      const existing = pastSessions.get(newId);
      if (existing) {
        skipped += 1;
      } else {
        updated += 1;
      }
      const isOlder = existing && compareConvoRecency(conversationId, existing.conversationId) < 0;
      if (isOlder) {
        deleteSession.run({ id });
        continue;
      } else if (existing) {
        deleteSession.run({ id: newId });
      }
      pastSessions.set(newId, { conversationId });
      updateSession.run({
        id,
        newId,
        uuid,
        ourUuid
      });
    }
    logger3.info(`Updated ${allSessions.length} sessions: updated: ${updated}, deleted: ${deleted}, skipped: ${skipped}`);
  }, "updateSessions");
  const updateIdentityKeys = /* @__PURE__ */ __name(() => {
    const identityKeys = db.prepare("SELECT id FROM identityKeys").all();
    logger3.info(`Updating ${identityKeys.length} identity keys`);
    const updateIdentityKey = db.prepare(`
      UPDATE identityKeys
      SET
        id = $newId,
        json = json_set(
          identityKeys.json,
          '$.id',
          $newId
        )
      WHERE
        id = $id
      `);
    let migrated = 0;
    for (const { id } of identityKeys) {
      const uuid = getConversationUuid.get({ conversationId: id });
      let newId;
      if (uuid) {
        migrated += 1;
        newId = uuid;
      } else {
        newId = `conversation:${id}`;
      }
      updateIdentityKey.run({ id, newId });
    }
    logger3.info(`Migrated ${migrated} identity keys`);
  }, "updateIdentityKeys");
  db.transaction(() => {
    db.exec(`
      -- Change type of 'id' column from INTEGER to STRING

      ALTER TABLE preKeys
      RENAME TO old_preKeys;

      ALTER TABLE signedPreKeys
      RENAME TO old_signedPreKeys;

      CREATE TABLE preKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE signedPreKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );

      -- sqlite handles the type conversion
      INSERT INTO preKeys SELECT * FROM old_preKeys;
      INSERT INTO signedPreKeys SELECT * FROM old_signedPreKeys;

      DROP TABLE old_preKeys;
      DROP TABLE old_signedPreKeys;

      -- Alter sessions

      ALTER TABLE sessions
        ADD COLUMN ourUuid STRING;

      ALTER TABLE sessions
        ADD COLUMN uuid STRING;
      `);
    const ourUuid = getOurUuid(db);
    if (!isValidUuid(ourUuid)) {
      const deleteCount = clearSessionsAndKeys();
      if (deleteCount > 0) {
        logger3.error(`updateToSchemaVersion41: no uuid is available, erased ${deleteCount} sessions/keys`);
      }
      db.pragma("user_version = 41");
      return;
    }
    prefixKeys(ourUuid);
    updateSenderKeys(ourUuid);
    updateSessions(ourUuid);
    moveIdentityKeyToMap(ourUuid);
    updateIdentityKeys();
    db.pragma("user_version = 41");
  })();
  logger3.info("updateToSchemaVersion41: success!");
}
__name(updateToSchemaVersion41, "updateToSchemaVersion41");

// ts/sql/migrations/42-stale-reactions.ts
function updateToSchemaVersion42(currentVersion, db, logger3) {
  if (currentVersion >= 42) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP TRIGGER messages_on_delete;

      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        DELETE FROM sendLogPayloads WHERE id IN (
          SELECT payloadId FROM sendLogMessageIds
          WHERE messageId = old.id
        );
        DELETE FROM reactions WHERE rowid IN (
          SELECT rowid FROM reactions
          WHERE messageId = old.id
        );
      END;
    `);
    const messageIdList = db.prepare("SELECT id FROM messages ORDER BY id ASC;").pluck().all();
    const allReactions = db.prepare("SELECT rowid, messageId FROM reactions;").all();
    const messageIds = new Set(messageIdList);
    const reactionsToDelete = [];
    allReactions.forEach((reaction) => {
      if (!messageIds.has(reaction.messageId)) {
        reactionsToDelete.push(reaction.rowid);
      }
    });
    function deleteReactions(rowids) {
      db.prepare(`
        DELETE FROM reactions
        WHERE rowid IN ( ${rowids.map(() => "?").join(", ")} );
        `).run(rowids);
    }
    __name(deleteReactions, "deleteReactions");
    if (reactionsToDelete.length > 0) {
      logger3.info(`Deleting ${reactionsToDelete.length} orphaned reactions`);
      batchMultiVarQuery(db, reactionsToDelete, deleteReactions);
    }
    db.pragma("user_version = 42");
  })();
  logger3.info("updateToSchemaVersion42: success!");
}
__name(updateToSchemaVersion42, "updateToSchemaVersion42");

// ts/sql/migrations/43-gv2-uuid.ts
var import_lodash3 = __toModule(require_lodash());
function updateToSchemaVersion43(currentVersion, db, logger3) {
  if (currentVersion >= 43) {
    return;
  }
  const getConversationUuid = db.prepare(`
      SELECT uuid
      FROM
        conversations
      WHERE
        id = $conversationId
      `).pluck();
  const updateConversationStmt = db.prepare(`
    UPDATE conversations SET
      json = $json,
      members = $members
    WHERE id = $id;
    `);
  const updateMessageStmt = db.prepare(`
    UPDATE messages SET
      json = $json,
      sourceUuid = $sourceUuid
    WHERE id = $id;
    `);
  const upgradeConversation = /* @__PURE__ */ __name((convo) => {
    const legacy = convo;
    let result = convo;
    const logId = `(${legacy.id}) groupv2(${legacy.groupId})`;
    const memberKeys = [
      "membersV2",
      "pendingMembersV2",
      "pendingAdminApprovalV2"
    ];
    for (const key of memberKeys) {
      const oldValue = legacy[key];
      if (!Array.isArray(oldValue)) {
        continue;
      }
      let addedByCount = 0;
      const newValue = oldValue.map((member) => {
        const uuid = getConversationUuid.get({
          conversationId: member.conversationId
        });
        if (!uuid) {
          logger3.warn(`updateToSchemaVersion43: ${logId}.${key} UUID not found for ${member.conversationId}`);
          return void 0;
        }
        const updated = __spreadProps(__spreadValues({}, (0, import_lodash3.omit)(member, "conversationId")), {
          uuid
        });
        if (!("addedByUserId" in member) || !member.addedByUserId) {
          return updated;
        }
        const addedByUserId = getConversationUuid.get({
          conversationId: member.addedByUserId
        });
        if (!addedByUserId) {
          return updated;
        }
        addedByCount += 1;
        return __spreadProps(__spreadValues({}, updated), {
          addedByUserId
        });
      }).filter(isNotNil);
      result = __spreadProps(__spreadValues({}, result), {
        [key]: newValue
      });
      if (oldValue.length !== 0) {
        logger3.info(`updateToSchemaVersion43: migrated ${oldValue.length} ${key} entries to ${newValue.length} for ${logId}`);
      }
      if (addedByCount > 0) {
        logger3.info(`updateToSchemaVersion43: migrated ${addedByCount} addedByUserId in ${key} for ${logId}`);
      }
    }
    if (result === convo) {
      return;
    }
    let dbMembers;
    if (result.membersV2) {
      dbMembers = result.membersV2.map((item) => item.uuid).join(" ");
    } else if (result.members) {
      dbMembers = result.members.join(" ");
    } else {
      dbMembers = null;
    }
    updateConversationStmt.run({
      id: result.id,
      json: objectToJSON(result),
      members: dbMembers
    });
  }, "upgradeConversation");
  const upgradeMessage = /* @__PURE__ */ __name((message) => {
    const { id, groupV2Change, sourceUuid, invitedGV2Members } = message;
    let result = message;
    if (groupV2Change) {
      assert(result.groupV2Change, "Pacify typescript");
      const from = getConversationUuid.get({
        conversationId: groupV2Change.from
      });
      if (from) {
        result = __spreadProps(__spreadValues({}, result), {
          groupV2Change: __spreadProps(__spreadValues({}, result.groupV2Change), {
            from
          })
        });
      } else {
        result = __spreadProps(__spreadValues({}, result), {
          groupV2Change: (0, import_lodash3.omit)(result.groupV2Change, ["from"])
        });
      }
      let changedDetails = false;
      const details = groupV2Change.details.map((legacyDetail, i) => {
        var _a;
        const oldDetail = (_a = result.groupV2Change) == null ? void 0 : _a.details[i];
        assert(oldDetail, "Pacify typescript");
        let newDetail = oldDetail;
        for (const key of ["conversationId", "inviter"]) {
          const oldValue = legacyDetail[key];
          const newKey = key === "conversationId" ? "uuid" : key;
          if (oldValue === void 0) {
            continue;
          }
          changedDetails = true;
          const newValue = getConversationUuid.get({
            conversationId: oldValue
          });
          if (key === "inviter" && !newValue) {
            continue;
          }
          if (!newValue) {
            logger3.warn(`updateToSchemaVersion43: ${id}.groupV2Change.details.${key} UUID not found for ${oldValue}`);
            return void 0;
          }
          assert(newDetail.type === legacyDetail.type, "Pacify typescript");
          newDetail = __spreadProps(__spreadValues({}, (0, import_lodash3.omit)(newDetail, key)), {
            [newKey]: newValue
          });
        }
        return newDetail;
      }).filter(isNotNil);
      if (changedDetails) {
        result = __spreadProps(__spreadValues({}, result), {
          groupV2Change: __spreadProps(__spreadValues({}, result.groupV2Change), {
            details
          })
        });
      }
    }
    if (sourceUuid) {
      const newValue = getConversationUuid.get({
        conversationId: sourceUuid
      });
      if (newValue) {
        result = __spreadProps(__spreadValues({}, result), {
          sourceUuid: newValue
        });
      }
    }
    if (invitedGV2Members) {
      const newMembers = invitedGV2Members.map(({ addedByUserId, conversationId }, i) => {
        const uuid = getConversationUuid.get({
          conversationId
        });
        const oldMember = result.invitedGV2Members && result.invitedGV2Members[i];
        assert(oldMember !== void 0, "Pacify typescript");
        if (!uuid) {
          logger3.warn(`updateToSchemaVersion43: ${id}.invitedGV2Members UUID not found for ${conversationId}`);
          return void 0;
        }
        const newMember = __spreadProps(__spreadValues({}, (0, import_lodash3.omit)(oldMember, ["conversationId"])), {
          uuid
        });
        if (!addedByUserId) {
          return newMember;
        }
        const newAddedBy = getConversationUuid.get({
          conversationId: addedByUserId
        });
        if (!newAddedBy) {
          return newMember;
        }
        return __spreadProps(__spreadValues({}, newMember), {
          addedByUserId: newAddedBy
        });
      }).filter(isNotNil);
      result = __spreadProps(__spreadValues({}, result), {
        invitedGV2Members: newMembers
      });
    }
    if (result === message) {
      return false;
    }
    updateMessageStmt.run({
      id: result.id,
      json: JSON.stringify(result),
      sourceUuid: result.sourceUuid ?? null
    });
    return true;
  }, "upgradeMessage");
  db.transaction(() => {
    const allConversations = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations
      ORDER BY id ASC;
      `).all().map(({ json }) => jsonToObject(json));
    logger3.info(`updateToSchemaVersion43: About to iterate through ${allConversations.length} conversations`);
    for (const convo of allConversations) {
      upgradeConversation(convo);
    }
    const messageCount = getCountFromTable(db, "messages");
    logger3.info(`updateToSchemaVersion43: About to iterate through ${messageCount} messages`);
    let updatedCount = 0;
    for (const message of new TableIterator(db, "messages")) {
      if (upgradeMessage(message)) {
        updatedCount += 1;
      }
    }
    logger3.info(`updateToSchemaVersion43: Updated ${updatedCount} messages`);
    db.pragma("user_version = 43");
  })();
  logger3.info("updateToSchemaVersion43: success!");
}
__name(updateToSchemaVersion43, "updateToSchemaVersion43");

// ts/sql/migrations/44-badges.ts
function updateToSchemaVersion44(currentVersion, db, logger3) {
  if (currentVersion >= 44) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE badges(
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        descriptionTemplate TEXT NOT NULL
      );

      CREATE TABLE badgeImageFiles(
        badgeId TEXT REFERENCES badges(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        'order' INTEGER NOT NULL,
        url TEXT NOT NULL,
        localPath TEXT,
        theme TEXT NOT NULL
      );
      `);
    db.pragma("user_version = 44");
  })();
  logger3.info("updateToSchemaVersion44: success!");
}
__name(updateToSchemaVersion44, "updateToSchemaVersion44");

// ts/sql/migrations/45-stories.ts
function updateToSchemaVersion45(currentVersion, db, logger3) {
  if (currentVersion >= 45) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      --- Add column to messages table

      ALTER TABLE messages ADD COLUMN storyId STRING;

      --- Update important message indices

      DROP INDEX   messages_conversation;
      CREATE INDEX messages_conversation ON messages
        (conversationId, type, storyId, received_at);

      DROP INDEX   messages_unread;
      CREATE INDEX messages_unread ON messages
        (conversationId, readStatus, type, storyId) WHERE readStatus IS NOT NULL;

      --- Update attachment indices for All Media views

      DROP INDEX   messages_hasAttachments;
      CREATE INDEX messages_hasAttachments
        ON messages (conversationId, hasAttachments, received_at)
        WHERE type IS NOT 'story' AND storyId IS NULL;

      DROP INDEX   messages_hasFileAttachments;
      CREATE INDEX messages_hasFileAttachments
        ON messages (conversationId, hasFileAttachments, received_at)
        WHERE type IS NOT 'story' AND storyId IS NULL;

      DROP INDEX   messages_hasVisualMediaAttachments;
      CREATE INDEX messages_hasVisualMediaAttachments
        ON messages (conversationId, hasVisualMediaAttachments, received_at)
        WHERE type IS NOT 'story' AND storyId IS NULL;

      --- Message insert/update triggers to exclude stories and story replies

      DROP   TRIGGER messages_on_insert;
      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NOT 1 AND new.storyId IS NULL
      BEGIN
        INSERT INTO messages_fts
          (rowid, body)
        VALUES
          (new.rowid, new.body);
      END;

      DROP   TRIGGER messages_on_update;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN
        (new.body IS NULL OR old.body IS NOT new.body) AND
         new.isViewOnce IS NOT 1 AND new.storyId IS NULL
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
          (rowid, body)
        VALUES
          (new.rowid, new.body);
      END;

      --- Update delete trigger to remove storyReads

      DROP   TRIGGER messages_on_delete;
      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        DELETE FROM sendLogPayloads WHERE id IN (
          SELECT payloadId FROM sendLogMessageIds
          WHERE messageId = old.id
        );
        DELETE FROM reactions WHERE rowid IN (
          SELECT rowid FROM reactions
          WHERE messageId = old.id
        );
        DELETE FROM storyReads WHERE storyId = old.storyId;
      END;

      --- Story Read History

      CREATE TABLE storyReads (
        authorId STRING NOT NULL,
        conversationId STRING NOT NULL,
        storyId STRING NOT NULL,
        storyReadDate NUMBER NOT NULL,

        PRIMARY KEY (authorId, storyId)
      );

      CREATE INDEX storyReads_data ON storyReads (
        storyReadDate, authorId, conversationId
      );

      --- Story Distribution Lists

      CREATE TABLE storyDistributions(
        id STRING PRIMARY KEY NOT NULL,
        name TEXT,

        avatarUrlPath TEXT,
        avatarKey BLOB,
        senderKeyInfoJson STRING
      );

      CREATE TABLE storyDistributionMembers(
        listId STRING NOT NULL REFERENCES storyDistributions(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        uuid STRING NOT NULL,

        PRIMARY KEY (listId, uuid)
      )
      `);
    db.pragma("user_version = 45");
  })();
  logger3.info("updateToSchemaVersion45: success!");
}
__name(updateToSchemaVersion45, "updateToSchemaVersion45");

// ts/sql/migrations/46-optimize-stories.ts
function updateToSchemaVersion46(currentVersion, db, logger3) {
  if (currentVersion >= 46) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      --- Add column to messages table

      ALTER TABLE messages
      ADD COLUMN
      isStory INTEGER
      GENERATED ALWAYS
      AS (type = 'story');

      --- Update important message indices

      DROP INDEX   messages_conversation;
      CREATE INDEX messages_conversation ON messages
        (conversationId, isStory, storyId, received_at, sent_at);
      `);
    db.pragma("user_version = 46");
  })();
  logger3.info("updateToSchemaVersion46: success!");
}
__name(updateToSchemaVersion46, "updateToSchemaVersion46");

// ts/sql/migrations/47-further-optimize.ts
function updateToSchemaVersion47(currentVersion, db, logger3) {
  if (currentVersion >= 47) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX   messages_conversation;

      ALTER TABLE messages
        DROP COLUMN isStory;
      ALTER TABLE messages
        ADD COLUMN isStory INTEGER
        GENERATED ALWAYS AS (type IS 'story');

      ALTER TABLE messages
        ADD COLUMN isChangeCreatedByUs INTEGER NOT NULL DEFAULT 0;

      ALTER TABLE messages
        ADD COLUMN shouldAffectActivity INTEGER
        GENERATED ALWAYS AS (
          type IS NULL
          OR
          type NOT IN (
            'change-number-notification',
            'group-v1-migration',
            'message-history-unsynced',
            'profile-change',
            'story',
            'universal-timer-notification',
            'verified-change',

            'keychange'
          )
        );

      ALTER TABLE messages
        ADD COLUMN shouldAffectPreview INTEGER
        GENERATED ALWAYS AS (
          type IS NULL
          OR
          type NOT IN (
            'change-number-notification',
            'group-v1-migration',
            'message-history-unsynced',
            'profile-change',
            'story',
            'universal-timer-notification',
            'verified-change'
          )
        );

      ALTER TABLE messages
        ADD COLUMN isUserInitiatedMessage INTEGER
        GENERATED ALWAYS AS (
          type IS NULL
          OR
          type NOT IN (
            'change-number-notification',
            'group-v1-migration',
            'message-history-unsynced',
            'profile-change',
            'story',
            'universal-timer-notification',
            'verified-change',

            'group-v2-change',
            'keychange'
          )
        );

      ALTER TABLE messages
        ADD COLUMN isTimerChangeFromSync INTEGER
        GENERATED ALWAYS AS (
          json_extract(json, '$.expirationTimerUpdate.fromSync') IS 1
        );

      ALTER TABLE messages
        ADD COLUMN isGroupLeaveEvent INTEGER
        GENERATED ALWAYS AS (
          type IS 'group-v2-change' AND
          json_array_length(json_extract(json, '$.groupV2Change.details')) IS 1 AND
          json_extract(json, '$.groupV2Change.details[0].type') IS 'member-remove' AND
          json_extract(json, '$.groupV2Change.from') IS NOT NULL AND
          json_extract(json, '$.groupV2Change.from') IS json_extract(json, '$.groupV2Change.details[0].uuid')
        );

      ALTER TABLE messages
        ADD COLUMN isGroupLeaveEventFromOther INTEGER
        GENERATED ALWAYS AS (
          isGroupLeaveEvent IS 1
          AND
          isChangeCreatedByUs IS 0
        );

      CREATE INDEX messages_conversation ON messages
        (conversationId, isStory, storyId, received_at, sent_at);

      CREATE INDEX messages_preview ON messages
        (conversationId, shouldAffectPreview, isGroupLeaveEventFromOther, expiresAt, received_at, sent_at);

      CREATE INDEX messages_activity ON messages
        (conversationId, shouldAffectActivity, isTimerChangeFromSync, isGroupLeaveEventFromOther, received_at, sent_at);

      CREATE INDEX message_user_initiated ON messages (isUserInitiatedMessage);
      `);
    const ourUuid = getOurUuid(db);
    if (!ourUuid) {
      logger3.warn("updateToSchemaVersion47: our UUID not found");
    } else {
      db.prepare(`
        UPDATE messages SET
          isChangeCreatedByUs = json_extract(json, '$.groupV2Change.from') IS $ourUuid;
        `).run({
        ourUuid
      });
    }
    db.pragma("user_version = 47");
  })();
  logger3.info("updateToSchemaVersion47: success!");
}
__name(updateToSchemaVersion47, "updateToSchemaVersion47");

// ts/sql/migrations/48-fix-user-initiated-index.ts
function updateToSchemaVersion48(currentVersion, db, logger3) {
  if (currentVersion >= 48) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX   message_user_initiated;

      CREATE INDEX message_user_initiated ON messages (conversationId, isUserInitiatedMessage);
      `);
    db.pragma("user_version = 48");
  })();
  logger3.info("updateToSchemaVersion48: success!");
}
__name(updateToSchemaVersion48, "updateToSchemaVersion48");

// ts/sql/migrations/49-fix-preview-index.ts
function updateToSchemaVersion49(currentVersion, db, logger3) {
  if (currentVersion >= 49) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX messages_preview;

      -- Note the omitted 'expiresAt' column in the index. If it is present
      -- sqlite can't ORDER BY received_at, sent_at using this index.
      CREATE INDEX messages_preview ON messages
        (conversationId, shouldAffectPreview, isGroupLeaveEventFromOther, received_at, sent_at);
      `);
    db.pragma("user_version = 49");
  })();
  logger3.info("updateToSchemaVersion49: success!");
}
__name(updateToSchemaVersion49, "updateToSchemaVersion49");

// ts/sql/migrations/50-fix-messages-unread-index.ts
function updateToSchemaVersion50(currentVersion, db, logger3) {
  if (currentVersion >= 50) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX messages_unread;

      -- Note: here we move to the modern isStory/storyId fields and add received_at/sent_at.
      CREATE INDEX messages_unread ON messages
        (conversationId, readStatus, isStory, storyId, received_at, sent_at) WHERE readStatus IS NOT NULL;
      `);
    db.pragma("user_version = 50");
  })();
  logger3.info("updateToSchemaVersion50: success!");
}
__name(updateToSchemaVersion50, "updateToSchemaVersion50");

// ts/util/isRecord.ts
var isRecord = /* @__PURE__ */ __name((value) => typeof value === "object" && !Array.isArray(value) && value !== null, "isRecord");

// ts/sql/migrations/51-centralize-conversation-jobs.ts
function updateToSchemaVersion51(currentVersion, db, logger3) {
  if (currentVersion >= 51) {
    return;
  }
  db.transaction(() => {
    const deleteJobsInQueue = db.prepare("DELETE FROM jobs WHERE queueType = $queueType");
    const reactionsJobs = getJobsInQueueSync(db, "reactions");
    deleteJobsInQueue.run({ queueType: "reactions" });
    reactionsJobs.forEach((job) => {
      const { data, id } = job;
      if (!isRecord(data)) {
        logger3.warn(`updateToSchemaVersion51: reactions queue job ${id} was missing valid data`);
        return;
      }
      const { messageId } = data;
      if (typeof messageId !== "string") {
        logger3.warn(`updateToSchemaVersion51: reactions queue job ${id} had a non-string messageId`);
        return;
      }
      const message = getMessageByIdSync(db, messageId);
      if (!message) {
        logger3.warn(`updateToSchemaVersion51: Unable to find message for reaction job ${id}`);
        return;
      }
      const { conversationId } = message;
      if (typeof conversationId !== "string") {
        logger3.warn(`updateToSchemaVersion51: reactions queue job ${id} had a non-string conversationId`);
        return;
      }
      const newJob = __spreadProps(__spreadValues({}, job), {
        queueType: "conversation",
        data: __spreadProps(__spreadValues({}, data), {
          type: "Reaction",
          conversationId
        })
      });
      insertJobSync(db, newJob);
    });
    const normalSendJobs = getJobsInQueueSync(db, "normal send");
    deleteJobsInQueue.run({ queueType: "normal send" });
    normalSendJobs.forEach((job) => {
      const { data, id } = job;
      if (!isRecord(data)) {
        logger3.warn(`updateToSchemaVersion51: normal send queue job ${id} was missing valid data`);
        return;
      }
      const newJob = __spreadProps(__spreadValues({}, job), {
        queueType: "conversation",
        data: __spreadProps(__spreadValues({}, data), {
          type: "NormalMessage"
        })
      });
      insertJobSync(db, newJob);
    });
    db.pragma("user_version = 51");
  })();
  logger3.info("updateToSchemaVersion51: success!");
}
__name(updateToSchemaVersion51, "updateToSchemaVersion51");

// ts/sql/migrations/index.ts
function updateToSchemaVersion1(currentVersion, db, logger3) {
  if (currentVersion >= 1) {
    return;
  }
  logger3.info("updateToSchemaVersion1: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE messages(
        id STRING PRIMARY KEY ASC,
        json TEXT,

        unread INTEGER,
        expires_at INTEGER,
        sent_at INTEGER,
        schemaVersion INTEGER,
        conversationId STRING,
        received_at INTEGER,
        source STRING,
        sourceDevice STRING,
        hasAttachments INTEGER,
        hasFileAttachments INTEGER,
        hasVisualMediaAttachments INTEGER
      );
      CREATE INDEX messages_unread ON messages (
        unread
      );
      CREATE INDEX messages_expires_at ON messages (
        expires_at
      );
      CREATE INDEX messages_receipt ON messages (
        sent_at
      );
      CREATE INDEX messages_schemaVersion ON messages (
        schemaVersion
      );
      CREATE INDEX messages_conversation ON messages (
        conversationId,
        received_at
      );
      CREATE INDEX messages_duplicate_check ON messages (
        source,
        sourceDevice,
        sent_at
      );
      CREATE INDEX messages_hasAttachments ON messages (
        conversationId,
        hasAttachments,
        received_at
      );
      CREATE INDEX messages_hasFileAttachments ON messages (
        conversationId,
        hasFileAttachments,
        received_at
      );
      CREATE INDEX messages_hasVisualMediaAttachments ON messages (
        conversationId,
        hasVisualMediaAttachments,
        received_at
      );
      CREATE TABLE unprocessed(
        id STRING,
        timestamp INTEGER,
        json TEXT
      );
      CREATE INDEX unprocessed_id ON unprocessed (
        id
      );
      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );
    `);
    db.pragma("user_version = 1");
  })();
  logger3.info("updateToSchemaVersion1: success!");
}
__name(updateToSchemaVersion1, "updateToSchemaVersion1");
function updateToSchemaVersion2(currentVersion, db, logger3) {
  if (currentVersion >= 2) {
    return;
  }
  logger3.info("updateToSchemaVersion2: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
        ADD COLUMN expireTimer INTEGER;

      ALTER TABLE messages
        ADD COLUMN expirationStartTimestamp INTEGER;

      ALTER TABLE messages
        ADD COLUMN type STRING;

      CREATE INDEX messages_expiring ON messages (
        expireTimer,
        expirationStartTimestamp,
        expires_at
      );

      UPDATE messages SET
        expirationStartTimestamp = json_extract(json, '$.expirationStartTimestamp'),
        expireTimer = json_extract(json, '$.expireTimer'),
        type = json_extract(json, '$.type');
    `);
    db.pragma("user_version = 2");
  })();
  logger3.info("updateToSchemaVersion2: success!");
}
__name(updateToSchemaVersion2, "updateToSchemaVersion2");
function updateToSchemaVersion3(currentVersion, db, logger3) {
  if (currentVersion >= 3) {
    return;
  }
  logger3.info("updateToSchemaVersion3: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX messages_expiring;
      DROP INDEX messages_unread;

      CREATE INDEX messages_without_timer ON messages (
        expireTimer,
        expires_at,
        type
      ) WHERE expires_at IS NULL AND expireTimer IS NOT NULL;

      CREATE INDEX messages_unread ON messages (
        conversationId,
        unread
      ) WHERE unread IS NOT NULL;

      ANALYZE;
    `);
    db.pragma("user_version = 3");
  })();
  logger3.info("updateToSchemaVersion3: success!");
}
__name(updateToSchemaVersion3, "updateToSchemaVersion3");
function updateToSchemaVersion4(currentVersion, db, logger3) {
  if (currentVersion >= 4) {
    return;
  }
  logger3.info("updateToSchemaVersion4: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE conversations(
        id STRING PRIMARY KEY ASC,
        json TEXT,

        active_at INTEGER,
        type STRING,
        members TEXT,
        name TEXT,
        profileName TEXT
      );
      CREATE INDEX conversations_active ON conversations (
        active_at
      ) WHERE active_at IS NOT NULL;

      CREATE INDEX conversations_type ON conversations (
        type
      ) WHERE type IS NOT NULL;
    `);
    db.pragma("user_version = 4");
  })();
  logger3.info("updateToSchemaVersion4: success!");
}
__name(updateToSchemaVersion4, "updateToSchemaVersion4");
function updateToSchemaVersion6(currentVersion, db, logger3) {
  if (currentVersion >= 6) {
    return;
  }
  logger3.info("updateToSchemaVersion6: starting...");
  db.transaction(() => {
    db.exec(`
      -- key-value, ids are strings, one extra column
      CREATE TABLE sessions(
        id STRING PRIMARY KEY ASC,
        number STRING,
        json TEXT
      );
      CREATE INDEX sessions_number ON sessions (
        number
      ) WHERE number IS NOT NULL;
      -- key-value, ids are strings
      CREATE TABLE groups(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE identityKeys(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE items(
        id STRING PRIMARY KEY ASC,
        json TEXT
      );
      -- key-value, ids are integers
      CREATE TABLE preKeys(
        id INTEGER PRIMARY KEY ASC,
        json TEXT
      );
      CREATE TABLE signedPreKeys(
        id INTEGER PRIMARY KEY ASC,
        json TEXT
      );
    `);
    db.pragma("user_version = 6");
  })();
  logger3.info("updateToSchemaVersion6: success!");
}
__name(updateToSchemaVersion6, "updateToSchemaVersion6");
function updateToSchemaVersion7(currentVersion, db, logger3) {
  if (currentVersion >= 7) {
    return;
  }
  logger3.info("updateToSchemaVersion7: starting...");
  db.transaction(() => {
    db.exec(`
      -- SQLite has been coercing our STRINGs into numbers, so we force it with TEXT
      -- We create a new table then copy the data into it, since we can't modify columns
      DROP INDEX sessions_number;
      ALTER TABLE sessions RENAME TO sessions_old;

      CREATE TABLE sessions(
        id TEXT PRIMARY KEY,
        number TEXT,
        json TEXT
      );
      CREATE INDEX sessions_number ON sessions (
        number
      ) WHERE number IS NOT NULL;
      INSERT INTO sessions(id, number, json)
        SELECT "+" || id, number, json FROM sessions_old;
      DROP TABLE sessions_old;
    `);
    db.pragma("user_version = 7");
  })();
  logger3.info("updateToSchemaVersion7: success!");
}
__name(updateToSchemaVersion7, "updateToSchemaVersion7");
function updateToSchemaVersion8(currentVersion, db, logger3) {
  if (currentVersion >= 8) {
    return;
  }
  logger3.info("updateToSchemaVersion8: starting...");
  db.transaction(() => {
    db.exec(`
      -- First, we pull a new body field out of the message table's json blob
      ALTER TABLE messages
        ADD COLUMN body TEXT;
      UPDATE messages SET body = json_extract(json, '$.body');

      -- Then we create our full-text search table and populate it
      CREATE VIRTUAL TABLE messages_fts
        USING fts5(id UNINDEXED, body);

      INSERT INTO messages_fts(id, body)
        SELECT id, body FROM messages;

      -- Then we set up triggers to keep the full-text search table up to date
      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 8");
  })();
  logger3.info("updateToSchemaVersion8: success!");
}
__name(updateToSchemaVersion8, "updateToSchemaVersion8");
function updateToSchemaVersion9(currentVersion, db, logger3) {
  if (currentVersion >= 9) {
    return;
  }
  logger3.info("updateToSchemaVersion9: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE attachment_downloads(
        id STRING primary key,
        timestamp INTEGER,
        pending INTEGER,
        json TEXT
      );

      CREATE INDEX attachment_downloads_timestamp
        ON attachment_downloads (
          timestamp
      ) WHERE pending = 0;
      CREATE INDEX attachment_downloads_pending
        ON attachment_downloads (
          pending
      ) WHERE pending != 0;
    `);
    db.pragma("user_version = 9");
  })();
  logger3.info("updateToSchemaVersion9: success!");
}
__name(updateToSchemaVersion9, "updateToSchemaVersion9");
function updateToSchemaVersion10(currentVersion, db, logger3) {
  if (currentVersion >= 10) {
    return;
  }
  logger3.info("updateToSchemaVersion10: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX unprocessed_id;
      DROP INDEX unprocessed_timestamp;
      ALTER TABLE unprocessed RENAME TO unprocessed_old;

      CREATE TABLE unprocessed(
        id STRING,
        timestamp INTEGER,
        version INTEGER,
        attempts INTEGER,
        envelope TEXT,
        decrypted TEXT,
        source TEXT,
        sourceDevice TEXT,
        serverTimestamp INTEGER
      );

      CREATE INDEX unprocessed_id ON unprocessed (
        id
      );
      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );

      INSERT INTO unprocessed (
        id,
        timestamp,
        version,
        attempts,
        envelope,
        decrypted,
        source,
        sourceDevice,
        serverTimestamp
      ) SELECT
        id,
        timestamp,
        json_extract(json, '$.version'),
        json_extract(json, '$.attempts'),
        json_extract(json, '$.envelope'),
        json_extract(json, '$.decrypted'),
        json_extract(json, '$.source'),
        json_extract(json, '$.sourceDevice'),
        json_extract(json, '$.serverTimestamp')
      FROM unprocessed_old;

      DROP TABLE unprocessed_old;
    `);
    db.pragma("user_version = 10");
  })();
  logger3.info("updateToSchemaVersion10: success!");
}
__name(updateToSchemaVersion10, "updateToSchemaVersion10");
function updateToSchemaVersion11(currentVersion, db, logger3) {
  if (currentVersion >= 11) {
    return;
  }
  logger3.info("updateToSchemaVersion11: starting...");
  db.transaction(() => {
    db.exec(`
      DROP TABLE groups;
    `);
    db.pragma("user_version = 11");
  })();
  logger3.info("updateToSchemaVersion11: success!");
}
__name(updateToSchemaVersion11, "updateToSchemaVersion11");
function updateToSchemaVersion12(currentVersion, db, logger3) {
  if (currentVersion >= 12) {
    return;
  }
  logger3.info("updateToSchemaVersion12: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE sticker_packs(
        id TEXT PRIMARY KEY,
        key TEXT NOT NULL,

        author STRING,
        coverStickerId INTEGER,
        createdAt INTEGER,
        downloadAttempts INTEGER,
        installedAt INTEGER,
        lastUsed INTEGER,
        status STRING,
        stickerCount INTEGER,
        title STRING
      );

      CREATE TABLE stickers(
        id INTEGER NOT NULL,
        packId TEXT NOT NULL,

        emoji STRING,
        height INTEGER,
        isCoverOnly INTEGER,
        lastUsed INTEGER,
        path STRING,
        width INTEGER,

        PRIMARY KEY (id, packId),
        CONSTRAINT stickers_fk
          FOREIGN KEY (packId)
          REFERENCES sticker_packs(id)
          ON DELETE CASCADE
      );

      CREATE INDEX stickers_recents
        ON stickers (
          lastUsed
      ) WHERE lastUsed IS NOT NULL;

      CREATE TABLE sticker_references(
        messageId STRING,
        packId TEXT,
        CONSTRAINT sticker_references_fk
          FOREIGN KEY(packId)
          REFERENCES sticker_packs(id)
          ON DELETE CASCADE
      );
    `);
    db.pragma("user_version = 12");
  })();
  logger3.info("updateToSchemaVersion12: success!");
}
__name(updateToSchemaVersion12, "updateToSchemaVersion12");
function updateToSchemaVersion13(currentVersion, db, logger3) {
  if (currentVersion >= 13) {
    return;
  }
  logger3.info("updateToSchemaVersion13: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE sticker_packs ADD COLUMN attemptedStatus STRING;
    `);
    db.pragma("user_version = 13");
  })();
  logger3.info("updateToSchemaVersion13: success!");
}
__name(updateToSchemaVersion13, "updateToSchemaVersion13");
function updateToSchemaVersion14(currentVersion, db, logger3) {
  if (currentVersion >= 14) {
    return;
  }
  logger3.info("updateToSchemaVersion14: starting...");
  db.transaction(() => {
    db.exec(`
      CREATE TABLE emojis(
        shortName STRING PRIMARY KEY,
        lastUsage INTEGER
      );

      CREATE INDEX emojis_lastUsage
        ON emojis (
          lastUsage
      );
    `);
    db.pragma("user_version = 14");
  })();
  logger3.info("updateToSchemaVersion14: success!");
}
__name(updateToSchemaVersion14, "updateToSchemaVersion14");
function updateToSchemaVersion15(currentVersion, db, logger3) {
  if (currentVersion >= 15) {
    return;
  }
  logger3.info("updateToSchemaVersion15: starting...");
  db.transaction(() => {
    db.exec(`
      -- SQLite has again coerced our STRINGs into numbers, so we force it with TEXT
      -- We create a new table then copy the data into it, since we can't modify columns

      DROP INDEX emojis_lastUsage;
      ALTER TABLE emojis RENAME TO emojis_old;

      CREATE TABLE emojis(
        shortName TEXT PRIMARY KEY,
        lastUsage INTEGER
      );
      CREATE INDEX emojis_lastUsage
        ON emojis (
          lastUsage
      );

      DELETE FROM emojis WHERE shortName = 1;
      INSERT INTO emojis(shortName, lastUsage)
        SELECT shortName, lastUsage FROM emojis_old;

      DROP TABLE emojis_old;
    `);
    db.pragma("user_version = 15");
  })();
  logger3.info("updateToSchemaVersion15: success!");
}
__name(updateToSchemaVersion15, "updateToSchemaVersion15");
function updateToSchemaVersion16(currentVersion, db, logger3) {
  if (currentVersion >= 16) {
    return;
  }
  logger3.info("updateToSchemaVersion16: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      ADD COLUMN messageTimer INTEGER;
      ALTER TABLE messages
      ADD COLUMN messageTimerStart INTEGER;
      ALTER TABLE messages
      ADD COLUMN messageTimerExpiresAt INTEGER;
      ALTER TABLE messages
      ADD COLUMN isErased INTEGER;

      CREATE INDEX messages_message_timer ON messages (
        messageTimer,
        messageTimerStart,
        messageTimerExpiresAt,
        isErased
      ) WHERE messageTimer IS NOT NULL;

      -- Updating full-text triggers to avoid anything with a messageTimer set

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_delete;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.messageTimer IS NULL
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.messageTimer IS NULL
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 16");
  })();
  logger3.info("updateToSchemaVersion16: success!");
}
__name(updateToSchemaVersion16, "updateToSchemaVersion16");
function updateToSchemaVersion17(currentVersion, db, logger3) {
  if (currentVersion >= 17) {
    return;
  }
  logger3.info("updateToSchemaVersion17: starting...");
  db.transaction(() => {
    try {
      db.exec(`
        ALTER TABLE messages
        ADD COLUMN isViewOnce INTEGER;

        DROP INDEX messages_message_timer;
      `);
    } catch (error2) {
      logger3.info("updateToSchemaVersion17: Message table already had isViewOnce column");
    }
    try {
      db.exec("DROP INDEX messages_view_once;");
    } catch (error2) {
      logger3.info("updateToSchemaVersion17: Index messages_view_once did not already exist");
    }
    db.exec(`
      CREATE INDEX messages_view_once ON messages (
        isErased
      ) WHERE isViewOnce = 1;

      -- Updating full-text triggers to avoid anything with isViewOnce = 1

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 17");
  })();
  logger3.info("updateToSchemaVersion17: success!");
}
__name(updateToSchemaVersion17, "updateToSchemaVersion17");
function updateToSchemaVersion18(currentVersion, db, logger3) {
  if (currentVersion >= 18) {
    return;
  }
  logger3.info("updateToSchemaVersion18: starting...");
  db.transaction(() => {
    db.exec(`
      -- Delete and rebuild full-text search index to capture everything

      DELETE FROM messages_fts;
      INSERT INTO messages_fts(messages_fts) VALUES('rebuild');

      INSERT INTO messages_fts(id, body)
      SELECT id, body FROM messages WHERE isViewOnce IS NULL OR isViewOnce != 1;

      -- Fixing full-text triggers

      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts (
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE id = old.id;
        INSERT INTO messages_fts(
          id,
          body
        ) VALUES (
          new.id,
          new.body
        );
      END;
    `);
    db.pragma("user_version = 18");
  })();
  logger3.info("updateToSchemaVersion18: success!");
}
__name(updateToSchemaVersion18, "updateToSchemaVersion18");
function updateToSchemaVersion19(currentVersion, db, logger3) {
  if (currentVersion >= 19) {
    return;
  }
  logger3.info("updateToSchemaVersion19: starting...");
  db.transaction(() => {
    db.exec(`
      ALTER TABLE conversations
      ADD COLUMN profileFamilyName TEXT;
      ALTER TABLE conversations
      ADD COLUMN profileFullName TEXT;

      -- Preload new field with the profileName we already have
      UPDATE conversations SET profileFullName = profileName;
    `);
    db.pragma("user_version = 19");
  })();
  logger3.info("updateToSchemaVersion19: success!");
}
__name(updateToSchemaVersion19, "updateToSchemaVersion19");
function updateToSchemaVersion20(currentVersion, db, logger3) {
  if (currentVersion >= 20) {
    return;
  }
  logger3.info("updateToSchemaVersion20: starting...");
  db.transaction(() => {
    const triggers = db.prepare('SELECT * FROM sqlite_master WHERE type = "trigger" AND tbl_name = "messages"').all();
    for (const trigger of triggers) {
      db.exec(`DROP TRIGGER ${trigger.name}`);
    }
    db.exec(`
      ALTER TABLE conversations ADD COLUMN e164 TEXT;
      ALTER TABLE conversations ADD COLUMN uuid TEXT;
      ALTER TABLE conversations ADD COLUMN groupId TEXT;
      ALTER TABLE messages ADD COLUMN sourceUuid TEXT;
      ALTER TABLE sessions RENAME COLUMN number TO conversationId;
      CREATE INDEX conversations_e164 ON conversations(e164);
      CREATE INDEX conversations_uuid ON conversations(uuid);
      CREATE INDEX conversations_groupId ON conversations(groupId);
      CREATE INDEX messages_sourceUuid on messages(sourceUuid);

      -- Migrate existing IDs
      UPDATE conversations SET e164 = '+' || id WHERE type = 'private';
      UPDATE conversations SET groupId = id WHERE type = 'group';
    `);
    const maybeInvalidGroups = db.prepare("SELECT * FROM conversations WHERE type = 'group' AND members IS NULL;").all();
    for (const group of maybeInvalidGroups) {
      const json = JSON.parse(group.json);
      if (!json.members || !json.members.length) {
        db.prepare("DELETE FROM conversations WHERE id = $id;").run({
          id: json.id
        });
        db.prepare("DELETE FROM messages WHERE conversationId = $id;").run({ id: json.id });
      }
    }
    const allConversations = db.prepare("SELECT * FROM conversations;").all();
    const allConversationsByOldId = (0, import_lodash4.keyBy)(allConversations, "id");
    for (const row of allConversations) {
      const oldId = row.id;
      const newId = UUID.generate().toString();
      allConversationsByOldId[oldId].id = newId;
      const patchObj = {
        id: newId
      };
      if (row.type === "private") {
        patchObj.e164 = `+${oldId}`;
      } else if (row.type === "group") {
        patchObj.groupId = oldId;
      }
      const patch = JSON.stringify(patchObj);
      db.prepare(`
        UPDATE conversations
        SET id = $newId, json = JSON_PATCH(json, $patch)
        WHERE id = $oldId
        `).run({
        newId,
        oldId,
        patch
      });
      const messagePatch = JSON.stringify({ conversationId: newId });
      db.prepare(`
        UPDATE messages
        SET conversationId = $newId, json = JSON_PATCH(json, $patch)
        WHERE conversationId = $oldId
        `).run({ newId, oldId, patch: messagePatch });
    }
    const groupConversations = db.prepare(`
        SELECT id, members, json FROM conversations WHERE type = 'group';
        `).all();
    groupConversations.forEach((groupRow) => {
      const members = groupRow.members.split(/\s?\+/).filter(Boolean);
      const newMembers = [];
      for (const m of members) {
        const memberRow = allConversationsByOldId[m];
        if (memberRow) {
          newMembers.push(memberRow.id);
        } else {
          const id = UUID.generate().toString();
          const updatedConversation = {
            id,
            e164: m,
            type: "private",
            version: 2,
            unreadCount: 0,
            verified: 0,
            inbox_position: 0,
            isPinned: false,
            lastMessageDeletedForEveryone: false,
            markedUnread: false,
            messageCount: 0,
            sentMessageCount: 0,
            profileSharing: false
          };
          db.prepare(`
            UPDATE conversations
            SET
              json = $json,
              e164 = $e164,
              type = $type,
            WHERE
              id = $id;
            `).run({
            id: updatedConversation.id,
            json: objectToJSON(updatedConversation),
            e164: updatedConversation.e164,
            type: updatedConversation.type
          });
          newMembers.push(id);
        }
      }
      const json = __spreadProps(__spreadValues({}, jsonToObject(groupRow.json)), {
        members: newMembers
      });
      const newMembersValue = newMembers.join(" ");
      db.prepare(`
        UPDATE conversations
        SET members = $newMembersValue, json = $newJsonValue
        WHERE id = $id
        `).run({
        id: groupRow.id,
        newMembersValue,
        newJsonValue: objectToJSON(json)
      });
    });
    const allSessions = db.prepare("SELECT * FROM sessions;").all();
    for (const session of allSessions) {
      const newJson = JSON.parse(session.json);
      const conversation = allConversationsByOldId[newJson.number.substr(1)];
      if (conversation) {
        newJson.conversationId = conversation.id;
        newJson.id = `${newJson.conversationId}.${newJson.deviceId}`;
      }
      delete newJson.number;
      db.prepare(`
        UPDATE sessions
        SET id = $newId, json = $newJson, conversationId = $newConversationId
        WHERE id = $oldId
        `).run({
        newId: newJson.id,
        newJson: objectToJSON(newJson),
        oldId: session.id,
        newConversationId: newJson.conversationId
      });
    }
    const allIdentityKeys = db.prepare("SELECT * FROM identityKeys;").all();
    for (const identityKey of allIdentityKeys) {
      const newJson = JSON.parse(identityKey.json);
      newJson.id = allConversationsByOldId[newJson.id];
      db.prepare(`
        UPDATE identityKeys
        SET id = $newId, json = $newJson
        WHERE id = $oldId
        `).run({
        newId: newJson.id,
        newJson: objectToJSON(newJson),
        oldId: identityKey.id
      });
    }
    for (const trigger of triggers) {
      db.exec(trigger.sql);
    }
    db.pragma("user_version = 20");
  })();
  logger3.info("updateToSchemaVersion20: success!");
}
__name(updateToSchemaVersion20, "updateToSchemaVersion20");
function updateToSchemaVersion21(currentVersion, db, logger3) {
  if (currentVersion >= 21) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      UPDATE conversations
      SET json = json_set(
        json,
        '$.messageCount',
        (SELECT count(*) FROM messages WHERE messages.conversationId = conversations.id)
      );
      UPDATE conversations
      SET json = json_set(
        json,
        '$.sentMessageCount',
        (SELECT count(*) FROM messages WHERE messages.conversationId = conversations.id AND messages.type = 'outgoing')
      );
    `);
    db.pragma("user_version = 21");
  })();
  logger3.info("updateToSchemaVersion21: success!");
}
__name(updateToSchemaVersion21, "updateToSchemaVersion21");
function updateToSchemaVersion22(currentVersion, db, logger3) {
  if (currentVersion >= 22) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE unprocessed
        ADD COLUMN sourceUuid STRING;
    `);
    db.pragma("user_version = 22");
  })();
  logger3.info("updateToSchemaVersion22: success!");
}
__name(updateToSchemaVersion22, "updateToSchemaVersion22");
function updateToSchemaVersion23(currentVersion, db, logger3) {
  if (currentVersion >= 23) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- Remove triggers which keep full-text search up to date
      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;
      DROP TRIGGER messages_on_delete;
    `);
    db.pragma("user_version = 23");
  })();
  logger3.info("updateToSchemaVersion23: success!");
}
__name(updateToSchemaVersion23, "updateToSchemaVersion23");
function updateToSchemaVersion24(currentVersion, db, logger3) {
  if (currentVersion >= 24) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE conversations
      ADD COLUMN profileLastFetchedAt INTEGER;
    `);
    db.pragma("user_version = 24");
  })();
  logger3.info("updateToSchemaVersion24: success!");
}
__name(updateToSchemaVersion24, "updateToSchemaVersion24");
function updateToSchemaVersion25(currentVersion, db, logger3) {
  if (currentVersion >= 25) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      RENAME TO old_messages
    `);
    const indicesToDrop = [
      "messages_expires_at",
      "messages_receipt",
      "messages_schemaVersion",
      "messages_conversation",
      "messages_duplicate_check",
      "messages_hasAttachments",
      "messages_hasFileAttachments",
      "messages_hasVisualMediaAttachments",
      "messages_without_timer",
      "messages_unread",
      "messages_view_once",
      "messages_sourceUuid"
    ];
    for (const index of indicesToDrop) {
      db.exec(`DROP INDEX IF EXISTS ${index};`);
    }
    db.exec(`
      --
      -- Create a new table with a different primary key
      --

      CREATE TABLE messages(
        rowid INTEGER PRIMARY KEY ASC,
        id STRING UNIQUE,
        json TEXT,
        unread INTEGER,
        expires_at INTEGER,
        sent_at INTEGER,
        schemaVersion INTEGER,
        conversationId STRING,
        received_at INTEGER,
        source STRING,
        sourceDevice STRING,
        hasAttachments INTEGER,
        hasFileAttachments INTEGER,
        hasVisualMediaAttachments INTEGER,
        expireTimer INTEGER,
        expirationStartTimestamp INTEGER,
        type STRING,
        body TEXT,
        messageTimer INTEGER,
        messageTimerStart INTEGER,
        messageTimerExpiresAt INTEGER,
        isErased INTEGER,
        isViewOnce INTEGER,
        sourceUuid TEXT);

      -- Create index in lieu of old PRIMARY KEY
      CREATE INDEX messages_id ON messages (id ASC);

      --
      -- Recreate indices
      --

      CREATE INDEX messages_expires_at ON messages (expires_at);

      CREATE INDEX messages_receipt ON messages (sent_at);

      CREATE INDEX messages_schemaVersion ON messages (schemaVersion);

      CREATE INDEX messages_conversation ON messages
        (conversationId, received_at);

      CREATE INDEX messages_duplicate_check ON messages
        (source, sourceDevice, sent_at);

      CREATE INDEX messages_hasAttachments ON messages
        (conversationId, hasAttachments, received_at);

      CREATE INDEX messages_hasFileAttachments ON messages
        (conversationId, hasFileAttachments, received_at);

      CREATE INDEX messages_hasVisualMediaAttachments ON messages
        (conversationId, hasVisualMediaAttachments, received_at);

      CREATE INDEX messages_without_timer ON messages
        (expireTimer, expires_at, type)
        WHERE expires_at IS NULL AND expireTimer IS NOT NULL;

      CREATE INDEX messages_unread ON messages
        (conversationId, unread) WHERE unread IS NOT NULL;

      CREATE INDEX messages_view_once ON messages
        (isErased) WHERE isViewOnce = 1;

      CREATE INDEX messages_sourceUuid on messages(sourceUuid);

      -- New index for searchMessages
      CREATE INDEX messages_searchOrder on messages(received_at, sent_at);

      --
      -- Re-create messages_fts and add triggers
      --

      DROP TABLE messages_fts;

      CREATE VIRTUAL TABLE messages_fts USING fts5(body);

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
      END;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      --
      -- Copy data over
      --

      INSERT INTO messages
      (
        id, json, unread, expires_at, sent_at, schemaVersion, conversationId,
        received_at, source, sourceDevice, hasAttachments, hasFileAttachments,
        hasVisualMediaAttachments, expireTimer, expirationStartTimestamp, type,
        body, messageTimer, messageTimerStart, messageTimerExpiresAt, isErased,
        isViewOnce, sourceUuid
      )
      SELECT
        id, json, unread, expires_at, sent_at, schemaVersion, conversationId,
        received_at, source, sourceDevice, hasAttachments, hasFileAttachments,
        hasVisualMediaAttachments, expireTimer, expirationStartTimestamp, type,
        body, messageTimer, messageTimerStart, messageTimerExpiresAt, isErased,
        isViewOnce, sourceUuid
      FROM old_messages;

      -- Drop old database
      DROP TABLE old_messages;
    `);
    db.pragma("user_version = 25");
  })();
  logger3.info("updateToSchemaVersion25: success!");
}
__name(updateToSchemaVersion25, "updateToSchemaVersion25");
function updateToSchemaVersion26(currentVersion, db, logger3) {
  if (currentVersion >= 26) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP TRIGGER messages_on_insert;
      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_insert AFTER INSERT ON messages
      WHEN new.isViewOnce IS NULL OR new.isViewOnce != 1
      BEGIN
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN new.body != old.body AND
        (new.isViewOnce IS NULL OR new.isViewOnce != 1)
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;
    `);
    db.pragma("user_version = 26");
  })();
  logger3.info("updateToSchemaVersion26: success!");
}
__name(updateToSchemaVersion26, "updateToSchemaVersion26");
function updateToSchemaVersion27(currentVersion, db, logger3) {
  if (currentVersion >= 27) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DELETE FROM messages_fts WHERE rowid IN
        (SELECT rowid FROM messages WHERE body IS NULL);

      DROP TRIGGER messages_on_update;

      CREATE TRIGGER messages_on_update AFTER UPDATE ON messages
      WHEN
        new.body IS NULL OR
        ((old.body IS NULL OR new.body != old.body) AND
         (new.isViewOnce IS NULL OR new.isViewOnce != 1))
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        INSERT INTO messages_fts
        (rowid, body)
        VALUES
        (new.rowid, new.body);
      END;

      CREATE TRIGGER messages_on_view_once_update AFTER UPDATE ON messages
      WHEN
        new.body IS NOT NULL AND new.isViewOnce = 1
      BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
      END;
    `);
    db.pragma("user_version = 27");
  })();
  logger3.info("updateToSchemaVersion27: success!");
}
__name(updateToSchemaVersion27, "updateToSchemaVersion27");
function updateToSchemaVersion28(currentVersion, db, logger3) {
  if (currentVersion >= 28) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE jobs(
        id TEXT PRIMARY KEY,
        queueType TEXT STRING NOT NULL,
        timestamp INTEGER NOT NULL,
        data STRING TEXT
      );

      CREATE INDEX jobs_timestamp ON jobs (timestamp);
    `);
    db.pragma("user_version = 28");
  })();
  logger3.info("updateToSchemaVersion28: success!");
}
__name(updateToSchemaVersion28, "updateToSchemaVersion28");
function updateToSchemaVersion29(currentVersion, db, logger3) {
  if (currentVersion >= 29) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE reactions(
        conversationId STRING,
        emoji STRING,
        fromId STRING,
        messageReceivedAt INTEGER,
        targetAuthorUuid STRING,
        targetTimestamp INTEGER,
        unread INTEGER
      );

      CREATE INDEX reactions_unread ON reactions (
        unread,
        conversationId
      );

      CREATE INDEX reaction_identifier ON reactions (
        emoji,
        targetAuthorUuid,
        targetTimestamp
      );
    `);
    db.pragma("user_version = 29");
  })();
  logger3.info("updateToSchemaVersion29: success!");
}
__name(updateToSchemaVersion29, "updateToSchemaVersion29");
function updateToSchemaVersion30(currentVersion, db, logger3) {
  if (currentVersion >= 30) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE senderKeys(
        id TEXT PRIMARY KEY NOT NULL,
        senderId TEXT NOT NULL,
        distributionId TEXT NOT NULL,
        data BLOB NOT NULL,
        lastUpdatedDate NUMBER NOT NULL
      );
    `);
    db.pragma("user_version = 30");
  })();
  logger3.info("updateToSchemaVersion30: success!");
}
__name(updateToSchemaVersion30, "updateToSchemaVersion30");
function updateToSchemaVersion31(currentVersion, db, logger3) {
  if (currentVersion >= 31) {
    return;
  }
  logger3.info("updateToSchemaVersion31: starting...");
  db.transaction(() => {
    db.exec(`
      DROP INDEX unprocessed_id;
      DROP INDEX unprocessed_timestamp;
      ALTER TABLE unprocessed RENAME TO unprocessed_old;

      CREATE TABLE unprocessed(
        id STRING PRIMARY KEY ASC,
        timestamp INTEGER,
        version INTEGER,
        attempts INTEGER,
        envelope TEXT,
        decrypted TEXT,
        source TEXT,
        sourceDevice TEXT,
        serverTimestamp INTEGER,
        sourceUuid STRING
      );

      CREATE INDEX unprocessed_timestamp ON unprocessed (
        timestamp
      );

      INSERT OR REPLACE INTO unprocessed
        (id, timestamp, version, attempts, envelope, decrypted, source,
         sourceDevice, serverTimestamp, sourceUuid)
      SELECT
        id, timestamp, version, attempts, envelope, decrypted, source,
         sourceDevice, serverTimestamp, sourceUuid
      FROM unprocessed_old;

      DROP TABLE unprocessed_old;
    `);
    db.pragma("user_version = 31");
  })();
  logger3.info("updateToSchemaVersion31: success!");
}
__name(updateToSchemaVersion31, "updateToSchemaVersion31");
function updateToSchemaVersion32(currentVersion, db, logger3) {
  if (currentVersion >= 32) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      ALTER TABLE messages
      ADD COLUMN serverGuid STRING NULL;

      ALTER TABLE unprocessed
      ADD COLUMN serverGuid STRING NULL;
    `);
    db.pragma("user_version = 32");
  })();
  logger3.info("updateToSchemaVersion32: success!");
}
__name(updateToSchemaVersion32, "updateToSchemaVersion32");
function updateToSchemaVersion33(currentVersion, db, logger3) {
  if (currentVersion >= 33) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- These indexes should exist, but we add "IF EXISTS" for safety.
      DROP INDEX IF EXISTS messages_expires_at;
      DROP INDEX IF EXISTS messages_without_timer;

      ALTER TABLE messages
      ADD COLUMN
      expiresAt INT
      GENERATED ALWAYS
      AS (expirationStartTimestamp + (expireTimer * 1000));

      CREATE INDEX message_expires_at ON messages (
        expiresAt
      );

      CREATE INDEX outgoing_messages_without_expiration_start_timestamp ON messages (
        expireTimer, expirationStartTimestamp, type
      )
      WHERE expireTimer IS NOT NULL AND expirationStartTimestamp IS NULL;
    `);
    db.pragma("user_version = 33");
  })();
  logger3.info("updateToSchemaVersion33: success!");
}
__name(updateToSchemaVersion33, "updateToSchemaVersion33");
function updateToSchemaVersion34(currentVersion, db, logger3) {
  if (currentVersion >= 34) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- This index should exist, but we add "IF EXISTS" for safety.
      DROP INDEX IF EXISTS outgoing_messages_without_expiration_start_timestamp;

      CREATE INDEX messages_unexpectedly_missing_expiration_start_timestamp ON messages (
        expireTimer, expirationStartTimestamp, type
      )
      WHERE expireTimer IS NOT NULL AND expirationStartTimestamp IS NULL;
    `);
    db.pragma("user_version = 34");
  })();
  logger3.info("updateToSchemaVersion34: success!");
}
__name(updateToSchemaVersion34, "updateToSchemaVersion34");
function updateToSchemaVersion35(currentVersion, db, logger3) {
  if (currentVersion >= 35) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE INDEX expiring_message_by_conversation_and_received_at
      ON messages
      (
        expirationStartTimestamp,
        expireTimer,
        conversationId,
        received_at
      );
    `);
    db.pragma("user_version = 35");
  })();
  logger3.info("updateToSchemaVersion35: success!");
}
__name(updateToSchemaVersion35, "updateToSchemaVersion35");
function updateToSchemaVersion36(currentVersion, db, logger3) {
  if (currentVersion >= 36) {
    return;
  }
  db.pragma("user_version = 36");
  logger3.info("updateToSchemaVersion36: success!");
}
__name(updateToSchemaVersion36, "updateToSchemaVersion36");
function updateToSchemaVersion37(currentVersion, db, logger3) {
  if (currentVersion >= 37) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      -- Create send log primary table

      CREATE TABLE sendLogPayloads(
        id INTEGER PRIMARY KEY ASC,

        timestamp INTEGER NOT NULL,
        contentHint INTEGER NOT NULL,
        proto BLOB NOT NULL
      );

      CREATE INDEX sendLogPayloadsByTimestamp ON sendLogPayloads (timestamp);

      -- Create send log recipients table with foreign key relationship to payloads

      CREATE TABLE sendLogRecipients(
        payloadId INTEGER NOT NULL,

        recipientUuid STRING NOT NULL,
        deviceId INTEGER NOT NULL,

        PRIMARY KEY (payloadId, recipientUuid, deviceId),

        CONSTRAINT sendLogRecipientsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );

      CREATE INDEX sendLogRecipientsByRecipient
        ON sendLogRecipients (recipientUuid, deviceId);

      -- Create send log messages table with foreign key relationship to payloads

      CREATE TABLE sendLogMessageIds(
        payloadId INTEGER NOT NULL,

        messageId STRING NOT NULL,

        PRIMARY KEY (payloadId, messageId),

        CONSTRAINT sendLogMessageIdsForeignKey
          FOREIGN KEY (payloadId)
          REFERENCES sendLogPayloads(id)
          ON DELETE CASCADE
      );

      CREATE INDEX sendLogMessageIdsByMessage
        ON sendLogMessageIds (messageId);

      -- Recreate messages table delete trigger with send log support

      DROP TRIGGER messages_on_delete;

      CREATE TRIGGER messages_on_delete AFTER DELETE ON messages BEGIN
        DELETE FROM messages_fts WHERE rowid = old.rowid;
        DELETE FROM sendLogPayloads WHERE id IN (
          SELECT payloadId FROM sendLogMessageIds
          WHERE messageId = old.id
        );
      END;

      --- Add messageId column to reactions table to properly track proto associations

      ALTER TABLE reactions ADD column messageId STRING;
    `);
    db.pragma("user_version = 37");
  })();
  logger3.info("updateToSchemaVersion37: success!");
}
__name(updateToSchemaVersion37, "updateToSchemaVersion37");
function updateToSchemaVersion38(currentVersion, db, logger3) {
  if (currentVersion >= 38) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      DROP INDEX IF EXISTS messages_duplicate_check;

      ALTER TABLE messages
        RENAME COLUMN sourceDevice TO deprecatedSourceDevice;
      ALTER TABLE messages
        ADD COLUMN sourceDevice INTEGER;

      UPDATE messages
      SET
        sourceDevice = CAST(deprecatedSourceDevice AS INTEGER),
        deprecatedSourceDevice = NULL;

      ALTER TABLE unprocessed
        RENAME COLUMN sourceDevice TO deprecatedSourceDevice;
      ALTER TABLE unprocessed
        ADD COLUMN sourceDevice INTEGER;

      UPDATE unprocessed
      SET
        sourceDevice = CAST(deprecatedSourceDevice AS INTEGER),
        deprecatedSourceDevice = NULL;
    `);
    db.pragma("user_version = 38");
  })();
  logger3.info("updateToSchemaVersion38: success!");
}
__name(updateToSchemaVersion38, "updateToSchemaVersion38");
function updateToSchemaVersion39(currentVersion, db, logger3) {
  if (currentVersion >= 39) {
    return;
  }
  db.transaction(() => {
    db.exec("ALTER TABLE messages RENAME COLUMN unread TO readStatus;");
    db.pragma("user_version = 39");
  })();
  logger3.info("updateToSchemaVersion39: success!");
}
__name(updateToSchemaVersion39, "updateToSchemaVersion39");
function updateToSchemaVersion40(currentVersion, db, logger3) {
  if (currentVersion >= 40) {
    return;
  }
  db.transaction(() => {
    db.exec(`
      CREATE TABLE groupCallRings(
        ringId INTEGER PRIMARY KEY,
        isActive INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
      );
      `);
    db.pragma("user_version = 40");
  })();
  logger3.info("updateToSchemaVersion40: success!");
}
__name(updateToSchemaVersion40, "updateToSchemaVersion40");
var SCHEMA_VERSIONS = [
  updateToSchemaVersion1,
  updateToSchemaVersion2,
  updateToSchemaVersion3,
  updateToSchemaVersion4,
  (_v, _i, _l) => void 0,
  updateToSchemaVersion6,
  updateToSchemaVersion7,
  updateToSchemaVersion8,
  updateToSchemaVersion9,
  updateToSchemaVersion10,
  updateToSchemaVersion11,
  updateToSchemaVersion12,
  updateToSchemaVersion13,
  updateToSchemaVersion14,
  updateToSchemaVersion15,
  updateToSchemaVersion16,
  updateToSchemaVersion17,
  updateToSchemaVersion18,
  updateToSchemaVersion19,
  updateToSchemaVersion20,
  updateToSchemaVersion21,
  updateToSchemaVersion22,
  updateToSchemaVersion23,
  updateToSchemaVersion24,
  updateToSchemaVersion25,
  updateToSchemaVersion26,
  updateToSchemaVersion27,
  updateToSchemaVersion28,
  updateToSchemaVersion29,
  updateToSchemaVersion30,
  updateToSchemaVersion31,
  updateToSchemaVersion32,
  updateToSchemaVersion33,
  updateToSchemaVersion34,
  updateToSchemaVersion35,
  updateToSchemaVersion36,
  updateToSchemaVersion37,
  updateToSchemaVersion38,
  updateToSchemaVersion39,
  updateToSchemaVersion40,
  updateToSchemaVersion41,
  updateToSchemaVersion42,
  updateToSchemaVersion43,
  updateToSchemaVersion44,
  updateToSchemaVersion45,
  updateToSchemaVersion46,
  updateToSchemaVersion47,
  updateToSchemaVersion48,
  updateToSchemaVersion49,
  updateToSchemaVersion50,
  updateToSchemaVersion51
];
function updateSchema(db, logger3) {
  const sqliteVersion = getSQLiteVersion(db);
  const sqlcipherVersion = getSQLCipherVersion(db);
  const userVersion = getUserVersion(db);
  const maxUserVersion = SCHEMA_VERSIONS.length;
  const schemaVersion = getSchemaVersion(db);
  logger3.info("updateSchema:\n", ` Current user_version: ${userVersion};
`, ` Most recent db schema: ${maxUserVersion};
`, ` SQLite version: ${sqliteVersion};
`, ` SQLCipher version: ${sqlcipherVersion};
`, ` (deprecated) schema_version: ${schemaVersion};
`);
  if (userVersion > maxUserVersion) {
    throw new Error(`SQL: User version is ${userVersion} but the expected maximum version is ${maxUserVersion}. Did you try to start an old version of Signal?`);
  }
  for (let index = 0; index < maxUserVersion; index += 1) {
    const runSchemaUpdate = SCHEMA_VERSIONS[index];
    runSchemaUpdate(userVersion, db, logger3);
  }
}
__name(updateSchema, "updateSchema");

// ts/sql/Server.ts
var dataInterface = {
  close,
  removeDB,
  removeIndexedDBFiles,
  createOrUpdateIdentityKey,
  getIdentityKeyById,
  bulkAddIdentityKeys,
  removeIdentityKeyById,
  removeAllIdentityKeys,
  getAllIdentityKeys,
  createOrUpdatePreKey,
  getPreKeyById,
  bulkAddPreKeys,
  removePreKeyById,
  removeAllPreKeys,
  getAllPreKeys,
  createOrUpdateSignedPreKey,
  getSignedPreKeyById,
  bulkAddSignedPreKeys,
  removeSignedPreKeyById,
  removeAllSignedPreKeys,
  getAllSignedPreKeys,
  createOrUpdateItem,
  getItemById,
  removeItemById,
  removeAllItems,
  getAllItems,
  createOrUpdateSenderKey,
  getSenderKeyById,
  removeAllSenderKeys,
  getAllSenderKeys,
  removeSenderKeyById,
  insertSentProto,
  deleteSentProtosOlderThan,
  deleteSentProtoByMessageId,
  insertProtoRecipients,
  deleteSentProtoRecipient,
  getSentProtoByRecipient,
  removeAllSentProtos,
  getAllSentProtos,
  _getAllSentProtoRecipients,
  _getAllSentProtoMessageIds,
  createOrUpdateSession,
  createOrUpdateSessions,
  commitDecryptResult,
  bulkAddSessions,
  removeSessionById,
  removeSessionsByConversation,
  removeAllSessions,
  getAllSessions,
  eraseStorageServiceStateFromConversations,
  getConversationCount,
  saveConversation,
  saveConversations,
  getConversationById,
  updateConversation,
  updateConversations,
  removeConversation,
  updateAllConversationColors,
  getAllConversations,
  getAllConversationIds,
  getAllGroupsInvolvingUuid,
  searchConversations,
  searchMessages,
  searchMessagesInConversation,
  getMessageCount,
  saveMessage,
  saveMessages,
  removeMessage,
  removeMessages,
  getUnreadByConversationAndMarkRead,
  getUnreadReactionsAndMarkRead,
  markReactionAsRead,
  addReaction,
  removeReactionFromConversation,
  _getAllReactions,
  _removeAllReactions,
  getMessageBySender,
  getMessageById,
  getMessagesById,
  _getAllMessages,
  _removeAllMessages,
  getAllMessageIds,
  getMessagesBySentAt,
  getExpiredMessages,
  getMessagesUnexpectedlyMissingExpirationStartTimestamp,
  getSoonestMessageExpiry,
  getNextTapToViewMessageTimestampToAgeOut,
  getTapToViewMessagesNeedingErase,
  getOlderMessagesByConversation,
  getOlderStories,
  getNewerMessagesByConversation,
  getTotalUnreadForConversation,
  getMessageMetricsForConversation,
  getConversationRangeCenteredOnMessage,
  getLastConversationMessages,
  hasGroupCallHistoryMessage,
  migrateConversationMessages,
  getUnprocessedCount,
  getAllUnprocessed,
  updateUnprocessedWithData,
  updateUnprocessedsWithData,
  getUnprocessedById,
  removeUnprocessed,
  removeAllUnprocessed,
  getNextAttachmentDownloadJobs,
  saveAttachmentDownloadJob,
  resetAttachmentDownloadPending,
  setAttachmentDownloadJobPending,
  removeAttachmentDownloadJob,
  removeAllAttachmentDownloadJobs,
  createOrUpdateStickerPack,
  updateStickerPackStatus,
  createOrUpdateSticker,
  updateStickerLastUsed,
  addStickerPackReference,
  deleteStickerPackReference,
  getStickerCount,
  deleteStickerPack,
  getAllStickerPacks,
  getAllStickers,
  getRecentStickers,
  clearAllErrorStickerPackAttempts,
  updateEmojiUsage,
  getRecentEmojis,
  getAllBadges,
  updateOrCreateBadges,
  badgeImageFileDownloaded,
  _getAllStoryDistributions,
  _getAllStoryDistributionMembers,
  _deleteAllStoryDistributions,
  createNewStoryDistribution,
  getAllStoryDistributionsWithMembers,
  getStoryDistributionWithMembers,
  modifyStoryDistribution,
  modifyStoryDistributionMembers,
  deleteStoryDistribution,
  _getAllStoryReads,
  _deleteAllStoryReads,
  addNewStoryRead,
  getLastStoryReadsForAuthor,
  removeAll,
  removeAllConfiguration,
  getMessagesNeedingUpgrade,
  getMessagesWithVisualMediaAttachments,
  getMessagesWithFileAttachments,
  getMessageServerGuidsForSpam,
  getJobsInQueue,
  insertJob,
  deleteJob,
  processGroupCallRingRequest,
  processGroupCallRingCancelation,
  cleanExpiredGroupCallRings,
  getMaxMessageCounter,
  getStatisticsForLogging,
  getCorruptionLog,
  initialize,
  initializeRenderer,
  removeKnownAttachments,
  removeKnownStickers,
  removeKnownDraftAttachments,
  getAllBadgeImageFileLocalPaths
};
var Server_default = dataInterface;
var statementCache = new WeakMap();
function prepare(db, query) {
  let dbCache = statementCache.get(db);
  if (!dbCache) {
    dbCache = /* @__PURE__ */ new Map();
    statementCache.set(db, dbCache);
  }
  let result = dbCache.get(query);
  if (!result) {
    result = db.prepare(query);
    dbCache.set(query, result);
  }
  return result;
}
__name(prepare, "prepare");
function rowToConversation(row) {
  const parsedJson = JSON.parse(row.json);
  let profileLastFetchedAt;
  if (isNormalNumber(row.profileLastFetchedAt)) {
    profileLastFetchedAt = row.profileLastFetchedAt;
  } else {
    assert((0, import_lodash5.isNil)(row.profileLastFetchedAt), "profileLastFetchedAt contained invalid data; defaulting to undefined");
    profileLastFetchedAt = void 0;
  }
  return __spreadProps(__spreadValues({}, parsedJson), {
    profileLastFetchedAt
  });
}
__name(rowToConversation, "rowToConversation");
function rowToSticker(row) {
  return __spreadProps(__spreadValues({}, row), {
    isCoverOnly: Boolean(row.isCoverOnly),
    emoji: dropNull(row.emoji)
  });
}
__name(rowToSticker, "rowToSticker");
function isRenderer() {
  if (typeof process === "undefined" || !process) {
    return true;
  }
  return process.type === "renderer";
}
__name(isRenderer, "isRenderer");
function keyDatabase(db, key) {
  db.pragma(`key = "x'${key}'"`);
}
__name(keyDatabase, "keyDatabase");
function switchToWAL(db) {
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = FULL");
}
__name(switchToWAL, "switchToWAL");
function migrateSchemaVersion(db) {
  const userVersion = getUserVersion(db);
  if (userVersion > 0) {
    return;
  }
  const schemaVersion = getSchemaVersion(db);
  const newUserVersion = schemaVersion > 18 ? 16 : schemaVersion;
  logger.info(`migrateSchemaVersion: Migrating from schema_version ${schemaVersion} to user_version ${newUserVersion}`);
  setUserVersion(db, newUserVersion);
}
__name(migrateSchemaVersion, "migrateSchemaVersion");
function openAndMigrateDatabase(filePath, key) {
  let db;
  try {
    db = new import_better_sqlite3.default(filePath);
    keyDatabase(db, key);
    switchToWAL(db);
    migrateSchemaVersion(db);
    return db;
  } catch (error2) {
    if (db) {
      db.close();
    }
    logger.info("migrateDatabase: Migration without cipher change failed");
  }
  db = new import_better_sqlite3.default(filePath);
  keyDatabase(db, key);
  db.pragma("cipher_compatibility = 3");
  migrateSchemaVersion(db);
  db.close();
  db = new import_better_sqlite3.default(filePath);
  keyDatabase(db, key);
  db.pragma("cipher_migrate");
  switchToWAL(db);
  return db;
}
__name(openAndMigrateDatabase, "openAndMigrateDatabase");
var INVALID_KEY = /[^0-9A-Fa-f]/;
function openAndSetUpSQLCipher(filePath, { key }) {
  const match = INVALID_KEY.exec(key);
  if (match) {
    throw new Error(`setupSQLCipher: key '${key}' is not valid`);
  }
  const db = openAndMigrateDatabase(filePath, key);
  db.pragma("foreign_keys = ON");
  return db;
}
__name(openAndSetUpSQLCipher, "openAndSetUpSQLCipher");
var globalInstance;
var logger = consoleLogger;
var globalInstanceRenderer;
var databaseFilePath;
var indexedDBPath;
var corruptionLog = new Array();
import_better_sqlite3.default.setCorruptionLogger((line) => {
  logger.error(`SQL corruption: ${line}`);
  corruptionLog.push(line);
});
function getCorruptionLog() {
  const result = corruptionLog.join("\n");
  corruptionLog = [];
  return result;
}
__name(getCorruptionLog, "getCorruptionLog");
async function initialize({
  configDir,
  key,
  logger: suppliedLogger
}) {
  if (globalInstance) {
    throw new Error("Cannot initialize more than once!");
  }
  if (!(0, import_lodash5.isString)(configDir)) {
    throw new Error("initialize: configDir is required!");
  }
  if (!(0, import_lodash5.isString)(key)) {
    throw new Error("initialize: key is required!");
  }
  logger = suppliedLogger;
  indexedDBPath = (0, import_path.join)(configDir, "IndexedDB");
  const dbDir = (0, import_path.join)(configDir, "sql");
  import_mkdirp.default.sync(dbDir);
  databaseFilePath = (0, import_path.join)(dbDir, "db.sqlite");
  let db;
  try {
    db = openAndSetUpSQLCipher(databaseFilePath, { key });
    updateSchema(db, logger);
    globalInstance = db;
    getMessageCountSync();
  } catch (error2) {
    logger.error("Database startup error:", error2.stack);
    if (db) {
      db.close();
    }
    throw error2;
  }
}
__name(initialize, "initialize");
async function initializeRenderer({
  configDir,
  key
}) {
  if (!isRenderer()) {
    throw new Error("Cannot call from main process.");
  }
  if (globalInstanceRenderer) {
    throw new Error("Cannot initialize more than once!");
  }
  if (!(0, import_lodash5.isString)(configDir)) {
    throw new Error("initialize: configDir is required!");
  }
  if (!(0, import_lodash5.isString)(key)) {
    throw new Error("initialize: key is required!");
  }
  if (!indexedDBPath) {
    indexedDBPath = (0, import_path.join)(configDir, "IndexedDB");
  }
  const dbDir = (0, import_path.join)(configDir, "sql");
  if (!databaseFilePath) {
    databaseFilePath = (0, import_path.join)(dbDir, "db.sqlite");
  }
  let promisified;
  try {
    promisified = openAndSetUpSQLCipher(databaseFilePath, { key });
    globalInstanceRenderer = promisified;
    getMessageCountSync();
  } catch (error2) {
    error("Database startup error:", error2.stack);
    throw error2;
  }
}
__name(initializeRenderer, "initializeRenderer");
async function close() {
  for (const dbRef of [globalInstanceRenderer, globalInstance]) {
    dbRef == null ? void 0 : dbRef.pragma("optimize");
    dbRef == null ? void 0 : dbRef.close();
  }
  globalInstance = void 0;
  globalInstanceRenderer = void 0;
}
__name(close, "close");
async function removeDB() {
  if (globalInstance) {
    try {
      globalInstance.close();
    } catch (error2) {
      logger.error("removeDB: Failed to close database:", error2.stack);
    }
    globalInstance = void 0;
  }
  if (!databaseFilePath) {
    throw new Error("removeDB: Cannot erase database without a databaseFilePath!");
  }
  import_rimraf.default.sync(databaseFilePath);
  import_rimraf.default.sync(`${databaseFilePath}-shm`);
  import_rimraf.default.sync(`${databaseFilePath}-wal`);
}
__name(removeDB, "removeDB");
async function removeIndexedDBFiles() {
  if (!indexedDBPath) {
    throw new Error("removeIndexedDBFiles: Need to initialize and set indexedDBPath first!");
  }
  const pattern = (0, import_path.join)(indexedDBPath, "*.leveldb");
  import_rimraf.default.sync(pattern);
  indexedDBPath = void 0;
}
__name(removeIndexedDBFiles, "removeIndexedDBFiles");
function getInstance() {
  if (isRenderer()) {
    if (!globalInstanceRenderer) {
      throw new Error("getInstance: globalInstanceRenderer not set!");
    }
    return globalInstanceRenderer;
  }
  if (!globalInstance) {
    throw new Error("getInstance: globalInstance not set!");
  }
  return globalInstance;
}
__name(getInstance, "getInstance");
var IDENTITY_KEYS_TABLE = "identityKeys";
async function createOrUpdateIdentityKey(data) {
  return createOrUpdate(getInstance(), IDENTITY_KEYS_TABLE, data);
}
__name(createOrUpdateIdentityKey, "createOrUpdateIdentityKey");
async function getIdentityKeyById(id) {
  return getById(getInstance(), IDENTITY_KEYS_TABLE, id);
}
__name(getIdentityKeyById, "getIdentityKeyById");
async function bulkAddIdentityKeys(array) {
  return bulkAdd(getInstance(), IDENTITY_KEYS_TABLE, array);
}
__name(bulkAddIdentityKeys, "bulkAddIdentityKeys");
async function removeIdentityKeyById(id) {
  return removeById(getInstance(), IDENTITY_KEYS_TABLE, id);
}
__name(removeIdentityKeyById, "removeIdentityKeyById");
async function removeAllIdentityKeys() {
  return removeAllFromTable(getInstance(), IDENTITY_KEYS_TABLE);
}
__name(removeAllIdentityKeys, "removeAllIdentityKeys");
async function getAllIdentityKeys() {
  return getAllFromTable(getInstance(), IDENTITY_KEYS_TABLE);
}
__name(getAllIdentityKeys, "getAllIdentityKeys");
var PRE_KEYS_TABLE = "preKeys";
async function createOrUpdatePreKey(data) {
  return createOrUpdate(getInstance(), PRE_KEYS_TABLE, data);
}
__name(createOrUpdatePreKey, "createOrUpdatePreKey");
async function getPreKeyById(id) {
  return getById(getInstance(), PRE_KEYS_TABLE, id);
}
__name(getPreKeyById, "getPreKeyById");
async function bulkAddPreKeys(array) {
  return bulkAdd(getInstance(), PRE_KEYS_TABLE, array);
}
__name(bulkAddPreKeys, "bulkAddPreKeys");
async function removePreKeyById(id) {
  return removeById(getInstance(), PRE_KEYS_TABLE, id);
}
__name(removePreKeyById, "removePreKeyById");
async function removeAllPreKeys() {
  return removeAllFromTable(getInstance(), PRE_KEYS_TABLE);
}
__name(removeAllPreKeys, "removeAllPreKeys");
async function getAllPreKeys() {
  return getAllFromTable(getInstance(), PRE_KEYS_TABLE);
}
__name(getAllPreKeys, "getAllPreKeys");
var SIGNED_PRE_KEYS_TABLE = "signedPreKeys";
async function createOrUpdateSignedPreKey(data) {
  return createOrUpdate(getInstance(), SIGNED_PRE_KEYS_TABLE, data);
}
__name(createOrUpdateSignedPreKey, "createOrUpdateSignedPreKey");
async function getSignedPreKeyById(id) {
  return getById(getInstance(), SIGNED_PRE_KEYS_TABLE, id);
}
__name(getSignedPreKeyById, "getSignedPreKeyById");
async function bulkAddSignedPreKeys(array) {
  return bulkAdd(getInstance(), SIGNED_PRE_KEYS_TABLE, array);
}
__name(bulkAddSignedPreKeys, "bulkAddSignedPreKeys");
async function removeSignedPreKeyById(id) {
  return removeById(getInstance(), SIGNED_PRE_KEYS_TABLE, id);
}
__name(removeSignedPreKeyById, "removeSignedPreKeyById");
async function removeAllSignedPreKeys() {
  return removeAllFromTable(getInstance(), SIGNED_PRE_KEYS_TABLE);
}
__name(removeAllSignedPreKeys, "removeAllSignedPreKeys");
async function getAllSignedPreKeys() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM signedPreKeys
      ORDER BY id ASC;
      `).all();
  return rows.map((row) => jsonToObject(row.json));
}
__name(getAllSignedPreKeys, "getAllSignedPreKeys");
var ITEMS_TABLE = "items";
async function createOrUpdateItem(data) {
  return createOrUpdate(getInstance(), ITEMS_TABLE, data);
}
__name(createOrUpdateItem, "createOrUpdateItem");
async function getItemById(id) {
  return getById(getInstance(), ITEMS_TABLE, id);
}
__name(getItemById, "getItemById");
async function getAllItems() {
  const db = getInstance();
  const rows = db.prepare("SELECT json FROM items ORDER BY id ASC;").all();
  const items = rows.map((row) => jsonToObject(row.json));
  const result = Object.create(null);
  for (const { id, value } of items) {
    result[id] = value;
  }
  return result;
}
__name(getAllItems, "getAllItems");
async function removeItemById(id) {
  return removeById(getInstance(), ITEMS_TABLE, id);
}
__name(removeItemById, "removeItemById");
async function removeAllItems() {
  return removeAllFromTable(getInstance(), ITEMS_TABLE);
}
__name(removeAllItems, "removeAllItems");
async function createOrUpdateSenderKey(key) {
  createOrUpdateSenderKeySync(key);
}
__name(createOrUpdateSenderKey, "createOrUpdateSenderKey");
function createOrUpdateSenderKeySync(key) {
  const db = getInstance();
  prepare(db, `
    INSERT OR REPLACE INTO senderKeys (
      id,
      senderId,
      distributionId,
      data,
      lastUpdatedDate
    ) values (
      $id,
      $senderId,
      $distributionId,
      $data,
      $lastUpdatedDate
    )
    `).run(key);
}
__name(createOrUpdateSenderKeySync, "createOrUpdateSenderKeySync");
async function getSenderKeyById(id) {
  const db = getInstance();
  const row = prepare(db, "SELECT * FROM senderKeys WHERE id = $id").get({
    id
  });
  return row;
}
__name(getSenderKeyById, "getSenderKeyById");
async function removeAllSenderKeys() {
  const db = getInstance();
  prepare(db, "DELETE FROM senderKeys").run();
}
__name(removeAllSenderKeys, "removeAllSenderKeys");
async function getAllSenderKeys() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM senderKeys").all();
  return rows;
}
__name(getAllSenderKeys, "getAllSenderKeys");
async function removeSenderKeyById(id) {
  const db = getInstance();
  prepare(db, "DELETE FROM senderKeys WHERE id = $id").run({ id });
}
__name(removeSenderKeyById, "removeSenderKeyById");
async function insertSentProto(proto, options) {
  const db = getInstance();
  const { recipients, messageIds } = options;
  return db.transaction(() => {
    const info = prepare(db, `
      INSERT INTO sendLogPayloads (
        contentHint,
        proto,
        timestamp
      ) VALUES (
        $contentHint,
        $proto,
        $timestamp
      );
      `).run(proto);
    const id = parseIntOrThrow(info.lastInsertRowid, "insertSentProto/lastInsertRowid");
    const recipientStatement = prepare(db, `
      INSERT INTO sendLogRecipients (
        payloadId,
        recipientUuid,
        deviceId
      ) VALUES (
        $id,
        $recipientUuid,
        $deviceId
      );
      `);
    const recipientUuids = Object.keys(recipients);
    for (const recipientUuid of recipientUuids) {
      const deviceIds = recipients[recipientUuid];
      for (const deviceId of deviceIds) {
        recipientStatement.run({
          id,
          recipientUuid,
          deviceId
        });
      }
    }
    const messageStatement = prepare(db, `
      INSERT INTO sendLogMessageIds (
        payloadId,
        messageId
      ) VALUES (
        $id,
        $messageId
      );
      `);
    for (const messageId of messageIds) {
      messageStatement.run({
        id,
        messageId
      });
    }
    return id;
  })();
}
__name(insertSentProto, "insertSentProto");
async function deleteSentProtosOlderThan(timestamp) {
  const db = getInstance();
  prepare(db, `
    DELETE FROM sendLogPayloads
    WHERE
      timestamp IS NULL OR
      timestamp < $timestamp;
    `).run({
    timestamp
  });
}
__name(deleteSentProtosOlderThan, "deleteSentProtosOlderThan");
async function deleteSentProtoByMessageId(messageId) {
  const db = getInstance();
  prepare(db, `
    DELETE FROM sendLogPayloads WHERE id IN (
      SELECT payloadId FROM sendLogMessageIds
      WHERE messageId = $messageId
    );
    `).run({
    messageId
  });
}
__name(deleteSentProtoByMessageId, "deleteSentProtoByMessageId");
async function insertProtoRecipients({
  id,
  recipientUuid,
  deviceIds
}) {
  const db = getInstance();
  db.transaction(() => {
    const statement = prepare(db, `
      INSERT INTO sendLogRecipients (
        payloadId,
        recipientUuid,
        deviceId
      ) VALUES (
        $id,
        $recipientUuid,
        $deviceId
      );
      `);
    for (const deviceId of deviceIds) {
      statement.run({
        id,
        recipientUuid,
        deviceId
      });
    }
  })();
}
__name(insertProtoRecipients, "insertProtoRecipients");
async function deleteSentProtoRecipient(options) {
  const db = getInstance();
  const items = Array.isArray(options) ? options : [options];
  db.transaction(() => {
    for (const item of items) {
      const { timestamp, recipientUuid, deviceId } = item;
      const rows = prepare(db, `
        SELECT sendLogPayloads.id FROM sendLogPayloads
        INNER JOIN sendLogRecipients
          ON sendLogRecipients.payloadId = sendLogPayloads.id
        WHERE
          sendLogPayloads.timestamp = $timestamp AND
          sendLogRecipients.recipientUuid = $recipientUuid AND
          sendLogRecipients.deviceId = $deviceId;
       `).all({ timestamp, recipientUuid, deviceId });
      if (!rows.length) {
        continue;
      }
      if (rows.length > 1) {
        logger.warn(`deleteSentProtoRecipient: More than one payload matches recipient and timestamp ${timestamp}. Using the first.`);
        continue;
      }
      const { id } = rows[0];
      prepare(db, `
        DELETE FROM sendLogRecipients
        WHERE
          payloadId = $id AND
          recipientUuid = $recipientUuid AND
          deviceId = $deviceId;
        `).run({ id, recipientUuid, deviceId });
      const remaining = prepare(db, "SELECT count(*) FROM sendLogRecipients WHERE payloadId = $id;").pluck(true).get({ id });
      if (!(0, import_lodash5.isNumber)(remaining)) {
        throw new Error("deleteSentProtoRecipient: select count() returned non-number!");
      }
      if (remaining > 0) {
        continue;
      }
      logger.info(`deleteSentProtoRecipient: Deleting proto payload for timestamp ${timestamp}`);
      prepare(db, "DELETE FROM sendLogPayloads WHERE id = $id;").run({
        id
      });
    }
  })();
}
__name(deleteSentProtoRecipient, "deleteSentProtoRecipient");
async function getSentProtoByRecipient({
  now,
  recipientUuid,
  timestamp
}) {
  const db = getInstance();
  const HOUR2 = 1e3 * 60 * 60;
  const oneDayAgo = now - HOUR2 * 24;
  await deleteSentProtosOlderThan(oneDayAgo);
  const row = prepare(db, `
    SELECT
      sendLogPayloads.*,
      GROUP_CONCAT(DISTINCT sendLogMessageIds.messageId) AS messageIds
    FROM sendLogPayloads
    INNER JOIN sendLogRecipients ON sendLogRecipients.payloadId = sendLogPayloads.id
    LEFT JOIN sendLogMessageIds ON sendLogMessageIds.payloadId = sendLogPayloads.id
    WHERE
      sendLogPayloads.timestamp = $timestamp AND
      sendLogRecipients.recipientUuid = $recipientUuid
    GROUP BY sendLogPayloads.id;
    `).get({
    timestamp,
    recipientUuid
  });
  if (!row) {
    return void 0;
  }
  const { messageIds } = row;
  return __spreadProps(__spreadValues({}, row), {
    messageIds: messageIds ? messageIds.split(",") : []
  });
}
__name(getSentProtoByRecipient, "getSentProtoByRecipient");
async function removeAllSentProtos() {
  const db = getInstance();
  prepare(db, "DELETE FROM sendLogPayloads;").run();
}
__name(removeAllSentProtos, "removeAllSentProtos");
async function getAllSentProtos() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogPayloads;").all();
  return rows;
}
__name(getAllSentProtos, "getAllSentProtos");
async function _getAllSentProtoRecipients() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogRecipients;").all();
  return rows;
}
__name(_getAllSentProtoRecipients, "_getAllSentProtoRecipients");
async function _getAllSentProtoMessageIds() {
  const db = getInstance();
  const rows = prepare(db, "SELECT * FROM sendLogMessageIds;").all();
  return rows;
}
__name(_getAllSentProtoMessageIds, "_getAllSentProtoMessageIds");
var SESSIONS_TABLE = "sessions";
function createOrUpdateSessionSync(data) {
  const db = getInstance();
  const { id, conversationId, ourUuid, uuid } = data;
  if (!id) {
    throw new Error("createOrUpdateSession: Provided data did not have a truthy id");
  }
  if (!conversationId) {
    throw new Error("createOrUpdateSession: Provided data did not have a truthy conversationId");
  }
  prepare(db, `
    INSERT OR REPLACE INTO sessions (
      id,
      conversationId,
      ourUuid,
      uuid,
      json
    ) values (
      $id,
      $conversationId,
      $ourUuid,
      $uuid,
      $json
    )
    `).run({
    id,
    conversationId,
    ourUuid,
    uuid,
    json: objectToJSON(data)
  });
}
__name(createOrUpdateSessionSync, "createOrUpdateSessionSync");
async function createOrUpdateSession(data) {
  return createOrUpdateSessionSync(data);
}
__name(createOrUpdateSession, "createOrUpdateSession");
async function createOrUpdateSessions(array) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of array) {
      assertSync(createOrUpdateSessionSync(item));
    }
  })();
}
__name(createOrUpdateSessions, "createOrUpdateSessions");
async function commitDecryptResult({
  senderKeys,
  sessions,
  unprocessed
}) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of senderKeys) {
      assertSync(createOrUpdateSenderKeySync(item));
    }
    for (const item of sessions) {
      assertSync(createOrUpdateSessionSync(item));
    }
    for (const item of unprocessed) {
      assertSync(saveUnprocessedSync(item));
    }
  })();
}
__name(commitDecryptResult, "commitDecryptResult");
async function bulkAddSessions(array) {
  return bulkAdd(getInstance(), SESSIONS_TABLE, array);
}
__name(bulkAddSessions, "bulkAddSessions");
async function removeSessionById(id) {
  return removeById(getInstance(), SESSIONS_TABLE, id);
}
__name(removeSessionById, "removeSessionById");
async function removeSessionsByConversation(conversationId) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM sessions
    WHERE conversationId = $conversationId;
    `).run({
    conversationId
  });
}
__name(removeSessionsByConversation, "removeSessionsByConversation");
async function removeAllSessions() {
  return removeAllFromTable(getInstance(), SESSIONS_TABLE);
}
__name(removeAllSessions, "removeAllSessions");
async function getAllSessions() {
  return getAllFromTable(getInstance(), SESSIONS_TABLE);
}
__name(getAllSessions, "getAllSessions");
async function getConversationCount() {
  return getCountFromTable(getInstance(), "conversations");
}
__name(getConversationCount, "getConversationCount");
function getConversationMembersList({ members, membersV2 }) {
  if (membersV2) {
    return membersV2.map((item) => item.uuid).join(" ");
  }
  if (members) {
    return members.join(" ");
  }
  return null;
}
__name(getConversationMembersList, "getConversationMembersList");
function saveConversationSync(data, db = getInstance()) {
  const {
    active_at,
    e164,
    groupId,
    id,
    name,
    profileFamilyName,
    profileName,
    profileLastFetchedAt,
    type,
    uuid
  } = data;
  const membersList = getConversationMembersList(data);
  db.prepare(`
    INSERT INTO conversations (
      id,
      json,

      e164,
      uuid,
      groupId,

      active_at,
      type,
      members,
      name,
      profileName,
      profileFamilyName,
      profileFullName,
      profileLastFetchedAt
    ) values (
      $id,
      $json,

      $e164,
      $uuid,
      $groupId,

      $active_at,
      $type,
      $members,
      $name,
      $profileName,
      $profileFamilyName,
      $profileFullName,
      $profileLastFetchedAt
    );
    `).run({
    id,
    json: objectToJSON((0, import_lodash5.omit)(data, ["profileLastFetchedAt", "unblurredAvatarPath"])),
    e164: e164 || null,
    uuid: uuid || null,
    groupId: groupId || null,
    active_at: active_at || null,
    type,
    members: membersList,
    name: name || null,
    profileName: profileName || null,
    profileFamilyName: profileFamilyName || null,
    profileFullName: combineNames(profileName, profileFamilyName) || null,
    profileLastFetchedAt: profileLastFetchedAt || null
  });
}
__name(saveConversationSync, "saveConversationSync");
async function saveConversation(data, db = getInstance()) {
  return saveConversationSync(data, db);
}
__name(saveConversation, "saveConversation");
async function saveConversations(arrayOfConversations) {
  const db = getInstance();
  db.transaction(() => {
    for (const conversation of arrayOfConversations) {
      assertSync(saveConversationSync(conversation));
    }
  })();
}
__name(saveConversations, "saveConversations");
function updateConversationSync(data, db = getInstance()) {
  const {
    id,
    active_at,
    type,
    name,
    profileName,
    profileFamilyName,
    profileLastFetchedAt,
    e164,
    uuid
  } = data;
  const membersList = getConversationMembersList(data);
  db.prepare(`
    UPDATE conversations SET
      json = $json,

      e164 = $e164,
      uuid = $uuid,

      active_at = $active_at,
      type = $type,
      members = $members,
      name = $name,
      profileName = $profileName,
      profileFamilyName = $profileFamilyName,
      profileFullName = $profileFullName,
      profileLastFetchedAt = $profileLastFetchedAt
    WHERE id = $id;
    `).run({
    id,
    json: objectToJSON((0, import_lodash5.omit)(data, ["profileLastFetchedAt", "unblurredAvatarPath"])),
    e164: e164 || null,
    uuid: uuid || null,
    active_at: active_at || null,
    type,
    members: membersList,
    name: name || null,
    profileName: profileName || null,
    profileFamilyName: profileFamilyName || null,
    profileFullName: combineNames(profileName, profileFamilyName) || null,
    profileLastFetchedAt: profileLastFetchedAt || null
  });
}
__name(updateConversationSync, "updateConversationSync");
async function updateConversation(data) {
  return updateConversationSync(data);
}
__name(updateConversation, "updateConversation");
async function updateConversations(array) {
  const db = getInstance();
  db.transaction(() => {
    for (const item of array) {
      assertSync(updateConversationSync(item));
    }
  })();
}
__name(updateConversations, "updateConversations");
function removeConversationsSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM conversations
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
__name(removeConversationsSync, "removeConversationsSync");
async function removeConversation(id) {
  const db = getInstance();
  if (!Array.isArray(id)) {
    db.prepare("DELETE FROM conversations WHERE id = $id;").run({
      id
    });
    return;
  }
  if (!id.length) {
    throw new Error("removeConversation: No ids to delete!");
  }
  batchMultiVarQuery(db, id, removeConversationsSync);
}
__name(removeConversation, "removeConversation");
async function getConversationById(id) {
  const db = getInstance();
  const row = db.prepare("SELECT json FROM conversations WHERE id = $id;").get({ id });
  if (!row) {
    return void 0;
  }
  return jsonToObject(row.json);
}
__name(getConversationById, "getConversationById");
async function eraseStorageServiceStateFromConversations() {
  const db = getInstance();
  db.prepare(`
    UPDATE conversations
    SET
      json = json_remove(json, '$.storageID', '$.needsStorageServiceSync', '$.unknownFields', '$.storageProfileKey');
    `).run();
}
__name(eraseStorageServiceStateFromConversations, "eraseStorageServiceStateFromConversations");
function getAllConversationsSync(db = getInstance()) {
  const rows = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations
      ORDER BY id ASC;
      `).all();
  return rows.map((row) => rowToConversation(row));
}
__name(getAllConversationsSync, "getAllConversationsSync");
async function getAllConversations() {
  return getAllConversationsSync();
}
__name(getAllConversations, "getAllConversations");
async function getAllConversationIds() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT id FROM conversations ORDER BY id ASC;
      `).all();
  return rows.map((row) => row.id);
}
__name(getAllConversationIds, "getAllConversationIds");
async function getAllGroupsInvolvingUuid(uuid) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations WHERE
        type = 'group' AND
        members LIKE $uuid
      ORDER BY id ASC;
      `).all({
    uuid: `%${uuid}%`
  });
  return rows.map((row) => rowToConversation(row));
}
__name(getAllGroupsInvolvingUuid, "getAllGroupsInvolvingUuid");
async function searchConversations(query, { limit } = {}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json, profileLastFetchedAt
      FROM conversations WHERE
        (
          e164 LIKE $query OR
          name LIKE $query OR
          profileFullName LIKE $query
        )
      ORDER BY active_at DESC
      LIMIT $limit
      `).all({
    query: `%${query}%`,
    limit: limit || 100
  });
  return rows.map((row) => rowToConversation(row));
}
__name(searchConversations, "searchConversations");
async function searchMessages(query, params = {}) {
  const { limit = 500, conversationId } = params;
  const db = getInstance();
  return db.transaction(() => {
    db.exec(`
      CREATE TEMP TABLE tmp_results(rowid INTEGER PRIMARY KEY ASC);
      CREATE TEMP TABLE tmp_filtered_results(rowid INTEGER PRIMARY KEY ASC);
      `);
    db.prepare(`
        INSERT INTO tmp_results (rowid)
        SELECT
          rowid
        FROM
          messages_fts
        WHERE
          messages_fts.body MATCH $query;
      `).run({ query });
    if (conversationId === void 0) {
      db.prepare(`
          INSERT INTO tmp_filtered_results (rowid)
          SELECT
            tmp_results.rowid
          FROM
            tmp_results
          INNER JOIN
            messages ON messages.rowid = tmp_results.rowid
          ORDER BY messages.received_at DESC, messages.sent_at DESC
          LIMIT $limit;
        `).run({ limit });
    } else {
      db.prepare(`
          INSERT INTO tmp_filtered_results (rowid)
          SELECT
            tmp_results.rowid
          FROM
            tmp_results
          INNER JOIN
            messages ON messages.rowid = tmp_results.rowid
          WHERE
            messages.conversationId = $conversationId
          ORDER BY messages.received_at DESC, messages.sent_at DESC
          LIMIT $limit;
        `).run({ conversationId, limit });
    }
    const result = db.prepare(`
        SELECT
          messages.json,
          snippet(messages_fts, -1, '<<left>>', '<<right>>', '...', 10)
            AS snippet
        FROM tmp_filtered_results
        INNER JOIN messages_fts
          ON messages_fts.rowid = tmp_filtered_results.rowid
        INNER JOIN messages
          ON messages.rowid = tmp_filtered_results.rowid
        WHERE
          messages_fts.body MATCH $query
        ORDER BY messages.received_at DESC, messages.sent_at DESC;
        `).all({ query });
    db.exec(`
      DROP TABLE tmp_results;
      DROP TABLE tmp_filtered_results;
      `);
    return result;
  })();
}
__name(searchMessages, "searchMessages");
async function searchMessagesInConversation(query, conversationId, { limit = 100 } = {}) {
  return searchMessages(query, { conversationId, limit });
}
__name(searchMessagesInConversation, "searchMessagesInConversation");
function getMessageCountSync(conversationId, db = getInstance()) {
  if (conversationId === void 0) {
    return getCountFromTable(db, "messages");
  }
  const count = db.prepare(`
        SELECT count(*)
        FROM messages
        WHERE conversationId = $conversationId;
        `).pluck().get({ conversationId });
  return count;
}
__name(getMessageCountSync, "getMessageCountSync");
async function getMessageCount(conversationId) {
  return getMessageCountSync(conversationId);
}
__name(getMessageCount, "getMessageCount");
function hasUserInitiatedMessages(conversationId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT COUNT(*) as count FROM
        (
          SELECT 1 FROM messages
          WHERE
            conversationId = $conversationId AND
            isUserInitiatedMessage = 1
          LIMIT 1
        );
      `).get({ conversationId });
  return row.count !== 0;
}
__name(hasUserInitiatedMessages, "hasUserInitiatedMessages");
function saveMessageSync(data, options) {
  const {
    alreadyInTransaction,
    db = getInstance(),
    forceSave,
    jobToInsert,
    ourUuid
  } = options;
  if (!alreadyInTransaction) {
    return db.transaction(() => {
      return assertSync(saveMessageSync(data, __spreadProps(__spreadValues({}, options), {
        alreadyInTransaction: true
      })));
    })();
  }
  const {
    body,
    conversationId,
    groupV2Change,
    hasAttachments,
    hasFileAttachments,
    hasVisualMediaAttachments,
    id,
    isErased,
    isViewOnce,
    received_at,
    schemaVersion,
    sent_at,
    serverGuid,
    source,
    sourceUuid,
    sourceDevice,
    storyId,
    type,
    readStatus,
    expireTimer,
    expirationStartTimestamp
  } = data;
  const payload = {
    id,
    json: objectToJSON(data),
    body: body || null,
    conversationId,
    expirationStartTimestamp: expirationStartTimestamp || null,
    expireTimer: expireTimer || null,
    hasAttachments: hasAttachments ? 1 : 0,
    hasFileAttachments: hasFileAttachments ? 1 : 0,
    hasVisualMediaAttachments: hasVisualMediaAttachments ? 1 : 0,
    isChangeCreatedByUs: (groupV2Change == null ? void 0 : groupV2Change.from) === ourUuid ? 1 : 0,
    isErased: isErased ? 1 : 0,
    isViewOnce: isViewOnce ? 1 : 0,
    received_at: received_at || null,
    schemaVersion: schemaVersion || 0,
    serverGuid: serverGuid || null,
    sent_at: sent_at || null,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    storyId: storyId || null,
    type: type || null,
    readStatus: readStatus ?? null
  };
  if (id && !forceSave) {
    prepare(db, `
      UPDATE messages SET
        id = $id,
        json = $json,

        body = $body,
        conversationId = $conversationId,
        expirationStartTimestamp = $expirationStartTimestamp,
        expireTimer = $expireTimer,
        hasAttachments = $hasAttachments,
        hasFileAttachments = $hasFileAttachments,
        hasVisualMediaAttachments = $hasVisualMediaAttachments,
        isChangeCreatedByUs = $isChangeCreatedByUs,
        isErased = $isErased,
        isViewOnce = $isViewOnce,
        received_at = $received_at,
        schemaVersion = $schemaVersion,
        serverGuid = $serverGuid,
        sent_at = $sent_at,
        source = $source,
        sourceUuid = $sourceUuid,
        sourceDevice = $sourceDevice,
        storyId = $storyId,
        type = $type,
        readStatus = $readStatus
      WHERE id = $id;
      `).run(payload);
    if (jobToInsert) {
      insertJobSync(db, jobToInsert);
    }
    return id;
  }
  const toCreate = __spreadProps(__spreadValues({}, data), {
    id: id || UUID.generate().toString()
  });
  prepare(db, `
    INSERT INTO messages (
      id,
      json,

      body,
      conversationId,
      expirationStartTimestamp,
      expireTimer,
      hasAttachments,
      hasFileAttachments,
      hasVisualMediaAttachments,
      isChangeCreatedByUs,
      isErased,
      isViewOnce,
      received_at,
      schemaVersion,
      serverGuid,
      sent_at,
      source,
      sourceUuid,
      sourceDevice,
      storyId,
      type,
      readStatus
    ) values (
      $id,
      $json,

      $body,
      $conversationId,
      $expirationStartTimestamp,
      $expireTimer,
      $hasAttachments,
      $hasFileAttachments,
      $hasVisualMediaAttachments,
      $isChangeCreatedByUs,
      $isErased,
      $isViewOnce,
      $received_at,
      $schemaVersion,
      $serverGuid,
      $sent_at,
      $source,
      $sourceUuid,
      $sourceDevice,
      $storyId,
      $type,
      $readStatus
    );
    `).run(__spreadProps(__spreadValues({}, payload), {
    id: toCreate.id,
    json: objectToJSON(toCreate)
  }));
  if (jobToInsert) {
    insertJobSync(db, jobToInsert);
  }
  return toCreate.id;
}
__name(saveMessageSync, "saveMessageSync");
async function saveMessage(data, options) {
  return saveMessageSync(data, options);
}
__name(saveMessage, "saveMessage");
async function saveMessages(arrayOfMessages, options) {
  const db = getInstance();
  db.transaction(() => {
    for (const message of arrayOfMessages) {
      assertSync(saveMessageSync(message, __spreadProps(__spreadValues({}, options), { alreadyInTransaction: true })));
    }
  })();
}
__name(saveMessages, "saveMessages");
async function removeMessage(id) {
  const db = getInstance();
  db.prepare("DELETE FROM messages WHERE id = $id;").run({ id });
}
__name(removeMessage, "removeMessage");
function removeMessagesSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM messages
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
__name(removeMessagesSync, "removeMessagesSync");
async function removeMessages(ids) {
  batchMultiVarQuery(getInstance(), ids, removeMessagesSync);
}
__name(removeMessages, "removeMessages");
async function getMessageById(id) {
  const db = getInstance();
  return getMessageByIdSync(db, id);
}
__name(getMessageById, "getMessageById");
function getMessageByIdSync(db, id) {
  const row = db.prepare("SELECT json FROM messages WHERE id = $id;").get({
    id
  });
  if (!row) {
    return void 0;
  }
  return jsonToObject(row.json);
}
__name(getMessageByIdSync, "getMessageByIdSync");
async function getMessagesById(messageIds) {
  const db = getInstance();
  return batchMultiVarQuery(db, messageIds, (batch) => {
    const query = db.prepare(`SELECT json FROM messages WHERE id IN (${Array(batch.length).fill("?").join(",")});`);
    const rows = query.all(batch);
    return rows.map((row) => jsonToObject(row.json));
  });
}
__name(getMessagesById, "getMessagesById");
async function _getAllMessages() {
  const db = getInstance();
  const rows = db.prepare("SELECT json FROM messages ORDER BY id ASC;").all();
  return rows.map((row) => jsonToObject(row.json));
}
__name(_getAllMessages, "_getAllMessages");
async function _removeAllMessages() {
  const db = getInstance();
  db.prepare("DELETE from messages;").run();
}
__name(_removeAllMessages, "_removeAllMessages");
async function getAllMessageIds() {
  const db = getInstance();
  const rows = db.prepare("SELECT id FROM messages ORDER BY id ASC;").all();
  return rows.map((row) => row.id);
}
__name(getAllMessageIds, "getAllMessageIds");
async function getMessageBySender({
  source,
  sourceUuid,
  sourceDevice,
  sent_at
}) {
  const db = getInstance();
  const rows = prepare(db, `
    SELECT json FROM messages WHERE
      (source = $source OR sourceUuid = $sourceUuid) AND
      sourceDevice = $sourceDevice AND
      sent_at = $sent_at
    LIMIT 2;
    `).all({
    source,
    sourceUuid,
    sourceDevice,
    sent_at
  });
  if (rows.length > 1) {
    warn("getMessageBySender: More than one message found for", {
      sent_at,
      source,
      sourceUuid,
      sourceDevice
    });
  }
  if (rows.length < 1) {
    return void 0;
  }
  return jsonToObject(rows[0].json);
}
__name(getMessageBySender, "getMessageBySender");
async function getUnreadByConversationAndMarkRead({
  conversationId,
  newestUnreadAt,
  storyId,
  readAt
}) {
  const db = getInstance();
  return db.transaction(() => {
    const expirationStartTimestamp = Math.min(Date.now(), readAt ?? Infinity);
    db.prepare(`
      UPDATE messages
      INDEXED BY expiring_message_by_conversation_and_received_at
      SET
        expirationStartTimestamp = $expirationStartTimestamp,
        json = json_patch(json, $jsonPatch)
      WHERE
        (
          expirationStartTimestamp IS NULL OR
          expirationStartTimestamp > $expirationStartTimestamp
        ) AND
        expireTimer > 0 AND
        conversationId = $conversationId AND
        storyId IS $storyId AND
        received_at <= $newestUnreadAt;
      `).run({
      conversationId,
      expirationStartTimestamp,
      jsonPatch: JSON.stringify({ expirationStartTimestamp }),
      newestUnreadAt,
      storyId: storyId || null
    });
    const rows = db.prepare(`
        SELECT id, json FROM messages
        INDEXED BY messages_unread
        WHERE
          readStatus = ${ReadStatus.Unread} AND
          conversationId = $conversationId AND
          storyId IS $storyId AND
          received_at <= $newestUnreadAt
        ORDER BY received_at DESC, sent_at DESC;
        `).all({
      conversationId,
      newestUnreadAt,
      storyId: storyId || null
    });
    db.prepare(`
        UPDATE messages
        SET
          readStatus = ${ReadStatus.Read},
          json = json_patch(json, $jsonPatch)
        WHERE
          readStatus = ${ReadStatus.Unread} AND
          conversationId = $conversationId AND
          storyId IS $storyId AND
          received_at <= $newestUnreadAt;
        `).run({
      conversationId,
      jsonPatch: JSON.stringify({ readStatus: ReadStatus.Read }),
      newestUnreadAt,
      storyId: storyId || null
    });
    return rows.map((row) => {
      const json = jsonToObject(row.json);
      return __spreadValues({
        readStatus: ReadStatus.Read
      }, (0, import_lodash5.pick)(json, [
        "expirationStartTimestamp",
        "id",
        "sent_at",
        "source",
        "sourceUuid",
        "type"
      ]));
    });
  })();
}
__name(getUnreadByConversationAndMarkRead, "getUnreadByConversationAndMarkRead");
async function getUnreadReactionsAndMarkRead({
  conversationId,
  newestUnreadAt,
  storyId
}) {
  const db = getInstance();
  return db.transaction(() => {
    const unreadMessages = db.prepare(`
        SELECT reactions.rowid, targetAuthorUuid, targetTimestamp, messageId
        FROM reactions
        JOIN messages on messages.id IS reactions.messageId
        WHERE
          unread > 0 AND
          messages.conversationId IS $conversationId AND
          messages.received_at <= $newestUnreadAt AND
          messages.storyId IS $storyId
        ORDER BY messageReceivedAt DESC;
      `).all({
      conversationId,
      newestUnreadAt,
      storyId: storyId || null
    });
    const idsToUpdate = unreadMessages.map((item) => item.rowid);
    batchMultiVarQuery(db, idsToUpdate, (ids) => {
      db.prepare(`
        UPDATE reactions SET
        unread = 0 WHERE rowid IN ( ${ids.map(() => "?").join(", ")} );
        `).run(ids);
    });
    return unreadMessages;
  })();
}
__name(getUnreadReactionsAndMarkRead, "getUnreadReactionsAndMarkRead");
async function markReactionAsRead(targetAuthorUuid, targetTimestamp) {
  const db = getInstance();
  return db.transaction(() => {
    const readReaction = db.prepare(`
          SELECT *
          FROM reactions
          WHERE
            targetAuthorUuid = $targetAuthorUuid AND
            targetTimestamp = $targetTimestamp AND
            unread = 1
          ORDER BY rowId DESC
          LIMIT 1;
        `).get({
      targetAuthorUuid,
      targetTimestamp
    });
    db.prepare(`
        UPDATE reactions SET
        unread = 0 WHERE
        targetAuthorUuid = $targetAuthorUuid AND
        targetTimestamp = $targetTimestamp;
      `).run({
      targetAuthorUuid,
      targetTimestamp
    });
    return readReaction;
  })();
}
__name(markReactionAsRead, "markReactionAsRead");
async function addReaction({
  conversationId,
  emoji,
  fromId,
  messageId,
  messageReceivedAt,
  targetAuthorUuid,
  targetTimestamp
}) {
  const db = getInstance();
  await db.prepare(`INSERT INTO reactions (
      conversationId,
      emoji,
      fromId,
      messageId,
      messageReceivedAt,
      targetAuthorUuid,
      targetTimestamp,
      unread
    ) VALUES (
      $conversationId,
      $emoji,
      $fromId,
      $messageId,
      $messageReceivedAt,
      $targetAuthorUuid,
      $targetTimestamp,
      $unread
    );`).run({
    conversationId,
    emoji,
    fromId,
    messageId,
    messageReceivedAt,
    targetAuthorUuid,
    targetTimestamp,
    unread: 1
  });
}
__name(addReaction, "addReaction");
async function removeReactionFromConversation({
  emoji,
  fromId,
  targetAuthorUuid,
  targetTimestamp
}) {
  const db = getInstance();
  await db.prepare(`DELETE FROM reactions WHERE
      emoji = $emoji AND
      fromId = $fromId AND
      targetAuthorUuid = $targetAuthorUuid AND
      targetTimestamp = $targetTimestamp;`).run({
    emoji,
    fromId,
    targetAuthorUuid,
    targetTimestamp
  });
}
__name(removeReactionFromConversation, "removeReactionFromConversation");
async function _getAllReactions() {
  const db = getInstance();
  return db.prepare("SELECT * from reactions;").all();
}
__name(_getAllReactions, "_getAllReactions");
async function _removeAllReactions() {
  const db = getInstance();
  db.prepare("DELETE from reactions;").run();
}
__name(_removeAllReactions, "_removeAllReactions");
async function getOlderMessagesByConversation(conversationId, options) {
  return getOlderMessagesByConversationSync(conversationId, options);
}
__name(getOlderMessagesByConversation, "getOlderMessagesByConversation");
function getOlderMessagesByConversationSync(conversationId, {
  limit = 100,
  messageId,
  receivedAt = Number.MAX_VALUE,
  sentAt = Number.MAX_VALUE,
  storyId
} = {}) {
  const db = getInstance();
  return db.prepare(`
      SELECT json FROM messages WHERE
        conversationId = $conversationId AND
        ($messageId IS NULL OR id IS NOT $messageId) AND
        isStory IS 0 AND
        storyId IS $storyId AND
        (
          (received_at = $received_at AND sent_at < $sent_at) OR
          received_at < $received_at
        )
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit,
    messageId: messageId || null,
    received_at: receivedAt,
    sent_at: sentAt,
    storyId: storyId || null
  }).reverse();
}
__name(getOlderMessagesByConversationSync, "getOlderMessagesByConversationSync");
async function getOlderStories({
  conversationId,
  limit = 10,
  receivedAt = Number.MAX_VALUE,
  sentAt,
  sourceUuid
}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE
        type IS 'story' AND
        ($conversationId IS NULL OR conversationId IS $conversationId) AND
        ($sourceUuid IS NULL OR sourceUuid IS $sourceUuid) AND
        (received_at < $receivedAt
          OR (received_at IS $receivedAt AND sent_at < $sentAt)
        )
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId: conversationId || null,
    receivedAt,
    sentAt: sentAt || null,
    sourceUuid: sourceUuid || null,
    limit
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getOlderStories, "getOlderStories");
async function getNewerMessagesByConversation(conversationId, options) {
  return getNewerMessagesByConversationSync(conversationId, options);
}
__name(getNewerMessagesByConversation, "getNewerMessagesByConversation");
function getNewerMessagesByConversationSync(conversationId, {
  limit = 100,
  receivedAt = 0,
  sentAt = 0,
  storyId
} = {}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        storyId IS $storyId AND
        (
          (received_at = $received_at AND sent_at > $sent_at) OR
          received_at > $received_at
        )
      ORDER BY received_at ASC, sent_at ASC
      LIMIT $limit;
      `).all({
    conversationId,
    limit,
    received_at: receivedAt,
    sent_at: sentAt,
    storyId: storyId || null
  });
  return rows;
}
__name(getNewerMessagesByConversationSync, "getNewerMessagesByConversationSync");
function getOldestMessageForConversation(conversationId, storyId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        storyId IS $storyId
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
__name(getOldestMessageForConversation, "getOldestMessageForConversation");
function getNewestMessageForConversation(conversationId, storyId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        isStory IS 0 AND
        storyId IS $storyId
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
__name(getNewestMessageForConversation, "getNewestMessageForConversation");
function getLastConversationActivity({
  conversationId,
  ourUuid
}) {
  const db = getInstance();
  const row = prepare(db, `
      SELECT json FROM messages
      WHERE
        conversationId = $conversationId AND
        shouldAffectActivity IS 1 AND
        isTimerChangeFromSync IS 0 AND
        isGroupLeaveEventFromOther IS 0
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    ourUuid
  });
  if (!row) {
    return void 0;
  }
  return jsonToObject(row.json);
}
__name(getLastConversationActivity, "getLastConversationActivity");
function getLastConversationPreview({
  conversationId
}) {
  const db = getInstance();
  const row = prepare(db, `
      SELECT json FROM messages
      WHERE
        conversationId = $conversationId AND
        shouldAffectPreview IS 1 AND
        isGroupLeaveEventFromOther IS 0 AND
        (
          expiresAt IS NULL
          OR
          expiresAt > $now
        )
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 1;
      `).get({
    conversationId,
    now: Date.now()
  });
  if (!row) {
    return void 0;
  }
  return jsonToObject(row.json);
}
__name(getLastConversationPreview, "getLastConversationPreview");
async function getLastConversationMessages({
  conversationId,
  ourUuid
}) {
  const db = getInstance();
  return db.transaction(() => {
    return {
      activity: getLastConversationActivity({
        conversationId,
        ourUuid
      }),
      preview: getLastConversationPreview({ conversationId }),
      hasUserInitiatedMessages: hasUserInitiatedMessages(conversationId)
    };
  })();
}
__name(getLastConversationMessages, "getLastConversationMessages");
function getOldestUnreadMessageForConversation(conversationId, storyId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT * FROM messages WHERE
        conversationId = $conversationId AND
        readStatus = ${ReadStatus.Unread} AND
        isStory IS 0 AND
        storyId IS $storyId
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    return void 0;
  }
  return row;
}
__name(getOldestUnreadMessageForConversation, "getOldestUnreadMessageForConversation");
async function getTotalUnreadForConversation(conversationId, storyId) {
  return getTotalUnreadForConversationSync(conversationId, storyId);
}
__name(getTotalUnreadForConversation, "getTotalUnreadForConversation");
function getTotalUnreadForConversationSync(conversationId, storyId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT count(id)
      FROM messages
      WHERE
        conversationId = $conversationId AND
        readStatus = ${ReadStatus.Unread} AND
        isStory IS 0 AND
        storyId IS $storyId;
      `).get({
    conversationId,
    storyId: storyId || null
  });
  if (!row) {
    throw new Error("getTotalUnreadForConversation: Unable to get count");
  }
  return row["count(id)"];
}
__name(getTotalUnreadForConversationSync, "getTotalUnreadForConversationSync");
async function getMessageMetricsForConversation(conversationId, storyId) {
  return getMessageMetricsForConversationSync(conversationId, storyId);
}
__name(getMessageMetricsForConversation, "getMessageMetricsForConversation");
function getMessageMetricsForConversationSync(conversationId, storyId) {
  const oldest = getOldestMessageForConversation(conversationId, storyId);
  const newest = getNewestMessageForConversation(conversationId, storyId);
  const oldestUnread = getOldestUnreadMessageForConversation(conversationId, storyId);
  const totalUnread = getTotalUnreadForConversationSync(conversationId, storyId);
  return {
    oldest: oldest ? (0, import_lodash5.pick)(oldest, ["received_at", "sent_at", "id"]) : void 0,
    newest: newest ? (0, import_lodash5.pick)(newest, ["received_at", "sent_at", "id"]) : void 0,
    oldestUnread: oldestUnread ? (0, import_lodash5.pick)(oldestUnread, ["received_at", "sent_at", "id"]) : void 0,
    totalUnread
  };
}
__name(getMessageMetricsForConversationSync, "getMessageMetricsForConversationSync");
async function getConversationRangeCenteredOnMessage({
  conversationId,
  limit,
  messageId,
  receivedAt,
  sentAt,
  storyId
}) {
  const db = getInstance();
  return db.transaction(() => {
    return {
      older: getOlderMessagesByConversationSync(conversationId, {
        limit,
        messageId,
        receivedAt,
        sentAt,
        storyId
      }),
      newer: getNewerMessagesByConversationSync(conversationId, {
        limit,
        receivedAt,
        sentAt,
        storyId
      }),
      metrics: getMessageMetricsForConversationSync(conversationId, storyId)
    };
  })();
}
__name(getConversationRangeCenteredOnMessage, "getConversationRangeCenteredOnMessage");
async function hasGroupCallHistoryMessage(conversationId, eraId) {
  const db = getInstance();
  const row = db.prepare(`
      SELECT count(*) FROM messages
      WHERE conversationId = $conversationId
      AND type = 'call-history'
      AND json_extract(json, '$.callHistoryDetails.callMode') = 'Group'
      AND json_extract(json, '$.callHistoryDetails.eraId') = $eraId
      LIMIT 1;
      `).get({
    conversationId,
    eraId
  });
  if (row) {
    return Boolean(row["count(*)"]);
  }
  return false;
}
__name(hasGroupCallHistoryMessage, "hasGroupCallHistoryMessage");
async function migrateConversationMessages(obsoleteId, currentId) {
  const db = getInstance();
  db.prepare(`
    UPDATE messages SET
      conversationId = $currentId,
      json = json_set(json, '$.conversationId', $currentId)
    WHERE conversationId = $obsoleteId;
    `).run({
    obsoleteId,
    currentId
  });
}
__name(migrateConversationMessages, "migrateConversationMessages");
async function getMessagesBySentAt(sentAt) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages
      WHERE sent_at = $sent_at
      ORDER BY received_at DESC, sent_at DESC;
      `).all({
    sent_at: sentAt
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getMessagesBySentAt, "getMessagesBySentAt");
async function getExpiredMessages() {
  const db = getInstance();
  const now = Date.now();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        expiresAt IS NOT NULL AND
        expiresAt <= $now
      ORDER BY expiresAt ASC;
      `).all({ now });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getExpiredMessages, "getExpiredMessages");
async function getMessagesUnexpectedlyMissingExpirationStartTimestamp() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages
      INDEXED BY messages_unexpectedly_missing_expiration_start_timestamp
      WHERE
        expireTimer > 0 AND
        expirationStartTimestamp IS NULL AND
        (
          type IS 'outgoing' OR
          (type IS 'incoming' AND (
            readStatus = ${ReadStatus.Read} OR
            readStatus = ${ReadStatus.Viewed} OR
            readStatus IS NULL
          ))
        );
      `).all();
  return rows.map((row) => jsonToObject(row.json));
}
__name(getMessagesUnexpectedlyMissingExpirationStartTimestamp, "getMessagesUnexpectedlyMissingExpirationStartTimestamp");
async function getSoonestMessageExpiry() {
  const db = getInstance();
  const result = db.prepare(`
      SELECT MIN(expiresAt)
      FROM messages;
      `).pluck(true).get();
  return result || void 0;
}
__name(getSoonestMessageExpiry, "getSoonestMessageExpiry");
async function getNextTapToViewMessageTimestampToAgeOut() {
  const db = getInstance();
  const row = db.prepare(`
      SELECT json FROM messages
      WHERE
        isViewOnce = 1
        AND (isErased IS NULL OR isErased != 1)
      ORDER BY received_at ASC, sent_at ASC
      LIMIT 1;
      `).get();
  if (!row) {
    return void 0;
  }
  const data = jsonToObject(row.json);
  const result = data.received_at_ms || data.received_at;
  return isNormalNumber(result) ? result : void 0;
}
__name(getNextTapToViewMessageTimestampToAgeOut, "getNextTapToViewMessageTimestampToAgeOut");
async function getTapToViewMessagesNeedingErase() {
  const db = getInstance();
  const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1e3;
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE
        isViewOnce = 1
        AND (isErased IS NULL OR isErased != 1)
        AND received_at <= $THIRTY_DAYS_AGO
      ORDER BY received_at ASC, sent_at ASC;
      `).all({
    THIRTY_DAYS_AGO
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getTapToViewMessagesNeedingErase, "getTapToViewMessagesNeedingErase");
var MAX_UNPROCESSED_ATTEMPTS = 3;
function saveUnprocessedSync(data) {
  const db = getInstance();
  const {
    id,
    timestamp,
    version,
    attempts,
    envelope,
    source,
    sourceUuid,
    sourceDevice,
    serverGuid,
    serverTimestamp,
    decrypted
  } = data;
  if (!id) {
    throw new Error("saveUnprocessedSync: id was falsey");
  }
  if (attempts >= MAX_UNPROCESSED_ATTEMPTS) {
    removeUnprocessedSync(id);
    return id;
  }
  prepare(db, `
    INSERT OR REPLACE INTO unprocessed (
      id,
      timestamp,
      version,
      attempts,
      envelope,
      source,
      sourceUuid,
      sourceDevice,
      serverGuid,
      serverTimestamp,
      decrypted
    ) values (
      $id,
      $timestamp,
      $version,
      $attempts,
      $envelope,
      $source,
      $sourceUuid,
      $sourceDevice,
      $serverGuid,
      $serverTimestamp,
      $decrypted
    );
    `).run({
    id,
    timestamp,
    version,
    attempts,
    envelope: envelope || null,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    serverGuid: serverGuid || null,
    serverTimestamp: serverTimestamp || null,
    decrypted: decrypted || null
  });
  return id;
}
__name(saveUnprocessedSync, "saveUnprocessedSync");
function updateUnprocessedWithDataSync(id, data) {
  const db = getInstance();
  const {
    source,
    sourceUuid,
    sourceDevice,
    serverGuid,
    serverTimestamp,
    decrypted
  } = data;
  prepare(db, `
    UPDATE unprocessed SET
      source = $source,
      sourceUuid = $sourceUuid,
      sourceDevice = $sourceDevice,
      serverGuid = $serverGuid,
      serverTimestamp = $serverTimestamp,
      decrypted = $decrypted
    WHERE id = $id;
    `).run({
    id,
    source: source || null,
    sourceUuid: sourceUuid || null,
    sourceDevice: sourceDevice || null,
    serverGuid: serverGuid || null,
    serverTimestamp: serverTimestamp || null,
    decrypted: decrypted || null
  });
}
__name(updateUnprocessedWithDataSync, "updateUnprocessedWithDataSync");
async function updateUnprocessedWithData(id, data) {
  return updateUnprocessedWithDataSync(id, data);
}
__name(updateUnprocessedWithData, "updateUnprocessedWithData");
async function updateUnprocessedsWithData(arrayOfUnprocessed) {
  const db = getInstance();
  db.transaction(() => {
    for (const { id, data } of arrayOfUnprocessed) {
      assertSync(updateUnprocessedWithDataSync(id, data));
    }
  })();
}
__name(updateUnprocessedsWithData, "updateUnprocessedsWithData");
async function getUnprocessedById(id) {
  const db = getInstance();
  const row = db.prepare("SELECT * FROM unprocessed WHERE id = $id;").get({
    id
  });
  return row;
}
__name(getUnprocessedById, "getUnprocessedById");
async function getUnprocessedCount() {
  return getCountFromTable(getInstance(), "unprocessed");
}
__name(getUnprocessedCount, "getUnprocessedCount");
async function getAllUnprocessed() {
  const db = getInstance();
  const { changes: deletedCount } = db.prepare("DELETE FROM unprocessed WHERE timestamp < $monthAgo").run({
    monthAgo: Date.now() - MONTH
  });
  if (deletedCount !== 0) {
    logger.warn(`getAllUnprocessed: deleting ${deletedCount} old unprocessed envelopes`);
  }
  const rows = db.prepare(`
      SELECT *
      FROM unprocessed
      ORDER BY timestamp ASC;
      `).all();
  return rows;
}
__name(getAllUnprocessed, "getAllUnprocessed");
function removeUnprocessedsSync(ids) {
  const db = getInstance();
  db.prepare(`
    DELETE FROM unprocessed
    WHERE id IN ( ${ids.map(() => "?").join(", ")} );
    `).run(ids);
}
__name(removeUnprocessedsSync, "removeUnprocessedsSync");
function removeUnprocessedSync(id) {
  const db = getInstance();
  if (!Array.isArray(id)) {
    prepare(db, "DELETE FROM unprocessed WHERE id = $id;").run({ id });
    return;
  }
  if (!id.length) {
    throw new Error("removeUnprocessedSync: No ids to delete!");
  }
  assertSync(batchMultiVarQuery(db, id, removeUnprocessedsSync));
}
__name(removeUnprocessedSync, "removeUnprocessedSync");
async function removeUnprocessed(id) {
  removeUnprocessedSync(id);
}
__name(removeUnprocessed, "removeUnprocessed");
async function removeAllUnprocessed() {
  const db = getInstance();
  db.prepare("DELETE FROM unprocessed;").run();
}
__name(removeAllUnprocessed, "removeAllUnprocessed");
var ATTACHMENT_DOWNLOADS_TABLE = "attachment_downloads";
async function getNextAttachmentDownloadJobs(limit, options = {}) {
  const db = getInstance();
  const timestamp = options && options.timestamp ? options.timestamp : Date.now();
  const rows = db.prepare(`
      SELECT json
      FROM attachment_downloads
      WHERE pending = 0 AND timestamp <= $timestamp
      ORDER BY timestamp DESC
      LIMIT $limit;
      `).all({
    limit: limit || 3,
    timestamp
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getNextAttachmentDownloadJobs, "getNextAttachmentDownloadJobs");
async function saveAttachmentDownloadJob(job) {
  const db = getInstance();
  const { id, pending, timestamp } = job;
  if (!id) {
    throw new Error("saveAttachmentDownloadJob: Provided job did not have a truthy id");
  }
  db.prepare(`
    INSERT OR REPLACE INTO attachment_downloads (
      id,
      pending,
      timestamp,
      json
    ) values (
      $id,
      $pending,
      $timestamp,
      $json
    )
    `).run({
    id,
    pending,
    timestamp,
    json: objectToJSON(job)
  });
}
__name(saveAttachmentDownloadJob, "saveAttachmentDownloadJob");
async function setAttachmentDownloadJobPending(id, pending) {
  const db = getInstance();
  db.prepare(`
    UPDATE attachment_downloads
    SET pending = $pending
    WHERE id = $id;
    `).run({
    id,
    pending: pending ? 1 : 0
  });
}
__name(setAttachmentDownloadJobPending, "setAttachmentDownloadJobPending");
async function resetAttachmentDownloadPending() {
  const db = getInstance();
  db.prepare(`
    UPDATE attachment_downloads
    SET pending = 0
    WHERE pending != 0;
    `).run();
}
__name(resetAttachmentDownloadPending, "resetAttachmentDownloadPending");
async function removeAttachmentDownloadJob(id) {
  return removeById(getInstance(), ATTACHMENT_DOWNLOADS_TABLE, id);
}
__name(removeAttachmentDownloadJob, "removeAttachmentDownloadJob");
async function removeAllAttachmentDownloadJobs() {
  return removeAllFromTable(getInstance(), ATTACHMENT_DOWNLOADS_TABLE);
}
__name(removeAllAttachmentDownloadJobs, "removeAllAttachmentDownloadJobs");
async function createOrUpdateStickerPack(pack) {
  const db = getInstance();
  const {
    attemptedStatus,
    author,
    coverStickerId,
    createdAt,
    downloadAttempts,
    id,
    installedAt,
    key,
    lastUsed,
    status,
    stickerCount,
    title
  } = pack;
  if (!id) {
    throw new Error("createOrUpdateStickerPack: Provided data did not have a truthy id");
  }
  const rows = db.prepare(`
      SELECT id
      FROM sticker_packs
      WHERE id = $id;
      `).all({ id });
  const payload = {
    attemptedStatus: attemptedStatus ?? null,
    author,
    coverStickerId,
    createdAt: createdAt || Date.now(),
    downloadAttempts: downloadAttempts || 1,
    id,
    installedAt: installedAt ?? null,
    key,
    lastUsed: lastUsed || null,
    status,
    stickerCount,
    title
  };
  if (rows && rows.length) {
    db.prepare(`
      UPDATE sticker_packs SET
        attemptedStatus = $attemptedStatus,
        author = $author,
        coverStickerId = $coverStickerId,
        createdAt = $createdAt,
        downloadAttempts = $downloadAttempts,
        installedAt = $installedAt,
        key = $key,
        lastUsed = $lastUsed,
        status = $status,
        stickerCount = $stickerCount,
        title = $title
      WHERE id = $id;
      `).run(payload);
    return;
  }
  db.prepare(`
    INSERT INTO sticker_packs (
      attemptedStatus,
      author,
      coverStickerId,
      createdAt,
      downloadAttempts,
      id,
      installedAt,
      key,
      lastUsed,
      status,
      stickerCount,
      title
    ) values (
      $attemptedStatus,
      $author,
      $coverStickerId,
      $createdAt,
      $downloadAttempts,
      $id,
      $installedAt,
      $key,
      $lastUsed,
      $status,
      $stickerCount,
      $title
    )
    `).run(payload);
}
__name(createOrUpdateStickerPack, "createOrUpdateStickerPack");
async function updateStickerPackStatus(id, status, options) {
  const db = getInstance();
  const timestamp = options ? options.timestamp || Date.now() : Date.now();
  const installedAt = status === "installed" ? timestamp : null;
  db.prepare(`
    UPDATE sticker_packs
    SET status = $status, installedAt = $installedAt
    WHERE id = $id;
    `).run({
    id,
    status,
    installedAt
  });
}
__name(updateStickerPackStatus, "updateStickerPackStatus");
async function clearAllErrorStickerPackAttempts() {
  const db = getInstance();
  db.prepare(`
    UPDATE sticker_packs
    SET downloadAttempts = 0
    WHERE status = 'error';
    `).run();
}
__name(clearAllErrorStickerPackAttempts, "clearAllErrorStickerPackAttempts");
async function createOrUpdateSticker(sticker) {
  const db = getInstance();
  const { emoji, height, id, isCoverOnly, lastUsed, packId, path, width } = sticker;
  if (!(0, import_lodash5.isNumber)(id)) {
    throw new Error("createOrUpdateSticker: Provided data did not have a numeric id");
  }
  if (!packId) {
    throw new Error("createOrUpdateSticker: Provided data did not have a truthy id");
  }
  db.prepare(`
    INSERT OR REPLACE INTO stickers (
      emoji,
      height,
      id,
      isCoverOnly,
      lastUsed,
      packId,
      path,
      width
    ) values (
      $emoji,
      $height,
      $id,
      $isCoverOnly,
      $lastUsed,
      $packId,
      $path,
      $width
    )
    `).run({
    emoji: emoji ?? null,
    height,
    id,
    isCoverOnly: isCoverOnly ? 1 : 0,
    lastUsed: lastUsed || null,
    packId,
    path,
    width
  });
}
__name(createOrUpdateSticker, "createOrUpdateSticker");
async function updateStickerLastUsed(packId, stickerId, lastUsed) {
  const db = getInstance();
  db.prepare(`
    UPDATE stickers
    SET lastUsed = $lastUsed
    WHERE id = $id AND packId = $packId;
    `).run({
    id: stickerId,
    packId,
    lastUsed
  });
  db.prepare(`
    UPDATE sticker_packs
    SET lastUsed = $lastUsed
    WHERE id = $id;
    `).run({
    id: packId,
    lastUsed
  });
}
__name(updateStickerLastUsed, "updateStickerLastUsed");
async function addStickerPackReference(messageId, packId) {
  const db = getInstance();
  if (!messageId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy messageId");
  }
  if (!packId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy packId");
  }
  db.prepare(`
    INSERT OR REPLACE INTO sticker_references (
      messageId,
      packId
    ) values (
      $messageId,
      $packId
    )
    `).run({
    messageId,
    packId
  });
}
__name(addStickerPackReference, "addStickerPackReference");
async function deleteStickerPackReference(messageId, packId) {
  const db = getInstance();
  if (!messageId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy messageId");
  }
  if (!packId) {
    throw new Error("addStickerPackReference: Provided data did not have a truthy packId");
  }
  return db.transaction(() => {
    db.prepare(`
        DELETE FROM sticker_references
        WHERE messageId = $messageId AND packId = $packId;
        `).run({
      messageId,
      packId
    });
    const countRow = db.prepare(`
          SELECT count(*) FROM sticker_references
          WHERE packId = $packId;
          `).get({ packId });
    if (!countRow) {
      throw new Error("deleteStickerPackReference: Unable to get count of references");
    }
    const count = countRow["count(*)"];
    if (count > 0) {
      return void 0;
    }
    const packRow = db.prepare(`
          SELECT status FROM sticker_packs
          WHERE id = $packId;
          `).get({ packId });
    if (!packRow) {
      logger.warn("deleteStickerPackReference: did not find referenced pack");
      return void 0;
    }
    const { status } = packRow;
    if (status === "installed") {
      return void 0;
    }
    const stickerPathRows = db.prepare(`
          SELECT path FROM stickers
          WHERE packId = $packId;
          `).all({
      packId
    });
    db.prepare(`
        DELETE FROM sticker_packs
        WHERE id = $packId;
        `).run({
      packId
    });
    return (stickerPathRows || []).map((row) => row.path);
  }).immediate();
}
__name(deleteStickerPackReference, "deleteStickerPackReference");
async function deleteStickerPack(packId) {
  const db = getInstance();
  if (!packId) {
    throw new Error("deleteStickerPack: Provided data did not have a truthy packId");
  }
  return db.transaction(() => {
    const stickerPathRows = db.prepare(`
          SELECT path FROM stickers
          WHERE packId = $packId;
          `).all({
      packId
    });
    db.prepare(`
        DELETE FROM sticker_packs
        WHERE id = $packId;
        `).run({ packId });
    return (stickerPathRows || []).map((row) => row.path);
  }).immediate();
}
__name(deleteStickerPack, "deleteStickerPack");
async function getStickerCount() {
  return getCountFromTable(getInstance(), "stickers");
}
__name(getStickerCount, "getStickerCount");
async function getAllStickerPacks() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT * FROM sticker_packs
      ORDER BY installedAt DESC, createdAt DESC
      `).all();
  return rows || [];
}
__name(getAllStickerPacks, "getAllStickerPacks");
async function getAllStickers() {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT * FROM stickers
      ORDER BY packId ASC, id ASC
      `).all();
  return (rows || []).map((row) => rowToSticker(row));
}
__name(getAllStickers, "getAllStickers");
async function getRecentStickers({ limit } = {}) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT stickers.* FROM stickers
      JOIN sticker_packs on stickers.packId = sticker_packs.id
      WHERE stickers.lastUsed > 0 AND sticker_packs.status = 'installed'
      ORDER BY stickers.lastUsed DESC
      LIMIT $limit
      `).all({
    limit: limit || 24
  });
  return (rows || []).map((row) => rowToSticker(row));
}
__name(getRecentStickers, "getRecentStickers");
async function updateEmojiUsage(shortName, timeUsed = Date.now()) {
  const db = getInstance();
  db.transaction(() => {
    const rows = db.prepare(`
        SELECT * FROM emojis
        WHERE shortName = $shortName;
        `).get({
      shortName
    });
    if (rows) {
      db.prepare(`
        UPDATE emojis
        SET lastUsage = $timeUsed
        WHERE shortName = $shortName;
        `).run({ shortName, timeUsed });
    } else {
      db.prepare(`
        INSERT INTO emojis(shortName, lastUsage)
        VALUES ($shortName, $timeUsed);
        `).run({ shortName, timeUsed });
    }
  })();
}
__name(updateEmojiUsage, "updateEmojiUsage");
async function getRecentEmojis(limit = 32) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT *
      FROM emojis
      ORDER BY lastUsage DESC
      LIMIT $limit;
      `).all({ limit });
  return rows || [];
}
__name(getRecentEmojis, "getRecentEmojis");
async function getAllBadges() {
  const db = getInstance();
  const [badgeRows, badgeImageFileRows] = db.transaction(() => [
    db.prepare("SELECT * FROM badges").all(),
    db.prepare("SELECT * FROM badgeImageFiles").all()
  ])();
  const badgeImagesByBadge = /* @__PURE__ */ new Map();
  for (const badgeImageFileRow of badgeImageFileRows) {
    const { badgeId, order, localPath, url, theme } = badgeImageFileRow;
    const badgeImages = badgeImagesByBadge.get(badgeId) || [];
    badgeImages[order] = __spreadProps(__spreadValues({}, badgeImages[order] || {}), {
      [parseBadgeImageTheme(theme)]: {
        localPath: dropNull(localPath),
        url
      }
    });
    badgeImagesByBadge.set(badgeId, badgeImages);
  }
  return badgeRows.map((badgeRow) => ({
    id: badgeRow.id,
    category: parseBadgeCategory(badgeRow.category),
    name: badgeRow.name,
    descriptionTemplate: badgeRow.descriptionTemplate,
    images: (badgeImagesByBadge.get(badgeRow.id) || []).filter(isNotNil)
  }));
}
__name(getAllBadges, "getAllBadges");
async function updateOrCreateBadges(badges) {
  const db = getInstance();
  const insertBadge = prepare(db, `
    INSERT OR REPLACE INTO badges (
      id,
      category,
      name,
      descriptionTemplate
    ) VALUES (
      $id,
      $category,
      $name,
      $descriptionTemplate
    );
    `);
  const getImageFilesForBadge = prepare(db, "SELECT url, localPath FROM badgeImageFiles WHERE badgeId = $badgeId");
  const insertBadgeImageFile = prepare(db, `
    INSERT INTO badgeImageFiles (
      badgeId,
      'order',
      url,
      localPath,
      theme
    ) VALUES (
      $badgeId,
      $order,
      $url,
      $localPath,
      $theme
    );
    `);
  db.transaction(() => {
    badges.forEach((badge) => {
      const { id: badgeId } = badge;
      const oldLocalPaths = /* @__PURE__ */ new Map();
      for (const { url, localPath } of getImageFilesForBadge.all({ badgeId })) {
        if (localPath) {
          oldLocalPaths.set(url, localPath);
        }
      }
      insertBadge.run({
        id: badgeId,
        category: badge.category,
        name: badge.name,
        descriptionTemplate: badge.descriptionTemplate
      });
      for (const [order, image] of badge.images.entries()) {
        for (const [theme, imageFile] of Object.entries(image)) {
          insertBadgeImageFile.run({
            badgeId,
            localPath: imageFile.localPath || oldLocalPaths.get(imageFile.url) || null,
            order,
            theme,
            url: imageFile.url
          });
        }
      }
    });
  })();
}
__name(updateOrCreateBadges, "updateOrCreateBadges");
async function badgeImageFileDownloaded(url, localPath) {
  const db = getInstance();
  prepare(db, "UPDATE badgeImageFiles SET localPath = $localPath WHERE url = $url").run({ url, localPath });
}
__name(badgeImageFileDownloaded, "badgeImageFileDownloaded");
async function getAllBadgeImageFileLocalPaths() {
  const db = getInstance();
  const localPaths = db.prepare("SELECT localPath FROM badgeImageFiles WHERE localPath IS NOT NULL").pluck().all();
  return new Set(localPaths);
}
__name(getAllBadgeImageFileLocalPaths, "getAllBadgeImageFileLocalPaths");
function hydrateStoryDistribution(fromDatabase) {
  return __spreadProps(__spreadValues({}, (0, import_lodash5.omit)(fromDatabase, "senderKeyInfoJson")), {
    senderKeyInfo: fromDatabase.senderKeyInfoJson ? JSON.parse(fromDatabase.senderKeyInfoJson) : void 0
  });
}
__name(hydrateStoryDistribution, "hydrateStoryDistribution");
function freezeStoryDistribution(story) {
  return __spreadProps(__spreadValues({}, (0, import_lodash5.omit)(story, "senderKeyInfo")), {
    senderKeyInfoJson: story.senderKeyInfo ? JSON.stringify(story.senderKeyInfo) : null
  });
}
__name(freezeStoryDistribution, "freezeStoryDistribution");
async function _getAllStoryDistributions() {
  const db = getInstance();
  const storyDistributions = db.prepare("SELECT * FROM storyDistributions;").all();
  return storyDistributions.map(hydrateStoryDistribution);
}
__name(_getAllStoryDistributions, "_getAllStoryDistributions");
async function _getAllStoryDistributionMembers() {
  const db = getInstance();
  return db.prepare("SELECT * FROM storyDistributionMembers;").all();
}
__name(_getAllStoryDistributionMembers, "_getAllStoryDistributionMembers");
async function _deleteAllStoryDistributions() {
  const db = getInstance();
  db.prepare("DELETE FROM storyDistributions;").run();
}
__name(_deleteAllStoryDistributions, "_deleteAllStoryDistributions");
async function createNewStoryDistribution(distribution) {
  const db = getInstance();
  db.transaction(() => {
    const payload = freezeStoryDistribution(distribution);
    prepare(db, `
      INSERT INTO storyDistributions(
        id,
        name,
        avatarUrlPath,
        avatarKey,
        senderKeyInfoJson
      ) VALUES (
        $id,
        $name,
        $avatarUrlPath,
        $avatarKey,
        $senderKeyInfoJson
      );
      `).run(payload);
    const { id: listId, members } = distribution;
    const memberInsertStatement = prepare(db, `
      INSERT OR REPLACE INTO storyDistributionMembers (
        listId,
        uuid
      ) VALUES (
        $listId,
        $uuid
      );
      `);
    for (const uuid of members) {
      memberInsertStatement.run({
        listId,
        uuid
      });
    }
  })();
}
__name(createNewStoryDistribution, "createNewStoryDistribution");
async function getAllStoryDistributionsWithMembers() {
  const allDistributions = await _getAllStoryDistributions();
  const allMembers = await _getAllStoryDistributionMembers();
  const byListId = (0, import_lodash5.groupBy)(allMembers, (member) => member.listId);
  return allDistributions.map((list) => __spreadProps(__spreadValues({}, list), {
    members: (byListId[list.id] || []).map((member) => member.uuid)
  }));
}
__name(getAllStoryDistributionsWithMembers, "getAllStoryDistributionsWithMembers");
async function getStoryDistributionWithMembers(id) {
  const db = getInstance();
  const storyDistribution = prepare(db, "SELECT * FROM storyDistributions WHERE id = $id;").get({
    id
  });
  if (!storyDistribution) {
    return void 0;
  }
  const members = prepare(db, "SELECT * FROM storyDistributionMembers WHERE listId = $id;").all({
    id
  });
  return __spreadProps(__spreadValues({}, storyDistribution), {
    members: members.map(({ uuid }) => uuid)
  });
}
__name(getStoryDistributionWithMembers, "getStoryDistributionWithMembers");
async function modifyStoryDistribution(distribution) {
  const payload = freezeStoryDistribution(distribution);
  const db = getInstance();
  prepare(db, `
    UPDATE storyDistributions
    SET
      name = $name,
      avatarUrlPath = $avatarUrlPath,
      avatarKey = $avatarKey,
      senderKeyInfoJson = $senderKeyInfoJson
    WHERE id = $id
    `).run(payload);
}
__name(modifyStoryDistribution, "modifyStoryDistribution");
async function modifyStoryDistributionMembers(listId, {
  toAdd,
  toRemove
}) {
  const db = getInstance();
  db.transaction(() => {
    const memberInsertStatement = prepare(db, `
      INSERT OR REPLACE INTO storyDistributionMembers (
        listId,
        uuid
      ) VALUES (
        $listId,
        $uuid
      );
      `);
    for (const uuid of toAdd) {
      memberInsertStatement.run({
        listId,
        uuid
      });
    }
    batchMultiVarQuery(db, toRemove, (uuids) => {
      db.prepare(`
        DELETE FROM storyDistributionMembers
        WHERE listId = ? AND uuid IN ( ${uuids.map(() => "?").join(", ")} );
        `).run([listId, ...uuids]);
    });
  })();
}
__name(modifyStoryDistributionMembers, "modifyStoryDistributionMembers");
async function deleteStoryDistribution(id) {
  const db = getInstance();
  db.prepare("DELETE FROM storyDistributions WHERE id = $id;").run({
    id
  });
}
__name(deleteStoryDistribution, "deleteStoryDistribution");
async function _getAllStoryReads() {
  const db = getInstance();
  return db.prepare("SELECT * FROM storyReads;").all();
}
__name(_getAllStoryReads, "_getAllStoryReads");
async function _deleteAllStoryReads() {
  const db = getInstance();
  db.prepare("DELETE FROM storyReads;").run();
}
__name(_deleteAllStoryReads, "_deleteAllStoryReads");
async function addNewStoryRead(read) {
  const db = getInstance();
  prepare(db, `
    INSERT OR REPLACE INTO storyReads(
      authorId,
      conversationId,
      storyId,
      storyReadDate
    ) VALUES (
      $authorId,
      $conversationId,
      $storyId,
      $storyReadDate
    );
    `).run(read);
}
__name(addNewStoryRead, "addNewStoryRead");
async function getLastStoryReadsForAuthor({
  authorId,
  conversationId,
  limit: initialLimit
}) {
  const limit = initialLimit || 5;
  const db = getInstance();
  return db.prepare(`
      SELECT * FROM storyReads
      WHERE
        authorId = $authorId AND
        ($conversationId IS NULL OR conversationId = $conversationId)
      ORDER BY storyReadDate DESC
      LIMIT $limit;
      `).all({
    authorId,
    conversationId: conversationId || null,
    limit
  });
}
__name(getLastStoryReadsForAuthor, "getLastStoryReadsForAuthor");
async function removeAll() {
  const db = getInstance();
  db.transaction(() => {
    db.exec(`
      DELETE FROM attachment_downloads;
      DELETE FROM badgeImageFiles;
      DELETE FROM badges;
      DELETE FROM conversations;
      DELETE FROM emojis;
      DELETE FROM groupCallRings;
      DELETE FROM identityKeys;
      DELETE FROM items;
      DELETE FROM jobs;
      DELETE FROM messages_fts;
      DELETE FROM messages;
      DELETE FROM preKeys;
      DELETE FROM reactions;
      DELETE FROM senderKeys;
      DELETE FROM sendLogMessageIds;
      DELETE FROM sendLogPayloads;
      DELETE FROM sendLogRecipients;
      DELETE FROM sessions;
      DELETE FROM signedPreKeys;
      DELETE FROM sticker_packs;
      DELETE FROM sticker_references;
      DELETE FROM stickers;
      DELETE FROM storyDistributionMembers;
      DELETE FROM storyDistributions;
      DELETE FROM storyReads;
      DELETE FROM unprocessed;
    `);
  })();
}
__name(removeAll, "removeAll");
async function removeAllConfiguration(mode = RemoveAllConfiguration.Full) {
  const db = getInstance();
  db.transaction(() => {
    db.exec(`
      DELETE FROM identityKeys;
      DELETE FROM jobs;
      DELETE FROM preKeys;
      DELETE FROM senderKeys;
      DELETE FROM sendLogMessageIds;
      DELETE FROM sendLogPayloads;
      DELETE FROM sendLogRecipients;
      DELETE FROM sessions;
      DELETE FROM signedPreKeys;
      DELETE FROM unprocessed;
      `);
    if (mode === RemoveAllConfiguration.Full) {
      db.exec(`
        DELETE FROM items;
        `);
    } else if (mode === RemoveAllConfiguration.Soft) {
      const itemIds = db.prepare("SELECT id FROM items").pluck(true).all();
      const allowedSet = new Set(STORAGE_UI_KEYS);
      for (const id of itemIds) {
        if (!allowedSet.has(id)) {
          removeById(db, "items", id);
        }
      }
    } else {
      throw missingCaseError(mode);
    }
    db.exec("UPDATE conversations SET json = json_remove(json, '$.senderKeyInfo');");
  })();
}
__name(removeAllConfiguration, "removeAllConfiguration");
async function getMessagesNeedingUpgrade(limit, { maxVersion }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json
      FROM messages
      WHERE schemaVersion IS NULL OR schemaVersion < $maxVersion
      LIMIT $limit;
      `).all({
    maxVersion,
    limit
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getMessagesNeedingUpgrade, "getMessagesNeedingUpgrade");
async function getMessagesWithVisualMediaAttachments(conversationId, { limit }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        isStory IS 0 AND
        storyId IS NULL AND
        conversationId = $conversationId AND
        hasVisualMediaAttachments = 1
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit
  });
  return rows.map((row) => jsonToObject(row.json));
}
__name(getMessagesWithVisualMediaAttachments, "getMessagesWithVisualMediaAttachments");
async function getMessagesWithFileAttachments(conversationId, { limit }) {
  const db = getInstance();
  const rows = db.prepare(`
      SELECT json FROM messages WHERE
        isStory IS 0 AND
        storyId IS NULL AND
        conversationId = $conversationId AND
        hasFileAttachments = 1
      ORDER BY received_at DESC, sent_at DESC
      LIMIT $limit;
      `).all({
    conversationId,
    limit
  });
  return (0, import_lodash5.map)(rows, (row) => jsonToObject(row.json));
}
__name(getMessagesWithFileAttachments, "getMessagesWithFileAttachments");
async function getMessageServerGuidsForSpam(conversationId) {
  const db = getInstance();
  return db.prepare(`
      SELECT serverGuid
      FROM messages
      WHERE conversationId = $conversationId
      AND type = 'incoming'
      AND serverGuid IS NOT NULL
      ORDER BY received_at DESC, sent_at DESC
      LIMIT 3;
      `).pluck(true).all({ conversationId });
}
__name(getMessageServerGuidsForSpam, "getMessageServerGuidsForSpam");
function getExternalFilesForMessage(message) {
  const { attachments, contact, quote, preview, sticker } = message;
  const files = [];
  (0, import_lodash5.forEach)(attachments, (attachment) => {
    const { path: file, thumbnail, screenshot } = attachment;
    if (file) {
      files.push(file);
    }
    if (thumbnail && thumbnail.path) {
      files.push(thumbnail.path);
    }
    if (screenshot && screenshot.path) {
      files.push(screenshot.path);
    }
  });
  if (quote && quote.attachments && quote.attachments.length) {
    (0, import_lodash5.forEach)(quote.attachments, (attachment) => {
      const { thumbnail } = attachment;
      if (thumbnail && thumbnail.path) {
        files.push(thumbnail.path);
      }
    });
  }
  if (contact && contact.length) {
    (0, import_lodash5.forEach)(contact, (item) => {
      const { avatar } = item;
      if (avatar && avatar.avatar && avatar.avatar.path) {
        files.push(avatar.avatar.path);
      }
    });
  }
  if (preview && preview.length) {
    (0, import_lodash5.forEach)(preview, (item) => {
      const { image } = item;
      if (image && image.path) {
        files.push(image.path);
      }
    });
  }
  if (sticker && sticker.data && sticker.data.path) {
    files.push(sticker.data.path);
    if (sticker.data.thumbnail && sticker.data.thumbnail.path) {
      files.push(sticker.data.thumbnail.path);
    }
  }
  return files;
}
__name(getExternalFilesForMessage, "getExternalFilesForMessage");
function getExternalFilesForConversation(conversation) {
  const { avatar, profileAvatar } = conversation;
  const files = [];
  if (avatar && avatar.path) {
    files.push(avatar.path);
  }
  if (profileAvatar && profileAvatar.path) {
    files.push(profileAvatar.path);
  }
  return files;
}
__name(getExternalFilesForConversation, "getExternalFilesForConversation");
function getExternalDraftFilesForConversation(conversation) {
  const draftAttachments = conversation.draftAttachments || [];
  const files = [];
  (0, import_lodash5.forEach)(draftAttachments, (attachment) => {
    if (attachment.pending) {
      return;
    }
    const { path: file, screenshotPath } = attachment;
    if (file) {
      files.push(file);
    }
    if (screenshotPath) {
      files.push(screenshotPath);
    }
  });
  return files;
}
__name(getExternalDraftFilesForConversation, "getExternalDraftFilesForConversation");
async function removeKnownAttachments(allAttachments) {
  const db = getInstance();
  const lookup = (0, import_lodash5.fromPairs)((0, import_lodash5.map)(allAttachments, (file) => [file, true]));
  const chunkSize = 500;
  const total = getMessageCountSync();
  logger.info(`removeKnownAttachments: About to iterate through ${total} messages`);
  let count = 0;
  for (const message of new TableIterator(db, "messages")) {
    const externalFiles = getExternalFilesForMessage(message);
    (0, import_lodash5.forEach)(externalFiles, (file) => {
      delete lookup[file];
    });
    count += 1;
  }
  logger.info(`removeKnownAttachments: Done processing ${count} messages`);
  let complete = false;
  count = 0;
  let id = "";
  const conversationTotal = await getConversationCount();
  logger.info(`removeKnownAttachments: About to iterate through ${conversationTotal} conversations`);
  const fetchConversations = db.prepare(`
      SELECT json FROM conversations
      WHERE id > $id
      ORDER BY id ASC
      LIMIT $chunkSize;
    `);
  while (!complete) {
    const rows = fetchConversations.all({
      id,
      chunkSize
    });
    const conversations = (0, import_lodash5.map)(rows, (row) => jsonToObject(row.json));
    conversations.forEach((conversation) => {
      const externalFiles = getExternalFilesForConversation(conversation);
      externalFiles.forEach((file) => {
        delete lookup[file];
      });
    });
    const lastMessage = (0, import_lodash5.last)(conversations);
    if (lastMessage) {
      ({ id } = lastMessage);
    }
    complete = conversations.length < chunkSize;
    count += conversations.length;
  }
  logger.info(`removeKnownAttachments: Done processing ${count} conversations`);
  return Object.keys(lookup);
}
__name(removeKnownAttachments, "removeKnownAttachments");
async function removeKnownStickers(allStickers) {
  const db = getInstance();
  const lookup = (0, import_lodash5.fromPairs)((0, import_lodash5.map)(allStickers, (file) => [file, true]));
  const chunkSize = 50;
  const total = await getStickerCount();
  logger.info(`removeKnownStickers: About to iterate through ${total} stickers`);
  let count = 0;
  let complete = false;
  let rowid = 0;
  while (!complete) {
    const rows = db.prepare(`
        SELECT rowid, path FROM stickers
        WHERE rowid > $rowid
        ORDER BY rowid ASC
        LIMIT $chunkSize;
        `).all({
      rowid,
      chunkSize
    });
    const files = rows.map((row) => row.path);
    files.forEach((file) => {
      delete lookup[file];
    });
    const lastSticker = (0, import_lodash5.last)(rows);
    if (lastSticker) {
      ({ rowid } = lastSticker);
    }
    complete = rows.length < chunkSize;
    count += rows.length;
  }
  logger.info(`removeKnownStickers: Done processing ${count} stickers`);
  return Object.keys(lookup);
}
__name(removeKnownStickers, "removeKnownStickers");
async function removeKnownDraftAttachments(allStickers) {
  const db = getInstance();
  const lookup = (0, import_lodash5.fromPairs)((0, import_lodash5.map)(allStickers, (file) => [file, true]));
  const chunkSize = 50;
  const total = await getConversationCount();
  logger.info(`removeKnownDraftAttachments: About to iterate through ${total} conversations`);
  let complete = false;
  let count = 0;
  let id = 0;
  while (!complete) {
    const rows = db.prepare(`
        SELECT json FROM conversations
        WHERE id > $id
        ORDER BY id ASC
        LIMIT $chunkSize;
        `).all({
      id,
      chunkSize
    });
    const conversations = rows.map((row) => jsonToObject(row.json));
    conversations.forEach((conversation) => {
      const externalFiles = getExternalDraftFilesForConversation(conversation);
      externalFiles.forEach((file) => {
        delete lookup[file];
      });
    });
    const lastMessage = (0, import_lodash5.last)(conversations);
    if (lastMessage) {
      ({ id } = lastMessage);
    }
    complete = conversations.length < chunkSize;
    count += conversations.length;
  }
  logger.info(`removeKnownDraftAttachments: Done processing ${count} conversations`);
  return Object.keys(lookup);
}
__name(removeKnownDraftAttachments, "removeKnownDraftAttachments");
async function getJobsInQueue(queueType) {
  const db = getInstance();
  return getJobsInQueueSync(db, queueType);
}
__name(getJobsInQueue, "getJobsInQueue");
function getJobsInQueueSync(db, queueType) {
  return db.prepare(`
      SELECT id, timestamp, data
      FROM jobs
      WHERE queueType = $queueType
      ORDER BY timestamp;
      `).all({ queueType }).map((row) => ({
    id: row.id,
    queueType,
    timestamp: row.timestamp,
    data: isNotNil(row.data) ? JSON.parse(row.data) : void 0
  }));
}
__name(getJobsInQueueSync, "getJobsInQueueSync");
function insertJobSync(db, job) {
  db.prepare(`
      INSERT INTO jobs
      (id, queueType, timestamp, data)
      VALUES
      ($id, $queueType, $timestamp, $data);
    `).run({
    id: job.id,
    queueType: job.queueType,
    timestamp: job.timestamp,
    data: isNotNil(job.data) ? JSON.stringify(job.data) : null
  });
}
__name(insertJobSync, "insertJobSync");
async function insertJob(job) {
  const db = getInstance();
  return insertJobSync(db, job);
}
__name(insertJob, "insertJob");
async function deleteJob(id) {
  const db = getInstance();
  db.prepare("DELETE FROM jobs WHERE id = $id").run({ id });
}
__name(deleteJob, "deleteJob");
async function processGroupCallRingRequest(ringId) {
  const db = getInstance();
  return db.transaction(() => {
    let result;
    const wasRingPreviouslyCanceled = Boolean(db.prepare(`
          SELECT 1 FROM groupCallRings
          WHERE ringId = $ringId AND isActive = 0
          LIMIT 1;
          `).pluck(true).get({ ringId }));
    if (wasRingPreviouslyCanceled) {
      result = ProcessGroupCallRingRequestResult.RingWasPreviouslyCanceled;
    } else {
      const isThereAnotherActiveRing = Boolean(db.prepare(`
            SELECT 1 FROM groupCallRings
            WHERE isActive = 1
            LIMIT 1;
            `).pluck(true).get());
      if (isThereAnotherActiveRing) {
        result = ProcessGroupCallRingRequestResult.ThereIsAnotherActiveRing;
      } else {
        result = ProcessGroupCallRingRequestResult.ShouldRing;
      }
      db.prepare(`
        INSERT OR IGNORE INTO groupCallRings (ringId, isActive, createdAt)
        VALUES ($ringId, 1, $createdAt);
        `);
    }
    return result;
  })();
}
__name(processGroupCallRingRequest, "processGroupCallRingRequest");
async function processGroupCallRingCancelation(ringId) {
  const db = getInstance();
  db.prepare(`
    INSERT INTO groupCallRings (ringId, isActive, createdAt)
    VALUES ($ringId, 0, $createdAt)
    ON CONFLICT (ringId) DO
    UPDATE SET isActive = 0;
    `).run({ ringId, createdAt: Date.now() });
}
__name(processGroupCallRingCancelation, "processGroupCallRingCancelation");
var MAX_GROUP_CALL_RING_AGE = 30 * MINUTE;
async function cleanExpiredGroupCallRings() {
  const db = getInstance();
  db.prepare(`
    DELETE FROM groupCallRings
    WHERE createdAt < $expiredRingTime;
    `).run({
    expiredRingTime: Date.now() - MAX_GROUP_CALL_RING_AGE
  });
}
__name(cleanExpiredGroupCallRings, "cleanExpiredGroupCallRings");
async function getMaxMessageCounter() {
  const db = getInstance();
  return db.prepare(`
    SELECT MAX(counter)
    FROM
      (
        SELECT MAX(received_at) AS counter FROM messages
        UNION
        SELECT MAX(timestamp) AS counter FROM unprocessed
      )
    `).pluck().get();
}
__name(getMaxMessageCounter, "getMaxMessageCounter");
async function getStatisticsForLogging() {
  const db = getInstance();
  const counts = await (0, import_p_props.default)({
    messageCount: getMessageCount(),
    conversationCount: getConversationCount(),
    sessionCount: getCountFromTable(db, "sessions"),
    senderKeyCount: getCountFromTable(db, "senderKeys")
  });
  return (0, import_lodash5.mapValues)(counts, formatCountForLogging);
}
__name(getStatisticsForLogging, "getStatisticsForLogging");
async function updateAllConversationColors(conversationColor, customColorData) {
  const db = getInstance();
  db.prepare(`
    UPDATE conversations
    SET json = JSON_PATCH(json, $patch);
    `).run({
    patch: JSON.stringify({
      conversationColor: conversationColor || null,
      customColor: (customColorData == null ? void 0 : customColorData.value) || null,
      customColorId: (customColorData == null ? void 0 : customColorData.id) || null
    })
  });
}
__name(updateAllConversationColors, "updateAllConversationColors");

// ts/sql/mainWorker.ts
if (!import_worker_threads.parentPort) {
  throw new Error("Must run as a worker thread");
}
var port = import_worker_threads.parentPort;
function respond(seq, error2, response) {
  const corruptionLog2 = Server_default.getCorruptionLog();
  const errorMessage = [
    ...error2 ? [error2.stack] : [],
    ...corruptionLog2 ? [corruptionLog2] : []
  ].join("\n");
  const wrappedResponse = {
    type: "response",
    seq,
    error: errorMessage,
    response
  };
  port.postMessage(wrappedResponse);
}
__name(respond, "respond");
var log = /* @__PURE__ */ __name((level, args) => {
  const wrappedResponse = {
    type: "log",
    level,
    args
  };
  port.postMessage(wrappedResponse);
}, "log");
var logger2 = {
  fatal(...args) {
    log("fatal", args);
  },
  error(...args) {
    log("error", args);
  },
  warn(...args) {
    log("warn", args);
  },
  info(...args) {
    log("info", args);
  },
  debug(...args) {
    log("debug", args);
  },
  trace(...args) {
    log("trace", args);
  }
};
port.on("message", async ({ seq, request }) => {
  try {
    if (request.type === "init") {
      await Server_default.initialize(__spreadProps(__spreadValues({}, request.options), {
        logger: logger2
      }));
      respond(seq, void 0, void 0);
      return;
    }
    if (request.type === "close") {
      await Server_default.close();
      respond(seq, void 0, void 0);
      process.exit(0);
      return;
    }
    if (request.type === "removeDB") {
      await Server_default.removeDB();
      respond(seq, void 0, void 0);
      return;
    }
    if (request.type === "sqlCall") {
      const method = Server_default[request.method];
      if (typeof method !== "function") {
        throw new Error(`Invalid sql method: ${method}`);
      }
      const start = Date.now();
      const result = await method.apply(Server_default, request.args);
      const end = Date.now();
      respond(seq, void 0, { result, duration: end - start });
    } else {
      throw new Error("Unexpected request type");
    }
  } catch (error2) {
    respond(seq, error2, void 0);
  }
});
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
