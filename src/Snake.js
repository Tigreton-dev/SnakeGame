const BOARD_SIZE = 20;
const SNAKE_START_SIZE = 5;

export class Snake {
    constructor() {
        this.board = [];
        this.rowSize = 0;
        this.food = {};
        this.snake = [];
        this.score = 0;
        this.lastTailPosition = {};
        this.currentDirection = "";
        this.isGameOver = false;
    }

    startGame() {
        this.setSnakePosition();
        this.setFoodPosition();
        this.createBoard();
    }

    getState() {
        return {
            board: this.board,
            snake: this.snake,
            food: this.food,
            rowSize: this.rowSize,
            isGameOver: this.isGameOver,
            score: this.score,
        };
    }

    setSnakePosition() {
        const snake = [];
        let Xpos = Math.floor(Math.random() * (20 - SNAKE_START_SIZE + 1)) + SNAKE_START_SIZE;
        let Ypos = Math.floor(Math.random() * (20 - SNAKE_START_SIZE + 1)) + SNAKE_START_SIZE;
        snake.push({ Xpos, Ypos, head: true });
        const direction = Math.random() < 0.5 ? "right" : "down";
        for (let i = 1; i < SNAKE_START_SIZE; i++) {
            direction === "right" ? (Ypos = Ypos - 1) : (Xpos = Xpos - 1);
            snake.push({ Xpos, Ypos });
        }

        // Update State
        this.snake = [...snake];
        this.currentDirection = direction;
    }

    setFoodPosition() {
        let XFoodpos = Math.floor(Math.random() * 19) + 1;
        let YFoodpos = Math.floor(Math.random() * 19) + 1;
        for (let i = 0; i < this.snake.length; i++) {
          while (XFoodpos === this.snake[i].Xpos && YFoodpos === this.snake[i].Ypos) {
            XFoodpos = Math.floor(Math.random() * 19) + 1;
            YFoodpos = Math.floor(Math.random() * 19) + 1;
          }
        }

        // Update State
        this.food = { XFoodpos, YFoodpos };
    }

    createBoard() {
        // 1- GET CELL SIZE
        const boardWidth =
        window.innerWidth / 2 > 800 ? 800 : window.innerWidth / 2;
        const rowSize = boardWidth / 20;
        const boardElement = document.getElementById("board-id");
        boardElement.style.width = boardWidth - 2 + "px";
        this.rowSize = rowSize - 2.1;

        // 2- SET THE ROW AND CELLS OF THE BOARD
        let counter = 1;
        const board = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
          const currentRow = [];
          for (let col = 0; col < BOARD_SIZE; col++) {
            currentRow.push(counter++);
            if (counter > BOARD_SIZE) counter = 1;
          }
          board.push(currentRow);
        }
    
        // 3- CREATE THE HTML BOARD FROM THE BOARD ARRAY
        const result = board.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="row" style={{ height: this.rowSize }}>
              {row.map((cell, cellIdx) => (
                <div
                  key={cellIdx}
                  className={this.getCellClassName([rowIdx, cell])}
                  style={{ height: this.rowSize, width: this.rowSize }}
                ></div>
              ))}
            </div>
          );
        });

        // 4- RETURN THE HTML BOARD TO THE GLOBAL STATE BOARD
        this.board = result;
    }

    getCellClassName = (cellValue) => {
        let className = "cell";
        if (
          cellValue[0] === this.food.XFoodpos &&
          cellValue[1] === this.food.YFoodpos
        )
          className = "cell cell-red";
        this.snake.forEach((elem) => {
          if (elem.Xpos === cellValue[0] && elem.Ypos === cellValue[1])
            className = "cell cell-green";
          if (elem.Xpos === cellValue[0] && elem.Ypos === cellValue[1] && elem.head)
            className = "cell cell-orange";
        });
    
        return className;
    }

    gameLoop() {
        this.createBoard();
        this.moveSnake();
        this.eatSnake();
        this.eatFood();
    }

    moveSnake() {
        const snake = [...this.snake];
        const resutl = [];

        switch (this.currentDirection) {
          case "up":
            snake[0].Xpos <= 0
              ? resutl.push({ Xpos: 19, Ypos: this.snake[0].Ypos, head: true })
              : resutl.push({
                  Xpos: snake[0].Xpos - 1,
                  Ypos: this.snake[0].Ypos,
                  head: true,
                });
            break;
          case "left":
            snake[0].Ypos <= 1
              ? resutl.push({ Xpos: this.snake[0].Xpos, Ypos: 20, head: true })
              : resutl.push({
                  Xpos: snake[0].Xpos,
                  Ypos: this.snake[0].Ypos - 1,
                  head: true,
                });
            break;
          case "right":
            snake[0].Ypos >= 20
              ? resutl.push({ Xpos: snake[0].Xpos, Ypos: 1, head: true })
              : resutl.push({
                  Xpos: snake[0].Xpos,
                  Ypos: this.snake[0].Ypos + 1,
                  head: true,
                });
            break;
          case "down":
            snake[0].Xpos >= 19
              ? resutl.push({ Xpos: 0, Ypos: this.snake[0].Ypos, head: true })
              : resutl.push({
                  Xpos: snake[0].Xpos + 1,
                  Ypos: this.snake[0].Ypos,
                  head: true,
                });
            break;
          default:
        }
    
        for (let i = 1; i < snake.length; i++) {
          resutl.push({
            Xpos: this.snake[i - 1].Xpos,
            Ypos: this.snake[i - 1].Ypos,
          });
        }
    
        // Update State
        this.lastTailPosition = this.snake[snake.length - 1];
        this.snake = [...resutl];
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
          case 32:
            this.resetGame();
            break;
          case 37:
          case 65:
            if (this.currentDirection === "right") return;
            this.currentDirection = "left";
            break;
          case 38:
          case 87:
            if (this.currentDirection === "down") return;
            this.currentDirection = "up";
            break;
          case 39:
          case 68:
            if (this.currentDirection === "left") return;
            this.currentDirection = "right";
            break;
          case 40:
          case 83:
            if (this.currentDirection === "up") return;
            this.currentDirection = "down";
            break;
          default:
        }
    }

    eatFood() {
        const snake = [...this.snake];
        const food = this.food;
    
        // if the snake's head is on an food
        if (snake[0].Xpos === food.XFoodpos && snake[0].Ypos === food.YFoodpos) {
          const newTail = this.lastTailPosition;
    
          // increase snake size
          snake.push(newTail);
    
          // Set Food position
          let XFoodpos = Math.floor(Math.random() * 19) + 1;
          let YFoodpos = Math.floor(Math.random() * 19) + 1;
          for (let i = 0; i < snake.length; i++) {
            while (XFoodpos === snake[i].Xpos && YFoodpos === snake[i].Ypos) {
              XFoodpos = Math.floor(Math.random() * 19) + 1;
              YFoodpos = Math.floor(Math.random() * 19) + 1;
            }
          }
    
          // Update State
          this.snake = snake;
          this.food = { XFoodpos, YFoodpos };
          this.score++;
          const highScore = Number(localStorage.getItem("snakeHighScore")) || 0;
          if (this.score > highScore) {
            localStorage.setItem("snakeHighScore", this.score);
          }
        }
    }

    eatSnake() {
        const snake = this.snake;
        for (let i = 1; i < snake.length; i++) {
          if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos)
            this.isGameOver = true;
        }
    }

    resetGame() {
        this.board = [];
        this.snake = [];
        this.lastTailPosition = {};
        this.food = {};
        this.currentDirection = "";
        this.isGameOver = false;
        this.score = 0;
        this.rowSize = 0;
        this.startGame();
    }
}