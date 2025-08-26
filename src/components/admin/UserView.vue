<template>
  <div class="user-management-container">
    <div class="header mb-4 d-flex justify-content-between align-items-center">
      <h1 class="bi-people">Quản lý Người Dùng</h1>

      <div class="d-flex align-items-end gap-2">
        <div class="search-box flex-grow-1">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên hoặc email..."
            v-model="keyword"
            @change="handleSearch"
          />
          <i class="bi bi-search search-icon"></i>
        </div>

        <div class="flex-grow-1">
          <label for="userStatus" class="form-label visually-hidden"
            >Trạng thái:</label
          >
          <select
            @change="handleSearch"
            class="form-select"
            id="userStatus"
            v-model="userStatus"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BLOCKED">Chặn</option>
            <option value="DELETED">Xóa</option>
          </select>
        </div>

        <button
          type="button"
          @click="resetFilters"
          class="btn btn-outline-secondary"
          title="Đặt lại bộ lọc"
        >
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Avatar</th>
              <th scope="col" class="w-20">Tên người dùng</th>
              <th scope="col">Email</th>
              <th scope="col">Tài khoản</th>

              <th scope="col">Trạng thái</th>
              <th scope="col">Online</th>
              <th scope="col">Ngày tạo</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img
                  :src="user.avatarUrl"
                  class="rounded-circle"
                  width="40"
                  height="40"
                  alt="avatar"
                />
              </td>

              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.username }}</td>

              <td>
                <span
                  :class="[
                    'badge',
                    user.status === 'ACTIVE'
                      ? 'bg-success'
                      : user.status === 'BLOCKED'
                      ? 'bg-warning'
                      : user.status === 'DELETED'
                      ? 'bg-danger'
                      : 'bg-secondary',
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td>
                <i
                  :class="[
                    'bi',
                    user.online
                      ? 'bi-circle-fill text-success'
                      : 'bi-circle text-muted',
                  ]"
                ></i>
              </td>
              <td>{{ formatDate(user.dayCreation) }}</td>
              <td>
                <button
                  @click="editUser(user)"
                  class="btn btn-warning btn-sm me-2"
                >
                  Sửa
                </button>
                <button @click="deleteUser(user)" class="btn btn-danger btn-sm">
                  Xóa
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="8" class="text-center text-muted py-4">
                Không tìm thấy người dùng.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <nav
      aria-label="Page navigation example"
      class="d-flex justify-content-center mt-4"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 0 }">
          <button class="page-link" @click.prevent="goToPage(currentPage - 1)">
            Previous
          </button>
        </li>

        <li
          class="page-item"
          v-for="n in totalPages"
          :key="n - 1"
          :class="{ active: n - 1 === currentPage }"
        >
          <button class="page-link" @click.prevent="goToPage(n - 1)">
            {{ n }}
          </button>
        </li>

        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages - 1 }"
        >
          <button class="page-link" @click.prevent="goToPage(currentPage + 1)">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
  <div
    class="modal fade"
    id="userFormModal"
    tabindex="-1"
    aria-labelledby="userFormModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userFormModalLabel">
            Chỉnh sửa người dùng
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label for="userName" class="form-label">Tên người dùng:</label>
              <input
                type="text"
                class="form-control"
                id="userName"
                v-model="currentUser.name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="userEmail" class="form-label">Email:</label>
              <input
                type="email"
                class="form-control"
                id="userEmail"
                v-model="currentUser.email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="userStatus" class="form-label">Trạng thái:</label>
              <select
                class="form-select"
                id="userStatus"
                v-model="currentUser.status"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="BLOCKED">Chặn</option>
                <option value="DELETED">Xóa</option>
              </select>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import userService from "@/services/userService";
import { ref, computed, onMounted, watch, nextTick } from "vue"; // Đảm bảo đã import `watch`
import Swal from "sweetalert2"; // Thêm dòng này
import { useToast } from "vue-toastification";
import { Modal } from "bootstrap";

