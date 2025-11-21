# Game Audio System - Audio Files Required

## Summary
The game now has a complete audio system with background music and sound effects for all game events.

## Audio Files Required

Place these files in the project root directory (same folder as game.html):

### 1. **backgroundloop.mp3**
- **Purpose**: Background music for the game
- **Behavior**: Loops continuously while game is playing
- **Stops**: When player wins or loses
- **Restarts**: When player clicks "Retry" and starts new game
- **Suggested**: Upbeat, non-distracting background music (3-5 seconds loopable)

### 2. **correct.mp3**
- **Purpose**: Plays when player selects correct answer
- **Behavior**: One-time sound effect, ~0.5-1 second
- **Volume**: 80%
- **Suggested**: Positive "ding" or "chime" sound effect

### 3. **wrong.mp3**
- **Purpose**: Plays when player selects wrong answer
- **Behavior**: One-time sound effect, ~0.5-1 second
- **Volume**: 80%
- **Suggested**: Negative "buzzer" or "error" sound effect

### 4. **swordslide.mp3**
- **Purpose**: Plays when rope/blade falls after wrong answer (not the final one)
- **Behavior**: One-time sound effect, ~0.3-0.5 second
- **Volume**: 90%
- **Timing**: Plays when wrong count is 1 or 2 (not the lethal blow)
- **Suggested**: Whooshing or sliding sound (blade descending)

### 5. **bladeslide.mp3**
- **Purpose**: Plays when blade makes final drop (player loses)
- **Behavior**: One-time sound effect, ~0.5-1 second
- **Volume**: 90%
- **Timing**: Plays when wrong count reaches maximum (wrong > MAX_WRONG)
- **Suggested**: Heavy metallic "chop" or final decisive sound

### 6. **losinghorn.mp3**
- **Purpose**: First sound in losing sequence when player fails
- **Behavior**: Plays at end of game when player loses
- **Volume**: 80%
- **Duration**: ~1-2 seconds
- **Then**: Automatically followed by dogbark.mp3
- **Suggested**: Sad trombone, horn, or losing fanfare sound

### 7. **dogbark.mp3**
- **Purpose**: Plays after losinghorn.mp3 when player loses
- **Behavior**: Second part of losing sequence
- **Volume**: 80%
- **Suggested**: Sad or disappointed dog bark

### 8. **brasswin.mp3**
- **Purpose**: First sound in winning sequence when player wins
- **Behavior**: Plays at end of game when player wins
- **Volume**: 80%
- **Duration**: ~1-2 seconds
- **Then**: Automatically followed by dogbark.mp3
- **Suggested**: Triumphant brass fanfare or victory theme

---

## Game Audio Flow

### Game Start
```
Player clicks "Retry" or page loads
    ↓
init() called
    ↓
initAudio() (creates audio element)
    ↓
playBackgroundMusic() starts
    ↓
🔊 backgroundloop.mp3 begins (loops forever)
```

### During Gameplay - Correct Answer
```
Player clicks correct answer
    ↓
playCorrectSound() triggered
    ↓
🔊 correct.mp3 plays (0.8 volume)
    ↓
Progress updates
    ↓
Next question appears
```

### During Gameplay - Wrong Answer (1st or 2nd wrong)
```
Player clicks wrong answer
    ↓
playWrongSound() triggered
    ↓
🔊 wrong.mp3 plays (0.8 volume)
    ↓
Blade falls slightly
    ↓
100ms delay
    ↓
playSwordSlideSound() triggered
    ↓
🔊 swordslide.mp3 plays (0.9 volume)
    ↓
Progress updates, blade descends
    ↓
Next question appears
```

### During Gameplay - Wrong Answer (3rd wrong - GAME OVER)
```
Player clicks 3rd wrong answer
    ↓
playWrongSound() triggered
    ↓
🔊 wrong.mp3 plays (0.8 volume)
    ↓
Blade falls to bottom (killing blow)
    ↓
100ms delay
    ↓
playBladeSlideSound() triggered
    ↓
🔊 bladeslide.mp3 plays (0.9 volume)
    ↓
Scene shakes
    ↓
260ms later: lose() executes
    ↓
stopBackgroundMusic() - 🔇 backgroundloop.mp3 stops
    ↓
playLosingSequence() triggered
    ↓
🔊 losinghorn.mp3 plays (0.8 volume)
    ↓
When losinghorn.mp3 ends:
    ↓
🔊 dogbark.mp3 plays (0.8 volume)
    ↓
"Game Over" screen shown
```

