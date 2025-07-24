import React from 'react';
import './AboutPage.css';

const socials = [
  { name: 'Instagram', url: 'https://instagram.com/fasty_codes', icon: 'fab fa-instagram' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/cuchco', icon: 'fab fa-linkedin' },
  { name: 'GitHub', url: 'https://github.com/Fasty-codes', icon: 'fab fa-github' },
  { name: 'YouTube (Dona Editz)', url: 'https://youtube.com/@dona_editz_2.0', icon: 'fab fa-youtube' },
  { name: 'YouTube (CuberA)', url: 'https://youtube.com/@cuberA_2.0', icon: 'fab fa-youtube' },
];

const AboutPage = () => (
  <div className="about-root">
    <div className="about-card">
      <h1 className="about-title">About Cuchco</h1>
      <p className="about-desc">
        Cuchco is your all-in-one platform for learning, playing, and mastering Chess, Cubing, and Coding. Built with ❤️ by Steve Sam and contributors.<br/><br/>
        Enjoy AI opponents, timers, leaderboards, and a vibrant community!
      </p>
      <div className="about-team-row">
        <div className="about-team-member">
          <i className="fa fa-user-circle about-team-icon"></i>
          <div className="about-team-name">Steve</div>
          <div className="about-team-role">CEO</div>
        </div>
        <div className="about-team-member">
          <i className="fa fa-user-circle about-team-icon"></i>
          <div className="about-team-name">Aadhidev Anil</div>
          <div className="about-team-role">Boss</div>
        </div>
        <div className="about-team-member">
          <i className="fa fa-user-circle about-team-icon"></i>
          <div className="about-team-name">Abel Manoj</div>
          <div className="about-team-role">Manager</div>
        </div>
      </div>
      <div className="about-socials">
        {socials.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="about-social-link" title={s.name}>
            <i className={s.icon}></i>
          </a>
        ))}
      </div>
      <div className="about-copyright">
        &copy; {new Date().getFullYear()} Cuchco. All rights reserved.
      </div>
    </div>
  </div>
);

export default AboutPage; 