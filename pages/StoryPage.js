import React, { useState } from 'react';

// Define the CSS as a string
const appCss = `
/* General Body Styles */
body {
  margin: 0;
  padding: 0;
  background-color: #f4f7f6;
  color: #333;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.header {
  background-color: #2c3e50; /* Dark blue-grey */
  color: #ecf0f1; /* Light grey */
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-title {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.header-nav {
  display: flex;
  gap: 1rem;
}

.nav-button {
  background-color: #3498db; /* Blue */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px; /* Rounded corners */
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-button:hover {
  background-color: #2980b9; /* Darker blue on hover */
  transform: translateY(-2px);
}

/* Main Content Styles */
.main-content {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #3498db;
  border-radius: 2px;
}

/* Card Grid Styles */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch; /* Ensure cards stretch to fill row height */
}

/* Card Styles */
.card {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px; /* Rounded corners */
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  height: 350px; /* Fixed height for cards */
  display: flex;
  align-items: flex-end; /* Align overlay to bottom */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

.card-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  color: white;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: background 0.3s ease;
}

.card:hover .card-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 100%);
}

.card-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.card-genre {
  margin: 0;
  font-size: 1rem;
  color: #bdc3c7;
}

.card-description-hover {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out, opacity 0.4s ease-out;
  opacity: 0;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #ecf0f1;
}

.card:hover .card-description-hover {
  max-height: 100px; /* Adjust based on content */
  opacity: 1;
}

.click-indicator {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-style: italic;
  color: #95a5a6;
}

/* Detail View Styles */
.detail-view {
  padding: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: #2980b9;
  transform: translateX(-5px);
}

.detail-title {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.detail-genre {
  font-size: 1.1rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 1.5rem;
}

.detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-content {
  font-size: 1.1rem;
  color: #555;
  text-align: justify;
  margin-bottom: 2rem;
}

.detail-content p {
  margin-bottom: 1rem;
}

.audio-player-container {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #ecf0f1;
  border-radius: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.audio-player-container h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.audio-player {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: block;
}

.audio-note {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .nav-button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }

  .main-content {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .card-grid {
    grid-template-columns: 1fr; /* Stack cards on small screens */
  }

  .card {
    height: 300px;
  }

  .card-name {
    font-size: 1.5rem;
  }

  .card-genre {
    font-size: 0.9rem;
  }

  .detail-view {
    padding: 1.5rem;
    margin: 1rem auto;
  }

  .detail-title {
    font-size: 2rem;
  }

  .detail-genre {
    font-size: 1rem;
  }

  .detail-content {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 1.8rem;
  }

  .header-nav {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-button {
    width: 100%;
  }

  .main-content {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .detail-title {
    font-size: 1.8rem;
  }
}
`;

// Header Component
const Header = ({ onNavigate }) => {
  return (
    <header className="header">
      <h1 className="header-title">The Story & Poem Nook</h1>
      <nav className="header-nav">
        <button onClick={() => onNavigate('stories')} className="nav-button">Stories</button>
        <button onClick={() => onNavigate('poems')} className="nav-button">Poems</button>
      </nav>
    </header>
  );
};

// Card Component for Stories and Poems
const Card = ({ item, onClick }) => {
  return (
    <div className="card" style={{ backgroundImage: `url(${item.image})` }} onClick={() => onClick(item)}>
      <div className="card-overlay">
        <h2 className="card-name">{item.name}</h2>
        <p className="card-genre">Genre: {item.genre}</p>
        <div className="card-description-hover">
          <p>{item.description}</p>
          <span className="click-indicator">Click to read more!</span>
        </div>
      </div>
    </div>
  );
};

