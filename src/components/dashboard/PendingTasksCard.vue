<template>
  <div class="card pending-tasks-card">
    <div class="card-header">
      <h2 class="card-title">⏳ Công việc cần xử lý</h2>
      <button class="view-all-btn">Xem tất cả</button>
    </div>
    <ul class="task-list">
      <li v-for="(task, index) in tasks" :key="index" class="task-item">
        <label class="task-checkbox-container">
          <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(index)" />
          <span class="checkmark"></span>
        </label>
        <div class="task-details">
          <p class="task-text" :class="{ 'completed-task-text': task.completed }">{{ task.text }}</p>
          <span class="task-due-date">{{ task.dueDate }}</span>
        </div>
        <span class="tag" :class="getPriorityTagClass(task.priority)">{{ task.priority }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PendingTasksCard',
  setup() {
    const tasks = ref([
      {
        text: 'Duyệt 15 bình luận đang chờ',
        dueDate: 'Hôm nay',
        priority: 'Cao',
        completed: false,
      },
      {
        text: 'Tạo bài giảng ngữ pháp N3 mới',
        dueDate: 'Hạn: 18/06/2025',
        priority: 'Trung bình',
        completed: false,
      },
      {
        text: 'Cập nhật gói học Premium',
        dueDate: 'Hạn: 20/06/2025',
        priority: 'Trung bình',
        completed: false,
      },
      {
        text: 'Kiểm tra báo cáo doanh thu tháng 5',
        dueDate: 'Hạn: 25/06/2025',
        priority: 'Thấp',
        completed: false,
      },
      {
        text: 'Duyệt nội dung manga mới',
        dueDate: 'Hôm nay, 15:00',
        priority: 'Cao',
        completed: false,
      },
      {
        text: 'Cập nhật bài giảng ngữ pháp N3',
        dueDate: 'Hôm nay, 17:00',
        priority: 'Trung bình',
        completed: false,
      },
      {
        text: 'Tạo đề thi JLPT N4',
        dueDate: 'Ngày mai, 10:00',
        priority: 'Cao',
        completed: false,
      },
      {
        text: 'Kiểm duyệt bình luận diễn đàn',
        dueDate: '19/06/2025',
        priority: 'Thấp',
        completed: false,
      },
    ]);

    const toggleTaskCompletion = (index) => {
      tasks.value[index].completed = !tasks.value[index].completed;
    };

    const getPriorityTagClass = (priority) => {
      switch (priority) {
        case 'Cao':
          return 'tag-priority-high';
        case 'Trung bình':
          return 'tag-priority-medium';
        case 'Thấp':
          return 'tag-priority-low';
        default:
          return '';
      }
    };

    return {
      tasks,
      toggleTaskCompletion,
      getPriorityTagClass,
    };
  },
});
</script>

<style scoped>
.pending-tasks-card {
  box-shadow: 0 4px 12px var(--shadow-light);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.view-all-btn {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-btn:hover {
  color: #1660cc;
  text-decoration: underline;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto; /* Enable scrolling for task list if it exceeds max-height */
  max-height: 350px; /* Limit height for consistent card size */
}

.task-item {
  display: flex;
  align-items: center; /* Align items vertically in the middle */
  gap: 15px; /* Space between checkbox, details, and tag */
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px dashed var(--border-dashed);
}

.task-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.task-checkbox-container {
  display: block;
  position: relative;
  cursor: pointer;
  /* Set explicit width and height to reserve space for the checkbox */
  width: 22px;
  height: 22px;
  flex-shrink: 0; /* Prevents checkbox area from shrinking */
}

/* Hide the browser's default checkbox */
.task-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: var(--background-light);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  transition: background-color 0.2s, border-color 0.2s;
}

/* On mouse-over, add a light background color */
.task-checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.task-checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.task-checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark */
.task-checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.task-details {
  flex-grow: 1; /* Allows task details to take most available space */
  display: flex;
  flex-direction: column;
}

.task-text {
  font-size: 15px;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.completed-task-text {
  text-decoration: line-through;
  color: var(--text-light);
}

.task-due-date {
  font-size: 13px;
  color: var(--text-light);
}

.tag {
    margin-left: auto; /* Pushes the tag to the far right */
    flex-shrink: 0; /* Prevents tag from shrinking */
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .card-title {
    font-size: 17px;
  }
  .view-all-btn {
    font-size: 13px;
  }
  .task-text {
    font-size: 14px;
  }
  .task-due-date {
    font-size: 12px;
  }
  .task-list {
      max-height: 300px;
  }
  .checkmark {
    height: 20px;
    width: 20px;
  }
  .task-checkbox-container .checkmark:after {
    left: 6px;
    top: 2px;
    width: 4px;
    height: 9px;
  }
  .tag {
    padding: 5px 10px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .task-list {
      max-height: 250px;
  }
  .task-item {
    margin-bottom: 15px;
    padding-bottom: 15px;
    /* On small screens, allow text and tag to wrap below checkbox if necessary */
    flex-wrap: wrap;
    justify-content: flex-start; /* Align items to start when wrapped */
  }
  .task-checkbox-container {
    margin-right: 10px; /* Provide some margin to the right of checkbox when wrapped */
  }
  .task-details {
    flex-basis: calc(100% - 32px); /* Allow text to take most of the width, considering checkbox */
    order: 1; /* Keep details next to checkbox if possible */
  }
  .tag {
    order: 2; /* Tag will wrap to next line if insufficient space */
    margin-left: 0; /* Remove auto-margin to allow it to wrap naturally */
    width: auto; /* Allow tag to size naturally */
    margin-top: 5px; /* Add a small margin top if it wraps */
  }
  .task-due-date {
    width: 100%; /* Ensure date takes full width if wrapped */
  }
}
</style>
