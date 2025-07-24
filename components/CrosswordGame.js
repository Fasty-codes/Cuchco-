// src/components/CrosswordGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// --- Crossword Puzzle Data (10 puzzles) ---
const crosswordPuzzles = [
    {
        name: "Animals",
        words: [
            { answer: "LION", clue: "King of the jungle (4 letters)" },
            { answer: "TIGER", clue: "Striped big cat (5 letters)" },
            { answer: "ELEPHANT", clue: "Largest land animal (8 letters)" },
            { answer: "ZEBRA", clue: "Black and white striped horse (5 letters)" },
            { answer: "GIRAFFE", clue: "Tallest mammal (7 letters)" },
            { answer: "PENGUIN", clue: "Flightless bird living in cold regions (7 letters)" },
            { answer: "DOLPHIN", clue: "Intelligent marine mammal (7 letters)" },
            { answer: "KANGAROO", clue: "Marsupial from Australia (8 letters)" },
            { answer: "BEAR", clue: "Large, furry mammal (4 letters)" },
            { answer: "SNAKE", clue: "Legless reptile (5 letters)" },
        ],
    },
    {
        name: "Fruits",
        words: [
            { answer: "APPLE", clue: "Red or green fruit, keeps doctor away (5 letters)" },
            { answer: "BANANA", clue: "Yellow, peeled fruit (6 letters)" },
            { answer: "ORANGE", clue: "Citrus fruit, also a color (6 letters)" },
            { answer: "GRAPE", clue: "Small, round fruit grown in bunches (5 letters)" },
            { answer: "MANGO", clue: "Tropical fruit, national fruit of India (5 letters)" },
            { answer: "PEAR", clue: "Green or yellow bell-shaped fruit (4 letters)" },
            { answer: "KIWI", clue: "Fuzzy brown fruit with green flesh (4 letters)" },
            { answer: "CHERRY", clue: "Small, red, sweet fruit (6 letters)" },
            { answer: "LEMON", clue: "Sour yellow citrus fruit (5 letters)" },
            { answer: "PINEAPPLE", clue: "Tropical spiky fruit (9 letters)" },
        ],
    },
    {
        name: "Countries",
        words: [
            { answer: "INDIA", clue: "Country with Taj Mahal (5 letters)" },
            { answer: "JAPAN", clue: "Land of the rising sun (5 letters)" },
            { answer: "BRAZIL", clue: "Largest South American country (6 letters)" },
            { answer: "CANADA", clue: "North American country with maple leaf (6 letters)" },
            { answer: "FRANCE", clue: "Country known for Eiffel Tower (6 letters)" },
            { answer: "EGYPT", clue: "Ancient pyramids located here (5 letters)" },
            { answer: "CHINA", clue: "Most populous country (5 letters)" },
            { answer: "ITALY", clue: "Boot-shaped country in Europe (5 letters)" },
            { answer: "MEXICO", clue: "Southern neighbor of USA (6 letters)" },
            { answer: "GERMANY", clue: "European country famous for cars (7 letters)" },
        ],
    },
    {
        name: "Sports",
        words: [
            { answer: "FOOTBALL", clue: "Most popular sport globally (8 letters)" },
            { answer: "BASKETBALL", clue: "Sport played with a hoop (10 letters)" },
            { answer: "TENNIS", clue: "Played with rackets and a net (6 letters)" },
            { answer: "SWIMMING", clue: "Sport in water (8 letters)" },
            { answer: "CRICKET", clue: "Popular bat-and-ball game (7 letters)" },
            { answer: "SOCCER", clue: "Another name for football (6 letters)" },
            { answer: "VOLLEYBALL", clue: "Team sport over a net (10 letters)" },
            { answer: "GOLF", clue: "Hitting a small ball into holes (4 letters)" },
            { answer: "GYMNASTICS", clue: "Sport of acrobatic feats (10 letters)" },
            { answer: "BOXING", clue: "Combat sport with gloves (6 letters)" },
        ],
    },
    {
        name: "Professions",
        words: [
            { answer: "DOCTOR", clue: "Treats sick people (6 letters)" },
            { answer: "TEACHER", clue: "Educates students (7 letters)" },
            { answer: "ENGINEER", clue: "Designs and builds things (8 letters)" },
            { answer: "ARTIST", clue: "Creates paintings or sculptures (6 letters)" },
            { answer: "CHEF", clue: "Professional cook (4 letters)" },
            { answer: "PILOT", clue: "Flies airplanes (5 letters)" },
            { answer: "NURSE", clue: "Assists doctors in hospitals (5 letters)" },
            { answer: "POLICE", clue: "Maintains law and order (6 letters)" },
            { answer: "WRITER", clue: "Composes books or articles (6 letters)" },
            { answer: "FARMER", clue: "Works on agricultural land (6 letters)" },
        ],
    },
    {
        name: "Colours",
        words: [
            { answer: "RED", clue: "Color of blood and roses (3 letters)" },
            { answer: "BLUE", clue: "Color of the sky and sea (4 letters)" },
            { answer: "GREEN", clue: "Color of grass and leaves (5 letters)" },
            { answer: "YELLOW", clue: "Color of the sun (6 letters)" },
            { answer: "PURPLE", clue: "Mix of red and blue (6 letters)" },
            { answer: "ORANGE", clue: "Fruit and a color (6 letters)" },
            { answer: "BLACK", clue: "Opposite of white (5 letters)" },
            { answer: "WHITE", clue: "Color of snow (5 letters)" },
            { answer: "PINK", clue: "Light red color (4 letters)" },
            { answer: "BROWN", clue: "Color of chocolate and soil (5 letters)" },
        ],
    },
    {
        name: "Household Items",
        words: [
            { answer: "CHAIR", clue: "Something you sit on (5 letters)" },
            { answer: "TABLE", clue: "Flat surface with legs (5 letters)" },
            { answer: "SOFA", clue: "Comfortable long seat (4 letters)" },
            { answer: "LAMP", clue: "Provides light (4 letters)" },
            { answer: "MIRROR", clue: "Reflects images (6 letters)" },
            { answer: "CLOCK", clue: "Tells time (5 letters)" },
            { answer: "FRIDGE", clue: "Keeps food cold (6 letters)" },
            { answer: "OVEN", clue: "Used for baking (4 letters)" },
            { answer: "BED", clue: "Used for sleeping (3 letters)" },
            { answer: "CARPET", clue: "Floor covering (6 letters)" },
        ],
    },
    {
        name: "Body Parts",
        words: [
            { answer: "HEAD", clue: "Top part of the body (4 letters)" },
            { answer: "HAND", clue: "Used for grasping (4 letters)" },
            { answer: "FOOT", clue: "Lower part of the leg (4 letters)" },
            { answer: "EYE", clue: "Used for seeing (3 letters)" },
            { answer: "EAR", clue: "Used for hearing (3 letters)" },
            { answer: "NOSE", clue: "Used for smelling (4 letters)" },
            { answer: "MOUTH", clue: "Used for eating and speaking (5 letters)" },
            { answer: "ARM", clue: "Upper limb of the body (3 letters)" },
            { answer: "LEG", clue: "Lower limb used for walking (3 letters)" },
            { answer: "TOOTH", clue: "Hard white object in mouth (5 letters)" },
        ],
    },
    {
        name: "Nature",
        words: [
            { answer: "RIVER", clue: "Large natural stream of water (5 letters)" },
            { answer: "MOUNTAIN", clue: "Large natural elevation of the earth's surface (8 letters)" },
            { answer: "OCEAN", clue: "Vast body of saltwater (5 letters)" },
            { answer: "FOREST", clue: "Large area covered chiefly with trees (6 letters)" },
            { answer: "LAKE", clue: "Large body of water surrounded by land (4 letters)" },
            { answer: "FLOWER", clue: "Blooming part of a plant (6 letters)" },
            { answer: "TREE", clue: "Large plant with a trunk and branches (4 letters)" },
            { answer: "CLOUD", clue: "Visible mass of water droplets in air (5 letters)" },
            { answer: "SUN", clue: "Star around which Earth orbits (3 letters)" },
            { answer: "MOON", clue: "Earth's natural satellite (4 letters)" },
        ],
    },
    {
        name: "Food",
        words: [
            { answer: "PIZZA", clue: "Italian dish with toppings (5 letters)" },
            { answer: "BURGER", clue: "Sandwich with a ground meat patty (6 letters)" },
            { answer: "PASTA", clue: "Italian staple food (5 letters)" },
            { answer: "BREAD", clue: "Staple food made from flour and water (5 letters)" },
            { answer: "CHEESE", clue: "Dairy product made from milk (6 letters)" },
            { answer: "RICE", clue: "Staple grain, especially in Asia (4 letters)" },
            { answer: "SOUP", clue: "Liquid food (4 letters)" },
            { answer: "SALAD", clue: "Mixture of vegetables (5 letters)" },
            { answer: "EGG", clue: "Oval-shaped food from a chicken (3 letters)" },
            { answer: "MILK", clue: "White liquid produced by mammals (4 letters)" },
        ],
    },
];

