// src/components/SudokuGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';

// --- Sudoku Puzzles (3 Puzzles) ---
// Each puzzle has an initial board (0 for empty) and its full solution.
const sudokuPuzzles = [
    {
        id: 1,
        initial: [
            5, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 9, 5, 0, 0, 0,
            0, 9, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 8, 0,
            0, 0, 0, 4, 1, 9, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 9
        ],
        solution: [
            5, 3, 4, 6, 7, 8, 9, 1, 2,
            6, 7, 2, 1, 9, 5, 3, 4, 8,
            1, 9, 8, 3, 4, 2, 5, 6, 7,
            8, 5, 9, 7, 6, 1, 4, 2, 3,
            4, 2, 6, 8, 5, 3, 7, 9, 1,
            7, 1, 3, 9, 2, 4, 8, 5, 6,
            9, 6, 1, 5, 3, 7, 2, 8, 4,
            2, 8, 7, 4, 1, 9, 6, 3, 5,
            3, 4, 5, 2, 8, 6, 1, 7, 9
        ]
    },
    {
        id: 2,
        initial: [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 3, 0, 8, 5,
            0, 0, 1, 0, 2, 0, 0, 0, 0,
            0, 0, 0, 5, 0, 7, 0, 0, 0,
            0, 0, 4, 0, 0, 0, 1, 0, 0,
            0, 9, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 7, 3,
            0, 0, 2, 0, 1, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 0, 0, 0, 9
        ],
        solution: [
            9, 8, 7, 6, 5, 4, 3, 2, 1,
            2, 4, 6, 1, 7, 3, 9, 8, 5,
            3, 5, 1, 9, 2, 8, 7, 4, 6,
            1, 2, 8, 5, 3, 7, 6, 9, 4,
            6, 3, 4, 8, 9, 2, 1, 5, 7,
            7, 9, 5, 4, 6, 1, 8, 3, 2,
            4, 1, 2, 3, 8, 9, 5, 7, 6,
            8, 7, 3, 2, 1, 6, 4, 9, 5,
            5, 6, 9, 7, 4, 5, 2, 1, 8
        ]
    },
    {
        id: 3,
        initial: [
            0, 0, 0, 2, 6, 0, 7, 0, 1,
            6, 8, 0, 0, 7, 0, 0, 9, 0,
            1, 9, 0, 0, 0, 4, 5, 0, 0,
            8, 2, 0, 1, 0, 0, 0, 4, 0,
            0, 0, 4, 6, 0, 2, 9, 0, 0,
            0, 5, 0, 0, 0, 3, 0, 2, 8,
            0, 0, 9, 3, 0, 0, 0, 7, 4,
            0, 4, 0, 0, 5, 0, 0, 3, 6,
            7, 0, 3, 0, 1, 8, 0, 0, 0
        ],
        solution: [
            4, 3, 5, 2, 6, 9, 7, 8, 1,
            6, 8, 2, 5, 7, 1, 4, 9, 3,
            1, 9, 7, 8, 3, 4, 5, 6, 2,
            8, 2, 6, 1, 9, 5, 3, 4, 7,
            3, 7, 4, 6, 8, 2, 9, 1, 5,
            9, 5, 1, 7, 4, 3, 6, 2, 8,
            5, 1, 9, 3, 2, 6, 8, 7, 4,
            2, 4, 8, 9, 5, 7, 1, 3, 6,
            7, 6, 3, 4, 1, 8, 2, 5, 9
        ]
    }
];

// --- Styled Components for Sudoku Game ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 700px;
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
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    width: min(90vw, 540px); /* Max width for 9 cells, each 60px */
    height: min(90vw, 540px);
    border: 3px solid #3f51b5;
    margin-bottom: 20px;
