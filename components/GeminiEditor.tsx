import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Upload, Wand2, Loader2, Download, Image as ImageIcon, Scan } from 'lucide-react';

export const GeminiEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.substring(selectedImage.indexOf(':') + 1, selectedImage.indexOf(';'));
      
      const result = await editImageWithGemini(base64Data, prompt, mimeType);
      
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("No image generated. Please try a different prompt.");
      }
    } catch (err) {
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Wand2 className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">IMAGE ENHANCEMENT PROTOCOL</h2>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Powered by Gemini 2.5 Vision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div 
            className={`relative h-72 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              selectedImage 
                ? 'border-indigo-500/50 bg-indigo-900/10' 
                : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Original" 
                className="h-full w-full object-contain rounded-lg p-2" 
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 group-hover:border-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                   <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-wide">Initiate Upload</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">Supports: PNG, JPG (MAX 5MB)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-600 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-600 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-600 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-600 rounded-br"></div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: 'Increase contrast', 'Detect defects'..."
              className="flex-1 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder:text-slate-600 font-mono"
            />
            <button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt || loading}
              className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wide uppercase flex items-center gap-2 transition-all ${
                !selectedImage || !prompt || loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400'
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {loading ? 'Processing' : 'Execute'}
            </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/20 text-red-400 text-xs font-mono rounded-lg border border-red-900/50 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="h-full">
          <div className="h-72 bg-slate-900/50 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {loading ? (
              <div className="text-center relative z-10">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-indigo-300 font-mono animate-pulse">ANALYZING PIXELS...</p>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full group z-10">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <a 
                    href={generatedImage} 
                    download="shakti-enhanced.png"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all border border-indigo-400/50"
                  >
                    <Download className="w-5 h-5" /> EXPORT RESULT
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-600 relative z-10">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-xs font-mono uppercase tracking-widest">Awaiting Output Data</p>
              </div>
            )}
          </div>
           <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-indigo-900/50 text-[10px] text-indigo-300 font-mono flex items-start gap-2">
            <div className="mt-0.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shrink-0"></div>
            <div>
              <strong>SYSTEM NOTE:</strong> Running <code>gemini-2.5-flash-image</code> model. Optimized for industrial defect detection and document clarity enhancement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};