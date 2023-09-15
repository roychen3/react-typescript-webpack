import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

const rootPath = process.cwd();

function getExposeEnv() {
  const result = dotenv.config(); // reade `/.env` file
  let exposeEnv: { [key: string]: string } = {};

  if (result.parsed) {
    Object.entries(result.parsed)
      .filter(([key]) => /^APP_ENV_/.test(key))
      .forEach(([key, value]) => {
        exposeEnv[key] = value;
      });
  }
  return exposeEnv;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': rootPath,
      },
    },
    server: {
      host: '0.0.0.0',
    },
    define: {
      'process.env': {
        NODE_ENV: mode,
        ...getExposeEnv(),
      },
    },
  };
});
