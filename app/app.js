// Leonida Trophy Guide — bootstrap. Loads the trophy data and the roadmap,
// wires the filters, the spoiler setting, the progress store and the view tabs,
// and re-renders whenever anything changes.
import { loadTrophies, loadRoadmap, trophyByName } from './js/loadData.js';
import { loadEarnedIds, saveEarnedIds, loadSpoilersHidden, saveSpoilersHidden, buildExportFile, downloadExportFile, parseImportFile } from './js/progressStore.js';
import { KIND_FILTERS, countForKind, applyTrophyFilters } from './js/trophyFilters.js';
import { renderChecklist, renderProgress } from './js/renderChecklist.js';
import { renderRoadmap } from './js/renderRoadmap.js';
import { currentViewFromHash, showView, wireViewTabs } from './js/viewTabs.js';

const trophies = await loadTrophies();
const roadmap = await loadRoadmap();
const knownIds = new Set(trophies.map((trophy) => trophy.id));

let earnedIds = loadEarnedIds();
let spoilersHidden = loadSpoilersHidden();
const filters = { kind: 'all', grade: 'all', earned: 'all', search: '' };

function renderAll() {
  const visible = applyTrophyFilters(trophies, filters, earnedIds);
  renderProgress(trophies, earnedIds);
  renderChecklist(trophies, visible, earnedIds, spoilersHidden, toggleEarned);
  renderRoadmap(roadmap, earnedIds, (name) => trophyByName(trophies, name));
  document.getElementById('empty-note').textContent = filters.kind === 'online'
    ? 'No online trophies — the whole list is single-player. Every one of the 55 can be earned offline.'
    : 'No trophies match these filters. Try clearing the search or picking another kind.';
}

function toggleEarned(trophyId, earned) {
  if (earned) earnedIds.add(trophyId);
  else earnedIds.delete(trophyId);
  saveEarnedIds(earnedIds);
  renderAll();
}

function buildKindFilterButtons() {
  const container = document.getElementById('kind-filters');
  for (const kind of KIND_FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `kind-button${kind.key === filters.kind ? ' active' : ''}`;
    button.dataset.kind = kind.key;
    button.textContent = `${kind.label} `;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = `(${countForKind(trophies, kind.key)})`;
    button.append(count);
    button.addEventListener('click', () => {
      filters.kind = kind.key;
      container.querySelectorAll('.kind-button').forEach((other) => other.classList.toggle('active', other === button));
      renderAll();
    });
    container.append(button);
  }
}

function wireControls() {
  document.getElementById('search').addEventListener('input', (event) => {
    filters.search = event.target.value;
    renderAll();
  });
  document.getElementById('grade-filter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderAll();
  });
  document.getElementById('earned-filter').addEventListener('change', (event) => {
    filters.earned = event.target.value;
    renderAll();
  });
  const spoilerToggle = document.getElementById('spoiler-toggle');
  spoilerToggle.checked = spoilersHidden;
  spoilerToggle.addEventListener('change', () => {
    spoilersHidden = spoilerToggle.checked;
    saveSpoilersHidden(spoilersHidden);
    renderAll();
  });
  document.getElementById('export-progress').addEventListener('click', () => {
    downloadExportFile(buildExportFile(earnedIds, spoilersHidden));
  });
  document.getElementById('import-progress').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = parseImportFile(await file.text(), knownIds);
      earnedIds = imported.earnedIds;
      if (imported.spoilersHidden !== null) {
        spoilersHidden = imported.spoilersHidden;
        spoilerToggle.checked = spoilersHidden;
        saveSpoilersHidden(spoilersHidden);
      }
      saveEarnedIds(earnedIds);
      renderAll();
    } catch {
      alert('That file is not a Leonida Trophy Guide progress export.');
    }
    event.target.value = '';
  });
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Clear all earned trophies?')) {
      earnedIds = new Set();
      saveEarnedIds(earnedIds);
      renderAll();
    }
  });
}

buildKindFilterButtons();
wireControls();
wireViewTabs(renderAll);
showView(currentViewFromHash());
renderAll();
