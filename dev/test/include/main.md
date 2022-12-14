## メインページ(main.md)

以下のリンクをクリックすると、ページ遷移せずにこの領域が切り替わります。
[サブページへのリンク(sub.md)](sub.md)

```Markdown
以下のリンクをクリックすると、ページ遷移せずにこの領域が切り替わります。
[サブページへのリンク(sub.md)](sub.md)
```

### URLクエリによるページの読み込み
SPAモードでは、URLクエリでページの読み込みを行うことができます。以下のようなURLで、`id=main`


### URL クエリでのファイル指定の制限

URL クエリでのファイル指定は、セキュリティ上のリスクを避けるため、異なるディレクトリのファイルを指定できません。

```
index.html?main=./data/index.md
```

上のように指定しても、以下の指定と同じものとして処理します。

```
index.html?main=index.md
```

### データディレクトリの指定

MDView は、`<mdview-content>`で指定されたディレクトリをデータディレクトリとみなします。つまり、以下のように別ディレクトリのファイルで初期化すると、以後、URL クエリで指定されたファイルは、`./data/`以下にあるものとみなします。

```
<mdview-content id="main" src="./data/main.md"></mdview-content>

```

上記のように初期化すると、MDView は以下の指定で`./data/sub_page.md`を表示します。

```
index.html?main=sub_page.md
```
