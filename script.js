// script.js
let counters = [];
let searchQuery = '';

const counterListEl = document.getElementById('counter-list');
const emptyStateEl = document.getElementById('empty-state');
const emptyStateText = document.getElementById('empty-state-text');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const searchError = document.getElementById('search-error');

const fabAdd = document.getElementById('fab-add');
const fabTheme = document.getElementById('fab-theme');
const addModal = document.getElementById('add-modal');
const modalTitleInput = document.getElementById('modal-title-input');
const modalError = document.getElementById('modal-error');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalSaveBtn = document.getElementById('modal-save-btn');

// Confirm Modal Elements
const confirmModal = document.getElementById('confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
const confirmOkBtn = document.getElementById('confirm-ok-btn');

const ICONS = {
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Tema (Dark Mode / Light Mode)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Inisialisasi Counter Data
    const saved = localStorage.getItem('my_advanced_counters');
    if (saved) {
        counters = JSON.parse(saved);
    } else {
        counters = [
            { id: Date.now(), title: 'Gelas Kopi Hari Ini', value: 2, isEditing: false, tempTitle: '' },
            { id: Date.now() + 1, title: 'Pengunjung Toko', value: 15, isEditing: false, tempTitle: '' }
        ];
        saveToLocalStorage();
    }
    render();
});

// Dark Mode Toggle Logic
fabTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function saveToLocalStorage() {
    localStorage.setItem('my_advanced_counters', JSON.stringify(counters));
}

function getFilteredCounters() {
    if (!searchQuery.trim()) return counters;
    return counters.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase().trim()));
}

/**
 * Custom Confirmation Popup (Pengganti `confirm()` dan `alert()`)
 * Mengembalikan Promise<boolean>
 */
function showCustomConfirm({ title = 'Konfirmasi', message = 'Apakah Anda yakin?', confirmText = 'Ya', isAlert = false, isDanger = true }) {
    return new Promise((resolve) => {
        confirmTitle.innerText = title;
        confirmMessage.innerText = message;
        confirmOkBtn.innerText = confirmText;

        if (isDanger) {
            confirmOkBtn.className = 'btn-modal-danger';
        } else {
            confirmOkBtn.className = 'btn-modal-save';
        }

        const actionsContainer = confirmModal.querySelector('.modal-actions');
        if (isAlert) {
            actionsContainer.classList.add('confirm-single-btn');
        } else {
            actionsContainer.classList.remove('confirm-single-btn');
        }

        confirmModal.classList.remove('hidden');

        const handleOk = () => {
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            confirmModal.classList.add('hidden');
            confirmOkBtn.removeEventListener('click', handleOk);
            confirmCancelBtn.removeEventListener('click', handleCancel);
        };

        confirmOkBtn.addEventListener('click', handleOk);
        confirmCancelBtn.addEventListener('click', handleCancel);
    });
}

