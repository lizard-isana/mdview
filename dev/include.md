## 外部ファイル読み込み

`&lt;markdown-viewer&gt;`タグにsrc属性をつけて外部のmarkdownファイルを指定すると読み込んで展開します。
このセクションは、`include.md`に書かれている内容を読み込んで表示しています。

外部ファイルの読み込みには JavaScript の Fetch API を使用しているため、Webサーバが必要です（file://では動作しません）。
```HTML

<markdown-viewer id="include" src="include.md"></markdown-viewer>

```