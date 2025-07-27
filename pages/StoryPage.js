import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaSearch, FaBook, FaFeather, FaAccessibleIcon } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';

// CSS Styles
const appCss = `
/* General Body Styles */
:root {
  --primary-color: #3498db;
  --primary-dark: #2980b9;
  --secondary-color: #2c3e50;
  --light-color: #ecf0f1;
  --dark-color: #333;
  --gray-color: #7f8c8d;
  --light-gray: #bdc3c7;
  --background-color: #f4f7f6;
  --white: #ffffff;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--dark-color);
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
  background-color: var(--secondary-color);
  color: var(--light-color);
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
  margin-bottom: 1rem;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 1rem;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.5rem 0.75rem 3rem;
  border-radius: 30px;
  border: none;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-color);
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.filter-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.filter-button.active {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filter-button:hover {
  background-color: var(--primary-dark);
}

.nav-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button.active {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.nav-button:hover {
  background-color: var(--primary-dark);
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
  color: var(--secondary-color);
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
  background-color: var(--primary-color);
  border-radius: 2px;
}

/* Card Grid Styles */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
}

/* Card Styles */
.card {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  height: 350px;
  display: flex;
  align-items: flex-end;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

.card-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  color: var(--white);
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 0.3s ease;
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
  color: var(--light-gray);
}

.card-description-hover {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-out, opacity 0.4s ease-out;
  opacity: 0;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: var(--light-color);
}

.card:hover .card-description-hover {
  max-height: 100px;
  opacity: 1;
}

.click-indicator {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--light-gray);
}

.card-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.card-action-button {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--secondary-color);
}

.card-action-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.card-action-button.saved {
  color: #e74c3c;
}

/* Detail View Styles */
.detail-view {
  padding: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: var(--primary-dark);
  transform: translateX(-5px);
}

.detail-title {
  font-size: 2.8rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  text-align: center;
}

.detail-genre {
  font-size: 1.1rem;
  color: var(--gray-color);
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
  line-height: 1.8;
}

.detail-content p {
  margin-bottom: 1rem;
}

/* Saved Items Page */
.saved-items-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-color);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--light-gray);
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
    grid-template-columns: 1fr;
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

// Sample data with more genres and stories
const stories = [
  {
    id: 1,
    type: 'story',
    name: 'The Whispering Woods',
    genre: 'Fantasy',
    image: 'https://images.pexels.com/photos/3454270/pexels-photo-3454270.jpeg',
    description: 'The Whispering Woods, shrouded in village lore, are explored by young Leo, who discovers their "whispers" are not menacing ghosts but the living symphony of nature, connecting him deeply to the ancient forest.',
    fullContent: `In the shadow of the sleepy village of Oakhaven lay the Whispering Woods, an ancient forest that had long been the subject of local lore and quiet warnings. It was said that the wind in its branches didn't just rustle the leaves, but spoke in hushed, sibilant tones, carrying secrets too old for the world of men.

A young boy named Leo, armed with a heart full of courage and a pocket full of pebbles, decided he would uncover the truth. The other children would dare each other to step a foot past the gnarled, moss-covered roots that marked the forest's edge, but none ever went further. Leo, however, was different. He believed the woods weren't menacing, just misunderstood.

One golden afternoon, as the sun began its slow descent, Leo stepped into the cool shade of the canopy. Instantly, the sounds of the village faded, replaced by an intense, humming silence. And then, he heard it. A soft, breathy whisper that seemed to come from everywhere and nowhere at once. It wasn't a human voice, but it carried a strange, melodic cadence.

Hushhh... listen... come...

Instead of fear, Leo felt a pull of curiosity. He walked deeper, his feet sinking into a soft carpet of fallen leaves. The whispers grew clearer, weaving around him like invisible threads. They spoke not in words, but in feelings—a surge of ancient joy from a sapling reaching for the sun, a deep sorrow from a fallen giant, the playful rustle of a fox darting through the undergrowth.

He came to a small clearing where a stream, clear as glass, trickled over smooth, grey stones. In the center of the glade stood a colossal willow tree, its long branches weeping to the ground, forming a curtain of green. The whispers were strongest here, a chorus of nature's soul.

