import type {Config} from '@react-router/dev/config';
import {vercelPreset} from '@vercel/react-router/vite';

export default {
  appDirectory: 'app',
  buildDirectory: 'dist',
  ssr: true,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    unstable_optimizeDeps: true,
  },
  presets: [vercelPreset()],
} satisfies Config;
