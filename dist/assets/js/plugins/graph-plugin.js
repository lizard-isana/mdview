const renderGraphs = (root) => {
  if (!window.c3) {
    return;
  }
  var graph_array = root.querySelectorAll('.language-graph');
  graph_array.forEach((element, index) => {
    if (element.dataset.mdviewGraphRendered === 'true') {
      return;
    }
    var p_node = element.parentNode;
    var graph_code;
    try {
      graph_code = JSON.parse(element.innerHTML);
    } catch (error) {
      console.error(error);
      return;
    }

    var graph_id = `graph_${index}_${Math.random().toString(36).slice(2, 8)}`;
    var graph_element = document.createElement('div');
    graph_element.setAttribute('id', graph_id);
    graph_element.setAttribute('class', 'graph');
    graph_element.style.width = '90%';
    graph_element.style.padding = '0';
    graph_element.style.margin = '0';
    p_node.parentNode.insertBefore(graph_element, p_node);
    p_node.style.display = 'none';
    element.dataset.mdviewGraphRendered = 'true';
    graph_code.bindto = '#' + graph_id;
    if (graph_code) {
      window.c3.generate(graph_code);
    }
  });
};

const createGraphPlugin = () => {
  let loaded = false;

  const ensureAssets = async (ctx) => {
    if (loaded) {
      return;
    }
    await ctx.loadStyles([
      'https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.css'
    ]);
    await ctx.loadScripts('https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js');
    await ctx.loadScripts('https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.js');
    loaded = true;
  };

  return {
    name: 'graph',
    onEvent: async ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      await ensureAssets(ctx);
      renderGraphs(payload);
    }
  };
};

export { createGraphPlugin };
