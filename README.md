# fair-dice-game
# Provably Fair Non-Transitive Dice Ga

This is a **provably fair command-line simulation** of a non-transitive dice game built using **Node.js**. It allows a player and the computer to choose dice and roll them in a fair and verifiable manner using **cryptographic HMAC** commitments.

---

## What Are Non-Transitive Dice?

Non-transitive dice are a special set of dice where:
- Die A beats Die B most of the time,
- Die B beats Die C most of the time,
- But Die C beats Die A most of the time.

This creates a rock-paper-scissors-like loop

---

## Features

- **Provably Fair** turn decision using HMAC (SHA3-256)
- 3 or more balanced non-transitive dice with custom faces
- Secure randomness using `crypto.randomBytes`
- Command-line configuration and gameplay
- ASCII-based dice table for selection
- Fully testable with various arguments

---

## Requirements

- Node.js 
- No third-party dependencies

---
