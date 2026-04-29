const PALETTE = ['#e50914','#b91c1c','#c2410c','#b45309','#047857','#0369a1','#4338ca','#7c3aed','#a21caf','#be185d'];

export function avatarBg(seed: string): string {
  let h = 0;
  for (const c of seed) h = c.charCodeAt(0) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function avatarInitials(name: string): string {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}
