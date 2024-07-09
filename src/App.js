import { useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';
import './index.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares.includes(i)}
      />
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
  

  const boardSize = 3;
  const board = [];
  for (let row = 0; row < boardSize; row++) {
    const columns = [];
    for (let col = 0; col < boardSize; col++) {
      columns.push(renderSquare(row * boardSize + col));
    }
    board.push(<div key={row} className="board-row">{columns}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
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
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  const winner = calculateWinner(currentSquares);
  const winningSquares = winner ? winner.line : [];

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
}