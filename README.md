# MDView: Markdown Viewer Component
The web component renders and displays markdown documents. It works by simply linking libraries and writing component tags.

## Source
https://github.com/lizard-isana/mdview

## CDN
```HTML
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lizard-isana/mdview@v0.3.0/dist/assets/css/default.css">
  <script src="https://cdn.jsdelivr.net/gh/lizard-isana/mdview@v0.3.0/dist/assets/js/mdview.min.js"></script>
```

## Usage

### Inline mode
Write markdown directly in the HTML file. It does not dynamically load the file, so it works even if you open the HTML file directly from a browser ("file://" will also work).

```HTML
<template class="markdown" data-target="main">
  # The markdown document is here.
</template>

<mdview-content id="main">
  The HTML document will be rendered here.
</mdview-content>

```

#### Runtime API for inline mode
You can update the current inline markdown at runtime from JavaScript.

```html
<script>
  // Replace inline markdown and re-render.
  MDView.main.setMarkdown("# Updated at runtime");
</script>
```

#### Inline SPA helper plugin
If you use multiple `<template data-page="...">` blocks, you can enable page-like navigation with:

```html
<mdview-content
  id="main"
  data-inline-spa="true"
  data-inline-default-page="home"
  data-plugins="toc,inline-spa">
</mdview-content>
```

When enabled, links like `[FAQ](?page=faq)` are handled as in-page navigation and can also be controlled via:

```html
<script>
  MDView.main.setPage("faq", { updateUrl: true });
</script>
```

Main sample: `docs/inline-wiki.html`  
Advanced sample: `docs/inline-wiki-advanced.html`

### Include mode
Loads an external markdown file. Since the external file is loaded dynamically, a web server is required ("https://" or "http://" is required, "file://" will not work).

```HTML
<mdview-content id="main" src="main.md">
  The main.md will be rendered here.
</mdview-content>
```

### SPA(Single Page Application) Mode
If you specify `data-spa=true` in the include mode as follows, you can use SPA mode to open another Markdown file linked from the loaded Markdown file without page transition. 

```HTML
<mdview-content id="main" src="main.md" data-spa="true">
  The main.md will be rendered here.
  And links to .md files within main.md will be open and rendered here.
</mdview-content>
```

## Documentation/Sample site
- 日本語: https://lizard-isana.github.io/mdview/usage.ja.html
- English: WIP


## License
© 2022 Isana Kashiwai ([MIT license](https://github.com/lizard-isana/mdview/blob/main/LICENSE))

## Copyrights/Credits
MDView depends on below superb libraries.
- [markdown-it.js](https://github.com/markdown-it/markdown-it) ([MIT License](https://github.com/markdown-it/markdown-it/blob/master/LICENSE))
- [markdown-it-footnote](https://github.com//markdown-it/markdown-it-footnote) ([MIT License](https://github.com/markdown-it/markdown-it-footnote/blob/master/LICENSE))
- [markdown-it-task-lists.js](https://github.com/revin/markdown-it-task-lists) ([ISC License](https://github.com/revin/markdown-it-task-lists/blob/master/LICENSE))
- [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs)([MIT License](https://github.com/arve0/markdown-it-attrs/blob/master/LICENSE))
- [markdown-it-meta-yaml](https://github.com/kricsleo/markdown-it-meta-yaml)([MIT License](https://github.com/kricsleo/markdown-it-meta-yaml/blob/master/LICENSE))
- [DOMPurify](https://github.com/cure53/DOMPurify)([Apache/Mozilla Public License](https://github.com/cure53/DOMPurify/blob/master/LICENSE))
- [highlight.js](https://highlightjs.org/) ([BSD License](https://github.com/highlightjs/highlight.js/blob/master/LICENSE))
- [MathJax](https://www.mathjax.org/) ([Apache License 2.0](https://github.com/mathjax/MathJax/blob/master/LICENSE))
- [C3.js](https://c3js.org/) ([The MIT License](https://github.com/c3js/c3/blob/master/LICENSE))
- [Mermaid.js](https://mermaid-js.github.io/) ([MIT License](https://github.com/mermaid-js/mermaid/blob/develop/LICENSE))
