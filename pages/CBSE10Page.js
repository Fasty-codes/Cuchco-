import React from 'react';
import './LearnPage.css';

const mathsChapters = [
  {
    number: 1,
    name: 'Real Numbers',
    points: [
      'The set of real numbers includes rational and irrational numbers.',
      'Euclid’s Division Lemma is used to find HCF of two numbers.',
      'Fundamental Theorem of Arithmetic: Every composite number can be expressed as a product of primes uniquely (except for the order).',
      'Irrational numbers cannot be expressed as a ratio of integers.'
    ],
    questions: [
      {
        type: 'MCQ',
        q: 'HCF of 8, 9, 25 is',
        a: '1',
      },
      {
        type: 'MCQ',
        q: 'The product of a rational and irrational number is',
        a: 'Irrational',
      },
      {
        type: 'Short',
        q: 'State fundamental theorem of arithmetic.',
        a: 'Every integer greater than 1 is either a prime number or can be expressed as a product of prime numbers, and this factorization is unique except for the order of the factors.'
      },
      {
        type: 'Short',
        q: 'Is the square root of 2 rational or irrational? Justify.',
        a: 'Irrational. It cannot be expressed as a ratio of two integers.'
      },
      {
        type: 'Long',
        q: 'Prove that √3 is irrational.',
        a: 'Assume √3 is rational, so √3 = p/q (in lowest terms). Then 3 = p²/q² ⇒ p² = 3q². So p is divisible by 3. Let p = 3k. Substitute: (3k)² = 3q² ⇒ 9k² = 3q² ⇒ q² = 3k², so q is also divisible by 3. This contradicts p/q being in lowest terms. Hence, √3 is irrational.'
      }
    ]
  },
  {
    number: 2,
    name: 'Polynomials',
    points: [],
    questions: [],
    comingSoon: true
  },
  {
    number: 3,
    name: 'Pair of Linear Equations in Two Variables',
    points: [],
    questions: [],
    comingSoon: true
  },
  // Add more chapters as needed
];

const CBSE10Page = () => {
  return (
    <div className="learn-page cbse10-maths-page">
      <h1 style={{ textAlign: 'center', margin: '32px 0 16px 0', fontWeight: 700, fontSize: 32 }}>CBSE 10th - Maths</h1>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
        <div className="cbse10-section-btn active">Maths</div>
        <div className="cbse10-section-btn coming-soon">Computer <span style={{ fontSize: 13, color: '#888' }}>(Coming soon...)</span></div>
      </div>
      <div className="cbse10-chapters-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {mathsChapters.map((ch, idx) => (
          <div key={ch.number} className="cbse10-chapter-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: 370, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>Chap-{ch.number}. {ch.name}</h2>
            {ch.comingSoon ? (
              <div style={{ color: '#888', fontWeight: 500, fontSize: 17, margin: '18px 0' }}>Coming soon...</div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <strong>Key Points:</strong>
                  <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                    {ch.points.map((pt, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Previous Year Questions & Answers:</strong>
                  <div style={{ marginTop: 8 }}>
                    {ch.questions.map((q, i) => (
                      <div key={i} style={{ background: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontWeight: 500, color: '#007bff', marginBottom: 4 }}>{q.type}</div>
                        <div style={{ fontWeight: 500 }}>{q.q}</div>
                        <div style={{ color: '#388e3c', marginTop: 4 }}><strong>Answer:</strong> {q.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CBSE10Page; 