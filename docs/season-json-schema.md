# シーズンJSON 仕様（Bプレミア）

1シーズン = 1ファイル：`src/data/seasons/<開始年>.json`
（例：2026-27シーズン → `src/data/seasons/2026.json`）

このファイルを書き換えるだけで、**順位表・プレーオフ・個人表彰・ドラフト**が
サイトに一括反映されます。AIに記録を渡して丸ごと生成・更新する運用を想定しています。

更新後は必ず検証してください：

```bash
npm run validate:season
```

---

## トップレベル

| キー | 型 | 説明 |
|---|---|---|
| `season` | number | シーズン開始年。ファイル名と一致させる（2026-27なら `2026`） |
| `league` | object | リーグ構成・規定（カンファレンス／ディビジョン／プレーオフ／指標定義） |
| `teams` | array | クラブ一覧（順位表はここの `abbr` で紐づく） |
| `standings` | object | カンファレンス別の順位表 |
| `postseason` | object | プレイイン／本戦／ファイナル／NBAカップ |
| `awards` | object | 個人表彰・スタッツタイトル・月間週間・オールスター |
| `draft` | object | 新人ドラフト／拡張ドラフト |
| `teamStats` | array | クラブ別の選手成績（任意） |
| `prospects` | array | 有望株（任意） |

---

## league

```json
{
  "name": "Bプレミア",
  "gamesPerTeam": 82,
  "regulationNote": "...",
  "conferences": [
    { "key": "East", "name": "イースタン・カンファレンス", "label": "Eastern",
      "divisions": [ { "key": "Atlantic", "name": "アトランティック" } ] }
  ],
  "playoff": {
    "berths": 8, "directBerths": 6, "playInStart": 7, "playInEnd": 10,
    "seriesFormat": "7戦4勝制", "homeCourt": "2-2-1-1-1", "note": "...",
    "rounds": [ { "key": "r1", "label": "1回戦" },
                { "key": "semis", "label": "カンファレンス準決勝" },
                { "key": "confFinals", "label": "カンファレンス決勝" } ]
  },
  "clinchMarks": [ { "key": "z", "label": "カンファレンス首位確定" } ],
  "statKeys": [ { "key": "ppg", "label": "PPG", "hint": "平均得点" } ]
}
```

- **カンファレンスやディビジョンを増減すると、順位表・クラブ一覧・ブラケットが自動で追従します。**
- `statKeys` に指標を足すと、表彰の成績表の列が自動で増えます。
- `playoff.directBerths` / `playInEnd` は順位表の「プレーオフ進出ライン」「プレイイン圏」の境界線位置になります。

## teams

```json
{ "abbr": "千葉", "name": "千葉ジェフユナイテッド",
  "conference": "East", "division": "Atlantic",
  "city": "千葉市", "coach": "花房小次郎",
  "color": "#ae3f29", "logo": "/images/articles/xxx.png" }
```

- `abbr` が全体の**キー**。順位表・ドラフト・表彰の `team` / `t` はこの値で参照します。
- `conference` / `division` は `league.conferences` のキーと一致させること。
- `color` は白文字のバッジ背景に使うため、**コントラスト比4.5:1以上の濃い色**にしてください。
- `logo` は任意。未設定なら色バッジで表示されます。

## standings

カンファレンスキーごとに、**勝率順に並べた配列**。配列の順序がそのまま順位です。

```json
"standings": {
  "East": [
    { "team": "千葉", "w": 46, "l": 16, "gb": "—",
      "conf": "", "div": "", "home": "21-8", "away": "25-8",
      "l10": "", "strk": "W2", "diff": "+10.6", "clinch": "pi" }
  ],
  "West": [ ... ]
}
```

| フィールド | 説明 |
|---|---|
| `team` | クラブ略称（`teams[].abbr`） |
| `w` / `l` | 勝 / 敗（数値） |
| `gb` | ゲーム差。首位は `"—"`、他は `"4.0"` のように小数第1位まで |
| `conf` / `div` | カンファレンス内 / ディビジョン内成績（`"25-14"` 形式、任意） |
| `home` / `away` | ホーム / ロード成績（任意） |
| `l10` | 直近10試合（`"7-3"`、任意） |
| `strk` | 連勝連敗（`"W2"` / `"L3"`、任意） |
| `diff` | 得失点差（`"+10.6"`、任意） |
| `clinch` | `z`（カンファレンス首位確定）/ `x`（プレーオフ出場決定）/ `pi`（プレイイン進出確定） |

※ 勝率は `w` / `l` から自動計算されるので入力不要です。

## postseason

