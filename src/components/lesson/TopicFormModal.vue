<template>
  <div
    class="modal fade"
    id="topicFormModal"
    tabindex="-1"
    aria-labelledby="topicFormModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="topicFormModalLabel">
            {{ isEditMode ? "Chỉnh Sửa Chủ Đề" : "Thêm Chủ Đề Mới" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveTopic">
            <div class="mb-3">
              <label for="topicName" class="form-label"
                >Tên Chủ đề <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="topicName"
                v-model="topic.name"
                required
              />
              <div class="invalid-feedback" v-if="errors.name">
                {{ errors.name }}
              </div>
            </div>
            <div class="mb-3">
              <label for="maxLessonSelect" class="form-label"
                >Câu hỏi tối đa</label
              >
              <select
                id="maxLessonSelect"
                class="form-select"
                v-model="topic.maxLesson"
              >
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="topicImageUrl" class="form-label">File ảnh</label>
              <input
                type="file"
                class="form-control"
                :class="{ 'is-invalid': errors.url_image }"
                id="topicImageUrl"
                @change="handleImageUpload"
              />
              <div class="invalid-feedback" v-if="errors.url_image">
                {{ errors.url_image }}
              </div>
            </div>
            <div v-if="topic.urlImage" class="mt-2 text-center">
              <p class="text-muted">Ảnh hiện tại:</p>
              <img
                :src="topic.urlImage"
                alt="Ảnh chủ đề"
                class="img-thumbnail"
                style="max-width: 200px; height: auto"
              />
            </div>
            <div class="mb-3">
              <label for="topicStatus" class="form-label"
                >Trạng thái <span class="text-danger">*</span></label
              >
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.status }"
                id="topicStatus"
                v-model="topic.status"
                required
              >
                <option v-for="s in status" :key="s" :value="s.status">
                  {{
                    s.status === "PUBLISHED"
                      ? "Xuất bản"
                      : s.status === "PENDING"
                      ? "Chờ duyệt"
                      : s.status === "DELETED"
                      ? "Xóa"
                      : "Không xác định"
                  }}
                </option>
              </select>
              <div class="invalid-feedback" v-if="errors.status">
                {{ errors.status }}
              </div>
            </div>
            <div class="mb-3">
              <label for="topicStatus" class="form-label"
                >Cấp độ
                <span class="text-danger"
                  >*<b v-if="topic.level"
                    >Đã chọn cấp độ: {{ topic.level }}</b
                  ></span
                ></label
              >
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.status }"
                id="topicStatus"
                v-model="topic.levelId"
                required
              >
                <option v-for="l in levels" :key="l.id" :value="l.id">
                  {{ l.level }}
                </option>
              </select>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">Lưu Chủ đề</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";
import topicService from "../../services/topicService";
import levelService from "@/services/levelService";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();

//xử lí ảnh

const uploadedFile = ref(null); // Biến để lưu trữ tệp đã chọn

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
  } else {
    uploadedFile.value = null;
  }
}

const emit = defineEmits(["topic-done-form"]);

const modalRef = ref(null);
let bsModal = null;

const initialTopicState = {
  id: null,
  name: "",
  maxLessson: 5,
  status: "PUBLISHED",
  levelId: 1,
  level: "",
  urlImage: "",
};

const topic = reactive({ ...initialTopicState });
const isEditMode = ref(false);
const errors = reactive({});
const status = ref([]);
const levels = ref([]);

//lấy level
const fetchLevels = async () => {
  try {
    const response = await levelService.getLevels();

    levels.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cấp độ:", error);
    alert("Có lỗi xảy ra khi lấy danh sách cấp độ: " + error.message);
  }
};
// lấy status
const fetchStatus = async () => {
  try {
    const response = await levelService.getStatus();

    status.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trạng thái:", error);
    alert("Có lỗi xảy ra khi lấy danh sách trạng thái: " + error.message);
  }
};

// Hàm mở modal
function openModal(topicData = null) {
  Object.assign(errors, {}); // Clear previous errors
  if (topicData) {
    isEditMode.value = true;
    Object.assign(topic, JSON.parse(JSON.stringify(topicData))); // Deep copy
    console.log(
      "Opening modal in edit mode with topic:",
      JSON.stringify(topic, null, 2)
    );
  } else {
    isEditMode.value = false;
    Object.assign(topic, initialTopicState); // Reset to initial state
  }
  bsModal.show();
}

// Hàm đóng modal
function closeModal() {
  bsModal.hide();
}

// Hàm lưu chủ đề
async function saveTopic() {
  const isNew = !topic.id;
  if (isNew) {
    // Kiểm tra nếu là chủ đề mới, cần upload ảnh
    if (uploadedFile.value == null) {
      toast.error("Vui lòng chọn ảnh cho chủ đề!");
      return;
    }
    const result = await Swal.fire({
      title: `Xác nhận thêm chủ đề`,
      text: `Bạn có chắc muốn thêm chủ đề không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await topicService.createTopic(topic, uploadedFile.value);

        toast.success(`Đã thêm chủ đề thành công!`);
        emit("topic-done-form");
        closeModal(); // Đóng modal sau khi lưu thành công
        // fetchTopics();
      } catch (error) {
        console.error("Lỗi khi thêm chủ đề:", error);
      }
    }
  } else {
    const id = topic.id;
    const result = await Swal.fire({
      title: `Xác nhận chỉnh sửa chủ đề`,
      text: `Bạn có chắc sửa chủ đề này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lưu ",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const topicEdit = {
        name: topic.name,
        maxLesson: topic.maxLesson,
        status: topic.status,
        levelId: topic.levelId,
        url_image: uploadedFile.value
          ? uploadedFile.value.name
          : topic.url_image,
      };
      try {
        await topicService.updateTopic(id, topicEdit, uploadedFile.value);

        toast.success(`Đã sửa chủ đề thành công!`);
        emit("topic-done-form");
        closeModal(); // Đóng modal sau khi lưu thành công
        // fetchTopics();
      } catch (error) {
        console.error("Lỗi khi chỉnh sửa chủ đề:", error);
      }
    }
  }
}

// Expose openModal to parent component
defineExpose({
  openModal,
});

// Initialize Bootstrap Modal on component mount
onMounted(() => {
  bsModal = new Modal(modalRef.value);
  modalRef.value.addEventListener("hidden.bs.modal", () => {
    Object.assign(topic, initialTopicState); // Reset form when modal is closed
    Object.assign(errors, {}); // Clear errors
  });
  fetchLevels();
  fetchStatus();
});
</script>

<style scoped>
/* Scoped styles for TopicFormModal */
.modal-title {
  color: #007bff;
}

.form-label {
  font-weight: 500;
  color: #555;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
}
</style>
