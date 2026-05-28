import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';
import { quizQuestions } from '../../data/quizQuestions';

export const QuizPanel: React.FC = () => {
  const {
    isQuizMode,
    setIsQuizMode,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    quizSelectedMachineId,
    setQuizSelectedMachineId,
    quizSelectedChemicalId,
    setQuizSelectedChemicalId,
    quizScore,
    setQuizScore,
    machines,
    chemicals,
    setHoveredArea,
    setSelectedMachineId,
    setSelectedChemicalId,
    setSelectedToolId,
    setActivePackage
  } = useApp();

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Auto-focus diagram area for the current question so connection layer shines!
  useEffect(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestion && isQuizMode) {
      setHoveredArea(currentQuestion.targetAreaId);
      setActivePackage(currentQuestion.targetPackageId);
      // Clear normal UI selections to avoid interference
      setSelectedMachineId(null);
      setSelectedChemicalId(null);
      setSelectedToolId(null);
    }
  }, [currentQuestionIndex, isQuizMode]);

  if (!isQuizMode) return null;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedMachine = machines.find(m => m.id === quizSelectedMachineId);
  const selectedChemical = chemicals.find(c => c.id === quizSelectedChemicalId);

  const handleSubmit = () => {
    if (!quizSelectedMachineId || !quizSelectedChemicalId) return;

    const correct = 
      quizSelectedMachineId === currentQuestion.correctMachineId && 
      quizSelectedChemicalId === currentQuestion.correctChemicalId;

    setIsAnswerCorrect(correct);
    setHasSubmitted(true);

    if (correct) {
      setQuizScore(prev => prev + 10);
    }
  };

  const handleNext = () => {
    setHasSubmitted(false);
    setQuizSelectedMachineId(null);
    setQuizSelectedChemicalId(null);
    
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed all questions!
      alert(`Chúc mừng! Bạn đã hoàn thành bài kiểm tra với số điểm: ${quizScore + (isAnswerCorrect ? 10 : 0)} / ${quizQuestions.length * 100 / 10}`);
      handleExit();
    }
  };

  const handleRetry = () => {
    setHasSubmitted(false);
    setQuizSelectedMachineId(null);
    setQuizSelectedChemicalId(null);
  };

  const handleExit = () => {
    setIsQuizMode(false);
    setCurrentQuestionIndex(0);
    setQuizSelectedMachineId(null);
    setQuizSelectedChemicalId(null);
    setQuizScore(0);
    setHoveredArea(null);
    setActivePackage(null);
  };

  const canSubmit = quizSelectedMachineId !== null && quizSelectedChemicalId !== null;

  return (
    <div 
      onClick={e => e.stopPropagation()} 
      className="fixed bottom-4 right-6 bg-slate-900/96 text-white p-5 rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-md z-40 w-90 animate-slide-in-right max-h-[85vh] overflow-y-auto custom-scroll flex flex-col gap-4"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <LucideIcon name="ShieldAlert" size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider">Đào tạo Vận hành</h3>
            <span className="text-[9px] text-blue-400 font-bold uppercase">Kiểm tra năng lực Kärcher</span>
          </div>
        </div>
        <button 
          onClick={handleExit}
          className="text-slate-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider bg-white/5 px-2 py-1 rounded border border-white/5 cursor-pointer"
        >
          Thoát
        </button>
      </div>

      {/* Progress & Score */}
      <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase text-slate-400">
        <span>Câu {currentQuestionIndex + 1} / {quizQuestions.length}</span>
        <span className="text-yellow-400 font-black">Điểm: {quizScore}</span>
      </div>

      {/* Question Text */}
      <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-500/10">
        <span className="text-[9px] text-blue-400 uppercase font-black tracking-wider block mb-1">Câu hỏi kiểm tra</span>
        <p className="text-xs leading-relaxed font-semibold text-slate-200">{currentQuestion.question}</p>
      </div>

      {/* Answer Selections state */}
      {!hasSubmitted ? (
        <div className="space-y-2.5">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Đáp án bạn đang chọn:</span>
          
          {/* Selected Machine Card */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${selectedMachine ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-700/40 opacity-60'}`}>
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
              {selectedMachine ? (
                <img src={selectedMachine.image} className="w-full h-full object-contain" alt="" />
              ) : (
                <LucideIcon name="Wrench" size={18} className="text-slate-500" />
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-[8px] text-slate-400 font-black uppercase block leading-none mb-0.5">Thiết bị chà/hút</span>
              <p className="text-[11px] font-bold text-white truncate">
                {selectedMachine ? selectedMachine.name : 'Nhấp chọn thẻ Thiết bị trên sơ đồ...'}
              </p>
            </div>
          </div>

          {/* Selected Chemical Card */}
          <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${selectedChemical ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-800/40 border-slate-700/40 opacity-60'}`}>
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
              {selectedChemical ? (
                <img src={selectedChemical.image} className="w-full h-full object-contain" alt="" />
              ) : (
                <LucideIcon name="Droplet" size={18} className="text-slate-500" />
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-[8px] text-slate-400 font-black uppercase block leading-none mb-0.5">Hóa chất tương ứng</span>
              <p className="text-[11px] font-bold text-white truncate">
                {selectedChemical ? selectedChemical.name : 'Nhấp chọn thẻ Hóa chất trên sơ đồ...'}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-2
              ${canSubmit 
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-103' 
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'}`}
          >
            <LucideIcon name="CheckSquare" size={14} />
            Nộp bài làm
          </button>
        </div>
      ) : (
        /* Feedback Panel after submit */
        <div className="space-y-4 animate-slide-up">
          {isAnswerCorrect ? (
            /* CORRECT */
            <div className="bg-green-950/20 border border-green-500/30 p-4 rounded-xl flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
                <LucideIcon name="CheckCircle2" size={24} />
              </div>
              <div>
                <h4 className="text-green-400 font-black text-sm uppercase tracking-wide">Đáp án chính xác!</h4>
                <p className="text-[10px] text-green-300/80 font-bold uppercase mt-0.5">Bạn được cộng +10 điểm</p>
              </div>
            </div>
          ) : (
            /* INCORRECT */
            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30">
                <LucideIcon name="AlertOctagon" size={24} />
              </div>
              <div>
                <h4 className="text-red-400 font-black text-sm uppercase tracking-wide">Đáp án chưa đúng!</h4>
                <p className="text-[10px] text-red-300/80 font-bold uppercase mt-0.5">Quy trình vận hành chưa chuẩn</p>
              </div>
            </div>
          )}

          {/* Explanation Text */}
          <div className="bg-slate-850/80 p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">Giải thích kỹ thuật</span>
            <p className="text-[11px] leading-relaxed text-slate-300">{currentQuestion.explanation}</p>
          </div>

          {/* Next/Retry Buttons */}
          <div className="flex gap-2">
            {!isAnswerCorrect && (
              <button 
                onClick={handleRetry}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Thử lại
              </button>
            )}
            <button 
              onClick={handleNext}
              className={`flex-grow py-2.5 rounded-xl text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer
                ${isAnswerCorrect 
                  ? 'bg-green-400 hover:bg-green-300 shadow-[0_0_15px_rgba(74,222,128,0.4)]' 
                  : 'bg-yellow-400 hover:bg-yellow-300'}`}
            >
              <span>{currentQuestionIndex + 1 === quizQuestions.length ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
              <LucideIcon name="ArrowRight" size={14} color="#000" />
            </button>
          </div>
        </div>
      )}

      {/* Close Instruction */}
      <span className="text-center text-[9px] text-slate-500 border-t border-slate-800 pt-2 block">
        Nhấp chọn Thẻ trên sơ đồ cột 2 và cột 3 để đưa ra câu trả lời
      </span>
    </div>
  );
};

export default QuizPanel;
