<template>
  <v-card class="audio-player-card elevation-2" rounded="lg">
    <v-card-text class="pa-4">
      <div v-if="src" class="audio-controls-container">
        <!-- Hidden Audio Element -->
        <audio ref="audioElement" :src="src" @timeupdate="updateProgress" @ended="onAudioEnded" @loadedmetadata="onLoadedMetadata"></audio>

        <!-- Player Controls -->
        <div class="d-flex align-center justify-center mb-4">
          <!-- Play/Pause Button -->
          <v-btn icon size="large" variant="text" @click="togglePlayPause" class="mx-2 play-pause-btn">
            <v-icon size="48">{{ isPlaying ? 'mdi-pause-circle' : 'mdi-play-circle' }}</v-icon>
          </v-btn>

          <!-- Current Time / Duration Display -->
          <div class="mx-4 text-body-1 font-weight-medium audio-time">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>

          <!-- Progress Slider -->
          <v-slider
            v-model="currentTime"
            :max="duration"
            :min="0"
            step="0.1"
            hide-details
            class="mx-4 audio-progress-slider"
            color="primary"
            track-color="blue-grey-lighten-3"
            @update:model-value="seekAudio"
          ></v-slider>

          <!-- Volume Controls -->
          <v-icon size="small" class="mr-1 text-grey-darken-1">mdi-volume-low</v-icon>
          <v-slider
            v-model="volume"
            :max="100"
            :min="0"
            step="1"
            hide-details
            class="audio-volume-slider"
            color="blue-grey"
            track-color="blue-grey-lighten-3"
            @update:model-value="updateVolume"
          ></v-slider>
          <v-icon size="small" class="ml-1 text-grey-darken-1">mdi-volume-high</v-icon>
        </div>

        <!-- Optional: Transcript/Exercise sections, if you want them within this player component -->
        <!-- You would pass transcript and exercise data as props to this component -->
      </div>
      <v-alert v-else type="info" variant="tonal" class="text-center">
        Vui lòng chọn một bài nghe để bắt đầu.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  src: String, // The audio source URL
});

const emit = defineEmits(['update:isPlaying']); // Emits playing state to parent

const audioElement = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70); // Default volume

// Watch for changes in the `src` prop to load new audio
watch(() => props.src, (newSrc) => {
  if (audioElement.value) {
    if (newSrc) {
      audioElement.value.load(); // Load the new source
      audioElement.value.volume = volume.value / 100; // Apply current volume
      audioElement.value.play().then(() => {
        isPlaying.value = true;
        emit('update:isPlaying', true);
      }).catch(error => {
        console.error("Lỗi khi phát audio:", error);
        isPlaying.value = false;
        emit('update:isPlaying', false);
        // You might want to show a user-friendly message if playback fails (e.g., audio not found)
      });
    } else {
      // If src becomes null/empty, stop playback and reset
      resetAudioPlayer();
    }
  }
}, { immediate: true }); // immediate: true ensures this runs on initial mount as well

// Audio Player Functions
const togglePlayPause = () => {
  if (!audioElement.value || !props.src) return; // Prevent action if no audio is loaded

  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
  isPlaying.value = !isPlaying.value;
  emit('update:isPlaying', isPlaying.value);
};

const updateProgress = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime;
    // Duration might not be available immediately on `timeupdate`, get it from `loadedmetadata`
    // duration.value = audioElement.value.duration || 0;
  }
};

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration;
  }
};

const seekAudio = (val) => {
  if (audioElement.value) {
    audioElement.value.currentTime = val;
  }
};

const updateVolume = (val) => {
  if (audioElement.value) {
    audioElement.value.volume = val / 100;
  }
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const onAudioEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  emit('update:isPlaying', false);
};

const resetAudioPlayer = () => {
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.currentTime = 0;
  }
  isPlaying.value = false;
  currentTime.value = 0;
  duration.value = 0;
  emit('update:isPlaying', false);
};
</script>

<style scoped>
.audio-player-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Thêm bóng nhẹ cho card */
}

.audio-controls-container {
  /* Padding, spacing, etc. will be handled by Vuetify's d-flex and mx classes */
}

.play-pause-btn .v-icon {
  color: #2196F3; /* Primary blue color for play/pause icon */
}

.audio-time {
  min-width: 60px; /* Ensure consistent width for time display */
  text-align: center;
}

/* Custom styling for sliders */
.audio-progress-slider :deep(.v-slider__track-background),
.audio-volume-slider :deep(.v-slider__track-background) {
  background-color: #cfd8dc !important; /* Lighter track background (blue-grey-lighten-3) */
  border-radius: 4px;
}

.audio-progress-slider :deep(.v-slider__thumb),
.audio-volume-slider :deep(.v-slider__thumb) {
  background-color: #2196F3 !important; /* Primary blue for thumb */
  border: none;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2); /* Halo effect */
}

.audio-progress-slider :deep(.v-slider__track-fill) {
  background-color: #2196F3 !important; /* Primary blue for fill */
}

.audio-volume-slider :deep(.v-slider__track-fill) {
  background-color: #90a4ae !important; /* Blue-grey for volume fill */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .audio-controls-container {
    flex-wrap: wrap; /* Wrap controls on small screens */
    justify-content: center;
  }
  .audio-time {
    order: 1; /* Order time before slider for better flow */
    width: 100%;
    margin-bottom: 8px;
  }
  .play-pause-btn {
    order: 2;
  }
  .audio-progress-slider {
    order: 3;
    width: 100%;
    margin: 0 8px !important; /* Adjust margins */
  }
  .audio-volume-slider {
    order: 4;
    width: calc(100% - 60px); /* Adjust width for volume icons */
    margin-left: 8px;
    margin-right: 8px;
  }
  .audio-player-card .v-icon[size="small"] {
    order: 5;
  }
}
</style>
