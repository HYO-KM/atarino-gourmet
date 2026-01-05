import type { Shop } from '../../types';
import { ShopCard } from './ShopCard';
import { Pagination } from './Pagination';

type Props = {
  shops: Shop[];                    
  loading: boolean;                 
  selectedShopId: string | null;    
  onSelectShop: (shopId: string) => void;
  totalCount: number;      
  currentPage: number;
  onPageChange: (page: number) => void;
};

// 店舗一覧コンポーネント
export const ShopList = ({ 
  shops, 
  loading, 
  selectedShopId, 
  onSelectShop,
  totalCount,
  currentPage,
  onPageChange
}: Props) => {
  
  // --- 1. Loading State ---
  // データ取得中
  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 animate-pulse">
        <div 
          className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          aria-label="読み込み中"
        ></div>
        <p className="font-bold">お店を探しています...</p>
        <p className="text-sm mt-2">少々お待ちください</p>
      </div>
    );
  }

  // --- 2. Empty State ---
  // 検索完了したが結果が0件の場合
  if (shops.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg m-4 border border-dashed border-gray-300">
        <p className="font-bold text-gray-600">条件に合うお店が見つかりませんでした</p>
        <p className="text-sm mt-2">検索範囲を広げるか、キーワードを変えてみてください。</p>
      </div>
    );
  }

  // --- 3. List Render ---
  return (
    <div className=" bg-white"> 
      <ul className="divide-y divide-gray-100">
        {shops.map((shop) => (
          <li key={shop.id}>
            <ShopCard 
              shop={shop} 
              onClick={onSelectShop}
              isSelected={shop.id === selectedShopId}
            />
          </li>
        ))}
      </ul>

      {/* Pagination Area */}
      <div className="mt-6">
        <Pagination 
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
      
    </div>
  );
};