import { useId } from 'react';

// The drawing of icon.svg (the owner's source, at the repository root) without the editor's data.
const PAPER = 'M 106.75,8.05 L 189.25,55.68 A 13.5 13.5 0 0 1 196,67.37 L 196,162.63 A 13.5 13.5 0 0 1 189.25,174.32 L 106.75,221.95 A 13.5 13.5 0 0 1 93.25,221.95 L 10.75,174.32 A 13.5 13.5 0 0 1 4,162.63 L 4,67.37 A 13.5 13.5 0 0 1 10.75,55.68 L 93.25,8.05 A 13.5 13.5 0 0 1 106.75,8.05 Z';
// The S (top, middle, bottom), 15 wide, and the two sides it stands apart from, 5 wide.
const S = 'M 105.25,10.64 A 10.5 10.5 0 0 0 94.75,10.64 L 12.25,58.28 A 10.5 10.5 0 0 0 7,67.37 L 7,104.5 A 10.5 10.5 0 0 0 17.5,115 L 182.5,115 A 10.5 10.5 0 0 1 193,125.5 L 193,162.63 A 10.5 10.5 0 0 1 187.75,171.72 L 105.25,219.36 A 10.5 10.5 0 0 1 94.75,219.36 L 94.75,219.36';
const SIDES = 'M 122.72,14.96 L 190.25,53.95 A 15.5 15.5 0 0 1 198,67.37 L 198,101.58 M 77.28,215.04 L 9.75,176.05 A 15.5 15.5 0 0 1 2,162.63 L 2,128.42';
// Either side of the S: lightest along its middle stroke (y1), darkest in the far corner (y2).
const HALVES = [
  {
    name: 'green', y1: 127, y2: 214.3, stops: ['#a3dcba', '#3ece7a', '#1f7a45'],
    d: 'M 181,130 L 181,160.03 A 3 3 0 0 1 179.5,162.63 L 100.4,208.3 A 0.99 0.99 0 0 1 99.51,208.35 L 99.05,208.15 L 98.11,207.84 L 97.14,207.6 L 96.16,207.44 L 95.16,207.36 L 94.16,207.37 L 93.17,207.46 L 92.19,207.63 L 91.23,207.89 L 90.29,208.22 L 89.38,208.63 L 88.5,209.11 L 87.68,209.66 L 86.9,210.28 L 86.17,210.97 L 85.84,211.34 A 0.62 0.62 0 0 1 85.07,211.46 L 10.5,168.4 A 3 3 0 0 1 9,165.81 L 9,130 A 3 3 0 0 1 12,127 L 178,127 A 3 3 0 0 1 181,130 Z',
  },
  {
    name: 'red', y1: 103, y2: 15.7, stops: ['#f2958c', '#f25e4f', '#9e372e'],
    d: 'M 19,100 L 19,69.97 A 3 3 0 0 1 20.5,67.37 L 99.6,21.7 A 0.99 0.99 0 0 1 100.49,21.65 L 100.95,21.85 L 101.89,22.16 L 102.86,22.4 L 103.84,22.56 L 104.84,22.64 L 105.84,22.63 L 106.83,22.54 L 107.81,22.37 L 108.77,22.11 L 109.71,21.78 L 110.62,21.37 L 111.5,20.89 L 112.32,20.34 L 113.1,19.72 L 113.83,19.03 L 114.16,18.66 A 0.62 0.62 0 0 1 114.93,18.54 L 189.5,61.6 A 3 3 0 0 1 191,64.19 L 191,100 A 3 3 0 0 1 188,103 L 22,103 A 3 3 0 0 1 19,100 Z',
  },
];

/**
 * The super-vote mark: an S across a hexagon, greens on one side and reds on
 * the other, as on a majority judgment scale, lightest along the S's middle
 * stroke, the median. Its frame and the paper take the --logo-* tokens, so it
 * keeps its outline on a dark page; the greens and reds keep their colours.
 * Decorative: the name super-vote always stands beside it.
 */
export default function Logo({ className = 'logo' }: { className?: string }) {
  const id = useId(); // two marks on a page must not share their gradients
  const url = (name: string) => `url(#${id}${name})`;

  return (
    <svg className={className} viewBox="-15 14 230 202" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}paper`} x1="-0.5" y1="115" x2="200.5" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0.345" style={{ stopColor: 'var(--logo-paper-start)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-paper-end)' }} />
        </linearGradient>
        <linearGradient id={`${id}frame`} x1="-0.5" y1="115" x2="200.5" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--logo-frame-start)' }} />
          <stop offset="1" style={{ stopColor: 'var(--logo-frame-end)' }} />
        </linearGradient>
        {HALVES.map((half) => (
          <linearGradient
            key={half.name} id={`${id}${half.name}`} x1="100" y1={half.y1} x2="100" y2={half.y2} gradientUnits="userSpaceOnUse"
          >
            {half.stops.map((color, i) => <stop key={color} offset={i / (half.stops.length - 1)} stopColor={color} />)}
          </linearGradient>
        ))}
      </defs>
      <g transform="rotate(30 100 115)">
        <path d={PAPER} fill={url('paper')} />
        {HALVES.map((half) => <path key={half.name} d={half.d} fill={url(half.name)} />)}
        <g fill="none" stroke={url('frame')} strokeLinecap="round" strokeLinejoin="round">
          <path d={S} strokeWidth="15" />
          <path d={SIDES} strokeWidth="5" />
        </g>
      </g>
    </svg>
  );
}
