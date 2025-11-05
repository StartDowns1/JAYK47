import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// DecryptedText Component
function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i)
        }));
        const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }
        let charIndex = 0;
        return positions
          .map(p => {
            if (p.isSpace) return ' ';
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join('');
      } else {
        return originalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices(prevRevealed => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false)
        }
      : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }} {...hoverProps} {...props}>
      {displayText.split('').map((char, index) => {
        const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;
        return (
          <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
            {char}
          </span>
        );
      })}
    </motion.span>
  );
}

// SequentialTextCursor Component
function SequentialTextCursor({
  spacing = 100,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 8
}) {
  const [trail, setTrail] = useState([]);
  const containerRef = useRef(null);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);
  const letterIndex = useRef(0);
  const letters = ['J', 'A', 'Y', 'K'];

  const handleMouseMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTrail(prev => {
      let newTrail = [...prev];
      if (newTrail.length === 0) {
        const currentLetter = letters[letterIndex.current % letters.length];
        letterIndex.current++;
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          letter: currentLetter
        });
      } else {
        const last = newTrail[newTrail.length - 1];
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= spacing) {
          const steps = Math.floor(distance / spacing);
          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance;
            const newX = last.x + dx * t;
            const newY = last.y + dy * t;
            const currentLetter = letters[letterIndex.current % letters.length];
            letterIndex.current++;
            newTrail.push({
              id: idCounter.current++,
              x: newX,
              y: newY,
              letter: currentLetter
            });
          }
        }
      }
      if (newTrail.length > maxPoints) {
        newTrail = newTrail.slice(newTrail.length - maxPoints);
      }
      return newTrail;
    });
    lastMoveTimeRef.current = Date.now();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <AnimatePresence>
          {trail.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ opacity: { duration: exitDuration, ease: 'easeOut' } }}
              style={{ 
                position: 'absolute', 
                left: item.x, 
                top: item.y, 
                userSelect: 'none', 
                whiteSpace: 'nowrap', 
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#DC0000',
                textShadow: '0 0 20px rgba(220, 0, 0, 0.8), 0 0 40px rgba(220, 0, 0, 0.5)',
                filter: 'drop-shadow(0 0 10px rgba(220, 0, 0, 0.9))'
              }}
            >
              {item.letter}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// BubbleMenu Component
