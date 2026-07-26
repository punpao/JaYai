/* จ่าใหญ่ (Ja Yai) — pixel-art mascot, drawn in code.
   Each pose is a 24×26 character grid; chars map to palette colors.
   Rendered as merged-run <rect>s with crispEdges so it scales sharply. */

const PAL = {
  K: '#171008', // outline
  H: '#2a1a0a', // hair
  h: '#43290f', // hair shine
  S: '#f2a964', // skin
  s: '#d18646', // skin shadow
  W: '#ffffff', // eye white
  E: '#1c1206', // pupil
  M: '#9a9284', // mustache
  m: '#7c7466', // mustache shadow
  U: '#6b4423', // uniform brown
  u: '#462b13', // uniform dark / trim
  L: '#83572f', // uniform light
  B: '#f7d047', // badge gold
  b: '#c79e2b', // gold shadow
  G: '#a9afb8', // buckle / metal gray
  g: '#7d838d', // metal shadow
  C: '#6eedfc', // cyan accent
  D: '#2743a8', // shield blue
  d: '#11015a', // shield dark (badge indigo)
  P: '#eef0f3', // paper
  p: '#c3c8d2', // paper shadow
  N: '#a0703f', // clipboard board
  Y: '#ffe873', // bulb glow
};

const W = 24;

/* ---- head (rows 0..11), shared by all poses ---- */
const HEAD = [
  '........HHHHHHHH........',
  '.......HHHHHHHHHH.......',
  '......HHhhHHHHHHHH......',
  '......HHhHHHHHHHHH......',
  '......HHSSSSSSSSHH......',
  '......HSSSSSSSSSSH......',
  '......HSHHSSSSHHSH......',
  '......HSEESSSSEESH......',
  '......HsSSSssSSSsH......',
  '......HSSMMMMMMSSH......',
  '......HSMMMMMMMMSH......',
  '.......HSSsmmsSSH.......',
];

/* ---- torsos (rows 12..25), one per pose ---- */
const TORSO = {
  // arms at sides (base for patched poses)
  base: [
    '.........uSSSSu.........',
    '.......UUuSSSSuUU.......',
    '.....UUUUUuuuuUUUUU.....',
    '....UUUUUUUUUUUUUUUU....',
    '....UUBBUUUUUUUUUUUU....',
    '....UUUuUUUUUUUUuUUU....',
    '....UUUuUUUUUUUUuUUU....',
    '....UUUuUUUUUUUUuUUU....',
    '....SSUuUUUUUUUUuUSS....',
    '.....uuuuuuGGuuuuuu.....',
    '......uuuuuuuuuuuu......',
    '......uuuuuuuuuuuu......',
    '........................',
    '........................',
  ],
  // arms crossed over chest
  crossed: [
    '.........uSSSSu.........',
    '.......UUuSSSSuUU.......',
    '.....UUUUUuuuuUUUUU.....',
    '....UUUUUUUUUUUUUUUU....',
    '....UUBBUUUUUUUUUUUU....',
    '....UUUULLLLLLLLUUUU....',
    '....UUSLLLLLLLLLLSUU....',
    '....UUSSLLLLLLLLSSUU....',
    '....UUUUUUUUUUUUUUUU....',
    '.....uuuuuuGGuuuuuu.....',
    '......uuuuuuuuuuuu......',
    '......uuuuuuuuuuuu......',
    '........................',
    '........................',
  ],
};

/* helper: overlay patch rows onto a grid (non-dot chars win) */
function patch(grid, patches) {
  const out = grid.map((r) => r.split(''));
  for (const { x, y, rows } of patches) {
    rows.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        const ch = row[dx];
        if (ch !== '.') out[y + dy][x + dx] = ch;
      }
    });
  }
  return out.map((r) => r.join(''));
}

function full(torso, patches = []) {
  const grid = [...HEAD, ...torso];
  return patches.length ? patch(grid, patches) : grid;
}

