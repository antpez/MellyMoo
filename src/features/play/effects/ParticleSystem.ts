export type Particle = {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
};

export class ParticleSystem {
  private particles: Particle[] = [];
  private idCounter: number = 0;

  createBurstPopEffect(x: number, y: number, color: string, count: number = 8): Particle[] {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      
      newParticles.push({
        id: `particle_${++this.idCounter}`,
        x,
        y,
        velocityX,
        velocityY,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.5, // 0.5-1.0 seconds
        size: 3 + Math.random() * 4, // 3-7 pixels
        color,
        alpha: 1.0,
      });
    }
    
    return newParticles;
  }

  createSparkleEffect(x: number, y: number, color: string, count: number = 5): Particle[] {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 40;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed - 20; // Slight upward bias
      
      newParticles.push({
        id: `sparkle_${++this.idCounter}`,
        x,
        y,
        velocityX,
        velocityY,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.4, // 0.3-0.7 seconds
        size: 2 + Math.random() * 3, // 2-5 pixels
        color,
        alpha: 1.0,
      });
    }
    
    return newParticles;
  }

  updateParticles(deltaTime: number): Particle[] {
    this.particles = this.particles
      .map(particle => {
        const newParticle = {
          ...particle,
          x: particle.x + particle.velocityX * deltaTime,
          y: particle.y + particle.velocityY * deltaTime,
          life: particle.life + deltaTime,
          velocityY: particle.velocityY + 200 * deltaTime, // Gravity
          alpha: Math.max(0, 1 - (particle.life / particle.maxLife)),
        };
        return newParticle;
      })
      .filter(particle => particle.life < particle.maxLife);

    return this.particles;
  }

  addParticles(particles: Particle[]) {
    this.particles.push(...particles);
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  clearParticles() {
    this.particles = [];
  }
}
