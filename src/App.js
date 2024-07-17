import { useState } from 'react';
// Imports the useState hook from React.

import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';
// Imports various components from React Bootstrap for styling and layout.

import './index.css';
// Imports the CSS file for custom styling.

function Square({ value, onSquareClick, highlight }) {
  // Defines a Square component that represents a single square in the tic-tac-toe board.
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
    // Renders a button with conditional class for highlighting and an onClick handler.
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  // Defines a Board component that represents the tic-tac-toe board.

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares.includes(i)}
      />
      // Renders a Square component with props for value, onClick handler, and highlight.
    );
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
    // Handles the click event on a square, updates the board state, and calls onPlay.
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else if (squares.every(square => square !== null && square !== undefined)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  // Determines the game status (winner, draw, or next player) and stores it in status.

  const boardSize = 3;
  const board = [];
  for (let row = 0; row < boardSize; row++) {
    const columns = [];
    for (let col = 0; col < boardSize; col++) {
      columns.push(renderSquare(row * boardSize + col));
    }
    board.push(<div key={row} className="board-row">{columns}</div>);
    // Renders the tic-tac-toe board as a 3x3 grid using the renderSquare function.
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
    // Renders the game status and the board.
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  // Defines the Game component with state for history, current move, and sort order.

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // Updates the game history and current move when a square is clicked.
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // Jumps to a specific move in the game history.
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
      // Renders a list of moves with descriptions and click handlers to jump to moves.
    );
  });

  if (!isAscending) {
    moves.reverse();
    // Reverses the move list if isAscending is false.
  }

  const winner = calculateWinner(currentSquares);
  const winningSquares = winner ? winner.line : [];
  // Calculates the winner and the winning squares.

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center">
        <Col md="auto" className="d-flex flex-column align-items-start">
          <div className="game-info mb-4">
            <Button variant="primary" onClick={toggleSortOrder} className="mb-3">
              {isAscending ? 'Sort Descending' : 'Sort Ascending'}
            </Button>
            <ListGroup>
              {moves}
            </ListGroup>
          </div>
        </Col>
        <Col md="auto">
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
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    // Renders the game layout with a header, sort button, move list, and game board.
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
  // Checks if there is a winner by comparing the squares to predefined winning lines.
}
