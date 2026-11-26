"use client";

import { useEffect, useRef, useState } from "react";

const cachedClips = new Map<string, Promise<AudioBuffer>>();
const maxCachedClips = 48;
const outputWarmupSeconds = 0.24;
let audioContext: AudioContext | undefined;

function getAudioContext() {
  if (!window.AudioContext) return;
  if (!audioContext || audioContext.state === "closed") audioContext = new AudioContext();
  return audioContext;
}

function decodeClip(context: AudioContext, url: string) {
  const cached = cachedClips.get(url);
  const clip = cached ?? fetch(url, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error("Could not load the audio clip");
      return response.arrayBuffer();
    })
    .then((data) => context.decodeAudioData(data))
    .catch((error: unknown) => {
      if (cachedClips.get(url) === clip) cachedClips.delete(url);
      throw error;
    });
  cachedClips.delete(url);
  cachedClips.set(url, clip);
  if (cachedClips.size > maxCachedClips) {
    const oldest = cachedClips.keys().next().value;
    if (oldest !== undefined) cachedClips.delete(oldest);
  }
  return clip;
}

export function prepareSyntaxClip(url: string | undefined) {
  // Reuse a context unlocked by a playback gesture. The first gesture can
  // still play an uncached clip by waiting for its decoder.
  if (url && audioContext?.state === "running") {
    void decodeClip(audioContext, url).catch(() => {});
  }
}

function playDecodedClip(context: AudioContext, buffer: AudioBuffer, onEnd: () => void) {
  const voice = context.createBufferSource();
  voice.buffer = buffer;
  voice.connect(context.destination);

  // Bluetooth and speaker outputs can discard the first syllable while waking.
  // This short, barely measurable signal keeps the voice at sample zero.
  const lead = context.createBuffer(1, Math.ceil(context.sampleRate * outputWarmupSeconds), context.sampleRate);
  const samples = lead.getChannelData(0);
  for (let index = 0; index < samples.length; index++) {
    samples[index] = (Math.random() * 2 - 1) * 0.0003;
  }
  const warmup = context.createBufferSource();
  warmup.buffer = lead;
  warmup.connect(context.destination);
  warmup.onended = () => warmup.disconnect();
  voice.onended = () => {
    voice.disconnect();
    onEnd();
  };
  const startTime = context.currentTime;
  warmup.start(startTime);
  voice.start(startTime + lead.duration);

  return () => {
    warmup.onended = null;
    voice.onended = null;
    warmup.stop();
    voice.stop();
    warmup.disconnect();
    voice.disconnect();
  };
}

export function useSyntaxAudio() {
  const element = useRef<HTMLAudioElement>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const request = useRef<{ sequence: number; stopRecording?: () => void }>({ sequence: 0 });
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");

  useEffect(() => {
    const audio = element.current;
    const activeRequest = request.current;
    return () => {
      activeRequest.sequence++;
      activeRequest.stopRecording?.();
      activeRequest.stopRecording = undefined;
      audio?.pause();
      if (utterance.current) window.speechSynthesis?.cancel();
    };
  }, []);

  function stop() {
    request.current.sequence++;
    request.current.stopRecording?.();
    request.current.stopRecording = undefined;
    element.current?.pause();
    if (utterance.current) {
      window.speechSynthesis?.cancel();
      utterance.current = null;
    }
    setState("idle");
  }

  function play(clip: string | undefined, text: string) {
    stop();
    const token = ++request.current.sequence;
    setState("loading");
    const speakWithBrowserVoice = () => {
      if (request.current.sequence !== token) return;
      if (!window.speechSynthesis || !("SpeechSynthesisUtterance" in window)) {
        setState("error");
        return;
      }
      const speech = new SpeechSynthesisUtterance(text);
      utterance.current = speech;
      speech.lang = "en-US";
      speech.rate = .9;
      speech.onstart = () => { if (request.current.sequence === token) setState("playing"); };
      speech.onend = () => { if (request.current.sequence === token) setState("idle"); };
      speech.onerror = () => { if (request.current.sequence === token) setState("error"); };
      window.speechSynthesis.speak(speech);
    };
    if (!clip) return speakWithBrowserVoice();

    const playMediaElement = () => {
      if (request.current.sequence !== token) return;
      const audio = element.current;
      if (!audio) return speakWithBrowserVoice();
      audio.onplaying = () => { if (request.current.sequence === token) setState("playing"); };
      audio.onended = () => { if (request.current.sequence === token) setState("idle"); };
      audio.src = clip;
      void audio.play().catch(speakWithBrowserVoice);
    };

    const context = getAudioContext();
    if (!context) return playMediaElement();
    const resumed = context.state === "running" ? Promise.resolve() : context.resume();
    void Promise.all([resumed, decodeClip(context, clip)]).then(([, buffer]) => {
      if (request.current.sequence !== token) return;
      request.current.stopRecording = playDecodedClip(context, buffer, () => {
        if (request.current.sequence !== token) return;
        request.current.stopRecording = undefined;
        setState("idle");
      });
      setState("playing");
    }).catch(playMediaElement);
  }

  return { element, state, play, stop };
}
