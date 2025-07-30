// src/services/entertainmentService.js

export let storyData = [
  {
    id: 1,
    title: "Truyện ngụ ngôn: Con cáo và chùm nho",
    description: "Một câu chuyện kinh điển về sự nỗ lực và thất vọng.",
    genre: "story", // Thể loại: story, comic, game, quiz, other
    status: "published", // Trạng thái: published, draft, archived
    chapter: 1, // Mới: Số chương
    topic: "Ngụ ngôn cuộc sống", // Mới: Tên chủ đề
    imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Story1",
    content: "Ngày xửa ngày xưa, có một con cáo đi ngang qua một vườn nho...",
  },
  {
    id: 2,
    title: "Truyện tranh: Doraemon - Tập 1",
    description:
      "Những cuộc phiêu lưu đầu tiên của Nobita và mèo máy Doraemon.",
    genre: "comic",
    status: "published",
    chapter: 1,
    topic: "Khoa học viễn tưởng",
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Comic1",
    content: "Nobita là một cậu bé hậu đậu, luôn gặp rắc rối...",
  },
  {
    id: 3,
    title: "Trò chơi: Ghép chữ Kanji - Cấp độ Sơ cấp",
    description: "Rèn luyện khả năng nhận biết Kanji qua trò chơi nối chữ.",
    genre: "game",
    status: "published",
    chapter: null, // Không áp dụng chương cho trò chơi này
    topic: "Kanji N5",
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Game1",
    content: "Kéo và thả các mảnh ghép để tạo thành từ Kanji hoàn chỉnh.",
  },
  {
    id: 4,
    title: "Câu đố: Bạn hiểu về Nhật Bản đến đâu? - Văn hóa",
    description: "Kiểm tra kiến thức của bạn về văn hóa, địa lý Nhật Bản.",
    genre: "quiz",
    status: "published",
    chapter: null,
    topic: "Văn hóa Nhật Bản",
    imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Quiz1",
    content: "Câu hỏi 1: Thủ đô của Nhật Bản là gì?",
  },
  {
    id: 5,
    title: "Bản nháp: Cuộc phiêu lưu của Ninja - Chương 1",
    description: "Một câu chuyện chưa hoàn chỉnh về một ninja trẻ tuổi.",
    genre: "story",
    status: "draft", // Bản nháp
    chapter: 1,
    topic: "Phiêu lưu kỳ ảo",
    imageUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Draft1",
    content:
      "Sakura, một ninja tập sự, đang trên đường thực hiện nhiệm vụ đầu tiên...",
  },
  {
    id: 6,
    title: "Lưu trữ: Các thành ngữ tiếng Nhật hài hước",
    description: "Tổng hợp các thành ngữ và cách dùng trong tiếng Nhật.",
    genre: "other",
    status: "archived", // Lưu trữ
    chapter: null,
    topic: "Ngôn ngữ & Thành ngữ",
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Archived1",
    content:
      "1. Saru mo ki kara ochiru (Ngay cả khỉ cũng có lúc ngã từ trên cây).",
  },
  {
    id: 7,
    title: "Truyện ngụ ngôn: Kiến và ve sầu",
    description: "Bài học về sự cần cù và chuẩn bị cho tương lai.",
    genre: "story",
    status: "published",
    chapter: 2, // Chương thứ hai của một bộ truyện ngụ ngôn
    topic: "Ngụ ngôn cuộc sống",
    imageUrl: "https://via.placeholder.com/150/A0A0A0/FFFFFF?text=Story2",
    content: "Mùa hè nóng bức, ve sầu chỉ biết ca hát...",
  },
];

// Hàm hỗ trợ để tạo ID duy nhất cho story mới
function getNextId() {
  return storyData.length > 0 ? Math.max(...storyData.map((s) => s.id)) + 1 : 1;
}

export default {
  getAll() {
    return Promise.resolve([...storyData]);
  },
  add(story) {
    story.id = getNextId();
    // Gán các giá trị mặc định nếu thiếu cho các trường mới
    story.genre = story.genre || "other";
    story.status = story.status || "draft";
    story.chapter = story.chapter !== undefined ? story.chapter : null; // Mặc định là null nếu không có
    story.topic = story.topic || ""; // Mặc định là chuỗi rỗng nếu không có
    storyData.unshift(story); // Thêm vào đầu để hiển thị ngay
    return Promise.resolve();
  },
  update(updatedStory) {
    const index = storyData.findIndex((s) => s.id === updatedStory.id);
    if (index !== -1) {
      storyData.splice(index, 1, { ...storyData[index], ...updatedStory });
    }
    return Promise.resolve();
  },
  remove(id) {
    storyData = storyData.filter((s) => s.id !== id);
    return Promise.resolve();
  },
};
