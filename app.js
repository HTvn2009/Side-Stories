const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const episodeHeading = document.querySelector('.episodes-heading');
const episodeList = document.querySelector('.episode-list');
const articleView = document.querySelector('.article-view');
const articleKicker = document.querySelector('.article-kicker');
const articleTitle = document.querySelector('.article-title');
const articleBody = document.querySelector('.article-body');
const previousEpisodeButton = document.querySelector('.previous-episode');
const nextEpisodeButton = document.querySelector('.next-episode');
const previousEpisodeTitle = document.querySelector('.previous-episode-title');
const nextEpisodeTitle = document.querySelector('.next-episode-title');

function updateEpisodeNavigation(number) {
  const episodes = window.EPISODE_CONTENT || [];
  const currentIndex = episodes.findIndex((item) => item.number === Number(number));
  const previousEpisode = episodes[currentIndex - 1];
  const nextEpisode = episodes[currentIndex + 1];

  previousEpisodeButton.disabled = !previousEpisode;
  previousEpisodeButton.dataset.episode = previousEpisode?.number || '';
  previousEpisodeTitle.textContent = previousEpisode ? `Episode ${String(previousEpisode.number).padStart(2, '0')}` : 'First episode';

  nextEpisodeButton.disabled = !nextEpisode;
  nextEpisodeButton.dataset.episode = nextEpisode?.number || '';
  nextEpisodeTitle.textContent = nextEpisode ? `Episode ${String(nextEpisode.number).padStart(2, '0')}` : 'Last episode';
}

function activateTab(name, updateHash = true) {
  const nextTab = tabs.find((tab) => tab.dataset.tab === name) || tabs[0];

  tabs.forEach((tab) => {
    const active = tab === nextTab;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    const active = panel.id === nextTab.dataset.tab;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });

  if (updateHash) history.replaceState(null, '', `#${nextTab.dataset.tab}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showEpisode(number, updateHash = true) {
  const episode = (window.EPISODE_CONTENT || []).find((item) => item.number === Number(number));
  activateTab('episodes', false);
  episodeHeading.hidden = true;
  episodeList.hidden = true;
  articleView.hidden = false;
  articleBody.replaceChildren();
  updateEpisodeNavigation(number);

  if (!episode) {
    articleKicker.textContent = 'Episode unavailable';
    articleTitle.textContent = 'This episode could not be loaded.';
    const message = document.createElement('p');
    message.className = 'article-missing';
    message.textContent = 'Return to the archive and choose another episode.';
    articleBody.append(message);
    return;
  }

  articleKicker.textContent = `Episode ${String(episode.number).padStart(2, '0')}`;
  articleTitle.textContent = episode.title;

  for (let index = 0; index < episode.blocks.length; index += 1) {
    const block = episode.blocks[index];

    if (block.type === 'image') {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const possibleCaption = episode.blocks[index + 1];
      const possibleSource = episode.blocks[index + 2];
      const hasCaption = possibleCaption?.type === 'paragraph' && possibleSource?.type === 'source';

      image.src = block.src;
      image.loading = 'lazy';
      image.alt = hasCaption ? possibleCaption.text : `Illustration for ${episode.title}`;
      figure.append(image);

      if (hasCaption) {
        const caption = document.createElement('figcaption');
        const label = document.createElement('span');
        const source = document.createElement('a');
        label.textContent = possibleCaption.text;
        source.href = possibleSource.text;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = 'View source ↗';
        caption.append(label, source);
        figure.append(caption);
        index += 2;
      }

      articleBody.append(figure);
      continue;
    }

    if (block.type === 'source') {
      const link = document.createElement('a');
      link.className = 'article-source';
      link.href = block.text;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `Source: ${block.text}`;
      articleBody.append(link);
      continue;
    }

    const paragraph = document.createElement('p');
    paragraph.textContent = block.text;
    articleBody.append(paragraph);
  }

  if (updateHash) history.replaceState(null, '', `#episode-${episode.number}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showEpisodeList(updateHash = true) {
  articleView.hidden = true;
  episodeHeading.hidden = false;
  episodeList.hidden = false;
  if (updateHash) history.replaceState(null, '', '#episodes');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (tab.dataset.tab === 'episodes') showEpisodeList(false);
    activateTab(tab.dataset.tab);
  });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    activateTab(tabs[next].dataset.tab);
  });
});

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.go));
});

document.querySelectorAll('.read-button').forEach((button) => {
  button.addEventListener('click', () => {
    const label = button.closest('.episode-card').querySelector('.episode-number').textContent;
    showEpisode(Number(label.match(/\d+/)?.[0]));
  });
});

document.querySelector('.back-button').addEventListener('click', () => showEpisodeList());

[previousEpisodeButton, nextEpisodeButton].forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.episode) showEpisode(Number(button.dataset.episode));
  });
});

function routeFromHash() {
  const route = location.hash.slice(1);
  const episodeMatch = route.match(/^episode-(\d+)$/);
  if (episodeMatch) showEpisode(Number(episodeMatch[1]), false);
  else {
    showEpisodeList(false);
    activateTab(route || 'mainmenu', false);
  }
}

window.addEventListener('hashchange', routeFromHash);
routeFromHash();
