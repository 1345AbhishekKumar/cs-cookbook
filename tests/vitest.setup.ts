import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// ── Mock window.matchMedia ───────────────────────────────────────────────────
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// ── Mock ResizeObserver ───────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
}

// ── Mock requestIdleCallback ─────────────────────────────────────────────────
if (typeof window !== "undefined") {
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = ((cb: IdleRequestCallback) => {
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining: () => 50,
        });
      }, 1) as unknown as number;
    }) as unknown as typeof requestIdleCallback;
  }

  if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = ((id: number) => {
      clearTimeout(id);
    }) as unknown as typeof cancelIdleCallback;
  }
}

// ── Mock Web Audio API ────────────────────────────────────────────────────────
if (typeof window !== "undefined" && !window.AudioContext) {
  class MockAudioParam {
    value = 0;
    setValueAtTime = vi.fn().mockReturnThis();
    linearRampToValueAtTime = vi.fn().mockReturnThis();
    exponentialRampToValueAtTime = vi.fn().mockReturnThis();
    setTargetAtTime = vi.fn().mockReturnThis();
    setValueCurveAtTime = vi.fn().mockReturnThis();
    cancelScheduledValues = vi.fn().mockReturnThis();
    cancelAndHoldAtTime = vi.fn().mockReturnThis();
  }

  class MockAudioNode {
    connect = vi.fn();
    disconnect = vi.fn();
  }

  class MockGainNode extends MockAudioNode {
    gain = new MockAudioParam();
  }

  class MockOscillatorNode extends MockAudioNode {
    type: OscillatorType = "sine";
    frequency = new MockAudioParam();
    start = vi.fn();
    stop = vi.fn();
  }

  class MockAudioBuffer {
    numberOfChannels: number;
    length: number;
    sampleRate: number;
    private channelData: Float32Array;

    constructor(channels: number, length: number, sampleRate: number) {
      this.numberOfChannels = channels;
      this.length = length;
      this.sampleRate = sampleRate;
      this.channelData = new Float32Array(length);
    }

    getChannelData(_channel: number) {
      return this.channelData;
    }
  }

  class MockAudioBufferSourceNode extends MockAudioNode {
    buffer: MockAudioBuffer | null = null;
    start = vi.fn();
    stop = vi.fn();
  }

  class MockBiquadFilterNode extends MockAudioNode {
    type = "lowpass";
    frequency = new MockAudioParam();
    Q = new MockAudioParam();
  }

  class MockAudioContext {
    state = "running";
    currentTime = 0;
    sampleRate = 44100;
    destination = new MockAudioNode();
    createGain = vi.fn().mockImplementation(() => new MockGainNode());
    createOscillator = vi
      .fn()
      .mockImplementation(() => new MockOscillatorNode());
    createBuffer = vi
      .fn()
      .mockImplementation((channels: number, length: number, rate: number) => {
        return new MockAudioBuffer(channels, length, rate);
      });
    createBufferSource = vi
      .fn()
      .mockImplementation(() => new MockAudioBufferSourceNode());
    createBiquadFilter = vi
      .fn()
      .mockImplementation(() => new MockBiquadFilterNode());
    resume = vi.fn().mockResolvedValue(undefined);
    suspend = vi.fn().mockResolvedValue(undefined);
    close = vi.fn().mockResolvedValue(undefined);
  }

  window.AudioContext = MockAudioContext as unknown as typeof AudioContext;
  (
    window as unknown as { webkitAudioContext: typeof AudioContext }
  ).webkitAudioContext = MockAudioContext as unknown as typeof AudioContext;
}
