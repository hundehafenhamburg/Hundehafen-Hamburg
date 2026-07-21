const APP_PIN = '1111';
const STORAGE_KEY = 'hundehafen_gesendete_notizen_v2';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwDCRSDDN7Wd1NmuSU_U-kyaMiyGcfinKW1QD90Vs2XlQCFJgi_V_d5if_0IKUtc0XG/exec';

const pinView = document.getElementById('pin-view');
const noteView = document.getElementById('note-view');
const pinForm = document.getElementById('pin-form');
const pinInput = document.getElementById('pin');
const pinError = document.getElementById('pin-error');
const noteForm = document.getElementById('note-form');
const saveMessage = document.getElementById('save-message');
const errorMessage = document.getElementById('send-error');
const savedNotes = document.getElementById('saved-notes');
const clearNotes = document.getElementById('clear-notes');
const submitButton = noteForm.querySelector('button[type="submit"]');

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
    savedNotes.innerHTML = '<p class="empty">Noch keine Notiz gesendet.</p>';
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

noteForm.addEventListener('submit', async event => {
  event.preventDefault();
  saveMessage.hidden = true;
  errorMessage.hidden = true;

  const data = new FormData(noteForm);
  const subject = String(data.get('subject') || '').trim();
  const note = String(data.get('note') || '').trim();
  if (!subject || !note) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Wird gesendet …';

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({ betreff: subject, notiz: note })
    });

    const notes = readNotes();
    notes.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      subject,
      note,
      createdAt: new Date().toISOString()
    });
    writeNotes(notes);
    noteForm.reset();
    saveMessage.hidden = false;
    renderNotes();
    window.setTimeout(() => { saveMessage.hidden = true; }, 4000);
    document.getElementById('subject').focus();
  } catch (error) {
    errorMessage.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Notiz senden';
  }
});

clearNotes.addEventListener('click', () => {
  if (confirm('Die Anzeige der gesendeten Notizen auf diesem Gerät löschen?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderNotes();
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}
