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

## Tech Stack

- Vite
- Three.js
- Vanilla JavaScript

## Structure

- `index.html`: Canvas を置く最小 HTML
- `src/main.js`: Three.js の初期化と描画ループ
- `src/scene/busStop.js`: バス停モデル本体
- `src/scene/controls.js`: ドラッグ操作
- `src/scene/geometry.js`: 共通ジオメトリ
- `src/scene/materials.js`: マテリアル定義
- `src/scene/textures.js`: Canvas テクスチャ生成
- `src/styles.css`: ページ全体のスタイル
