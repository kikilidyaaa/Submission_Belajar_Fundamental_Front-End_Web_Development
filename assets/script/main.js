import '../styles/style.css';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    } else {
      renderNotes(responseJson.data);
    }
  } catch (error) {
    showResponseMessage(error);
  }
};

const insertNote = async (note) => {
  try {
    showLoadingIndicator();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    };

    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();
    hideLoadingIndicator();
    showResponseMessage(responseJson.message);
    getNotes();
  } catch (error) {
    showResponseMessage(error);
  }
};

const removeNote = (note_id) => {
  showLoadingIndicator();
  fetch(`${BASE_URL}/notes/${note_id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      showResponseMessage(responseJson.message);
      getNotes();
      getArchivedNotes();
    })
    .catch((error) => {
      hideLoadingIndicator();
      showResponseMessage(error);
    })
    .finally(() => {
      hideLoadingIndicator();
    });
};

const getArchivedNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    } else {
      renderArchiveNotes(responseJson.data);
    }
  } catch (error) {
    showResponseMessage(error);
  }
};

const archiveNote = async (note_id) => {
  try {
    showLoadingIndicator();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note_id),
    };

    const response = await fetch(`${BASE_URL}/notes/${note_id}/archive`, options);
    const responseJson = await response.json();
    showResponseMessage(responseJson.message);
    getNotes();
    getArchivedNotes();
  } catch (error) {
    showResponseMessage(error);
  } finally {
    hideLoadingIndicator();
  }
};

const unarchiveNote = async (note_id) => {
  try {
    showLoadingIndicator();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note_id),
    };

    const response = await fetch(`${BASE_URL}/notes/${note_id}/unarchive`, options);
    const responseJson = await response.json();
    showResponseMessage(responseJson.message);
    getNotes();
    getArchivedNotes();
  } catch (error) {
    showResponseMessage(error);
  } finally {
    hideLoadingIndicator();
  }
};

function addNote() {
  const titleInput = document.querySelector('custom-input[label="Judul"]');
  const title = titleInput.shadowRoot.querySelector('input').value.trim();
  const titleError = titleInput.shadowRoot.querySelector('small');

  const bodyInput = document.querySelector('custom-textarea[label="Catatan"]');
  const body = bodyInput.shadowRoot.querySelector('textarea').value.trim();
  const bodyError = bodyInput.shadowRoot.querySelector('small');

  if (title === '') {
    titleError.style.display = 'block';
    return;
  } else {
    titleError.style.display = 'none';
  }

  if (body === '') {
    bodyError.style.display = 'block';
    return;
  } else {
    bodyError.style.display = 'none';
  }

  const noteObject = {
    title: title,
    body: body,
  };

  resetForm();
  insertNote(noteObject);
}

function resetForm() {
  document.querySelector('custom-input').shadowRoot.querySelector('input').value ='';
  document.querySelector('custom-textarea').shadowRoot.querySelector('textarea').value = '';
}

class CustomInput extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const label = this.getAttribute('label') || 'Label';
    const placeholder = this.getAttribute('placeholder') || 'Placeholder';
    const required = this.getAttribute('required') !== null;

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);

    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const errorMessage = document.createElement('small');
    errorMessage.textContent = 'Harap isi bidang ini';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';

    shadow.appendChild(labelElement);
    shadow.appendChild(input);
    shadow.appendChild(errorMessage);

    const style = document.createElement('style');
    style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            label {
                font-weight: bold;
            }
            input {
                border: 1px solid #6C757D;
                border-radius: 5px;
                box-sizing: border-box;
                font-size: 15px;
                padding: 12px;
                width: 100%;
            }
        `;
    shadow.appendChild(style);

    if (required) {
      input.setAttribute('required', '');
      this.setAttribute('required', '');
    }

    input.addEventListener('input', () => {
      if (required && input.value.trim() === '') {
        errorMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'none';
      }
    });
  }

  get required() {
    return this.getAttribute('required');
  }

  set required(value) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }
}
customElements.define('custom-input', CustomInput);

class CustomTextarea extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const label = this.getAttribute('label') || 'Label';
    const placeholder = this.getAttribute('placeholder') || 'Placeholder';
    const required = this.getAttribute('required') !== null;

    const textarea = document.createElement('textarea');
    textarea.setAttribute('placeholder', placeholder);

    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const errorMessage = document.createElement('small');
    errorMessage.textContent = 'Harap isi bidang ini';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';

    shadow.appendChild(labelElement);
    shadow.appendChild(textarea);
    shadow.appendChild(errorMessage);

    const style = document.createElement('style');
    style.textContent = `
            :host {
                display: block;
                margin: 8px 0;
            }
            label {
                font-weight: bold;
            }
            textarea {
                border: 1px solid #6C757D;
                border-radius: 5px;
                box-sizing: border-box;
                font-size: 15px;
                padding: 12px;
                width: 100%;
                height: 200px;
            }
        `;
    shadow.appendChild(style);

    if (required) {
      textarea.setAttribute('required', '');
      this.setAttribute('required', '');
    }

    textarea.addEventListener('input', () => {
      if (required && textarea.value.trim() === '') {
        errorMessage.style.display = 'block';
      } else {
        errorMessage.style.display = 'none';
      }
    });
  }

  get required() {
    return this.getAttribute('required');
  }

  set required(value) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }
}
customElements.define('custom-textarea', CustomTextarea);

class CustomButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const button = document.createElement('button');
    button.textContent = this.textContent || 'Submit';
    button.addEventListener('click', addNote);

    shadow.appendChild(button);

    const style = document.createElement('style');
    style.textContent = `
            button {
                background-color: transparent;
                border: 1px solid white;
                border-radius: 5px;
                box-sizing: border-box;
                color: white;
                cursor: pointer;
                display: block;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                padding: 15px;
                width: 100%;
            }
            button:disabled {
                cursor: not-allowed;
            }
            button:hover {
                background-color: #26677E;
            }
        `;
    shadow.appendChild(style);
  }
}
customElements.define('custom-button', CustomButton);

class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const loading = document.createElement('div');
    loading.classList.add('loading');
    loading.textContent = 'Loading...';

    const style = document.createElement('style');
    style.textContent = `
            .loading {
                background-color: #26677E;
                border-radius: 10px;
                left: 50%;
                padding: 20px;
                position: fixed;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
            }
        `;
    shadow.appendChild(style);
    shadow.appendChild(loading);
  }
}
customElements.define('loading-indicator', LoadingIndicator);

const showResponseMessage = (message = 'Check your internet connection') => {
  alert(message);
};

const showLoadingIndicator = () => {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';
  setTimeout(hideLoadingIndicator, 2000);
};

const hideLoadingIndicator = () => {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'none';
};

function searchNote() {
  let search = document.querySelector('#searchNoteTitle').value;
  let returnSearch = document.getElementsByClassName('containerNotes');

  for (const noteItem of returnSearch) {
    let titleNote = noteItem.querySelector('h3').innerText.toUpperCase();
    let searchNote = titleNote.search(search.toUpperCase());
    if (searchNote != -1) {
      noteItem.style.display = '';
    } else {
      noteItem.style.display = 'none';
    }
  }
}

function renderNotes(notes) {
  const notesContainer = document.getElementById('allNoteList');
  notesContainer.innerHTML = '';
  notes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('containerNotes');
    noteElement.innerHTML = `
            <div class="noteContent">
                <h3>${note.title}</h3>
                <small>${new Date(note.createdAt).toLocaleString()}</small>
                <p>${note.body}</p>
            </div>
            <div class="button">
                <button type="button" class="remove" id="${note.id}"><i class="fa fa-trash"></i></button>
                <button type="button" class="archived" id="${note.id}"><i class="fa fa-archive"></i></button>
            </div>
        `;
    notesContainer.appendChild(noteElement);
  });

  const buttonDelete = document.querySelectorAll('.remove');
  buttonDelete.forEach((button) => {
    button.addEventListener('click', (event) => {
      const note_id = event.target.id;
      removeNote(note_id);
    });
  });

  const buttonArchive = document.querySelectorAll('.archived');
  buttonArchive.forEach((button) => {
    button.addEventListener('click', (event) => {
      const note_id = event.target.id;
      archiveNote(note_id);
    });
  });
}

function renderArchiveNotes(archivedNotes) {
  const archivedNotesContainer = document.getElementById('archivedNoteList');
  archivedNotesContainer.innerHTML = '';
  archivedNotes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('containerNotes');
    noteElement.innerHTML = `
            <div class="noteContent">
                <h3>${note.title}</h3>
                <small>${new Date(note.createdAt).toLocaleString()}</small>
                <p>${note.body}</p>
            </div>
            <div class="button">
                <button type="button" class="remove" id="${note.id}"><i class="fa fa-trash"></i></button>
                <button type="button" class="unarchived" id="${note.id}"><i class="fa fa-undo"></i></button>
            </div>
        `;
    archivedNotesContainer.appendChild(noteElement);
  });

  const buttonDelete = document.querySelectorAll('.remove');
  buttonDelete.forEach((button) => {
    button.addEventListener('click', (event) => {
      const note_id = event.target.id;
      removeNote(note_id);
    });
  });

  const buttonUnarchive = document.querySelectorAll('.unarchived');
  buttonUnarchive.forEach((button) => {
    button.addEventListener('click', (event) => {
      const note_id = event.target.id;
      unarchiveNote(note_id);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  showLoadingIndicator();
  setTimeout(() => {
    hideLoadingIndicator();
    document.querySelector('header').style.display = 'block';
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
  }, 2000);

  const submitForm = document.getElementById('inputNote');
  const searchForm = document.getElementById('searchNote');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addNote();
  });

  searchForm.addEventListener('input', (event) => {
    event.preventDefault();
    searchNote();
  });

  getNotes();
  getArchivedNotes();
});