// --- Styled Components (re-using from FunZonePage where possible) ---
const GameContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 900px;
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

const PuzzleSelectGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    width: 100%;
    max-width: 800px;
    margin-bottom: 30px;
`;

const PuzzleCard = styled.button`
    background-color: #e3f2fd;
    border: 2px solid #90caf9;
    border-radius: 10px;
    padding: 20px;
    font-size: 1.2em;
    font-weight: bold;
    color: #1a237e;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

    &:hover {
        background-color: #bbdefb;
        transform: translateY(-3px);
    }
    &:active {
        transform: translateY(0);
    }
`;

const CrosswordForm = styled.div`
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
    text-align: left;
`;

const WordInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    background-color: #f9f9f9;
`;

const Clue = styled.p`
    font-size: 1.1em;
    color: #555;
    margin-bottom: 10px;
    font-weight: bold;
`;

const SectionSubtitle = styled.h3`
    font-size: 2em;
    color: #3f51b5;
    margin-top: 20px;
    margin-bottom: 25px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.8em;
    }
    @media (max-width: 480px) {
        font-size: 1.5em;
    }
`;

const WordInput = styled.input`
    padding: 10px 15px;
    font-size: 1.3em;
    border: 2px solid ${props => {
        if (props.isCorrect) return '#4CAF50';
        if (props.isWrong) return '#f44336';
        return '#ccc';
    }};
    border-radius: 8px;
    outline: none;
    width: calc(100% - 30px);
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: #3f51b5;
    }

    &::placeholder {
        color: #bbb;
    }
`;

