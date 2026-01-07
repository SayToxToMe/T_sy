import React, { useState } from 'react';
import CameraUpload from './components/CameraUpload';
import AnalysisResult from './components/AnalysisResult';
import { analyzeFoodImage, generateIdealizedImage } from './services/geminiService';
import { FoodAnalysis, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<FoodAnalysis | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = async (base64Clean: string) => {
    setUserImage(`data:image/jpeg;base64,${base64Clean}`);
    setState(AppState.ANALYZING);
    setErrorMsg(null);
    setGeneratedImage(null);

    try {
      const data = await analyzeFoodImage(base64Clean);
      setAnalysisData(data);
      setState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to analyze food. Please try again with a clearer photo.");
      setState(AppState.ERROR);
    }
  };

  const handleGenerateImage = async () => {
    if (!analysisData) return;
    
    setState(AppState.GENERATING_IMAGE);
    try {
      const imgData = await generateIdealizedImage(analysisData.dishName, analysisData.description);
      setGeneratedImage(imgData);
      setState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      // Don't crash the whole app, just stay in results but maybe show toast
      setState(AppState.RESULTS);
      alert("Could not generate image at this time.");
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setAnalysisData(null);
    setUserImage(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">NutriVision<span className="text-green-600">Pro</span></span>
          </div>
          {state !== AppState.IDLE && (
            <button onClick={reset} className="text-sm font-medium text-gray-500 hover:text-green-600">
              New Scan
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {state === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="text-center mb-10">
               <h1 className="text-4xl font-extrabold text-gray-900 mb-4">What's on your plate?</h1>
               <p className="text-lg text-gray-600 max-w-xl mx-auto">
                 Instantly analyze calories, macros, and ingredients with AI. 
                 See functions, costs, and even reimagine your meal.
               </p>
             </div>
             <CameraUpload onImageSelected={handleImageSelected} />
             
             {/* Feature highlights */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
               <div className="text-center p-4">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h3 className="font-bold mb-1">Detailed Macros</h3>
                 <p className="text-sm text-gray-500">Protein, fiber, carbs, and more.</p>
               </div>
               <div className="text-center p-4">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <h3 className="font-bold mb-1">Ingredient Science</h3>
                 <p className="text-sm text-gray-500">Know what each ingredient does.</p>
               </div>
               <div className="text-center p-4">
                 <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <h3 className="font-bold mb-1">AI Visualization</h3>
                 <p className="text-sm text-gray-500">Reimagine dish with Banana Pro.</p>
               </div>
             </div>
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 animate-pulse">Analyzing Food Structure...</h2>
            <p className="text-gray-500 mt-2">Identifying ingredients and calculating nutritional density.</p>
            {userImage && (
              <div className="mt-8 rounded-lg overflow-hidden w-48 h-48 shadow-lg opacity-50 border-4 border-white">
                <img src={userImage} alt="Analyzing" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
            <p className="text-gray-600 mb-6">{errorMsg || "Something went wrong."}</p>
            <button onClick={reset} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">Try Again</button>
          </div>
        )}

        {(state === AppState.RESULTS || state === AppState.GENERATING_IMAGE) && analysisData && (
          <AnalysisResult 
            data={analysisData} 
            onGenerateImage={handleGenerateImage}
            isGeneratingImage={state === AppState.GENERATING_IMAGE}
            generatedImage={generatedImage}
          />
        )}

      </main>
    </div>
  );
};

export default App;