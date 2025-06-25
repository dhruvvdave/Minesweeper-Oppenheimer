
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import javafx.geometry.Pos;

public class MinesweeperFX extends Application {
    private Stage stage;
    private Text flagCounterText;

    @Override
    public void start(Stage primaryStage) {
        this.stage = primaryStage;
        showTitleScreen();
    }

    public void showTitleScreen() {
        ImageView introImage = new ImageView(new Image("file:resources/title.jpg"));
        introImage.setFitWidth(800);
        introImage.setPreserveRatio(true);

        Button playButton = new Button("Begin Simulation");
        playButton.setStyle("-fx-font-size: 18px; -fx-background-color: darkred; -fx-text-fill: white;");
        playButton.setOnAction(e -> showInstructionsScreen());

        VBox layout = new VBox(20, introImage, playButton);
        layout.setStyle("-fx-background-color: black;");
        layout.setAlignment(Pos.CENTER);
        stage.setScene(new Scene(layout, 800, 650));
        stage.setTitle("Trinity Minesweeper");
        stage.show();
    }

    public void showInstructionsScreen() {
        ImageView instructions = new ImageView(new Image("file:resources/instructions.jpg"));
        instructions.setFitWidth(800);
        instructions.setPreserveRatio(true);

        Button startGame = new Button("Commence Test");
        startGame.setStyle("-fx-font-size: 16px; -fx-background-color: darkgreen; -fx-text-fill: white;");
        startGame.setOnAction(e -> showGameScreen());

        VBox layout = new VBox(20, instructions, startGame);
        layout.setStyle("-fx-background-color: black;");
        layout.setAlignment(Pos.CENTER);
        stage.setScene(new Scene(layout, 800, 650));
    }

    public void showGameScreen() {
        flagCounterText = new Text("Flags left: 10");
        flagCounterText.setStyle("-fx-font-size: 16px; -fx-fill: orange;");

        GameBoard board = new GameBoard(10, 10, 10, this);
        VBox root = new VBox(10, flagCounterText, board);
        root.setAlignment(Pos.CENTER);
        root.setStyle("-fx-background-color: #1b1b1b; -fx-padding: 20px;");
        stage.setScene(new Scene(root, 500, 600));
    }

    public void showEndScreen(boolean win) {
        String file = win ? "win.jpg" : "lose.jpg";
        ImageView endImage = new ImageView(new Image("file:resources/" + file));
        endImage.setFitWidth(800);
        endImage.setPreserveRatio(true);

        Button menuButton = new Button("Return to Main Menu");
        menuButton.setStyle("-fx-font-size: 16px; -fx-background-color: gray; -fx-text-fill: white;");
        menuButton.setOnAction(e -> showTitleScreen());

        VBox layout = new VBox(20, endImage, menuButton);
        layout.setAlignment(Pos.CENTER);
        layout.setStyle("-fx-background-color: black;");
        stage.setScene(new Scene(layout, 800, 650));
    }

    public void updateFlagCount(int flagsLeft) {
        flagCounterText.setText("Flags left: " + flagsLeft);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