const FeedbackIcon = styled.span`
    margin-left: 10px;
    font-size: 1.5em;
    color: ${props => props.type === 'correct' ? '#4CAF50' : '#f44336'};
    display: inline-flex;
    align-items: center;
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

const ResultSummary = styled.div`
    margin-top: 30px;
    font-size: 1.4em;
    font-weight: bold;
    color: #4CAF50;
`;

const ScoreDisplay = styled.p`
    font-size: 1.3em;
    color: #555;
    margin-bottom: 15px;
    span {
        font-weight: bold;
        color: #1976d2;
    }
`;


// --- Crossword Game Component ---
const CrosswordGame = ({ onBack }) => {
    const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState(null);
    const [currentPuzzle, setCurrentPuzzle] = useState(null);
    const [answers, setAnswers] = useState({}); // { wordIndex: 'USER_INPUT' }
    const [feedback, setFeedback] = useState({}); // { wordIndex: 'correct' | 'wrong' | null }
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handlePuzzleSelect = useCallback((idx) => {
        setSelectedPuzzleIdx(idx);
        setCurrentPuzzle(crosswordPuzzles[idx]);
        setAnswers({});
        setFeedback({});
        setScore(0);
        setShowResults(false);
    }, []);

    useEffect(() => {
        // If no puzzle selected, default to the first one or just show selection
        // For 10 puzzles, we'll ensure the selection screen is primary.
    }, []);

    const handleInputChange = (e, index) => {
        const value = e.target.value.toUpperCase();
        setAnswers(prev => ({ ...prev, [index]: value }));
        setFeedback(prev => ({ ...prev, [index]: null })); // Clear feedback on change
    };

    const handleSubmit = () => {
        let correctCount = 0;
        const newFeedback = {};
        currentPuzzle.words.forEach((wordObj, index) => {
            if (answers[index] && answers[index] === wordObj.answer) {
                newFeedback[index] = 'correct';
                correctCount++;
            } else {
                newFeedback[index] = 'wrong';
            }
        });
        setFeedback(newFeedback);
        setScore(correctCount);
        setShowResults(true);
    };

    const resetCurrentPuzzle = () => {
        handlePuzzleSelect(selectedPuzzleIdx); // Re-initialize current puzzle
    };

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack} style={{ marginRight: '10px' }}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
                {selectedPuzzleIdx !== null && (
                     <GameButton onClick={() => setSelectedPuzzleIdx(null)}>
                        <FaArrowLeft /> Choose Another Puzzle
                    </GameButton>
                )}
            </div>

            <GameTitle>Crossword Challenge</GameTitle>

            {selectedPuzzleIdx === null ? (
                <>
                    <ScoreDisplay>Solve all 10 puzzles!</ScoreDisplay>
                    <PuzzleSelectGrid>
                        {crosswordPuzzles.map((puzzle, idx) => (
                            <PuzzleCard key={idx} onClick={() => handlePuzzleSelect(idx)}>
                                Puzzle {idx + 1}: {puzzle.name}
                            </PuzzleCard>
                        ))}
                    </PuzzleSelectGrid>
                </>
            ) : (
                <>
                    <SectionSubtitle style={{fontSize: '1.8em', marginBottom: '20px'}}>Puzzle: {currentPuzzle.name}</SectionSubtitle>
                    <CrosswordForm>
                        {currentPuzzle.words.map((word, index) => (
                            <WordInputContainer key={index}>
                                <Clue>{index + 1}. {word.clue}</Clue>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <WordInput
                                        type="text"
                                        placeholder={`Enter ${word.answer.length} letters`}
                                        maxLength={word.answer.length}
                                        value={answers[index] || ''}
                                        onChange={(e) => handleInputChange(e, index)}
                                        isCorrect={feedback[index] === 'correct'}
                                        isWrong={feedback[index] === 'wrong'}
                                        disabled={showResults}
                                    />
                                    {showResults && feedback[index] === 'correct' && (
                                        <FeedbackIcon type="correct"><FaCheckCircle /></FeedbackIcon>
                                    )}
                                    {showResults && feedback[index] === 'wrong' && (
                                        <FeedbackIcon type="wrong"><FaTimesCircle /></FeedbackIcon>
                                    )}
                                </div>
                                {showResults && feedback[index] === 'wrong' && (
                                    <p style={{fontSize: '0.9em', color: '#888', marginTop: '5px'}}>
                                        Correct: <span style={{fontWeight: 'bold', color: '#4CAF50'}}>{word.answer}</span>
                                    </p>
                                )}
                            </WordInputContainer>
                        ))}
                    </CrosswordForm>

                    {!showResults && (
                        <GameButton onClick={handleSubmit}>
                            Check Answers
                        </GameButton>
                    )}

                    {showResults && (
                        <>
                            <ResultSummary>
                                You got <span>{score}</span> out of <span>{currentPuzzle.words.length}</span> correct!
                            </ResultSummary>
                            <GameButton onClick={resetCurrentPuzzle}>
                                <FaSyncAlt /> Try Again
                            </GameButton>
                        </>
                    )}
                </>
            )}
        </GameContainer>
    );
};

export default CrosswordGame;