// The player's progress: which trophies are earned, kept in localStorage and
// movable to and from a file. Nothing here ever leaves the browser except
// through the export the player asks for.
const PROGRESS_KEY = 'leonida-trophy-guide-progress-v1';
const SPOILER_KEY = 'leonida-trophy-guide-spoilers-v1';

export function loadEarnedIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    return new Set(Array.isArray(stored) ? stored.filter((id) => Number.isInteger(id)) : []);
  } catch {
    return new Set();
  }
}

export function saveEarnedIds(earnedIds) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earnedIds]));
}

export function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) !== 'off';
}

export function saveSpoilersHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? 'on' : 'off');
}

export function buildExportFile(earnedIds, spoilersHidden) {
  return {
    app: 'Leonida Trophy Guide — GTA VI',
    exportedAt: new Date().toISOString(),
    spoilersHidden,
    earnedTrophyIds: [...earnedIds].sort((a, b) => a - b),
  };
}

export function downloadExportFile(exportData) {
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseImportFile(text, knownIds) {
  const parsed = JSON.parse(text);
  const rawIds = Array.isArray(parsed) ? parsed : parsed.earnedTrophyIds;
  if (!Array.isArray(rawIds)) throw new Error('not a progress file');
  const imported = new Set(rawIds.filter((id) => knownIds.has(id)));
  const spoilersHidden = parsed && typeof parsed.spoilersHidden === 'boolean' ? parsed.spoilersHidden : null;
  return { earnedIds: imported, spoilersHidden };
}
