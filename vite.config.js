import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@amcharts/amcharts5',
      '@amcharts/amcharts5/xy',
      '@amcharts/amcharts5/themes/Animated', // <--- Add this line
      // Add other amCharts modules you use, e.g., '@amcharts/amcharts5/percent'
    ],
  },
})
