// src/pages/FunZonePage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
    FaConnectdevelop, FaTable, FaHashtag, FaFont, FaListAlt, FaCompass, FaStream, FaSitemap, FaRegClone, FaTint, FaLock, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaGamepad, FaPuzzlePiece, FaDiceOne,
    FaBrain
} from 'react-icons/fa';

// Import the new game components
import TicTacToeGame from '../components/TicTacToeGame';
import MemoryMatchGame from '../components/MemoryMatchGame';
import CrosswordGame from '../components/CrosswordGame';
import WordScrambleGame from '../components/WordScrambleGame';
import PacmanGameSimplified from '../components/PacmanGameSimplified';
import FifteenPuzzleGame from '../components/FifteenPuzzleGame';
import SudokuGame from '../components/SudokuGame';
import ConnectFourGame from '../components/ConnectFourGame';
import TetrisGame from '../components/TetrisGameSimplified';

// --- Global Styles & Keyframes (remain the same) ---
const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;700&display=swap');

    body {
        font-family: 'Dosis', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background-color: #f5f7fa; /* Subtle background for the whole page */
        color: #333;
        scroll-behavior: smooth; /* Smooth scrolling for navigation */
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-8px); }
        80% { transform: translateX(8px); }
        100% { transform: translateX(0); }
    }
