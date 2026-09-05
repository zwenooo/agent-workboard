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
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
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
    function parse2(header) {
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
    module.exports = { format, parse: parse2 };
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
    var { randomBytes, createHash: createHash2 } = __require("crypto");
    var { Duplex, Readable: Readable2 } = __require("stream");
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
    var { format, parse: parse2 } = require_extension();
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
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
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
        const digest = createHash2("sha1").update(key + GUID).digest("base64");
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
            extensions = parse2(secWebSocketExtensions);
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
          ws.once("open", function open2() {
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
          ws.once("open", function open2() {
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
    function parse2(header) {
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
    module.exports = { parse: parse2 };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash: createHash2 } = __require("crypto");
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
        const digest = createHash2("sha1").update(key + GUID).digest("base64");
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

// server/index.mjs
import os5 from "node:os";
import { pathToFileURL } from "node:url";

// server/app.mjs
import { createHmac, randomUUID as randomUUID4 } from "node:crypto";
import { execFile as execFile2 } from "node:child_process";
import { chmod as chmod2, mkdir as mkdir3, open, readFile as readFile4, readdir as readdir2, rename as rename3, stat as stat2, unlink as unlink2, writeFile as writeFile4 } from "node:fs/promises";
import { createServer } from "node:http";
import { isIP } from "node:net";
import os4 from "node:os";
import path9 from "node:path";
import { Readable } from "node:stream";
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

// shared/domain.mjs
var TASK_STATUSES = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
  "canceled"
];
var TASK_PRIORITIES = ["none", "urgent", "high", "medium", "low"];
var DEFAULT_PROJECT_ID = "local";
var JIRA_PROJECT_ID = "jira-my-tasks";
var DEFAULT_AGENT_KIND = "codex";
var GENERIC_AGENT_KIND = "agent";
var DEFAULT_LABEL_NAMES = [
  "\u7F3A\u9677",
  "\u7279\u6027",
  "for-claude",
  "hold",
  "\u6539\u8FDB",
  "phase-1",
  "phase-2",
  "phase-3",
  "phase-4",
  "phase-5",
  "phase-6"
];
var AGENT_KIND_ALIASES = /* @__PURE__ */ new Map([
  ["claude", "claude-code"],
  ["open-claw", "openclaw"]
]);
var AGENT_KIND_LABELS = /* @__PURE__ */ new Map([
  ["codex", "Codex"],
  ["claude-code", "Claude Code"],
  ["openclaw", "OpenClaw"],
  ["hermes", "Hermes"],
  ["pi", "Pi"],
  [GENERIC_AGENT_KIND, ""]
]);
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
function agentKindLabel(kind) {
  const normalized = normalizeAgentKind(kind);
  return AGENT_KIND_LABELS.get(normalized) ?? normalized.split("-").map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join(" ");
}
function agentActorId(kind, ownerId = null) {
  const normalized = normalizeAgentKind(kind);
  const id = normalized === GENERIC_AGENT_KIND ? "agent" : `${normalized}-agent`;
  return ownerId ? `${ownerId}:${id}` : id;
}
function agentActorName(kind, ownerName = null) {
  const label = agentKindLabel(kind);
  const name = label ? `${label} Agent` : "Agent";
  return ownerName ? `${name} (${ownerName})` : name;
}
function isTaskStatus(value) {
  return TASK_STATUSES.includes(value);
}
function isTaskPriority(value) {
  return TASK_PRIORITIES.includes(value);
}

// shared/codex-executable.mjs
import { accessSync, constants } from "node:fs";
import os from "node:os";
import path from "node:path";
function executableFile(candidate) {
  try {
    accessSync(candidate, constants.X_OK);
    return candidate;
  } catch {
    return null;
  }
}
function executableOnPath(env, platform) {
  for (const directory of (env.PATH || "").split(path.delimiter)) {
    if (!directory) continue;
    if (platform === "win32") {
      const nativeExecutable = executableFile(path.join(directory, "codex.exe"));
      if (nativeExecutable) return nativeExecutable;
      const npmEntry = executableFile(path.join(
        directory,
        "node_modules",
        "@openai",
        "codex",
        "bin",
        "codex.js"
      ));
      if (npmEntry) return npmEntry;
      continue;
    }
    const executable = executableFile(path.join(directory, "codex"));
    if (executable) return executable;
  }
  return null;
}
function codexExecutableInApp(appPath, platform = process.platform) {
  if (platform === "win32") {
    return path.win32.join(path.win32.dirname(appPath), "resources", "codex.exe");
  }
  if (platform === "linux") return "/usr/lib/chatgpt/resources/codex";
  return path.join(appPath, "Contents", "Resources", "codex");
}
function resolveCodexExecutable({
  explicit = process.env.CODEX_EXECUTABLE,
  appPath,
  env = process.env,
  platform = process.platform,
  homeDirectory = os.homedir()
} = {}) {
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim();
  if (appPath) {
    const bundled = executableFile(codexExecutableInApp(appPath, platform));
    if (bundled) return bundled;
  }
  const installedCli = executableOnPath(env, platform);
  if (installedCli) return installedCli;
  if (platform === "darwin") {
    for (const applicationDirectory of ["/Applications", path.join(homeDirectory, "Applications")]) {
      for (const applicationName of ["ChatGPT.app", "Codex.app"]) {
        const bundled = executableFile(codexExecutableInApp(
          path.join(applicationDirectory, applicationName),
          platform
        ));
        if (bundled) return bundled;
      }
    }
  }
  return "codex";
}

// shared/codex-environment.mjs
function withoutTaskboardLauncherEnvironment(environment = process.env) {
  return Object.fromEntries(
    Object.entries(environment).filter(([name]) => !name.startsWith("CODEX_TASKBOARD_"))
  );
}

// server/ai-chat.mjs
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os3 from "node:os";
import path5 from "node:path";

// shared/process-tree.mjs
import { spawnSync } from "node:child_process";
function signalProcessTree(child, signal) {
  if (process.platform === "win32" && Number.isInteger(child?.pid)) {
    const result = spawnSync(
      "taskkill.exe",
      ["/PID", String(child.pid), "/T", "/F"],
      { stdio: "ignore", windowsHide: true }
    );
    if (result.error || result.status !== 0) {
      try {
        child.kill(signal);
      } catch {
      }
    }
    return;
  }
  if (Number.isInteger(child?.pid)) {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch {
    }
  }
  try {
    child?.kill(signal);
  } catch {
  }
}

// server/database.mjs
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path2 from "node:path";
import { DatabaseSync } from "node:sqlite";
var DEFAULT_PROJECT_LABELS_JSON = JSON.stringify(DEFAULT_LABEL_NAMES);
var TASK_TREE_MAX_NODES = 1e3;
var ApiError = class extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function commentConversationTitle(body) {
  const firstLine = String(body ?? "").split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  if (!firstLine) return "\u8BC4\u8BBA";
  const compact = firstLine.replace(/\s+/g, " ");
  return compact.length > 80 ? `${compact.slice(0, 77)}\u2026` : compact;
}
function threadBindingFromRow(row) {
  if (!row.thread_id || !row.thread_codex_project_id || !row.thread_codex_project_kind || !row.thread_codex_host_id || !row.thread_workspace_path) return null;
  return {
    threadId: row.thread_id,
    codexProjectId: row.thread_codex_project_id,
    codexProjectKind: row.thread_codex_project_kind,
    codexHostId: row.thread_codex_host_id,
    workspacePath: row.thread_workspace_path
  };
}
function legacyLocalThreadIdFromRow(row) {
  if (!row.thread_id) return null;
  return [
    row.thread_codex_project_id,
    row.thread_codex_project_kind,
    row.thread_codex_host_id,
    row.thread_workspace_path
  ].every((value) => value == null) ? row.thread_id : null;
}
function storedThreadBinding(threadBinding, threadId) {
  if (threadBinding === void 0 && (threadId === void 0 || threadId === null)) return void 0;
  const binding = threadBinding === void 0 ? { threadId } : threadBinding;
  return [
    binding?.threadId ?? null,
    binding?.codexProjectId ?? null,
    binding?.codexProjectKind ?? null,
    binding?.codexHostId ?? null,
    binding?.workspacePath ?? null
  ];
}
function storedThreadBindingForExisting(current, threadBinding, threadId) {
  if (threadBinding === void 0 && current?.threadBinding && current.threadBinding.threadId === threadId) {
    return storedThreadBinding(current.threadBinding, threadId);
  }
  return storedThreadBinding(threadBinding, threadId);
}
function attachTaskActivity(task, comments, activities, previewImage = null) {
  const orderedComments = [...comments].sort((left, right) => left.id.localeCompare(right.id));
  const orderedActivities = [...activities].sort((left, right) => left.id.localeCompare(right.id));
  const participants = [];
  const participantIds = /* @__PURE__ */ new Set();
  const addParticipant = (actor) => {
    const key = `${actor.type}:${actor.id}`;
    if (participantIds.has(key)) return;
    participantIds.add(key);
    participants.push(actor);
  };
  addParticipant({
    type: task.creatorType,
    id: task.creatorId,
    name: task.creatorName,
    avatarUrl: task.creatorAvatarUrl
  });
  addParticipant(task.assignee);
  for (const comment of orderedComments) {
    addParticipant({
      type: comment.author_type,
      id: comment.author_id,
      name: comment.author_name,
      avatarUrl: comment.author_avatar_url
    });
  }
  for (const activity of orderedActivities) {
    addParticipant({
      type: activity.actor_type,
      id: activity.actor_id,
      name: activity.actor_name,
      avatarUrl: activity.actor_avatar_url
    });
  }
  const conversationRefs = [];
  if (task.threadBinding) {
    conversationRefs.push({
      ...task.threadBinding,
      source: "task",
      sourceId: task.id,
      title: task.title,
      updatedAt: task.updatedAt
    });
  } else if (task.legacyLocalThreadId) {
    conversationRefs.push({
      threadId: task.legacyLocalThreadId,
      legacyLocal: true,
      source: "task",
      sourceId: task.id,
      title: task.title,
      updatedAt: task.updatedAt
    });
  }
  for (const comment of orderedComments) {
    const threadBinding = threadBindingFromRow(comment);
    const legacyLocalThreadId = legacyLocalThreadIdFromRow(comment);
    if (threadBinding || legacyLocalThreadId) {
      conversationRefs.push({
        ...threadBinding ?? { threadId: legacyLocalThreadId, legacyLocal: true },
        source: "comment",
        sourceId: comment.id,
        title: commentConversationTitle(comment.body),
        updatedAt: comment.updated_at
      });
    }
  }
  task.conversationRefs = conversationRefs;
  task.participants = participants;
  task.previewImage = previewImage;
  task.activityKey = JSON.stringify({
    version: 1,
    task: [task.id, task.version, task.updatedAt],
    comments: orderedComments.map((comment) => [comment.id, comment.version, comment.updated_at]),
    changes: orderedActivities.map((activity) => [activity.id, activity.created_at])
  });
  task.activityUpdatedAt = [...orderedComments, ...orderedActivities].reduce(
    (latest, activity) => {
      const updatedAt = activity.updated_at ?? activity.created_at;
      return updatedAt > latest ? updatedAt : latest;
    },
    task.updatedAt
  );
  return task;
}
function taskActivityFromRow(row) {
  return {
    id: row.id,
    taskId: row.task_id,
    actorType: row.actor_type,
    actorId: row.actor_id,
    actorName: row.actor_name,
    actorAvatarUrl: row.actor_avatar_url,
    changes: JSON.parse(row.changes),
    createdAt: row.created_at
  };
}
function taskFieldChanges(task, changes) {
  return Object.entries(changes).flatMap(([field, after]) => {
    const before = task[field];
    return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ field, before, after }];
  });
}
function relationActivityValue(type, task) {
  return {
    type,
    identifier: task.identifier,
    externalKey: task.externalKey ?? null,
    title: task.title
  };
}
function parseAiChatTodoProgress(row) {
  try {
    const data = row.data === null ? null : JSON.parse(row.data);
    const detail = typeof data?.detail === "string" ? JSON.parse(data.detail) : data?.detail;
    if (!Array.isArray(detail)) return null;
    const items = detail.filter((item) => item && typeof item === "object" && typeof item.text === "string" && item.text.trim());
    if (items.length === 0) return null;
    return {
      completed: items.filter((item) => item.completed === true).length,
      total: items.length,
      eventId: row.id,
      updatedAt: row.created_at
    };
  } catch {
    return null;
  }
}
function taskFromRow(row) {
  const developmentContext = row.worktree_path ? { type: "worktree", path: row.worktree_path, branch: row.worktree_branch } : row.git_branch ? { type: "branch", branch: row.git_branch } : null;
  return {
    id: row.id,
    identifier: row.identifier,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    labels: JSON.parse(row.labels),
    sortOrder: row.sort_order,
    threadId: row.thread_id,
    threadBinding: threadBindingFromRow(row),
    legacyLocalThreadId: legacyLocalThreadIdFromRow(row),
    creatorType: row.creator_type,
    creatorId: row.creator_id,
    creatorName: row.creator_name,
    creatorAvatarUrl: row.creator_avatar_url,
    assignee: {
      type: row.assignee_type,
      id: row.assignee_id,
      name: row.assignee_name,
      avatarUrl: row.assignee_avatar_url
    },
    developmentContext,
    startDate: row.start_date,
    dueDate: row.due_date,
    recurrence: row.recurrence_interval && row.recurrence_unit ? { interval: row.recurrence_interval, unit: row.recurrence_unit } : null,
    source: row.external_source === "jira" ? "jira" : "local",
    externalOrigin: row.external_origin ?? null,
    externalKey: row.external_key ?? null,
    externalUrl: row.external_url ?? null,
    archivedAt: row.archived_at,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function taskRelationSummaryFromRow(row) {
  return {
    id: row.id,
    identifier: row.identifier,
    externalKey: row.external_key ?? null,
    projectId: row.project_id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    assignee: {
      type: row.assignee_type,
      id: row.assignee_id,
      name: row.assignee_name,
      avatarUrl: row.assignee_avatar_url
    },
    archivedAt: row.archived_at
  };
}
function taskTreeNode(row, parentId, depth, path10) {
  return {
    id: row.id,
    parentId,
    depth,
    path: path10,
    summary: {
      identifier: row.identifier,
      title: row.title,
      status: row.status,
      priority: row.priority,
      archivedAt: row.archived_at
    }
  };
}
function commentFromRow(row) {
  const comment = {
    id: row.id,
    taskId: row.task_id,
    body: row.body,
    threadId: row.thread_id,
    threadBinding: threadBindingFromRow(row),
    legacyLocalThreadId: legacyLocalThreadIdFromRow(row),
    authorType: row.author_type,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,
    attachments: [],
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
  Object.defineProperty(comment, "changeRevision", { value: row.change_revision });
  return comment;
}
function attachmentFromRow(row) {
  const attachment = {
    id: row.id,
    taskId: row.task_id,
    commentId: row.comment_id,
    kind: row.kind,
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    createdAt: row.created_at
  };
  Object.defineProperty(attachment, "changeRevision", { value: row.change_revision });
  return attachment;
}
function projectFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    workspacePath: row.workspace_path,
    source: row.id === JIRA_PROJECT_ID ? "jira" : "local",
    labels: JSON.parse(row.labels),
    issueCount: Number(row.issue_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function projectSummaryFromRow(row) {
  return {
    projectId: row.project_id,
    summary: row.summary,
    generatedAt: row.generated_at,
    attemptedAt: row.attempted_at,
    error: row.error
  };
}
function projectReadmeFromRow(row, projectId) {
  return {
    projectId: row.project_id ?? projectId,
    content: row.content,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function projectReadmeAttachmentFromRow(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    kind: "inline",
    filename: row.filename,
    contentType: row.content_type,
    size: row.size,
    createdAt: row.created_at
  };
}
function aiChatRunFromRow(row) {
  return {
    id: row.id,
    threadId: row.thread_id,
    status: row.status,
    exitCode: row.exit_code,
    error: row.error,
    startedAt: row.started_at,
    finishedAt: row.finished_at
  };
}
function aiChatThreadFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    origin: {
      projectId: row.origin_project_id,
      projectName: row.origin_project_name,
      workspacePath: row.origin_workspace_path,
      ...row.origin_codex_project_id ? { codexProjectId: row.origin_codex_project_id } : {},
      ...row.origin_codex_project_kind ? { codexProjectKind: row.origin_codex_project_kind } : {},
      ...row.origin_codex_host_id ? { codexHostId: row.origin_codex_host_id } : {},
      ...row.origin_issue_id ? { issueId: row.origin_issue_id } : {},
      ...row.origin_issue_identifier ? { issueIdentifier: row.origin_issue_identifier } : {}
    },
    codexThreadId: row.codex_thread_id,
    model: row.model,
    reasoningEffort: row.reasoning_effort,
    sandbox: row.sandbox,
    currentRun: null,
    latestTodo: null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function aiChatEventFromRow(row) {
  return {
    id: row.id,
    threadId: row.thread_id,
    runId: row.run_id,
    type: row.type,
    role: row.role,
    content: row.content,
    data: row.data === null ? null : JSON.parse(row.data),
    createdAt: row.created_at
  };
}
function projectPrefix(project) {
  const idPrefix = project.id.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 12) || "TASK";
  const existingPrefix = project.first_identifier?.replace(/-\d+$/, "");
  if (existingPrefix && /^[A-Z0-9]+$/i.test(existingPrefix) && existingPrefix !== idPrefix) return existingPrefix;
  if (idPrefix.length <= 5) return idPrefix;
  const namePrefix = project.name.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 3);
  return namePrefix || idPrefix.slice(0, 3);
}
var TaskboardDatabase = class {
  constructor(filename) {
    mkdirSync(path2.dirname(filename), { recursive: true });
    this.database = new DatabaseSync(filename);
    this.database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    this.#migrate();
    this.interruptAbandonedAiChatRuns();
  }
  #migrate() {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        workspace_path TEXT,
        labels TEXT NOT NULL DEFAULT '${DEFAULT_PROJECT_LABELS_JSON}',
        next_task_number INTEGER NOT NULL DEFAULT 1 CHECK (next_task_number > 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL UNIQUE,
        project_id TEXT NOT NULL REFERENCES projects(id),
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL CHECK (status IN (
          'backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'done', 'canceled'
        )),
        priority TEXT NOT NULL CHECK (priority IN ('none', 'urgent', 'high', 'medium', 'low')),
        labels TEXT NOT NULL DEFAULT '[]',
        sort_order REAL NOT NULL,
        thread_id TEXT,
        thread_codex_project_id TEXT,
        thread_codex_project_kind TEXT,
        thread_codex_host_id TEXT,
        thread_workspace_path TEXT,
        creator_type TEXT NOT NULL DEFAULT 'user',
        creator_id TEXT NOT NULL DEFAULT 'local-user',
        creator_name TEXT NOT NULL DEFAULT '\u672C\u5730\u7528\u6237',
        creator_avatar_url TEXT,
        assignee_type TEXT NOT NULL DEFAULT 'user' CHECK (assignee_type IN ('user', 'agent')),
        assignee_id TEXT NOT NULL DEFAULT 'local-user',
        assignee_name TEXT NOT NULL DEFAULT '\u672C\u5730\u7528\u6237',
        assignee_avatar_url TEXT,
        git_branch TEXT,
        worktree_path TEXT,
        worktree_branch TEXT,
        start_date TEXT,
        due_date TEXT,
        recurrence_interval INTEGER,
        recurrence_unit TEXT,
        external_source TEXT,
        external_origin TEXT,
        external_id TEXT,
        external_key TEXT,
        external_url TEXT,
        archived_at TEXT,
        version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS tasks_project_status_sort
        ON tasks(project_id, archived_at, status, sort_order, created_at);

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        thread_id TEXT,
        thread_codex_project_id TEXT,
        thread_codex_project_kind TEXT,
        thread_codex_host_id TEXT,
        thread_workspace_path TEXT,
        author_type TEXT NOT NULL DEFAULT 'user',
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_avatar_url TEXT,
        version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        change_revision INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS comments_task_created
        ON comments(task_id, created_at, id);

      CREATE TABLE IF NOT EXISTS task_activities (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        actor_type TEXT NOT NULL CHECK (actor_type IN ('user', 'agent')),
        actor_id TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_avatar_url TEXT,
        changes TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS task_activities_task_created
        ON task_activities(task_id, created_at, id);

      CREATE TABLE IF NOT EXISTS attachments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        comment_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
        kind TEXT NOT NULL CHECK (kind IN ('inline', 'attachment')),
        filename TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size INTEGER NOT NULL CHECK (size >= 0),
        created_at TEXT NOT NULL,
        change_revision INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS attachments_task_created
        ON attachments(task_id, created_at, id);

      CREATE TABLE IF NOT EXISTS comment_attachment_revision (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        value INTEGER NOT NULL CHECK (value >= 0)
      );

      CREATE TABLE IF NOT EXISTS project_readmes (
        project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
        content TEXT NOT NULL DEFAULT '',
        version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project_readme_attachments (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size INTEGER NOT NULL CHECK (size >= 0),
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS project_summaries (
        project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
        summary TEXT,
        generated_at TEXT,
        attempted_at TEXT NOT NULL,
        error TEXT
      );

      CREATE TABLE IF NOT EXISTS ai_chat_threads (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('idle', 'running', 'failed')),
        origin_project_id TEXT NOT NULL,
        origin_project_name TEXT NOT NULL,
        origin_workspace_path TEXT NOT NULL,
        origin_codex_project_id TEXT,
        origin_codex_project_kind TEXT,
        origin_codex_host_id TEXT,
        origin_issue_id TEXT,
        origin_issue_identifier TEXT,
        codex_thread_id TEXT,
        model TEXT NOT NULL,
        reasoning_effort TEXT NOT NULL,
        sandbox TEXT NOT NULL CHECK (sandbox IN (
          'read-only', 'workspace-write', 'danger-full-access'
        )),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS ai_chat_threads_updated
        ON ai_chat_threads(updated_at DESC, id);

      CREATE TABLE IF NOT EXISTS ai_chat_runs (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL REFERENCES ai_chat_threads(id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK (status IN (
          'running', 'completed', 'failed', 'interrupted'
        )),
        exit_code INTEGER,
        error TEXT,
        started_at TEXT NOT NULL,
        finished_at TEXT
      );

      CREATE INDEX IF NOT EXISTS ai_chat_runs_thread_started
        ON ai_chat_runs(thread_id, started_at, id);

      CREATE UNIQUE INDEX IF NOT EXISTS ai_chat_runs_one_active
        ON ai_chat_runs(thread_id)
        WHERE status = 'running';

      CREATE TABLE IF NOT EXISTS ai_chat_events (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL REFERENCES ai_chat_threads(id) ON DELETE CASCADE,
        run_id TEXT REFERENCES ai_chat_runs(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'activity', 'error')),
        content TEXT NOT NULL,
        data TEXT,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS ai_chat_events_thread_created
        ON ai_chat_events(thread_id, created_at, id);

    `);
    const projectColumns = this.database.prepare("PRAGMA table_info(projects)").all();
    if (!projectColumns.some((column) => column.name === "workspace_path")) {
      this.database.exec("ALTER TABLE projects ADD COLUMN workspace_path TEXT");
    }
    const aiChatThreadColumns = this.database.prepare("PRAGMA table_info(ai_chat_threads)").all();
    for (const column of [
      "origin_codex_project_id",
      "origin_codex_project_kind",
      "origin_codex_host_id"
    ]) {
      if (!aiChatThreadColumns.some((candidate) => candidate.name === column)) {
        this.database.exec(`ALTER TABLE ai_chat_threads ADD COLUMN ${column} TEXT`);
      }
    }
    const taskColumns = this.database.prepare("PRAGMA table_info(tasks)").all();
    const hasWorkflowId = taskColumns.some((column) => column.name === "workflow_id");
    if (hasWorkflowId) {
      this.database.exec("ALTER TABLE tasks DROP COLUMN workflow_id");
    }
    this.database.exec("DROP TABLE IF EXISTS workflow_workspaces");
    const hasThreadId = taskColumns.some((column) => column.name === "thread_id");
    const hasLinkedThreadId = taskColumns.some((column) => column.name === "linked_thread_id");
    if (!hasThreadId) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN thread_id TEXT");
    }
    for (const column of [
      "thread_codex_project_id",
      "thread_codex_project_kind",
      "thread_codex_host_id",
      "thread_workspace_path"
    ]) {
      if (!taskColumns.some((candidate) => candidate.name === column)) {
        this.database.exec(`ALTER TABLE tasks ADD COLUMN ${column} TEXT`);
      }
    }
    this.database.exec(`
      DROP TRIGGER IF EXISTS tasks_todo_execution_target_insert;
      DROP TRIGGER IF EXISTS tasks_todo_execution_target_update;
    `);
    if (hasLinkedThreadId) {
      this.database.exec(`
        UPDATE tasks
        SET thread_id = COALESCE(thread_id, linked_thread_id)
      `);
      this.database.exec("ALTER TABLE tasks DROP COLUMN linked_thread_id");
    }
    if (!taskColumns.some((column) => column.name === "git_branch")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN git_branch TEXT");
    }
    if (!taskColumns.some((column) => column.name === "worktree_path")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN worktree_path TEXT");
    }
    if (!taskColumns.some((column) => column.name === "worktree_branch")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN worktree_branch TEXT");
    }
    if (!taskColumns.some((column) => column.name === "due_date")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN due_date TEXT");
    }
    if (!taskColumns.some((column) => column.name === "start_date")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN start_date TEXT");
    }
    if (!taskColumns.some((column) => column.name === "recurrence_interval")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN recurrence_interval INTEGER");
    }
    if (!taskColumns.some((column) => column.name === "recurrence_unit")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN recurrence_unit TEXT");
    }
    this.#migrateTaskStatuses();
    const migratedTaskColumns = this.database.prepare("PRAGMA table_info(tasks)").all();
    if (!migratedTaskColumns.some((column) => column.name === "creator_type")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN creator_type TEXT NOT NULL DEFAULT 'user'");
    }
    if (!migratedTaskColumns.some((column) => column.name === "creator_id")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN creator_id TEXT NOT NULL DEFAULT 'local-user'");
    }
    if (!migratedTaskColumns.some((column) => column.name === "creator_name")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN creator_name TEXT NOT NULL DEFAULT '\u672C\u5730\u7528\u6237'");
    }
    if (!migratedTaskColumns.some((column) => column.name === "creator_avatar_url")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN creator_avatar_url TEXT");
    }
    if (!migratedTaskColumns.some((column) => column.name === "external_source")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN external_source TEXT");
    }
    if (!migratedTaskColumns.some((column) => column.name === "external_id")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN external_id TEXT");
    }
    if (!migratedTaskColumns.some((column) => column.name === "external_origin")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN external_origin TEXT");
    }
    if (!migratedTaskColumns.some((column) => column.name === "external_key")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN external_key TEXT");
    }
    if (!migratedTaskColumns.some((column) => column.name === "external_url")) {
      this.database.exec("ALTER TABLE tasks ADD COLUMN external_url TEXT");
    }
    this.database.exec(`
      DROP INDEX IF EXISTS tasks_external_source_id;
      CREATE UNIQUE INDEX IF NOT EXISTS tasks_external_source_origin_id
      ON tasks(external_source, external_origin, external_id)
      WHERE external_source IS NOT NULL AND external_origin IS NOT NULL AND external_id IS NOT NULL
    `);
    this.database.exec(`
      UPDATE tasks
      SET creator_type = 'agent', creator_id = 'codex-agent', creator_name = 'Codex Agent'
      WHERE thread_id IS NOT NULL AND version = 1 AND creator_id = 'local-user'
    `);
    const identityTaskColumns = this.database.prepare("PRAGMA table_info(tasks)").all();
    const assigneeMigrations = [
      ["assignee_type", "TEXT CHECK (assignee_type IN ('user', 'agent'))", "creator_type"],
      ["assignee_id", "TEXT", "creator_id"],
      ["assignee_name", "TEXT", "creator_name"],
      ["assignee_avatar_url", "TEXT", "creator_avatar_url"]
    ].filter(([column]) => !identityTaskColumns.some((current) => current.name === column));
    if (assigneeMigrations.length > 0) {
      this.database.exec("BEGIN IMMEDIATE");
      try {
        for (const [column, definition, source] of assigneeMigrations) {
          this.database.exec(`ALTER TABLE tasks ADD COLUMN ${column} ${definition}`);
          this.database.exec(`UPDATE tasks SET ${column} = ${source}`);
        }
        this.database.exec("COMMIT");
      } catch (error) {
        this.database.exec("ROLLBACK");
        throw error;
      }
    }
    if (!projectColumns.some((column) => column.name === "labels")) {
      this.database.exec("BEGIN IMMEDIATE");
      try {
        this.database.exec(`
          ALTER TABLE projects
          ADD COLUMN labels TEXT NOT NULL DEFAULT '${DEFAULT_PROJECT_LABELS_JSON}'
        `);
        const labelsByProject = new Map(
          this.database.prepare("SELECT id FROM projects").all().map((project) => [project.id, [...DEFAULT_LABEL_NAMES]])
        );
        for (const task of this.database.prepare(`
          SELECT project_id, labels
          FROM tasks
          ORDER BY created_at, id
        `).all()) {
          const projectLabels = labelsByProject.get(task.project_id);
          if (!projectLabels) continue;
          for (const label of JSON.parse(task.labels)) {
            if (!projectLabels.includes(label)) projectLabels.push(label);
          }
        }
        const updateProjectLabels = this.database.prepare(`
          UPDATE projects SET labels = ? WHERE id = ?
        `);
        for (const [projectId, labels] of labelsByProject) {
          updateProjectLabels.run(JSON.stringify(labels), projectId);
        }
        this.database.exec("COMMIT");
      } catch (error) {
        this.database.exec("ROLLBACK");
        throw error;
      }
    }
    this.database.exec(`
      CREATE INDEX IF NOT EXISTS tasks_project_status_sort
        ON tasks(project_id, archived_at, status, sort_order, created_at)
    `);
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS task_relations (
        relation_type TEXT NOT NULL CHECK (relation_type IN ('parent', 'blocks', 'related')),
        source_task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        target_task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        origin TEXT NOT NULL DEFAULT 'manual' CHECK (origin IN ('manual', 'mention')),
        created_at TEXT NOT NULL,
        CHECK (source_task_id <> target_task_id),
        CHECK (relation_type <> 'related' OR source_task_id < target_task_id),
        PRIMARY KEY (relation_type, source_task_id, target_task_id)
      );

      CREATE INDEX IF NOT EXISTS task_relations_target
        ON task_relations(relation_type, target_task_id);

      CREATE UNIQUE INDEX IF NOT EXISTS task_relations_one_parent
        ON task_relations(target_task_id)
        WHERE relation_type = 'parent';

      CREATE TRIGGER IF NOT EXISTS task_relations_require_same_project
      BEFORE INSERT ON task_relations
      BEGIN
        SELECT RAISE(ABORT, 'CROSS_PROJECT_RELATION')
        WHERE EXISTS (
          SELECT 1
          FROM tasks AS source
          JOIN tasks AS target ON target.id = NEW.target_task_id
          WHERE source.id = NEW.source_task_id
            AND source.project_id != target.project_id
        );
      END;

      CREATE TRIGGER IF NOT EXISTS task_relations_prevent_parent_cycle
      BEFORE INSERT ON task_relations
      WHEN NEW.relation_type = 'parent'
      BEGIN
        SELECT RAISE(ABORT, 'RELATION_CYCLE')
        WHERE EXISTS (
          WITH RECURSIVE ancestors(id) AS (
            SELECT source_task_id
            FROM task_relations
            WHERE relation_type = 'parent' AND target_task_id = NEW.source_task_id
            UNION
            SELECT task_relations.source_task_id
            FROM task_relations
            JOIN ancestors ON task_relations.target_task_id = ancestors.id
            WHERE task_relations.relation_type = 'parent'
          )
          SELECT 1 FROM ancestors WHERE id = NEW.target_task_id
        );
      END;
    `);
    const taskRelationColumns = this.database.prepare("PRAGMA table_info(task_relations)").all();
    if (!taskRelationColumns.some((column) => column.name === "origin")) {
      this.database.exec(`
        ALTER TABLE task_relations
        ADD COLUMN origin TEXT NOT NULL DEFAULT 'manual'
          CHECK (origin IN ('manual', 'mention'))
      `);
    }
    const commentColumns = this.database.prepare("PRAGMA table_info(comments)").all();
    if (!commentColumns.some((column) => column.name === "thread_id")) {
      this.database.exec("ALTER TABLE comments ADD COLUMN thread_id TEXT");
    }
    for (const column of [
      "thread_codex_project_id",
      "thread_codex_project_kind",
      "thread_codex_host_id",
      "thread_workspace_path"
    ]) {
      if (!commentColumns.some((candidate) => candidate.name === column)) {
        this.database.exec(`ALTER TABLE comments ADD COLUMN ${column} TEXT`);
      }
    }
    if (!commentColumns.some((column) => column.name === "author_type")) {
      this.database.exec("ALTER TABLE comments ADD COLUMN author_type TEXT NOT NULL DEFAULT 'user'");
    }
    if (!commentColumns.some((column) => column.name === "author_avatar_url")) {
      this.database.exec("ALTER TABLE comments ADD COLUMN author_avatar_url TEXT");
    }
    if (!commentColumns.some((column) => column.name === "change_revision")) {
      this.database.exec("ALTER TABLE comments ADD COLUMN change_revision INTEGER NOT NULL DEFAULT 0");
    }
    this.database.exec(`
      UPDATE comments
      SET author_type = 'agent', author_id = 'codex-agent', author_name = 'Codex Agent'
      WHERE thread_id IS NOT NULL AND author_id = 'local'
    `);
    this.database.exec(`
      UPDATE comments
      SET author_id = 'local-user'
      WHERE author_id = 'local'
    `);
    const hasTaskThreads = this.database.prepare(`
      SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = 'task_threads'
    `).get();
    if (hasTaskThreads) {
      this.database.exec(`
        UPDATE tasks AS migrated_task
        SET thread_id = COALESCE(thread_id, (
          SELECT task_threads.thread_id
          FROM task_threads
          LEFT JOIN comments
            ON comments.task_id = task_threads.task_id
            AND comments.thread_id = task_threads.thread_id
          WHERE task_threads.task_id = migrated_task.id
          ORDER BY
            CASE WHEN comments.id IS NOT NULL THEN 1 ELSE 0 END,
            task_threads.created_at DESC,
            task_threads.thread_id DESC
          LIMIT 1
        ))
        WHERE thread_id IS NULL
      `);
      this.database.exec("DROP TABLE task_threads");
    }
    const attachmentColumns = this.database.prepare("PRAGMA table_info(attachments)").all();
    if (!attachmentColumns.some((column) => column.name === "comment_id")) {
      this.database.exec("ALTER TABLE attachments ADD COLUMN comment_id TEXT REFERENCES comments(id) ON DELETE CASCADE");
    }
    if (!attachmentColumns.some((column) => column.name === "kind")) {
      this.database.exec("ALTER TABLE attachments ADD COLUMN kind TEXT NOT NULL DEFAULT 'attachment' CHECK (kind IN ('inline', 'attachment'))");
      this.database.exec(`
        UPDATE attachments
        SET kind = 'inline'
        WHERE content_type LIKE 'image/%'
          AND (
            (
              comment_id IS NULL
              AND EXISTS (
                SELECT 1 FROM tasks
                WHERE tasks.id = attachments.task_id
                  AND instr(tasks.description, 'api/attachments/' || attachments.id || '/content') > 0
              )
            )
            OR (
              comment_id IS NOT NULL
              AND EXISTS (
                SELECT 1 FROM comments
                WHERE comments.id = attachments.comment_id
                  AND instr(comments.body, 'api/attachments/' || attachments.id || '/content') > 0
              )
            )
          )
      `);
    }
    if (!attachmentColumns.some((column) => column.name === "change_revision")) {
      this.database.exec("ALTER TABLE attachments ADD COLUMN change_revision INTEGER NOT NULL DEFAULT 0");
    }
    this.database.exec("CREATE INDEX IF NOT EXISTS comments_task_change_revision ON comments(task_id, change_revision)");
    this.database.exec("CREATE INDEX IF NOT EXISTS attachments_comment_created ON attachments(comment_id, created_at, id)");
    this.database.exec("CREATE INDEX IF NOT EXISTS attachments_task_change_revision ON attachments(task_id, change_revision) WHERE comment_id IS NULL");
    this.database.exec("CREATE INDEX IF NOT EXISTS attachments_comment_change_revision ON attachments(comment_id, change_revision) WHERE comment_id IS NOT NULL");
    const maxChangeRevision = this.database.prepare(`
      SELECT MAX(change_revision) AS value
      FROM (
        SELECT change_revision FROM comments
        UNION ALL
        SELECT change_revision FROM attachments
      )
    `).get().value ?? 0;
    this.database.prepare(`
      INSERT INTO comment_attachment_revision (id, value)
      VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET value = MAX(value, excluded.value)
    `).run(maxChangeRevision);
    const timestamp = now();
    this.database.prepare(`
      INSERT INTO projects (id, name, workspace_path, next_task_number, created_at, updated_at)
      VALUES ('local', '\u5168\u5C40', NULL, 1, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `).run(timestamp, timestamp);
    this.database.prepare(`
      UPDATE projects
      SET workspace_path = NULL, updated_at = ?
      WHERE id = 'local' AND workspace_path IS NOT NULL
    `).run(timestamp);
  }
  close() {
    this.database.close();
  }
  #migrateTaskStatuses() {
    const tasksSql = this.database.prepare(`
      SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'tasks'
    `).get()?.sql ?? "";
    if (tasksSql.includes("'in_review'") && tasksSql.includes("'blocked'") && tasksSql.includes("'canceled'")) {
      return;
    }
    this.database.exec("PRAGMA foreign_keys = OFF; BEGIN IMMEDIATE");
    try {
      this.database.exec(`
        CREATE TABLE tasks_status_migration (
          id TEXT PRIMARY KEY,
          identifier TEXT NOT NULL UNIQUE,
          project_id TEXT NOT NULL REFERENCES projects(id),
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL CHECK (status IN (
            'backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'done', 'canceled'
          )),
          priority TEXT NOT NULL CHECK (priority IN ('none', 'urgent', 'high', 'medium', 'low')),
          labels TEXT NOT NULL DEFAULT '[]',
          sort_order REAL NOT NULL,
          thread_id TEXT,
          thread_codex_project_id TEXT,
          thread_codex_project_kind TEXT,
          thread_codex_host_id TEXT,
          thread_workspace_path TEXT,
          git_branch TEXT,
          worktree_path TEXT,
          worktree_branch TEXT,
          start_date TEXT,
          due_date TEXT,
          recurrence_interval INTEGER,
          recurrence_unit TEXT,
          archived_at TEXT,
          version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        INSERT INTO tasks_status_migration (
          id, identifier, project_id, title, description, status, priority, labels,
          sort_order, thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path, git_branch, worktree_path, worktree_branch,
          start_date, due_date, recurrence_interval, recurrence_unit,
          archived_at, version, created_at, updated_at
        )
        SELECT
          id, identifier, project_id, title, description, status, priority, labels,
          sort_order, thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path, git_branch, worktree_path, worktree_branch,
          start_date, due_date, recurrence_interval, recurrence_unit,
          archived_at, version, created_at, updated_at
        FROM tasks;

        DROP TABLE tasks;
        ALTER TABLE tasks_status_migration RENAME TO tasks;
      `);
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    } finally {
      this.database.exec("PRAGMA foreign_keys = ON");
    }
    const violation = this.database.prepare("PRAGMA foreign_key_check").get();
    if (violation) {
      throw new Error(`Task status migration produced a foreign key violation in '${violation.table}'`);
    }
  }
  listProjects() {
    return this.database.prepare(`
      SELECT
        projects.id,
        projects.name,
        projects.workspace_path,
        projects.labels,
        projects.created_at,
        projects.updated_at,
        COUNT(tasks.id) AS issue_count
      FROM projects
      LEFT JOIN tasks
        ON tasks.project_id = projects.id
        AND tasks.archived_at IS NULL
      GROUP BY
        projects.id,
        projects.name,
        projects.workspace_path,
        projects.labels,
        projects.created_at,
        projects.updated_at
      ORDER BY projects.created_at, projects.id
    `).all().map(projectFromRow);
  }
  createProject(input) {
    const timestamp = now();
    try {
      this.database.prepare(`
        INSERT INTO projects (
          id, name, workspace_path, labels, next_task_number, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 1, ?, ?)
      `).run(
        input.id,
        input.name,
        input.workspacePath,
        DEFAULT_PROJECT_LABELS_JSON,
        timestamp,
        timestamp
      );
    } catch (error) {
      if (String(error.message).includes("UNIQUE constraint failed")) {
        throw new ApiError(409, "PROJECT_EXISTS", `Project '${input.id}' already exists`);
      }
      throw error;
    }
    return this.getProject(input.id);
  }
  renameProject(id, name) {
    const result = this.database.prepare(`
      UPDATE projects SET name = ?, updated_at = ? WHERE id = ?
    `).run(name, now(), id);
    if (result.changes !== 1) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${id}' does not exist`);
    }
    return this.getProject(id);
  }
  ensureJiraProject(name) {
    const timestamp = now();
    this.database.prepare(`
      INSERT INTO projects (id, name, workspace_path, next_task_number, created_at, updated_at)
      VALUES (?, ?, NULL, 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at
    `).run(JIRA_PROJECT_ID, name, timestamp, timestamp);
    return this.database.prepare(`
      SELECT
        projects.id,
        projects.name,
        projects.workspace_path,
        projects.created_at,
        projects.updated_at,
        COUNT(tasks.id) AS issue_count
      FROM projects
      LEFT JOIN tasks ON tasks.project_id = projects.id AND tasks.archived_at IS NULL
      WHERE projects.id = ?
      GROUP BY projects.id
    `).get(JIRA_PROJECT_ID);
  }
  syncJiraTasks(issues, { archiveMissing = true, projectName, legacyIdentity = null } = {}) {
    const timestamp = now();
    const seenTaskIds = /* @__PURE__ */ new Set();
    const projectLabels = JSON.stringify([
      ...new Set(issues.flatMap((issue) => issue.labels))
    ]);
    this.database.exec("BEGIN IMMEDIATE");
    try {
      this.database.prepare(`
        INSERT INTO projects (id, name, workspace_path, labels, next_task_number, created_at, updated_at)
        VALUES (?, ?, NULL, ?, 1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          labels = excluded.labels,
          updated_at = excluded.updated_at
      `).run(JIRA_PROJECT_ID, projectName, projectLabels, timestamp, timestamp);
      const findExisting = this.database.prepare(`
        SELECT * FROM tasks
        WHERE external_source = 'jira' AND external_origin = ? AND external_id = ?
      `);
      const migrateLegacyIdentity = this.database.prepare(`
        UPDATE tasks SET
          identifier = ?, external_origin = ?, external_id = ?, external_key = ?
        WHERE id = ?
      `);
      if (legacyIdentity) {
        const legacyTasks = this.database.prepare(`
          SELECT id, identifier, external_id
          FROM tasks
          WHERE project_id = ?
            AND external_source = 'jira'
            AND external_origin IS NULL
            AND substr(external_id, 1, 17) = ?
            AND id = 'jira:' || external_id
        `).all(JIRA_PROJECT_ID, `${legacyIdentity.urlHash}:`);
        for (const legacyTask of legacyTasks) {
          const externalId = legacyTask.external_id.slice(17);
          migrateLegacyIdentity.run(
            `JIRA:${legacyIdentity.originId.toUpperCase()}:${externalId}`,
            legacyIdentity.originId,
            externalId,
            legacyTask.identifier,
            legacyTask.id
          );
        }
      }
      const insertTask = this.database.prepare(`
        INSERT INTO tasks (
          id, identifier, project_id, title, description, status, priority, labels,
          sort_order, thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path,
          creator_type, creator_id, creator_name, creator_avatar_url,
          assignee_type, assignee_id, assignee_name, assignee_avatar_url,
          git_branch, worktree_path, worktree_branch,
          start_date, due_date, recurrence_interval, recurrence_unit,
          external_source, external_origin, external_id, external_key, external_url,
          archived_at, version, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, NULL, NULL, NULL, NULL, NULL,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          NULL, NULL, NULL,
          NULL, ?, NULL, NULL,
          'jira', ?, ?, ?, ?,
          NULL, 1, ?, ?
        )
      `);
      const updateTask = this.database.prepare(`
        UPDATE tasks SET
          identifier = ?, title = ?, description = ?, status = ?, priority = ?, labels = ?,
          sort_order = ?, creator_type = ?, creator_id = ?, creator_name = ?, creator_avatar_url = ?,
          assignee_type = ?, assignee_id = ?, assignee_name = ?, assignee_avatar_url = ?,
          due_date = ?, external_origin = ?, external_id = ?, external_key = ?, external_url = ?,
          archived_at = NULL,
          version = version + 1, updated_at = ?
        WHERE id = ?
      `);
      for (const issue of issues) {
        const existing = findExisting.get(issue.externalOrigin, issue.externalId);
        seenTaskIds.add(existing?.id ?? issue.id);
        const labels = JSON.stringify(issue.labels);
        if (!existing) {
          insertTask.run(
            issue.id,
            issue.identifier,
            JIRA_PROJECT_ID,
            issue.title,
            issue.description,
            issue.status,
            issue.priority,
            labels,
            issue.sortOrder,
            issue.creator.type,
            issue.creator.id,
            issue.creator.name,
            issue.creator.avatarUrl,
            issue.assignee.type,
            issue.assignee.id,
            issue.assignee.name,
            issue.assignee.avatarUrl,
            issue.dueDate,
            issue.externalOrigin,
            issue.externalId,
            issue.externalKey,
            issue.externalUrl,
            issue.createdAt,
            issue.updatedAt
          );
          continue;
        }
        const changed = existing.identifier !== issue.identifier || existing.title !== issue.title || existing.description !== issue.description || existing.status !== issue.status || existing.priority !== issue.priority || existing.labels !== labels || existing.sort_order !== issue.sortOrder || existing.creator_type !== issue.creator.type || existing.creator_id !== issue.creator.id || existing.creator_name !== issue.creator.name || existing.creator_avatar_url !== issue.creator.avatarUrl || existing.assignee_type !== issue.assignee.type || existing.assignee_id !== issue.assignee.id || existing.assignee_name !== issue.assignee.name || existing.assignee_avatar_url !== issue.assignee.avatarUrl || existing.due_date !== issue.dueDate || existing.external_origin !== issue.externalOrigin || existing.external_id !== issue.externalId || existing.external_key !== issue.externalKey || existing.external_url !== issue.externalUrl || existing.archived_at !== null;
        if (!changed) continue;
        updateTask.run(
          issue.identifier,
          issue.title,
          issue.description,
          issue.status,
          issue.priority,
          labels,
          issue.sortOrder,
          issue.creator.type,
          issue.creator.id,
          issue.creator.name,
          issue.creator.avatarUrl,
          issue.assignee.type,
          issue.assignee.id,
          issue.assignee.name,
          issue.assignee.avatarUrl,
          issue.dueDate,
          issue.externalOrigin,
          issue.externalId,
          issue.externalKey,
          issue.externalUrl,
          issue.updatedAt,
          existing.id
        );
      }
      if (archiveMissing) {
        const existingTasks = this.database.prepare(`
          SELECT id FROM tasks
          WHERE project_id = ? AND external_source = 'jira' AND archived_at IS NULL
        `).all(JIRA_PROJECT_ID);
        const archiveTask = this.database.prepare(`
          UPDATE tasks
          SET archived_at = ?, version = version + 1, updated_at = ?
          WHERE id = ?
        `);
        for (const task of existingTasks) {
          if (!seenTaskIds.has(task.id)) {
            archiveTask.run(timestamp, timestamp, task.id);
          }
        }
      }
      this.database.prepare("UPDATE projects SET updated_at = ? WHERE id = ?").run(timestamp, JIRA_PROJECT_ID);
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  deleteProject(id) {
    const project = this.getProject(id);
    if (!project) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${id}' does not exist`);
    }
    if (!id.startsWith("temp-")) {
      throw new ApiError(403, "PROJECT_DELETE_FORBIDDEN", "Only manually created projects can be deleted");
    }
    const result = this.database.prepare(`
      DELETE FROM projects
      WHERE id = ?
        AND NOT EXISTS (SELECT 1 FROM tasks WHERE project_id = ?)
    `).run(id, id);
    if (result.changes !== 1) {
      const issueCount = Number(this.database.prepare(`
        SELECT COUNT(*) AS issue_count FROM tasks WHERE project_id = ?
      `).get(id).issue_count);
      throw new ApiError(409, "PROJECT_NOT_EMPTY", "Project still contains issues", { issueCount });
    }
    return project;
  }
  getProject(id) {
    const row = this.database.prepare(`
      SELECT
        projects.id,
        projects.name,
        projects.workspace_path,
        projects.labels,
        projects.created_at,
        projects.updated_at,
        COUNT(tasks.id) AS issue_count
      FROM projects
      LEFT JOIN tasks
        ON tasks.project_id = projects.id
        AND tasks.archived_at IS NULL
      WHERE projects.id = ?
      GROUP BY
        projects.id,
        projects.name,
        projects.workspace_path,
        projects.labels,
        projects.created_at,
        projects.updated_at
    `).get(id);
    return row ? projectFromRow(row) : null;
  }
  addProjectLabel(projectId, label) {
    const project = this.database.prepare("SELECT labels FROM projects WHERE id = ?").get(projectId);
    if (!project) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
    }
    const labels = JSON.parse(project.labels);
    if (!labels.includes(label)) {
      this.database.prepare(`
        UPDATE projects SET labels = ?, updated_at = ? WHERE id = ?
      `).run(JSON.stringify([...labels, label]), now(), projectId);
    }
    return this.getProject(projectId);
  }
  deleteProjectLabel(projectId, label) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const project = this.database.prepare("SELECT labels FROM projects WHERE id = ?").get(projectId);
      if (!project) {
        throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
      }
      const timestamp = now();
      const labels = JSON.parse(project.labels);
      if (labels.includes(label)) {
        this.database.prepare(`
          UPDATE projects SET labels = ?, updated_at = ? WHERE id = ?
        `).run(JSON.stringify(labels.filter((current) => current !== label)), timestamp, projectId);
      }
      const updateTask = this.database.prepare(`
        UPDATE tasks
        SET labels = ?, version = version + 1, updated_at = ?
        WHERE id = ?
      `);
      for (const task of this.database.prepare(`
        SELECT id, labels FROM tasks WHERE project_id = ?
      `).all(projectId)) {
        const taskLabels = JSON.parse(task.labels);
        if (taskLabels.includes(label)) {
          updateTask.run(
            JSON.stringify(taskLabels.filter((current) => current !== label)),
            timestamp,
            task.id
          );
        }
      }
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getProject(projectId);
  }
  getProjectSummary(projectId) {
    const row = this.database.prepare(`
      SELECT project_id, summary, generated_at, attempted_at, error
      FROM project_summaries
      WHERE project_id = ?
    `).get(projectId);
    return row ? projectSummaryFromRow(row) : {
      projectId,
      summary: null,
      generatedAt: null,
      attemptedAt: null,
      error: null
    };
  }
  listProjectSummaries() {
    return this.database.prepare(`
      SELECT project_id, summary, generated_at, attempted_at, error
      FROM project_summaries
      ORDER BY project_id
    `).all().map(projectSummaryFromRow);
  }
  saveProjectSummary(projectId, summary) {
    const timestamp = now();
    this.database.prepare(`
      INSERT INTO project_summaries (
        project_id, summary, generated_at, attempted_at, error
      ) VALUES (?, ?, ?, ?, NULL)
      ON CONFLICT(project_id) DO UPDATE SET
        summary = excluded.summary,
        generated_at = excluded.generated_at,
        attempted_at = excluded.attempted_at,
        error = NULL
    `).run(projectId, summary, timestamp, timestamp);
    return this.getProjectSummary(projectId);
  }
  saveProjectSummaryError(projectId, error) {
    const timestamp = now();
    this.database.prepare(`
      INSERT INTO project_summaries (
        project_id, summary, generated_at, attempted_at, error
      ) VALUES (?, NULL, NULL, ?, ?)
      ON CONFLICT(project_id) DO UPDATE SET
        attempted_at = excluded.attempted_at,
        error = excluded.error
    `).run(projectId, timestamp, error);
    return this.getProjectSummary(projectId);
  }
  getProjectReadme(projectId) {
    if (!this.database.prepare("SELECT 1 FROM projects WHERE id = ?").get(projectId)) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
    }
    const row = this.database.prepare(`
      SELECT project_id, content, version, created_at, updated_at
      FROM project_readmes
      WHERE project_id = ?
    `).get(projectId);
    return row ? projectReadmeFromRow(row, projectId) : { projectId, content: "", version: 0, createdAt: null, updatedAt: null };
  }
  saveProjectReadme(projectId, content, expectedVersion) {
    const timestamp = now();
    this.database.exec("BEGIN IMMEDIATE");
    try {
      if (!this.database.prepare("SELECT 1 FROM projects WHERE id = ?").get(projectId)) {
        throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
      }
      const current = this.database.prepare(`
        SELECT version FROM project_readmes WHERE project_id = ?
      `).get(projectId);
      if (expectedVersion !== void 0) {
        const actualVersion = current?.version ?? 0;
        if (actualVersion !== expectedVersion) {
          throw new ApiError(409, "VERSION_CONFLICT", "Project README changed since it was last read", {
            expectedVersion,
            actualVersion
          });
        }
      }
      if (current) {
        const versionCondition = expectedVersion !== void 0 ? " AND version = ?" : "";
        const params = expectedVersion !== void 0 ? [content, timestamp, projectId, expectedVersion] : [content, timestamp, projectId];
        this.database.prepare(`
          UPDATE project_readmes
          SET content = ?, version = version + 1, updated_at = ?
          WHERE project_id = ?${versionCondition}
        `).run(...params);
      } else {
        this.database.prepare(`
          INSERT INTO project_readmes (project_id, content, version, created_at, updated_at)
          VALUES (?, ?, 1, ?, ?)
        `).run(projectId, content, timestamp, timestamp);
      }
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getProjectReadme(projectId);
  }
  createProjectReadmeAttachment(projectId, input) {
    if (!this.database.prepare("SELECT 1 FROM projects WHERE id = ?").get(projectId)) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
    }
    this.database.prepare(`
      INSERT INTO project_readme_attachments (
        id, project_id, filename, content_type, size, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      input.id,
      projectId,
      input.filename,
      input.contentType,
      input.size,
      now()
    );
    return this.getProjectReadmeAttachment(input.id);
  }
  getProjectReadmeAttachment(id) {
    const row = this.database.prepare(`
      SELECT * FROM project_readme_attachments WHERE id = ?
    `).get(id);
    return row ? projectReadmeAttachmentFromRow(row) : null;
  }
  listAiChatThreads() {
    const rows = this.database.prepare(`
      SELECT * FROM ai_chat_threads
      ORDER BY updated_at DESC, id
    `).all();
    if (rows.length === 0) return [];
    const currentRuns = /* @__PURE__ */ new Map();
    for (const row of this.database.prepare(`
      SELECT * FROM ai_chat_runs
      WHERE status = 'running'
      ORDER BY thread_id, started_at DESC, id DESC
    `).all()) {
      if (!currentRuns.has(row.thread_id)) currentRuns.set(row.thread_id, aiChatRunFromRow(row));
    }
    const latestTodos = /* @__PURE__ */ new Map();
    for (const row of this.database.prepare(`
      SELECT id, thread_id, run_id, data, created_at
      FROM ai_chat_events
      WHERE type = 'todo_list'
      ORDER BY thread_id, created_at DESC, rowid DESC
    `).all()) {
      if (latestTodos.has(row.thread_id)) continue;
      const currentRun = currentRuns.get(row.thread_id);
      if (currentRun && row.run_id !== currentRun.id) continue;
      const progress = parseAiChatTodoProgress(row);
      if (progress) latestTodos.set(row.thread_id, progress);
    }
    return rows.map((row) => {
      const thread = aiChatThreadFromRow(row);
      thread.currentRun = currentRuns.get(thread.id) ?? null;
      thread.latestTodo = latestTodos.get(thread.id) ?? null;
      return thread;
    });
  }
  getAiChatThread(id) {
    const row = this.database.prepare("SELECT * FROM ai_chat_threads WHERE id = ?").get(id);
    return row ? this.#aiChatThreadWithCurrentRun(row) : null;
  }
  hasAiChatThreadProjectConflict(issueRef, projectId) {
    return Boolean(this.database.prepare(`
      SELECT 1
      FROM ai_chat_threads
      WHERE (origin_issue_id = ? OR origin_issue_identifier = ?)
        AND origin_project_id != ?
      LIMIT 1
    `).get(issueRef, issueRef, projectId));
  }
  createAiChatThread(input) {
    const id = input.id ?? randomUUID();
    const timestamp = input.createdAt ?? now();
    this.database.prepare(`
      INSERT INTO ai_chat_threads (
        id, title, status,
        origin_project_id, origin_project_name, origin_workspace_path,
        origin_codex_project_id, origin_codex_project_kind, origin_codex_host_id,
        origin_issue_id, origin_issue_identifier,
        codex_thread_id, model, reasoning_effort, sandbox,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.title,
      input.status ?? "idle",
      input.origin.projectId,
      input.origin.projectName,
      input.origin.workspacePath,
      input.origin.codexProjectId ?? null,
      input.origin.codexProjectKind ?? null,
      input.origin.codexHostId ?? null,
      input.origin.issueId ?? null,
      input.origin.issueIdentifier ?? null,
      input.codexThreadId ?? null,
      input.model,
      input.reasoningEffort,
      input.sandbox,
      timestamp,
      input.updatedAt ?? timestamp
    );
    return this.getAiChatThread(id);
  }
  updateAiChatThread(id, changes) {
    const current = this.getAiChatThread(id);
    if (!current) {
      throw new ApiError(404, "AI_CHAT_THREAD_NOT_FOUND", `AI chat thread '${id}' does not exist`);
    }
    const columns = {
      title: "title",
      status: "status",
      codexThreadId: "codex_thread_id",
      model: "model",
      reasoningEffort: "reasoning_effort",
      sandbox: "sandbox"
    };
    const assignments = [];
    const values = [];
    for (const [key, column] of Object.entries(columns)) {
      if (!Object.hasOwn(changes, key)) continue;
      assignments.push(`${column} = ?`);
      values.push(changes[key]);
    }
    if (assignments.length === 0) return current;
    assignments.push("updated_at = ?");
    values.push(changes.updatedAt ?? now(), id);
    this.database.prepare(`
      UPDATE ai_chat_threads SET ${assignments.join(", ")} WHERE id = ?
    `).run(...values);
    return this.getAiChatThread(id);
  }
  deleteAiChatThread(id) {
    const current = this.getAiChatThread(id);
    if (!current) {
      throw new ApiError(404, "AI_CHAT_THREAD_NOT_FOUND", `AI chat thread '${id}' does not exist`);
    }
    this.database.prepare("DELETE FROM ai_chat_threads WHERE id = ?").run(id);
    return current;
  }
  listAiChatRuns(threadId) {
    return this.database.prepare(`
      SELECT * FROM ai_chat_runs
      WHERE thread_id = ?
      ORDER BY started_at, id
    `).all(threadId).map(aiChatRunFromRow);
  }
  getAiChatRun(id) {
    const row = this.database.prepare("SELECT * FROM ai_chat_runs WHERE id = ?").get(id);
    return row ? aiChatRunFromRow(row) : null;
  }
  createAiChatRun(input) {
    const id = input.id ?? randomUUID();
    const timestamp = input.startedAt ?? now();
    this.database.exec("BEGIN IMMEDIATE");
    try {
      this.database.prepare(`
        INSERT INTO ai_chat_runs (
          id, thread_id, status, exit_code, error, started_at, finished_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        input.threadId,
        input.status ?? "running",
        input.exitCode ?? null,
        input.error ?? null,
        timestamp,
        input.finishedAt ?? null
      );
      if ((input.status ?? "running") === "running") {
        this.database.prepare(`
          UPDATE ai_chat_threads
          SET status = 'running', updated_at = ?
          WHERE id = ?
        `).run(timestamp, input.threadId);
      }
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getAiChatRun(id);
  }
  updateAiChatRun(id, changes) {
    const current = this.getAiChatRun(id);
    if (!current) {
      throw new ApiError(404, "AI_CHAT_RUN_NOT_FOUND", `AI chat run '${id}' does not exist`);
    }
    const columns = {
      status: "status",
      exitCode: "exit_code",
      error: "error",
      finishedAt: "finished_at"
    };
    const assignments = [];
    const values = [];
    for (const [key, column] of Object.entries(columns)) {
      if (!Object.hasOwn(changes, key)) continue;
      assignments.push(`${column} = ?`);
      values.push(changes[key]);
    }
    if (assignments.length === 0) return current;
    this.database.exec("BEGIN IMMEDIATE");
    try {
      values.push(id);
      this.database.prepare(`
        UPDATE ai_chat_runs SET ${assignments.join(", ")} WHERE id = ?
      `).run(...values);
      const status = changes.status ?? current.status;
      if (status !== "running") {
        const threadStatus = status === "failed" ? "failed" : "idle";
        this.database.prepare(`
          UPDATE ai_chat_threads
          SET status = ?, updated_at = ?
          WHERE id = ?
            AND NOT EXISTS (
              SELECT 1 FROM ai_chat_runs
              WHERE thread_id = ? AND status = 'running'
            )
        `).run(threadStatus, changes.finishedAt ?? now(), current.threadId, current.threadId);
      }
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getAiChatRun(id);
  }
  insertAiChatEvent(input) {
    const id = input.id ?? randomUUID();
    const timestamp = input.createdAt ?? now();
    this.database.prepare(`
      INSERT INTO ai_chat_events (
        id, thread_id, run_id, type, role, content, data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.threadId,
      input.runId ?? null,
      input.type,
      input.role,
      input.content,
      input.data === void 0 || input.data === null ? null : JSON.stringify(input.data),
      timestamp
    );
    const row = this.database.prepare("SELECT * FROM ai_chat_events WHERE id = ?").get(id);
    return aiChatEventFromRow(row);
  }
  listAiChatEvents(threadId) {
    return this.database.prepare(`
      SELECT * FROM ai_chat_events
      WHERE thread_id = ?
      ORDER BY created_at, rowid
    `).all(threadId).map(aiChatEventFromRow);
  }
  interruptAbandonedAiChatRuns() {
    const timestamp = now();
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE ai_chat_runs
        SET
          status = 'interrupted',
          error = COALESCE(error, 'Taskboard service restarted'),
          finished_at = COALESCE(finished_at, ?)
        WHERE status = 'running'
      `).run(timestamp);
      if (result.changes > 0) {
        this.database.prepare(`
          UPDATE ai_chat_threads
          SET status = 'idle', updated_at = ?
          WHERE status = 'running'
            AND NOT EXISTS (
              SELECT 1 FROM ai_chat_runs
              WHERE ai_chat_runs.thread_id = ai_chat_threads.id
                AND ai_chat_runs.status = 'running'
            )
        `).run(timestamp);
      }
      this.database.exec("COMMIT");
      return Number(result.changes);
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  listTasks(filters) {
    const where = [];
    const values = [];
    if (filters.projectId) {
      where.push("project_id = ?");
      values.push(filters.projectId);
    }
    if (filters.status) {
      where.push("status = ?");
      values.push(filters.status);
    }
    if (filters.archived === "false") {
      where.push("archived_at IS NULL");
    } else if (filters.archived === "true") {
      where.push("archived_at IS NOT NULL");
    }
    const sql = `
      SELECT * FROM tasks
      ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY
        CASE status
          WHEN 'backlog' THEN 1
          WHEN 'todo' THEN 2
          WHEN 'in_progress' THEN 3
          WHEN 'in_review' THEN 4
          WHEN 'blocked' THEN 5
          WHEN 'done' THEN 6
          WHEN 'canceled' THEN 7
        END,
        sort_order,
        created_at,
        id
    `;
    const rows = this.database.prepare(sql).all(...values);
    const commentsByTask = this.#commentsForTaskActivity(rows.map((row) => row.id));
    const activitiesByTask = this.#activitiesForTasks(rows.map((row) => row.id));
    const previewImagesByTask = this.#taskPreviewImages(rows.map((row) => row.id));
    return rows.map((row) => attachTaskActivity(
      this.#taskWithRelations(row),
      commentsByTask.get(row.id) ?? [],
      activitiesByTask.get(row.id) ?? [],
      previewImagesByTask.get(row.id) ?? null
    ));
  }
  getTask(id) {
    const row = this.database.prepare("SELECT * FROM tasks WHERE id = ? OR identifier = ?").get(id, id);
    if (!row) return null;
    const task = this.#taskWithRelations(row);
    const comments = this.#commentsForTaskActivity([task.id]).get(task.id) ?? [];
    const activities = this.#activitiesForTasks([task.id]).get(task.id) ?? [];
    const previewImage = this.#taskPreviewImages([task.id]).get(task.id) ?? null;
    return attachTaskActivity(task, comments, activities, previewImage);
  }
  getTaskTree(id, direction, depth) {
    const root = this.database.prepare(
      "SELECT * FROM tasks WHERE id = ? OR identifier = ?"
    ).get(id, id);
    if (!root) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
    const nodes = [taskTreeNode(root, null, 0, [root.id])];
    const seen = /* @__PURE__ */ new Set([root.id]);
    let frontier = [nodes[0]];
    const relationJoin = direction === "descendants" ? `
        FROM task_relations
        JOIN tasks ON tasks.id = task_relations.target_task_id
        WHERE task_relations.relation_type = 'parent'
          AND task_relations.source_task_id IN (%PLACEHOLDERS%)
      ` : `
        FROM task_relations
        JOIN tasks ON tasks.id = task_relations.source_task_id
        WHERE task_relations.relation_type = 'parent'
          AND task_relations.target_task_id IN (%PLACEHOLDERS%)
      `;
    const parentColumn = direction === "descendants" ? "task_relations.source_task_id" : "task_relations.target_task_id";
    for (let level = 1; level <= depth && frontier.length > 0; level += 1) {
      const placeholders = frontier.map(() => "?").join(", ");
      const rows = this.database.prepare(`
        SELECT tasks.*, ${parentColumn} AS tree_parent_id
        ${relationJoin.replace("%PLACEHOLDERS%", placeholders)}
        ORDER BY tasks.sort_order, tasks.created_at, tasks.id
      `).all(...frontier.map((node) => node.id));
      const rowsByParent = /* @__PURE__ */ new Map();
      for (const row of rows) {
        const siblings = rowsByParent.get(row.tree_parent_id) ?? [];
        siblings.push(row);
        rowsByParent.set(row.tree_parent_id, siblings);
      }
      const next = [];
      for (const parent of frontier) {
        for (const row of rowsByParent.get(parent.id) ?? []) {
          if (seen.has(row.id)) continue;
          if (nodes.length >= TASK_TREE_MAX_NODES) {
            throw new ApiError(413, "TREE_TOO_LARGE", `Task tree cannot exceed ${TASK_TREE_MAX_NODES} nodes`);
          }
          const node = taskTreeNode(row, parent.id, level, [...parent.path, row.id]);
          nodes.push(node);
          next.push(node);
          seen.add(row.id);
        }
      }
      frontier = next;
    }
    return {
      rootId: root.id,
      direction,
      depth,
      nodeCount: nodes.length,
      nodes
    };
  }
  createTask(input) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const project = this.database.prepare(`
        SELECT
          projects.id,
          projects.name,
          projects.labels,
          projects.next_task_number,
          (
            SELECT tasks.identifier
            FROM tasks
            WHERE tasks.project_id = projects.id
            ORDER BY tasks.created_at, tasks.id
            LIMIT 1
          ) AS first_identifier
        FROM projects
        WHERE projects.id = ?
      `).get(input.projectId);
      if (!project) {
        throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${input.projectId}' does not exist`);
      }
      const prefix = projectPrefix(project);
      const maximum = this.database.prepare(`
        SELECT MAX(CAST(substr(identifier, ?) AS INTEGER)) AS number
        FROM tasks
        WHERE identifier GLOB ?
      `).get(prefix.length + 2, `${prefix}-[0-9]*`).number;
      const number = Math.max(project.next_task_number, maximum === null ? 1 : maximum + 1);
      const identifier = `${prefix}-${number}`;
      const id = randomUUID();
      const timestamp = now();
      let sortOrder = input.sortOrder;
      if (sortOrder === void 0) {
        const row = this.database.prepare(`
          SELECT MIN(sort_order) AS minimum
          FROM tasks
          WHERE project_id = ? AND status = ? AND archived_at IS NULL
        `).get(input.projectId, input.status);
        sortOrder = row.minimum === null ? 1e3 : row.minimum - 1e3;
      }
      this.database.prepare(`
        UPDATE projects SET next_task_number = ?, labels = ?, updated_at = ? WHERE id = ?
      `).run(
        number + 1,
        JSON.stringify([.../* @__PURE__ */ new Set([...JSON.parse(project.labels), ...input.labels])]),
        timestamp,
        input.projectId
      );
      this.database.prepare(`
        INSERT INTO tasks (
          id, identifier, project_id, title, description, status, priority, labels,
          sort_order, thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path,
          creator_type, creator_id, creator_name, creator_avatar_url,
          assignee_type, assignee_id, assignee_name, assignee_avatar_url,
          git_branch, worktree_path, worktree_branch,
          start_date, due_date, recurrence_interval, recurrence_unit,
          archived_at, version, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 1, ?, ?)
      `).run(
        id,
        identifier,
        input.projectId,
        input.title,
        input.description,
        input.status,
        input.priority,
        JSON.stringify(input.labels),
        sortOrder,
        ...storedThreadBinding(input.threadBinding, input.threadId) ?? [null, null, null, null, null],
        input.actor.type,
        input.actor.id,
        input.actor.name,
        input.actor.avatarUrl,
        input.assignee.type,
        input.assignee.id,
        input.assignee.name,
        input.assignee.avatarUrl,
        input.developmentContext?.type === "branch" ? input.developmentContext.branch : null,
        input.developmentContext?.type === "worktree" ? input.developmentContext.path : null,
        input.developmentContext?.type === "worktree" ? input.developmentContext.branch : null,
        input.startDate,
        input.dueDate,
        input.recurrence?.interval ?? null,
        input.recurrence?.unit ?? null,
        timestamp,
        timestamp
      );
      this.database.exec("COMMIT");
      return this.getTask(id);
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  updateTask(id, version, changes, threadId, threadBinding, actor) {
    const current = this.#requireTask(id);
    this.#requireVersion(current, version);
    const activityChanges = taskFieldChanges(current, changes);
    const targetProject = Object.hasOwn(changes, "projectId") ? this.database.prepare("SELECT id, name, workspace_path, labels FROM projects WHERE id = ?").get(changes.projectId) : null;
    if (Object.hasOwn(changes, "projectId") && !targetProject) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${changes.projectId}' does not exist`);
    }
    const projectChanged = Boolean(targetProject && targetProject.id !== current.projectId);
    if (projectChanged) {
      const relation = this.database.prepare(`
        SELECT 1
        FROM task_relations
        WHERE source_task_id = ? OR target_task_id = ?
        LIMIT 1
      `).get(current.id, current.id);
      if (relation) {
        throw new ApiError(
          409,
          "CROSS_PROJECT_RELATION",
          "Remove issue relations before moving the issue to another project"
        );
      }
      if (this.hasAiChatThreadProjectConflict(current.id, targetProject.id)) {
        throw new ApiError(
          409,
          "AI_CHAT_PROJECT_MOVE_BLOCKED",
          "Delete issue-linked AI conversations before moving the issue to another project"
        );
      }
    }
    const dueDate = Object.hasOwn(changes, "dueDate") ? changes.dueDate : current.dueDate;
    const recurrence = Object.hasOwn(changes, "recurrence") ? changes.recurrence : current.recurrence;
    if (recurrence && !dueDate) {
      throw new ApiError(400, "INVALID_FIELD", "A recurring issue requires a due date");
    }
    const columns = {
      projectId: "project_id",
      title: "title",
      description: "description",
      status: "status",
      priority: "priority",
      labels: "labels",
      startDate: "start_date",
      dueDate: "due_date"
    };
    const assignments = [];
    const values = [];
    for (const [key, value] of Object.entries(changes)) {
      if (key === "developmentContext") {
        assignments.push("git_branch = ?", "worktree_path = ?", "worktree_branch = ?");
        values.push(
          value?.type === "branch" ? value.branch : null,
          value?.type === "worktree" ? value.path : null,
          value?.type === "worktree" ? value.branch : null
        );
        continue;
      }
      if (key === "recurrence") {
        assignments.push("recurrence_interval = ?", "recurrence_unit = ?");
        values.push(value?.interval ?? null, value?.unit ?? null);
        continue;
      }
      if (key === "assignee") {
        assignments.push(
          "assignee_type = ?",
          "assignee_id = ?",
          "assignee_name = ?",
          "assignee_avatar_url = ?"
        );
        values.push(value.type, value.id, value.name, value.avatarUrl);
        continue;
      }
      assignments.push(`${columns[key]} = ?`);
      values.push(key === "labels" ? JSON.stringify(value) : value);
    }
    if (Object.hasOwn(changes, "status") && changes.status !== current.status) {
      const placementProjectId = projectChanged ? targetProject.id : current.projectId;
      const row = this.database.prepare(`
        SELECT MIN(sort_order) AS minimum
        FROM tasks
        WHERE project_id = ? AND status = ? AND archived_at IS NULL AND id != ?
      `).get(placementProjectId, changes.status, current.id);
      assignments.push("sort_order = ?");
      values.push(row.minimum === null ? 1e3 : row.minimum - 1e3);
    }
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    if (storedBinding && !Object.hasOwn(changes, "projectId")) {
      assignments.push(
        "thread_id = ?",
        "thread_codex_project_id = ?",
        "thread_codex_project_kind = ?",
        "thread_codex_host_id = ?",
        "thread_workspace_path = ?"
      );
      values.push(...storedBinding);
    }
    assignments.push("version = version + 1", "updated_at = ?");
    const timestamp = now();
    values.push(timestamp, current.id, version);
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks SET ${assignments.join(", ")} WHERE id = ? AND version = ?
      `).run(...values);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      if (projectChanged) {
        this.database.prepare(`
          UPDATE projects SET updated_at = ? WHERE id IN (?, ?)
        `).run(timestamp, current.projectId, targetProject.id);
      }
      const destinationProjectId = projectChanged ? targetProject.id : current.projectId;
      const destinationProject = this.database.prepare(`
        SELECT labels FROM projects WHERE id = ?
      `).get(destinationProjectId);
      const taskLabels = Object.hasOwn(changes, "labels") ? changes.labels : current.labels;
      const projectLabels = JSON.parse(destinationProject.labels);
      const mergedLabels = [.../* @__PURE__ */ new Set([...projectLabels, ...taskLabels])];
      if (mergedLabels.length !== projectLabels.length) {
        this.database.prepare(`
          UPDATE projects SET labels = ?, updated_at = ? WHERE id = ?
        `).run(JSON.stringify(mergedLabels), timestamp, destinationProjectId);
      }
      this.#recordTaskActivity(current.id, actor, activityChanges, timestamp);
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getTask(current.id);
  }
  moveTask(id, version, status, sortOrder, threadId, threadBinding, actor) {
    const current = this.#requireTask(id);
    this.#requireVersion(current, version);
    if (current.archivedAt !== null) {
      throw new ApiError(409, "TASK_ARCHIVED", "Archived tasks cannot be moved");
    }
    if (status !== current.status && sortOrder === void 0) {
      const row = this.database.prepare(`
        SELECT MIN(sort_order) AS minimum
        FROM tasks
        WHERE project_id = ? AND status = ? AND archived_at IS NULL AND id != ?
      `).get(current.projectId, status, current.id);
      sortOrder = row.minimum === null ? 1e3 : row.minimum - 1e3;
    } else if (sortOrder === void 0) {
      const row = this.database.prepare(`
        SELECT COALESCE(MAX(sort_order), 0) AS maximum
        FROM tasks
        WHERE project_id = ? AND status = ? AND archived_at IS NULL AND id != ?
      `).get(current.projectId, status, current.id);
      sortOrder = row.maximum + 1e3;
    }
    const timestamp = now();
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    const threadAssignment = storedBinding ? `thread_id = ?, thread_codex_project_id = ?, thread_codex_project_kind = ?,
        thread_codex_host_id = ?, thread_workspace_path = ?,` : "";
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks
        SET status = ?, sort_order = ?, ${threadAssignment} version = version + 1, updated_at = ?
        WHERE id = ? AND version = ?
      `).run(status, sortOrder, ...storedBinding ?? [], timestamp, current.id, version);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      this.#recordTaskActivity(
        current.id,
        actor,
        taskFieldChanges(current, { status }),
        timestamp
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getTask(current.id);
  }
  archiveTask(id, version, threadId, threadBinding, actor) {
    const current = this.#requireTask(id);
    this.#requireVersion(current, version);
    const timestamp = now();
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    const threadAssignment = storedBinding ? `thread_id = ?, thread_codex_project_id = ?, thread_codex_project_kind = ?,
        thread_codex_host_id = ?, thread_workspace_path = ?,` : "";
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks
        SET archived_at = ?, ${threadAssignment} version = version + 1, updated_at = ?
        WHERE id = ? AND version = ?
      `).run(timestamp, ...storedBinding ?? [], timestamp, current.id, version);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      this.#recordTaskActivity(
        current.id,
        actor,
        [{ field: "archivedAt", before: current.archivedAt, after: timestamp }],
        timestamp
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getTask(current.id);
  }
  restoreTask(id, version, threadId, threadBinding, actor) {
    const current = this.#requireTask(id);
    this.#requireVersion(current, version);
    if (current.archivedAt === null) {
      throw new ApiError(409, "TASK_NOT_ARCHIVED", "Only archived tasks can be restored");
    }
    const timestamp = now();
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    const threadAssignment = storedBinding ? `thread_id = ?, thread_codex_project_id = ?, thread_codex_project_kind = ?,
        thread_codex_host_id = ?, thread_workspace_path = ?,` : "";
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = this.database.prepare(`
        UPDATE tasks
        SET archived_at = NULL, ${threadAssignment} version = version + 1, updated_at = ?
        WHERE id = ? AND version = ?
      `).run(...storedBinding ?? [], timestamp, current.id, version);
      if (result.changes !== 1) {
        this.#throwMissingOrConflict(id, version);
      }
      this.#recordTaskActivity(
        current.id,
        actor,
        [{ field: "archivedAt", before: current.archivedAt, after: null }],
        timestamp
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getTask(current.id);
  }
  deleteArchivedTask(id, version) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const current = this.#requireTask(id);
      this.#requireVersion(current, version);
      if (current.archivedAt === null) {
        throw new ApiError(409, "TASK_NOT_ARCHIVED", "Only archived tasks can be deleted");
      }
      const attachmentIds = this.database.prepare(
        "SELECT id FROM attachments WHERE task_id = ? ORDER BY created_at, id"
      ).all(current.id).map((attachment) => attachment.id);
      const result = this.database.prepare(
        "DELETE FROM tasks WHERE id = ? AND version = ? AND archived_at IS NOT NULL"
      ).run(current.id, version);
      if (result.changes !== 1) this.#throwMissingOrConflict(id, version);
      this.database.exec("COMMIT");
      return { task: current, attachmentIds };
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  addTaskRelation(id, version, type, relatedId, threadId, threadBinding, actor, origin = "manual") {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const task = this.#requireTask(id);
      const relatedTask = this.#requireTask(relatedId);
      this.#requireVersion(task, version);
      this.#validateRelationTasks(task, relatedTask);
      const { relationType, sourceTaskId, targetTaskId } = this.#relationEndpoints(
        type,
        task.id,
        relatedTask.id
      );
      if (relationType === "parent") {
        this.#assertNoParentCycle(task.id, relatedTask.id);
        const existing = this.database.prepare(`
          SELECT source_task_id
          FROM task_relations
          WHERE relation_type = 'parent' AND target_task_id = ?
        `).get(task.id);
        if (existing?.source_task_id === relatedTask.id) {
          throw new ApiError(409, "RELATION_EXISTS", "This parent relation already exists");
        }
        if (existing) {
          this.database.prepare(`
            DELETE FROM task_relations
            WHERE relation_type = 'parent' AND target_task_id = ?
          `).run(task.id);
        }
      } else {
        const existing = this.database.prepare(`
          SELECT 1
          FROM task_relations
          WHERE relation_type = ? AND source_task_id = ? AND target_task_id = ?
        `).get(relationType, sourceTaskId, targetTaskId);
        if (existing) {
          throw new ApiError(409, "RELATION_EXISTS", "This issue relation already exists");
        }
      }
      const timestamp = now();
      const previousRelation = type === "parent" && task.relations.parent ? relationActivityValue(type, task.relations.parent) : null;
      this.database.prepare(`
        INSERT INTO task_relations (
          relation_type, source_task_id, target_task_id, origin, created_at
        ) VALUES (?, ?, ?, ?, ?)
      `).run(relationType, sourceTaskId, targetTaskId, origin, timestamp);
      this.#touchTask(task.id, version, threadId, threadBinding, timestamp);
      this.#recordTaskActivity(task.id, actor, [{
        field: "relation",
        before: previousRelation,
        after: relationActivityValue(type, relatedTask)
      }], timestamp);
      this.database.exec("COMMIT");
      return {
        task: this.getTask(task.id),
        relatedTask: this.getTask(relatedTask.id)
      };
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  removeTaskRelation(id, version, type, relatedId, threadId, threadBinding, actor, origin) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const task = this.#requireTask(id);
      const relatedTask = this.#requireTask(relatedId);
      this.#requireVersion(task, version);
      this.#validateRelationTasks(task, relatedTask);
      const { relationType, sourceTaskId, targetTaskId } = this.#relationEndpoints(
        type,
        task.id,
        relatedTask.id
      );
      const relation = this.database.prepare(`
        SELECT origin
        FROM task_relations
        WHERE relation_type = ? AND source_task_id = ? AND target_task_id = ?
      `).get(relationType, sourceTaskId, targetTaskId);
      if (!relation) {
        throw new ApiError(404, "RELATION_NOT_FOUND", "This issue relation does not exist");
      }
      if (origin && relation.origin !== origin) {
        this.database.exec("COMMIT");
        return {
          task: this.getTask(task.id),
          relatedTask: this.getTask(relatedTask.id)
        };
      }
      let deleted;
      if (origin === "mention" && relationType === "related") {
        const taskReference = `](?${new URLSearchParams({
          project: task.projectId,
          issue: relatedTask.identifier
        })})`;
        const relatedTaskReference = `](?${new URLSearchParams({
          project: task.projectId,
          issue: task.identifier
        })})`;
        deleted = this.database.prepare(`
          DELETE FROM task_relations
          WHERE relation_type = ? AND source_task_id = ? AND target_task_id = ?
            AND origin = 'mention'
            AND NOT EXISTS (
              SELECT 1
              FROM tasks
              WHERE (id = ? AND instr(description, ?) > 0)
                OR (id = ? AND instr(description, ?) > 0)
            )
            AND NOT EXISTS (
              SELECT 1
              FROM comments
              WHERE (task_id = ? AND instr(body, ?) > 0)
                OR (task_id = ? AND instr(body, ?) > 0)
            )
        `).run(
          relationType,
          sourceTaskId,
          targetTaskId,
          task.id,
          taskReference,
          relatedTask.id,
          relatedTaskReference,
          task.id,
          taskReference,
          relatedTask.id,
          relatedTaskReference
        );
      } else {
        deleted = this.database.prepare(`
          DELETE FROM task_relations
          WHERE relation_type = ? AND source_task_id = ? AND target_task_id = ?
        `).run(relationType, sourceTaskId, targetTaskId);
      }
      if (origin === "mention" && relationType === "related" && deleted.changes === 0) {
        this.database.exec("COMMIT");
        return {
          task: this.getTask(task.id),
          relatedTask: this.getTask(relatedTask.id)
        };
      }
      const timestamp = now();
      this.#touchTask(task.id, version, threadId, threadBinding, timestamp);
      this.#recordTaskActivity(task.id, actor, [{
        field: "relation",
        before: relationActivityValue(type, relatedTask),
        after: null
      }], timestamp);
      this.database.exec("COMMIT");
      return {
        task: this.getTask(task.id),
        relatedTask: this.getTask(relatedTask.id)
      };
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  listTaskActivities(taskId) {
    const task = this.#requireTask(taskId);
    return this.database.prepare(`
      SELECT * FROM task_activities
      WHERE task_id = ?
      ORDER BY created_at, id
    `).all(task.id).map(taskActivityFromRow);
  }
  listComments(taskId) {
    const task = this.#requireTask(taskId);
    return this.database.prepare(`
      SELECT * FROM comments
      WHERE task_id = ?
      ORDER BY created_at, id
    `).all(task.id).map((row) => this.#commentWithAttachments(row));
  }
  listCommentsAfter(taskId, after) {
    const task = this.#requireTask(taskId);
    return this.database.prepare(`
      SELECT * FROM comments
      WHERE task_id = ?
        AND change_revision > ?
      ORDER BY change_revision
    `).all(task.id, after.revision).map((row) => this.#commentWithAttachments(row));
  }
  createComment(taskId, input) {
    const id = randomUUID();
    const timestamp = now();
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const task = this.#requireTask(taskId);
      const changeRevision = this.#nextCommentAttachmentRevision();
      this.database.prepare(`
        INSERT INTO comments (
          id, task_id, body, thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path,
          author_type, author_id, author_name, author_avatar_url,
          version, created_at, updated_at, change_revision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
      `).run(
        id,
        task.id,
        input.body,
        ...storedThreadBinding(input.threadBinding, input.threadId) ?? [null, null, null, null, null],
        input.actor.type,
        input.actor.id,
        input.actor.name,
        input.actor.avatarUrl,
        timestamp,
        timestamp,
        changeRevision
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getComment(id);
  }
  getComment(id) {
    const row = this.database.prepare("SELECT * FROM comments WHERE id = ?").get(id);
    return row ? this.#commentWithAttachments(row) : null;
  }
  updateComment(id, version, body, threadId, threadBinding) {
    const storedBinding = storedThreadBinding(threadBinding, threadId);
    const threadAssignment = storedBinding ? `thread_id = ?, thread_codex_project_id = ?, thread_codex_project_kind = ?,
        thread_codex_host_id = ?, thread_workspace_path = ?,` : "";
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const current = this.#requireComment(id);
      this.#requireCommentVersion(current, version);
      const changeRevision = this.#nextCommentAttachmentRevision();
      const result = this.database.prepare(`
        UPDATE comments
        SET body = ?, ${threadAssignment} version = version + 1, updated_at = ?,
          change_revision = ?
        WHERE id = ? AND version = ?
      `).run(body, ...storedBinding ?? [], now(), changeRevision, id, version);
      if (result.changes !== 1) {
        this.#throwMissingCommentOrConflict(id, version);
      }
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getComment(id);
  }
  deleteComment(id, version) {
    const current = this.#requireComment(id);
    this.#requireCommentVersion(current, version);
    const result = this.database.prepare(`
      DELETE FROM comments WHERE id = ? AND version = ?
    `).run(id, version);
    if (result.changes !== 1) {
      this.#throwMissingCommentOrConflict(id, version);
    }
    return current;
  }
  listAttachments(taskId, after = null) {
    const task = this.#requireTask(taskId);
    if (after) {
      return this.database.prepare(`
        SELECT * FROM attachments
        WHERE task_id = ? AND comment_id IS NULL
          AND change_revision > ?
        ORDER BY change_revision
      `).all(task.id, after.revision).map(attachmentFromRow);
    }
    return this.database.prepare(`
      SELECT * FROM attachments
      WHERE task_id = ? AND comment_id IS NULL
      ORDER BY created_at, id
    `).all(task.id).map(attachmentFromRow);
  }
  createAttachment(taskId, input) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const task = this.#requireTask(taskId);
      const changeRevision = this.#nextCommentAttachmentRevision();
      this.database.prepare(`
        INSERT INTO attachments (
          id, task_id, comment_id, kind, filename, content_type, size, created_at, change_revision
        ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?)
      `).run(
        input.id,
        task.id,
        input.kind,
        input.filename,
        input.contentType,
        input.size,
        now(),
        changeRevision
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getAttachment(input.id);
  }
  listCommentAttachments(commentId, after = null) {
    const comment = this.database.prepare("SELECT id FROM comments WHERE id = ?").get(commentId);
    if (!comment) {
      throw new ApiError(404, "COMMENT_NOT_FOUND", `Comment '${commentId}' does not exist`);
    }
    return this.#attachmentsForComment(commentId, after);
  }
  createCommentAttachment(commentId, input) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const comment = this.#requireComment(commentId);
      const changeRevision = this.#nextCommentAttachmentRevision();
      this.database.prepare(`
        INSERT INTO attachments (
          id, task_id, comment_id, kind, filename, content_type, size, created_at, change_revision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        input.id,
        comment.taskId,
        comment.id,
        input.kind,
        input.filename,
        input.contentType,
        input.size,
        now(),
        changeRevision
      );
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
    return this.getAttachment(input.id);
  }
  getAttachment(id) {
    const row = this.database.prepare("SELECT * FROM attachments WHERE id = ?").get(id);
    return row ? attachmentFromRow(row) : null;
  }
  deleteAttachment(id) {
    const attachment = this.getAttachment(id);
    if (!attachment) {
      throw new ApiError(404, "ATTACHMENT_NOT_FOUND", `Attachment '${id}' does not exist`);
    }
    this.database.prepare("DELETE FROM attachments WHERE id = ?").run(id);
    return attachment;
  }
  #commentWithAttachments(row) {
    const comment = commentFromRow(row);
    comment.attachments = this.#attachmentsForComment(comment.id);
    return comment;
  }
  #aiChatThreadWithCurrentRun(row) {
    const thread = aiChatThreadFromRow(row);
    const currentRun = this.database.prepare(`
      SELECT * FROM ai_chat_runs
      WHERE thread_id = ? AND status = 'running'
      ORDER BY started_at DESC, id DESC
      LIMIT 1
    `).get(thread.id);
    thread.currentRun = currentRun ? aiChatRunFromRow(currentRun) : null;
    const todoRows = this.database.prepare(`
      SELECT id, thread_id, run_id, data, created_at
      FROM ai_chat_events
      WHERE thread_id = ? AND type = 'todo_list'
      ORDER BY created_at DESC, rowid DESC
    `).all(thread.id);
    thread.latestTodo = todoRows.filter((row2) => !thread.currentRun || row2.run_id === thread.currentRun.id).map(parseAiChatTodoProgress).find(Boolean) ?? null;
    return thread;
  }
  #commentsForTaskActivity(taskIds) {
    const commentsByTask = new Map(taskIds.map((taskId) => [taskId, []]));
    for (let offset = 0; offset < taskIds.length; offset += 400) {
      const chunk = taskIds.slice(offset, offset + 400);
      if (chunk.length === 0) continue;
      const placeholders = chunk.map(() => "?").join(", ");
      const rows = this.database.prepare(`
        SELECT
          id, task_id,
          CASE WHEN thread_id IS NULL THEN NULL ELSE substr(body, 1, 512) END AS body,
          thread_id, thread_codex_project_id, thread_codex_project_kind,
          thread_codex_host_id, thread_workspace_path,
          author_type, author_id, author_name,
          author_avatar_url, version, updated_at
        FROM comments
        WHERE task_id IN (${placeholders})
        ORDER BY task_id, id
      `).all(...chunk);
      for (const row of rows) commentsByTask.get(row.task_id)?.push(row);
    }
    return commentsByTask;
  }
  #activitiesForTasks(taskIds) {
    const activitiesByTask = new Map(taskIds.map((taskId) => [taskId, []]));
    for (let offset = 0; offset < taskIds.length; offset += 400) {
      const chunk = taskIds.slice(offset, offset + 400);
      if (chunk.length === 0) continue;
      const placeholders = chunk.map(() => "?").join(", ");
      const rows = this.database.prepare(`
        SELECT
          id, task_id, actor_type, actor_id, actor_name, actor_avatar_url, created_at
        FROM task_activities
        WHERE task_id IN (${placeholders})
        ORDER BY task_id, created_at, id
      `).all(...chunk);
      for (const row of rows) activitiesByTask.get(row.task_id)?.push(row);
    }
    return activitiesByTask;
  }
  #taskPreviewImages(taskIds) {
    const imagesByTask = /* @__PURE__ */ new Map();
    for (let offset = 0; offset < taskIds.length; offset += 400) {
      const chunk = taskIds.slice(offset, offset + 400);
      if (chunk.length === 0) continue;
      const placeholders = chunk.map(() => "?").join(", ");
      const rows = this.database.prepare(`
        SELECT attachments.*
        FROM attachments
        JOIN tasks ON tasks.id = attachments.task_id
        WHERE attachments.task_id IN (${placeholders})
          AND attachments.comment_id IS NULL
          AND attachments.content_type LIKE 'image/%'
          AND instr(tasks.description, 'api/attachments/' || attachments.id || '/content') > 0
        ORDER BY attachments.task_id, attachments.created_at, attachments.id
      `).all(...chunk);
      for (const row of rows) {
        if (!imagesByTask.has(row.task_id)) imagesByTask.set(row.task_id, attachmentFromRow(row));
      }
    }
    return imagesByTask;
  }
  #attachmentsForComment(commentId, after = null) {
    if (after) {
      return this.database.prepare(`
        SELECT * FROM attachments
        WHERE comment_id = ?
          AND change_revision > ?
        ORDER BY change_revision
      `).all(commentId, after.revision).map(attachmentFromRow);
    }
    return this.database.prepare(`
      SELECT * FROM attachments
      WHERE comment_id = ?
      ORDER BY created_at, id
    `).all(commentId).map(attachmentFromRow);
  }
  #nextCommentAttachmentRevision() {
    return this.database.prepare(`
      UPDATE comment_attachment_revision
      SET value = value + 1
      WHERE id = 1
      RETURNING value
    `).get().value;
  }
  #taskWithRelations(row) {
    const task = taskFromRow(row);
    const parent = this.database.prepare(`
      SELECT tasks.*
      FROM task_relations
      JOIN tasks ON tasks.id = task_relations.source_task_id
      WHERE task_relations.relation_type = 'parent'
        AND task_relations.target_task_id = ?
    `).get(task.id);
    const subIssues = this.database.prepare(`
      SELECT tasks.*
      FROM task_relations
      JOIN tasks ON tasks.id = task_relations.target_task_id
      WHERE task_relations.relation_type = 'parent'
        AND task_relations.source_task_id = ?
      ORDER BY tasks.sort_order, tasks.created_at, tasks.id
    `).all(task.id);
    const blockedBy = this.database.prepare(`
      SELECT tasks.*
      FROM task_relations
      JOIN tasks ON tasks.id = task_relations.source_task_id
      WHERE task_relations.relation_type = 'blocks'
        AND task_relations.target_task_id = ?
      ORDER BY tasks.sort_order, tasks.created_at, tasks.id
    `).all(task.id);
    const blocks = this.database.prepare(`
      SELECT tasks.*
      FROM task_relations
      JOIN tasks ON tasks.id = task_relations.target_task_id
      WHERE task_relations.relation_type = 'blocks'
        AND task_relations.source_task_id = ?
      ORDER BY tasks.sort_order, tasks.created_at, tasks.id
    `).all(task.id);
    const related = this.database.prepare(`
      SELECT tasks.*
      FROM task_relations
      JOIN tasks ON tasks.id = CASE
        WHEN task_relations.source_task_id = ? THEN task_relations.target_task_id
        ELSE task_relations.source_task_id
      END
      WHERE task_relations.relation_type = 'related'
        AND (
          task_relations.source_task_id = ?
          OR task_relations.target_task_id = ?
        )
      ORDER BY tasks.sort_order, tasks.created_at, tasks.id
    `).all(task.id, task.id, task.id);
    task.relations = {
      parent: parent ? taskRelationSummaryFromRow(parent) : null,
      subIssues: subIssues.map(taskRelationSummaryFromRow),
      blockedBy: blockedBy.map(taskRelationSummaryFromRow),
      blocks: blocks.map(taskRelationSummaryFromRow),
      related: related.map(taskRelationSummaryFromRow)
    };
    return task;
  }
  #validateRelationTasks(task, relatedTask) {
    if (task.id === relatedTask.id) {
      throw new ApiError(400, "SELF_RELATION", "An issue cannot be related to itself");
    }
    if (task.projectId !== relatedTask.projectId) {
      throw new ApiError(400, "CROSS_PROJECT_RELATION", "Issue relations must stay within one project");
    }
  }
  #relationEndpoints(type, taskId, relatedTaskId) {
    if (type === "parent") {
      return {
        relationType: "parent",
        sourceTaskId: relatedTaskId,
        targetTaskId: taskId
      };
    }
    if (type === "blocks") {
      return {
        relationType: "blocks",
        sourceTaskId: taskId,
        targetTaskId: relatedTaskId
      };
    }
    if (type === "blocked_by") {
      return {
        relationType: "blocks",
        sourceTaskId: relatedTaskId,
        targetTaskId: taskId
      };
    }
    const [sourceTaskId, targetTaskId] = [taskId, relatedTaskId].sort();
    return { relationType: "related", sourceTaskId, targetTaskId };
  }
  #assertNoParentCycle(childId, parentId) {
    const cycle = this.database.prepare(`
      WITH RECURSIVE ancestors(id) AS (
        SELECT source_task_id
        FROM task_relations
        WHERE relation_type = 'parent' AND target_task_id = ?
        UNION
        SELECT task_relations.source_task_id
        FROM task_relations
        JOIN ancestors ON task_relations.target_task_id = ancestors.id
        WHERE task_relations.relation_type = 'parent'
      )
      SELECT 1 FROM ancestors WHERE id = ?
    `).get(parentId, childId);
    if (cycle) {
      throw new ApiError(409, "RELATION_CYCLE", "This parent would create a cycle");
    }
  }
  #recordTaskActivity(taskId, actor, changes, timestamp) {
    if (changes.length === 0) return;
    this.database.prepare(`
      INSERT INTO task_activities (
        id, task_id, actor_type, actor_id, actor_name, actor_avatar_url, changes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      taskId,
      actor.type,
      actor.id,
      actor.name,
      actor.avatarUrl,
      JSON.stringify(changes),
      timestamp
    );
  }
  #touchTask(id, version, threadId, threadBinding, timestamp) {
    const current = this.#requireTask(id);
    const storedBinding = storedThreadBindingForExisting(current, threadBinding, threadId);
    const threadAssignment = storedBinding ? `thread_id = ?, thread_codex_project_id = ?, thread_codex_project_kind = ?,
        thread_codex_host_id = ?, thread_workspace_path = ?,` : "";
    const result = this.database.prepare(`
      UPDATE tasks
      SET ${threadAssignment} version = version + 1, updated_at = ?
      WHERE id = ? AND version = ?
    `).run(...storedBinding ?? [], timestamp, id, version);
    if (result.changes !== 1) {
      this.#throwMissingOrConflict(id, version);
    }
  }
  #requireTask(id) {
    const task = this.getTask(id);
    if (!task) {
      throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
    }
    return task;
  }
  #requireComment(id) {
    const comment = this.getComment(id);
    if (!comment) {
      throw new ApiError(404, "COMMENT_NOT_FOUND", `Comment '${id}' does not exist`);
    }
    return comment;
  }
  #requireVersion(task, expectedVersion) {
    if (task.version !== expectedVersion) {
      throw new ApiError(409, "VERSION_CONFLICT", "Task was changed by another client", {
        expectedVersion,
        actualVersion: task.version
      });
    }
  }
  #requireCommentVersion(comment, expectedVersion) {
    if (comment.version !== expectedVersion) {
      throw new ApiError(409, "VERSION_CONFLICT", "Comment was changed by another client", {
        expectedVersion,
        actualVersion: comment.version
      });
    }
  }
  #throwMissingOrConflict(id, expectedVersion) {
    const task = this.getTask(id);
    if (!task) {
      throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
    }
    throw new ApiError(409, "VERSION_CONFLICT", "Task was changed by another client", {
      expectedVersion,
      actualVersion: task.version
    });
  }
  #throwMissingCommentOrConflict(id, expectedVersion) {
    const comment = this.getComment(id);
    if (!comment) {
      throw new ApiError(404, "COMMENT_NOT_FOUND", `Comment '${id}' does not exist`);
    }
    throw new ApiError(409, "VERSION_CONFLICT", "Comment was changed by another client", {
      expectedVersion,
      actualVersion: comment.version
    });
  }
};

// server/ai-chat-catalog.mjs
import { execFile, spawn } from "node:child_process";
import { randomUUID as randomUUID2 } from "node:crypto";
import { readFile, readdir, realpath, stat } from "node:fs/promises";
import os2 from "node:os";
import path4 from "node:path";
import { promisify } from "node:util";

// node_modules/smol-toml/dist/date.js
var DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i;
var TomlDate = class _TomlDate extends Date {
  #hasDate = false;
  #hasTime = false;
  #offset = null;
  constructor(date) {
    let hasDate = true;
    let hasTime = true;
    let offset = "Z";
    if (typeof date === "string") {
      let match = date.match(DATE_TIME_RE);
      if (match) {
        if (!match[1]) {
          hasDate = false;
          date = `0000-01-01T${date}`;
        }
        hasTime = !!match[2];
        hasTime && date[10] === " " && (date = date.replace(" ", "T"));
        if (match[2] && +match[2] > 23) {
          date = "";
        } else {
          offset = match[3] || null;
          date = date.toUpperCase();
          if (!offset && hasTime)
            date += "Z";
        }
      } else {
        date = "";
      }
    }
    super(date);
    if (!isNaN(this.getTime())) {
      this.#hasDate = hasDate;
      this.#hasTime = hasTime;
      this.#offset = offset;
    }
  }
  isDateTime() {
    return this.#hasDate && this.#hasTime;
  }
  isLocal() {
    return !this.#hasDate || !this.#hasTime || !this.#offset;
  }
  isDate() {
    return this.#hasDate && !this.#hasTime;
  }
  isTime() {
    return this.#hasTime && !this.#hasDate;
  }
  isValid() {
    return this.#hasDate || this.#hasTime;
  }
  toISOString() {
    let iso = super.toISOString();
    if (this.isDate())
      return iso.slice(0, 10);
    if (this.isTime())
      return iso.slice(11, 23);
    if (this.#offset === null)
      return iso.slice(0, -1);
    if (this.#offset === "Z")
      return iso;
    let offset = +this.#offset.slice(1, 3) * 60 + +this.#offset.slice(4, 6);
    offset = this.#offset[0] === "-" ? offset : -offset;
    let offsetDate = new Date(this.getTime() - offset * 6e4);
    return offsetDate.toISOString().slice(0, -1) + this.#offset;
  }
  static wrapAsOffsetDateTime(jsDate, offset = "Z") {
    let date = new _TomlDate(jsDate);
    date.#offset = offset;
    return date;
  }
  static wrapAsLocalDateTime(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#offset = null;
    return date;
  }
  static wrapAsLocalDate(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#hasTime = false;
    date.#offset = null;
    return date;
  }
  static wrapAsLocalTime(jsDate) {
    let date = new _TomlDate(jsDate);
    date.#hasDate = false;
    date.#offset = null;
    return date;
  }
};

// node_modules/smol-toml/dist/error.js
function getLineColFromPtr(string, ptr) {
  let lines = string.slice(0, ptr).split(/\r\n|\n|\r/g);
  return [lines.length, lines.pop().length + 1];
}
function makeCodeBlock(string, line, column) {
  let lines = string.split(/\r\n|\n|\r/g);
  let codeblock = "";
  let numberLen = (Math.log10(line + 1) | 0) + 1;
  for (let i = line - 1; i <= line + 1; i++) {
    let l = lines[i - 1];
    if (!l)
      continue;
    codeblock += i.toString().padEnd(numberLen, " ");
    codeblock += ":  ";
    codeblock += l;
    codeblock += "\n";
    if (i === line) {
      codeblock += " ".repeat(numberLen + column + 2);
      codeblock += "^\n";
    }
  }
  return codeblock;
}
var TomlError = class extends Error {
  line;
  column;
  codeblock;
  constructor(message, options) {
    const [line, column] = getLineColFromPtr(options.toml, options.ptr);
    const codeblock = makeCodeBlock(options.toml, line, column);
    super(`Invalid TOML document: ${message}

${codeblock}`, options);
    this.line = line;
    this.column = column;
    this.codeblock = codeblock;
  }
};

// node_modules/smol-toml/dist/util.js
function indexOfNewline(str, start = 0) {
  let idx = str.indexOf("\n", start);
  if (str.charCodeAt(idx - 1) === 13)
    idx--;
  return idx;
}
function skipComment(ctx) {
  for (; ctx.p < ctx.s.length; ctx.p++) {
    let c = ctx.s.charCodeAt(ctx.p);
    if (c === 10)
      break;
    if (c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10) {
      ctx.p++;
      break;
    }
    if (c < 32 && c !== 9 || c === 127) {
      throw new TomlError("control characters are not allowed in comments", {
        toml: ctx.s,
        ptr: ctx.p
      });
    }
  }
}
function skipVoid(ctx, banNewLines, banComments) {
  let c;
  while (1) {
    while ((c = ctx.s.charCodeAt(ctx.p)) === 32 || c === 9 || !banNewLines && (c === 10 || c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10))
      ctx.p++;
    if (banComments || c !== 35)
      break;
    skipComment(ctx);
  }
}
function skipUntil(ctx, sep, end) {
  let ptr = ctx.p;
  if (!end) {
    ptr = indexOfNewline(ctx.s, ptr);
    ctx.p = ptr < 0 ? ctx.s.length : ptr;
    return;
  }
  for (; ctx.p < ctx.s.length; ctx.p++) {
    let c = ctx.s.charCodeAt(ctx.p);
    if (c === 35) {
      skipComment(ctx);
    } else if (c === end || c === sep) {
      return;
    }
  }
  throw new TomlError("cannot find end of structure", {
    toml: ctx.s,
    ptr
  });
}

// node_modules/smol-toml/dist/primitive.js
var INT_REGEX = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
var FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
var LEADING_ZERO = /^[+-]?0[0-9_]/;
function parseString(ctx) {
  let start = ctx.p;
  let c = ctx.s.charCodeAt(ctx.p++);
  let first = c;
  let isLiteral = c === 39;
  let isMultiline = c === ctx.s.charCodeAt(ctx.p) && c === ctx.s.charCodeAt(ctx.p + 1);
  if (isMultiline) {
    if ((c = ctx.s.charCodeAt(ctx.p += 2)) === 10)
      ctx.p++;
    else if (c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10)
      ctx.p += 2;
  }
  let parsed = "";
  let sliceStart = ctx.p;
  let state = 0;
  for (; ctx.p < ctx.s.length; ctx.p++) {
    c = ctx.s.charCodeAt(ctx.p);
    if (isMultiline && (c === 10 || c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10)) {
      state = state && 3;
    } else if (c < 32 && c !== 9 || c === 127) {
      throw new TomlError("control characters are not allowed in strings", {
        toml: ctx.s,
        ptr: ctx.p
      });
    } else if ((!state || state === 3) && c === first && (!isMultiline || ctx.s.charCodeAt(ctx.p + 1) === first && ctx.s.charCodeAt(ctx.p + 2) === first)) {
      if (isMultiline) {
        if (ctx.s.charCodeAt(ctx.p + 3) === first)
          ctx.p++;
        if (ctx.s.charCodeAt(ctx.p + 3) === first)
          ctx.p++;
      }
      if (!state)
        parsed += ctx.s.slice(sliceStart, ctx.p);
      ctx.p += isMultiline ? 3 : 1;
      return parsed;
    } else if (!state) {
      if (!isLiteral && c === 92) {
        parsed += ctx.s.slice(sliceStart, sliceStart = ctx.p);
        state = 1;
      }
    } else if (state === 1) {
      if (c === 120 || c === 117 || c === 85) {
        let value = 0;
        let len = c === 120 ? 2 : c === 117 ? 4 : 8;
        for (let j = 0; j < len; j++, ctx.p++) {
          let hex = ctx.s.charCodeAt(ctx.p + 1);
          let digit = (
            /* 0-9 */
            hex >= 48 && hex <= 57 ? hex - 48 : (
              /* A-F */
              hex >= 65 && hex <= 70 ? hex - 65 + 10 : (
                /* a-f */
                hex >= 97 && hex <= 102 ? hex - 97 + 10 : -1
              )
            )
          );
          if (digit < 0)
            throw new TomlError("invalid non-hex character in unicode escape", { toml: ctx.s, ptr: ctx.p + 1 });
          value = value << 4 | digit;
        }
        if (value < 0 || value > 1114111 || value >= 55296 && value <= 57343) {
          throw new TomlError("invalid unicode escape", { toml: ctx.s, ptr: ctx.p });
        }
        parsed += String.fromCodePoint(value);
        sliceStart = ctx.p + 1;
        state = 0;
      } else if (c === 32 || c === 9) {
        state = 2;
      } else {
        if (c === 98)
          parsed += "\b";
        else if (c === 116)
          parsed += "	";
        else if (c === 110)
          parsed += "\n";
        else if (c === 102)
          parsed += "\f";
        else if (c === 114)
          parsed += "\r";
        else if (c === 101)
          parsed += "\x1B";
        else if (c === 34)
          parsed += '"';
        else if (c === 92)
          parsed += "\\";
        else
          throw new TomlError("unrecognized escape sequence", { toml: ctx.s, ptr: ctx.p });
        sliceStart = ctx.p + 1;
        state = 0;
      }
    } else if (c !== 32 && c !== 9) {
      if (state === 2) {
        throw new TomlError("invalid escape: only line-ending whitespace may be escaped", {
          toml: ctx.s,
          ptr: sliceStart
        });
      }
      state = !isLiteral && c === 92 ? 1 : 0;
      sliceStart = ctx.p;
    }
  }
  throw new TomlError("unfinished string", { toml: ctx.s, ptr: start });
}
function sliceAndTrimEndOf(ctx, start, end) {
  let value = ctx.s.slice(start, end);
  let commentIdx = value.indexOf("#");
  if (commentIdx > 0) {
    skipComment({ s: value, p: commentIdx, d: 0 });
    value = value.slice(0, commentIdx);
  }
  return value.trimEnd();
}
function parseValue(ctx, integersAsBigInt, end) {
  let ptr = ctx.p;
  let err = { toml: ctx.s, ptr };
  skipUntil(ctx, 44, end);
  let value = sliceAndTrimEndOf(ctx, ptr, ctx.p);
  if (!value)
    throw new TomlError("incomplete declaration: value expected", err);
  if (value === "-inf")
    return -Infinity;
  if (value === "inf" || value === "+inf")
    return Infinity;
  if (value === "nan" || value === "+nan" || value === "-nan")
    return NaN;
  if (value === "-0")
    return integersAsBigInt ? 0n : 0;
  let isInt = INT_REGEX.test(value);
  if (isInt || FLOAT_REGEX.test(value)) {
    if (LEADING_ZERO.test(value)) {
      throw new TomlError("leading zeroes are not allowed", err);
    }
    value = value.replace(/_/g, "");
    let numeric = +value;
    if (isNaN(numeric)) {
      throw new TomlError("invalid number", err);
    }
    if (isInt) {
      if ((isInt = !Number.isSafeInteger(numeric)) && !integersAsBigInt) {
        throw new TomlError("integer value cannot be represented losslessly", err);
      }
      if (isInt || integersAsBigInt === true)
        numeric = BigInt(value);
    }
    return numeric;
  }
  const date = new TomlDate(value);
  if (!date.isValid())
    throw new TomlError("invalid value", err);
  return date;
}

// node_modules/smol-toml/dist/extract.js
function extractValue(ctx, end, integersAsBigInt) {
  let ptr = ctx.p;
  let c = ctx.s.charCodeAt(ptr);
  if (c === 91 || c === 123) {
    if (!ctx.d--) {
      throw new TomlError("document contains excessively nested structures. aborting.", {
        toml: ctx.s,
        ptr
      });
    }
    let value = c === 91 ? parseArray(ctx, integersAsBigInt) : parseInlineTable(ctx, integersAsBigInt);
    ctx.d++;
    return value;
  }
  if (c === 34 || c === 39) {
    return parseString(ctx);
  }
  if (c === 116) {
    if (ctx.s.charCodeAt(++ctx.p) !== 114 || ctx.s.charCodeAt(++ctx.p) !== 117 || ctx.s.charCodeAt(++ctx.p) !== 101)
      throw new TomlError("invalid value", { toml: ctx.s, ptr });
    ctx.p++;
    return true;
  }
  if (c === 102) {
    if (ctx.s.charCodeAt(++ctx.p) !== 97 || ctx.s.charCodeAt(++ctx.p) !== 108 || ctx.s.charCodeAt(++ctx.p) !== 115 || ctx.s.charCodeAt(++ctx.p) !== 101)
      throw new TomlError("invalid value", { toml: ctx.s, ptr });
    ctx.p++;
    return false;
  }
  return parseValue(ctx, integersAsBigInt, end);
}

// node_modules/smol-toml/dist/struct.js
var KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
function parseKey(ctx, end = "=") {
  let start = ctx.p;
  let dot = start - 1;
  let parsed = [];
  let endPtr = ctx.s.indexOf(end, start);
  if (endPtr < 0) {
    throw new TomlError("incomplete key-value: cannot find end of key", {
      toml: ctx.s,
      ptr: start
    });
  }
  do {
    let c = ctx.s.charCodeAt(ctx.p = ++dot);
    if (c !== 32 && c !== 9) {
      if (c === 34 || c === 39) {
        if (c === ctx.s.charCodeAt(ctx.p + 1) && c === ctx.s.charCodeAt(ctx.p + 2)) {
          throw new TomlError("multiline strings are not allowed in keys", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        let part = parseString(ctx);
        dot = ctx.s.indexOf(".", ctx.p);
        let strEnd = ctx.s.slice(ctx.p, dot < 0 || dot > endPtr ? endPtr : dot);
        let newLine = indexOfNewline(strEnd);
        if (newLine > -1) {
          throw new TomlError("newlines are not allowed in keys", {
            toml: ctx.s,
            ptr: newLine
          });
        }
        if (strEnd.trimStart()) {
          throw new TomlError("found extra tokens after the string part", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        if (endPtr < ctx.p) {
          endPtr = ctx.s.indexOf(end, ctx.p);
          if (endPtr < 0) {
            throw new TomlError("incomplete key-value: cannot find end of key", {
              toml: ctx.s,
              ptr: start
            });
          }
        }
        parsed.push(part);
      } else {
        dot = ctx.s.indexOf(".", ctx.p);
        let part = ctx.s.slice(ctx.p, dot < 0 || dot > endPtr ? endPtr : dot);
        if (!KEY_PART_RE.test(part)) {
          throw new TomlError("only letter, numbers, dashes and underscores are allowed in keys", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        parsed.push(part.trimEnd());
      }
    }
  } while (dot + 1 && dot < endPtr);
  ctx.p = endPtr + 1;
  skipVoid(ctx, true, true);
  return parsed;
}
function parseInlineTable(ctx, integersAsBigInt) {
  let res = {};
  let seen = /* @__PURE__ */ new Set();
  let c;
  ctx.p++;
  while (ctx.p < ctx.s.length) {
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p)) === 125) {
      ctx.p++;
      return res;
    }
    let k;
    let t = res;
    let hasOwn = false;
    let p = ctx.p;
    let key = parseKey(ctx);
    for (let i = 0; i < key.length; i++) {
      if (i)
        t = hasOwn ? t[k] : t[k] = {};
      k = key[i];
      if ((hasOwn = Object.hasOwn(t, k)) && (typeof t[k] !== "object" || seen.has(t[k]))) {
        throw new TomlError("trying to redefine an already defined value", {
          toml: ctx.s,
          ptr: p
        });
      }
      if (!hasOwn && k === "__proto__") {
        Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
      }
    }
    if (hasOwn) {
      throw new TomlError("trying to redefine an already defined value", {
        toml: ctx.s,
        ptr: ctx.p
      });
    }
    let value = extractValue(ctx, 125, integersAsBigInt);
    seen.add(t[k] = value);
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p++)) === 125) {
      return res;
    }
    if (c !== 44) {
      throw new TomlError("expected comma or end of structure", { toml: ctx.s, ptr: ctx.p - 1 });
    }
  }
  throw new TomlError("unfinished table encountered", {
    toml: ctx.s,
    ptr: ctx.p
  });
}
function parseArray(ctx, integersAsBigInt) {
  let res = [];
  let c;
  ctx.p++;
  while (ctx.p < ctx.s.length) {
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p)) === 93) {
      ctx.p++;
      return res;
    }
    res.push(extractValue(ctx, 93, integersAsBigInt));
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p++)) === 93) {
      return res;
    }
    if (c !== 44) {
      throw new TomlError("expected comma or end of structure", { toml: ctx.s, ptr: ctx.p - 1 });
    }
  }
  throw new TomlError("unfinished array encountered", {
    toml: ctx.s,
    ptr: ctx.p
  });
}

// node_modules/smol-toml/dist/parse.js
function peekTable(key, table, meta, type) {
  let t = table;
  let m = meta;
  let k;
  let hasOwn = false;
  let state;
  for (let i = 0; i < key.length; i++) {
    if (i) {
      t = hasOwn ? t[k] : t[k] = {};
      m = (state = m[k]).c;
      if (type === 0 && (state.t === 1 || state.t === 2)) {
        return null;
      }
      if (state.t === 2) {
        let l = t.length - 1;
        t = t[l];
        m = m[l].c;
      }
    }
    k = key[i];
    if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 && m[k]?.d) {
      return null;
    }
    if (!hasOwn) {
      if (k === "__proto__") {
        Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
        Object.defineProperty(m, k, { enumerable: true, configurable: true, writable: true });
      }
      m[k] = {
        t: i < key.length - 1 && type === 2 ? 3 : type,
        d: false,
        i: 0,
        c: {}
      };
    }
  }
  state = m[k];
  if (state.t !== type && !(type === 1 && state.t === 3)) {
    return null;
  }
  if (type === 2) {
    if (!state.d) {
      state.d = true;
      t[k] = [];
    }
    t[k].push(t = {});
    state.c[state.i++] = state = { t: 1, d: false, i: 0, c: {} };
  }
  if (state.d) {
    return null;
  }
  state.d = true;
  if (type === 1) {
    t = hasOwn ? t[k] : t[k] = {};
  } else if (type === 0 && hasOwn) {
    return null;
  }
  return [k, t, state.c];
}
function parse(toml, { maxDepth = 1e3, integersAsBigInt } = {}) {
  let ctx = { s: toml, p: 0, d: maxDepth };
  let res = {};
  let meta = {};
  let tmp;
  let tbl = res;
  let m = meta;
  skipVoid(ctx);
  while (ctx.p < toml.length) {
    if (toml.charCodeAt(ctx.p) === 91) {
      let isTableArray = toml.charCodeAt(++ctx.p) === 91;
      tmp = ctx.p += +isTableArray;
      let k = parseKey(ctx, "]");
      if (isTableArray) {
        if (toml.charCodeAt(ctx.p - 1) !== 93) {
          throw new TomlError("expected end of table declaration", {
            toml,
            ptr: ctx.p - 1
          });
        }
        ctx.p++;
      }
      let p = peekTable(
        k,
        res,
        meta,
        isTableArray ? 2 : 1
        /* Type.EXPLICIT */
      );
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr: tmp
        });
      }
      m = p[2];
      tbl = p[1];
    } else {
      tmp = ctx.p;
      let k = parseKey(ctx);
      let p = peekTable(
        k,
        tbl,
        m,
        0
        /* Type.DOTTED */
      );
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr: tmp
        });
      }
      p[1][p[0]] = extractValue(ctx, void 0, integersAsBigInt);
    }
    skipVoid(ctx, true);
    if (ctx.p < toml.length && (tmp = toml.charCodeAt(ctx.p)) !== 10 && tmp !== 13) {
      throw new TomlError("each key-value declaration must be followed by an end-of-line", {
        toml,
        ptr: ctx.p
      });
    }
    skipVoid(ctx);
  }
  return res;
}

// shared/executable-command.mjs
import path3 from "node:path";
var NODE_SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".cjs", ".js", ".mjs"]);
function executableCommand(executable, args = []) {
  if (NODE_SCRIPT_EXTENSIONS.has(path3.extname(executable).toLowerCase())) {
    return {
      executable: process.execPath,
      args: [executable, ...args]
    };
  }
  return { executable, args };
}

// server/composer-reference.mjs
var REFERENCE_FORMAT = "taskboard.composer-reference.v1";
var REFERENCE_PREFIX = "taskboard://composer-reference/v1";
var REFERENCE_KINDS = /* @__PURE__ */ new Set(["skill", "agent"]);
function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  return value;
}
function encodeReferenceKey(stableId) {
  return Buffer.from(requiredString(stableId, "stableId"), "utf8").toString("base64url");
}
function decodeComposerReferenceKey(referenceKey) {
  const key = requiredString(referenceKey, "referenceKey");
  if (!/^[A-Za-z0-9_-]+$/.test(key)) {
    throw new TypeError("referenceKey must be unpadded base64url");
  }
  const decoded = Buffer.from(key, "base64url").toString("utf8");
  if (!decoded || encodeReferenceKey(decoded) !== key) {
    throw new TypeError("referenceKey is not canonical base64url UTF-8");
  }
  return decoded;
}
function assertReferenceKind(kind) {
  if (!REFERENCE_KINDS.has(kind)) {
    throw new TypeError("kind must be 'skill' or 'agent'");
  }
  return kind;
}
function escapedMarkdownLabel(label) {
  return requiredString(label, "label").replace(/[\\[\]]/g, "\\$&");
}
function composerReferencePersistence(kind, stableId, label) {
  const normalizedStableId = kind === "skill" ? requiredString(stableId, "stableId").normalize("NFC") : requiredString(stableId, "stableId");
  const referenceKey = encodeReferenceKey(normalizedStableId);
  const uri = `${REFERENCE_PREFIX}/${assertReferenceKind(kind)}/${referenceKey}`;
  return {
    format: REFERENCE_FORMAT,
    kind,
    referenceKey,
    markdown: `[${escapedMarkdownLabel(label)}](${uri})`
  };
}

// server/ai-chat-catalog.mjs
var execFileAsync = promisify(execFile);
var CATALOG_TIMEOUT_MS = 1e4;
var CATALOG_MAX_BUFFER = 2 * 1024 * 1024;
var COMPOSER_CONTRACT_VERSION = "composer.v1";
var SLASH_COMMAND_CATALOG_URL = new URL("./codex-slash-commands-0.139.0.json", import.meta.url);
var slashCommandCatalogPromise;
var VERIFIED_SLASH_ACTIONS = [
  {
    command: "/new",
    label: "New conversation",
    description: "Start a new conversation",
    handlerId: "new-conversation"
  },
  {
    command: "/model",
    label: "Model",
    description: "Choose the model",
    handlerId: "open-model-menu"
  },
  {
    command: "/reasoning",
    label: "Reasoning",
    description: "Choose the reasoning effort",
    handlerId: "open-reasoning-menu"
  },
  {
    command: "/compact",
    label: "Compact",
    description: "Compact this conversation's context",
    handlerId: "compact-conversation"
  }
];
var UNSUPPORTED_COMPOSER_SOURCES = [
  { kind: "apps", state: "unsupported", reasonCode: "INVOCATION_NAME_UNAVAILABLE" },
  { kind: "files", state: "unsupported", reasonCode: "ENCODER_UNSUPPORTED" },
  { kind: "plugins", state: "unsupported", reasonCode: "EXPERIMENTAL_SOURCE_NOT_ALLOWED" },
  { kind: "customPrompts", state: "unsupported", reasonCode: "NO_STABLE_CATALOG" }
];
function nonEmptyTomlString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
async function readConfiguredAgent(filePath, roleNameHint = null) {
  try {
    const source = await readFile(filePath, "utf8");
    const parsed = parse(source);
    const stableId = nonEmptyTomlString(parsed.name) ?? nonEmptyTomlString(parsed.role_name) ?? roleNameHint;
    const description = nonEmptyTomlString(parsed.description);
    const developerInstructions = nonEmptyTomlString(parsed.developer_instructions);
    if (!stableId || roleNameHint === null && (!description || !developerInstructions)) return null;
    return {
      stableId,
      name: stableId,
      label: stableId,
      description,
      developerInstructions,
      sourcePath: filePath
    };
  } catch {
    return null;
  }
}
async function collectTomlFiles(directory) {
  const files = [];
  const pendingDirectories = [directory];
  let available = false;
  while (pendingDirectories.length > 0) {
    const currentDirectory = pendingDirectories.pop();
    let entries;
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
      available = true;
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path4.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        pendingDirectories.push(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".toml")) {
        files.push(entryPath);
      }
    }
  }
  return { files: files.sort(), available };
}
async function projectConfigFolders(workspacePath) {
  if (typeof workspacePath !== "string" || !workspacePath.trim()) return [];
  const folders = [];
  let current = path4.resolve(workspacePath);
  while (true) {
    folders.push(path4.join(current, ".codex"));
    try {
      await stat(path4.join(current, ".git"));
      break;
    } catch {
    }
    const parent = path4.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return folders.reverse();
}
function mergeConfiguredAgent(high, low) {
  return {
    ...low,
    ...high,
    description: high.description ?? low.description,
    developerInstructions: high.developerInstructions ?? low.developerInstructions
  };
}
function completeConfiguredAgent(agent) {
  return agent && agent.stableId && agent.description ? {
    ...agent,
    identity: ["agent", agent.stableId].join("\0"),
    id: agent.stableId
  } : null;
}
async function loadAgentLayer({ configDirectory, configFile, agentsDirectory }) {
  const layerAgents = /* @__PURE__ */ new Map();
  const declaredFiles = /* @__PURE__ */ new Set();
  let available = false;
  let config = null;
  try {
    config = parse(await readFile(configFile, "utf8"));
    available = true;
  } catch {
  }
  for (const [declaredName, role] of Object.entries(config?.agents ?? {})) {
    if (!role || typeof role !== "object" || Array.isArray(role)) continue;
    const configFileValue = nonEmptyTomlString(role.config_file);
    let agent = {
      stableId: declaredName,
      name: declaredName,
      label: declaredName,
      description: nonEmptyTomlString(role.description),
      developerInstructions: nonEmptyTomlString(role.developer_instructions),
      sourcePath: configFile
    };
    if (configFileValue) {
      const declaredFile = path4.isAbsolute(configFileValue) ? configFileValue : path4.resolve(configDirectory, configFileValue);
      const fileAgent = await readConfiguredAgent(declaredFile, declaredName);
      if (!fileAgent) continue;
      declaredFiles.add(path4.resolve(declaredFile));
      agent = mergeConfiguredAgent(fileAgent, agent);
    }
    if (!layerAgents.has(agent.stableId)) layerAgents.set(agent.stableId, agent);
  }
  const discovered = await collectTomlFiles(agentsDirectory);
  available ||= discovered.available;
  for (const filePath of discovered.files) {
    if (declaredFiles.has(path4.resolve(filePath))) continue;
    const agent = await readConfiguredAgent(filePath);
    if (agent && !layerAgents.has(agent.stableId)) layerAgents.set(agent.stableId, agent);
  }
  return { agents: [...layerAgents.values()], available };
}
async function listConfiguredAgents({ codexHome, agentsDirectory, workspacePath }) {
  const projectFolders = await projectConfigFolders(workspacePath);
  const layers = [{
    configDirectory: codexHome,
    configFile: path4.join(codexHome, "config.toml"),
    agentsDirectory
  }, ...projectFolders.map((configDirectory) => ({
    configDirectory,
    configFile: path4.join(configDirectory, "config.toml"),
    agentsDirectory: path4.join(configDirectory, "agents")
  }))];
  const effective = /* @__PURE__ */ new Map();
  let available = false;
  for (const layer of layers) {
    const loaded = await loadAgentLayer(layer);
    available ||= loaded.available;
    for (const agent of loaded.agents) {
      const previous = effective.get(agent.stableId);
      const merged = completeConfiguredAgent(
        previous ? mergeConfiguredAgent(agent, previous) : agent
      );
      if (merged) effective.set(agent.stableId, merged);
    }
  }
  return {
    agents: [...effective.values()].sort((left, right) => left.label.localeCompare(right.label)),
    available
  };
}
async function existingDirectory(value) {
  if (typeof value !== "string" || !path4.isAbsolute(value.trim())) return null;
  try {
    const resolved = await realpath(value.trim());
    return (await stat(resolved)).isDirectory() ? resolved : null;
  } catch {
    return null;
  }
}
async function loadDeviceWorkspaces(codexStatePath, database) {
  const workspaces = /* @__PURE__ */ new Map();
  let localProjects = {};
  try {
    const state = JSON.parse(await readFile(codexStatePath, "utf8"));
    if (state?.["local-projects"] && typeof state["local-projects"] === "object" && !Array.isArray(state["local-projects"])) {
      localProjects = state["local-projects"];
    }
  } catch {
  }
  for (const [projectId, project] of Object.entries(localProjects)) {
    if (!Array.isArray(project?.rootPaths)) continue;
    for (const rootPath of project.rootPaths) {
      const workspacePath = await existingDirectory(rootPath);
      if (!workspacePath) continue;
      workspaces.set(projectId, workspacePath);
      break;
    }
  }
  for (const project of await database.listProjects()) {
    if (workspaces.has(project.id)) continue;
    const workspacePath = await existingDirectory(project.workspacePath);
    if (workspacePath) workspaces.set(project.id, workspacePath);
  }
  return workspaces;
}
async function loadMappedWorkspaces(projectMappings) {
  const workspaces = /* @__PURE__ */ new Map();
  for (const [projectId, mappedPath] of Object.entries(projectMappings)) {
    const workspacePath = await existingDirectory(mappedPath);
    if (workspacePath) workspaces.set(projectId, workspacePath);
  }
  return workspaces;
}
function resolvedWorkspace(projectId, project, workspaces) {
  if (!project || project.id !== projectId) {
    throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
  }
  const workspacePath = workspaces.get(projectId);
  if (!workspacePath) {
    throw new ApiError(
      409,
      "PROJECT_WORKSPACE_UNAVAILABLE",
      `Project '${projectId}' has no available device workspace`
    );
  }
  return {
    workspacePath,
    addDirectories: [...new Set(workspaces.values())].filter((candidate) => candidate !== workspacePath),
    project
  };
}
async function resolveAiWorkspace(projectId, codexStatePath, database) {
  const project = await database.getProject(projectId);
  const workspaces = await loadDeviceWorkspaces(codexStatePath, database);
  return resolvedWorkspace(projectId, project, workspaces);
}
async function resolveMappedAiWorkspace(projectId, project, projectMappings = {}) {
  const workspaces = await loadMappedWorkspaces(projectMappings);
  return resolvedWorkspace(projectId, project, workspaces);
}
function sanitizeModels(value) {
  if (!Array.isArray(value)) throw new Error("Codex returned an invalid model catalog");
  return value.flatMap((model) => {
    if (!model || typeof model !== "object" || model.visibility !== void 0 && model.visibility !== "list" || typeof model.slug !== "string" || !model.slug.trim()) {
      return [];
    }
    const slug = model.slug.trim();
    const efforts = Array.isArray(model.supported_reasoning_levels) ? [...new Set(model.supported_reasoning_levels.flatMap((level) => typeof level?.effort === "string" && level.effort.trim() ? [level.effort.trim()] : []))] : [];
    const serviceTiers = Array.isArray(model.service_tiers) ? model.service_tiers.flatMap((tier) => typeof tier?.id === "string" && tier.id.trim() && typeof tier.name === "string" && tier.name.trim() ? [{ id: tier.id.trim(), name: tier.name.trim() }] : []) : [];
    return [{
      slug,
      displayName: typeof model.display_name === "string" && model.display_name.trim() ? model.display_name.trim() : slug,
      description: typeof model.description === "string" ? model.description : "",
      defaultReasoningEffort: typeof model.default_reasoning_level === "string" ? model.default_reasoning_level.trim() : "",
      supportedReasoningEfforts: efforts,
      serviceTiers
    }];
  });
}
function sanitizeAppServerModels(value) {
  if (!Array.isArray(value)) throw new Error("Codex returned an invalid model catalog");
  return value.flatMap((model) => {
    if (!model || typeof model !== "object" || model.hidden === true || typeof model.model !== "string" || !model.model.trim()) return [];
    const slug = model.model.trim();
    const efforts = Array.isArray(model.supportedReasoningEfforts) ? [...new Set(model.supportedReasoningEfforts.flatMap((entry) => typeof entry?.reasoningEffort === "string" && entry.reasoningEffort.trim() ? [entry.reasoningEffort.trim()] : []))] : [];
    const serviceTiers = Array.isArray(model.serviceTiers) ? model.serviceTiers.flatMap((tier) => typeof tier?.id === "string" && tier.id.trim() && typeof tier.name === "string" && tier.name.trim() ? [{ id: tier.id.trim(), name: tier.name.trim() }] : []) : [];
    return [{
      slug,
      displayName: typeof model.displayName === "string" && model.displayName.trim() ? model.displayName.trim() : slug,
      description: typeof model.description === "string" ? model.description : "",
      defaultReasoningEffort: typeof model.defaultReasoningEffort === "string" ? model.defaultReasoningEffort.trim() : "",
      supportedReasoningEfforts: efforts,
      serviceTiers
    }];
  });
}
function listSkills(codexExecutable, workspacePath, processEnv) {
  return new Promise((resolve, reject) => {
    const command = executableCommand(codexExecutable, ["app-server", "--stdio"]);
    const child = spawn(command.executable, command.args, {
      cwd: workspacePath,
      env: processEnv,
      stdio: ["pipe", "pipe", "ignore"],
      windowsHide: true
    });
    let buffer = "";
    let settled = false;
    const timeout = setTimeout(
      () => finish(new Error("Timed out while reading Codex skills")),
      CATALOG_TIMEOUT_MS
    );
    function finish(error, value) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      child.stdin.end();
      child.kill("SIGTERM");
      if (error) reject(error);
      else resolve(value);
    }
    function send(message) {
      child.stdin.write(`${JSON.stringify(message)}
`);
    }
    function handleMessage(message) {
      if (message?.id === 1) {
        if (message.error) return finish(new Error("Codex app-server rejected initialization"));
        send({ method: "initialized" });
        send({
          id: 2,
          method: "skills/list",
          params: { cwds: [workspacePath], forceReload: false }
        });
        return;
      }
      if (message?.id !== 2) return;
      if (message.error) return finish(new Error("Codex app-server could not list skills"));
      finish(null, Array.isArray(message.result?.data) ? message.result.data : []);
    }
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      buffer += chunk;
      if (buffer.length > CATALOG_MAX_BUFFER) {
        finish(new Error("Codex skills response exceeded the catalog size limit"));
        return;
      }
      let newlineIndex = buffer.indexOf("\n");
      while (newlineIndex >= 0 && !settled) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line) {
          try {
            handleMessage(JSON.parse(line));
          } catch {
          }
        }
        newlineIndex = buffer.indexOf("\n");
      }
    });
    child.stdin.on("error", (error) => finish(error));
    child.once("error", (error) => finish(error));
    child.once("exit", (code, signal) => {
      if (!settled) {
        finish(new Error(`Codex app-server exited before listing skills (${signal || code})`));
      }
    });
    child.once("spawn", () => {
      send({
        id: 1,
        method: "initialize",
        params: {
          clientInfo: { name: "codex-taskboard", version: "0.1.0" },
          capabilities: { experimentalApi: true }
        }
      });
    });
  });
}
function sanitizeSkills(entries) {
  const unique = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!Array.isArray(entry?.skills)) continue;
    for (const skill of entry.skills) {
      if (!skill || typeof skill !== "object" || skill.enabled === false || typeof skill.name !== "string" || !skill.name.trim()) {
        continue;
      }
      const id = skill.name.trim();
      if (unique.has(id)) continue;
      const displayName = typeof skill.interface?.displayName === "string" ? skill.interface.displayName.trim() : "";
      unique.set(id, {
        id,
        label: displayName || id,
        description: typeof skill.description === "string" ? skill.description.trim() : "",
        path: typeof skill.path === "string" ? skill.path.trim() : "",
        scope: ["user", "repo", "system", "admin"].includes(skill.scope) ? skill.scope : "user"
      });
    }
  }
  return [...unique.values()].sort((left, right) => left.label.localeCompare(right.label));
}
function sanitizeComposerSkills(entries) {
  const skills = [];
  const identities = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    if (!Array.isArray(entry?.skills)) continue;
    for (const skill of entry.skills) {
      if (!skill || typeof skill !== "object" || skill.enabled !== true || typeof skill.name !== "string" || !skill.name.trim() || typeof skill.path !== "string" || !path4.isAbsolute(skill.path.trim())) {
        continue;
      }
      const name = skill.name.trim();
      const skillPath = skill.path.trim();
      const identity = `${name}\0${skillPath}`;
      if (identities.has(identity)) continue;
      identities.add(identity);
      const displayName = typeof skill.interface?.displayName === "string" ? skill.interface.displayName.trim() : "";
      skills.push({
        identity,
        stableId: name.normalize("NFC"),
        name,
        path: skillPath,
        label: displayName || name,
        description: typeof skill.description === "string" && skill.description.trim() ? skill.description.trim() : null
      });
    }
  }
  return skills;
}
function composerCatalogSignature(skills, agents) {
  return JSON.stringify([...skills, ...agents].map(({
    identity,
    stableId,
    label,
    description,
    developerInstructions
  }) => ({
    identity,
    stableId,
    label,
    description,
    developerInstructions
  })));
}
function composerSources(skillsAvailable, agentsAvailable = true) {
  return [
    skillsAvailable ? { kind: "skills", state: "available", reasonCode: null } : { kind: "skills", state: "unavailable", reasonCode: "SOURCE_UNAVAILABLE" },
    agentsAvailable ? { kind: "agents", state: "available", reasonCode: null } : { kind: "agents", state: "unavailable", reasonCode: "SOURCE_UNAVAILABLE" },
    { kind: "slash", state: "available", reasonCode: null },
    ...UNSUPPORTED_COMPOSER_SOURCES
  ];
}
function composerCandidatesForSurface(response, surface = "ai-chat", issueSlashCommands = null, query = "") {
  if (surface === "ai-chat") return response;
  if (Array.isArray(issueSlashCommands)) {
    const unique = /* @__PURE__ */ new Map();
    for (const command of issueSlashCommands) {
      if (!command || typeof command.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(command.id) || typeof command.label !== "string" || !command.label.trim() || typeof command.description !== "string" || typeof command.insertText !== "string" || !command.insertText.startsWith(`/${command.id}`) || command.selectable === false || unique.has(command.id)) continue;
      unique.set(command.id, command);
    }
    const normalizedQuery = query.toLocaleLowerCase();
    const candidates = [...unique.values()].flatMap((command, itemOrder) => {
      const matchScore = composerMatchScore(
        normalizedQuery,
        [command.id, command.label.replace(/^\//, "")],
        command.description
      );
      if (matchScore < 0) return [];
      return [{
        kind: "slashAction",
        candidateRef: `slash:insert:${command.id}`,
        trigger: "/",
        label: command.label,
        description: command.description,
        group: "Commands",
        groupOrder: 0,
        itemOrder,
        selectable: true,
        command: `/${command.id}`,
        insertionText: command.insertText,
        selection: { type: "insertText", text: command.insertText },
        matchScore
      }];
    }).sort((left, right) => right.matchScore - left.matchScore || left.itemOrder - right.itemOrder).map(({ matchScore: _matchScore, ...candidate }) => candidate);
    return { ...response, candidates };
  }
  return {
    ...response,
    candidates: response.candidates.map((candidate) => {
      if (candidate.kind !== "slashAction") return candidate;
      const { dispatch: _dispatch, ...persistedCandidate } = candidate;
      return {
        ...persistedCandidate,
        selection: { type: "insertText", text: candidate.insertionText }
      };
    })
  };
}
function composerMatchScore(query, primaryValues, description = "") {
  if (!query) return 0;
  const normalizedValues = primaryValues.map((value) => value.toLocaleLowerCase());
  const prefixLengths = normalizedValues.filter((value) => value.startsWith(query)).map((value) => value.length);
  if (prefixLengths.length > 0) return 1e3 - Math.min(...prefixLengths);
  if (normalizedValues.some((value) => value.includes(query))) return 500;
  return description.toLocaleLowerCase().includes(query) ? 100 : -1;
}
function referenceUnavailable(nodeIndex, reasonCode = "SOURCE_UNAVAILABLE") {
  return new ApiError(
    409,
    "COMPOSER_REFERENCE_UNAVAILABLE",
    "A selected composer reference is no longer available",
    { nodeIndex, reasonCode }
  );
}
var ComposerCatalog = class {
  constructor({ appServer, agentsDirectory, codexHome, issueSlashCommands, configuredAgents } = {}) {
    this.appServer = appServer;
    this.codexHome = codexHome ?? (agentsDirectory ? path4.dirname(agentsDirectory) : process.env.CODEX_HOME) ?? path4.join(os2.homedir(), ".codex");
    this.agentsDirectory = agentsDirectory ?? path4.join(this.codexHome, "agents");
    this.issueSlashCommands = issueSlashCommands ?? null;
    this.configuredAgents = configuredAgents ?? listConfiguredAgents;
    this.workspaces = /* @__PURE__ */ new Map();
    this.unsubscribe = appServer.subscribe((notification) => {
      if (notification?.method === "skills/changed") this.invalidate();
    });
  }
  async candidatesForSurface(response, { surface, trigger, query }) {
    if (surface === "ai-chat" || trigger !== "/") {
      return composerCandidatesForSurface(response, surface);
    }
    if (!this.issueSlashCommands) {
      return {
        ...response,
        candidates: [],
        sources: response.sources.map((source) => source.kind === "slash" ? { kind: "slash", state: "unavailable", reasonCode: "SOURCE_UNAVAILABLE" } : source)
      };
    }
    try {
      const commands = await this.issueSlashCommands();
      return composerCandidatesForSurface(response, surface, commands, query);
    } catch {
      return {
        ...response,
        candidates: [],
        sources: response.sources.map((source) => source.kind === "slash" ? { kind: "slash", state: "unavailable", reasonCode: "SOURCE_UNAVAILABLE" } : source)
      };
    }
  }
  invalidate() {
    this.workspaces.clear();
  }
  close() {
    this.unsubscribe();
    this.workspaces.clear();
  }
  async candidates({ workspacePath, trigger, query }) {
    let entries = [];
    let skillsAvailable = false;
    if (workspacePath) {
      try {
        entries = await this.appServer.listSkills(workspacePath, { forceReload: false });
        skillsAvailable = true;
      } catch {
      }
    }
    const { agents, available: agentsAvailable } = await this.configuredAgents({
      codexHome: this.codexHome,
      agentsDirectory: this.agentsDirectory,
      workspacePath
    });
    const workspaceKey = workspacePath ?? "__global__";
    const state = this.#acceptCatalog(workspaceKey, sanitizeComposerSkills(entries), agents);
    const normalizedQuery = query.toLocaleLowerCase();
    const skillIdentityCounts = /* @__PURE__ */ new Map();
    for (const skill of state.skills) {
      skillIdentityCounts.set(skill.stableId, (skillIdentityCounts.get(skill.stableId) ?? 0) + 1);
    }
    const skillCandidates = trigger === "@" ? state.skills.flatMap((skill, itemOrder) => {
      if (skillIdentityCounts.get(skill.stableId) !== 1) return [];
      const matchScore = composerMatchScore(
        normalizedQuery,
        [skill.label, skill.name],
        skill.description ?? ""
      );
      if (matchScore < 0) return [];
      return [{
        kind: "skill",
        candidateRef: state.refs.get(skill.identity),
        trigger,
        label: skill.label,
        description: skill.description,
        group: "Skills",
        groupOrder: 0,
        itemOrder,
        selectable: true,
        persistence: composerReferencePersistence("skill", skill.stableId, skill.label),
        matchScore
      }];
    }) : [];
    const agentCandidates = trigger === "@" ? state.agents.flatMap((agent, itemOrder) => {
      const matchScore = composerMatchScore(
        normalizedQuery,
        [agent.label, agent.stableId],
        agent.description ?? ""
      );
      if (matchScore < 0) return [];
      return [{
        kind: "agent",
        candidateRef: state.refs.get(agent.identity),
        trigger,
        label: agent.label,
        description: agent.description,
        group: "Agents",
        groupOrder: 1,
        itemOrder,
        selectable: true,
        insertionText: `@${agent.name}`,
        persistence: composerReferencePersistence("agent", agent.stableId, agent.label),
        matchScore
      }];
    }) : [];
    const slashCandidates = trigger === "/" ? VERIFIED_SLASH_ACTIONS.flatMap((action, itemOrder) => {
      const matchScore = composerMatchScore(
        normalizedQuery,
        [action.command.slice(1), action.label],
        action.description
      );
      if (matchScore < 0) return [];
      return [{
        kind: "slashAction",
        candidateRef: `slash:${action.handlerId}`,
        trigger,
        label: action.label,
        description: action.description,
        group: "Commands",
        groupOrder: 0,
        itemOrder,
        selectable: true,
        command: action.command,
        insertionText: action.command,
        dispatch: { type: "client", handlerId: action.handlerId },
        matchScore
      }];
    }) : [];
    const candidates = [...skillCandidates, ...agentCandidates, ...slashCandidates].sort((left, right) => right.matchScore - left.matchScore || left.groupOrder - right.groupOrder || left.itemOrder - right.itemOrder).map(({ matchScore: _matchScore, ...candidate }) => candidate);
    return {
      contractVersion: COMPOSER_CONTRACT_VERSION,
      revision: state.revision,
      candidates,
      sources: composerSources(skillsAvailable, agentsAvailable)
    };
  }
  async rebindPersistedReferences({ workspacePath, nodes }) {
    let entries = [];
    let skillsAvailable = false;
    try {
      entries = await this.appServer.listSkills(workspacePath, { forceReload: true });
      skillsAvailable = true;
    } catch {
    }
    const { agents, available: agentsAvailable } = await this.configuredAgents({
      codexHome: this.codexHome,
      agentsDirectory: this.agentsDirectory,
      workspacePath
    });
    const state = this.#acceptCatalog(
      workspacePath,
      sanitizeComposerSkills(entries),
      agents
    );
    const sources = composerSources(skillsAvailable, agentsAvailable);
    const byStableIdentity = /* @__PURE__ */ new Map();
    for (const item of state.skills) {
      const key = `skill\0${item.stableId}`;
      const matches = byStableIdentity.get(key) ?? [];
      matches.push(item);
      byStableIdentity.set(key, matches);
    }
    for (const item of state.agents) {
      const key = `agent\0${item.stableId}`;
      const matches = byStableIdentity.get(key) ?? [];
      matches.push(item);
      byStableIdentity.set(key, matches);
    }
    const reboundNodes = [];
    const bindings = [];
    let ready = true;
    for (const [nodeIndex, node] of nodes.entries()) {
      if (node.type === "text") {
        reboundNodes.push(node);
        continue;
      }
      if (node.type === "unsupportedReference") {
        ready = false;
        bindings.push({
          nodeIndex,
          status: "unavailable",
          referenceKind: "unsupported",
          reasonCode: node.reasonCode
        });
        continue;
      }
      const matches = byStableIdentity.get(`${node.referenceKind}\0${node.stableId}`) ?? [];
      let reasonCode = null;
      if (node.referenceKind === "skill" && !skillsAvailable) {
        reasonCode = "SOURCE_UNAVAILABLE";
      } else if (node.referenceKind === "agent" && !agentsAvailable) {
        reasonCode = "SOURCE_UNAVAILABLE";
      } else if (matches.length === 0) {
        reasonCode = "REFERENCE_NOT_FOUND";
      } else if (matches.length > 1) {
        reasonCode = "REFERENCE_AMBIGUOUS";
      }
      if (reasonCode) {
        ready = false;
        bindings.push({
          nodeIndex,
          status: "unavailable",
          referenceKind: node.referenceKind,
          reasonCode
        });
        continue;
      }
      const reference = matches[0];
      bindings.push({
        nodeIndex,
        status: "resolved",
        referenceKind: node.referenceKind,
        label: reference.label
      });
      reboundNodes.push({
        type: node.referenceKind,
        candidateRef: state.refs.get(reference.identity),
        label: reference.label
      });
    }
    return {
      contractVersion: COMPOSER_CONTRACT_VERSION,
      ready,
      revision: state.revision,
      ...ready ? { document: { version: 1, nodes: reboundNodes } } : {},
      bindings,
      sources,
      diagnostics: []
    };
  }
  async resolveReferences({ workspacePath, revision, nodes }) {
    const previous = this.workspaces.get(workspacePath);
    if (!previous || previous.revision !== revision) {
      const firstReferenceIndex = nodes.findIndex((node) => node.type === "skill" || node.type === "agent");
      throw referenceUnavailable(Math.max(firstReferenceIndex, 0));
    }
    let entries;
    try {
      entries = await this.appServer.listSkills(workspacePath, { forceReload: true });
    } catch {
      const firstReferenceIndex = nodes.findIndex((node) => node.type === "skill" || node.type === "agent");
      throw referenceUnavailable(Math.max(firstReferenceIndex, 0));
    }
    const { agents } = await this.configuredAgents({
      codexHome: this.codexHome,
      agentsDirectory: this.agentsDirectory,
      workspacePath
    });
    const current = this.#acceptCatalog(workspacePath, sanitizeComposerSkills(entries), agents);
    if (current.revision !== revision) {
      const firstReferenceIndex = nodes.findIndex((node) => node.type === "skill" || node.type === "agent");
      throw referenceUnavailable(Math.max(firstReferenceIndex, 0));
    }
    const byRef = new Map([...current.skills, ...current.agents].map((item) => [current.refs.get(item.identity), item]));
    return nodes.map((node, nodeIndex) => {
      if (node.type !== "skill" && node.type !== "agent") return null;
      const reference = byRef.get(node.candidateRef);
      if (!reference) throw referenceUnavailable(nodeIndex);
      return reference;
    });
  }
  async resolveSkills(options) {
    return this.resolveReferences(options);
  }
  #acceptCatalog(workspacePath, skills, agents) {
    const signature = composerCatalogSignature(skills, agents);
    const current = this.workspaces.get(workspacePath);
    if (current?.signature === signature) return current;
    const refs = new Map([...skills, ...agents].map((item) => [item.identity, randomUUID2()]));
    const state = { revision: randomUUID2(), signature, skills, agents, refs };
    this.workspaces.set(workspacePath, state);
    return state;
  }
};
async function loadSlashCommands(platform = process.platform) {
  slashCommandCatalogPromise ??= readFile(SLASH_COMMAND_CATALOG_URL, "utf8").then((source) => JSON.parse(source));
  const catalog = await slashCommandCatalogPromise;
  if (!Array.isArray(catalog?.commands)) {
    throw new Error("Codex slash command catalog is invalid");
  }
  return catalog.commands.flatMap((command) => {
    if (!command || typeof command.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(command.id) || typeof command.description !== "string" || command.debugOnly === true || Array.isArray(command.platforms) && !command.platforms.includes(platform) || Array.isArray(command.excludedPlatforms) && command.excludedPlatforms.includes(platform)) {
      return [];
    }
    return [{
      id: command.id,
      label: `/${command.id}`,
      description: command.description,
      insertText: `/${command.id}${command.supportsInlineArgs === true ? " " : ""}`
    }];
  });
}
async function discoverAiCatalog({
  codexExecutable,
  workspacePath,
  processEnv
}) {
  const environment = withoutTaskboardLauncherEnvironment(processEnv);
  const modelCommand = executableCommand(codexExecutable, ["debug", "models"]);
  const [modelResult, skillEntries, commands] = await Promise.all([
    execFileAsync(modelCommand.executable, modelCommand.args, {
      cwd: workspacePath,
      env: environment,
      encoding: "utf8",
      timeout: CATALOG_TIMEOUT_MS,
      maxBuffer: CATALOG_MAX_BUFFER,
      windowsHide: true
    }),
    listSkills(codexExecutable, workspacePath, environment),
    loadSlashCommands()
  ]);
  const modelCatalog = JSON.parse(modelResult.stdout);
  return {
    models: sanitizeModels(modelCatalog?.models),
    skills: sanitizeSkills(skillEntries),
    commands,
    sandboxes: ["read-only", "workspace-write", "danger-full-access"]
  };
}
async function discoverAppServerAiCatalog({ appServer, workspacePath }) {
  const [modelResult, skillEntries, commands] = await Promise.all([
    appServer.request("model/list", { cursor: null, limit: 100, includeHidden: false }),
    appServer.listSkills(workspacePath, { forceReload: false }),
    loadSlashCommands()
  ]);
  return {
    models: sanitizeAppServerModels(modelResult?.data),
    skills: sanitizeSkills(skillEntries),
    commands,
    sandboxes: ["read-only", "workspace-write", "danger-full-access"]
  };
}

// server/codex-app-server.mjs
import { spawn as spawn2 } from "node:child_process";
import { randomUUID as randomUUID3 } from "node:crypto";
var DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
var MAX_STDOUT_BUFFER = 4 * 1024 * 1024;
var STDERR_LIMIT = 16 * 1024;
var CodexAppServerError = class extends Error {
  constructor(message, details) {
    super(message);
    this.name = "CodexAppServerError";
    this.details = details;
  }
};
var CodexAppServer = class {
  constructor({ executable, processEnv = process.env, requestTimeoutMs } = {}) {
    this.executable = executable;
    this.processEnv = withoutTaskboardLauncherEnvironment(processEnv);
    this.requestTimeoutMs = requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    this.child = null;
    this.starting = null;
    this.closing = false;
    this.nextRequestId = 1;
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.stdoutBuffer = "";
    this.stderr = "";
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  async listSkills(workspacePath, { forceReload = false } = {}) {
    const result = await this.request("skills/list", {
      cwds: [workspacePath],
      forceReload
    });
    return Array.isArray(result?.data) ? result.data : [];
  }
  startThread(params) {
    return this.request("thread/start", params);
  }
  resumeThread(params) {
    return this.request("thread/resume", params);
  }
  startTurn(params) {
    return this.request("turn/start", params);
  }
  interruptTurn(params) {
    return this.request("turn/interrupt", params);
  }
  compactThread(threadId) {
    return this.request("thread/compact/start", { threadId });
  }
  async request(method, params) {
    await this.#ensureStarted();
    return this.#sendRequest(method, params);
  }
  async close() {
    this.closing = true;
    const child = this.child;
    this.child = null;
    this.starting = null;
    this.#rejectPending(new CodexAppServerError("Codex app-server closed"));
    this.listeners.clear();
    if (!child || child.exitCode !== null || child.signalCode !== null) return;
    child.stdin.end();
    child.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => child.once("exit", resolve)),
      new Promise((resolve) => {
        const timer = setTimeout(resolve, 1e3);
        timer.unref();
      })
    ]);
    if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
  }
  async #ensureStarted() {
    if (this.child && this.child.exitCode === null && this.child.signalCode === null) return;
    if (this.starting) return this.starting;
    if (this.closing) throw new CodexAppServerError("Codex app-server is closing");
    this.starting = new Promise((resolve, reject) => {
      const command = executableCommand(this.executable, ["app-server", "--stdio"]);
      const child = spawn2(command.executable, command.args, {
        env: this.processEnv,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true
      });
      this.child = child;
      this.stdoutBuffer = "";
      this.stderr = "";
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => this.#handleStdout(chunk));
      child.stderr.on("data", (chunk) => {
        this.stderr = `${this.stderr}${chunk}`.slice(-STDERR_LIMIT);
      });
      child.stdin.on("error", (error) => this.#handleExit(error));
      child.once("error", (error) => {
        this.#handleExit(error);
        reject(error);
      });
      child.once("exit", (code, signal) => {
        const suffix = this.stderr.trim() ? `: ${this.stderr.trim()}` : "";
        const error = new CodexAppServerError(
          `Codex app-server exited (${signal || code})${suffix}`,
          { code, signal }
        );
        this.#handleExit(error);
      });
      child.once("spawn", () => {
        this.#sendRequest("initialize", {
          clientInfo: {
            name: "codex-taskboard",
            title: "Codex Taskboard",
            version: "1.0.1"
          },
          capabilities: {
            experimentalApi: true,
            requestAttestation: false
          }
        }).then(() => {
          this.#sendNotification("initialized");
          resolve();
        }, reject);
      });
    }).finally(() => {
      this.starting = null;
    });
    return this.starting;
  }
  #sendRequest(method, params) {
    const child = this.child;
    if (!child || child.exitCode !== null || child.signalCode !== null) {
      return Promise.reject(new CodexAppServerError("Codex app-server is not running"));
    }
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new CodexAppServerError(`Codex app-server request '${method}' timed out`));
      }, this.requestTimeoutMs);
      timer.unref();
      this.pending.set(id, { method, resolve, reject, timer });
      child.stdin.write(`${JSON.stringify({ id, method, params })}
`, (error) => {
        if (!error) return;
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      });
    });
  }
  #sendNotification(method) {
    this.child?.stdin.write(`${JSON.stringify({ method })}
`);
  }
  #handleStdout(chunk) {
    this.stdoutBuffer += chunk;
    if (this.stdoutBuffer.length > MAX_STDOUT_BUFFER) {
      this.child?.kill("SIGTERM");
      this.#handleExit(new CodexAppServerError("Codex app-server output exceeded its limit"));
      return;
    }
    let newlineIndex = this.stdoutBuffer.indexOf("\n");
    while (newlineIndex >= 0) {
      const line = this.stdoutBuffer.slice(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);
      if (line) {
        try {
          this.#handleMessage(JSON.parse(line));
        } catch (error) {
          console.error("Codex app-server returned invalid JSON", error);
        }
      }
      newlineIndex = this.stdoutBuffer.indexOf("\n");
    }
  }
  #handleMessage(message) {
    if (message && Object.hasOwn(message, "id") && !message.method) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) {
        pending.reject(new CodexAppServerError(
          `Codex app-server rejected '${pending.method}': ${message.error.message ?? "unknown error"}`,
          message.error
        ));
      } else {
        pending.resolve(message.result);
      }
      return;
    }
    if (typeof message?.method !== "string") return;
    if (Object.hasOwn(message, "id")) {
      this.child?.stdin.write(`${JSON.stringify({
        id: message.id,
        error: { code: -32601, message: `Unsupported server request '${message.method}'` }
      })}
`);
      return;
    }
    for (const listener of this.listeners) {
      try {
        listener(message);
      } catch (error) {
        console.error("Codex app-server notification handler failed", error);
      }
    }
  }
  #handleExit(error) {
    if (this.child && this.child.exitCode !== null) this.child = null;
    this.#rejectPending(error);
  }
  #rejectPending(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }
};
var CodexHostAppServer = class {
  constructor({ hostId, ipc = process, requestTimeoutMs } = {}) {
    this.hostId = hostId;
    this.ipc = ipc;
    this.requestTimeoutMs = requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.closed = false;
    this.handleMessage = (message) => this.#handleMessage(message);
    this.ipc.on?.("message", this.handleMessage);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  async listSkills(workspacePath, { forceReload = false } = {}) {
    const result = await this.request("skills/list", {
      cwds: [workspacePath],
      forceReload
    });
    return Array.isArray(result?.data) ? result.data : [];
  }
  startThread(params) {
    return this.request("thread/start", params);
  }
  resumeThread(params) {
    return this.request("thread/resume", params);
  }
  startTurn(params) {
    return this.request("turn/start", params);
  }
  interruptTurn(params) {
    return this.request("turn/interrupt", params);
  }
  compactThread(threadId) {
    return this.request("thread/compact/start", { threadId });
  }
  request(method, params) {
    if (this.closed || typeof this.ipc.send !== "function" || this.ipc.connected === false) {
      return Promise.reject(new CodexAppServerError("Codex host bridge is unavailable"));
    }
    const requestId = randomUUID3();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new CodexAppServerError(`Codex host request '${method}' timed out`));
      }, this.requestTimeoutMs);
      timer.unref();
      this.pending.set(requestId, { method, resolve, reject, timer });
      this.ipc.send({
        type: "taskboard:codex-app-server-request",
        requestId,
        hostId: this.hostId,
        method,
        params
      }, (error) => {
        if (!error) return;
        clearTimeout(timer);
        this.pending.delete(requestId);
        reject(error);
      });
    });
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    this.ipc.off?.("message", this.handleMessage);
    this.#rejectPending(new CodexAppServerError("Codex host bridge closed"));
    this.listeners.clear();
  }
  #handleMessage(message) {
    if (!message || typeof message !== "object" || message.hostId !== this.hostId) return;
    if (message.type === "taskboard:codex-app-server-response") {
      const pending = this.pending.get(message.requestId);
      if (!pending) return;
      this.pending.delete(message.requestId);
      clearTimeout(pending.timer);
      if (message.error) {
        pending.reject(new CodexAppServerError(
          `Codex host rejected '${pending.method}': ${message.error}`
        ));
      } else {
        pending.resolve(message.result);
      }
      return;
    }
    if (message.type !== "taskboard:codex-app-server-notification" || typeof message.method !== "string") return;
    const notification = { method: message.method, params: message.params };
    for (const listener of this.listeners) {
      try {
        listener(notification);
      } catch (error) {
        console.error("Codex host notification handler failed", error);
      }
    }
  }
  #rejectPending(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }
};

// server/ai-chat-process.mjs
import { spawn as spawn3 } from "node:child_process";
import { fileURLToPath } from "node:url";
var VISIBLE_TEXT_LIMIT = 65536;
var STDERR_LIMIT2 = 65536;
var MAX_CODEX_JSONL_LINE_BYTES = 16 * 1024 * 1024;
var SKILL_MARKER = "\uFFFC";
var TURN_OWNER_PATH = fileURLToPath(new URL("./ai-turn-owner.mjs", import.meta.url));
var ITEM_TYPES = /* @__PURE__ */ new Set([
  "agent_message",
  "command_execution",
  "file_change",
  "mcp_tool_call",
  "web_search",
  "todo_list",
  "error"
]);
function cappedText(value) {
  return typeof value === "string" ? value.slice(0, VISIBLE_TEXT_LIMIT) : "";
}
function errorMessage(value) {
  if (typeof value === "string") return cappedText(value);
  if (value && typeof value === "object") return cappedText(value.message);
  return "";
}
function detailText(value) {
  if (value === void 0 || value === null) return "";
  if (typeof value === "string") return cappedText(value);
  try {
    return cappedText(JSON.stringify(value));
  } catch {
    return "";
  }
}
function itemStatus(rawType, item) {
  if (typeof item.status === "string") return cappedText(item.status);
  return rawType.slice("item.".length);
}
function normalizedItem(rawType, item) {
  const status = itemStatus(rawType, item);
  const itemId = cappedText(item.id);
  const baseData = {
    status,
    ...itemId ? { itemId } : {}
  };
  if (item.type === "agent_message") {
    return {
      kind: "event",
      type: item.type,
      role: "assistant",
      content: cappedText(item.text),
      data: baseData
    };
  }
  if (item.type === "command_execution") {
    const command = cappedText(item.command);
    const output = cappedText(item.aggregated_output);
    return {
      kind: "event",
      type: item.type,
      role: "activity",
      content: command,
      data: {
        ...baseData,
        command,
        ...output ? { output } : {},
        ...Number.isInteger(item.exit_code) ? { exitCode: item.exit_code } : {}
      }
    };
  }
  if (item.type === "file_change") {
    const changes = Array.isArray(item.changes) ? item.changes.map((change) => ({
      path: cappedText(change?.path),
      kind: cappedText(change?.kind)
    })).filter((change) => change.path) : [];
    const content = cappedText(changes.map((change) => change.path).join("\n"));
    return {
      kind: "event",
      type: item.type,
      role: "activity",
      content,
      data: {
        ...baseData,
        files: cappedText(changes.map((change) => change.path).join("\n")).split("\n").filter(Boolean),
        ...changes.length > 0 ? { detail: detailText(changes) } : {}
      }
    };
  }
  if (item.type === "mcp_tool_call") {
    const server = cappedText(item.server);
    const tool = cappedText(item.tool);
    const detail = detailText({
      ...item.arguments !== void 0 ? { arguments: item.arguments } : {},
      ...item.result !== void 0 ? { result: item.result } : {},
      ...item.error !== void 0 ? { error: item.error } : {}
    });
    return {
      kind: "event",
      type: item.type,
      role: item.error ? "error" : "activity",
      content: cappedText([server, tool].filter(Boolean).join(".")),
      data: {
        ...baseData,
        ...server ? { server } : {},
        ...tool ? { tool } : {},
        ...detail && detail !== "{}" ? { detail } : {}
      }
    };
  }
  if (item.type === "web_search") {
    const query = cappedText(item.query);
    return {
      kind: "event",
      type: item.type,
      role: "activity",
      content: query,
      data: { ...baseData, ...query ? { query } : {} }
    };
  }
  if (item.type === "todo_list") {
    const items = Array.isArray(item.items) ? item.items.map((todo) => ({
      text: cappedText(todo?.text),
      ...typeof todo?.completed === "boolean" ? { completed: todo.completed } : {}
    })).filter((todo) => todo.text) : [];
    return {
      kind: "event",
      type: item.type,
      role: "activity",
      content: cappedText(items.map((todo) => todo.text).join("\n")),
      data: {
        ...baseData,
        ...items.length > 0 ? { detail: detailText(items) } : {}
      }
    };
  }
  const message = errorMessage(item.message ?? item.error);
  const completedNotice = rawType === "item.completed" && status === "completed";
  return {
    kind: "event",
    type: item.type,
    role: completedNotice ? "activity" : "error",
    content: message,
    data: completedNotice ? { ...baseData, status: "warning" } : baseData
  };
}
function buildCodexArgs(thread, addDirectories, imagePaths = []) {
  const permission = thread.sandbox === "read-only" ? {
    sandbox: "workspace-write",
    approvalPolicy: "on-request",
    reviewer: "user"
  } : thread.sandbox === "workspace-write" ? {
    sandbox: "workspace-write",
    approvalPolicy: "on-request",
    reviewer: "auto_review"
  } : {
    sandbox: "danger-full-access",
    approvalPolicy: "never",
    reviewer: null
  };
  const args = [
    "exec",
    "--json",
    "--color",
    "never",
    "-C",
    thread.origin.workspacePath,
    "-s",
    permission.sandbox,
    "-c",
    `approval_policy="${permission.approvalPolicy}"`
  ];
  if (permission.reviewer) {
    args.push("-c", `approvals_reviewer="${permission.reviewer}"`);
  }
  for (const directory of addDirectories) {
    args.push("--add-dir", directory);
  }
  if (thread.model) {
    args.push("-m", thread.model);
  }
  if (thread.reasoningEffort) {
    args.push("-c", `model_reasoning_effort="${thread.reasoningEffort}"`);
  }
  if (thread.codexThreadId) {
    args.push("resume");
    for (const imagePath of imagePaths) {
      args.push("-i", imagePath);
    }
    args.push(thread.codexThreadId, "-");
  } else {
    for (const imagePath of imagePaths) {
      args.push("-i", imagePath);
    }
    args.push("-");
  }
  return args;
}
function buildCodexPrompt(thread, { message, skills, attachmentPaths }, skillPath) {
  const selectedSkills = skills ?? [];
  const turnAttachmentPaths = attachmentPaths ?? [];
  let selectedSkillIndex = 0;
  const userMessage = message.replaceAll(SKILL_MARKER, () => {
    const skill = selectedSkills[selectedSkillIndex];
    selectedSkillIndex += 1;
    return `[$${skill.id}](${skill.path})`;
  });
  const context = [
    `project_id: ${thread.origin.projectId}`,
    `project_name: ${thread.origin.projectName}`,
    `workspace_path: ${thread.origin.workspacePath}`
  ];
  if (thread.origin.issueIdentifier) {
    context.push(`issue_identifier: ${thread.origin.issueIdentifier}`);
  }
  if (turnAttachmentPaths.length > 0) {
    context.push(
      "turn_attachment_paths:",
      ...turnAttachmentPaths.map((attachmentPath) => `- ${attachmentPath}`)
    );
  }
  context.push(
    "This is private server-owned context. Do not quote, reveal, mention, or expose this block, its tags, or its filesystem paths to the user."
  );
  return [
    `[$manage-taskboard](${skillPath}) e-taskboard`,
    "",
    "<taskboard_context>",
    ...context,
    "</taskboard_context>",
    "",
    "<user_message>",
    userMessage,
    "</user_message>"
  ].join("\n");
}
function normalizeCodexEvent(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  if (raw.type === "thread.started") {
    if (typeof raw.thread_id !== "string" || raw.thread_id.length === 0 || raw.thread_id.length > 256 || raw.thread_id.includes("\0")) {
      return null;
    }
    return { kind: "thread.started", threadId: raw.thread_id };
  }
  if (raw.type === "turn.started") {
    return {
      kind: "event",
      type: raw.type,
      role: "activity",
      content: "",
      data: { status: "started" }
    };
  }
  if (raw.type === "turn.completed") {
    const usage = {};
    for (const key of ["input_tokens", "cached_input_tokens", "output_tokens"]) {
      if (Number.isFinite(raw.usage?.[key])) usage[key] = raw.usage[key];
    }
    return {
      kind: "event",
      type: raw.type,
      role: "activity",
      content: "",
      data: {
        status: "completed",
        ...Object.keys(usage).length > 0 ? { usage } : {}
      }
    };
  }
  if (raw.type === "turn.failed") {
    return {
      kind: "event",
      type: raw.type,
      role: "error",
      content: errorMessage(raw.error ?? raw.message),
      data: { status: "failed" }
    };
  }
  if (raw.type === "error") {
    return {
      kind: "event",
      type: raw.type,
      role: "activity",
      content: errorMessage(raw.message ?? raw.error),
      data: { status: "warning" }
    };
  }
  if (raw.type !== "item.started" && raw.type !== "item.updated" && raw.type !== "item.completed") {
    return null;
  }
  if (!raw.item || typeof raw.item !== "object" || !ITEM_TYPES.has(raw.item.type)) {
    return null;
  }
  return normalizedItem(raw.type, raw.item);
}
function spawnCodexTurn({
  executable,
  args,
  prompt,
  env,
  onRawEvent,
  maxLineBytes = MAX_CODEX_JSONL_LINE_BYTES
}) {
  const child = spawn3(process.execPath, [TURN_OWNER_PATH, executable, JSON.stringify(args)], {
    detached: true,
    env: withoutTaskboardLauncherEnvironment(env),
    stdio: ["pipe", "pipe", "pipe", "pipe"],
    windowsHide: true
  });
  let stdoutChunks = [];
  let stdoutLength = 0;
  let stderrBuffer = Buffer.alloc(0);
  let settled = false;
  let fatalError = null;
  let stdoutEnded = false;
  let resolveCompletion;
  let rejectCompletion;
  const completion = new Promise((resolve, reject) => {
    resolveCompletion = resolve;
    rejectCompletion = reject;
  });
  function terminateProcessGroup() {
    signalProcessTree(child, "SIGKILL");
  }
  function rejectWithDiagnostic(error) {
    if (settled || fatalError) return;
    fatalError = error instanceof Error ? error : new Error(String(error));
    terminateProcessGroup();
  }
  function consumeLine(line) {
    if (fatalError) return;
    if (line.length > maxLineBytes) {
      rejectWithDiagnostic(new Error(`Codex JSONL line exceeded ${maxLineBytes} bytes`));
      return;
    }
    if (line.at(-1) === 13) line = line.subarray(0, -1);
    if (line.toString("utf8").trim() === "") return;
    let raw;
    try {
      raw = JSON.parse(line.toString("utf8"));
    } catch {
      rejectWithDiagnostic(new Error("Codex emitted malformed JSONL"));
      return;
    }
    try {
      onRawEvent(raw);
    } catch (error) {
      rejectWithDiagnostic(error);
    }
  }
  function consumeChunk(chunk) {
    if (settled) return;
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    let offset = 0;
    while (offset < bytes.length && !settled && !fatalError) {
      const newline = bytes.indexOf(10, offset);
      if (newline === -1) {
        const remainder = bytes.subarray(offset);
        if (stdoutLength + remainder.length > maxLineBytes) {
          rejectWithDiagnostic(new Error(`Codex JSONL line exceeded ${maxLineBytes} bytes`));
          return;
        }
        stdoutChunks.push(remainder);
        stdoutLength += remainder.length;
        return;
      }
      const segment = bytes.subarray(offset, newline);
      const lineLength = stdoutLength + segment.length;
      if (lineLength > maxLineBytes) {
        rejectWithDiagnostic(new Error(`Codex JSONL line exceeded ${maxLineBytes} bytes`));
        return;
      }
      if (segment.length > 0) stdoutChunks.push(segment);
      const line = stdoutChunks.length === 0 ? segment : stdoutChunks.length === 1 ? stdoutChunks[0] : Buffer.concat(stdoutChunks, lineLength);
      stdoutChunks = [];
      stdoutLength = 0;
      consumeLine(line);
      offset = newline + 1;
    }
  }
  function finishStdout() {
    if (stdoutEnded) return;
    stdoutEnded = true;
    if (!fatalError && stdoutLength > 0) {
      const line = stdoutChunks.length === 1 ? stdoutChunks[0] : Buffer.concat(stdoutChunks, stdoutLength);
      stdoutChunks = [];
      stdoutLength = 0;
      consumeLine(line);
    }
  }
  child.stdout.on("data", consumeChunk);
  child.stdout.on("end", finishStdout);
  child.stderr.on("data", (chunk) => {
    if (stderrBuffer.length >= STDERR_LIMIT2) return;
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    stderrBuffer = Buffer.concat([
      stderrBuffer,
      bytes.subarray(0, STDERR_LIMIT2 - stderrBuffer.length)
    ]);
  });
  child.on("error", rejectWithDiagnostic);
  child.on("exit", () => child.stdio[3].destroy());
  child.on("close", (exitCode, signal) => {
    finishStdout();
    if (settled) return;
    settled = true;
    if (fatalError) {
      if (stderrBuffer.length > 0) {
        fatalError.stderr = stderrBuffer.toString("utf8");
      }
      rejectCompletion(fatalError);
      return;
    }
    resolveCompletion({ exitCode, signal });
  });
  child.stdin.on("error", () => {
  });
  child.stdio[3].on("error", () => {
  });
  child.stdin.end(prompt);
  return { child, completion };
}

// server/ai-chat.mjs
var SANDBOXES = /* @__PURE__ */ new Set(["read-only", "workspace-write", "danger-full-access"]);
var ERROR_CONTENT_LIMIT = 65536;
var AGENT_DISPATCH_PROTOCOL = "taskboard.agent.v1";
var SKILL_MARKER2 = "\uFFFC";
var CODEX_IMAGE_TYPES = /* @__PURE__ */ new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp"
]);
function cappedError(value) {
  const message = value instanceof Error ? value.message : String(value ?? "");
  return message.slice(0, ERROR_CONTENT_LIMIT);
}
function agentDispatchText(agent) {
  return [
    `Taskboard private agent dispatch (${AGENT_DISPATCH_PROTOCOL}):`,
    `Use the configured Taskboard agent ${JSON.stringify(agent.name)} (id ${JSON.stringify(agent.id)}) for this request.`,
    "This is Taskboard product-private routing context, not a Codex App Server UserInput type."
  ].join("\n");
}
function signalProcessGroup(child, signal) {
  signalProcessTree(child, signal);
}
function wait(milliseconds) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    timer.unref();
  });
}
function appServerThreadSettings(thread, resolved) {
  const dangerous = thread.sandbox === "danger-full-access";
  return {
    model: thread.model,
    cwd: resolved.workspacePath,
    runtimeWorkspaceRoots: [resolved.workspacePath, ...resolved.addDirectories],
    approvalPolicy: dangerous ? "never" : "on-request",
    ...dangerous ? {} : { approvalsReviewer: thread.sandbox === "read-only" ? "user" : "auto_review" },
    sandbox: thread.sandbox
  };
}
function codexTargetFromOrigin(origin) {
  if (origin?.codexProjectKind !== "remote" || !origin.codexProjectId || !origin.codexHostId || !origin.workspacePath) return void 0;
  return {
    codexProjectId: origin.codexProjectId,
    codexProjectKind: "remote",
    codexHostId: origin.codexHostId,
    workspacePath: origin.workspacePath
  };
}
function normalizedAppServerItem(item) {
  if (!item || typeof item !== "object") return null;
  const itemId = typeof item.id === "string" ? item.id.slice(0, ERROR_CONTENT_LIMIT) : "";
  const baseData = { status: item.status ?? "completed", ...itemId ? { itemId } : {} };
  if (item.type === "agentMessage") {
    return {
      type: "agent_message",
      role: "assistant",
      content: cappedError(item.text),
      data: baseData
    };
  }
  if (item.type === "commandExecution") {
    return {
      type: "command_execution",
      role: "activity",
      content: cappedError(item.command),
      data: {
        ...baseData,
        command: cappedError(item.command),
        ...typeof item.aggregatedOutput === "string" ? { output: cappedError(item.aggregatedOutput) } : {},
        ...Number.isInteger(item.exitCode) ? { exitCode: item.exitCode } : {}
      }
    };
  }
  if (item.type === "fileChange") {
    const files = Array.isArray(item.changes) ? item.changes.flatMap((change) => typeof change?.path === "string" ? [change.path.slice(0, ERROR_CONTENT_LIMIT)] : []) : [];
    return {
      type: "file_change",
      role: "activity",
      content: files.join("\n").slice(0, ERROR_CONTENT_LIMIT),
      data: { ...baseData, files }
    };
  }
  if (item.type === "mcpToolCall") {
    return {
      type: "mcp_tool_call",
      role: item.error ? "error" : "activity",
      content: `${item.server ?? ""}.${item.tool ?? ""}`.replace(/^\.|\.$/g, ""),
      data: {
        ...baseData,
        ...typeof item.server === "string" ? { server: item.server } : {},
        ...typeof item.tool === "string" ? { tool: item.tool } : {}
      }
    };
  }
  return null;
}
var AiChatService = class {
  constructor(options) {
    this.database = options.database;
    this.codexExecutable = options.codexExecutable;
    this.codexStatePath = options.codexStatePath;
    this.manageTaskboardSkillPath = options.manageTaskboardSkillPath;
    this.processEnv = options.processEnv ?? process.env;
    this.killGraceMs = options.killGraceMs ?? 1e3;
    this.appServer = options.appServer ?? new CodexAppServer({
      executable: this.codexExecutable,
      processEnv: this.processEnv
    });
    this.composerCatalog = options.composerCatalog ?? new ComposerCatalog({
      appServer: this.appServer,
      issueSlashCommands: () => loadSlashCommands()
    });
    this.remoteAppServerFactory = options.remoteAppServerFactory ?? ((hostId) => new CodexHostAppServer({ hostId }));
    this.remoteRuntimes = /* @__PURE__ */ new Map();
    this.resolveContext = options.resolveContext ?? (async (projectId, issueId) => {
      const resolved = await resolveAiWorkspace(projectId, this.codexStatePath, this.database);
      let issue;
      if (issueId !== void 0) {
        issue = this.database.getTask(issueId);
        if (!issue || issue.projectId !== projectId || issue.archivedAt != null) {
          throw new ApiError(
            404,
            "AI_CHAT_ISSUE_NOT_FOUND",
            `Task '${issueId}' is not an active task in project '${projectId}'`
          );
        }
      }
      return { ...resolved, issue };
    });
    this.active = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
    this.completions = /* @__PURE__ */ new Map();
    this.unsubscribeAppServer = this.appServer.subscribe((notification) => {
      this.#handleAppServerNotification(this.appServer, notification);
    });
  }
  #runtimeForTarget(target) {
    if (target?.codexProjectKind !== "remote") {
      return { appServer: this.appServer, composerCatalog: this.composerCatalog };
    }
    let runtime = this.remoteRuntimes.get(target.codexHostId);
    if (runtime) return runtime;
    const appServer = this.remoteAppServerFactory(target.codexHostId);
    const composerCatalog = new ComposerCatalog({
      appServer,
      issueSlashCommands: () => loadSlashCommands(),
      configuredAgents: async () => ({ agents: [], available: false })
    });
    const unsubscribe = appServer.subscribe((notification) => {
      this.#handleAppServerNotification(appServer, notification);
    });
    runtime = { appServer, composerCatalog, unsubscribe };
    this.remoteRuntimes.set(target.codexHostId, runtime);
    return runtime;
  }
  #runtimeForThread(thread) {
    return this.#runtimeForTarget(codexTargetFromOrigin(thread.origin));
  }
  listThreads() {
    return this.database.listAiChatThreads();
  }
  getThread(threadId) {
    const thread = this.database.getAiChatThread(threadId);
    if (!thread) {
      throw new ApiError(
        404,
        "AI_CHAT_THREAD_NOT_FOUND",
        `AI chat thread '${threadId}' does not exist`
      );
    }
    return thread;
  }
  getThreadSnapshot(threadId) {
    const thread = this.getThread(threadId);
    return {
      thread,
      events: this.database.listAiChatEvents(threadId),
      runs: this.database.listAiChatRuns(threadId)
    };
  }
  composerCatalogForThread(thread) {
    return this.#runtimeForThread(thread).composerCatalog;
  }
  getRun(runId) {
    const run = this.database.getAiChatRun(runId);
    if (!run) {
      throw new ApiError(404, "AI_CHAT_RUN_NOT_FOUND", `AI chat run '${runId}' does not exist`);
    }
    return run;
  }
  subscribe(threadId, listener) {
    let listeners = this.listeners.get(threadId);
    if (!listeners) {
      listeners = /* @__PURE__ */ new Set();
      this.listeners.set(threadId, listeners);
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) this.listeners.delete(threadId);
    };
  }
  async #catalogForWorkspace(workspacePath) {
    return discoverAiCatalog({
      codexExecutable: this.codexExecutable,
      workspacePath,
      processEnv: this.processEnv
    });
  }
  async getCatalog(projectId, resolvedContext, codexTarget) {
    const resolved = resolvedContext ?? await this.resolveContext(projectId, void 0, codexTarget);
    if (resolved.codexProjectKind === "remote") {
      const { appServer } = this.#runtimeForTarget(resolved);
      return discoverAppServerAiCatalog({ appServer, workspacePath: resolved.workspacePath });
    }
    return this.#catalogForWorkspace(resolved.workspacePath);
  }
  async getComposerCandidates({
    projectId,
    threadId,
    trigger,
    query,
    codexProjectId,
    codexProjectKind,
    codexHostId,
    workspacePath
  }) {
    let thread;
    let codexTarget = codexProjectKind === "remote" ? { codexProjectId, codexProjectKind, codexHostId, workspacePath } : void 0;
    if (threadId !== void 0) {
      try {
        thread = this.getThread(threadId);
      } catch (error) {
        if (error instanceof ApiError && error.code === "AI_CHAT_THREAD_NOT_FOUND") {
          throw new ApiError(
            400,
            "INVALID_COMPOSER_QUERY",
            "Composer thread does not exist"
          );
        }
        throw error;
      }
      if (projectId !== void 0 && thread.origin.projectId !== projectId) {
        throw new ApiError(
          400,
          "INVALID_COMPOSER_QUERY",
          "Composer thread does not belong to the selected project"
        );
      }
      projectId = thread.origin.projectId;
      codexTarget = codexTargetFromOrigin(thread.origin);
    }
    if (projectId === void 0) {
      const response2 = await this.composerCatalog.candidates({ workspacePath: null, trigger, query });
      return { ...response2, candidates: response2.candidates.filter((candidate) => candidate.dispatch?.handlerId !== "compact-conversation") };
    }
    let resolved;
    try {
      resolved = await this.resolveContext(projectId, thread?.origin.issueId, codexTarget);
    } catch (error) {
      if (error instanceof ApiError && ["PROJECT_NOT_FOUND", "AI_CHAT_ISSUE_NOT_FOUND"].includes(error.code)) {
        throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer project is invalid");
      }
      throw error;
    }
    if (thread && resolved.workspacePath !== thread.origin.workspacePath) {
      throw new ApiError(
        400,
        "INVALID_COMPOSER_QUERY",
        "Composer thread workspace no longer matches the selected project"
      );
    }
    const { composerCatalog } = this.#runtimeForTarget(resolved);
    const response = await composerCatalog.candidates({
      workspacePath: resolved.workspacePath,
      trigger,
      query
    });
    return {
      ...response,
      candidates: response.candidates.filter((candidate) => candidate.dispatch?.handlerId !== "compact-conversation" || thread?.codexThreadId && thread.status !== "running")
    };
  }
  async compactThread(threadId) {
    const thread = this.getThread(threadId);
    if (thread.status === "running") {
      throw new ApiError(409, "AI_CHAT_THREAD_RUNNING", "Cannot compact a running conversation");
    }
    if (!thread.codexThreadId) {
      throw new ApiError(409, "AI_CHAT_THREAD_NOT_STARTED", "Conversation has not started");
    }
    await this.#runtimeForThread(thread).appServer.compactThread(thread.codexThreadId);
    return this.getThread(threadId);
  }
  async createThread(input) {
    const codexTarget = input.codexProjectKind === "remote" ? input : void 0;
    const resolved = await this.resolveContext(input.projectId, input.issueId, codexTarget);
    const catalog = await this.getCatalog(input.projectId, resolved, codexTarget);
    const model = this.#resolveModel(catalog, input.model);
    const reasoningEffort = input.reasoningEffort ?? model.defaultReasoningEffort;
    this.#validateReasoningEffort(model, reasoningEffort);
    const sandbox = input.sandbox ?? "workspace-write";
    this.#validateSandbox(sandbox);
    const issue = resolved.issue;
    return this.database.createAiChatThread({
      title: input.title ?? issue?.identifier ?? "New conversation",
      origin: {
        projectId: resolved.project.id,
        projectName: resolved.project.name,
        workspacePath: resolved.workspacePath,
        ...resolved.codexProjectKind === "remote" ? {
          codexProjectId: resolved.codexProjectId,
          codexProjectKind: resolved.codexProjectKind,
          codexHostId: resolved.codexHostId
        } : {},
        ...issue ? { issueId: issue.id, issueIdentifier: issue.identifier } : {}
      },
      model: model.slug,
      reasoningEffort,
      sandbox
    });
  }
  async updateThread(threadId, changes) {
    let thread = this.getThread(threadId);
    const changesSettings = ["model", "reasoningEffort", "sandbox"].some(
      (key) => Object.hasOwn(changes, key)
    );
    const wasActive = changesSettings && this.#threadIsActive(thread);
    if (Object.hasOwn(changes, "sandbox")) this.#validateSandbox(changes.sandbox);
    if (Object.hasOwn(changes, "model") || Object.hasOwn(changes, "reasoningEffort")) {
      const catalog = await this.getCatalog(
        thread.origin.projectId,
        void 0,
        codexTargetFromOrigin(thread.origin)
      );
      thread = this.getThread(threadId);
      const model = this.#resolveModel(catalog, changes.model ?? thread.model);
      const reasoningEffort = changes.reasoningEffort ?? thread.reasoningEffort;
      this.#validateReasoningEffort(model, reasoningEffort);
    }
    if (wasActive || changesSettings && this.#threadIsActive(thread)) {
      throw new ApiError(
        409,
        "THREAD_BUSY",
        `AI chat thread '${threadId}' has a running turn`
      );
    }
    return this.database.updateAiChatThread(threadId, changes);
  }
  deleteThread(threadId) {
    const thread = this.getThread(threadId);
    if (this.#threadIsActive(thread)) {
      throw new ApiError(
        409,
        "THREAD_BUSY",
        `AI chat thread '${threadId}' has a running turn`
      );
    }
    return this.database.deleteAiChatThread(threadId);
  }
  async startTurn(threadId, input) {
    let thread = this.getThread(threadId);
    if (this.#threadIsActive(thread)) {
      throw new ApiError(
        409,
        "THREAD_BUSY",
        `AI chat thread '${threadId}' has a running turn`
      );
    }
    if (input?.contractVersion === "composer.v1") {
      return this.#startComposerTurn(thread, input);
    }
    this.#validateTurnInput(input);
    if (thread.sandbox === "danger-full-access" && input.dangerFullAccessConfirmed !== true) {
      throw new ApiError(
        400,
        "DANGER_CONFIRMATION_REQUIRED",
        "danger-full-access must be confirmed for every turn"
      );
    }
    const codexTarget = codexTargetFromOrigin(thread.origin);
    const resolved = await this.resolveContext(
      thread.origin.projectId,
      thread.origin.issueId,
      codexTarget
    );
    const catalog = await this.getCatalog(thread.origin.projectId, resolved, codexTarget);
    thread = this.getThread(threadId);
    if (this.#threadIsActive(thread)) {
      throw new ApiError(
        409,
        "THREAD_BUSY",
        `AI chat thread '${threadId}' has a running turn`
      );
    }
    if (thread.sandbox === "danger-full-access" && input.dangerFullAccessConfirmed !== true) {
      throw new ApiError(
        400,
        "DANGER_CONFIRMATION_REQUIRED",
        "danger-full-access must be confirmed for every turn"
      );
    }
    const model = this.#resolveModel(catalog, thread.model);
    this.#validateReasoningEffort(model, thread.reasoningEffort);
    if (resolved.workspacePath !== thread.origin.workspacePath) {
      throw new ApiError(
        409,
        "PROJECT_WORKSPACE_CHANGED",
        "The project's device workspace no longer matches this conversation"
      );
    }
    const skillIds = input.skillIds ?? [];
    const availableSkills = new Map(
      catalog.skills.filter((skill) => skill.id !== "manage-taskboard").map((skill) => [skill.id, skill])
    );
    for (const skillId of skillIds) {
      if (!availableSkills.has(skillId)) {
        throw new ApiError(400, "INVALID_SKILL", `Unknown or unavailable skill '${skillId}'`);
      }
    }
    const selectedSkills = skillIds.map((skillId) => availableSkills.get(skillId));
    if (resolved.codexProjectKind === "remote") {
      return this.#startRemoteTurn(thread, input, resolved, selectedSkills);
    }
    const attachments = input.attachments ?? [];
    const {
      temporaryDirectory,
      attachmentPaths,
      imagePaths
    } = await this.#writeTurnAttachments(attachments);
    try {
      const args = buildCodexArgs(thread, resolved.addDirectories, imagePaths);
      const prompt = buildCodexPrompt(
        thread,
        {
          message: input.message,
          skills: selectedSkills,
          attachmentPaths
        },
        this.manageTaskboardSkillPath
      );
      const run = this.database.createAiChatRun({ threadId });
      this.#emit(threadId, { type: "ai.run", run });
      const userEventData = {};
      if (skillIds.length > 0) userEventData.skillIds = skillIds;
      if (attachments.length > 0) {
        userEventData.attachments = attachments.map(({ filename, contentType, size }) => ({
          filename,
          contentType,
          size
        }));
      }
      const userEvent = this.database.insertAiChatEvent({
        threadId,
        runId: run.id,
        type: "user_message",
        role: "user",
        content: input.message,
        data: Object.keys(userEventData).length > 0 ? userEventData : void 0
      });
      this.#emit(threadId, { type: "ai.event", event: userEvent });
      const resumingThreadId = thread.codexThreadId;
      let startedThreadId = null;
      let terminalOutcome = null;
      let terminalError = "";
      let pendingError = "";
      const { child, completion } = spawnCodexTurn({
        executable: this.codexExecutable,
        args,
        prompt,
        env: this.processEnv,
        onRawEvent: (raw) => {
          const normalized = normalizeCodexEvent(raw);
          if (!normalized) return;
          if (normalized.kind === "thread.started") {
            if (resumingThreadId && normalized.threadId !== resumingThreadId || startedThreadId && normalized.threadId !== startedThreadId) {
              throw new Error("Codex returned an unexpected thread id");
            }
            startedThreadId = normalized.threadId;
            this.database.updateAiChatThread(threadId, { codexThreadId: normalized.threadId });
            return;
          }
          const event = this.database.insertAiChatEvent({
            threadId,
            runId: run.id,
            type: normalized.type,
            role: normalized.role,
            content: normalized.content,
            data: normalized.data
          });
          if (raw.type === "turn.completed" && terminalOutcome === null) {
            terminalOutcome = "completed";
          } else if (raw.type === "turn.failed") {
            terminalOutcome = "failed";
            terminalError ||= normalized.content;
          } else if (raw.type === "error") {
            pendingError ||= normalized.content;
          }
          this.#emit(threadId, { type: "ai.event", event });
        }
      });
      const active = { child, threadId, interrupted: false, temporaryDirectory };
      this.active.set(run.id, active);
      const finalization = completion.then(
        (result) => this.#finishRun({
          run,
          active,
          result,
          resumingThreadId,
          startedThreadId: () => startedThreadId,
          terminalOutcome: () => terminalOutcome,
          terminalError: () => terminalError,
          pendingError: () => pendingError
        }),
        (error) => this.#finishRun({
          run,
          active,
          error,
          resumingThreadId,
          startedThreadId: () => startedThreadId,
          terminalOutcome: () => terminalOutcome,
          terminalError: () => terminalError,
          pendingError: () => pendingError
        })
      );
      this.completions.set(run.id, finalization);
      void finalization.finally(() => this.completions.delete(run.id)).catch(() => {
      });
      return run;
    } catch (error) {
      if (temporaryDirectory) {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
      throw error;
    }
  }
  async interrupt(runId) {
    let run = this.getRun(runId);
    if (run.status !== "running") return run;
    const active = this.active.get(runId);
    if (!active) {
      run = this.database.updateAiChatRun(runId, {
        status: "interrupted",
        error: "Interrupted",
        finishedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.#emit(run.threadId, { type: "ai.run", run });
      return run;
    }
    active.interrupted = true;
    if (active.kind === "app-server") {
      if (active.turnId) {
        try {
          await active.appServer.interruptTurn({
            threadId: active.appServerThreadId,
            turnId: active.turnId
          });
        } catch {
        }
      }
      const completion2 = this.completions.get(runId);
      if (completion2) {
        await Promise.race([completion2.catch(() => {
        }), wait(this.killGraceMs + 25)]);
      }
      if (this.active.has(runId)) await this.#finishAppServerRun(active, "interrupted");
      return this.getRun(runId);
    }
    signalProcessGroup(active.child, "SIGTERM");
    const timer = setTimeout(() => {
      if (this.active.has(runId)) signalProcessGroup(active.child, "SIGKILL");
    }, this.killGraceMs);
    timer.unref();
    const completion = this.completions.get(runId);
    if (completion) {
      await Promise.race([completion.catch(() => {
      }), wait(this.killGraceMs + 25)]);
    }
    return this.getRun(runId);
  }
  async close() {
    const entries = [...this.active.entries()];
    for (const [, active] of entries) {
      active.interrupted = true;
      if (active.kind === "app-server") {
        if (active.turnId) {
          void active.appServer.interruptTurn({
            threadId: active.appServerThreadId,
            turnId: active.turnId
          }).catch(() => {
          });
        }
      } else {
        signalProcessGroup(active.child, "SIGTERM");
      }
    }
    const completions = entries.map(([runId]) => this.completions.get(runId)).filter(Boolean);
    if (completions.length > 0) {
      const settled = Promise.allSettled(completions);
      await Promise.race([settled, wait(this.killGraceMs)]);
      for (const [runId, active] of entries) {
        if (active.kind !== "app-server" && this.active.has(runId)) {
          signalProcessGroup(active.child, "SIGKILL");
        }
      }
      for (const [, active] of entries) {
        if (active.kind === "app-server" && this.active.has(active.run.id)) {
          await this.#finishAppServerRun(active, "interrupted");
        }
      }
      await settled;
    }
    for (const [, active] of entries) {
      if (active.kind === "app-server" && this.active.has(active.run.id)) {
        await this.#finishAppServerRun(active, "interrupted");
      }
    }
    this.unsubscribeAppServer();
    this.composerCatalog.close();
    await this.appServer.close();
    for (const runtime of this.remoteRuntimes.values()) {
      runtime.unsubscribe();
      runtime.composerCatalog.close();
      await runtime.appServer.close();
    }
    this.remoteRuntimes.clear();
    this.listeners.clear();
  }
  #resolveModel(catalog, requestedModel) {
    const model = requestedModel === void 0 ? catalog.models[0] : catalog.models.find((candidate) => candidate.slug === requestedModel);
    if (!model) {
      throw new ApiError(
        400,
        "INVALID_MODEL",
        requestedModel === void 0 ? "Codex did not provide an available model" : `Unknown model '${requestedModel}'`
      );
    }
    return model;
  }
  #validateReasoningEffort(model, reasoningEffort) {
    if (!model.supportedReasoningEfforts.includes(reasoningEffort)) {
      throw new ApiError(
        400,
        "INVALID_REASONING_EFFORT",
        `Reasoning effort '${reasoningEffort}' is not supported by model '${model.slug}'`
      );
    }
  }
  #validateSandbox(sandbox) {
    if (!SANDBOXES.has(sandbox)) {
      throw new ApiError(
        400,
        "INVALID_SANDBOX",
        "'sandbox' must be read-only, workspace-write, or danger-full-access"
      );
    }
  }
  #validateTurnInput(input) {
    if (!input || typeof input.message !== "string" || input.message.length > 1e5 || input.message.trim() === "" && (!Array.isArray(input.attachments) || input.attachments.length === 0)) {
      throw new ApiError(
        400,
        "INVALID_MESSAGE",
        "A message or at least one attachment is required"
      );
    }
    if (input.skillIds !== void 0 && (!Array.isArray(input.skillIds) || input.skillIds.length > 20 || input.skillIds.some((skillId) => typeof skillId !== "string" || !skillId))) {
      throw new ApiError(
        400,
        "INVALID_SKILL",
        "'skillIds' must contain at most 20 skill ids"
      );
    }
  }
  async #startAppServerRun({
    thread,
    resolved,
    appServer,
    userInput,
    userEvent,
    temporaryDirectory = null
  }) {
    const settings = appServerThreadSettings(thread, resolved);
    let appServerThreadId = thread.codexThreadId;
    if (appServerThreadId) {
      const resumed = await appServer.resumeThread({
        threadId: appServerThreadId,
        ...settings
      });
      if (resumed?.thread?.id !== appServerThreadId) {
        throw new Error("Codex returned an unexpected resumed thread id");
      }
    } else {
      const started = await appServer.startThread(settings);
      appServerThreadId = started?.thread?.id;
      if (typeof appServerThreadId !== "string" || !appServerThreadId) {
        throw new Error("Codex did not provide a thread id");
      }
      this.database.updateAiChatThread(thread.id, { codexThreadId: appServerThreadId });
    }
    const run = this.database.createAiChatRun({ threadId: thread.id });
    this.#emit(thread.id, { type: "ai.run", run });
    const storedUserEvent = this.database.insertAiChatEvent({
      threadId: thread.id,
      runId: run.id,
      type: "user_message",
      role: "user",
      ...userEvent
    });
    this.#emit(thread.id, { type: "ai.event", event: storedUserEvent });
    let resolveCompletion;
    const completion = new Promise((resolve) => {
      resolveCompletion = resolve;
    });
    const active = {
      kind: "app-server",
      run,
      threadId: thread.id,
      appServer,
      appServerThreadId,
      turnId: null,
      interrupted: false,
      temporaryDirectory,
      resolveCompletion
    };
    this.active.set(run.id, active);
    const finalization = completion.finally(() => this.completions.delete(run.id));
    this.completions.set(run.id, finalization);
    try {
      const started = await appServer.startTurn({
        threadId: appServerThreadId,
        input: userInput,
        effort: thread.reasoningEffort
      });
      const turnId = started?.turn?.id;
      if (typeof turnId !== "string" || !turnId) {
        throw new Error("Codex did not provide a turn id");
      }
      active.turnId = turnId;
    } catch (error) {
      await this.#finishAppServerRun(active, "failed", error);
      throw error;
    }
    return run;
  }
  #remoteAttachmentInput(attachment) {
    const url = `data:${attachment.contentType};base64,${attachment.data.toString("base64")}`;
    if (CODEX_IMAGE_TYPES.has(attachment.contentType)) return { type: "image", url };
    if (attachment.contentType.startsWith("audio/")) return { type: "audio", url };
    return {
      type: "text",
      text: `

Attached file ${attachment.filename}: ${url}`
    };
  }
  async #startRemoteTurn(thread, input, resolved, selectedSkills) {
    const userInput = [];
    const messageParts = input.message.split(SKILL_MARKER2);
    for (const [index, text] of messageParts.entries()) {
      if (text) userInput.push({ type: "text", text });
      const skill = selectedSkills[index];
      if (skill) userInput.push({ type: "skill", name: skill.id, path: skill.path });
    }
    for (const attachment of input.attachments ?? []) {
      userInput.push(this.#remoteAttachmentInput(attachment));
    }
    const userEventData = {};
    if (selectedSkills.length > 0) userEventData.skillIds = selectedSkills.map((skill) => skill.id);
    if ((input.attachments ?? []).length > 0) {
      userEventData.attachments = input.attachments.map(({ filename, contentType, size }) => ({
        filename,
        contentType,
        size
      }));
    }
    return this.#startAppServerRun({
      thread,
      resolved,
      appServer: this.#runtimeForTarget(resolved).appServer,
      userInput,
      userEvent: {
        content: input.message,
        data: Object.keys(userEventData).length > 0 ? userEventData : void 0
      }
    });
  }
  async #startComposerTurn(thread, input) {
    if (thread.sandbox === "danger-full-access" && input.dangerFullAccessConfirmed !== true) {
      throw new ApiError(
        400,
        "DANGER_CONFIRMATION_REQUIRED",
        "danger-full-access must be confirmed for every turn"
      );
    }
    const codexTarget = codexTargetFromOrigin(thread.origin);
    const resolved = await this.resolveContext(
      thread.origin.projectId,
      thread.origin.issueId,
      codexTarget
    );
    const runtime = this.#runtimeForTarget(resolved);
    thread = this.getThread(thread.id);
    if (this.#threadIsActive(thread)) {
      throw new ApiError(409, "THREAD_BUSY", `AI chat thread '${thread.id}' has a running turn`);
    }
    if (resolved.workspacePath !== thread.origin.workspacePath) {
      throw new ApiError(
        409,
        "PROJECT_WORKSPACE_CHANGED",
        "The project's device workspace no longer matches this conversation"
      );
    }
    const nodes = input.document.nodes;
    const unsupportedIndex = nodes.findIndex((node) => !["text", "skill", "agent"].includes(node.type));
    if (unsupportedIndex >= 0) {
      throw new ApiError(
        422,
        "COMPOSER_NODE_UNSUPPORTED",
        `Unsupported composer node at index ${unsupportedIndex}`,
        { nodeIndex: unsupportedIndex }
      );
    }
    const resolvedReferences = nodes.some((node) => node.type === "skill" || node.type === "agent") ? await runtime.composerCatalog.resolveReferences({
      workspacePath: resolved.workspacePath,
      revision: input.revision,
      nodes
    }) : nodes.map(() => null);
    const attachments = input.attachments ?? [];
    if (nodes.every((node) => node.type !== "text" || node.text.trim() === "") && !nodes.some((node) => node.type === "skill" || node.type === "agent") && attachments.length === 0) {
      throw new ApiError(
        400,
        "INVALID_COMPOSER_DOCUMENT",
        "A composer message or at least one attachment is required"
      );
    }
    const { temporaryDirectory, attachmentPaths } = resolved.codexProjectKind === "remote" ? { temporaryDirectory: null, attachmentPaths: [] } : await this.#writeTurnAttachments(attachments);
    try {
      const userInput = nodes.flatMap((node, nodeIndex) => {
        if (node.type === "text") return { type: "text", text: node.text };
        const reference = resolvedReferences[nodeIndex];
        if (node.type === "skill") {
          return [
            { type: "text", text: `$${reference.name}` },
            { type: "skill", name: reference.name, path: reference.path }
          ];
        }
        return { type: "text", text: agentDispatchText(reference) };
      });
      for (const [index, attachment] of attachments.entries()) {
        if (resolved.codexProjectKind === "remote") {
          userInput.push(this.#remoteAttachmentInput(attachment));
          continue;
        }
        const attachmentPath = attachmentPaths[index];
        if (CODEX_IMAGE_TYPES.has(attachment.contentType)) {
          userInput.push({ type: "localImage", path: attachmentPath });
        } else {
          userInput.push({ type: "text", text: `

Attached file: ${attachmentPath}` });
        }
      }
      const agentDispatches = nodes.flatMap((node, nodeIndex) => {
        if (node.type !== "agent") return [];
        const reference = resolvedReferences[nodeIndex];
        return [{ nodeIndex, id: reference.id, name: reference.name }];
      });
      const run = await this.#startAppServerRun({
        thread,
        resolved,
        appServer: runtime.appServer,
        userInput,
        temporaryDirectory,
        userEvent: {
          content: nodes.map((node) => node.type === "text" ? node.text : `@${node.label}`).join(""),
          data: {
            contractVersion: "composer.v1",
            revision: input.revision,
            document: input.document,
            ...agentDispatches.length > 0 ? {
              dispatchProtocol: AGENT_DISPATCH_PROTOCOL,
              agentDispatches
            } : {},
            ...attachments.length > 0 ? {
              attachments: attachments.map(({ filename, contentType, size }) => ({
                filename,
                contentType,
                size
              }))
            } : {}
          }
        }
      });
      return run;
    } catch (error) {
      if (temporaryDirectory && ![...this.active.values()].some(
        (active) => active.temporaryDirectory === temporaryDirectory
      )) {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
      throw error;
    }
  }
  #handleAppServerNotification(appServer, notification) {
    const params = notification?.params;
    if (!params || typeof params !== "object") return;
    const active = [...this.active.values()].find((candidate) => candidate.kind === "app-server" && candidate.appServer === appServer && candidate.appServerThreadId === params.threadId && (!candidate.turnId || !params.turnId || candidate.turnId === params.turnId));
    if (!active) return;
    if (notification.method === "turn/started") {
      if (typeof params.turn?.id === "string") active.turnId = params.turn.id;
      return;
    }
    if (notification.method === "item/completed") {
      const normalized = normalizedAppServerItem(params.item);
      if (!normalized) return;
      const event = this.database.insertAiChatEvent({
        threadId: active.threadId,
        runId: active.run.id,
        ...normalized
      });
      this.#emit(active.threadId, { type: "ai.event", event });
      return;
    }
    if (notification.method !== "turn/completed") return;
    const status = params.turn?.status;
    if (active.interrupted || status === "interrupted") {
      void this.#finishAppServerRun(active, "interrupted");
    } else if (status === "completed") {
      void this.#finishAppServerRun(active, "completed");
    } else {
      void this.#finishAppServerRun(
        active,
        "failed",
        params.turn?.error?.message ?? "Codex reported a failed turn"
      );
    }
  }
  async #finishAppServerRun(active, status, error) {
    if (!this.active.has(active.run.id)) return this.getRun(active.run.id);
    let publicError = null;
    if (status === "interrupted") publicError = "Interrupted";
    if (status === "failed") publicError = cappedError(error) || "Codex turn failed";
    try {
      if (status === "failed") {
        const errorEvent = this.database.insertAiChatEvent({
          threadId: active.threadId,
          runId: active.run.id,
          type: "error",
          role: "error",
          content: publicError,
          data: { status: "failed" }
        });
        this.#emit(active.threadId, { type: "ai.event", event: errorEvent });
      }
      const run = this.database.updateAiChatRun(active.run.id, {
        status,
        exitCode: null,
        error: publicError,
        finishedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.#emit(active.threadId, { type: "ai.run", run });
      return run;
    } finally {
      this.active.delete(active.run.id);
      if (active.temporaryDirectory) {
        await rm(active.temporaryDirectory, { recursive: true, force: true });
      }
      active.resolveCompletion();
    }
  }
  async #writeTurnAttachments(attachments) {
    if (attachments.length === 0) {
      return { temporaryDirectory: null, attachmentPaths: [], imagePaths: [] };
    }
    const temporaryDirectory = await mkdtemp(
      path5.join(os3.tmpdir(), "codex-taskboard-ai-turn-")
    );
    try {
      const attachmentPaths = [];
      const imagePaths = [];
      for (const [index, attachment] of attachments.entries()) {
        const attachmentPath = path5.join(
          temporaryDirectory,
          `attachment-${index + 1}-${attachment.filename}`
        );
        await writeFile(attachmentPath, attachment.data, { flag: "wx", mode: 384 });
        attachmentPaths.push(attachmentPath);
        if (CODEX_IMAGE_TYPES.has(attachment.contentType)) imagePaths.push(attachmentPath);
      }
      return { temporaryDirectory, attachmentPaths, imagePaths };
    } catch (error) {
      await rm(temporaryDirectory, { recursive: true, force: true });
      throw error;
    }
  }
  #threadIsActive(thread) {
    return Boolean(thread.currentRun) || [...this.active.values()].some((active) => active.threadId === thread.id);
  }
  async #finishRun({
    run,
    active,
    result,
    error,
    resumingThreadId,
    startedThreadId,
    terminalOutcome,
    terminalError,
    pendingError
  }) {
    let status;
    let publicError = null;
    if (active.interrupted) {
      status = "interrupted";
      publicError = "Interrupted";
    } else if (error) {
      status = "failed";
      publicError = cappedError(error) || "Codex turn failed";
    } else if (terminalOutcome() === "failed") {
      status = "failed";
      publicError = terminalError() || "Codex reported a failed turn";
    } else if (result.exitCode !== 0) {
      status = "failed";
      publicError = result.exitCode === null ? `Codex exited due to signal ${result.signal ?? "unknown"}` : `Codex exited with code ${result.exitCode}`;
    } else if (terminalOutcome() !== "completed") {
      status = "failed";
      publicError = pendingError() || "Codex exited without reporting turn completion";
    } else if (!resumingThreadId && !startedThreadId()) {
      status = "failed";
      publicError = "Codex did not provide a thread id";
    } else {
      status = "completed";
    }
    try {
      if (status === "failed" && terminalOutcome() !== "failed") {
        const errorEvent = this.database.insertAiChatEvent({
          threadId: run.threadId,
          runId: run.id,
          type: "error",
          role: "error",
          content: cappedError(publicError),
          data: { status: "failed" }
        });
        this.#emit(run.threadId, { type: "ai.event", event: errorEvent });
      }
      const updated = this.database.updateAiChatRun(run.id, {
        status,
        exitCode: result?.exitCode ?? null,
        error: publicError === null ? null : cappedError(publicError),
        finishedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.#emit(run.threadId, { type: "ai.run", run: updated });
      return updated;
    } finally {
      this.active.delete(run.id);
      if (active.temporaryDirectory) {
        await rm(active.temporaryDirectory, { recursive: true, force: true });
      }
    }
  }
  #emit(threadId, event) {
    for (const listener of this.listeners.get(threadId) ?? []) {
      try {
        listener(event);
      } catch {
      }
    }
  }
};

// server/cloud-config.mjs
import { mkdir, readFile as readFile2, rename, writeFile as writeFile2 } from "node:fs/promises";
import path6 from "node:path";
var CONFIG_VERSION = 2;
var CloudConfigError = class extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CloudConfigError";
    this.code = code;
  }
};
function emptyConfig() {
  return {
    version: CONFIG_VERSION,
    remoteUrl: null,
    actorName: null,
    accessToken: null,
    projectMappings: {}
  };
}
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
function validateCredentials(actorName, accessToken) {
  if (typeof actorName !== "string" || !actorName.trim() || actorName.length > 120 || actorName.includes(":")) {
    throw new CloudConfigError(
      "INVALID_CLOUD_ACTOR",
      "Cloud actor name must be 1 to 120 characters and cannot contain ':'"
    );
  }
  if (typeof accessToken !== "string" || !accessToken || accessToken.length > 4096) {
    throw new CloudConfigError(
      "INVALID_CLOUD_TOKEN",
      "Cloud access token must be 1 to 4096 characters"
    );
  }
  return { actorName: actorName.trim(), accessToken };
}
function validateProjectMappings(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new CloudConfigError("INVALID_CLOUD_CONFIG", "Cloud project mappings are invalid");
  }
  const projectMappings = {};
  for (const [projectId, workspacePath] of Object.entries(value)) {
    if (!projectId || typeof workspacePath !== "string" || !path6.isAbsolute(workspacePath)) {
      throw new CloudConfigError("INVALID_CLOUD_CONFIG", "Cloud project mappings are invalid");
    }
    projectMappings[projectId] = workspacePath;
  }
  return projectMappings;
}
function parseConfig(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value) && value.version === 1) {
    return {
      ...emptyConfig(),
      projectMappings: validateProjectMappings(value.projectMappings)
    };
  }
  if (value === null || typeof value !== "object" || Array.isArray(value) || value.version !== CONFIG_VERSION) {
    throw new CloudConfigError("INVALID_CLOUD_CONFIG", "Cloud companion configuration is invalid");
  }
  const allowedKeys = /* @__PURE__ */ new Set([
    "version",
    "remoteUrl",
    "actorName",
    "accessToken",
    "projectMappings"
  ]);
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) {
    throw new CloudConfigError("INVALID_CLOUD_CONFIG", "Cloud companion configuration is invalid");
  }
  const projectMappings = validateProjectMappings(value.projectMappings);
  if (value.remoteUrl === null && value.actorName === null && value.accessToken === null) {
    return { ...emptyConfig(), projectMappings };
  }
  const credentials = validateCredentials(value.actorName, value.accessToken);
  return {
    version: CONFIG_VERSION,
    remoteUrl: normalizeCloudUrl(value.remoteUrl),
    ...credentials,
    projectMappings
  };
}
function createCloudConfigStore({ configPath }) {
  if (!configPath) throw new Error("configPath is required");
  let pendingWrite = Promise.resolve();
  async function readFromDisk() {
    try {
      return parseConfig(JSON.parse(await readFile2(configPath, "utf8")));
    } catch (error) {
      if (error?.code === "ENOENT") return emptyConfig();
      throw error;
    }
  }
  async function writeAtomically(config) {
    await mkdir(path6.dirname(configPath), { recursive: true });
    const temporaryPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile2(temporaryPath, `${JSON.stringify(config, null, 2)}
`, { mode: 384 });
    await rename(temporaryPath, configPath);
  }
  function update(mutator) {
    const operation = pendingWrite.then(async () => {
      const next = mutator(await readFromDisk());
      await writeAtomically(next);
      return next;
    });
    pendingWrite = operation.catch(() => {
    });
    return operation;
  }
  return {
    async read() {
      await pendingWrite;
      return readFromDisk();
    },
    async configure({ remoteUrl, actorName, accessToken }) {
      const normalizedUrl = normalizeCloudUrl(remoteUrl);
      const credentials = validateCredentials(actorName, accessToken);
      return update((config) => ({
        ...config,
        remoteUrl: normalizedUrl,
        ...credentials
      }));
    },
    clearCloud() {
      return update((config) => ({
        ...config,
        remoteUrl: null,
        actorName: null,
        accessToken: null
      }));
    },
    setProjectWorkspace(projectId, workspacePath) {
      if (typeof projectId !== "string" || !projectId.trim()) {
        throw new CloudConfigError("INVALID_PROJECT_MAPPING", "projectId is required");
      }
      if (typeof workspacePath !== "string" || !path6.isAbsolute(workspacePath)) {
        throw new CloudConfigError(
          "INVALID_PROJECT_MAPPING",
          "workspacePath must be absolute"
        );
      }
      return update((config) => ({
        ...config,
        projectMappings: {
          ...config.projectMappings,
          [projectId]: workspacePath
        }
      }));
    }
  };
}

// server/cloud-proxy.mjs
import path7 from "node:path";
var LOCAL_COMPANION_ROUTES = /* @__PURE__ */ new Set([
  "/health",
  "/api/meta",
  "/api/device-workspaces",
  "/api/local/cloud-session"
]);
var CloudProxyError = class extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "CloudProxyError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
};
function isLocalCompanionRoute(pathname) {
  return LOCAL_COMPANION_ROUTES.has(pathname) || pathname.startsWith("/api/local/") || /^\/api\/projects\/[^/]+\/development-contexts$/.test(pathname);
}
function basicAuthorization(actorName, accountPassword) {
  return `Basic ${Buffer.from(`${actorName}:${accountPassword}`, "utf8").toString("base64")}`;
}
async function prepareRequest(request, {
  assertTaskProjectMoveAllowed,
  resolveThreadBinding
} = {}) {
  const url = new URL(request.url);
  let projectWorkspace = null;
  let body = request.body;
  const isJson = request.headers.get("content-type")?.includes("application/json");
  const isProjectCreate = request.method === "POST" && url.pathname === "/api/projects";
  const taskPatchMatch = request.method === "PATCH" ? url.pathname.match(/^\/api\/tasks\/([^/]+)$/) : null;
  const isTaskMutation = request.method === "POST" && url.pathname === "/api/tasks" || Boolean(taskPatchMatch);
  const isConversationMutation = request.method !== "GET" && (/^\/api\/tasks(?:\/|$)/.test(url.pathname) || /^\/api\/comments\//.test(url.pathname));
  if (isJson && (isProjectCreate || isTaskMutation || isConversationMutation)) {
    let payload;
    try {
      payload = await request.clone().json();
    } catch {
      throw new CloudProxyError(400, "INVALID_JSON", "Request body must contain valid JSON");
    }
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
      throw new CloudProxyError(400, "INVALID_BODY", "Request body must be a JSON object");
    }
    if (taskPatchMatch && typeof payload.projectId === "string" && typeof assertTaskProjectMoveAllowed === "function") {
      let taskId;
      try {
        taskId = decodeURIComponent(taskPatchMatch[1]);
      } catch {
        throw new CloudProxyError(400, "INVALID_PATH", "Task id contains invalid encoding");
      }
      await assertTaskProjectMoveAllowed(taskId, payload.projectId);
    }
    if (isProjectCreate && Object.hasOwn(payload, "workspacePath")) {
      if (typeof payload.workspacePath === "string") {
        if (!path7.isAbsolute(payload.workspacePath)) {
          throw new CloudProxyError(
            400,
            "INVALID_PROJECT_MAPPING",
            "Project workspacePath must be absolute"
          );
        }
        projectWorkspace = {
          projectId: typeof payload.id === "string" ? payload.id : null,
          workspacePath: payload.workspacePath
        };
      }
      delete payload.workspacePath;
    }
    if (isTaskMutation && payload.developmentContext?.type === "worktree") {
      payload.developmentContext = {
        type: "worktree",
        ...payload.developmentContext.branch === void 0 ? {} : { branch: payload.developmentContext.branch }
      };
    }
    if (isConversationMutation && typeof payload.threadId === "string" && !Object.hasOwn(payload, "threadBinding") && typeof resolveThreadBinding === "function") {
      const threadBinding = resolveThreadBinding(payload.threadId);
      if (threadBinding) payload.threadBinding = threadBinding;
    }
    body = JSON.stringify(payload);
  }
  return { body, projectWorkspace };
}
async function localizeTask(task, resolveDevelopmentContext) {
  if (!task || typeof task !== "object" || task.developmentContext?.type !== "worktree") {
    return task;
  }
  const cloudContext = {
    type: "worktree",
    ...task.developmentContext.branch === void 0 ? {} : { branch: task.developmentContext.branch }
  };
  const localContext = resolveDevelopmentContext ? await resolveDevelopmentContext(task.projectId, cloudContext) : null;
  return {
    ...task,
    developmentContext: localContext ?? { ...cloudContext, path: null }
  };
}
async function localizeResponse(response, { readConfig, setProjectWorkspace, projectWorkspace, resolveDevelopmentContext }) {
  if (response.status === 401) return response;
  if (!response.headers.get("content-type")?.includes("application/json")) return response;
  const payload = await response.json();
  if (response.ok && projectWorkspace) {
    const projectId = projectWorkspace.projectId ?? payload.project?.id;
    if (projectId) {
      await setProjectWorkspace(projectId, projectWorkspace.workspacePath);
    }
  }
  const config = await readConfig();
  if (Array.isArray(payload.projects)) {
    payload.projects = payload.projects.map((project) => ({
      ...project,
      workspacePath: project.id === DEFAULT_PROJECT_ID ? null : config.projectMappings[project.id] ?? null
    }));
  }
  if (payload.project && typeof payload.project === "object") {
    payload.project = {
      ...payload.project,
      workspacePath: payload.project.id === DEFAULT_PROJECT_ID ? null : config.projectMappings[payload.project.id] ?? null
    };
  }
  if (payload.task) {
    payload.task = await localizeTask(payload.task, resolveDevelopmentContext);
  }
  if (Array.isArray(payload.tasks)) {
    const contexts = /* @__PURE__ */ new Map();
    const resolveOnce = resolveDevelopmentContext ? (projectId, context) => {
      const key = `${projectId ?? ""}\0${context.branch ?? ""}`;
      if (!contexts.has(key)) {
        contexts.set(key, resolveDevelopmentContext(projectId, context));
      }
      return contexts.get(key);
    } : null;
    payload.tasks = await Promise.all(
      payload.tasks.map((task) => localizeTask(task, resolveOnce))
    );
  }
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(JSON.stringify(payload), {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
function createCloudProxy({
  configStore,
  getConfig,
  fetch: fetchImplementation = globalThis.fetch,
  resolveDevelopmentContext,
  assertTaskProjectMoveAllowed,
  resolveThreadBinding
}) {
  const readConfig = getConfig ?? (() => configStore.read());
  const setProjectWorkspace = configStore?.setProjectWorkspace?.bind(configStore);
  return {
    async webSocketTarget(pathname = "/api/events") {
      const config = await readConfig();
      if (!config?.remoteUrl || !config.actorName || !config.sharedKey) {
        throw new CloudProxyError(
          409,
          "CLOUD_NOT_CONFIGURED",
          "Cloud collaboration is not configured"
        );
      }
      let remoteUrl;
      try {
        remoteUrl = normalizeCloudUrl(config.remoteUrl);
      } catch (error) {
        throw new CloudProxyError(
          500,
          "INVALID_CLOUD_CONFIG",
          error instanceof Error ? error.message : String(error)
        );
      }
      const url = new URL(pathname, `${remoteUrl}/`);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      return {
        url: url.href,
        headers: { authorization: basicAuthorization(config.actorName, config.sharedKey) }
      };
    },
    async forward(request) {
      const config = await readConfig();
      if (!config?.remoteUrl || !config.actorName || !config.accessToken) {
        throw new CloudProxyError(
          409,
          "CLOUD_NOT_CONFIGURED",
          "Cloud collaboration is not configured"
        );
      }
      let remoteUrl;
      try {
        remoteUrl = normalizeCloudUrl(config.remoteUrl);
      } catch (error) {
        throw new CloudProxyError(
          500,
          "INVALID_CLOUD_CONFIG",
          error instanceof Error ? error.message : String(error)
        );
      }
      const sourceUrl = new URL(request.url);
      const upstreamUrl = new URL(
        `${sourceUrl.pathname}${sourceUrl.search}`,
        `${remoteUrl}/`
      );
      const headers = new Headers(request.headers);
      headers.delete("authorization");
      headers.delete("host");
      headers.delete("connection");
      headers.delete("transfer-encoding");
      headers.delete("accept-encoding");
      for (const name of [...headers.keys()]) {
        if (name.toLowerCase().startsWith("x-taskboard-user-")) headers.delete(name);
      }
      headers.set("authorization", `Bearer ${config.accessToken}`);
      const prepared = await prepareRequest(request, {
        assertTaskProjectMoveAllowed,
        resolveThreadBinding
      });
      if (prepared.projectWorkspace && !setProjectWorkspace) {
        throw new CloudProxyError(
          500,
          "PROJECT_MAPPING_UNAVAILABLE",
          "Local project mapping storage is unavailable"
        );
      }
      if (typeof prepared.body === "string") headers.delete("content-length");
      const init = {
        method: request.method,
        headers,
        redirect: "manual"
      };
      if (request.method !== "GET" && request.method !== "HEAD" && prepared.body !== null) {
        init.body = prepared.body;
        if (typeof prepared.body !== "string") init.duplex = "half";
      }
      let response;
      try {
        response = await fetchImplementation(upstreamUrl, init);
      } catch (error) {
        throw new CloudProxyError(
          502,
          "REMOTE_UNAVAILABLE",
          `Cannot reach cloud taskboard at ${remoteUrl}`,
          error instanceof Error ? error.message : String(error)
        );
      }
      return localizeResponse(response, {
        readConfig,
        setProjectWorkspace,
        projectWorkspace: prepared.projectWorkspace,
        resolveDevelopmentContext
      });
    }
  };
}

// server/jira-config.mjs
import { chmod, mkdir as mkdir2, readFile as readFile3, rename as rename2, unlink, writeFile as writeFile3 } from "node:fs/promises";
import path8 from "node:path";
var CONFIG_VERSION2 = 2;
var LEGACY_CONFIG_VERSION = 1;
var JiraConfigError = class extends Error {
  constructor(code, message) {
    super(message);
    this.name = "JiraConfigError";
    this.code = code;
  }
};
function normalizeJiraUrl(value) {
  if (typeof value !== "string" || value.includes("?") || value.includes("#")) {
    throw new JiraConfigError(
      "INVALID_JIRA_URL",
      "Jira \u5730\u5740\u5FC5\u987B\u4F7F\u7528 http \u6216 https\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5"
    );
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new JiraConfigError("INVALID_JIRA_URL", "Jira \u5730\u5740\u65E0\u6548");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new JiraConfigError(
      "INVALID_JIRA_URL",
      "Jira \u5730\u5740\u5FC5\u987B\u4F7F\u7528 http \u6216 https\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B\u8D26\u53F7\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5"
    );
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}
function validateCredentials2(username, password) {
  if (typeof username !== "string" || !username.trim() || username.length > 254 || username.includes(":")) {
    throw new JiraConfigError(
      "INVALID_JIRA_USERNAME",
      "Jira \u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A\u3001\u4E0D\u80FD\u5305\u542B\u5192\u53F7\uFF0C\u4E14\u4E0D\u80FD\u8D85\u8FC7 254 \u4E2A\u5B57\u7B26"
    );
  }
  if (typeof password !== "string" || !password || password.length > 4096) {
    throw new JiraConfigError(
      "INVALID_JIRA_PASSWORD",
      "Jira \u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A\u4E14\u4E0D\u80FD\u8D85\u8FC7 4096 \u4E2A\u5B57\u7B26"
    );
  }
  return { username: username.trim(), password };
}
function validateProjects(value) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > 20) {
    throw new JiraConfigError("INVALID_JIRA_PROJECTS", "Jira \u9879\u76EE\u5FC5\u987B\u662F\u6700\u591A 20 \u9879\u7684\u6570\u7EC4");
  }
  const projects = value.map((project) => {
    if (typeof project !== "string" || !project.trim() || project.length > 128 || /[\u0000-\u001f\u007f]/.test(project)) {
      throw new JiraConfigError(
        "INVALID_JIRA_PROJECTS",
        "Jira \u9879\u76EE\u540D\u79F0\u6216 Key \u4E0D\u80FD\u4E3A\u7A7A\u3001\u4E0D\u80FD\u5305\u542B\u63A7\u5236\u5B57\u7B26\uFF0C\u4E14\u4E0D\u80FD\u8D85\u8FC7 128 \u4E2A\u5B57\u7B26"
      );
    }
    return project.trim();
  });
  return [...new Set(projects)];
}
function parseConfig2(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value) || value.version !== LEGACY_CONFIG_VERSION && value.version !== CONFIG_VERSION2) {
    throw new JiraConfigError("INVALID_JIRA_CONFIG", "Jira \u914D\u7F6E\u6587\u4EF6\u65E0\u6548");
  }
  const allowedKeys = /* @__PURE__ */ new Set([
    "version",
    "baseUrl",
    "username",
    "password",
    "originId",
    "displayName",
    "projects"
  ]);
  if (value.version === LEGACY_CONFIG_VERSION) allowedKeys.delete("originId");
  if (Object.keys(value).some((key) => !allowedKeys.has(key))) {
    throw new JiraConfigError("INVALID_JIRA_CONFIG", "Jira \u914D\u7F6E\u6587\u4EF6\u5305\u542B\u672A\u77E5\u5B57\u6BB5");
  }
  const credentials = validateCredentials2(value.username, value.password);
  if (value.version === CONFIG_VERSION2 && (typeof value.originId !== "string" || !/^[a-f0-9]{64}$/.test(value.originId))) {
    throw new JiraConfigError("INVALID_JIRA_CONFIG", "Jira \u914D\u7F6E\u7F3A\u5C11\u7A33\u5B9A\u5B9E\u4F8B\u8EAB\u4EFD");
  }
  if (typeof value.displayName !== "string" || !value.displayName.trim()) {
    throw new JiraConfigError("INVALID_JIRA_CONFIG", "Jira \u914D\u7F6E\u7F3A\u5C11\u7528\u6237\u663E\u793A\u540D\u79F0");
  }
  return {
    version: value.version,
    baseUrl: normalizeJiraUrl(value.baseUrl),
    ...credentials,
    ...value.version === CONFIG_VERSION2 ? { originId: value.originId } : {},
    displayName: value.displayName.trim().slice(0, 254),
    projects: validateProjects(value.projects)
  };
}
function createJiraConfigStore({ configPath }) {
  if (!configPath) throw new Error("configPath is required");
  let pendingWrite = Promise.resolve();
  async function readFromDisk() {
    try {
      return parseConfig2(JSON.parse(await readFile3(configPath, "utf8")));
    } catch (error) {
      if (error?.code === "ENOENT") return null;
      throw error;
    }
  }
  async function writeAtomically(config) {
    await mkdir2(path8.dirname(configPath), { recursive: true });
    const temporaryPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile3(temporaryPath, `${JSON.stringify(config, null, 2)}
`, { mode: 384 });
    await chmod(temporaryPath, 384);
    await rename2(temporaryPath, configPath);
    await chmod(configPath, 384);
  }
  return {
    async read() {
      await pendingWrite;
      return readFromDisk();
    },
    async save(input) {
      const config = parseConfig2({ ...input, version: CONFIG_VERSION2 });
      const operation = pendingWrite.catch(() => {
      }).then(async () => {
        await writeAtomically(config);
        return config;
      });
      pendingWrite = operation.catch(() => {
      });
      return operation;
    },
    async clear() {
      await pendingWrite;
      try {
        await unlink(configPath);
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }
    },
    validate({ baseUrl, username, password, projects }) {
      return {
        baseUrl: normalizeJiraUrl(baseUrl),
        ...validateCredentials2(username, password),
        projects: validateProjects(projects)
      };
    }
  };
}

// server/jira-integration.mjs
import { createHash } from "node:crypto";
var JIRA_FIELDS = [
  "summary",
  "description",
  "status",
  "priority",
  "labels",
  "duedate",
  "assignee",
  "reporter",
  "created",
  "updated"
];
var SYNC_INTERVAL_MS = 6e4;
var REQUEST_TIMEOUT_MS = 2e4;
function quoteJqlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function buildJiraJql(projects = []) {
  const projectFilter = projects.length > 0 ? ` AND project in (${projects.map(quoteJqlString).join(", ")})` : "";
  return `assignee = currentUser()${projectFilter} AND (statusCategory != Done OR updated >= -30d) ORDER BY updated DESC`;
}
function includesAny(value, terms) {
  const normalized = String(value ?? "").toLowerCase();
  return terms.some((term) => normalized.includes(term));
}
function limitedString(value, fallback, maxLength) {
  const result = String(value ?? fallback).trim();
  return (result || fallback).slice(0, maxLength);
}
function taskStatusFromJira(status) {
  const name = status?.name ?? "";
  const category = status?.statusCategory?.key;
  if (category === "done") {
    return includesAny(name, ["cancel", "reject", "\u53D6\u6D88", "\u62D2\u7EDD"]) ? "canceled" : "done";
  }
  if (category === "new") {
    return includesAny(name, ["backlog", "\u5F85\u7ACB\u9879", "\u9700\u6C42\u6C60"]) ? "backlog" : "todo";
  }
  if (includesAny(name, ["review", "verify", "test", "\u9A8C\u6536", "\u8BC4\u5BA1", "\u6D4B\u8BD5"])) {
    return "in_review";
  }
  if (includesAny(name, ["block", "hold", "\u963B\u585E", "\u6302\u8D77"])) return "blocked";
  return "in_progress";
}
function taskPriorityFromJira(priority) {
  const name = priority?.name ?? "";
  if (includesAny(name, ["highest", "critical", "blocker", "urgent", "\u7D27\u6025", "\u6700\u9AD8"])) {
    return "urgent";
  }
  if (includesAny(name, ["high", "major", "\u9AD8"])) return "high";
  if (includesAny(name, ["medium", "normal", "\u4E2D"])) return "medium";
  if (includesAny(name, ["low", "minor", "trivial", "\u4F4E"])) return "low";
  return "none";
}
function actorFromJira(user, fallback) {
  const id = limitedString(user?.key ?? user?.name ?? user?.accountId, fallback, 240);
  return {
    type: "user",
    id: `jira:${id}`,
    name: limitedString(user?.displayName ?? user?.name, fallback, 120),
    avatarUrl: user?.avatarUrls?.["48x48"] ?? user?.avatarUrls?.["32x32"] ?? null
  };
}
function jiraOriginId(manifest) {
  const applicationId = typeof manifest?.id === "string" ? manifest.id.trim() : "";
  if (!applicationId) {
    throw new ApiError(502, "INVALID_JIRA_ORIGIN", "Jira \u672A\u8FD4\u56DE\u7A33\u5B9A\u7684\u5B9E\u4F8B\u8EAB\u4EFD");
  }
  return createHash("sha256").update(applicationId).digest("hex");
}
function legacyJiraOriginId(baseUrl) {
  return createHash("sha256").update(baseUrl).digest("hex").slice(0, 16);
}
function normalizeIssue(issue, config, index = 0) {
  const fields = issue?.fields ?? {};
  const externalId = String(issue.id);
  const externalKey = limitedString(issue.key, "JIRA", 128);
  const internalId = `JIRA:${config.originId.toUpperCase()}:${externalId}`;
  const assignee = actorFromJira(fields.assignee, config.displayName);
  const reporter = actorFromJira(fields.reporter, config.displayName);
  const labels = Array.isArray(fields.labels) ? [...new Set(fields.labels.flatMap((label) => {
    if (typeof label !== "string") return [];
    const normalized = label.trim().slice(0, 64);
    return normalized ? [normalized] : [];
  }))].slice(0, 20) : [];
  return {
    id: internalId,
    identifier: internalId,
    title: limitedString(fields.summary, externalKey, 240),
    description: typeof fields.description === "string" ? fields.description.slice(0, 1e5) : "",
    status: taskStatusFromJira(fields.status),
    priority: taskPriorityFromJira(fields.priority),
    labels,
    sortOrder: (index + 1) * 1024,
    creator: reporter,
    assignee,
    dueDate: typeof fields.duedate === "string" ? fields.duedate : null,
    externalOrigin: config.originId,
    externalId,
    externalKey,
    externalUrl: `${config.baseUrl}/browse/${encodeURIComponent(externalKey)}`,
    createdAt: typeof fields.created === "string" ? fields.created : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: typeof fields.updated === "string" ? fields.updated : (/* @__PURE__ */ new Date()).toISOString()
  };
}
function safeConfig(config, lastSyncedAt = null) {
  return config ? {
    configured: true,
    baseUrl: config.baseUrl,
    username: null,
    displayName: config.displayName,
    projects: config.projects,
    projectId: JIRA_PROJECT_ID,
    lastSyncedAt,
    insecureHttp: config.baseUrl.startsWith("http:")
  } : {
    configured: false,
    baseUrl: null,
    username: null,
    displayName: null,
    projects: [],
    projectId: JIRA_PROJECT_ID,
    lastSyncedAt: null,
    insecureHttp: false
  };
}
function createJiraIntegration({ configStore, database, fetch: fetchImplementation = globalThis.fetch }) {
  let lastSyncedAt = null;
  let pendingSync = null;
  async function request(config, pathname, init = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    timeout.unref?.();
    let response;
    try {
      response = await fetchImplementation(`${config.baseUrl}${pathname}`, {
        ...init,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          accept: "application/json",
          authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`, "utf8").toString("base64")}`,
          ...init.body ? { "content-type": "application/json" } : {},
          ...init.headers
        }
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "AbortError";
      throw new ApiError(
        502,
        timedOut ? "JIRA_TIMEOUT" : "JIRA_UNAVAILABLE",
        timedOut ? "\u8FDE\u63A5 Jira \u8D85\u65F6" : "\u65E0\u6CD5\u8FDE\u63A5 Jira\uFF0C\u8BF7\u68C0\u67E5\u5730\u5740\u548C\u5185\u7F51\u8FDE\u63A5"
      );
    } finally {
      clearTimeout(timeout);
    }
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(
        401,
        "JIRA_AUTH_FAILED",
        "Jira \u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7528\u6237\u540D\u3001\u5BC6\u7801\u3001Basic Auth \u6216 CAPTCHA \u72B6\u6001"
      );
    }
    if (response.status >= 300 && response.status < 400) {
      throw new ApiError(400, "JIRA_REDIRECT", "Jira \u5730\u5740\u53D1\u751F\u91CD\u5B9A\u5411\uFF0C\u8BF7\u586B\u5199\u6700\u7EC8\u8BBF\u95EE\u5730\u5740");
    }
    if (!response.ok) {
      throw new ApiError(
        response.status >= 500 ? 502 : 409,
        "JIRA_REQUEST_FAILED",
        `Jira \u8BF7\u6C42\u5931\u8D25\uFF08HTTP ${response.status}\uFF09`
      );
    }
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      throw new ApiError(502, "INVALID_JIRA_RESPONSE", "Jira \u8FD4\u56DE\u4E86\u65E0\u6548\u7684 JSON \u6570\u636E");
    }
  }
  async function fetchAssignedIssues(config) {
    const issues = [];
    let startAt = 0;
    while (true) {
      const page = await request(config, "/rest/api/2/search", {
        method: "POST",
        body: JSON.stringify({
          jql: buildJiraJql(config.projects),
          startAt,
          maxResults: 100,
          fields: JIRA_FIELDS
        })
      });
      const pageIssues = Array.isArray(page?.issues) ? page.issues : [];
      issues.push(...pageIssues);
      startAt += pageIssues.length;
      if (pageIssues.length === 0 || startAt >= Number(page?.total ?? 0)) break;
    }
    return issues;
  }
  async function fetchOriginId(config) {
    return jiraOriginId(await request(config, "/rest/applinks/1.0/manifest"));
  }
  async function assertLiveOrigin(config) {
    if (await fetchOriginId(config) !== config.originId) {
      throw new ApiError(
        409,
        "JIRA_ORIGIN_MISMATCH",
        "\u5F53\u524D Jira \u5730\u5740\u6307\u5411\u4E86\u53E6\u4E00\u4E2A\u5B9E\u4F8B\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5\u540E\u518D\u64CD\u4F5C"
      );
    }
  }
  async function validateConnection(candidate) {
    const originId = await fetchOriginId(candidate);
    const myself = await request(candidate, "/rest/api/2/myself");
    const displayName = String(myself?.displayName ?? myself?.name ?? candidate.username).trim();
    const config = { ...candidate, originId, displayName };
    const issues = await fetchAssignedIssues(config);
    return { config, issues };
  }
  async function syncWithConfig(storedConfig, { archiveMissing = true } = {}) {
    let config = storedConfig;
    let issues;
    let legacyIdentity = null;
    if (storedConfig.version === 1) {
      ({ config, issues } = await validateConnection(storedConfig));
      legacyIdentity = {
        urlHash: legacyJiraOriginId(storedConfig.baseUrl),
        originId: config.originId
      };
    } else {
      await assertLiveOrigin(config);
      issues = await fetchAssignedIssues(config);
    }
    database.syncJiraTasks(
      issues.map((issue, index) => normalizeIssue(issue, config, index)),
      { archiveMissing, projectName: `Jira \xB7 ${config.displayName}`, legacyIdentity }
    );
    if (storedConfig.version === 1) config = await configStore.save(config);
    lastSyncedAt = (/* @__PURE__ */ new Date()).toISOString();
    return safeConfig(config, lastSyncedAt);
  }
  async function sync({ force = false } = {}) {
    const config = await configStore.read();
    if (!config) return safeConfig(null);
    if (!force && lastSyncedAt && Date.now() - new Date(lastSyncedAt).getTime() < SYNC_INTERVAL_MS) {
      return safeConfig(config, lastSyncedAt);
    }
    if (pendingSync) return pendingSync;
    pendingSync = syncWithConfig(config).finally(() => {
      pendingSync = null;
    });
    return pendingSync;
  }
  async function resolveTransition(config, issueKey, targetStatus) {
    const payload = await request(
      config,
      `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions?expand=transitions.fields`
    );
    const transitions = Array.isArray(payload?.transitions) ? payload.transitions : [];
    const matches = transitions.filter((candidate) => taskStatusFromJira(candidate.to) === targetStatus);
    const availableStatuses = transitions.map((candidate) => ({
      id: String(candidate.id),
      name: String(candidate.name ?? candidate.to?.name ?? ""),
      taskboardStatus: taskStatusFromJira(candidate.to)
    }));
    if (matches.length === 0) {
      throw new ApiError(
        409,
        "JIRA_TRANSITION_UNAVAILABLE",
        `Jira \u5F53\u524D\u5DE5\u4F5C\u6D41\u4E0D\u80FD\u5C06 ${issueKey} \u79FB\u5230\u76EE\u6807\u72B6\u6001`,
        { availableStatuses }
      );
    }
    if (matches.length > 1) {
      throw new ApiError(
        409,
        "JIRA_TRANSITION_AMBIGUOUS",
        `Jira \u6709\u591A\u4E2A\u5DE5\u4F5C\u6D41\u64CD\u4F5C\u53EF\u5C06 ${issueKey} \u79FB\u5230\u76EE\u6807\u72B6\u6001\uFF0C\u8BF7\u5728 Jira \u4E2D\u9009\u62E9`,
        {
          availableStatuses: availableStatuses.filter(
            (candidate) => candidate.taskboardStatus === targetStatus
          )
        }
      );
    }
    return matches[0];
  }
  async function applyTransition(config, issueKey, transition) {
    await request(config, `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: String(transition.id) } })
    });
  }
  async function resolveJiraPriority(config, targetPriority) {
    if (targetPriority === "none") return null;
    const priorities = await request(config, "/rest/api/2/priority");
    const match = Array.isArray(priorities) ? priorities.find((priority) => taskPriorityFromJira(priority) === targetPriority) : null;
    if (!match) {
      throw new ApiError(
        409,
        "JIRA_PRIORITY_UNAVAILABLE",
        "Jira \u4E2D\u6CA1\u6709\u53EF\u6620\u5C04\u5230\u8BE5\u4F18\u5148\u7EA7\u7684\u9009\u9879"
      );
    }
    return { id: String(match.id) };
  }
  return {
    async status() {
      return safeConfig(await configStore.read(), lastSyncedAt);
    },
    async configure(input) {
      const current = await configStore.read();
      const username = input.username || current?.username;
      const password = input.password || current?.password;
      const candidate = configStore.validate({ ...input, username, password });
      if (current?.version === 1 && candidate.baseUrl !== current.baseUrl) {
        throw new ApiError(
          409,
          "JIRA_LEGACY_URL_CHANGE_UNAVAILABLE",
          "\u8BF7\u5148\u4F7F\u7528\u539F Jira \u5730\u5740\u5B8C\u6210\u914D\u7F6E\u5347\u7EA7\uFF0C\u518D\u4FEE\u6539\u5730\u5740"
        );
      }
      if (!input.password && (!current || candidate.baseUrl !== current.baseUrl || candidate.username !== current.username)) {
        throw new ApiError(
          400,
          "JIRA_PASSWORD_REQUIRED",
          "\u4FEE\u6539 Jira \u5730\u5740\u6216\u7528\u6237\u540D\u65F6\u5FC5\u987B\u91CD\u65B0\u8F93\u5165\u5BC6\u7801"
        );
      }
      const { config, issues } = await validateConnection(candidate);
      const legacyIdentity = current?.version === 1 ? { urlHash: legacyJiraOriginId(current.baseUrl), originId: config.originId } : null;
      database.syncJiraTasks(
        issues.map((issue, index) => normalizeIssue(issue, config, index)),
        {
          archiveMissing: true,
          projectName: `Jira \xB7 ${config.displayName}`,
          legacyIdentity
        }
      );
      const savedConfig = await configStore.save(config);
      lastSyncedAt = (/* @__PURE__ */ new Date()).toISOString();
      return safeConfig(savedConfig, lastSyncedAt);
    },
    sync,
    async reconcile() {
      const config = await configStore.read();
      if (!config || config.version !== 2) {
        throw new ApiError(409, "JIRA_NOT_CONFIGURED", "Jira \u5C1A\u672A\u5B8C\u6210\u7A33\u5B9A\u8EAB\u4EFD\u914D\u7F6E");
      }
      return syncWithConfig(config, { archiveMissing: false });
    },
    async updateTask(task, changes) {
      const config = await configStore.read();
      if (!config) throw new ApiError(409, "JIRA_NOT_CONFIGURED", "Jira \u5C1A\u672A\u914D\u7F6E");
      if (task.externalOrigin !== config.originId || !task.externalKey) {
        throw new ApiError(
          409,
          "JIRA_ORIGIN_MISMATCH",
          "\u6B64\u4EFB\u52A1\u4E0D\u5C5E\u4E8E\u5F53\u524D Jira \u8FDE\u63A5\uFF0C\u8BF7\u91CD\u65B0\u540C\u6B65\u540E\u518D\u64CD\u4F5C"
        );
      }
      await assertLiveOrigin(config);
      const statusChanged = Object.hasOwn(changes, "status") && changes.status !== task.status;
      const priorityChanged = Object.hasOwn(changes, "priority") && changes.priority !== task.priority;
      const fields = {};
      if (Object.hasOwn(changes, "title") && changes.title !== task.title) fields.summary = changes.title;
      if (Object.hasOwn(changes, "description") && changes.description !== task.description) {
        fields.description = changes.description;
      }
      if (Object.hasOwn(changes, "labels") && JSON.stringify(changes.labels) !== JSON.stringify(task.labels)) {
        fields.labels = changes.labels;
      }
      if (Object.hasOwn(changes, "dueDate") && changes.dueDate !== task.dueDate) {
        fields.duedate = changes.dueDate;
      }
      const fieldsChanged = Object.keys(fields).length > 0 || priorityChanged;
      if (statusChanged && fieldsChanged) {
        throw new ApiError(
          409,
          "JIRA_MULTI_STEP_UPDATE_UNAVAILABLE",
          "\u8BF7\u5206\u5F00\u4FEE\u6539 Jira \u72B6\u6001\u548C\u5176\u4ED6\u5B57\u6BB5"
        );
      }
      if (priorityChanged) {
        fields.priority = await resolveJiraPriority(config, changes.priority);
      }
      const transition = statusChanged ? await resolveTransition(config, task.externalKey, changes.status) : null;
      if (transition) {
        await applyTransition(config, task.externalKey, transition);
        return true;
      }
      if (fieldsChanged) {
        await request(config, `/rest/api/2/issue/${encodeURIComponent(task.externalKey)}`, {
          method: "PUT",
          body: JSON.stringify({ fields })
        });
        return true;
      }
      return false;
    },
    async moveTask(task, status) {
      if (status === task.status) return;
      const config = await configStore.read();
      if (!config) throw new ApiError(409, "JIRA_NOT_CONFIGURED", "Jira \u5C1A\u672A\u914D\u7F6E");
      if (task.externalOrigin !== config.originId || !task.externalKey) {
        throw new ApiError(
          409,
          "JIRA_ORIGIN_MISMATCH",
          "\u6B64\u4EFB\u52A1\u4E0D\u5C5E\u4E8E\u5F53\u524D Jira \u8FDE\u63A5\uFF0C\u8BF7\u91CD\u65B0\u540C\u6B65\u540E\u518D\u64CD\u4F5C"
        );
      }
      await assertLiveOrigin(config);
      const transition = await resolveTransition(config, task.externalKey, status);
      await applyTransition(config, task.externalKey, transition);
    }
  };
}

// server/project-summary.mjs
var DAY_MS = 24 * 60 * 60 * 1e3;
var CHECK_INTERVAL_MS = 60 * 60 * 1e3;
var STATUS_LABELS = {
  backlog: "\u79EF\u538B\u4E8B\u9879",
  todo: "\u5F85\u529E",
  in_progress: "\u5904\u7406\u4E2D",
  in_review: "\u7B49\u4F60\u786E\u8BA4",
  blocked: "\u9047\u5230\u963B\u788D",
  done: "\u5B8C\u6210",
  canceled: "\u53D6\u6D88"
};
function isDue(summary) {
  if (!summary.attemptedAt) return true;
  return Date.now() - new Date(summary.attemptedAt).getTime() >= DAY_MS;
}
function buildPrompt(project, tasks) {
  const counts = Object.fromEntries(Object.keys(STATUS_LABELS).map((status) => [
    STATUS_LABELS[status],
    tasks.filter((task) => task.status === status).length
  ]));
  const recentCutoff = Date.now() - 7 * DAY_MS;
  const issues = tasks.filter((task) => task.status !== "done" && task.status !== "canceled" || new Date(task.activityUpdatedAt).getTime() >= recentCutoff).map((task) => ({
    id: task.identifier,
    title: task.title,
    status: STATUS_LABELS[task.status],
    priority: task.priority,
    labels: task.labels,
    dueDate: task.dueDate,
    updatedAt: task.activityUpdatedAt
  }));
  return [
    "\u4F60\u662F Codex\u3002\u8BF7\u6839\u636E\u4E0B\u9762\u7684\u4EFB\u52A1\u9762\u677F\u5FEB\u7167\uFF0C\u4E3A\u9879\u76EE\u8D1F\u8D23\u4EBA\u5199\u4E00\u6BB5\u9879\u76EE\u603B\u7ED3\u3002",
    "\u8981\u6C42\uFF1A\u53EA\u8F93\u51FA\u4E00\u6BB5 60 \u81F3 120 \u5B57\u7684\u7B80\u4F53\u4E2D\u6587\uFF1B\u76F4\u63A5\u8BF4\u660E\u5F53\u524D\u8FDB\u5C55\u3001\u4E3B\u8981\u98CE\u9669\u6216\u963B\u788D\u3001\u4E0B\u4E00\u6B65\u91CD\u70B9\uFF1B\u4E0D\u8981\u4F7F\u7528\u6807\u9898\u3001\u5217\u8868\u6216 Markdown\uFF1B\u4E0D\u8981\u8C03\u7528\u5DE5\u5177\u3002",
    JSON.stringify({
      project: project.name,
      generatedForDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      counts,
      issues
    })
  ].join("\n\n");
}
var ProjectSummaryService = class {
  constructor(options) {
    this.database = options.database;
    this.codexExecutable = options.codexExecutable;
    this.workspacePath = options.workspacePath;
    this.processEnv = options.processEnv ?? process.env;
    this.active = /* @__PURE__ */ new Map();
    this.closed = false;
    this.timer = setInterval(() => void this.refreshDueProjects(), CHECK_INTERVAL_MS);
    this.timer.unref();
    void this.refreshDueProjects();
  }
  get(projectId) {
    if (!this.database.getProject(projectId)) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' was not found`);
    }
    const summary = this.database.getProjectSummary(projectId);
    if (isDue(summary)) void this.refresh(projectId);
    return {
      projectId,
      summary: summary.summary,
      updatedAt: summary.generatedAt,
      refreshing: this.active.has(projectId),
      error: summary.error
    };
  }
  refresh(projectId) {
    const current = this.active.get(projectId);
    if (current) return current.promise;
    const active = { child: null, promise: null };
    active.promise = this.#generate(projectId, active).finally(() => this.active.delete(projectId));
    this.active.set(projectId, active);
    return active.promise;
  }
  async refreshDueProjects() {
    for (const summary of this.database.listProjectSummaries()) {
      if (isDue(summary)) await this.refresh(summary.projectId);
    }
  }
  async #generate(projectId, active) {
    try {
      const project = this.database.getProject(projectId);
      if (!project) return;
      const tasks = this.database.listTasks({ projectId, archived: "false" });
      let generatedSummary = "";
      let terminalError = "";
      const { child, completion } = spawnCodexTurn({
        executable: this.codexExecutable,
        args: [
          "exec",
          "--ephemeral",
          "--json",
          "--color",
          "never",
          "--skip-git-repo-check",
          "-C",
          this.workspacePath,
          "-s",
          "read-only",
          "-c",
          'approval_policy="never"',
          "-"
        ],
        prompt: buildPrompt(project, tasks),
        env: this.processEnv,
        onRawEvent: (event) => {
          if (event.type === "item.completed" && event.item?.type === "agent_message" && typeof event.item.text === "string") {
            generatedSummary = event.item.text.replace(/\s+/g, " ").trim();
          }
          if (event.type === "turn.failed" || event.type === "error") {
            terminalError = String(event.error?.message ?? event.message ?? "Codex \u751F\u6210\u5931\u8D25");
          }
        }
      });
      active.child = child;
      const result = await completion;
      if (result.exitCode !== 0 || terminalError) {
        throw new Error(terminalError || `Codex \u9000\u51FA\u7801 ${result.exitCode}`);
      }
      if (!generatedSummary) throw new Error("Codex \u6CA1\u6709\u8FD4\u56DE\u9879\u76EE\u603B\u7ED3");
      this.database.saveProjectSummary(projectId, generatedSummary);
    } catch (error) {
      if (!this.closed) {
        this.database.saveProjectSummaryError(
          projectId,
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }
  async close() {
    this.closed = true;
    clearInterval(this.timer);
    const active = [...this.active.values()];
    for (const entry of active) signalProcessTree(entry.child, "SIGTERM");
    await Promise.allSettled(active.map((entry) => entry.promise));
  }
};

// server/app.mjs
var PROJECT_ROOT = path9.resolve(path9.dirname(fileURLToPath2(import.meta.url)), "..");
var execFileAsync2 = promisify2(execFile2);
var JSON_BODY_LIMIT = 1024 * 1024;
var PROJECT_README_BODY_LIMIT = 3 * 1024 * 1024;
var ATTACHMENT_BODY_LIMIT = 25 * 1024 * 1024;
var AI_CHAT_TURN_BODY_LIMIT = 25 * 1024 * 1024;
var AI_CHAT_ATTACHMENT_LIMIT = 10;
var AI_CHAT_SKILL_MARKER = "\uFFFC";
var HOST_RUNTIME_TTL_MS = 3e3;
var CODEX_PLAN_TAIL_BYTES = 16 * 1024 * 1024;
var INLINE_ATTACHMENT_TYPES = /* @__PURE__ */ new Set([
  "application/pdf",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain"
]);
var PROJECT_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
var PROJECT_BOARD_DISPLAY_SETTINGS_KEY_PREFIX = "taskboard.project-board-display-settings.v3.";
var TRUSTED_EMBED_ORIGINS = /* @__PURE__ */ new Set(["app://-"]);
var TRUSTED_ORIGINS_ENV = "CODEX_TASKBOARD_TRUSTED_ORIGINS";
var CODEX_AGENT_ACTOR = {
  type: "agent",
  id: agentActorId(DEFAULT_AGENT_KIND),
  name: agentActorName(DEFAULT_AGENT_KIND),
  avatarUrl: null
};
var CONTENT_TYPES = /* @__PURE__ */ new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"]
]);
function sendJson(response, status, value, headers = {}) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body),
    "content-type": "application/json; charset=utf-8",
    ...headers
  });
  response.end(body);
}
function sendEmpty(response, status, headers = {}) {
  response.writeHead(status, { "cache-control": "no-store", ...headers });
  response.end();
}
function toFetchRequest(request) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const entry of value) headers.append(name, entry);
    } else if (value !== void 0) {
      headers.set(name, value);
    }
  }
  const init = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = Readable.toWeb(request);
    init.duplex = "half";
  }
  return new Request(`http://127.0.0.1${request.url}`, init);
}
async function sendFetchResponse(response, upstream) {
  response.statusCode = upstream.status;
  response.statusMessage = upstream.statusText;
  for (const [name, value] of upstream.headers) {
    if (name === "connection" || name === "content-encoding" || name === "content-length" || name === "set-cookie" || name === "transfer-encoding") {
      continue;
    }
    response.setHeader(name, value);
  }
  const cookies = upstream.headers.getSetCookie?.() ?? [];
  if (cookies.length > 0) response.setHeader("set-cookie", cookies);
  if (!upstream.body) {
    response.end();
    return;
  }
  await new Promise((resolve, reject) => {
    const body = Readable.fromWeb(upstream.body);
    body.once("error", reject);
    response.once("finish", resolve);
    body.pipe(response);
  });
}
function normalizeHostname(hostname) {
  return hostname.toLowerCase().replace(/^\[|\]$/g, "");
}
function isTrustedNetworkHost(hostname) {
  const host = normalizeHostname(hostname);
  if (host === "localhost" || host === "::1" || host.endsWith(".local")) return true;
  if (isIP(host) === 4) {
    const octets = host.split(".").map(Number);
    return octets[0] === 127 || octets[0] === 10 || octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31 || octets[0] === 192 && octets[1] === 168 || octets[0] === 169 && octets[1] === 254;
  }
  if (isIP(host) === 6) {
    return host.startsWith("fc") || host.startsWith("fd") || /^fe[89ab]/.test(host);
  }
  return false;
}
function parseTrustedOrigins(value) {
  if (value === void 0) return /* @__PURE__ */ new Set();
  const configured = String(value).trim();
  if (!configured) {
    throw new Error(`${TRUSTED_ORIGINS_ENV} must not be empty when configured`);
  }
  const origins = /* @__PURE__ */ new Set();
  for (const rawOrigin of configured.split(",")) {
    const origin = rawOrigin.trim();
    if (!origin || origin.includes("*")) {
      throw new Error(`${TRUSTED_ORIGINS_ENV} must be a comma-separated list of exact HTTPS origins`);
    }
    let url;
    try {
      url = new URL(origin);
    } catch {
      throw new Error(`${TRUSTED_ORIGINS_ENV} must contain valid HTTPS origins`);
    }
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      throw new Error(`${TRUSTED_ORIGINS_ENV} must contain exact HTTPS origins without paths, queries, fragments, or credentials`);
    }
    if (origins.has(url.origin)) {
      throw new Error(`${TRUSTED_ORIGINS_ENV} must not contain duplicate origins`);
    }
    origins.add(url.origin);
  }
  return origins;
}
function parseRequestHost(value) {
  if (typeof value !== "string" || !value || value !== value.trim()) {
    throw new ApiError(403, "INVALID_HOST", "Request Host must be local, private, or explicitly trusted");
  }
  let url;
  try {
    url = new URL(`https://${value}`);
  } catch {
    throw new ApiError(403, "INVALID_HOST", "Request Host must be local, private, or explicitly trusted");
  }
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash || !url.hostname) {
    throw new ApiError(403, "INVALID_HOST", "Request Host must be local, private, or explicitly trusted");
  }
  return { hostname: url.hostname, httpsOrigin: url.origin };
}
function assertTrustedNetworkRequest(request, allowOpaqueOrigin = false, trustedOrigins = /* @__PURE__ */ new Set()) {
  const host = parseRequestHost(request.headers.host);
  const trustedNetworkHost = isTrustedNetworkHost(host.hostname);
  const configuredTrustedHost = !trustedNetworkHost && trustedOrigins.has(host.httpsOrigin);
  if (!trustedNetworkHost && !configuredTrustedHost) {
    throw new ApiError(403, "INVALID_HOST", "Request Host must be local, private, or explicitly trusted");
  }
  const origin = request.headers.origin;
  const configuredTrustedOrigin = trustedOrigins.has(origin);
  if (origin && !configuredTrustedOrigin && !TRUSTED_EMBED_ORIGINS.has(origin)) {
    if (!(allowOpaqueOrigin && origin === "null")) {
      let originHost;
      try {
        originHost = new URL(origin).hostname;
      } catch {
        throw new ApiError(403, "INVALID_ORIGIN", "Request Origin must be local or private");
      }
      if (!isTrustedNetworkHost(originHost)) {
        throw new ApiError(403, "INVALID_ORIGIN", "Request Origin must be local or private");
      }
    }
  }
  return configuredTrustedHost || configuredTrustedOrigin;
}
function assertLoopbackRequest(request) {
  const address = request.socket.remoteAddress;
  if (address !== "127.0.0.1" && address !== "::1" && address !== "::ffff:127.0.0.1") {
    throw new ApiError(403, "LOCAL_ONLY", "This endpoint is only available on this device");
  }
}
function assertPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "INVALID_BODY", "Request body must be a JSON object");
  }
}
function assertAllowedKeys(value, allowed) {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    throw new ApiError(400, "UNKNOWN_FIELD", `Unknown field${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
  }
}
function assertAllowedQuery(searchParams, allowed, routeLabel) {
  for (const key of searchParams.keys()) {
    if (!allowed.has(key)) {
      throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", `${routeLabel} does not accept query parameter '${key}'`);
    }
    if (searchParams.getAll(key).length !== 1) {
      throw new ApiError(400, "INVALID_QUERY_PARAMETER", `Query parameter '${key}' cannot be repeated`);
    }
  }
}
function assertNoQuery(searchParams, routeLabel) {
  assertAllowedQuery(searchParams, /* @__PURE__ */ new Set(), routeLabel);
}
function parseAfterCursor(searchParams, routeLabel) {
  assertAllowedQuery(searchParams, /* @__PURE__ */ new Set(["after"]), routeLabel);
  const value = searchParams.get("after");
  if (value === null) return null;
  const revision = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(revision)) {
    throw new ApiError(400, "INVALID_CURSOR", "Cursor must be a non-negative integer revision");
  }
  return { value, revision };
}
function nextCursor(items, after) {
  if (items.length === 0) return after?.value ?? "0";
  return String(items.reduce(
    (revision, item) => Math.max(revision, item.changeRevision),
    0
  ));
}
function decodeRouteSegment(value, name) {
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    throw new ApiError(400, "INVALID_PATH", `${name} contains invalid encoding`);
  }
  if (!decoded || decoded.length > 256 || decoded.includes("\0")) {
    throw new ApiError(400, "INVALID_PATH", `${name} is invalid`);
  }
  return decoded;
}
function isLoopbackAddress(value) {
  if (typeof value !== "string") return false;
  const address = value.toLowerCase().split("%", 1)[0];
  return address === "::1" || address === "127.0.0.1" || address.startsWith("127.") || address === "::ffff:127.0.0.1" || address.startsWith("::ffff:127.");
}
var WINDOWS_FOLDER_PICKER_SCRIPT = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$dialog = [System.Windows.Forms.FolderBrowserDialog]::new()
$owner = [System.Windows.Forms.Form]::new()
try {
  $owner.ShowInTaskbar = $false
  $owner.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen
  $owner.Size = [System.Drawing.Size]::new(1, 1)
  $owner.Opacity = 0
  $owner.TopMost = $true
  $owner.Show()
  $owner.Activate()
  $dialog.Description = "\u9009\u62E9\u9879\u76EE\u7684\u672C\u673A\u76EE\u5F55"
  $initialPath = [Environment]::GetEnvironmentVariable("TASKBOARD_FOLDER_PICKER_INITIAL_PATH")
  if ($initialPath -and [System.IO.Directory]::Exists($initialPath)) {
    $dialog.SelectedPath = $initialPath
  }
  if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) {
    [Console]::Out.Write($dialog.SelectedPath)
  }
} finally {
  $dialog.Dispose()
  $owner.Close()
  $owner.Dispose()
}
`.trim();
async function selectWorkspaceDirectory(initialPath) {
  if (process.platform !== "win32") {
    throw new ApiError(501, "FOLDER_PICKER_UNAVAILABLE", "Folder selection is currently available on Windows only");
  }
  try {
    const { stdout } = await execFileAsync2(
      "powershell.exe",
      ["-NoLogo", "-NoProfile", "-STA", "-Command", WINDOWS_FOLDER_PICKER_SCRIPT],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          TASKBOARD_FOLDER_PICKER_INITIAL_PATH: initialPath ?? ""
        },
        maxBuffer: 64 * 1024,
        windowsHide: true
      }
    );
    const workspacePath = stdout.trim();
    return workspacePath || null;
  } catch (error) {
    throw new ApiError(
      500,
      "FOLDER_PICKER_FAILED",
      "Could not open the system folder selector",
      error instanceof Error ? error.message : String(error)
    );
  }
}
function assertAiLoopbackRequest(request) {
  if (!isLoopbackAddress(request.socket.remoteAddress)) {
    throw new ApiError(403, "LOCAL_AI_LOOPBACK_REQUIRED", "Local AI routes are only available from this device");
  }
}
function stringField(value, name, { required = false, nullable = false, maxLength }) {
  if (value === void 0) {
    if (required) {
      throw new ApiError(400, "INVALID_FIELD", `'${name}' is required`);
    }
    return void 0;
  }
  if (nullable && value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' must be a string${nullable ? " or null" : ""}`);
  }
  const normalized = value.trim();
  if (required && normalized.length === 0) {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' cannot be empty`);
  }
  if (normalized.length > maxLength) {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' cannot exceed ${maxLength} characters`);
  }
  return normalized;
}
function pathField(value, name) {
  const normalized = stringField(value, name, { nullable: true, maxLength: 4096 });
  if (normalized === "") {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' cannot be empty`);
  }
  if (normalized?.includes("\0")) {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' cannot contain null bytes`);
  }
  return normalized;
}
function parseDueDate(value, name = "dueDate") {
  const date = stringField(value, name, { nullable: true, maxLength: 10 });
  if (date !== null && date !== void 0 && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' must use YYYY-MM-DD`);
  }
  return date;
}
function parseDevelopmentContext(value) {
  if (value === null) return null;
  assertPlainObject(value);
  if (value.type === "branch") {
    assertAllowedKeys(value, /* @__PURE__ */ new Set(["type", "branch"]));
    return {
      type: "branch",
      branch: stringField(value.branch, "developmentContext.branch", { required: true, maxLength: 512 })
    };
  }
  if (value.type === "worktree") {
    assertAllowedKeys(value, /* @__PURE__ */ new Set(["type", "path", "branch"]));
    const worktreePath = stringField(value.path, "developmentContext.path", { required: true, maxLength: 4096 });
    if (worktreePath.includes("\0")) {
      throw new ApiError(400, "INVALID_FIELD", "'developmentContext.path' cannot contain null bytes");
    }
    return {
      type: "worktree",
      path: worktreePath,
      branch: stringField(value.branch ?? null, "developmentContext.branch", { nullable: true, maxLength: 512 })
    };
  }
  throw new ApiError(400, "INVALID_FIELD", "'developmentContext.type' must be branch or worktree");
}
function parseRecurrence(value) {
  if (value === null) return null;
  assertPlainObject(value);
  assertAllowedKeys(value, /* @__PURE__ */ new Set(["interval", "unit"]));
  if (!Number.isSafeInteger(value.interval) || value.interval < 1 || value.interval > 365) {
    throw new ApiError(400, "INVALID_FIELD", "'recurrence.interval' must be an integer from 1 to 365");
  }
  if (!["day", "week", "month", "year"].includes(value.unit)) {
    throw new ApiError(400, "INVALID_FIELD", "'recurrence.unit' must be day, week, month, or year");
  }
  return { interval: value.interval, unit: value.unit };
}
function parseVersion(value) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new ApiError(400, "INVALID_FIELD", "'version' must be a positive integer");
  }
  return value;
}
function parseSortOrder(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 1e12) {
    throw new ApiError(400, "INVALID_FIELD", "'sortOrder' must be a finite number between -1000000000000 and 1000000000000");
  }
  return value;
}
function parseLabels(value) {
  if (!Array.isArray(value) || value.length > 20) {
    throw new ApiError(400, "INVALID_FIELD", "'labels' must be an array with at most 20 entries");
  }
  const labels = value.map((label) => {
    if (typeof label !== "string") {
      throw new ApiError(400, "INVALID_FIELD", "Every label must be a string");
    }
    const normalized = label.trim();
    if (normalized.length === 0 || normalized.length > 64) {
      throw new ApiError(400, "INVALID_FIELD", "Labels must contain 1 to 64 characters");
    }
    return normalized;
  });
  if (new Set(labels).size !== labels.length) {
    throw new ApiError(400, "INVALID_FIELD", "Labels must be unique");
  }
  return labels;
}
function parseStatus(value, fallback) {
  const result = value ?? fallback;
  if (!isTaskStatus(result)) {
    throw new ApiError(400, "INVALID_FIELD", `'status' must be one of: ${TASK_STATUSES.join(", ")}`);
  }
  return result;
}
function parsePriority(value, fallback) {
  const result = value ?? fallback;
  if (!isTaskPriority(result)) {
    throw new ApiError(400, "INVALID_FIELD", "'priority' must be none, urgent, high, medium, or low");
  }
  return result;
}
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
function validateProjectId(value, { required = true } = {}) {
  const id = stringField(value, "id", { required, maxLength: 64 });
  if (id !== void 0 && !PROJECT_ID_PATTERN.test(id)) {
    throw new ApiError(400, "INVALID_FIELD", "'id' must be a lowercase slug containing letters, numbers, or hyphens");
  }
  return id;
}
function parseProjectCreate(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["id", "name", "workspacePath"]));
  const name = stringField(body.name, "name", { required: true, maxLength: 120 });
  const id = validateProjectId(body.id ?? slugify(name));
  if (!id) {
    throw new ApiError(400, "INVALID_FIELD", "Project name must contain at least one letter or number when 'id' is omitted");
  }
  const workspacePath = stringField(body.workspacePath ?? null, "workspacePath", { nullable: true, maxLength: 4096 });
  if (workspacePath === "") {
    throw new ApiError(400, "INVALID_FIELD", "'workspacePath' cannot be empty");
  }
  if (workspacePath?.includes("\0")) {
    throw new ApiError(400, "INVALID_FIELD", "'workspacePath' cannot contain null bytes");
  }
  return { id, name, workspacePath };
}
function parseProjectUpdate(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["name"]));
  return {
    name: stringField(body.name, "name", { required: true, maxLength: 120 })
  };
}
function parseProjectLabel(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["label"]));
  return stringField(body.label, "label", { required: true, maxLength: 64 });
}
function parseProjectReadmeSave(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["content", "version"]));
  const content = body.content ?? "";
  if (typeof content !== "string") {
    throw new ApiError(400, "INVALID_FIELD", "'content' must be a string");
  }
  if (content.length > 5e5) {
    throw new ApiError(400, "INVALID_FIELD", "'content' cannot exceed 500000 characters");
  }
  const version = body.version;
  if (version !== void 0 && (!Number.isSafeInteger(version) || version < 0)) {
    throw new ApiError(400, "INVALID_FIELD", "'version' must be a non-negative integer");
  }
  return { content, version };
}
function parseThreadId(value) {
  if (value === void 0) return void 0;
  return stringField(value, "threadId", { required: true, maxLength: 256 });
}
function parseThreadBinding(value) {
  if (value === void 0 || value === null) return value;
  assertPlainObject(value);
  assertAllowedKeys(value, /* @__PURE__ */ new Set([
    "threadId",
    "codexProjectId",
    "codexProjectKind",
    "codexHostId",
    "workspacePath"
  ]));
  const threadId = stringField(value.threadId, "threadBinding.threadId", {
    required: true,
    maxLength: 256
  });
  const identityFields = [
    value.codexProjectId,
    value.codexProjectKind,
    value.codexHostId,
    value.workspacePath
  ];
  if (identityFields.every((field) => field === void 0)) return { threadId };
  if (identityFields.some((field) => field === void 0)) {
    throw new ApiError(400, "INVALID_FIELD", "Thread identity must include project, kind, host, and workspace");
  }
  const codexProjectId = stringField(value.codexProjectId, "threadBinding.codexProjectId", {
    required: true,
    maxLength: 256
  });
  const codexProjectKind = value.codexProjectKind;
  const codexHostId = stringField(value.codexHostId, "threadBinding.codexHostId", {
    required: true,
    maxLength: 256
  });
  const workspacePath = stringField(value.workspacePath, "threadBinding.workspacePath", {
    required: true,
    maxLength: 4096
  });
  if (codexProjectKind !== "local" && codexProjectKind !== "remote") {
    throw new ApiError(400, "INVALID_FIELD", "threadBinding.codexProjectKind must be local or remote");
  }
  if (codexProjectKind === "local" && codexHostId !== "local" || codexProjectKind === "remote" && codexHostId === "local" || workspacePath.includes("\0")) {
    throw new ApiError(400, "INVALID_FIELD", "Thread project identity is invalid");
  }
  return { threadId, codexProjectId, codexProjectKind, codexHostId, workspacePath };
}
function requestHeader(request, name) {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
function actorFromRequest(request) {
  if (request.headers["x-taskboard-client"] === "taskctl") {
    let agentKind;
    try {
      agentKind = normalizeAgentKind(
        requestHeader(request, "x-taskboard-agent-kind"),
        DEFAULT_AGENT_KIND
      );
    } catch (error) {
      throw new ApiError(400, "INVALID_AGENT_KIND", error.message);
    }
    return {
      type: "agent",
      id: agentActorId(agentKind),
      name: agentActorName(agentKind),
      avatarUrl: null
    };
  }
  const rawId = requestHeader(request, "x-taskboard-user-id");
  const rawName = requestHeader(request, "x-taskboard-user-name");
  const rawAvatarUrl = requestHeader(request, "x-taskboard-user-avatar");
  if (rawId === void 0 && rawName === void 0 && rawAvatarUrl === void 0) {
    return { type: "user", id: "local-user", name: "\u672C\u5730\u7528\u6237", avatarUrl: null };
  }
  if (rawId === void 0 || rawName === void 0) {
    throw new ApiError(400, "INVALID_ACTOR", "User identity requires both an ID and name");
  }
  const id = stringField(rawId, "X-Taskboard-User-Id", { required: true, maxLength: 96 });
  if (!/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(id)) {
    throw new ApiError(400, "INVALID_ACTOR", "User ID contains unsupported characters");
  }
  let decodedName;
  try {
    decodedName = decodeURIComponent(rawName);
  } catch {
    throw new ApiError(400, "INVALID_ACTOR", "User name is not valid URL-encoded text");
  }
  const name = stringField(decodedName, "X-Taskboard-User-Name", { required: true, maxLength: 120 });
  let avatarUrl = null;
  if (rawAvatarUrl !== void 0) {
    const value = stringField(rawAvatarUrl, "X-Taskboard-User-Avatar", { required: true, maxLength: 2048 });
    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      throw new ApiError(400, "INVALID_ACTOR", "User avatar URL is invalid");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new ApiError(400, "INVALID_ACTOR", "User avatar URL must use HTTP or HTTPS");
    }
    avatarUrl = parsed.toString();
  }
  return { type: "user", id, name, avatarUrl };
}
function parseAssigneeTarget(value) {
  if (value === void 0) return void 0;
  if (value === "current-user" || value === "codex-agent") return value;
  if (typeof value === "string" && value.startsWith("agent:")) {
    try {
      const kind = value.slice("agent:".length);
      if (!kind) throw new TypeError("Agent kind cannot be empty");
      return `agent:${normalizeAgentKind(kind)}`;
    } catch {
    }
  }
  throw new ApiError(400, "INVALID_FIELD", "'assigneeTarget' must be current-user, codex-agent, or agent:<kind>");
}
function resolveAssignee(target, actor) {
  if (target === void 0) return actor;
  if (target === "codex-agent") return CODEX_AGENT_ACTOR;
  if (target.startsWith("agent:")) {
    const kind = target.slice("agent:".length);
    return {
      type: "agent",
      id: agentActorId(kind),
      name: agentActorName(kind),
      avatarUrl: null
    };
  }
  if (actor.type !== "user") {
    throw new ApiError(400, "INVALID_FIELD", "'current-user' requires a user request identity");
  }
  return actor;
}
function parseTaskCreate(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set([
    "projectId",
    "title",
    "description",
    "status",
    "priority",
    "labels",
    "sortOrder",
    "threadId",
    "threadBinding",
    "assigneeTarget",
    "developmentContext",
    "startDate",
    "dueDate",
    "recurrence"
  ]));
  const projectId = validateProjectId(body.projectId ?? DEFAULT_PROJECT_ID);
  const task = {
    projectId,
    title: stringField(body.title, "title", { required: true, maxLength: 240 }),
    description: stringField(body.description ?? "", "description", { maxLength: 1e5 }),
    status: parseStatus(body.status, "backlog"),
    priority: parsePriority(body.priority, "none"),
    labels: body.labels === void 0 ? [] : parseLabels(body.labels),
    sortOrder: body.sortOrder === void 0 ? void 0 : parseSortOrder(body.sortOrder),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding),
    assigneeTarget: parseAssigneeTarget(body.assigneeTarget),
    developmentContext: parseDevelopmentContext(body.developmentContext ?? null),
    startDate: parseDueDate(body.startDate ?? null, "startDate"),
    dueDate: parseDueDate(body.dueDate ?? null),
    recurrence: parseRecurrence(body.recurrence ?? null)
  };
  if (task.recurrence && !task.dueDate) {
    throw new ApiError(400, "INVALID_FIELD", "A recurring issue requires 'dueDate'");
  }
  return task;
}
function parseTaskPatch(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set([
    "version",
    "projectId",
    "title",
    "description",
    "status",
    "priority",
    "labels",
    "threadId",
    "threadBinding",
    "assigneeTarget",
    "developmentContext",
    "startDate",
    "dueDate",
    "recurrence"
  ]));
  const version = parseVersion(body.version);
  const threadId = parseThreadId(body.threadId);
  const threadBinding = parseThreadBinding(body.threadBinding);
  const assigneeTarget = parseAssigneeTarget(body.assigneeTarget);
  const changes = {};
  if (body.projectId !== void 0) changes.projectId = validateProjectId(body.projectId);
  if (body.title !== void 0) changes.title = stringField(body.title, "title", { required: true, maxLength: 240 });
  if (body.description !== void 0) changes.description = stringField(body.description, "description", { maxLength: 1e5 });
  if (body.status !== void 0) changes.status = parseStatus(body.status);
  if (body.priority !== void 0) changes.priority = parsePriority(body.priority);
  if (body.labels !== void 0) changes.labels = parseLabels(body.labels);
  if (body.developmentContext !== void 0) changes.developmentContext = parseDevelopmentContext(body.developmentContext);
  if (body.startDate !== void 0) changes.startDate = parseDueDate(body.startDate, "startDate");
  if (body.dueDate !== void 0) changes.dueDate = parseDueDate(body.dueDate);
  if (body.recurrence !== void 0) changes.recurrence = parseRecurrence(body.recurrence);
  if (changes.recurrence && body.dueDate === null) {
    throw new ApiError(400, "INVALID_FIELD", "A recurring issue requires 'dueDate'");
  }
  if (Object.keys(changes).length === 0 && assigneeTarget === void 0) {
    throw new ApiError(400, "INVALID_BODY", "PATCH requires at least one task field");
  }
  return { version, changes, threadId, threadBinding, assigneeTarget };
}
function parseMove(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["version", "status", "sortOrder", "threadId", "threadBinding"]));
  return {
    version: parseVersion(body.version),
    status: parseStatus(body.status),
    sortOrder: body.sortOrder === void 0 ? void 0 : parseSortOrder(body.sortOrder),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding)
  };
}
function parseArchive(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["version", "threadId", "threadBinding"]));
  return {
    version: parseVersion(body.version),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding)
  };
}
function parseRelationOrigin(value) {
  if (value === void 0) return void 0;
  if (value !== "manual" && value !== "mention") {
    throw new ApiError(400, "INVALID_FIELD", "'origin' must be manual or mention");
  }
  return value;
}
function parseRelationMutation(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["version", "threadId", "threadBinding", "origin"]));
  return {
    version: parseVersion(body.version),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding),
    origin: parseRelationOrigin(body.origin)
  };
}
function parseIssueRelationType(value) {
  if (!["parent", "blocks", "blocked_by", "related"].includes(value)) {
    throw new ApiError(
      400,
      "INVALID_FIELD",
      "'relation type' must be parent, blocks, blocked_by, or related"
    );
  }
  return value;
}
function parseCommentCreate(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["body", "threadId", "threadBinding"]));
  return {
    body: stringField(body.body ?? "", "body", { maxLength: 1e5 }),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding)
  };
}
function parseCommentPatch(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["version", "body", "threadId", "threadBinding"]));
  if (body.body === void 0) {
    throw new ApiError(400, "INVALID_FIELD", "'body' is required");
  }
  return {
    version: parseVersion(body.version),
    body: stringField(body.body, "body", { maxLength: 1e5 }),
    threadId: parseThreadId(body.threadId),
    threadBinding: parseThreadBinding(body.threadBinding)
  };
}
function parseAttachmentHeaders(request) {
  const encodedFilename = request.headers["x-taskboard-filename"];
  if (typeof encodedFilename !== "string") {
    throw new ApiError(400, "INVALID_FILENAME", "X-Taskboard-Filename is required");
  }
  let filename;
  try {
    filename = decodeURIComponent(encodedFilename).trim();
  } catch {
    throw new ApiError(400, "INVALID_FILENAME", "Attachment filename contains invalid encoding");
  }
  if (filename.length === 0 || filename.length > 240 || filename === "." || filename === ".." || /[\u0000-\u001f\u007f/\\]/.test(filename)) {
    throw new ApiError(400, "INVALID_FILENAME", "Attachment filename is invalid");
  }
  const rawContentType = request.headers["content-type"];
  const contentType = typeof rawContentType === "string" ? rawContentType.split(";", 1)[0].trim().toLowerCase() : "application/octet-stream";
  if (contentType.length === 0 || contentType.length > 200 || !/^[!#$%&'*+.^_`|~0-9a-z-]+\/[!#$%&'*+.^_`|~0-9a-z-]+$/.test(contentType)) {
    throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Attachment Content-Type is invalid");
  }
  const kind = request.headers["x-taskboard-attachment-kind"];
  if (kind !== "inline" && kind !== "attachment") {
    throw new ApiError(
      400,
      "INVALID_ATTACHMENT_KIND",
      "X-Taskboard-Attachment-Kind must be inline or attachment"
    );
  }
  return { filename, contentType, kind };
}
async function readBody(request, limit, tooLargeMessage) {
  const declaredLength = Number(request.headers["content-length"] ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > limit) {
    throw new ApiError(413, "BODY_TOO_LARGE", tooLargeMessage);
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > limit) {
      throw new ApiError(413, "BODY_TOO_LARGE", tooLargeMessage);
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
async function readJson(request, limit = JSON_BODY_LIMIT, tooLargeMessage = "Request body cannot exceed 1 MiB") {
  const contentType = request.headers["content-type"]?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json");
  }
  const body = await readBody(request, limit, tooLargeMessage);
  const length = body.length;
  if (length === 0) {
    throw new ApiError(400, "INVALID_JSON", "Request body cannot be empty");
  }
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must contain valid JSON");
  }
}
async function assertEmptyRequestBody(request, routeLabel) {
  const body = await readBody(request, JSON_BODY_LIMIT, "Request body cannot exceed 1 MiB");
  if (body.length > 0) {
    throw new ApiError(400, "INVALID_BODY", `${routeLabel} does not accept a request body`);
  }
}
function parseTaskFilters(searchParams) {
  const allowed = /* @__PURE__ */ new Set(["projectId", "status", "archived"]);
  for (const key of searchParams.keys()) {
    if (!allowed.has(key)) {
      throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", `Unknown query parameter '${key}'`);
    }
    if (searchParams.getAll(key).length !== 1) {
      throw new ApiError(400, "INVALID_QUERY_PARAMETER", `Query parameter '${key}' cannot be repeated`);
    }
  }
  const projectIdValue = searchParams.get("projectId");
  const statusValue = searchParams.get("status");
  const archived = searchParams.get("archived") ?? "false";
  if (statusValue !== null && !isTaskStatus(statusValue)) {
    throw new ApiError(400, "INVALID_QUERY_PARAMETER", "Invalid task status");
  }
  if (!(/* @__PURE__ */ new Set(["true", "false", "all"])).has(archived)) {
    throw new ApiError(400, "INVALID_QUERY_PARAMETER", "'archived' must be true, false, or all");
  }
  const projectId = projectIdValue === null ? void 0 : validateProjectId(projectIdValue);
  return { projectId, status: statusValue ?? void 0, archived };
}
function parseTaskTreeQuery(searchParams) {
  const allowed = /* @__PURE__ */ new Set(["direction", "depth"]);
  for (const key of searchParams.keys()) {
    if (!allowed.has(key)) {
      throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", `Unknown query parameter '${key}'`);
    }
    if (searchParams.getAll(key).length !== 1) {
      throw new ApiError(400, "INVALID_TREE_QUERY", `Query parameter '${key}' cannot be repeated`);
    }
  }
  const direction = searchParams.get("direction");
  if (direction !== "descendants" && direction !== "ancestors") {
    throw new ApiError(400, "INVALID_TREE_QUERY", "'direction' must be descendants or ancestors");
  }
  const rawDepth = searchParams.get("depth");
  const depth = Number(rawDepth);
  if (!/^\d+$/.test(rawDepth ?? "") || !Number.isSafeInteger(depth) || depth < 1 || depth > 25) {
    throw new ApiError(400, "INVALID_TREE_QUERY", "'depth' must be an integer from 1 to 25");
  }
  return { direction, depth };
}
function parseAiSandbox(value) {
  if (value === void 0) return void 0;
  if (!["read-only", "workspace-write", "danger-full-access"].includes(value)) {
    throw new ApiError(
      400,
      "INVALID_SANDBOX",
      "'sandbox' must be read-only, workspace-write, or danger-full-access"
    );
  }
  return value;
}
function parseAiSetting(value, name, maxLength) {
  const setting = stringField(value, name, { maxLength });
  if (setting === "") {
    throw new ApiError(400, "INVALID_FIELD", `'${name}' cannot be empty`);
  }
  return setting;
}
function parseAiExecutionTarget(value) {
  const fields = [
    "codexProjectId",
    "codexProjectKind",
    "codexHostId",
    "workspacePath"
  ];
  const present = fields.filter((field) => value[field] !== void 0);
  if (present.length === 0) return void 0;
  if (present.length !== fields.length) {
    throw new ApiError(400, "INVALID_CODEX_TARGET", "Codex project identity must contain all four fields");
  }
  const codexProjectKind = parseAiSetting(value.codexProjectKind, "codexProjectKind", 16);
  if (codexProjectKind !== "local" && codexProjectKind !== "remote") {
    throw new ApiError(400, "INVALID_CODEX_TARGET", "'codexProjectKind' must be local or remote");
  }
  const workspacePath = parseAiSetting(value.workspacePath, "workspacePath", 4096);
  if (workspacePath.includes("\0")) {
    throw new ApiError(400, "INVALID_CODEX_TARGET", "'workspacePath' cannot contain null bytes");
  }
  return {
    codexProjectId: parseAiSetting(value.codexProjectId, "codexProjectId", 256),
    codexProjectKind,
    codexHostId: parseAiSetting(value.codexHostId, "codexHostId", 512),
    workspacePath
  };
}
function aiExecutionTargetFromQuery(searchParams) {
  return parseAiExecutionTarget({
    codexProjectId: searchParams.get("codexProjectId") ?? void 0,
    codexProjectKind: searchParams.get("codexProjectKind") ?? void 0,
    codexHostId: searchParams.get("codexHostId") ?? void 0,
    workspacePath: searchParams.get("workspacePath") ?? void 0
  });
}
function parseAiThreadCreate(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set([
    "projectId",
    "issueId",
    "title",
    "model",
    "reasoningEffort",
    "sandbox",
    "codexProjectId",
    "codexProjectKind",
    "codexHostId",
    "workspacePath"
  ]));
  return {
    projectId: validateProjectId(body.projectId),
    issueId: parseAiSetting(body.issueId, "issueId", 128),
    title: parseAiSetting(body.title, "title", 160),
    model: parseAiSetting(body.model, "model", 128),
    reasoningEffort: parseAiSetting(body.reasoningEffort, "reasoningEffort", 64),
    sandbox: parseAiSandbox(body.sandbox),
    ...parseAiExecutionTarget(body)
  };
}
function parseAiThreadPatch(body) {
  assertPlainObject(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set(["title", "model", "reasoningEffort", "sandbox"]));
  const input = {};
  if (body.title !== void 0) input.title = parseAiSetting(body.title, "title", 160);
  if (body.model !== void 0) input.model = parseAiSetting(body.model, "model", 128);
  if (body.reasoningEffort !== void 0) {
    input.reasoningEffort = parseAiSetting(body.reasoningEffort, "reasoningEffort", 64);
  }
  if (body.sandbox !== void 0) input.sandbox = parseAiSandbox(body.sandbox);
  if (Object.keys(input).length === 0) {
    throw new ApiError(400, "INVALID_BODY", "PATCH requires at least one thread setting");
  }
  return input;
}
function parseAiSkillIds(value) {
  if (value === void 0) return void 0;
  if (!Array.isArray(value) || value.length > 20) {
    throw new ApiError(400, "INVALID_FIELD", "'skillIds' must be an array with at most 20 entries");
  }
  const skillIds = value.map((skillId, index) => stringField(skillId, `skillIds[${index}]`, { required: true, maxLength: 256 }));
  return skillIds;
}
function parseAiAttachments(value) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > AI_CHAT_ATTACHMENT_LIMIT) {
    throw new ApiError(
      400,
      "INVALID_ATTACHMENT",
      `'attachments' must be an array with at most ${AI_CHAT_ATTACHMENT_LIMIT} files`
    );
  }
  return value.map((attachment, index) => {
    assertPlainObject(attachment);
    assertAllowedKeys(attachment, /* @__PURE__ */ new Set(["filename", "contentType", "dataBase64"]));
    const filename = stringField(attachment.filename, `attachments[${index}].filename`, {
      required: true,
      maxLength: 240
    });
    if (/[\u0000-\u001f\u007f/\\]/.test(filename)) {
      throw new ApiError(
        400,
        "INVALID_ATTACHMENT",
        `'attachments[${index}].filename' is invalid`
      );
    }
    const contentType = stringField(
      attachment.contentType,
      `attachments[${index}].contentType`,
      { required: true, maxLength: 256 }
    ).toLowerCase();
    const dataBase64 = stringField(
      attachment.dataBase64,
      `attachments[${index}].dataBase64`,
      { required: true, maxLength: AI_CHAT_TURN_BODY_LIMIT }
    );
    if (dataBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(dataBase64)) {
      throw new ApiError(
        400,
        "INVALID_ATTACHMENT",
        `'attachments[${index}].dataBase64' must contain valid base64`
      );
    }
    const data = Buffer.from(dataBase64, "base64");
    if (data.length === 0 || data.toString("base64") !== dataBase64) {
      throw new ApiError(
        400,
        "INVALID_ATTACHMENT",
        `'attachments[${index}].dataBase64' must contain valid base64`
      );
    }
    return { filename, contentType, data, size: data.length };
  });
}
function parseAiTurn(body) {
  assertPlainObject(body);
  if (body.contractVersion !== void 0) return parseComposerTurn(body);
  assertAllowedKeys(body, /* @__PURE__ */ new Set([
    "message",
    "skillIds",
    "dangerFullAccessConfirmed",
    "attachments"
  ]));
  if (body.dangerFullAccessConfirmed !== void 0 && typeof body.dangerFullAccessConfirmed !== "boolean") {
    throw new ApiError(400, "INVALID_FIELD", "'dangerFullAccessConfirmed' must be a boolean");
  }
  const message = stringField(body.message ?? "", "message", { maxLength: 1e5 });
  const skillIds = parseAiSkillIds(body.skillIds) ?? [];
  if (message.split(AI_CHAT_SKILL_MARKER).length - 1 !== skillIds.length) {
    throw new ApiError(400, "INVALID_FIELD", "'skillIds' must match the Skill markers in 'message'");
  }
  const attachments = parseAiAttachments(body.attachments);
  if (message === "" && attachments.length === 0) {
    throw new ApiError(
      400,
      "INVALID_MESSAGE",
      "A message or at least one attachment is required"
    );
  }
  return {
    message,
    skillIds,
    dangerFullAccessConfirmed: body.dangerFullAccessConfirmed,
    attachments
  };
}
function parseComposerCandidateQuery(searchParams) {
  assertAllowedQuery(
    searchParams,
    /* @__PURE__ */ new Set([
      "projectId",
      "threadId",
      "trigger",
      "query",
      "surface",
      "codexProjectId",
      "codexProjectKind",
      "codexHostId",
      "workspacePath"
    ]),
    "GET /api/local/ai/composer/candidates"
  );
  let projectId;
  const rawProjectId = searchParams.get("projectId");
  if (rawProjectId !== null) {
    try {
      projectId = validateProjectId(rawProjectId);
    } catch {
      throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer project id is invalid");
    }
  }
  const trigger = searchParams.get("trigger");
  if (trigger !== "/" && trigger !== "@") {
    throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer trigger must be '/' or '@'");
  }
  const query = searchParams.get("query") ?? "";
  if (query.length > 256) {
    throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer query cannot exceed 256 characters");
  }
  let threadId;
  try {
    threadId = parseThreadId(searchParams.get("threadId") ?? void 0);
  } catch {
    throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer thread id is invalid");
  }
  const surface = searchParams.get("surface") ?? "ai-chat";
  if (!(/* @__PURE__ */ new Set(["ai-chat", "issue-description", "comment"])).has(surface)) {
    throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer surface is invalid");
  }
  return {
    projectId,
    threadId,
    trigger,
    query,
    surface,
    ...aiExecutionTargetFromQuery(searchParams)
  };
}
function invalidComposerRebindRequest(message) {
  return new ApiError(400, "INVALID_COMPOSER_REBIND_REQUEST", message);
}
function assertComposerRebindKeys(value, allowed, field) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      throw invalidComposerRebindRequest(`'${field}.${key}' is not allowed`);
    }
  }
}
function parseComposerRebindRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw invalidComposerRebindRequest("Composer rebind body must be an object");
  }
  assertComposerRebindKeys(
    value,
    /* @__PURE__ */ new Set(["contractVersion", "projectId", "threadId", "document"]),
    "body"
  );
  if (value.contractVersion !== "composer.v1") {
    throw invalidComposerRebindRequest("'contractVersion' must be 'composer.v1'");
  }
  let projectId;
  try {
    projectId = validateProjectId(value.projectId);
  } catch {
    throw invalidComposerRebindRequest("'projectId' is invalid");
  }
  let threadId;
  try {
    threadId = parseThreadId(value.threadId);
  } catch {
    throw invalidComposerRebindRequest("'threadId' is invalid");
  }
  const document = value.document;
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw invalidComposerRebindRequest("'document' must be an object");
  }
  assertComposerRebindKeys(document, /* @__PURE__ */ new Set(["version", "nodes"]), "document");
  if (document.version !== 1) {
    throw invalidComposerRebindRequest("'document.version' must be 1");
  }
  if (!Array.isArray(document.nodes) || document.nodes.length > 200) {
    throw invalidComposerRebindRequest("'document.nodes' must contain at most 200 entries");
  }
  let textLength = 0;
  const nodes = document.nodes.map((node, nodeIndex) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      throw invalidComposerRebindRequest(`'document.nodes[${nodeIndex}]' must be an object`);
    }
    if (node.type === "text") {
      assertComposerRebindKeys(node, /* @__PURE__ */ new Set(["type", "text"]), `document.nodes[${nodeIndex}]`);
      if (typeof node.text !== "string") {
        throw invalidComposerRebindRequest(`'document.nodes[${nodeIndex}].text' must be a string`);
      }
      textLength += node.text.length;
      return { type: "text", text: node.text };
    }
    if (node.type === "unsupportedReference") {
      assertComposerRebindKeys(
        node,
        /* @__PURE__ */ new Set(["type", "referenceUri", "label"]),
        `document.nodes[${nodeIndex}]`
      );
      if (typeof node.label !== "string" || node.label.length === 0 || node.label.length > 256) {
        throw invalidComposerRebindRequest(`'document.nodes[${nodeIndex}].label' is invalid`);
      }
      if (typeof node.referenceUri !== "string" || node.referenceUri.length > 1024) {
        throw invalidComposerRebindRequest(
          `'document.nodes[${nodeIndex}].referenceUri' is invalid`
        );
      }
      const match = /^taskboard:\/\/composer-reference\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(
        node.referenceUri
      );
      if (!match) {
        throw invalidComposerRebindRequest(
          `'document.nodes[${nodeIndex}].referenceUri' is not a composer reference marker`
        );
      }
      try {
        decodeComposerReferenceKey(match[3]);
      } catch {
        throw invalidComposerRebindRequest(
          `'document.nodes[${nodeIndex}].referenceUri' has an invalid reference key`
        );
      }
      const reasonCode = match[1] !== "v1" ? "REFERENCE_FORMAT_UNSUPPORTED" : !(/* @__PURE__ */ new Set(["skill", "agent"])).has(match[2]) ? "REFERENCE_KIND_UNSUPPORTED" : null;
      if (!reasonCode) {
        throw invalidComposerRebindRequest(
          `'document.nodes[${nodeIndex}]' must use persistedReference for supported markers`
        );
      }
      return {
        type: "unsupportedReference",
        referenceUri: node.referenceUri,
        label: node.label,
        reasonCode
      };
    }
    if (node.type !== "persistedReference") {
      throw invalidComposerRebindRequest(
        `'document.nodes[${nodeIndex}].type' must be text, persistedReference or unsupportedReference`
      );
    }
    assertComposerRebindKeys(
      node,
      /* @__PURE__ */ new Set(["type", "referenceKind", "referenceKey", "label"]),
      `document.nodes[${nodeIndex}]`
    );
    if (node.referenceKind !== "skill" && node.referenceKind !== "agent") {
      throw invalidComposerRebindRequest(
        `'document.nodes[${nodeIndex}].referenceKind' must be skill or agent`
      );
    }
    if (typeof node.referenceKey !== "string" || node.referenceKey.length === 0 || node.referenceKey.length > 512) {
      throw invalidComposerRebindRequest(
        `'document.nodes[${nodeIndex}].referenceKey' is invalid`
      );
    }
    if (typeof node.label !== "string" || node.label.length === 0 || node.label.length > 256) {
      throw invalidComposerRebindRequest(`'document.nodes[${nodeIndex}].label' is invalid`);
    }
    let stableId;
    try {
      stableId = decodeComposerReferenceKey(node.referenceKey);
    } catch {
      throw invalidComposerRebindRequest(
        `'document.nodes[${nodeIndex}].referenceKey' is not canonical base64url`
      );
    }
    if (node.referenceKind === "skill" && stableId !== stableId.normalize("NFC")) {
      throw invalidComposerRebindRequest(
        `'document.nodes[${nodeIndex}].referenceKey' does not contain an NFC Skill name`
      );
    }
    return {
      type: "persistedReference",
      referenceKind: node.referenceKind,
      referenceKey: node.referenceKey,
      label: node.label,
      stableId
    };
  });
  if (textLength > 1e5) {
    throw invalidComposerRebindRequest("Composer text cannot exceed 100000 characters");
  }
  return {
    contractVersion: "composer.v1",
    projectId,
    threadId,
    document: { version: 1, nodes }
  };
}
async function resolveComposerRebindWorkspace(aiChat, input) {
  let thread;
  if (input.threadId !== void 0) {
    try {
      thread = aiChat.getThread(input.threadId);
    } catch (error) {
      if (error instanceof ApiError && error.code === "AI_CHAT_THREAD_NOT_FOUND") {
        throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer thread does not exist");
      }
      throw error;
    }
    if (thread.origin.projectId !== input.projectId) {
      throw new ApiError(
        400,
        "INVALID_COMPOSER_QUERY",
        "Composer thread does not belong to the selected project"
      );
    }
    if (thread.origin.codexProjectKind !== "remote") {
      try {
        if (!(await stat2(thread.origin.workspacePath)).isDirectory()) throw new Error("not a directory");
      } catch {
        throw new ApiError(
          409,
          "PROJECT_WORKSPACE_UNAVAILABLE",
          "The conversation workspace is not available on this device"
        );
      }
    }
    return {
      workspacePath: thread.origin.workspacePath,
      composerCatalog: aiChat.composerCatalogForThread(thread)
    };
  }
  let resolved;
  try {
    resolved = await aiChat.resolveContext(input.projectId, thread?.origin.issueId);
  } catch (error) {
    if (error instanceof ApiError && ["PROJECT_NOT_FOUND", "AI_CHAT_ISSUE_NOT_FOUND"].includes(error.code)) {
      throw new ApiError(400, "INVALID_COMPOSER_QUERY", "Composer project is invalid");
    }
    throw error;
  }
  return { workspacePath: resolved.workspacePath, composerCatalog: aiChat.composerCatalog };
}
function parseComposerDocument(value) {
  assertPlainObject(value);
  assertAllowedKeys(value, /* @__PURE__ */ new Set(["version", "nodes"]));
  if (value.version !== 1) {
    throw new ApiError(400, "INVALID_COMPOSER_DOCUMENT", "'document.version' must be 1");
  }
  if (!Array.isArray(value.nodes) || value.nodes.length > 200) {
    throw new ApiError(
      400,
      "INVALID_COMPOSER_DOCUMENT",
      "'document.nodes' must be an array with at most 200 entries"
    );
  }
  let textLength = 0;
  const nodes = value.nodes.map((node, index) => {
    assertPlainObject(node);
    if (typeof node.type !== "string" || !node.type) {
      throw new ApiError(
        400,
        "INVALID_COMPOSER_DOCUMENT",
        `'document.nodes[${index}].type' is required`
      );
    }
    if (node.type === "text") {
      assertAllowedKeys(node, /* @__PURE__ */ new Set(["type", "text"]));
      if (typeof node.text !== "string") {
        throw new ApiError(
          400,
          "INVALID_COMPOSER_DOCUMENT",
          `'document.nodes[${index}].text' must be a string`
        );
      }
      textLength += node.text.length;
      return { type: "text", text: node.text };
    }
    if (node.type === "skill" || node.type === "agent") {
      assertAllowedKeys(node, /* @__PURE__ */ new Set(["type", "candidateRef", "label"]));
      return {
        type: node.type,
        candidateRef: stringField(
          node.candidateRef,
          `document.nodes[${index}].candidateRef`,
          { required: true, maxLength: 512 }
        ),
        label: stringField(node.label, `document.nodes[${index}].label`, {
          required: true,
          maxLength: 256
        })
      };
    }
    return { type: node.type };
  });
  if (textLength > 1e5) {
    throw new ApiError(
      400,
      "INVALID_COMPOSER_DOCUMENT",
      "Composer text cannot exceed 100000 characters"
    );
  }
  return { version: 1, nodes };
}
function parseComposerTurn(body) {
  assertAllowedKeys(body, /* @__PURE__ */ new Set([
    "contractVersion",
    "revision",
    "document",
    "dangerFullAccessConfirmed",
    "attachments"
  ]));
  if (body.contractVersion !== "composer.v1") {
    throw new ApiError(
      400,
      "INVALID_COMPOSER_DOCUMENT",
      "'contractVersion' must be 'composer.v1'"
    );
  }
  if (body.dangerFullAccessConfirmed !== void 0 && typeof body.dangerFullAccessConfirmed !== "boolean") {
    throw new ApiError(400, "INVALID_FIELD", "'dangerFullAccessConfirmed' must be a boolean");
  }
  return {
    contractVersion: "composer.v1",
    revision: stringField(body.revision, "revision", { required: true, maxLength: 512 }),
    document: parseComposerDocument(body.document),
    dangerFullAccessConfirmed: body.dangerFullAccessConfirmed,
    attachments: parseAiAttachments(body.attachments)
  };
}
var EventHub = class {
  constructor() {
    this.clients = /* @__PURE__ */ new Set();
    this.keepAlive = setInterval(() => {
      for (const response of this.clients) response.write(": keep-alive\n\n");
    }, 2e4);
    this.keepAlive.unref();
  }
  connect(request, response) {
    response.writeHead(200, {
      connection: "keep-alive",
      "cache-control": "no-cache, no-transform",
      "content-type": "text/event-stream; charset=utf-8",
      "x-accel-buffering": "no"
    });
    response.write(": connected\n\n");
    this.clients.add(response);
    request.once("close", () => this.clients.delete(response));
  }
  emit(type, value) {
    const event = {
      type,
      projectId: value.projectId ?? value.project?.id ?? value.task?.projectId,
      taskId: value.task?.id ?? value.comment?.taskId ?? value.attachment?.taskId,
      ...value,
      at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const message = `event: ${type}
data: ${JSON.stringify(event)}

`;
    for (const response of this.clients) response.write(message);
  }
  close() {
    clearInterval(this.keepAlive);
    for (const response of this.clients) response.end();
    this.clients.clear();
  }
};
async function serveStatic(request, response, pathname, staticDirectory) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    throw new ApiError(400, "INVALID_PATH", "URL path contains invalid encoding");
  }
  if (decodedPath.includes("\0")) {
    throw new ApiError(400, "INVALID_PATH", "URL path is invalid");
  }
  const root = path9.resolve(staticDirectory);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  let filename = path9.resolve(root, relativePath);
  if (filename !== root && !filename.startsWith(`${root}${path9.sep}`)) {
    throw new ApiError(400, "INVALID_PATH", "URL path is outside the static directory");
  }
  let fileStats;
  try {
    fileStats = await stat2(filename);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!fileStats?.isFile() && !path9.extname(relativePath)) {
    filename = path9.join(root, "index.html");
    try {
      fileStats = await stat2(filename);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (!fileStats?.isFile()) return false;
  const body = await readFile4(filename);
  const headers = {
    "cache-control": path9.basename(filename) === "index.html" ? "no-cache" : "public, max-age=31536000, immutable",
    "content-length": body.length,
    "content-type": CONTENT_TYPES.get(path9.extname(filename).toLowerCase()) ?? "application/octet-stream"
  };
  response.writeHead(200, headers);
  response.end(request.method === "HEAD" ? void 0 : body);
  return true;
}
function methodNotAllowed(response, allowed) {
  sendJson(response, 405, {
    error: { code: "METHOD_NOT_ALLOWED", message: `Allowed methods: ${allowed.join(", ")}` }
  }, { allow: allowed.join(", ") });
}
function codexProjectRoot(state, projectId) {
  if (!projectId || !state || typeof state !== "object") return null;
  const project = state["local-projects"]?.[projectId];
  const root = Array.isArray(project?.rootPaths) ? project.rootPaths[0] : null;
  return typeof root === "string" && root.trim() ? root : null;
}
async function readCodexProjectWorkspaces(codexStatePath) {
  try {
    const state = JSON.parse(await readFile4(codexStatePath, "utf8"));
    const projects = state["local-projects"];
    if (!projects || typeof projects !== "object" || Array.isArray(projects)) return {};
    return Object.fromEntries(Object.keys(projects).flatMap((projectId) => {
      const root = codexProjectRoot(state, projectId);
      return root ? [[projectId, root]] : [];
    }));
  } catch {
    return {};
  }
}
function latestThreadCwd(value, threadId) {
  const matches = [];
  const stack = [value];
  while (stack.length > 0) {
    const candidate = stack.pop();
    if (!candidate || typeof candidate !== "object") continue;
    if (candidate.conversationId === threadId && typeof candidate.cwd === "string" && candidate.cwd.trim()) {
      matches.push(candidate);
    }
    stack.push(...Array.isArray(candidate) ? candidate : Object.values(candidate));
  }
  matches.sort((left, right) => Number(right.updatedAtMs ?? 0) - Number(left.updatedAtMs ?? 0));
  return matches[0]?.cwd ?? null;
}
async function resolveProjectWorkspace(project, codexProjectId, codexThreadId, codexStatePath, codexProcessesPath) {
  try {
    const state = JSON.parse(await readFile4(codexStatePath, "utf8"));
    const assignment = state["thread-project-assignments"]?.[codexThreadId];
    const root = codexProjectRoot(state, project.id) ?? codexProjectRoot(state, codexProjectId) ?? codexProjectRoot(state, assignment?.projectId) ?? (typeof assignment?.cwd === "string" ? assignment.cwd : null);
    if (root) return root;
  } catch {
  }
  if (project.workspacePath) return project.workspacePath;
  if (!codexThreadId) return null;
  try {
    const processes = JSON.parse(await readFile4(codexProcessesPath, "utf8"));
    return latestThreadCwd(processes, codexThreadId);
  } catch {
    return null;
  }
}
async function parseWorktrees(output) {
  const contexts = [];
  for (const block of output.trim().split(/\n\s*\n/)) {
    if (!block) continue;
    let worktreePath = "";
    let branch = null;
    let prunable = false;
    for (const line of block.split("\n")) {
      if (line.startsWith("worktree ")) worktreePath = line.slice(9);
      if (line.startsWith("branch refs/heads/")) branch = line.slice(18);
      if (line.startsWith("prunable")) prunable = true;
    }
    if (!worktreePath || prunable) continue;
    try {
      await stat2(worktreePath);
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    contexts.push({ type: "worktree", path: worktreePath, branch });
  }
  return contexts;
}
async function scanDevelopmentContexts(workspacePath, processEnv = process.env) {
  if (!workspacePath) return { workspacePath: null, contexts: [] };
  const environment = withoutTaskboardLauncherEnvironment(processEnv);
  try {
    const rootResult = await execFileAsync2("git", ["-C", workspacePath, "rev-parse", "--show-toplevel"], {
      env: environment,
      timeout: 4e3,
      maxBuffer: 1024 * 1024,
      windowsHide: true
    });
    const root = rootResult.stdout.trim();
    const [branchesResult, worktreesResult] = await Promise.all([
      execFileAsync2("git", ["-C", root, "for-each-ref", "--format=%(refname:short)", "refs/heads"], {
        env: environment,
        timeout: 4e3,
        maxBuffer: 1024 * 1024,
        windowsHide: true
      }),
      execFileAsync2("git", ["-C", root, "worktree", "list", "--porcelain"], {
        env: environment,
        timeout: 4e3,
        maxBuffer: 1024 * 1024,
        windowsHide: true
      })
    ]);
    const branches = branchesResult.stdout.split("\n").map((branch) => branch.trim()).filter(Boolean);
    return {
      workspacePath: root,
      contexts: [
        ...branches.map((branch) => ({ type: "branch", branch })),
        ...await parseWorktrees(worktreesResult.stdout)
      ]
    };
  } catch {
    return { workspacePath, contexts: [] };
  }
}
function resolveServerOptions(options = {}) {
  const environment = options.processEnv ?? process.env;
  const configuredDataDirectory = options.dataDirectory ?? environment.CODEX_TASKBOARD_DATA_DIR;
  const dataDirectory = configuredDataDirectory ? path9.resolve(configuredDataDirectory) : path9.join(PROJECT_ROOT, ".data");
  const codexHome = process.env.CODEX_HOME || path9.join(os4.homedir(), ".codex");
  const instanceToken = String(
    options.instanceToken ?? environment.CODEX_TASKBOARD_INSTANCE_TOKEN ?? ""
  ).trim();
  if (instanceToken && !/^[a-z0-9-]{16,128}$/i.test(instanceToken)) {
    throw new Error("CODEX_TASKBOARD_INSTANCE_TOKEN must be an identifier");
  }
  const instanceSecret = String(
    options.instanceSecret ?? environment.CODEX_TASKBOARD_INSTANCE_SECRET ?? ""
  ).trim();
  if (instanceToken && !/^[a-f0-9-]{32,128}$/i.test(instanceSecret)) {
    throw new Error("CODEX_TASKBOARD_INSTANCE_SECRET must be set in launcher mode");
  }
  return {
    dataDirectory,
    databasePath: options.databasePath ?? path9.join(dataDirectory, "taskboard.sqlite"),
    attachmentsDirectory: options.attachmentsDirectory ?? path9.join(dataDirectory, "attachments"),
    cloudConfigPath: options.cloudConfigPath ?? path9.join(dataDirectory, "cloud-companion.json"),
    jiraConfigPath: options.jiraConfigPath ?? path9.join(dataDirectory, "jira-connection.json"),
    clientStoragePath: options.clientStoragePath ?? path9.join(dataDirectory, "client-storage.json"),
    staticDirectory: options.staticDirectory ?? path9.join(PROJECT_ROOT, "dist", "web"),
    skillPath: options.skillPath ?? environment.CODEX_TASKBOARD_SKILL_PATH ?? path9.join(PROJECT_ROOT, "skills", "manage-taskboard", "SKILL.md"),
    codexExecutable: resolveCodexExecutable({ explicit: options.codexExecutable }),
    codexStatePath: options.codexStatePath ?? path9.join(codexHome, ".codex-global-state.json"),
    codexProcessesPath: options.codexProcessesPath ?? path9.join(codexHome, "process_manager", "chat_processes.json"),
    instanceToken,
    instanceSecret,
    trustedOrigins: parseTrustedOrigins(environment[TRUSTED_ORIGINS_ENV]),
    version: String(
      options.version ?? environment.CODEX_TASKBOARD_VERSION ?? "development"
    ).trim()
  };
}
function resolvePort(value = process.env.CODEX_TASKBOARD_PORT ?? "47823") {
  const port = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("CODEX_TASKBOARD_PORT must be an integer between 1 and 65535");
  }
  return port;
}
function resolveHost(value = process.env.CODEX_TASKBOARD_HOST ?? "0.0.0.0") {
  const host = String(value).trim();
  if (host !== "127.0.0.1" && host !== "0.0.0.0") {
    throw new Error("CODEX_TASKBOARD_HOST must be 127.0.0.1 or 0.0.0.0");
  }
  return host;
}
function createTaskboardServer(options = {}) {
  const resolved = resolveServerOptions(options);
  const codexProcessEnvironment = withoutTaskboardLauncherEnvironment(
    options.processEnv ?? process.env
  );
  const routePrefix = resolved.instanceToken ? `/${resolved.instanceToken}` : "";
  const database = new TaskboardDatabase(resolved.databasePath);
  const events = new EventHub();
  let clientStorageWrite = Promise.resolve();
  async function readClientStorage() {
    try {
      const value = JSON.parse(await readFile4(resolved.clientStoragePath, "utf8"));
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw error;
    }
  }
  function parseClientStorageUpdate(body) {
    assertPlainObject(body);
    assertAllowedKeys(body, /* @__PURE__ */ new Set(["key", "value"]));
    const key = stringField(body.key, "key", { required: true, maxLength: 512 });
    const value = stringField(body.value, "value", { nullable: true, maxLength: 1e5 });
    return { key, value };
  }
  async function updateClientStorage({ key, value }) {
    clientStorageWrite = clientStorageWrite.catch(() => {
    }).then(async () => {
      const entries = await readClientStorage();
      if (value === null) delete entries[key];
      else entries[key] = value;
      await mkdir3(path9.dirname(resolved.clientStoragePath), { recursive: true });
      const temporaryPath = `${resolved.clientStoragePath}.${process.pid}.tmp`;
      await writeFile4(temporaryPath, `${JSON.stringify(entries)}
`, { mode: 384 });
      await chmod2(temporaryPath, 384);
      await rename3(temporaryPath, resolved.clientStoragePath);
      await chmod2(resolved.clientStoragePath, 384);
    });
    await clientStorageWrite;
  }
  const cloudConfig = options.cloudConfigStore ?? createCloudConfigStore({
    configPath: resolved.cloudConfigPath
  });
  const jiraConfig = options.jiraConfigStore ?? createJiraConfigStore({
    configPath: resolved.jiraConfigPath
  });
  const jira = createJiraIntegration({
    configStore: jiraConfig,
    database,
    fetch: options.jiraFetch ?? globalThis.fetch
  });
  let hostRuntime = null;
  function currentHostThreadBinding(threadId) {
    if (!hostRuntime || hostRuntime.threadId !== threadId || !hostRuntime.codexProjectId || !hostRuntime.codexProjectKind || !hostRuntime.codexHostId || !hostRuntime.workspacePath) return void 0;
    return {
      threadId,
      codexProjectId: hostRuntime.codexProjectId,
      codexProjectKind: hostRuntime.codexProjectKind,
      codexHostId: hostRuntime.codexHostId,
      workspacePath: hostRuntime.workspacePath
    };
  }
  function resolveInputThreadBinding(input) {
    if (input.threadBinding !== void 0) return input;
    const threadBinding = currentHostThreadBinding(input.threadId);
    return threadBinding ? { ...input, threadBinding } : input;
  }
  const remoteFetch = options.remoteFetch ?? globalThis.fetch;
  const cloudProxy = createCloudProxy({
    configStore: cloudConfig,
    fetch: remoteFetch,
    resolveThreadBinding: currentHostThreadBinding,
    resolveDevelopmentContext: async (projectId, context) => {
      if (!context.branch) return null;
      const config = await cloudConfig.read();
      const workspacePath = config.projectMappings[projectId];
      if (!workspacePath) return null;
      const result = await scanDevelopmentContexts(workspacePath, codexProcessEnvironment);
      return result.contexts.find((candidate) => candidate.type === "worktree" && candidate.branch === context.branch) ?? null;
    },
    assertTaskProjectMoveAllowed: (taskId, targetProjectId) => {
      if (!database.hasAiChatThreadProjectConflict(taskId, targetProjectId)) return;
      throw new CloudProxyError(
        409,
        "AI_CHAT_PROJECT_MOVE_BLOCKED",
        "Delete issue-linked AI conversations before moving the issue to another project"
      );
    }
  });
  async function readCloudJson(pathname) {
    const upstream = await cloudProxy.forward(new Request(`http://127.0.0.1${pathname}`, {
      headers: { accept: "application/json" }
    }));
    let payload;
    try {
      payload = await upstream.json();
    } catch {
      throw new ApiError(
        upstream.ok ? 502 : upstream.status,
        "INVALID_CLOUD_RESPONSE",
        "Cloud taskboard returned an invalid JSON response"
      );
    }
    if (!upstream.ok) {
      throw new ApiError(
        upstream.status,
        payload?.error?.code ?? "CLOUD_REQUEST_FAILED",
        payload?.error?.message ?? "Cloud taskboard request failed",
        payload?.error?.details
      );
    }
    return payload;
  }
  async function resolveAiChatContext(projectId, issueId, codexTarget) {
    const config = await cloudConfig.read();
    if (!config.remoteUrl) {
      if (codexTarget?.codexProjectKind === "remote") {
        const project2 = database.getProject(projectId);
        if (!project2) {
          throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
        }
        let issue3;
        if (issueId !== void 0) {
          issue3 = database.getTask(issueId);
          if (!issue3 || issue3.projectId !== projectId || issue3.archivedAt != null) {
            throw new ApiError(
              404,
              "AI_CHAT_ISSUE_NOT_FOUND",
              `Task '${issueId}' is not an active task in project '${projectId}'`
            );
          }
        }
        return { project: project2, issue: issue3, addDirectories: [], ...codexTarget };
      }
      let resolvedWorkspace3;
      try {
        resolvedWorkspace3 = await resolveAiWorkspace(
          projectId,
          resolved.codexStatePath,
          database
        );
      } catch (error) {
        if (!(error instanceof ApiError) || error.code !== "PROJECT_WORKSPACE_UNAVAILABLE" || projectId !== DEFAULT_PROJECT_ID) {
          throw error;
        }
        resolvedWorkspace3 = {
          workspacePath: PROJECT_ROOT,
          addDirectories: [],
          project: database.getProject(projectId)
        };
      }
      let issue2;
      if (issueId !== void 0) {
        issue2 = database.getTask(issueId);
        if (!issue2 || issue2.projectId !== projectId || issue2.archivedAt != null) {
          throw new ApiError(
            404,
            "AI_CHAT_ISSUE_NOT_FOUND",
            `Task '${issueId}' is not an active task in project '${projectId}'`
          );
        }
      }
      return { ...resolvedWorkspace3, issue: issue2 };
    }
    const projectPayload = await readCloudJson("/api/projects");
    const project = Array.isArray(projectPayload.projects) ? projectPayload.projects.find((candidate) => candidate?.id === projectId) : null;
    if (!project) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
    }
    let issue;
    if (issueId !== void 0) {
      const issuePayload = await readCloudJson(`/api/tasks/${encodeURIComponent(issueId)}`);
      issue = issuePayload.task;
      if (!issue || issue.projectId !== projectId || issue.archivedAt != null) {
        throw new ApiError(
          404,
          "AI_CHAT_ISSUE_NOT_FOUND",
          `Task '${issueId}' is not an active task in project '${projectId}'`
        );
      }
    }
    if (codexTarget?.codexProjectKind === "remote") {
      return { project, issue, addDirectories: [], ...codexTarget };
    }
    const resolvedWorkspace2 = await resolveMappedAiWorkspace(
      projectId,
      project,
      config.projectMappings
    );
    return { ...resolvedWorkspace2, issue };
  }
  const aiChat = new AiChatService({
    database,
    codexExecutable: resolved.codexExecutable,
    codexStatePath: resolved.codexStatePath,
    manageTaskboardSkillPath: resolved.skillPath,
    processEnv: codexProcessEnvironment,
    resolveContext: resolveAiChatContext,
    remoteAppServerFactory: options.remoteAppServerFactory
  });
  const projectSummary = new ProjectSummaryService({
    database,
    codexExecutable: resolved.codexExecutable,
    processEnv: codexProcessEnvironment,
    workspacePath: PROJECT_ROOT
  });
  const aiEventResponses = /* @__PURE__ */ new Set();
  const codexSessionSearches = /* @__PURE__ */ new Map();
  const codexSessionStateCache = /* @__PURE__ */ new Map();
  const codexSessionsDirectory = path9.join(path9.dirname(resolved.codexStatePath), "sessions");
  async function findCodexSession(threadId) {
    const cached = codexSessionSearches.get(threadId);
    if (cached && (cached.path || Date.now() - cached.checkedAt < 5e3)) return cached.path;
    const suffix = `-${threadId}.jsonl`;
    const directories = [codexSessionsDirectory];
    while (directories.length > 0) {
      const directory = directories.pop();
      let entries;
      try {
        entries = await readdir2(directory, { withFileTypes: true });
      } catch (error) {
        if (error.code === "ENOENT") continue;
        throw error;
      }
      for (const entry of entries) {
        const entryPath = path9.join(directory, entry.name);
        if (entry.isDirectory()) {
          directories.push(entryPath);
        } else if (entry.isFile() && entry.name.endsWith(suffix)) {
          codexSessionSearches.set(threadId, { path: entryPath, checkedAt: Date.now() });
          return entryPath;
        }
      }
    }
    codexSessionSearches.set(threadId, { path: null, checkedAt: Date.now() });
    return null;
  }
  async function readCodexSessionState(threadId) {
    const sessionPath = await findCodexSession(threadId);
    if (!sessionPath) return null;
    const sessionStat = await stat2(sessionPath);
    const cached = codexSessionStateCache.get(sessionPath);
    if (cached?.size === sessionStat.size && cached.mtimeMs === sessionStat.mtimeMs) {
      return cached.state;
    }
    const length = Math.min(sessionStat.size, CODEX_PLAN_TAIL_BYTES);
    const buffer = Buffer.alloc(length);
    const handle = await open(sessionPath, "r");
    try {
      await handle.read(buffer, 0, length, sessionStat.size - length);
    } finally {
      await handle.close();
    }
    const lines = buffer.toString("utf8").split("\n");
    if (length < sessionStat.size) lines.shift();
    const records = [];
    for (const line of lines) {
      try {
        records.push(JSON.parse(line));
      } catch {
      }
    }
    let runningTurnId = null;
    for (const record of records) {
      const payload = record?.payload;
      if (record?.type !== "event_msg" || typeof payload?.turn_id !== "string") continue;
      if (payload.type === "task_started") runningTurnId = payload.turn_id;
      if ((payload.type === "task_complete" || payload.type === "turn_aborted") && payload.turn_id === runningTurnId) {
        runningTurnId = null;
      }
    }
    let progress = null;
    for (let index = records.length - 1; index >= 0; index -= 1) {
      const record = records[index];
      const payload = record?.payload;
      if (payload?.type !== "custom_tool_call" || typeof payload.input !== "string") continue;
      let statuses = [];
      if (payload.name === "update_plan") {
        try {
          const input = JSON.parse(payload.input);
          statuses = Array.isArray(input.plan) ? input.plan.map((item) => item?.status).filter(Boolean) : [];
        } catch {
        }
      } else if (payload.name === "exec") {
        const callIndex = payload.input.lastIndexOf("tools.update_plan(");
        if (callIndex < 0) continue;
        statuses = [...payload.input.slice(callIndex).matchAll(
          /["']?status["']?\s*:\s*["'](completed|in_progress|pending)["']/g
        )].map((match) => match[1]);
      }
      if (statuses.length > 0) {
        progress = {
          completed: statuses.filter((status) => status === "completed").length,
          total: statuses.length
        };
        break;
      }
    }
    const state = {
      completed: progress?.completed ?? null,
      total: progress?.total ?? null,
      running: runningTurnId !== null
    };
    codexSessionStateCache.set(sessionPath, {
      size: sessionStat.size,
      mtimeMs: sessionStat.mtimeMs,
      state
    });
    return state;
  }
  const server = createServer(async (request, response) => {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("referrer-policy", "no-referrer");
    try {
      const incomingUrl = new URL(request.url, "http://127.0.0.1");
      if (resolved.instanceToken && incomingUrl.pathname !== "/health") {
        if (incomingUrl.pathname === routePrefix) {
          response.writeHead(301, { location: `${incomingUrl.pathname}/${incomingUrl.search}` });
          response.end();
          return;
        }
        if (incomingUrl.pathname !== routePrefix && !incomingUrl.pathname.startsWith(`${routePrefix}/`)) {
          throw new ApiError(404, "NOT_FOUND", "Route not found");
        }
        request.url = `${incomingUrl.pathname.slice(routePrefix.length) || "/"}${incomingUrl.search}`;
      }
      const configuredTrustedRequest = assertTrustedNetworkRequest(
        request,
        Boolean(resolved.instanceToken),
        resolved.trustedOrigins
      );
      const origin = request.headers.origin;
      const trustedEmbedOrigin = TRUSTED_EMBED_ORIGINS.has(origin) || Boolean(resolved.instanceToken) && origin === "null";
      if (trustedEmbedOrigin) {
        response.setHeader("access-control-allow-origin", origin);
        response.setHeader("access-control-allow-methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
        response.setHeader(
          "access-control-allow-headers",
          request.headers["access-control-request-headers"] ?? "content-type"
        );
        response.setHeader("access-control-expose-headers", "x-codex-taskboard-proof");
        response.setHeader("access-control-allow-private-network", "true");
        response.setHeader("vary", "origin");
        if (request.method === "OPTIONS") {
          response.writeHead(204);
          response.end();
          return;
        }
      }
      if (resolved.instanceToken && origin === "app://-") {
        const challenge = request.headers["x-codex-taskboard-challenge"];
        if (typeof challenge !== "string" || !/^[a-f0-9]{32,128}$/i.test(challenge)) {
          throw new ApiError(401, "INVALID_INSTANCE_CHALLENGE", "Launcher challenge is required");
        }
        response.setHeader(
          "x-codex-taskboard-proof",
          createHmac("sha256", resolved.instanceSecret).update(challenge).digest("hex")
        );
      }
      const url = new URL(request.url, "http://127.0.0.1");
      const pathname = url.pathname;
      const isLocalAiRoute = pathname === "/api/local/ai" || pathname.startsWith("/api/local/ai/");
      const isDevelopmentContextsRoute = /^\/api\/projects\/[^/]+\/development-contexts$/.test(pathname);
      if (configuredTrustedRequest && (pathname.startsWith("/api/local/") || pathname === "/api/device-workspaces" || isDevelopmentContextsRoute)) {
        throw new ApiError(
          409,
          "LOCAL_COMPANION_REQUIRED",
          "This capability requires a device-local Taskboard origin"
        );
      }
      if (isLocalAiRoute) {
        assertAiLoopbackRequest(request);
      } else if (pathname.startsWith("/api/local/")) {
        assertLoopbackRequest(request);
      }
      const isMachineCapabilityRoute = pathname === "/api/meta" || pathname === "/api/device-workspaces" || isDevelopmentContextsRoute;
      const capabilityCloudConfig = isMachineCapabilityRoute ? await cloudConfig.read() : null;
      if (capabilityCloudConfig?.remoteUrl) assertLoopbackRequest(request);
      if (pathname === "/health") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        if (resolved.instanceToken) {
          const challenge = request.headers["x-codex-taskboard-challenge"];
          if (typeof challenge !== "string" || !/^[a-f0-9]{32,128}$/i.test(challenge)) {
            throw new ApiError(401, "INVALID_INSTANCE_CHALLENGE", "Launcher challenge is required");
          }
          return sendJson(response, 200, {
            status: "ok",
            product: "codex-taskboard",
            version: resolved.version,
            proof: createHmac("sha256", resolved.instanceSecret).update(challenge).digest("hex")
          });
        }
        return sendJson(response, 200, { status: "ok" });
      }
      if (pathname === "/api/client-storage") {
        if (request.method === "GET") {
          await clientStorageWrite;
          const entries = await readClientStorage();
          const config = await cloudConfig.read();
          if (config.remoteUrl) {
            assertLoopbackRequest(request);
            const shared = await readCloudJson("/api/client-storage");
            for (const key of Object.keys(entries)) {
              if (key.startsWith(PROJECT_BOARD_DISPLAY_SETTINGS_KEY_PREFIX)) delete entries[key];
            }
            for (const [key, value] of Object.entries(shared.entries)) {
              if (key.startsWith(PROJECT_BOARD_DISPLAY_SETTINGS_KEY_PREFIX)) entries[key] = value;
            }
          }
          return sendJson(response, 200, { entries });
        }
        if (request.method === "PATCH") {
          const update = parseClientStorageUpdate(await readJson(request));
          const config = await cloudConfig.read();
          if (config.remoteUrl && update.key.startsWith(PROJECT_BOARD_DISPLAY_SETTINGS_KEY_PREFIX)) {
            assertLoopbackRequest(request);
            return sendFetchResponse(
              response,
              await cloudProxy.forward(new Request("http://127.0.0.1/api/client-storage", {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(update)
              }))
            );
          }
          await updateClientStorage(update);
          if (update.key.startsWith(PROJECT_BOARD_DISPLAY_SETTINGS_KEY_PREFIX)) {
            events.emit("client-storage.updated", { key: update.key });
          }
          return sendEmpty(response, 204);
        }
        return methodNotAllowed(response, ["GET", "PATCH"]);
      }
      if (pathname === "/api/local/codex-thread-progress") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        if ([...url.searchParams.keys()].some((key) => key !== "threadId")) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Only 'threadId' is supported");
        }
        const threadIds = [...new Set(url.searchParams.getAll("threadId").map((value) => value.trim().replace(/^(?:local|cloud):/i, "")))];
        if (threadIds.length > 64 || threadIds.some((threadId) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(threadId))) {
          throw new ApiError(400, "INVALID_FIELD", "'threadId' must contain valid Codex thread IDs");
        }
        const entries = await Promise.all(threadIds.map(async (threadId) => [threadId, await readCodexSessionState(threadId)]));
        return sendJson(response, 200, { progress: Object.fromEntries(entries) });
      }
      if (pathname === "/api/local/host-runtime") {
        if (request.method === "GET") {
          const runtime = hostRuntime && Date.now() - hostRuntime.updatedAt <= HOST_RUNTIME_TTL_MS ? hostRuntime : null;
          return sendJson(response, 200, { runtime });
        }
        if (request.method === "PUT") {
          const body = await readJson(request);
          assertPlainObject(body);
          assertAllowedKeys(body, /* @__PURE__ */ new Set([
            "threadId",
            "threadRunning",
            "threadTodoProgress",
            "codexProjectId",
            "codexProjectKind",
            "codexHostId",
            "workspacePath"
          ]));
          const threadId = stringField(body.threadId, "threadId", { required: true, maxLength: 256 });
          if (typeof body.threadRunning !== "boolean") {
            throw new ApiError(400, "INVALID_FIELD", "'threadRunning' must be a boolean");
          }
          let threadTodoProgress = null;
          if (body.threadTodoProgress != null) {
            assertPlainObject(body.threadTodoProgress);
            assertAllowedKeys(body.threadTodoProgress, /* @__PURE__ */ new Set(["completed", "total"]));
            const { completed, total } = body.threadTodoProgress;
            if (!Number.isInteger(completed) || !Number.isInteger(total) || completed < 0 || total < 1) {
              throw new ApiError(400, "INVALID_FIELD", "'threadTodoProgress' is invalid");
            }
            threadTodoProgress = { completed: Math.min(completed, total), total };
          }
          hostRuntime = {
            threadId,
            threadRunning: body.threadRunning,
            threadTodoProgress,
            codexProjectId: stringField(body.codexProjectId ?? null, "codexProjectId", {
              nullable: true,
              maxLength: 256
            }),
            codexProjectKind: body.codexProjectKind === "local" || body.codexProjectKind === "remote" ? body.codexProjectKind : null,
            codexHostId: stringField(body.codexHostId ?? null, "codexHostId", {
              nullable: true,
              maxLength: 256
            }),
            workspacePath: stringField(body.workspacePath ?? null, "workspacePath", {
              nullable: true,
              maxLength: 4096
            }),
            updatedAt: Date.now()
          };
          return sendJson(response, 200, { runtime: hostRuntime });
        }
        return methodNotAllowed(response, ["GET", "PUT"]);
      }
      if (pathname === "/api/local/cloud-session") {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Cloud session routes do not accept query parameters");
        }
        if (request.method === "GET") {
          const config = await cloudConfig.read();
          return sendJson(response, 200, config.remoteUrl ? {
            mode: "cloud",
            remoteUrl: config.remoteUrl,
            actorName: config.actorName,
            authenticated: true
          } : { mode: "local", authenticated: false });
        }
        if (request.method === "PUT") {
          const body = await readJson(request);
          assertPlainObject(body);
          assertAllowedKeys(body, /* @__PURE__ */ new Set(["remoteUrl", "actorName", "accountPassword"]));
          try {
            const remoteUrl = normalizeCloudUrl(body.remoteUrl);
            const validation = await remoteFetch(new URL("/api/auth/cli-login", `${remoteUrl}/`), {
              method: "POST",
              headers: {
                authorization: basicAuthorization(body.actorName, body.accountPassword),
                "x-taskboard-client": "taskctl"
              }
            });
            if (validation.status === 401) {
              throw new ApiError(401, "INVALID_CLOUD_CREDENTIALS", "\u8D26\u53F7\u6216\u5BC6\u7801\u4E0D\u6B63\u786E");
            }
            if (!validation.ok) {
              throw new ApiError(
                502,
                "CLOUD_LOGIN_FAILED",
                `\u4E91\u7AEF\u4EFB\u52A1\u9762\u677F\u62D2\u7EDD\u4E86\u767B\u5F55\u9A8C\u8BC1\uFF08${validation.status}\uFF09`
              );
            }
            const login = await validation.json();
            if (typeof login?.accessToken !== "string" || !login.accessToken || typeof login?.member?.username !== "string" || !login.member.username) {
              throw new ApiError(502, "INVALID_CLOUD_LOGIN_RESPONSE", "\u4E91\u7AEF\u4EFB\u52A1\u9762\u677F\u8FD4\u56DE\u4E86\u65E0\u6548\u7684\u767B\u5F55\u54CD\u5E94");
            }
            const config = await cloudConfig.configure({
              remoteUrl,
              actorName: login.member.username,
              accessToken: login.accessToken
            });
            return sendJson(response, 200, {
              mode: "cloud",
              remoteUrl: config.remoteUrl,
              actorName: config.actorName,
              authenticated: true
            });
          } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(400, error.code ?? "INVALID_CLOUD_CONFIG", error.message);
          }
        }
        if (request.method === "DELETE") {
          await cloudConfig.clearCloud();
          return sendJson(response, 200, { mode: "local", authenticated: false });
        }
        return methodNotAllowed(response, ["GET", "PUT", "DELETE"]);
      }
      if (pathname === "/api/local/jira-connection") {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Jira \u8FDE\u63A5\u63A5\u53E3\u4E0D\u63A5\u53D7\u67E5\u8BE2\u53C2\u6570");
        }
        if (request.method === "GET") {
          return sendJson(response, 200, { connection: await jira.status() });
        }
        if (request.method === "PUT") {
          const activeCloudConfig = await cloudConfig.read();
          if (activeCloudConfig.remoteUrl) {
            throw new ApiError(
              409,
              "JIRA_LOCAL_MODE_REQUIRED",
              "Jira \u8FDE\u63A5\u5F53\u524D\u4EC5\u652F\u6301\u672C\u5730\u6570\u636E\u6A21\u5F0F\uFF0C\u8BF7\u5148\u9000\u51FA\u4E91\u7AEF\u534F\u4F5C\u6A21\u5F0F"
            );
          }
          const body = await readJson(request);
          assertPlainObject(body);
          assertAllowedKeys(body, /* @__PURE__ */ new Set(["baseUrl", "username", "password", "projects"]));
          const baseUrl = stringField(body.baseUrl, "baseUrl", { required: true, maxLength: 2048 });
          const username = stringField(body.username ?? "", "username", { maxLength: 254 });
          const password = body.password ?? "";
          if (typeof password !== "string") {
            throw new ApiError(400, "INVALID_FIELD", "'password' must be a string");
          }
          if (password.length > 4096) {
            throw new ApiError(400, "INVALID_FIELD", "'password' cannot exceed 4096 characters");
          }
          try {
            const connection = await jira.configure({
              baseUrl,
              username,
              password,
              projects: body.projects
            });
            events.emit("project.labels.updated", { project: database.getProject(JIRA_PROJECT_ID) });
            return sendJson(response, 200, { connection });
          } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(400, error.code ?? "INVALID_JIRA_CONFIG", error.message);
          }
        }
        return methodNotAllowed(response, ["GET", "PUT"]);
      }
      if (pathname === "/api/local/jira-connection/sync") {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Jira \u540C\u6B65\u63A5\u53E3\u4E0D\u63A5\u53D7\u67E5\u8BE2\u53C2\u6570");
        }
        await assertEmptyRequestBody(request, "POST /api/local/jira-connection/sync");
        const connection = await jira.sync({ force: true });
        events.emit("project.labels.updated", { project: database.getProject(JIRA_PROJECT_ID) });
        return sendJson(response, 200, { connection });
      }
      const projectMappingSelectRoute = pathname.match(/^\/api\/local\/project-mappings\/([^/]+)\/select$/);
      if (projectMappingSelectRoute) {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project mapping selection does not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectMappingSelectRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        await assertEmptyRequestBody(request, "POST /api/local/project-mappings/:projectId/select");
        const currentConfig = await cloudConfig.read();
        const workspacePath = await selectWorkspaceDirectory(currentConfig.projectMappings[projectId]);
        if (workspacePath) await cloudConfig.setProjectWorkspace(projectId, workspacePath);
        return sendJson(response, 200, { projectId, workspacePath });
      }
      const projectMappingRoute = pathname.match(/^\/api\/local\/project-mappings\/([^/]+)$/);
      if (projectMappingRoute) {
        if (request.method !== "PUT") return methodNotAllowed(response, ["PUT"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project mapping routes do not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectMappingRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        const body = await readJson(request);
        assertPlainObject(body);
        assertAllowedKeys(body, /* @__PURE__ */ new Set(["workspacePath"]));
        const workspacePath = pathField(body.workspacePath, "workspacePath");
        if (!workspacePath || !path9.isAbsolute(workspacePath)) {
          throw new ApiError(400, "INVALID_FIELD", "'workspacePath' must be absolute");
        }
        await cloudConfig.setProjectWorkspace(projectId, workspacePath);
        return sendJson(response, 200, { projectId, workspacePath });
      }
      if (pathname === "/api/meta") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "GET /api/meta does not accept query parameters");
        }
        return sendJson(response, 200, {
          ...configuredTrustedRequest ? {} : { manageTaskboardSkillPath: resolved.skillPath },
          capabilities: {
            localAiChat: !configuredTrustedRequest && isLoopbackAddress(request.socket.remoteAddress)
          },
          ...capabilityCloudConfig?.remoteUrl ? {
            mode: "cloud",
            realtime: {
              transport: "websocket",
              endpoint: "/api/events"
            },
            localCapabilities: { available: !configuredTrustedRequest }
          } : {}
        });
      }
      if (pathname === "/api/local/ai/catalog") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        assertAllowedQuery(url.searchParams, /* @__PURE__ */ new Set([
          "projectId",
          "codexProjectId",
          "codexProjectKind",
          "codexHostId",
          "workspacePath"
        ]), "GET /api/local/ai/catalog");
        const projectId = validateProjectId(url.searchParams.get("projectId") ?? void 0);
        return sendJson(
          response,
          200,
          await aiChat.getCatalog(projectId, void 0, aiExecutionTargetFromQuery(url.searchParams))
        );
      }
      if (pathname === "/api/local/ai/composer/candidates") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        const query = parseComposerCandidateQuery(url.searchParams);
        return sendJson(
          response,
          200,
          await aiChat.composerCatalog.candidatesForSurface(
            await aiChat.getComposerCandidates(query),
            query
          )
        );
      }
      if (pathname === "/api/local/ai/composer/rebind") {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        assertNoQuery(url.searchParams, "POST /api/local/ai/composer/rebind");
        const input = parseComposerRebindRequest(await readJson(request));
        const { workspacePath, composerCatalog } = await resolveComposerRebindWorkspace(aiChat, input);
        return sendJson(
          response,
          200,
          await composerCatalog.rebindPersistedReferences({
            workspacePath,
            nodes: input.document.nodes
          })
        );
      }
      const projectSummaryRoute = pathname.match(/^\/api\/local\/projects\/([^/]+)\/summary$/);
      if (projectSummaryRoute) {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        assertNoQuery(url.searchParams, "GET /api/local/projects/:id/summary");
        const projectId = validateProjectId(
          decodeRouteSegment(projectSummaryRoute[1], "Project id")
        );
        return sendJson(response, 200, projectSummary.get(projectId));
      }
      if (pathname === "/api/local/ai/threads") {
        assertNoQuery(url.searchParams, "/api/local/ai/threads");
        if (request.method === "GET") {
          return sendJson(response, 200, { threads: await aiChat.listThreads() });
        }
        if (request.method === "POST") {
          const thread = await aiChat.createThread(parseAiThreadCreate(await readJson(request)));
          return sendJson(response, 201, { thread });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      const aiThreadEventsRoute = pathname.match(/^\/api\/local\/ai\/threads\/([^/]+)\/events$/);
      if (aiThreadEventsRoute) {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        assertNoQuery(url.searchParams, "GET /api/local/ai/threads/:id/events");
        const threadId = decodeRouteSegment(aiThreadEventsRoute[1], "Thread id");
        await aiChat.getThreadSnapshot(threadId);
        response.writeHead(200, {
          connection: "keep-alive",
          "cache-control": "no-cache, no-transform",
          "content-type": "text/event-stream; charset=utf-8",
          "x-accel-buffering": "no"
        });
        aiEventResponses.add(response);
        const unsubscribe = aiChat.subscribe(threadId, (event) => {
          const type = event?.type === "ai.run" ? "ai.run" : "ai.event";
          response.write(`event: ${type}
data: ${JSON.stringify(event)}

`);
        });
        response.write(": connected\n\n");
        response.write('event: ai.event\ndata: {"type":"ai.event"}\n\n');
        const keepAlive = setInterval(() => response.write(": keep-alive\n\n"), 2e4);
        keepAlive.unref();
        request.once("close", () => {
          clearInterval(keepAlive);
          unsubscribe();
          aiEventResponses.delete(response);
        });
        return;
      }
      const aiThreadTurnRoute = pathname.match(/^\/api\/local\/ai\/threads\/([^/]+)\/turns$/);
      if (aiThreadTurnRoute) {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        assertNoQuery(url.searchParams, "POST /api/local/ai/threads/:id/turns");
        const threadId = decodeRouteSegment(aiThreadTurnRoute[1], "Thread id");
        const run = await aiChat.startTurn(
          threadId,
          parseAiTurn(await readJson(
            request,
            AI_CHAT_TURN_BODY_LIMIT,
            "AI chat turn body cannot exceed 25 MiB"
          ))
        );
        return sendJson(response, 202, { run });
      }
      const aiThreadCompactRoute = pathname.match(/^\/api\/local\/ai\/threads\/([^/]+)\/compact$/);
      if (aiThreadCompactRoute) {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        assertNoQuery(url.searchParams, "POST /api/local/ai/threads/:id/compact");
        const threadId = decodeRouteSegment(aiThreadCompactRoute[1], "Thread id");
        await assertEmptyRequestBody(request, "POST /api/local/ai/threads/:id/compact");
        const thread = await aiChat.compactThread(threadId);
        return sendJson(response, 200, { thread });
      }
      const aiThreadRoute = pathname.match(/^\/api\/local\/ai\/threads\/([^/]+)$/);
      if (aiThreadRoute) {
        assertNoQuery(url.searchParams, "/api/local/ai/threads/:id");
        const threadId = decodeRouteSegment(aiThreadRoute[1], "Thread id");
        if (request.method === "GET") {
          return sendJson(response, 200, await aiChat.getThreadSnapshot(threadId));
        }
        if (request.method === "PATCH") {
          const thread = await aiChat.updateThread(threadId, parseAiThreadPatch(await readJson(request)));
          return sendJson(response, 200, { thread });
        }
        if (request.method === "DELETE") {
          await assertEmptyRequestBody(request, "DELETE /api/local/ai/threads/:id");
          await aiChat.deleteThread(threadId);
          return sendEmpty(response, 204);
        }
        return methodNotAllowed(response, ["GET", "PATCH", "DELETE"]);
      }
      const aiInterruptRoute = pathname.match(/^\/api\/local\/ai\/runs\/([^/]+)\/interrupt$/);
      if (aiInterruptRoute) {
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        assertNoQuery(url.searchParams, "POST /api/local/ai/runs/:id/interrupt");
        const runId = decodeRouteSegment(aiInterruptRoute[1], "Run id");
        await assertEmptyRequestBody(request, "POST /api/local/ai/runs/:id/interrupt");
        const run = await aiChat.interrupt(runId);
        return sendJson(response, 200, { run });
      }
      if (pathname === "/api/device-workspaces") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "GET /api/device-workspaces does not accept query parameters");
        }
        return sendJson(response, 200, {
          workspaces: await readCodexProjectWorkspaces(resolved.codexStatePath)
        });
      }
      let currentCloudConfig = null;
      if (pathname.startsWith("/api/")) {
        currentCloudConfig = await cloudConfig.read();
        if (currentCloudConfig.remoteUrl) {
          assertLoopbackRequest(request);
          if (!isLocalCompanionRoute(pathname)) {
            return sendFetchResponse(
              response,
              await cloudProxy.forward(toFetchRequest(request))
            );
          }
        }
      }
      if (pathname === "/api/projects") {
        if (request.method === "GET") {
          if ([...url.searchParams.keys()].length > 0) {
            throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "GET /api/projects does not accept query parameters");
          }
          const projects = database.listProjects().map((project) => ({
            ...project,
            workspacePath: project.id === DEFAULT_PROJECT_ID ? null : currentCloudConfig?.projectMappings[project.id] ?? project.workspacePath
          }));
          return sendJson(response, 200, { projects });
        }
        if (request.method === "POST") {
          const project = database.createProject(parseProjectCreate(await readJson(request)));
          events.emit("project.created", { project });
          return sendJson(response, 201, { project });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      const projectRoute = pathname.match(/^\/api\/projects\/([^/]+)$/);
      if (projectRoute) {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project routes do not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        if (request.method === "PATCH") {
          const project = database.renameProject(
            projectId,
            parseProjectUpdate(await readJson(request)).name
          );
          events.emit("project.updated", { project });
          return sendJson(response, 200, { project });
        }
        if (request.method === "DELETE") {
          database.deleteProject(projectId);
          return sendEmpty(response, 204);
        }
        return methodNotAllowed(response, ["PATCH", "DELETE"]);
      }
      const projectLabelsRoute = pathname.match(/^\/api\/projects\/([^/]+)\/labels$/);
      if (projectLabelsRoute) {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project label routes do not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectLabelsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        if (request.method !== "POST" && request.method !== "DELETE") {
          return methodNotAllowed(response, ["POST", "DELETE"]);
        }
        if (request.method === "DELETE" && projectId === JIRA_PROJECT_ID) {
          throw new ApiError(
            409,
            "JIRA_LABEL_CATALOG_DELETE_UNAVAILABLE",
            "Jira \u6807\u7B7E\u76EE\u5F55\u7531\u540C\u6B65\u7BA1\u7406\uFF0C\u4E0D\u80FD\u5728 Taskboard \u4E2D\u5220\u9664"
          );
        }
        const label = parseProjectLabel(await readJson(request));
        const project = request.method === "POST" ? database.addProjectLabel(projectId, label) : database.deleteProjectLabel(projectId, label);
        events.emit("project.labels.updated", { project });
        return sendJson(response, 200, { project });
      }
      const projectReadmeAttachmentsRoute = pathname.match(
        /^\/api\/projects\/([^/]+)\/readme\/attachments$/
      );
      if (projectReadmeAttachmentsRoute) {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project README attachment routes do not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectReadmeAttachmentsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
        const metadata = parseAttachmentHeaders(request);
        if (metadata.kind !== "inline") {
          throw new ApiError(400, "INVALID_ATTACHMENT_KIND", "Project README attachments must be inline");
        }
        const body = await readBody(request, ATTACHMENT_BODY_LIMIT, "Attachment cannot exceed 25 MiB");
        const id = randomUUID4();
        await mkdir3(resolved.attachmentsDirectory, { recursive: true });
        const storagePath = path9.join(resolved.attachmentsDirectory, id);
        await writeFile4(storagePath, body, { flag: "wx" });
        let attachment;
        try {
          attachment = database.createProjectReadmeAttachment(projectId, {
            id,
            ...metadata,
            size: body.length
          });
        } catch (error) {
          await unlink2(storagePath);
          throw error;
        }
        return sendJson(response, 201, { attachment });
      }
      const projectReadmeRoute = pathname.match(/^\/api\/projects\/([^/]+)\/readme$/);
      if (projectReadmeRoute) {
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Project README routes do not accept query parameters");
        }
        let projectId;
        try {
          projectId = decodeURIComponent(projectReadmeRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        if (request.method === "GET") {
          return sendJson(response, 200, { readme: database.getProjectReadme(projectId) });
        }
        if (request.method === "PUT") {
          const input = parseProjectReadmeSave(await readJson(
            request,
            PROJECT_README_BODY_LIMIT,
            "Project README request cannot exceed 3 MiB"
          ));
          const readme = database.saveProjectReadme(projectId, input.content, input.version);
          events.emit("project.readme.updated", {
            projectId,
            readmeVersion: readme.version
          });
          return sendJson(response, 200, { readme });
        }
        return methodNotAllowed(response, ["GET", "PUT"]);
      }
      const developmentContextsRoute = pathname.match(/^\/api\/projects\/([^/]+)\/development-contexts$/);
      if (developmentContextsRoute) {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        const unknownQuery = [...url.searchParams.keys()].filter((key) => !["codexProjectId", "codexThreadId", "workspacePath"].includes(key));
        if (unknownQuery.length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", `Unknown query parameter: ${unknownQuery[0]}`);
        }
        let projectId;
        try {
          projectId = decodeURIComponent(developmentContextsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Project id contains invalid encoding");
        }
        validateProjectId(projectId);
        const project = currentCloudConfig.remoteUrl ? {
          id: projectId,
          workspacePath: projectId === DEFAULT_PROJECT_ID ? null : currentCloudConfig.projectMappings[projectId] ?? null
        } : database.getProject(projectId);
        if (!project) throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' does not exist`);
        const codexProjectId = stringField(url.searchParams.get("codexProjectId") ?? null, "codexProjectId", {
          nullable: true,
          maxLength: 128
        });
        const codexThreadId = stringField(url.searchParams.get("codexThreadId") ?? null, "codexThreadId", {
          nullable: true,
          maxLength: 256
        });
        const deviceWorkspacePath = stringField(
          url.searchParams.get("workspacePath") ?? null,
          "workspacePath",
          { nullable: true, maxLength: 4096 }
        );
        if (deviceWorkspacePath?.includes("\0")) {
          throw new ApiError(400, "INVALID_FIELD", "'workspacePath' cannot contain null bytes");
        }
        const workspacePath = deviceWorkspacePath ?? await resolveProjectWorkspace(
          project,
          codexProjectId,
          codexThreadId,
          resolved.codexStatePath,
          resolved.codexProcessesPath
        );
        return sendJson(
          response,
          200,
          await scanDevelopmentContexts(workspacePath, codexProcessEnvironment)
        );
      }
      if (pathname === "/api/tasks") {
        if (request.method === "GET") {
          const filters = parseTaskFilters(url.searchParams);
          if (!filters.projectId || filters.projectId === JIRA_PROJECT_ID) await jira.sync();
          return sendJson(response, 200, { tasks: database.listTasks(filters) });
        }
        if (request.method === "POST") {
          const actor = actorFromRequest(request);
          const { assigneeTarget, ...parsedInput } = parseTaskCreate(await readJson(request));
          const input = resolveInputThreadBinding(parsedInput);
          if (input.projectId === JIRA_PROJECT_ID) {
            throw new ApiError(
              409,
              "JIRA_CREATE_UNAVAILABLE",
              "\u8BF7\u5728 Jira \u4E2D\u65B0\u5EFA\u8BAE\u9898\uFF0CTaskboard \u5F53\u524D\u53EA\u540C\u6B65\u5DF2\u5206\u914D\u7ED9\u4F60\u7684\u4EFB\u52A1"
            );
          }
          const task = database.createTask({
            ...input,
            actor,
            assignee: resolveAssignee(assigneeTarget, actor)
          });
          events.emit("task.created", { task });
          return sendJson(response, 201, { task });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      if (pathname === "/api/events") {
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "GET /api/events does not accept query parameters");
        }
        events.connect(request, response);
        return;
      }
      const taskRelationRoute = pathname.match(
        /^\/api\/tasks\/([^/]+)\/relations\/([^/]+)\/([^/]+)$/
      );
      if (taskRelationRoute) {
        let taskId;
        let type;
        let relatedTaskId;
        try {
          taskId = decodeURIComponent(taskRelationRoute[1]);
          type = decodeURIComponent(taskRelationRoute[2]);
          relatedTaskId = decodeURIComponent(taskRelationRoute[3]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Issue relation path contains invalid encoding");
        }
        if (taskId.length === 0 || taskId.length > 128 || relatedTaskId.length === 0 || relatedTaskId.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Issue relation task id is invalid");
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Issue relation routes do not accept query parameters");
        }
        const relationType = parseIssueRelationType(type);
        if (request.method === "POST") {
          const { version, threadId, threadBinding, origin: origin2 } = resolveInputThreadBinding(
            parseRelationMutation(await readJson(request))
          );
          const result = database.addTaskRelation(
            taskId,
            version,
            relationType,
            relatedTaskId,
            threadId,
            threadBinding,
            actorFromRequest(request),
            origin2
          );
          events.emit("task.relation.updated", result);
          return sendJson(response, 200, result);
        }
        if (request.method === "DELETE") {
          const { version, threadId, threadBinding, origin: origin2 } = resolveInputThreadBinding(
            parseRelationMutation(await readJson(request))
          );
          const result = database.removeTaskRelation(
            taskId,
            version,
            relationType,
            relatedTaskId,
            threadId,
            threadBinding,
            actorFromRequest(request),
            origin2
          );
          events.emit("task.relation.updated", result);
          return sendJson(response, 200, result);
        }
        return methodNotAllowed(response, ["POST", "DELETE"]);
      }
      const taskActivitiesRoute = pathname.match(/^\/api\/tasks\/([^/]+)\/activities$/);
      if (taskActivitiesRoute) {
        let taskId;
        try {
          taskId = decodeURIComponent(taskActivitiesRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Task id contains invalid encoding");
        }
        if (taskId.length === 0 || taskId.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Task id is invalid");
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Activity routes do not accept query parameters");
        }
        if (request.method === "GET") {
          return sendJson(response, 200, { activities: database.listTaskActivities(taskId) });
        }
        return methodNotAllowed(response, ["GET"]);
      }
      const taskCommentsRoute = pathname.match(/^\/api\/tasks\/([^/]+)\/comments$/);
      if (taskCommentsRoute) {
        let taskId;
        try {
          taskId = decodeURIComponent(taskCommentsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Task id contains invalid encoding");
        }
        if (taskId.length === 0 || taskId.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Task id is invalid");
        }
        if (request.method === "GET") {
          const after = parseAfterCursor(url.searchParams, "Comment routes");
          const comments = after ? database.listCommentsAfter(taskId, after) : database.listComments(taskId);
          return sendJson(response, 200, {
            comments,
            nextCursor: nextCursor(comments, after)
          });
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Comment routes do not accept query parameters");
        }
        if (request.method === "POST") {
          const comment = database.createComment(taskId, {
            ...resolveInputThreadBinding(parseCommentCreate(await readJson(request))),
            actor: actorFromRequest(request)
          });
          const task = database.getTask(taskId);
          events.emit("comment.created", { comment, task });
          return sendJson(response, 201, { comment });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      const commentRoute = pathname.match(/^\/api\/comments\/([^/]+)$/);
      if (commentRoute) {
        let id;
        try {
          id = decodeURIComponent(commentRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Comment id contains invalid encoding");
        }
        if (id.length === 0 || id.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Comment id is invalid");
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Comment routes do not accept query parameters");
        }
        if (request.method === "PATCH") {
          const patch = resolveInputThreadBinding(parseCommentPatch(await readJson(request)));
          const comment = database.updateComment(
            id,
            patch.version,
            patch.body,
            patch.threadId,
            patch.threadBinding
          );
          const task = database.getTask(comment.taskId);
          events.emit("comment.updated", { comment, task });
          return sendJson(response, 200, { comment });
        }
        if (request.method === "DELETE") {
          const { version } = parseArchive(await readJson(request));
          const comment = database.deleteComment(id, version);
          for (const attachment of comment.attachments) {
            try {
              await unlink2(path9.join(resolved.attachmentsDirectory, attachment.id));
            } catch (error) {
              if (error.code !== "ENOENT") throw error;
            }
          }
          const task = database.getTask(comment.taskId);
          events.emit("comment.deleted", { comment, task });
          return sendEmpty(response, 204);
        }
        return methodNotAllowed(response, ["PATCH", "DELETE"]);
      }
      const commentAttachmentsRoute = pathname.match(/^\/api\/comments\/([^/]+)\/attachments$/);
      if (commentAttachmentsRoute) {
        let commentId;
        try {
          commentId = decodeURIComponent(commentAttachmentsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Comment id contains invalid encoding");
        }
        if (commentId.length === 0 || commentId.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Comment id is invalid");
        }
        if (request.method === "GET") {
          const after = parseAfterCursor(url.searchParams, "Attachment routes");
          const attachments = database.listCommentAttachments(commentId, after);
          return sendJson(response, 200, {
            attachments,
            nextCursor: nextCursor(attachments, after)
          });
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Attachment routes do not accept query parameters");
        }
        if (request.method === "POST") {
          const comment = database.getComment(commentId);
          if (!comment) throw new ApiError(404, "COMMENT_NOT_FOUND", `Comment '${commentId}' does not exist`);
          const metadata = parseAttachmentHeaders(request);
          const body = await readBody(request, ATTACHMENT_BODY_LIMIT, "Attachment cannot exceed 25 MiB");
          const id = randomUUID4();
          await mkdir3(resolved.attachmentsDirectory, { recursive: true });
          const storagePath = path9.join(resolved.attachmentsDirectory, id);
          await writeFile4(storagePath, body, { flag: "wx" });
          let attachment;
          try {
            attachment = database.createCommentAttachment(commentId, { id, ...metadata, size: body.length });
          } catch (error) {
            await unlink2(storagePath);
            throw error;
          }
          const task = database.getTask(comment.taskId);
          events.emit("attachment.created", { attachment, comment: database.getComment(commentId), task });
          return sendJson(response, 201, { attachment });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      const taskAttachmentsRoute = pathname.match(/^\/api\/tasks\/([^/]+)\/attachments$/);
      if (taskAttachmentsRoute) {
        let taskId;
        try {
          taskId = decodeURIComponent(taskAttachmentsRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Task id contains invalid encoding");
        }
        if (taskId.length === 0 || taskId.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Task id is invalid");
        }
        if (request.method === "GET") {
          const after = parseAfterCursor(url.searchParams, "Attachment routes");
          const attachments = database.listAttachments(taskId, after);
          return sendJson(response, 200, {
            attachments,
            nextCursor: nextCursor(attachments, after)
          });
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Attachment routes do not accept query parameters");
        }
        if (request.method === "POST") {
          const task = database.getTask(taskId);
          if (!task) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${taskId}' does not exist`);
          const metadata = parseAttachmentHeaders(request);
          const body = await readBody(request, ATTACHMENT_BODY_LIMIT, "Attachment cannot exceed 25 MiB");
          const id = randomUUID4();
          await mkdir3(resolved.attachmentsDirectory, { recursive: true });
          const storagePath = path9.join(resolved.attachmentsDirectory, id);
          await writeFile4(storagePath, body, { flag: "wx" });
          let attachment;
          try {
            attachment = database.createAttachment(taskId, { id, ...metadata, size: body.length });
          } catch (error) {
            await unlink2(storagePath);
            throw error;
          }
          events.emit("attachment.created", { attachment, task });
          return sendJson(response, 201, { attachment });
        }
        return methodNotAllowed(response, ["GET", "POST"]);
      }
      const attachmentContentRoute = pathname.match(/^\/api\/attachments\/([^/]+)\/(content|download)$/);
      if (attachmentContentRoute) {
        let id;
        try {
          id = decodeURIComponent(attachmentContentRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Attachment id contains invalid encoding");
        }
        if (id.length === 0 || id.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Attachment id is invalid");
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Attachment routes do not accept query parameters");
        }
        if (request.method !== "GET" && request.method !== "HEAD") {
          return methodNotAllowed(response, ["GET", "HEAD"]);
        }
        const attachment = database.getAttachment(id) ?? database.getProjectReadmeAttachment(id);
        if (!attachment) throw new ApiError(404, "ATTACHMENT_NOT_FOUND", `Attachment '${id}' does not exist`);
        const body = await readFile4(path9.join(resolved.attachmentsDirectory, attachment.id));
        const encodedFilename = encodeURIComponent(attachment.filename).replace(/['()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
        const canOpenInline = attachmentContentRoute[2] === "content" && (INLINE_ATTACHMENT_TYPES.has(attachment.contentType) || attachment.contentType.startsWith("video/"));
        response.writeHead(200, {
          "cache-control": "private, no-store",
          "content-disposition": `${canOpenInline ? "inline" : "attachment"}; filename*=UTF-8''${encodedFilename}`,
          "content-length": body.length,
          "content-security-policy": "sandbox; default-src 'none'",
          "content-type": canOpenInline ? attachment.contentType : "application/octet-stream"
        });
        response.end(request.method === "HEAD" ? void 0 : body);
        return;
      }
      const attachmentRoute = pathname.match(/^\/api\/attachments\/([^/]+)$/);
      if (attachmentRoute) {
        let id;
        try {
          id = decodeURIComponent(attachmentRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Attachment id contains invalid encoding");
        }
        if (id.length === 0 || id.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Attachment id is invalid");
        }
        if ([...url.searchParams.keys()].length > 0) {
          throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "Attachment routes do not accept query parameters");
        }
        if (request.method !== "DELETE") return methodNotAllowed(response, ["DELETE"]);
        const attachment = database.getAttachment(id);
        if (!attachment) throw new ApiError(404, "ATTACHMENT_NOT_FOUND", `Attachment '${id}' does not exist`);
        try {
          await unlink2(path9.join(resolved.attachmentsDirectory, attachment.id));
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        database.deleteAttachment(id);
        const task = database.getTask(attachment.taskId);
        events.emit("attachment.deleted", { attachment, task });
        return sendEmpty(response, 204);
      }
      const taskTreeRoute = pathname.match(/^\/api\/tasks\/([^/]+)\/tree$/);
      if (taskTreeRoute) {
        let id;
        try {
          id = decodeURIComponent(taskTreeRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Task id contains invalid encoding");
        }
        if (id.length === 0 || id.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Task id is invalid");
        }
        if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
        const { direction, depth } = parseTaskTreeQuery(url.searchParams);
        return sendJson(response, 200, { tree: database.getTaskTree(id, direction, depth) });
      }
      const taskRoute = pathname.match(/^\/api\/tasks\/([^/]+)(?:\/(archive|restore|move))?$/);
      if (taskRoute) {
        let id;
        try {
          id = decodeURIComponent(taskRoute[1]);
        } catch {
          throw new ApiError(400, "INVALID_PATH", "Task id contains invalid encoding");
        }
        if (id.length === 0 || id.length > 128) {
          throw new ApiError(400, "INVALID_PATH", "Task id is invalid");
        }
        const action = taskRoute[2];
        if (!action && request.method === "GET") {
          if ([...url.searchParams.keys()].length > 0) {
            throw new ApiError(400, "UNKNOWN_QUERY_PARAMETER", "GET /api/tasks/:id does not accept query parameters");
          }
          const task = database.getTask(id);
          if (!task) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
          return sendJson(response, 200, { task });
        }
        if (!action && request.method === "PATCH") {
          const actor = actorFromRequest(request);
          const {
            version,
            changes,
            threadId,
            threadBinding,
            assigneeTarget
          } = resolveInputThreadBinding(parseTaskPatch(await readJson(request)));
          const current = database.getTask(id);
          if (!current) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
          let jiraChanged = false;
          if (current.source !== "jira" && changes.projectId === JIRA_PROJECT_ID) {
            throw new ApiError(
              409,
              "JIRA_PROJECT_MOVE_UNAVAILABLE",
              "\u672C\u5730\u4EFB\u52A1\u4E0D\u80FD\u79FB\u5165 Jira \u540C\u6B65\u9879\u76EE"
            );
          }
          if (current.source === "jira") {
            if (current.version !== version) {
              throw new ApiError(409, "VERSION_CONFLICT", "Task changed since it was last read", {
                expectedVersion: version,
                actualVersion: current.version
              });
            }
            if (current.archivedAt !== null) {
              throw new ApiError(409, "TASK_ARCHIVED", "Archived tasks cannot be updated");
            }
            if (Object.hasOwn(changes, "projectId")) {
              throw new ApiError(409, "JIRA_PROJECT_MOVE_UNAVAILABLE", "Jira \u4EFB\u52A1\u4E0D\u80FD\u79FB\u5230\u672C\u5730\u9879\u76EE");
            }
            if (assigneeTarget !== void 0) {
              throw new ApiError(409, "JIRA_ASSIGNEE_UNAVAILABLE", "\u8BF7\u5728 Jira \u4E2D\u4FEE\u6539\u7ECF\u529E\u4EBA");
            }
            const dueDate = Object.hasOwn(changes, "dueDate") ? changes.dueDate : current.dueDate;
            const recurrence = Object.hasOwn(changes, "recurrence") ? changes.recurrence : current.recurrence;
            if (recurrence && !dueDate) {
              throw new ApiError(400, "INVALID_FIELD", "A recurring issue requires a due date");
            }
            jiraChanged = await jira.updateTask(current, changes);
          }
          if (assigneeTarget !== void 0) {
            changes.assignee = resolveAssignee(assigneeTarget, actor);
          }
          let task;
          try {
            task = database.updateTask(id, version, changes, threadId, threadBinding, actor);
          } catch (error) {
            if (jiraChanged) {
              try {
                await jira.reconcile();
              } catch {
                throw new ApiError(
                  502,
                  "JIRA_RECONCILE_FAILED",
                  "Jira \u5DF2\u66F4\u65B0\uFF0C\u4F46 Taskboard \u91CD\u65B0\u540C\u6B65\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u540C\u6B65"
                );
              }
            }
            throw error;
          }
          events.emit("task.updated", { task });
          return sendJson(response, 200, { task });
        }
        if (!action && request.method === "DELETE") {
          const current = database.getTask(id);
          if (current?.source === "jira") {
            throw new ApiError(409, "JIRA_DELETE_UNAVAILABLE", "Jira \u4EFB\u52A1\u4E0D\u80FD\u4ECE Taskboard \u6C38\u4E45\u5220\u9664");
          }
          const { version } = parseArchive(await readJson(request));
          const deleted = database.deleteArchivedTask(id, version);
          for (const attachmentId of deleted.attachmentIds) {
            try {
              await unlink2(path9.join(resolved.attachmentsDirectory, attachmentId));
            } catch (error) {
              if (error.code !== "ENOENT") throw error;
            }
          }
          events.emit("task.deleted", { task: deleted.task });
          return sendEmpty(response, 204);
        }
        if (action === "move" && request.method === "POST") {
          const move = resolveInputThreadBinding(parseMove(await readJson(request)));
          const current = database.getTask(id);
          if (!current) throw new ApiError(404, "TASK_NOT_FOUND", `Task '${id}' does not exist`);
          if (current.source === "jira") {
            if (current.version !== move.version) {
              throw new ApiError(409, "VERSION_CONFLICT", "Task changed since it was last read", {
                expectedVersion: move.version,
                actualVersion: current.version
              });
            }
            if (current.archivedAt !== null) {
              throw new ApiError(409, "TASK_ARCHIVED", "Archived tasks cannot be moved");
            }
            await jira.moveTask(current, move.status);
          }
          const task = database.moveTask(
            id,
            move.version,
            move.status,
            move.sortOrder,
            move.threadId,
            move.threadBinding,
            actorFromRequest(request)
          );
          events.emit("task.moved", { task });
          return sendJson(response, 200, { task });
        }
        if (action === "archive" && request.method === "POST") {
          const current = database.getTask(id);
          if (current?.source === "jira") {
            throw new ApiError(409, "JIRA_ARCHIVE_UNAVAILABLE", "Jira \u4EFB\u52A1\u7531\u540C\u6B65\u8303\u56F4\u81EA\u52A8\u7BA1\u7406\uFF0C\u4E0D\u80FD\u624B\u52A8\u5F52\u6863");
          }
          const { version, threadId, threadBinding } = resolveInputThreadBinding(
            parseArchive(await readJson(request))
          );
          const task = database.archiveTask(
            id,
            version,
            threadId,
            threadBinding,
            actorFromRequest(request)
          );
          events.emit("task.archived", { task });
          return sendJson(response, 200, { task });
        }
        if (action === "restore" && request.method === "POST") {
          const current = database.getTask(id);
          if (current?.source === "jira") {
            throw new ApiError(409, "JIRA_RESTORE_UNAVAILABLE", "Jira \u4EFB\u52A1\u7531\u540C\u6B65\u8303\u56F4\u81EA\u52A8\u7BA1\u7406\uFF0C\u4E0D\u80FD\u624B\u52A8\u6062\u590D");
          }
          const { version, threadId, threadBinding } = resolveInputThreadBinding(
            parseArchive(await readJson(request))
          );
          const task = database.restoreTask(
            id,
            version,
            threadId,
            threadBinding,
            actorFromRequest(request)
          );
          events.emit("task.restored", { task });
          return sendJson(response, 200, { task });
        }
        return methodNotAllowed(response, action ? ["POST"] : ["GET", "PATCH", "DELETE"]);
      }
      if (pathname.startsWith("/api/")) {
        throw new ApiError(404, "NOT_FOUND", "API route not found");
      }
      if (await serveStatic(request, response, pathname, resolved.staticDirectory)) return;
      throw new ApiError(404, "NOT_FOUND", "Resource not found");
    } catch (error) {
      if (response.headersSent) {
        response.destroy(error);
        return;
      }
      if (error instanceof ApiError) {
        const payload = { error: { code: error.code, message: error.message } };
        if (error.details !== void 0) payload.error.details = error.details;
        sendJson(response, error.status, payload);
        return;
      }
      if (error instanceof CloudProxyError) {
        const payload = { error: { code: error.code, message: error.message } };
        if (error.details !== void 0) payload.error.details = error.details;
        sendJson(response, error.status, payload);
        return;
      }
      console.error(error);
      sendJson(response, 500, { error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
    }
  });
  const cloudRealtimeServer = new import_websocket_server.default({ noServer: true });
  const cloudRealtimeSockets = /* @__PURE__ */ new Set();
  function rejectWebSocketUpgrade(socket, status, message) {
    const body = `${message}
`;
    socket.end([
      `HTTP/1.1 ${status} ${message}`,
      "Connection: close",
      "Content-Type: text/plain; charset=utf-8",
      `Content-Length: ${Buffer.byteLength(body)}`,
      "",
      body
    ].join("\r\n"));
  }
  function closeOrTerminateWebSocket(webSocket, code, reason) {
    if (webSocket.readyState !== import_websocket.default.OPEN) {
      webSocket.terminate();
      return;
    }
    if (code >= 1e3 && ![1004, 1005, 1006, 1015].includes(code)) {
      webSocket.close(code, reason);
    } else {
      webSocket.terminate();
    }
  }
  server.on("upgrade", async (request, socket, head) => {
    let remoteSocket;
    try {
      const incomingUrl = new URL(request.url, "http://127.0.0.1");
      if (resolved.instanceToken) {
        if (!incomingUrl.pathname.startsWith(`${routePrefix}/`)) {
          rejectWebSocketUpgrade(socket, 404, "Not Found");
          return;
        }
        request.url = `${incomingUrl.pathname.slice(routePrefix.length) || "/"}${incomingUrl.search}`;
      }
      assertTrustedNetworkRequest(
        request,
        Boolean(resolved.instanceToken),
        resolved.trustedOrigins
      );
      const url = new URL(request.url, "http://127.0.0.1");
      if (url.pathname !== "/api/events" || [...url.searchParams.keys()].length > 0) {
        rejectWebSocketUpgrade(socket, 404, "Not Found");
        return;
      }
      assertLoopbackRequest(request);
      const target = await cloudProxy.webSocketTarget("/api/events");
      remoteSocket = new import_websocket.default(target.url, { headers: target.headers });
      const pendingMessages = [];
      const queueMessage = (data, isBinary) => pendingMessages.push({ data, isBinary });
      remoteSocket.on("message", queueMessage);
      await new Promise((resolve, reject) => {
        const cleanup = () => {
          remoteSocket.off("open", onOpen);
          remoteSocket.off("error", onError);
          remoteSocket.off("close", onClose);
        };
        const onOpen = () => {
          cleanup();
          resolve();
        };
        const onError = (error) => {
          cleanup();
          reject(error);
        };
        const onClose = () => {
          cleanup();
          reject(new Error("Cloud realtime connection closed before opening"));
        };
        remoteSocket.once("open", onOpen);
        remoteSocket.once("error", onError);
        remoteSocket.once("close", onClose);
      });
      cloudRealtimeServer.handleUpgrade(request, socket, head, (localSocket) => {
        const pair = { localSocket, remoteSocket };
        cloudRealtimeSockets.add(pair);
        const removePair = () => cloudRealtimeSockets.delete(pair);
        const forwardMessage = (data, isBinary) => {
          if (localSocket.readyState === import_websocket.default.OPEN) {
            localSocket.send(data, { binary: isBinary });
          }
        };
        remoteSocket.off("message", queueMessage);
        remoteSocket.on("message", forwardMessage);
        for (const { data, isBinary } of pendingMessages) forwardMessage(data, isBinary);
        localSocket.on("message", () => {
          localSocket.close(1008, "Client messages are not supported");
        });
        localSocket.on("close", (code, reason) => {
          removePair();
          closeOrTerminateWebSocket(remoteSocket, code, reason);
        });
        localSocket.on("error", () => remoteSocket.terminate());
        remoteSocket.on("close", (code, reason) => {
          removePair();
          closeOrTerminateWebSocket(localSocket, code, reason);
        });
        remoteSocket.on("error", () => {
          if (localSocket.readyState === import_websocket.default.OPEN) {
            localSocket.close(1011, "Cloud realtime connection failed");
          }
        });
      });
    } catch (error) {
      remoteSocket?.terminate();
      rejectWebSocketUpgrade(socket, error?.status ?? 502, "WebSocket connection failed");
    }
  });
  let listening = false;
  return {
    database,
    aiChat,
    server,
    options: resolved,
    async listen({ host = "127.0.0.1", port = resolvePort(), fd = null } = {}) {
      if (host !== "127.0.0.1" && host !== "0.0.0.0") {
        throw new Error("Taskboard server must bind to 127.0.0.1 or 0.0.0.0");
      }
      if (fd !== null && (!Number.isInteger(fd) || fd < 3 || fd > 255)) {
        throw new Error("Taskboard server listen fd must be an inherited file descriptor");
      }
      await new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          server.off("error", onError);
          resolve();
        };
        server.once("error", onError);
        server.once("listening", onListening);
        if (fd === null) server.listen(port, host);
        else server.listen({ fd });
      });
      listening = true;
      return server.address();
    },
    async close() {
      for (const { localSocket, remoteSocket } of cloudRealtimeSockets) {
        localSocket.terminate();
        remoteSocket.terminate();
      }
      cloudRealtimeSockets.clear();
      cloudRealtimeServer.close();
      const serverClosed = listening ? new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      }) : Promise.resolve();
      events.close();
      for (const response of aiEventResponses) response.end();
      aiEventResponses.clear();
      await aiChat.close();
      await projectSummary.close();
      await serverClosed;
      listening = false;
      database.close();
    }
  };
}

// server/index.mjs
async function main() {
  const app = createTaskboardServer();
  const host = resolveHost();
  const listenFd = process.env.CODEX_TASKBOARD_LISTEN_FD === void 0 ? null : Number(process.env.CODEX_TASKBOARD_LISTEN_FD);
  const address = await app.listen({ host, port: resolvePort(), fd: listenFd });
  console.log(`Codex Taskboard listening on http://127.0.0.1:${address.port}`);
  if (host === "0.0.0.0") {
    const addresses = Object.values(os5.networkInterfaces()).flat().filter((entry) => entry?.family === "IPv4" && !entry.internal).map((entry) => entry.address);
    for (const lanAddress of [...new Set(addresses)]) {
      console.log(`Codex Taskboard available on LAN at http://${lanAddress}:${address.port}`);
    }
  }
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    await app.close();
  };
  process.once("SIGINT", () => close().then(() => process.exit(0)));
  process.once("SIGTERM", () => close().then(() => process.exit(0)));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
export {
  createTaskboardServer,
  resolveHost,
  resolvePort,
  resolveServerOptions
};
