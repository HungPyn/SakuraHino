<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 stats-grid">
    <div class="col" v-for="(stat, index) in stats" :key="index">
      <div class="stat-card" :class="[stat.color ? `bg-${stat.color}` : 'bg-white-border', { 'compact': stat.compact }]">
        <div v-if="stat.compact" class="stat-icon-compact" :class="`text-${stat.iconColor}`">
          <i class="bi" :class="stat.icon"></i>
        </div>
        <div v-else class="stat-icon-wrapper">
          <i class="bi" :class="stat.icon"></i>
        </div>

        <div class="stat-content">
          <h2 class="stat-value">{{ stat.value }}</h2>
          <p class="stat-label">{{ stat.label }}</p>
          <span v-if="stat.percentageChange" class="percentage-change" :class="{ 'text-success': stat.percentageChange > 0, 'text-danger': stat.percentageChange < 0 }">
            {{ stat.percentageChange > 0 ? '+' : '' }}{{ stat.percentageChange }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<style scoped>
.stats-grid {
  margin-top: 2rem;
}

.stat-card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-5px);
}

/* Base styles for text within stat-card */
.stat-card .stat-value,
.stat-card .stat-label {
  color: white; /* Default for colored backgrounds */
}

/* Backgrounds for different colors*/
.bg-blue { background: linear-gradient(135deg, #4b7bec, #3867d6); }
.bg-green { background: linear-gradient(135deg, #2ecc71, #27ae60); }
.bg-orange { background: linear-gradient(135deg, #f39c12, #e67e22); }
.bg-purple { background: linear-gradient(135deg, #9b59b6, #8e44ad); }

/* Styles for light cards with borders*/
.bg-white-border {
  background-color: #ffffff;
  border: 1px solid #e9ecef; /* Subtle border */
  color: #495057; /* Darker text for light background */
  padding: 1rem 1.5rem; /* Adjust padding if needed */
  display: flex; /* Override flex-direction for compact */
  flex-direction: row; /* Default to row */
  justify-content: space-between; /* Space out content and icon */
  align-items: center;
}

.bg-white-border .stat-value,
.bg-white-border .stat-label {
  color: #34495e; /* Dark text for light background */
}


.stat-icon-wrapper {
  font-size: 3rem;
  opacity: 0.2;
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
}

/* Specific icon wrapper for light cards (positioning changed) */
.bg-white-border .stat-icon-wrapper {
  position: static; /* Reset absolute positioning */
  transform: none;
  font-size: 2.5rem; /* Slightly smaller icon */
  opacity: 1; /* Full opacity */
  margin-right: 1rem; /* Space before text */
  color: inherit; /* Inherit color from the card's text color */
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  margin-bottom: 0;
  opacity: 0.8;
}

/* Styles for compact cards*/
.stat-card.compact {
    flex-direction: row; /* Keep row for icon and text */
    justify-content: space-between; /* Space content and icon */
    align-items: center;
    padding: 1rem 1.5rem; /* Standard padding for compact */
}

.stat-card.compact .stat-icon-compact {
    font-size: 2.2rem; /* Icon size for compact card*/
    opacity: 1;
    line-height: 1; /* Adjust line-height for better alignment */
    /* Remove any absolute positioning or transforms from icon-wrapper if this is used instead */
}

.stat-card.compact .stat-content {
    flex-grow: 1; /* Allow content to grow */
    text-align: right; /* Align text to the right*/
}

.stat-card.compact .stat-value {
    font-size: 1.8rem; /* Value size for compact card*/
    margin-bottom: 0.25rem;
}

.stat-card.compact .stat-label {
    font-size: 0.9rem; /* Label size for compact card*/
    opacity: 1; /* Full opacity */
}

/* Specific colors for icons within light (white-border) cards */
.text-blue { color: #007bff !important; }
.text-green { color: #28a745 !important; }
.text-cyan { color: #17a2b8 !important; } /* For 'Lộ trình đã hoàn thành'*/
.text-orange-custom { color: #fd7e14 !important; } /* For 'Học viên đã tiếp cận'*/

/* Percentage change styling */
.percentage-change {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.5rem;
  opacity: 0.9;
}
.text-success { color: #28a745 !important; }
.text-danger { color: #dc3545 !important; }

/* Responsive adjustments for StatsGrid */
@media (max-width: 992px) {
  .stats-grid .col {
    width: 50%; /* On medium screens, show 2 columns */
    flex: 0 0 auto;
  }
}

@media (max-width: 576px) {
  .stats-grid .col {
    width: 100%; /* On small screens, show 1 column */
  }
  .stat-card {
    padding: 1rem; /* Smaller padding on small screens */
  }
  .stat-value {
    font-size: 2rem;
  }
  .stat-label {
    font-size: 0.9rem;
  }
  .stat-icon-wrapper {
    font-size: 2.5rem;
    right: 1rem;
  }
  .stat-card.compact .stat-value {
    font-size: 1.6rem;
  }
  .stat-card.compact .stat-label {
    font-size: 0.8rem;
  }
  .stat-card.compact .stat-icon-compact {
    font-size: 2rem;
  }
}
</style>