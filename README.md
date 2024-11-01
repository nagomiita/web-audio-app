# 音楽再生アプリ仕様書

## 概要

ローカルの MP4 音楽ファイルを再生するためのシンプルな音楽再生アプリです。認証機能はなく、ユーザーはローカルサーバー上で利用する想定です。ビジュアルを重視したデザインとし、スマートフォン・タブレットでのレスポンシブ対応も行います。

---

## 機能一覧

### 1. 音楽再生機能

- **再生**
  - 選択した音楽ファイルの再生を開始。
- **一時停止**
  - 再生中の音楽を一時停止。
- **停止**
  - 再生中の音楽を完全に停止。
- **スキップ**
  - 再生リスト内で次の曲に移動。
- **シークバー**
  - 曲の再生位置を表示し、ドラッグすることで任意の位置にシーク可能。
- **音量調整**
  - スライダーで音量を調整。

### 2. 再生リスト管理

- 音楽ファイルを一覧で表示。
- プレイリスト順序変更機能（ドラッグ&ドロップなどで再生順を入れ替え可能）。
- シャッフル機能とリピート機能。

### 3. ビジュアルデザイン

- **アートワーク表示**
  - 音楽ファイルに埋め込まれているアートワークがあれば表示。
  - なければデフォルトの画像を表示。
- **モダンでビジュアル重視の UI**
  - ダークモード対応（背景が暗く、テキストやアイコンは明るい色を使用）。
  - 再生中の音楽に合わせた背景の色やアニメーションの効果を追加。

### 4. レスポンシブ対応

- **デスクトップ対応**
  - 再生リストと再生画面を横並びに表示。
- **モバイル/タブレット対応**
  - 再生リストと再生画面の切り替えをタブ形式に変更。
  - スライドインメニューなどを活用し、画面スペースを最適化。

---

## 技術仕様

### 使用技術

- **フロントエンド**: React, Next.js, TypeScript
- **オーディオ再生**: HTML5 Audio API を利用して MP4 ファイルを再生

### ファイル管理

- **ファイル形式**: MP4
- **ファイルアクセス**: ローカルストレージ内の指定ディレクトリから取得

---

## ディレクトリ構成（仮）

```plaintext
project-root/
├── public/
│   └── audio/                # 音楽ファイルが格納されるディレクトリ
├── src/
│   ├── components/
│   │   ├── PlayerControls.tsx  # 再生・一時停止・スキップ等の制御ボタン
│   │   ├── Playlist.tsx        # 再生リスト表示・管理
│   │   └── AudioVisualizer.tsx # アートワークやビジュアルエフェクト表示
│   ├── pages/
│   │   └── index.tsx           # メインページ
│   └── styles/
│       └── globals.css         # グローバルスタイル
└── package.json
```

---

## ユーザーインターフェース

1. **再生画面**

   - 中央にアートワークまたはビジュアルエフェクト表示
   - シークバー、再生・一時停止・スキップボタンを配置
   - 音量調整スライダー

2. **再生リスト画面**
   - 楽曲の一覧を表示
   - 各楽曲に対し、タイトル・アートワーク・再生時間を表示
   - 楽曲の並べ替え機能（ドラッグ&ドロップ）

---

## 今後の検討事項

- バックグラウンド再生対応（ブラウザが非アクティブな場合も音楽を再生し続ける機能）
- 再生状態の保存（次回アクセス時に再生状態を復元）
