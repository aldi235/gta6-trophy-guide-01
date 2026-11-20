// Rendering the roadmap to the platinum: ordered stages, each with its time,
// what to do, and the trophies it covers — ticked off where the player has
// already earned them in the checklist.
export function renderRoadmap(roadmap, earnedIds, trophyByName) {
  const stages = document.getElementById('roadmap-stages');
  stages.replaceChildren();
  for (const stage of roadmap.stages) {
    const item = document.createElement('li');
    item.className = `roadmap-stage${stage.warning ? ' warning' : ''}`;
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    item.append(heading);
    const time = document.createElement('p');
    time.className = 'roadmap-time';
    time.textContent = stage.time;
    item.append(time);
    const detail = document.createElement('p');
    detail.className = 'roadmap-detail';
    detail.textContent = stage.detail;
    item.append(detail);
    const names = document.createElement('ul');
    names.className = 'roadmap-trophies';
    for (const name of stage.items) {
      const trophy = trophyByName(name);
      const chip = document.createElement('li');
      chip.textContent = name;
      if (trophy && earnedIds.has(trophy.id)) chip.className = 'done';
      names.append(chip);
    }
    item.append(names);
    stages.append(item);
  }
}
