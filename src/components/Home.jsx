import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

const isEmulator = /Android/i.test(navigator.userAgent);
const JLPT_SERVICE_BASE = isEmulator
  ? "http://10.0.2.2:8080"
  : "http://localhost:8080";

// Gọi API lấy thông tin bài thi từ backend
async function fetchExamMeta(examId, token) {
  const res = await fetch(
    `${JLPT_SERVICE_BASE}/api/jlpt/user/getForUserWeb?id=${examId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );
  if (!res.ok) throw new Error("Không lấy được thông tin bài thi");
  return res.json();
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSection, setSelectedSection] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [examMeta, setExamMeta] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [examName, setExamName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token1 = params.get("userToken");
    const examId1 = params.get("id");
    let token = token1 || localStorage.getItem("userToken");
    let examId = examId1 || localStorage.getItem("id");
    // let token = null;
    // let examId = null;
    // if (token1 === null && examId1 === null) {
    //   token = token1 || localStorage.getItem("userToken");
    //   examId = examId1 || localStorage.getItem("id");
    // } else {
    //   token = token1;
    //   examId = examId1;
    // }

    if (token) {
      setUserToken(token);
      localStorage.setItem("userToken", token);
      localStorage.setItem("id", examId);
    }

    if (!token || !examId) {
      setError("Thiếu thông tin examId hoặc token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);

        // gọi API backend lấy metadata
        const meta = await fetchExamMeta(examId, token);

        // meta trả ra có excelUrl
        if (!meta.data.downloadUrl) {
          throw new Error("API không trả excelUrl");
        }
        if (!meta.data.examName) {
          throw new Error("API không trả examName");
        } else {
          setExamName(meta.data.examName);
        }

        const downloadUrl = meta.data.downloadUrl;

        const merged = { ...meta, downloadUrl };
        setExamMeta(merged);
        localStorage.setItem("lastExamMeta", JSON.stringify(merged));

        // ==== Load Excel để xác định phần nào có dữ liệu ====
        const res = await fetch(downloadUrl);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const groups = [...new Set(data.map((q) => q.group))];
        console.log("[Home] Groups found in Excel:", groups); // <-- Thêm log này
        const mapping = [
          {
            id: "part1",
            title: "Phần 1",
            groups: ["Kanji", "Từ vựng", "Ngữ pháp"],
          },
          {
            id: "part2",
            title: "Phần 2",
            groups: ["Đọc hiểu"],
          },
          {
            id: "part3",
            title: "Phần 3",
            groups: ["Nghe hiểu"],
          },
        ];

        const filtered = mapping.filter((section) =>
          section.groups.some((g) => groups.includes(g))
        );

        setAvailableSections(filtered);
      } catch (e) {
        console.error(e);
        const cachedMeta = localStorage.getItem("lastExamMeta");
        if (cachedMeta) {
          setExamMeta(JSON.parse(cachedMeta));
        } else {
          setError("Không thể tải thông tin bài thi.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  const isSectionDisabled = (sectionId) => {
    const uid = userToken;
    const p1 = localStorage.getItem(`${uid}_part1Completed`) === "true";
    const p2 = localStorage.getItem(`${uid}_part2Completed`) === "true";

    if (sectionId === "part2") return !p1;
    if (sectionId === "part3") return !p2;
    return false;
  };

  const startQuiz = () => {
    if (!selectedSection || !examMeta?.downloadUrl) return;

    const uid = userToken;

    navigate(`/quiz?section=${encodeURIComponent(selectedSection)}`, {
      state: {
        examMeta,
        userToken: uid,
        sectionId: selectedSection,
      },
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <header
        style={{
          background: "#1a2a44",
          color: "#fff",
          padding: 10,
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#00ff00" }}>
          {examName || "Đang tải bài thi..."}
        </h1>
        {!!examMeta && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <span>Thời gian: {examMeta?.data.examTime || "144 phút"}</span>
            <span>Mã đề: {examMeta?.data.id}</span>
          </div>
        )}
      </header>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <h2 style={{ color: "#00cc00" }}>NỘI DUNG ĐỀ THI</h2>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading &&
          !error &&
          availableSections.map((section) => {
            const disabled = isSectionDisabled(section.id);
            return (
              <div
                key={section.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="radio"
                    name="section"
                    checked={selectedSection === section.id}
                    onChange={() => !disabled && setSelectedSection(section.id)}
                    disabled={disabled}
                  />
                  <span style={{ fontWeight: "bold", color: "#1a2a44" }}>
                    {section.title}
                  </span>
                </div>
                <div>{section.groups.join(" / ")}</div>
              </div>
            );
          })}

        <button
          onClick={startQuiz}
          disabled={!selectedSection || !examMeta?.downloadUrl}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#1a2a44",
            color: "#fff",
            border: "none",
            borderRadius: 5,
          }}
        >
          Vào thi ngay
        </button>
      </div>
    </div>
  );
};

export default Home;
