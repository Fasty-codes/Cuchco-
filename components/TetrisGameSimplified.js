// src/components/TetrisGameSimplified.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

// --- Game Constants & Board Layout ---
const TETRIS_BOARD_WIDTH = 10;
const TETRIS_BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;
const BLOCK_COLOR_DEMO = 1; // Just one color for simplicity

// --- Styled Components ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 500px; /* Adjust based on board size */
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

const GameBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(${TETRIS_BOARD_WIDTH}, 25px);
    grid-template-rows: repeat(${TETRIS_BOARD_HEIGHT}, 25px);
    border: 3px solid #3f51b5;
    background-color: #1a1a1a; /* Dark background for Tetris board */
    margin-bottom: 20px;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.3);

    @media (max-width: 480px) {
        grid-template-columns: repeat(${TETRIS_BOARD_WIDTH}, 20px);
        grid-template-rows: repeat(${TETRIS_BOARD_HEIGHT}, 20px);
    }
`;

const Cell = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1); /* Cell borders */
    background-color: ${props => props.color === EMPTY_CELL ? 'transparent' : '#ffc107'}; /* Demo block color */
    ${props => props.color === BLOCK_COLOR_DEMO && `
        box-shadow: inset 0 0 5px rgba(0,0,0,0.5), 0 0 8px rgba(255,193,7,0.5);
    `}
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

const Disclaimer = styled.p`
    font-size: 0.9em;
    color: #888;
    margin-top: 20px;
    max-width: 600px;
`;

// --- Tetris Game Simplified Component ---
const TetrisGameSimplified = ({ onBack }) => {
    // Initialize an empty board
    const createEmptyBoard = () =>
        Array.from({ length: TETRIS_BOARD_HEIGHT }, () =>
            Array(TETRIS_BOARD_WIDTH).fill(EMPTY_CELL)
        );

    const [board, setBoard] = useState(createEmptyBoard());

    // Simple function to "drop" a block at a random X position
    const dropDemoBlock = () => {
        const newBoard = createEmptyBoard(); // Start with a fresh empty board for each demo drop
        const startX = Math.floor(Math.random() * TETRIS_BOARD_WIDTH);
        let blockY = 0; // Start at the top

        // Simulate dropping until it hits the bottom
        for (let y = 0; y < TETRIS_BOARD_HEIGHT; y++) {
            if (y === TETRIS_BOARD_HEIGHT - 1) { // Hit bottom
                blockY = y;
                break;
            }
            // In a real game, you'd check collision with existing blocks here too
        }

        // Place a simple 2x2 block (for demonstration)
        if (blockY < TETRIS_BOARD_HEIGHT && startX < TETRIS_BOARD_WIDTH - 1) {
            newBoard[blockY][startX] = BLOCK_COLOR_DEMO;
            newBoard[blockY][startX + 1] = BLOCK_COLOR_DEMO;
            if (blockY > 0) { // Place another part of the block above it
                newBoard[blockY - 1][startX] = BLOCK_COLOR_DEMO;
                newBoard[blockY - 1][startX + 1] = BLOCK_COLOR_DEMO;
            }
        }

        setBoard(newBoard);
    };

    const resetGame = () => {
        setBoard(createEmptyBoard());
    };

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Tetris (Simplified Demo)</GameTitle>
            <GameBoard>
                {board.map((row, rIdx) =>
                    row.map((cellColor, cIdx) => (
                        <Cell key={`${rIdx}-${cIdx}`} color={cellColor} />
                    ))
                )}
            </GameBoard>
            <GameButton onClick={dropDemoBlock}>
                <FaSyncAlt /> Drop Random Block
            </GameButton>
            <GameButton onClick={resetGame}>
                Clear Board
            </GameButton>
            <Disclaimer>
                This is a highly simplified demonstration of Tetris. It does NOT include
                real-time falling, block rotation, line clearing, scoring, or full game logic.
                A complete Tetris game requires a complex game loop and collision system.
            </Disclaimer>
        </GameContainer>
    );
};

export default TetrisGameSimplified;