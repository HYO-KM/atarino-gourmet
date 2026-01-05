import { useState, useCallback } from 'react';

/**
 * 位置情報を取得するためだけのカスタムフック
 * 役割: GPSの取得中フラグ、エラー、取得処理をパッケージ化して提供する
 */
export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback((onSuccess: (lat: number, lng: number) => void) => {
    // ブラウザ対応チェック
    if (!navigator.geolocation) {
      setError('お使いのブラウザでは位置情報が使えません');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // 成功時
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess(latitude, longitude);
        setIsLocating(false);
      },
      // 失敗時
      (err) => {
        console.error('Geolocation Error:', err);
        
        let errorMessage = '位置情報の取得に失敗しました';
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = '位置情報の利用が許可されていません';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = '電波状況が悪く位置が特定できません';
            break;
          case 3: // TIMEOUT
            errorMessage = '位置情報の取得がタイムアウトしました';
            break;
        }
        
        setError(errorMessage);
        setIsLocating(false);
      },
      // オプション: タイムアウト設定など
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { isLocating, error, getLocation };
};