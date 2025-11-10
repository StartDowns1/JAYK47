import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Color themes
const themes = {
  pastelBlue: {
    name: 'Pastel Blue',
    primary: '#B3D9FF',
    secondary: '#F0F8FF',
    text: '#003366',
    border: '#B3D9FF',
    shadow: 'rgba(179, 217, 255, 0.6)',
    glow: 'rgba(179, 217, 255, 0.4)',
    gradient: 'linear-gradient(145deg, #B3D9FF, #CCE5FF)',
  },
  pastelPink: {
    name: 'Pastel Pink',
    primary: '#FFB3D9',
    secondary: '#FFF0F7',
    text: '#660033',
    border: '#FFB3D9',
    shadow: 'rgba(255, 179, 217, 0.6)',
    glow: 'rgba(255, 179, 217, 0.4)',
    gradient: 'linear-gradient(145deg, #FFB3D9, #FFCCE5)',
  },
  aggressiveRed: {
    name: 'Aggressive Red',
    primary: '#DC0000',
    secondary: '#000',
    text: '#fff',
    border: '#DC0000',
    shadow: 'rgba(220, 0, 0, 0.8)',
    glow: 'rgba(220, 0, 0, 0.5)',
    gradient: 'linear-gradient(145deg, #DC0000, #FF0000)',
  }
};

// Simple animated text component
function AnimatedText({ text, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: '900',
        color: theme.primary,
        textShadow: `0 0 20px ${theme.shadow}, 0 0 40px ${theme.glow}`,
        letterSpacing: '0.1em',
        fontFamily: "'Impact', 'Arial Black', sans-serif"
      }}
    >
      {text}
    </motion.div>
  );
}

// Animated letter component
function FlakeText({ text, theme, size = 120 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        fontSize: `${size}px`,
        fontWeight: '900',
        color: theme.text,
        textShadow: `0 0 20px ${theme.shadow}`,
        background: theme.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        padding: '10px',
        filter: `drop-shadow(0 0 15px ${theme.shadow})`
      }}
    >
      {text}
    </motion.div>
  );
}

