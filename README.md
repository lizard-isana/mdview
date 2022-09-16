# MDView: Markdown Viewer Component
The web components renders and displays markdown documents. It works by simply linking libraries and writing component tags, and supports both "inline mode" where markdown is written directly in the HTML file and "include mode" where markdown is read from an external file.

## Inline mode
Write markdown directly in the HTML file. It does not dynamically load the file, so it works even if you open the HTML file directly from a browser ("file://~" will also work).

```HTML
<link rel="stylesheet" href="./dist/default.css">
<script src="./dist/mdview.js"></script>

<markdown-viewer id="main">
  The HTML document will be rendered here.
</markdown-viewer>

<template class="markdown" data-target="main">
  # The markdown document is here.
</template>
```

## Include mode
Loads an external markdown file. Since external files are loaded dynamically, a web server is required for operation ("https://~" or "http://~" is required, "file://~" will not work).

```HTML
<link rel="stylesheet" href="./dist/default.css">
<script src="./dist/mdview.js"></script>

<markdown-viewer id="main" src="main.md">
  The main.md will be rendered here.
</markdown-viewer>
```
