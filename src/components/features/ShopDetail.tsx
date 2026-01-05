import type { Shop } from '../../types';

type Props = {
  shop: Shop;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

// --- Sub Components & Constants ---

/**
 * こだわり条件の表示用コンポーネント
 * 値（文字列）を解析して、○×で表現します。
 */
const CheckItem = ({ label, value }: { label: string, value?: string }) => {
  const positiveValues = ['あり', 'OK', '可', '利用可', 'いる'];
  const negativeValues = ['なし', '不可', '利用不可'];
  
  // 値が存在し、ポジティブワードを含み、かつネガティブワードを含まない場合に「○」とする
  const isYes = value && 
                !negativeValues.some(neg => value.includes(neg)) &&
                positiveValues.some(pos => value.includes(pos));
  
  return (
    <div className="flex items-center">
      <span className={`
        w-5 h-5 rounded-full mr-2 flex items-center justify-center text-[10px] font-bold shrink-0
        ${isYes ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-gray-100 text-gray-300 border border-gray-200'}
      `}>
        {isYes ? '○' : '×'}
      </span>
      <span className={isYes ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
    </div>
  );
};

// --- Main Component ---
export const ShopDetail = ({ shop, isBookmarked, onToggleBookmark }: Props) => {
  // 画像ロジック: Lサイズ -> ロゴ -> ダミー
  const imageUrl = shop.photo?.pc?.l || shop.logo_image || 'https://placehold.jp/eeeeee/cccccc/600x400.png?text=No%20Image';
  
  // Google Maps URL生成
  const mapQuery = `${shop.lat},${shop.lng}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  return (
    <div className="bg-white min-h-full pb-20">
      
      {/* 1. Image Area */}
      <div className="h-64 w-full bg-gray-200 relative group">
        <img 
          src={imageUrl} 
          alt={shop.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-20">
            {shop.genre?.name && (
              <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2">
                {shop.genre.name}
              </span>
            )}
            <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
              {shop.name}
            </h2>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={onToggleBookmark}
          className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
          aria-label={isBookmarked ? "お気に入りから削除" : "お気に入りに追加"}
        >
          {isBookmarked ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-400 drop-shadow-sm">
               <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
             </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 hover:text-yellow-400 transition-colors">
               <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.557.557 0 01-.792.576l-4.666-2.943a.563.563 0 00-.584 0l-4.666 2.943a.557.557 0 01-.792-.576l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
             </svg>
          )}
        </button>
      </div>

      {/* 2. Detail Content */}
      <div className="p-6 max-w-2xl mx-auto">
         
         {/* Catch & Memo */}
         <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-lg text-orange-700 font-bold mb-2">
              {shop.catch}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {shop.shop_detail_memo || shop.budget_memo || '美味しい料理と素敵な時間を提供します。'}
            </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
           {/* Google Map Link */}
           <a 
             href={mapUrl}
             target="_blank" 
             rel="noreferrer"
             className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
           >
             <span>ここへの案内を見る (Google Map)</span>
           </a>

           {/* Official Site Link */}
           {shop.urls?.pc ? (
             <a 
               href={shop.urls.pc}
               target="_blank" 
               rel="noreferrer"
               className="flex items-center justify-center gap-2 bg-orange-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-orange-300 transition-colors border border-gray-200"
             >
               <span>空室確認・予約</span>
             </a>
           ) : (
             <div className="flex items-center justify-center gap-2 bg-gray-50 text-gray-300 font-bold py-3 rounded-lg border border-gray-100 cursor-not-allowed">
               <span>サイトなし</span>
             </div>
           )}

           {/* Telephone Link */}
           {shop.tel ? (
             <a 
               href={`tel:${shop.tel}`}
               className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md"
             >
               <span>📞 電話をかける</span>
             </a>
           ) : (
             <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed">
               <span>📞 電話なし</span>
             </div>
           )}
        </div>

        {/* Embedded Map */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-md h-48 border border-gray-200 bg-gray-100 relative">
           <iframe
             width="100%"
             height="100%"
             style={{ border: 0 }}
             src={mapEmbedUrl}
             title="shop location map"
             loading="lazy"
           ></iframe>
           {/* オーバーレイでクリックを防止し、スクロールの邪魔にならないようにする */}
           <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-1 text-xs text-gray-500 pointer-events-none">
             Google Maps
           </div>
        </div>

        {/* Shop Info Table */}
        <h3 className="font-bold text-gray-800 text-lg mb-4 border-l-4 border-orange-500 pl-3">
          店舗情報
        </h3>

        <div className="space-y-4 text-sm text-gray-600 mb-8">
           {/* Basic Info */}
           <dl className="grid grid-cols-[100px_1fr] border-b border-gray-100 pb-2">
             <dt className="font-bold text-gray-400">住所</dt>
             <dd>{shop.address}</dd>
           </dl>
           <dl className="grid grid-cols-[100px_1fr] border-b border-gray-100 pb-2">
             <dt className="font-bold text-gray-400">最寄駅</dt>
             <dd>{shop.station_name}</dd>
           </dl>
           <dl className="grid grid-cols-[100px_1fr] border-b border-gray-100 pb-2">
             <dt className="font-bold text-gray-400">営業時間</dt>
             <dd>{shop.open}</dd>
           </dl>
           <dl className="grid grid-cols-[100px_1fr] border-b border-gray-100 pb-2">
             <dt className="font-bold text-gray-400">定休日</dt>
             <dd>{shop.close}</dd>
           </dl>
           <dl className="grid grid-cols-[100px_1fr] border-b border-gray-100 pb-2">
             <dt className="font-bold text-gray-400">平均予算</dt>
             <dd>{shop.budget?.name}</dd>
           </dl>
           
           {/* Detailed Features (Check List) */}
           <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <CheckItem label="Wi-Fi" value={shop.wifi} />
              <CheckItem label="個室" value={shop.private_room} />
              <CheckItem label="飲み放題" value={shop.free_drink} />
              <CheckItem label="食べ放題" value={shop.free_food} />
              <CheckItem label="コース" value={shop.course} /> 
              <CheckItem label="カード可" value={shop.card} />
              <CheckItem label="禁煙席" value={shop.non_smoking} />
              <CheckItem label="駐車場" value={shop.parking} />
              <CheckItem label="ペット可" value={shop.pet} />
              <CheckItem label="お子様連れ" value={shop.child} />
              <CheckItem label="ランチ" value={shop.lunch} />
              <CheckItem label="バリアフリー" value={shop.barrier_free} />
              <CheckItem label="ウェディング" value={shop.wedding} />
              <CheckItem label="掘りごたつ" value={shop.horigotatsu} />
              <CheckItem label="座敷" value={shop.tatami} />
           </div>
        </div>
      </div>
    </div>
  );
};