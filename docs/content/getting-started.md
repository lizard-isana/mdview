# Getting Started

このガイドは、最短で MDView を動かすための手順です。

## 1. 必要ファイル

- `assets/js/mdview.js`
- `assets/css/default.css`（任意）
- `config.json`（任意だが推奨）
- `index.md`（表示対象）

## 2. 最小 HTML

```html
<link rel="stylesheet" href="./assets/css/default.css">
<script type="module" src="./assets/js/mdview.js"></script>

<mdview-content id="main" src="./index.md"></mdview-content>
```

## 3. config.json を使う

`mdview.js` はデフォルトで `config.json` を読みます。

```json
{
  "spa": true,
  "frontmatter": true,
  "link_target": "main",
  "link_resolution": "relative",
  "allow_parent": true,
  "query_path_mode": "split"
}
```

## 4. 動作確認

- ブラウザで `index.html` を開く
- `index.md` のリンク遷移が SPA で動くか確認
- 存在しない md で `404.md` 表示を確認（任意）

## 5. よく使う次の設定

- `data-allowed-dirs="notes,logs"`
- `data-allowed-files="index.md,404.md"`
- `data-plugins="toc,highlight,math,chart"`

詳細は `configuration.md` を参照。
