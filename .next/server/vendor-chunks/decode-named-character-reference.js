"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/decode-named-character-reference";
exports.ids = ["vendor-chunks/decode-named-character-reference"];
exports.modules = {

/***/ "(rsc)/./node_modules/decode-named-character-reference/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/decode-named-character-reference/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decodeNamedCharacterReference: () => (/* binding */ decodeNamedCharacterReference)\n/* harmony export */ });\n/* harmony import */ var character_entities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! character-entities */ \"(rsc)/./node_modules/character-entities/index.js\");\n\n// To do: next major: use `Object.hasOwn`.\nconst own = {}.hasOwnProperty;\n/**\n * Decode a single character reference (without the `&` or `;`).\n * You probably only need this when you’re building parsers yourself that follow\n * different rules compared to HTML.\n * This is optimized to be tiny in browsers.\n *\n * @param {string} value\n *   `notin` (named), `#123` (deci), `#x123` (hexa).\n * @returns {string|false}\n *   Decoded reference.\n */ function decodeNamedCharacterReference(value) {\n    return own.call(character_entities__WEBPACK_IMPORTED_MODULE_0__.characterEntities, value) ? character_entities__WEBPACK_IMPORTED_MODULE_0__.characterEntities[value] : false;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZGVjb2RlLW5hbWVkLWNoYXJhY3Rlci1yZWZlcmVuY2UvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsMENBQTBDO0FBQzFDLE1BQU1DLE1BQU0sQ0FBQyxFQUFFQyxjQUFjO0FBRTdCOzs7Ozs7Ozs7O0NBVUMsR0FDTSxTQUFTQyw4QkFBOEJDLEtBQUs7SUFDakQsT0FBT0gsSUFBSUksSUFBSSxDQUFDTCxpRUFBaUJBLEVBQUVJLFNBQVNKLGlFQUFpQixDQUFDSSxNQUFNLEdBQUc7QUFDekUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ibG9nLWFwcC8uL25vZGVfbW9kdWxlcy9kZWNvZGUtbmFtZWQtY2hhcmFjdGVyLXJlZmVyZW5jZS9pbmRleC5qcz9kMzQyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y2hhcmFjdGVyRW50aXRpZXN9IGZyb20gJ2NoYXJhY3Rlci1lbnRpdGllcydcblxuLy8gVG8gZG86IG5leHQgbWFqb3I6IHVzZSBgT2JqZWN0Lmhhc093bmAuXG5jb25zdCBvd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuXG4vKipcbiAqIERlY29kZSBhIHNpbmdsZSBjaGFyYWN0ZXIgcmVmZXJlbmNlICh3aXRob3V0IHRoZSBgJmAgb3IgYDtgKS5cbiAqIFlvdSBwcm9iYWJseSBvbmx5IG5lZWQgdGhpcyB3aGVuIHlvdeKAmXJlIGJ1aWxkaW5nIHBhcnNlcnMgeW91cnNlbGYgdGhhdCBmb2xsb3dcbiAqIGRpZmZlcmVudCBydWxlcyBjb21wYXJlZCB0byBIVE1MLlxuICogVGhpcyBpcyBvcHRpbWl6ZWQgdG8gYmUgdGlueSBpbiBicm93c2Vycy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqICAgYG5vdGluYCAobmFtZWQpLCBgIzEyM2AgKGRlY2kpLCBgI3gxMjNgIChoZXhhKS5cbiAqIEByZXR1cm5zIHtzdHJpbmd8ZmFsc2V9XG4gKiAgIERlY29kZWQgcmVmZXJlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlTmFtZWRDaGFyYWN0ZXJSZWZlcmVuY2UodmFsdWUpIHtcbiAgcmV0dXJuIG93bi5jYWxsKGNoYXJhY3RlckVudGl0aWVzLCB2YWx1ZSkgPyBjaGFyYWN0ZXJFbnRpdGllc1t2YWx1ZV0gOiBmYWxzZVxufVxuIl0sIm5hbWVzIjpbImNoYXJhY3RlckVudGl0aWVzIiwib3duIiwiaGFzT3duUHJvcGVydHkiLCJkZWNvZGVOYW1lZENoYXJhY3RlclJlZmVyZW5jZSIsInZhbHVlIiwiY2FsbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/decode-named-character-reference/index.js\n");

/***/ })

};
;