/* ---- poses ---- */
const POSES = {
  // verdict / no-nonsense chief
  crossed: () => full(TORSO.crossed),

  // thumbs up (right fist raised beside shoulder, thumb up)
  thumbs: () =>
    full(TORSO.base, [
      {
        x: 17,
        y: 9,
        rows: ['.Ss', 'SSs', 'SSs', 'sSs', 'uUU', '.UU'],
      },
    ]),

  // pointing up-left (advice / nudge)
  point: () =>
    full(TORSO.base, [
      {
        x: 1,
        y: 7,
        rows: ['S....', 'Ss...', 'sS...', '.UU..', '.UU..', '..UU.', '..UU.', '..UUU'],
      },
    ]),

  // salute (right hand at the brow)
  salute: () =>
    full(TORSO.base, [
      {
        x: 15,
        y: 5,
        rows: ['.SSs.', '.sSU.', '...UU', '...UU', '...UU', '...UU', '...UU', '...UU', '..UU.', '..UU.'],
      },
    ]),

  // magnifying glass in left hand (investigating)
  magnify: () =>
    full(TORSO.base, [
      {
        x: 0,
        y: 4,
        rows: [
          '.GGG..',
          'GWWCG.',
          'GWCCG.',
          'GCCCG.',
          '.GGG..',
          '...GG.',
          '....Gs',
          '....SS',
          '....Su',
          '....uU',
          '.....U',
        ],
      },
    ]),

  // holding clipboard with both hands
  clipboard: () =>
    full(TORSO.base, [
      {
        x: 4,
        y: 14,
        rows: [
          '..NGGN..',
          '.NPPPPN.',
          '.NPpPpN.',
          '.NPPPPN.',
          '.NPpPPN.',
          '.NPPPPN.',
          'SNNNNNNS',
        ],
      },
    ]),

  // lightbulb idea (raised right hand, glowing bulb)
  bulb: () =>
    full(TORSO.base, [
      {
        x: 16,
        y: 0,
        rows: [
          'Y.Y.Y',
          '.BBB.',
          'YBBBY',
          '.BBB.',
          '..G..',
          '..G..',
          '.sS..',
          '.SS..',
          '.Su..',
          '.uU..',
          '.UU..',
          '.UU..',
          '.UU..',
          '.UU..',
        ],
      },
    ]),

  // holding shield badge (protection / erasure)
  shield: () =>
    full(TORSO.base, [
      {
        x: 0,
        y: 12,
        rows: ['.DDDD.', 'DDBBDD', 'DdBBdD', 'DddddD', '.DddD.', '..DDSs', '....SS', '....uU', '.....U'],
      },
    ]),

  // thinking (hand at chin)
  think: () =>
    full(TORSO.base, [
      {
        x: 15,
        y: 10,
        rows: ['.SSs', '.sSs', '..UU', '..UU', '.UU.', '.UU.'],
      },
    ]),
};

export const JAYAI_POSES = Object.keys(POSES);

/* render a pose to an SVG string; merges horizontal runs into single rects */
export function jaYaiSVG(pose, { className = '', title = 'จ่าใหญ่' } = {}) {
  const grid = (POSES[pose] || POSES.crossed)();
  const H = grid.length;
  let rects = '';
  grid.forEach((row, y) => {
    if (row.length !== W) throw new Error(`jayai: row ${y} of "${pose}" is ${row.length} wide, expected ${W}`);
    let x = 0;
    while (x < W) {
      const ch = row[x];
      if (ch === '.' || !PAL[ch]) { x++; continue; }
      let run = 1;
      while (x + run < W && row[x + run] === ch) run++;
      rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PAL[ch]}"/>`;
      x += run;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}" class="jayai ${className}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

/* convenience: mount into an element */
export function mountJaYai(el, pose, opts) {
  el.innerHTML = jaYaiSVG(pose, opts);
}
