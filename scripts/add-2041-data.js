const fs = require('fs');
const path = require('path');

const standingsPath = path.join('src', 'data', 'standings.json');
const recapsPath = path.join('src', 'data', 'seasonRecaps.json');
const transactionsPath = path.join('src', 'data', 'transactions.json');

const standings = JSON.parse(fs.readFileSync(standingsPath, 'utf8'));
const recaps = JSON.parse(fs.readFileSync(recapsPath, 'utf8'));
const transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));

if (!standings.some((s) => s.year === 2041)) {
  standings.push({
    year: 2041,
    leagues: {
      "セ・リーグ": [],
      "パ・リーグ": []
    }
  });
}

recaps["2041"] = {
  title: "JBU 2041シーズン総括",
  author: "JBU編集部",
  publishedAt: "2041-11-20",
  headline: "入退団戦線が激化した2041年。新旧勢力が激突する新シーズンの展望を描く",
  sections: [
    {
      h: "シーズン展望",
      p: "2041年は大型FA補強と自由契約獲得が各球団の勢力図を大きく塗り替えた年となった。広島や流山、清澄といった上位陣が強力な戦力補強を果たし、博多や横浜もトレードやFA獲得で存在感を高めた。"
    },
    {
      h: "注目の補強と退団",
      p: "渋谷は高見、若狭、佐伯信の加入で即戦力を補強。清澄は岡部と栗山、布施を加え、博多は桐山FAと佐々木トレードで打線と投手力を強化した。甲子園世代の動きも目立ち、リーグは新旧選手のせめぎ合いが続く。"
    }
  ]
};

