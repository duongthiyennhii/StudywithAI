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

const originalEngQuestions = [
  { q: "She has lived here ___ 2015.", options: ["since", "for", "from", "in"], answer: 0 },
  { q: "If she ___ sick, she would have gone out.", options: ["wasn't", "hadn't been", "hasn't been", "weren't"], answer: 1 },
  { q: "Choose the synonym of 'eliminate'.", options: ["remove", "allow", "add", "cause"], answer: 0 },
  { q: "He suggested ___ to the cinema.", options: ["go", "to go", "going", "went"], answer: 2 },
  { q: "She speaks English ___ than me.", options: ["good", "better", "best", "well"], answer: 1 },
  { q: "They have finished the project, ___?", options: ["have they", "haven't they", "do they", "don't they"], answer: 1 },
  { q: "The book ___ by Shakespeare.", options: ["was written", "is writing", "wrote", "writes"], answer: 0 },
  { q: "I am looking forward to ___ you.", options: ["see", "to see", "seeing", "seen"], answer: 2 },
  { q: "She is interested ___ music.", options: ["in", "on", "at", "for"], answer: 0 },
  { q: "He runs ___ than his brother.", options: ["fast", "faster", "fastest", "more fast"], answer: 1 },
  { q: "The homework must ___ today.", options: ["finish", "be finished", "finished", "finishing"], answer: 1 },
  { q: "There isn't ___ milk left.", options: ["many", "much", "a few", "a little"], answer: 1 },
  { q: "He asked me where I ___ from.", options: ["am", "was", "were", "be"], answer: 1 },
  { q: "She has worked here ___ 5 years.", options: ["since", "for", "from", "in"], answer: 1 },
  { q: "If it rains, we ___ at home.", options: ["stay", "will stay", "stayed", "would stay"], answer: 1 }
];

const originalMathQuestions = [
  {
    q: "Câu 1. Cho A(3;5), B(7;2). Tọa độ \\(\\vec{AB}\\) là:",
    options: ["\\((4;-3)\\)", "\\((-4;3)\\)", "\\((4;3)\\)", "\\((-4;-3)\\)"],
    answer: 0
  },
  {
    q: "Câu 2. M, N, P thẳng hàng, N nằm giữa M và P. Cặp vectơ cùng hướng?",
    options: ["\\(\\vec{NP}\\) và \\(\\vec{NM}\\)", "\\(\\vec{MN}\\) và \\(\\vec{PN}\\)", "\\(\\vec{MN}\\) và \\(\\vec{MP}\\)", "\\(\\vec{MP}\\) và \\(\\vec{PN}\\)"],
    answer: 2
  },
  {
    q: "Câu 3. \\(\\vec{u}=(2a-1;-3), \\vec{v}=(3;4b+1).\\) Nếu \\(\\vec{u}=\\vec{v}\\) thì:",
    options: ["a=1,b=-1", "a=2,b=1", "a=3,b=-1", "a=2,b=-1"],
    answer: 3
  },
  {
    q: "Câu 4. ΔABC có B=60°, a=8, c=5. Độ dài b:",
    options: ["7", "\\(\\sqrt{129}\\)", "129", "49"],
    answer: 0
  },
  {
    q: "Câu 5. Góc giữa hai đường thẳng là:",
    options: ["90°", "30°", "150°", "60°"],
    answer: 2
  },
  {
    q: "Câu 6. Hàm số y=x²-4x+2 đồng biến trên:",
    options: ["(-∞;+∞)", "(-2;+∞)", "(-∞;2)", "(2;+∞)"],
    answer: 3
  },
  {
    q: "Câu 7. Phương trình tham số đúng:",
    options: ["x=3+t, y=5-2t", "x=1+3t, y=-2+5t", "x=3+3t, y=4+5t", "x=1+5t, y=-2-3t"],
    answer: 1
  },
  {
    q: "Câu 8. \\(\\vec{a}=6i-9j\\). Tọa độ:",
    options: ["(6;-9)", "(6;9)", "(-6;-9)", "(-6;9)"],
    answer: 0
  },
  {
    q: "Câu 9. Mệnh đề đúng:",
    options: ["\\(A_n^k=k!C_n^k\\)", "\\(C_n^k=k!A_n^k\\)", "\\(A_n^k=kC_n^k\\)", "\\(C_n^k=kA_n^k\\)"],
    answer: 0
  },
  {
    q: "Câu 10. 5 nữ, 6 nam. Chọn 1 học sinh:",
    options: ["30", "11", "10", "20"],
    answer: 1
  },
  {
    q: "Câu 11. TXĐ y=(x+1)/(x-1):",
    options: ["(1;+∞)", "ℝ\\{-1}", "ℝ\\{1}", "ℝ\\{±1}"],
    answer: 2
  },
  {
    q: "Câu 12. Phủ định của ∀x∈ℝ, x²-2x+15<0:",
    options: ["∀x∈ℝ, x²-2x+15>0", "∀x∈ℝ, x²-2x+15≥0", "Không tồn tại x: x²-2x+15<0", "∃x∈ℝ, x²-2x+15≥0"],
    answer: 3
  }
];

