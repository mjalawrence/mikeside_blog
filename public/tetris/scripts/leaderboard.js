export async function submitGameScore(results) {
  try {
    const success = await window.submitScore(results);
    if (success) await window.displayLeaderboard();
    return Boolean(success);
  } catch (error) {
    console.error('Leaderboard submission failed:', error);
    return false;
  }
}

export async function prepareScore(game) {
  const nameInput = document.getElementById('name');
  const playerName = nameInput?.value.trim() ?? '';

  if (!playerName) {
    if (nameInput) {
      nameInput.focus();
      nameInput.setCustomValidity('Please enter your name.');
      nameInput.reportValidity();
      nameInput.addEventListener('input', () => nameInput.setCustomValidity(''), { once: true });
    }
    return false;
  }

  const gameDuration = game.gameStartTime ? Math.floor((Date.now() - game.gameStartTime) / 1000) : 0;
  console.log(`Game duration: ${gameDuration} seconds`);

  const results = {
    player_name: playerName,
    score: game.score,
    level: game.level,
    top_speed: game.speed,
    rows_cleared: game.rowsCleared,
    duration: game.gameDuration ?? gameDuration,
  };

  return submitGameScore(results);
}
