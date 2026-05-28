import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

export const AIChat: React.FC = () => {
  const { machines, chemicals, tools } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý ảo Karcher. Bạn cần tư vấn về thiết bị, hóa chất hay quy trình làm sạch nào?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const systemInstruction = `
Bạn là "Trợ lý Ảo Đào tạo Vận hành Kärcher (HAUS AI Assistant)". Nhiệm vụ của bạn là giải đáp kỹ thuật làm sạch dựa trên dữ liệu thực tế:
DANH SÁCH THIẾT BỊ:
${machines.map((m) => `- ${m.name}: ${m.type}. Mô tả: ${m.desc}`).join('\n')}

DANH SÁCH HÓA CHẤT:
${chemicals.map((c) => `- ${c.name}: ${c.type}. pH: ${c.pH}. Tỷ lệ: ${c.dilutionRatio}. Bảo hộ: ${c.safetyMsds?.join(', ') || 'Không có'}. Mô tả: ${c.desc}`).join('\n')}

DANH SÁCH DỤNG CỤ:
${tools.map((t) => `- ${t.name}: ${t.type}. Mô tả: ${t.desc}`).join('\n')}

HƯỚNG DẪN TRẢ LỜI:
1. Trả lời cực kỳ ngắn gọn, cô đọng (dưới 4 câu nếu có thể), tập trung vào cốt lõi.
2. Trả lời bằng tiếng Việt chuyên nghiệp, lịch sự, chuẩn kỹ thuật.
3. Luôn bám sát các chỉ số pH, tỷ lệ pha loãng, bảo hộ an toàn MSDS thực tế ở trên để tư vấn chính xác.
`;

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        const response = "Chào bạn! Tính năng Kärcher AI hiện tại chưa được kích hoạt khóa VITE_GEMINI_API_KEY trong tệp cấu hình .env.local. Vui lòng thêm khóa để bắt đầu chat trực tiếp, hoặc click vào biểu tượng NotebookLM phía trên để xem tài liệu chi tiết của chúng tôi.";
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: response, sender: 'bot' }
        ]);
        setIsThinking(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemInstruction + "\n\nUser Question: " + userText
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi không nhận được phản hồi từ hệ thống AI. Vui lòng thử lại.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botText, sender: 'bot' }
      ]);
    } catch (err) {
      console.error('Gemini API query failed:', err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Lỗi kết nối với máy chủ AI. Vui lòng kiểm tra khóa VITE_GEMINI_API_KEY hoặc đường truyền mạng của bạn.", sender: 'bot' }
      ]);
    } finally {
      setIsThinking(false);
    }
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
            {isThinking && (
              <div className="ai-message bot shadow-md flex items-center gap-1.5 py-2 px-3 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-[10px] text-slate-400 font-bold ml-1">HAUS AI đang xử lý...</span>
              </div>
            )}
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