export default function App() {
  const [mode, setMode] = useState<'assessment' | 'math-quiz' | 'lit-quiz' | 'eng-quiz' | 'mini-test-home' | 'mini-test-select' | 'game-home' | 'eng-game' | 'math-game'>('mini-test-home');
  const [scores, setScores] = useState({
    toan: '',
    van: '',
    anh: '',
    monhoc: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SubjectResult[] | null>(null);
  const [habitMessage, setHabitMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [litQuizAnswers, setLitQuizAnswers] = useState<Record<string, string>>({});
  const [litQuizSubmitted, setLitQuizSubmitted] = useState(false);
  const [litQuizScore, setLitQuizScore] = useState(0);

  const [engQuizAnswers, setEngQuizAnswers] = useState<Record<string, string>>({});
  const [engQuizSubmitted, setEngQuizSubmitted] = useState(false);
  const [engQuizScore, setEngQuizScore] = useState(0);

  // New English Quiz state
  const [engPlayerName, setEngPlayerName] = useState('');
  const [engGameState, setEngGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [engCurrentIndex, setEngCurrentIndex] = useState(0);
  const [engActiveQuestions, setEngActiveQuestions] = useState<any[]>([]);
  const [engFeedback, setEngFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | null }>({ text: '', type: null });
  const [engLeaderboard, setEngLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [engSelectedOption, setEngSelectedOption] = useState<number | null>(null);

  // Math Game state
  const [mathPlayerName, setMathPlayerName] = useState('');
  const [mathGameState, setMathGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [mathCurrentIndex, setMathCurrentIndex] = useState(0);
  const [mathActiveQuestions, setMathActiveQuestions] = useState<any[]>([]);
  const [mathFeedback, setMathFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | null }>({ text: '', type: null });
  const [mathLeaderboard, setMathLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [mathSelectedOption, setMathSelectedOption] = useState<number | null>(null);
  const [mathScore, setMathScore] = useState(0);
  const [mathHistory, setMathHistory] = useState<{ score: number; total: number; date: string }[]>([]);
  const [engHistory, setEngHistory] = useState<{ score: number; total: number; date: string }[]>([]);
  const [mathQuizHistory, setMathQuizHistory] = useState<{ score: number; total: number; date: string }[]>([]);
  const [litQuizHistory, setLitQuizHistory] = useState<{ score: number; total: number; date: string }[]>([]);
  const [engQuizHistory, setEngQuizHistory] = useState<{ score: number; total: number; date: string }[]>([]);

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

  useEffect(() => {
    const handleMath = () => {
      if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
        (window as any).MathJax.typesetPromise().catch((err: any) => console.error('MathJax error:', err));
      }
    };

    // Initial typeset
    handleMath();
    
    // MutationObserver to catch any DOM changes (React updates, animations, etc.)
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        handleMath();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

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
  const [motivation, setMotivation] = useState({ message: '', icon: '', type: 'info' });

  useEffect(() => {
    const updateMotivation = () => {
      const hour = new Date().getHours();
      let message = "";
      let icon = "";
      let type = "info";

      if (hour >= 5 && hour < 12) {
        if (progress < 10) {
          message = "Chào buổi sáng! Hãy bắt đầu mục tiêu học tập hôm nay thật năng suất nhé!";
          icon = "☀️";
        } else {
          message = "Khởi đầu ngày mới thật tuyệt vời! Tiếp tục phát huy nhé!";
          icon = "☕";
        }
      } else if (hour >= 12 && hour < 18) {
        if (progress < 40) {
          message = "Buổi chiều rồi, bạn đã hoàn thành được bao nhiêu phần trăm mục tiêu rồi?";
          icon = "📖";
          type = "warning";
        } else {
          message = "Bạn đang làm rất tốt! Một buổi chiều thật năng suất.";
          icon = "🌤️";
        }
      } else if (hour >= 18 && hour < 22) {
        if (progress < 70) {
          message = "Đã tối rồi mà tiến độ vẫn còn thấp, hãy tập trung hoàn thành bài vở nhé!";
          icon = "🌙";
          type = "warning";
        } else {
          message = "Buổi tối vui vẻ! Bạn đang đi đúng lộ trình đấy.";
          icon = "✨";
        }
      } else {
        if (progress < 100) {
          message = "Đã muộn rồi, nếu chưa xong hãy cố gắng một chút nữa rồi nghỉ ngơi nhé!";
          icon = "😴";
          type = "warning";
        } else {
          message = "Tuyệt vời! Bạn đã hoàn thành mục tiêu. Chúc bạn ngủ ngon!";
          icon = "💤";
          type = "success";
        }
      }
      setMotivation({ message, icon, type });
    };

    updateMotivation();
    const interval = setInterval(updateMotivation, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [progress]);

  const increaseProgress = () => {
    if (progress >= 100) return;
    setProgress(prev => Math.min(prev + 10, 100));
  };

  const getBotReply = (message: string) => {
    const msg = message.toLowerCase();
    
    // ===== KẾ HOẠCH THEO THỨ =====
    if (msg.includes("cả tuần") || msg.includes("tuần")) {
      return `📅 LỘ TRÌNH HỌC TẬP TOÀN DIỆN CẢ TUẦN 🚀\n\n` +
             `🗓️ Thứ 2: Khởi động năng lượng\n➤ Toán: Ôn lý thuyết chương mới + 5 bài cơ bản\n➤ Văn: Lập dàn ý nghị luận xã hội\n➤ Anh: 15 từ vựng + 1 cấu trúc ngữ pháp\n\n` +
             `🗓️ Thứ 3: Tăng tốc kiến thức\n➤ Toán: Giải bài tập nâng cao\n➤ Văn: Viết hoàn chỉnh bài văn\n➤ Anh: Luyện đọc hiểu 1 đoạn văn\n\n` +
             `🗓️ Thứ 4: Kiểm tra định kỳ\n➤ Toán: Làm mini test 30 phút\n➤ Văn: Ôn tập tác phẩm trọng tâm\n➤ Anh: Luyện nghe 15 phút (Podcast/Youtube)\n\n` +
             `🗓️ Thứ 5: Khắc phục điểm yếu\n➤ Toán: Chữa các lỗi sai trong tuần\n➤ Văn: Sưu tầm dẫn chứng văn học hay\n➤ Anh: Viết đoạn văn ngắn 100 từ\n\n` +
             `🗓️ Thứ 6: Tổng ôn lý thuyết\n➤ Toán: Hệ thống lại toàn bộ công thức\n➤ Văn: Phân tích các đề thi mẫu\n➤ Anh: Kiểm tra lại từ vựng cả tuần\n\n` +
             `🗓️ Thứ 7: Thực chiến đề thi\n➤ Làm 1 đề tổng hợp Toán (90p)\n➤ Viết 1 bài văn nghị luận văn học\n➤ Làm 1 đề Anh mini test (40 câu)\n\n` +
             `🌿 Chủ Nhật: Phục hồi & Định hướng\n➤ Xem lại toàn bộ lỗi sai\n➤ Lên kế hoạch cho tuần mới\n➤ Nghỉ ngơi, giải trí để nạp lại năng lượng\n\n💡 Bí kíp: Hãy học 50 phút, nghỉ 10 phút (Pomodoro) để đạt hiệu quả cao nhất!`;
    }
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

  const handleQuizSubmit = () => {
    const answers: Record<string, string> = {
      q1: "B",
      q2: "D",
      q3: "B",
      q4: "A",
      q5: "D",
      q6: "C",
      q7: "B",
      q8: "A",
      q9: "D",
      q10: "C"
    };
    let score = 0;
    Object.keys(answers).forEach(q => {
      if (quizAnswers[q] === answers[q]) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save to history
    const historyEntry = { score, total: Object.keys(answers).length, date: new Date().toLocaleString('vi-VN') };
    const currentHistory = JSON.parse(localStorage.getItem("mathQuizHistory") || "[]");
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 10);
    localStorage.setItem("mathQuizHistory", JSON.stringify(updatedHistory));
    setMathQuizHistory(updatedHistory);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleLitQuizSubmit = () => {
    const answers: Record<string, string> = {
      v1: "C",
      v2: "D",
      v3: "D",
      v4: "A",
      v5: "D",
      v6: "C",
      v7: "B",
      v8: "C",
      v9: "A",
      v10: "B"
    };
    let score = 0;
    Object.keys(answers).forEach(v => {
      if (litQuizAnswers[v] === answers[v]) {
        score++;
      }
    });
    setLitQuizScore(score);
    setLitQuizSubmitted(true);

    // Save to history
    const historyEntry = { score, total: Object.keys(answers).length, date: new Date().toLocaleString('vi-VN') };
    const currentHistory = JSON.parse(localStorage.getItem("litQuizHistory") || "[]");
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 10);
    localStorage.setItem("litQuizHistory", JSON.stringify(updatedHistory));
    setLitQuizHistory(updatedHistory);
  };

  const resetLitQuiz = () => {
    setLitQuizAnswers({});
    setLitQuizSubmitted(false);
    setLitQuizScore(0);
  };

  const handleEngQuizSubmit = () => {
    const answers: Record<string, string> = {
      a1: "D",
      a2: "B",
      a3: "C",
      a4: "A",
      a5: "B",
      a6: "C",
      a7: "B",
      a8: "D",
      a9: "A",
      a10: "B"
    };
    let score = 0;
    Object.keys(answers).forEach(a => {
      if (engQuizAnswers[a] === answers[a]) {
        score++;
      }
    });
    setEngQuizScore(score);
    setEngQuizSubmitted(true);

    // Save to history
    const historyEntry = { score, total: Object.keys(answers).length, date: new Date().toLocaleString('vi-VN') };
    const currentHistory = JSON.parse(localStorage.getItem("engQuizHistory") || "[]");
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 10);
    localStorage.setItem("engQuizHistory", JSON.stringify(updatedHistory));
    setEngQuizHistory(updatedHistory);
  };

  const resetEngQuiz = () => {
    setEngQuizAnswers({});
    setEngQuizSubmitted(false);
    setEngQuizScore(0);
  };

  const resetEngGame = () => {
    setEngGameState('start');
    setEngCurrentIndex(0);
    setEngQuizScore(0);
    setEngFeedback({ text: '', type: null });
    setEngSelectedOption(null);
  };

  const resetMathGame = () => {
    setMathGameState('start');
    setMathCurrentIndex(0);
    setMathScore(0);
    setMathFeedback({ text: '', type: null });
    setMathSelectedOption(null);
  };

  const startMathGame = () => {
    if (!mathPlayerName.trim()) {
      alert("Nhập tên của bạn!");
      return;
    }
    let prepared = originalMathQuestions.map(q => {
      const correctAnswer = q.options[q.answer];
      const shuffledOptions = shuffleArray(q.options);
      return {
        ...q,
        options: shuffledOptions,
        answer: shuffledOptions.indexOf(correctAnswer)
      };
    });
    setMathActiveQuestions(shuffleArray(prepared));
    setMathGameState('playing');
    setMathCurrentIndex(0);
    setMathScore(0);
    setMathFeedback({ text: '', type: null });
    setMathSelectedOption(null);
  };

  const checkMathAnswer = (index: number) => {
    if (mathSelectedOption !== null) return;
    const correctIndex = mathActiveQuestions[mathCurrentIndex].answer;
    setMathSelectedOption(index);
    if (index === correctIndex) {
      setMathScore(prev => prev + 1);
      setMathFeedback({ text: "✅ Chính xác!", type: 'correct' });
    } else {
      setMathFeedback({ text: "❌ Sai rồi!", type: 'wrong' });
    }
  };

  const nextMathQuestion = () => {
    if (mathCurrentIndex + 1 < mathActiveQuestions.length) {
      setMathCurrentIndex(prev => prev + 1);
      setMathFeedback({ text: '', type: null });
      setMathSelectedOption(null);
    } else {
      endMathGame();
    }
  };

  const endMathGame = () => {
    setMathGameState('end');
    const newEntry = { name: mathPlayerName, score: mathScore };
    const currentLeaderboard = JSON.parse(localStorage.getItem("mathLeaderboard") || "[]");
    const updatedLeaderboard = [...currentLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem("mathLeaderboard", JSON.stringify(updatedLeaderboard));
    setMathLeaderboard(updatedLeaderboard);

    // Save to history
    const historyEntry = { 
      score: mathScore, 
      total: mathActiveQuestions.length, 
      date: new Date().toLocaleString('vi-VN') 
    };
    const currentHistory = JSON.parse(localStorage.getItem("mathHistory") || "[]");
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 10); // Keep last 10
    localStorage.setItem("mathHistory", JSON.stringify(updatedHistory));
    setMathHistory(updatedHistory);
  };

  const clearMathLeaderboard = () => {
    localStorage.removeItem("mathLeaderboard");
    setMathLeaderboard([]);
  };

  const clearEngLeaderboard = () => {
    localStorage.removeItem("leaderboard");
    setEngLeaderboard([]);
  };

  const clearMathHistory = () => {
    localStorage.removeItem("mathHistory");
    setMathHistory([]);
  };

  const clearEngHistory = () => {
    localStorage.removeItem("engHistory");
    setEngHistory([]);
  };

  const clearMathQuizHistory = () => {
    localStorage.removeItem("mathQuizHistory");
    setMathQuizHistory([]);
  };

  const clearLitQuizHistory = () => {
    localStorage.removeItem("litQuizHistory");
    setLitQuizHistory([]);
  };

  const clearEngQuizHistory = () => {
    localStorage.removeItem("engQuizHistory");
    setEngQuizHistory([]);
  };

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startEngGame = () => {
    if (!engPlayerName.trim()) {
      alert("Enter your name!");
      return;
    }

    // Prepare questions
    let prepared = originalEngQuestions.map(q => {
      const correctAnswer = q.options[q.answer];
      const shuffledOptions = shuffleArray(q.options);
      return {
        ...q,
        options: shuffledOptions,
        answer: shuffledOptions.indexOf(correctAnswer)
      };
    });
    
    setEngActiveQuestions(shuffleArray(prepared));
    setEngGameState('playing');
    setEngCurrentIndex(0);
    setEngQuizScore(0);
    setEngFeedback({ text: '', type: null });
    setEngSelectedOption(null);
  };

  const checkEngAnswer = (index: number) => {
    if (engSelectedOption !== null) return;

    const correctIndex = engActiveQuestions[engCurrentIndex].answer;
    setEngSelectedOption(index);

    if (index === correctIndex) {
      setEngQuizScore(prev => prev + 1);
      setEngFeedback({ text: "✅ Correct!", type: 'correct' });
    } else {
      setEngFeedback({ text: "❌ Wrong!", type: 'wrong' });
    }
  };

  const nextEngQuestion = () => {
    if (engCurrentIndex + 1 < engActiveQuestions.length) {
      setEngCurrentIndex(prev => prev + 1);
      setEngFeedback({ text: '', type: null });
      setEngSelectedOption(null);
    } else {
      endEngGame();
    }
  };

  const endEngGame = () => {
    setEngGameState('end');
    const newEntry = { name: engPlayerName, score: engQuizScore };
    const currentLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    const updatedLeaderboard = [...currentLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
    setEngLeaderboard(updatedLeaderboard);

    // Save to history
    const historyEntry = { 
      score: engQuizScore, 
      total: engActiveQuestions.length, 
      date: new Date().toLocaleString('vi-VN') 
    };
    const currentHistory = JSON.parse(localStorage.getItem("engHistory") || "[]");
    const updatedHistory = [historyEntry, ...currentHistory].slice(0, 10); // Keep last 10
    localStorage.setItem("engHistory", JSON.stringify(updatedHistory));
    setEngHistory(updatedHistory);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setEngLeaderboard(data);
    const mathData = JSON.parse(localStorage.getItem("mathLeaderboard") || "[]");
    setMathLeaderboard(mathData);
    
    const engHist = JSON.parse(localStorage.getItem("engHistory") || "[]");
    setEngHistory(engHist);
    const mathHist = JSON.parse(localStorage.getItem("mathHistory") || "[]");
    setMathHistory(mathHist);

    const mqHist = JSON.parse(localStorage.getItem("mathQuizHistory") || "[]");
    setMathQuizHistory(mqHist);
    const lqHist = JSON.parse(localStorage.getItem("litQuizHistory") || "[]");
    setLitQuizHistory(lqHist);
    const eqHist = JSON.parse(localStorage.getItem("engQuizHistory") || "[]");
    setEngQuizHistory(eqHist);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8 tex2jax_process">
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
          <p className="text-lg text-slate-600 mb-8">
            Định hướng học tập thông minh cho học sinh THPT
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => setMode('assessment')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'assessment' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              Đánh giá năng lực
            </button>
            <button 
              onClick={() => setMode('mini-test-home')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'mini-test-home' || mode === 'mini-test-select' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              🚀 Mini Test
            </button>
            <button 
              onClick={() => setMode('game-home')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === 'game-home' || mode === 'eng-game' || mode === 'math-game' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              🎮 Trò chơi
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {mode === 'mini-test-home' ? (
            <motion.div
              key="mini-test-home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-12 text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-slate-800 mb-6">🎓 Hệ thống Mini Test</h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Chào mừng bạn đến với hệ thống kiểm tra nhanh. Hãy bắt đầu để đánh giá kiến thức của mình!
              </p>
              <button 
                onClick={() => setMode('mini-test-select')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
              >
                🚀 Bắt đầu Mini Test
              </button>
            </motion.div>
          ) : mode === 'mini-test-select' ? (
            <motion.div
              key="mini-test-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8 text-center"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Chọn môn bạn muốn kiểm tra</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button 
                  onClick={() => setMode('math-quiz')}
                  className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-700">📐 Toán</span>
                </button>
                <button 
                  onClick={() => setMode('lit-quiz')}
                  className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50 transition-all"
                >
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <PenTool className="w-6 h-6 text-rose-600" />
                  </div>
                  <span className="font-bold text-slate-700">📖 Văn</span>
                </button>
                <button 
                  onClick={() => setMode('eng-quiz')}
                  className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Languages className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-700">🌎 Anh</span>
                </button>
              </div>
              <button 
                onClick={() => setMode('mini-test-home')}
                className="mt-8 text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                ← Quay lại
              </button>
            </motion.div>
          ) : mode === 'assessment' ? (
            <motion.div
              key="assessment-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
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
                    className="space-y-6 tex2jax_process"
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

                      {/* Daily Motivation Prompt */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={motivation.message}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={motivation.type === 'warning' ? { 
                            opacity: 1,
                            scale: 1,
                            x: [0, -2, 2, -2, 2, 0],
                            transition: { repeat: Infinity, repeatDelay: 5, duration: 0.5 }
                          } : { opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`mb-8 p-4 rounded-2xl flex items-center justify-center text-sm font-medium ${
                            motivation.type === 'warning' 
                              ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                              : motivation.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                              : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
                          }`}
                        >
                          <span className="text-2xl mr-3">{motivation.icon}</span>
                          {motivation.message}
                        </motion.div>
                      </AnimatePresence>
                      
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
            </motion.div>
          ) : mode === 'math-quiz' ? (
            <motion.div
              key="math-quiz-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8 tex2jax_process"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
                  📚 Trắc nghiệm Toán
                </h2>
                <button 
                  onClick={() => setMode('mini-test-select')}
                  className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  ← Đổi môn học
                </button>
              </div>

              <div className="space-y-8">
                {/* Question 1 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 1. Cho hình bình hành {"$ABCD$"} tâm {"$O$"} như hình vẽ. Khẳng định nào đúng?</p>
                  <div className="bg-white p-4 rounded-xl mb-4 flex justify-center border border-slate-100 shadow-inner">
                    <svg width="300" height="180" viewBox="0 0 300 180">
                      {/* Hình bình hành */}
                      <path d="M80,30 L260,30 L220,150 L40,150 Z" fill="none" stroke="#1e1b4b" strokeWidth="2" />
                      {/* Đường chéo */}
                      <line x1="80" y1="30" x2="220" y2="150" stroke="#1e1b4b" strokeWidth="1.5" />
                      <line x1="260" y1="30" x2="40" y2="150" stroke="#1e1b4b" strokeWidth="1.5" />
                      {/* Tâm O */}
                      <circle cx="150" cy="90" r="3" fill="#ef4444" />
                      {/* Nhãn các điểm */}
                      <text x="70" y="25" fontSize="16" fontWeight="bold" fontStyle="italic">A</text>
                      <text x="265" y="25" fontSize="16" fontWeight="bold" fontStyle="italic">B</text>
                      <text x="225" y="165" fontSize="16" fontWeight="bold" fontStyle="italic">C</text>
                      <text x="25" y="165" fontSize="16" fontWeight="bold" fontStyle="italic">D</text>
                      <text x="145" y="110" fontSize="16" fontWeight="bold" fontStyle="italic">O</text>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q1" 
                          value={opt} 
                          checked={quizAnswers.q1 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$\\overrightarrow{AB} = \\overrightarrow{CD}$'}
                          {opt === 'B' && '$\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{AC}$'}
                          {opt === 'C' && '$\\overrightarrow{AB} - \\overrightarrow{AD} = \\overrightarrow{BD}$'}
                          {opt === 'D' && '$\\overrightarrow{AB} + \\overrightarrow{AD} = \\overrightarrow{BD}$'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q1 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q1 === 'B' ? '✔ Đúng' : `✘ Sai (Đáp án: B)`}
                    </p>
                  )}
                </div>

                {/* Question 2 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 2. Trong các mệnh đề sau, mệnh đề nào sai?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q2" 
                          value={opt} 
                          checked={quizAnswers.q2 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q2: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Tam giác đều có ba góc bằng $60^\circ$'}
                          {opt === 'B' && 'Số 15 chia hết cho 3'}
                          {opt === 'C' && <>{'$\pi < 3$'}</>}
                          {opt === 'D' && '$\sqrt{2}$ là số vô tỉ'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q2 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q2 === 'C' ? '✔ Đúng' : `✘ Sai (Đáp án: C)`}
                    </p>
                  )}
                </div>

                {/* Question 3 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 3. Tính diện tích tam giác {"$ABC$"} biết {"$AB = 3, BC = 5, CA = 6$"}.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q3" 
                          value={opt} 
                          checked={quizAnswers.q3 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q3: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '8'}
                          {opt === 'B' && '$\\sqrt{56}$'}
                          {opt === 'C' && '$\\sqrt{48}$'}
                          {opt === 'D' && '6'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q3 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q3 === 'B' ? '✔ Đúng' : `✘ Sai (Đáp án: B)`}
                    </p>
                  )}
                </div>

                {/* Question 4 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 4. Cho tam giác {"$ABC$"} với {"$AB = c, AC = b, BC = a$"}. Mệnh đề nào đúng?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q4" 
                          value={opt} 
                          checked={quizAnswers.q4 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q4: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$a^2 = b^2 + c^2 - 2bc\\cos A$'}
                          {opt === 'B' && '$a^2 = (b+c)^2 - 2bc\\cos A$'}
                          {opt === 'C' && '$a^2 = b^2 + c^2 + 2bc\\cos A$'}
                          {opt === 'D' && '$a = b + c - 2bc\\cos A$'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q4 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q4 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>

                {/* Question 5 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 5. Điểm nào thuộc đồ thị hàm số {"$y = x^3 - 3x + 2$"}?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q5" 
                          value={opt} 
                          checked={quizAnswers.q5 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q5: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'M(0;0)'}
                          {opt === 'B' && 'M(0;1)'}
                          {opt === 'C' && 'M(0;-2)'}
                          {opt === 'D' && 'M(0;2)'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q5 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q5 === 'D' ? '✔ Đúng' : `✘ Sai (Đáp án: D)`}
                    </p>
                  )}
                </div>

                {/* Question 6 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 6. Cho {"$\\vec{a} = (1; 2), \\vec{b} = (3; 4)$"}. Tọa độ của vectơ {"$\\vec{a} + \\vec{b}$"} là:</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q6" 
                          value={opt} 
                          checked={quizAnswers.q6 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q6: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$(4; 6)$'}
                          {opt === 'B' && '$(2; 2)$'}
                          {opt === 'C' && '$(3; 8)$'}
                          {opt === 'D' && '$(4; 8)$'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q6 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q6 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>

                {/* Question 7 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 7. Giá trị của {"$\\cos 60^\\circ$"} là:</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q7" 
                          value={opt} 
                          checked={quizAnswers.q7 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q7: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$\frac{1}{2}$'}
                          {opt === 'B' && '$\frac{\sqrt{3}}{2}$'}
                          {opt === 'C' && '$\frac{\sqrt{2}}{2}$'}
                          {opt === 'D' && '1'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q7 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q7 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>

                {/* Question 8 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 8. Cho hàm số {"$y = 2x + 1$"}. Hệ số góc của đường thẳng này là:</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q8" 
                          value={opt} 
                          checked={quizAnswers.q8 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q8: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '1'}
                          {opt === 'B' && '2'}
                          {opt === 'C' && '0'}
                          {opt === 'D' && '-2'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q8 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q8 === 'B' ? '✔ Đúng' : `✘ Sai (Đáp án: B)`}
                    </p>
                  )}
                </div>

                {/* Question 9 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 9. Tập xác định của hàm số {"$y = \\frac{1}{x-1}$"} là:</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q9" 
                          value={opt} 
                          checked={quizAnswers.q9 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q9: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$\mathbb{R}$'}
                          {opt === 'B' && '$\mathbb{R} \setminus \{0\}$'}
                          {opt === 'C' && '$\mathbb{R} \setminus \{1\}$'}
                          {opt === 'D' && '$(1; +\infty)$'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q9 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q9 === 'C' ? '✔ Đúng' : `✘ Sai (Đáp án: C)`}
                    </p>
                  )}
                </div>

                {/* Question 10 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 10. Phủ định của mệnh đề {"$\\forall x \\in \\mathbb{R}, x^2 > 0$"} là:</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input 
                          type="radio" 
                          name="q10" 
                          value={opt} 
                          checked={quizAnswers.q10 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q10: e.target.value }))}
                          className="mr-3 accent-indigo-600"
                          disabled={quizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && '$\exists x \in \mathbb{R}, x^2 \le 0$'}
                          {opt === 'B' && <>{'$\exists x \in \mathbb{R}, x^2 < 0$'}</>}
                          {opt === 'C' && '$\forall x \in \mathbb{R}, x^2 \le 0$'}
                          {opt === 'D' && '$\exists x \in \mathbb{R}, x^2 = 0$'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <p className={`mt-3 font-bold ${quizAnswers.q10 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizAnswers.q10 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200"
                  >
                    Nộp bài
                  </button>
                ) : (
                  <div className="w-full text-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-6"
                    >
                      <h3 className="text-2xl font-bold text-indigo-900 mb-2">Điểm: {quizScore}/10</h3>
                      <div className="text-indigo-600 font-medium space-y-2">
                        <p>{quizScore <= 3 && "❌ Cần cố gắng hơn! Bạn chưa nắm vững kiến thức cơ bản."}</p>
                        <p>{(quizScore >= 4 && quizScore <= 6) && "⚠ Mức trung bình. Hãy ôn tập kỹ hơn các phần lý thuyết."}</p>
                        <p>{(quizScore >= 7 && quizScore <= 8) && "👍 Khá tốt! Bạn có nền tảng kiến thức ổn định."}</p>
                        <p>{quizScore >= 9 && "🔥 Tuyệt vời! Bạn nắm rất chắc kiến thức Toán học."}</p>
                        
                        <p className="text-sm mt-4 pt-4 border-t border-indigo-100">
                          {quizScore <= 5 ? "👉 Ôn lại kiến thức cơ bản: vector, hàm số, công thức lượng giác. Làm bài tập dễ trước." : "👉 Tiếp tục duy trì phong độ và thử sức với các đề thi nâng cao."}
                        </p>
                      </div>
                    </motion.div>
                    <button
                      onClick={resetQuiz}
                      className="text-indigo-600 font-bold hover:underline mb-8 block mx-auto"
                    >
                      Làm lại bài quiz
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <h5 className="text-lg font-bold text-slate-800 flex items-center">
                          <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
                          Lịch sử làm bài
                        </h5>
                        <button 
                          onClick={clearMathQuizHistory}
                          className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          Xóa lịch sử
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500">
                              <th className="py-3 px-4 font-bold text-left">Ngày</th>
                              <th className="py-3 px-4 font-bold text-right">Điểm</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {mathQuizHistory.map((entry, idx) => (
                              <tr key={idx}>
                                <td className="py-3 px-4 text-slate-600 text-left">{entry.date}</td>
                                <td className="py-3 px-4 font-bold text-indigo-600 text-right">{entry.score}/10</td>
                              </tr>
                            ))}
                            {mathQuizHistory.length === 0 && (
                              <tr>
                                <td colSpan={2} className="py-8 text-slate-400 italic text-center">Chưa có lịch sử làm bài</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : mode === 'lit-quiz' ? (
            <motion.div
              key="lit-quiz-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <PenTool className="w-6 h-6 mr-2 text-rose-600" />
                  📚 Mini Test Ngữ Văn
                </h2>
                <button 
                  onClick={() => setMode('mini-test-select')}
                  className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  ← Đổi môn học
                </button>
              </div>

              <div className="space-y-8">
                {/* Question 1 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 1: Từ Hán Việt là những từ như thế nào?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v1" 
                          value={opt} 
                          checked={litQuizAnswers.v1 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v1: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Là những từ được mượn từ tiếng Hán'}
                          {opt === 'B' && 'Là từ được mượn từ tiếng Hán, trong đó tiếng để cấu tạo từ Hán Việt được gọi là yếu tố Hán Việt'}
                          {opt === 'C' && 'Cả A và B đều đúng'}
                          {opt === 'D' && 'Cả A và B đều sai'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v1 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v1 === 'C' ? '✔ Đúng' : `✘ Sai (Đáp án: C)`}
                    </p>
                  )}
                </div>

                {/* Question 2 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 2: Từ nào có sử dụng từ Hán Việt?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v2" 
                          value={opt} 
                          checked={litQuizAnswers.v2 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v2: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Xã tắc'}
                          {opt === 'B' && 'Ngựa đá'}
                          {opt === 'C' && 'Âu vàng'}
                          {opt === 'D' && 'Cả A và C'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v2 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v2 === 'D' ? '✔ Đúng' : `✘ Sai (Đáp án: D)`}
                    </p>
                  )}
                </div>

                {/* Question 3 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 3: Lỗi lặp từ là gì?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v3" 
                          value={opt} 
                          checked={litQuizAnswers.v3 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v3: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Dùng từ không đúng ngữ cảnh'}
                          {opt === 'B' && 'Dùng sai nghĩa từ'}
                          {opt === 'C' && 'Sắp xếp câu sai nghĩa'}
                          {opt === 'D' && 'Một từ/cụm từ dùng nhiều lần gây nặng nề'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v3 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v3 === 'D' ? '✔ Đúng' : `✘ Sai (Đáp án: D)`}
                    </p>
                  )}
                </div>

                {/* Question 4 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 4: Câu nào mắc lỗi dùng từ?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v4" 
                          value={opt} 
                          checked={litQuizAnswers.v4 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v4: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Tôi rất thích xem phim hài hước Pháp.'}
                          {opt === 'B' && 'Hôm nay nhà có khách hay sao mà ăn uống thịnh soạn thế này hả chị?'}
                          {opt === 'C' && 'Bài thơ gieo vào lòng tôi một nỗi buồn vô cớ.'}
                          {opt === 'D' && 'Tất cả các ý trên đều mắc'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v4 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v4 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>

                {/* Question 5 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 5: Dòng nào đúng cách dẫn gián tiếp?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v5" 
                          value={opt} 
                          checked={litQuizAnswers.v5 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v5: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && "Cúc nói với Mai: 'Bố của tôi rất nghiêm khắc'"}
                          {opt === 'B' && 'Cúc nói với Mai là bố của tôi rất nghiêm khắc.'}
                          {opt === 'C' && 'Cúc nói với Mai là bố của bạn ấy rất nghiêm khắc.'}
                          {opt === 'D' && 'Cúc nói với Mai rằng: bố của tôi rất nghiêm khắc'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v5 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v5 === 'D' ? '✔ Đúng' : `✘ Sai (Đáp án: D)`}
                    </p>
                  )}
                </div>

                {/* Question 6 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 6: Thể loại truyện thần thoại là gì?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v6" 
                          value={opt} 
                          checked={litQuizAnswers.v6 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v6: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Ra đời sớm nhất kể về mẫu hệ'}
                          {opt === 'B' && 'Ra đời sớm nhất kể về yêu tinh'}
                          {opt === 'C' && 'Ra đời sớm nhất kể về thần linh'}
                          {opt === 'D' && 'Ra đời khá sớm kể về thần linh'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v6 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v6 === 'C' ? '✔ Đúng' : `✘ Sai (Đáp án: C)`}
                    </p>
                  )}
                </div>

                {/* Question 7 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 7: Nghĩa của 'bí danh' là gì?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v7" 
                          value={opt} 
                          checked={litQuizAnswers.v7 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v7: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Tên của quả bí'}
                          {opt === 'B' && 'Tên bí mật'}
                          {opt === 'C' && 'Không nghĩ ra tên'}
                          {opt === 'D' && 'Hư danh'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v7 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v7 === 'B' ? '✔ Đúng' : `✘ Sai (Đáp án: B)`}
                    </p>
                  )}
                </div>

                {/* Question 8 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 8: Mạch lạc trong văn bản là gì?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v8" 
                          value={opt} 
                          checked={litQuizAnswers.v8 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v8: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Các phần nói về một đề tài'}
                          {opt === 'B' && 'Rõ ràng về nội dung'}
                          {opt === 'C' && 'Các phần được nối hợp lí làm rõ chủ đề'}
                          {opt === 'D' && 'Rõ ràng trong câu'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v8 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v8 === 'C' ? '✔ Đúng' : `✘ Sai (Đáp án: C)`}
                    </p>
                  )}
                </div>

                {/* Question 9 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 9: Cách dẫn trực tiếp là gì?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v9" 
                          value={opt} 
                          checked={litQuizAnswers.v9 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v9: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Nhắc lại nguyên văn và đặt trong ngoặc kép'}
                          {opt === 'B' && 'Thuật lại có điều chỉnh'}
                          {opt === 'C' && 'Trích theo ý mình'}
                          {opt === 'D' && 'Đặt trong dấu gạch ngang'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v9 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v9 === 'A' ? '✔ Đúng' : `✘ Sai (Đáp án: A)`}
                    </p>
                  )}
                </div>

                {/* Question 10 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Câu 10: 'Thiên' từ nào không nghĩa là trời?</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-rose-50 transition-all">
                        <input 
                          type="radio" 
                          name="v10" 
                          value={opt} 
                          checked={litQuizAnswers.v10 === opt}
                          onChange={(e) => setLitQuizAnswers(prev => ({ ...prev, v10: e.target.value }))}
                          className="mr-3 accent-rose-600"
                          disabled={litQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'Thiên lí'}
                          {opt === 'B' && 'Thiên kiến'}
                          {opt === 'C' && 'Thiên hạ'}
                          {opt === 'D' && 'Thiên thanh'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {litQuizSubmitted && (
                    <p className={`mt-3 font-bold ${litQuizAnswers.v10 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {litQuizAnswers.v10 === 'B' ? '✔ Đúng' : `✘ Sai (Đáp án: B)`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                {!litQuizSubmitted ? (
                  <button
                    onClick={handleLitQuizSubmit}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-rose-200"
                  >
                    Nộp bài
                  </button>
                ) : (
                  <div className="w-full text-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-rose-50 p-6 rounded-3xl border border-rose-100 mb-6"
                    >
                      <h3 className="text-2xl font-bold text-rose-900 mb-2">Điểm: {litQuizScore}/10</h3>
                      <div className="text-rose-600 font-medium space-y-2">
                        <p>{litQuizScore <= 3 && "❌ Cần cố gắng hơn! Bạn chưa nắm vững kiến thức cơ bản."}</p>
                        <p>{(litQuizScore >= 4 && litQuizScore <= 6) && "⚠ Mức trung bình. Hãy ôn tập kỹ hơn các phần lý thuyết."}</p>
                        <p>{(litQuizScore >= 7 && litQuizScore <= 8) && "👍 Khá tốt! Bạn có nền tảng kiến thức ổn định."}</p>
                        <p>{litQuizScore >= 9 && "🔥 Tuyệt vời! Bạn nắm rất chắc kiến thức Ngữ văn."}</p>
                        
                        <p className="text-sm mt-4 pt-4 border-t border-rose-100">
                          {litQuizScore <= 5 ? "👉 Nên đọc thêm sách giáo khoa và luyện tập các dạng bài tập tiếng Việt." : "👉 Tiếp tục duy trì phong độ và thử sức với các đề thi nâng cao."}
                        </p>
                      </div>
                    </motion.div>
                    <button
                      onClick={resetLitQuiz}
                      className="text-rose-600 font-bold hover:underline mb-8 block mx-auto"
                    >
                      Làm lại bài quiz
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <h5 className="text-lg font-bold text-slate-800 flex items-center">
                          <PenTool className="w-5 h-5 mr-2 text-rose-600" />
                          Lịch sử làm bài
                        </h5>
                        <button 
                          onClick={clearLitQuizHistory}
                          className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          Xóa lịch sử
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500">
                              <th className="py-3 px-4 font-bold text-left">Ngày</th>
                              <th className="py-3 px-4 font-bold text-right">Điểm</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {litQuizHistory.map((entry, idx) => (
                              <tr key={idx}>
                                <td className="py-3 px-4 text-slate-600 text-left">{entry.date}</td>
                                <td className="py-3 px-4 font-bold text-rose-600 text-right">{entry.score}/10</td>
                              </tr>
                            ))}
                            {litQuizHistory.length === 0 && (
                              <tr>
                                <td colSpan={2} className="py-8 text-slate-400 italic text-center">Chưa có lịch sử làm bài</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : mode === 'eng-quiz' ? (
            <motion.div
              key="eng-quiz-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Languages className="w-6 h-6 mr-2 text-emerald-600" />
                  📚 Mini Test Tiếng Anh
                </h2>
                <button 
                  onClick={() => setMode('mini-test-select')}
                  className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  ← Đổi môn học
                </button>
              </div>

              <div className="space-y-8">
                {/* Question 1 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 1: “Give me another chance, ___?”</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a1" 
                          value={opt} 
                          checked={engQuizAnswers.a1 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a1: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'don’t you'}
                          {opt === 'B' && 'aren’t you'}
                          {opt === 'C' && 'shall you'}
                          {opt === 'D' && 'will you'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a1 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a1 === 'D' ? '✔ Correct' : `✘ Incorrect (Answer: D)`}
                    </p>
                  )}
                </div>

                {/* Question 2 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 2: She couldn't help ___ at.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a2" 
                          value={opt} 
                          checked={engQuizAnswers.a2 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a2: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'laugh'}
                          {opt === 'B' && 'laughing'}
                          {opt === 'C' && 'to laugh'}
                          {opt === 'D' && 'to laughing'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a2 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a2 === 'B' ? '✔ Correct' : `✘ Incorrect (Answer: B)`}
                    </p>
                  )}
                </div>

                {/* Question 3 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 3: If I ___ you, I would study harder.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a3" 
                          value={opt} 
                          checked={engQuizAnswers.a3 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a3: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'am'}
                          {opt === 'B' && 'was'}
                          {opt === 'C' && 'were'}
                          {opt === 'D' && 'be'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a3 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a3 === 'C' ? '✔ Correct' : `✘ Incorrect (Answer: C)`}
                    </p>
                  )}
                </div>

                {/* Question 4 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 4: She has lived here ___ 2015.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a4" 
                          value={opt} 
                          checked={engQuizAnswers.a4 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a4: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'since'}
                          {opt === 'B' && 'for'}
                          {opt === 'C' && 'from'}
                          {opt === 'D' && 'in'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a4 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a4 === 'A' ? '✔ Correct' : `✘ Incorrect (Answer: A)`}
                    </p>
                  )}
                </div>

                {/* Question 5 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 5: The book ___ by my teacher.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a5" 
                          value={opt} 
                          checked={engQuizAnswers.a5 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a5: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'wrote'}
                          {opt === 'B' && 'was written'}
                          {opt === 'C' && 'is writing'}
                          {opt === 'D' && 'writes'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a5 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a5 === 'B' ? '✔ Correct' : `✘ Incorrect (Answer: B)`}
                    </p>
                  )}
                </div>

                {/* Question 6 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 6: I wish I ___ a bird.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a6" 
                          value={opt} 
                          checked={engQuizAnswers.a6 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a6: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'am'}
                          {opt === 'B' && 'was'}
                          {opt === 'C' && 'were'}
                          {opt === 'D' && 'be'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a6 === 'C' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a6 === 'C' ? '✔ Correct' : `✘ Incorrect (Answer: C)`}
                    </p>
                  )}
                </div>

                {/* Question 7 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 7: He is the man ___ I met yesterday.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a7" 
                          value={opt} 
                          checked={engQuizAnswers.a7 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a7: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'who'}
                          {opt === 'B' && 'whom'}
                          {opt === 'C' && 'which'}
                          {opt === 'D' && 'whose'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a7 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a7 === 'B' ? '✔ Correct' : `✘ Incorrect (Answer: B)`}
                    </p>
                  )}
                </div>

                {/* Question 8 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 8: By the time we arrived, the train ___.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a8" 
                          value={opt} 
                          checked={engQuizAnswers.a8 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a8: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'leaves'}
                          {opt === 'B' && 'left'}
                          {opt === 'C' && 'has left'}
                          {opt === 'D' && 'had left'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a8 === 'D' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a8 === 'D' ? '✔ Correct' : `✘ Incorrect (Answer: D)`}
                    </p>
                  )}
                </div>

                {/* Question 9 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 9: She is interested ___ learning English.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a9" 
                          value={opt} 
                          checked={engQuizAnswers.a9 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a9: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'in'}
                          {opt === 'B' && 'on'}
                          {opt === 'C' && 'at'}
                          {opt === 'D' && 'about'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a9 === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a9 === 'A' ? '✔ Correct' : `✘ Incorrect (Answer: A)`}
                    </p>
                  )}
                </div>

                {/* Question 10 */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">Question 10: I am looking forward to ___ you.</p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input 
                          type="radio" 
                          name="a10" 
                          value={opt} 
                          checked={engQuizAnswers.a10 === opt}
                          onChange={(e) => setEngQuizAnswers(prev => ({ ...prev, a10: e.target.value }))}
                          className="mr-3 accent-emerald-600"
                          disabled={engQuizSubmitted}
                        />
                        <span className="text-slate-700">
                          {opt === 'A' && 'see'}
                          {opt === 'B' && 'seeing'}
                          {opt === 'C' && 'to see'}
                          {opt === 'D' && 'saw'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {engQuizSubmitted && (
                    <p className={`mt-3 font-bold ${engQuizAnswers.a10 === 'B' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engQuizAnswers.a10 === 'B' ? '✔ Correct' : `✘ Incorrect (Answer: B)`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                {!engQuizSubmitted ? (
                  <button
                    onClick={handleEngQuizSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-200"
                  >
                    Nộp bài
                  </button>
                ) : (
                  <div className="w-full text-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6"
                    >
                      <h3 className="text-2xl font-bold text-emerald-900 mb-2">Kết quả: {engQuizScore}/10 điểm</h3>
                      <div className="text-emerald-600 font-medium space-y-2">
                        <p>{engQuizScore <= 3 && "❌ Cần cố gắng hơn! Bạn chưa nắm vững kiến thức cơ bản."}</p>
                        <p>{(engQuizScore >= 4 && engQuizScore <= 6) && "⚠ Mức trung bình. Hãy ôn tập kỹ hơn."}</p>
                        <p>{(engQuizScore >= 7 && engQuizScore <= 8) && "👍 Khá tốt! Bạn có nền tảng kiến thức ổn định."}</p>
                        <p>{engQuizScore >= 9 && "🔥 Tuyệt vời! Bạn nắm rất chắc kiến thức Tiếng Anh."}</p>
                      </div>
                    </motion.div>
                    <button
                      onClick={resetEngQuiz}
                      className="text-emerald-600 font-bold hover:underline mb-8 block mx-auto"
                    >
                      Làm lại bài quiz
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <h5 className="text-lg font-bold text-slate-800 flex items-center">
                          <PenTool className="w-5 h-5 mr-2 text-emerald-600" />
                          Lịch sử làm bài
                        </h5>
                        <button 
                          onClick={clearEngQuizHistory}
                          className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          Xóa lịch sử
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-slate-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500">
                              <th className="py-3 px-4 font-bold text-left">Ngày</th>
                              <th className="py-3 px-4 font-bold text-right">Điểm</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {engQuizHistory.map((entry, idx) => (
                              <tr key={idx}>
                                <td className="py-3 px-4 text-slate-600 text-left">{entry.date}</td>
                                <td className="py-3 px-4 font-bold text-emerald-600 text-right">{entry.score}/10</td>
                              </tr>
                            ))}
                            {engQuizHistory.length === 0 && (
                              <tr>
                                <td colSpan={2} className="py-8 text-slate-400 italic text-center">Chưa có lịch sử làm bài</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : mode === 'game-home' ? (
            <motion.div
              key="game-home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-12 text-center mb-8"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-6">🎮 Khu vui chơi học tập</h1>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Vừa học vừa chơi với các trò chơi trí tuệ hấp dẫn. Hãy chọn một trò chơi để bắt đầu!
              </p>
              
              <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
                <div className="space-y-2">
                  <button 
                    onClick={() => setMode('eng-game')}
                    className="w-full group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Languages className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-800">Trò chơi Tiếng Anh</span>
                      <span className="text-xs text-slate-500">15 câu hỏi & Bảng xếp hạng</span>
                    </div>
                  </button>
                  <button 
                    onClick={clearEngLeaderboard}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                  >
                    🗑️ Xóa xếp hạng Anh
                  </button>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setMode('math-game')}
                    className="w-full group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Calculator className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-800">Thử thách Toán học</span>
                      <span className="text-xs text-slate-500">12 câu hỏi & Bảng xếp hạng</span>
                    </div>
                  </button>
                  <button 
                    onClick={clearMathLeaderboard}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                  >
                    🗑️ Xóa xếp hạng Toán
                  </button>
                </div>
              </div>
            </motion.div>
          ) : mode === 'math-game' ? (
            <motion.div
              key="math-game-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-indigo-600" />
                  🧮 Math Challenge - Mã 101
                </h2>
                <button 
                  onClick={() => setMode('game-home')}
                  className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  ← Đổi trò chơi
                </button>
              </div>

              {mathGameState === 'start' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calculator className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Math Challenge - Mã 101</h3>
                  <p className="text-slate-500 mb-8">Kiểm tra tư duy toán học với 12 câu hỏi trắc nghiệm nâng cao.</p>
                  
                  <div className="max-w-xs mx-auto space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nhập tên của bạn..." 
                      value={mathPlayerName}
                      onChange={(e) => setMathPlayerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button 
                      onClick={startMathGame}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                    >
                      🚀 Bắt đầu ngay
                    </button>
                  </div>
                </div>
              )}

              {mathGameState === 'playing' && mathActiveQuestions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Câu {mathCurrentIndex + 1}/12
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      Điểm: {mathScore}
                    </span>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 tex2jax_process">
                    <p className="text-lg font-bold text-slate-800 mb-6">
                      {mathActiveQuestions[mathCurrentIndex].q}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {mathActiveQuestions[mathCurrentIndex].options.map((opt: string, idx: number) => {
                        const isSelected = mathSelectedOption === idx;
                        const isCorrect = idx === mathActiveQuestions[mathCurrentIndex].answer;
                        const showCorrect = mathSelectedOption !== null && isCorrect;
                        const showWrong = isSelected && !isCorrect;

                        return (
                          <button
                            key={idx}
                            onClick={() => checkMathAnswer(idx)}
                            disabled={mathSelectedOption !== null}
                            className={`p-4 rounded-xl border text-left transition-all font-medium ${
                              showCorrect 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                                : showWrong 
                                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100'
                                : isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {mathFeedback.text && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl text-center font-bold ${
                          mathFeedback.type === 'correct' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                        }`}
                      >
                        {mathFeedback.text}
                      </motion.div>
                    )}
                  </div>

                  {mathSelectedOption !== null && (
                    <button
                      onClick={nextMathQuestion}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                    >
                      {mathCurrentIndex + 1 === mathActiveQuestions.length ? "Xem kết quả" : "Câu tiếp theo →"}
                    </button>
                  )}
                </div>
              )}

              {mathGameState === 'end' && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành!</h3>
                  <p className="text-slate-500 mb-6">Chúc mừng <span className="font-bold text-indigo-600">{mathPlayerName}</span> đã hoàn thành thử thách.</p>
                  
                  <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 mb-8">
                    <p className="text-slate-600 font-medium mb-1">Tổng điểm của bạn</p>
                    <h4 className="text-5xl font-black text-indigo-600">{mathScore}/12</h4>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h5 className="text-lg font-bold text-slate-800 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                        Bảng xếp hạng (Top 5)
                      </h5>
                      <button 
                        onClick={clearMathLeaderboard}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        Xóa bảng
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500">
                            <th className="py-3 px-4 font-bold text-left">Hạng</th>
                            <th className="py-3 px-4 font-bold text-left">Tên</th>
                            <th className="py-3 px-4 font-bold text-right">Điểm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mathLeaderboard.map((entry, idx) => (
                            <tr key={idx} className={entry.name === mathPlayerName ? "bg-indigo-50/50" : ""}>
                              <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-3 px-4 font-bold text-slate-700">{entry.name}</td>
                              <td className="py-3 px-4 font-bold text-indigo-600 text-right">{entry.score}</td>
                            </tr>
                          ))}
                          {mathLeaderboard.length === 0 && (
                            <tr>
                              <td colSpan={3} className="py-8 text-slate-400 italic text-center">Chưa có dữ liệu xếp hạng</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h5 className="text-lg font-bold text-slate-800 flex items-center">
                        <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
                        Lịch sử làm bài
                      </h5>
                      <button 
                        onClick={clearMathHistory}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        Xóa lịch sử
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500">
                            <th className="py-3 px-4 font-bold text-left">Ngày</th>
                            <th className="py-3 px-4 font-bold text-right">Điểm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mathHistory.map((entry, idx) => (
                            <tr key={idx}>
                              <td className="py-3 px-4 text-slate-600 text-left">{entry.date}</td>
                              <td className="py-3 px-4 font-bold text-indigo-600 text-right">{entry.score}/{entry.total}</td>
                            </tr>
                          ))}
                          {mathHistory.length === 0 && (
                            <tr>
                              <td colSpan={2} className="py-8 text-slate-400 italic text-center">Chưa có lịch sử làm bài</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button 
                    onClick={resetMathGame}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all"
                  >
                    🔄 Chơi lại
                  </button>
                </div>
              )}
            </motion.div>
          ) : mode === 'eng-game' ? (
            <motion.div
              key="eng-game-mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Languages className="w-6 h-6 mr-2 text-emerald-600" />
                  🎮 Trò chơi Tiếng Anh
                </h2>
                <button 
                  onClick={() => setMode('game-home')}
                  className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  ← Đổi trò chơi
                </button>
              </div>

              {engGameState === 'start' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Languages className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">English Vocabulary & Grammar</h3>
                  <p className="text-slate-500 mb-8">Kiểm tra trình độ tiếng Anh với 15 câu hỏi trắc nghiệm.</p>
                  
                  <div className="max-w-xs mx-auto space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nhập tên của bạn..." 
                      value={engPlayerName}
                      onChange={(e) => setEngPlayerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <button 
                      onClick={startEngGame}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all"
                    >
                      🚀 Bắt đầu ngay
                    </button>
                  </div>
                </div>
              )}

              {engGameState === 'playing' && engActiveQuestions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Câu {engCurrentIndex + 1}/15
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      Điểm: {engQuizScore}
                    </span>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-lg font-bold text-slate-800 mb-6">
                      {engActiveQuestions[engCurrentIndex].q}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {engActiveQuestions[engCurrentIndex].options.map((opt: string, idx: number) => {
                        const isSelected = engSelectedOption === idx;
                        const isCorrect = idx === engActiveQuestions[engCurrentIndex].answer;
                        const showCorrect = engSelectedOption !== null && isCorrect;
                        const showWrong = isSelected && !isCorrect;

                        return (
                          <button
                            key={idx}
                            onClick={() => checkEngAnswer(idx)}
                            disabled={engSelectedOption !== null}
                            className={`p-4 rounded-xl border text-left transition-all font-medium ${
                              showCorrect 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                                : showWrong 
                                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100'
                                : isSelected
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {engFeedback.text && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-xl text-center font-bold ${
                          engFeedback.type === 'correct' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                        }`}
                      >
                        {engFeedback.text}
                      </motion.div>
                    )}
                  </div>

                  {engSelectedOption !== null && (
                    <button
                      onClick={nextEngQuestion}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                    >
                      {engCurrentIndex + 1 === engActiveQuestions.length ? "Xem kết quả" : "Câu tiếp theo →"}
                    </button>
                  )}
                </div>
              )}

              {engGameState === 'end' && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành!</h3>
                  <p className="text-slate-500 mb-6">Chúc mừng <span className="font-bold text-emerald-600">{engPlayerName}</span> đã hoàn thành bài thi.</p>
                  
                  <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 mb-8">
                    <p className="text-slate-600 font-medium mb-1">Tổng điểm của bạn</p>
                    <h4 className="text-5xl font-black text-emerald-600">{engQuizScore}/15</h4>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h5 className="text-lg font-bold text-slate-800 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />
                        Bảng xếp hạng (Top 5)
                      </h5>
                      <button 
                        onClick={clearEngLeaderboard}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        Xóa bảng
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500">
                            <th className="py-3 px-4 font-bold text-left">Hạng</th>
                            <th className="py-3 px-4 font-bold text-left">Tên</th>
                            <th className="py-3 px-4 font-bold text-right">Điểm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {engLeaderboard.map((entry, idx) => (
                            <tr key={idx} className={entry.name === engPlayerName ? "bg-emerald-50/50" : ""}>
                              <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-3 px-4 font-bold text-slate-700">{entry.name}</td>
                              <td className="py-3 px-4 font-bold text-emerald-600 text-right">{entry.score}</td>
                            </tr>
                          ))}
                          {engLeaderboard.length === 0 && (
                            <tr>
                              <td colSpan={3} className="py-8 text-slate-400 italic text-center">Chưa có dữ liệu xếp hạng</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h5 className="text-lg font-bold text-slate-800 flex items-center">
                        <PenTool className="w-5 h-5 mr-2 text-emerald-600" />
                        Lịch sử làm bài
                      </h5>
                      <button 
                        onClick={clearEngHistory}
                        className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        Xóa lịch sử
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500">
                            <th className="py-3 px-4 font-bold text-left">Ngày</th>
                            <th className="py-3 px-4 font-bold text-right">Điểm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {engHistory.map((entry, idx) => (
                            <tr key={idx}>
                              <td className="py-3 px-4 text-slate-600 text-left">{entry.date}</td>
                              <td className="py-3 px-4 font-bold text-emerald-600 text-right">{entry.score}/{entry.total}</td>
                            </tr>
                          ))}
                          {engHistory.length === 0 && (
                            <tr>
                              <td colSpan={2} className="py-8 text-slate-400 italic text-center">Chưa có lịch sử làm bài</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button 
                    onClick={resetEngGame}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all"
                  >
                    🔄 Chơi lại
                  </button>
                </div>
              )}
            </motion.div>
          ) : null}
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 tex2jax_process">
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
