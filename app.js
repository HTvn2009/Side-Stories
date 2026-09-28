const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const episodeHeading = document.querySelector('.episodes-heading');
const episodeList = document.querySelector('.episode-list');
const articleView = document.querySelector('.article-view');
const articleEpisodeLabel = document.querySelector('.article-episode-label');
const articleDate = document.querySelector('.article-date');
const articleViews = document.querySelector('.article-views');
const articleViewCount = document.querySelector('.article-view-count');
const articleTitle = document.querySelector('.article-title');
const articleBody = document.querySelector('.article-body');
const previousEpisodeButton = document.querySelector('.previous-episode');
const nextEpisodeButton = document.querySelector('.next-episode');
const previousEpisodeTitle = document.querySelector('.previous-episode-title');
const nextEpisodeTitle = document.querySelector('.next-episode-title');
const commentsCount = document.querySelector('.comments-count');
const commentList = document.querySelector('.comment-list');
const episodeDates = {
  1: { datetime: '2025-09-07', label: '7 September 2025' },
  2: { datetime: '2025-10-14', label: '14 October 2025' },
  3: { datetime: '2025-11-20', label: '20 November 2025' },
  4: { datetime: '2025-12-08', label: '8 December 2025' },
  5: { datetime: '2026-01-12', label: '12 January 2026' },
  6: { datetime: '2026-02-01', label: '1 February 2026' },
  7: { datetime: '2026-03-03', label: '3 March 2026' },
  8: { datetime: '2026-04-20', label: '20 April 2026' },
  9: { datetime: '2026-05-28', label: '28 May 2026' },
  10: { datetime: '2026-06-22', label: '22 June 2026' },
  11: { datetime: '2026-07-09', label: '9 July 2026' },
  12: { datetime: '2026-08-05', label: '5 August 2026' },
};

