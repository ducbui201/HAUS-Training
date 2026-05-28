import React, { useState } from 'react';
import LucideIcon from '../ui/LucideIcon';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý ảo Karcher. Bạn cần tư vấn về thiết bị, hóa chất hay quy trình làm sạch nào?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const response = "Tính năng Kärcher AI này đang được kết nối với NotebookLM của HAUS. Vui lòng bấm vào biểu tượng liên kết tròn ở trên nút chat để truy cập nguồn dữ liệu chi tiết của chúng tôi.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: response, sender: 'bot' }
      ]);
    }, 1000);
  };

  const handleNotebookLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('https://notebooklm.google.com/notebook/ddf466f3-ed1c-42ec-b56a-8a069658793e', '_blank');
  };

  return (
    <>
      {/* Floating Buttons Group */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center select-none">
        {/* External Link to NotebookLM */}
        <div
          className="absolute -top-1 -left-1 w-6 h-6 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200 z-50 border border-slate-200"
          onClick={handleNotebookLink}
          title="Mở NotebookLM"
        >
          <LucideIcon name="ExternalLink" size={12} color="#000" />
        </div>

        {/* Main Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-108 transition-all duration-300 border-2 border-white/20
            ${isOpen ? 'rotate-90 bg-slate-800' : 'rotate-0'}
          `}
        >
          {isOpen ? (
            <LucideIcon name="X" size={24} color="#000" />
          ) : (
            <LucideIcon name="MessageSquare" size={24} color="#000" />
          )}
        </button>
      </div>

      {/* Chat Dialog Window */}
      {isOpen && (
        <div className="ai-chat-window animate-slide-in-right">
          {/* Header */}
          <div className="ai-header">
            <div className="flex items-center gap-2">
              <LucideIcon name="Bot" size={20} />
              <span className="font-bold tracking-wide text-sm">Karcher AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-black/15 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <LucideIcon name="Minus" size={16} />
            </button>
          </div>

          {/* Body Messages */}
          <div className="ai-body custom-scroll">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message ${msg.sender === 'user' ? 'user shadow-sm' : 'bot shadow-md'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Footer Input Form */}
          <div className="ai-footer flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-yellow-400 text-white placeholder-slate-500"
              placeholder="Hỏi trợ lý Karcher..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-yellow-400 hover:bg-yellow-300 text-black p-2.5 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex items-center justify-center"
            >
              <LucideIcon name="Send" size={14} />
            </button>
          </div>

          {/* Prompt banner to NotebookLM */}
          <div
            className="text-[9px] font-bold text-center py-1.5 text-slate-400 bg-black/35 hover:text-yellow-400 transition-colors cursor-pointer border-t border-white/5"
            onClick={handleNotebookLink}
          >
            Powered by NotebookLM & Gemini (Nhấp để mở tài liệu)
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
