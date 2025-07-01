// src/services/JLPTService.js

// Simulate data storage for JLPT tests
let jlptTests = [
  {
    id: 1,
    title: 'Đề thi N5 tháng 7 năm 2023',
    level: 'N5',
    type: 'real',
    year: 2023,
    scored: true,
    config: { // Simulated configuration data
      passingScore: 80,
      timeLimitMinutes: 100,
      sectionsEnabled: { listening: true, grammar: true, reading: true },
      // More config fields can be added here
    }
  },
  {
    id: 2,
    title: 'Đề thi N4 tháng 12 năm 2023',
    level: 'N4',
    type: 'real',
    year: 2023,
    scored: false,
    config: {
      passingScore: 90,
      timeLimitMinutes: 120,
      sectionsEnabled: { listening: true, grammar: true, reading: true },
    }
  },
  {
    id: 3,
    title: 'Đề thi thử N3 tổng hợp',
    level: 'N3',
    type: 'mock',
    year: 2024,
    scored: true,
    config: {
      passingScore: 95,
      timeLimitMinutes: 150,
      sectionsEnabled: { listening: true, grammar: true, reading: true, vocabulary: true },
    }
  },
  {
    id: 4,
    title: 'Đề thi N2 tháng 7 năm 2022',
    level: 'N2',
    type: 'real',
    year: 2022,
    scored: true,
    config: {
      passingScore: 100,
      timeLimitMinutes: 170,
      sectionsEnabled: { listening: true, grammar: true, reading: true, vocabulary: true },
    }
  },
  {
    id: 5,
    title: 'Đề thi thử N1 cấp tốc',
    level: 'N1',
    type: 'mock',
    year: 2024,
    scored: false,
    config: {
      passingScore: 110,
      timeLimitMinutes: 180,
      sectionsEnabled: { listening: true, grammar: true, reading: true, vocabulary: true, kanji: true },
    }
  },
  {
    id: 6,
    title: 'Đề thi N5 tháng 12 năm 2022',
    level: 'N5',
    type: 'real',
    year: 2022,
    scored: true,
    config: {
      passingScore: 85,
      timeLimitMinutes: 90,
      sectionsEnabled: { listening: true, grammar: true },
    }
  },
  {
    id: 7,
    title: 'Đề thi thử N4 Nghe hiểu',
    level: 'N4',
    type: 'mock',
    year: 2023,
    scored: false,
    config: {
      passingScore: 75,
      timeLimitMinutes: 60,
      sectionsEnabled: { listening: true },
    }
  },
  {
    id: 8,
    title: 'Đề thi N3 tháng 7 năm 2021',
    level: 'N3',
    type: 'real',
    year: 2021,
    scored: true,
    config: {
      passingScore: 90,
      timeLimitMinutes: 140,
      sectionsEnabled: { listening: true, grammar: true, reading: true },
    }
  },
];

const getAllTests = () => {
  return [...jlptTests]; // Return a copy to prevent direct mutation
};

const getTestsStats = () => {
  const total = jlptTests.length;
  const real = jlptTests.filter(test => test.type === 'real').length;
  const mock = jlptTests.filter(test => test.type === 'mock').length;
  const scored = jlptTests.filter(test => test.scored).length;
  return { total, real, mock, scored };
};

const saveTest = (test) => {
  if (test.id) {
    // Update existing test
    const index = jlptTests.findIndex(t => t.id === test.id);
    if (index !== -1) {
      // Preserve existing config if not explicitly provided in test
      const existingConfig = jlptTests[index].config;
      jlptTests[index] = { ...test, config: test.config || existingConfig };
    }
  } else {
    // Add new test
    const newId = jlptTests.length ? Math.max(...jlptTests.map(t => t.id)) + 1 : 1;
    // Provide a default config for new tests if not already present
    const defaultConfig = {
      passingScore: 80,
      timeLimitMinutes: 90,
      sectionsEnabled: { listening: true, grammar: true, reading: true, vocabulary: true, kanji: true },
    };
    jlptTests.push({ ...test, id: newId, config: test.config || defaultConfig });
  }
};

const deleteTest = (id) => {
  jlptTests = jlptTests.filter(test => test.id !== id);
};

const getTestConfig = (testId) => {
  const test = jlptTests.find(t => t.id === testId);
  return test ? JSON.parse(JSON.stringify(test.config)) : null; // Return a deep copy
};

const saveTestConfig = (testId, newConfig) => {
  const test = jlptTests.find(t => t.id === testId);
  if (test) {
    test.config = { ...newConfig }; // Update the config object
  }
};

export default {
  getAllTests,
  getTestsStats,
  saveTest,
  deleteTest,
  getTestConfig,
  saveTestConfig,
};
