
import * as markdown_it from './vendors/markdown-it.js';
import * as markdown_it_footnote from './vendors/markdown-it-footnote.js';
import * as markdown_it_task_lists from './vendors/markdown-it-task-lists.js';
import * as markdown_it_attrs from './vendors/markdown-it-attrs.js';
import markdownItMetaYaml from './vendors/markdown-it-meta-yaml.js'
import * as purify from './vendors/purify.js'
import {createMDViewPluginRuntime} from './plugins/mdview-plugin-runtime.js'
import {registerBuiltinPlugins} from './plugins/register-builtins.js'

const LoadedScripts = new Set();
const LoadedStyles = new Set();
const LoadingScripts = new Map();
const LoadingStyles = new Map();
const LoadingOptionConfigs = new Map();
const DEFAULT_OPTION_CONFIG_URL = "config.json";

const DEFAULT_VIEWER_OPTIONS = Object.freeze({
  html: false,
  sanitize: true,
  format: "markdown",
  spa: false,
  frontmatter: true,
  strict_root: false,
  link_resolution: "root",
  allow_parent: false,
  query_path_mode: "full",
  execute_script: false
});

const NormalizeAsArray = (value) => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const LoadSingleScript = (url) => {
  if (!url) {
    return Promise.resolve("skipped");
  }
  if (LoadedScripts.has(url)) {
    return Promise.resolve("exist");
  }
  if (LoadingScripts.has(url)) {
    return LoadingScripts.get(url);
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      LoadedScripts.add(url);
      LoadingScripts.delete(url);
      resolve("loaded");
    };
    script.onerror = () => {
      LoadingScripts.delete(url);
      script.remove();
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  });

  LoadingScripts.set(url, promise);
  return promise;
};

const LoadSingleStyle = (url) => {
  if (!url) {
    return Promise.resolve("skipped");
  }
  if (LoadedStyles.has(url)) {
    return Promise.resolve("exist");
  }
  if (LoadingStyles.has(url)) {
    return LoadingStyles.get(url);
  }

  const promise = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    link.onload = () => {
      LoadedStyles.add(url);
      LoadingStyles.delete(url);
      resolve("loaded");
    };
    link.onerror = () => {
      LoadingStyles.delete(url);
      link.remove();
      reject(new Error(`Failed to load stylesheet: ${url}`));
    };
    document.getElementsByTagName("head")[0].appendChild(link);
  });

  LoadingStyles.set(url, promise);
  return promise;
};

const ScriptLoader = (scripts, callback) => {
  const items = NormalizeAsArray(scripts);
  (async () => {
    try {
      for (const script of items) {
        await LoadSingleScript(script);
      }
      if (callback) {
        callback("loaded");
      }
    } catch (error) {
      console.error(error);
      if (callback) {
        callback("error");
      }
    }
  })();
};

const StyleLoader = (styles) => {
  const items = NormalizeAsArray(styles);
  (async () => {
    try {
      for (const style of items) {
        await LoadSingleStyle(style);
      }
    } catch (error) {
      console.error(error);
    }
  })();
};

