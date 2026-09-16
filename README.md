## Demo

```bash
npm install
npm run dev
```

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

ビルド結果は `dist/` に出力されます。`dist/` は生成物のため Git 管理しません。

## Check

```bash
npm test
npm run format:check
npm run build
```

ブラウザでは、PC・スマホ幅で看板のクリック、ホバー、右下のナビと各ページの HOME を確認します。

## Tech Stack

- Vite
- Three.js
- Vanilla JavaScript

## Structure

- `index.html`: トップの見出し・ナビ・Canvas
- `src/main.js`: Three.js の初期化と描画ループ
- `src/scene/busStop.js`: バス停モデル本体
- `src/scene/controls.js`: PC・スマホのカメラ設定とポインター追従
- `src/scene/links.js`: 看板のクリック判定とホバー
- `src/scene/geometry.js`: モデルの形状生成・配置
- `src/scene/materials.js`: マテリアル定義
- `src/scene/textures.js`: 看板の文言・Canvas テクスチャ生成
- `src/styles.css`: トップのレイアウト
- `public/shared.css`: 共通フォント・見出し・リンクのスタイル
- `public/page.css`: 詳細ページのレイアウト
- `public/{projects,about,contact}.html`: 詳細ページ（そのまま `dist/` にコピー）
- `tests/`: カメラ・看板リンクの回帰テスト
