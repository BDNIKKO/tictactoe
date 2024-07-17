import { useState } from 'react';
// Imports the useState hook from React to manage state in the functional component.

import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';
// Imports specific components from the react-bootstrap library for layout and styling.

import './index.css';
// Imports a CSS file for custom styling of the components.

function Square({ value, onSquareClick, highlight }) {
  // Defines a functional component Square which represents a single square in the tic-tac-toe board.
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
    // Renders a button element with dynamic classes and an onClick event handler.
    // The button displays the value (X, O, or null) and highlights if it's part of the winning combination.
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  // Defines a functional component Board that represents the entire tic-tac-toe board.

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares.includes(i)}
      />
      // Calls the Square component for each square in the board.
      // Passes the square's value, onClick handler, and highlight status as props.
    );
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // If the game already has a winner or the square is already filled, do nothing.
    
    const nextSquares = squares.slice();
    // Creates a copy of the current squares array.
    
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Updates the square with 'X' or 'O' based on the current player.

    onPlay(nextSquares, i);
    // Calls the onPlay function with the updated squares and the clicked square index.
  }

  const winner = calculateWinner(squares);
  // Determines if there's a winner based on the current state of the squares.

  let status;
  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else if (squares.every(square => square !== null && square !== undefined)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  // Sets the status message based on the game state: winner, draw, or next player.

  const boardSize = 3;
  // Defines the size of the tic-tac-toe board (3x3).

  const board = [];
  for (let row = 0; row < boardSize; row++) {
    const columns = [];
    for (let col = 0; col < boardSize; col++) {
      columns.push(renderSquare(row * boardSize + col));
    }
    board.push(<div key={row} className="board-row">{columns}</div>);
    // Constructs the board as a grid of squares using the renderSquare function.
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
    // Renders the status message and the board.
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  // Initializes the state for the game history, an array of objects with squares and locations.

  const [currentMove, setCurrentMove] = useState(0);
  // Initializes the state for the current move index.

  const [isAscending, setIsAscending] = useState(true);
  // Initializes the state for the move list sort order (ascending or descending).

  const xIsNext = currentMove % 2 === 0;
  // Determines the current player (X or O) based on the current move index.

  const currentSquares = history[currentMove].squares;
  // Gets the squares array for the current move.

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // Updates the game history and sets the current move index after a move is made.
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // Sets the current move index to the specified move.
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
    // Toggles the sort order of the move list.
  }

  const moves = history.map((step, move) => {
    const desc = move ?
      `Go to move #${move} (${Math.floor(step.location / 3)}, ${step.location % 3})` :
      'Go to game start';
    return (
      <ListGroup.Item 
        key={move} 
        active={move === currentMove}
        action
        onClick={() => jumpTo(move)}
      >
        {desc}
      </ListGroup.Item>
      // Maps each move in the history to a list item with a description and onClick handler.
    );
  });

  if (!isAscending) {
    moves.reverse();
    // Reverses the order of the move list if isAscending is false.
  }

  const winner = calculateWinner(currentSquares);
  const winningSquares = winner ? winner.line : [];
  // Calculates the winning squares if there's a winner.

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      {/* Container for centering the game layout */}
      <Row className="justify-content-center">
        {/* Row for layout */}
        <Col md="auto" className="d-flex flex-column align-items-start">
          {/* Column for game info */}
          <div className="game-info mb-4">
            <Button variant="primary" onClick={toggleSortOrder} className="mb-3">
              {isAscending ? 'Sort Descending' : 'Sort Ascending'}
            </Button>
            {/* Button for toggling the move list sort order */}
            <ListGroup>
              {moves}
            </ListGroup>
            {/* List of moves */}
          </div>
        </Col>
        <Col md="auto">
          {/* Column for game board */}
          <Card className="shadow rounded">
            <Card.Body>
              <h1 className="text-center mb-4">Tic-Tac-Toe</h1>
              <div className="game-board">
                <Board
                  xIsNext={xIsNext}
                  squares={currentSquares}
                  onPlay={handlePlay}
                  winningSquares={winningSquares}
                />
                {/* Renders the Board component with necessary props */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    // Renders the overall game layout with game info and board.
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Defines the winning combinations of squares.

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
  // Checks if any of the winning combinations are met and returns the winner and winning line if so.
}
