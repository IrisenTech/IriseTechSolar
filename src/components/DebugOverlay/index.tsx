"use client";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

interface DebugOverlayProps {
  animations: THREE.AnimationClip[];
  onPlayByIndex: (index: number) => void;
  onPlayByName: (name: string) => void;
  enabled: boolean;
}

export const DebugOverlay = ({
  animations,
  onPlayByIndex,
  onPlayByName,
  enabled
}: DebugOverlayProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create container if it doesn't exist
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      containerRef.current.id = 'debug-overlay-root';
      document.body.appendChild(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, []);

  if (!enabled || !containerRef.current) return null;

  const buttonStyle: React.CSSProperties = {
    margin: '4px',
    padding: '4px 8px',
    background: '#444',
    color: '#fff',
    border: '1px solid #666',
    borderRadius: 4,
    cursor: 'pointer'
  };

  const content = (
    <div style={{
      position: 'fixed',
      left: 12,
      bottom: 12,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      color: '#fff',
      padding: '8px',
      borderRadius: 8,
      maxHeight: '40vh',
      overflow: 'auto',
      fontSize: 12,
    }}>
      <div style={{fontWeight: 700, marginBottom: 6}}>GLTF Animations</div>
      <div style={{marginBottom: 6}}>
        <button 
          style={buttonStyle}
          onClick={() => console.log('Animations:', animations.map(a => a.name))}
        >
          Log names
        </button>
      </div>
      {animations.map((anim, i) => (
        <div key={anim.name} style={{display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6}}>
          <div style={{flex: 1}}>{i}: {anim.name}</div>
          <div>
            <button style={buttonStyle} onClick={() => onPlayByIndex(i)}>
              Play
            </button>
          </div>
          <div>
            <button style={buttonStyle} onClick={() => onPlayByName(anim.name)}>
              Play by name
            </button>
          </div>
        </div>
      ))}
      {animations.length === 0 && <div style={{opacity: 0.7}}>No animations found</div>}
    </div>
  );

  return createPortal(content, containerRef.current);
};