
const list = document.getElementById('post-list');

function sortBy(attr) {
    console.log(list)
    console.log(attr)
  if (!list) return;

  const items = [...list.children];

  console.log(items)
items.sort(
  (a, b) =>
    Number(a.dataset[attr]) - Number(b.dataset[attr]) 
);

  list.replaceChildren(...items);
}

document
  .getElementById('pubSort')
  ?.addEventListener('click', () => sortBy('pubdate'));

document
  .getElementById('buildSort')
  ?.addEventListener('click', () => sortBy('builddate'));