import { useState, useEffect } from 'react';
import type { BudgetMaster } from '../types';

// 予算マスタ取得フック
export const useBudgets = () => {
  const [budgets, setBudgets] = useState<BudgetMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // ジャンルデータ取得関数
    const fetchBudgets = async () => {
      try {
        const apiKey = import.meta.env.VITE_HOTPEPPER_API_KEY;
        if (!apiKey) {
          throw new Error('API Key is missing');
        }

        const response = await fetch(`/api/budget/v1/?key=${apiKey}&format=json`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted && data.results?.budget) {
          setBudgets(data.results.budget);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Budget fetch error:', err);
          setError('予算の取得に失敗しました');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  return { budgets, loading, error };
};