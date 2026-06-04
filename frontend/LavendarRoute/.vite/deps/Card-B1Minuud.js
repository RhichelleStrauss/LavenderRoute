import { i as __toESM, n as __commonJSMin, t as require_react } from "./react-B35R_oEX.js";
import { t as require_jsx_runtime } from "./jsx-runtime-De3RprTE.js";
//#region node_modules/classnames/index.js
var require_classnames = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
	*/
	(function() {
		"use strict";
		var hasOwn = {}.hasOwnProperty;
		function classNames() {
			var classes = "";
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (arg) classes = appendClass(classes, parseValue(arg));
			}
			return classes;
		}
		function parseValue(arg) {
			if (typeof arg === "string" || typeof arg === "number") return arg;
			if (typeof arg !== "object") return "";
			if (Array.isArray(arg)) return classNames.apply(null, arg);
			if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) return arg.toString();
			var classes = "";
			for (var key in arg) if (hasOwn.call(arg, key) && arg[key]) classes = appendClass(classes, key);
			return classes;
		}
		function appendClass(value, newClass) {
			if (!newClass) return value;
			if (value) return value + " " + newClass;
			return value + newClass;
		}
		if (typeof module !== "undefined" && module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else if (typeof define === "function" && typeof define.amd === "object" && define.amd) define("classnames", [], function() {
			return classNames;
		});
		else window.classNames = classNames;
	})();
}));
//#endregion
//#region node_modules/react-bootstrap/esm/ThemeProvider.js
var import_classnames = /* @__PURE__ */ __toESM(require_classnames());
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_BREAKPOINTS = [
	"xxl",
	"xl",
	"lg",
	"md",
	"sm",
	"xs"
];
var ThemeContext = /* @__PURE__ */ import_react.createContext({
	prefixes: {},
	breakpoints: DEFAULT_BREAKPOINTS,
	minBreakpoint: "xs"
});
var { Consumer, Provider } = ThemeContext;
function ThemeProvider({ prefixes = {}, breakpoints = DEFAULT_BREAKPOINTS, minBreakpoint = "xs", dir, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		value: (0, import_react.useMemo)(() => ({
			prefixes: { ...prefixes },
			breakpoints,
			minBreakpoint,
			dir
		}), [
			prefixes,
			breakpoints,
			minBreakpoint,
			dir
		]),
		children
	});
}
function useBootstrapPrefix(prefix, defaultPrefix) {
	const { prefixes } = (0, import_react.useContext)(ThemeContext);
	return prefix || prefixes[defaultPrefix] || defaultPrefix;
}
function useBootstrapBreakpoints() {
	const { breakpoints } = (0, import_react.useContext)(ThemeContext);
	return breakpoints;
}
function useBootstrapMinBreakpoint() {
	const { minBreakpoint } = (0, import_react.useContext)(ThemeContext);
	return minBreakpoint;
}
function useIsRTL() {
	const { dir } = (0, import_react.useContext)(ThemeContext);
	return dir === "rtl";
}
//#endregion
//#region node_modules/react-bootstrap/esm/divWithClassName.js
var divWithClassName_default = ((className) => /* @__PURE__ */ import_react.forwardRef((p, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	...p,
	ref,
	className: (0, import_classnames.default)(p.className, className)
})));
//#endregion
//#region node_modules/react-bootstrap/esm/CardBody.js
var CardBody = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = "div", ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-body");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardBody.displayName = "CardBody";
//#endregion
//#region node_modules/react-bootstrap/esm/CardFooter.js
var CardFooter = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = "div", ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-footer");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardFooter.displayName = "CardFooter";
//#endregion
//#region node_modules/react-bootstrap/esm/CardHeaderContext.js
var context = /* @__PURE__ */ import_react.createContext(null);
context.displayName = "CardHeaderContext";
//#endregion
//#region node_modules/react-bootstrap/esm/CardHeader.js
var CardHeader = /* @__PURE__ */ import_react.forwardRef(({ bsPrefix, className, as: Component = "div", ...props }, ref) => {
	const prefix = useBootstrapPrefix(bsPrefix, "card-header");
	const contextValue = (0, import_react.useMemo)(() => ({ cardHeaderBsPrefix: prefix }), [prefix]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(context.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
			ref,
			...props,
			className: (0, import_classnames.default)(className, prefix)
		})
	});
});
CardHeader.displayName = "CardHeader";
//#endregion
//#region node_modules/react-bootstrap/esm/CardImg.js
var CardImg = /* @__PURE__ */ import_react.forwardRef(({ bsPrefix, className, variant, as: Component = "img", ...props }, ref) => {
	const prefix = useBootstrapPrefix(bsPrefix, "card-img");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(variant ? `${prefix}-${variant}` : prefix, className),
		...props
	});
});
CardImg.displayName = "CardImg";
//#endregion
//#region node_modules/react-bootstrap/esm/CardImgOverlay.js
var CardImgOverlay = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = "div", ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-img-overlay");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardImgOverlay.displayName = "CardImgOverlay";
//#endregion
//#region node_modules/react-bootstrap/esm/CardLink.js
var CardLink = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = "a", ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-link");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardLink.displayName = "CardLink";
//#endregion
//#region node_modules/react-bootstrap/esm/CardSubtitle.js
var DivStyledAsH6 = divWithClassName_default("h6");
var CardSubtitle = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = DivStyledAsH6, ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-subtitle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardSubtitle.displayName = "CardSubtitle";
//#endregion
//#region node_modules/react-bootstrap/esm/CardText.js
var CardText = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = "p", ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-text");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardText.displayName = "CardText";
//#endregion
//#region node_modules/react-bootstrap/esm/CardTitle.js
var DivStyledAsH5 = divWithClassName_default("h5");
var CardTitle = /* @__PURE__ */ import_react.forwardRef(({ className, bsPrefix, as: Component = DivStyledAsH5, ...props }, ref) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, "card-title");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		className: (0, import_classnames.default)(className, bsPrefix),
		...props
	});
});
CardTitle.displayName = "CardTitle";
//#endregion
//#region node_modules/react-bootstrap/esm/Card.js
var Card = /* @__PURE__ */ import_react.forwardRef(({ bsPrefix, className, bg, text, border, body = false, children, as: Component = "div", ...props }, ref) => {
	const prefix = useBootstrapPrefix(bsPrefix, "card");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		ref,
		...props,
		className: (0, import_classnames.default)(className, prefix, bg && `bg-${bg}`, text && `text-${text}`, border && `border-${border}`),
		children: body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, { children }) : children
	});
});
Card.displayName = "Card";
var Card_default = Object.assign(Card, {
	Img: CardImg,
	Title: CardTitle,
	Subtitle: CardSubtitle,
	Body: CardBody,
	Link: CardLink,
	Text: CardText,
	Header: CardHeader,
	Footer: CardFooter,
	ImgOverlay: CardImgOverlay
});
//#endregion
export { useBootstrapPrefix as _, CardLink as a, CardHeader as c, CardBody as d, divWithClassName_default as f, useBootstrapMinBreakpoint as g, useBootstrapBreakpoints as h, CardSubtitle as i, context as l, ThemeProvider as m, CardTitle as n, CardImgOverlay as o, DEFAULT_BREAKPOINTS as p, CardText as r, CardImg as s, Card_default as t, CardFooter as u, useIsRTL as v, require_classnames as y };

//# sourceMappingURL=Card-B1Minuud.js.map