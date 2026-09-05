#!/usr/bin/env node
import { createRequire as __taskboardCreateRequire } from "node:module"; const require = __taskboardCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var {
      types: { isUint8Array }
    } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL2 } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort2 = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort2;
      opts.port = parsedUrl.port || defaultPort2;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// server/cloud-config.mjs
function normalizeCloudUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new CloudConfigError("INVALID_CLOUD_URL", "Cloud taskboard URL must be a valid URL");
  }
  const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new CloudConfigError(
      "INVALID_CLOUD_URL",
      "Cloud taskboard URL must be an HTTPS origin (loopback HTTP is allowed for development)"
    );
  }
  return url.origin;
}
var CloudConfigError;
var init_cloud_config = __esm({
  "server/cloud-config.mjs"() {
    CloudConfigError = class extends Error {
      constructor(code, message) {
        super(message);
        this.name = "CloudConfigError";
        this.code = code;
      }
    };
  }
});

// shared/domain.mjs
function normalizeAgentKind(value, fallback = DEFAULT_AGENT_KIND) {
  const raw = value === void 0 || value === null || value === "" ? fallback : value;
  if (typeof raw !== "string") throw new TypeError("Agent kind must be a string");
  const normalized = raw.trim().toLowerCase().replace(/[\s_]+/g, "-");
  const canonical = AGENT_KIND_ALIASES.get(normalized) ?? normalized;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/.test(canonical)) {
    throw new TypeError("Agent kind must be a lowercase slug of 1 to 40 characters");
  }
  return canonical;
}
function isTaskStatus(value) {
  return TASK_STATUSES.includes(value);
}
function isTaskPriority(value) {
  return TASK_PRIORITIES.includes(value);
}
var TASK_STATUSES, TASK_PRIORITIES, DEFAULT_PROJECT_ID, DEFAULT_AGENT_KIND, GENERIC_AGENT_KIND, AGENT_KIND_ALIASES;
var init_domain = __esm({
  "shared/domain.mjs"() {
    TASK_STATUSES = [
      "backlog",
      "todo",
      "in_progress",
      "in_review",
      "blocked",
      "done",
      "canceled"
    ];
    TASK_PRIORITIES = ["none", "urgent", "high", "medium", "low"];
    DEFAULT_PROJECT_ID = "local";
    DEFAULT_AGENT_KIND = "codex";
    GENERIC_AGENT_KIND = "agent";
    AGENT_KIND_ALIASES = /* @__PURE__ */ new Map([
      ["claude", "claude-code"],
      ["open-claw", "openclaw"]
    ]);
  }
});

