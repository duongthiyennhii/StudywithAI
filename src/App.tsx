import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calculator, Languages, PenTool, GraduationCap, Loader2, CheckCircle2, AlertCircle, MessageCircle, X, Send } from 'lucide-react';

interface SubjectResult {
  name: string;
  score: number;
  level: string;
  icon: string;
  solution: string;
  color: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function App() {
  const [scores, setScores] = useState({
    toan: '',
    van: '',
    anh: '',
    monhoc: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SubjectResult[] | null>(null);
  const [habitMessage, setHabitMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  // Chatbox state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Xin chào 👋 Mình có thể hỗ trợ bạn học Toán, Văn, Anh!", sender: 'bot' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const getEvaluation = (name: string, score: number) => {
    let level = "";
    let icon = "";
    let color = "";
    let baseSolution = "";

    if (score <= 3) {
      level = "Mất gốc";
      icon = "🌱";
      color = "text-red-500";
      baseSolution = "Cần xem lại toàn bộ kiến thức nền tảng, học lại lý thuyết cơ bản và làm bài tập mức dễ mỗi ngày.";
    } else if (score <= 6) {
      level = "Chưa vững";
      icon = "🌿";
      color = "text-yellow-600";
      baseSolution = "Cần luyện tập thêm, củng cố phần còn yếu, làm thêm đề và sửa lỗi sai thường gặp.";
    } else if (score <= 8) {
      level = "Khá";
      icon = "🌳";
      color = "text-blue-500";
      baseSolution = "Tiếp tục nâng cao kỹ năng, luyện đề tổng hợp và cải thiện tốc độ làm bài.";
    } else {
      level = "Rất tốt";
      icon = "⭐";
      color = "text-emerald-500";
      baseSolution = "Duy trì phong độ, luyện bài nâng cao và tránh mất điểm do lỗi nhỏ.";
    }

    let youtubeChannels = "";
    if (name === "Toán") {
      youtubeChannels = "\n\n📺 Kênh YouTube hỗ trợ: Anh Trung Anh siêu nhân, Tuyensinh247, OLM.vn, thầy Nguyễn Phan Tiến.";
    } else if (name === "Văn") {
      youtubeChannels = "\n\n📺 Kênh YouTube hỗ trợ: Cô Sương, Học văn chị Hiên, Trạm văn, Lời giải hay.";
    } else if (name === "Anh") {
      youtubeChannels = "\n\n📺 Kênh YouTube hỗ trợ: Cô Mai Phương, BBC Learning English, Listening Time.";
    }

    return { level, icon, color, solution: baseSolution + youtubeChannels };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setHabitMessage(null);

    setTimeout(() => {
      const toanScore = parseFloat(scores.toan) || 0;
      const vanScore = parseFloat(scores.van) || 0;
      const anhScore = parseFloat(scores.anh) || 0;
      const monhocCount = parseInt(scores.monhoc) || 0;

      const newResults = [
        { name: "Toán học", score: toanScore, ...getEvaluation("Toán", toanScore) },
        { name: "Ngữ văn", score: vanScore, ...getEvaluation("Văn", vanScore) },
        { name: "Tiếng Anh", score: anhScore, ...getEvaluation("Anh", anhScore) }
      ];

      setResults(newResults);
      
      if (monhocCount >= 2) {
        setHabitMessage({ text: "Bạn đang đi đúng hướng học tập!", type: 'success' });
      } else {
        setHabitMessage({ text: "Bạn nên học ít nhất 2 môn/ngày để hiệu quả hơn.", type: 'warning' });
      }
      
      setLoading(false);
    }, 1500);
  };

  const [progress, setProgress] = useState(0);

  const increaseProgress = () => {
    if (progress >= 100) return;
    setProgress(prev => Math.min(prev + 10, 100));
  };

  const getBotReply = (message: string) => {
    const msg = message.toLowerCase();
    
    // ===== KẾ HOẠCH THEO THỨ =====
    if (msg.includes("thứ 2")) {
      return `📅 Kế hoạch học tập Thứ 2:\n\n➤ Toán: Ôn lý thuyết chương đang học + làm 5 bài cơ bản\n➤ Văn: Lập dàn ý 1 đề nghị luận xã hội\n➤ Anh: Học 15 từ vựng + ôn 1 cấu trúc ngữ pháp\n\n💡 Thời gian gợi ý: 2–3 tiếng buổi tối.`;
    }
    if (msg.includes("thứ 3")) {
      return `📅 Kế hoạch học tập Thứ 3:\n\n➤ Toán: Làm bài tập nâng cao\n➤ Văn: Viết hoàn chỉnh 1 bài văn\n➤ Anh: Luyện đọc hiểu 1 đoạn văn\n\n🚀 Tập trung vào môn bạn yếu nhất!`;
    }
    if (msg.includes("thứ 4")) {
      return `📅 Kế hoạch học tập Thứ 4:\n\n➤ Toán: Làm đề mini test 30 phút\n➤ Văn: Ôn tác phẩm đã học\n➤ Anh: Luyện nghe 15 phút`;
    }
    if (msg.includes("thứ 5")) {
      return `📅 Kế hoạch học tập Thứ 5:\n\n➤ Toán: Chữa bài sai trong tuần\n➤ Văn: Học dẫn chứng hay\n➤ Anh: Viết 1 đoạn văn 80–100 từ`;
    }
    if (msg.includes("thứ 6")) {
      return `📅 Kế hoạch học tập Thứ 6:\n\n➤ Toán: Ôn công thức quan trọng\n➤ Văn: Phân tích đề thi mẫu\n➤ Anh: Ôn toàn bộ từ vựng tuần`;
    }
    if (msg.includes("thứ 7")) {
      return `📅 Kế hoạch học tập Thứ 7:\n\n➤ Làm 1 đề tổng hợp Toán\n➤ Viết 1 bài văn hoàn chỉnh\n➤ Làm 1 đề tiếng Anh mini test`;
    }
    if (msg.includes("chủ nhật")) {
      return `🌿 Chủ Nhật: Ngày tổng kết\n\n➤ Xem lại lỗi sai trong tuần\n➤ Ôn lại kiến thức chưa vững\n➤ Nghỉ ngơi hợp lý để tuần sau học tốt hơn`;
    }

    // ===== TƯ VẤN THEO MÔN =====
    if (msg.includes("toán")) {
      return "📘 Để học tốt Toán, bạn nên luyện tập mỗi ngày, nắm chắc lý thuyết và làm bài từ cơ bản đến nâng cao.";
    } else if (msg.includes("văn")) {
      return "📗 Để học tốt Văn, hãy luyện lập dàn ý trước khi viết và tập trung phân tích thay vì kể lại.";
    } else if (msg.includes("anh")) {
      return "📙 Để học tốt Tiếng Anh, hãy học từ vựng theo chủ đề và ôn kỹ ngữ pháp cơ bản.";
    } else if (msg.includes("mất gốc")) {
      return "🌱 Nếu bạn mất gốc, hãy bắt đầu lại từ kiến thức cơ bản và học từng bước nhỏ mỗi ngày.";
    } else {
      return "🤖 Mình có thể tạo kế hoạch học theo từng thứ hoặc tư vấn Toán, Văn, Anh cho bạn nhé!";
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setChatInput('');

    setTimeout(() => {
      const reply = getBotReply(userMsg);
      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200"
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-2">
            StudywithAI
          </h1>
          <p className="text-lg text-slate-600">
            Định hướng học tập thông minh cho học sinh THPT
          </p>
        </header>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="toan" className="flex items-center text-sm font-semibold text-slate-700">
                  <Calculator className="w-4 h-4 mr-2 text-indigo-500" />
                  Điểm Toán
                </label>
                <input
                  type="number"
                  id="toan"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores.toan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="van" className="flex items-center text-sm font-semibold text-slate-700">
                  <PenTool className="w-4 h-4 mr-2 text-rose-500" />
                  Điểm Văn
                </label>
                <input
                  type="number"
                  id="van"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores.van}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="anh" className="flex items-center text-sm font-semibold text-slate-700">
                  <Languages className="w-4 h-4 mr-2 text-emerald-500" />
                  Điểm Anh
                </label>
                <input
                  type="number"
                  id="anh"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scores.anh}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="monhoc" className="flex items-center text-sm font-semibold text-slate-700">
                <BookOpen className="w-4 h-4 mr-2 text-amber-500" />
                Số môn học mỗi ngày
              </label>
              <input
                type="number"
                id="monhoc"
                min="0"
                max="10"
                value={scores.monhoc}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Ví dụ: 3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                "Bắt đầu đánh giá"
              )}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-6xl mb-4"
              >
                🐻📚
              </motion.div>
              <p className="text-slate-500 font-medium">Đang phân tích năng lực học tập của bạn...</p>
            </motion.div>
          )}

          {results && (
            <motion.div
              key="results-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {results.map((res, idx) => (
                  <motion.div
                    key={res.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                          <span className="mr-2">{res.icon}</span>
                          {res.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium">Điểm số: {res.score}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${res.color} bg-slate-50`}>
                        {res.level}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        <span className="font-bold text-slate-900">Giải pháp: </span>
                        {res.solution}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {habitMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-2xl flex items-center ${
                    habitMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-800 border border-amber-100'
                  }`}
                >
                  {habitMessage.type === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                  )}
                  <h3 className="font-bold text-lg">{habitMessage.text}</h3>
                </motion.div>
              )}

              {/* Progress Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center">
                  📊 Tiến độ học tập tuần này
                </h3>
                
                <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="text-slate-600 font-bold mb-6">{progress}% hoàn thành</p>

                <button
                  onClick={increaseProgress}
                  disabled={progress >= 100}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hoàn thành hôm nay ✅
                </button>

                {progress === 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-6 text-2xl font-bold text-emerald-600"
                  >
                    🎉 Xuất sắc! Bạn đã hoàn thành tuần học!
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chatbox Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-indigo-700 transition-all z-50"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbox */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 flex flex-col h-[500px]"
          >
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold">StudywithAI Assistant 🤖</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
