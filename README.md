# MDView: Markdown Viewer Component

## Inline mode
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
```HTML
<link rel="stylesheet" href="./dist/default.css">
<script src="./dist/mdview.js"></script>

<markdown-viewer id="main" src="main.md">
  The main.md will be rendered here.
</markdown-viewer>
```