function render() {
    counterListEl.innerHTML = '';
    const filtered = getFilteredCounters();

    if (filtered.length === 0) {
        emptyStateEl.classList.remove('hidden');
        if (searchQuery.trim()) {
            emptyStateText.innerText = `Tidak ada counter dengan nama "${searchQuery}".`;
        } else {
            emptyStateText.innerText = 'Belum ada counter. Klik tombol + di pojok kanan bawah untuk membuat!';
        }
    } else {
        emptyStateEl.classList.add('hidden');
    }

    filtered.forEach(counter => {
        const card = document.createElement('div');
        card.classList.add('counter-card');

        if (counter.isEditing) {
            // Mode Edit Nama
            card.innerHTML = `
                <div class="counter-header">
                    <input type="text" class="counter-title-input" value="${escapeHtml(counter.tempTitle)}" maxlength="30" />
                    <div class="counter-action-btns">
                        <button class="icon-btn btn-save" title="Simpan Nama">${ICONS.check}</button>
                        <button class="icon-btn btn-cancel" title="Batal Edit">${ICONS.close}</button>
                    </div>
                </div>
                <div class="counter-value">${counter.value}</div>
                <div class="counter-controls">
                    <button class="btn btn-decrement" disabled style="opacity:0.5; cursor:not-allowed;">-</button>
                    <button class="btn btn-reset" disabled style="opacity:0.5; cursor:not-allowed;">Reset</button>
                    <button class="btn btn-increment" disabled style="opacity:0.5; cursor:not-allowed;">+</button>
                </div>
            `;

            const inputEl = card.querySelector('.counter-title-input');
            inputEl.focus();

            inputEl.addEventListener('input', (e) => {
                counter.tempTitle = e.target.value;
            });

            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleSaveEdit(counter);
                if (e.key === 'Escape') handleCancelEdit(counter);
            });

            card.querySelector('.btn-save').addEventListener('click', () => handleSaveEdit(counter));
            card.querySelector('.btn-cancel').addEventListener('click', () => handleCancelEdit(counter));

        } else {
            // Mode Normal
            card.innerHTML = `
                <div class="counter-header">
                    <div class="counter-title-display">${escapeHtml(counter.title)}</div>
                    <div class="counter-action-btns">
                        <button class="icon-btn btn-edit" title="Edit Nama Counter">${ICONS.edit}</button>
                        <button class="icon-btn btn-delete" title="Hapus Counter">${ICONS.delete}</button>
                    </div>
                </div>
                <div class="counter-value">${counter.value}</div>
                <div class="counter-controls">
                    <button class="btn btn-decrement">-</button>
                    <button class="btn btn-reset">Reset</button>
                    <button class="btn btn-increment">+</button>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => {
                counter.isEditing = true;
                counter.tempTitle = counter.title;
                render();
            });

            card.querySelector('.btn-delete').addEventListener('click', async () => {
                const confirmDelete = await showCustomConfirm({
                    title: 'Hapus Counter',
                    message: `Apakah Anda yakin ingin menghapus counter "${counter.title}"?`,
                    confirmText: 'Hapus',
                    isDanger: true
                });

                if (confirmDelete) {
                    counters = counters.filter(c => c.id !== counter.id);
                    saveToLocalStorage();
                    render();
                }
            });

            card.querySelector('.btn-increment').addEventListener('click', () => {
                counter.value++;
                saveToLocalStorage();
                render();
            });

            card.querySelector('.btn-decrement').addEventListener('click', () => {
                counter.value--;
                saveToLocalStorage();
                render();
            });

            card.querySelector('.btn-reset').addEventListener('click', () => {
                counter.value = 0;
                saveToLocalStorage();
                render();
            });
        }

        counterListEl.appendChild(card);
    });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function handleSaveEdit(counter) {
    const newName = counter.tempTitle.trim();
    if (!newName) {
        await showCustomConfirm({
            title: 'Peringatan',
            message: 'Nama counter tidak boleh kosong!',
            confirmText: 'Mengerti',
            isAlert: true,
            isDanger: false
        });
        return;
    }

    const confirmSave = await showCustomConfirm({
        title: 'Simpan Perubahan',
        message: `Simpan perubahan nama menjadi "${newName}"?`,
        confirmText: 'Simpan',
        isDanger: false
    });

    if (confirmSave) {
        counter.title = newName;
        counter.isEditing = false;
        saveToLocalStorage();
        render();
    }
}

async function handleCancelEdit(counter) {
    const confirmCancel = await showCustomConfirm({
        title: 'Batalkan Edit',
        message: 'Apakah Anda yakin ingin membatalkan pengeditan nama?',
        confirmText: 'Ya, Batal',
        isDanger: true
    });

    if (confirmCancel) {
        counter.isEditing = false;
        render();
    }
}

// Search Logic
searchInput.addEventListener('input', () => {
    const val = searchInput.value;
    
    if (val.length > 0) {
        clearSearchBtn.classList.remove('hidden');
        searchBtn.disabled = false;
        searchError.classList.remove('visible');
        searchInput.classList.remove('input-error');
    } else {
        clearSearchBtn.classList.add('hidden');
        searchBtn.disabled = true;
        searchError.classList.remove('visible');
        searchInput.classList.remove('input-error');
        
        if (searchQuery !== '') {
            searchQuery = '';
            render();
        }
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    searchBtn.disabled = true;
    searchError.classList.remove('visible');
    searchInput.classList.remove('input-error');
    searchInput.focus();
    
    if (searchQuery !== '') {
        searchQuery = '';
        render();
    }
});

searchBtn.addEventListener('click', () => {
    const val = searchInput.value.trim();
    if (!val) {
        searchError.classList.add('visible');
        searchInput.classList.add('input-error');
    } else {
        searchError.classList.remove('visible');
        searchInput.classList.remove('input-error');
        searchQuery = val;
        render();
    }
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!searchBtn.disabled) {
            searchBtn.click();
        } else {
            searchError.classList.add('visible');
            searchInput.classList.add('input-error');
        }
    }
});

// Modal Tambah Counter
fabAdd.addEventListener('click', () => {
    addModal.classList.remove('hidden');
    modalTitleInput.value = '';
    modalError.classList.remove('visible');
    modalTitleInput.focus();
});

modalCancelBtn.addEventListener('click', () => {
    addModal.classList.add('hidden');
});

modalSaveBtn.addEventListener('click', createNewCounter);

modalTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createNewCounter();
    if (e.key === 'Escape') addModal.classList.add('hidden');
});

function createNewCounter() {
    const titleText = modalTitleInput.value.trim();
    if (!titleText) {
        modalError.classList.add('visible');
        return;
    }

    const newCounter = {
        id: Date.now(),
        title: titleText,
        value: 0,
        isEditing: false,
        tempTitle: ''
    };

    counters.push(newCounter);
    saveToLocalStorage();
    
    searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    searchBtn.disabled = true;

    addModal.classList.add('hidden');
    render();
}