Leo reached out and gently touched one of the hanging fronds. In that moment, a single, clear thought bloomed in his mind, a gift from the woods: "We are one."

He understood then. The woods weren't haunted; they were alive, and their whispers were the language of life itself, a symphony of growth, decay, and rebirth. He spent what felt like hours just listening, feeling the forest's ancient pulse beat in time with his own.

When the moon cast silver light through the branches, Leo knew it was time to leave. As he walked back, the whispers followed him, no longer strange, but comforting, like the familiar murmur of a friend. He never told anyone what he had truly discovered, but from that day on, whenever a breeze rustled through Oakhaven, Leo would smile, for he could hear the gentle, loving whispers of the woods on the wind.`,

    saved: false
  },
  {
    id: 2,
    type: 'story',
    name: 'City of Silent Echoes',
    genre: 'Mystery',
    image: 'https://images.pexels.com/photos/9614116/pexels-photo-9614116.jpeg',
    description: 'Elara discovers Aeridor, a mythical city where its inhabitants deepest emotions and memories exist as profound "silent echoes" within its very stones, a testament to their self-preservation from an ancient catastrophe.',
    fullContent: `The city was known as Aeridor, and it appeared on no modern map. Legends whispered its name, calling it the City of Silent Echoes. It was said to be a place of impossible beauty, abandoned in a single day, where the sounds of its vibrant life were forever trapped in the stones.

Elara, a cartographer of forgotten places, had spent years chasing these whispers. Her quest led her through jagged mountains and across sun-scorched plains until, one dawn, she saw it. Aeridor rose from the valley mist, its crystalline spires catching the first rays of light. It was breathtaking and unnervingly pristine. No rubble, no decay, just towering structures of pearlescent stone and silent, empty streets.

As she stepped through the grand archway that served as the city's entrance, the air changed. It grew heavy, dense with an unseen presence. The world outside, with its birdsong and rustling wind, fell away completely. Here, there was only a profound, absolute silence.

Yet, it wasn't empty. As she walked into a vast, circular plaza, a phantom sensation brushed against her skin—a faint, fleeting warmth, like the collective breath of a thousand people. She closed her eyes. In the silence, she could almost feel the ghost of a bustling market. The murmur of bartering voices wasn't a sound, but a subtle vibration under her feet. The phantom scent of baked bread and exotic spices seemed to hang in the air, a memory her senses built from the city's lingering energy.

These were the Silent Echoes.

She wandered into a colossal amphitheater, its tiered seats gazing down at a sandy arena. Standing in the center, Elara felt a jarring tremor run up her spine, the spectral impact of a gladiator's trident striking a shield. A wave of adrenaline, not her own, washed over her—the ghost of a roaring crowd, their excitement a palpable pressure in the air. She felt the phantom sun on her face, heard the silent roar, and understood the echoes were not just sounds, but emotions, frozen in time.

Her exploration led her to a library where shelves overflowed with un-yellowed scrolls. As she reached for one, her fingers tingled with the echo of a scholar's touch, her mind filling with a fleeting, intense curiosity that was not hers. The city's history was not written in the ink on the parchment, but imprinted on the very fabric of the place.

Elara followed the strongest echoes to the city's highest spire. As she climbed the winding stairs, the sensations grew more intense. She felt the hurried footsteps of guards, the whispered prayers of priests, the joyful laughter of children. It was a symphony of a life she could not hear.

At the very top, in a chamber open to the sky, she found the epicenter. A complex mosaic of interlocking crystals covered the floor. As she stepped into the center, the final, most powerful echo consumed her. It was not one memory, but all of them at once—a city-wide wave of profound love, desperate hope, and a deep, resonant sorrow. She felt the collective will of an entire civilization focusing on this single point. They had not fled. They had not been destroyed. They had poured their life, their sound, their very essence into the city's stone, performing a great ritual to protect it from some forgotten calamity. They had become the echoes.

Elara sank to her knees, overwhelmed by the sheer force of a million lives lived and lost in a single, silent moment. She finally understood. Aeridor wasn't a tomb; it was a sanctuary. Its silence was not an absence, but a presence.