const episodeViews = ['4976', '4815', '4265', '3157', '2348', '3157', '2583', '4012', '4491', '2910', '3784', '3519'];
const episodeComments = {
  1: [
    ['Minh Anh', '8 September 2025', '2025-09-08', 12, 'I agree that adaptations can expand a world without replacing the original novel.'],
    ['David Tran', '21 September 2025', '2025-09-21', 7, 'Could interactive games reveal parts of a story that films cannot?'],
    ['Linh Pham', '2 November 2025', '2025-11-02', 4, 'I agree that each medium should be appreciated for what it does best.'],
  ],
  2: [
    ['Mai Nguyen', '15 October 2025', '2025-10-15', 15, 'I agree that folklore gives Asian horror its strongest identity.'],
    ['Khoa Le', '30 October 2025', '2025-10-30', 9, 'Why do local ghost stories often feel scarier than invented monsters?'],
    ['Hana Kim', '9 December 2025', '2025-12-09', 5, 'I agree that cultural beliefs make these films feel more personal.'],
    ['Bao Tran', '12 December 2025', '2025-12-12', 3, 'Could modern horror preserve folklore without changing its meaning?'],
  ],
  3: [
    ['An Hoang', '21 November 2025', '2025-11-21', 6, 'I agree that a distinctive voice can refresh familiar fantasy ideas.'],
    ['Sarah Le', '5 December 2025', '2025-12-05', 8, 'Is oversaturation a problem with fantasy itself or with recommendation platforms?'],
    ['Nam Phan', '14 January 2026', '2026-01-14', 4, 'I agree that easier publishing creates both more variety and more repetition.'],
  ],
  4: [
    ['Sofia Williams', '9 December 2025', '2025-12-09', 11, 'I agree that classic fantasy still has valuable lessons for modern readers.'],
    ['Bao Chau', '27 December 2025', '2025-12-27', 5, 'Which classic fantasy book would you recommend to a beginner?'],
    ['Minh Khoa', '18 January 2026', '2026-01-18', 7, 'I agree that older stories often build wonder with remarkable restraint.'],
  ],
  5: [
    ['Quang Minh', '13 January 2026', '2026-01-13', 18, 'I agree that everyday customs make fictional cultures feel alive.'],
    ['Emily Carter', '29 January 2026', '2026-01-29', 10, 'How can writers borrow cultural inspiration without reducing it to decoration?'],
    ['Thao Vy', '20 February 2026', '2026-02-20', 3, 'I agree that architecture and food can reveal a world naturally.'],
    ['Alex Nguyen', '10 March 2026', '2026-03-10', 6, 'Should world building begin with history or with the people living in it?'],
  ],
  6: [
    ['Huy Tran', '2 February 2026', '2026-02-02', 8, 'I agree that emotional truth matters more than perfect realism.'],
    ['Nora Lee', '19 February 2026', '2026-02-19', 4, 'Can a fantasy world remain convincing if its magic has no clear rules?'],
    ['Duc Lam', '28 March 2026', '2026-03-28', 9, 'I agree that believable consequences make magic feel more powerful.'],
  ],
  7: [
    ['Tuan Dao', '4 March 2026', '2026-03-04', 14, 'I agree that copyright supports many people beyond the original author.'],
    ['Jenny Ho', '22 March 2026', '2026-03-22', 6, 'How can copyright protect creators without limiting cultural exchange?'],
    ['Gia Bao', '30 April 2026', '2026-04-30', 5, 'I agree that editors and translators are essential parts of the ecosystem.'],
  ],
  8: [
    ['Gia Han', '21 April 2026', '2026-04-21', 9, 'I agree that clear licensing gives publishers confidence to invest.'],
    ['Alex Morgan', '8 May 2026', '2026-05-08', 6, 'Could simpler licensing help smaller creators enter the market?'],
    ['Phuc Le', '3 June 2026', '2026-06-03', 4, 'I agree that fair rights can encourage more creative risks.'],
    ['Nina Vu', '18 June 2026', '2026-06-18', 7, 'How should a healthy market balance access and creator income?'],
  ],
  9: [
    ['Phuong Anh', '29 May 2026', '2026-05-29', 16, 'I agree that copyright can also protect translation quality.'],
    ['Daniel Kim', '15 June 2026', '2026-06-15', 7, 'How can readers identify a safe and properly licensed edition?'],
    ['Nhat Nam', '20 July 2026', '2026-07-20', 2, 'I agree that supporting official releases gives audiences more choice.'],
  ],
  10: [
    ['Yen Nhi', '23 June 2026', '2026-06-23', 13, 'I agree that illegal copies can put an entire licensed series at risk.'],
    ['Marcus Hill', '7 July 2026', '2026-07-07', 5, 'Do publishers clearly explain why some translated series are discontinued?'],
    ['Lan Anh', '14 August 2026', '2026-08-14', 8, 'I agree that individual choices can create a much larger market effect.'],
  ],
  11: [
    ['Duc Anh', '10 July 2026', '2026-07-10', 20, 'I agree that free content can carry a serious security cost.'],
    ['Hannah Vu', '28 July 2026', '2026-07-28', 11, 'What warning signs should readers look for on piracy websites?'],
    ['Long Phan', '19 August 2026', '2026-08-19', 6, 'I agree that malicious ads are often underestimated.'],
    ['Mai Linh', '7 September 2026', '2026-09-07', 9, 'Can antivirus software fully protect users from cracked files?'],
  ],
  12: [
    ['Kim Oanh', '6 August 2026', '2026-08-06', 17, 'I agree that following financial trails is fascinating detective work.'],
    ['James Nguyen', '18 August 2026', '2026-08-18', 8, 'How do investigators preserve digital evidence across different countries?'],
    ['Thanh Ha', '12 September 2026', '2026-09-12', 5, 'I agree that online and physical investigations must support each other.'],
    ['Robert Le', '25 September 2026', '2026-09-25', 3, 'Can international cooperation keep pace with fast-moving piracy networks?'],
  ],
};

