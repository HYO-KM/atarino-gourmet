type Props = {
  totalCount: number;      // 検索結果の全件数
  currentPage: number;     // 現在のページ番号
  onPageChange: (page: number) => void; // ページが押された時に実行する関数
};

export const Pagination = ({ totalCount, currentPage, onPageChange }: Props) => {
  const PER_PAGE = 20; // 1ページあたりの件数（APIの仕様と合わせる）
  
  // 総ページ数を計算
  const maxPage = Math.ceil(totalCount / PER_PAGE);

  // ページ数が1以下なら表示しない
  if (maxPage <= 1) return null;

  // 表示するページ番号のリストを作成（現在のページの前後2ページずつ、最大5ページ表示）
  let pages = [];
  const startPage = Math.max(1, currentPage - 2);     // 今のページの2つ前まで
  const endPage = Math.min(maxPage, startPage + 4);   // スタートから5つ分（ただし最大ページは超えない）
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 py-6 bg-white border-t border-gray-100">
      
      {/* 「前へ」ボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} // 1ページ目なら押せないようにする
        className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        前へ
      </button>

      {/* 数字ボタンたち */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`
            w-8 h-8 rounded-full text-sm font-bold transition-all
            ${currentPage === p 
              ? 'bg-orange-500 text-white shadow-md scale-110' // 今選ばれているページ
              : 'text-gray-500 hover:bg-orange-100 hover:text-orange-600'  // その他のページ
            }
          `}
        >
          {p}
        </button>
      ))}

      {/* 「次へ」ボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPage} // 最後のページなら押せないようにする
        className="px-3 py-1 rounded border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        次へ
      </button>

    </div>
  );
};