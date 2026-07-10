'use client';

import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches runtime WebGL/Three.js failures (context creation errors, GPU
 * driver issues, context loss during render) that capability detection
 * can't predict in advance, and swaps to the 2D fallback instead of
 * crashing the Hero section.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[Hero3DScene] WebGL render failed, falling back:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
