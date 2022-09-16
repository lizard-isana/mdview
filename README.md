# MDView: Markdown Viewer Component
The web components renders and displays markdown documents. It works by simply linking libraries and writing component tags.

## Inline mode
Write markdown directly in the HTML file. It does not dynamically load the file, so it works even if you open the HTML file directly from a browser ("file://" will also work).

```HTML
<link rel="stylesheet" href="./dist/default.css">
<script src="./dist/mdview.js"></script>

<mdview-content id="main">
  The HTML document will be rendered here.
</mdview-content>

<template class="markdown" data-target="main">
  # The markdown document is here.
</template>
```

## Include mode
Loads an external markdown file. Since the external file is loaded dynamically, a web server is required ("https://" or "http://" is required, "file://" will not work).

```HTML
<link rel="stylesheet" href="./dist/default.css">
<script src="./dist/mdview.js"></script>

<mdview-content id="main" src="main.md">
  The main.md will be rendered here.
</mdview-content>
```
