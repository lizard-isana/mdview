import { createTocPlugin } from './toc-plugin.js';
import { createHighlightPlugin } from './highlight-plugin.js';
import { createMathPlugin } from './math-plugin.js';
import { createGraphPlugin } from './graph-plugin.js';
import { createChartPlugin } from './chart-plugin.js';

const PluginConfig = Object.freeze({
  defaultPlugins: ['toc', 'highlight'],
  registry: {
    toc: {
      create: () => createTocPlugin()
    },
    highlight: {
      create: (viewer) => createHighlightPlugin({
        style: viewer.dataset.highlightStyle || 'github'
      })
    },
    math: {
      create: () => createMathPlugin()
    },
    graph: {
      create: () => createGraphPlugin()
    },
    chart: {
      create: () => createChartPlugin()
    }
  }
});

export { PluginConfig };
