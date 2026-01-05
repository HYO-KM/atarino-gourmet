import type { Shop } from '../../types';

type Props = {
  shop: Shop;
  isSelected: boolean;
  onClick: (shopId: string) => void;
};

/**
 * 店舗情報カードコンポーネント
 */
export const ShopCard = ({ shop, isSelected, onClick }: Props) => {
  // 画像フォールバックロジック: PC画像(中) -> ロゴ -> ダミー画像
  const imageUrl = shop.photo.pc.m || shop.logo_image || 'https://placehold.jp/eeeeee/cccccc/150x150.png?text=No%20Image';

  return (
    <button 
      type="button"
      onClick={() => onClick(shop.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // スクロール等のデフォルト動作を防ぐ
          onClick(shop.id);
        }
      }}
      className={`
        group relative flex items-start gap-4 w-full p-4 cursor-pointer text-left
        bg-white transition-all duration-200
        /* 選択状態に応じたスタイル切り替え */
        ${isSelected 
          ? 'bg-orange-50 ring-2 ring-inset ring-orange-400 z-10'
          : 'hover:bg-gray-50'
        }
      `}
      aria-label={`${shop.name}の詳細を表示`}
      aria-current={isSelected} // スクリーンリーダーに「選択中」であることを伝えます
    >
      
      {/* 選択中の視覚的インジケータ */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-md" />
      )}

      {/* 1. Thumbnail Image */}
      <div className="shrink-0 relative">
        <img 
          src={imageUrl} 
          alt=""
          className="w-24 h-24 object-cover rounded-lg border border-gray-100 bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow" 
          loading="lazy"
        />
      </div>

      {/* 2. Content Info */}
      <div className="flex-1 min-w-0 pr-1">
        
        {/* Genre & Station */}
        <div className="flex justify-between items-start mb-1.5">
           <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-100">
             {shop.genre.name}
           </span>
           <span className="text-xs text-gray-400 ml-2 whitespace-nowrap flex items-center gap-0.5">
            最寄駅：{shop.station_name}
           </span>
        </div>
        
        {/* Shop Name */}
        <h3 className="font-bold text-gray-800 text-base leading-snug mb-1 truncate group-hover:text-orange-600 transition-colors">
          {shop.name}
        </h3>

        {/* Catch Copy */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-2 min-h-[1em]">
          {shop.catch}
        </p>

        {/* Footer Info (Time & Budget) */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
           <div className="flex items-center gap-1">
             <span className="text-gray-500 font-bold">営業時間：</span> 
             <span className="truncate max-w-30">{shop.open.split(' ')[0]}</span>
           </div>
           
           <div className="flex items-center gap-1">
             <span className="text-gray-500 font-bold">予算：</span>
             <span className="truncate">{shop.budget.name}</span>
           </div>
        </div>
      </div>

    </button>
  );
};