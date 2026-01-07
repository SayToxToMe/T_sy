import React, { useState } from 'react';
import { FoodAnalysis } from '../types';
import NutritionCard from './NutritionCard';
import IngredientTable from './IngredientTable';

interface AnalysisResultProps {
  data: FoodAnalysis;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
  generatedImage: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  data, 
  onGenerateImage, 
  isGeneratingImage,
  generatedImage 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recipe'>('overview');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{data.dishName}</h1>
          <p className="opacity-90">{data.description}</p>
        </div>
        
        <div className="p-4 border-b border-gray-100 flex gap-4 overflow-x-auto">
           <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Overview & Nutrition
          </button>
           <button 
            onClick={() => setActiveTab('recipe')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'recipe' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Recipe & Receipt
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <NutritionCard nutrition={data.nutrition} />
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-2">Target Audience</h3>
               <p className="text-gray-600">{data.targetAudience}</p>
            </div>

            {/* AI Image Generation Prompt */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
               <h3 className="text-lg font-bold text-indigo-900 mb-2">Reimagine this Dish</h3>
               <p className="text-indigo-700 text-sm mb-4">Want to see a professional, idealized version of this meal using Banana Pro?</p>
               
               {!generatedImage ? (
                  <button 
                    onClick={onGenerateImage}
                    disabled={isGeneratingImage}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isGeneratingImage ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Generate AI Version
                      </>
                    )}
                  </button>
               ) : (
                 <div className="space-y-3">
                    <img src={generatedImage} alt="AI Generated" className="w-full rounded-lg shadow-md" />
                    <p className="text-xs text-center text-indigo-400 font-mono">Generated with gemini-3-pro-image-preview</p>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-6">
            <IngredientTable ingredients={data.ingredients} />
          </div>
        </div>
      )}

      {activeTab === 'recipe' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="mb-6 pb-6 border-b border-gray-100">
             <h3 className="text-xl font-bold text-gray-800 mb-2">Estimated Receipt</h3>
             <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="font-medium text-gray-600">Total Estimated Cost</span>
                <span className="text-xl font-bold text-green-700">{data.estimatedCost}</span>
             </div>
             <p className="text-xs text-gray-400 mt-2">*Cost estimates are approximate based on average ingredient prices.</p>
           </div>

           <h3 className="text-xl font-bold text-gray-800 mb-4">Preparation Guide</h3>
           <ul className="space-y-4">
             {data.recipeInstructions.map((step, idx) => (
               <li key={idx} className="flex gap-4">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                   {idx + 1}
                 </div>
                 <p className="text-gray-700 mt-1">{step}</p>
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;