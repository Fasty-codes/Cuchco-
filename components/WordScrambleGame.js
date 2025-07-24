// src/components/WordScrambleGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';

// --- Word List (10 puzzles/words) ---
const wordPuzzles = [
    { word: "COMPUTER", hint: "An electronic device for processing data." },
    { word: "PROGRAMMING", hint: "The process of writing computer programs." },
    { word: "DEVELOPER", hint: "A person who creates software." },
    { word: "JAVASCRIPT", hint: "A popular web scripting language." },
    { word: "REACT", hint: "A JavaScript library for building UIs." },
    { word: "INTERNET", hint: "Global computer network." },
    { word: "ALGORITHM", hint: "A set of rules to be followed in problem-solving." },
    { word: "DATABASE", hint: "An organized collection of data." },
    { word: "SECURITY", hint: "Protection of data from unauthorized access." },
    { word: "APPRECIATE", hint: "To recognize the full worth of something." },
];

// Function to scramble a word
const scrambleWord = (word) => {
    let a = word.split("");
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join("");
};

// --- Styled Components ---
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

const ScrambledWordDisplay = styled.p`
    font-size: 3.5em;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 30px;
    letter-spacing: 5px;
    background-color: #ffebee;
    padding: 15px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);

    @media (max-width: 480px) {
        font-size: 2.5em;
        letter-spacing: 3px;
        padding: 10px 20px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    max-width: 400px;
`;

const GuessInput = styled.input`
    flex-grow: 1;
    padding: 12px 18px;
    font-size: 1.5em;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    text-transform: uppercase;
    text-align: center;
    margin-right: 10px;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: #3f51b5;
    }

    ${props => props.isCorrect && `border-color: #4CAF50 !important;`}
    ${props => props.isWrong && `border-color: #f44336 !important;`}

    @media (max-width: 480px) {
        font-size: 1.2em;
        padding: 10px 15px;
    }
`;

const SubmitButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
        background-color: #43a047;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background-color: #a5d6a7;
        cursor: not-allowed;
    }

    svg {
        margin-left: 8px;
    }
`;

const FeedbackText = styled.p`
    font-size: 1.2em;
    font-weight: bold;
    color: ${props => props.type === 'correct' ? '#4CAF50' : '#f44336'};
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

const HintText = styled.p`
    font-size: 1.1em;
    color: #777;
    font-style: italic;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const GameResultOverlay = styled.div`
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

const ResultContent = styled.div`
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

// --- Word Scramble Game Component ---
const WordScrambleGame = ({ onBack }) => {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [scrambledWord, setScrambledWord] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const initializeGame = useCallback(() => {
        if (currentPuzzleIndex < wordPuzzles.length) {
            const originalWord = wordPuzzles[currentPuzzleIndex].word;
            let scrambled = scrambleWord(originalWord);
            // Ensure the scrambled word is not the same as the original
            while (scrambled === originalWord) {
                scrambled = scrambleWord(originalWord);
            }
            setScrambledWord(scrambled);
            setGuess('');
            setFeedback(null);
        } else {
            setGameOver(true);
        }
    }, [currentPuzzleIndex]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame, currentPuzzleIndex]);

    const handleGuessSubmit = (e) => {
        e.preventDefault();
        const originalWord = wordPuzzles[currentPuzzleIndex].word;
        if (guess.toUpperCase() === originalWord.toUpperCase()) {
            setFeedback('correct');
            setScore(prev => prev + 1);
        } else {
            setFeedback('wrong');
        }
    };

    const handleNextPuzzle = () => {
        if (currentPuzzleIndex < wordPuzzles.length - 1) {
            setCurrentPuzzleIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
    };

    const resetSeries = () => {
        setCurrentPuzzleIndex(0);
        setScore(0);
        setGameOver(false);
        // initializeGame will be called by useEffect after index reset
    };

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Word Scramble</GameTitle>
            {!gameOver ? (
                <>
                    <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '15px' }}>
                        Puzzle {currentPuzzleIndex + 1} / {wordPuzzles.length} | Score: {score}
                    </p>
                    <ScrambledWordDisplay>{scrambledWord}</ScrambledWordDisplay>
                    <HintText><FaLightbulb /> Hint: {wordPuzzles[currentPuzzleIndex].hint}</HintText>
                    <form onSubmit={handleGuessSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <InputGroup>
                            <GuessInput
                                type="text"
                                placeholder="Enter your guess"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                disabled={feedback !== null}
                                isCorrect={feedback === 'correct'}
                                isWrong={feedback === 'wrong'}
                            />
                            <SubmitButton type="submit" disabled={feedback !== null}>
                                Guess {feedback === 'correct' ? <FaCheckCircle /> : feedback === 'wrong' ? <FaTimesCircle /> : null}
                            </SubmitButton>
                        </InputGroup>
                    </form>

                    {feedback && (
                        <FeedbackText type={feedback}>
                            {feedback === 'correct' ? (
                                `Correct! "${wordPuzzles[currentPuzzleIndex].word}"`
                            ) : (
                                `Wrong! The word was "${wordPuzzles[currentPuzzleIndex].word}"`
                            )}
                        </FeedbackText>
                    )}

                    {feedback && (
                        <GameButton onClick={handleNextPuzzle}>
                            {currentPuzzleIndex < wordPuzzles.length - 1 ? 'Next Puzzle' : 'View Results'}
                        </GameButton>
                    )}
                </>
            ) : (
                <GameResultOverlay isVisible={gameOver}>
                    <ResultContent>
                        <h4>Scramble Series Complete!</h4>
                        <p>You solved <span>{score}</span> out of <span>{wordPuzzles.length}</span> puzzles!</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <GameButton onClick={resetSeries}>
                                Play Again
                            </GameButton>
                            <GameButton onClick={onBack}>
                                Back to Games
                            </GameButton>
                        </div>
                    </ResultContent>
                </GameResultOverlay>
            )}
        </GameContainer>
    );
};

export default WordScrambleGame;