// src/services/communityService.js

export const communityUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    joinDate: '2023-01-15',
    level: 'N5',
    totalPosts: 25,
    lastActive: '2024-07-20',
    status: 'active'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    joinDate: '2023-03-22',
    level: 'N4',
    totalPosts: 40,
    lastActive: '2024-07-22',
    status: 'active'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    joinDate: '2023-06-01',
    level: 'N3',
    totalPosts: 15,
    lastActive: '2024-07-18',
    status: 'active'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    joinDate: '2023-08-10',
    level: 'N5',
    totalPosts: 10,
    lastActive: '2024-07-21',
    status: 'inactive'
  },
  {
    id: 5,
    name: 'Hoàng Minh E',
    email: 'hoangminhe@example.com',
    joinDate: '2023-11-05',
    level: 'N2',
    totalPosts: 60,
    lastActive: '2024-07-23',
    status: 'active'
  },
  {
    id: 6,
    name: 'Đặng Kim F',
    email: 'dangkima@example.com',
    joinDate: '2024-01-20',
    level: 'N4',
    totalPosts: 30,
    lastActive: '2024-07-19',
    status: 'active'
  },
  {
    id: 7,
    name: 'Võ Thanh G',
    email: 'vothanhg@example.com',
    joinDate: '2024-03-12',
    level: 'N3',
    totalPosts: 5,
    lastActive: '2024-07-15',
    status: 'active'
  },
  {
    id: 8,
    name: 'Bùi Thị H',
    email: 'buithih@example.com',
    joinDate: '2024-05-01',
    level: 'N5',
    totalPosts: 12,
    lastActive: '2024-07-22',
    status: 'active'
  },
  {
    id: 9,
    name: 'Đỗ Quốc I',
    email: 'doquoci@example.com',
    joinDate: '2024-06-18',
    level: 'N4',
    totalPosts: 8,
    lastActive: '2024-07-23',
    status: 'pending'
  },
  {
    id: 10,
    name: 'Lý Kim K',
    email: 'lykimk@example.com',
    joinDate: '2024-07-01',
    level: 'N2',
    totalPosts: 18,
    lastActive: '2024-07-20',
    status: 'active'
  }
];

export const violatedPosts = [
  {
    id: 101,
    title: 'Bài viết quảng cáo spam về khóa học tiếng Nhật giá rẻ',
    author: 'Nguyễn Văn Spam',
    authorId: 99, // Có thể liên kết với id người dùng ảo
    reportDate: '2024-07-21',
    reason: 'Spam, quảng cáo không liên quan',
    status: 'pending_review', // pending_review, rejected, resolved
    content: 'Học tiếng Nhật cấp tốc chỉ trong 1 tháng với giá cực sốc tại trung tâm X. Đăng ký ngay để nhận ưu đãi.'
  },
  {
    id: 102,
    title: 'Nội dung công kích cá nhân thành viên B',
    author: 'Người ẩn danh',
    authorId: 10, // Giả sử là Ly Kim K
    reportDate: '2024-07-20',
    reason: 'Công kích, xúc phạm',
    status: 'pending_review',
    content: 'Bạn B này nói chuyện không có trình độ gì cả, kiến thức kém cỏi. Đừng có tham gia diễn đàn nữa.'
  },
  {
    id: 103,
    title: 'Chia sẻ tài liệu bản quyền sách Minna no Nihongo',
    author: 'Lê Thị Tài Liệu',
    authorId: 8, // Giả sử là Bui Thi H
    reportDate: '2024-07-19',
    reason: 'Vi phạm bản quyền',
    status: 'rejected', // Đã xử lý (bài viết bị xóa)
    content: 'Link tải trọn bộ sách Minna no Nihongo N5-N1 bản PDF nét căng. Ae tải về học nhé: drive.google.com/link-sach-ban-quyen'
  },
  {
    id: 104,
    title: 'Post liên quan đến chính trị nhạy cảm',
    author: 'An Nguy',
    authorId: 7,
    reportDate: '2024-07-18',
    reason: 'Nội dung chính trị nhạy cảm, gây chia rẽ',
    status: 'pending_review',
    content: 'Tôi thấy tình hình kinh tế Nhật Bản thế này là do chính sách của chính phủ XYZ. Rất là tệ.'
  }
];

export const suspiciousUsers = [
  {
    id: 99,
    name: 'Nguyễn Văn Spam',
    email: 'spam.user1@example.com',
    registeredIp: '192.168.1.10',
    detectionReason: 'Tạo nhiều bài viết quảng cáo, hoạt động bất thường',
    detectionDate: '2024-07-21',
    status: 'investigating', // investigating, banned, cleared
    relatedPosts: [101], // ID của các bài viết vi phạm liên quan
    lastLogin: '2024-07-21'
  },
  {
    id: 100,
    name: 'Bot Học Tiếng Nhật',
    email: 'bot.japanese@example.com',
    registeredIp: '192.168.1.11',
    detectionReason: 'Tạo tài khoản tự động, hoạt động như bot',
    detectionDate: '2024-07-20',
    status: 'banned',
    relatedPosts: [],
    lastLogin: '2024-07-20'
  },
  {
    id: 101,
    name: 'Clone Account',
    email: 'clone.acc@example.com',
    registeredIp: '192.168.1.10', // Cùng IP với Nguyễn Văn Spam
    detectionReason: 'Trùng IP với tài khoản bị báo cáo, hoạt động giống nhau',
    detectionDate: '2024-07-19',
    status: 'investigating',
    relatedPosts: [],
    lastLogin: '2024-07-19'
  },
  {
    id: 102,
    name: 'User Spam Ngôn Ngữ',
    email: 'spam.lang@example.com',
    registeredIp: '192.168.1.15',
    detectionReason: 'Sử dụng ngôn ngữ thô tục, công kích người khác',
    detectionDate: '2024-07-18',
    status: 'cleared', // Đã xử lý (người dùng bị cảnh cáo, không phải ảo)
    relatedPosts: [],
    lastLogin: '2024-07-18'
  }
];