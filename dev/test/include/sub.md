---
## サブページ(sub.md)

以下のリンクをクリックすると、ページ遷移せずにこの領域が切り替わります。
[メインページへのリンク(main.md)](main.md)

```Markdown
以下のリンクをクリックすると、ページ遷移せずにこの領域が切り替わります。
[メインページへのリンク(main.md)](main.md)
```

### SPA モードでのプラグインの動作

toc{.toc}

### Math
```math
二次方程式 \(ax^{2}+bx+c=0\) の解は
\[
x = \frac{-b\pm\sqrt{b^{2}-4ac}}{2a} \tag{1}
\]
です。
```

### Graph
```graph
{
    "data": {
    "columns": [
        ["data1", 30, 200, 100, 400, 150, 250],
        ["data2", 50, 20, 10, 40, 15, 25]
    ]
    }
}
```

## Chart

```chart
sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
      John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!
```