const modalRef = ref();
let bsModal = null;

const currentUser = ref({
  id: null,
  nanameme: "",
  email: "",
  status: "",
});

const toast = useToast(); // Giả sử bạn đang sử dụng Vue Toastification hoặc một thư viện tương tự

const users = ref([]);
const keyword = ref("");
const userStatus = ref("");

const filteredUsers = computed(() => {
  const keywordLower = keyword.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(keywordLower) ||
      user.email.toLowerCase().includes(keywordLower)
  );
});

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const currentPage = ref(0); // Trang hiện tại (0-indexed để khớp với backend)
const size = ref(10); // Kích thước trang
const totalPages = ref(0); // Tổng số trang

//xoas usser
const deleteUser = async (user) => {
  const result = await Swal.fire({
    title: `Xác nhận xóa`,
    text: `Bạn có chắc muốn xóa người dùng ${user.name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await userService.deleteUser(user.id);

      // Thông báo xóa thành công
      toast.success(`Đã xóa người dùng thành công!`);
      fetchUsers(); // Cập nhật danh sách người dùng sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  }
};
//mở form chỉnh sửa
function editUser(user) {
  currentUser.value = { ...user }; // Tạo bản sao của đối tượng người dùng để chỉnh sửa
  bsModal.show(); // Hiển thị modal
}
//cập nhật

const updateUser = async () => {
  const result = await Swal.fire({
    title: `Xác nhận chỉnh sửa`,
    text: `Bạn có chắc muốn cập nhật không ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "cập nhật",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed) {
    try {
      await userService.updateUser(currentUser.value.id, currentUser.value);
      toast.success(`Đã cập nhật!`);
      bsModal.hide(); // Ẩn modal sau khi cập nhật thành công
      handleSearch(); // Cập nhật danh sách người dùng sau khi xóa
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
    }
  }
};
//lấy ra user

const fetchUsers = async () => {
  try {
    const response = await userService.getUsers({
      page: currentPage.value, // Gửi giá trị currentPage hiện tại (0-indexed)
      size: size.value,
      keyword: keyword.value,
    });

    users.value = response.users;
    totalPages.value = response.totalPages;

    console.log("Total pages from API:", totalPages.value);
    console.log("Current page (0-indexed):", currentPage.value);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
  }
};

function goToPage(newPage) {
  if (
    newPage >= 0 &&
    newPage < totalPages.value &&
    newPage !== currentPage.value
  ) {
    currentPage.value = newPage;
  } else if (
    totalPages.value === 0 &&
    newPage === 0 &&
    currentPage.value !== 0
  ) {
    currentPage.value = 0;
  }
}

//tim kiem
const resetFilters = async () => {
  userStatus.value = "";
  (keyword.value = ""), fetchUsers();
};
async function handleSearch() {
  try {
    const response = await userService.timKiem(
      currentPage.value,
      size.value,
      keyword.value,
      userStatus.value
    );

    users.value = response.items ?? [];

    totalPages.value = response.totalPages ?? 0;
  } catch (error) {
    console.error("Lỗi khi tìm lesson:", error);
  }
}

// Đặt khối `watch` SAU KHI `currentPage` và `keyword` đã được khai báo
watch([currentPage], () => {
  handleSearch();
});

onMounted(() => {
  // Sử dụng nextTick để đảm bảo DOM đã được render trước khi truy cập ref
  nextTick(() => {
    if (modalRef.value) {
      bsModal = new Modal(modalRef.value);
      console.log("Bootstrap Modal initialized successfully!");
    } else {
      console.error(
        "modalRef is null in onMounted nextTick. Modal element not found."
      );
    }
  });
  fetchUsers(); // Gọi fetchUsers lần đầu khi component mount
});
</script>

<style scoped>
.user-management-container {
  padding: 2rem;
  background-color: #f4f6f9;
  min-height: 100vh;
}

.header {
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 1rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  padding-left: 2.2rem;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #6c757d;
}
</style>
