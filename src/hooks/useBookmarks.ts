import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'atarino_gourmet_bookmarks';

export const useBookmarks = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // 1. 初回読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setBookmarkedIds(JSON.parse(saved));
        } catch (e) {
          console.error('ブックマークの読み込みに失敗しました:', e);
        }
      }
    }
  }, []);

  // 2. お気に入り切り替え (ON/OFF)
  const toggleBookmark = useCallback((shopId: string) => {
    setBookmarkedIds((prev) => {
      const isAlreadyBookmarked = prev.includes(shopId);
      
      const newIds = isAlreadyBookmarked
        ? prev.filter((id) => id !== shopId) // 削除
        : [...prev, shopId];                 // 追加
      
      // ローカルストレージにも保存
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      }
      
      return newIds;
    });
  }, []);

  // IDがお気に入りに入っているかチェック
  const isBookmarked = useCallback((shopId: string) => {
    return bookmarkedIds.includes(shopId);
  }, [bookmarkedIds]);

  return { bookmarkedIds, toggleBookmark, isBookmarked };
};