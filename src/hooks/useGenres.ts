import { useState, useEffect } from 'react';
import type { GenreMaster } from '../types';

// ジャンルマスタ取得フック
export const useGenres = () => {
  const [genres, setGenres] = useState<GenreMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // アンマウント後の状態更新を防ぐフラグ

    // ジャンルデータ取得関数
    const fetchGenres = async () => {
      try {
        const apiKey = import.meta.env.VITE_HOTPEPPER_API_KEY;
        if (!apiKey) {
          throw new Error('API Key is missing');
        }

        const response = await fetch(`/api/genre/v1/?key=${apiKey}&format=json`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted && data.results?.genre) {
          setGenres(data.results.genre);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Genre fetch error:', err);
          setError('ジャンルの取得に失敗しました');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGenres();

    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, []);

  return { genres, loading, error };
};