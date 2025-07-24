// src/components/ConnectFourGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaRedo } from 'react-icons/fa';

// --- Game Constants ---
const ROWS = 6;
const COLS = 7;
const PLAYER_ONE = 1; // Red
const PLAYER_TWO = 2; // Yellow

// --- Styled Components ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 800px;
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

const BoardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${COLS}, 60px);
    grid-template-rows: repeat(${ROWS}, 60px);
    background-color: #3f51b5; /* Connect 4 board color */
    border-radius: 15px;
    padding: 10px;
    gap: 5px;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.3);
    margin-bottom: 20px;

    @media (max-width: 480px) {
        grid-template-columns: repeat(${COLS}, 45px);
        grid-template-rows: repeat(${ROWS}, 45px);
        gap: 4px;
        padding: 8px;
    }
`;

const Cell = styled.div`
    width: 60px;
    height: 60px;
    background-color: #1a237e; /* Holes background */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    @media (max-width: 480px) {
        width: 45px;
        height: 45px;
    }
`;

const Piece = styled.div`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background-color: ${props => props.player === PLAYER_ONE ? '#e53935' : props.player === PLAYER_TWO ? '#ffeb3b' : 'transparent'};
    box-shadow: ${props => props.player !== 0 ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none'};
    animation: ${props => props.isDropping ? 'drop 0.3s ease-out forwards' : 'none'};
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(${props => props.dropOffset * 100}%); /* Use for animation */

    @keyframes drop {
        from { transform: translateY(-1000%); } /* Start far above */
        to { transform: translateY(0); }
    }
`;

const ColumnDropArea = styled.div`
    width: 60px; /* Match cell width */
    height: 20px; /* Small area for clicks */
    background-color: rgba(0,0,0,0.1); /* Indicate clickable area */
    margin: 0 2.5px; /* Adjust to match gap */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex; /* For visual indication */
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: rgba(0,0,0,0.2);
    }
    &:active {
        background-color: rgba(0,0,0,0.3);
    }

    /* Adjust column width for mobile */
    @media (max-width: 480px) {
        width: 45px;
        height: 15px;
        margin: 0 2px;
    }
`;

const ColumnDropRow = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;

    @media (max-width: 480px) {
        gap: 4px;
    }
`;

const GameStatus = styled.p`
    font-size: 1.5em;
    font-weight: bold;
    color: ${props => props.isWinner ? '#4CAF50' : props.isDraw ? '#616161' : '#3f51b5'};
    margin-bottom: 20px;
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

// --- Connect Four Game Logic ---
const createEmptyBoard = () =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const checkWin = (board, player) => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (
                board[r][c] === player &&
                board[r][c + 1] === player &&
                board[r][c + 2] === player &&
                board[r][c + 3] === player
            ) {
                return true;
            }
        }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c < COLS; c++) {
            if (
                board[r][c] === player &&
                board[r + 1][c] === player &&
                board[r + 2][c] === player &&
                board[r + 3][c] === player
            ) {
                return true;
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (
                board[r][c] === player &&
                board[r + 1][c + 1] === player &&
                board[r + 2][c + 2] === player &&
                board[r + 3][c + 3] === player
            ) {
                return true;
            }
        }
    }

    // Check diagonal (top-right to bottom-left)
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 3; c < COLS; c++) { // Start from column 3 to allow 4 in a row to the left
            if (
                board[r][c] === player &&
                board[r + 1][c - 1] === player &&
                board[r + 2][c - 2] === player &&
                board[r + 3][c - 3] === player
            ) {
                return true;
            }
        }
    }

    return false;
};

const checkDraw = (board) => {
    return board.every(row => row.every(cell => cell !== 0));
};

const ConnectFourGame = ({ onBack }) => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
    const [winner, setWinner] = useState(null); // null, 1, 2
    const [isDraw, setIsDraw] = useState(false);
    const [isDropping, setIsDropping] = useState(false); // To control drop animation

    const handleColumnClick = async (col) => {
        if (winner || isDraw || isDropping) return;

        // Find the lowest available row in the column
        let r = ROWS - 1;
        while (r >= 0 && board[r][col] !== 0) {
            r--;
        }

        if (r < 0) return; // Column is full

        setIsDropping(true); // Start drop animation

        const newBoard = board.map(row => [...row]);
        // Update board after a short delay to allow animation
        await new Promise(resolve => setTimeout(() => {
            newBoard[r][col] = currentPlayer;
            setBoard(newBoard);
            resolve();
        }, 300)); // Animation time

        setIsDropping(false); // End drop animation

        if (checkWin(newBoard, currentPlayer)) {
            setWinner(currentPlayer);
        } else if (checkDraw(newBoard)) {
            setIsDraw(true);
        } else {
            setCurrentPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
        }
    };

    const resetGame = () => {
        setBoard(createEmptyBoard());
        setCurrentPlayer(PLAYER_ONE);
        setWinner(null);
        setIsDraw(false);
        setIsDropping(false);
    };

    let statusText;
    if (winner) {
        statusText = `Player ${winner === PLAYER_ONE ? 'Red' : 'Yellow'} Wins!`;
    } else if (isDraw) {
        statusText = "It's a Draw!";
    } else {
        statusText = `Player ${currentPlayer === PLAYER_ONE ? 'Red' : 'Yellow'}'s Turn`;
    }

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Connect Four</GameTitle>
            <GameStatus isWinner={winner !== null} isDraw={isDraw}>
                {statusText}
            </GameStatus>

            <ColumnDropRow>
                {Array.from({ length: COLS }).map((_, colIdx) => (
                    <ColumnDropArea key={colIdx} onClick={() => handleColumnClick(colIdx)} disabled={winner || isDraw || isDropping}>
                        {/* You could add a small arrow icon here */}
                    </ColumnDropArea>
                ))}
            </ColumnDropRow>

            <BoardGrid>
                {board.map((row, rIdx) =>
                    row.map((cellPlayer, cIdx) => (
                        <Cell key={`${rIdx}-${cIdx}`} onClick={() => handleColumnClick(cIdx)}>
                            {/* Render piece with animation logic */}
                            <Piece player={cellPlayer} isDropping={isDropping && (board[rIdx][cIdx] === currentPlayer)} />
                        </Cell>
                    ))
                )}
            </BoardGrid>
            <GameButton onClick={resetGame}>
                <FaRedo /> Play Again
            </GameButton>
        </GameContainer>
    );
};

export default ConnectFourGame;