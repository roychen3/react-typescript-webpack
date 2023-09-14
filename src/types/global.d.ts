declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_ENV_VARIABLE_1: string;
      APP_ENV_VARIABLE_2: string;
    }
  }
}

export {};
