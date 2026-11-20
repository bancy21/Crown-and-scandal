(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let musicTimer = null;
  let stepIndex = 0;
  let unlocked = false;

  // Versailles Baroque Minuet in D Major / B Minor (gentle chamber harp + warm strings)
  // Frequencies in Hz
  const MINUET_PATTERN = [
    // Bar 1 (D major): D4 - F#4 - A4 - D5 - A4 - F#4
    { bass: 146.83, lead: 587.33, harm: 369.99 },
    { bass: null, lead: 440.0, harm: null },
    { bass: null, lead: 493.88, harm: 369.99 },
    { bass: 220.0, lead: 523.25 * 1.05946, harm: 440.0 }, // C#5
    { bass: null, lead: 587.33, harm: null },
    { bass: null, lead: 659.25, harm: 440.0 },

    // Bar 2 (G major -> A major): G3 - B4 - D5 - A4 - C#5
    { bass: 196.0, lead: 739.99, harm: 493.88 }, // F#5
    { bass: null, lead: 587.33, harm: null },
    { bass: null, lead: 493.88, harm: 392.0 },
    { bass: 220.0, lead: 554.37, harm: 440.0 },
    { bass: null, lead: 493.88, harm: null },
    { bass: null, lead: 440.0, harm: 329.63 },

    // Bar 3 (B minor -> F# minor): B3 - D5 - C#5 - B4 - A4
    { bass: 123.47, lead: 587.33, harm: 369.99 },
    { bass: null, lead: 554.37, harm: null },
    { bass: null, lead: 493.88, harm: 369.99 },
    { bass: 185.0, lead: 440.0, harm: 329.63 },
    { bass: null, lead: 369.99, harm: null },
    { bass: null, lead: 440.0, harm: 329.63 },

    // Bar 4 (G major -> A7 -> D cadence)
    { bass: 196.0, lead: 493.88, harm: 392.0 },
    { bass: null, lead: 587.33, harm: null },
    { bass: 220.0, lead: 554.37, harm: 440.0 },
    { bass: null, lead: 659.25, harm: 440.0 },
    { bass: 146.83, lead: 587.33, harm: 369.99 },
    { bass: null, lead: null, harm: null },
  ];

  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.72;
      masterGain.connect(ctx.destination);

      musicGain = ctx.createGain();
      musicGain.gain.value = 0.24;
      musicGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.42;
      sfxGain.connect(masterGain);
    } catch (_) {
      ctx = null;
    }
    return ctx;
  }

  function isMusicEnabled() {
    return Boolean(window.CrownGame && window.CrownGame.settings && window.CrownGame.settings.music);
  }

  function isSoundEnabled() {
    return Boolean(window.CrownGame && window.CrownGame.settings && window.CrownGame.settings.sound);
  }

  /**
   * Plays a warm harpsichord / chamber-harp note with gentle lowpass envelope.
   */
  function playChamberVoice(freq, duration, volume, type, targetBus, delaySec) {
    if (!ctx || !targetBus || !freq) return;
    const now = ctx.currentTime + (delaySec || 0);

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(3400, freq * 3.8), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(480, freq * 1.4), now + duration);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(volume, now + 0.018);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(targetBus);

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  function tickMusic() {
    if (!ctx || ctx.state !== 'running' || !isMusicEnabled() || document.hidden) return;
    const step = MINUET_PATTERN[stepIndex % MINUET_PATTERN.length];
    stepIndex++;

    if (step.bass) {
      playChamberVoice(step.bass, 1.35, 0.22, 'sine', musicGain, 0);
      playChamberVoice(step.bass * 2, 0.85, 0.09, 'triangle', musicGain, 0);
    }
    if (step.harm) {
      playChamberVoice(step.harm, 0.72, 0.11, 'triangle', musicGain, 0.015);
    }
    if (step.lead) {
      playChamberVoice(step.lead, 0.68, 0.16, 'triangle', musicGain, 0);
      // Soft octave harp overtone shimmer
      playChamberVoice(step.lead * 2, 0.35, 0.035, 'sine', musicGain, 0.01);
    }
  }

  function startMusicLoop() {
    if (musicTimer || !isMusicEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    tickMusic();
    musicTimer = setInterval(tickMusic, 440);
  }

  function stopMusicLoop() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  function unlockAudio() {
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(function () {
        unlocked = true;
        syncSettings();
      }).catch(function () {});
    } else {
      unlocked = true;
      syncSettings();
    }
  }

  function syncSettings() {
    if (musicGain && ctx) {
      musicGain.gain.setTargetAtTime(isMusicEnabled() ? 0.24 : 0.0001, ctx.currentTime, 0.08);
    }
    if (sfxGain && ctx) {
      sfxGain.gain.setTargetAtTime(isSoundEnabled() ? 0.42 : 0.0001, ctx.currentTime, 0.05);
    }
    if (isMusicEnabled() && !document.hidden) {
      if (unlocked || (ctx && ctx.state === 'running')) {
        startMusicLoop();
      }
    } else {
      stopMusicLoop();
    }
  }

  function playClick() {
    if (!isSoundEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    playChamberVoice(783.99, 0.12, 0.16, 'triangle', sfxGain, 0);
  }

  function playTab() {
    if (!isSoundEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    playChamberVoice(659.25, 0.14, 0.14, 'sine', sfxGain, 0);
    playChamberVoice(987.77, 0.16, 0.09, 'triangle', sfxGain, 0.035);
  }

  function playSelect() {
    if (!isSoundEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    playChamberVoice(587.33, 0.16, 0.15, 'triangle', sfxGain, 0);
    playChamberVoice(880.0, 0.22, 0.12, 'sine', sfxGain, 0.045);
  }

  function playBack() {
    if (!isSoundEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    playChamberVoice(523.25, 0.14, 0.14, 'triangle', sfxGain, 0);
    playChamberVoice(392.0, 0.2, 0.12, 'sine', sfxGain, 0.05);
  }

  function playSuccess() {
    if (!isSoundEnabled()) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    // Royal D major harp arpeggio fanfare
    playChamberVoice(587.33, 0.24, 0.16, 'triangle', sfxGain, 0);
    playChamberVoice(739.99, 0.26, 0.16, 'triangle', sfxGain, 0.07);
    playChamberVoice(880.0, 0.3, 0.17, 'triangle', sfxGain, 0.14);
    playChamberVoice(1174.66, 0.48, 0.18, 'sine', sfxGain, 0.21);
  }

  // Unlock audio cleanly on first gesture anywhere in the app
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(
      evt,
      function firstUnlock() {
        unlockAudio();
      },
      { passive: true }
    );
  });

  // Auto-play subtle tactile feedback on native buttons if not handled explicitly
  document.addEventListener(
    'click',
    function (ev) {
      unlockAudio();
      const btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if (btn && !btn.disabled && isSoundEnabled()) {
        if (btn.classList.contains('cas-tab')) {
          playTab();
        } else if (btn.classList.contains('btn-primary')) {
          playSuccess();
        } else if (btn.classList.contains('cas-choice') || btn.classList.contains('cas-swatch')) {
          playSelect();
        } else {
          playClick();
        }
      }
    },
    true
  );

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopMusicLoop();
    } else {
      syncSettings();
    }
  });

  window.CrownAudio = {
    unlock: unlockAudio,
    syncSettings: syncSettings,
    playClick: playClick,
    playTab: playTab,
    playSelect: playSelect,
    playBack: playBack,
    playSuccess: playSuccess,
  };
})();
