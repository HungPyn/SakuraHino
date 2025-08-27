import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { questions as fallbackQuestions } from "../data/questions";
import { fetchAndProcessExcel } from "../data/fetchAndProcessExcel";

// ==== ĐỔI CHO PHÙ HỢP BACKEND CỦA BẠN ====
const RESULT_API_BASE = "http://localhost:8080";

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

// 🎵 Audio Player
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

  const {
    examMeta,
    userToken,
    sectionId: sectionIdFromState,
  } = location.state || {};

  const params = new URLSearchParams(location.search);
  const sectionIdFromQuery = params.get("section");

  const sectionId = decodeURIComponent(
    sectionIdFromState || sectionIdFromQuery || ""
  );
  const level = examMeta?.level || params.get("level") || "N2";
  const excelUrl = examMeta?.downloadUrl || params.get("excelUrl") || null;

  const sections = useMemo(() => sectionMap[sectionId] || [], [sectionId]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [textReading, setTextReading] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [expandedSections, setExpandedSections] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );
  const [submitting, setSubmitting] = useState(false);

  const lsStartedKey = `startedAt_${examMeta?.id || "unknown"}_${sectionId}`;
  const [startedAt, setStartedAt] = useState(() => {
    const fromLs = localStorage.getItem(lsStartedKey);
    if (fromLs) return fromLs;
    const now = new Date().toISOString();
    localStorage.setItem(lsStartedKey, now);
    return now;
  });

  const duration = sectionDurations[sectionId] || 3600;
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);

  const endQuizRef = useRef(null);

  const { seconds, minutes, hours, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (endQuizRef.current) endQuizRef.current(true);
    },
  });

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      let sourceData = null;
      try {
        if (excelUrl) {
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

      let allQuestions = [];
      let groupedData = {};
      sections.forEach((section) => {
        const sectionQuestions = finalSource[level]?.[section];
        if (sectionQuestions) {
          const withGroup = sectionQuestions.map((q, idx) => ({
            id: q.id ?? `${section}_${idx}`,
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

  // Fetch audio and text reading
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const examId = localStorage.getItem("id");
        if (!examId) {
          console.error("Không tìm thấy id trong localStorage");
          return;
        }

        const res = await fetch(
          `${RESULT_API_BASE}/api/jlpt/user/getForUserWeb?id=${encodeURIComponent(
            examId
          )}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không lấy được audio/text");
        const data = await res.json();

        setAudioUrl(data.data.audioUrl);
        setTextReading(data.data.textReading);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAudio();
  }, [userToken]);

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
      if (s === group) return totalIndex + questionIndexInGroup;
      totalIndex += groupedQuestions[s]?.length || 0;
    }
    return -1;
  };

  // End quiz
  const endQuiz = async (auto = false) => {
    pause();
    let finalScore = 0;
    let part1 = 0,
      part2 = 0,
      part3 = 0;

    const answerSheet = quizQuestions.map((q, idx) => {
      const chosen = answers[idx] ?? null;
      const correct = q.answer;
      const isCorrect = chosen === correct;
      if (isCorrect) finalScore++;

      if (isCorrect) {
        if (["Kanji", "Từ vựng", "Ngữ pháp"].includes(q.group)) part1++;
        else if (q.group === "Đọc hiểu") part2++;
        else if (q.group === "Nghe hiểu") part3++;
      }

      return {
        index: idx,
        group: q.group,
        question: q.question,
        selected: chosen,
        correct,
        isCorrect,
      };
    });

    const uid = userToken || "test-user-123";
    let currentPartScore = 0;
    if (["part1"].includes(sectionId)) currentPartScore = part1;
    else if (sectionId === "part2") currentPartScore = part2;
    else if (sectionId === "part3") currentPartScore = part3;
    console.log("sectionId", sectionId);

    localStorage.setItem(`${sectionId}_score`, currentPartScore);
    // Lưu trạng thái hoàn thành part
    localStorage.setItem(`${uid}_${sectionId}Completed`, "true");
    // localStorage.setItem(
    //   `${uid}_${sectionId}_score`,
    //   JSON.stringify({ part1, part2, part3, total: finalScore })
    // );

    // Nếu là part3, gửi toàn bộ dữ liệu lên backend
    if (sectionId === "part3") {
      try {
        setSubmitting(true);
        const payload = {
          examId: localStorage.getItem("id"),
          score:
            Number(localStorage.getItem("part1_score") || 0) +
            Number(localStorage.getItem("part2_score") || 0) +
            Number(localStorage.getItem("part3_score") || 0),
          part1: localStorage.getItem(`part1_score`),
          part2: localStorage.getItem(`part2_score`),
          part3: localStorage.getItem(`part3_score`),
        };

        const res = await fetch(`${RESULT_API_BASE}/api/jlpt/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(payload),
        });
        console.log("payload response:", payload);

        if (!res.ok) {
          let errText = await res.text();
          throw new Error(`Submit failed: ${res.status} ${errText}`);
        }
      } catch (e) {
        console.error("Submit error:", e);
      } finally {
        setSubmitting(false);
      }
    }

    // Navigate tới result
    navigate("/result", {
      state: {
        score: finalScore,
        total: quizQuestions.length,
        part1: Number(localStorage.getItem(`part1_score`)),
        part2: Number(localStorage.getItem(`part2_score`)),
        part3: Number(localStorage.getItem(`part3_score`)),
        backend: sectionId === "part3" ? "submitted" : null,
        sectionId,
      },
    });
  };

  useEffect(() => {
    endQuizRef.current = endQuiz;
  }, [endQuiz, answers, quizQuestions, startedAt]);

  if (!sectionId)
    return <p>Thiếu thông tin phần thi. Vui lòng quay lại trang Home.</p>;
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
        <h2 style={{ color: "#333", margin: 0 }}>{sections.join(", ")}</h2>
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
            overflowY: "auto",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "1rem" }}>
            Danh sách câu hỏi
          </h3>
          {sections.map((sectionName) => (
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
                        onClick={() =>
                          document
                            .getElementById(`question-${globalIndex}`)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
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
                key={q.id ?? index}
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
                {q.group === "Nghe hiểu" && index === 0 && (
                  <AudioPlayer src={audioUrl} />
                )}
                {q.group === "Đọc hiểu" && index === 0 && textReading && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      backgroundColor: "#fef3c7",
                      borderRadius: "8px",
                      lineHeight: "1.6",
                    }}
                  >
                    {textReading}
                  </div>
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
