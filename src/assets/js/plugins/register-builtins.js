import { PluginConfig } from './config.js';

const parseConfiguredPluginNames = (viewer) => {
  if (!viewer.dataset.plugins) {
    return PluginConfig.defaultPlugins;
  }
  return viewer.dataset.plugins
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
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
