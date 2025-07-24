// src/services/learningPathService.js
export const stats = [
  { label: 'Tổng số lộ trình', value: 0, icon: 'bi-journals', color: 'primary' },
  { label: 'Lộ trình đang hoạt động', value: 0, icon: 'bi-play-circle', color: 'success' },
  { label: 'Lộ trình đã hoàn thành', value: 0, icon: 'bi-check-circle', color: 'info' },
  { label: 'Học viên đã tiếp cận', value: 0, icon: 'bi-people', color: 'warning' }
];

export let learningPaths = [
  {
    id: 1,
    pathName: 'Lập trình Web Frontend Nâng cao',
    accessCount: 120, // Số học viên đã tiếp cận
    progressText: '10/12 khóa học',
    progressPercent: 85,
    status: 'Đang học',
    duration: '6 tháng',
    lastActive: '2025-07-20',
    description: 'Lộ trình học chuyên sâu về các framework Frontend như React, Vue, Angular.',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    totalLessons: 120,
    completedLessons: 100,
    teacher: 'Nguyễn Văn A',
    contact: 'nguyenvana@example.com'
  },
  {
    id: 2,
    pathName: 'Phân tích Dữ liệu với Python',
    accessCount: 75,
    progressText: 'Hoàn thành',
    progressPercent: 100,
    status: 'Hoàn thành',
    duration: '3 tháng',
    lastActive: '2025-06-01',
    description: 'Học cách sử dụng Python và các thư viện như Pandas, NumPy, Matplotlib để phân tích dữ liệu.',
    startDate: '2025-03-01',
    endDate: '2025-06-01',
    totalLessons: 60,
    completedLessons: 60,
    teacher: 'Trần Thị B',
    contact: 'tranthib@example.com'
  },
  {
    id: 3,
    pathName: 'Thiết kế UI/UX cơ bản',
    accessCount: 200,
    progressText: '5/8 module',
    progressPercent: 60,
    status: 'Đang học',
    duration: '4 tháng',
    lastActive: '2025-07-18',
    description: 'Giới thiệu về nguyên tắc thiết kế UI/UX, wireframing, prototyping và user testing.',
    startDate: '2025-04-01',
    endDate: '2025-08-01',
    totalLessons: 40,
    completedLessons: 24,
    teacher: 'Lê Văn C',
    contact: 'levanc@example.com'
  },
  {
    id: 4,
    pathName: 'Quản lý dự án Agile/Scrum',
    accessCount: 40,
    progressText: 'Tạm dừng',
    progressPercent: 30,
    status: 'Tạm dừng',
    duration: '2 tháng',
    lastActive: '2025-05-10',
    description: 'Tìm hiểu về phương pháp Agile, khung Scrum và cách áp dụng trong quản lý dự án phần mềm.',
    startDate: '2025-04-01',
    endDate: '2025-06-01',
    totalLessons: 20,
    completedLessons: 6,
    teacher: 'Phạm Thị D',
    contact: 'phamthid@example.com'
  }
];

// Hàm để cập nhật số liệu thống kê (cần được gọi mỗi khi learningPaths thay đổi)
export function updateStats() {
  stats[0].value = learningPaths.length; // Tổng số lộ trình
  stats[1].value = learningPaths.filter(p => p.status === 'Đang học').length; // Đang hoạt động
  stats[2].value = learningPaths.filter(p => p.status === 'Hoàn thành').length; // Đã hoàn thành
  stats[3].value = learningPaths.reduce((sum, p) => sum + p.accessCount, 0); // Tổng số học viên tiếp cận
}

// Gọi updateStats lần đầu khi load service
updateStats();