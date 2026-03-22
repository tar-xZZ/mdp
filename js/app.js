/* ─── Jeux de caractères ─────────────────────────── */
const SETS = {
  upper:    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:    'abcdefghijklmnopqrstuvwxyz',
  digits:   '0123456789',
  sym:      '!@#$%^&*;:,.<>?/|~`"\'=+',
  minus:    '-',
  under:    '_',
  space:    ' ',
  brackets: '[]{}()<>',
  latin:    'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ',
  ambig:    '0O1lI'
};

/* ─── Construction de l'alphabet ─────────────────── */
function getAlphabet() {
  let s = '';
  document.querySelectorAll('#opts .opt').forEach(el => {
    if (el.classList.contains('on')) s += SETS[el.dataset.key] || '';
  });
  s += document.getElementById('customChars').value;
  return [...new Set(s.split(''))].join('');
}

/* ─── Génération cryptographique ─────────────────── */
function generate() {
  const len   = parseInt(document.getElementById('lenSlider').value);
  const alpha = getAlphabet();

  if (!alpha.length) {
    document.getElementById('pwdDisplay').textContent = '⚠ Sélectionnez au moins un jeu';
    return;
  }

  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);

  let pwd = '';
  for (let i = 0; i < len; i++) pwd += alpha[arr[i] % alpha.length];

  document.getElementById('pwdDisplay').textContent = pwd;
  analyze(pwd, alpha.length);
}

/* ─── Analyse de sécurité ────────────────────────── */
function analyze(pwd, alphaSize) {
  const len     = pwd.length;
  const entropy = len * Math.log2(alphaSize);

  document.getElementById('mBits').textContent  = Math.round(entropy);
  document.getElementById('mAlpha').textContent = alphaSize;
  document.getElementById('mComb').textContent  = formatComb(entropy);

  updateStrengthBar(entropy);
  updateCrackTime(entropy);
}

function formatComb(entropy) {
  if (entropy < 53) {
    const n = Math.pow(2, entropy);
    return n < 1e6
      ? Math.round(n).toLocaleString('fr')
      : n.toExponential(2);
  }
  return '2^' + Math.round(entropy);
}

function updateStrengthBar(entropy) {
  const pct  = Math.min(100, (entropy / 128) * 100);
  const bar  = document.getElementById('barFill');
  bar.style.width = pct.toFixed(1) + '%';

  let color, label;
  if      (entropy < 28)  { color = '#E24B4A'; label = 'Très faible — craquable en secondes'; }
  else if (entropy < 36)  { color = '#EF9F27'; label = 'Faible — craquable rapidement'; }
  else if (entropy < 60)  { color = '#BA7517'; label = 'Moyen — résiste quelques heures'; }
  else if (entropy < 80)  { color = '#639922'; label = 'Bon — résiste des années'; }
  else if (entropy < 100) { color = '#1D9E75'; label = 'Fort — résiste des millénaires'; }
  else                    { color = '#7F77DD'; label = 'Exceptionnel — inattaquable en pratique'; }

  bar.style.backgroundColor = color;
  document.getElementById('strengthLabel').textContent = label;
}

function updateCrackTime(entropy) {
  const GPU_PER_SEC = 1e9;
  const secs = Math.pow(2, entropy) / 2 / GPU_PER_SEC;

  document.getElementById('mCrack').textContent    = formatTime(secs);
  document.getElementById('mCrackSub').textContent = 'scénario moyen, attaque brute force';
}

/* ─── Formatage du temps ─────────────────────────── */
function formatTime(s) {
  if (!isFinite(s) || s > 1e30) return '> âge de l\'univers ×10²⁰';
  if (s < 1)                    return '< 1 seconde';
  if (s < 60)                   return Math.round(s) + ' secondes';
  if (s < 3600)                 return Math.round(s / 60) + ' minutes';
  if (s < 86400)                return Math.round(s / 3600) + ' heures';
  if (s < 365.25 * 86400)       return Math.round(s / 86400) + ' jours';

  const y = s / (365.25 * 86400);
  if (y < 1e3)  return Math.round(y) + ' ans';
  if (y < 1e6)  return (y / 1e3).toFixed(1) + ' milliers d\'ans';
  if (y < 1e9)  return (y / 1e6).toFixed(1) + ' millions d\'ans';
  if (y < 1e12) return (y / 1e9).toFixed(1) + ' milliards d\'ans';
  return '> ' + y.toExponential(1) + ' ans';
}

/* ─── Copier dans le presse-papiers ──────────────── */
function copyPassword() {
  const txt = document.getElementById('pwdDisplay').textContent;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copié !';
    setTimeout(() => btn.textContent = 'Copier', 1500);
  });
}

/* ─── Listeners ──────────────────────────────────── */
document.getElementById('lenSlider').addEventListener('input', function () {
  document.getElementById('lenVal').textContent = this.value;
  generate();
});

document.querySelectorAll('#opts .opt').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('on');
    generate();
  });
});

document.getElementById('customChars').addEventListener('input', generate);
document.getElementById('genBtn').addEventListener('click', generate);
document.getElementById('copyBtn').addEventListener('click', copyPassword);

/* ─── Init ───────────────────────────────────────── */
generate();