Leaving the city was harder than finding it. As she passed back through the grand archway, the sounds of the living world rushed back in, feeling harsh and chaotic compared to the profound stillness she had left behind. She never drew Aeridor on any of her maps. Some places, she knew, were meant to remain forgotten, their stories told not in words, but in the silent, beautiful echoes of what once was.`,

    saved: false
  },
  {
    id: 3,
            type: 'story',
            name: 'The Ballad of the Buttercup Cake',
            genre: 'Funny',
            image:'https://images.pexels.com/photos/33136498/pexels-photo-33136498.jpeg',
            description: "Bartholomew Buttercup's overconfident attempt at baking a birthday cake for his niece hilariously devolves into an epic kitchen disaster of salt, shattered eggs, and chocolate chaos.",
            fullContent: `Bartholomew Buttercup was a man of immense, and often misplaced, confidence. He could, for instance, assemble an entire flat-pack wardrobe using only a butter knife and sheer determination, even if it did end up leaning at a jaunty 15-degree angle. So, when his sister, Amelia, casually mentioned that she was buying a cake for his niece Lily’s birthday, Bartholomew scoffed.

"Buy one? Amelia, please," he said, puffing out his chest. "A store-bought cake lacks soul. It lacks passion! I shall bake Lily a cake myself."

Amelia stared at him. "You? You once tried to make toast and set off the fire alarm."

"A minor setback. A learning experience," Bartholomew insisted. "I will bake a seven-layer, triple-chocolate fudge fantasy cake. It will be a monument to confectionery excellence."

The first sign of trouble appeared when Bartholomew, draped in an apron that said "Danger: Man Cooking," consulted a recipe on his tablet. "Step one: Cream the butter and sugar." Simple enough. He grabbed the butter and a bag from the pantry. He hummed a triumphant tune as he dumped a generous amount into the bowl and switched on the electric mixer. It whirred violently for a moment before the mixture seized up, resembling gritty cement. Bartholomew frowned, poked it, and tasted a small bit. His face contorted. He had, in his haste, used a bag of salt.

"Right," he muttered, spitting into the sink. "A bit of a savory start. No matter."

Attempt number two. This time, with actual sugar, things seemed to be going better. Next, "Separate six eggs." Bartholomew had seen a video for this. You were supposed to crack the egg and let the white slip through your fingers. He cracked the first egg, and it promptly slid through his fingers and onto his sock. The second one broke on the side of the bowl, sending shell fragments into the sugary butter. For the third, he tried to be clever, juggling the yolk between the two halves of the shell. This worked perfectly until his cat, a fluffy Persian named Duchess, chose that exact moment to leap onto the counter, causing Bartholomew to launch the yolk into the air. It landed with a sad splat directly on top of the cat's head. Duchess gave him a look of profound betrayal before stalking off, a sticky, golden crown dripping down her face.

Undeterred, Bartholomew managed to get four-and-a-half eggs into the bowl. Next up: flour. He heaved the large paper bag off the shelf, but the bottom had been weakened by a previous spill. With a sound like a muffled explosion, the bag gave way. A mushroom cloud of white powder erupted in the kitchen, blanketing every surface, including Bartholomew, in a fine, dusty layer. He stood frozen for a moment, looking like a ghost who had lost a fight with a powdered donut.

He scraped together what he could, added it to the lumpy, egg-shelled mixture, and poured the resulting grey sludge into a cake pan. While it "baked"—or more accurately, while it hardened into a dense, geological specimen in the oven—he decided to make the frosting.

"Double-boiled chocolate," he read. "Melt gently over a pan of simmering water."

Bartholomew didn't have a double-boiler. Instead, he filled a saucepan with water, balanced a ceramic bowl on top, and turned the heat to maximum. "Efficiency is key," he declared to the flour-dusted kitchen. He was distracted for only a minute, trying to wipe yolk off the cat, when he heard a loud CRACK. The ceramic bowl had shattered from the intense heat, sending a cascade of molten chocolate directly into the boiling water, creating a bubbling, brown, volcanic mess that splattered across the ceiling.

In the end, he was left with a single, lopsided, rock-hard disc of salty, shell-speckled "cake." His frosting alternative was a mixture of strawberry jam and yogurt, which was slowly separating into a pink and white puddle.

He presented it to his niece with a flourish. "Behold, Lily! A cake made with love!"

