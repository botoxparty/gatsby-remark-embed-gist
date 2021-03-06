"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _querystring = _interopRequireDefault(require("querystring"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _parseNumericRange = _interopRequireDefault(require("parse-numeric-range"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _asyncUnistUtilVisit = _interopRequireDefault(require("async-unist-util-visit"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// default base url
var baseUrl = "https://gist.github.com";
/**
 * @typedef {object} PluginOptions
 * @property {string} username the default gist user.
 * @property {boolean} includeDefaultCss a flag indicating the default css should be included
 */

/**
 * @typedef {object} GistQuery
 * @property {string} file the file name.
 * @property {string|Array<number>} highlights the numbers to be highlighted.
 */

/**
 * Validates the query object is valid.
 * @param {GistQuery} query the query to be validated.
 * @returns {boolean} true if the query is valid; false otherwise.
 */

function isValid(query) {
  if (query == null) return false;
  if (query.file == null && query.highlights == null) return false; // leaving this for future enhancements to the query object

  return true;
}
/**
 * Builds the query object.
 * This methods looks for anything that is after ? or # in the gist: directive.
 * ? is interpreted as a query string.
 * # is interpreted as a filename.
 * @param {string} value the value of the inlineCode block.
 * @returns {object} the query object.
 */


function getQuery(value) {
  var _value$split = value.split(/[?#]/),
      _value$split2 = (0, _slicedToArray2["default"])(_value$split, 3),
      file = _value$split2[1],
      paramsString = _value$split2[2]; // // if there is no file, then return an empty object


  if (file == null) return {
    highlights: [],
    lines: []
  };

  var query = _objectSpread({
    file: file
  }, _querystring["default"].parse(paramsString)); // validate the query


  if (!isValid(query)) {
    throw new Error("Malformed query. Check your 'gist:' imports");
  } // explode the highlights ranges, if any


  var highlights = [];

  if (typeof query.highlights === "string") {
    highlights = _parseNumericRange["default"].parse(query.highlights);
  } else if (Array.isArray(query.highlights)) {
    highlights = query.highlights;
  }

  query.highlights = highlights; // get the range of lines to display

  var lines = [];

  if (typeof query.lines === "string") {
    lines = _parseNumericRange["default"].parse(query.lines);
  } else if (Array.isArray(query.lines)) {
    lines = query.lines;
  }

  query.lines = lines;
  return query;
}
/**
 * Builds the gist url.
 * @param {string} value the value of the inlineCode block.
 * @param {PluginOptions} options the options of the plugin.
 * @param {string} file the file to be loaded.
 * @returns {string} the gist url.
 */


function buildUrl(value, options, file) {
  var _value$split3 = value.split(/[?#]/),
      _value$split4 = (0, _slicedToArray2["default"])(_value$split3, 1),
      gist = _value$split4[0];

  var _ref = gist.indexOf("/") > 0 ? gist.split("/") : [null, gist],
      _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      inlineUsername = _ref2[0],
      id = _ref2[1]; // username can come from inline code or options


  var username = inlineUsername || options.username; // checks for a valid username

  if (username == null || username.trim().length === 0) {
    throw new Error("Missing username information");
  } // checks for a valid id


  if (id == null || id.trim().length === 0) {
    throw new Error("Missing gist id information");
  } // builds the url and completes it with the file if any


  var url = "".concat(baseUrl, "/").concat(username, "/").concat(id, ".json");

  if (file != null) {
    url += "?file=".concat(file);
  }

  return url;
}
/**
 * Handles the markdown AST.
 * @param {{ markdownAST }} markdownAST the markdown abstract syntax tree.
 * @param {PluginOptions} options the options of the plugin.
 * @returns {*} the markdown ast.
 */


var _default =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var markdownAST,
        options,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            markdownAST = _ref3.markdownAST;
            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            _context2.next = 4;
            return (0, _asyncUnistUtilVisit["default"])(markdownAST, "inlineCode",
            /*#__PURE__*/
            function () {
              var _ref5 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(node) {
                var query, url, body, content, html, $, file, _$, _file, codeLines;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (node.value.startsWith("gist:")) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return");

                      case 2:
                        // get the query string and build the url
                        query = getQuery(node.value.substring(5));
                        url = buildUrl(node.value.substring(5), options, query.file); // call the gist and update the node type and value

                        _context.next = 6;
                        return (0, _requestPromise["default"])(url);

                      case 6:
                        body = _context.sent;
                        content = JSON.parse(body); // highlight the specify lines, if any

                        html = content.div;

                        if (query.highlights.length > 0) {
                          $ = _cheerio["default"].load(html);
                          file = query.file.replace(/[^a-zA-Z0-9_]+/g, "-").toLowerCase();
                          query.highlights.forEach(function (line) {
                            $("#file-".concat(file, "-LC").concat(line)).addClass("highlighted");
                          });
                          html = $.html();
                        }

                        if (query.lines.length > 0) {
                          _$ = _cheerio["default"].load(html);
                          _file = query.file.replace(/[^a-zA-Z0-9_]+/g, "-").toLowerCase();
                          codeLines = _parseNumericRange["default"].parse("1-".concat(_$("table tr").length));
                          codeLines.forEach(function (line) {
                            if (query.lines.includes(line)) {
                              return;
                            }

                            _$("#file-".concat(_file, "-LC").concat(line)).parent().remove();
                          });
                          html = _$.html();
                        }

                        node = Object.assign(node, {
                          type: "html",
                          value: html.trim()
                        });
                        return _context.abrupt("return", markdownAST);

                      case 13:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref4.apply(this, arguments);
  };
}();

exports["default"] = _default;
module.exports = exports.default;