import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isSoundEnabled,
  setSoundEnabled,
  toggleSound,
  subscribeSound,
  getAudioContext,
  initAudio,
  playTone,
  playHiss,
  sound,
  S,
  tick,
  pop,
  thud,
  pluck,
  jump,
  chime,
  slide,
  swap,
  up,
  down,
  note,
  hop,
  hash,
} from "@/components/dsa/audio";

describe("components/dsa/audio", () => {
  beforeEach(() => {
    setSoundEnabled(true);
    vi.clearAllMocks();
  });

  describe("sound state toggles and subscriptions", () => {
    it("reports sound is enabled by default", () => {
      expect(isSoundEnabled()).toBe(true);
    });

    it("can disable and enable sound via setSoundEnabled", () => {
      setSoundEnabled(false);
      expect(isSoundEnabled()).toBe(false);
      setSoundEnabled(true);
      expect(isSoundEnabled()).toBe(true);
    });

    it("toggles sound state via toggleSound", () => {
      const state1 = toggleSound();
      expect(state1).toBe(false);
      expect(isSoundEnabled()).toBe(false);

      const state2 = toggleSound();
      expect(state2).toBe(true);
      expect(isSoundEnabled()).toBe(true);
    });

    it("notifies subscribers when sound status changes", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeSound(listener);

      setSoundEnabled(false);
      expect(listener).toHaveBeenCalledWith(false);

      setSoundEnabled(true);
      expect(listener).toHaveBeenCalledWith(true);

      unsubscribe();
      setSoundEnabled(false);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it("isolates errors thrown in subscribers", () => {
      const badListener = vi.fn().mockImplementation(() => {
        throw new Error("subscriber failed");
      });
      const goodListener = vi.fn();

      const unsubBad = subscribeSound(badListener);
      const unsubGood = subscribeSound(goodListener);

      expect(() => setSoundEnabled(false)).not.toThrow();
      expect(goodListener).toHaveBeenCalledWith(false);

      unsubBad();
      unsubGood();
    });
  });

  describe("audio context and synthesis", () => {
    it("initializes AudioContext via initAudio and getAudioContext", () => {
      initAudio();
      const ctx = getAudioContext();
      expect(ctx).toBeDefined();
      expect(ctx?.createGain).toBeDefined();
      expect(ctx?.createOscillator).toBeDefined();
    });

    it("plays a tone with playTone when sound is enabled", () => {
      const ctx = getAudioContext();
      playTone({ f: 440, t: 0.1, type: "sine" });
      expect(ctx?.createOscillator).toHaveBeenCalled();
      expect(ctx?.createGain).toHaveBeenCalled();
    });

    it("does not play tone when sound is disabled", () => {
      setSoundEnabled(false);
      const ctx = getAudioContext();
      vi.clearAllMocks();

      playTone({ f: 440, t: 0.1 });
      expect(ctx?.createOscillator).not.toHaveBeenCalled();
    });

    it("handles frequency ramp when f2 is provided", () => {
      const ctx = getAudioContext();
      vi.clearAllMocks();

      playTone({ f: 440, f2: 880, t: 0.15 });
      expect(ctx?.createOscillator).toHaveBeenCalled();
    });

    it("plays noise hiss via playHiss", () => {
      const ctx = getAudioContext();
      vi.clearAllMocks();

      playHiss(0.05, 0.2, 800);
      expect(ctx?.createBufferSource).toHaveBeenCalled();
      expect(ctx?.createBiquadFilter).toHaveBeenCalled();
    });
  });

  describe("sound preset primitives and aliases", () => {
    it("exports sound identical to S", () => {
      expect(sound).toBe(S);
    });

    it("invokes all sound presets without crashing", () => {
      expect(() => {
        tick(0);
        pop();
        thud();
        pluck(1);
        jump();
        chime();
        slide();
        swap();
        up(2);
        down(2);
        note(440);
        hop(1);
        hash();
      }).not.toThrow();
    });

    it("sound object methods map to the presets", () => {
      expect(typeof sound.tick).toBe("function");
      expect(typeof sound.pop).toBe("function");
      expect(typeof sound.thud).toBe("function");
      expect(typeof sound.pluck).toBe("function");
      expect(typeof sound.jump).toBe("function");
      expect(typeof sound.chime).toBe("function");
      expect(typeof sound.slide).toBe("function");
      expect(typeof sound.swap).toBe("function");
      expect(typeof sound.up).toBe("function");
      expect(typeof sound.down).toBe("function");
      expect(typeof sound.note).toBe("function");
      expect(typeof sound.hop).toBe("function");
      expect(typeof sound.hash).toBe("function");

      expect(() => {
        sound.tick(0);
        sound.pop();
        sound.thud();
        sound.pluck();
        sound.jump();
        sound.chime();
        sound.slide();
        sound.swap();
        sound.up();
        sound.down();
        sound.note();
        sound.hop();
        sound.hash();
      }).not.toThrow();
    });
  });
});