const DataLoader = class{
  constructor(option = {}){
      this.option = option;
  }

  _get_format = (url) => {
    const extention = url.split('.').pop(); 
    let format;
    switch(extention){
      case "json":
        format = "json";
        break;
      case "txt":
        format = "text";
        break;
      case "xml":
        format = "xml";
        break;
      case "html":
        format = "html";
        break;
      default:
        format = "text";
        break;
    }
    return format;
  }

  load  = async (url) =>{
    let request;
    if(url){
      request = new Request(url);
    }else if(this.option && this.option.url){
      request = new Request(this.option.url);
    }
    if (!request) {
      return {
        ok: false,
        status: 0,
        data: null,
        error: "No request target"
      };
    }

    let format;
    if(this.option.format){
      format = this.option.format;
    }else{
      format = this._get_format(url);
    }

    try {
      const response = await fetch(request);
      if (response.status !== 200) {
        return {
          ok: false,
          status: response.status,
          data: null,
          error: `Error: ${response.status}`
        };
      }

      let rawData;
      switch(format){
        case "json":
          rawData = await response.json();
          break;
        case "text":
          rawData = await response.text();
          break;
        case "html":
        case "xml":
          rawData = await response.text();
          break;
        default:
          rawData = await response.text();
          break;
      }

      let parsedData;
      switch(format){
        case "xml":
          var parser = new DOMParser();
          parsedData = parser.parseFromString(rawData, "text/xml");
          break;
        case "html":
          var parser2 = new DOMParser();
          parsedData = parser2.parseFromString(rawData, "text/html");
          break;
        default:
          parsedData = rawData;
          break;
      }

      if(this.option.callback){
        this.option.callback(parsedData)
      }

      return {
        ok: true,
        status: response.status,
        data: parsedData,
        error: null
      };
    } catch(error) {
      console.error(error);
      return {
        ok: false,
        status: 0,
        data: null,
        error: error && error.message ? error.message : "Unknown error"
      };
    }
  }
}

const LoadScriptsAsync = (scripts) => {
  return new Promise((resolve) => {
    ScriptLoader(scripts, (message) => {
      resolve(message || "loaded");
    });
  });
};

const LoadStylesAsync = (styles) => {
  return new Promise((resolve) => {
    const items = NormalizeAsArray(styles);
    (async () => {
      try {
        for (const style of items) {
          await LoadSingleStyle(style);
        }
        resolve("loaded");
      } catch (error) {
        console.error(error);
        resolve("error");
      }
    })();
  });
};

const GlobalStorage = {}
GlobalStorage.mdview = [];
GlobalStorage.Hook = {}

window.MDView = window.MDView || {
  VERSION: "0.2.0 (20260215)",
  AUTHOR: "Isana Kashiwai",
  LICENSE: "MIT"
};

const PluginEvents = Object.freeze({
  MARKDOWN_LOADED: "markdown_loaded",
  CONTENT_LOADED: "content_loaded",
  CONTENT_RELOADED: "content_reloaded",
  CONTENT_RENDERED: "content_rendered",
  CODE_HIGHLIGHT: "code_highlight"
});
const DEFAULT_ALLOWED_ROOT_FILES = Object.freeze(["index.md", "404.md"]);

const EnsureHookBucket = (id) => {
  if (!GlobalStorage.Hook[id]) {
    GlobalStorage.Hook[id] = {};
  }
  return GlobalStorage.Hook[id];
}

const GlobalAddHook = (id,hook,f) =>{
  const bucket = EnsureHookBucket(id);
  if (!bucket[hook]){
    bucket[hook] = []
  }
  bucket[hook].push(f);
}

const EmitHook = (id, hook, payload) => {
  const bucket = EnsureHookBucket(id);
  if (!bucket[hook]) {
    return;
  }
  for (var i in bucket[hook]) {
    bucket[hook][i](payload);
  }
}

const RunCodeHighlightHooks = (id, code, lang, fallback) => {
  const bucket = EnsureHookBucket(id);
  const hooks = bucket[PluginEvents.CODE_HIGHLIGHT];
  let next = code;
  let touched = false;
  if (hooks && hooks.length > 0) {
    hooks.forEach((hook) => {
      const transformed = hook(next, lang);
      if (transformed !== undefined) {
        touched = true;
        next = transformed;
      }
    });
  }
  if (window.MDView.pluginRuntime) {
    const runtimeTransformed = window.MDView.pluginRuntime.transformCode(id, next, lang);
    if (runtimeTransformed !== undefined) {
      touched = true;
      next = runtimeTransformed;
    }
  }
  if (!touched) {
    return fallback(code);
  }
  return next;
}

const EmitPluginEvent = (viewId, eventName, payload) => {
  if (!window.MDView.pluginRuntime) {
    return;
  }
  window.MDView.pluginRuntime.emit(viewId, eventName, payload);
}

