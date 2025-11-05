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
                color: '#ff6b6b',
                textShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
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

// ChromaGrid Component
function ChromaGrid({ items, radius = 300, damping = 0.45, fadeOut = 0.6 }) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  const data = items || [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    targetPos.current = { x: width / 2, y: height / 2 };
  }, []);

  const animate = () => {
    const dx = targetPos.current.x - pos.current.x;
    const dy = targetPos.current.y - pos.current.y;
    pos.current.x += dx * (1 - damping);
    pos.current.y += dy * (1 - damping);
    
    if (rootRef.current) {
      rootRef.current.style.setProperty('--x', `${pos.current.x}px`);
      rootRef.current.style.setProperty('--y', `${pos.current.y}px`);
    }
    
    animationFrame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    targetPos.current.x = e.clientX - r.left;
    targetPos.current.y = e.clientY - r.top;
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '0';
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '1';
    }
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '2rem',
        '--x': '50%',
        '--y': '50%',
        '--r': `${radius}px`
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => c.url && window.open(c.url, '_blank', 'noopener,noreferrer')}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #333',
            background: c.gradient,
            cursor: c.url ? 'pointer' : 'default',
            transition: 'border-color 0.3s ease',
            '--mouse-x': '50%',
            '--mouse-y': '50%',
            '--card-border': c.borderColor || 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = c.borderColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#333';
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.15), transparent 70%)', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s' }} 
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          />
          <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
            <img src={c.image} alt={c.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <footer style={{ padding: '1.5rem', color: 'white' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{c.title}</h3>
            {c.handle && <span style={{ fontSize: '0.875rem', color: '#999' }}>{c.handle}</span>}
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>{c.subtitle}</p>
          </footer>
        </article>
      ))}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, rgba(0, 0, 0, 0.8) 100%)`, pointerEvents: 'none', transition: 'opacity 0.25s' }} />
      <div ref={fadeRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)', pointerEvents: 'none', transition: `opacity ${fadeOut}s` }} />
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
        className="fixed top-8 right-8 w-14 h-14 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-none cursor-pointer z-50"
        style={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
        }}
        onClick={handleToggle}
      >
        <span className={`w-7 h-0.5 bg-black rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
        <span className={`w-7 h-0.5 bg-black rounded mt-1.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-40"
            style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex flex-col gap-6 p-6">
              {items.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.page)}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    delay: idx * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }}
                  className="px-16 py-6 text-5xl font-bold rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 no-underline"
                  style={{
                    backgroundColor: item.hoverStyles?.bgColor || '#ff6b6b',
                    color: item.hoverStyles?.textColor || '#fff',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
    { label: 'HOME', href: '#home', page: 'home', hoverStyles: { bgColor: '#ff6b6b', textColor: '#ffffff' } },
    { label: 'MUSIC', href: '#music', page: 'music', hoverStyles: { bgColor: '#ff8787', textColor: '#ffffff' } },
    { label: 'CONTACT', href: '#contact', page: 'contact', hoverStyles: { bgColor: '#ffa5a5', textColor: '#ffffff' } }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <SequentialTextCursor spacing={80} maxPoints={12} />
            <button
              onClick={() => setCurrentPage('home')}
              className="text-white text-9xl font-black tracking-wider cursor-pointer bg-transparent border-none z-10"
              style={{
                textShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.color = '#ff6b6b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <DecryptedText text="ENTER" animateOn="hover" speed={30} maxIterations={40} />
            </button>
          </div>
        );

      case 'home':
        return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            <BubbleMenu items={menuItems} onNavigate={setCurrentPage} />
            <div className="flex items-center justify-center">
              {['J', 'A', 'Y', 'K'].map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="inline-block mx-4 px-8 py-6 rounded-3xl"
                  style={{
                    fontSize: '8rem',
                    fontWeight: '900',
                    color: '#fff',
                    background: 'linear-gradient(145deg, #ff6b6b, #ff8787)',
                    boxShadow: '0 20px 60px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <DecryptedText
                    text={letter}
                    animateOn="view"
                    speed={40}
                    maxIterations={20}
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
              className="text-7xl font-black cursor-pointer no-underline z-10 px-16 py-8 rounded-full"
              style={{
                color: '#fff',
                background: 'linear-gradient(145deg, #1db954, #1ed760)',
                boxShadow: '0 20px 60px rgba(29, 185, 84, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.5s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 30px 80px rgba(29, 185, 84, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(29, 185, 84, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
            >
              <DecryptedText
                text="LISTEN ON SPOTIFY"
                animateOn="both"
                speed={25}
                maxIterations={25}
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
            <div className="absolute inset-0" style={{ background: '#000' }}>
              <ChromaGrid items={[]} radius={400} damping={0.45} fadeOut={0.6} />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
              <div className="text-6xl font-black mb-8 px-12 py-6 rounded-3xl inline-block pointer-events-auto"
                style={{
                  color: '#fff',
                  background: 'linear-gradient(145deg, #ff6b6b, #ff8787)',
                  boxShadow: '0 20px 60px rgba(255, 107, 107, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <DecryptedText
                  text="GET IN TOUCH"
                  animateOn="view"
                  speed={30}
                  maxIterations={40}
                  sequential={true}
                />
              </div>
              <a
                href="mailto:JAYK47MGMT@GMAIL.COM"
                className="text-4xl font-bold transition-all duration-300 no-underline inline-block px-10 py-4 rounded-full pointer-events-auto"
                style={{
                  color: '#fff',
                  background: 'rgba(0, 0, 0, 0.7)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #ff6b6b, #ff8787)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                }}
              >
                <DecryptedText
                  text="JAYK47MGMT@GMAIL.COM"
                  animateOn="hover"
                  speed={20}
                  maxIterations={30}
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
