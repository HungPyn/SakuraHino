// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './components/router'; // Assuming your router setup

// Font Awesome Core
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);

// Vuetify
import 'vuetify/styles'; // Import Vuetify CSS
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Vuetify Iconsets (for Font Awesome)
import { aliases, fa } from 'vuetify/iconsets/fa';

// Chart.js (Keep if you use charts, otherwise it can be removed)
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa', // Set Font Awesome as default icon set for Vuetify
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1A73E8', // Blue
          accent: '#4CAF50', // Green for success/add actions
          info: '#2196F3', // Blue for info/edit
          error: '#FF5252', // Red for errors/delete
          success: '#4CAF50', // Green for success
          warning: '#FB8C00', // Orange for warning

          // Custom colors for summary cards and chips
          'blue-grey-lighten-2': '#B0BEC5',
          'green-lighten-2': '#A5D6A7',
          'purple-lighten-2': '#CE93D8',
          'orange-lighten-2': '#FFCC80',

          // Colors for level chips
          'green-lighten-1': '#8BC34A',
          'light-blue-lighten-1': '#4FC3F7',
          'teal-lighten-1': '#26A69A',
          'orange-lighten-1': '#FFB74D',
          'red-lighten-1': '#EF5350',
          'blue-grey-lighten-1': '#90A4AE', // For 'Draft' status and 'All' level

          // Colors for exercise type chips
          'blue-grey-lighten-3': '#CFD8DC', // For Matching
          'light-green-lighten-3': '#C5E1A5', // For Fill-in-the-blanks
          'purple-lighten-3': '#E1BEE7', // For Multiple Choice
          'brown-lighten-3': '#D7CCC8', // For Notes
        },
      },
    },
  },
});

const app = createApp(App);
app
  .use(router) // Integrate Vue Router
  .use(vuetify) // Integrate Vuetify
  .component('font-awesome-icon', FontAwesomeIcon) // Register Font Awesome component globally
  .mount('#app');