window.MDView.PLUGIN_EVENTS = PluginEvents;
window.MDView.registerHook = (viewId, eventName, handler) => {
  GlobalAddHook(viewId, eventName, handler);
};
window.MDView.loadScripts = LoadScriptsAsync;
window.MDView.loadStyles = LoadStylesAsync;
window.MDView.pluginRuntime = window.MDView.pluginRuntime || createMDViewPluginRuntime({
  loadScripts: LoadScriptsAsync,
  loadStyles: LoadStylesAsync
});
window.MDView.registerPlugin = (viewId, plugin) => {
  return window.MDView.pluginRuntime.registerPlugin(viewId, plugin);
};
window.MDView.emitPluginEvent = (viewId, eventName, payload) => {
  window.MDView.pluginRuntime.emit(viewId, eventName, payload);
};

class MarkdownViewer extends HTMLElement {
  constructor() {
    super();
    EnsureHookBucket(this.id);
    if(GlobalStorage.mdview.indexOf(this.id)<0){
      GlobalStorage.mdview.push(this.id);
    }
    window.MDView[this.id] = {}
    this.dataset.status = "assigned"
    this.viewerState = {};
    this.viewerState.History =[];
    this.viewerState.allowed_attributes = ['id', 'class', 'style', 'target'];
    this.viewerState.notFoundTemplateLoaded = false;
    this.viewerState.notFoundTemplateMarkdown = null;
    this.viewerState.currentDocPath = null;
    // Backward-compatible internal alias.
    this.Storage = this.viewerState;
    this.query = this.QueryDecoder();
    this.status;
    this._popStateHandler = null;
    this._isPopStateBound = false;
    this.option = {...DEFAULT_VIEWER_OPTIONS};
    registerBuiltinPlugins(window.MDView, this);
    window.MDView.pluginRuntime.initViewer(this);
  } 
  LoadOptionConfig = async (url, optional = true) => {
    if (!url || typeof url !== "string") {
      return {};
    }
    const key = url.trim();
    if (!key) {
      return {};
    }
    if (LoadingOptionConfigs.has(key)) {
      return LoadingOptionConfigs.get(key);
    }

    const promise = (async () => {
      try {
        const response = await fetch(key);
        if (!response.ok) {
          if (!optional) {
            console.warn(`[MDView] Failed to load config: ${key} (${response.status})`);
          }
          return {};
        }
        const data = await response.json();
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          console.warn(`[MDView] Invalid config format: ${key}`);
          return {};
        }
        return data;
      } catch (error) {
        if (!optional) {
          console.warn(`[MDView] Failed to parse config: ${key}`, error);
        }
        return {};
      }
    })();

