import { fakeUsers } from "../../../units/fakeUsers"; // Điều chỉnh đường dẫn tương đối
import { useBoundStore } from "../../../hooks/useBoundStore"; // Điều chỉnh đường dẫn tương đối

export const useLeaderboardUsers = () => {
  const xpThisWeek = useBoundStore((x) => x.xpThisWeek());
  const name = useBoundStore((x) => x.name);

  // Tạo đối tượng người dùng hiện tại
  const userInfo = {
    name,
    xp: xpThisWeek,
    isCurrentUser: true,
  } as const;

  // Kết hợp danh sách người dùng giả và người dùng hiện tại, sau đó sắp xếp theo XP giảm dần
  return [...fakeUsers, userInfo].sort((a, b) => b.xp - a.xp);
};

export const useLeaderboardRank = () => {
  // Sử dụng hook useLeaderboardUsers đã định nghĩa ở trên
  const leaderboardUsers = useLeaderboardUsers();

  // Tìm vị trí của người dùng hiện tại trong danh sách đã sắp xếp
  const index = leaderboardUsers.findIndex((user) => user.isCurrentUser);

  // Trả về thứ hạng (index + 1) hoặc null nếu không tìm thấy
  return index === -1 ? null : index + 1;
};