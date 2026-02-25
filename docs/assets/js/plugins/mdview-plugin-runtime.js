const EnsureArray = (value) => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const CreateRuntimeContext = (state, loader) => {
  return {
    viewId: state.viewId,
    getViewer: () => state.viewer,
    loadScripts: loader.loadScripts,
    loadStyles: loader.loadStyles
  };
};

const CallSafe = (fn, payload) => {
  try {
    return fn(payload);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const NormalizePlugin = (plugin) => {
  return {
    name: plugin.name || "anonymous_plugin",
    onInit: plugin.onInit,
    onEvent: plugin.onEvent,
    onDispose: plugin.onDispose,
    transformCode: plugin.transformCode
  };
};

const createMDViewPluginRuntime = (option = {}) => {
  const states = new Map();
  const loader = {
    loadScripts: (scripts) => {
      const fn = option.loadScripts;
      const items = EnsureArray(scripts);
      if (!fn || items.length === 0) {
        return Promise.resolve("skipped");
      }
      return fn(items);
    },
    loadStyles: (styles) => {
      const fn = option.loadStyles;
      const items = EnsureArray(styles);
      if (!fn || items.length === 0) {
        return Promise.resolve("skipped");
      }
      return fn(items);
    }
  };

  const getState = (viewId) => {
    if (!states.has(viewId)) {
      states.set(viewId, {
        viewId: viewId,
        viewer: null,
        initialized: false,
        plugins: []
      });
    }
    return states.get(viewId);
  };

  const registerPlugin = (viewId, plugin) => {
    const state = getState(viewId);
    const normalized = NormalizePlugin(plugin);
    state.plugins.push(normalized);
    if (state.initialized && normalized.onInit) {
      CallSafe(normalized.onInit, {
        ctx: CreateRuntimeContext(state, loader)
      });
    }
    return normalized;
  };

  const initViewer = (viewer) => {
    const viewId = viewer && viewer.id;
    if (!viewId) {
      return;
    }
    const state = getState(viewId);
    state.viewer = viewer;
    if (state.initialized) {
      return;
    }
    state.initialized = true;
    const ctx = CreateRuntimeContext(state, loader);
    state.plugins.forEach((plugin) => {
      if (plugin.onInit) {
        CallSafe(plugin.onInit, { ctx: ctx });
      }
    });
  };

  const emit = (viewId, eventName, payload) => {
    const state = getState(viewId);
    if (state.plugins.length === 0) {
      return;
    }
    const envelope = {
      event: eventName,
      payload: payload,
      ctx: CreateRuntimeContext(state, loader)
    };
    state.plugins.forEach((plugin) => {
      if (plugin.onEvent) {
        CallSafe(plugin.onEvent, envelope);
      }
    });
  };

  const transformCode = (viewId, code, lang) => {
    const state = getState(viewId);
    if (state.plugins.length === 0) {
      return undefined;
    }
    let transformed = code;
    let touched = false;
    const envelope = {
      lang: lang,
      ctx: CreateRuntimeContext(state, loader)
    };
    state.plugins.forEach((plugin) => {
      if (!plugin.transformCode) {
        return;
      }
      const next = CallSafe(plugin.transformCode, {
        code: transformed,
        lang: envelope.lang,
        ctx: envelope.ctx
      });
      if (next !== undefined) {
        touched = true;
        transformed = next;
      }
    });
    return touched ? transformed : undefined;
  };

  const disposeViewer = (viewId) => {
    const state = states.get(viewId);
    if (!state) {
      return;
    }
    state.plugins.forEach((plugin) => {
      if (plugin.onDispose) {
        CallSafe(plugin.onDispose, { ctx: CreateRuntimeContext(state, loader) });
      }
    });
    states.delete(viewId);
  };

  return {
    registerPlugin: registerPlugin,
    initViewer: initViewer,
    emit: emit,
    transformCode: transformCode,
    disposeViewer: disposeViewer
  };
};

export { createMDViewPluginRuntime };
