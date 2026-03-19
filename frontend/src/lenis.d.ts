declare module '@studio-freight/lenis' {
  export default class Lenis {
    constructor(options?: any);
    raf(time: number): void;
    destroy(): void;
    on(event: string, callback: Function): void;
    scrollTo(target: any, options?: any): void;
  }
}
