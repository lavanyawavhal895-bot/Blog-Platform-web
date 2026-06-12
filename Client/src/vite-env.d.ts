/// <reference types="vite/client" />
/// <reference types="vite/client" />

// Explicit type declaration for custom WebGL / GLSL file imports if needed
declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "*.frag" {
  const value: string;
  export default value;
}