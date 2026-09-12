const fs = require('fs');
const path = 'c:/Users/remio/Desktop/jbu-database/src/data/jbu2042.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const newArticle = {
  id: '2042-news-injury-cloud',
  cat: 'ニュース',
  title: '【JBU2042】序盤戦から暗雲か？ 各球団で日本人主力選手が相次ぐ戦線離脱',
  excerpt: '開幕直後から各球団の日本人主力に深刻な離脱が続出。長崎・広島・福岡の強力内野陣が揃って戦線を離脱し、ペナント争いは早くも不透明に。',
  date: '2042.4.10',
  grad: 3,
  thumbnailUrl: '/images/20425.png',
  photoUrls: ['/images/20425.png', '/images/20426.png'],
  photoIds: ['20425', '20426'],
  body: [
    '2042シーズンは開幕直後から熱戦が続いているが、各球団の日本人主力選手に相次いで負傷離脱のアクシデントが発生している。ペナントレースの行方を左右しかねない事態が、日本人選手の離脱によって浮かび上がった。',
    '🔴 長崎マリンフォース：大塚遊撃手が今季絶望の危機',
    '内野の要である大塚清重（Kiyoshige Otsuka）が前十字靭帯断裂で大きな故障を負った。チーム発表では全治6ヶ月以上と診断されており、復帰まで残り50日とはいえ、今季の大半を棒に振る可能性が高い。',
    '🟡 広島セントラルレイカーズ：高木二塁手が骨折で長期離脱',
    'ア・リーグ東地区で首位を争う広島では、高木正敏（Masatoshi Takagi）が足を骨折し戦線を離脱。全治1〜2ヶ月と診断され、復帰まではあと47日。二遊間のレギュラー不在がチームに重くのしかかる。',
    '🔵 福岡ロマンチックウォリアーズ：田中二塁手も骨折、復帰まで約2ヶ月',
    '中地区の混戦を抜け出したい福岡でも、田中大（Hiroshi Tanaka）が足の骨折で戦列を離脱。全治2〜3ヶ月の見込みで、復帰まで約59日。内野の主力を欠いた戦いが続く。',
    '今季は開幕直後から各地区で接戦が続いており、主力離脱が順位争いに与える影響は小さくない。各球団は若手起用や補強によって欠損を埋める必要がある。'
  ]
};

const articles = data.articles;
if (!Array.isArray(articles)) {
  throw new Error('articles is not an array');
}
if (articles.some(a => a.id === newArticle.id)) {
  console.log('Article already exists');
  process.exit(0);
}
const idx = articles.findIndex(a => a.id === '2042-feature-tabuchi-statement');
if (idx === -1) {
  throw new Error('Reference article not found');
}
articles.splice(idx, 0, newArticle);
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Inserted', newArticle.id, 'at index', idx);
