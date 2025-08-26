import React from 'react';
import { useLocation } from 'react-router-dom';

const Result = () => {
  
  const location = useLocation();
  const { score, total } = location.state;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Kết quả thi</h1>
      <p>Điểm số: {score} / {total}</p>
      <p>Phần trăm: {((score / total) * 100).toFixed(2)}%</p>
      <a href="/">Quay về trang chủ</a>
    </div>
  );
};

export default Result;