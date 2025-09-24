// Fungsi bantu untuk generate array nama file otomatis (jika Anda pakai pola nama)
function generatePages(prefix, start, end, pad = 4, ext = ".jpg") {
    const pages = [];
    for (let i = start; i <= end; i++) {
        const num = String(i).padStart(pad, "0");
        pages.push(`${prefix}${num}${ext}`);
    }
    return pages;
}

// ---------- DATA MANGA (tetap seperti sebelumnya) ----------
const mangaData = {
    1: {
        title: "Semua Gambar (sudah digabung)",
        // Contoh generate; ganti sesuai struktur Anda atau langsung isi array URL
        pages: generatePages("manga/", 1, 244)
    }
};

// Ambil semua halaman dari mangaData
const allPagesKey = Object.keys(mangaData)[0];
const allPages = Array.isArray(mangaData[allPagesKey].pages) ? mangaData[allPagesKey].pages : [];

// ---------------------------
// --- KONFIGURASI CHAPTER ---
// chapters tetap menentukan target scroll (start = nomor halaman 1-based)
// Anda boleh ubah banyaknya object di array ini sesuai kebutuhan
const chapters = window.customChapters || [
    { num: 1, title: "Chapter 1", start: 1, end: 26 },
    { num: 2, title: "Chapter 2", start: 56, end: 50 },
];
// -----------------------------------------------------------

// DOM refs
const mangaContent = document.getElementById('manga-content');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');
const backToTopBtn = document.getElementById('back-to-top');
const progressBar = document.getElementById('progress-bar');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');
const overlay = document.getElementById('overlay');
const applySettings = document.getElementById('apply-settings');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const toggleControlsBtn = document.getElementById('toggle-controls');
const mobileChapter = document.getElementById('mobile-chapter');
const chapterPanel = document.getElementById('chapter-panel');
const closeChapterPanel = document.getElementById('close-chapter-panel');
const chapterList = document.getElementById('chapter-list');
const showControlsBtn = document.getElementById('show-controls');

let controlsHidden = false;
let hideControlsTimeout = null;

