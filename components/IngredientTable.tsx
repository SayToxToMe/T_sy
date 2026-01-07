import React from 'react';
import { Ingredient } from '../types';

interface IngredientTableProps {
  ingredients: Ingredient[];
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        Ingredients & Functions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Ingredient</th>
              <th className="px-4 py-3">Function</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ingredients.map((ing, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{ing.name} <span className="text-gray-400 font-normal text-xs ml-1">({ing.quantity})</span></td>
                <td className="px-4 py-3">{ing.function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientTable;