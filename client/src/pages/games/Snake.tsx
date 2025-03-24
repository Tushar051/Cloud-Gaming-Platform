import React, { useState, useEffect } from "react";

// Constants
const boardSize = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: 5, y: 5 };
const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState(directions.ArrowRight);
  const [gameOver, setGameOver] = useState(false);

  // Handle Key Press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (directions[event.key]) {
        setDirection(directions[event.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Move Snake
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check for collisions
        if (
          newHead.x < 0 ||
          newHead.x >= boardSize ||
          newHead.y < 0 ||
          newHead.y >= boardSize ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          clearInterval(interval);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check for food consumption
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Snake Game</h2>
      {gameOver && <h3 style={{ color: "red" }}>Game Over! Press any key to restart.</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardSize}, 20px)`,
          gap: "2px",
          margin: "20px auto",
          width: `${boardSize * 22}px`,
          background: "#333",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => {
            const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  width: "20px",
                  height: "20px",
                  background: isSnake ? "limegreen" : isFood ? "red" : "#000",
                  borderRadius: "3px",
                }}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
