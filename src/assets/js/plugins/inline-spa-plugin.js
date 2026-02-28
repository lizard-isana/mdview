const ParseBoolean = (value) => {
  return value === true || value === "true";
};

const createInlineSpaPlugin = () => {
  let popStateHandler = null;
  let clickHandler = null;
  let viewerRef = null;

  const isEnabled = (viewer) => {
    if (!viewer || viewer.getAttribute("src")) {
      return false;
    }
    if (viewer.option && viewer.option.inline_spa === true) {
      return true;
    }
    return ParseBoolean(viewer.dataset && viewer.dataset.inlineSpa);
  };

  const getQueryParam = (viewer) => {
    if (!viewer) {
      return "page";
    }
    const raw = (viewer.option && viewer.option.inline_spa_param) || viewer.dataset.inlineSpaParam || "page";
    if (typeof viewer.NormalizeInlineSpaParam === "function") {
      return viewer.NormalizeInlineSpaParam(raw);
    }
    return "page";
  };

  const getDefaultPage = (viewer) => {
    if (!viewer) {
      return "";
    }
    const raw = (viewer.option && viewer.option.inline_default_page) || viewer.dataset.inlineDefaultPage || "";
    return String(raw || "").trim();
  };

  const resolveTemplatePages = (viewer) => {
    if (!viewer || typeof viewer.ReadInlinePageConfig !== "function" || typeof viewer.GetInlinePageMap !== "function") {
      return new Map();
    }
    const config = viewer.ReadInlinePageConfig();
    return viewer.GetInlinePageMap(config.pageAttr);
  };

  const syncInitialPage = (viewer) => {
    if (!viewer || typeof viewer.setPage !== "function") {
      return;
    }
    const queryParam = getQueryParam(viewer);
    const params = new URLSearchParams(window.location.search);
    const requested = params.get(queryParam) || getDefaultPage(viewer);
    if (!requested) {
      return;
    }
    viewer.setPage(requested, {
      reload: false,
      updateUrl: true,
      history: "replace",
      queryParam: queryParam
    });
  };

  const rewriteInlineLinks = (viewer, payloadRoot) => {
    if (!viewer || !payloadRoot) {
      return;
    }
    const pages = resolveTemplatePages(viewer);
    if (pages.size === 0) {
      return;
    }
    const queryParam = getQueryParam(viewer);
    const links = payloadRoot.querySelectorAll("a[href]");

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href) {
        continue;
      }
      let parsedUrl;
      try {
        parsedUrl = new URL(href, window.location.href);
      } catch (error) {
        continue;
      }
      if (parsedUrl.origin !== window.location.origin || parsedUrl.pathname !== window.location.pathname) {
        continue;
      }
      const page = String(parsedUrl.searchParams.get(queryParam) || "").trim();
      if (!page || !pages.has(page)) {
        continue;
      }

      link.dataset.mdviewInlineSpaPage = page;
      link.dataset.mdviewInlineSpaParam = queryParam;
      if (typeof viewer.BuildInlineSpaUrl === "function") {
        link.href = viewer.BuildInlineSpaUrl(queryParam, page);
      }

      if (link.dataset.mdviewInlineSpaBound === "true") {
        continue;
      }
      if (!clickHandler) {
        clickHandler = (event) => {
          const targetLink = event.currentTarget;
          const activeViewer = viewerRef;
          if (!activeViewer || !targetLink || typeof activeViewer.setPage !== "function") {
            return;
          }
          const targetPage = targetLink.dataset.mdviewInlineSpaPage;
          const param = targetLink.dataset.mdviewInlineSpaParam || getQueryParam(activeViewer);
          if (!targetPage) {
            return;
          }
          event.preventDefault();
          activeViewer.setPage(targetPage, {
            reload: true,
            updateUrl: true,
            history: "push",
            queryParam: param
          });
        };
      }
      link.dataset.mdviewInlineSpaBound = "true";
      link.addEventListener("click", clickHandler);
    }
  };

  return {
    name: 'inline-spa',
    onInit: ({ ctx }) => {
      const viewer = ctx.getViewer();
      viewerRef = viewer;
      if (!isEnabled(viewer)) {
        return;
      }
      syncInitialPage(viewer);

      if (!popStateHandler) {
        popStateHandler = () => {
          const activeViewer = viewerRef;
          if (!activeViewer || !isEnabled(activeViewer) || typeof activeViewer.setPage !== "function") {
            return;
          }
          const queryParam = getQueryParam(activeViewer);
          const params = new URLSearchParams(window.location.search);
          const requested = params.get(queryParam) || getDefaultPage(activeViewer);
          if (!requested) {
            return;
          }
          activeViewer.setPage(requested, {
            reload: true,
            updateUrl: false,
            queryParam: queryParam
          });
        };
        window.addEventListener("popstate", popStateHandler);
      }
    },
    onEvent: ({ event, payload, ctx }) => {
      if (event !== 'content_loaded' && event !== 'content_reloaded') {
        return;
      }
      const viewer = ctx.getViewer();
      if (!isEnabled(viewer)) {
        return;
      }
      rewriteInlineLinks(viewer, payload);
    },
    onDispose: () => {
      if (popStateHandler) {
        window.removeEventListener("popstate", popStateHandler);
        popStateHandler = null;
      }
      clickHandler = null;
      viewerRef = null;
    }
  };
};

export { createInlineSpaPlugin };
