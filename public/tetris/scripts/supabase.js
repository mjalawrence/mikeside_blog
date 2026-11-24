const SUPABASE_URL = 'https://itabkkobpuvnbuqtqmjm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fE1mWFy21_s123CmXVUChQ_TrIiR_sv';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function submitScore(results) {
  console.log(results);
  try {
    const { data, error } = await supabaseClient.from('scores').insert([results]);

    if (error) {
      console.error('Supabase score submission failed:', error);
      return false;
    }

    console.log('Score submitted:', data);
    return true;
  } catch (error) {
    console.error('Supabase request failed:', error);
    return false;
  }
}

async function getLeaderboard() {
  try {
    const { data, error } = await supabaseClient.from('scores').select('player_name, score, created_at').order('score', { ascending: false }).limit(10);

    if (error) {
      console.error('Error retrieving leaderboard:', error);
      return [];
    }
    return data ?? [];
  } catch (error) {
    console.error('Leaderboard request failed:', error);
    return [];
  }
}

async function displayLeaderboard() {
  const scores = await getLeaderboard();
  const leaderboardElement = document.getElementById('leaderboard-scores');
  if (!leaderboardElement) return;

  leaderboardElement.replaceChildren();

  if (scores.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'No scores yet!';
    row.appendChild(cell);
    leaderboardElement.appendChild(row);
    return;
  }

  scores.forEach((entry, index) => {
    const row = document.createElement('tr');
    const rank = document.createElement('td');
    const player = document.createElement('td');
    const score = document.createElement('td');

    rank.textContent = String(index + 1);
    player.textContent = entry.player_name ?? 'Anonymous';
    score.textContent = String(entry.score ?? 0);

    row.append(rank, player, score);
    leaderboardElement.appendChild(row);
  });
}

window.submitScore = submitScore;
window.getLeaderboard = getLeaderboard;
window.displayLeaderboard = displayLeaderboard;

document.addEventListener('DOMContentLoaded', displayLeaderboard);
