const renderCharts = (root) => {
  if (!window.mermaid) {
    return;
  }

  const newMermaidNodes = [];
  var chart_array = root.querySelectorAll('.language-chart');
  chart_array.forEach((element) => {
    if (element.dataset.mdviewChartRendered === 'true') {
      return;
    }
    var p_node = element.parentNode;
    var chart_element = document.createElement('pre');
    chart_element.classList.add('mermaid');
    chart_element.innerHTML = element.innerHTML;
    p_node.parentNode.insertBefore(chart_element, p_node);
    p_node.style.display = 'none';
    element.dataset.mdviewChartRendered = 'true';
    newMermaidNodes.push(chart_element);
  });

  if (newMermaidNodes.length > 0) {
    window.mermaid.initialize({ startOnLoad: false });
    window.mermaid.init(undefined, newMermaidNodes);
  }
};

const createChartPlugin = () => {
  let loaded = false;

  const ensureAssets = async (ctx) => {
    if (loaded) {
      return;
    }
    await ctx.loadScripts([
      'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'
    ]);
    loaded = true;
  };

  return {
    name: 'chart',
    onEvent: async ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      await ensureAssets(ctx);
      renderCharts(payload);
    }
  };
};

export { createChartPlugin };
