import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const PARTICLE_SIZE = 4;

const ParticleSandGame = () => {
  const canvasRef = useRef(null);
  const [selectedParticle, setSelectedParticle] = useState('sand');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const particles = useRef([]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const addParticle = (x, y, type) => {
    particles.current.push({ x, y, type });
  };

  const updateParticles = () => {
    const newParticles = [];
    particles.current.forEach(particle => {
      const { x, y, type } = particle;
      
      if (type === 'sand') {
        if (y < CANVAS_HEIGHT - PARTICLE_SIZE && !isOccupied(x, y + PARTICLE_SIZE)) {
          particle.y += PARTICLE_SIZE;
        } else if (y < CANVAS_HEIGHT - PARTICLE_SIZE) {
          if (!isOccupied(x - PARTICLE_SIZE, y + PARTICLE_SIZE)) {
            particle.x -= PARTICLE_SIZE;
            particle.y += PARTICLE_SIZE;
          } else if (!isOccupied(x + PARTICLE_SIZE, y + PARTICLE_SIZE)) {
            particle.x += PARTICLE_SIZE;
            particle.y += PARTICLE_SIZE;
          }
        }
      } else if (type === 'water') {
        if (y < CANVAS_HEIGHT - PARTICLE_SIZE && !isOccupied(x, y + PARTICLE_SIZE)) {
          particle.y += PARTICLE_SIZE;
        } else if (!isOccupied(x - PARTICLE_SIZE, y)) {
          particle.x -= PARTICLE_SIZE;
        } else if (!isOccupied(x + PARTICLE_SIZE, y)) {
          particle.x += PARTICLE_SIZE;
        }
      }
      
      newParticles.push(particle);
    });
    particles.current = newParticles;
  };

  const isOccupied = (x, y) => {
    return particles.current.some(p => p.x === x && p.y === y);
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    particles.current.forEach(particle => {
      if (particle.type === 'sand') {
        ctx.fillStyle = 'yellow';
      } else if (particle.type === 'water') {
        ctx.fillStyle = 'blue';
      } else if (particle.type === 'wall') {
        ctx.fillStyle = 'gray';
      }
      ctx.fillRect(particle.x, particle.y, PARTICLE_SIZE, PARTICLE_SIZE);
    });
  };

  const gameLoop = () => {
    updateParticles();
    drawParticles();
    requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    initializeCanvas();
    gameLoop();
  }, []);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / PARTICLE_SIZE) * PARTICLE_SIZE;
    const y = Math.floor((event.clientY - rect.top) / PARTICLE_SIZE) * PARTICLE_SIZE;
    addParticle(x, y, selectedParticle);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <select onChange={(e) => setSelectedParticle(e.target.value)} value={selectedParticle}>
        <option value="sand">Sand</option>
        <option value="water">Water</option>
        <option value="wall">Wall</option>
      </select>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        onClick={handleCanvasClick}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseMove={(e) => {
          if (isMouseDown) {
            handleCanvasClick(e);
          }
        }}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default ParticleSandGame;