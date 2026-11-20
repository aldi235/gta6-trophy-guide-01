// Loading the guide's own data: two JSON files that live under app/data/ and are
// fetched with relative paths, so the app works with the network off.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  const document = await response.json();
  return document.trophies;
}

export async function loadRoadmap() {
  const response = await fetch('data/roadmap.json');
  return response.json();
}

export function trophyByName(trophies, name) {
  return trophies.find((trophy) => trophy.name === name);
}