// Detail View Component for Full Story/Poem
const DetailView = ({ item, onBack }) => {
  if (!item) return null; // Don't render if no item is selected

  return (
    <div className="detail-view">
      <button onClick={onBack} className="back-button">← Back to {item.type === 'story' ? 'Stories' : 'Poems'}</button>
      <h1 className="detail-title">{item.name}</h1>
      <p className="detail-genre">Genre: {item.genre}</p>
      <img src={item.image} alt={item.name} className="detail-image" />
      <div className="detail-content">
        {item.fullContent.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {item.audioUrl && (
        <div className="audio-player-container">
          <h3>Listen to the full {item.type === 'story' ? 'story' : 'poem'}:</h3>
          <audio controls className="audio-player">
            <source src={item.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="audio-note">
            (Note: For a real application, replace the `src` with a valid audio file URL.
            Due to security restrictions, I cannot provide external audio files directly.)
          </p>
        </div>
      )}
    </div>
  );
};

// Main App Component (renamed to StoryPage)
const StoryPage = () => {
  const [activeTab, setActiveTab] = useState('stories'); // 'stories' or 'poems'
  const [selectedItem, setSelectedItem] = useState(null); // The story/poem currently being viewed in detail

  // Sample Data (replace with your actual content and image URLs)
  const stories = [
    {
      id: 1,
      type: 'story',
      name: 'The Whispering Woods',
      genre: 'Fantasy',
      image: 'https://images.pexels.com/photos/3454270/pexels-photo-3454270.jpeg',
      description: 'A young adventurer discovers ancient secrets hidden deep within an enchanted forest.',
      fullContent: `Elara had always been drawn to the Whispering Woods, a place shrouded in local legends and hushed warnings. They said the trees themselves spoke, their leaves rustling with forgotten tales. One crisp autumn morning, armed with a worn map and a heart full of curiosity, she ventured deeper than any villager dared.

The path soon vanished, replaced by a carpet of moss and gnarled roots. Sunlight dappled through the dense canopy, creating an ethereal glow. Suddenly, a faint melody, like wind chimes made of crystal, drifted through the air. It led her to a clearing where an ancient, colossal oak stood, its branches reaching towards the sky like arms.

As she approached, the whispers grew louder, not of wind, but of voices, soft and resonant. They spoke of a hidden spring, a source of immense magic, guarded by the spirit of the woods. Elara found a hidden crevice at the base of the oak, and within, a pool of shimmering, iridescent water. As she touched it, a surge of warmth enveloped her, and the woods seemed to hum with newfound life. She knew then that her adventure had only just begun.`,
      audioUrl: '' // Placeholder for audio URL
    },
    {
      id: 2,
      type: 'story',
      name: 'City of Silent Echoes',
      genre: 'Mystery',
      image: 'https://images.pexels.com/photos/9614116/pexels-photo-9614116.jpeg',
      description: 'A detective investigates a series of strange disappearances in a desolate, abandoned city.',
      fullContent: `Detective Miles Corbin arrived in Oakhaven, a city now synonymous with eerie silence. Once a bustling metropolis, it had been abandoned overnight, leaving behind only the ghosts of its former inhabitants and a chilling mystery. The first disappearance had been a week ago, followed by a dozen more, all without a trace.

The air was thick with an unsettling stillness, broken only by the creak of rusty signs and the distant howl of wind. Miles walked through empty streets, past shops with their doors ajar, and homes with lights still on, as if their occupants had simply vanished mid-sentence. His only lead was a recurring, faint echo that seemed to emanate from the city's forgotten clock tower.

He climbed the crumbling stairs of the tower, the echoes growing stronger, forming a disjointed chorus of whispers. At the top, he found no one, but a single, ancient gramophone playing a distorted, looping melody. As the final note faded, a hidden panel slid open, revealing a tunnel leading into the earth. The city's secret, and perhaps its inhabitants' fate, lay beneath.`,
      audioUrl: '' // Placeholder for audio URL
    }
  ];

  const poems = [
    {
      id: 101,
      type: 'poem',
      name: 'Ode to the Fading Light',
      genre: 'Nature',
      image: 'https://images.pexels.com/photos/2131841/pexels-photo-2131841.jpeg',
      description: 'A lyrical reflection on the beauty of twilight and the coming of night.',
      fullContent: `The sun dips low, a painter's final stroke,
Across the canvas of the western sky.
Hues of orange, purple, softly spoke,
As day's bright fervor starts to gently die.

A hush descends, the world begins to sigh,
The birds retreat, their evening chorus done.
Stars, like scattered dust, begin to lie,
Unfurling slowly, one by silent one.

The moon ascends, a pearl in velvet deep,
Casting silver on the sleeping land.
Secrets whispered while the shadows creep,
A silent promise, held within its hand.

So fades the light, a beauty bittersweet,
A gentle prelude to the dreams we meet.`,
      audioUrl: '' // Placeholder for audio URL
    },
    {
      id: 102,
      type: 'poem',
      name: 'The Wanderer\'s Path',
      genre: 'Journey',
      image: 'https://images.pexels.com/photos/1906879/pexels-photo-1906879.jpeg',
      description: 'A poem about the endless journey of life and self-discovery.',
      fullContent: `Through winding roads and mountains steep,
The wanderer walks, secrets to keep.
With every step, a lesson learned,
A new horizon, bravely earned.

The dust of ages on their shoes,
A spirit free, no time to lose.
From bustling towns to silent plains,
They seek the truth that life sustains.

The wind their guide, the stars their light,
They journey on, through day and night.
For in the quest, the soul takes flight,
And finds its purpose, shining bright.`,
      audioUrl: '' // Placeholder for audio URL
    }
  ];

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    setSelectedItem(null);
  };

  return (
    <>
      {/* Embed CSS directly into the component's render output */}
      <style>{appCss}</style>
      <div className="app-container">
        <Header onNavigate={setActiveTab} />

        {selectedItem ? (
          <DetailView item={selectedItem} onBack={handleBackClick} />
        ) : (
          <main className="main-content">
            <section className="card-section">
              <h2 className="section-title">{activeTab === 'stories' ? 'Our Stories' : 'Our Poems'}</h2>
              <div className="card-grid">
                {(activeTab === 'stories' ? stories : poems).map((item) => (
                  <Card key={item.id} item={item} onClick={handleCardClick} />
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
};

export default StoryPage;