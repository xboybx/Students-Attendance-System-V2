import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // base: "/Students-Attendance-System-V2",
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 5173,
    host: true,
    open: true
  }
});