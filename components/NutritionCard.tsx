import React from 'react';
import { NutritionInfo } from '../types';

interface NutritionCardProps {
  nutrition: NutritionInfo;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ nutrition }) => {
  const items = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal', color: 'bg-orange-100 text-orange-800' },
    { label: 'Protein', value: nutrition.protein, color: 'bg-blue-100 text-blue-800' },
    { label: 'Carbs', value: nutrition.carbohydrates, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Fiber', value: nutrition.fiber, color: 'bg-green-100 text-green-800' },
    { label: 'Fat', value: nutrition.fat, color: 'bg-red-100 text-red-800' },
    { label: 'Sugar', value: nutrition.sugar, color: 'bg-pink-100 text-pink-800' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Nutritional Breakdown
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className={`p-3 rounded-lg flex flex-col items-center justify-center ${item.color}`}>
            <span className="text-2xl font-bold">{item.value}<small className="text-xs ml-1 font-normal opacity-75">{item.unit || ''}</small></span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionCard;