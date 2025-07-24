// src/components/MemoryMatchGame.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaArrowLeft } from 'react-icons/fa';

// --- Game Data (10 unique items, so 10 pairs = 20 cards) ---
const gameEmojis = [
    '🍎', '🍊', '🍋', '🍉', '🍇',
    '🍓', '🍒', '🍑', '🍍', '🥭'
];
// These 10 emojis represent 10 distinct 'puzzles' in terms of pairs to find.

// --- Styled Components for Memory Match Game ---
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

const GameBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* 5 columns for 20 cards (10 pairs) */
    gap: 15px;
    margin-bottom: 30px;
    width: 100%;
    max-width: 800px; /* Adjust as needed */

    @media (max-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    }
    @media (max-width: 480px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
`;

const Card = styled.div`
    width: 100%;
    padding-bottom: 100%; /* Makes cards square */
    position: relative;
    background-color: #e0e0e0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.isFlipped || props.isMatched ? 'default' : 'pointer'};
    transition: transform 0.3s ease, background-color 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 2.5em;
    font-weight: bold;
    color: #fff;
    transform-style: preserve-3d;
    transform: ${props => props.isFlipped || props.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'};

    &:hover {
        ${props => !(props.isFlipped || props.isMatched) && `
            transform: translateY(-5px) rotateY(0deg); /* Slight lift on hover */
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        `}
    }

    .card-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }

    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card-front {
        background-color: #3f51b5; /* Blue for the back of the card */
        color: white;
        transform: rotateY(0deg);
        font-size: 1.8em;
    }

    .card-back {
        background-color: #7986cb; /* Lighter blue for the front */
        color: white;
        transform: rotateY(180deg);
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


// --- Memory Match Game Component ---
const MemoryMatchGame = ({ onBack }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]); // Stores indices of currently flipped cards
    const [matchedCards, setMatchedCards] = useState([]); // Stores indices of matched cards
    const [moves, setMoves] = useState(0);
    const [canFlip, setCanFlip] = useState(true); // To prevent rapid flipping
    const [gameWon, setGameWon] = useState(false);

    // Function to initialize or reset the game
    const initializeGame = useCallback(() => {
        const shuffledEmojis = [...gameEmojis, ...gameEmojis] // Duplicate for pairs
            .sort(() => Math.random() - 0.5) // Shuffle
            .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));

        setCards(shuffledEmojis);
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
        setCanFlip(true);
        setGameWon(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // Handle card click logic
    const handleCardClick = (clickedIndex) => {
        if (!canFlip || flippedCards.includes(clickedIndex) || matchedCards.includes(clickedIndex)) {
            return; // Don't allow flipping if not allowed, already flipped, or already matched
        }

        setMoves(prev => prev + 1);

        // Flip the clicked card
        const newCards = [...cards];
        newCards[clickedIndex].isFlipped = true;
        setCards(newCards);

        setFlippedCards(prev => [...prev, clickedIndex]);
    };

    // Check for match when two cards are flipped
    useEffect(() => {
        if (flippedCards.length === 2) {
            setCanFlip(false); // Prevent further flips

            const [idx1, idx2] = flippedCards;
            const card1 = cards[idx1];
            const card2 = cards[idx2];

            if (card1.emoji === card2.emoji) {
                // Match found
                setTimeout(() => {
                    setMatchedCards(prev => [...prev, idx1, idx2]);
                    setFlippedCards([]); // Clear flipped cards
                    setCanFlip(true); // Allow flipping again
                }, 800);
            } else {
                // No match, flip back
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[idx1].isFlipped = false;
                    resetCards[idx2].isFlipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                    setCanFlip(true);
                }, 1000);
            }
        }
    }, [flippedCards, cards]);

    // Check for win condition
    useEffect(() => {
        if (matchedCards.length === cards.length && cards.length > 0) {
            setGameWon(true);
        }
    }, [matchedCards, cards]);

    return (
        <GameContainer>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                <GameButton onClick={onBack}>
                    <FaArrowLeft /> Back to Games
                </GameButton>
            </div>
            <GameTitle>Memory Match</GameTitle>
            <GameInfo>
                Pairs Matched: <span>{matchedCards.length / 2} / {gameEmojis.length}</span> | Moves: <span>{moves}</span>
            </GameInfo>
            <GameBoard>
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        isFlipped={card.isFlipped}
                        isMatched={card.isMatched}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="card-inner">
                            <div className="card-front">?</div> {/* Back of the card */}
                            <div className="card-back">{card.emoji}</div> {/* Front of the card */}
                        </div>
                    </Card>
                ))}
            </GameBoard>
            <GameButton onClick={initializeGame}>
                <FaSyncAlt /> Reset Game
            </GameButton>

            <GameResultOverlay isVisible={gameWon}>
                <ResultContent>
                    <h4>Congratulations!</h4>
                    <p>You matched all pairs in <span>{moves}</span> moves!</p>
                    <GameButton onClick={initializeGame}>
                        Play Again
                    </GameButton>
                    <GameButton onClick={onBack} style={{ marginLeft: '10px' }}>
                        Back to Games
                    </GameButton>
                </ResultContent>
            </GameResultOverlay>
        </GameContainer>
    );
};

export default MemoryMatchGame;