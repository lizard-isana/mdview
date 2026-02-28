const HIGHLIGHT_EXCEPTIONS = ['math', 'graph', 'chart'];
const HIGHLIGHT_JS_VERSION = '11.11.1';
const HIGHLIGHT_LINE_NUMBERS_VERSION = '2.9.0';

const hasTokenMarkup = (codeElement) => {
  return codeElement.querySelector('[class*="hljs-"]:not(.hljs-ln-n):not(.hljs-ln-numbers):not(.hljs-ln-code)') != null;
};

const markCodeBlocks = (target) => {
  const code_array = target.querySelectorAll('code[class*="language"]');
  for (const codeElement of code_array) {
    const class_list = codeElement.classList;
    var lang = null;
    if (class_list && class_list.value.match(/language/)) {
      lang = class_list.value.match(/(|\s)language-(.*)(|\s)/)[2];
      codeElement.setAttribute('data-language', lang);
      codeElement.setAttribute('data-mdview-highlight', HIGHLIGHT_EXCEPTIONS.indexOf(lang) < 0);
    }
    if (
      lang &&
      HIGHLIGHT_EXCEPTIONS.indexOf(lang) < 0 &&
      window.hljs &&
      typeof window.hljs.highlightElement === 'function' &&
      codeElement.dataset.mdviewHighlighted !== 'true' &&
      // If markdown-it already injected <span> markup, do not re-highlight.
      !hasTokenMarkup(codeElement)
    ) {
      window.hljs.highlightElement(codeElement);
      codeElement.dataset.mdviewHighlighted = 'true';
    } else if (hasTokenMarkup(codeElement)) {
      codeElement.dataset.mdviewHighlighted = 'true';
    }
    if (class_list && codeElement.dataset.mdviewHighlighted === 'true') {
      class_list.add('hljs');
    }
    if (codeElement.parentNode) {
      codeElement.parentNode.classList.add('code');
    }
    if (
      codeElement.dataset &&
      codeElement.dataset.mdviewHighlight &&
      codeElement.dataset.mdviewHighlight === 'true' &&
      codeElement.dataset.mdviewLineNumbered !== 'true' &&
      window.hljs &&
      window.hljs.lineNumbersBlock
    ) {
      window.hljs.lineNumbersBlock(codeElement, { singleLine: true });
      codeElement.dataset.mdviewLineNumbered = 'true';
    }
  }
};

const createHighlightPlugin = (option = {}) => {
  const highlightStyle = option.style || 'github';
  let loaded = false;
  let loadingPromise = null;
  const styleUrls = [
    `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHT_JS_VERSION}/build/styles/${highlightStyle}.min.css`,
    `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HIGHLIGHT_JS_VERSION}/styles/${highlightStyle}.min.css`
  ];
  const scriptUrls = [
    `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHT_JS_VERSION}/build/highlight.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HIGHLIGHT_JS_VERSION}/highlight.min.js`
  ];
  const lineNumberScriptUrls = [
    `https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@${HIGHLIGHT_LINE_NUMBERS_VERSION}/dist/highlightjs-line-numbers.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/${HIGHLIGHT_LINE_NUMBERS_VERSION}/highlightjs-line-numbers.min.js`
  ];
  let resizeHandler = null;
  let resizeTimer = null;

  const loadFirstAvailable = async (loader, urls, label) => {
    let lastError = null;
    for (const url of urls) {
      try {
        await loader(url);
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
    if (!loadingPromise) {
      loadingPromise = (async () => {
        await loadFirstAvailable(ctx.loadStyles, styleUrls, 'highlight style');
        await loadFirstAvailable(ctx.loadScripts, scriptUrls, 'highlight script');
        await loadFirstAvailable(
          ctx.loadScripts,
          lineNumberScriptUrls,
          'highlight line numbers script'
        );
        loaded = true;
      })().finally(() => {
        loadingPromise = null;
      });
    }
    await loadingPromise;
  };

  return {
    name: 'highlight',
    onInit: async ({ ctx }) => {
      try {
        await ensureAssets(ctx);
      } catch (error) {
        console.warn('[MDView] Highlight assets are unavailable on init.', error);
      }
      if (!resizeHandler) {
        resizeHandler = () => {
          if (resizeTimer) {
            clearTimeout(resizeTimer);
          }
          resizeTimer = setTimeout(() => {
            const viewer = ctx.getViewer ? ctx.getViewer() : null;
            const root = viewer ? viewer.querySelector('section') || viewer : null;
            if (!root) {
              return;
            }
            markCodeBlocks(root);
          }, 120);
        };
        window.addEventListener('resize', resizeHandler, { passive: true });
      }
    },
    onEvent: async ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      try {
        await ensureAssets(ctx);
      } catch (error) {
        console.warn('[MDView] Highlight assets are unavailable.', error);
      }
      if (!payload) {
        return;
      }
      markCodeBlocks(payload);
    },
    onDispose: () => {
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
      }
    },
    transformCode: ({ code, lang }) => {
      if (!window.hljs || HIGHLIGHT_EXCEPTIONS.indexOf(lang) >= 0) {
        return undefined;
      }
      return window.hljs.highlightAuto(code, [lang]).value;
    }
  };
};

export { createHighlightPlugin };
