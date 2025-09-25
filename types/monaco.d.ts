// Monaco Editor types
declare global {
  interface Window {
    monaco: typeof import('monaco-editor');
  }
}

export {};