`;

// --- IQ Categories Data (remains the same) ---
const iqCategories = [
    {
        key: 'numbers',
        label: 'Numbers',
        icon: <FaHashtag style={{ color: '#1976d2', fontSize: 48, marginBottom: 12 }} />,
        desc: 'Test your number skills and patterns.',
        time: '60s',
        levels: 5,
        questions: [
            [
                { q: 'What comes next: 3, 6, 9, 12, ?', options: ['13', '15', '16', '18'], answer: 1, diff: 'Easy' },
                { q: 'Find the odd one: 2, 4, 8, 16, 18', options: ['2', '4', '8', '18'], answer: 3, diff: 'Easy' },
                { q: 'What is 7 x 8?', options: ['54', '56', '58', '64'], answer: 1, diff: 'Easy' },
                { q: 'Which is a prime number?', options: ['9', '15', '17', '21'], answer: 2, diff: 'Easy' },
                { q: 'What is the square root of 81?', options: ['7', '8', '9', '10'], answer: 2, diff: 'Easy' },
                { q: 'What is 100 divided by 4?', options: ['20', '24', '25', '40'], answer: 2, diff: 'Easy' },
                { q: 'Which is not a multiple of 5?', options: ['10', '15', '22', '25'], answer: 2, diff: 'Easy' },
                { q: 'What is 12% of 50?', options: ['6', '5', '7', '8'], answer: 0, diff: 'Easy' },
                { q: 'What comes next: 1, 4, 9, 16, ?', options: ['20', '25', '30', '36'], answer: 1, diff: 'Easy' },
                { q: 'What is 2 to the power of 5?', options: ['8', '16', '32', '64'], answer: 2, diff: 'Easy' },
            ],
            [
                { q: 'What is the next number: 2, 6, 12, 20, ?', options: ['28', '30', '32', '36'], answer: 1, diff: 'Medium' },
                { q: 'If 5 + 3 = 28, 9 + 1 = 810, then 7 + 2 = ?', options: ['59', '514', '49', '95'], answer: 2, diff: 'Medium' },
                { q: 'What is the value of x: 3x + 12 = 39', options: ['7', '8', '9', '10'], answer: 2, diff: 'Medium' },
                { q: 'If a = 3 and b = 5, what is a² + b²?', options: ['24', '28', '34', '64'], answer: 1, diff: 'Medium' },
                { q: 'What is the missing number: 7, 10, 15, 22, ?', options: ['29', '30', '31', '33'], answer: 2, diff: 'Medium' },
                { q: 'If 3 people can paint 3 walls in 3 hours, how many people are needed to paint 6 walls in 6 hours?', options: ['3', '6', '9', '12'], answer: 0, diff: 'Medium' },
                { q: 'What is the sum of the first 10 even numbers?', options: ['90', '100', '110', '120'], answer: 2, diff: 'Medium' },
                { q: 'If 20% of a number is 45, what is the number?', options: ['90', '180', '225', '250'], answer: 2, diff: 'Medium' },
                { q: 'What is the next number: 1, 4, 9, 16, 25, ?', options: ['30', '36', '42', '49'], answer: 1, diff: 'Medium' },
                { q: 'If the average of 5 numbers is 12, what is their sum?', options: ['48', '60', '72', '84'], answer: 1, diff: 'Medium' },
            ],
            [
                { q: 'Find the pattern: 3, 6, 18, 72, ?', options: ['144', '216', '288', '360'], answer: 2, diff: 'Medium' },
                { q: 'If a sequence follows the pattern where each term is the sum of the two previous terms, and starts with 2, 5, what is the 6th term?', options: ['42', '47', '76', '89'], answer: 3, diff: 'Medium' },
                { q: 'What is the value of 2³ + 3² × 4?', options: ['36', '44', '48', '52'], answer: 1, diff: 'Medium' },
                { q: 'If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?', options: ['3', '33', '100', '300'], answer: 0, diff: 'Medium' },
                { q: 'What is the next number: 1, 3, 7, 15, 31, ?', options: ['57', '63', '127', '255'], answer: 1, diff: 'Medium' },
                { q: 'If a train travels at 60 km/h, how far will it travel in 2 hours and 45 minutes?', options: ['145 km', '155 km', '160 km', '165 km'], answer: 3, diff: 'Medium' },
                { q: 'What is the value of x in the equation: 2(x + 3) = 3(x - 2)?', options: ['9', '12', '15', '18'], answer: 2, diff: 'Medium' },
                { q: 'If a square has an area of 64 square units, what is its perimeter?', options: ['16 units', '24 units', '32 units', '48 units'], answer: 2, diff: 'Medium' },
                { q: 'What is the probability of rolling a sum of 7 with two dice?', options: ['1/6', '1/8', '1/12', '1/36'], answer: 0, diff: 'Medium' },
                { q: 'If the ratio of boys to girls in a class is 3:5 and there are 24 boys, how many students are in the class?', options: ['40', '56', '64', '80'], answer: 2, diff: 'Medium' },
            ],
            [
                { q: 'In a sequence where each term is the product of the previous two terms, if the first two terms are 2 and 3, what is the 5th term?', options: ['72', '144', '288', '432'], answer: 1, diff: 'Hard' },
                { q: 'If log₁₀(x) = 2.5, what is the value of x?', options: ['250', '316.23', '500', '1000'], answer: 1, diff: 'Hard' },
                { q: 'What is the sum of the infinite geometric series 1 + 1/3 + 1/9 + 1/27 + ...?', options: ['3/2', '4/3', '3/2', '5/3'], answer: 0, diff: 'Hard' },
                { q: 'If f(x) = x² - 3x + 2 and g(x) = 2x + 1, what is f(g(3))?', options: ['30', '42', '49', '56'], answer: 2, diff: 'Hard' },
                { q: 'What is the value of sin(60°) + cos(30°)?', options: ['1', '√3', '1.5', '1.866'], answer: 3, diff: 'Hard' },
                { q: 'If a fair coin is flipped 8 times, what is the probability of getting exactly 5 heads?', options: ['5/16', '7/32', '35/128', '21/64'], answer: 1, diff: 'Hard' },
                { q: 'What is the derivative of f(x) = x³ - 4x² + 2x - 7 at x = 2?', options: ['-2', '0', '2', '4'], answer: 0, diff: 'Hard' },
                { q: 'If the sum of the first n positive integers is 78, what is the value of n?', options: ['11', '12', '13', '14'], answer: 1, diff: 'Hard' },
                { q: 'In how many ways can 5 different books be arranged on a shelf?', options: ['24', '60', '120', '720'], answer: 2, diff: 'Hard' },
                { q: 'What is the value of x that satisfies the equation 2ˣ = 8?', options: ['2', '3', '4', '6'], answer: 1, diff: 'Hard' },
            ],
            [
                { q: 'What is the value of Σ(n²) from n=1 to n=10?', options: ['285', '385', '485', '585'], answer: 2, diff: 'Hard' },
                { q: 'If the roots of the quadratic equation x² + bx + c = 0 are 3 and -5, what is the value of b + c?', options: ['2', '8', '-15', '-13'], answer: 0, diff: 'Hard' },
                { q: 'What is the limit of (1 + 1/n)ⁿ as n approaches infinity?', options: ['1', 'e', 'π', '2'], answer: 1, diff: 'Hard' },
                { q: 'In a standard deck of 52 cards, what is the probability of drawing a red king or a black queen?', options: ['1/13', '2/13', '1/26', '4/13'], answer: 1, diff: 'Hard' },
                { q: 'What is the value of cos(arcsin(3/5))?', options: ['3/5', '4/5', '5/3', '5/4'], answer: 1, diff: 'Hard' },
                { q: 'If a regular hexagon has a perimeter of 24 units, what is its area?', options: ['24√3', '36', '36√3', '48'], answer: 2, diff: 'Hard' },
                { q: 'What is the 10th term of the Fibonacci sequence if the first two terms are 0 and 1?', options: ['34', '55', '89', '144'], answer: 0, diff: 'Hard' },
                { q: 'If a sphere has a volume of 36π cubic units, what is its surface area?', options: ['9π', '12π', '36π', '48π'], answer: 3, diff: 'Hard' },
                { q: 'What is the value of ∫(x²) dx from x=0 to x=3?', options: ['9', '18', '27', '36'], answer: 1, diff: 'Hard' },
                { q: 'If the arithmetic mean of 5 consecutive integers is 27, what is the largest of these integers?', options: ['25', '27', '29', '31'], answer: 2, diff: 'Hard' },
            ],
        ],
    },
    {
        key: 'alphabets',
        label: 'Alphabets',
        icon: <FaFont style={{ color: '#1976d2', fontSize: 48, marginBottom: 12 }} />,
        desc: 'Test your alphabet and language skills.',
        time: '60s',
        levels: 5,
        questions: [
            [
                { q: 'Which letter comes next: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], answer: 1, diff: 'Easy' },
                { q: 'Find the odd one: B, D, F, H, J, K', options: ['B', 'D', 'F', 'K'], answer: 3, diff: 'Easy' },
                { q: 'What is the 5th letter of the English alphabet?', options: ['D', 'E', 'F', 'G'], answer: 1, diff: 'Easy' },
                { q: 'Which comes after Q?', options: ['P', 'R', 'S', 'T'], answer: 1, diff: 'Easy' },
                { q: 'Which is a vowel?', options: ['B', 'C', 'E', 'G'], answer: 2, diff: 'Easy' },
                { q: 'Which comes before M?', options: ['L', 'N', 'O', 'P'], answer: 0, diff: 'Easy' },
                { q: 'Which is not a consonant?', options: ['A', 'B', 'C', 'D'], answer: 0, diff: 'Easy' },
                { q: 'Which comes after X?', options: ['Y', 'Z', 'A', 'B'], answer: 0, diff: 'Easy' },
                { q: 'Which is the 1st letter?', options: ['A', 'B', 'C', 'D'], answer: 0, diff: 'Easy' },
                { q: 'Which comes before F?', options: ['E', 'G', 'H', 'I'], answer: 0, diff: 'Easy' },
            ],
            [
                { q: 'Which letter is 5 letters after K in the alphabet?', options: ['O', 'P', 'Q', 'R'], answer: 1, diff: 'Medium' },
                { q: 'What is the 3rd vowel in the English alphabet?', options: ['E', 'I', 'O', 'U'], answer: 1, diff: 'Medium' },
                { q: 'Which letter pattern comes next: A, E, I, M, ?', options: ['Q', 'R', 'S', 'T'], answer: 0, diff: 'Medium' },
                { q: 'If A=1, B=2, C=3, etc., what letter equals 15?', options: ['M', 'N', 'O', 'P'], answer: 2, diff: 'Medium' },
                { q: 'Which word is spelled correctly?', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], answer: 1, diff: 'Medium' },
                { q: 'What is the middle letter in the word "ALPHABET"?', options: ['A', 'H', 'P', 'B'], answer: 1, diff: 'Medium' },
                { q: 'Which letter appears twice in the word "LETTER"?', options: ['L', 'E', 'T', 'R'], answer: 2, diff: 'Medium' },
                { q: 'What is the only letter that doesn\'t appear in any U.S. state name?', options: ['Q', 'X', 'Z', 'J'], answer: 0, diff: 'Medium' },
                { q: 'Which letter comes between S and U in the alphabet?', options: ['R', 'T', 'V', 'W'], answer: 1, diff: 'Medium' },
                { q: 'Which word contains all five vowels (a, e, i, o, u) exactly once?', options: ['Ambiguous', 'Facetious', 'Precarious', 'Tenacious'], answer: 1, diff: 'Medium' },
            ],
            [
                { q: 'What letter comes next in this pattern: B, D, H, P, ?', options: ['T', 'V', 'X', 'Z'], answer: 0, diff: 'Medium' },
                { q: 'If you rearrange the letters in "EARTH", you get the name of:', options: ['A planet', 'An animal', 'A country', 'A season'], answer: 2, diff: 'Medium' },
                { q: 'Which word is an anagram of "LISTEN"?', options: ['ENLIST', 'TINSEL', 'SILENT', 'All of these'], answer: 3, diff: 'Medium' },
                { q: 'What is the alphabetical position of the letter that comes 4 places after J?', options: ['10', '14', 'N', 'O'], answer: 2, diff: 'Medium' },
                { q: 'Which letter appears most frequently in the English language?', options: ['A', 'E', 'S', 'T'], answer: 1, diff: 'Medium' },
                { q: 'What letter pattern comes next: Z, U, P, K, ?', options: ['F', 'G', 'H', 'I'], answer: 0, diff: 'Medium' },
                { q: 'Which word has its letters in alphabetical order?', options: ['Almost', 'Begins', 'Ghost', 'Biopsy'], answer: 0, diff: 'Medium' },
                { q: 'What is the only letter that appears twice in the alphabet song?', options: ['A', 'E', 'L', 'W'], answer: 0, diff: 'Medium' },
                { q: 'If CHAIR = 3-8-1-9-18, what does TABLE equal?', options: ['20-1-2-12-5', '20-26-2-12-5', '20-1-2-13-5', '2-1-20-12-5'], answer: 0, diff: 'Medium' },
                { q: 'Which letter is used as a Roman numeral?', options: ['H', 'K', 'R', 'X'], answer: 3, diff: 'Medium' },
            ],
            [
                { q: 'What comes next in this sequence: A, Z, B, Y, C, X, ?', options: ['D', 'W', 'Y', 'Z'], answer: 1, diff: 'Hard' },
                { q: 'Which word becomes another valid word when you remove one letter (without rearranging)?', options: ['Plank', 'Clamp', 'Stare', 'Bread'], answer: 2, diff: 'Hard' },
                { q: 'If the alphabet is written backwards, which letter would be the 7th letter?', options: ['G', 'T', 'S', 'U'], answer: 2, diff: 'Hard' },
                { q: 'What is the only common English word that has five consecutive vowels?', options: ['Queueing', 'Beautiful', 'Sequoia', 'Onomatopoeia'], answer: 0, diff: 'Hard' },
                { q: 'Which letter appears in the same position in the alphabet as its numerical value?', options: ['H', 'J', 'K', 'L'], answer: 0, diff: 'Hard' },
                { q: 'If APPLE is coded as 1-16-16-12-5, how would ORANGE be coded?', options: ['15-18-1-14-7-5', '15-17-1-14-7-5', '14-18-1-13-7-5', '15-18-1-13-7-5'], answer: 0, diff: 'Hard' },
                { q: 'What is the longest English word that can be typed using only the top row of a standard QWERTY keyboard?', options: ['Typewriter', 'Perpetuity', 'Proprietor', 'Repertoire'], answer: 2, diff: 'Hard' },
                { q: 'Which letter is in the exact middle of the alphabet?', options: ['M', 'N', 'O', 'P'], answer: 0, diff: 'Hard' },
                { q: 'What is the only letter that doesn\'t appear in the periodic table of elements?', options: ['J', 'Q', 'W', 'X'], answer: 1, diff: 'Hard' },
                { q: 'Which word contains the most consecutive consonants?', options: ['Strengths', 'Twelfths', 'Rhythms', 'Catchphrase'], answer: 1, diff: 'Hard' },
            ],
            [
                { q: 'What is the only English word that ends with the letters "mt"?', options: ['Dreamt', 'Exempt', 'Summit', 'Prompt'], answer: 0, diff: 'Hard' },
                { q: 'Which word contains all the vowels in alphabetical order?', options: ['Facetious', 'Abstemious', 'Caesious', 'Arterious'], answer: 1, diff: 'Hard' },
                { q: 'What is the longest English word without a true vowel (a, e, i, o, u)?', options: ['Rhythm', 'Crypts', 'Nymphs', 'Sylphs'], answer: 0, diff: 'Hard' },
                { q: 'If A=1, B=4, C=9, D=16, what does F equal?', options: ['25', '36', '49', '64'], answer: 1, diff: 'Hard' },
                { q: 'Which word becomes its own antonym when the first letter is removed?', options: ['Block', 'Quite', 'Ravel', 'Sever'], answer: 2, diff: 'Hard' },
                { q: 'What is the only common word in English that has five consecutive consonants?', options: ['Angsts', 'Lengths', 'Sixths', 'Strengths'], answer: 3, diff: 'Hard' },
                { q: 'Which letter appears most frequently in the names of U.S. states?', options: ['A', 'I', 'N', 'S'], answer: 0, diff: 'Hard' },
                { q: 'What is the only 7-letter word in English that contains all 5 vowels exactly once?', options: ['Sequoia', 'Eulogia', 'Miaoued', 'Adoulie'], answer: 2, diff: 'Hard' },
                { q: 'Which word has the most definitions in the Oxford English Dictionary?', options: ['Run', 'Set', 'Go', 'Put'], answer: 1, diff: 'Hard' },
                { q: 'What is the only English word that ends with the suffix "-gry"?', options: ['Angry', 'Hungry', 'Meagry', 'Aggry'], answer: 2, diff: 'Hard' },
            ],
        ],
    },
    {
        key: 'mirror',
        label: 'Mirror Image',
        icon: <FaRegClone style={{ color: '#1976d2', fontSize: 48, marginBottom: 12 }} />,
        desc: 'Identify the correct mirror image.',
        time: '60s',
        levels: 1,
        questions: [
            [
                { q: 'Which is the mirror image of the letter "P"?', options: ['𐰯', 'Ԁ', 'Ԏ', 'Ԓ'], answer: 1, diff: 'Easy' },
                { q: 'Select the mirror image of the number "3".', options: ['Ɛ', '3', 'Ↄ', 'З'], answer: 0, diff: 'Easy' },
                { q: 'Identify the mirror image of the letter "E".', options: ['Ǝ', 'E', 'Σ', 'Ξ'], answer: 0, diff: 'Easy' },
                { q: 'Which option is the mirror image of "b"?', options: ['d', 'q', 'p', 'b'], answer: 0, diff: 'Easy' },
                { q: 'Select the mirror image of the letter "N".', options: ['И', 'N', 'Л', 'Ӣ'], answer: 0, diff: 'Easy' },
                { q: 'Which is the mirror image of the digit "7"?', options: ['𝟟', '𝟠', '𝟡', '𝟜'], answer: 0, diff: 'Easy' },
                { q: 'Identify the mirror image of the letter "R".', options: ['Я', 'R', 'ʁ', 'ɹ'], answer: 0, diff: 'Easy' },
                { q: 'Which option is the mirror image of "L"?', options: ['⅃', 'L', 'Γ', 'ɭ'], answer: 0, diff: 'Easy' },
                { q: 'Select the mirror image of the letter "S".', options: ['Ƨ', 'S', 'Ϭ', 'Ʃ'], answer: 0, diff: 'Easy' },
                { q: 'Which is the mirror image of the digit "2"?', options: ['ᄅ', '2', 'Ƨ', 'ↄ'], answer: 0, diff: 'Easy' },
            ]
        ],
    },
    {
        key: 'water',
        label: 'Water Image',
        icon: <FaTint style={{ color: '#1976d2', fontSize: 48, marginBottom: 12 }} />,
        desc: 'Identify the correct water image.',
        time: '60s',
        levels: 3,
        questions: [
            // Level 1
            [
                { q: 'What is the water image of the letter "A"?', options: ['∀', 'A', 'ɐ', 'Λ'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "M"?', options: ['W', 'M', 'ɯ', 'ʍ'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "V"?', options: ['Λ', 'V', 'Ʌ', 'ʌ'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "T"?', options: ['⊥', 'T', '┴', '⊢'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "E"?', options: ['Ǝ', 'E', 'Σ', 'Ξ'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "U"?', options: ['∩', 'U', '∪', '∧'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "N"?', options: ['ᴎ', 'N', 'И', '∩'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "S"?', options: ['S', 'Ƨ', 'ƨ', 'Ʃ'], answer: 2, diff: 'Easy' },
                { q: 'What is the water image of the letter "P"?', options: ['Ԁ', 'P', 'q', 'd'], answer: 0, diff: 'Easy' },
                { q: 'What is the water image of the letter "L"?', options: ['⅃', 'L', 'Γ', 'ɭ'], answer: 0, diff: 'Easy' },
            ],
            // Level 2
            [
                { q: 'What is the water image of the letter "B"?', options: ['𐑂', 'B', 'ƃ', 'β'], answer: 2, diff: 'Medium' },
                { q: 'What is the water image of the letter "C"?', options: ['Ↄ', 'C', 'ɔ', 'Ͻ'], answer: 2, diff: 'Medium' },
                { q: 'What is the water image of the letter "D"?', options: ['ᗡ', 'D', 'p', 'q'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "F"?', options: ['Ⅎ', 'F', 'Ϝ', 'Ғ'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "G"?', options: ['⅁', 'G', 'ǫ', 'ɢ'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "J"?', options: ['ſ', 'J', 'ɾ', 'Ɉ'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "Q"?', options: ['Ό', 'Q', 'Ò', 'Ǫ'], answer: 3, diff: 'Medium' },
                { q: 'What is the water image of the letter "R"?', options: ['ɹ', 'R', 'Я', 'ʁ'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "Y"?', options: ['⅄', 'Y', 'ɏ', 'ɣ'], answer: 0, diff: 'Medium' },
                { q: 'What is the water image of the letter "Z"?', options: ['Z', 'Ƹ', 'ƹ', 'ʐ'], answer: 2, diff: 'Medium' },
            ],
            // Level 3
            [
                { q: 'What is the water image of the letter "H"?', options: ['H', 'ɥ', 'ʜ', 'ʰ'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "K"?', options: ['ʞ', 'K', 'κ', 'Ҡ'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "X"?', options: ['X', 'x', '×', '⨯'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "O"?', options: ['O', 'o', '0', 'Θ'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "W"?', options: ['M', 'W', 'ɯ', 'ʍ'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "I"?', options: ['I', 'l', '|', 'ı'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "T"?', options: ['⊥', 'T', '┴', '⊢'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "S"?', options: ['ƨ', 'S', 'Ƨ', 'Ʃ'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "U"?', options: ['∩', 'U', '∪', '∧'], answer: 0, diff: 'Hard' },
                { q: 'What is the water image of the letter "L"?', options: ['⅃', 'L', 'Γ', 'ɭ'], answer: 0, diff: 'Hard' },
            ],
        ],
    },
];


// --- Styled Components (remain the same mostly) ---
const FullPageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Section = styled.section`
    width: 100%;
    max-width: 1200px;
    padding: 40px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 60px;

    &:not(:first-child) {
        padding-top: 60px;
    }

    @media (max-width: 768px) {
        padding: 30px 15px;
        margin-bottom: 40px;
    }
`;

const WelcomeSection = styled(Section)`
    min-height: 100vh;
    justify-content: center;
    background: url(https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg);
    background-size: cover;
    background-position: center;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    margin-bottom: 0;
`;

const WelcomeTitle = styled.h1`
    font-size: 4.5em;
    margin-bottom: 25px;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
        font-size: 3.5em;
    }
    @media (max-width: 480px) {
        font-size: 2.8em;
    }
`;

const WelcomeText = styled.p`
    font-size: 1.5em;
    max-width: 800px;
    line-height: 1.6;
    margin-bottom: 40px;
    opacity: 0.9;

    @media (max-width: 768px) {
        font-size: 1.2em;
        margin-bottom: 30px;
    }
    @media (max-width: 480px) {
        font-size: 1em;
        margin-bottom: 25px;
    }
`;

const ScrollDownButton = styled.a`
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 15px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-size: 1.2em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.3s ease;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-5px);
    }

    @media (max-width: 480px) {
        padding: 12px 25px;
        font-size: 1em;
    }
`;

const Header = styled.h2`
    font-size: 3em;
    color: #1a237e;
    margin-bottom: 40px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        font-size: 2.5em;
        margin-bottom: 30px;
    }
    @media (max-width: 480px) {
        font-size: 2em;
        margin-bottom: 20px;
    }
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

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    max-width: 1200px;
    width: 100%;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
    }
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const CategoryCard = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    }

    h4 {
        font-size: 1.8em;
        color: #424242;
        margin-top: 10px;
        margin-bottom: 8px;
    }

    p {
        font-size: 1em;
        color: #757575;
        margin-bottom: 15px;
    }

    span {
        font-size: 0.9em;
        color: #9e9e9e;
        margin-top: auto;
    }

    @media (max-width: 480px) {
        padding: 20px;
        h4 { font-size: 1.6em; }
        p { font-size: 0.9em; }
    }
