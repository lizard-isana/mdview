import { PluginConfig } from './config.js';

const parseConfiguredPluginNames = (viewer) => {
  const configured = viewer.dataset.plugins
    ? viewer.dataset.plugins
      .split(',')
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean)
    : [...PluginConfig.defaultPlugins];

  if (viewer.dataset.inlineSpa === "true" && configured.indexOf('inline-spa') < 0) {
    configured.push('inline-spa');
  }
  return configured;
};

const registerBuiltinPlugins = (mdviewApi, viewer) => {
  const pluginNames = parseConfiguredPluginNames(viewer);
  pluginNames.forEach((pluginName) => {
    const entry = PluginConfig.registry[pluginName];
    if (!entry || typeof entry.create !== 'function') {
      console.warn(`[MDView] Unknown plugin in config: ${pluginName}`);
      return;
    }
    mdviewApi.registerPlugin(viewer.id, entry.create(viewer));
  });
};

export { registerBuiltinPlugins };
