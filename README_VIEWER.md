# JSON Viewer Branch (proto/viewer)

このブランチはJSON Viewerページのプロトタイプ開発専用です。

## 機能概要

### JSON Viewer ページ
- **URL**: `/jsonViewer`
- **目的**: ポケモンAPIデータをインタラクティブに表示・閲覧

### 主な機能
1. **エンドポイント選択**
   - Species (種族データ)
   - Pokemon (個体データ)
   - Forms (フォームデータ)

2. **動的ID選択**
   - メタデータから利用可能なIDを自動読み込み
   - ドロップダウンで選択可能

3. **UI機能**
   - ダーク/ライトテーマ切り替え
   - レスポンシブデザイン
   - エラーハンドリング
   - ローディング状態表示

## ファイル構成

```
src/pages/
├── jsonViewer.tsx          # メインのJSON Viewerページ
└── index.tsx              # ナビゲーションリンク追加

public/data/               # データファイル（mainから移動）
├── meta/                  # IDリストファイル
│   ├── species_ids.json
│   ├── pokemon_ids.json
│   └── form_ids.json
├── raw-species/           # 種族データ
├── raw-pokemon/           # 個体データ
└── raw-forms/            # フォームデータ

scripts/                   # データ処理スクリプト
├── monster-all/
├── monster-all-raw/
└── monster-basic/

package.json              # @uiw/react-json-view 依存関係追加
```

## 開発・運用

### 起動方法
```bash
npm run dev
```

### アクセス
- トップページ: http://localhost:3000
- JSON Viewer: http://localhost:3000/jsonViewer

### データ更新
スクリプトを使用してデータを更新：
```bash
# スクリプト実行例（具体的なコマンドはscriptsディレクトリ内を確認）
node scripts/monster-all/fetch-all.js
```

## ブランチ運用ルール

### 自律的な開発
- このブランチでは事前許可なしで開発を進めることができます
- 機能追加、バグ修正、リファクタリングを自由に実施
- コミットメッセージは明確に記載

### マージルール
- mainブランチへのマージは別途検討
- 機能が安定してからPRを作成

### 推奨する改善項目
1. **パフォーマンス最適化**
   - 大きなJSONファイルの読み込み最適化
   - 仮想化によるスクロール改善

2. **機能拡張**
   - 検索・フィルター機能
   - JSONデータの編集機能
   - エクスポート機能

3. **UI/UX改善**
   - より直感的なナビゲーション
   - キーボードショートカット
   - カスタムテーマ

## 技術スタック

- **Framework**: Next.js 15.3.2
- **UI**: React 19, TailwindCSS
- **JSON Viewer**: @uiw/react-json-view
- **Language**: TypeScript
- **Styling**: TailwindCSS 4

## 注意事項

- dataディレクトリはpublicに配置されているため、ブラウザから直接アクセス可能
- APIエンドポイントは不要（publicファイル直接アクセス）
- メタデータファイルの更新時は、スクリプトで再生成が必要