function renderComments(episodeNumber) {
  const comments = episodeComments[episodeNumber] || [];
  commentsCount.textContent = comments.length;
  commentList.setAttribute('aria-label', `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`);
  commentList.replaceChildren();

  comments.forEach(([author, relativeTime, datetime, likeCount, text]) => {
    const comment = document.createElement('article');
    comment.className = 'comment';

    const avatar = document.createElement('span');
    avatar.className = 'comment-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="6"></circle><path d="M5.5 29c.7-7 4.2-10.5 10.5-10.5S25.8 22 26.5 29"></path></svg>';

    const content = document.createElement('div');
    content.className = 'comment-content';
    const header = document.createElement('header');
    const name = document.createElement('strong');
    const time = document.createElement('time');
    name.textContent = author;
    time.dateTime = datetime;
    time.textContent = relativeTime;
    header.append(name, time);

    const message = document.createElement('p');
    message.textContent = text;
    const tools = document.createElement('div');
    tools.className = 'comment-tools';
    const like = document.createElement('button');
    const reply = document.createElement('button');
    like.type = 'button';
    reply.type = 'button';
    like.append('Like ');
    const likes = document.createElement('span');
    likes.textContent = likeCount;
    like.append(likes);
    reply.textContent = 'Reply';
    tools.append(like, reply);
    content.append(header, message, tools);
    comment.append(avatar, content);
    commentList.append(comment);
  });
}

document.querySelectorAll('.episode-card').forEach((card) => {
  const numberElement = card.querySelector('.episode-number');
  const number = Number(numberElement.textContent.match(/\d+/)?.[0]);
  const published = episodeDates[number];
  card.dataset.episode = String(number);

  const viewCount = document.createElement('span');
  viewCount.className = 'episode-views';
  viewCount.setAttribute('aria-label', `${episodeViews[number - 1]} readers`);
  viewCount.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.75"></circle></svg><span>${episodeViews[number - 1]}</span>`;
  card.append(viewCount);

  if (!published) return;

  const date = document.createElement('time');
  date.className = 'episode-date';
  date.dateTime = published.datetime;
  date.textContent = published.label;
  numberElement.append(date);
});

function getEpisodes() {
  return Array.isArray(window.EPISODE_CONTENT) ? window.EPISODE_CONTENT : [];
}

function findEpisode(number) {
  return getEpisodes().find((item) => Number(item.number) === Number(number));
}

function updateEpisodeNavigation(number) {
  const episodes = getEpisodes();
  const currentIndex = episodes.findIndex((item) => Number(item.number) === Number(number));
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
  const episode = findEpisode(number);
  activateTab('episodes', false);
  episodeHeading.hidden = true;
  episodeList.hidden = true;
  articleView.hidden = false;
  articleBody.replaceChildren();
  updateEpisodeNavigation(number);
  renderComments(Number(number));

  if (!episode) {
    articleEpisodeLabel.textContent = 'Episode unavailable';
    articleDate.textContent = '';
    articleDate.removeAttribute('datetime');
    articleViews.hidden = true;
    articleTitle.textContent = 'This episode could not be loaded.';
    const message = document.createElement('p');
    message.className = 'article-missing';
    message.textContent = 'Return to the archive and choose another episode.';
    articleBody.append(message);
    return;
  }

  const published = episodeDates[episode.number];
  articleEpisodeLabel.textContent = `Episode ${String(episode.number).padStart(2, '0')}`;
  articleDate.textContent = published?.label || '';
  if (published) articleDate.dateTime = published.datetime;
  else articleDate.removeAttribute('datetime');
  articleViewCount.textContent = episodeViews[episode.number - 1];
  articleViews.setAttribute('aria-label', `${episodeViews[episode.number - 1]} readers`);
  articleViews.hidden = false;
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
    showEpisode(button.closest('.episode-card').dataset.episode);
  });
});

document.querySelectorAll('.story-orb').forEach((orb) => {
  const episode = findEpisode(orb.dataset.episode);
  const firstImage = episode?.blocks.find((block) => block.type === 'image');
  const image = orb.querySelector('img');

  if (episode && firstImage) {
    image.src = firstImage.src;
    image.alt = '';
    orb.title = episode.title;
    orb.setAttribute('aria-label', 'Open episode ' + episode.number + ': ' + episode.title);
  }

  orb.addEventListener('click', () => showEpisode(Number(orb.dataset.episode)));
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
document.querySelector('.comment-composer').addEventListener('submit', (event) => event.preventDefault());
routeFromHash();
