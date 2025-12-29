export interface AnimationScope {
  register: (cleanupFn: () => void) => void;
  cleanup: () => void;
}

export type GSAPTarget = HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | string;
