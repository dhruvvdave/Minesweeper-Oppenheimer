/**
 * Minesweeper: Oppenheimer Edition - Main Game Logic
 */

class MinesweeperGame {
    constructor() {
        // Game configuration
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        // Game state
        this.currentDifficulty = 'intermediate';
        this.rows = 16;
        this.cols = 16;
        this.mines = 40;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.mineLocations = [];
        this.firstClick = true;
        this.gameOver = false;
        this.gameWon = false;
        this.timer = 0;
        this.timerInterval = null;
        this.moves = 0;
        this.flagMode = false;
        
        // DOM elements
        this.boardElement = document.getElementById('game-board');
        this.mineCounter = document.getElementById('mine-counter');
        this.timerDisplay = document.getElementById('timer');
        this.moveCounter = document.getElementById('move-counter');
        this.highScoreDisplay = document.getElementById('high-score-display');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.createBoard();
    }
    
    setupEventListeners() {
        // Difficulty selector
        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            const difficulty = e.target.value;
            if (difficulty === 'custom') {
                document.getElementById('custom-settings').style.display = 'block';
                document.getElementById('settings-modal').classList.add('active');
            } else {
                this.changeDifficulty(difficulty);
            }
        });
        
        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('active');
        });
        
        // Mute button
        document.getElementById('mute-btn').addEventListener('click', () => {
            const enabled = SoundManager.toggle();
            const btn = document.getElementById('mute-btn');
            btn.querySelector('.icon').textContent = enabled ? '🔊' : '🔇';
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                document.getElementById(modalId).classList.remove('active');
            });
        });
        
        // Begin button (instructions modal)
        document.getElementById('begin-btn').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.remove('active');
        });
        
        // Game over modal buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('active');
            this.resetGame();
        });
        
        document.getElementById('change-difficulty-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.remove('active');
            document.getElementById('settings-modal').classList.add('active');
        });
        
        // Sound toggle in settings
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            if (e.target.checked !== SoundManager.enabled) {
                SoundManager.toggle();
                const btn = document.getElementById('mute-btn');
                btn.querySelector('.icon').textContent = SoundManager.enabled ? '🔊' : '🔇';
            }
        });
        
        // Animation speed
        document.getElementById('animation-speed').addEventListener('change', (e) => {
            Animations.setAnimationSpeed(e.target.value);
        });
        
        // Custom settings
        document.getElementById('apply-custom-btn').addEventListener('click', () => {
            this.applyCustomSettings();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r') {
                this.resetGame();
            } else if (e.key.toLowerCase() === 'f') {
                this.flagMode = !this.flagMode;
                // Visual feedback for flag mode could be added here
            }
        });
        
        // Prevent context menu on board
        this.boardElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    changeDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        const config = this.difficulties[difficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.mines = config.mines;
        this.updateHighScoreDisplay();
        this.resetGame();
    }
    
    applyCustomSettings() {
        const rows = parseInt(document.getElementById('custom-rows').value);
        const cols = parseInt(document.getElementById('custom-cols').value);
        const mines = parseInt(document.getElementById('custom-mines').value);
        
        // Validate inputs
        if (rows < 5 || rows > 30 || cols < 5 || cols > 30) {
            alert('Rows and columns must be between 5 and 30');
            return;
        }
        
        const maxMines = Math.floor(rows * cols * 0.8);
        if (mines < 1 || mines > maxMines) {
            alert(`Mines must be between 1 and ${maxMines}`);
            return;
        }
        
        this.currentDifficulty = 'custom';
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        
        document.getElementById('settings-modal').classList.remove('active');
        this.resetGame();
    }
    
    createBoard() {
        // Initialize board arrays
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.revealed = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        this.flagged = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        this.mineLocations = [];
        
        // Set grid template
        this.boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 35px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${this.rows}, 35px)`;
        
        // Clear and create cells
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Event listeners
                cell.addEventListener('click', (e) => this.handleLeftClick(row, col, e));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(row, col, e);
                });
                cell.addEventListener('mousedown', (e) => {
                    if (e.button === 1) { // Middle click
                        e.preventDefault();
                        this.handleChordClick(row, col, e);
                    }
                });
                
                this.boardElement.appendChild(cell);
            }
        }
        
        this.updateMineCounter();
    }
    
    placeMines(excludeRow, excludeCol) {
        // Create array of all positions
        const positions = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // Exclude first click and surrounding cells
                if (Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1) {
                    continue;
                }
                positions.push({ row, col });
            }
        }
        
        // Shuffle and place mines
        const shuffled = Utils.shuffleArray(positions);
        this.mineLocations = shuffled.slice(0, this.mines);
        
        // Mark mines on board
        this.mineLocations.forEach(({ row, col }) => {
            this.board[row][col] = -1; // -1 represents mine
        });
        
        // Calculate adjacent mine counts
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] !== -1) {
                    this.board[row][col] = this.countAdjacentMines(row, col);
                }
            }
        }
    }
    
    countAdjacentMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol) && this.board[newRow][newCol] === -1) {
                    count++;
                }
            }
        }
        return count;
    }
    
    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    handleLeftClick(row, col, event) {
        if (this.gameOver || this.flagged[row][col]) return;
        
        // Flag mode toggle
        if (this.flagMode) {
            this.handleRightClick(row, col, event);
            return;
        }
        
        // First click - place mines
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.startTimer();
        }
        
        this.revealCell(row, col);
        this.moves++;
        this.updateMoveCounter();
        
        SoundManager.play('reveal');
    }
    
    handleRightClick(row, col, event) {
        event.preventDefault();
        if (this.gameOver || this.revealed[row][col]) return;
        
        this.toggleFlag(row, col);
        SoundManager.play('flag');
    }
    
    handleChordClick(row, col, event) {
        event.preventDefault();
        if (this.gameOver || !this.revealed[row][col]) return;
        
        const adjacentFlags = this.countAdjacentFlags(row, col);
        const cellValue = this.board[row][col];
        
        if (adjacentFlags === cellValue && cellValue > 0) {
            // Reveal all non-flagged adjacent cells
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidCell(newRow, newCol) && !this.flagged[newRow][newCol]) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
            this.moves++;
            this.updateMoveCounter();
        }
    }
    
    countAdjacentFlags(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidCell(newRow, newCol) && this.flagged[newRow][newCol]) {
                    count++;
                }
            }
        }
        return count;
    }
    
    revealCell(row, col) {
        if (!this.isValidCell(row, col) || this.revealed[row][col] || this.flagged[row][col]) {
            return;
        }
        
        this.revealed[row][col] = true;
        const cell = this.getCellElement(row, col);
        cell.classList.add('revealed');
        
        const value = this.board[row][col];
        
        if (value === -1) {
            // Hit a mine
            this.handleMineHit(row, col, cell);
        } else if (value > 0) {
            // Show number
            cell.textContent = value;
            cell.dataset.count = value;
            this.createRevealEffect(cell);
        } else {
            // Empty cell - reveal adjacent cells
            this.createRevealEffect(cell);
            setTimeout(() => {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        this.revealCell(row + dr, col + dc);
                    }
                }
            }, 50);
        }
        
        this.checkWinCondition();
    }
    
    toggleFlag(row, col) {
        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.getCellElement(row, col);
        
        if (this.flagged[row][col]) {
            cell.classList.add('flagged');
            cell.textContent = '🚩';
        } else {
            cell.classList.remove('flagged');
            cell.textContent = '';
        }
        
        this.updateMineCounter();
    }
    
    handleMineHit(row, col, cell) {
        this.gameOver = true;
        this.stopTimer();
        
        cell.classList.add('exploded');
        cell.textContent = '💣';
        
        // Create explosion effect
        const pos = Utils.getCellPosition(cell);
        Animations.createExplosion(pos.x, pos.y);
        
        SoundManager.play('explosion');
        
        // Reveal all mines after a short delay
        setTimeout(() => {
            this.revealAllMines(row, col);
            this.showGameOver(false);
        }, 500);
    }
    
    revealAllMines(explodedRow, explodedCol) {
        this.mineLocations.forEach(({ row, col }) => {
            if (row === explodedRow && col === explodedCol) return;
            
            const cell = this.getCellElement(row, col);
            cell.classList.add('revealed', 'mine');
            cell.textContent = '💣';
        });
        
        // Show wrong flags
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.flagged[row][col] && this.board[row][col] !== -1) {
                    const cell = this.getCellElement(row, col);
                    cell.classList.add('revealed', 'wrong-flag');
                    cell.textContent = '❌';
                }
            }
        }
    }
    
    checkWinCondition() {
        if (this.gameOver) return;
        
        let unrevealedSafeCells = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.revealed[row][col] && this.board[row][col] !== -1) {
                    unrevealedSafeCells++;
                }
            }
        }
        
        if (unrevealedSafeCells === 0) {
            this.handleWin();
        }
    }
    
    handleWin() {
        this.gameOver = true;
        this.gameWon = true;
        this.stopTimer();
        
        SoundManager.play('victory');
        
        // Auto-flag remaining mines
        this.mineLocations.forEach(({ row, col }) => {
            if (!this.flagged[row][col]) {
                this.toggleFlag(row, col);
            }
        });
        
        // Victory animation
        this.playVictoryAnimation();
        
        // Check and save high score
        if (this.currentDifficulty !== 'custom' && Storage.isHighScore(this.currentDifficulty, this.timer)) {
            const accuracy = Utils.calculateAccuracy(this.rows * this.cols, this.mines, this.moves);
            Storage.saveHighScore(this.currentDifficulty, this.timer, this.moves, accuracy);
            this.updateHighScoreDisplay();
        }
        
        setTimeout(() => {
            this.showGameOver(true);
        }, 1500);
    }
    
    playVictoryAnimation() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('victory-cell');
            }, index * 10);
        });
        
        Animations.createConfetti(50);
    }
    
    createRevealEffect(cell) {
        const pos = Utils.getCellPosition(cell);
        Animations.createParticles(pos.x, pos.y, 6, '#ff8c00');
    }
    
    showGameOver(won) {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const quote = document.getElementById('game-quote');
        
        title.textContent = won ? 'Victory!' : 'Detonation';
        message.textContent = won ? 
            'All mines successfully located and disarmed.' : 
            'The chain reaction could not be stopped.';
        
        document.getElementById('final-time').textContent = Utils.formatTime(this.timer);
        document.getElementById('final-moves').textContent = this.moves;
        
        const accuracy = Utils.calculateAccuracy(this.rows * this.cols, this.mines, this.moves);
        document.getElementById('final-accuracy').textContent = accuracy + '%';
        
        quote.textContent = `"${Utils.getRandomQuote(won)}"`;
        
        modal.classList.add('active');
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimerDisplay() {
        this.timerDisplay.textContent = Utils.formatTime(this.timer);
    }
    
    updateMineCounter() {
        const flaggedCount = this.flagged.flat().filter(f => f).length;
        const remaining = this.mines - flaggedCount;
        this.mineCounter.textContent = remaining;
    }
    
    updateMoveCounter() {
        this.moveCounter.textContent = this.moves;
    }
    
    updateHighScoreDisplay() {
        if (this.currentDifficulty === 'custom') {
            this.highScoreDisplay.textContent = '--:--';
            return;
        }
        
        const highScore = Storage.getHighScore(this.currentDifficulty);
        if (highScore) {
            this.highScoreDisplay.textContent = Utils.formatTime(highScore.time);
        } else {
            this.highScoreDisplay.textContent = '--:--';
        }
    }
    
    getCellElement(row, col) {
        return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    
    resetGame() {
        this.stopTimer();
        this.firstClick = true;
        this.gameOver = false;
        this.gameWon = false;
        this.timer = 0;
        this.moves = 0;
        this.flagMode = false;
        
        this.updateTimerDisplay();
        this.updateMoveCounter();
        this.createBoard();
        
        SoundManager.play('click');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new MinesweeperGame();
    
    // Make game accessible globally for debugging
    window.game = game;
});
