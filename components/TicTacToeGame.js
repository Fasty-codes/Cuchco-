// src/components/TicTacToeGame.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaAward, FaUser, FaRobot } from 'react-icons/fa';

// --- Styled Components for Tic-Tac-Toe ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media (max-width: 768px) {
        padding: 25px;
    }
    @media (max-width: 480px) {
        padding: 20px;
    }
`;

const GameTitle = styled.h3`
    font-size: 2.5em;
    color: #3f51b5;
    margin-bottom: 25px;

    @media (max-width: 480px) {
        font-size: 2em;
    }
`;

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    gap: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 30px;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);

    @media (max-width: 480px) {
        grid-template-columns: repeat(3, 80px);
        grid-template-rows: repeat(3, 80px);
        gap: 8px;
    }
`;

const Cell = styled.button`
    width: 100px;
    height: 100px;
    background-color: #e3f2fd;
    border: 2px solid #90caf9;
    border-radius: 8px;
    font-size: 4em;
    font-weight: bold;
    color: ${props => props.value === 'X' ? '#e53935' : '#1e88e5'};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
        ${props => !props.disabled && `
            background-color: #bbdefb;
            transform: translateY(-2px);
        `}
    }
    &:active {
        transform: translateY(0);
    }

    @media (max-width: 480px) {
        width: 80px;
        height: 80px;
        font-size: 3em;
    }
`;

const GameInfo = styled.div`
    font-size: 1.3em;
    color: #555;
    margin-bottom: 20px;
    span {
        font-weight: bold;
        color: #1976d2;
    }
    display: flex;
    gap: 20px;
    align-items: center;

    p {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .player-score { color: #e53935; }
    .computer-score { color: #1e88e5; }
`;

const StatusText = styled.p`
    font-size: 1.5em;
    font-weight: bold;
    color: ${props => props.winner === 'X' ? '#4CAF50' : props.winner === 'O' ? '#f44336' : '#616161'};
    margin-top: -10px;
    margin-bottom: 20px;

    @media (max-width: 480px) {
        font-size: 1.2em;
    }
`;

const GameButton = styled.button`
    background-color: #3f51b5;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    margin: 5px;

    &:hover {
        background-color: #303f9f;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background-color: #9fa8da;
        cursor: not-allowed;
    }

    svg {
        margin-right: 8px;
    }
`;

// --- Game Logic ---
const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6],           // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const TicTacToeGame = ({ onBack }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true); // Player is 'X', Computer is 'O'
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const maxRounds = 10; // 10 "puzzles" in terms of rounds

    const currentPlayer = xIsNext ? 'X' : 'O';

    useEffect(() => {
        const gameWinner = calculateWinner(board);
        if (gameWinner) {
            setWinner(gameWinner);
            if (gameWinner === 'X') {
                setPlayerScore(prev => prev + 1);
            } else {
                setComputerScore(prev => prev + 1);
            }
            setRoundsPlayed(prev => prev + 1);
        } else if (board.every(cell => cell !== null)) {
            setIsDraw(true);
            setRoundsPlayed(prev => prev + 1);
        }
    }, [board]);

    useEffect(() => {
        // Computer's turn
        if (!xIsNext && !winner && !isDraw && roundsPlayed < maxRounds) {
            const timer = setTimeout(() => {
                const availableMoves = board.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);

                // Simple AI: Try to win, block player, or take center/corners
                let bestMove = -1;

                // 1. Check if AI can win
                for (let i = 0; i < availableMoves.length; i++) {
                    const move = availableMoves[i];
                    const tempBoard = [...board];
                    tempBoard[move] = 'O';
                    if (calculateWinner(tempBoard) === 'O') {
                        bestMove = move;
                        break;
                    }
                }

                // 2. Check if player can win and block
                if (bestMove === -1) {
                    for (let i = 0; i < availableMoves.length; i++) {
                        const move = availableMoves[i];
                        const tempBoard = [...board];
                        tempBoard[move] = 'X';
                        if (calculateWinner(tempBoard) === 'X') {
                            bestMove = move;
                            break;
                        }
                    }
                }

                // 3. Take center if available
                if (bestMove === -1 && board[4] === null) {
                    bestMove = 4;
                }

                // 4. Take a random corner if available
                const corners = [0, 2, 6, 8].filter(idx => board[idx] === null && availableMoves.includes(idx));
                if (bestMove === -1 && corners.length > 0) {
                    bestMove = corners[Math.floor(Math.random() * corners.length)];
                }

                // 5. Take any random available move
                if (bestMove === -1 && availableMoves.length > 0) {
                    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }

                if (bestMove !== -1) {
                    handleClick(bestMove);
                }
            }, 500); // Small delay for AI move
            return () => clearTimeout(timer);
        }
    }, [xIsNext, board, winner, isDraw, roundsPlayed, maxRounds]); // Dependencies for AI turn

    const handleClick = (i) => {
        if (winner || isDraw || board[i] || roundsPlayed >= maxRounds) {
            return;
        }

        const newBoard = [...board];
        newBoard[i] = currentPlayer;
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true); // Player always starts as 'X'
        setWinner(null);
        setIsDraw(false);
    };

    const resetScoresAndRounds = () => {
        setPlayerScore(0);
        setComputerScore(0);
        setRoundsPlayed(0);
        resetGame();
    };

    let status;
    if (winner) {
        status = winner === 'X' ? 'You Win!' : 'Computer Wins!';
    } else if (isDraw) {
        status = "It's a Draw!";
    } else {
        status = `Next Player: ${currentPlayer === 'X' ? 'You (X)' : 'Computer (O)'}`;
    }

    const isGameOver = winner || isDraw;
    const isSeriesOver = roundsPlayed >= maxRounds;

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Tic-Tac-Toe</GameTitle>
            <GameInfo>
                <p>Round: <span>{Math.min(roundsPlayed + 1, maxRounds)} / {maxRounds}</span></p>
                <p><FaUser className="player-score" /> You: <span className="player-score">{playerScore}</span></p>
                <p><FaRobot className="computer-score" /> Computer: <span className="computer-score">{computerScore}</span></p>
            </GameInfo>
            <StatusText winner={winner}>{status}</StatusText>
            <Board>
                {board.map((cell, idx) => (
                    <Cell key={idx} onClick={() => handleClick(idx)} value={cell} disabled={isGameOver || cell !== null || isSeriesOver}>
                        {cell}
                    </Cell>
                ))}
            </Board>
            {isGameOver && !isSeriesOver && (
                <GameButton onClick={resetGame}>
                    <FaSyncAlt /> Play Next Round
                </GameButton>
            )}
            {isSeriesOver && (
                 <GameButton onClick={resetScoresAndRounds}>
                    <FaSyncAlt /> Play Another Series
                </GameButton>
            )}
            {!isGameOver && roundsPlayed === 0 && (
                <p style={{marginTop: '10px', color: '#777'}}>Complete 10 rounds to finish a series!</p>
            )}
        </GameContainer>
    );
};

export default TicTacToeGame;