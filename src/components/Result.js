import React from "react";
import { useLocation, Link } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  // lấy dữ liệu được truyền khi navigate
  const { part1 = 0, part2 = 0, part3 = 0, total = 0 } = location.state || {};

  const score = part1 + part2 + part3;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : "0.00";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Kết quả thi</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <b>Phần 1:</b> {part1} điểm
        </p>
        <p>
          <b>Phần 2:</b> {part2} điểm
        </p>
        <p>
          <b>Phần 3:</b> {part3} điểm
        </p>
      </div>
      <h2>
        Tổng điểm: {score} / {total}
      </h2>
      <p>Phần trăm: {percentage}%</p>

      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
};

export default Result;