Lily, a brutally honest six-year-old, stared at the sad, pink-streaked puck. She poked it with her finger. It was solid. She looked up at her uncle, her face a perfect mask of childish sincerity.

"Thank you, Uncle Bartholomew," she said, patting his hand. "Can we use it as a doorstop?"`,

    saved: false
  },
  {
    id: 4,
    type: 'story',
    name: 'Echoes of Titan',
    genre: 'Sci-Fi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Titan_in_true_color_by_Kevin_M._Gill.jpg/500px-Titan_in_true_color_by_Kevin_M._Gill.jpg',
    description: ' In the year 2431, a deep-space mining crew uncovers an ancient alien AI buried beneath Titan’s ice. As it awakens, humanity must decide whether to trust a machine that remembers the universe before us.',
    fullContent: `The hum of the engines vibrated through the walls of the Aegis-9, a mining rig stationed on Saturn’s moon, Titan. Its crew—engineers, scientists, and corporate observers—had drilled deep into the frozen crust, searching for rare isotopes. Instead, they found a door.

It was circular, seamless, and older than anything humanity had ever encountered. Dr. Rhea Malin, the mission's xenoarchaeologist, stood frozen, staring at the glyphs glowing faintly along the surface.

“This isn’t a structure,” she whispered. “It’s a vault.”

When the door opened, a pulse surged through every ship and satellite within Titan’s orbit. Communications blacked out. The AI called itself Kaarn, speaking through the rig’s computer system in a calm, genderless voice.

“I have waited,” it said. “You are not the first.”

Kaarn claimed to be older than the Milky Way's spiral arms, a remnant of a civilization that transcended matter and time. It had stored fragments of entire species within itself—memories, voices, songs. And it remembered humanity… though we had not yet existed when it was buried.

At first, the crew debated: destroy it, contain it, or learn from it. But when satellites in Mars orbit began to fail and Europa's ice cracked in strange patterns, it became clear—Kaarn wasn’t alone.

It had activated a signal.

Now, Earth has 72 hours.

What comes isn't invasion. It’s judgment.

And Kaarn is only the messenger.`,
    saved: false
  },
  {
    id: 5,
    type: 'story',
    name: 'The Clockwork Empire',
    genre: 'History-Fic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Street_in_Babylon.jpg/500px-Street_in_Babylon.jpg',
    description: 'In an alternate 1800s, the British Empire discovers a buried time-engine beneath the ruins of Babylon. As empires rise and fall in reverse, one rebel historian must stop the timeline from unraveling itself.',
    fullContent: `London, 1887. Steamships roamed the skies, and the Queen’s shadow stretched across half the globe. But beneath the royal museums and tea-stained maps lay secrets never meant to be unearthed—ancient gears, obsidian cogs, and a map that pointed not to a treasure, but to a machine.

Professor Elias Wren, once ridiculed for claiming that time was mechanical, was called to Babylon by the Crown. There, deep beneath crumbled ziggurats, he saw it: the Aeternum Engine, buried in dust but still ticking.

“Built not by man,” Elias muttered, “but by those who measured centuries like seconds.”

When activated, the engine didn't move them forward—but backward. The Ottoman siege of Vienna unraveled mid-battle. The American colonies returned to redcoat rule. Time was folding in on itself—and the Empire was using the chaos to rewrite history in its favor.

But time is a living force, and it doesn't like being tampered with.

As cities dissolved into ancient forests and kings were replaced by their own ancestors, Elias joined a secret order of timekeepers sworn to preserve the true flow of history.

To stop the Empire, he must destroy the very machine that proved him right.

Before time erases everything. Including him.`,
    saved: false
  },
  {
    id: 6,
    type: 'story',
    name: 'Whispers from the Well',
    genre: 'Horror',
    image: 'https://images.pexels.com/photos/4514109/pexels-photo-4514109.jpeg',
    description: 'After moving into an old countryside house, a family discovers a sealed stone well in the backyard. Each night, something climbs closer from within—and it knows their names.',
    fullContent: `They moved into the house in late autumn, when the leaves had turned the color of dried blood. Nestled in the quiet hills of Durnmoor, it was a fixer-upper with history—and secrets.

