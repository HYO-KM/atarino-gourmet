import { useState, useCallback } from 'react';
import type { Shop, SearchParams } from '../types';

// APIに送信する「こだわり条件」のキーリスト
// ここに追加すれば自動的にクエリ変換処理に含まれるようになります
const BOOLEAN_FLAGS: (keyof SearchParams)[] = [
  'wifi', 'wedding', 'course', 'free_drink', 'free_food', 
  'private_room', 'horigotatsu', 'tatami', 'card', 
  'non_smoking', 'parking', 'barrier_free', 'pet', 'child', 'lunch'
];

// ショップ検索用カスタムフック
export const useShopSearch = () => {
  // Data State
  const [shops, setShops] = useState<Shop[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Internal Logic State
  const [searchMode, setSearchMode] = useState<'NORMAL' | 'FAVORITE'>('NORMAL');
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [lastParams, setLastParams] = useState<SearchParams | null>(null);


  // --- Helper: クエリ組み立て ---
  const buildQueryFromParams = (params: SearchParams) => {
    const query = new URLSearchParams();
    
    // 基本パラメータ
    if (params.lat) query.append('lat', params.lat.toString());
    if (params.lng) query.append('lng', params.lng.toString());
    query.append('range', params.range.toString());
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.genre) query.append('genre', params.genre);
    if (params.budget) query.append('budget', params.budget);

    // こだわり条件
    // 値が true のものだけ '1' を送る仕様
    BOOLEAN_FLAGS.forEach((key) => {
      if (params[key]) {
        query.append(key, '1');
      }
    });

    return query;
  };

  // --- API Fetch Logic ---
  const _fetchApi = async (query: URLSearchParams, start: number) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_HOTPEPPER_API_KEY;
      if (!apiKey) throw new Error("API Key is missing");

      // 共通パラメータ
      query.append('key', apiKey);
      query.append('format', 'json');
      query.append('count', '20');
      query.append('start', start.toString());

      const response = await fetch(`/api/gourmet/v1/?${query.toString()}`);
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();

      // APIエラーハンドリング
      if (data.results?.error) {
        throw new Error(data.results.error[0]?.message || 'APIエラー');
      }

      // 結果セットの更新
      if (data.results) {
        setTotalCount(Number(data.results.results_available) || 0);
        
        // shopが1件だけの場合はオブジェクト、複数なら配列で来るAPI仕様に対応
        const shopData = data.results.shop;
        const newShops: Shop[] = Array.isArray(shopData) ? shopData : (shopData ? [shopData] : []);
        
        setShops(newShops);
      } else {
        setShops([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error('Search Error:', err);
      
      if (err.message.includes('API Key')) {
        setError('APIキーの設定に問題があります。');
      } else if (!navigator.onLine) {
        setError('ネットワーク接続を確認してください。');
      } else {
        setError(`エラーが発生しました: ${err.message || '不明なエラー'}`);
      }
      setShops([]);
    } finally {
      setLoading(false);
    }
  };


  // --- 1. 通常検索 ---
  const searchShops = useCallback(async (params: SearchParams) => {
    setSearchMode('NORMAL');
    setLastParams(params);
    setPage(1);

    const query = buildQueryFromParams(params);
    await _fetchApi(query, 1);
  }, []); // 依存配列は空でOK (内部で使う関数や変数は外から注入されていないため)


  // --- 2. ID指定検索（お気に入り用） ---
  const searchByIds = useCallback(async (ids: string[]) => {
    setSearchMode('FAVORITE');
    setTargetIds(ids); 
    setPage(1);

    if (ids.length === 0) {
      setShops([]);
      setTotalCount(0);
      return;
    }

    const query = new URLSearchParams();
    query.append('id', ids.join(','));

    await _fetchApi(query, 1);
  }, []);


  // --- 3. ページ切り替え ---
  const goToPage = useCallback(async (pageNum: number) => {
    setPage(pageNum);
    const start = (pageNum - 1) * 20 + 1;
    let query = new URLSearchParams();

    // 現在のモードに合わせてクエリを再構築
    if (searchMode === 'NORMAL' && lastParams) {
      query = buildQueryFromParams(lastParams);
    } else if (searchMode === 'FAVORITE' && targetIds.length > 0) {
      query.append('id', targetIds.join(','));
    } else {
      return; // 検索条件がない場合は何もしない
    }

    await _fetchApi(query, start);
  }, [searchMode, lastParams, targetIds]); // 状態に依存するため、これらが変わったら関数も作り直す

  // --- 4. 検索結果リセット ---
  const resetShops = useCallback(() => {
    setShops([]);
    setError(null);
    setTotalCount(0);
    setPage(1);
    setSearchMode('NORMAL');
  }, []);

  return { shops, loading, error, totalCount, page, searchShops, searchByIds, goToPage, resetShops };
};