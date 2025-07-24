// src/components/FifteenPuzzleGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaAward } from 'react-icons/fa';

// --- Game Constants ---
const BOARD_SIZE = 4; // 4x4 grid for 15 puzzle
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;

// Function to generate a solvable shuffled board
// A 15-puzzle is solvable if the number of inversions is even for a 4x4 grid
// (or odd if the empty tile is on an odd row from the bottom).
const generateSolvableBoard = () => {
    let tiles = Array.from({ length: TOTAL_TILES }, (_, i) => i); // [0, 1, 2, ..., 15]
    tiles = tiles.slice(1).concat(0); // [1, 2, ..., 15, 0] for solved state

    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    let shuffledTiles;
    let inversions;
    let emptyRowFromBottom;

    // Loop until a solvable board is generated
    do {
        shuffledTiles = shuffle([...tiles]);
        inversions = 0;
        for (let i = 0; i < TOTAL_TILES - 1; i++) {
            for (let j = i + 1; j < TOTAL_TILES; j++) {
                if (shuffledTiles[i] !== 0 && shuffledTiles[j] !== 0 && shuffledTiles[i] > shuffledTiles[j]) {
                    inversions++;
                }
            }
        }
        const emptyTileIndex = shuffledTiles.indexOf(0);
        const emptyTileRow = Math.floor(emptyTileIndex / BOARD_SIZE);
        emptyRowFromBottom = BOARD_SIZE - emptyTileRow; // 1-indexed from bottom

    } while ((inversions % 2 !== 0 && emptyRowFromBottom % 2 === 0) ||
             (inversions % 2 === 0 && emptyRowFromBottom % 2 !== 0));

    return shuffledTiles;
};

// --- Styled Components ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 500px;
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
    grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
    grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
    width: min(90vw, 400px); /* Max 400px for 4x4 */
    height: min(90vw, 400px);
    border: 3px solid #3f51b5;
    border-radius: 10px;
    overflow: hidden; /* For rounded corners */
    box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    margin-bottom: 20px;
`;

const Tile = styled.button`
    width: 100%;
    height: 100%;
    background-color: ${props => props.isEmpty ? '#e0e0e0' : '#42a5f5'};
    color: ${props => props.isEmpty ? '#555' : '#ffffff'};
    border: 1px solid #90caf9;
    font-size: min(5vw, 40px);
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.isMovable ? 'pointer' : 'not-allowed'};
    transition: background-color 0.2s ease, transform 0.1s ease;
    user-select: none; /* Prevent text selection */

    &:hover {
        ${props => props.isMovable && `
            background-color: #64b5f6;
            transform: translateY(-2px);
        `}
    }
    &:active {
        transform: translateY(0);
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #3f51b5;
    }
`;

const InfoText = styled.p`
    font-size: 1.2em;
    color: #555;
    margin-bottom: 15px;
    span {
        font-weight: bold;
        color: #1976d2;
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

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: ${props => props.isVisible ? 1 : 0};
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const WinMessage = styled.div`
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    h4 {
        font-size: 2.8em;
        color: #4CAF50;
        margin-bottom: 20px;
    }
    p {
        font-size: 1.5em;
        color: #555;
        margin-bottom: 30px;
    }
    @media (max-width: 480px) {
        padding: 30px;
        h4 { font-size: 2.2em; }
        p { font-size: 1.2em; }
    }
`;


// --- 15 Puzzle Game Component ---
const FifteenPuzzleGame = ({ onBack }) => {
    const [tiles, setTiles] = useState([]);
    const [moves, setMoves] = useState(0);
    const [isSolved, setIsSolved] = useState(false);

    const initializeGame = useCallback(() => {
        const newTiles = generateSolvableBoard();
        setTiles(newTiles);
        setMoves(0);
        setIsSolved(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const findTilePosition = (val) => {
        const index = tiles.indexOf(val);
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        return { row, col, index };
    };

    const isMoveable = (clickedTileIndex) => {
        const emptyTilePos = findTilePosition(0);
        const clickedTilePos = findTilePosition(tiles[clickedTileIndex]);

        // Check if adjacent horizontally or vertically
        const isHorizontal = clickedTilePos.row === emptyTilePos.row &&
                             Math.abs(clickedTilePos.col - emptyTilePos.col) === 1;
        const isVertical = clickedTilePos.col === emptyTilePos.col &&
                           Math.abs(clickedTilePos.row - emptyTilePos.row) === 1;

        return isHorizontal || isVertical;
    };

    const handleTileClick = (clickedTileIndex) => {
        if (isSolved) return;

        if (isMoveable(clickedTileIndex)) {
            const newTiles = [...tiles];
            const emptyTileIndex = newTiles.indexOf(0);

            // Swap the clicked tile with the empty tile
            [newTiles[clickedTileIndex], newTiles[emptyTileIndex]] =
            [newTiles[emptyTileIndex], newTiles[clickedTileIndex]];

            setTiles(newTiles);
            setMoves(prev => prev + 1);
        }
    };

    useEffect(() => {
        // Check if solved
        const solvedState = Array.from({ length: TOTAL_TILES }, (_, i) => (i + 1) % TOTAL_TILES);
        const currentFlatTiles = tiles.map(t => (t === 0 ? TOTAL_TILES : t)); // Treat 0 as last for comparison
        const solvedFlatTiles = solvedState.map(t => (t === 0 ? TOTAL_TILES : t));

        if (tiles.length > 0 && currentFlatTiles.every((val, idx) => val === solvedFlatTiles[idx])) {
            setIsSolved(true);
        }
    }, [tiles]);

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>15 Puzzle</GameTitle>
            <InfoText>Moves: <span>{moves}</span></InfoText>
            <BoardGrid>
                {tiles.map((tileValue, index) => (
                    <Tile
                        key={index}
                        isEmpty={tileValue === 0}
                        isMovable={isMoveable(index) && !isSolved}
                        onClick={() => handleTileClick(index)}
                        disabled={isSolved}
                    >
                        {tileValue !== 0 ? tileValue : ''}
                    </Tile>
                ))}
            </BoardGrid>
            <GameButton onClick={initializeGame}>
                <FaSyncAlt /> New Puzzle
            </GameButton>

            <Overlay isVisible={isSolved}>
                <WinMessage>
                    <h4><FaAward /> Puzzle Solved!</h4>
                    <p>You completed the puzzle in <span>{moves}</span> moves!</p>
                    <GameButton onClick={initializeGame}>
                        Play Again
                    </GameButton>
                    <GameButton onClick={onBack} style={{ marginLeft: '10px' }}>
                        Back to Games
                    </GameButton>
                </WinMessage>
            </Overlay>
        </GameContainer>
    );
};

export default FifteenPuzzleGame;