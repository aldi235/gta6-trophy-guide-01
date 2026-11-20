// Rendering the checklist: one card per trophy with its official name,
// description and grade, a checkbox, its kind and flags, and a guide with its
// sources behind a toggle. Also the progress bar and the per-grade counts.
import { isSpoilerMasked, maskedName, maskedDescription, maskedGuideNote } from './spoilerGuard.js';

const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

export function renderProgress(trophies, earnedIds) {
  document.getElementById('earned-count').textContent = earnedIds.size;
  document.getElementById('total-count').textContent = trophies.length;
  const bar = document.getElementById('progress-bar');
  const fill = document.getElementById('progress-fill');
  const percent = trophies.length ? (earnedIds.size / trophies.length) * 100 : 0;
  fill.style.width = `${percent}%`;
  bar.setAttribute('aria-valuenow', String(earnedIds.size));
  bar.setAttribute('aria-valuemax', String(trophies.length));
  const counts = document.getElementById('grade-counts');
  counts.replaceChildren();
  for (const grade of GRADE_ORDER) {
    const total = trophies.filter((trophy) => trophy.grade === grade).length;
    const earned = trophies.filter((trophy) => trophy.grade === grade && earnedIds.has(trophy.id)).length;
    const item = document.createElement('li');
    item.className = grade;
    item.textContent = `${GRADE_LABELS[grade]} ${earned}/${total}`;
    counts.append(item);
  }
}

function buildTrophyCard(trophy, earnedIds, spoilersHidden, onToggleEarned) {
  const masked = isSpoilerMasked(trophy, earnedIds, spoilersHidden);
  const card = document.createElement('li');
  card.className = `trophy-card ${trophy.grade}${earnedIds.has(trophy.id) ? ' earned' : ''}`;
  card.dataset.trophyId = String(trophy.id);

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'trophy-check';
  check.checked = earnedIds.has(trophy.id);
  check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  check.addEventListener('change', () => onToggleEarned(trophy.id, check.checked));
  card.append(check);

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const name = document.createElement('h2');
  name.className = 'trophy-name';
  name.textContent = masked ? maskedName() : trophy.name;
  head.append(name);
  const grade = document.createElement('span');
  grade.className = 'grade-badge';
  grade.textContent = GRADE_LABELS[trophy.grade];
  head.append(grade);
  const kind = document.createElement('span');
  kind.className = 'kind-tag';
  kind.textContent = trophy.kind === 'side' ? 'side quest' : trophy.kind;
  head.append(kind);
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'flag missable';
    flag.textContent = 'Missable';
    head.append(flag);
  }
  if (trophy.hidden) {
    const flag = document.createElement('span');
    flag.className = 'flag hidden';
    flag.textContent = 'Hidden on PSN';
    head.append(flag);
  }
  if (trophy.guide.startsWith('No published guide')) {
    const flag = document.createElement('span');
    flag.className = 'flag unconfirmed';
    flag.textContent = 'Steps unconfirmed';
    head.append(flag);
  }
  card.append(head);

  const description = document.createElement('p');
  description.className = `trophy-desc${masked ? ' spoiler-hidden' : ''}`;
  description.textContent = masked ? maskedDescription() : trophy.description;
  card.append(description);

  const details = document.createElement('details');
  details.className = 'guide-toggle';
  const summary = document.createElement('summary');
  summary.textContent = masked ? 'Guide (hidden until earned)' : 'Guide & sources';
  details.append(summary);
  const guideText = document.createElement('p');
  guideText.className = 'guide-text';
  guideText.textContent = masked ? maskedGuideNote() : trophy.guide;
  details.append(guideText);
  if (!masked) {
    const sources = document.createElement('div');
    sources.className = 'guide-sources';
    const label = document.createElement('strong');
    label.textContent = 'Sources — where each fact came from:';
    sources.append(label);
    const list = document.createElement('ul');
    for (const source of trophy.sources) {
      const item = document.createElement('li');
      item.textContent = source;
      list.append(item);
    }
    sources.append(list);
    details.append(sources);
  }
  card.append(details);
  return card;
}

export function renderChecklist(trophies, visible, earnedIds, spoilersHidden, onToggleEarned) {
  const list = document.getElementById('trophy-list');
  list.replaceChildren();
  for (const trophy of visible) {
    list.append(buildTrophyCard(trophy, earnedIds, spoilersHidden, onToggleEarned));
  }
  const empty = document.getElementById('empty-note');
  empty.hidden = visible.length > 0;
  const note = document.getElementById('filter-note');
  note.textContent = visible.length === trophies.length
    ? `Showing all ${trophies.length} trophies.`
    : `Showing ${visible.length} of ${trophies.length} trophies.`;
}
