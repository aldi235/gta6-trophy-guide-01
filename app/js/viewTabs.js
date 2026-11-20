// Switching between the two views — Checklist and Roadmap to Platinum — and
// keeping the address hash in step so a view can be linked to directly.
export function currentViewFromHash() {
  return window.location.hash === '#roadmap' ? 'roadmap' : 'checklist';
}

export function showView(view) {
  const checklistTab = document.getElementById('view-checklist');
  const roadmapTab = document.getElementById('view-roadmap');
  const checklistView = document.getElementById('checklist-view');
  const roadmapView = document.getElementById('roadmap-view');
  const toolbar = document.getElementById('toolbar');
  const showingRoadmap = view === 'roadmap';
  checklistTab.classList.toggle('active', !showingRoadmap);
  roadmapTab.classList.toggle('active', showingRoadmap);
  checklistTab.setAttribute('aria-pressed', String(!showingRoadmap));
  roadmapTab.setAttribute('aria-pressed', String(showingRoadmap));
  checklistView.hidden = showingRoadmap;
  roadmapView.hidden = !showingRoadmap;
  toolbar.style.display = showingRoadmap ? 'none' : '';
  if (showingRoadmap) window.location.hash = '#roadmap';
  else if (window.location.hash === '#roadmap') window.history.replaceState(null, '', window.location.pathname);
}

export function wireViewTabs(onSwitch) {
  document.getElementById('view-checklist').addEventListener('click', () => { showView('checklist'); onSwitch(); });
  document.getElementById('view-roadmap').addEventListener('click', () => { showView('roadmap'); onSwitch(); });
  window.addEventListener('hashchange', () => { showView(currentViewFromHash()); onSwitch(); });
}
