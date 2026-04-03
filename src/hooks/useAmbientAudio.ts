import { useRef, useCallback, useEffect, useState } from 'react'

/**
 * Generative ambient audio engine using Web Audio API.
 * Each era has a different sonic texture — no audio files needed.
 *
 * Eras map to:
 * 0  hero      - silence
 * 1  void      - ultra-deep sub bass, barely audible
 * 2  bigbang   - white noise burst fading to warm drone
 * 3  stars     - warm sine wave chord, soft
 * 4  ice       - high crystalline tones, cold
 * 5  cambrian  - bubbling oscillations, organic
 * 6  intel     - pulsing electronic, mid-frequency
 * 7  singular  - rich layered chord, bright
 * 8  lineage   - gentle pad
 * 9  horizon   - ethereal high harmonics
 * 10 numbers   - quiet pulse
 * 11 galaxy    - full cosmic drone
 * 12 credits   - fade to silence
 */

interface EraSound {
  frequencies: number[]
  type: OscillatorType
  gain: number
  filterFreq: number
  filterQ: number
  noiseGain: number
}

const ERA_SOUNDS: Record<number, EraSound> = {
  0:  { frequencies: [], type: 'sine', gain: 0, filterFreq: 200, filterQ: 1, noiseGain: 0 },
  1:  { frequencies: [32, 40], type: 'sine', gain: 0.06, filterFreq: 80, filterQ: 3, noiseGain: 0.005 },
  2:  { frequencies: [55, 82.5, 110], type: 'sine', gain: 0.08, filterFreq: 400, filterQ: 1, noiseGain: 0.02 },
  3:  { frequencies: [110, 165, 220], type: 'sine', gain: 0.05, filterFreq: 600, filterQ: 2, noiseGain: 0.003 },
  4:  { frequencies: [880, 1320, 1760], type: 'sine', gain: 0.025, filterFreq: 2000, filterQ: 8, noiseGain: 0.008 },
  5:  { frequencies: [130.8, 196, 261.6], type: 'triangle', gain: 0.04, filterFreq: 800, filterQ: 2, noiseGain: 0.01 },
  6:  { frequencies: [220, 330, 440, 550], type: 'sawtooth', gain: 0.02, filterFreq: 1200, filterQ: 4, noiseGain: 0.005 },
  7:  { frequencies: [261.6, 329.6, 392, 523.2], type: 'sine', gain: 0.05, filterFreq: 1500, filterQ: 2, noiseGain: 0.008 },
  8:  { frequencies: [174.6, 220, 261.6], type: 'sine', gain: 0.035, filterFreq: 700, filterQ: 2, noiseGain: 0.003 },
  9:  { frequencies: [440, 660, 880, 1100], type: 'sine', gain: 0.025, filterFreq: 2500, filterQ: 3, noiseGain: 0.004 },
  10: { frequencies: [110, 220], type: 'sine', gain: 0.03, filterFreq: 400, filterQ: 2, noiseGain: 0.002 },
  11: { frequencies: [65.4, 98, 130.8, 196, 261.6], type: 'sine', gain: 0.04, filterFreq: 1000, filterQ: 1, noiseGain: 0.006 },
  12: { frequencies: [], type: 'sine', gain: 0, filterFreq: 200, filterQ: 1, noiseGain: 0 },
}

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const oscsRef = useRef<OscillatorNode[]>([])
  const gainRef = useRef<GainNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const noiseGainRef = useRef<GainNode | null>(null)
  const noiseRef = useRef<AudioBufferSourceNode | null>(null)
  const [muted, setMuted] = useState(true)
  const currentSlideRef = useRef(0)

  const init = useCallback(() => {
    if (ctxRef.current) return
    const ctx = new AudioContext()
    ctxRef.current = ctx

    // Master gain
    const gain = ctx.createGain()
    gain.gain.value = 0
    gain.connect(ctx.destination)
    gainRef.current = gain

    // Filter
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400
    filter.Q.value = 1
    filter.connect(gain)
    filterRef.current = filter

    // Noise source for texture
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0
    noiseGain.connect(filter)
    noiseGainRef.current = noiseGain

    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    noise.connect(noiseGain)
    noise.start()
    noiseRef.current = noise

    // Apply current slide sound
    applyEra(currentSlideRef.current)
  }, [])

  const applyEra = useCallback((slide: number) => {
    const ctx = ctxRef.current
    if (!ctx || !gainRef.current || !filterRef.current || !noiseGainRef.current) return

    const era = ERA_SOUNDS[slide] || ERA_SOUNDS[0]
    const now = ctx.currentTime
    const ramp = 1.5 // crossfade time in seconds

    // Fade out old oscillators
    const oldOscs = oscsRef.current
    for (const osc of oldOscs) {
      try { osc.stop(now + ramp) } catch {}
    }

    // Create new oscillators
    const newOscs: OscillatorNode[] = []
    for (const freq of era.frequencies) {
      const osc = ctx.createOscillator()
      osc.type = era.type
      osc.frequency.value = freq
      // Slight detune for richness
      osc.detune.value = (Math.random() - 0.5) * 6
      osc.connect(filterRef.current)
      osc.start(now)
      newOscs.push(osc)
    }
    oscsRef.current = newOscs

    // Ramp parameters
    gainRef.current.gain.linearRampToValueAtTime(era.gain, now + ramp)
    filterRef.current.frequency.linearRampToValueAtTime(era.filterFreq, now + ramp)
    filterRef.current.Q.linearRampToValueAtTime(era.filterQ, now + ramp)
    noiseGainRef.current.gain.linearRampToValueAtTime(era.noiseGain, now + ramp)
  }, [])

  const setSlide = useCallback((slide: number) => {
    currentSlideRef.current = slide
    if (!muted && ctxRef.current) {
      applyEra(slide)
    }
  }, [muted, applyEra])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (!next) {
        // Unmuting
        init()
        if (ctxRef.current?.state === 'suspended') {
          ctxRef.current.resume()
        }
        applyEra(currentSlideRef.current)
      } else {
        // Muting
        if (gainRef.current && ctxRef.current) {
          const now = ctxRef.current.currentTime
          gainRef.current.gain.linearRampToValueAtTime(0, now + 0.5)
          noiseGainRef.current?.gain.linearRampToValueAtTime(0, now + 0.5)
        }
      }
      return next
    })
  }, [init, applyEra])

  // Cleanup
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  return { muted, toggleMute, setSlide }
}
