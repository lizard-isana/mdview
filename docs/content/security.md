# Security Guide

MDView を利用する際のセキュリティ方針をまとめたガイドです。

## 1. まず決めること（運用モデル）

先に「誰が Markdown を編集できるか」を決めます。

- 信頼済み運用: 管理者や限定メンバーのみが編集できる
- 非信頼運用: 不特定多数のユーザーが投稿・編集できる

この2つで推奨設定が大きく変わります。

## 2. 非信頼運用での推奨設定

不特定多数が編集できる環境では、次を推奨します。

- `data-html="false"`
- `data-sanitize="true"`
- `data-execute-script="false"`
- `data-plugins="toc"`（必要最小限）

理由:

- 生HTMLを許可しないことでXSSの入口を減らす
- sanitizeを有効化して危険なタグ/属性を除去する
- Markdown内スクリプト実行を無効化する
- 外部依存プラグインを減らして攻撃面を縮小する

## 3. 信頼済み運用での考え方

信頼済み運用では、要件に応じて設定を緩和できます。

- `data-html="true"` や `data-execute-script="true"` は可能
- ただし誤操作や混入事故に備えて、公開環境では段階的に有効化する

最小限の防御として、HTTPヘッダーまたは`meta`でCSPを導入する選択も有効です。

## 4. CSPを使う場合の注意

CSPを厳しくすると、外部埋め込み（X/Twitter, YouTubeなど）が動かなくなる場合があります。

- `script-src` に外部スクリプト配信元を追加
- `frame-src` に埋め込み先ドメインを追加
- 影響の出るページだけ方針を分ける

## 5. 運用チェックリスト

- Markdown編集権限は最小化されているか
- `data-execute-script` を必要なページだけで有効化しているか
- `data-sanitize` を無効化している理由が明確か
- プラグインやCDN依存を定期的に見直しているか

## 6. プラグイン依存の自ホスト

MDViewの組み込みプラグインは、次のディレクトリのローカルファイルを優先して読み込みます。

- `assets/js/plugins/vendors/`

この配下に依存ファイルを配置すると、オフライン環境でも動作しやすくなります。  
不足ファイルがある場合のみCDNへフォールバックします。

## 7. 参考

- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Content Security Policy (MDN)](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP)
