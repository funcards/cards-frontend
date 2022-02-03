/// <reference types="vite/client" />

declare module '*.md' {
  const content: string;
  export = content;
}

declare module 'js-cookie';
declare module 'is-retina';
declare module 'md5';
declare module 'assets/*';

interface ImportMetaEnv {
  readonly VITE_APP_NAME_SHORT: string;
  readonly VITE_APP_NAME_LONG: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
