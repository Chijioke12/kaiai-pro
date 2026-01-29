
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SoftKeys from './components/SoftKeys';
import { useSpatialNav } from './hooks/useSpatialNav';
import { View, MenuItem, Message } from './types';
import { sendMessage, searchWithGrounding, generateTTS } from './services/geminiService';

/**
 * Emoji component to ensure high-quality SVG rendering on KaiOS devices.
 * Uses the Twemoji global library injected via script tag in index.html.
 */
const Emoji: React.FC<{ symbol: string; className?: string }> = ({ symbol, className }) => {
  const twemoji = (window as any).twemoji;
  if (twemoji && typeof symbol === 'string') {
    try {
      const html = twemoji.parse(symbol, {
        folder: 'svg',
        ext: '.svg'
      });
      // twemoji.parse returns a string of HTML
      return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      console.error('Twemoji parse error:', e);
    }
  }
  // Fallback to native text rendering
  return <span className={className}>{symbol}</span>;
};

const MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'AI Chat', icon: '💬', view: View.CHAT },
  { id: '2', label: 'Live Search', icon: '🔍', view: View.SEARCH },
  { id: '3', label: 'Voice Assistant', icon: '🎙️', view: View.VOICE },
  { id: '4', label: 'Settings', icon: '⚙️', view: View.SETTINGS },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Home Navigation using D-pad hook
  const { index: homeIndex } = useSpatialNav(
    MENU_ITEMS.length,
    (idx) => setCurrentView(MENU_ITEMS[idx].view),
    () => {} // Base layer: no back navigation
  );

  const handleBack = () => setCurrentView(View.HOME);

  const handleChatSubmit = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendMessage(text);
      if (response) {
        setChatMessages(prev => [...prev, { role: 'model', text: response, timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoading]);

  const renderHome = () => (
    <div className="flex flex-col h-full bg-gray-100 overflow-y-auto pt-1 pb-10">
      {MENU_ITEMS.map((item, idx) => (
        <div
          key={item.id}
          className={`mx-2 my-1 p-3 rounded-md flex items-center border transition-all ${
            homeIndex === idx ? 'kai-focused bg-white border-[#ff6b00]' : 'bg-white border-gray-200'
          }`}
        >
          <span className="text-xl mr-3 flex items-center">
            <Emoji symbol={item.icon} />
          </span>
          <span className="text-[13px] font-medium text-gray-800">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 pb-16">
        {chatMessages.length === 0 && (
          <p className="text-[11px] text-gray-400 text-center mt-4 italic">Start a conversation...</p>
        )}
        {chatMessages.map((msg, i) => (
          <div key={`${msg.timestamp}-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-2 rounded-lg text-[11px] ${
              msg.role === 'user' ? 'bg-[#ff6b00] text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-gray-400 italic px-1">KaiAI is thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="fixed bottom-8 left-0 right-0 p-2 bg-gray-50 border-t flex flex-col items-center">
         <input 
            type="text" 
            placeholder="Type query..."
            className="w-full text-[12px] border rounded px-2 py-1 focus:outline-none focus:border-[#ff6b00]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') handleChatSubmit(inputText) }}
            autoFocus
         />
      </div>
      <SoftKeys left="Send" center="SUBMIT" right="Back" />
    </div>
  );

  const renderSearch = () => (
    <div className="flex flex-col h-full bg-white p-2">
       <div className="text-[12px] font-bold mb-2">Live Web Search</div>
       <input 
          type="text" 
          placeholder="Search world..."
          className="w-full text-[12px] border rounded px-2 py-1 mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value;
              handleChatSubmit(val);
            }
          }}
          autoFocus
       />
       <div className="text-[10px] text-gray-500 italic">Powered by Google Search Grounding. Get real-time answers.</div>
       <SoftKeys right="Back" />
    </div>
  );

  const renderVoice = () => (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white p-4 text-center">
      <div className="w-16 h-16 bg-[#ff6b00] rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse icon-large">
        <Emoji symbol="🎙️" />
      </div>
      <div className="text-[14px] font-bold mb-1">Voice Assistant</div>
      <p className="text-[10px] text-gray-400">Press Select and speak. KaiAI will listen and reply with audio.</p>
      <SoftKeys center="LISTEN" right="Back" />
    </div>
  );

  const renderSettings = () => (
    <div className="p-2 bg-white h-full">
      <h2 className="text-[13px] font-bold border-b pb-1 mb-2">Settings</h2>
      <div className="space-y-3">
        <div className="text-[11px]">
          <span className="block font-bold">Model</span>
          <span className="text-gray-600">Gemini 3 Flash</span>
        </div>
        <div className="text-[11px]">
          <span className="block font-bold">Version</span>
          <span className="text-gray-600">v1.2.1-kaios</span>
        </div>
        <div className="text-[11px] text-red-600 font-bold mt-4 underline cursor-pointer">Reset Data</div>
      </div>
      <SoftKeys right="Back" />
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case View.HOME: return renderHome();
      case View.CHAT: return renderChat();
      case View.SEARCH: return renderSearch();
      case View.VOICE: return renderVoice();
      case View.SETTINGS: return renderSettings();
      default: return renderHome();
    }
  };

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (currentView !== View.HOME && (e.key === 'SoftRight' || e.key === 'F2' || e.key === 'Backspace')) {
        e.preventDefault();
        handleBack();
      }
      if (currentView === View.CHAT && (e.key === 'SoftLeft' || e.key === 'F1')) {
        handleChatSubmit(inputText);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [currentView, inputText]);

  return (
    <div className="w-[240px] h-[320px] flex flex-col select-none overflow-hidden">
      <Header title={currentView === View.HOME ? "KaiAI Pro" : currentView} />
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
      {currentView === View.HOME && <SoftKeys left="Options" center="OPEN" right="Exit" />}
    </div>
  );
};

export default App;