`;

const LevelsContainer = styled.div`
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

    h4 {
        font-size: 1.8em;
        color: #1976d2;
        margin-bottom: 25px;
    }

    @media (max-width: 768px) {
        padding: 25px;
    }
    @media (max-width: 480px) {
        padding: 20px;
    }
`;

const LevelsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 100%;
`;

const LevelButton = styled.button`
    background: ${props => props.isUnlocked ? '#4caf50' : '#e0e0e0'};
    color: ${props => props.isUnlocked ? '#ffffff' : '#757575'};
    padding: 18px 25px;
    border-radius: 12px;
    border: none;
    font-size: 1.5em;
    font-weight: bold;
    cursor: ${props => props.isUnlocked ? 'pointer' : 'not-allowed'};
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    box-shadow: ${props => props.isUnlocked ? '0 5px 15px rgba(76, 175, 80, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.1)'};
    min-width: 100px;
    text-align: center;
    ${props => props.shake && `animation: shake 0.4s; border: 2px solid #ff7043;`}

    &:hover {
        ${props => props.isUnlocked && `
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
        `}
    }

    &:active {
        ${props => props.isUnlocked && `transform: translateY(0);`}
    }

    @media (max-width: 480px) {
        font-size: 1.3em;
        padding: 15px 20px;
        min-width: 80px;
    }
