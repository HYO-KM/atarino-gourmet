/**
 *  アプリ内で使用する「店舗情報」の設計書
 */
export interface Shop {
  id: string;          // お店ID
  name: string;        // 掲載店名
  logo_image: string;  // ロゴ画像
  name_kana: string;   // 掲載店名かな
  tel: string;         // 電話番号
  address: string;     // 住所
  station_name: string;// 最寄り駅名
  lat: number;         // 緯度
  lng: number;         // 経度
  genre: {
    name: string;      // ジャンル名
  };
  budget: {
    name: string;      // 予算名
  };
  budget_memo: string; // 料金備考
  catch: string;       // お店のキャッチ
  capacity: string;    // 総席数
  access: string;      // 交通アクセス
  urls: {
    pc: string;        // PC用URL
  }
  photo: {
    pc: {
      l: string;      // 店舗トップ写真(大) 画像URL
      m: string;      // 店舗トップ写真(中) 画像URL
      s: string;      // 店舗トップ写真(小) 画像URL
    },
    mobile: {
      l: string;      // 店舗トップ写真(大) 画像URL
      s: string;      // 店舗トップ写真(小) 画像URL
    }
  }
  open: string;       // 営業時間
  close: string;      // 定休日
  wifi: string;        // WiFi有無
  wedding: string;     // ウェディング・二次会
  course: string;     // コース
  free_drink: string; // 飲み放題
  free_food: string;  // 食べ放題
  private_room: string;// 個室
  horigotatsu: string; // 掘りごたつ
  tatami: string;      // 座敷
  card: string;       // カード可否
  non_smoking: string;// 禁煙・喫煙
  parking: string;    // 駐車場有無
  barrier_free: string;// バリアフリー
  pet: string;        // ペット可否
  child: string;      // お子様連れ
  lunch: string;     // ランチ
  shop_detail_memo: string;// 備考
  coupon_urls: {
    pc: string;        // クーポンURL(PC)
    mobile: string;    // クーポンURL(モバイル)
  }
}

/**
 * 検索条件 (Search Parameters)の設計書
 * すべて任意項目(?)にしているため、未指定でも検索可能です。
 */
export interface SearchParams {
  id?: string;          // お店ID (特定店舗の詳細取得時に使用)
  keyword?: string;        // 店名かな、店名、住所、駅名、お店ジャンルキャッチ、キャッチのフリーワード検索
  lat?: number | null;     // 現在地緯度
  lng?: number | null;     // 現在地経度
  range: number;          // 検索半径 (1~5)

  // 絞り込み条件 (APIでは 0=指定なし, 1=あり)
  genre?: string;         // ジャンルコード
  budget?: string;        // 予算コード
  wifi?: boolean;         // WiFiあり
  wedding?: boolean;      // ウェディングあり
  course?: boolean;       // コースあり
  free_drink?: boolean;    // 飲み放題あり
  free_food?: boolean;     // 食べ放題あり
  private_room?: boolean;  // 個室あり
  horigotatsu?: boolean;  // 掘りごたつあり
  tatami?: boolean;       // 座敷あり
  card?: boolean;         // カード利用可
  non_smoking?: boolean;   // 禁煙席あり
  parking?: boolean;      // 駐車場あり
  barrier_free?: boolean;  // バリアフリーあり
  lunch?: boolean;        // ランチあり
  pet?: boolean;          // ペット可
  child?: boolean;        // お子様連れ歓迎
}

/**
 * ジャンルマスタの設計書
 * アプリ起動時に一括取得して、検索画面のジャンル選択肢に使用します。
 */
export interface GenreMaster {
  code: string;         // ジャンルコード
  name: string;         // ジャンル名 
}


/**
 * 予算マスタの設計書
 * アプリ起動時に一括取得して、検索画面の予算選択肢に使用します。
 */
export interface BudgetMaster {
  code: string;       // 予算コード
  name: string;       // 予算名
}
