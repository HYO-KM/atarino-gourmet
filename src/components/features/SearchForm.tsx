import { useState } from 'react';
import type { SearchParams } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useGenres } from '../../hooks/useGenres';
import { useBudgets } from '../../hooks/useBudgets';

// --- Constants ---
/**
 * こだわり条件の定義リスト
 * 項目を追加・削除したい場合はここを編集するだけで自動反映されます。
 */
const ADVANCED_OPTIONS: { key: keyof SearchParams; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'private_room', label: '個室' },
  { key: 'free_drink', label: '飲み放題' },
  { key: 'free_food', label: '食べ放題' },
  { key: 'course', label: 'コース' },
  { key: 'card', label: 'カード可' },
  { key: 'non_smoking', label: '禁煙' },
  { key: 'parking', label: '駐車場' },
  { key: 'pet', label: 'ペット可' },
  { key: 'child', label: '子供連れ' },
  { key: 'lunch', label: 'ランチ' },
  { key: 'barrier_free', label: 'バリアフリー' },
  { key: 'wedding', label: 'ウェディング' },
  { key: 'horigotatsu', label: '掘りごたつ' },
  { key: 'tatami', label: '座敷' },
];

type Props = {
  initialParams: SearchParams;
  /** 検索実行時のコールバック (位置情報取得後に呼ばれる) */
  onSearch: (params: SearchParams) => void;
  /** 結果表示モード時のコンパクト表示フラグ */
  isCompact: boolean;
  onShowFavorites: () => void;
  favoriteCount: number;
};

// 検索フォームコンポーネント
export const SearchForm = ({ initialParams, onSearch, isCompact, onShowFavorites, favoriteCount }: Props) => {
  const [params, setParams] = useState<SearchParams>(initialParams);
  
  // Logic Hooks
  const { isLocating, error: locationError, getLocation } = useGeolocation();
  const { genres, loading: genreLoading } = useGenres();
  const { budgets, loading: budgetLoading } = useBudgets();

  // UI State
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  /**
   * フォーム送信時のハンドラ
   * 検索ボタンを押すたびに現在地を再取得することで、
   * 移動しながら検索するユーザーに常に最新の周辺情報を提供します。
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // GPS取得開始
    getLocation((lat, lng) => {
      // 成功時のみ実行
      const newParams = { 
        ...params, 
        lat, 
        lng 
      };
      
      setParams(newParams);
      onSearch(newParams);
    });
  };

  /**
   * 汎用的な入力変更ハンドラ
   * 個別のonChangeを書く手間を省きます
   */
  const handleInputChange = (key: keyof SearchParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`h-full flex flex-col overflow-y-auto transition-colors duration-300 ${isCompact ? 'p-4 bg-white' : 'justify-center items-center p-8 bg-orange-50'}`}>
      
      {/* Header Section */}
      <div className={`mb-6 text-center ${isCompact ? 'text-left' : ''}`}>
        <h1 className={`font-bold text-orange-600 transition-all ${isCompact ? 'text-xl' : 'text-4xl mb-2'}`}>
          あたりのグルメ
        </h1>
        {!isCompact && <p className="text-gray-600">あなたの「あたりのお店」を見つけよう</p>}
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`w-full transition-all duration-300 ${isCompact ? '' : 'max-w-md bg-white p-8 rounded-xl shadow-lg'}`}
      >
        
        {/* 1. Keyword Input */}
        <div className="mb-4">
          <label htmlFor="keyword" className="block text-sm font-bold text-gray-700 mb-1">キーワード</label>
          <input 
            id="keyword"
            type="text"
            value={params.keyword || ''} 
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder="例: 店名、料理名..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-shadow"
          />
        </div>

        {/* 2. Range & Budget Selectors */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="range" className="block text-sm font-bold text-gray-700 mb-1">範囲</label>
            <select 
              id="range"
              value={params.range}
              onChange={(e) => handleInputChange('range', Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
            >
              <option value={1}>300m</option>
              <option value={2}>500m</option>
              <option value={3}>1000m</option>
              <option value={4}>2000m</option>
              <option value={5}>3000m</option>
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-bold text-gray-700 mb-1">
              予算 {budgetLoading && <span className="text-xs font-normal text-gray-400 animate-pulse">...</span>}
            </label>
            <select 
              id="budget"
              value={params.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none disabled:bg-gray-100"
              disabled={budgetLoading}
            >
              <option value="">指定なし</option>
              {budgets.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Genre Selector */}
        <div className="mb-6">
           <label htmlFor="genre" className="block text-sm font-bold text-gray-700 mb-1">
             ジャンル {genreLoading && <span className="text-xs font-normal text-gray-400 animate-pulse">...</span>}
           </label>
            <select 
              id="genre"
              value={params.genre || ''}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none disabled:bg-gray-100"
              disabled={genreLoading}
            >
              <option value="">指定なし</option>
              {genres.map((g) => (
                <option key={g.code} value={g.code}>{g.name}</option>
              ))}
            </select>
        </div>

        {/* 4. Advanced Options (Accordion) */}
        <div className="mb-6 border rounded-lg p-3 bg-gray-50">
          <button 
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex justify-between items-center w-full text-sm font-bold text-gray-700 hover:text-orange-600 transition-colors"
            aria-expanded={isAdvancedOpen}
            aria-controls="advanced-options-grid"
          >
            <span>こだわり条件で絞り込む</span>
            <span className={`transform transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {/* 条件リスト */}
          {isAdvancedOpen && (
            <div id="advanced-options-grid" className="grid grid-cols-2 gap-2 mt-3 text-sm animate-fade-in-down">
               {ADVANCED_OPTIONS.map((option) => (
                 <label key={option.key} className="flex items-center space-x-2 cursor-pointer select-none">
                   <input 
                     type="checkbox" 
                     checked={!!params[option.key]} 
                     onChange={(e) => handleInputChange(option.key, e.target.checked)} 
                     className="rounded text-orange-500 focus:ring-orange-400 h-4 w-4" 
                   />
                   <span className="text-gray-600">{option.label}</span>
                 </label>
               ))}
            </div>
          )}
        </div>

        {/* 5. Submit Button */}
        <div className="mb-4">
          <button 
            type="submit"
            disabled={isLocating}
            className={`
              w-full py-3 text-white font-bold rounded-lg shadow-md transition-all active:scale-95
              ${isLocating 
                ? 'bg-gray-400 cursor-wait' 
                : 'bg-gray-900 hover:bg-black hover:shadow-lg'
              }
            `}
          >
            {isLocating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                位置情報を取得中...
              </span>
            ) : (
              '現在地からお店を探す'
            )}
          </button>
          
          {/* 位置情報エラー表示 */}
          {locationError && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 text-center animate-shake">
              ⚠️ {locationError}
            </div>
          )}
        </div>

        {/* 6. Favorites Button */}
        <button
          type="button"
          onClick={onShowFavorites}
          disabled={favoriteCount === 0}
          className={`
            w-full py-3 font-bold rounded-lg border-2 transition-colors flex justify-center items-center gap-2
            ${favoriteCount > 0 
              ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
            }
          `}
        >
          <span>お気に入り一覧を見る</span>
          {favoriteCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {favoriteCount}
            </span>
          )}
        </button>
      
      </form>

      <div className="mt-8 text-center text-xs text-gray-400">
        Powered by <a href="http://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:underline">ホットペッパーグルメ Webサービス</a>
      </div>
    </div>
  );
};