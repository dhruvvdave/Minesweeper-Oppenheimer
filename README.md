## 💣 Minesweeper: Oppenheimer Edition

A dramatic, web-based reimagining of the classic Minesweeper game with an Oppenheimer-inspired aesthetic. Play instantly in your browser with stunning visual effects and smooth animations.

---

## 🎮 Features

### Core Gameplay
- **Multiple Difficulty Levels**: Beginner (9x9), Intermediate (16x16), Expert (30x16), and Custom
- **First-Click Protection**: Your first click is always safe
- **Smart Auto-Reveal**: Clicking empty cells automatically reveals safe adjacent areas
- **Flag System**: Right-click to mark suspected mines
- **Chord Clicking**: Middle-click on numbered cells to quickly reveal surrounding cells
- **Timer & Stats**: Track your time, moves, and accuracy

### Visual Excellence
- **Oppenheimer Theme**: Dark, dramatic color scheme with atomic-inspired visuals
- **Particle Effects**: Cells burst with particles when revealed
- **Explosion Animations**: Dramatic effects when hitting a mine
- **Victory Celebration**: Confetti and animated cells on winning
- **Smooth Transitions**: All interactions feature polished animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Quality of Life
- **High Score Tracking**: Best times saved locally for each difficulty
- **Keyboard Shortcuts**: R to reset, F to toggle flag mode
- **Settings Panel**: Customize animation speed and sound
- **No Installation**: Runs directly in any modern browser
- **Thematic Quotes**: Oppenheimer quotes on win/loss screens

---

## 🚀 How to Play

### Quick Start
1. Simply open `index.html` in any modern web browser
2. No installation, no build process, no downloads required!
3. Click "Begin Simulation" to start playing

### Controls
- **Left Click**: Reveal a cell
- **Right Click**: Flag/unflag a suspected mine
- **Middle Click**: Chord click (reveal surrounding cells if flags match the number)
- **R Key**: Reset the current game
- **F Key**: Toggle flag mode for touch devices

### Objective
Clear all cells without detonating any mines. Numbers indicate how many mines are adjacent to that cell. Use logic and deduction to identify mine locations and flag them.

---

## 🎨 Technical Details

### Technologies Used
- **HTML5**: Semantic structure with accessibility in mind
- **CSS3**: Modern animations, gradients, and responsive design
- **Vanilla JavaScript**: No frameworks, maximum compatibility
- **LocalStorage API**: Persistent high score tracking
- **CSS Grid**: Perfectly aligned game board

### File Structure
```
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with Oppenheimer theme
├── game.js         # Core game logic and state management
├── utils.js        # Utility functions and helpers
├── README.md       # This file
└── resources/      # Legacy JavaFX assets (optional)
```

### Browser Compatibility
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Optimized for 60fps animations
- Efficient cell reveal algorithms
- Minimal DOM manipulation
- Hardware-accelerated CSS transforms

---

## 🎯 Game Mechanics

### Difficulty Levels
| Level | Grid Size | Mines | Recommended For |
|-------|-----------|-------|-----------------|
| Beginner | 9×9 | 10 | Learning the game |
| Intermediate | 16×16 | 40 | Casual players |
| Expert | 30×16 | 99 | Advanced players |
| Custom | Variable | Variable | Your preference |

### Advanced Features
- **First-click safety**: Board regenerates if first click would hit a mine
- **Chain reactions**: Empty cells trigger cascading reveals
- **Smart flagging**: Mine counter updates as you flag cells
- **Accuracy tracking**: See how efficiently you played
- **High score system**: Compete against your best times

---

## 🎬 Theme & Aesthetic

Inspired by the film *Oppenheimer*, this version features:
- Dark, dramatic color palette (#0a0a0a background with #ff4500 accents)
- Rajdhani font for that technical, atomic-era feel
- Particle effects simulating atomic reactions
- Explosion animations for mine detonations
- Thematic quotes from the Manhattan Project era
- Glowing effects and atmospheric background gradients

---

## 🙏 Credits

- **Original Game**: Microsoft Minesweeper
- **Previous Version**: JavaFX implementation by Dhruv Dave
- **Web Version**: Complete reimagining with modern web technologies
- **Theme Inspiration**: Oppenheimer (2023 film)
- **Font**: Rajdhani by Google Fonts
- **Icons**: Unicode emoji for maximum compatibility

---

## 📝 Development Notes

### Legacy JavaFX Version
The original JavaFX version is preserved in the `src/` directory. To run it:
```bash
java --module-path <javafx-path>/lib \
     --add-modules javafx.controls \
     -jar MinesweeperFX_Oppenheimer.jar
```

### Web Version Advantages
- ✅ No installation required
- ✅ Cross-platform (runs anywhere)
- ✅ Instant loading
- ✅ Better performance
- ✅ Modern animations
- ✅ Mobile-friendly
- ✅ Easy to share (just send the URL)

---

## 🎉 Start Playing!

**Open `index.html` in your browser and enjoy the most epic Minesweeper experience with an Oppenheimer twist!** 🎮💣⚛️

*"Now I am become Death, the destroyer of worlds."* - J. Robert Oppenheimer
