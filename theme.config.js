/** @type {const} */
const themeColors = {
  primary:    { light: '#0D47A1', dark: '#1E88E5' }, // Deep blue actions
  accent:     { light: '#0097A7', dark: '#00BCD4' }, // Teal accent (was secondary)
  secondary:  { light: '#0097A7', dark: '#00BCD4' }, // Kept for backward-compat
  tertiary:   { light: '#6A1B9A', dark: '#7C4DFF' }, // Purple highlight
  // ─── Backgrounds ──────────────────────────────
  background: { light: '#F5F7FA', dark: '#0D1B2A' }, // Calm Light / Deep Ocean
  surface:    { light: '#FFFFFF', dark: '#1A2F45' }, // Cards
  overlay:    { light: '#00000033', dark: '#0D1B2ACC' }, // Modal backdrop
  // ─── Text ─────────────────────────────────────
  foreground: { light: '#1A2F45', dark: '#E8F0F7' }, // Primary text
  muted:      { light: '#5A6F85', dark: '#7A8FA3' }, // Secondary text (better dark contrast)
  // ─── Structure ────────────────────────────────
  border:     { light: '#D8E5F0', dark: '#2A3F54' }, // Separators
  tint:       { light: '#0D47A1', dark: '#1E88E5' }, // Tint (matches primary)
  // ─── Semantic ─────────────────────────────────
  success:    { light: '#2E7D32', dark: '#4CAF50' }, // Green calm
  warning:    { light: '#E65100', dark: '#FF9800' }, // Orange professional
  error:      { light: '#C62828', dark: '#F44336' }, // Red

  // Deep Ocean (Dark Mode - Padrão)
  primary:    { light: '#0D47A1', dark: '#1E88E5' },
  accent:     { light: '#0097A7', dark: '#00BCD4' },
  secondary:  { light: '#6A1B9A', dark: '#7C4DFF' },
  background: { light: '#F5F7FA', dark: '#0D1B2A' },
  surface:    { light: '#FFFFFF', dark: '#1A2F45' },
  foreground: { light: '#1A2F45', dark: '#E8F0F7' },
  muted:      { light: '#5A6F85', dark: '#7A8FA3' },
  border:     { light: '#D8E5F0', dark: '#2A3F54' },
  success:    { light: '#2E7D32', dark: '#4CAF50' },
  warning:    { light: '#E65100', dark: '#FF9800' },
  error:      { light: '#C62828', dark: '#F44336' },
  tint:       { light: '#0097A7', dark: '#00BCD4' },
};

module.exports = { themeColors };