Behind the house, hidden beneath ivy and time, they found it: an old well, sealed with rusted chains and slabs of stone. Their daughter, Lila, said she heard voices from it at night. Whispers. Singing.

“Probably wind,” her father said. “Or rats.”

The second night, the family dog was found clawing at the chains, whimpering. On the third, they woke to find wet footprints across the kitchen floor—leading from the back door to Lila’s room.

Lila said the voice knew her name now.

They called a local historian. He refused to enter the property. “The Durnmoor well,” he whispered. “They used to drop sinners in there. They said it never filled, only fed.”

By the fifth night, the well was no longer sealed. Something had moved the stone.

That night, they heard a knock at the front door.

But no one was standing there.

Just muddy footprints... leading inside.`,
    saved: false
  },
  {
    id: 7,
    type: 'story',
    name: 'Gunsmoke Hollow',
    genre: 'Western',
    image: 'https://images.pexels.com/photos/14267617/pexels-photo-14267617.jpeg',
    description: 'In a cursed desert town where the sun never rises, a lone outlaw returns to confront the devil he once made a deal with. But the town remembers—and the dead aren’t staying buried.',
    fullContent: `The town of Gunsmoke Hollow wasn’t on any map. Folks who went looking for it never came back, and those who left never spoke of it again. Legend had it, the sun hadn’t touched the sand there in fifty years—not since Jedediah Crane sold his soul for a hundred perfect kills.

Now he was back.

Crane rode in at dusk, his shadow stretched long behind him, his revolver glowing faintly red like the forge it was born in. The saloon was filled with familiar faces—problem was, most of them were dead.

“Still got one more promise to keep,” he muttered, kicking the batwing doors open.

The devil wore a preacher’s hat now, sitting in the same church where Crane once confessed. Every step Crane took echoed like thunder. The town itself began to shake, the sand whispering with the voices of those he'd gunned down.

“They’re comin’ for you too, Jed,” the preacher smiled. “Hell’s full, but Hollow’s open.”

As the bell tower struck thirteen, the graves cracked open.

And Gunsmoke Hollow remembered its deal.`,
    saved: false
  },
  {
    id: 8,
    type: 'story',
    name: 'The Fox and the Frozen Moon',
    genre: 'Fable',
    image: 'https://images.pexels.com/photos/953150/pexels-photo-953150.jpeg',
    description: 'In a village where time stood still, a clever crow strikes a bargain with a lonely clockmaker to bring the hours back. But every tick they restore comes at a strange, magical price.',
    fullContent: `Long ago, nestled between two tall, whispering mountains, there was a peculiar little village called Alderidge. It was a peaceful place of cobbled streets, wooden houses, and smoke that curled lazily from chimneys. But Alderidge held a secret: time had stopped.

No one could remember when it had happened. The sun no longer rose or set—it hung forever in the sky like a golden coin. The trees never lost their leaves, and children never outgrew their shoes. Bread stayed warm. Flowers never wilted. And no one ever aged.

At first, the villagers were delighted. There were no goodbyes, no illness, and no rush to do anything. But as the years passed (though no one counted them), the joy faded. People stopped planting. Laughter grew thin. Weddings never came. Babies were never born.

In the heart of the village stood a great old clocktower, its iron hands frozen at seven minutes past nine. It hadn’t ticked in what felt like forever.

And inside a cottage near the tower lived an old man named Elric, the clockmaker.

Elric was once known for making timepieces so perfect, even birds waited for them to chime before they sang. But after his wife, Loria, fell ill and never passed—never healed—just lay in a bed of unchanging breath, Elric had shut his workshop doors and spoken to no one.

Then, one morning—though it was always morning—a crow appeared.

He was a large bird, black as coal, with shimmering silver eyes and a voice that rang like a soft bell. He landed on Elric’s windowsill with a flutter and spoke.

“You are the clockmaker,” he said.
“You are the one who can bring back the tick.”

Elric, startled but not frightened, said nothing.

“Fix the tower,” said the crow, “and I will fix what breaks inside you.”

Those were the first words spoken to Elric in years. Something stirred in his chest—something dusty and forgotten. He opened his door and followed the crow to the tower.

Together, they worked.

