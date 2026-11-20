// Filtering the checklist: by kind (story, missable, collectibles, activities,
// side quests, crime, completion, online), by grade, by earned state, and by a
// search over the name, description and guide text.
export const KIND_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'missable', label: 'Missable' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'side', label: 'Side quests' },
  { key: 'crime', label: 'Crime' },
  { key: 'completion', label: 'Completion' },
  { key: 'online', label: 'Online' },
];

export function countForKind(trophies, kindKey) {
  if (kindKey === 'all') return trophies.length;
  if (kindKey === 'missable') return trophies.filter((trophy) => trophy.missable).length;
  if (kindKey === 'online') return 0;
  return trophies.filter((trophy) => trophy.kind === kindKey).length;
}

export function applyTrophyFilters(trophies, filters, earnedIds) {
  const query = filters.search.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.kind === 'missable' && !trophy.missable) return false;
    if (filters.kind === 'online') return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && filters.kind !== 'online' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.earned === 'earned' && !earnedIds.has(trophy.id)) return false;
    if (filters.earned === 'unearned' && earnedIds.has(trophy.id)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}
