const absoluteLength = /(?:^|[^\w.])(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem)\b/i;
const fixedSizeToken = /^var\(--(?:text-(?:xs|sm|base|lg|xl|[2-9]xl|heading-sm|eyebrow)|chat-(?:meta|label|body)|exam-latin-size)\)$/;
const scaledToken = /--(?:reading-font-scale|text-(?:body|reading|subheading))/;

function scaled(value) {
  return `calc((${value}) * var(--reading-font-scale, 1))`;
}

module.exports = () => ({
  postcssPlugin: "bomgichul-reading-scale",
  OnceExit(root) {
    // Tailwind has expanded its classes by this point. Scale fixed sizes while
    // leaving inherited sizes, unitless line heights, and existing reading tokens alone.
    root.walkDecls(/^(?:font-size|line-height|--tw-leading|font)$/, (declaration) => {
      const { prop, value } = declaration;
      if (scaledToken.test(value)) return;
      if (prop === "font") {
        declaration.value = value.replace(/\b\d+(?:\.\d+)?(?:px|rem)\b/gi, scaled);
        return;
      }
      const fixedLineHeight = prop !== "font-size" && value.startsWith("calc(var(--spacing)");
      if (absoluteLength.test(value) || (prop === "font-size" && fixedSizeToken.test(value)) || fixedLineHeight) {
        declaration.value = scaled(value);
      }
    });
  },
});
module.exports.postcss = true;