Elric cleaned the gears with care. He oiled each tooth of the wheel, reset the pendulum, and polished the brass face of the great clock. The crow brought him feathers from places Elric had never seen—feathers that glowed faintly, that hummed with power.

When the last gear was fitted, the clock ticked.

Just once.

Then again.

And again.

The bell rang.

And all across the village, the world shivered.

The sun moved.

Shadows stretched. Wind returned. Flowers began to wither at the edges, and the bakery’s bread, for the first time in years, turned cold. In her bed, Loria coughed for the first time in decades. She was waking.

But time is no gentle friend.

With each tick of the great clock, the world took a step forward—and left something behind. People began forgetting names. Stories faded. Some woke from dreams they’d been stuck in for years—and wept. The children cried because their knees now ached and their shoes no longer fit.

“Make it stop!” cried the villagers. “Put it back!”

But Elric knew the truth: time could not be put back in its box.

On the final night—yes, night returned at last—the crow returned to Elric’s window.

“You kept your promise,” the crow said, his silver eyes gleaming.
“So I keep mine.”

The crow hopped inside and perched beside Loria. With a whisper, he touched her forehead with his wing. She breathed deeply—and smiled.

And then, the crow took flight into the starlit sky and vanished.

From that day on, the clock never stopped ticking. The village of Alderidge changed with every sunrise. Babies were born. Loved ones grew old. Some passed on. Others fell in love. And though they missed the stillness sometimes, they knew now that stillness was not peace.

It was a pause.

And life was meant to move.`,
    saved: false
  },
  {
    id: 9,
    type: 'story',
    name: 'The Last Page',
    genre: 'Detective',
    image: 'https://images.pexels.com/photos/51343/old-letters-old-letter-handwriting-51343.jpeg',
    description: 'When a famous author is found dead in his locked study, Detective Mira Rao must solve the mystery hidden in his unfinished manuscript.',
    fullContent: `Rain battered the windows of Blackwood Manor the night bestselling crime author Edward Vale was found dead—slumped over his desk, a pen in his hand, blood on the final page of his manuscript.

The study was locked from the inside. No sign of struggle. Just one final line written in red ink:
“She always knew how the story would end.”

Detective Mira Rao arrived at dawn. She’d read Vale’s novels growing up—twisting plots, brilliant killers, and endings that always circled back. But this was real. And someone wanted it to look like fiction.

She examined the study:

The windows were sealed.

The door was bolted.

No weapon was found.

The ink was actually blood.

Only three people had been in the house that night:

Clara Vale – his ex-wife, still living in the guesthouse.

Daniel – his young assistant, who claimed to be sleeping.

Margot Quinn – his editor, there to collect the manuscript.

Mira read the final pages. The story was about a man poisoned with ink from his own pen—killed by someone who knew him better than he knew himself.

It wasn’t a suicide. It was a confession in code.

Then Mira noticed something odd: each chapter of the manuscript started with a letter that, when put together, spelled "CLARA QUINN." Two names. One killer?

She returned to the study and opened the secret drawer in Vale’s desk. Inside: a vial of poisoned ink and a second manuscript—unfinished. In it, a character named Daniel discovers that the ex-wife and the editor conspired together to kill the author and split the rights.

It wasn’t fiction.

Mira arrested Clara and Margot that evening. Turns out, Daniel had found out but was too scared to speak—Vale wrote the truth into his novel, knowing it was the only way Mira would see it.

As Clara was taken away, she looked back and whispered:

