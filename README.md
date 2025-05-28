# Next.js ポケモン学習プロジェクト

React + Next.js + TypeScript を学習するための教育用プロジェクトです。ポケモンAPIを使用してランダムなモンスター表示機能を実装し、モダンなWebアプリケーション開発の基礎を学べます。

## 🎯 学習目標

- **Next.js** の基本的な使い方（ページルーティング、API Routes）
- **React Hooks** を使った状態管理（useState、useEffect）
- **TypeScript** による型安全なコーディング
- **CSS-in-JS** によるスタイリング手法
- **外部API** との連携とデータ処理
- **コンポーネント設計** と再利用性

## 🚀 クイックスタート

### 必要環境
- Node.js 18.x 以上
- npm または yarn

### インストール・実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして動作確認してください。

## 📁 プロジェクト構成

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── Layout.tsx       # 共通レイアウト（ヘッダー/フッター制御）
│   ├── Header.tsx       # ヘッダーコンポーネント
│   ├── Footer.tsx       # フッターコンポーネント
│   ├── MonsterCard.tsx  # モンスター表示カード
│   └── PlaceholderMessage.tsx # ローディング・エラー表示
├── pages/               # Next.jsページファイル
│   ├── _app.tsx         # アプリケーション全体の設定
│   ├── index.tsx        # トップページ
│   ├── monster-random-v1.tsx # ランダム表示（基本版）
│   └── monster-random-v2.tsx # ランダム表示（シンプル版）
└── styles/              # CSS関連ファイル

config/                  # 設定ファイル
├── monster_count.ts     # モンスター総数設定
└── pokemon-type-translations.ts # タイプ名翻訳マップ

data/                    # データファイル
├── pokemon/             # ポケモン基本データ（英語）
├── species/             # ポケモン種族データ（日本語名）
└── monster/             # 統合済みモンスターデータ

scripts/                 # データ準備スクリプト
├── fetch-pokemon.ts     # ポケモンデータ取得
├── fetch-species.ts     # 種族データ取得
└── build-monster.ts     # データ統合・変換
```

## 🎮 機能説明

### ページ構成

1. **トップページ** (`/`)
   - 各機能へのナビゲーション
   - シンプルなリンク集

2. **ランダム表示 v1** (`/monster-random-v1`)
   - 本格的な状態管理
   - ローディング表示
   - エラーハンドリング
   - ユーザーフレンドリーなUI

3. **ランダム表示 v2** (`/monster-random-v2`)
   - 最小限の実装
   - 学習者向けシンプル版

### コンポーネント設計

- **Layout システム**: ページごとにヘッダー/フッターの表示を制御
- **CSS-in-JS**: CSSプロパティを型安全に管理
- **再利用性**: 共通コンポーネントによるDRY原則の実践

## 🛠 データ準備

プロジェクトには事前に準備されたデータが含まれていますが、新しいデータを取得したい場合は以下のコマンドを実行してください：

```bash
# 全スクリプトの一括実行
npm run all:scripts

# 個別実行
npm run fetch:pokemon   # ポケモン基本データ取得
npm run fetch:species   # 種族データ取得
npm run build:monster   # データ統合
```

## 🎓 学習ポイント

### 1. React Hooks の活用
```typescript
const [monster, setMonster] = useState<Monster | null>(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  fetchMonster();
}, []);
```

### 2. TypeScript による型安全性
```typescript
type Monster = {
  id: number;
  name: string;
  types: string[];
  image: string;
};
```

### 3. CSS-in-JS によるスタイリング
```typescript
const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
```

### 4. 非同期処理とエラーハンドリング
```typescript
try {
  const res = await fetch("/api/random-monster");
  if (!res.ok) throw new Error(`status: ${res.status}`);
  const data = await res.json();
  setMonster(data);
} catch {
  setErrorMsg("取得に失敗しました");
}
```

## 🔧 カスタマイズ方法

### モンスター数の変更
`config/monster_count.ts` を編集：
```typescript
export const monster_count: number = 200; // お好みの数に変更
```

### スタイルの調整
各コンポーネントの `styles` オブジェクトを修正：
```typescript
const styles: Record<string, CSSProperties> = {
  // お好みのスタイルに変更
};
```

### 新しいページの追加
1. `src/pages/` に新しい `.tsx` ファイルを作成
2. Layout システムを活用してヘッダー/フッターを制御

## 📚 参考リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://react.dev)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs)
- [PokeAPI](https://pokeapi.co/) - データソース

## 🚨 注意事項

- このプロジェクトは教育目的で作成されています
- 本番環境での使用は想定していません
- PokeAPIの利用規約を遵守してください

## 🤝 改善提案

このプロジェクトをより良い学習教材にするため、以下の改善を検討中：

- [ ] コメントの充実
- [ ] より詳細な学習ガイド
- [ ] 段階的な課題の追加
- [ ] テストコードの例示

ご意見・ご提案があれば、ぜひお聞かせください！
