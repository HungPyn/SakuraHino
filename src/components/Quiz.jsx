import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { questions as fallbackQuestions } from "../data/questions";
import { fetchAndProcessExcel } from "../data/fetchAndProcessExcel";

// ==== ĐỔI CHO PHÙ HỢP BACKEND CỦA BẠN ====
const RESULT_API_BASE = "http://localhost:8080";
// Gợi ý: POST /jlpt/exams/:examId/submissions

// Bản đồ phần thi
const sectionMap = {
  part1: ["Kanji", "Từ vựng", "Ngữ pháp"],
  part2: ["Đọc hiểu"],
  part3: ["Nghe hiểu"],
};

// Thời lượng theo phần (giây)
const sectionDurations = {
  part1: 50 * 60,
  part2: 44 * 60,
  part3: 50 * 60,
};

// 🎵 Audio Player (JS thuần, không TS)
const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
        padding: "0.5rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "400px",
      }}
    >
      <button
        onClick={togglePlay}
        style={{
          backgroundColor: isPlaying ? "#dc2626" : "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <audio ref={audioRef} src={src} controls style={{ flex: 1 }} />
    </div>
  );
};

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận state từ Home
  const {
    examMeta,
    userToken,
    sectionId: sectionIdFromState,
  } = location.state || {};

  // Fallback từ query (giữ tương thích với code cũ)
  const params = new URLSearchParams(location.search);
  const sectionIdFromQuery = params.get("section");

  const sectionId = decodeURIComponent(
    sectionIdFromState || sectionIdFromQuery || ""
  );
  const level = examMeta?.level || params.get("level") || "N2";
  const excelUrl = examMeta?.downloadUrl || params.get("excelUrl") || null;

  const sections = useMemo(() => sectionMap[sectionId] || [], [sectionId]);

  const [answers, setAnswers] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [expandedSections, setExpandedSections] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());

  // Timer theo phần thi
  const expiryTimestamp = new Date();
  const duration = sectionDurations[sectionId] || 3600;
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);
  const { seconds, minutes, hours, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => endQuiz(true),
  });

  // Tải câu hỏi (ưu tiên Excel từ backend, fallback local)
  useEffect(() => {
    const loadQuestions = async () => {
      let sourceData = null;
      try {
        if (excelUrl) {
          // Proxy qua upload-service/auth để tránh CORS (đúng như code cũ của bạn)
          const proxied = `http://localhost:8082/auth/download-excel?url=${encodeURIComponent(
            excelUrl
          )}`;
          sourceData = await fetchAndProcessExcel(proxied);
        }
      } catch (error) {
        console.error("Failed to fetch questions from Excel:", error);
      }

      const finalSource = sourceData || fallbackQuestions;
      if (!finalSource || !finalSource[level]) return;

      const sectionsList = sectionMap[sectionId] || [];

      let allQuestions = [];
      let groupedData = {};
      sectionsList.forEach((section) => {
        const sectionQuestions = finalSource[level]?.[section];
        if (sectionQuestions) {
          const withGroup = sectionQuestions.map((q) => ({
            ...q,
            group: section,
          }));
          groupedData[section] = withGroup;
          allQuestions = allQuestions.concat(withGroup);
        }
      });

      setQuizQuestions(allQuestions);
      setGroupedQuestions(groupedData);
    };

    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, sectionId, excelUrl]);

  const handleAnswerSelect = (questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const getQuestionIndex = (group, questionIndexInGroup) => {
    let totalIndex = 0;
    for (const s of sections) {
      if (s === group) {
        return totalIndex + questionIndexInGroup;
      }
      totalIndex += groupedQuestions[s]?.length || 0;
    }
    return -1;
  };

  const endQuiz = async (auto = false) => {
    pause();

    // Tính điểm
    let finalScore = 0;
    const answerSheet = quizQuestions.map((q, idx) => {
      const chosen = answers[idx] ?? null;
      const correct = q.answer;
      const isCorrect = chosen === correct;
      if (isCorrect) finalScore += 1;
      return {
        index: idx,
        group: q.group,
        question: q.question,
        selected: chosen,
        correct,
        isCorrect,
      };
    });

    // Lưu tiến độ để mở khóa phần tiếp theo (theo user)
    const uid = userToken || "test-user-123";
    if (sectionId) {
      localStorage.setItem(`${uid}_${sectionId}Completed`, "true");
      // Giữ tương thích key cũ (nếu Home đang đọc key không có userId)
      localStorage.setItem(`${sectionId}Completed`, "true");
    }

    // Gọi API nộp bài
    if (examMeta?.id) {
      try {
        setSubmitting(true);
        const payload = {
          examId: examMeta.id,
          sectionId,
          startedAt,
          durationSeconds: duration,
          score: finalScore,
          autoSubmitted: !!auto,
        };

        const res = await fetch(
          `${RESULT_API_BASE}/jlpt/exams/${encodeURIComponent(
            examMeta.id
          )}/submissions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Submit failed");
        // Bạn có thể nhận về {score, rank, ...} nếu backend trả
        // const result = await res.json();
      } catch (e) {
        console.error("Submit error:", e);
        // Không chặn điều hướng sang trang kết quả để UX mượt mà
      } finally {
        setSubmitting(false);
      }
    }

    // Điều hướng sang trang kết quả (giữ hành vi cũ của bạn)
    navigate("/result", {
      state: { score: finalScore, total: quizQuestions.length },
    });
  };

  if (!sectionId) {
    return <p>Thiếu thông tin phần thi. Vui lòng quay lại trang Home.</p>;
  }

  if (quizQuestions.length === 0) return <p>Đang tải câu hỏi...</p>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e3a8a",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            minWidth: 180,
            textAlign: "center",
          }}
        >
          Thời gian còn lại: {String(hours).padStart(2, "0")}:
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <h2 style={{ color: "#333", margin: 0 }}>
          {examMeta?.level || level} -{" "}
          {(sectionMap[sectionId] || []).join(", ")}
        </h2>
        <button
          onClick={() => endQuiz(false)}
          disabled={submitting}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: submitting ? "#9ca3af" : "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, backgroundColor: "#f3f4f6" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "250px",
            backgroundColor: "white",
            padding: "1rem",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "1rem" }}>
            Danh sách câu hỏi
          </h3>
          {(sectionMap[sectionId] || []).map((sectionName) => (
            <div key={sectionName} style={{ marginBottom: "1rem" }}>
              <div
                onClick={() => toggleSection(sectionName)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                }}
              >
                <h4 style={{ margin: 0 }}>{sectionName}</h4>
                <span>{expandedSections[sectionName] ? "▲" : "▼"}</span>
              </div>
              {expandedSections[sectionName] && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {groupedQuestions[sectionName]?.map((_, qIndex) => {
                    const globalIndex = getQuestionIndex(sectionName, qIndex);
                    const answered = answers[globalIndex] != null;
                    return (
                      <button
                        key={globalIndex}
                        onClick={() => {
                          const element = document.getElementById(
                            `question-${globalIndex}`
                          );
                          if (element)
                            element.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "50%",
                          border: "2px solid #d1d5db",
                          backgroundColor: answered ? "#3b82f6" : "transparent",
                          color: answered ? "white" : "#333",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {globalIndex + 1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Question Area */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "2rem",
            }}
          >
            {quizQuestions.map((q, index) => (
              <div
                key={index}
                id={`question-${index}`}
                style={{ marginBottom: "2rem" }}
              >
                {(index === 0 ||
                  q.group !== quizQuestions[index - 1].group) && (
                  <h3
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "0.75rem 1rem",
                      fontWeight: "bold",
                      marginTop: "2rem",
                    }}
                  >
                    {q.group}
                  </h3>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#1e3a8a",
                      color: "white",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      marginRight: "0.75rem",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h2 style={{ margin: 0, color: "#333" }}>{q.question}</h2>
                </div>

                {/* Nghe hiểu */}
                {q.group === "Nghe hiểu" && q.audio && (
                  <AudioPlayer src={q.audio} />
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {q.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      style={{
                        padding: "0.75rem",
                        border: `1px solid ${
                          answers[index] === option ? "#3b82f6" : "#e5e7eb"
                        }`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor:
                          answers[index] === option ? "#dbeafe" : "white",
                        transition: "background-color 0.2s, border-color 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerSelect(index, option)}
                        style={{ marginRight: "0.75rem" }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "2rem", textAlign: "right" }}>
              <button
                onClick={() => endQuiz(false)}
                disabled={submitting}
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: submitting ? "#9ca3af" : "#1e3a4a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
