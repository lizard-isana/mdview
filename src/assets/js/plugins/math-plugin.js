const renderMath = (root) => {
  if (!window.MathJax || !window.MathJax.startup || !window.MathJax.typesetPromise) {
    return;
  }

  window.MathJax.startup.promise.then(() => {
    var math_element = root.querySelectorAll('.language-math');
    math_element.forEach((element) => {
      if (element.dataset.mdviewMathRendered === 'true') {
        return;
      }
      window.MathJax.typesetPromise(element.childNodes);
      const svg = document.createRange().createContextualFragment(element.innerHTML);
      element.parentNode.insertBefore(svg, element);
      element.style.display = 'none';
      element.dataset.mdviewMathRendered = 'true';
    });
  });
};

const createMathPlugin = () => {
  let loaded = false;

  const ensureAssets = async (ctx) => {
    if (loaded) {
      return;
    }
    await ctx.loadScripts([
      'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
    ]);
    loaded = true;
  };

  return {
    name: 'math',
    onEvent: async ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      await ensureAssets(ctx);
      renderMath(payload);
    }
  };
};

export { createMathPlugin };
