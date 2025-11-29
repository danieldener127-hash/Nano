import React, { useState } from 'react';
import { generateImage, generateBotCode } from './services/geminiService';
import { AspectRatio, AppMode } from './types';

const App: React.FC = () => {
  // Navigation State
  const [mode, setMode] = useState<AppMode>(AppMode.IMAGE);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Bot Gen State
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);

  // --- Image Handlers ---
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsImageLoading(true);
    setImageError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImage(imagePrompt, aspectRatio);
      setGeneratedImage(base64Image);
    } catch (err: any) {
      setImageError(err.message || 'An unexpected error occurred');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `nano-banana-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  // --- Bot Handlers ---
  const handleGenerateBot = async () => {
    if (!botName.trim() || !botDescription.trim()) return;
    setIsBotLoading(true);
    setBotError(null);
    setGeneratedCode(null);

    try {
      const code = await generateBotCode(botName, botDescription);
      setGeneratedCode(code);
    } catch (err: any) {
      setBotError(err.message || 'Failed to generate code');
    } finally {
      setIsBotLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      alert("Code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-banana-400">
            <span>🍌</span> Nano Banana
          </div>
          <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setMode(AppMode.IMAGE)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === AppMode.IMAGE 
                ? 'bg-banana-500 text-slate-900 shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Image AI
            </button>
            <button
              onClick={() => setMode(AppMode.BOT)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === AppMode.BOT 
                ? 'bg-banana-500 text-slate-900 shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bot Generator
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          
          {mode === AppMode.IMAGE ? (
            /* --- IMAGE GENERATOR VIEW --- */
            <div className="space-y-8 animate-fade-in">
              <header className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Image Generator
                </h1>
                <p className="text-slate-400 text-lg">
                  Powered by Gemini 2.5 Flash Image
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-banana-200">Prompt</label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="A cyberpunk banana city..."
                      className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-banana-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-banana-200">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(AspectRatio).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => setAspectRatio(value)}
                          className={`px-2 py-2 text-xs md:text-sm rounded-lg border transition-all ${
                            aspectRatio === value
                              ? 'bg-banana-500 text-slate-900 border-banana-500 font-bold'
                              : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateImage}
                    disabled={isImageLoading || !imagePrompt.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                      isImageLoading || !imagePrompt.trim()
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-banana-400 to-banana-600 text-slate-900 hover:brightness-110'
                    }`}
                  >
                    {isImageLoading ? 'Generating...' : 'Generate Image'}
                  </button>
                  {imageError && <div className="text-red-400 text-sm">{imageError}</div>}
                </div>

                {/* Result */}
                <div className="flex flex-col h-full min-h-[400px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group">
                  {generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-checkered p-4">
                      <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button onClick={handleDownloadImage} className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                       <p>{isImageLoading ? 'Dreaming...' : 'Image will appear here'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* --- BOT GENERATOR VIEW --- */
            <div className="space-y-8 animate-fade-in">
              <header className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Telegram Bot Generator
                </h1>
                <p className="text-slate-400 text-lg">
                  Describe your bot, get Python code instantly.
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-fit">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-banana-200">Bot Name</label>
                    <input 
                      type="text"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="e.g., MySuperBot"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:ring-2 focus:ring-banana-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-banana-200">What should it do?</label>
                    <textarea
                      value={botDescription}
                      onChange={(e) => setBotDescription(e.target.value)}
                      placeholder="e.g., A bot that calculates BMI when the user sends their weight and height. It should also tell random jokes."
                      className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-banana-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateBot}
                    disabled={isBotLoading || !botName.trim() || !botDescription.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                      isBotLoading || !botName.trim()
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:brightness-110'
                    }`}
                  >
                    {isBotLoading ? 'Writing Code...' : 'Generate Bot Code'}
                  </button>
                  {botError && <div className="text-red-400 text-sm">{botError}</div>}
                </div>

                {/* Code Output */}
                <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col min-h-[500px]">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-mono">bot.py</span>
                    {generatedCode && (
                      <button onClick={copyToClipboard} className="text-xs text-banana-400 hover:text-banana-300 font-semibold uppercase tracking-wider">
                        Copy Code
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {generatedCode ? (
                      <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                        {generatedCode}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                        {isBotLoading ? (
                          <div className="animate-pulse text-blue-400">Thinking in Python...</div>
                        ) : (
                          <>
                            <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <p>Generated Python code will appear here.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;