transactions["2041"] = [
  { date: "2041-01-10", type: "新加入", player: "高見", fromTo: "自由契約 → 渋谷アーバンスターズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "若狭", fromTo: "FA → 渋谷アーバンスターズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "佐伯信", fromTo: "FA → 渋谷アーバンスターズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "千石", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "柏崎", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "宮", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "中本", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "栗原", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "西川", fromTo: "渋谷アーバンスターズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "三堀", fromTo: "渋谷アーバンスターズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "岡部", fromTo: "自由契約 → 清澄ホワイトリバーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "栗山", fromTo: "FA → 清澄ホワイトリバーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "布施", fromTo: "FA → 清澄ホワイトリバーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "人見", fromTo: "清澄ホワイトリバーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "高見", fromTo: "清澄ホワイトリバーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "田淵", fromTo: "清澄ホワイトリバーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "キムスンヨン", fromTo: "清澄ホワイトリバーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "堂本", fromTo: "清澄ホワイトリバーズ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "吉本", fromTo: "清澄ホワイトリバーズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "山田ハリソン", fromTo: "自由契約 → 広島セントラルレイカーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "新加入", player: "千石", fromTo: "自由契約 → 広島セントラルレイカーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "新加入", player: "岩鬼", fromTo: "自由契約 → 広島セントラルレイカーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "橋本", fromTo: "FA → 広島セントラルレイカーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "大田原", fromTo: "FA → 広島セントラルレイカーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "立花", fromTo: "広島セントラルレイカーズ → FA補償", note: "FA補償で退団" },
  { date: "2041-01-10", type: "退団", player: "藤崎", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "滑川", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "沖", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "田岡", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "田代", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "ペタジーニ", fromTo: "広島セントラルレイカーズ → 自由契約", note: "自由契約で退団" },

  { date: "2041-01-10", type: "新加入", player: "キムスンヨン", fromTo: "自由契約 → 北海道レイブンクロウズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "佃", fromTo: "FA → 北海道レイブンクロウズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "鈴木ヘンリー", fromTo: "北海道レイブンクロウズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "法田", fromTo: "北海道レイブンクロウズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "布施", fromTo: "北海道レイブンクロウズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "村野", fromTo: "北海道レイブンクロウズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "鈴木", fromTo: "北海道レイブンクロウズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "三浦", fromTo: "北海道レイブンクロウズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "高埜", fromTo: "北海道レイブンクロウズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "藤江", fromTo: "自由契約 → 杜王スピリットフェニックス", note: "自由契約で入団" },
  { date: "2041-01-10", type: "退団", player: "東村山", fromTo: "杜王スピリットフェニックス → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "佐伯信", fromTo: "杜王スピリットフェニックス → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "片山", fromTo: "杜王スピリットフェニックス → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "永沼", fromTo: "杜王スピリットフェニックス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "黒羽", fromTo: "杜王スピリットフェニックス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "箭内", fromTo: "杜王スピリットフェニックス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "松戸", fromTo: "杜王スピリットフェニックス → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "小柳", fromTo: "杜王スピリットフェニックス → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "朝野", fromTo: "自由契約 → 愛知プロミネンス", note: "自由契約で入団" },
  { date: "2041-01-10", type: "退団", player: "宇尾野", fromTo: "愛知プロミネンス → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "佃", fromTo: "愛知プロミネンス → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "細川", fromTo: "愛知プロミネンス → 自由契約", note: "自由契約で退団" },

  { date: "2041-01-10", type: "新加入", player: "寺本", fromTo: "自由契約 → 京都ミリオンアッシュ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "新加入", player: "立花", fromTo: "FA補償 → 京都ミリオンアッシュ", note: "FA補償で入団" },
  { date: "2041-01-10", type: "退団", player: "橋本", fromTo: "京都ミリオンアッシュ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "大田原", fromTo: "京都ミリオンアッシュ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "舟田", fromTo: "京都ミリオンアッシュ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "堀", fromTo: "京都ミリオンアッシュ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "大堀", fromTo: "京都ミリオンアッシュ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "窪田", fromTo: "京都ミリオンアッシュ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "上松", fromTo: "自由契約 → 難波ボルテッカーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "退団", player: "平岡", fromTo: "難波ボルテッカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "本間", fromTo: "難波ボルテッカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "若狭", fromTo: "難波ボルテッカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "岩鬼", fromTo: "難波ボルテッカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "辻村", fromTo: "難波ボルテッカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "木本", fromTo: "難波ボルテッカーズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "大坪", fromTo: "自由契約 → 流山シーマリナーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "鈴木ヘンリー", fromTo: "FA → 流山シーマリナーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "青松", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "菅原", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "助川", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "柳生", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "犬伏", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "井上", fromTo: "流山シーマリナーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "間田", fromTo: "流山シーマリナーズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "村野", fromTo: "自由契約 → 福知山ネクサスナインツ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "識神", fromTo: "FA → 福知山ネクサスナインツ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "藤江", fromTo: "福知山ネクサスナインツ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "岡部", fromTo: "福知山ネクサスナインツ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "桑山", fromTo: "福知山ネクサスナインツ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "大坪", fromTo: "福知山ネクサスナインツ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "和田", fromTo: "福知山ネクサスナインツ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "植原", fromTo: "福知山ネクサスナインツ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "栗原", fromTo: "自由契約 → 梅田スラッガーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "退団", player: "稲毛", fromTo: "梅田スラッガーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "寺本", fromTo: "梅田スラッガーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "菅", fromTo: "梅田スラッガーズ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "練馬", fromTo: "梅田スラッガーズ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "押上", fromTo: "梅田スラッガーズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "柏崎", fromTo: "自由契約 → 新潟イプシロンズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "法田", fromTo: "FA → 新潟イプシロンズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "福寿", fromTo: "新潟イプシロンズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "上松", fromTo: "新潟イプシロンズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "希志", fromTo: "新潟イプシロンズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "住友", fromTo: "新潟イプシロンズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "武部", fromTo: "新潟イプシロンズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "中嶋", fromTo: "新潟イプシロンズ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "大金", fromTo: "新潟イプシロンズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "井上", fromTo: "自由契約 → 博多アクアリアス", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "桐山", fromTo: "FA → 博多アクアリアス", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "トレード", player: "佐々木", fromTo: "横浜ベイクルーザーズ → 博多アクアリアス", note: "トレードで入団" },
  { date: "2041-01-10", type: "トレード", player: "乙", fromTo: "博多アクアリアス → 横浜ベイクルーザーズ", note: "トレードで退団" },
  { date: "2041-01-10", type: "退団", player: "小田", fromTo: "博多アクアリアス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "陽木田", fromTo: "博多アクアリアス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "茅ヶ崎", fromTo: "博多アクアリアス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "山田ハリソン", fromTo: "博多アクアリアス → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "鎌田", fromTo: "博多アクアリアス → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "松野", fromTo: "博多アクアリアス → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "白童", fromTo: "博多アクアリアス → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "蒲生", fromTo: "博多アクアリアス → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "城野", fromTo: "博多アクアリアス → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "宮", fromTo: "自由契約 → 横浜ベイクルーザーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "宇尾野", fromTo: "FA → 横浜ベイクルーザーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "東村山", fromTo: "FA → 横浜ベイクルーザーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "トレード", player: "乙", fromTo: "博多アクアリアス → 横浜ベイクルーザーズ", note: "トレードで入団" },
  { date: "2041-01-10", type: "トレード", player: "佐々木", fromTo: "横浜ベイクルーザーズ → 博多アクアリアス", note: "トレードで退団" },
  { date: "2041-01-10", type: "退団", player: "片岡侑", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "松波", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "米田", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "中谷", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "大杉", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "橋元", fromTo: "横浜ベイクルーザーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "松元", fromTo: "横浜ベイクルーザーズ → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "山北", fromTo: "横浜ベイクルーザーズ → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "青松", fromTo: "自由契約 → 長崎マリンフォース", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "平岡", fromTo: "FA → 長崎マリンフォース", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "片山", fromTo: "FA → 長崎マリンフォース", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "藤原", fromTo: "長崎マリンフォース → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "正田", fromTo: "長崎マリンフォース → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "菅沼", fromTo: "長崎マリンフォース → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "飯沼", fromTo: "長崎マリンフォース → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "田邊", fromTo: "長崎マリンフォース → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "坪田", fromTo: "長崎マリンフォース → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "山添", fromTo: "長崎マリンフォース → 引退", note: "引退で退団" },
  { date: "2041-01-10", type: "引退", player: "一条", fromTo: "長崎マリンフォース → 引退", note: "引退で退団" },

  { date: "2041-01-10", type: "新加入", player: "桑山", fromTo: "自由契約 → 川崎ウィンドブレイカーズ", note: "自由契約で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "舟田", fromTo: "FA → 川崎ウィンドブレイカーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "FA移籍", player: "本間", fromTo: "FA → 川崎ウィンドブレイカーズ", note: "FA移籍で入団" },
  { date: "2041-01-10", type: "退団", player: "栗山", fromTo: "川崎ウィンドブレイカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "識神", fromTo: "川崎ウィンドブレイカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "桐山", fromTo: "川崎ウィンドブレイカーズ → FA", note: "FA移籍で退団" },
  { date: "2041-01-10", type: "退団", player: "稲葉", fromTo: "川崎ウィンドブレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "赤堀", fromTo: "川崎ウィンドブレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "退団", player: "豊田", fromTo: "川崎ウィンドブレイカーズ → 自由契約", note: "自由契約で退団" },
  { date: "2041-01-10", type: "引退", player: "新谷", fromTo: "川崎ウィンドブレイカーズ → 引退", note: "引退で退団" }
];

fs.writeFileSync(standingsPath, JSON.stringify(standings, null, 2) + '\n');
fs.writeFileSync(recapsPath, JSON.stringify(recaps, null, 2) + '\n');
fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2) + '\n');
console.log('Added 2041 season page data.');
