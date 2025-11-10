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
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#B3D9FF'
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
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FFB3D9'
  },
  pastelMint: {
    name: 'Pastel Mint',
    primary: '#B3FFD9',
    secondary: '#F0FFF7',
    text: '#003322',
    border: '#B3FFD9',
    shadow: 'rgba(179, 255, 217, 0.6)',
    glow: 'rgba(179, 255, 217, 0.4)',
    gradient: 'linear-gradient(145deg, #B3FFD9, #CCFFE5)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#B3FFD9'
  },
  pastelLavender: {
    name: 'Pastel Lavender',
    primary: '#D9B3FF',
    secondary: '#F7F0FF',
    text: '#330066',
    border: '#D9B3FF',
    shadow: 'rgba(217, 179, 255, 0.6)',
    glow: 'rgba(217, 179, 255, 0.4)',
    gradient: 'linear-gradient(145deg, #D9B3FF, #E5CCFF)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#D9B3FF'
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
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#DC0000'
  },
  pastelRed: {
    name: 'Pastel Red',
    primary: '#FFB3B3',
    secondary: '#FFF5F5',
    text: '#8B0000',
    border: '#FFB3B3',
    shadow: 'rgba(255, 179, 179, 0.6)',
    glow: 'rgba(255, 179, 179, 0.4)',
    gradient: 'linear-gradient(145deg, #FFB3B3, #FFC9C9)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#FFB3B3'
  },
  aggressiveBlue: {
    name: 'Aggressive Blue',
    primary: '#0066FF',
    secondary: '#000033',
    text: '#fff',
    border: '#0066FF',
    shadow: 'rgba(0, 102, 255, 0.8)',
    glow: 'rgba(0, 102, 255, 0.5)',
    gradient: 'linear-gradient(145deg, #0066FF, #0080FF)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#0066FF'
  },
  neonPurple: {
    name: 'Neon Purple',
    primary: '#9D00FF',
    secondary: '#1A001A',
    text: '#fff',
    border: '#9D00FF',
    shadow: 'rgba(157, 0, 255, 0.8)',
    glow: 'rgba(157, 0, 255, 0.5)',
    gradient: 'linear-gradient(145deg, #9D00FF, #B84DFF)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#9D00FF'
  },
  neonGreenYellow: {
    name: 'Neon Green-Yellow',
    primary: '#CCFF00',
    secondary: '#1A1A00',
    text: '#000',
    border: '#CCFF00',
    shadow: 'rgba(204, 255, 0, 0.8)',
    glow: 'rgba(204, 255, 0, 0.5)',
    gradient: 'linear-gradient(145deg, #CCFF00, #E6FF4D)',
    spotify: 'linear-gradient(145deg, #1db954, #1ed760)',
    spotifyShadow: 'rgba(29, 185, 84, 0.7)',
    indicator: '#CCFF00'
  }
};

// FLAKE Text Effect - applies directly to text
function FlakeText({ text, theme, size = 120 }) {
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textCanvas = textCanvasRef.current;
    if (!canvas || !textCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const textCtx = textCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    textCanvas.width = size * dpr;
    textCanvas.height = size * dpr;
    textCanvas.style.width = `${size}px`;
    textCanvas.style.height = `${size}px`;
    textCtx.scale(dpr, dpr);

    // Draw text once
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
            : `${theme.primary}${Math.round(opacity * 255).toString(16)}`;
          
          ctx.beginPath();
          ctx.arc(0, 0, cellSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }

      // Composite text on top
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
      <canvas ref={textCanvas} style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{
          filter: `drop-shadow(0 0 15px ${theme.shadow})`,
        }}
      />
    </div>
  );
}

// DITHR Effect - Dithering/Halftone on buttons
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
        background: isHovered ? theme.gradient : theme.secondary,
        borderColor: theme.border,
        color: theme.text,
        transition: 'all 0.5s ease',
        backgroundImage: isHovered 
          ? `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`
          : 'none',
        backgroundSize: isHovered ? '8px 8px' : 'auto',
      }}
    >
      {children}
    </button>
  );
}

// REFRACT Effect - Distortion wave on hover
function RefractText({ text, theme }) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const width = text.length * 60;
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
        const offset = isHovered ? Math.sin(time * 3 + i * 0.8) * 8 : 0;
        const y = 50 + offset;
        
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = theme.primary;
        ctx.globalAlpha = 0.9;
        ctx.fillText(letter, 0, 0);
        
        if (isHovered) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = theme.text;
          ctx.fillText(letter, offset * 0.5, offset * 0.3);
        }
        
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
  }, [text, theme, isHovered]);

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: `drop-shadow(0 0 20px ${theme.shadow})`,
        cursor: 'pointer'
      }}
    />
  );
}