    LoadingOptionConfigs.set(key, promise);
    return promise;
  }

  ParseInlineOption = () => {
    if (!this.dataset.option) {
      return {};
    }
    try {
      const parsed = JSON.parse(this.dataset.option);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {};
      }
      return parsed;
    } catch (error) {
      console.warn("[MDView] Invalid data-option JSON", error);
      return {};
    }
  }

  ReadDataAttributeOptions = () => {
    const options = {};
    if(this.dataset.html !== undefined){options.html = this.dataset.html}
    if(this.dataset.sanitize !== undefined){options.sanitize = this.dataset.sanitize}
    if(this.dataset.format !== undefined){options.format = this.dataset.format}
    if(this.dataset.spa !== undefined){options.spa = this.dataset.spa}
    if(this.dataset.link_target || this.dataset.linkTarget){
      options.link_target = this.dataset.link_target || this.dataset.linkTarget;
    }
    if(this.dataset.frontmatter !== undefined){options.frontmatter = this.dataset.frontmatter}
    if(this.dataset.allowedDirs !== undefined){options.allowed_dirs = this.dataset.allowedDirs}
    if(this.dataset.allowedFiles !== undefined){options.allowed_files = this.dataset.allowedFiles}
    if(this.dataset.strictRoot !== undefined){options.strict_root = this.dataset.strictRoot}
    if(this.dataset.linkResolution !== undefined){options.link_resolution = this.dataset.linkResolution}
    if(this.dataset.allowParent !== undefined){options.allow_parent = this.dataset.allowParent}
    if(this.dataset.queryPathMode !== undefined){options.query_path_mode = this.dataset.queryPathMode}
    if(this.dataset.executeScript !== undefined){options.execute_script = this.dataset.executeScript}
    return options;
  }

  SetDefaults = async () => {
    const inlineOption = this.ParseInlineOption();
    const defaultConfig = await this.LoadOptionConfig(DEFAULT_OPTION_CONFIG_URL, true);
    let customConfig = {};
    if (this.dataset.config) {
      customConfig = await this.LoadOptionConfig(this.dataset.config, false);
    }
    const dataOption = this.ReadDataAttributeOptions();

    this.option = {
      ...DEFAULT_VIEWER_OPTIONS,
      ...defaultConfig,
      ...customConfig,
      ...inlineOption,
      ...dataOption
    };

    if(this.option.link_target == undefined){this.option.link_target = this.id}
    this.option.allowed_dirs = this.ParseAllowedDirs(this.option.allowed_dirs);
    this.option.allowed_files = this.ParseAllowedFiles(this.option.allowed_files);
    this.option.strict_root = this.option.strict_root === true || this.option.strict_root === "true";
    this.option.link_resolution = this.option.link_resolution === "relative" ? "relative" : "root";
    this.option.allow_parent = this.option.allow_parent === true || this.option.allow_parent === "true";
    this.option.query_path_mode = this.option.query_path_mode === "split" ? "split" : "full";
    this.option.execute_script = this.option.execute_script === true || this.option.execute_script === "true";
    this.option.html = this.option.html === true || this.option.html === "true";
    this.option.sanitize = !(this.option.sanitize === false || this.option.sanitize === "false");
    this.option.spa = this.option.spa === true || this.option.spa === "true";
    this.option.frontmatter = !(this.option.frontmatter === false || this.option.frontmatter === "false");
    if(this.getAttribute("src")){this.option.mode = 'include'}else{this.option.mode = 'inline'};
  }

  ActivateInlineScripts = (rootElement) => {
    if (this.option.execute_script !== true || !rootElement) {
      return;
    }
    const scripts = rootElement.querySelectorAll("script");
    for (const original of scripts) {
      const replaced = document.createElement("script");
      for (const attr of original.attributes) {
        replaced.setAttribute(attr.name, attr.value);
      }
      replaced.textContent = original.textContent || "";
      original.replaceWith(replaced);
    }
  }

  ParseAllowedDirs = (source) => {
    let raw = source;
    if (raw == undefined) {
      return [];
    }
    if (typeof raw === 'string') {
      raw = raw.split(',');
    }
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .map((item) => String(item).trim().replace(/\/+$/g, ''))
      .filter(Boolean)
      .filter((item) => !item.includes('/') && item !== '.' && item !== '..');
  }

  ParseAllowedFiles = (source) => {
    let raw = source;
    if (raw == undefined) {
      return [];
    }
    if (typeof raw === 'string') {
      raw = raw.split(',');
    }
    if (!Array.isArray(raw)) {
      return [];
    }
    const parsed = raw
      .map((item) => String(item).trim())
      .filter(Boolean)
      .filter((item) => !item.includes('/'))
      .filter((item) => item.toLowerCase().endsWith('.md'))
      .map((item) => item.toLowerCase());

    return [...new Set([...DEFAULT_ALLOWED_ROOT_FILES, ...parsed])];
  }

  ResolveMarkdownTarget = (input, currentDocPath = "") => {
    if (typeof input !== 'string') {
      return null;
    }
    let target = input.trim();
    if (!target) {
      return null;
    }
    try {
      target = decodeURIComponent(target);
    } catch (error) {
      return null;
    }
    target = target.replace(/\\/g, '/');
    const hadDotPrefix = target.startsWith('./') || target.startsWith('../');
    while (target.startsWith('./')) {
      target = target.slice(2);
    }
    if (!target || target.startsWith('/')) {
      return null;
    }
    if (target.includes('?') || target.includes('#') || target.includes('\0')) {
      return null;
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)) {
      return null;
    }

    const rawParts = target.split('/').filter(Boolean);
    const resolvedParts = [];
    const startsWithAllowedDir = rawParts.length > 1 && this.option.allowed_dirs.indexOf(rawParts[0]) >= 0;
    const forceRootResolution = this.option.link_resolution === "relative" && !hadDotPrefix && startsWithAllowedDir;
    if (this.option.link_resolution === "relative" && currentDocPath && !forceRootResolution) {
      const baseParts = String(currentDocPath).split('/').filter(Boolean);
      baseParts.pop();
      resolvedParts.push(...baseParts);
    }

    for (const part of rawParts) {
      if (part === '.') {
        continue;
      }
      if (part === '..') {
        if (this.option.allow_parent !== true) {
          return null;
        }
        if (resolvedParts.length === 0) {
          return null;
        }
        resolvedParts.pop();
        continue;
      }
      resolvedParts.push(part);
    }

    if (resolvedParts.length === 0) {
      return null;
    }

    const normalized = resolvedParts.join('/');
    if (!normalized.toLowerCase().endsWith('.md')) {
      return null;
    }

    if (resolvedParts.length > 1) {
      const topDir = resolvedParts[0];
      if (this.option.allowed_dirs.indexOf(topDir) < 0) {
        return null;
      }
    } else if (this.option.strict_root === true) {
      if (this.option.allowed_files.indexOf(normalized.toLowerCase()) < 0) {
        return null;
      }
    }
    return normalized;
  }

  ResolveIncludeFilePath = (normalizedTarget) => {
    return normalizedTarget;
  }

  ParseSingleMarkdownFileName = (input) => {
    if (typeof input !== "string") {
      return null;
    }
    let value = input.trim();
    if (!value) {
      return null;
    }
    try {
      value = decodeURIComponent(value);
    } catch (error) {
      return null;
    }
    value = value.replace(/\\/g, "/");
    while (value.startsWith("./")) {
      value = value.slice(2);
    }
    if (!value || value.startsWith("/") || value.includes("/")) {
      return null;
    }
    if (value.includes("?") || value.includes("#") || value.includes("\0")) {
      return null;
    }
    if (!value.toLowerCase().endsWith(".md")) {
      return null;
    }
    if (value === "." || value === "..") {
      return null;
    }
    return value;
  }

  ParseScopedPathPart = (input) => {
    if (typeof input !== "string") {
      return null;
    }
    let value = input.trim();
    if (!value) {
      return [];
    }
    try {
      value = decodeURIComponent(value);
    } catch (error) {
      return null;
    }
    value = value.replace(/\\/g, "/");
    const parts = value.split("/").filter(Boolean);
    if (parts.length === 0) {
      return [];
    }
    const safeParts = [];
    for (const part of parts) {
      if (!/^[a-zA-Z0-9_-]+$/.test(part)) {
        return null;
      }
      safeParts.push(part);
    }
    return safeParts;
  }

  ResolveTargetFromQuery = (query) => {
    const rawViewer = query[this.id];
    if (rawViewer == undefined) {
      return null;
    }

    if (this.option.query_path_mode === "split") {
      const fileName = this.ParseSingleMarkdownFileName(String(rawViewer));
      if (!fileName) {
        return null;
      }
      const dirParts = this.ParseScopedPathPart(String(query.dir || ""));
      const subdirParts = this.ParseScopedPathPart(String(query.subdir || ""));
      if (dirParts === null || subdirParts === null) {
        return null;
      }
      const merged = [...dirParts, ...subdirParts];
      const candidate = merged.length > 0 ? `${merged.join("/")}/${fileName}` : fileName;
      return this.ResolveMarkdownTarget(candidate);
    }

    return this.ResolveMarkdownTarget(String(rawViewer));
  }

  BuildViewerUrl = (normalizedTarget) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(this.option.link_target);
    params.delete(this.id);
    params.delete("dir");
    params.delete("subdir");

    if (this.option.query_path_mode === "split") {
      const parts = String(normalizedTarget).split("/").filter(Boolean);
      const file = parts.pop();
      if (!file) {
        return "?" + params.toString();
      }
      params.set(this.option.link_target, file);
      if (parts.length > 0) {
        params.set("dir", parts[0]);
        if (parts.length > 1) {
          params.set("subdir", parts.slice(1).join("/"));
        }
      }
    } else {
      params.set(this.option.link_target, normalizedTarget);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "?";
  }

  RenderNotFound = async (loadingTarget, requestedPath) => {
    const target = loadingTarget || document.querySelector(`#${this.id}`);
    if (!target) {
      return;
    }

    let section;
    if (!this.viewerState.notFoundTemplateLoaded) {
      const loader = new DataLoader();
      const notFoundResult = await loader.load("404.md");
      if (
        notFoundResult.ok &&
        typeof notFoundResult.data === "string" &&
        notFoundResult.data.trim().length > 0
      ) {
        this.viewerState.notFoundTemplateMarkdown = notFoundResult.data;
      }
      this.viewerState.notFoundTemplateLoaded = true;
    }

    const notFoundMarkdown = this.viewerState.notFoundTemplateMarkdown;
    if (typeof notFoundMarkdown === "string" && notFoundMarkdown.trim().length > 0) {
      let html = this.renderer.render(notFoundMarkdown);
      if (this.option.sanitize == true) {
        html = DOMPurify.sanitize(html);
      }
      const dom = document.createRange().createContextualFragment(html);
      if (this.option.mode == 'include') {
        this.RewriteIncludeLinks(dom, loadingTarget, "404.md");
      }
      section = document.createElement("section");
      section.appendChild(dom);
      this.ActivateInlineScripts(section);
    } else {
      const safePath = this.EscapeEntity(String(requestedPath || 'unknown'));
      section = document.createElement("section");
      section.innerHTML = `<h2>Not Found</h2><p>Could not load: <code>${safePath}</code></p>`;
    }

    const current = target.querySelector("section");
    if (current) {
      current.remove();
    }
    target.appendChild(section);
    target.dataset.status = "not_found";
    this.dataset.status = "not_found";
    if(this.option.spa == true){
      document.querySelector('body').style.display = "initial";
    }
  }

  RewriteIncludeLinks = (dom, loadingTarget, baseDocPath = "") => {
    const link_array = dom.querySelectorAll("a");
    let href;
    for (var i = 0, ln = link_array.length; i < ln; i++) {
      href = link_array[i].getAttribute("href");
      const normalizedTarget = this.ResolveMarkdownTarget(
        String(href || ''),
        baseDocPath || ''
      );
      if (!normalizedTarget) {
        continue;
      }
      link_array[i].dataset.mdviewTarget = normalizedTarget;
      link_array[i].href = this.BuildViewerUrl(normalizedTarget);
      if (link_array[i].dataset.mdviewBound === "true") {
        continue;
      }
      link_array[i].dataset.mdviewBound = "true";
      link_array[i].addEventListener('click', this.OnMdLinkClick);
    }
  }

  OnMdLinkClick = (e) => {
    e.preventDefault();
    const file = e.currentTarget.dataset.mdviewTarget;
    if (!file) {
      return;
    }
    const url = this.BuildViewerUrl(file);
    const target_element = document.querySelector(`#${this.option.link_target}`);
    this.status = "reloading";
    if (target_element) {
      target_element.dataset.status = "reloading";
    }
    this.load(file, { normalized: true });
    window.history.pushState(null, null, url);
    this.viewerState.History.push({
      url:url,
      file:file
    });
  }

  EscapeEntity = function (str) {
    return str.replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#039;')
  }
  
  UnescapeEntity = function (str) {
    return str.replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&quot;/g, '\"')
      .replace(/&#039;/g, '\'')
  }
  
  QueryDecoder = function () {
    const query = {};
    const params = new URLSearchParams(window.location.search);
    params.forEach((rawValue, rawName) => {
      const name = this.EscapeEntity(String(rawName || ""));
      let value = this.EscapeEntity(String(rawValue || ""));
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }
      query[name] = value;
    });
    return query;
  };
  load = async (target, loadOption = {}) => {
    this.query = this.QueryDecoder();
    
    if(this.option.spa == true){
      document.querySelector('body').style.display = "none";  
      window.scroll({
        top: 0,
        behavior: "instant"
      });
    }

    const mdview_content = document.querySelector(`mdview-content#${this.id}`);

    let loading_target;
    if(target && this.id !== this.option.link_target){
      loading_target = document.querySelector(`#${this.option.link_target}`);
    }else{
      loading_target = document.querySelector(`#${this.id}`);
    }

    if(target){
      loading_target.dataset.status = "reloading";
    }else{
      loading_target.dataset.status = "loading";
      this.status = 'loading';
    }
   
    let markdown;
    let src = this.getAttribute("src")
    if(src){
      this.option.mode = 'include';    
      let file;
      let currentDocPath = null;
      if(target){
        const normalizedTarget = (loadOption && loadOption.normalized === true)
          ? this.ResolveMarkdownTarget(target, '')
          : this.ResolveMarkdownTarget(target, this.viewerState.currentDocPath || '');
        if (!normalizedTarget) {
          console.warn(`[MDView] Blocked target path: ${target}`);
          await this.RenderNotFound(loading_target, target);
          return;
        }
        file = this.ResolveIncludeFilePath(normalizedTarget);
        currentDocPath = normalizedTarget;
      }else if(this.option.spa == true && Object.keys(this.query).length > 0) {
        for (var key in this.query) {
          const tgt_elem = document.getElementById(key);
          if(!tgt_elem){continue};
          if (key == this.id) {
            const normalizedTarget = this.ResolveTargetFromQuery(this.query);
            if (normalizedTarget) {
              file = this.ResolveIncludeFilePath(normalizedTarget);
              currentDocPath = normalizedTarget;
            } else {
              console.warn(`[MDView] Blocked query path: ${this.query[key]}`);
              file = src;
            }
          }else{
            file = src;
          }
        }
      }else{
        file = src;
        const normalizedSrc = this.ResolveMarkdownTarget(String(src || ""));
        if (normalizedSrc) {
          currentDocPath = normalizedSrc;
        }
      }
      this.viewerState.currentDocPath = currentDocPath;
      const loader = new DataLoader();
      const loadResult = await loader.load(file);
      if (!loadResult.ok) {
        if (loadResult.error) {
          console.warn(`[MDView] Failed to load markdown: ${loadResult.error}`);
        }
        await this.RenderNotFound(loading_target, file || src || target);
        return;
      }
      markdown = loadResult.data;
    }else{
      const md_element = document.querySelector(`template[data-target="${this.id}"]`);
      if(md_element){
        this.option.mode = 'inline';
        markdown = md_element.innerHTML;
        markdown = markdown.replace(/(&gt;)/g, '>');
        markdown = markdown.replace(/(&lt;)/g, '<');
      }else{
        console.error("No markdown document is found.")
        await this.RenderNotFound(loading_target, `template[data-target="${this.id}"]`);
        return;
      }
    }

    EmitPluginEvent(this.id, PluginEvents.MARKDOWN_LOADED, {
      viewer: this,
      target: mdview_content
    });

    let html = this.renderer.render(markdown);
    if (this.option.sanitize == true) {
      html = DOMPurify.sanitize(html);
    };
    let dom = document.createRange().createContextualFragment(html);

    if(this.option.mode == 'include'){
      this.RewriteIncludeLinks(dom, loading_target, this.viewerState.currentDocPath || '');
    }

    const new_section = document.createElement("section");
    new_section.appendChild(dom);
    this.ActivateInlineScripts(new_section);

    const loading_target_section = loading_target.querySelector("section");
    if(loading_target_section){
      loading_target_section.remove()
    }
    loading_target.appendChild(new_section);
    
    if(this.option.spa == true){
      document.querySelector('body').style.display = "initial";  
    }

    let message;
    if(loading_target.dataset.status == "reloading"){ 
      message = PluginEvents.CONTENT_RELOADED
    }else{
      message = PluginEvents.CONTENT_LOADED
    }
    this.status =  message;
    this.dataset.status = message
    EmitHook(this.id, PluginEvents.CONTENT_RENDERED, {
      viewer: this,
      target: loading_target,
      status: message
    });
    EmitPluginEvent(this.id, PluginEvents.CONTENT_RENDERED, {
      viewer: this,
      target: loading_target,
      status: message
    });
    EmitHook(this.id, message, loading_target);
    EmitPluginEvent(this.id, message, loading_target);
  }

  init = async () => {
    this.renderer = window.markdownit({
      html: this.option.html,
      linkify: true,
      breaks: true,
      typographer: true,
      highlight: (code, lang) => {
        return RunCodeHighlightHooks(
          this.id,
          code,
          lang,
          this.EscapeEntity
        );
      }
    });

    this.renderer.linkify.set({
      fuzzyEmail: false
    });

    this.renderer
      .use(markdownitFootnote)
      .use(markdownitTaskLists)
      .use(markdownItAttrs, {
        allowedAttributes: this.viewerState.allowed_attributes
      })

      if(this.option.frontmatter == true){
        this.renderer.use(markdownItMetaYaml, {
          cb: (meta) => {
            if(meta){
              window.MDView[this.id].meta = meta;
            }
          }
        })
      }
  }

  HandlePopState = () => {
    const q = this.QueryDecoder();
    if(q[this.id]){
      const normalizedTarget = this.ResolveTargetFromQuery(q);
      if (!normalizedTarget) {
        const src = this.getAttribute("src");
        this.dataset.status = "reloading";
        this.load(src, { normalized: true });
        return;
      }
      this.dataset.status = "reloading";
      this.load(normalizedTarget, { normalized: true });
      return;
    }

    const query_keys = Object.keys(q).filter(i => GlobalStorage.mdview.indexOf(i) >= 0);
    if(query_keys.length==0){
      this.dataset.status = "reloading";
      const src = this.getAttribute("src");
      this.load(src, { normalized: true });
    }
  }

  RegisterPopState = () => {
    if (this._isPopStateBound) {
      return;
    }
    if(this.option.mode != 'include' || this.option.spa != true){
      return;
    }
    this._popStateHandler = () => this.HandlePopState();
    window.addEventListener("popstate", this._popStateHandler);
    this._isPopStateBound = true;
  }

  UnregisterPopState = () => {
    if (!this._isPopStateBound || !this._popStateHandler) {
      return;
    }
    window.removeEventListener("popstate", this._popStateHandler);
    this._popStateHandler = null;
    this._isPopStateBound = false;
  }

  static get observedAttributes() {
    return ['data-status'];
  };

  connectedCallback() {
    this.dataset.status = "connected";
    (async () => {
      await this.SetDefaults();
      await this.init();
      this.RegisterPopState();
      this.load();
    })();
  }
  disconnectedCallback() {
    this.UnregisterPopState();
  }
  attributeChangedCallback(name, old_value, new_value){
    // no-op
  }
}

window.addEventListener('DOMContentLoaded', function() {
  if (!customElements.get('mdview-content')) {
    customElements.define('mdview-content', MarkdownViewer);
  }
})
