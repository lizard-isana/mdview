## Memo
別ファイルのMarkdownを読み込むんじゃなくて、HTML内に直接Markdownを書いて表示できないか？

- Web Componentsを使えばできそうな気がする
	- Web Componentsのカスタム要素内にmarkdownを記述 → 読み込み時にスクリプトが実行されてしまう
	- `&lt;script type="markdown/text"&gt;`内にmarkdownを記述 → スクリプトタグは入れ子にできない
	- `&lt;template&gt;`でいけた
- 同じページ内に複数のコンポーネントを置く
	- コンポーネントに`id`を、テンプレートに`data-target` を指定して、両者を紐づける
	- 2回目の読み込みで ScriptLoader の callback がうまく走っていないみたい
	- ScriptLoader を外に出して、callbackでコンポーネントを初期化→ OK
- 機能追加
  - Footnoteを使えるようにする → OK
  - Attributeを使えるようにする → OK
  - Task Listを使えるようにする → OK
  - Tocに対応する → OK
  - 数式（MathJax） → OK
  - グラフ(C3.js) → OK
  - チャート(Mermaid.js) → OK
- プラグインを使えるようにする
  - 数式、グラフ、チャートはプラグインに
- Skoshとの統合 → Skosh2 はこれでいいかも
  - 別ファイルのMarkdownも読み込めるようにする
  	- コンポーネントにsrcがあるかないかで、インラインとファイル読み込みを切り替える → OK
	- URLクエリでファイルを読み込む


ちなみにこのメモも外部ファイルを読み込んで表示しています。
```HTML

<markdown-viewer id="memo" src="memo.md"></markdown-viewer>

```