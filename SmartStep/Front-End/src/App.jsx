import { useEffect, useMemo, useState } from "react";

const starterQuestions = [
  {
    question: "What does AI stand for?",
    options: [
      "Artificial Intelligence",
      "Automatic Input",
      "Advanced Internet",
      "Animated Interface",
    ],
    correctAnswer: "Artificial Intelligence",
  },
  {
    question: "Which skill is most useful in AI development?",
    options: [
      "Problem solving",
      "Sleeping late",
      "Avoiding practice",
      "Skipping learning",
    ],
    correctAnswer: "Problem solving",
  },
];

const leaderboardSeed = [
  { name: "Nia", score: 9 },
  { name: "Aarav", score: 8 },
  { name: "Sarah", score: 7 },
  { name: "Milo", score: 6 },
];

const scoreHistorySeed = [
  { playerName: "Nia", topic: "React", score: 8, total: 10, date: "Today" },
  { playerName: "Aarav", topic: "AI", score: 7, total: 10, date: "Yesterday" },
  {
    playerName: "Sarah",
    topic: "JavaScript",
    score: 9,
    total: 10,
    date: "Mon",
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "" });
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [topic, setTopic] = useState("");
  const [quizCount, setQuizCount] = useState(5);
  const [questions, setQuestions] = useState(starterQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizTimer, setQuizTimer] = useState(600);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [expandedLeaderboard, setExpandedLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState(leaderboardSeed);
  const [scoreHistory, setScoreHistory] = useState(scoreHistorySeed);

  const score = useMemo(() => {
    if (!questions.length) return 0;

    return questions.reduce((count, question, index) => {
      const selected = selectedAnswers[index];
      return count + (selected && selected === question.correctAnswer ? 1 : 0);
    }, 0);
  }, [questions, selectedAnswers]);

  const handleAuthSubmit = (event) => {
    event.preventDefault();

    if (!authForm.name) {
      setError("Please enter your name.");
      return;
    }

    if (!authForm.email || !authForm.password) {
      setError("Please enter email and password.");
      return;
    }

    setUser({
      name: authForm.name.trim(),
      email: authForm.email,
    });
    setIsAuthenticated(true);
    setError("");
    setAuthForm({ name: "", email: "", password: "" });
  };

  const generateQuiz = async () => {
    const cleanTopic = topic.trim() || "General Knowledge";
    const safeCount = Math.max(1, Math.min(100, Number(quizCount) || 5));
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8080/quiz/${encodeURIComponent(cleanTopic)}?count=${safeCount}`,
      );
      const data = await res.json();

      if (!res.ok || !data?.data) {
        throw new Error(data?.message || "Could not generate the quiz.");
      }

      setQuestions(data.data.slice(0, safeCount));
      setSelectedAnswers({});
      setQuizTimer(600);
      setSubmitted(false);
    } catch (err) {
      setError(
        err.message || "Something went wrong while generating the quiz.",
      );
      setQuestions(starterQuestions.slice(0, safeCount));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!questions.length || submitted) {
      return undefined;
    }

    if (quizTimer <= 0) {
      setSubmitted(true);
      return undefined;
    }

    const timerId = setInterval(() => {
      setQuizTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [questions.length, submitted, quizTimer]);

  const handleAnswer = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const submitQuiz = () => {
    const nextScore = score;
    const nextEntry = {
      playerName: user.name || "Guest",
      topic: topic.trim() || "General Knowledge",
      score: nextScore,
      total: questions.length,
      date: "Just now",
    };

    setScoreHistory((prev) => [nextEntry, ...prev].slice(0, 5));
    setLeaderboard((prev) => {
      const updated = [...prev, { name: user.name, score: nextScore }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      return updated;
    });
    setSubmitted(true);
  };

  const shellClass = isDark
    ? "min-h-screen bg-[radial-gradient(circle_at_top,_#111827,_#1e293b_35%,_#0f172a_100%)] text-slate-100"
    : "min-h-screen bg-[radial-gradient(circle_at_top,_#eef9db,_#d8f3c7_35%,_#cfe6c0_100%)] text-slate-800";

  const authPanelClass = isDark
    ? "rounded-[32px] border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(174,107,172,0.22)]"
    : "rounded-[32px] border border-[#d9d9df] bg-white/75 shadow-[0_25px_70px_rgba(123,90,150,0.18)]";
  const authHeroTitleClass = isDark ? "text-white" : "text-slate-900";
  const authHeroTextClass = isDark ? "text-slate-300" : "text-slate-700";
  const authButtonClass = isDark
    ? "rounded-full border border-[#f1d7f2] bg-white/5 px-6 py-3 text-sm font-bold text-[#f8ecfb] shadow-[0_18px_32px_rgba(184,122,178,0.15)] transition hover:bg-white/10"
    : "rounded-full border border-[#d7c3dc] bg-white/80 px-6 py-3 text-sm font-bold text-[#492d54] shadow-[0_18px_32px_rgba(184,122,178,0.12)] transition hover:bg-white";
  const primaryMetricClass = isDark ? "text-[#e9f7dd]" : "text-[#183d2a]";
  const secondaryMetricClass = isDark ? "text-slate-300" : "text-slate-600";
  const softGreenTextClass = isDark ? "text-[#d7f9b5]" : "text-[#173d2d]";
  const labelGreenTextClass = isDark ? "text-[#a8c6a7]" : "text-[#1f5d4d]";
  const sectionLabelTextClass = isDark ? "text-[#a5c9a1]" : "text-[#1c5a47]";

  if (!isAuthenticated) {
    return (
      <div className={`${shellClass} px-4 py-10`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
          <div
            className={`${authPanelClass} flex flex-1 flex-col justify-center p-8 backdrop-blur-xl`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-[0.38em] ${softGreenTextClass}`}
            >
              SmartStep AI
            </p>
            <h1
              className={`mt-4 text-4xl font-black leading-tight md:text-6xl ${authHeroTitleClass}`}
            >
              Learn faster. Quiz smarter.
            </h1>
            <p
              className={`mt-4 max-w-xl text-base md:text-lg ${authHeroTextClass}`}
            >
              Build topic-based quizzes, track your progress, and stay motivated
              with a clean learning system designed for focused growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="animated-gradient rounded-full px-6 py-3 text-sm font-bold text-[#183926] shadow-[0_18px_32px_rgba(153,220,157,0.42)]">
                AI Practice Mode
              </button>
              <button className={authButtonClass}>View Leaderboard</button>
            </div>
          </div>

          <div className="w-full max-w-lg rounded-[32px] border border-[#dcb4e1]/25 bg-[#f3f7f0]/90 p-6 shadow-[0_25px_70px_rgba(123,90,150,0.25)] backdrop-blur-xl dark:bg-[#111827]/80">
            <div className="mb-6 flex gap-2 rounded-full bg-[#edf1eb] p-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-full px-4 py-2 transition ${authMode === "login" ? "bg-[#a9d9a3] text-[#173d2d] shadow-md" : ""}`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 rounded-full px-4 py-2 transition ${authMode === "signup" ? "bg-[#f0d9f3] text-[#5a355d] shadow-md" : ""}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Full Name
                </label>
                <input
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#d9dcd6] bg-white/80 px-4 py-3 text-slate-700 outline-none ring-0 transition focus:border-[#bb7fb3] focus:ring-4 focus:ring-[#f2d9ef]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#d9dcd6] bg-white/80 px-4 py-3 text-slate-700 outline-none transition focus:border-[#bb7fb3] focus:ring-4 focus:ring-[#f2d9ef]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#d9dcd6] bg-white/80 px-4 py-3 text-slate-700 outline-none transition focus:border-[#bb7fb3] focus:ring-4 focus:ring-[#f2d9ef]"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="animated-gradient w-full rounded-2xl px-4 py-3 text-sm font-black text-[#17392e] shadow-[0_18px_32px_rgba(154,218,157,0.42)]"
              >
                {authMode === "login" ? "Continue" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${shellClass} px-4 py-8`}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[#d7c3dc]/40 bg-white/10 p-4 shadow-[0_24px_50px_rgba(145,105,161,0.18)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p
              className={`text-xs font-bold uppercase tracking-[0.32em] ${softGreenTextClass}`}
            >
              SmartStep AI
            </p>
            <h1 className="mt-2 text-3xl font-black text-inherit md:text-4xl">
              Quiz Generator
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="rounded-full border border-[#d7c3dc] bg-[#f2e5f6] px-4 py-2 text-sm font-bold text-[#4d3559] shadow-[0_12px_24px_rgba(199,128,185,0.18)] transition hover:scale-[1.02]"
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-full border border-[#d7c3dc] bg-white/10 px-4 py-2 text-sm font-bold text-inherit"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <main>
            <section className="rounded-[30px] border border-[#d9c8e0]/30 bg-white/10 p-5 shadow-[0_18px_48px_rgba(160,119,165,0.18)] backdrop-blur-xl md:p-6">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  generateQuiz();
                }}
                className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
              >
                <div>
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-[0.22em] ${labelGreenTextClass}`}
                  >
                    Your Name
                  </label>
                  <input
                    value={user.name === "Guest" ? "" : user.name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-[#d8dfe4] bg-white/80 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-[#c88bc6] focus:ring-4 focus:ring-[#f0d5f2]"
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-[0.22em] ${labelGreenTextClass}`}
                  >
                    Quiz Topic / Role
                  </label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your quiz topic or role"
                    className="w-full rounded-2xl border border-[#d8dfe4] bg-white/80 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-[#c88bc6] focus:ring-4 focus:ring-[#f0d5f2]"
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-[0.22em] ${labelGreenTextClass}`}
                  >
                    Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quizCount}
                    onChange={(e) =>
                      setQuizCount(
                        Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                      )
                    }
                    className="w-full rounded-2xl border border-[#d8dfe4] bg-white/80 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-[#c88bc6] focus:ring-4 focus:ring-[#f0d5f2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="animated-gradient rounded-2xl px-6 py-3 text-sm font-black text-[#163b2d] shadow-[0_16px_32px_rgba(154,218,157,0.45)] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-1"
                >
                  {loading ? "Generating..." : "Generate Quiz"}
                </button>
              </form>
            </section>

            {error && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${isDark ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-red-300 bg-red-100 text-red-700"}`}
              >
                {error}
              </div>
            )}

            <section className="mt-6 space-y-5">
              {questions.length > 0 && (
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.2em] ${sectionLabelTextClass}`}
                  >
                    Active Topic
                  </p>
                  <h2 className="text-2xl font-black text-inherit">{topic}</h2>
                </div>
              )}

              {questions.map((item, index) => {
                const selected = selectedAnswers[index];
                const showCorrect = submitted;

                return (
                  <article
                    key={`${item.question}-${index}`}
                    className="rounded-[28px] border border-[#d9d9df] bg-white/10 p-5 shadow-[0_18px_40px_rgba(176,113,170,0.12)] backdrop-blur-xl md:p-6"
                  >
                    <p className="mb-4 text-lg font-bold text-inherit">
                      {index + 1}. {item.question}
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                      {item.options.map((option) => {
                        const isSelected = selected === option;
                        const isCorrect = option === item.correctAnswer;
                        const reveal = showCorrect && (isCorrect || isSelected);

                        let optionClass =
                          "rounded-2xl border px-4 py-3 text-left text-sm font-semibold text-slate-800 transition ";

                        if (showCorrect && isCorrect) {
                          optionClass +=
                            "border-[#2d8f5a] bg-[#dff5e7] text-[#123b2a]";
                        } else if (showCorrect && isSelected && !isCorrect) {
                          optionClass +=
                            "border-[#c23d53] bg-[#fee2e2] text-[#7f1d1d]";
                        } else if (isSelected) {
                          optionClass +=
                            "border-[#c884d0] bg-[#f4e8f8] text-[#4d2d52]";
                        } else {
                          optionClass +=
                            "border-[#dfe3dd] bg-white/70 text-slate-700 hover:border-[#9dc59d] hover:bg-[#edf8ec]";
                        }

                        if (reveal) {
                          optionClass += " ring-2 ring-[#a7d7b2]";
                        }

                        return (
                          <button
                            key={option}
                            onClick={() => handleAnswer(index, option)}
                            className={optionClass}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}

              {questions.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={submitQuiz}
                    className="w-full rounded-full bg-[#f0d9f3] px-4 py-3 text-base font-black text-[#53375d] shadow-[0_12px_26px_rgba(208,137,194,0.28)] transition hover:scale-[1.01]"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[#d9c3df]/25 bg-white/10 p-5 shadow-[0_18px_40px_rgba(125,92,148,0.14)] backdrop-blur-xl">
              <p
                className={`text-xs font-bold uppercase tracking-[0.22em] ${sectionLabelTextClass}`}
              >
                User
              </p>
              <h3 className="mt-2 text-xl font-black text-inherit">
                {user.name}
              </h3>
              <p className={secondaryMetricClass}>{user.email}</p>
            </div>

            <div className="rounded-[28px] border border-[#d9c3df]/25 bg-white/10 p-5 shadow-[0_18px_40px_rgba(125,92,148,0.14)] backdrop-blur-xl">
              <p
                className={`text-xs font-bold uppercase tracking-[0.22em] ${sectionLabelTextClass}`}
              >
                Timer
              </p>
              <div className="mt-4">
                <p className={`text-3xl font-black ${primaryMetricClass}`}>
                  {Math.floor(quizTimer / 60)}:
                  {String(quizTimer % 60).padStart(2, "0")}
                </p>
                <p className={`mt-2 text-sm ${secondaryMetricClass}`}>
                  Total time remaining for this quiz.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9c3df]/25 bg-white/10 p-5 shadow-[0_18px_40px_rgba(125,92,148,0.14)] backdrop-blur-xl">
              <p
                className={`text-xs font-bold uppercase tracking-[0.22em] ${sectionLabelTextClass}`}
              >
                Score Summary
              </p>
              {submitted ? (
                <div className="mt-4">
                  <p className={`text-4xl font-black ${primaryMetricClass}`}>
                    {score}/{questions.length}
                  </p>
                  <p className={`mt-2 text-sm ${secondaryMetricClass}`}>
                    Great work on {topic}.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className={`text-4xl font-black ${primaryMetricClass}`}>
                    0/{questions.length || 0}
                  </p>
                  <p className={`mt-2 text-sm ${secondaryMetricClass}`}>
                    Answer all questions to see your result.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-[#d9c3df]/25 bg-white/10 p-5 shadow-[0_18px_40px_rgba(125,92,148,0.14)] backdrop-blur-xl">
              <p
                className={`text-xs font-bold uppercase tracking-[0.22em] ${sectionLabelTextClass}`}
              >
                Leaderboard
              </p>
              <div className="mt-4 space-y-3">
                {leaderboard.map((entry, index) => {
                  const isOpen = expandedLeaderboard === index;

                  return (
                    <div
                      key={`${entry.name}-${index}`}
                      className="overflow-hidden rounded-2xl bg-[#f7f2fa]/80 text-[#2b2a33]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedLeaderboard(isOpen ? null : index)
                        }
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#bfe4bc] text-sm font-black text-[#183d2a]">
                            {index + 1}
                          </span>
                          <span className="font-semibold">{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#4d3559]">
                            {entry.score}
                          </span>
                          <span className="text-sm font-bold text-[#4d3559]">
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#e5d9ee] bg-white/30 p-3 text-sm text-slate-700">
                          <p className="font-semibold text-[#3a2d42]">
                            {entry.name}'s recent results
                          </p>
                          <div className="mt-2 space-y-1">
                            <p>
                              Latest score:{" "}
                              <span className="font-bold">{entry.score}</span>
                            </p>
                            <p>
                              Rank:{" "}
                              <span className="font-bold">#{index + 1}</span>
                            </p>
                            <p>Performance trend: strong recent results</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9c3df]/25 bg-white/10 p-5 shadow-[0_18px_40px_rgba(125,92,148,0.14)] backdrop-blur-xl">
              <p
                className={`text-xs font-bold uppercase tracking-[0.22em] ${sectionLabelTextClass}`}
              >
                Score History
              </p>
              <div className="mt-4 space-y-3">
                {scoreHistory.map((entry, index) => {
                  const isOpen = expandedAttempt === index;

                  return (
                    <div
                      key={`${entry.playerName || "player"}-${entry.topic}-${index}`}
                      className="overflow-hidden rounded-2xl bg-[#eff8ef]/80 text-[#283a31]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAttempt(isOpen ? null : index)
                        }
                        className="flex w-full items-center justify-between gap-3 p-3 text-left"
                      >
                        <div>
                          <span className="block font-bold">
                            {entry.playerName || "Guest"}
                          </span>
                          <span className="block text-xs font-semibold text-[#4f4a57]">
                            {entry.topic}
                          </span>
                          <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#6d5473]">
                            {entry.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black">
                            {entry.score}/{entry.total}
                          </span>
                          <span className="text-sm font-bold text-[#4d3559]">
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#dfe7dc] bg-white/30 p-3">
                          <p className="text-sm font-semibold text-[#3f3b47]">
                            Attempt details
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-slate-700">
                            <p>
                              Player:{" "}
                              <span className="font-bold">
                                {entry.playerName || "Guest"}
                              </span>
                            </p>
                            <p>
                              Topic:{" "}
                              <span className="font-bold">{entry.topic}</span>
                            </p>
                            <p>
                              Score:{" "}
                              <span className="font-bold">{entry.score}</span>/
                              {entry.total}
                            </p>
                            <p>
                              Date:{" "}
                              <span className="font-bold">{entry.date}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
