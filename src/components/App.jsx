import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Color themes - Updated for dark neon city aesthetic
const themes = {
  neonCyan: {
    name: 'Neon Cyan',
    primary: '#00FFFF',
    secondary: '#0a0a0a',
    text: '#00FFFF',
    border: '#00FFFF',
    shadow: 'rgba(0, 255, 255, 0.8)',
    glow: 'rgba(0, 255, 255, 0.4)',
    gradient: 'linear-gradient(145deg, #00FFFF, #00CCCC)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#00FFFF'
  },
  neonPink: {
    name: 'Neon Pink',
    primary: '#FF10F0',
    secondary: '#0a0a0a',
    text: '#FF10F0',
    border: '#FF10F0',
    shadow: 'rgba(255, 16, 240, 0.8)',
    glow: 'rgba(255, 16, 240, 0.4)',
    gradient: 'linear-gradient(145deg, #FF10F0, #CC0DC0)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FF10F0'
  },
  neonPurple: {
    name: 'Neon Purple',
    primary: '#9D00FF',
    secondary: '#0a0a0a',
    text: '#9D00FF',
    border: '#9D00FF',
    shadow: 'rgba(157, 0, 255, 0.8)',
    glow: 'rgba(157, 0, 255, 0.4)',
    gradient: 'linear-gradient(145deg, #9D00FF, #B84DFF)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#9D00FF'
  },
  neonOrange: {
    name: 'Neon Orange',
    primary: '#FF6600',
    secondary: '#0a0a0a',
    text: '#FF6600',
    border: '#FF6600',
    shadow: 'rgba(255, 102, 0, 0.8)',
    glow: 'rgba(255, 102, 0, 0.4)',
    gradient: 'linear-gradient(145deg, #FF6600, #FF8533)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FF6600'
  },
  neonGreen: {
    name: 'Neon Green',
    primary: '#39FF14',
    secondary: '#0a0a0a',
    text: '#39FF14',
    border: '#39FF14',
    shadow: 'rgba(57, 255, 20, 0.8)',
    glow: 'rgba(57, 255, 20, 0.4)',
    gradient: 'linear-gradient(145deg, #39FF14, #2ECC11)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#39FF14'
  },
  neonRed: {
    name: 'Neon Red',
    primary: '#FF0040',
    secondary: '#0a0a0a',
    text: '#FF0040',
    border: '#FF0040',
    shadow: 'rgba(255, 0, 64, 0.8)',
    glow: 'rgba(255, 0, 64, 0.4)',
    gradient: 'linear-gradient(145deg, #FF0040, #CC0033)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FF0040'
  },
  neonBlue: {
    name: 'Neon Blue',
    primary: '#0080FF',
    secondary: '#0a0a0a',
    text: '#0080FF',
    border: '#0080FF',
    shadow: 'rgba(0, 128, 255, 0.8)',
    glow: 'rgba(0, 128, 255, 0.4)',
    gradient: 'linear-gradient(145deg, #0080FF, #0066CC)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#0080FF'
  },
  neonYellow: {
    name: 'Neon Yellow',
    primary: '#FFFF00',
    secondary: '#0a0a0a',
    text: '#FFFF00',
    border: '#FFFF00',
    shadow: 'rgba(255, 255, 0, 0.8)',
    glow: 'rgba(255, 255, 0, 0.4)',
    gradient: 'linear-gradient(145deg, #FFFF00, #CCCC00)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FFFF00'
  }
};

