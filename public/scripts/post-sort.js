
const list = document.getElementById('post-list');

function sortBy(attr) {

  if (!list) return;

  const items = [...list.children];

items.sort(
  (a, b) =>
    Number(a.dataset[attr]) - Number(b.dataset[attr]) 
);

  list.replaceChildren(...items);
}

document.getElementById("sort-select").value = "buildDate";

document
  .getElementById('pubSort')
  ?.addEventListener('click', () => sortBy('pubdate'));

document
  .getElementById('buildSort')
  ?.addEventListener('click', () => sortBy('builddate'));