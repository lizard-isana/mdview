# MDView: Markdown Viewer Component

## Inline Mode
```HTML
<link rel="stylesheet" href="default.css">
<script src="mdview.js"></script>

<markdown-viewer id="main">
  The HTML document will be rendered here.
</markdown-viewer>

<template class="markdown" data-target="main">
  # The markdown document is here.
</template>
```

## Include Mode
```HTML
<link rel="stylesheet" href="default.css">
<script src="./js/mdview.js"></script>

<markdown-viewer id="main" src="main.md">
  The main.md will be rendered here.
</markdown-viewer>
```