// FLAKE Text Effect
function FlakeText({ text, theme, size = 120 }) {
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const mainCanvas = canvasRef.current;
    const textCanvas = textCanvasRef.current;
    
    if (!mainCanvas || !textCanvas) return;
    
    const ctx = mainCanvas.getContext('2d');
    const textCtx = textCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    mainCanvas.width = size * dpr;
    mainCanvas.height = size * dpr;
    mainCanvas.style.width = `${size}px`;
    mainCanvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    textCanvas.width = size * dpr;
    textCanvas.height = size * dpr;
    textCanvas.style.width = `${size}px`;
    textCanvas.style.height = `${size}px`;
    textCtx.scale(dpr, dpr);

    textCtx.font = `900 ${size * 0.7}px Impact, Arial Black`;
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillStyle = theme.text;
    textCtx.fillText(text, size / 2, size / 2);

    const gridSize = 12;
    const cellSize = size / gridSize;
    
    const drawPattern = (time) => {
      ctx.clearRect(0, 0, size, size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const cellX = x * cellSize + cellSize / 2;
          const cellY = y * cellSize + cellSize / 2;
          
          const dx = cellX - centerX;
          const dy = cellY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
          const normalizedDistance = distance / maxDistance;
          
          const angle = Math.atan2(dy, dx);
          const rotation = angle + time * 0.3;
          const scale = 0.4 + normalizedDistance * 0.3 + Math.sin(time * 1.5 + normalizedDistance * 4) * 0.15;
          
          ctx.save();
          ctx.translate(cellX, cellY);
          ctx.rotate(rotation);
          ctx.scale(scale, scale);
          
          const opacity = 0.3 + Math.sin(time + normalizedDistance * 5) * 0.2;
          ctx.fillStyle = theme.primary.includes('rgb') 
            ? theme.primary.replace(')', `, ${opacity})`).replace('rgb', 'rgba')
            : `${theme.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
          
          ctx.beginPath();
          ctx.arc(0, 0, cellSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }

      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(textCanvas, 0, 0, size, size);
      ctx.globalCompositeOperation = 'source-over';
    };

    const animatePattern = () => {
      timeRef.current += 0.015;
      drawPattern(timeRef.current);
      animationRef.current = requestAnimationFrame(animatePattern);
    };

    animatePattern();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, theme, text]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={textCanvasRef} style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{
          filter: `drop-shadow(0 0 20px ${theme.shadow}) drop-shadow(0 0 40px ${theme.glow})`,
        }}
      />
    </div>
  );
}

// DITHR Effect Button
function DithrButton({ children, onClick, theme, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: isHovered ? theme.gradient : 'rgba(10, 10, 10, 0.8)',
        borderColor: theme.border,
        color: theme.text,
        transition: 'all 0.5s ease',
        backgroundImage: isHovered 
          ? `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`
          : 'none',
        backgroundSize: isHovered ? '8px 8px' : 'auto',
        boxShadow: isHovered 
          ? `0 0 30px ${theme.shadow}, inset 0 0 20px ${theme.glow}` 
          : `0 0 15px ${theme.shadow}`,
      }}
    >
      {children}
    </button>
  );
}

// REFRACT Effect
function RefractText({ text, theme }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const width = Math.max(text.length * 60, 400);
    canvas.width = width * dpr;
    canvas.height = 100 * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = '100px';
    ctx.scale(dpr, dpr);

    const drawRefract = (time) => {
      ctx.clearRect(0, 0, width, 100);
      
      ctx.font = 'bold 60px Impact, Arial Black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const letters = text.split('');
      const spacing = width / (letters.length + 1);
      
      letters.forEach((letter, i) => {
        const x = spacing * (i + 1);
        const offset = Math.sin(time * 3 + i * 0.8) * 8;
        const y = 50 + offset;
        
        ctx.save();
        ctx.translate(x, y);
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = theme.text;
        ctx.fillText(letter, offset * 0.5, offset * 0.3);
        
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = theme.primary;
        ctx.fillText(letter, 0, 0);
        
        ctx.restore();
      });
    };

    const animate = () => {
      timeRef.current += 0.05;
      drawRefract(timeRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        filter: `drop-shadow(0 0 25px ${theme.shadow}) drop-shadow(0 0 50px ${theme.glow})`,
        cursor: 'default'
      }}
    />
  );
}

// KLON Effect
function KlonText({ text, theme, active = false }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = 400 * dpr;
    canvas.height = 120 * dpr;
    canvas.style.width = '400px';
    canvas.style.height = '120px';
    ctx.scale(dpr, dpr);

    const drawKlon = (time) => {
      ctx.clearRect(0, 0, 400, 120);
      
      ctx.font = 'bold 70px Impact, Arial Black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const layers = active ? 6 : 3;
      
      for (let i = 0; i < layers; i++) {
        const offset = active ? Math.sin(time + i * 0.5) * (10 - i * 1.5) : i * 2;
        const alpha = active ? 0.2 : 0.3;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = i % 2 === 0 ? theme.primary : theme.text;
        ctx.fillText(text, 200 + offset, 60);
        ctx.restore();
      }
      
      ctx.fillStyle = theme.text;
      ctx.globalAlpha = 1;
      ctx.fillText(text, 200, 60);
    };

    const animate = () => {
      if (active) {
        timeRef.current += 0.04;
      }
      drawKlon(timeRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, theme, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        filter: `drop-shadow(0 0 20px ${theme.shadow})`
      }}
    />
  );
}

// SPLITX Effect
function SplitXText({ text, theme }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = 800 * dpr;
    canvas.height = 150 * dpr;
    canvas.style.width = '800px';
    canvas.style.height = '150px';
    ctx.scale(dpr, dpr);

    ctx.font = '300 60px Impact, Arial Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawSplitX = (time) => {
      ctx.clearRect(0, 0, 800, 150);
      
      const segments = 8;
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const offset = Math.sin(time + progress * Math.PI * 2) * 15;
        const scale = 1 + Math.sin(time * 2 + progress * 5) * 0.03;
        
        ctx.save();
        ctx.translate(400, 75);
        ctx.translate(offset, 0);
        ctx.scale(scale, 1);
        
        ctx.globalAlpha = 0.4 + (i / segments) * 0.4;
        ctx.fillStyle = theme.primary;
        ctx.fillText(text, 0, 0);
        
        ctx.restore();
      }
    };

    const animate = () => {
      timeRef.current += 0.025;
      drawSplitX(timeRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        filter: `drop-shadow(0 0 25px ${theme.shadow})`
      }}
    />
  );
}

// Theme Selector with improved UI
function ThemeSelector({ currentTheme, onThemeChange, isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const themeKeys = Object.keys(themes);

  if (isMenuOpen) return null;

  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-50">
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center border-2 cursor-pointer transition-all duration-500 backdrop-blur-sm"
          style={{
            background: 'rgba(10, 10, 10, 0.9)',
            borderColor: themes[currentTheme].border,
            boxShadow: `0 0 25px ${themes[currentTheme].shadow}, inset 0 0 15px ${themes[currentTheme].glow}`,
          }}
        >
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded"
            style={{
              background: themes[currentTheme].gradient,
              boxShadow: `0 0 15px ${themes[currentTheme].shadow}`
            }}
          />
        </button>
        
        {!isOpen && (
          <span 
            className="text-xs font-bold tracking-wider"
            style={{ 
              color: themes[currentTheme].primary,
              textShadow: `0 0 10px ${themes[currentTheme].shadow}`
            }}
          >
            COLOR
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-20 md:top-24 left-0 grid grid-cols-2 gap-3 p-4 rounded-2xl border-2 backdrop-blur-md"
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              borderColor: themes[currentTheme].border,
              boxShadow: `0 0 30px ${themes[currentTheme].shadow}`
            }}
          >
            {themeKeys.map((key, idx) => (
              <motion.button
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                onClick={() => {
                  onThemeChange(key);
                  setIsOpen(false);
                }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 cursor-pointer transition-all duration-300 relative group"
                style={{
                  background: themes[key].gradient,
                  borderColor: currentTheme === key ? '#fff' : themes[key].border,
                  boxShadow: currentTheme === key 
                    ? `0 0 25px ${themes[key].shadow}, 0 0 50px ${themes[key].glow}` 
                    : `0 0 10px ${themes[key].shadow}`,
                  transform: currentTheme === key ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span 
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    color: themes[key].primary,
                    textShadow: `0 0 10px ${themes[key].shadow}`
                  }}
                >
                  {themes[key].name.split(' ')[1]}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          onMouseLeave: () => setIsHovering(false),
          onTouchStart: () => setIsHovering(true),
          onTouchEnd: () => setIsHovering(false)
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
  maxPoints = 8,
  theme
}) {
  const [trail, setTrail] = useState([]);
  const containerRef = useRef(null);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);
  const letterIndex = useRef(0);
  const letters = ['J', 'A', 'Y', 'K'];

  const handleMouseMove = useCallback(e => {
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
  }, [spacing, maxPoints]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
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
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 'bold',
                fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                color: theme.primary,
                textShadow: `0 0 20px ${theme.shadow}, 0 0 40px ${theme.glow}`,
                filter: `drop-shadow(0 0 10px ${theme.shadow})`
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

// BubbleMenu Component with clearer UI
function BubbleMenu({ items, onNavigate, theme, isOpen, setIsOpen }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (e, page) => {
    e.preventDefault();
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex flex-col items-center justify-center border-2 cursor-pointer transition-all duration-500 backdrop-blur-sm"
          style={{
            background: 'rgba(10, 10, 10, 0.9)',
            borderColor: theme.border,
            boxShadow: `0 0 25px ${theme.glow}, inset 0 0 10px ${theme.shadow}`,
          }}
          onClick={handleToggle}
        >
          <span 
            className={`w-7 md:w-8 h-0.5 rounded transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}
            style={{ 
              background: theme.primary,
              boxShadow: `0 0 10px ${theme.shadow}`
            }}
          />
          <span 
            className={`w-7 md:w-8 h-0.5 rounded mt-2 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}
            style={{ 
              background: theme.primary,
              boxShadow: `0 0 10px ${theme.shadow}`
            }}
          />
        </button>
        
        {!isOpen && (
          <span 
            className="text-xs font-bold tracking-wider"
            style={{ 
              color: theme.primary,
              textShadow: `0 0 10px ${theme.shadow}`
            }}
          >
            MENU
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-40"
            style={{ 
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-6">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0, x: -100 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0, opacity: 0, x: 100 }}
                  transition={{ 
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 120,
                    damping: 15,
                    duration: 0.5
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.page)}
                    className="block px-8 py-4 md:px-20 md:py-8 text-4xl md:text-6xl font-black rounded-lg text-white border-2 text-center transition-all duration-300 no-underline"
                    style={{
                      backgroundColor: 'rgba(10, 10, 10, 0.8)',
                      borderColor: theme.border,
                      color: theme.text,
                      boxShadow: `0 0 30px ${theme.shadow}, inset 0 0 15px ${theme.glow}`,
                      letterSpacing: '0.15em',
                      fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                      position: 'relative',
                      overflow: 'hidden',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {hoveredIndex === idx ? (
                      <div style={{ display: 'inline-block' }}>
                        <KlonText text={item.label} theme={theme} active={true} />
                      </div>
                    ) : (
                      item.label
                    )}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Grid background effect
function NeonGrid({ theme }) {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(${theme.primary}22 1px, transparent 1px),
          linear-gradient(90deg, ${theme.primary}22 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
      }}
    />
  );
}

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTheme, setCurrentTheme] = useState('neonCyan');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = themes[currentTheme];

  const menuItems = [
    { label: 'HOME', href: '#home', page: 'home' },
    { label: 'MUSIC', href: '#music', page: 'music' },
    { label: 'CONTACT', href: '#contact', page: 'contact' },
    { label: 'SNIPPETS', href: '#snippets', page: 'snippets' }
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <NeonGrid theme={theme} />
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <SequentialTextCursor spacing={80} maxPoints={15} theme={theme} />
            
            {/* Instruction text */}
            <div className="absolute top-1/4 text-center">
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-sm md:text-lg font-bold tracking-widest mb-2"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 15px ${theme.shadow}`
                }}
              >
                MOVE YOUR CURSOR
              </motion.p>
            </div>

            <DithrButton
              onClick={() => setCurrentPage('home')}
              theme={theme}
              className="text-white font-black tracking-wider cursor-pointer border-4 z-10 transition-all duration-500 px-12 py-4 md:px-20 md:py-6 rounded-lg"
              style={{
                fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                borderColor: theme.border,
                color: theme.text,
                textShadow: `0 0 20px ${theme.shadow}`,
                boxShadow: `0 0 30px ${theme.shadow}, inset 0 0 20px ${theme.glow}`,
                letterSpacing: '0.2em',
                fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif"
              }}
            >
              <DecryptedText text="ENTER" animateOn="hover" speed={40} maxIterations={30} />
            </DithrButton>

            {/* Hint text */}
            <div className="absolute bottom-12 text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs md:text-sm font-bold tracking-widest"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 10px ${theme.shadow}`
                }}
              >
                HOVER TO DECRYPT
              </motion.p>
            </div>
          </div>
        );

      case 'home':
        return (
          <div 
            className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden p-4"
            style={{
              background: '#0a0a0a'
            }}
          >
            <NeonGrid theme={theme} />
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8">
              {['J', 'A', 'Y', 'K'].map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: i * 0.2,
                    type: 'spring',
                    stiffness: 150,
                    damping: 20,
                    duration: 0.8
                  }}
                >
                  <FlakeText 
                    text={letter} 
                    theme={theme} 
                    size={window.innerWidth < 768 ? 80 : 140} 
                  />
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base md:text-xl font-bold tracking-widest text-center"
              style={{
                color: theme.primary,
                textShadow: `0 0 15px ${theme.shadow}`
              }}
            >
              OFFICIAL ARTIST WEBSITE
            </motion.p>
          </div>
        );

      case 'music':
        return (
          <div 
            className="w-full h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{
              background: '#0a0a0a'
            }}
          >
            <NeonGrid theme={theme} />
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            
            <div className="flex flex-col items-center gap-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <RefractText text="LISTEN NOW" theme={theme} />
              </motion.div>

              <a
                href="https://open.spotify.com/artist/5yci4gTmKIa4MnuhRQqtJn?si=9857dbdc1de74376"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black cursor-pointer no-underline z-10 px-8 py-4 md:px-20 md:py-10 border-4 rounded-lg text-center block backdrop-blur-sm"
                style={{
                  fontSize: 'clamp(1.5rem, 6vw, 4.5rem)',
                  color: '#fff',
                  background: 'rgba(10, 10, 10, 0.8)',
                  borderColor: '#1db954',
                  boxShadow: '0 0 40px rgba(29, 185, 84, 0.8), inset 0 0 20px rgba(29, 185, 84, 0.3)',
                  transition: 'all 0.5s ease',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 20px rgba(29, 185, 84, 0.8)',
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #1db954, #1ed760)';
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(29, 185, 84, 1), inset 0 0 30px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)';
                  e.currentTarget.style.borderColor = '#1db954';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(29, 185, 84, 0.8), inset 0 0 20px rgba(29, 185, 84, 0.3)';
                }}
              >
                <DecryptedText
                  text="SPOTIFY"
                  animateOn="both"
                  speed={35}
                  maxIterations={25}
                  sequential={true}
                  revealDirection="center"
                />
              </a>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm md:text-base tracking-widest"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 10px ${theme.shadow}`
                }}
              >
                STREAM ALL TRACKS
              </motion.p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div 
            className="w-full h-screen flex items-center justify-center relative overflow-hidden p-4 md:p-8"
            style={{
              background: '#0a0a0a'
            }}
          >
            <NeonGrid theme={theme} />
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            
            <div className="text-center z-10 max-w-full">
              <div className="mb-12 flex justify-center">
                <RefractText text="GET IN TOUCH" theme={theme} />
              </div>
              
              <a
                href="mailto:JAYK47MGMT@GMAIL.COM"
                className="font-bold transition-all duration-500 no-underline inline-block px-6 py-3 md:px-12 md:py-6 border-4 rounded-lg break-all backdrop-blur-sm"
                style={{
                  fontSize: 'clamp(1rem, 4vw, 2.5rem)',
                  color: theme.text,
                  background: 'rgba(10, 10, 10, 0.8)',
                  borderColor: theme.border,
                  boxShadow: `0 0 30px ${theme.shadow}, inset 0 0 15px ${theme.glow}`,
                  letterSpacing: '0.05em',
                  maxWidth: '90vw',
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = theme.gradient;
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.boxShadow = `0 0 50px ${theme.shadow}, inset 0 0 25px rgba(255, 255, 255, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(10, 10, 10, 0.8)';
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = `0 0 30px ${theme.shadow}, inset 0 0 15px ${theme.glow}`;
                }}
              >
                <DecryptedText
                  text="JAYK47MGMT@GMAIL.COM"
                  animateOn="hover"
                  speed={25}
                  maxIterations={30}
                />
              </a>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm md:text-base tracking-widest mt-8"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 10px ${theme.shadow}`
                }}
              >
                FOR BOOKINGS & INQUIRIES
              </motion.p>
            </div>
          </div>
        );

      case 'snippets':
        return (
          <div 
            className="w-full h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{
              background: '#0a0a0a'
            }}
          >
            <NeonGrid theme={theme} />
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            
            <div className="text-center z-10 flex flex-col items-center gap-8">
              <div className="mb-4">
                <p 
                  className="text-lg md:text-xl font-bold mb-8 tracking-widest"
                  style={{
                    color: theme.primary,
                    textShadow: `0 0 20px ${theme.shadow}`,
                    fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                    letterSpacing: '0.2em'
                  }}
                >
                  EXCLUSIVE CONTENT
                </p>
              </div>
              
              <div className="flex justify-center">
                <SplitXText text="COMING SOON" theme={theme} />
              </div>
              
              <p 
                className="text-base md:text-xl tracking-widest mt-4"
                style={{
                  color: theme.primary,
                  textShadow: `0 0 15px ${theme.shadow}`,
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                  opacity: 0.8
                }}
              >
                UNRELEASED TRACKS & BEHIND THE SCENES
              </p>

              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 px-8 py-4 border-2 rounded-lg"
                style={{
                  borderColor: theme.border,
                  boxShadow: `0 0 20px ${theme.shadow}`
                }}
              >
                <p 
                  className="text-sm md:text-base tracking-widest"
                  style={{
                    color: theme.text,
                    fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif"
                  }}
                >
                  STAY TUNED
                </p>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-screen overflow-hidden">{renderPage()}</div>;
}
