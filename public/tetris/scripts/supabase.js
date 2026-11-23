const SUPABASE_URL = 'https://itabkkobpuvnbuqtqmjm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fE1mWFy21_s123CmXVUChQ_TrIiR_sv';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Submit a score
async function submitScore(results) {
  console.log(results);
  const { data, error } = await supabaseClient.from('scores').insert([results]);

  // if (error) {
  //   console.error('Error submitting score:', error);
  //   return false;
  // }
  //  if (error) {
  //         console.error('Supabase connection error:', error);
  //     } else {
  //         console.log('Supabase connected!', data);
  //     }
  //   return true;
  if (error) {
    console.error('Supabase submission error:', error);
    return false;
  }

  console.log('Score submitted:', data);
  return true;
}

// Retrieve the top 10 scores
async function getLeaderboard() {
  const { data, error } = await supabaseClient.from('scores').select('player_name, score, created_at').order('score', { ascending: false }).limit(10);

  if (error) {
    console.error('Error retrieving leaderboard:', error);
    return [];
  }

  return data;
}

window.submitScore = submitScore;
window.getLeaderboard = getLeaderboard;

async function displayLeaderboard() {
  const scores = await getLeaderboard();

  const leaderboardElement = document.getElementById('leaderboard-scores');

  if (!leaderboardElement) return;

  leaderboardElement.innerHTML = '';

  if (scores.length === 0) {
    leaderboardElement.innerHTML = `
      <tr>
        <td colspan="3">No scores yet!</td>
      </tr>
    `;
    return;
  }

  scores.forEach((entry, index) => {
    const row = document.createElement('tr');

    const rank = document.createElement('td');
    rank.textContent = index + 1;

    const player = document.createElement('td');
    player.textContent = entry.player_name;

    const score = document.createElement('td');
    score.textContent = entry.score;

    row.append(rank, player, score);
    leaderboardElement.appendChild(row);
  });
}

window.displayLeaderboard = displayLeaderboard;

document.addEventListener('DOMContentLoaded', () => {
  displayLeaderboard();
});
