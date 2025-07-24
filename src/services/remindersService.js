// src/services/remindersService.js

export const reminders = [
  {
    id: 1,
    title: 'Gửi email chào mừng khóa N3',
    userName: 'Nguyễn Văn A',
    time: '09:00',
    type: 'Marketing',
    reachCount: 500, // Số người đã tiếp cận
    createdAt: '2023-01-10',
    status: 'Đã hoàn thành'
  },
  {
    id: 2,
    title: 'Nhắc nhở nộp bài tập N4-Bài 3',
    userName: 'Trần Thị B',
    time: '14:30',
    type: 'Học tập',
    reachCount: 120,
    createdAt: '2023-01-12',
    status: 'Đang chờ'
  },
  {
    id: 3,
    title: 'Thông báo lịch học bù JLPT',
    userName: 'Phạm Văn C',
    time: '10:00',
    type: 'Thông báo',
    reachCount: 80,
    createdAt: '2023-01-15',
    status: 'Đang hoạt động'
  },
  {
    id: 4,
    title: 'Gửi tài liệu bổ trợ ngữ pháp N2',
    userName: 'Lê Thị D',
    time: '11:00',
    type: 'Học tập',
    reachCount: 60,
    createdAt: '2023-01-18',
    status: 'Đã hoàn thành'
  },
  {
    id: 5,
    title: 'Nhắc nhở gia hạn khóa học N5',
    userName: 'Hoàng Văn E',
    time: '16:00',
    type: 'Marketing',
    reachCount: 200,
    createdAt: '2023-01-20',
    status: 'Tạm dừng' // Ví dụ về trạng thái tạm dừng
  },
  {
    id: 6,
    title: 'Thông báo khai giảng khóa N1',
    userName: 'Nguyễn Văn F',
    time: '08:00',
    type: 'Thông báo',
    reachCount: 150,
    createdAt: '2023-02-01',
    status: 'Đang hoạt động'
  },
  {
    id: 7,
    title: 'Email khảo sát mức độ hài lòng',
    userName: 'Phan Thị G',
    time: '13:00',
    type: 'Khảo sát',
    reachCount: 300,
    createdAt: '2023-02-05',
    status: 'Đang chờ'
  },
  {
    id: 8,
    title: 'Nhắc nhở tham gia minigame',
    userName: 'Đỗ Văn H',
    time: '17:00',
    type: 'Sự kiện',
    reachCount: 400,
    createdAt: '2023-02-10',
    status: 'Đã hoàn thành'
  },
  {
    id: 9,
    title: 'Thông báo cập nhật ứng dụng',
    userName: 'Vũ Thị I',
    time: '09:30',
    type: 'Hệ thống',
    reachCount: 1000,
    createdAt: '2023-02-12',
    status: 'Đang hoạt động'
  },
  {
    id: 10,
    title: 'Gửi voucher học thử',
    userName: 'Trịnh Văn K',
    time: '11:30',
    type: 'Marketing',
    reachCount: 700,
    createdAt: '2023-02-15',
    status: 'Đang hoạt động'
  },
  {
    id: 11,
    title: 'Nhắc nhở kiểm tra tiến độ học',
    userName: 'Bùi Thị L',
    time: '15:00',
    type: 'Học tập',
    reachCount: 90,
    createdAt: '2023-02-18',
    status: 'Đang chờ'
  }
];