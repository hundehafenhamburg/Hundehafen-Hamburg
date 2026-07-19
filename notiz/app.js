const APP_PIN = '1111'; // Hier kann die PIN vor Veröffentlichung geändert werden.
const STORAGE_KEY = 'hundehafen_testnotizen_v1';

const pinView = document.getElementById('pin-view');
const noteView = document.getElementById('note-view');
const pinForm = document.getElementById('pin-form');
const pinInput = document.getElementById('pin');
const pinError = document.getElementById('pin-error');
const noteForm = document.getElementById('note-form');
const saveMessage = document.getElementById('save-message');
const savedNotes = document.getElementById('saved-notes');
const clearNotes = document.getElementById('clear-notes');

function unlock() {
  pinView.hidden = true;
  noteView.hidden = false;
  sessionStorage.setItem('hundehafen_notes_unlocked', '1');
  document.getElementById('subject').focus();
  renderNotes();
}

if (sessionStorage.getItem('hundehafen_notes_unlocked') === '1') unlock();

pinForm.addEventListener('submit', event => {
  event.preventDefault();
  if (pinInput.value === APP_PIN) {
    pinError.hidden = true;
    unlock();
  } else {
    pinError.hidden = false;
    pinInput.select();
  }
});

function readNotes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function writeNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
  const notes = readNotes();
  savedNotes.innerHTML = '';
  if (!notes.length) {
    savedNotes.innerHTML = '<p class="empty">Noch keine Testnotiz gespeichert.</p>';
    return;
  }
  notes.slice().reverse().forEach(item => {
    const article = document.createElement('article');
    article.className = 'saved-note';
    const strong = document.createElement('strong');
    strong.textContent = item.subject;
    const p = document.createElement('p');
    p.textContent = item.note;
    const time = document.createElement('time');
    time.textContent = new Date(item.createdAt).toLocaleString('de-DE');
    article.append(strong, p, time);
    savedNotes.appendChild(article);
  });
}

noteForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(noteForm);
  const notes = readNotes();
  notes.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    subject: String(data.get('subject')).trim(),
    note: String(data.get('note')).trim(),
    createdAt: new Date().toISOString()
  });
  writeNotes(notes);
  noteForm.reset();
  saveMessage.hidden = false;
  renderNotes();
  window.setTimeout(() => { saveMessage.hidden = true; }, 3500);
  document.getElementById('subject').focus();
});

clearNotes.addEventListener('click', () => {
  if (confirm('Alle lokal gespeicherten Testnotizen löschen?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderNotes();
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}
