#!/usr/bin/env python3
"""
Generates the PLACEHOLDER background music: an original, gentle music-box
waltz synthesised from scratch (sine partials + a soft pad). It contains no
samples or third-party material, so it is free of copyright concerns.

Replace it with the family's chosen (authorised) track — see README.md.

Requirements: Python 3 with numpy, and ffmpeg on the PATH.
Usage:        python3 scripts/generate-placeholder-music.py
Output:       public/audio/placeholder-music.mp3
"""
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
BPM = 76
BEAT = 60 / BPM          # a 3/4 waltz: three beats per bar
BAR = 3 * BEAT

# Note helpers -------------------------------------------------------------
NAMES = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3,
         'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}


def hz(note: str) -> float:
    name, octave = note[:-1], int(note[-1])
    semis = NAMES[name] + (octave - 4) * 12
    return 440.0 * 2 ** (semis / 12)


# Progression in D major: one chord per bar (bass, arpeggio pattern).
PROGRESSION = [
    ('D2',  ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4']),
    ('C#3', ['C#4', 'E4', 'A4', 'C#5', 'A4', 'E4']),
    ('B2',  ['B3', 'D4', 'F#4', 'B4', 'F#4', 'D4']),
    ('G2',  ['G3', 'B3', 'D4', 'G4', 'D4', 'B3']),
    ('F#2', ['F#3', 'A3', 'D4', 'F#4', 'D4', 'A3']),
    ('E2',  ['E3', 'G3', 'B3', 'D4', 'B3', 'G3']),
    ('A2',  ['A3', 'D4', 'E4', 'A4', 'E4', 'D4']),
    ('A2',  ['A3', 'C#4', 'E4', 'G4', 'E4', 'C#4']),
]

# A simple, original melody for the second pass: (bar, beat, note, beats).
MELODY = [
    (0, 0, 'F#5', 2), (0, 2, 'E5', 1),
    (1, 0, 'E5', 2), (1, 2, 'C#5', 1),
    (2, 0, 'D5', 2), (2, 2, 'B4', 1),
    (3, 0, 'B4', 3),
    (4, 0, 'A4', 1), (4, 1, 'D5', 1), (4, 2, 'F#5', 1),
    (5, 0, 'G5', 2), (5, 2, 'E5', 1),
    (6, 0, 'E5', 2), (6, 2, 'F#5', 1),
    (7, 0, 'E5', 3),
]

PASSES = 2
FINAL = 'D'  # resolve on the tonic so the loop restarts gracefully
total_bars = len(PROGRESSION) * PASSES + 2
length = int(SR * (total_bars * BAR + 3.0))
mix = np.zeros(length)


def add(sig: np.ndarray, start_s: float, gain: float) -> None:
    i = int(start_s * SR)
    j = min(length, i + len(sig))
    mix[i:j] += sig[: j - i] * gain


def music_box(freq: float, dur: float = 2.6) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.4) * (1 - np.exp(-t * 900))
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.28 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 3)
            + 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 6))
    return tone * env


def pad(freqs: list[float], dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    attack = np.minimum(1, t / 0.9)
    release = np.minimum(1, (dur - t) / 1.2)
    env = attack * np.clip(release, 0, 1)
    tone = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) for f in freqs)
    return tone * env / len(freqs)


def bass(freq: float, dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 1.1) * (1 - np.exp(-t * 200))
    return (np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)) * env


for p in range(PASSES):
    for b, (root, arp) in enumerate(PROGRESSION):
        bar_start = (p * len(PROGRESSION) + b) * BAR
        add(bass(hz(root), BAR * 1.4), bar_start, 0.22)
        add(pad([hz(n) for n in arp[:3]], BAR + 1.2), bar_start, 0.07)
        for k, note in enumerate(arp):
            human = (k % 2) * 0.012
            add(music_box(hz(note)), bar_start + k * (BEAT / 2) + human, 0.16 if k else 0.2)
    if p == 1:
        base = len(PROGRESSION) * BAR
        for bar, beat, note, beats in MELODY:
            add(music_box(hz(note), 3.2), base + bar * BAR + beat * BEAT, 0.2)

# Final tonic chord.
end = len(PROGRESSION) * PASSES * BAR
add(bass(hz('D2'), 5), end, 0.22)
add(pad([hz('D4'), hz('F#4'), hz('A4')], 5), end, 0.08)
for k, n in enumerate(['D4', 'F#4', 'A4', 'D5']):
    add(music_box(hz(n), 4), end + k * 0.12, 0.17)

mix /= np.max(np.abs(mix)) * 1.05
pcm = (mix * 32767).astype(np.int16)

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out_path = os.path.join(root_dir, 'public', 'audio', 'placeholder-music.mp3')
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with tempfile.TemporaryDirectory() as tmp:
    wav_path = os.path.join(tmp, 'dry.wav')
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-i', wav_path,
        '-af', ('aecho=0.8:0.6:70|140|260|420:0.28|0.2|0.14|0.08,'
                'lowpass=f=7000,afade=t=in:d=1.5,areverse,afade=t=in:d=2.5,areverse,'
                'loudnorm=I=-21:TP=-2:LRA=9'),
        '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '80k',
        '-metadata', 'title=Placeholder waltz (original, generated)',
        out_path,
    ], check=True)

print(f'wrote {out_path} ({os.path.getsize(out_path) / 1024:.0f} KB)')