// cli/taskctl.mjs
var taskctl_exports = {};
__export(taskctl_exports, {
  DEFAULT_API_URL: () => DEFAULT_API_URL,
  SCHEMA_VERSION: () => SCHEMA_VERSION,
  main: () => main,
  parseArgs: () => parseArgs
});
import { execFile, spawn } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
function parseArgs(argv) {
  if (!Array.isArray(argv)) {
    throw new TypeError("argv must be an array");
  }
  const positionals = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--") {
      positionals.push(...argv.slice(index + 1));
      break;
    }
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }
    const equalsIndex = token.indexOf("=");
    const name = token.slice(2, equalsIndex === -1 ? void 0 : equalsIndex);
    if (!name) {
      throw usageError("Invalid empty option");
    }
    if (Object.hasOwn(options, name)) {
      throw usageError(`Option --${name} may only be specified once`);
    }
    if (BOOLEAN_OPTIONS.has(name)) {
      if (equalsIndex !== -1) {
        throw usageError(`Option --${name} does not accept a value`);
      }
      options[name] = true;
      continue;
    }
    if (equalsIndex !== -1) {
      options[name] = token.slice(equalsIndex + 1);
      continue;
    }
    const value = argv[index + 1];
    if (value === void 0 || value.startsWith("--")) {
      throw usageError(`Option --${name} requires a value`);
    }
    options[name] = value;
    index += 1;
  }
  return {
    resource: positionals[0],
    action: positionals[1],
    operands: positionals.slice(2),
    options
  };
}
async function main(argv = process.argv.slice(2), overrides = {}) {
  const stdout = overrides.stdout ?? process.stdout;
  const stderr = overrides.stderr ?? process.stderr;
  try {
    const parsed = parseArgs(argv);
    if (parsed.options.help) {
      const scope = `${parsed.resource ?? ""} ${parsed.action ?? ""}`.trim();
      const help = HELP_TEXT.get(scope);
      if (!help || parsed.operands.length > 0 || Object.keys(parsed.options).length !== 1) {
        throw usageError("Help is available for taskctl, taskctl issue, and taskctl comment list");
      }
      stdout.write(`${help}
`);
      return 0;
    }
    const result = await execute(parsed, overrides);
    writeJson(stdout, { ...result, schemaVersion: SCHEMA_VERSION });
    return 0;
  } catch (error) {
    const normalized = normalizeError(error);
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      error: {
        code: normalized.code,
        message: normalized.message
      }
    };
    if (normalized.details !== void 0) {
      payload.error.details = normalized.details;
    }
    writeJson(stderr, payload);
    return normalized.exitCode;
  }
}
async function execute(parsed, overrides) {
  const command = `${parsed.resource ?? ""} ${parsed.action ?? ""}`.trim();
  const allowedOptions = COMMAND_OPTIONS.get(command);
  if (!allowedOptions) {
    throw usageError(
      "Expected one of: project list/create/map/readme, cloud login/status/logout, issue list/get/create/update/move/archive/restore/tree/relation, comment list/add/update/delete, attachment list/download/upload, context current"
    );
  }
  validateOptions(parsed.options, allowedOptions);
  const processEnv = overrides.env ?? process.env;
  const env = parsed.options["runtime-file"] === void 0 ? processEnv : { ...processEnv, CODEX_TASKBOARD_RUNTIME_FILE: parsed.options["runtime-file"] };
  const usesCompanionControl = command.startsWith("cloud ") || command === "project map";
  const target = usesCompanionControl || env.CODEX_TASKBOARD_COMPANION_URL !== void 0 ? await resolveCompanionUrl(env, overrides) : await resolveTaskboardBaseUrl(env, overrides);
  const agentKind = resolveTaskctlAgentKind(
    parsed.options.agent ?? env.TASKBOARD_AGENT_KIND,
    env
  );
  if (target.autoStart && overrides.fetch === void 0) {
    await ensureLocalCompanion(target.url, env, overrides);
  }
  const api = createApiClient(overrides, { ...target, agentKind });
  switch (command) {
    case "project list":
      expectOperandCount(parsed, 0);
      return api.request("GET", "/api/projects");
    case "project create":
      expectOperandCount(parsed, 0);
      return api.request("POST", "/api/projects", {
        ...optionalField("id", parsed.options.id),
        name: requiredOption(parsed.options, "name"),
        ...optionalField(
          "workspacePath",
          parsed.options["workspace-path"] === void 0 ? void 0 : resolveInputPath(parsed.options["workspace-path"], overrides)
        )
      });
    case "project map":
      expectOperandCount(parsed, 1);
      return api.request(
        "PUT",
        `/api/local/project-mappings/${encodeURIComponent(parsed.operands[0])}`,
        {
          workspacePath: resolveInputPath(
            requiredOption(parsed.options, "workspace-path"),
            overrides
          )
        }
      );
    case "project readme":
      return executeProjectReadme(api, parsed, overrides);
    case "cloud login":
      expectOperandCount(parsed, 0);
      return cloudLogin(
        api,
        requiredOption(parsed.options, "url"),
        requiredOption(parsed.options, "actor-name"),
        overrides
      );
    case "cloud status":
      expectOperandCount(parsed, 0);
      return api.request("GET", "/api/local/cloud-session");
    case "cloud logout":
      expectOperandCount(parsed, 0);
      return api.request("DELETE", "/api/local/cloud-session");
    case "issue list":
      expectOperandCount(parsed, 0);
      return listIssues(api, parsed.options);
    case "issue get":
      expectOperandCount(parsed, 1);
      return api.request("GET", taskPath(parsed.operands[0]));
    case "issue create":
      expectOperandCount(parsed, 0);
      return createIssue(api, parsed.options, overrides);
    case "issue update":
      expectOperandCount(parsed, 1);
      return updateIssue(api, parsed.operands[0], parsed.options, overrides);
    case "issue move":
      expectOperandCount(parsed, 1);
      return moveIssue(api, parsed.operands[0], parsed.options, overrides);
    case "issue archive":
      expectOperandCount(parsed, 1);
      return archiveIssue(api, parsed.operands[0], parsed.options, overrides, "archive");
    case "issue restore":
      expectOperandCount(parsed, 1);
      return archiveIssue(api, parsed.operands[0], parsed.options, overrides, "restore");
    case "issue tree":
      expectOperandCount(parsed, 1);
      return getIssueTree(api, parsed.operands[0], parsed.options);
    case "issue relation":
      expectOperandCount(parsed, 2);
      return mutateIssueRelation(
        api,
        parsed.operands[0],
        parsed.operands[1],
        parsed.options,
        overrides
      );
    case "comment list": {
      expectOperandCount(parsed, 1);
      const search = new URLSearchParams();
      if (parsed.options.after !== void 0) search.set("after", parsed.options.after);
      const query = search.size > 0 ? `?${search}` : "";
      return api.request("GET", `${taskPath(parsed.operands[0])}/comments${query}`);
    }
    case "comment add": {
      expectOperandCount(parsed, 1);
      if (parsed.options.body !== void 0 && parsed.options["body-file"] !== void 0) {
        throw usageError("Use either --body or --body-file, not both");
      }
      let body;
      if (parsed.options["body-file"] === void 0) {
        body = requiredOption(parsed.options, "body");
      } else {
        const read = overrides.readFile ?? readFile;
        try {
          body = await read(parsed.options["body-file"], "utf8");
        } catch (error) {
          throw new TaskctlError(`Cannot read comment body file: ${parsed.options["body-file"]}`, {
            code: "FILE_READ_FAILED",
            exitCode: 2,
            details: error instanceof Error ? error.message : String(error)
          });
        }
      }
      return api.request("POST", `${taskPath(parsed.operands[0])}/comments`, {
        body,
        threadId: resolveThreadId(parsed.options, overrides),
        ...optionalField("threadBinding", threadBindingFromOptions(parsed.options))
      });
    }
    case "comment update":
      expectOperandCount(parsed, 1);
      return api.request("PATCH", commentPath(parsed.operands[0]), {
        body: requiredOption(parsed.options, "body"),
        threadId: resolveThreadId(parsed.options, overrides),
        version: explicitVersion(parsed.options["if-version"])
      });
    case "comment delete":
      expectOperandCount(parsed, 1);
      return api.request("DELETE", commentPath(parsed.operands[0]), {
        threadId: resolveThreadId(parsed.options, overrides),
        version: explicitVersion(parsed.options["if-version"])
      });
    case "attachment list": {
      expectOperandCount(parsed, 0);
      const taskId = parsed.options.task;
      const commentId = parsed.options.comment;
      if (Boolean(taskId) === Boolean(commentId)) {
        throw usageError("attachment list requires exactly one of --task or --comment");
      }
      const search = new URLSearchParams();
      if (parsed.options.after !== void 0) search.set("after", parsed.options.after);
      const query = search.size > 0 ? `?${search}` : "";
      const pathname = taskId ? `${taskPath(taskId)}/attachments` : `${commentPath(commentId)}/attachments`;
      return api.request("GET", `${pathname}${query}`);
    }
    case "attachment download":
      expectOperandCount(parsed, 1);
      return downloadAttachment(api, parsed.operands[0], parsed.options, overrides);
    case "attachment upload":
      expectOperandCount(parsed, 0);
      return uploadAttachment(api, parsed.options, overrides);
    case "context current":
      expectOperandCount(parsed, 0);
      return currentContext(api, parsed.options, overrides);
    default:
      throw usageError(`Unsupported command: ${command}`);
  }
}
function resolveTaskctlAgentKind(value, env) {
  const fallback = env.CODEX_THREAD_ID ? DEFAULT_AGENT_KIND : GENERIC_AGENT_KIND;
  try {
    return normalizeAgentKind(value, fallback);
  } catch (error) {
    throw usageError(error instanceof Error ? error.message : String(error));
  }
}
function createApiClient(overrides, {
  url: explicitBaseUrl,
  windowsTransport = false,
  agentKind = DEFAULT_AGENT_KIND
} = {}) {
  const fetchImplementation = overrides.fetch ?? (windowsTransport ? (url, init) => fetchThroughWindows(url, init, overrides) : globalThis.fetch);
  if (typeof fetchImplementation !== "function") {
    throw new TaskctlError("fetch is not available", {
      code: "CLIENT_UNAVAILABLE",
      exitCode: 3
    });
  }
  const baseUrl = normalizeBaseUrl(explicitBaseUrl ?? DEFAULT_API_URL);
  const taskctlHeaders = {
    "x-taskboard-client": "taskctl",
    "x-taskboard-agent-kind": agentKind
  };
  return {
    async request(method, pathname, body) {
      let response;
      try {
        response = await fetchImplementation(resolveApiUrl(baseUrl, pathname), {
          method,
          headers: {
            accept: "application/json",
            ...taskctlHeaders,
            ...body === void 0 ? {} : { "content-type": "application/json" }
          },
          ...body === void 0 ? {} : { body: JSON.stringify(body) }
        });
      } catch (error) {
        throw new TaskctlError(`Cannot reach taskboard service at ${baseUrl}`, {
          code: "SERVICE_UNAVAILABLE",
          exitCode: 3,
          details: error instanceof Error ? error.message : String(error)
        });
      }
      const payload = await readResponse(response);
      if (!response.ok) {
        const apiError = extractApiError(payload, response.status);
        throw new TaskctlError(apiError.message, {
          code: apiError.code,
          exitCode: response.status === 409 ? 5 : 4,
          details: apiError.details
        });
      }
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new TaskctlError("Taskboard service returned an invalid JSON response", {
          code: "INVALID_RESPONSE",
          exitCode: 4
        });
      }
      return payload;
    },
    async download(pathname) {
      let response;
      try {
        response = await fetchImplementation(resolveApiUrl(baseUrl, pathname), {
          headers: {
            accept: "*/*",
            ...taskctlHeaders
          }
        });
      } catch (error) {
        throw new TaskctlError(`Cannot reach taskboard service at ${baseUrl}`, {
          code: "SERVICE_UNAVAILABLE",
          exitCode: 3,
          details: error instanceof Error ? error.message : String(error)
        });
      }
      if (!response.ok) {
        const payload = await readResponse(response);
        const apiError = extractApiError(payload, response.status);
        throw new TaskctlError(apiError.message, {
          code: apiError.code,
          exitCode: response.status === 409 ? 5 : 4,
          details: apiError.details
        });
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      return {
        bytes,
        contentType: response.headers.get("content-type"),
        size: Number(response.headers.get("content-length")) || bytes.byteLength
      };
    },
    async upload(pathname, { body, contentType, filename, kind }) {
      let response;
      try {
        response = await fetchImplementation(resolveApiUrl(baseUrl, pathname), {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": contentType,
            ...taskctlHeaders,
            "x-taskboard-filename": encodeURIComponent(filename),
            "x-taskboard-attachment-kind": kind
          },
          body
        });
      } catch (error) {
        throw new TaskctlError(`Cannot reach taskboard service at ${baseUrl}`, {
          code: "SERVICE_UNAVAILABLE",
          exitCode: 3,
          details: error instanceof Error ? error.message : String(error)
        });
      }
      const payload = await readResponse(response);
      if (!response.ok) {
        const apiError = extractApiError(payload, response.status);
        throw new TaskctlError(apiError.message, {
          code: apiError.code,
          exitCode: response.status === 409 ? 5 : 4,
          details: apiError.details
        });
      }
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new TaskctlError("Taskboard service returned an invalid JSON response", {
          code: "INVALID_RESPONSE",
          exitCode: 4
        });
      }
      return payload;
    }
  };
}
async function downloadAttachment(api, attachmentId, options, overrides) {
  const output = resolveInputPath(requiredOption(options, "output"), overrides);
  const downloaded = await api.download(attachmentContentPath(attachmentId));
  const write = overrides.writeFile ?? writeFile;
  try {
    await write(output, downloaded.bytes);
  } catch (error) {
    throw new TaskctlError(`Cannot write attachment file: ${output}`, {
      code: "FILE_WRITE_FAILED",
      exitCode: 2,
      details: error instanceof Error ? error.message : String(error)
    });
  }
  return {
    attachmentId,
    output,
    contentType: downloaded.contentType,
    size: downloaded.size
  };
}
async function uploadAttachment(api, options, overrides) {
  const taskId = options.task;
  const commentId = options.comment;
  if (Boolean(taskId) === Boolean(commentId)) {
    throw usageError("attachment upload requires exactly one of --task or --comment");
  }
  const filePath = resolveInputPath(requiredOption(options, "file"), overrides);
  const read = overrides.readFile ?? readFile;
  let bytes;
  try {
    bytes = await read(filePath);
  } catch (error) {
    throw new TaskctlError(`Cannot read attachment file: ${filePath}`, {
      code: "FILE_READ_FAILED",
      exitCode: 2,
      details: error instanceof Error ? error.message : String(error)
    });
  }
  const filename = path.basename(filePath);
  if (!filename || filename === "." || filename === "..") {
    throw usageError("Attachment --file must include a valid filename");
  }
  const contentType = options["content-type"] ? String(options["content-type"]).trim().toLowerCase() : guessContentType(filename);
  if (!contentType) {
    throw usageError("--content-type cannot be empty");
  }
  const kind = options.kind ?? (contentType.startsWith("image/") ? "inline" : "attachment");
  if (kind !== "inline" && kind !== "attachment") {
    throw usageError("--kind must be inline or attachment");
  }
  const body = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const pathname = taskId ? `${taskPath(taskId)}/attachments` : `${commentPath(commentId)}/attachments`;
  const payload = await api.upload(pathname, {
    body,
    contentType,
    filename,
    kind
  });
  return {
    attachment: payload.attachment ?? null,
    file: filePath,
    kind,
    target: taskId ? { type: "task", id: taskId } : { type: "comment", id: commentId }
  };
}
function guessContentType(filename) {
  switch (path.extname(filename).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".md":
      return "text/markdown";
    case ".txt":
      return "text/plain";
    case ".json":
      return "application/json";
    case ".pdf":
      return "application/pdf";
    case ".html":
    case ".htm":
      return "text/html";
    default:
      return "application/octet-stream";
  }
}
async function executeProjectReadme(api, parsed, overrides) {
  const operands = parsed.operands;
  const firstOperand = operands[0];
  const isExplicitSet = firstOperand === "set";
  const isExplicitGet = firstOperand === "get";
  const isOptionSet = parsed.options.content !== void 0 || parsed.options.file !== void 0;
  const isSet = isExplicitSet || !isExplicitGet && isOptionSet;
  let rawProjectId;
  if (isExplicitSet || isExplicitGet) {
    if (operands.length > 2) {
      throw usageError(`project readme ${firstOperand} accepts at most 1 positional argument (project id)`);
    }
    rawProjectId = operands[1];
  } else {
    if (operands.length > 1) {
      throw usageError("project readme accepts at most 1 positional argument (project id)");
    }
    rawProjectId = operands[0];
  }
  let projectId = rawProjectId;
  if (!projectId) {
    const context = await currentContext(api, {}, overrides);
    projectId = context.project?.id ?? DEFAULT_PROJECT_ID;
  }
  if (isSet) {
    let content = parsed.options.content;
    if (content !== void 0 && parsed.options.file !== void 0) {
      throw usageError("Use either --content or --file, not both");
    }
    if (parsed.options.file !== void 0) {
      const read = overrides.readFile ?? readFile;
      try {
        content = await read(parsed.options.file, "utf8");
      } catch (error) {
        throw new TaskctlError(`Cannot read file: ${parsed.options.file}`, {
          code: "FILE_READ_FAILED",
          exitCode: 2,
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
    if (content === void 0) {
      throw usageError("project readme set requires --content or --file");
    }
    const ifVersion = parsed.options["if-version"] !== void 0 ? explicitVersion(parsed.options["if-version"], { allowZero: true }) : void 0;
    return api.request("PUT", `/api/projects/${encodeURIComponent(projectId)}/readme`, {
      content,
      ...ifVersion !== void 0 ? { version: ifVersion } : {}
    });
  }
  if (parsed.options.content !== void 0 || parsed.options.file !== void 0 || parsed.options["if-version"] !== void 0) {
    throw usageError("project readme get does not accept --content, --file, or --if-version");
  }
  return api.request("GET", `/api/projects/${encodeURIComponent(projectId)}/readme`);
}
async function cloudLogin(api, rawUrl, actorName, overrides) {
  let remoteUrl;
  try {
    remoteUrl = normalizeCloudUrl(rawUrl);
  } catch (error) {
    throw new TaskctlError(error instanceof Error ? error.message : String(error), {
      code: error?.code ?? "INVALID_CLOUD_URL",
      exitCode: 2
    });
  }
  const accountPassword = overrides.readSecret ? await overrides.readSecret() : await readSecretFromInput(
    overrides.stdin ?? process.stdin,
    overrides.stderr ?? process.stderr
  );
  if (typeof accountPassword !== "string" || !accountPassword) {
    throw usageError("Account password cannot be empty");
  }
  return api.request("PUT", "/api/local/cloud-session", {
    remoteUrl,
    actorName,
    accountPassword
  });
}
async function readSecretFromInput(input2, output) {
  if (!input2.isTTY) {
    let value = "";
    for await (const chunk of input2) value += chunk;
    return value.replace(/\r?\n$/, "");
  }
  return new Promise((resolve, reject) => {
    let value = "";
    const wasRaw = input2.isRaw;
    const wasPaused = input2.isPaused();
    const finish = (error) => {
      input2.off("data", onData);
      input2.setRawMode(wasRaw);
      if (wasPaused) input2.pause();
      output.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of String(chunk)) {
        if (character === "\r" || character === "\n") return finish();
        if (character === "") {
          return finish(new TaskctlError("Cloud login canceled", {
            code: "CANCELED",
            exitCode: 2
          }));
        }
        if (character === "\x7F" || character === "\b") {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    };
    output.write("Account password: ");
    input2.setRawMode(true);
    input2.setEncoding("utf8");
    input2.resume();
    input2.on("data", onData);
  });
}
async function listIssues(api, options) {
  if (options.status !== void 0) {
    assertStatus(options.status);
  }
  if (options.archived !== void 0 && !["true", "false", "all"].includes(options.archived)) {
    throw usageError("--archived must be true, false, or all");
  }
  const search = new URLSearchParams();
  if (options.project !== void 0) search.set("projectId", options.project);
  if (options.status !== void 0) search.set("status", options.status);
  if (options.archived !== void 0) search.set("archived", options.archived);
  const query = search.size > 0 ? `?${search}` : "";
  return api.request("GET", `/api/tasks${query}`);
}
async function createIssue(api, options, overrides) {
  const status = options.status ?? "backlog";
  const priority = options.priority ?? "none";
  assertStatus(status);
  assertPriority(priority);
  const developmentContext = developmentContextFromOptions(options, overrides);
  const recurrence = recurrenceFromOptions(options);
  const threadId = resolveThreadId(options, overrides);
  const assigneeTarget = await resolveAssigneeTarget(api, options.assignee);
  return api.request("POST", "/api/tasks", {
    projectId: requiredOption(options, "project"),
    title: requiredOption(options, "title"),
    description: await resolveDescription(options, overrides),
    status,
    priority,
    labels: parseLabels(options.labels),
    threadId,
    ...optionalField("assigneeTarget", assigneeTarget),
    ...optionalField("developmentContext", developmentContext),
    ...optionalField("startDate", options["start-date"]),
    ...optionalField("dueDate", options["due-date"]),
    ...optionalField("recurrence", recurrence)
  });
}
async function updateIssue(api, taskId, options, overrides) {
  if (options.status !== void 0) assertStatus(options.status);
  if (options.priority !== void 0) assertPriority(options.priority);
  const developmentContext = developmentContextFromOptions(options, overrides);
  const recurrence = recurrenceFromOptions(options);
  const threadId = resolveThreadId(options, overrides);
  const assigneeTarget = await resolveAssigneeTarget(api, options.assignee);
  const patch = {
    ...optionalField("projectId", options.project),
    ...optionalField("title", options.title),
    ...optionalField("status", options.status),
    ...optionalField("priority", options.priority),
    ...optionalField("labels", options.labels === void 0 ? void 0 : parseLabels(options.labels)),
    ...optionalField("assigneeTarget", assigneeTarget),
    ...optionalField("developmentContext", developmentContext),
    ...optionalField("startDate", options["start-date"]),
    ...optionalField("dueDate", options["due-date"]),
    ...optionalField("recurrence", recurrence)
  };
  if (options.description !== void 0 || options["description-file"] !== void 0) {
    patch.description = await resolveDescription(options, overrides);
  }
  if (Object.keys(patch).length === 0) {
    throw usageError("issue update requires at least one field to update");
  }
  patch.threadId = threadId;
  patch.version = await resolveVersion(api, taskId, options["if-version"]);
  return api.request("PATCH", taskPath(taskId), patch);
}
async function resolveAssigneeTarget(api, rawAssignee) {
  if (rawAssignee === void 0) return void 0;
  const value = rawAssignee.trim();
  if (!value) throw usageError("--assignee cannot be empty");
  if (value === "current-user" || value === "codex-agent") return value;
  if (value.startsWith("agent:")) {
    try {
      const kind = value.slice("agent:".length);
      if (!kind) throw new TypeError("Agent kind cannot be empty");
      return `agent:${normalizeAgentKind(kind)}`;
    } catch (error) {
      throw usageError(error instanceof Error ? error.message : String(error));
    }
  }
  const response = await api.request("GET", "/api/members");
  const members = Array.isArray(response.members) ? response.members.filter((member2) => member2?.active === true) : [];
  const normalized = value.normalize("NFKC").toLocaleLowerCase("en-US");
  const idMatch = members.find((member2) => member2.id === value || `member:${member2.id}` === value);
  const usernameMatch = members.find((member2) => member2.username.normalize("NFKC").toLocaleLowerCase("en-US") === normalized);
  const displayMatches = members.filter((member2) => member2.displayName.normalize("NFKC").toLocaleLowerCase("en-US") === normalized);
  const member = idMatch ?? usernameMatch ?? (displayMatches.length === 1 ? displayMatches[0] : null);
  if (!member) {
    throw usageError(displayMatches.length > 1 ? `Member name '${value}' is ambiguous; use the exact username or member id` : `Active member '${value}' does not exist`);
  }
  return `member:${member.id}`;
}
async function moveIssue(api, taskId, options, overrides) {
  const status = requiredOption(options, "status");
  assertStatus(status);
  const threadId = resolveThreadId(options, overrides);
  const threadBinding = threadBindingFromOptions(options);
  return api.request("POST", `${taskPath(taskId)}/move`, {
    status,
    threadId,
    ...optionalField("threadBinding", threadBinding),
    version: await resolveVersion(api, taskId, options["if-version"])
  });
}
function threadBindingFromOptions(options) {
  const fields = [
    options["binding-thread-id"],
    options["binding-codex-project-id"],
    options["binding-codex-project-kind"],
    options["binding-codex-host-id"],
    options["binding-workspace-path"]
  ];
  if (options["clear-binding-thread"]) {
    if (fields.some((field) => field !== void 0)) {
      throw usageError("--clear-binding-thread cannot be combined with binding identity options");
    }
    return null;
  }
  if (fields.every((field) => field === void 0)) return void 0;
  const threadId = requiredOption(options, "binding-thread-id").trim();
  if (!threadId || threadId.length > 256) {
    throw usageError("--binding-thread-id must contain 1 to 256 characters");
  }
  const identityFields = fields.slice(1);
  if (identityFields.every((field) => field === void 0)) return { threadId };
  if (identityFields.some((field) => field === void 0)) {
    throw usageError("Binding identity requires project id, kind, host id, and workspace path");
  }
  const codexProjectId = options["binding-codex-project-id"].trim();
  const codexProjectKind = options["binding-codex-project-kind"];
  const codexHostId = options["binding-codex-host-id"].trim();
  const workspacePath = options["binding-workspace-path"];
  if (!codexProjectId || codexProjectId.length > 256) {
    throw usageError("--binding-codex-project-id must contain 1 to 256 characters");
  }
  if (codexProjectKind !== "local" && codexProjectKind !== "remote") {
    throw usageError("--binding-codex-project-kind must be local or remote");
  }
  if (!codexHostId || codexHostId.length > 256 || codexProjectKind === "local" && codexHostId !== "local" || codexProjectKind === "remote" && codexHostId === "local") {
    throw usageError("--binding-codex-host-id does not match the project kind");
  }
  if (!path.posix.isAbsolute(workspacePath) && !path.win32.isAbsolute(workspacePath)) {
    throw usageError("--binding-workspace-path must be absolute");
  }
  return { threadId, codexProjectId, codexProjectKind, codexHostId, workspacePath };
}
async function archiveIssue(api, taskId, options, overrides, action) {
  const threadId = resolveThreadId(options, overrides);
  return api.request("POST", `${taskPath(taskId)}/${action}`, {
    threadId,
    version: await resolveVersion(api, taskId, options["if-version"])
  });
}
async function getIssueTree(api, taskId, options) {
  const direction = requiredOption(options, "direction");
  if (direction !== "descendants" && direction !== "ancestors") {
    throw usageError("--direction must be descendants or ancestors");
  }
  const rawDepth = requiredOption(options, "depth");
  const depth = Number(rawDepth);
  if (!/^\d+$/.test(rawDepth) || !Number.isSafeInteger(depth) || depth < 1 || depth > 25) {
    throw usageError("--depth must be an integer from 1 to 25");
  }
  const query = new URLSearchParams({ direction, depth: String(depth) });
  return api.request("GET", `${taskPath(taskId)}/tree?${query}`);
}
async function mutateIssueRelation(api, action, taskId, options, overrides) {
  if (action !== "add" && action !== "remove") {
    throw usageError("issue relation action must be add or remove");
  }
  const type = requiredOption(options, "type");
  if (!["parent", "blocks", "blocked_by", "related"].includes(type)) {
    throw usageError("--type must be parent, blocks, blocked_by, or related");
  }
  const relatedTaskId = requiredOption(options, "issue");
  const threadId = resolveThreadId(options, overrides);
  const version = await resolveVersion(api, taskId, options["if-version"]);
  return api.request(
    action === "add" ? "POST" : "DELETE",
    `${taskPath(taskId)}/relations/${type}/${encodeURIComponent(relatedTaskId)}`,
    { threadId, version }
  );
}
async function currentContext(api, options, overrides) {
  const cwd = path.resolve(options.cwd ?? overrides.cwd ?? process.cwd());
  const response = await api.request("GET", "/api/projects");
  const projects = Array.isArray(response.projects) ? response.projects : [];
  const matchingProjects = projects.filter((candidate) => workspaceContains(candidate?.workspacePath, cwd)).sort((left, right) => right.workspacePath.length - left.workspacePath.length);
  const project = matchingProjects[0] ?? projects.find((candidate) => candidate?.id === DEFAULT_PROJECT_ID) ?? projects[0] ?? null;
  return { cwd, project };
}
function workspaceContains(workspacePath, cwd) {
  if (typeof workspacePath !== "string" || workspacePath.length === 0) return false;
  const relative = path.relative(path.resolve(workspacePath), cwd);
  return relative === "" || !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}
function resolveInputPath(value, overrides) {
  return path.resolve(overrides.cwd ?? process.cwd(), value);
}
async function resolveVersion(api, taskId, rawVersion) {
  if (rawVersion !== void 0) {
    const version2 = Number(rawVersion);
    if (!Number.isSafeInteger(version2) || version2 < 1) {
      throw usageError("--if-version must be a positive integer");
    }
    return version2;
  }
  const response = await api.request("GET", taskPath(taskId));
  const version = response.task?.version;
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new TaskctlError("Taskboard service returned a task without a valid version", {
      code: "INVALID_RESPONSE",
      exitCode: 4
    });
  }
  return version;
}
async function resolveDescription(options, overrides) {
  if (options.description !== void 0 && options["description-file"] !== void 0) {
    throw usageError("Use either --description or --description-file, not both");
  }
  if (options["description-file"] === void 0) {
    return options.description ?? "";
  }
  const read = overrides.readFile ?? readFile;
  try {
    return await read(options["description-file"], "utf8");
  } catch (error) {
    throw new TaskctlError(`Cannot read description file: ${options["description-file"]}`, {
      code: "FILE_READ_FAILED",
      exitCode: 2,
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
function parseLabels(rawLabels) {
  if (rawLabels === void 0 || rawLabels === "") return [];
  return [...new Set(rawLabels.split(",").map((label) => label.trim()).filter(Boolean))];
}
function developmentContextFromOptions(options, overrides) {
  const branch = options["git-branch"];
  const worktreePath = options["worktree-path"];
  const worktreeBranch = options["worktree-branch"];
  if (branch !== void 0 && (worktreePath !== void 0 || worktreeBranch !== void 0)) {
    throw usageError("Use either --git-branch or --worktree-path/--worktree-branch, not both");
  }
  if (worktreeBranch !== void 0 && worktreePath === void 0) {
    throw usageError("--worktree-branch requires --worktree-path");
  }
  if (branch !== void 0) return { type: "branch", branch };
  if (worktreePath !== void 0) {
    return {
      type: "worktree",
      path: resolveInputPath(worktreePath, overrides),
      branch: worktreeBranch ?? null
    };
  }
  return void 0;
}
function recurrenceFromOptions(options) {
  const rawInterval = options["recurrence-interval"];
  const unit = options["recurrence-unit"];
  if (rawInterval === void 0 && unit === void 0) return void 0;
  if (rawInterval === void 0 || unit === void 0) {
    throw usageError("Use --recurrence-interval and --recurrence-unit together");
  }
  const interval = Number(rawInterval);
  if (!Number.isSafeInteger(interval) || interval < 1 || interval > 365) {
    throw usageError("--recurrence-interval must be an integer from 1 to 365");
  }
  if (!["day", "week", "month", "year"].includes(unit)) {
    throw usageError("--recurrence-unit must be day, week, month, or year");
  }
  return { interval, unit };
}
function resolveThreadId(options, overrides) {
  const env = overrides.env ?? process.env;
  const value = options["thread-id"] ?? env.CODEX_THREAD_ID;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw usageError("Codex conversation attribution requires --thread-id or CODEX_THREAD_ID");
  }
  const threadId = value.trim();
  if (threadId.length > 256) {
    throw usageError("--thread-id and CODEX_THREAD_ID cannot exceed 256 characters");
  }
  return threadId;
}
function requiredOption(options, name) {
  const value = options[name];
  if (value === void 0 || value === "") {
    throw usageError(`Missing required option --${name}`);
  }
  return value;
}
function optionalField(name, value) {
  return value === void 0 ? {} : { [name]: value };
}
function validateOptions(options, allowedOptions) {
  for (const name of Object.keys(options)) {
    if (!allowedOptions.has(name) && !GLOBAL_OPTIONS.has(name)) {
      throw usageError(`Unknown option --${name}`);
    }
  }
}
function expectOperandCount(parsed, expected) {
  if (parsed.operands.length !== expected) {
    throw usageError(
      expected === 0 ? `${parsed.resource} ${parsed.action} does not accept positional arguments` : `${parsed.resource} ${parsed.action} requires exactly ${expected} positional ${expected === 1 ? "argument" : "arguments"}`
    );
  }
}
function assertStatus(status) {
  if (!isTaskStatus(status)) {
    throw usageError(`Invalid status: ${status}. Expected one of: ${TASK_STATUSES.join(", ")}`);
  }
}
function assertPriority(priority) {
  if (!isTaskPriority(priority)) {
    throw usageError(`Invalid priority: ${priority}`);
  }
}
function taskPath(taskId) {
  if (!taskId) throw usageError("Missing issue id");
  return `/api/tasks/${encodeURIComponent(taskId)}`;
}
function commentPath(commentId) {
  if (!commentId) throw usageError("Missing comment id");
  return `/api/comments/${encodeURIComponent(commentId)}`;
}
function attachmentContentPath(attachmentId) {
  if (!attachmentId) throw usageError("Missing attachment id");
  return `/api/attachments/${encodeURIComponent(attachmentId)}/content`;
}
function explicitVersion(rawVersion, { allowZero = false } = {}) {
  if (rawVersion === void 0) throw usageError("Missing required option --if-version");
  const version = Number(rawVersion);
  if (!Number.isSafeInteger(version) || version < (allowZero ? 0 : 1)) {
    throw usageError(`--if-version must be a ${allowZero ? "non-negative" : "positive"} integer`);
  }
  return version;
}
function normalizeBaseUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw usageError("CODEX_TASKBOARD_URL must be a valid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw usageError("CODEX_TASKBOARD_URL must use http or https");
  }
  url.pathname = url.pathname.replace(/\/$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}
function resolveApiUrl(baseUrl, pathname) {
  return new URL(pathname.replace(/^\//, ""), `${baseUrl}/`);
}
async function resolveTaskboardBaseUrl(env, overrides) {
  if (env.CODEX_TASKBOARD_URL !== void 0) {
    return { url: env.CODEX_TASKBOARD_URL, windowsTransport: false, autoStart: false };
  }
  const configuredDescriptorPath = env.CODEX_TASKBOARD_RUNTIME_FILE;
  const isWsl = isWslEnvironment(env);
  const wslRuntimeFile = env.CODEX_TASKBOARD_WSL_RUNTIME_FILE;
  const descriptorCandidates = configuredDescriptorPath !== void 0 ? [{
    path: configuredDescriptorPath,
    read: overrides.readFile ?? readFile,
    required: true,
    windowsTransport: false
  }] : isWsl && wslRuntimeFile !== void 0 ? [{
    path: wslRuntimeFile,
    read: overrides.readFile ?? readFile,
    required: true,
    windowsTransport: true
  }] : [
    ...[isWsl ? await resolveWslRuntimeFile(overrides) : void 0].filter(Boolean).map((descriptorPath) => ({
      path: descriptorPath,
      read: overrides.readFile ?? readFile,
      required: false,
      windowsTransport: true
    })),
    {
      path: sourceRuntimeFile,
      read: readFile,
      required: false,
      windowsTransport: false
    }
  ];
  for (const {
    path: descriptorPath,
    read,
    required,
    windowsTransport
  } of descriptorCandidates) {
    try {
      const descriptor = JSON.parse(await read(descriptorPath, "utf8"));
      if (descriptor?.version !== 1 || typeof descriptor.url !== "string") {
        throw new TaskctlError("The active Taskboard launcher endpoint is invalid", {
          code: "INVALID_RESPONSE",
          exitCode: 4
        });
      }
      return { url: descriptor.url, windowsTransport, autoStart: false };
    } catch (error) {
      if (!required && error?.code === "ENOENT") continue;
      if (error instanceof TaskctlError) throw error;
      throw new TaskctlError("Cannot read the active Taskboard launcher endpoint", {
        code: "SERVICE_UNAVAILABLE",
        exitCode: 3,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return { url: DEFAULT_API_URL, windowsTransport: false, autoStart: true };
}
function isWslEnvironment(env) {
  return env.WSL_DISTRO_NAME !== void 0 || env.WSL_INTEROP !== void 0;
}
async function resolveWslRuntimeFile(overrides) {
  const run = overrides.execFile ?? execFileAsync;
  try {
    const windowsAppData = await run(
      "cmd.exe",
      ["/d", "/u", "/s", "/c", "set APPDATA"],
      { encoding: "buffer" }
    );
    const appDataLine = windowsAppData.stdout.toString("utf16le").split(/\r?\n/).find((line) => line.toUpperCase().startsWith("APPDATA="));
    const windowsAppDataPath = appDataLine?.slice("APPDATA=".length);
    if (windowsAppDataPath === void 0) return void 0;
    const appData = await run(
      "wslpath",
      ["-u", windowsAppDataPath],
      { encoding: "utf8" }
    );
    const appDataPath = appData.stdout.trim();
    return appDataPath ? path.join(appDataPath, "Codex Taskboard", "launcher-runtime.json") : void 0;
  } catch {
    return void 0;
  }
}
async function fetchThroughWindows(url, init, overrides) {
  const run = overrides.spawn ?? spawn;
  const marker = "__CODEX_TASKBOARD_CURL_RESPONSE__";
  const args = [
    "--disable",
    "--noproxy",
    "*",
    "--silent",
    "--show-error",
    "--request",
    init?.method ?? "GET"
  ];
  for (const [name, value] of new Headers(init?.headers)) {
    args.push("--header", `${name}: ${value}`);
  }
  if (init?.body !== void 0) args.push("--data-binary", "@-");
  args.push(
    "--write-out",
    `%{stderr}${marker}%{http_code}	%{content_type}	%{size_download}`,
    "--url",
    url.toString()
  );
  return new Promise((resolve, reject) => {
    const child = run("curl.exe", args, {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.stdin.on("error", reject);
    child.once("error", reject);
    child.once("close", (code) => {
      const errorText = Buffer.concat(stderr).toString("utf8");
      if (code !== 0) {
        reject(new Error(errorText.trim() || `curl.exe exited with ${code}`));
        return;
      }
      const markerIndex = errorText.lastIndexOf(marker);
      if (markerIndex === -1) {
        reject(new Error("curl.exe did not return HTTP response metadata"));
        return;
      }
      const [statusText, contentType, contentLength] = errorText.slice(markerIndex + marker.length).split("	");
      const status = Number(statusText);
      if (!Number.isInteger(status) || status < 100 || status > 599) {
        reject(new Error("curl.exe returned invalid HTTP response metadata"));
        return;
      }
      const body = Buffer.concat(stdout);
      resolve(new Response(body.length === 0 ? null : body, {
        status,
        headers: {
          ...contentType ? { "content-type": contentType } : {},
          ...contentLength ? { "content-length": contentLength } : {}
        }
      }));
    });
    child.stdin.end(init?.body);
  });
}
async function resolveCompanionUrl(env, overrides) {
  const target = env.CODEX_TASKBOARD_COMPANION_URL !== void 0 ? { url: env.CODEX_TASKBOARD_COMPANION_URL, windowsTransport: false, autoStart: false } : await resolveTaskboardBaseUrl(env, overrides);
  let url;
  try {
    url = new URL(target.url);
  } catch {
    throw usageError("Local companion URL must be a valid URL");
  }
  const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
  const instanceToken = url.pathname.replace(/^\//, "").replace(/\/$/, "");
  const hasValidPathname = url.pathname === "/" || /^[a-z0-9-]{16,128}$/i.test(instanceToken) && !instanceToken.includes("/");
  if (!isLoopback || url.protocol !== "http:" && url.protocol !== "https:" || url.username || url.password || !hasValidPathname || url.search || url.hash) {
    throw usageError("Local companion URL must be a loopback HTTP or HTTPS endpoint");
  }
  return {
    url: url.toString().replace(/\/$/, ""),
    windowsTransport: target.windowsTransport,
    autoStart: target.autoStart
  };
}
async function localCompanionReachable(url) {
  try {
    const response = await fetch(resolveApiUrl(normalizeBaseUrl(url), "/health"), {
      signal: AbortSignal.timeout(750)
    });
    return response.ok;
  } catch {
    return false;
  }
}
function isSupportedNodeVersion(version) {
  const parts = String(version).replace(/^v/i, "").split(".").map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => !Number.isFinite(part))) return false;
  for (let index = 0; index < MIN_COMPANION_NODE_VERSION.length; index += 1) {
    if (parts[index] > MIN_COMPANION_NODE_VERSION[index]) return true;
    if (parts[index] < MIN_COMPANION_NODE_VERSION[index]) return false;
  }
  return true;
}
function standaloneDataDirectory(env) {
  if (process.platform === "win32") {
    return path.join(
      env.LOCALAPPDATA || env.APPDATA || path.join(os.homedir(), "AppData", "Local"),
      "Codex Taskboard"
    );
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Codex Taskboard");
  }
  return path.join(env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "codex-taskboard");
}
async function resolveCompanionNodeExecutable(env) {
  if (isSupportedNodeVersion(process.versions.node)) return process.execPath;
  const candidates = [];
  const configuredPath = env.TASKBOARD_NODE_PATH?.trim();
  if (configuredPath) candidates.push(configuredPath);
  try {
    const command = process.platform === "win32" ? "where.exe" : "which";
    const { stdout } = await execFileAsync(command, ["node"], {
      encoding: "utf8",
      env,
      maxBuffer: 64 * 1024
    });
    candidates.push(...stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
  } catch {
  }
  const seen = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    const normalizedCandidate = path.resolve(candidate);
    if (seen.has(normalizedCandidate) || normalizedCandidate === path.resolve(process.execPath)) continue;
    seen.add(normalizedCandidate);
    try {
      const { stdout } = await execFileAsync(normalizedCandidate, ["--version"], {
        encoding: "utf8",
        env,
        maxBuffer: 8 * 1024
      });
      if (isSupportedNodeVersion(stdout.trim())) return normalizedCandidate;
    } catch {
    }
  }
  throw new TaskctlError(
    `Node.js ${MIN_COMPANION_NODE_VERSION.join(".")} or newer is required to start the local companion`,
    {
      code: "NODE_RUNTIME_UNSUPPORTED",
      exitCode: 3,
      details: `Current runtime is Node.js ${process.versions.node}`
    }
  );
}
async function ensureLocalCompanion(rawUrl, env, overrides) {
  if (await localCompanionReachable(rawUrl)) return;
  const url = new URL(normalizeBaseUrl(rawUrl));
  const nodeExecutable = await resolveCompanionNodeExecutable(env);
  const standaloneEnvironment = isStandaloneSkillRuntime ? {
    CODEX_TASKBOARD_DATA_DIR: env.CODEX_TASKBOARD_DATA_DIR || standaloneDataDirectory(env),
    CODEX_TASKBOARD_SKILL_PATH: env.CODEX_TASKBOARD_SKILL_PATH || standaloneSkillPath
  } : {};
  const child = (overrides.spawn ?? spawn)(nodeExecutable, [sourceServerPath], {
    cwd: sourceProjectRoot,
    detached: true,
    env: {
      ...env,
      ...standaloneEnvironment,
      CODEX_TASKBOARD_HOST: "127.0.0.1",
      CODEX_TASKBOARD_PORT: url.port
    },
    stdio: "ignore",
    windowsHide: true
  });
  let startError = null;
  child.once("error", (error) => {
    startError = error;
  });
  child.unref?.();
  const deadline = Date.now() + 1e4;
  while (Date.now() < deadline) {
    if (await localCompanionReachable(rawUrl)) return;
    if (startError) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new TaskctlError(`Cannot start local companion at ${normalizeBaseUrl(rawUrl)}`, {
    code: "SERVICE_UNAVAILABLE",
    exitCode: 3,
    details: startError instanceof Error ? startError.message : void 0
  });
}
async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new TaskctlError("Taskboard service returned invalid JSON", {
      code: "INVALID_RESPONSE",
      exitCode: 4
    });
  }
}
function extractApiError(payload, status) {
  if (payload?.error && typeof payload.error === "object") {
    return {
      code: payload.error.code ?? `HTTP_${status}`,
      message: payload.error.message ?? `Taskboard service returned HTTP ${status}`,
      details: payload.error.details
    };
  }
  return {
    code: payload?.code ?? `HTTP_${status}`,
    message: payload?.message ?? (typeof payload?.error === "string" ? payload.error : `Taskboard service returned HTTP ${status}`),
    details: payload?.details
  };
}
function normalizeError(error) {
  if (error instanceof TaskctlError) return error;
  return new TaskctlError(error instanceof Error ? error.message : String(error), {
    code: "INTERNAL_ERROR",
    exitCode: 1
  });
}
function usageError(message) {
  return new TaskctlError(message, { code: "USAGE_ERROR", exitCode: 2 });
}
function writeJson(stream, payload) {
  stream.write(`${JSON.stringify(payload)}
`);
}
var SCHEMA_VERSION, DEFAULT_API_URL, execFileAsync, sourceProjectRoot, standaloneSkillPath, isStandaloneSkillRuntime, sourceRuntimeFile, sourceServerPath, MIN_COMPANION_NODE_VERSION, BOOLEAN_OPTIONS, GLOBAL_OPTIONS, COMMAND_OPTIONS, HELP_TEXT, TaskctlError, entrypoint;
var init_taskctl = __esm({
  async "cli/taskctl.mjs"() {
    init_cloud_config();
    init_domain();
    SCHEMA_VERSION = 2;
    DEFAULT_API_URL = "http://127.0.0.1:47823";
    execFileAsync = promisify(execFile);
    sourceProjectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    standaloneSkillPath = path.join(sourceProjectRoot, "SKILL.md");
    isStandaloneSkillRuntime = existsSync(standaloneSkillPath);
    sourceRuntimeFile = path.join(sourceProjectRoot, ".data", "launcher-runtime.json");
    sourceServerPath = isStandaloneSkillRuntime ? path.join(sourceProjectRoot, "scripts", "server.mjs") : path.join(sourceProjectRoot, "server", "index.mjs");
    MIN_COMPANION_NODE_VERSION = [22, 5, 0];
    BOOLEAN_OPTIONS = /* @__PURE__ */ new Set(["json", "clear-binding-thread", "help"]);
    GLOBAL_OPTIONS = /* @__PURE__ */ new Set(["runtime-file", "agent"]);
    COMMAND_OPTIONS = /* @__PURE__ */ new Map([
      ["project list", /* @__PURE__ */ new Set(["json"])],
      ["project create", /* @__PURE__ */ new Set(["id", "name", "workspace-path", "json"])],
      ["project map", /* @__PURE__ */ new Set(["workspace-path", "json"])],
      ["project readme", /* @__PURE__ */ new Set(["content", "file", "if-version", "json"])],
      ["cloud login", /* @__PURE__ */ new Set(["url", "actor-name", "json"])],
      ["cloud status", /* @__PURE__ */ new Set(["json"])],
      ["cloud logout", /* @__PURE__ */ new Set(["json"])],
      ["issue list", /* @__PURE__ */ new Set(["project", "status", "archived", "json"])],
      ["issue get", /* @__PURE__ */ new Set(["json"])],
      [
        "issue create",
        /* @__PURE__ */ new Set([
          "project",
          "title",
          "description",
          "description-file",
          "status",
          "priority",
          "labels",
          "assignee",
          "thread-id",
          "git-branch",
          "worktree-path",
          "worktree-branch",
          "start-date",
          "due-date",
          "recurrence-interval",
          "recurrence-unit",
          "json"
        ])
      ],
      [
        "issue update",
        /* @__PURE__ */ new Set([
          "project",
          "title",
          "description",
          "description-file",
          "status",
          "priority",
          "labels",
          "assignee",
          "thread-id",
          "git-branch",
          "worktree-path",
          "worktree-branch",
          "start-date",
          "due-date",
          "recurrence-interval",
          "recurrence-unit",
          "if-version",
          "json"
        ])
      ],
      ["issue move", /* @__PURE__ */ new Set([
        "status",
        "thread-id",
        "binding-thread-id",
        "binding-codex-project-id",
        "binding-codex-project-kind",
        "binding-codex-host-id",
        "binding-workspace-path",
        "clear-binding-thread",
        "if-version",
        "json"
      ])],
      ["issue archive", /* @__PURE__ */ new Set(["thread-id", "if-version", "json"])],
      ["issue restore", /* @__PURE__ */ new Set(["thread-id", "if-version", "json"])],
      ["issue tree", /* @__PURE__ */ new Set(["direction", "depth", "json"])],
      ["issue relation", /* @__PURE__ */ new Set(["type", "issue", "thread-id", "if-version", "json"])],
      ["comment list", /* @__PURE__ */ new Set(["after", "json"])],
      ["comment add", /* @__PURE__ */ new Set([
        "body",
        "body-file",
        "thread-id",
        "binding-thread-id",
        "binding-codex-project-id",
        "binding-codex-project-kind",
        "binding-codex-host-id",
        "binding-workspace-path",
        "clear-binding-thread",
        "json"
      ])],
      ["comment update", /* @__PURE__ */ new Set(["body", "thread-id", "if-version", "json"])],
      ["comment delete", /* @__PURE__ */ new Set(["thread-id", "if-version", "json"])],
      ["attachment list", /* @__PURE__ */ new Set(["task", "comment", "after", "json"])],
      ["attachment download", /* @__PURE__ */ new Set(["output", "json"])],
      ["attachment upload", /* @__PURE__ */ new Set(["file", "task", "comment", "content-type", "kind", "json"])],
      ["context current", /* @__PURE__ */ new Set(["cwd", "json"])]
    ]);
    HELP_TEXT = /* @__PURE__ */ new Map([
      ["", `Usage: taskctl RESOURCE ACTION [options]

Commands:
  context current [--cwd PATH] [--json]
  project list
  project create --name NAME [--id ID] [--workspace-path PATH]
  project map PROJECT_ID --workspace-path PATH
  project readme get [PROJECT_ID]
  project readme set [PROJECT_ID] (--content TEXT | --file FILE) [--if-version N]
  cloud login --url URL --actor-name NAME
  cloud status|logout
  issue list|get|create|update|move|archive|restore|tree|relation
  comment list ISSUE_ID [--after CURSOR]
  comment add ISSUE_ID (--body TEXT | --body-file FILE) [--thread-id ID]
  comment update COMMENT_ID --body TEXT --if-version N [--thread-id ID]
  comment delete COMMENT_ID --if-version N [--thread-id ID]
  attachment list (--task ISSUE_ID | --comment COMMENT_ID) [--after CURSOR]
  attachment download ATTACHMENT_ID --output PATH
  attachment upload --file PATH (--task ISSUE_ID | --comment COMMENT_ID)

Global options:
  --runtime-file FILE  Use an explicit launcher runtime descriptor
  --agent KIND         Attribute requests to codex, claude-code, openclaw, hermes, pi, or another Agent slug
  --json               Make the JSON output contract explicit
  --help               Show help for a supported command level

Examples:
  taskctl issue get LOCAL-275 --json
  taskctl comment list LOCAL-275 --json

Run taskctl issue --help for all issue arguments.`],
      ["issue", `Usage: taskctl issue ACTION [arguments] [options]

Actions:
  list [--project PROJECT_ID] [--status STATUS] [--archived true|false|all] [--json]
  get ISSUE_ID [--json]
  create --project PROJECT_ID --title TITLE
    [--description TEXT | --description-file FILE]
    [--status STATUS] [--priority PRIORITY] [--labels a,b] [--assignee MEMBER|agent:KIND]
    [--thread-id ID]
    [--git-branch BRANCH | --worktree-path PATH [--worktree-branch BRANCH]]
    [--start-date YYYY-MM-DD] [--due-date YYYY-MM-DD]
    [--recurrence-interval N --recurrence-unit day|week|month|year] [--json]
  update ISSUE_ID
    [--project PROJECT_ID] [--title TITLE]
    [--description TEXT | --description-file FILE]
    [--status STATUS] [--priority PRIORITY] [--labels a,b] [--assignee MEMBER|agent:KIND]
    [--thread-id ID]
    [--git-branch BRANCH | --worktree-path PATH [--worktree-branch BRANCH]]
    [--start-date YYYY-MM-DD] [--due-date YYYY-MM-DD]
    [--recurrence-interval N --recurrence-unit day|week|month|year]
    [--if-version N] [--json]
  move ISSUE_ID --status STATUS [--thread-id ID]
    [--binding-thread-id ID
      [--binding-codex-project-id ID --binding-codex-project-kind local|remote
       --binding-codex-host-id ID --binding-workspace-path PATH]
     | --clear-binding-thread]
    [--if-version N] [--json]
  archive ISSUE_ID [--thread-id ID] [--if-version N] [--json]
  restore ISSUE_ID [--thread-id ID] [--if-version N] [--json]
  tree ISSUE_ID --direction descendants|ancestors --depth N [--json]
  relation add|remove ISSUE_ID --type parent|blocks|blocked_by|related
    --issue RELATED_ISSUE_ID [--thread-id ID] [--if-version N] [--json]

Statuses: backlog, todo, in_progress, in_review, blocked, done, canceled
Priorities: none, urgent, high, medium, low

Example:
  taskctl issue get LOCAL-275 --json`],
      ["comment list", `Usage: taskctl comment list ISSUE_ID [--after CURSOR] [--json]

Options:
  --after CURSOR  Return comments created or modified after a prior nextCursor
  --json          Make the JSON output contract explicit
  --help          Show this help

The response always includes nextCursor. Omit --after for the full list.

Example:
  taskctl comment list LOCAL-275 --after CURSOR --json`]
    ]);
    TaskctlError = class extends Error {
      constructor(message, { code = "TASKCTL_ERROR", exitCode = 2, details } = {}) {
        super(message);
        this.name = "TaskctlError";
        this.code = code;
        this.exitCode = exitCode;
        this.details = details;
      }
    };
    entrypoint = process.argv[1] ? realpathSync(process.argv[1]) : "";
    if (process.env.TASKBOARD_MCP_EMBEDDED !== "1" && entrypoint === realpathSync(fileURLToPath(import.meta.url))) {
      process.exitCode = await main();
    }
  }
});

// scripts/taskboard-mcp.mjs
import { execFile as execFile2, spawn as spawn2 } from "node:child_process";
import os2 from "node:os";
import path2 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { promisify as promisify2 } from "node:util";

// node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// scripts/taskboard-mcp.mjs
process.env.TASKBOARD_MCP_EMBEDDED = "1";
var { main: taskctlMain } = await init_taskctl().then(() => taskctl_exports);
var scriptDirectory = path2.dirname(fileURLToPath2(import.meta.url));
var skillRoot = path2.resolve(scriptDirectory, "..");
var bridgeScript = path2.join(scriptDirectory, "server.mjs");
var defaultPort = 47823;
var MCP_PROTOCOL_VERSION = "2025-06-18";
var execFileAsync2 = promisify2(execFile2);
var TOOLS = [
  ["context_current", "Read the current Taskboard project context."],
  ["project_list", "List Taskboard projects."],
  ["project_map", "Map a Taskboard project to a local workspace directory."],
  ["project_readme_get", "Read a project's README."],
  ["project_readme_set", "Write a project's README."],
  ["issue_list", "List Taskboard issues."],
  ["issue_get", "Read one Taskboard issue."],
  ["issue_create", "Create a Taskboard issue."],
  ["issue_update", "Update a Taskboard issue."],
  ["issue_move", "Move a Taskboard issue to another status."],
  ["issue_tree", "Read a Taskboard issue tree."],
  ["issue_relation_add", "Add a relation to a Taskboard issue."],
  ["issue_relation_remove", "Remove a relation from a Taskboard issue."],
  ["comment_list", "List comments for a Taskboard issue."],
  ["comment_add", "Add a comment to a Taskboard issue."],
  ["comment_update", "Update a Taskboard comment."],
  ["comment_delete", "Delete a Taskboard comment."],
  ["attachment_list", "List Taskboard attachments."],
  ["attachment_upload", "Upload a Taskboard attachment."],
  ["attachment_download", "Download a Taskboard attachment."],
  ["cloud_status", "Read local Taskboard cloud connection status."],
  ["cloud_login", "Open the local Taskboard cloud login flow."],
  ["cloud_logout", "Clear the local Taskboard cloud connection."]
];
function dataDirectory(environment = process.env) {
  if (environment.CODEX_TASKBOARD_DATA_DIR) return path2.resolve(environment.CODEX_TASKBOARD_DATA_DIR);
  if (process.platform === "win32") {
    return path2.join(
      environment.LOCALAPPDATA || environment.APPDATA || path2.join(os2.homedir(), "AppData", "Local"),
      "Codex Taskboard"
    );
  }
  if (process.platform === "darwin") {
    return path2.join(os2.homedir(), "Library", "Application Support", "Codex Taskboard");
  }
  return path2.join(environment.XDG_DATA_HOME || path2.join(os2.homedir(), ".local", "share"), "codex-taskboard");
}
function bridgeBaseUrl(environment = process.env) {
  const value = environment.CODEX_TASKBOARD_COMPANION_URL || environment.CODEX_TASKBOARD_URL || `http://127.0.0.1:${environment.CODEX_TASKBOARD_PORT || defaultPort}`;
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:" || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || url.username || url.password || url.search || url.hash) {
    throw new Error("Taskboard MCP requires a loopback HTTP bridge URL");
  }
  url.pathname = url.pathname.replace(/\/$/, "");
  return url;
}
function wsLeaseUrl(baseUrl) {
  const url = new URL(baseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/local/lease`;
  return url;
}
async function health(baseUrl) {
  try {
    const response = await fetch(new URL("health", `${baseUrl.href.replace(/\/$/, "")}/`), {
      signal: AbortSignal.timeout(750)
    });
    return response.ok;
  } catch {
    return false;
  }
}
async function waitForHealth(baseUrl, timeoutMs = 1e4) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await health(baseUrl)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Taskboard bridge did not become ready at ${baseUrl.origin}`);
}
async function startBridge(baseUrl, environment) {
  if (await health(baseUrl)) return null;
  const port = Number(baseUrl.port || defaultPort);
  const child = spawn2(await compatibleNode(environment), [bridgeScript], {
    cwd: skillRoot,
    env: {
      ...environment,
      CODEX_TASKBOARD_HOST: "127.0.0.1",
      CODEX_TASKBOARD_PORT: String(port),
      CODEX_TASKBOARD_DATA_DIR: environment.CODEX_TASKBOARD_DATA_DIR || dataDirectory(environment),
      CODEX_TASKBOARD_SKILL_PATH: environment.CODEX_TASKBOARD_SKILL_PATH || path2.join(skillRoot, "SKILL.md"),
      CODEX_TASKBOARD_LEASE_MANAGED: "1"
    },
    stdio: "ignore",
    windowsHide: true
  });
  await waitForHealth(baseUrl);
  return child;
}
function supportedNode(version) {
  const parts = String(version).replace(/^v/i, "").split(".").map((part) => Number(part));
  return parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1]) && (parts[0] > 22 || parts[0] === 22 && parts[1] >= 5);
}
async function compatibleNode(environment) {
  if (supportedNode(process.versions.node)) return process.execPath;
  const candidates = [];
  if (environment.TASKBOARD_NODE_PATH) candidates.push(environment.TASKBOARD_NODE_PATH);
  try {
    const command = process.platform === "win32" ? "where.exe" : "which";
    const { stdout } = await execFileAsync2(command, ["node"], { encoding: "utf8", env: environment });
    candidates.push(...stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
  } catch {
  }
  for (const candidate of [...new Set(candidates)]) {
    try {
      const { stdout } = await execFileAsync2(candidate, ["--version"], { encoding: "utf8", env: environment });
      if (supportedNode(stdout.trim())) return candidate;
    } catch {
    }
  }
  throw new Error("Node.js 22.5 or newer is required for the local Taskboard bridge");
}
function openLease(baseUrl) {
  return new Promise((resolve, reject) => {
    const socket = new import_websocket.default(wsLeaseUrl(baseUrl), { origin: "http://127.0.0.1" });
    const onError = (error) => {
      socket.removeAllListeners();
      reject(error);
    };
    socket.once("open", () => {
      socket.off("error", onError);
      resolve(socket);
    });
    socket.once("error", onError);
  });
}
function option(args, name, value) {
  if (value === void 0 || value === null) return;
  args.push(`--${name}`, Array.isArray(value) ? value.join(",") : String(value));
}
function threadBindingOptions(args, input2 = {}) {
  const binding = input2.threadBinding;
  option(args, "thread-id", input2.threadId);
  if (!binding) return;
  option(args, "binding-thread-id", binding.threadId);
  option(args, "binding-codex-project-id", binding.codexProjectId);
  option(args, "binding-codex-project-kind", binding.codexProjectKind);
  option(args, "binding-codex-host-id", binding.codexHostId);
  option(args, "binding-workspace-path", binding.workspacePath);
}
function toolArgs(name, input2 = {}) {
  const args = [];
  switch (name) {
    case "context_current":
      args.push("context", "current");
      option(args, "cwd", input2.cwd);
      break;
    case "project_list":
      args.push("project", "list");
      break;
    case "project_map":
      args.push("project", "map", String(input2.projectId ?? ""));
      option(args, "workspace-path", input2.workspacePath);
      break;
    case "project_readme_get":
      args.push("project", "readme", "get", ...input2.projectId ? [String(input2.projectId)] : []);
      break;
    case "project_readme_set":
      args.push("project", "readme", "set", ...input2.projectId ? [String(input2.projectId)] : []);
      option(args, "content", input2.content);
      option(args, "if-version", input2.version);
      break;
    case "issue_list":
      args.push("issue", "list");
      option(args, "project", input2.projectId);
      option(args, "status", input2.status);
      option(args, "archived", input2.archived);
      break;
    case "issue_get":
      args.push("issue", "get", String(input2.issueId ?? ""));
      break;
    case "issue_create":
      args.push("issue", "create");
      option(args, "project", input2.projectId);
      option(args, "title", input2.title);
      option(args, "description", input2.description);
      option(args, "status", input2.status);
      option(args, "priority", input2.priority);
      option(args, "labels", input2.labels);
      option(args, "assignee", input2.assignee);
      option(args, "git-branch", input2.gitBranch);
      option(args, "worktree-path", input2.worktreePath);
      option(args, "worktree-branch", input2.worktreeBranch);
      option(args, "start-date", input2.startDate);
      option(args, "due-date", input2.dueDate);
      option(args, "recurrence-interval", input2.recurrenceInterval);
      option(args, "recurrence-unit", input2.recurrenceUnit);
      option(args, "thread-id", input2.threadId);
      break;
    case "issue_update":
      args.push("issue", "update", String(input2.issueId ?? ""));
      option(args, "project", input2.projectId);
      option(args, "title", input2.title);
      option(args, "description", input2.description);
      option(args, "status", input2.status);
      option(args, "priority", input2.priority);
      option(args, "labels", input2.labels);
      option(args, "assignee", input2.assignee);
      option(args, "git-branch", input2.gitBranch);
      option(args, "worktree-path", input2.worktreePath);
      option(args, "worktree-branch", input2.worktreeBranch);
      option(args, "start-date", input2.startDate);
      option(args, "due-date", input2.dueDate);
      option(args, "recurrence-interval", input2.recurrenceInterval);
      option(args, "recurrence-unit", input2.recurrenceUnit);
      option(args, "if-version", input2.version);
      option(args, "thread-id", input2.threadId);
      break;
    case "issue_move":
      args.push("issue", "move", String(input2.issueId ?? ""));
      option(args, "status", input2.status);
      option(args, "if-version", input2.version);
      option(args, "thread-id", input2.threadId);
      if (input2.clearBindingThread) args.push("--clear-binding-thread");
      break;
    case "issue_tree":
      args.push("issue", "tree", String(input2.issueId ?? ""));
      option(args, "direction", input2.direction);
      option(args, "depth", input2.depth);
      break;
    case "issue_relation_add":
    case "issue_relation_remove":
      args.push("issue", "relation", name.endsWith("_add") ? "add" : "remove", String(input2.issueId ?? ""));
      option(args, "type", input2.type);
      option(args, "issue", input2.relatedIssueId);
      option(args, "if-version", input2.version);
      option(args, "thread-id", input2.threadId);
      break;
    case "comment_list":
      args.push("comment", "list", String(input2.issueId ?? ""));
      option(args, "after", input2.after);
      break;
    case "comment_add":
      args.push("comment", "add", String(input2.issueId ?? ""));
      option(args, "body", input2.body);
      threadBindingOptions(args, input2);
      break;
    case "comment_update":
      args.push("comment", "update", String(input2.commentId ?? ""));
      option(args, "body", input2.body);
      option(args, "if-version", input2.version);
      option(args, "thread-id", input2.threadId);
      break;
    case "comment_delete":
      args.push("comment", "delete", String(input2.commentId ?? ""));
      option(args, "if-version", input2.version);
      option(args, "thread-id", input2.threadId);
      break;
    case "attachment_list":
      args.push("attachment", "list");
      option(args, "task", input2.issueId);
      option(args, "comment", input2.commentId);
      option(args, "after", input2.after);
      break;
    case "attachment_upload":
      args.push("attachment", "upload");
      option(args, "file", input2.file);
      option(args, "task", input2.issueId);
      option(args, "comment", input2.commentId);
      option(args, "content-type", input2.contentType);
      option(args, "kind", input2.kind);
      break;
    case "attachment_download":
      args.push("attachment", "download", String(input2.attachmentId ?? ""));
      option(args, "output", input2.output);
      break;
    case "cloud_status":
      args.push("cloud", "status");
      break;
    case "cloud_logout":
      args.push("cloud", "logout");
      break;
    default:
      throw new Error(`Unsupported Taskboard MCP tool: ${name}`);
  }
  return args;
}
function captureStream() {
  let value = "";
  return {
    write(chunk) {
      value += String(chunk);
      return true;
    },
    get value() {
      return value;
    }
  };
}
function parseTaskctlOutput(stdout, stderr, exitCode) {
  const text = stdout.value.trim();
  if (exitCode !== 0) {
    let error;
    try {
      error = JSON.parse(stderr.value.trim());
    } catch {
      error = null;
    }
    throw new Error(error?.error?.message || stderr.value.trim() || `taskctl exited with ${exitCode}`);
  }
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}
function openLoginPage(rawUrl) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return false;
  const url = new URL(rawUrl);
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new Error("Login page must use HTTPS (or loopback HTTP)");
  }
  const command = process.platform === "win32" ? "explorer.exe" : process.platform === "darwin" ? "open" : "xdg-open";
  const child = spawn2(command, [url.href], { detached: true, stdio: "ignore", windowsHide: true });
  child.unref?.();
  return true;
}
function mcpToolDefinitions() {
  return TOOLS.map(([name, description]) => ({
    name,
    description,
    inputSchema: { type: "object", additionalProperties: true }
  }));
}
var leaseSocket = null;
var bridgeChild = null;
var bridgeUrl = null;
var cleanedUp = false;
async function ensureBridge() {
  if (leaseSocket && leaseSocket.readyState === import_websocket.default.OPEN) return;
  const environment = {
    ...process.env,
    CODEX_TASKBOARD_DATA_DIR: process.env.CODEX_TASKBOARD_DATA_DIR || dataDirectory(process.env),
    CODEX_TASKBOARD_SKILL_PATH: process.env.CODEX_TASKBOARD_SKILL_PATH || path2.join(skillRoot, "SKILL.md")
  };
  bridgeUrl = bridgeBaseUrl(environment);
  bridgeChild = await startBridge(bridgeUrl, environment);
  leaseSocket = await openLease(bridgeUrl);
  leaseSocket.on("close", () => {
    leaseSocket = null;
  });
}
async function callTaskctl(name, input2) {
  await ensureBridge();
  if (name === "cloud_login") {
    const opened = openLoginPage(input2.remoteUrl);
    return {
      mode: "login_required",
      url: input2.remoteUrl || null,
      opened,
      message: "\u8BF7\u5728\u672C\u673A Taskboard \u9875\u9762\u5B8C\u6210\u767B\u5F55\uFF0C\u5BC6\u7801\u4E0D\u4F1A\u4F5C\u4E3A MCP \u5DE5\u5177\u53C2\u6570\u4F20\u9012\u7ED9\u6A21\u578B\u3002"
    };
  }
  const stdout = captureStream();
  const stderr = captureStream();
  const agent = process.env.TASKBOARD_AGENT_KIND || "codex";
  const environment = {
    ...process.env,
    CODEX_TASKBOARD_COMPANION_URL: bridgeUrl.href.replace(/\/$/, ""),
    CODEX_TASKBOARD_DATA_DIR: process.env.CODEX_TASKBOARD_DATA_DIR || dataDirectory(process.env),
    CODEX_TASKBOARD_SKILL_PATH: process.env.CODEX_TASKBOARD_SKILL_PATH || path2.join(skillRoot, "SKILL.md"),
    TASKBOARD_AGENT_KIND: agent
  };
  const exitCode = await taskctlMain(["--agent", agent, ...toolArgs(name, input2)], {
    env: environment,
    stdout,
    stderr
  });
  return parseTaskctlOutput(stdout, stderr, exitCode);
}
async function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  leaseSocket?.close();
  leaseSocket = null;
  bridgeChild?.unref?.();
  bridgeChild = null;
}
function send(message) {
  process.stdout.write(`${JSON.stringify(message)}
`);
}
function resultFor(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
    structuredContent: value
  };
}
async function handle(message) {
  if (!message || typeof message !== "object") return;
  if (message.method === "notifications/initialized" || message.method === "notifications/cancelled") return;
  if (message.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "taskboard-mcp", version: "1.0.0" }
      }
    });
    return;
  }
  if (message.method === "ping") {
    send({ jsonrpc: "2.0", id: message.id, result: {} });
    return;
  }
  if (message.method === "tools/list") {
    send({ jsonrpc: "2.0", id: message.id, result: { tools: mcpToolDefinitions() } });
    return;
  }
  if (message.method === "tools/call") {
    try {
      const name = message.params?.name;
      if (!TOOLS.some(([toolName]) => toolName === name)) throw new Error(`Unknown Taskboard MCP tool: ${name}`);
      const value = await callTaskctl(name, message.params?.arguments ?? {});
      send({ jsonrpc: "2.0", id: message.id, result: resultFor(value) });
    } catch (error) {
      send({
        jsonrpc: "2.0",
        id: message.id,
        result: {
          isError: true,
          content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }]
        }
      });
    }
    return;
  }
  if (message.id !== void 0) {
    send({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: `Method not found: ${message.method}` }
    });
  }
}
var input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
  let newline;
  while ((newline = input.indexOf("\n")) >= 0) {
    const line = input.slice(0, newline).trim();
    input = input.slice(newline + 1);
    if (!line) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Invalid JSON" } });
      continue;
    }
    handle(message).catch((error) => {
      if (message.id !== void 0) {
        send({ jsonrpc: "2.0", id: message.id, error: { code: -32603, message: String(error) } });
      }
    });
  }
});
process.stdin.on("end", async () => {
  await cleanup();
  process.exit(0);
});
process.once("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});
process.once("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});