### When Player Wins
```
Player answers all 5 questions correctly
    ↓
win() executes
    ↓
stopBackgroundMusic() - 🔇 backgroundloop.mp3 stops
    ↓
playWinningSequence() triggered
    ↓
🔊 brasswin.mp3 plays (0.8 volume)
    ↓
When brasswin.mp3 ends:
    ↓
🔊 dogbark.mp3 plays (0.8 volume)
    ↓
Victory screen shown
```

---

## Audio Specifications

### Recommended Specs for All Files
- **Format**: MP3 (for web compatibility)
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128-192 kbps
- **Channels**: Mono or Stereo (both supported)
- **File Size**: Keep under 500KB per file for fast loading

### Volume Levels Used
- Background Music: 50% (0.5)
- Correct/Wrong/Horn/Bark/Win: 80% (0.8)
- Blade Sounds: 90% (0.9)

---

## Code Implementation Details

### Audio Manager Functions

**`initAudio()`**
- Creates audio element for background loop
- Runs on game start
- Safe to call multiple times (checks if already created)

**`playBackgroundMusic()`**
- Starts background loop
- Resets to beginning
- Sets isGameActive flag to true

**`stopBackgroundMusic()`**
- Pauses background loop
- Resets position to start
- Sets isGameActive flag to false

**`playSoundEffect(fileName, volume)`**
- Generic function to play any sound effect
- Creates new audio element
- Used by all specific sound functions

**`playCorrectSound()`**
- Plays correct.mp3 at 80% volume

**`playWrongSound()`**
- Plays wrong.mp3 at 80% volume

**`playSwordSlideSound()`**
- Plays swordslide.mp3 at 90% volume
- Called when wrong but not game over

**`playBladeSlideSound()`**
- Plays bladeslide.mp3 at 90% volume
- Called on final losing strike

**`playLosingSequence()`**
- Plays losinghorn.mp3, then dogbark.mp3
- Stops background music first
- Uses onended callback for sequence

**`playWinningSequence()`**
- Plays brasswin.mp3, then dogbark.mp3
- Stops background music first
- Uses onended callback for sequence

---

## Integration Points in game.js

### 1. Game Initialization (Line ~202)
```javascript
init() {
  // ... other code ...
  initAudio();
  playBackgroundMusic();
  // ... other code ...
}
```

### 2. Answer Handling (Line ~240)
```javascript
onAnswer() {
  // Plays correct.mp3 or wrong.mp3
  if (correct) {
    playCorrectSound();
  } else {
    playWrongSound();
  }
  
  // Plays swordslide.mp3 or bladeslide.mp3
  if (wrong < MAX_WRONG) {
    setTimeout(() => playSwordSlideSound(), 100);
  } else {
    setTimeout(() => playBladeSlideSound(), 100);
  }
}
```

### 3. Win Condition (Line ~280)
```javascript
win() {
  // ... other code ...
  playWinningSequence();
}
```

### 4. Lose Condition (Line ~290)
```javascript
lose() {
  // ... other code ...
  playLosingSequence();
}
```

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge) all support HTML5 `<audio>` element
- Audio playback requires user interaction on some browsers (first interaction needed)
- If audio doesn't play on first load, player must click something first

---

## Troubleshooting

### Audio Not Playing
1. Check that all MP3 files are in the root directory
2. Verify file names match exactly (case-sensitive)
3. Check browser console for errors
4. Ensure browser hasn't muted audio (check volume settings)
5. Try refreshing page

### Audio Playing Multiple Times
- Each sound effect creates new audio element
- Background loop is reused, so won't multiply

### Audio Quality Issues
- Check MP3 bitrate (should be 128kbps+)
- Verify audio isn't corrupted
- Test file with audio player first

---

## Future Enhancements

Could add:
- Mute button in game UI
- Volume slider
- Different music for menu
- Sound toggle in settings
- Audio preloading for faster playback

