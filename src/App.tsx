import { useState, useRef } from 'react';
import { useShopSearch } from './hooks/useShopSearch';
import { useBookmarks } from './hooks/useBookmarks';
import { ShopList } from './components/features/ShopList';
import { SearchForm } from './components/features/SearchForm';
import { ShopDetail } from './components/features/ShopDetail';
import type { SearchParams } from './types';

function App() {
  // Logic Hooks
  const { shops, loading, error, totalCount, page, searchShops, searchByIds, goToPage } = useShopSearch();
  const { bookmarkedIds, toggleBookmark, isBookmarked } = useBookmarks();

  // Scroll Ref
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Application State
  const [params, setParams] = useState<SearchParams>({
    lat: null, 
    lng: null,
    range: 3, 
  });
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  
  /** 検索実行済みフラグ */
  const [hasSearched, setHasSearched] = useState(false);

  // Derived State
  const selectedShop = shops.find(s => s.id === selectedShopId);
  const isDetailOpen = selectedShopId !== null;

  /**
   * 画面表示判定
   */
  const showList = shops.length > 0 || loading || hasSearched;

  // Mobile View Logic
  let mobileView: 'FORM' | 'LIST' | 'DETAIL' = 'FORM';
  if (isDetailOpen) {
    mobileView = 'DETAIL';
  } else if (showList) {
    mobileView = 'LIST';
  }

  // --- Event Handlers ---
  const handleSearch = (newParams: SearchParams) => {
    setHasSearched(true);
    setParams(newParams);
    searchShops(newParams);
    setSelectedShopId(null);
  };

  const handlePageChange = (newPage: number) => {
    listContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    goToPage(newPage); 
  };
  
  const handleShowFavorites = () => {
    setHasSearched(true);
    searchByIds(bookmarkedIds);
    setSelectedShopId(null);
  };

  const handleSelectShop = (id: string) => {
    setSelectedShopId(prev => prev === id ? null : id);
  };

  // Layout Classes (Responsive Adjustment)
  const leftPanelClass = `
    bg-white shadow-xl z-20 flex-shrink-0 border-r border-gray-200 h-full
    transition-all duration-500 ease-in-out
    md:block
    /* モバイル: 条件に応じて表示/非表示 */
    ${mobileView === 'FORM' ? 'w-full block' : 'hidden'}
    
    /* PC (md〜): 詳細が開いている時は隠す */
    /* PC大画面 (xl〜): 詳細が開いていてもフォームを表示する (3カラム化) */
    ${isDetailOpen 
      ? 'md:w-0 md:opacity-0 md:overflow-hidden xl:w-[320px] xl:opacity-100 xl:overflow-visible' 
      : (showList ? 'md:w-[350px]' : 'md:w-full')
    } 
  `;

  const centerPanelClass = `
    bg-gray-50 flex-shrink-0 h-full
    transition-all duration-500 ease-in-out
    md:block
    /* モバイル */
    ${mobileView === 'LIST' ? 'w-full block' : 'hidden'}
    
    /* PC (md〜): リスト表示がない時は隠す */
    ${!showList ? 'md:w-0 md:opacity-0 md:overflow-hidden' : 'md:block'} 
    
    /* PC (md〜): 詳細が開いている時は幅固定 */
    ${isDetailOpen 
      ? 'md:w-[400px] md:border-r md:border-gray-200 xl:w-[480px]' 
      : 'md:flex-1'
    }
  `;

  const rightPanelClass = `
    bg-white flex-shrink-0 shadow-inner h-full
    transition-all duration-500 ease-in-out
    md:block
    /* モバイル */
    ${mobileView === 'DETAIL' ? 'w-full block' : 'hidden'}
    
    /* PC: 詳細が開いている時だけ表示し、余ったスペース(flex-1)を埋める */
    ${isDetailOpen ? 'md:flex-1' : 'md:w-0 md:opacity-0 md:overflow-hidden'}
  `;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      
      {/* Search Form Panel (Left) */}
      <div className={leftPanelClass}>
        <div className={isDetailOpen ? 'md:hidden xl:block h-full' : 'block h-full'}>
           <SearchForm 
            initialParams={params} 
            onSearch={handleSearch} 
            isCompact={showList}
            onShowFavorites={handleShowFavorites}
            favoriteCount={bookmarkedIds.length}
          />
        </div>
      </div>

      {/* Result List Panel (Center) */}
      <div className={centerPanelClass}>
        {showList && (
          <div 
            ref={listContainerRef} 
            className="h-full overflow-y-auto flex flex-col"
          >
             {/* List Header */}
             <div className="p-4 bg-white sticky top-0 z-10 shadow-sm flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-700">
                    {loading ? '検索中...' : `結果: ${totalCount}件`} 
                    {!loading && <span className="text-xs font-normal text-gray-500"> ({page}ページ目)</span>}
                  </h2>
                </div>
                {loading && <span className="text-sm text-orange-500 animate-pulse font-bold">更新中...</span>}
             </div>
             
             {error && <div className="p-4 m-4 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>}

             <div className="flex-1">
               <ShopList 
                 shops={shops} 
                 loading={loading} 
                 selectedShopId={selectedShopId}
                 onSelectShop={handleSelectShop} 
                 totalCount={totalCount}
                 currentPage={page}
                 onPageChange={handlePageChange}
               />
             </div>
          </div>
        )}
      </div>

      {/* Shop Detail Panel (Right) */}
      <div className={rightPanelClass}>
        {selectedShop && (
          <div className="h-full overflow-y-auto relative">
            <button 
              onClick={() => setSelectedShopId(null)}
              className="absolute top-4 left-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 px-4 transition-colors text-sm font-bold shadow-lg backdrop-blur-sm"
              aria-label="検索条件に戻る"
            >
              ← 検索条件に戻る
            </button>

            <ShopDetail 
              shop={selectedShop}
              isBookmarked={isBookmarked(selectedShop.id)}
              onToggleBookmark={() => toggleBookmark(selectedShop.id)}
             />
          </div>
        )}
      </div>

    </div>
  );
}

export default App;