// Theme Selector
function ThemeSelector({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const themeKeys = Object.keys(themes);

  return (
    <div style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 50 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `4px solid ${themes[currentTheme].border}`,
          background: themes[currentTheme].secondary,
          cursor: 'pointer',
          boxShadow: `0 0 20px ${themes[currentTheme].shadow}`
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: themes[currentTheme].gradient
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            borderRadius: '24px',
            border: '2px solid rgba(255,255,255,0.2)',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {themeKeys.map((key) => (
            <button
              key={key}
              onClick={() => {
                onThemeChange(key);
                setIsOpen(false);
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid ${currentTheme === key ? '#fff' : themes[key].border}`,
                background: themes[key].gradient,
                cursor: 'pointer',
                transform: currentTheme === key ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Menu Component
function BubbleMenu({ items, onNavigate, theme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${theme.border}`,
          background: theme.secondary,
          cursor: 'pointer',
          zIndex: 50,
          boxShadow: `0 0 20px ${theme.glow}`
        }}
      >
        <span
          style={{
            width: '32px',
            height: '2px',
            background: theme.text,
            transform: isOpen ? 'rotate(45deg) translateY(1px)' : 'none',
            transition: 'all 0.3s'
          }}
        />
        <span
          style={{
            width: '32px',
            height: '2px',
            background: theme.text,
            marginTop: '8px',
            transform: isOpen ? 'rotate(-45deg) translateY(-1px)' : 'none',
            transition: 'all 0.3s'
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.95)',
              zIndex: 40
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
              {items.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    onNavigate(item.page);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '32px 80px',
                    fontSize: '3rem',
                    fontWeight: '900',
                    borderRadius: '50px',
                    border: `4px solid ${theme.border}`,
                    background: theme.secondary,
                    color: theme.text,
                    cursor: 'pointer',
                    boxShadow: `0 0 30px ${theme.shadow}`,
                    letterSpacing: '0.1em',
                    fontFamily: "'Impact', 'Arial Black', sans-serif"
                  }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTheme, setCurrentTheme] = useState('pastelBlue');

  const theme = themes[currentTheme];

  const menuItems = [
    { label: 'HOME', page: 'home' },
    { label: 'MUSIC', page: 'music' },
    { label: 'CONTACT', page: 'contact' },
    { label: 'SNIPPETS', page: 'snippets' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div
            style={{
              width: '100%',
              height: '100vh',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: '900',
                padding: '48px 80px',
                borderRadius: '50px',
                border: `4px solid ${theme.border}`,
                background: theme.secondary,
                color: theme.text,
                cursor: 'pointer',
                letterSpacing: '0.2em',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                textShadow: `0 0 20px ${theme.shadow}`,
                boxShadow: `0 0 30px ${theme.shadow}`,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = theme.gradient;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = theme.secondary;
              }}
            >
              ENTER
            </button>
          </div>
        );

      case 'home':
        return (
          <div
            style={{
              width: '100%',
              height: '100vh',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '16px'
            }}
          >
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} theme={theme} />
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['J', 'A', 'Y', 'K'].map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 150, damping: 20 }}
                >
                  <FlakeText text={letter} theme={theme} size={140} />
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'music':
        return (
          <div
            style={{
              width: '100%',
              height: '100vh',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '16px'
            }}
          >
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} theme={theme} />
            <a
              href="https://open.spotify.com/artist/5yci4gTmKIa4MnuhRQqtJn?si=9857dbdc1de74376"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: '900',
                padding: '40px 80px',
                borderRadius: '50px',
                border: '4px solid #1db954',
                background: '#000',
                color: '#fff',
                textDecoration: 'none',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                textShadow: '0 0 20px rgba(29, 185, 84, 0.8)',
                boxShadow: '0 0 50px rgba(29, 185, 84, 0.8)',
                transition: 'all 0.5s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(145deg, #1db954, #1ed760)';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.borderColor = '#1db954';
              }}
            >
              LISTEN ON SPOTIFY
            </a>
          </div>
        );

      case 'contact':
        return (
          <div
            style={{
              width: '100%',
              height: '100vh',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '32px'
            }}
          >
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} theme={theme} />
            <div style={{ textAlign: 'center', maxWidth: '90vw' }}>
              <AnimatedText text="GET IN TOUCH" theme={theme} />
              <a
                href="mailto:JAYK47MGMT@GMAIL.COM"
                style={{
                  marginTop: '32px',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  padding: '24px 48px',
                  borderRadius: '50px',
                  border: `4px solid ${theme.border}`,
                  background: theme.secondary,
                  color: theme.text,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  boxShadow: `0 0 30px ${theme.shadow}`,
                  transition: 'all 0.5s',
                  display: 'inline-block',
                  wordBreak: 'break-all'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = theme.gradient;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = theme.secondary;
                }}
              >
                JAYK47MGMT@GMAIL.COM
              </a>
            </div>
          </div>
        );

      case 'snippets':
        return (
          <div
            style={{
              width: '100%',
              height: '100vh',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '16px'
            }}
          >
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} theme={theme} />
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 3rem)',
                  fontWeight: 'bold',
                  color: theme.primary,
                  textShadow: `0 0 20px ${theme.shadow}`,
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  letterSpacing: '0.1em',
                  marginBottom: '32px'
                }}
              >
                EXCLUSIVE CONTENT & BEHIND THE SCENES
              </p>
              <AnimatedText text="COMING SOON" theme={theme} />
              <p
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 2rem)',
                  fontWeight: 'bold',
                  color: theme.text,
                  textShadow: `0 0 15px ${theme.shadow}`,
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  marginTop: '16px'
                }}
              >
                NEW SNIPPETS DROPPING SOON
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>{renderPage()}</div>;
}