function BubbleMenu({ items, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (e, page) => {
    e.preventDefault();
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="fixed top-8 right-8 w-16 h-16 rounded-none flex flex-col items-center justify-center border-2 cursor-pointer z-50 transition-all duration-300"
        style={{
          background: '#000',
          borderColor: '#DC0000',
          boxShadow: '0 0 20px rgba(220, 0, 0, 0.5), inset 0 0 10px rgba(220, 0, 0, 0.2)'
        }}
        onClick={handleToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#DC0000';
          e.currentTarget.style.borderColor = '#fff';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(220, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#000';
          e.currentTarget.style.borderColor = '#DC0000';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 0, 0, 0.5), inset 0 0 10px rgba(220, 0, 0, 0.2)';
        }}
      >
        <span className={`w-8 h-0.5 bg-white rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`w-8 h-0.5 bg-white rounded mt-2 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-40"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
          >
            <div className="flex flex-col gap-8 p-6">
              {items.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.page)}
                  initial={{ scale: 0, opacity: 0, x: -100 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0, opacity: 0, x: 100 }}
                  transition={{ 
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                  className="px-20 py-8 text-6xl font-black rounded-none text-white border-4 flex items-center justify-center transition-all duration-300 no-underline"
                  style={{
                    backgroundColor: '#000',
                    borderColor: '#DC0000',
                    boxShadow: '0 0 30px rgba(220, 0, 0, 0.6)',
                    letterSpacing: '0.1em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = '#DC0000';
                    e.currentTarget.style.borderColor = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 50px rgba(220, 0, 0, 1), inset 0 0 20px rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#000';
                    e.currentTarget.style.borderColor = '#DC0000';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(220, 0, 0, 0.6)';
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const menuItems = [
    { label: 'HOME', href: '#home', page: 'home' },
    { label: 'MUSIC', href: '#music', page: 'music' },
    { label: 'CONTACT', href: '#contact', page: 'contact' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <SequentialTextCursor spacing={80} maxPoints={15} />
            <button
              onClick={() => setCurrentPage('home')}
              className="text-white text-9xl font-black tracking-wider cursor-pointer bg-transparent border-8 px-16 py-8 z-10 transition-all duration-300"
              style={{
                borderColor: '#DC0000',
                textShadow: '0 0 30px rgba(220, 0, 0, 0.8), 0 0 60px rgba(220, 0, 0, 0.5)',
                boxShadow: '0 0 40px rgba(220, 0, 0, 0.6), inset 0 0 30px rgba(220, 0, 0, 0.2)',
                letterSpacing: '0.15em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#DC0000';
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(220, 0, 0, 1), inset 0 0 40px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#DC0000';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(220, 0, 0, 0.6), inset 0 0 30px rgba(220, 0, 0, 0.2)';
              }}
            >
              <DecryptedText text="ENTER" animateOn="hover" speed={25} maxIterations={50} />
            </button>
          </div>
        );

      case 'home':
        return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} />
            <div className="flex items-center justify-center gap-6">
              {['J', 'A', 'Y', 'K'].map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: i * 0.15,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15
                  }}
                  className="inline-block px-10 py-8 border-4"
                  style={{
                    fontSize: '9rem',
                    fontWeight: '900',
                    color: '#fff',
                    background: '#000',
                    borderColor: '#DC0000',
                    boxShadow: '0 0 40px rgba(220, 0, 0, 0.8), inset 0 0 30px rgba(220, 0, 0, 0.3)',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 20px rgba(220, 0, 0, 0.8)'
                  }}
                >
                  <DecryptedText
                    text={letter}
                    animateOn="view"
                    speed={35}
                    maxIterations={25}
                    sequential={true}
                    revealDirection="center"
                  />
                </motion.span>
              ))}
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} />
            <a
              href="https://open.spotify.com/artist/5yci4gTmKIa4MnuhRQqtJn?si=9857dbdc1de74376"
              target="_blank"
              rel="noopener noreferrer"
              className="text-7xl font-black cursor-pointer no-underline z-10 px-20 py-10 border-4"
              style={{
                color: '#fff',
                background: '#000',
                borderColor: '#DC0000',
                boxShadow: '0 0 50px rgba(220, 0, 0, 0.8), inset 0 0 30px rgba(220, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.1em',
                textShadow: '0 0 20px rgba(220, 0, 0, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#DC0000';
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.boxShadow = '0 0 70px rgba(220, 0, 0, 1), inset 0 0 40px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#000';
                e.currentTarget.style.borderColor = '#DC0000';
                e.currentTarget.style.boxShadow = '0 0 50px rgba(220, 0, 0, 0.8), inset 0 0 30px rgba(220, 0, 0, 0.3)';
              }}
            >
              <DecryptedText
                text="LISTEN ON SPOTIFY"
                animateOn="both"
                speed={20}
                maxIterations={30}
                sequential={true}
                revealDirection="center"
              />
            </a>
          </div>
        );

      case 'contact':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden p-8">
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
              <div className="text-7xl font-black mb-12 px-16 py-8 border-4 inline-block pointer-events-auto"
                style={{
                  color: '#fff',
                  background: '#000',
                  borderColor: '#DC0000',
                  boxShadow: '0 0 50px rgba(220, 0, 0, 0.8), inset 0 0 30px rgba(220, 0, 0, 0.3)',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 20px rgba(220, 0, 0, 0.8)'
                }}
              >
                <DecryptedText
                  text="GET IN TOUCH"
                  animateOn="view"
                  speed={25}
                  maxIterations={40}
                  sequential={true}
                />
              </div>
              
              <a
                href="mailto:JAYK47MGMT@GMAIL.COM"
                className="text-4xl font-bold transition-all duration-300 no-underline inline-block px-12 py-6 border-4 pointer-events-auto"
                style={{
                  color: '#fff',
                  background: '#000',
                  borderColor: '#DC0000',
                  boxShadow: '0 0 30px rgba(220, 0, 0, 0.6), inset 0 0 20px rgba(220, 0, 0, 0.2)',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = '#DC0000';
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(220, 0, 0, 1), inset 0 0 30px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.borderColor = '#DC0000';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(220, 0, 0, 0.6), inset 0 0 20px rgba(220, 0, 0, 0.2)';
                }}
              >
                <DecryptedText
                  text="JAYK47MGMT@GMAIL.COM"
                  animateOn="hover"
                  speed={15}
                  maxIterations={35}
                />
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-screen overflow-hidden">{renderPage()}</div>;
}
