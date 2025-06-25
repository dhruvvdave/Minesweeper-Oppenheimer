
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.GridPane;
import java.util.Random;

public class GameBoard extends GridPane {
    private final int rows;
    private final int cols;
    private final int bombs;
    private final Button[][] buttons;
    private final boolean[][] hasBomb;
    private final boolean[][] revealed;
    private final boolean[][] flagged;
    private final MinesweeperFX app;
    private int flagsLeft;

    public GameBoard(int rows, int cols, int bombs, MinesweeperFX app) {
        this.rows = rows;
        this.cols = cols;
        this.bombs = bombs;
        this.app = app;
        this.flagsLeft = bombs;

        this.setAlignment(Pos.CENTER);
        this.setHgap(2);
        this.setVgap(2);
        this.setStyle("-fx-background-color: #111; -fx-padding: 20px;");

        buttons = new Button[rows][cols];
        hasBomb = new boolean[rows][cols];
        revealed = new boolean[rows][cols];
        flagged = new boolean[rows][cols];

        generateBombs();

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Button btn = new Button();
                btn.setPrefSize(40, 40);
                btn.setStyle("-fx-background-color: #333; -fx-border-color: #888;");
                final int row = r, col = c;
                btn.setOnMouseClicked(e -> {
                    switch (e.getButton()) {
                        case PRIMARY -> reveal(row, col);
                        case SECONDARY -> toggleFlag(row, col);
                    }
                });
                buttons[r][c] = btn;
                this.add(btn, c, r);
            }
        }
    }

    private void generateBombs() {
        Random rand = new Random();
        int placed = 0;
        while (placed < bombs) {
            int r = rand.nextInt(rows);
            int c = rand.nextInt(cols);
            if (!hasBomb[r][c]) {
                hasBomb[r][c] = true;
                placed++;
            }
        }
    }

    private void toggleFlag(int r, int c) {
        if (revealed[r][c]) return;
        Button btn = buttons[r][c];
        if (flagged[r][c]) {
            flagged[r][c] = false;
        btn.setGraphic(null);
            flagsLeft++;
        } else if (flagsLeft > 0) {
            ImageView flagIcon = new ImageView(new Image("file:resources/flag.png"));
            flagIcon.setFitWidth(20);
            flagIcon.setFitHeight(20);
            btn.setGraphic(flagIcon);
            flagged[r][c] = true;
            flagsLeft--;
        }
        app.updateFlagCount(flagsLeft);
    }

    private void reveal(int r, int c) {
        if (r < 0 || c < 0 || r >= rows || c >= cols || revealed[r][c] || flagged[r][c]) return;
        revealed[r][c] = true;
        Button btn = buttons[r][c];
        btn.setDisable(true);

        if (hasBomb[r][c]) {
            ImageView bombIcon = new ImageView(new Image("file:resources/bomb.png"));
            bombIcon.setFitWidth(20);
            bombIcon.setFitHeight(20);
            btn.setGraphic(bombIcon);
            app.showEndScreen(false);
            return;
        }

        int count = countAdjacentBombs(r, c);
        if (count > 0) {
            btn.setText(String.valueOf(count));
            btn.setStyle("-fx-background-color: #222; -fx-text-fill: orange;");
        } else {
            btn.setStyle("-fx-background-color: #1a1a1a;");
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    if (dr != 0 || dc != 0) {
                        reveal(r + dr, c + dc);
                    }
                }
            }
        }

        checkWin();
    }

    private int countAdjacentBombs(int r, int c) {
        int count = 0;
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && hasBomb[nr][nc]) {
                    count++;
                }
            }
        }
        return count;
    }

    private void checkWin() {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (!hasBomb[r][c] && !revealed[r][c]) {
                    return;
                }
            }
        }
        app.showEndScreen(true);
    }
}