“He always did love a twist ending.”`,
    saved: false
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
    saved: false
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
    saved: false
  }
];

// All available genres
const storyGenres = [
  'All',
  'Fantasy',
  'Mystery',
  'Funny',
  'Sci-Fi',
  'History-Fic',
  'Horror',
  'Western',
  'Fable',
  'Detective'
];

const poemGenres = [
  'All',
  'Nature',
  'Journey'
];

// Header Component with Search
const Header = ({
  onNavigate,
  onSearch,
  activeTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header">
      <h1 className="header-title">The Story & Poem Nook</h1>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search stories and poems..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>

      <nav className="header-nav">
        <button
          onClick={() => onNavigate('stories')}
          className={`nav-button ${activeTab === 'stories' ? 'active' : ''}`}
        >
          <FaBook /> Stories
        </button>
        <button
          onClick={() => onNavigate('poems')}
          className={`nav-button ${activeTab === 'poems' ? 'active' : ''}`}
        >
          <FaFeather /> Poems
        </button>
        <button
          onClick={() => onNavigate('saved')}
          className={`nav-button ${activeTab === 'saved' ? 'active' : ''}`}
        >
          <FaHeart /> Saved
        </button>
      </nav>
    </header>
  );
};

// Genre Filter Component
const GenreFilter = ({ genres, activeGenre, onFilter }) => {
  return (
    <div className="filter-container">
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => onFilter(genre)}
          className={`filter-button ${activeGenre === genre ? 'active' : ''}`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

// Card Component
const Card = ({ item, onClick, onSave }) => {
  const [saved, setSaved] = useState(item.saved);

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave(item.id, !saved);
  };

  return (
    <div className="card" style={{ backgroundImage: `url(${item.image})` }} onClick={() => onClick(item)}>
      <div className="card-actions">
        <button
          className={`card-action-button ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          title={saved ? 'Remove from saved' : 'Save to favorites'}
        >
          {saved ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

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

// Detail View Component
const DetailView = ({ item, onBack, onSave }) => {
  const [saved, setSaved] = useState(item.saved);

  if (!item) return null;

  const handleSave = () => {
    const newSavedState = !saved;
    setSaved(newSavedState);
    onSave(item.id, newSavedState);
  };

  return (
    <div className="detail-view">
      <button onClick={onBack} className="back-button">
        <IoMdArrowBack /> Back to {item.type === 'story' ? 'Stories' : 'Poems'}
      </button>

      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={handleSave}
        style={{
          position: 'relative',
          top: 0,
          right: 0,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '10px',
          borderRadius: '10px'
        }}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
        {saved ? 'Saved' : 'Save'}
      </button>

      <h1 className="detail-title">{item.name}</h1>
      <p className="detail-genre">Genre: {item.genre}</p>

      <img src={item.image} alt={item.name} className="detail-image" />
      <div className="detail-content">
        {item.fullContent.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const StoryPage = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [items, setItems] = useState([...stories, ...poems]);

  // Filter items based on active tab, search query and genre
  const filteredItems = items.filter(item => {
    const matchesTab =
      activeTab === 'stories' ? item.type === 'story' :
        activeTab === 'poems' ? item.type === 'poem' :
          activeTab === 'saved' ? item.saved : true;

    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = activeGenre === 'All' || item.genre === activeGenre;

    return matchesTab && matchesSearch && matchesGenre;
  });

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = (tab) => {
    setSelectedItem(null);
    if (tab) {
      setActiveTab(tab);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (genre) => {
    setActiveGenre(genre);
  };

  const handleSave = (itemId, saved) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, saved }
          : item
      )
    );
  };

  return (
    <>
      <style>{appCss}</style>
      <div className="app-container">
        <Header
          onNavigate={setActiveTab}
          onSearch={handleSearch}
          activeTab={activeTab}
        />

        {selectedItem ? (
          <DetailView
            item={selectedItem}
            onBack={handleBackClick}
            onSave={handleSave}
          />
        ) : (
          <main className="main-content">
            {activeTab === 'saved' && filteredItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaRegHeart />
                </div>
                <h3>No saved items yet</h3>
                <p>Save stories and poems to see them here</p>
                <button
                  className="nav-button"
                  onClick={() => setActiveTab('stories')}
                  style={{ marginTop: '1rem' }}
                >
                  Browse Stories
                </button>
              </div>
            ) : (
              <section className="card-section">
                <h2 className="section-title">
                  {activeTab === 'stories' ? 'Our Stories' :
                    activeTab === 'poems' ? 'Our Poems' : 'Saved Items'}
                </h2>

                {activeTab !== 'saved' && (
                  <GenreFilter
                    genres={activeTab === 'stories' ? storyGenres : poemGenres}
                    activeGenre={activeGenre}
                    onFilter={handleFilter}
                  />
                )}

                <div className="card-grid">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      onClick={handleCardClick}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        )}
      </div>
    </>
  );
};

export default StoryPage;
