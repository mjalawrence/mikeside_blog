export async function submitGameScore(results) {
  try {
    const success = await window.submitScore(results);

    if (success) {
      await window.displayLeaderboard();
    }

    return success;
  } catch (error) {
    console.error('Leaderboard submission failed:', error);
    return false;
  }
}

export function prepareScore(game) {
  const playerName = document.getElementById('name').value.trim();
  const gameDuration = Math.floor((Date.now() - game.gameStartTime) / 1000);
  console.log(`Game duration: ${gameDuration} seconds`);
  const results = {
    player_name: playerName,
    score: game.score,
    level: game.level,
    top_speed: game.speed,
    rows_cleared: game.rowsCleared,
    duration: gameDuration,
  };

  submitGameScore(results);
}
