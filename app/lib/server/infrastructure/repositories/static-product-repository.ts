import type { Product } from "~/lib/domain/entities/product";
import type { ProductRepository } from "~/lib/domain/repositories/product-repository";
import { createProductCode } from "~/lib/domain/value-objects/product-code";

type StaticProduct = Omit<Product, "code" | "updatedAt"> & {
  code: string;
  updatedAt: string;
};

type ProductItemTemplate = {
  name: string;
  kana: string;
  tags: readonly string[];
  allergens: readonly string[];
  basePrice: number;
  packageSizes: readonly string[];
  description: string;
};

type ProductCategoryTemplate = {
  prefix: string;
  category: string;
  brands: readonly string[];
  items: readonly ProductItemTemplate[];
};

type ProductRegion = {
  name: string;
  kana: string;
  tag: string;
  priceAdjustment: number;
};

type ProductModifier = {
  name: string;
  kana: string;
  tags: readonly string[];
  description: string;
  priceAdjustment: number;
};

const targetProductCount = 5000;
const productsPerCategory = 500;
const productUpdatedAt = "2026-04-30T00:00:00.000Z";

const seedProducts: StaticProduct[] = [
  {
    id: "prd-0001",
    code: "FD-DRK-001",
    name: "有機トマトジュース",
    kana: "ユウキトマトジュース",
    brand: "Green Farm",
    category: "飲料",
    tags: ["野菜", "有機", "無塩"],
    allergens: [],
    price: 298,
    packageSize: "720ml",
    description: "完熟有機トマトだけを使った、食塩不使用の濃厚ジュース。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0002",
    code: "FD-DRK-002",
    name: "国産りんごストレートジュース",
    kana: "コクサンリンゴストレートジュース",
    brand: "Aomori Select",
    category: "飲料",
    tags: ["果汁100%", "国産", "子ども向け"],
    allergens: ["りんご"],
    price: 348,
    packageSize: "1L",
    description: "青森県産りんごを搾った香りの良いストレート果汁。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0003",
    code: "FD-RCE-001",
    name: "北海道ゆめぴりか 無洗米",
    kana: "ホッカイドウユメピリカムセンマイ",
    brand: "北の米蔵",
    category: "米・穀物",
    tags: ["北海道", "無洗米", "主食"],
    allergens: [],
    price: 2480,
    packageSize: "5kg",
    description: "甘みと粘りが強い北海道産ゆめぴりかの無洗米。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0004",
    code: "FD-RCE-002",
    name: "もち麦ミックス",
    kana: "モチムギミックス",
    brand: "Daily Grain",
    category: "米・穀物",
    tags: ["食物繊維", "健康", "雑穀"],
    allergens: [],
    price: 398,
    packageSize: "300g",
    description: "白米に混ぜて炊くだけで食感が楽しい国産もち麦。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0005",
    code: "FD-NDL-001",
    name: "全粒粉スパゲッティ",
    kana: "ゼンリュウフンスパゲッティ",
    brand: "Casa Verde",
    category: "麺類",
    tags: ["パスタ", "全粒粉", "輸入"],
    allergens: ["小麦"],
    price: 238,
    packageSize: "500g",
    description: "小麦の香ばしさを感じるデュラム小麦全粒粉パスタ。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0006",
    code: "FD-NDL-002",
    name: "讃岐うどん 乾麺",
    kana: "サヌキウドンカンメン",
    brand: "瀬戸内製麺",
    category: "麺類",
    tags: ["うどん", "乾麺", "常温"],
    allergens: ["小麦"],
    price: 198,
    packageSize: "400g",
    description: "コシのある食感に仕上げた常温保存の讃岐うどん。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0007",
    code: "FD-CND-001",
    name: "減塩丸大豆しょうゆ",
    kana: "ゲンエンマルダイズショウユ",
    brand: "蔵仕込み",
    category: "調味料",
    tags: ["減塩", "和食", "大豆"],
    allergens: ["小麦", "大豆"],
    price: 328,
    packageSize: "500ml",
    description: "丸大豆の旨みを生かしながら塩分を抑えたしょうゆ。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0008",
    code: "FD-CND-002",
    name: "焙煎ごまドレッシング",
    kana: "バイセンゴマドレッシング",
    brand: "Table Plus",
    category: "調味料",
    tags: ["サラダ", "ごま", "濃厚"],
    allergens: ["卵", "小麦", "大豆", "ごま"],
    price: 278,
    packageSize: "380ml",
    description: "焙煎ごまの香りとコクが野菜に合う定番ドレッシング。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0009",
    code: "FD-FRZ-001",
    name: "冷凍ブロッコリー",
    kana: "レイトウブロッコリー",
    brand: "Quick Veg",
    category: "冷凍食品",
    tags: ["野菜", "冷凍", "時短"],
    allergens: [],
    price: 258,
    packageSize: "300g",
    description: "下ゆで済みで弁当や付け合わせに使いやすい冷凍野菜。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0010",
    code: "FD-FRZ-002",
    name: "北海道コーン",
    kana: "ホッカイドウコーン",
    brand: "Quick Veg",
    category: "冷凍食品",
    tags: ["北海道", "野菜", "冷凍"],
    allergens: [],
    price: 228,
    packageSize: "250g",
    description: "甘みのある北海道産とうもろこしを急速冷凍。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0011",
    code: "FD-DRY-001",
    name: "素焼きアーモンド",
    kana: "スヤキアーモンド",
    brand: "Nutri Snack",
    category: "菓子・ナッツ",
    tags: ["ナッツ", "無塩", "おやつ"],
    allergens: ["アーモンド"],
    price: 498,
    packageSize: "180g",
    description: "油と塩を使わず香ばしくローストしたアーモンド。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0012",
    code: "FD-DRY-002",
    name: "ドライマンゴー",
    kana: "ドライマンゴー",
    brand: "Tropical Days",
    category: "菓子・ナッツ",
    tags: ["果物", "ドライフルーツ", "おやつ"],
    allergens: [],
    price: 398,
    packageSize: "120g",
    description: "マンゴーの甘みを凝縮したしっとり食感のドライフルーツ。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0013",
    code: "FD-CAN-001",
    name: "国産さば水煮缶",
    kana: "コクサンサバミズニカン",
    brand: "Blue Ocean",
    category: "缶詰",
    tags: ["魚", "たんぱく質", "常温"],
    allergens: ["さば"],
    price: 248,
    packageSize: "190g",
    description: "国産さばを塩だけで仕上げた料理にも使いやすい水煮缶。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0014",
    code: "FD-CAN-002",
    name: "ツナフレーク オイル無添加",
    kana: "ツナフレークオイルムテンカ",
    brand: "Blue Ocean",
    category: "缶詰",
    tags: ["まぐろ", "ノンオイル", "サラダ"],
    allergens: [],
    price: 168,
    packageSize: "70g",
    description: "サラダやおにぎりに使いやすい、油を加えないツナフレーク。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0015",
    code: "FD-DAI-001",
    name: "成分無調整牛乳",
    kana: "セイブンムチョウセイギュウニュウ",
    brand: "牧場の朝",
    category: "乳製品",
    tags: ["牛乳", "冷蔵", "朝食"],
    allergens: ["乳"],
    price: 238,
    packageSize: "1L",
    description: "生乳100%のすっきり飲みやすい成分無調整牛乳。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0016",
    code: "FD-DAI-002",
    name: "プレーンヨーグルト",
    kana: "プレーンヨーグルト",
    brand: "牧場の朝",
    category: "乳製品",
    tags: ["ヨーグルト", "無糖", "発酵"],
    allergens: ["乳"],
    price: 198,
    packageSize: "400g",
    description: "料理にも使いやすい砂糖不使用のプレーンヨーグルト。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0017",
    code: "FD-BRD-001",
    name: "米粉ロールパン",
    kana: "コメコロールパン",
    brand: "Bake House",
    category: "パン",
    tags: ["米粉", "朝食", "冷凍可"],
    allergens: ["乳"],
    price: 298,
    packageSize: "6個",
    description: "もっちり食感の米粉入りロールパン。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0018",
    code: "FD-BRD-002",
    name: "ライ麦ブレッド",
    kana: "ライムギブレッド",
    brand: "Bake House",
    category: "パン",
    tags: ["ライ麦", "食物繊維", "サンドイッチ"],
    allergens: ["小麦", "乳"],
    price: 328,
    packageSize: "1本",
    description: "ライ麦の酸味と香りを楽しめる食事パン。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0019",
    code: "FD-RTD-001",
    name: "バターチキンカレー",
    kana: "バターチキンカレー",
    brand: "Deli Kitchen",
    category: "レトルト",
    tags: ["カレー", "レトルト", "電子レンジ"],
    allergens: ["乳", "小麦", "鶏肉"],
    price: 298,
    packageSize: "180g",
    description: "トマトとバターのコクを生かしたまろやかなレトルトカレー。",
    updatedAt: productUpdatedAt,
  },
  {
    id: "prd-0020",
    code: "FD-RTD-002",
    name: "野菜たっぷりミネストローネ",
    kana: "ヤサイタップリミネストローネ",
    brand: "Deli Kitchen",
    category: "レトルト",
    tags: ["スープ", "野菜", "温めるだけ"],
    allergens: ["大豆"],
    price: 268,
    packageSize: "200g",
    description: "豆と野菜を煮込んだ具だくさんの常温スープ。",
    updatedAt: productUpdatedAt,
  },
];

