import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Particle } from './ParticleSystem';

interface ParticleRendererProps {
  particles: Particle[];
}

export function ParticleRenderer({ particles }: ParticleRendererProps) {
  return (
    <>
      {particles.map((particle) => (
        <View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.alpha,
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 50, // Circular particles
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
