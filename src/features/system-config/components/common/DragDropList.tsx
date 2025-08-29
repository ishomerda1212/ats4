// ドラッグ&ドロップリストコンポーネント

import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

interface DragDropListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  disabled?: boolean;
}

export function DragDropList<T>({ 
  items, 
  onReorder, 
  renderItem, 
  keyExtractor, 
  className = '',
  disabled = false 
}: DragDropListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleMoveUp = (index: number) => {
    if (index === 0 || disabled) return;
    
    const reorderedItems = Array.from(items);
    [reorderedItems[index], reorderedItems[index - 1]] = [reorderedItems[index - 1], reorderedItems[index]];
    onReorder(reorderedItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1 || disabled) return;
    
    const reorderedItems = Array.from(items);
    [reorderedItems[index], reorderedItems[index + 1]] = [reorderedItems[index + 1], reorderedItems[index]];
    onReorder(reorderedItems);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="bg-white border rounded-lg">
          <div className="flex items-center">
            {/* 順序変更ボタン */}
            {!disabled && (
              <div className="flex-shrink-0 px-2 py-4 space-y-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="block w-6 h-6 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="上に移動"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1}
                  className="block w-6 h-6 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="下に移動"
                >
                  ↓
                </button>
              </div>
            )}
            
            {/* アイテム内容 */}
            <div className="flex-1 py-4 pr-4">
              {renderItem(item, index)}
            </div>
          </div>
        </div>
      ))}
      
      {/* 空の状態 */}
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white border rounded-lg">
          <p>アイテムがありません</p>
          <p className="text-sm">項目を追加してください</p>
        </div>
      )}
    </div>
  );
};