```json
{
  "conferences": {
    "East": {
      "playIn": [ <series>, <series>, <series> ],
      "rounds": { "r1": [<series>...], "semis": [...], "confFinals": [...] }
    },
    "West": { ... }
  },
  "finals": { "a": "", "b": "", "as": 0, "bs": 0, "champ": "",
              "format": "7戦4勝制", "games": [], "mvp": { "p": "", "t": "" },
              "clinchNote": "", "path": [ { "r": "1回戦", "op": "", "res": "4-1" } ] },
  "cup": { "name": "NBAカップ", "champ": "", "runnerUp": "", "finalScore": "",
           "mvp": { "p": "", "t": "" }, "note": "" },
  "gallery": { "hero": [], "series": [], "recap": [] },
  "recap": { "headline": "", "body": [], "moments": [ { "k": "", "t": "", "b": "" } ] }
}
```

`playIn` は **A（7位×8位）→ B（9位×10位）→ 第2ラウンド** の順に3件。

### series の形

```json
{ "a": "千葉", "b": "大宮", "sa": 1, "sb": 8, "as": 4, "bs": 1,
  "format": "7戦4勝制",
  "games": [ { "a": 101, "b": 95 } ],
  "mvp": { "p": "", "t": "" },
  "note": "" }
```

- `a` を上位シード側に置く。`as` / `bs` は**シリーズ勝利数**（プレイインは1試合制なので得点）。
- `rounds` のキーは `league.playoff.rounds[].key` と一致させること。

## awards

各要素は **`stats` を持てます**。列と並び順は `league.statKeys` の定義に従って自動表示されます。

```json
{
  "voting": [
    { "key": "MVP", "label": "最優秀選手 (MVP)", "note": "65試合以上の出場が資格要件",
      "finalists": [
        { "p": "選手名", "t": "千葉", "line": "任意の補足文", "pts": 782, "first": 84,
          "stats": { "gp": 70, "mpg": 34.2, "ppg": 28.4, "rpg": 8.1, "apg": 6.5,
                     "spg": 1.2, "bpg": 0.8, "fg": 52.1, "fg3": 38.4, "ft": 84.0 } }
      ] }
  ],
  "allTeams": [
    { "key": "allLeague", "label": "オールBプレミア",
      "tiers": [ { "tier": "1st", "members": [ { "p": "", "pos": "", "t": "", "stats": {} } ] } ] }
  ],
  "statTitles": [
    { "key": "ppg", "label": "得点王", "unit": "PPG", "note": "58試合以上",
      "leaders": [ { "p": "", "t": "", "v": "28.4", "stats": {} } ] }
  ],
  "monthly": [ { "period": "2026-11", "conf": "East",
                 "mvp": { "p": "", "t": "" }, "rookie": { "p": "", "t": "" } } ],
  "weekly":  [ { "period": "2026-11-02", "conf": "East", "mvp": { "p": "", "t": "" } } ],
  "allStar": { "note": "", "result": "", "mvp": { "p": "", "t": "" },
               "rosters": [ { "team": "スター", "frontcourt": [], "backcourt": [] } ],
               "events": [ { "name": "ダンクコンテスト", "winner": { "p": "", "t": "" } } ] },
  "postseasonMvp": [ { "key": "finals", "label": "ファイナル MVP",
                       "p": "", "t": "", "line": "", "stats": {}, "big": true } ]
}
```

- `voting[]` の順番がそのまま表示順。`finalists` は**得票順（1位→3位）**に並べる。
- `pts` / `first` は得票ポイント / 1位票。不明なら省略可。
- `statTitles[].leaders[].v` が表に出る代表値（`unit` の単位）。

## draft

```json
{
  "name": "2027 新人ドラフト",
  "note": "...",
  "lottery": [ { "order": 1, "team": "札幌" } ],
  "picks": [
    { "round": 1, "pick": 1, "overall": 1, "team": "札幌",
      "p": "選手名", "pos": "PG", "from": "出身（大学・クラブ等）", "note": "" }
  ],
  "expansion": { "name": "2027 拡張ドラフト", "note": "...", "picks": [] }
}
```

| フィールド | 説明 |
|---|---|
| `round` | 巡（1巡目なら 1） |
| `pick` | その巡の中での指名順 |
| `overall` | 全体何位の指名か |
| `team` | 指名したクラブ略称 |
| `p` | 選手名 |
| `pos` | ポジション（任意） |
| `from` | 出身（任意） |

`lottery` は抽選で決まった**指名順**（`order` が若いほど先に指名）。

---

## 更新時の注意

1. `team` / `t` に入れる値は必ず `teams[].abbr` と一致させる（不一致は検証で検出されます）
2. `standings` は**勝率順に並べる**（並び順＝順位）
3. 未確定の項目は**空配列 `[]` / 空文字 `""` のまま**にする（`null` でも可）。空でもレイアウトは崩れません
4. 変更後は `npm run validate:season` を実行し、エラーがないことを確認する