`;

const QuizSectionContainer = styled.div`
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

const QuizHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;

    span {
        font-size: 1.2em;
        font-weight: bold;
        color: #3f51b5;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }
`;

const QuestionText = styled.p`
    font-size: 1.8em;
    font-weight: bold;
    color: #424242;
    margin-bottom: 30px;
    line-height: 1.4;

    @media (max-width: 768px) {
        font-size: 1.5em;
    }
    @media (max-width: 480px) {
        font-size: 1.2em;
        margin-bottom: 20px;
    }
`;

const OptionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    width: 100%;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const OptionButton = styled.button`
    background-color: ${props => {
        if (props.isSelected) {
            if (props.isCorrect) return '#4CAF50';
            if (props.isWrong) return '#f44336';
            return '#2196F3';
        }
        return '#f0f0f0';
    }};
    color: ${props => props.isSelected ? '#ffffff' : '#424242'};
    border: 2px solid ${props => {
        if (props.isSelected) {
            if (props.isCorrect) return '#4CAF50';
            if (props.isWrong) return '#f44336';
            return '#2196F3';
        }
        return '#ccc';
    }};
    padding: 15px 20px;
    border-radius: 10px;
    font-size: 1.1em;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

    &:hover {
        ${props => !props.isSelected && `background-color: #e0e0e0;`}
        transform: translateY(-2px);
    }
    &:active {
        transform: translateY(0);
    }

    @media (max-width: 480px) {
        font-size: 1em;
        padding: 12px 15px;
    }
`;

const GameButton = styled.button`
    background-color: #3f51b5; /* A primary blue color */
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    margin: 5px; /* Add some margin for spacing when multiple buttons */

    &:hover {
        background-color: #303f9f; /* Darker blue on hover */
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background-color: #9fa8da; /* Lighter blue when disabled */
        cursor: not-allowed;
    }

    @media (max-width: 480px) {
        padding: 10px 20px;
        font-size: 1em;
    }
`;

const QuizResultContainer = styled.div`
    background: #ffffff;
    border-radius: 15px;
    padding: 40px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    text-align: center;
    margin-top: 30px;

    h4 {
        font-size: 2.5em;
        color: #1976d2;
        margin-bottom: 20px;
    }

    p {
        font-size: 1.3em;
        color: #424242;
        margin-bottom: 15px;
    }

    @media (max-width: 480px) {
        padding: 30px;
        h4 { font-size: 2em; }
        p { font-size: 1.1em; }
    }
`;

const GamesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    width: 100%;
`;

const GameCard = styled(CategoryCard)`
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    }
`;


// --- Main FunZonePage Component ---
const FunZonePage = () => {
    // State for IQ Quiz
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [unlockedLevels, setUnlockedLevels] = useState(() => {
        const saved = localStorage.getItem('unlockedLevels');
        return saved ? JSON.parse(saved) : {};
    });
    const [quizStep, setQuizStep] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [quizSelectedOption, setQuizSelectedOption] = useState(null);
    const [quizResultFeedback, setQuizResultFeedback] = useState(null);
    const [quizTimeLeft, setQuizTimeLeft] = useState(60);
    const [shakeIdx, setShakeIdx] = useState(null);
    const [showQuizResult, setShowQuizResult] = useState(false);
    const [quizActive, setQuizActive] = useState(false);

    const timerRef = useRef(null);
    const iqTestSectionRef = useRef(null);
    const gamesSectionRef = useRef(null); // Ref for Games section to scroll to

    // NEW: State for Interactive Games
    const [selectedGame, setSelectedGame] = useState(null); // 'ticTacToe', 'memoryMatch', 'crossword', 'wordScramble'

    // Effect for handling the quiz timer
    useEffect(() => {
        if (quizActive && quizTimeLeft > 0) {
            timerRef.current = setTimeout(() => setQuizTimeLeft(prev => prev - 1), 1000);
        } else if (quizActive && quizTimeLeft === 0) {
            handleQuizEnd();
        }
        return () => clearTimeout(timerRef.current);
    }, [quizActive, quizTimeLeft, quizStep, selectedCat, selectedLevel]); // Added selectedCat, selectedLevel to deps

    // Save unlocked levels to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
    }, [unlockedLevels]);

    // Reset quiz state when a new category or level is picked or when going back
    const resetQuizState = useCallback(() => {
        clearTimeout(timerRef.current);
        setQuizStep(0);
        setQuizScore(0);
        setQuizSelectedOption(null);
        setQuizResultFeedback(null);
        setQuizTimeLeft(60);
        setShowQuizResult(false);
        setQuizActive(false);
    }, []);

    // Function to clear all game selections (IQ and Interactive)
    const clearAllSelections = useCallback(() => {
        setSelectedCat(null);
        setSelectedLevel(null);
        setSelectedGame(null); // Clear interactive game selection
        resetQuizState();
    }, [resetQuizState]);

    const handleCategorySelect = (category) => {
        clearAllSelections(); // Clear any existing game states
        setSelectedCat(category);
        if (iqTestSectionRef.current) {
            iqTestSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleLevelSelect = (levelIndex) => {
        const categoryKey = selectedCat.key;
        const isUnlocked = (unlockedLevels[categoryKey] || 0) >= levelIndex;

        if (isUnlocked) {
            setSelectedLevel(levelIndex);
            setQuizActive(true);
            setQuizTimeLeft(60);
            setQuizStep(0);
            setQuizScore(0);
            setQuizSelectedOption(null);
            setQuizResultFeedback(null);
            setShowQuizResult(false);
        } else {
            setShakeIdx(levelIndex);
            setTimeout(() => setShakeIdx(null), 500);
            alert('This level is locked! Complete previous levels to unlock.');
        }
    };

    const handleOptionClick = (optionIndex) => {
        if (quizResultFeedback !== null) return;

        setQuizSelectedOption(optionIndex);
        const currentQuestion = selectedCat.questions[selectedLevel][quizStep];
        if (optionIndex === currentQuestion.answer) {
            setQuizResultFeedback('correct');
        } else {
            setQuizResultFeedback('wrong');
        }
    };

    const handleNextQuestion = () => {
        if (quizResultFeedback === 'correct') {
            setQuizScore(prevScore => prevScore + 1);
        }

        const currentQuestions = selectedCat.questions[selectedLevel];
        if (quizStep < currentQuestions.length - 1) {
            setQuizStep(prevStep => prevStep + 1);
            setQuizSelectedOption(null);
            setQuizResultFeedback(null);
            setQuizTimeLeft(60);
        } else {
            handleQuizEnd();
        }
    };

    const handleQuizEnd = useCallback(() => {
        clearTimeout(timerRef.current);
        setQuizActive(false);
        setShowQuizResult(true);

        const categoryKey = selectedCat.key;
        const currentMaxLevel = unlockedLevels[categoryKey] || 0;
        const totalQuestions = selectedCat.questions[selectedLevel].length;
        const passingScore = Math.floor(totalQuestions * 0.7);

        if (quizScore >= passingScore && selectedLevel < selectedCat.levels - 1) {
            if (selectedLevel === currentMaxLevel) {
                setUnlockedLevels(prev => ({
                    ...prev,
                    [categoryKey]: selectedLevel + 1
                }));
            }
        }
    }, [selectedCat, selectedLevel, quizScore, unlockedLevels]);

    // NEW: Handle selecting an interactive game
    const handleGameSelect = (gameKey) => {
        clearAllSelections(); // Clear any IQ quiz states
        setSelectedGame(gameKey);
        if (gamesSectionRef.current) {
            gamesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Render IQ Quiz Components based on state
    const renderQuizContent = () => {
        if (selectedCat && selectedLevel !== null && quizActive) {
            const currentQuestion = selectedCat.questions[selectedLevel]?.[quizStep];
            if (!currentQuestion) {
                return <p>No questions found for this level.</p>;
            }
            return (
                <QuizSectionContainer>
                    <QuizHeader>
                        <span>Question {quizStep + 1} / {selectedCat.questions[selectedLevel].length}</span>
                        <span>Time Left: {quizTimeLeft}s</span>
                    </QuizHeader>
                    <QuestionText>{currentQuestion.q}</QuestionText>
                    <OptionsGrid>
                        {currentQuestion.options.map((option, index) => (
                            <OptionButton
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                isSelected={quizSelectedOption === index}
                                isCorrect={quizResultFeedback === 'correct' && quizSelectedOption === index}
                                isWrong={quizResultFeedback === 'wrong' && quizSelectedOption === index}
                                disabled={quizResultFeedback !== null}
                            >
                                {option}
                                {quizResultFeedback === 'correct' && quizSelectedOption === index && <FaCheckCircle style={{ marginLeft: 8 }} />}
                                {quizResultFeedback === 'wrong' && quizSelectedOption === index && <FaTimesCircle style={{ marginLeft: 8 }} />}
                            </OptionButton>
                        ))}
                    </OptionsGrid>
                    {quizResultFeedback && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <GameButton onClick={handleNextQuestion}>
                                {quizStep < selectedCat.questions[selectedLevel].length - 1 ? 'Next Question' : 'View Results'}
                            </GameButton>
                        </div>
                    )}
                </QuizSectionContainer>
            );
        } else if (selectedCat && selectedLevel !== null && showQuizResult) {
            const totalQuestions = selectedCat.questions[selectedLevel].length;
            const passingScore = Math.floor(totalQuestions * 0.7);
            return (
                <QuizResultContainer>
                    <h4>Quiz Complete!</h4>
                    <p>You scored {quizScore} out of {totalQuestions} questions.</p>
                    {quizScore >= passingScore ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>Great job! You passed this level.</p>
                    ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Keep practicing! You can do better.</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <GameButton onClick={() => { setSelectedLevel(null); resetQuizState(); }}>
                            Back to Levels
                        </GameButton>
                        <GameButton onClick={() => { setSelectedCat(null); setSelectedLevel(null); resetQuizState(); }}>
                            Back to Categories
                        </GameButton>
                    </div>
                </QuizResultContainer>
            );
        }
        return null;
    };


    return (
        <>
            <GlobalStyle />
            <FullPageContainer>
                {/* 1. Welcome Section */}
                <WelcomeSection>
                    <WelcomeTitle>Welcome to the Fun Zone!</WelcomeTitle>
                    <WelcomeText>
                        Challenge your mind with IQ tests and dive into exciting interactive games.
                        Your journey to fun and knowledge starts here!
                    </WelcomeText>
                    <ScrollDownButton href="#iq-test-section">Explore Fun Zone!</ScrollDownButton>
                </WelcomeSection>

                {/* 2. IQ Test Section - Only show if no interactive game is selected */}
                {!selectedGame && (
                    <Section id="iq-test-section" ref={iqTestSectionRef}>
                        <Header>IQ Test Challenge</Header>
                        <SectionSubtitle>Choose an IQ Category</SectionSubtitle>
                        <CategoryGrid>
                            {iqCategories.map(category => (
                                <CategoryCard key={category.key} onClick={() => handleCategorySelect(category)}>
                                    {category.icon}
                                    <h4>{category.label}</h4>
                                    <p>{category.desc}</p>
                                    <span>Time per question: {category.time}</span>
                                </CategoryCard>
                            ))}
                        </CategoryGrid>

                        {selectedCat && (
                            <LevelsContainer>
                                <div style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
                                    <GameButton onClick={() => { setSelectedCat(null); resetQuizState(); }} style={{ marginRight: 'auto' }}>
                                        <FaArrowLeft /> Back to Categories
                                    </GameButton>
                                </div>
                                <h4>{selectedCat.label} Levels</h4>
                                <LevelsGrid>
                                    {Array.from({ length: selectedCat.levels }).map((_, levelIdx) => {
                                        const isUnlocked = (unlockedLevels[selectedCat.key] || 0) >= levelIdx;
                                        return (
                                            <LevelButton
                                                key={levelIdx}
                                                onClick={() => handleLevelSelect(levelIdx)}
                                                isUnlocked={isUnlocked}
                                                shake={shakeIdx === levelIdx}
                                            >
                                                {isUnlocked ? `Level ${levelIdx + 1}` : <FaLock />}
                                            </LevelButton>
                                        );
                                    })}
                                </LevelsGrid>
                            </LevelsContainer>
                        )}

                        {renderQuizContent()} {/* Renders quiz or result based on state */}

                    </Section>
                )}


                {/* 3. Interactive Games Section */}
                <Section id="interactive-games-section" ref={gamesSectionRef}>
                    <Header>Interactive Games</Header>

                    {!selectedGame && ( // Only show game selection grid if no game is selected
                        <>
                            <SectionSubtitle>Choose a Game!</SectionSubtitle>
                            <GamesGrid>
                                <GameCard onClick={() => handleGameSelect('ticTacToe')}>
                                    <FaDiceOne style={{ color: '#673ab7', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Tic-Tac-Toe</h4>
                                    <p>Play against the computer in this classic game.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('memoryMatch')}>
                                    <FaBrain style={{ color: '#ff9800', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Memory Match</h4>
                                    <p>Test your memory with this classic game.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('crossword')}>
                                    <FaSitemap style={{ color: '#009688', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Crossword Puzzle</h4>
                                    <p>Fill in words based on clues.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('wordScramble')}>
                                    <FaPuzzlePiece style={{ color: '#e91e63', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Word Scramble</h4>
                                    <p>Unscramble letters to find the hidden words.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                {/* Future games marked as under development */}
                                <GameCard>
                                    <FaListAlt style={{ color: '#795548', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Trivia Challenge</h4>
                                    <p>Answer questions from various categories.</p>
                                    <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Under Development</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('pacman')}>
                                    <FaGamepad style={{ color: '#09f6fd', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Pacman</h4>
                                    <p>Collect all coins with the pacman.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('fifteenPuzzle')}>
                                    <h6 style={{ color: '#673b00', fontSize: 48, marginBottom: 12 }}>15</h6>
                                    <h4>Fifteen Puzzle</h4>
                                    <p>Slide tiles to solve the puzzle.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('sudoku')}>
                                    <h6 style={{ color: '#1e51ff', fontSize: 48, marginBottom: 12 }}>9</h6>
                                    <h4>Sudoku</h4>
                                    <p>Fill in the empty cells with numbers 1-9.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('connectFour')}>
                                    <FaConnectdevelop style={{ color: '#ace300', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Connect Four</h4>
                                    <p>Connect four dots in a row to win.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>
                                <GameCard onClick={() => handleGameSelect('tetris')}>
                                    <FaTable style={{ color: '#970089', fontSize: 48, marginBottom: 12 }} />
                                    <h4>Tetris</h4>
                                    <p>Stack blocks to create shapes.</p>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Ready to Play!</span>
                                </GameCard>

                            </GamesGrid>
                        </>
                    )}

                    {/* Conditionally render the selected game component */}
                    {selectedGame === 'ticTacToe' && (
                        <TicTacToeGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'memoryMatch' && (
                        <MemoryMatchGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'crossword' && (
                        <CrosswordGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'wordScramble' && (
                        <WordScrambleGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'pacman' && (
                        <PacmanGameSimplified onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'fifteenPuzzle' && (
                        <FifteenPuzzleGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'sudoku' && (
                        <SudokuGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'connectFour' && (
                        <ConnectFourGame onBack={() => setSelectedGame(null)} />
                    )}
                    {selectedGame === 'tetris' && (
                        <TetrisGame onBack={() => setSelectedGame(null)} />
                    )}
                </Section>

            </FullPageContainer>
        </>
    );
};

export default FunZonePage;