const regions: ProductRegion[] = [
  { name: "北海道産", kana: "ホッカイドウサン", tag: "北海道", priceAdjustment: 90 },
  { name: "東北産", kana: "トウホクサン", tag: "東北", priceAdjustment: 60 },
  { name: "信州産", kana: "シンシュウサン", tag: "信州", priceAdjustment: 70 },
  { name: "静岡県産", kana: "シズオカケンサン", tag: "静岡", priceAdjustment: 55 },
  { name: "瀬戸内産", kana: "セトウチサン", tag: "瀬戸内", priceAdjustment: 65 },
  { name: "九州産", kana: "キュウシュウサン", tag: "九州", priceAdjustment: 75 },
  { name: "沖縄県産", kana: "オキナワケンサン", tag: "沖縄", priceAdjustment: 85 },
  { name: "国産", kana: "コクサン", tag: "国産", priceAdjustment: 50 },
  { name: "直輸入", kana: "チョクユニュウ", tag: "輸入", priceAdjustment: 40 },
  { name: "契約農家の", kana: "ケイヤクノウカノ", tag: "契約農家", priceAdjustment: 100 },
];

const modifiers: ProductModifier[] = [
  {
    name: "有機",
    kana: "ユウキ",
    tags: ["有機", "オーガニック"],
    description: "有機原料を使った",
    priceAdjustment: 120,
  },
  {
    name: "減塩",
    kana: "ゲンエン",
    tags: ["減塩", "健康"],
    description: "塩分を抑えた",
    priceAdjustment: 40,
  },
  {
    name: "無添加",
    kana: "ムテンカ",
    tags: ["無添加", "素材重視"],
    description: "余計な添加物を使わない",
    priceAdjustment: 80,
  },
  {
    name: "徳用",
    kana: "トクヨウ",
    tags: ["徳用", "まとめ買い"],
    description: "毎日使いやすい徳用タイプの",
    priceAdjustment: 160,
  },
  {
    name: "プレミアム",
    kana: "プレミアム",
    tags: ["プレミアム", "ギフト"],
    description: "ギフトにも使える上質な",
    priceAdjustment: 240,
  },
  {
    name: "食べきり",
    kana: "タベキリ",
    tags: ["食べきり", "個食"],
    description: "少人数でも使い切りやすい",
    priceAdjustment: 20,
  },
  {
    name: "業務用",
    kana: "ギョウムヨウ",
    tags: ["業務用", "大容量"],
    description: "バックヤードでも扱いやすい業務用の",
    priceAdjustment: 300,
  },
  {
    name: "季節限定",
    kana: "キセツゲンテイ",
    tags: ["季節限定", "限定"],
    description: "旬の味わいを生かした季節限定の",
    priceAdjustment: 140,
  },
];

