

import React, { useRef, useState } from 'react';
import type { Transformation } from '../types';

interface TransformationSelectorProps {
  transformations: Transformation[];
  onSelect: (transformation: Transformation) => void;
  hasPreviousResult: boolean;
  onOrderChange: (newOrder: Transformation[]) => void;
}

const TransformationSelector: React.FC<TransformationSelectorProps> = ({ transformations, onSelect, hasPreviousResult, onOrderChange }) => {
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    dragItemIndex.current = index;
    setDragging(true);
    // Use a timeout to allow the DOM to update before the browser captures the drag image
    setTimeout(() => {
      e.currentTarget.classList.add('opacity-40', 'scale-95');
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>, index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    setDragging(false);
    e.currentTarget.classList.remove('opacity-40', 'scale-95');

    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null && dragItemIndex.current !== dragOverItemIndex.current) {
      const newTransformations = [...transformations];
      const draggedItemContent = newTransformations.splice(dragItemIndex.current, 1)[0];
      newTransformations.splice(dragOverItemIndex.current, 0, draggedItemContent);
      onOrderChange(newTransformations);
    }
    
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault(); // This is crucial for drag-and-drop to work
  };

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-4 text-orange-500">让我们开始吧香蕉们！</h2>
      <p className="text-lg text-center text-gray-400 mb-8 max-w-2xl mx-auto">
        {hasPreviousResult 
          ? "刚刚的很好玩！你的上一个作品准备好了再次开始。选择一个新效果来继续吧。"
          : "准备好改变现实了吗？选择一个效果开始魔法。你可以拖拽重新排序你喜欢的效果。"
        }
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {transformations.map((trans, index) => (
          <button
            key={trans.title}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onClick={() => onSelect(trans)}
            className={`group flex flex-col items-center justify-center text-center p-4 aspect-square bg-gray-950 rounded-xl border border-white/10 hover:border-orange-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 cursor-grab active:cursor-grabbing ${dragging ? 'border-dashed' : ''}`}
          >
            <span className="text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">{trans.emoji}</span>
            <span className="font-semibold text-sm text-gray-200">{trans.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransformationSelector;