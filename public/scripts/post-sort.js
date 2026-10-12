
const list = document.getElementById('post-list');

function sortBy(attr) {

  if (!list) return;

  const items = [...list.children];

  if (attr === 'builddate') {
    items.sort(
      (a, b) =>
        Number(a.dataset.builddate) - Number(b.dataset.builddate)
    );
  } else if (attr === 'pubdate') {
    items.sort(
      (a, b) =>
        Number(b.dataset.pubdate) - Number(a.dataset.pubdate)
    );
  }

  list.replaceChildren(...items);
}

document.getElementById("sort-select").value = "buildDate";

document
  .getElementById('pubSort')
  ?.addEventListener('click', () => sortBy('pubdate'));

document
  .getElementById('buildSort')
  ?.addEventListener('click', () => sortBy('builddate'));