/// <reference types="vite/client" />

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module 'react-katex' {
  import { ComponentType } from 'react'
  export const InlineMath: ComponentType<{ math: string }>
  export const BlockMath: ComponentType<{ math: string }>
}