const categoryTemplates: ProductCategoryTemplate[] = [
  {
    prefix: "DRK",
    category: "飲料",
    brands: ["Green Farm", "Aomori Select", "Morning Cup", "Fruit Works"],
    items: [
      {
        name: "トマトジュース",
        kana: "トマトジュース",
        tags: ["野菜", "ジュース", "無塩"],
        allergens: [],
        basePrice: 280,
        packageSizes: ["200ml", "720ml", "900ml", "1L"],
        description: "野菜の甘みをそのまま味わえる濃厚ジュース。",
      },
      {
        name: "りんごジュース",
        kana: "リンゴジュース",
        tags: ["果汁100%", "ジュース", "子ども向け"],
        allergens: ["りんご"],
        basePrice: 320,
        packageSizes: ["200ml", "500ml", "1L"],
        description: "香りの良いりんごを搾ったストレート果汁。",
      },
      {
        name: "緑茶",
        kana: "リョクチャ",
        tags: ["お茶", "常温", "無糖"],
        allergens: [],
        basePrice: 148,
        packageSizes: ["500ml", "600ml", "2L"],
        description: "すっきりした渋みの食事に合う緑茶。",
      },
      {
        name: "カフェオレ",
        kana: "カフェオレ",
        tags: ["コーヒー", "冷蔵", "朝食"],
        allergens: ["乳"],
        basePrice: 188,
        packageSizes: ["200ml", "500ml", "1L"],
        description: "ミルクのコクを感じるまろやかなカフェオレ。",
      },
    ],
  },
  {
    prefix: "RCE",
    category: "米・穀物",
    brands: ["北の米蔵", "Daily Grain", "Rice Terrace", "Harvest Mill"],
    items: [
      {
        name: "こしひかり 無洗米",
        kana: "コシヒカリムセンマイ",
        tags: ["米", "無洗米", "主食"],
        allergens: [],
        basePrice: 2280,
        packageSizes: ["2kg", "5kg", "10kg"],
        description: "炊き上がりのつやと甘みが楽しめる無洗米。",
      },
      {
        name: "もち麦ミックス",
        kana: "モチムギミックス",
        tags: ["食物繊維", "健康", "雑穀"],
        allergens: [],
        basePrice: 390,
        packageSizes: ["300g", "600g", "1kg"],
        description: "白米に混ぜて炊くだけで食感が楽しい雑穀。",
      },
      {
        name: "発芽玄米",
        kana: "ハツガゲンマイ",
        tags: ["玄米", "健康", "主食"],
        allergens: [],
        basePrice: 780,
        packageSizes: ["1kg", "2kg", "5kg"],
        description: "食べやすく加工した香ばしい発芽玄米。",
      },
      {
        name: "オートミール",
        kana: "オートミール",
        tags: ["朝食", "食物繊維", "シリアル"],
        allergens: [],
        basePrice: 360,
        packageSizes: ["300g", "800g", "1.2kg"],
        description: "朝食や製菓に使いやすいロールドオーツ。",
      },
    ],
  },
  {
    prefix: "NDL",
    category: "麺類",
    brands: ["Casa Verde", "瀬戸内製麺", "Noodle Lab", "麦の工房"],
    items: [
      {
        name: "スパゲッティ",
        kana: "スパゲッティ",
        tags: ["パスタ", "常温", "輸入"],
        allergens: ["小麦"],
        basePrice: 220,
        packageSizes: ["300g", "500g", "1kg"],
        description: "ソースに絡みやすいデュラム小麦のパスタ。",
      },
      {
        name: "讃岐うどん",
        kana: "サヌキウドン",
        tags: ["うどん", "乾麺", "常温"],
        allergens: ["小麦"],
        basePrice: 180,
        packageSizes: ["250g", "400g", "800g"],
        description: "コシのある食感に仕上げた定番のうどん。",
      },
      {
        name: "中華麺",
        kana: "チュウカメン",
        tags: ["ラーメン", "冷蔵", "時短"],
        allergens: ["小麦", "卵"],
        basePrice: 210,
        packageSizes: ["2食", "3食", "5食"],
        description: "スープや炒め麺に使いやすい中華麺。",
      },
      {
        name: "十割そば",
        kana: "ジュウワリソバ",
        tags: ["そば", "乾麺", "和食"],
        allergens: ["そば"],
        basePrice: 360,
        packageSizes: ["200g", "400g", "600g"],
        description: "そばの香りを楽しめる乾麺タイプ。",
      },
    ],
  },
  {
    prefix: "CND",
    category: "調味料",
    brands: ["蔵仕込み", "Table Plus", "Kitchen Base", "Umami Works"],
    items: [
      {
        name: "丸大豆しょうゆ",
        kana: "マルダイズショウユ",
        tags: ["しょうゆ", "和食", "大豆"],
        allergens: ["小麦", "大豆"],
        basePrice: 320,
        packageSizes: ["300ml", "500ml", "1L"],
        description: "丸大豆の旨みを生かした香りの良いしょうゆ。",
      },
      {
        name: "ごまドレッシング",
        kana: "ゴマドレッシング",
        tags: ["サラダ", "ごま", "濃厚"],
        allergens: ["卵", "小麦", "大豆", "ごま"],
        basePrice: 270,
        packageSizes: ["200ml", "380ml", "1L"],
        description: "焙煎ごまの香りとコクが野菜に合うドレッシング。",
      },
      {
        name: "合わせ味噌",
        kana: "アワセミソ",
        tags: ["味噌", "和食", "発酵"],
        allergens: ["大豆"],
        basePrice: 420,
        packageSizes: ["500g", "750g", "1kg"],
        description: "毎日の味噌汁に使いやすい合わせ味噌。",
      },
      {
        name: "オリーブオイル",
        kana: "オリーブオイル",
        tags: ["油", "洋食", "サラダ"],
        allergens: [],
        basePrice: 680,
        packageSizes: ["250ml", "500ml", "1L"],
        description: "炒め物やサラダに使いやすいオリーブオイル。",
      },
    ],
  },
  {
    prefix: "FRZ",
    category: "冷凍食品",
    brands: ["Quick Veg", "Frozen Deli", "Freezer Stock", "北国冷食"],
    items: [
      {
        name: "ブロッコリー",
        kana: "ブロッコリー",
        tags: ["野菜", "冷凍", "時短"],
        allergens: [],
        basePrice: 250,
        packageSizes: ["200g", "300g", "500g"],
        description: "下ゆで済みで付け合わせに使いやすい冷凍野菜。",
      },
      {
        name: "コーン",
        kana: "コーン",
        tags: ["野菜", "冷凍", "弁当"],
        allergens: [],
        basePrice: 220,
        packageSizes: ["250g", "500g", "1kg"],
        description: "甘みのあるとうもろこしを急速冷凍。",
      },
      {
        name: "餃子",
        kana: "ギョウザ",
        tags: ["惣菜", "冷凍", "フライパン"],
        allergens: ["小麦", "大豆", "豚肉", "ごま"],
        basePrice: 360,
        packageSizes: ["12個", "24個", "50個"],
        description: "焼くだけで食卓に出せる冷凍餃子。",
      },
      {
        name: "からあげ",
        kana: "カラアゲ",
        tags: ["惣菜", "冷凍", "弁当"],
        allergens: ["小麦", "大豆", "鶏肉"],
        basePrice: 430,
        packageSizes: ["300g", "500g", "1kg"],
        description: "弁当にも使いやすいジューシーな冷凍からあげ。",
      },
    ],
  },
  {
    prefix: "DRY",
    category: "菓子・ナッツ",
    brands: ["Nutri Snack", "Tropical Days", "Snack Pantry", "Sweet Field"],
    items: [
      {
        name: "素焼きアーモンド",
        kana: "スヤキアーモンド",
        tags: ["ナッツ", "無塩", "おやつ"],
        allergens: ["アーモンド"],
        basePrice: 490,
        packageSizes: ["80g", "180g", "500g"],
        description: "油と塩を使わず香ばしくローストしたアーモンド。",
      },
      {
        name: "ドライマンゴー",
        kana: "ドライマンゴー",
        tags: ["果物", "ドライフルーツ", "おやつ"],
        allergens: [],
        basePrice: 390,
        packageSizes: ["60g", "120g", "300g"],
        description: "マンゴーの甘みを凝縮したドライフルーツ。",
      },
      {
        name: "ミックスナッツ",
        kana: "ミックスナッツ",
        tags: ["ナッツ", "おやつ", "たんぱく質"],
        allergens: ["アーモンド", "カシューナッツ", "くるみ"],
        basePrice: 540,
        packageSizes: ["100g", "250g", "600g"],
        description: "複数のナッツをバランスよく合わせたミックス。",
      },
      {
        name: "玄米せんべい",
        kana: "ゲンマイセンベイ",
        tags: ["米菓", "和菓子", "常温"],
        allergens: ["大豆"],
        basePrice: 260,
        packageSizes: ["8枚", "16枚", "32枚"],
        description: "玄米の香ばしさを楽しめる軽い食感のせんべい。",
      },
    ],
  },
  {
    prefix: "CAN",
    category: "缶詰",
    brands: ["Blue Ocean", "Pantry Stock", "Sea Kitchen", "Daily Can"],
    items: [
      {
        name: "さば水煮缶",
        kana: "サバミズニカン",
        tags: ["魚", "たんぱく質", "常温"],
        allergens: ["さば"],
        basePrice: 240,
        packageSizes: ["150g", "190g", "300g"],
        description: "料理にも使いやすいシンプルな水煮缶。",
      },
      {
        name: "ツナフレーク",
        kana: "ツナフレーク",
        tags: ["まぐろ", "サラダ", "常温"],
        allergens: [],
        basePrice: 160,
        packageSizes: ["70g", "140g", "560g"],
        description: "サラダやおにぎりに使いやすいツナフレーク。",
      },
      {
        name: "コーン缶",
        kana: "コーンカン",
        tags: ["野菜", "常温", "サラダ"],
        allergens: [],
        basePrice: 130,
        packageSizes: ["120g", "190g", "430g"],
        description: "スープやサラダに使える粒コーン缶。",
      },
      {
        name: "ミックスビーンズ缶",
        kana: "ミックスビーンズカン",
        tags: ["豆", "常温", "サラダ"],
        allergens: ["大豆"],
        basePrice: 180,
        packageSizes: ["110g", "200g", "400g"],
        description: "複数の豆を合わせたサラダ向け缶詰。",
      },
    ],
  },
  {
    prefix: "DAI",
    category: "乳製品",
    brands: ["牧場の朝", "Dairy Terrace", "Milk Craft", "北の乳業"],
    items: [
      {
        name: "成分無調整牛乳",
        kana: "セイブンムチョウセイギュウニュウ",
        tags: ["牛乳", "冷蔵", "朝食"],
        allergens: ["乳"],
        basePrice: 230,
        packageSizes: ["500ml", "1L"],
        description: "生乳100%のすっきり飲みやすい牛乳。",
      },
      {
        name: "プレーンヨーグルト",
        kana: "プレーンヨーグルト",
        tags: ["ヨーグルト", "無糖", "発酵"],
        allergens: ["乳"],
        basePrice: 190,
        packageSizes: ["100g", "400g", "1kg"],
        description: "料理にも使いやすい砂糖不使用のヨーグルト。",
      },
      {
        name: "スライスチーズ",
        kana: "スライスチーズ",
        tags: ["チーズ", "冷蔵", "朝食"],
        allergens: ["乳"],
        basePrice: 280,
        packageSizes: ["7枚", "14枚", "30枚"],
        description: "トーストやサンドイッチに使いやすいチーズ。",
      },
      {
        name: "飲むヨーグルト",
        kana: "ノムヨーグルト",
        tags: ["ヨーグルト", "飲料", "発酵"],
        allergens: ["乳"],
        basePrice: 210,
        packageSizes: ["180ml", "500ml", "900ml"],
        description: "朝食や間食に飲みやすい発酵乳飲料。",
      },
    ],
  },
  {
    prefix: "BRD",
    category: "パン",
    brands: ["Bake House", "麦の香り", "Daily Bread", "Morning Bakery"],
    items: [
      {
        name: "ロールパン",
        kana: "ロールパン",
        tags: ["パン", "朝食", "冷凍可"],
        allergens: ["小麦", "乳"],
        basePrice: 280,
        packageSizes: ["4個", "6個", "12個"],
        description: "朝食や軽食に使いやすいロールパン。",
      },
      {
        name: "ライ麦ブレッド",
        kana: "ライムギブレッド",
        tags: ["ライ麦", "食物繊維", "サンドイッチ"],
        allergens: ["小麦", "乳"],
        basePrice: 320,
        packageSizes: ["1本", "6枚", "12枚"],
        description: "ライ麦の酸味と香りを楽しめる食事パン。",
      },
      {
        name: "食パン",
        kana: "ショクパン",
        tags: ["パン", "朝食", "トースト"],
        allergens: ["小麦", "乳"],
        basePrice: 250,
        packageSizes: ["5枚", "6枚", "8枚"],
        description: "トーストに合うしっとりした食パン。",
      },
      {
        name: "ベーグル",
        kana: "ベーグル",
        tags: ["パン", "朝食", "サンドイッチ"],
        allergens: ["小麦"],
        basePrice: 300,
        packageSizes: ["2個", "4個", "8個"],
        description: "もっちり食感で食べ応えのあるベーグル。",
      },
    ],
  },
  {
    prefix: "RTD",
    category: "レトルト",
    brands: ["Deli Kitchen", "Ready Table", "Soup Stand", "Quick Meal"],
    items: [
      {
        name: "バターチキンカレー",
        kana: "バターチキンカレー",
        tags: ["カレー", "レトルト", "電子レンジ"],
        allergens: ["乳", "小麦", "鶏肉"],
        basePrice: 290,
        packageSizes: ["180g", "360g", "1kg"],
        description: "トマトとバターのコクを生かしたカレー。",
      },
      {
        name: "ミネストローネ",
        kana: "ミネストローネ",
        tags: ["スープ", "野菜", "温めるだけ"],
        allergens: ["大豆"],
        basePrice: 260,
        packageSizes: ["160g", "200g", "500g"],
        description: "豆と野菜を煮込んだ具だくさんスープ。",
      },
      {
        name: "親子丼の具",
        kana: "オヤコドンノグ",
        tags: ["どんぶり", "レトルト", "和食"],
        allergens: ["卵", "小麦", "大豆", "鶏肉"],
        basePrice: 280,
        packageSizes: ["150g", "300g", "900g"],
        description: "ごはんにかけるだけで食べられる親子丼の具。",
      },
      {
        name: "麻婆豆腐の素",
        kana: "マーボードウフノモト",
        tags: ["中華", "レトルト", "時短"],
        allergens: ["小麦", "大豆", "豚肉", "ごま"],
        basePrice: 240,
        packageSizes: ["2人前", "4人前", "10人前"],
        description: "豆腐と合わせるだけで作れる中華惣菜の素。",
      },
    ],
  },
];

