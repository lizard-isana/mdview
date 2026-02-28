const DEFAULT_INLINE_MATH = [['$', '$'], ['\\(', '\\)']];
const DEFAULT_FONT_CACHE = 'global';
const MATHJAX_SCRIPT_URLS = [
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js'
];

const applyMathJaxDefaults = () => {
  window.MathJax = window.MathJax || {};
  window.MathJax.tex = window.MathJax.tex || {};
  window.MathJax.svg = window.MathJax.svg || {};

  // Keep defaults stable for plugin behavior.
  window.MathJax.tex.inlineMath = DEFAULT_INLINE_MATH;
  window.MathJax.svg.fontCache = DEFAULT_FONT_CACHE;

  // If MathJax runtime config exists, keep it in sync as well.
  if (window.MathJax.config) {
    window.MathJax.config.tex = window.MathJax.config.tex || {};
    window.MathJax.config.svg = window.MathJax.config.svg || {};
    window.MathJax.config.tex.inlineMath = DEFAULT_INLINE_MATH;
    window.MathJax.config.svg.fontCache = DEFAULT_FONT_CACHE;
  }
};

const renderMath = async (root) => {
  if (!root || !window.MathJax || !window.MathJax.startup || !window.MathJax.typesetPromise) {
    return;
  }

  await window.MathJax.startup.promise;

  // Render inline math in normal markdown text.
  await window.MathJax.typesetPromise([root]);

  // Render fenced math blocks and replace hidden code blocks with SVG output.
  const mathElementArray = root.querySelectorAll('.language-math');
  for (const element of mathElementArray) {
    if (element.dataset.mdviewMathRendered === 'true') {
      continue;
    }
    await window.MathJax.typesetPromise(element.childNodes);
    const svg = document.createRange().createContextualFragment(element.innerHTML);
    element.parentNode.insertBefore(svg, element);
    element.style.display = 'none';
    element.dataset.mdviewMathRendered = 'true';
  }
};

const createMathPlugin = () => {
  let loaded = false;
  const loadFirstAvailable = async (ctx, urls, label) => {
    let lastError = null;
    for (const url of urls) {
      try {
        await ctx.loadScripts(url);
        return;
      } catch (error) {
        lastError = error;
        console.warn(`[MDView] Failed to load ${label}: ${url}`, error);
      }
    }
    throw lastError || new Error(`Failed to load ${label}`);
  };

  const ensureAssets = async (ctx) => {
    if (loaded) {
      return;
    }
    applyMathJaxDefaults();
    await loadFirstAvailable(ctx, MATHJAX_SCRIPT_URLS, 'mathjax script');
    applyMathJaxDefaults();
    loaded = true;
  };

  return {
    name: 'math',
    onEvent: async ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      await ensureAssets(ctx);
      await renderMath(payload);
    }
  };
};

export { createMathPlugin };
