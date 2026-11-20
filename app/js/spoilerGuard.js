// The spoiler setting: while it is on, a story trophy the player has not earned
// yet shows a placeholder name and description, and its guide stays covered.
// Earned story trophies are never hidden — the player has already seen them.
export function isSpoilerMasked(trophy, earnedIds, spoilersHidden) {
  return spoilersHidden && trophy.kind === 'story' && !earnedIds.has(trophy.id);
}

export function maskedName() {
  return 'Hidden story trophy';
}

export function maskedDescription() {
  return 'Story trophy — its name and description stay hidden until you earn it. Tick the box once you have it in-game.';
}

export function maskedGuideNote() {
  return 'This guide stays covered until the trophy is earned, so the story stays unspoiled.';
}