const products = buildProducts();

export class StaticProductRepository implements ProductRepository {
  async listProducts(): Promise<Product[]> {
    return products
      .map((product) => ({
        ...product,
        code: createProductCode(product.code),
        tags: [...product.tags],
        allergens: [...product.allergens],
        updatedAt: new Date(product.updatedAt),
      }))
      .sort((left, right) =>
        left.category.localeCompare(right.category, "ja") ||
        left.name.localeCompare(right.name, "ja") ||
        left.code.localeCompare(right.code, "ja"),
      );
  }
}

function buildProducts(): StaticProduct[] {
  const generatedProducts = [...seedProducts];
  let nextId = seedProducts.length + 1;

  for (const template of categoryTemplates) {
    for (let sequence = 3; sequence <= productsPerCategory; sequence += 1) {
      generatedProducts.push(createGeneratedProduct(template, sequence, nextId));
      nextId += 1;
    }
  }

  if (generatedProducts.length !== targetProductCount) {
    throw new Error(
      `Expected ${targetProductCount} products, but generated ${generatedProducts.length}.`,
    );
  }

  return generatedProducts;
}

function createGeneratedProduct(
  template: ProductCategoryTemplate,
  sequence: number,
  productNumber: number,
): StaticProduct {
  const item = template.items[(sequence - 3) % template.items.length];
  const region = regions[(sequence + template.prefix.charCodeAt(0)) % regions.length];
  const modifier = modifiers[(sequence + template.prefix.charCodeAt(2)) % modifiers.length];
  const packageSize = item.packageSizes[sequence % item.packageSizes.length];
  const brand = template.brands[sequence % template.brands.length];
  const code = `FD-${template.prefix}-${formatNumber(sequence, 3)}`;

  return {
    id: `prd-${formatNumber(productNumber, 4)}`,
    code,
    name: `${region.name}${modifier.name}${item.name}`,
    kana: `${region.kana}${modifier.kana}${item.kana}`,
    brand,
    category: template.category,
    tags: uniqueStrings([...item.tags, region.tag, ...modifier.tags]),
    allergens: [...item.allergens],
    price: item.basePrice + region.priceAdjustment + modifier.priceAdjustment + (sequence % 7) * 20,
    packageSize,
    description: `${region.name}${item.description}${modifier.description}${packageSize}の商品マスタデモデータです。`,
    updatedAt: productUpdatedAt,
  };
}

function formatNumber(value: number, length: number): string {
  return value.toString().padStart(length, "0");
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}
