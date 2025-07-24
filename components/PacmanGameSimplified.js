// src/components/PacmanGameSimplified.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPacman, FaSyncAlt } from 'react-icons/fa'; // FaPacman is illustrative, might not exist in actual Fa library

// --- Game Constants & Board Layout ---
// 1 = Wall, 0 = Path, 2 = Dot, 3 = Pacman Start
const PACMAN_BOARD_WIDTH = 19;
const PACMAN_BOARD_HEIGHT = 21; // Common Pac-Man maze dimensions

const initialMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1], // Pacman start (0)
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 1, 1, 2, 2, 2, 2, 0, 2, 2, 2, 2, 1, 1, 2, 2, 1], // Dummy 0, will be 2
    [1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Find initial Pacman position (the first 0 in initialMaze)
const getPacmanInitialPosition = (maze) => {
    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            if (maze[r][c] === 0) {
                return { r, c };
            }
        }
    }
    return { r: 1, c: 1 }; // Fallback
};

// --- Styled Components ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 800px; /* Adjust based on board size */
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
    grid-template-columns: repeat(${PACMAN_BOARD_WIDTH}, 20px); /* Smaller cells */
    grid-template-rows: repeat(${PACMAN_BOARD_HEIGHT}, 20px);
    border: 2px solid #333;
    background-color: #000; /* Black background for maze */
    margin-bottom: 20px;
    position: relative;
    overflow: hidden; /* Ensure characters stay within */

    @media (max-width: 768px) {
        grid-template-columns: repeat(${PACMAN_BOARD_WIDTH}, 18px);
        grid-template-rows: repeat(${PACMAN_BOARD_HEIGHT}, 18px);
    }
    @media (max-width: 480px) {
        grid-template-columns: repeat(${PACMAN_BOARD_WIDTH}, 15px);
        grid-template-rows: repeat(${PACMAN_BOARD_HEIGHT}, 15px);
    }
`;

const Cell = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    position: relative;

    ${props => props.type === 1 && `
        background-color: #3f51b5; /* Walls */
        border: 1px solid #283593;
    `}
    ${props => props.type === 2 && `
        /* Dots */
        &::after {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            background-color: #fdd835;
            border-radius: 50%;
        }
    `}
`;

const Pacman = styled.div`
    position: absolute;
    width: 18px; /* Slightly smaller than cell */
    height: 18px;
    background-color: #ffeb3b; /* Pac-Man yellow */
    border-radius: 50%;
    left: ${props => props.left * (props.cellSize || 20)}px;
    top: ${props => props.top * (props.cellSize || 20)}px;
    transition: left 0.1s linear, top 0.1s linear; /* Smooth movement */
    z-index: 10;
    font-size: 1.2em; /* For icon */
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    transform: rotate(${props => props.rotation || 0}deg); /* For direction */
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

// --- Pacman Game Simplified Component ---
const PacmanGameSimplified = ({ onBack }) => {
    const initialPacmanPos = getPacmanInitialPosition(initialMaze);
    const [pacmanPos, setPacmanPos] = useState(initialPacmanPos);
    const [maze, setMaze] = useState(initialMaze.map(row => [...row])); // Deep copy for mutable maze
    const [rotation, setRotation] = useState(0); // For Pacman direction
    const boardRef = useRef(null); // To get dynamic cell size

    // Function to calculate cell size dynamically
    const getCellSize = useCallback(() => {
        if (boardRef.current) {
            return boardRef.current.offsetWidth / PACMAN_BOARD_WIDTH;
        }
        return 20; // Default
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            let newR = pacmanPos.r;
            let newC = pacmanPos.c;
            let newRotation = rotation;

            switch (e.key) {
                case 'ArrowUp':
                    newR--;
                    newRotation = -90;
                    break;
                case 'ArrowDown':
                    newR++;
                    newRotation = 90;
                    break;
                case 'ArrowLeft':
                    newC--;
                    newRotation = 180;
                    break;
                case 'ArrowRight':
                    newC++;
                    newRotation = 0;
                    break;
                default:
                    return;
            }

            // Simple collision detection (don't move into walls)
            if (
                newR >= 0 && newR < PACMAN_BOARD_HEIGHT &&
                newC >= 0 && newC < PACMAN_BOARD_WIDTH &&
                maze[newR][newC] !== 1 // Check if not a wall
            ) {
                setPacmanPos({ r: newR, c: newC });
                setRotation(newRotation);

                // Simulate eating a dot
                if (maze[newR][newC] === 2) {
                    const newMaze = maze.map(row => [...row]); // Deep copy
                    newMaze[newR][newC] = 0; // "Eat" the dot
                    setMaze(newMaze);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [pacmanPos, maze, rotation]); // Depend on pacmanPos and maze to re-evaluate listener

    const resetGame = () => {
        setPacmanPos(getPacmanInitialPosition(initialMaze));
        setMaze(initialMaze.map(row => [...row])); // Reset maze with all dots
        setRotation(0);
    };

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Pac-Man (Simplified Demo)</GameTitle>
            <GameBoard ref={boardRef}>
                {maze.map((row, rIdx) =>
                    row.map((cellType, cIdx) => (
                        <Cell key={`${rIdx}-${cIdx}`} type={cellType} />
                    ))
                )}
                <Pacman
                    top={pacmanPos.r}
                    left={pacmanPos.c}
                    rotation={rotation}
                    cellSize={getCellSize()}
                >
                    {/* <FaPacman /> if you have it, otherwise just a yellow circle */}
                </Pacman>
            </GameBoard>
            <GameButton onClick={resetGame}>
                <FaSyncAlt /> Reset Demo
            </GameButton>
            <Disclaimer>
                This is a highly simplified demonstration of Pac-Man movement on a grid.
                It does not include ghosts, full collision detection, scoring, levels,
                or advanced game mechanics. A complete Pac-Man game is much more complex!
                Use Arrow Keys to move Pac-Man.
            </Disclaimer>
        </GameContainer>
    );
};

export default PacmanGameSimplified;