// ---------------------------
// RENDER: render ALL images first (semua halaman), beri id img-<pageIndex>
// ---------------------------
function renderAllImages() {
    mangaContent.innerHTML = '';
    for (let i = 0; i < allPages.length; i++) {
        const pageIdx = i + 1; // 1-based
        const url = allPages[i];
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Halaman ${pageIdx}`;
        img.id = `img-${pageIdx}`; // id yang akan jadi target scroll
        img.className = 'manga-page';
        img.loading = 'lazy';
        mangaContent.appendChild(img);
    }
}

// ---------------------------
// Build chapter list in panel (tidak mempengaruhi DOM gambar)
// ---------------------------
function buildChapterList() {
    if (!chapterList) return;
    chapterList.innerHTML = '';
    chapters.forEach(ch => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        chapterItem.textContent = ch.title || `Chapter ${ch.num}`;
        chapterItem.addEventListener('click', () => {
            scrollToChapter(ch.num);
            toggleChapterPanel();
        });
        chapterList.appendChild(chapterItem);
    });
}

// ---------------------------
// Scroll ke chapter: akan scroll ke gambar dengan id img-<start>
// ---------------------------
function scrollToChapter(chapterNum) {
    const chap = chapters.find(c => c.num === Number(chapterNum));
    if (!chap) return;
    const targetImg = document.getElementById(`img-${chap.start}`);
    if (targetImg) {
        targetImg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // fallback: jika img tidak ditemukan (out-of-range), scroll ke paling dekat
        const fallback = document.getElementById('img-1') || document.querySelector('#manga-content img');
        if (fallback) fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ---------------------------
// Menentukan chapter "saat ini" berdasarkan gambar yang paling dekat ke top viewport
// ---------------------------
function findCurrentChapterInView() {
    // temukan gambar yang posisinya paling dekat ke top (>= -half viewport) agar natural
    const imgs = Array.from(document.querySelectorAll('#manga-content img'));
    if (imgs.length === 0) return chapters.length ? chapters[0].num : 1;

    let closestImg = imgs[0];
    let minDist = Infinity;
    imgs.forEach(img => {
        const rect = img.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < minDist) {
            minDist = dist;
            closestImg = img;
        }
    });

    // ambil index halaman dari id img-<n>
    const m = closestImg.id.match(/^img-(\d+)$/);
    const pageIdx = m ? Number(m[1]) : 1;

    // cari chapter yang mengandung pageIdx
    const chapContaining = chapters.find(c => pageIdx >= c.start && pageIdx <= c.end);
    if (chapContaining) return chapContaining.num;

    // jika tidak ada yang mengandung (mis. chapter tidak cover semua pages), pilih chapter
    // yang start terdekat di bawah pageIdx, atau chapter terdekat pertama
    const starts = chapters.map(c => c.start).sort((a,b)=>a-b);
    let candidate = chapters[0].num;
    for (let i = 0; i < starts.length; i++) {
        if (pageIdx >= starts[i]) {
            const ch = chapters.find(c => c.start === starts[i]);
            if (ch) candidate = ch.num;
        }
    }
    return candidate;
}

// ---------------------------
// UI helpers: progress, controls, settings, chapter panel
// ---------------------------
function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (documentHeight > 0) {
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    } else {
        progressBar.style.width = `0%`;
    }
}

function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.pageYOffset > 300) backToTopBtn.style.display = 'block';
    else backToTopBtn.style.display = 'none';
}

function toggleSettings() {
    if (!settingsPanel) return;
    const isOpen = settingsPanel.style.display === 'block';
    settingsPanel.style.display = isOpen ? 'none' : 'block';
    overlay.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) chapterPanel.style.display = 'none';
    resetHideControlsTimer();
}

function toggleChapterPanel() {
    if (!chapterPanel) return;
    const isOpen = chapterPanel.style.display === 'block';
    chapterPanel.style.display = isOpen ? 'none' : 'block';
    overlay.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
        settingsPanel.style.display = 'none';
        // build each time to reflect changes
        buildChapterList();
    }
    resetHideControlsTimer();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(()=>{});
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
    resetHideControlsTimer();
}

function toggleControls() {
    controlsHidden = !controlsHidden;
    document.body.classList.toggle('controls-hidden', controlsHidden);
    if (controlsHidden) {
        showControlsBtn.style.display = 'block';
        clearTimeout(hideControlsTimeout);
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('touchstart', handleUserActivity);
    } else {
        showControlsBtn.style.display = 'none';
        resetHideControlsTimer();
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);
    }
}

function resetHideControlsTimer() {
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    const hideControlsCheckbox = document.getElementById('hide-controls');
    if (hideControlsCheckbox && hideControlsCheckbox.checked && !controlsHidden) {
        hideControlsTimeout = setTimeout(() => toggleControls(), 3000);
    }
}

function handleUserActivity() {
    if (!controlsHidden) resetHideControlsTimer();
}

// ---------------------------
// Event listeners & wiring
// ---------------------------
window.addEventListener('load', () => {
    renderAllImages();   // render semua gambar dulu
    buildChapterList();  // siapkan daftar chapter
    resetHideControlsTimer();
    updateProgressBar();
});

window.addEventListener('scroll', () => {
    updateProgressBar();
    toggleBackToTop();
});

if (backToTopBtn) backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetHideControlsTimer();
});

if (settingsBtn) settingsBtn.addEventListener('click', toggleSettings);
if (closeSettings) closeSettings.addEventListener('click', toggleSettings);
if (overlay) overlay.addEventListener('click', () => {
    if (settingsPanel) settingsPanel.style.display = 'none';
    if (chapterPanel) chapterPanel.style.display = 'none';
    overlay.style.display = 'none';
});

if (applySettings) applySettings.addEventListener('click', () => {
    const readingMode = document.getElementById('reading-mode')?.value;
    const autoScroll = document.getElementById('auto-scroll')?.value;
    alert(`Pengaturan diterapkan:\nMode Baca: ${readingMode}\nAuto Scroll: ${autoScroll}`);
    toggleSettings();
});

if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
if (toggleControlsBtn) toggleControlsBtn.addEventListener('click', toggleControls);
if (showControlsBtn) showControlsBtn.addEventListener('click', toggleControls);
if (mobileChapter) mobileChapter.addEventListener('click', toggleChapterPanel);
if (closeChapterPanel) closeChapterPanel.addEventListener('click', toggleChapterPanel);

// Prev / Next chapter: gunakan chapters array untuk pindah antar chapters
if (prevChapterBtn) prevChapterBtn.addEventListener('click', () => {
    const current = findCurrentChapterInView();
    const idx = chapters.findIndex(c => c.num === current);
    if (idx > 0) scrollToChapter(chapters[idx - 1].num);
});
if (nextChapterBtn) nextChapterBtn.addEventListener('click', () => {
    const current = findCurrentChapterInView();
    const idx = chapters.findIndex(c => c.num === current);
    if (idx >= 0 && idx < chapters.length - 1) scrollToChapter(chapters[idx + 1].num);
});

window.addEventListener('mousemove', handleUserActivity);
window.addEventListener('touchstart', handleUserActivity);

window.addEventListener('orientationchange', () => {
    setTimeout(updateProgressBar, 300);
});
