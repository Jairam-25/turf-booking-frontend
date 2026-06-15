import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'magic-animated-beam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animated-beam-container relative w-full rounded-2xl p-6 overflow-hidden">
      
      <!-- SVG Connecting Beams -->
      <svg title="Back" class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
        
        <!-- Subtle dot pattern background -->
        <defs>
          <pattern [attr.id]="dotPatternId" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="currentColor" class="text-slate-700/20 dark:text-slate-400/10" />
          </pattern>
          
          <!-- Beam flow gradients -->
          <linearGradient [attr.id]="grad1Id" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.1" />
            <stop offset="50%" stop-color="var(--primary)" stop-opacity="0.9" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.1" />
          </linearGradient>

          <linearGradient [attr.id]="grad2Id" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.1" />
            <stop offset="50%" stop-color="var(--accent)" stop-opacity="0.9" />
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.1" />
          </linearGradient>
        </defs>

        <!-- Apply Dot Pattern -->
        <rect width="100%" height="100%" [attr.fill]="'url(#' + dotPatternId + ')'" />

        <!-- Background dashed placeholder paths -->
        <path id="flow-path-1" d="M 150 100 Q 275 35 400 100" fill="none" stroke="currentColor" class="text-slate-800/10 dark:text-slate-100/10" stroke-width="2.5" stroke-dasharray="6 6" />
        <path id="flow-path-2" d="M 400 100 Q 525 165 650 100" fill="none" stroke="currentColor" class="text-slate-800/10 dark:text-slate-100/10" stroke-width="2.5" stroke-dasharray="6 6" />

        <!-- Animated glowing overlay paths (Laser beams!) -->
        <path d="M 150 100 Q 275 35 400 100" fill="none" [attr.stroke]="'url(#' + grad1Id + ')'" stroke-width="3" stroke-linecap="round" class="beam-glow-flow" />
        <path d="M 400 100 Q 525 165 650 100" fill="none" [attr.stroke]="'url(#' + grad2Id + ')'" stroke-width="3" stroke-linecap="round" class="beam-glow-flow delay-flow" />

        <!-- Active flowing gradient particles and arrows using native SVG animateMotion -->
        <!-- Moving Particle 1 -->
        <g>
          <circle r="6" fill="var(--primary)" filter="drop-shadow(0 0 8px var(--primary))">
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 150 100 Q 275 35 400 100" />
          </circle>
        </g>
        
        <!-- Moving Arrow 1 -->
        <g fill="var(--primary)">
          <path d="M -5 -4 L 5 0 L -5 4 Z">
            <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto" path="M 150 100 Q 275 35 400 100" />
          </path>
        </g>

        <!-- Moving Particle 2 (Delayed to represent the next step!) -->
        <g>
          <circle r="6" fill="var(--accent)" filter="drop-shadow(0 0 8px var(--accent))">
            <animateMotion dur="3.5s" begin="1.75s" repeatCount="indefinite" path="M 400 100 Q 525 165 650 100" />
          </circle>
        </g>

        <!-- Moving Arrow 2 -->
        <g fill="var(--accent)">
          <path d="M -5 -4 L 5 0 L -5 4 Z">
            <animateMotion dur="3.5s" begin="1.75s" repeatCount="indefinite" rotate="auto" path="M 400 100 Q 525 165 650 100" />
          </path>
        </g>

      </svg>

      <!-- HTML Interactive Overlaid Nodes -->
      <div class="relative z-10 w-full flex justify-between items-center h-48 px-2 sm:px-12 md:px-24">
        
        <!-- Node 1: Player/User -->
        <div class="beam-node flex flex-col items-center gap-2 group">
          <div class="node-circle player-node scale-95 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(123,57,252,0.6)]">
            <span class="text-3xl animate-bounce-subtle">⚽</span>
          </div>
          <span class="node-label">Player</span>
        </div>

        <!-- Node 2: TurfXpert App Engine -->
        <div class="beam-node flex flex-col items-center gap-2 group">
          <div class="node-circle app-node scale-95 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]">
            <span class="text-3xl animate-pulse-subtle">⚡</span>
          </div>
          <span class="node-label">TurfXpert</span>
        </div>

        <!-- Node 3: Elite Stadium / Play Turf -->
        <div class="beam-node flex flex-col items-center gap-2 group">
          <div class="node-circle turf-node scale-95 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(123,57,252,0.6)]">
            <span class="text-3xl animate-bounce-subtle">🏟️</span>
          </div>
          <span class="node-label">Play Arena</span>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .animated-beam-container {
      background: rgba(30, 41, 59, 0.03);
      border: 1px solid var(--border-color);
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    body[data-theme="light"] .animated-beam-container {
      background: rgba(255, 255, 255, 0.45);
    }

    .beam-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
    }

    .node-circle {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 2.5px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-flat);
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 10;
    }

    .player-node {
      border-color: var(--primary);
      box-shadow: 0 0 15px rgba(123, 57, 252, 0.25);
    }

    .app-node {
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
      width: 76px;
      height: 76px;
    }

    .turf-node {
      border-color: var(--primary);
      box-shadow: 0 0 15px rgba(123, 57, 252, 0.25);
    }

    .node-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: color 0.3s ease;
    }

    .beam-node:hover .node-label {
      color: var(--primary);
    }

    .beam-glow-flow {
      stroke-dasharray: 80 200;
      animation: svg-beam-flow 4.5s linear infinite;
    }

    .delay-flow {
      animation-delay: 2.25s;
    }

    @keyframes svg-beam-flow {
      0% { stroke-dashoffset: 280; }
      100% { stroke-dashoffset: 0; }
    }

    @keyframes bounce-subtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(0.95); }
    }

    .animate-bounce-subtle {
      animation: bounce-subtle 3s ease-in-out infinite;
    }

    .animate-pulse-subtle {
      animation: pulse-subtle 2s ease-in-out infinite;
    }

    @media (max-width: 480px) {
      .node-circle {
        width: 48px;
        height: 48px;
        border-width: 2px;
      }
      .app-node {
        width: 56px;
        height: 56px;
      }
      .beam-node {
        width: 75px;
      }
      .node-label {
        font-size: 0.65rem;
        letter-spacing: 0px;
      }
      .beam-node .text-3xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
    }
  `]
})
export class MagicAnimatedBeamComponent implements OnInit {
  dotPatternId = 'dots-' + Math.random().toString(36).substring(2, 9);
  grad1Id = 'grad1-' + Math.random().toString(36).substring(2, 9);
  grad2Id = 'grad2-' + Math.random().toString(36).substring(2, 9);

  ngOnInit() {}
}