// KLON Effect - Glitchy repetition
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
      
      const layers = active ? 8 : 3;
      
      for (let i = 0; i < layers; i++) {
        const offset = active ? Math.sin(time * 2 + i) * (15 - i * 2) : i * 2;
        const alpha = active ? 0.15 : 0.3;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = i % 2 === 0 ? theme.primary : theme.text;
        ctx.fillText(text, 200 + offset, 60);
        ctx.restore();
      }
      
      // Main text
      ctx.fillStyle = theme.text;
      ctx.globalAlpha = 1;
      ctx.fillText(text, 200, 60);
    };

    const animate = () => {
      if (active) {
        timeRef.current += 0.08;
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
        filter: `drop-shadow(0 0 15px ${theme.shadow})`
      }}
    />
  );
}

// SPLITX Effect - for COMING SOON text
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
    canvas.height = 200 * dpr;
    canvas.style.width = '800px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    ctx.font = 'bold 100px Impact, Arial Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawSplitX = (time) => {
      ctx.clearRect(0, 0, 800, 200);
      
      const segments = 12;
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const offset = Math.sin(time + progress * Math.PI * 2) * 10;
        const scale = 1 + Math.sin(time * 2 + progress * 5) * 0.05;
        
        ctx.save();
        ctx.translate(400, 100);
        ctx.translate(offset, 0);
        ctx.scale(scale, 1);
        
        ctx.globalAlpha = 0.5 + (i / segments) * 0.5;
        ctx.fillStyle = theme.primary;
        ctx.fillText(text, 0, 0);
        
        ctx.restore();
      }
    };

    const animate = () => {
      timeRef.current += 0.03;
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

// Theme Selector with DITHR effect
function ThemeSelector({ currentTheme, onThemeChange, isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const themeKeys = Object.keys(themes);

  if (isMenuOpen) return null;

  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 cursor-pointer transition-all duration-500"
        style={{
          background: themes[currentTheme].secondary,
          borderColor: themes[currentTheme].border,
          boxShadow: `0 0 20px ${themes[currentTheme].shadow}`,
          backgroundImage: `radial-gradient(circle, ${themes[currentTheme].primary} 1px, transparent 1px)`,
          backgroundSize: '6px 6px'
        }}
      >
        <div
          className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          style={{
            background: themes[currentTheme].gradient,
            boxShadow: `0 0 10px ${themes[currentTheme].shadow}`
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute top-16 md:top-20 left-0 flex flex-col gap-2 md:gap-3 p-3 md:p-4 rounded-3xl border-2"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              borderColor: themes[currentTheme].border,
              backdropFilter: 'blur(10px)'
            }}
          >
            {themeKeys.map((key, idx) => (
              <motion.button
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                onClick={() => {
                  onThemeChange(key);
                  setIsOpen(false);
                }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 cursor-pointer transition-all duration-500"
                style={{
                  background: themes[key].gradient,
                  borderColor: currentTheme === key ? '#fff' : themes[key].border,
                  boxShadow: currentTheme === key 
                    ? `0 0 20px ${themes[key].shadow}` 
                    : `0 0 10px ${themes[key].shadow}`,
                  transform: currentTheme === key ? 'scale(1.1)' : 'scale(1)',
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '4px 4px'
                }}
              />
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

// BubbleMenu Component with KLON effect on items
function BubbleMenu({ items, onNavigate, theme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
        className="fixed top-4 right-4 md:top-8 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border-2 cursor-pointer z-50 transition-all duration-500"
        style={{
          background: theme.secondary,
          borderColor: theme.border,
          boxShadow: `0 0 20px ${theme.glow}, inset 0 0 10px ${theme.shadow}`,
          backgroundImage: `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`,
          backgroundSize: '6px 6px'
        }}
        onClick={handleToggle}
      >
        <span 
          className={`w-6 md:w-8 h-0.5 rounded transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}
          style={{ background: theme.text }}
        />
        <span 
          className={`w-6 md:w-8 h-0.5 rounded mt-1.5 md:mt-2 transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}
          style={{ background: theme.text }}
        />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-40"
            style={{ background: 'rgba(0, 0, 0, 0.95)' }}
          >
            <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-6">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0, x: -100 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0, opacity: 0, x: 100 }}
                  transition={{ 
                    delay: idx * 0.15,
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    duration: 0.6
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.page)}
                    className="block px-8 py-4 md:px-20 md:py-8 text-4xl md:text-6xl font-black rounded-full text-white border-4 text-center transition-all duration-500 no-underline"
                    style={{
                      backgroundColor: theme.secondary,
                      borderColor: theme.border,
                      color: theme.text,
                      boxShadow: `0 0 30px ${theme.shadow}`,
                      letterSpacing: '0.1em',
                      fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                      position: 'relative',
                      overflow: 'hidden'
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

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTheme, setCurrentTheme] = useState('pastelBlue');
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
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <SequentialTextCursor spacing={80} maxPoints={15} theme={theme} />
            <DithrButton
              onClick={() => setCurrentPage('home')}
              theme={theme}
              className="text-white font-black tracking-wider cursor-pointer border-4 md:border-4 z-10 transition-all duration-500 px-12 py-4 md:px-20 md:py-6 rounded-full"
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
          </div>
        );

      case 'home':
        return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden p-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} />
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
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
          </div>
        );

      case 'music':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} />
            <div className="flex flex-col items-center gap-8">
              <a
                href="https://open.spotify.com/artist/5yci4gTmKIa4MnuhRQqtJn?si=9857dbdc1de74376"
                target="_blank"
                rel="noopener noreferrer"
                className="font-black cursor-pointer no-underline z-10 px-8 py-4 md:px-20 md:py-10 border-2 md:border-4 rounded-full text-center block"
                style={{
                  fontSize: 'clamp(1.5rem, 6vw, 4.5rem)',
                  color: '#fff',
                  background: '#000',
                  borderColor: '#1db954',
                  boxShadow: '0 0 50px rgba(29, 185, 84, 0.8), inset 0 0 30px rgba(29, 185, 84, 0.3)',
                  transition: 'all 0.5s ease',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 20px rgba(29, 185, 84, 0.8)',
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                  backgroundImage: 'radial-gradient(circle, rgba(29, 185, 84, 0.2) 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(145deg, #1db954, #1ed760)';
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 70px rgba(29, 185, 84, 1), inset 0 0 40px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.borderColor = '#1db954';
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(29, 185, 84, 0.8), inset 0 0 30px rgba(29, 185, 84, 0.3)';
                }}
              >
                <DecryptedText
                  text="LISTEN ON SPOTIFY"
                  animateOn="both"
                  speed={35}
                  maxIterations={25}
                  sequential={true}
                  revealDirection="center"
                />
              </a>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden p-4 md:p-8">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} />
            <div className="text-center z-10 max-w-full">
              <div className="mb-8 flex justify-center">
                <RefractText text="GET IN TOUCH" theme={theme} />
              </div>
              
              <a
                href="mailto:JAYK47MGMT@GMAIL.COM"
                className="font-bold transition-all duration-500 no-underline inline-block px-6 py-3 md:px-12 md:py-6 border-2 md:border-4 rounded-2xl md:rounded-full break-all"
                style={{
                  fontSize: 'clamp(1rem, 4vw, 2.5rem)',
                  color: theme.text,
                  background: theme.secondary,
                  borderColor: theme.border,
                  boxShadow: `0 0 30px ${theme.shadow}, inset 0 0 20px ${theme.glow}`,
                  letterSpacing: '0.05em',
                  maxWidth: '90vw',
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                  backgroundImage: `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`,
                  backgroundSize: '6px 6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = theme.gradient;
                  e.currentTarget.style.borderColor = theme.text === '#000' ? '#000' : '#fff';
                  e.currentTarget.style.boxShadow = `0 0 50px ${theme.shadow}, inset 0 0 30px rgba(255, 255, 255, 0.3)`;
                  e.currentTarget.style.backgroundImage = 'none';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = theme.secondary;
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = `0 0 30px ${theme.shadow}, inset 0 0 20px ${theme.glow}`;
                  e.currentTarget.style.backgroundImage = `radial-gradient(circle, ${theme.primary} 1px, transparent 1px)`;
                }}
              >
                <DecryptedText
                  text="JAYK47MGMT@GMAIL.COM"
                  animateOn="hover"
                  speed={25}
                  maxIterations={30}
                />
              </a>
            </div>
          </div>
        );

      case 'snippets':
        return (
          <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} isMenuOpen={isMenuOpen} />
            <BubbleMenu items={menuItems} onNavigate={handleNavigate} theme={theme} />
            <div className="text-center z-10 flex flex-col items-center gap-8">
              <div className="mb-4">
                <p 
                  className="text-xl md:text-3xl font-bold mb-8"
                  style={{
                    color: theme.primary,
                    textShadow: `0 0 20px ${theme.shadow}`,
                    fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif",
                    letterSpacing: '0.1em'
                  }}
                >
                  EXCLUSIVE CONTENT & BEHIND THE SCENES
                </p>
              </div>
              <div className="flex justify-center">
                <SplitXText text="COMING SOON" theme={theme} />
              </div>
              <p 
                className="text-lg md:text-2xl font-bold mt-4"
                style={{
                  color: theme.text,
                  textShadow: `0 0 15px ${theme.shadow}`,
                  fontFamily: "'Green Mind', 'Impact', 'Arial Black', sans-serif"
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

  useEffect(() => {
    const checkMenuOpen = () => {
      const menuButton = document.querySelector('.fixed.top-4.right-4, .fixed.md\\:top-8.md\\:right-8');
      if (menuButton) {
        const isOpen = menuButton.querySelector('span')?.classList.contains('rotate-45');
        setIsMenuOpen(isOpen || false);
      }
    };
    
    const observer = new MutationObserver(checkMenuOpen);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return <div className="w-full h-screen overflow-hidden">{renderPage()}</div>;
}