`;

const Cell = styled.input`
    width: 100%;
    height: 100%;
    font-size: min(4vw, 36px);
    font-weight: bold;
    text-align: center;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
    background-color: ${props => props.isInitial ? '#e0f2f7' : '#ffffff'};
    color: ${props => props.isInitial ? '#333' : '#1a237e'};
    cursor: ${props => props.isInitial ? 'not-allowed' : 'text'};
    outline: none;
    transition: background-color 0.1s;

    &:nth-child(3n) { border-right: 2px solid #3f51b5; }
    &:nth-child(3n+1) { border-left: ${props => props.isFirstColumnOfBlock ? '2px solid #3f51b5' : '1px solid #ccc'}; }

    /* Apply thicker horizontal borders for 3x3 blocks */
    ${(props) => {
        const row = Math.floor(props.index / 9);
        const col = props.index % 9;
        let styles = '';
        if ((row + 1) % 3 === 0 && row !== 8) {
            styles += 'border-bottom: 2px solid #3f51b5;';
        }
        if (row % 3 === 0 && row !== 0) {
            styles += 'border-top: 2px solid #3f51b5;';
        }
        return styles;
    }}

    &:focus {
        background-color: #bbdefb;
    }
`;

const Controls = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
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

const Message = styled.p`
    font-size: 1.3em;
    font-weight: bold;
    color: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
    margin-top: 15px;
`;

const PuzzleSelectContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    justify-content: center;
`;

const PuzzleButton = styled.button`
    background-color: #e3f2fd;
    color: #1a237e;
    padding: 10px 20px;
    border: 2px solid #90caf9;
    border-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #bbdefb;
    }
    ${props => props.isSelected && `
        background-color: #90caf9;
        border-color: #3f51b5;
        font-weight: bold;
    `}
`;

// --- Sudoku Game Logic ---
const SudokuGame = ({ onBack }) => {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const initializeBoard = useCallback((puzzleIdx) => {
        const initial = sudokuPuzzles[puzzleIdx].initial;
        setBoard(initial.map(val => (val === 0 ? '' : val)));
        setInitialBoard(initial.map(val => val !== 0)); // True for pre-filled cells
        setMessage('');
        setMessageType('');
    }, []);

    useEffect(() => {
        initializeBoard(currentPuzzleIndex);
    }, [currentPuzzleIndex, initializeBoard]);

    const handleCellChange = (e, index) => {
        const value = e.target.value;
        if (initialBoard[index]) return; // Cannot change initial cells

        // Allow only single digit numbers or empty string
        if (value === '' || (/^[1-9]$/.test(value))) {
            const newBoard = [...board];
            newBoard[index] = value === '' ? '' : parseInt(value, 10);
            setBoard(newBoard);
            setMessage(''); // Clear message on input change
        }
    };

    const checkSolution = () => {
        const flatBoard = board.map(cell => (cell === '' ? 0 : cell));
        const solution = sudokuPuzzles[currentPuzzleIndex].solution;

        let isCorrect = true;
        for (let i = 0; i < 81; i++) {
            if (flatBoard[i] !== solution[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            setMessage('Congratulations! Puzzle Solved!');
            setMessageType('success');
        } else {
            setMessage('Keep trying! There are errors in your solution.');
            setMessageType('error');
        }
    };

    const resetPuzzle = () => {
        initializeBoard(currentPuzzleIndex);
    };

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Sudoku</GameTitle>

            <PuzzleSelectContainer>
                {sudokuPuzzles.map((puzzle, idx) => (
                    <PuzzleButton
                        key={puzzle.id}
                        onClick={() => setCurrentPuzzleIndex(idx)}
                        isSelected={idx === currentPuzzleIndex}
                    >
                        Puzzle {idx + 1}
                    </PuzzleButton>
                ))}
            </PuzzleSelectContainer>

            <Board>
                {board.map((cell, index) => (
                    <Cell
                        key={index}
                        index={index}
                        type="text"
                        maxLength="1"
                        value={cell}
                        onChange={(e) => handleCellChange(e, index)}
                        isInitial={initialBoard[index]}
                        readOnly={initialBoard[index]}
                    />
                ))}
            </Board>

            {message && <Message type={messageType}>{message}</Message>}

            <Controls>
                <GameButton onClick={checkSolution}>
                    <FaCheckCircle /> Check Solution
                </GameButton>
                <GameButton onClick={resetPuzzle}>
                    <FaSyncAlt /> Reset Puzzle
                </GameButton>
            </Controls>
        </GameContainer>
    );
};

export default SudokuGame;