import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const API_BASE = "http://localhost:8080";
const defaultAuthForm = {
  email: "",
  username: "",
  password: "",
};
const defaultRepoUrl = "https://github.com/hajerabegum-hash/FSD";

function safeReadStoredJson(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    localStorage.removeItem(key);
    return fallback;
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.msg || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

function AuthPage({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  setToken,
  setUser,
  loading,
  setLoading,
  message,
  setMessage,
}) {
  const navigate = useNavigate();

  const handleAuthInput = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url =
        authMode === "signup"
          ? `${API_BASE}/api/auth/signup`
          : `${API_BASE}/api/auth/signin`;
      const payload =
        authMode === "signup"
          ? {
              email: String(authForm.email || "")
                .trim()
                .toLowerCase(),
              username: String(authForm.username || "").trim(),
              password: String(authForm.password || "").trim(),
            }
          : {
              email: String(authForm.email || "")
                .trim()
                .toLowerCase(),
              password: String(authForm.password || "").trim(),
            };

      const data = await requestJson(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setToken(data.token);
      setUser(data.user);
      setAuthForm(defaultAuthForm);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(216,180,254,0.30),transparent_26%),linear-gradient(135deg,#fffdf7_0%,#f7f1ff_45%,#eef7ff_100%)] px-4 py-10 text-slate-800 md:px-8 lg:px-12">
      <div className="mx-auto max-w-md rounded-[32px] border border-violet-200/80 bg-white/80 p-6 shadow-2xl shadow-violet-100 backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-pink-300 text-2xl shadow-lg shadow-amber-200/60">
            🐼
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-500">
              AI commit helper
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-violet-900">
              Commita
            </h1>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-violet-100 p-1.5">
            <button
              type="button"
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                authMode === "login"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-violet-500 hover:text-violet-700"
              }`}
              onClick={() => setAuthMode("login")}
            >
              🐰 Sign in
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                authMode === "signup"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-violet-500 hover:text-violet-700"
              }`}
              onClick={() => setAuthMode("signup")}
            >
              🦊 Sign up
            </button>
          </div>

          {authMode === "signup" && (
            <label className="block text-sm font-semibold text-violet-700">
              <span className="mb-2 block">Username</span>
              <input
                name="username"
                value={authForm.username}
                onChange={handleAuthInput}
                placeholder="Your username"
                className="w-full rounded-2xl border border-violet-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          )}

          <label className="block text-sm font-semibold text-violet-700">
            <span className="mb-2 block">Email</span>
            <input
              type="email"
              name="email"
              value={authForm.email}
              onChange={handleAuthInput}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-violet-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block text-sm font-semibold text-violet-700">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleAuthInput}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-violet-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "Please wait..."
              : authMode === "signup"
                ? "🐾 Create account"
                : "🐾 Login"}
          </button>
        </form>

        {message && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage({
  token,
  setToken,
  user,
  setUser,
  setMessage,
  message,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState(defaultRepoUrl);
  const [history, setHistory] = useState([]);
  const [recentSummary, setRecentSummary] = useState([]);

  const summaryLabel = useMemo(() => {
    if (!recentSummary.length) return "No summary generated yet";
    return `Latest summary for ${repoUrl}`;
  }, [recentSummary, repoUrl]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await requestJson(`${API_BASE}/api/summaries/history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(data.history || []);
      } catch (error) {
        if (error.status === 401) {
          setToken("");
          setUser(null);
          setHistory([]);
          setRecentSummary([]);
          setMessage("Your session expired. Please sign in again.");
          navigate("/login", { replace: true });
          return;
        }

        console.error("History load failed:", error);
      }
    };

    loadHistory();
  }, [navigate, token, setToken, setUser, setMessage]);

  const handleGenerateSummary = async () => {
    const cleanRepoUrl = repoUrl.trim();

    if (!token || !cleanRepoUrl) {
      setMessage("Please sign in and enter a repository URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await requestJson(`${API_BASE}/api/summaries/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ githubURL: cleanRepoUrl }),
      });

      setRecentSummary(data.finalSummaryArray || []);
      setHistory((current) => [
        {
          _id: data.savedHistoryId,
          githubURL: data.githubURL,
          finalSummaryArray: data.finalSummaryArray || [],
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setMessage(data.warning || "Summary generated successfully.");
    } catch (error) {
      if (error.status === 401) {
        setToken("");
        setUser(null);
        setRecentSummary([]);
        setHistory([]);
        setMessage("Your session expired. Please sign in again.");
        navigate("/login", { replace: true });
        return;
      }

      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setRecentSummary([]);
    setHistory([]);
    setMessage("Signed out.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(216,180,254,0.30),transparent_26%),linear-gradient(135deg,#fffdf7_0%,#f7f1ff_45%,#eef7ff_100%)] px-4 py-6 text-slate-800 md:px-8 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="animal-shadow rounded-[30px] border border-violet-200/70 bg-white/75 p-6 backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-pink-300 text-2xl shadow-lg shadow-amber-200/60">
              🐼
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-500">
                AI commit helper
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-violet-900">
                Commita
              </h1>
            </div>
          </div>

          <div className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-500">
              Signed in
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-pink-200 text-2xl">
                🐻
              </div>
              <div>
                <h2 className="text-xl font-black text-violet-900">
                  {user?.username || "User"}
                </h2>
                <p className="text-sm text-violet-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 w-full rounded-2xl bg-violet-100 px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-200"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="animal-shadow rounded-[30px] border border-violet-200/70 bg-white/75 p-5 backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-500">
                  Repository
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-violet-900">
                  🐾 Generate commit summary
                </h2>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                Forest mode
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="w-full rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Working..." : "Generate"}
              </button>
            </div>
          </section>

          {message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-800">
              {message}
            </div>
          )}

          <section className="animal-shadow rounded-[30px] border border-violet-200/70 bg-white/75 p-5 backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-violet-900">
                {summaryLabel}
              </h3>
              <span className="text-2xl">🦊</span>
            </div>

            {recentSummary.length ? (
              <div className="space-y-3">
                {recentSummary.map((item, index) => (
                  <article
                    key={`${item.commitHash || index}-${index}`}
                    className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-amber-50 p-4"
                  >
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-500">
                      {item.commitMessage || "Commit summary"}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {item.summary}
                    </p>
                    {item.commitHash && (
                      <small className="mt-3 block text-xs font-medium text-violet-600">
                        {item.commitHash}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-sm text-violet-700">
                🐰 Enter a repo URL and generate a cute commit summary.
              </div>
            )}
          </section>

          <section className="animal-shadow rounded-[30px] border border-violet-200/70 bg-white/75 p-5 backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-violet-900">History</h3>
              <span className="text-2xl">🐻</span>
            </div>

            {history.length ? (
              <div className="soft-scroll max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {history.map((entry) => (
                  <details
                    key={entry._id}
                    open
                    className="rounded-2xl border border-violet-100 bg-violet-50/50 p-3"
                  >
                    <summary className="cursor-pointer list-none text-sm font-bold text-violet-700">
                      {entry.githubURL}
                    </summary>
                    <div className="mt-3 space-y-3">
                      {(entry.finalSummaryArray || []).map((item, index) => (
                        <div
                          key={`${entry._id}-${index}`}
                          className="rounded-2xl border border-violet-100 bg-white/80 p-3"
                        >
                          <strong className="block text-xs uppercase tracking-[0.18em] text-violet-500">
                            {item.commitMessage || "Summary item"}
                          </strong>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {item.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-sm text-violet-700">
                🐼 Your saved summaries will appear here.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(defaultAuthForm);
  const [token, setToken] = useState(
    () => localStorage.getItem("commita-token") || "",
  );
  const [user, setUser] = useState(() => safeReadStoredJson("commita-user"));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("commita-token", token);
    } else {
      localStorage.removeItem("commita-token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("commita-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("commita-user");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <AuthPage
              authMode={authMode}
              setAuthMode={setAuthMode}
              authForm={authForm}
              setAuthForm={setAuthForm}
              setToken={setToken}
              setUser={setUser}
              loading={loading}
              setLoading={setLoading}
              message={message}
              setMessage={setMessage}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <DashboardPage
                token={token}
                setToken={setToken}
                user={user}
                setUser={setUser}
                loading={loading}
                setLoading={setLoading}
                message={message}
                setMessage={setMessage}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
