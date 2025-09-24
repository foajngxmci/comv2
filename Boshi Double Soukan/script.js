
// // // Fungsi bantu untuk generate array nama file otomatis
// // function generatePages(prefix, start, end, pad = 3, ext = ".jpg") {
// //     const pages = [];
// //     for (let i = start; i <= end; i++) {
// //         // Contoh: 1 → "001", 21 → "021"
// //         const num = String(i).padStart(pad, "0");
// //         pages.push(`${prefix}${num}${ext}`);
// //     }
// //     return pages;
// // }

// // // Data manga
// // const mangaData = {
// //     1: {
// //         title: "Chapter 1: Awal Petualangan",
// //         pages: generatePages("manga/", 1, 221)  // otomatis dari manga/001.jpg sampai manga/221.jpg
// //     }
// // };

// // // Variabel state
// // let autoScrollInterval = null;
// // let controlsHidden = false;
// // let hideControlsTimeout = null;
// // let userActivityDetected = false;

// // // Elemen DOM
// // const mangaContent = document.getElementById('manga-content');
// // const prevChapterBtn = document.getElementById('prev-chapter');
// // const nextChapterBtn = document.getElementById('next-chapter');
// // const backToTopBtn = document.getElementById('back-to-top');
// // const progressBar = document.getElementById('progress-bar');
// // const settingsBtn = document.getElementById('settings-btn');
// // const settingsPanel = document.getElementById('settings-panel');
// // const closeSettings = document.getElementById('close-settings');
// // const overlay = document.getElementById('overlay');
// // const applySettings = document.getElementById('apply-settings');
// // const fullscreenBtn = document.getElementById('fullscreen-btn');
// // const toggleControlsBtn = document.getElementById('toggle-controls');
// // const mobileChapter = document.getElementById('mobile-chapter');
// // const chapterPanel = document.getElementById('chapter-panel');
// // const closeChapterPanel = document.getElementById('close-chapter-panel');
// // const chapterList = document.getElementById('chapter-list');
// // const showControlsBtn = document.getElementById('show-controls');

// // // ---------------------------
// // // Render semua chapter di 1 halaman
// // // ---------------------------
// // function renderAllChapters() {
// //     mangaContent.innerHTML = '';

// //     Object.keys(mangaData).forEach(chapterNum => {
// //         const chapter = mangaData[chapterNum];
// //         // Gambar tiap halaman
// //         chapter.pages.forEach((pageUrl, index) => {
// //             const img = document.createElement('img');
// //             img.src = pageUrl;
// //             img.alt = `Chapter ${chapterNum} - Halaman ${index + 1}`;
// //             img.id = `image${index}`;
// //             img.className = 'manga-page';
// //             img.loading = 'lazy';
// //             mangaContent.appendChild(img);
// //         });
// //     });
// // }

// // // ---------------------------
// // // Navigasi antar chapter (scroll)
// // // ---------------------------
// // function scrollToChapter(chapterNum) {
// //     const target = document.getElementById(`chapter-${chapterNum}`);
// //     if (target) {
// //         target.scrollIntoView({ behavior: 'smooth' });
// //     }
// // }

// // // Prev / Next pakai scroll antar judul
// // function findCurrentChapterInView() {
// //     const chapters = Array.from(document.querySelectorAll('.chapter-title'));
// //     let current = 1;
// //     let minDistance = Infinity;

// //     chapters.forEach(ch => {
// //         const rect = ch.getBoundingClientRect();
// //         if (rect.top >= -50 && rect.top < minDistance) {
// //             minDistance = rect.top;
// //             current = parseInt(ch.id.replace('chapter-', ''));
// //         }
// //     });

// //     return current;
// // }

// // // ---------------------------
// // // Fungsi UI
// // // ---------------------------
// // function updateProgressBar() {
// //     const windowHeight = window.innerHeight;
// //     const documentHeight = document.documentElement.scrollHeight - windowHeight;
// //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

// //     if (documentHeight > 0) {
// //         const progress = (scrollTop / documentHeight) * 100;
// //         progressBar.style.width = `${progress}%`;
// //     }
// // }

// // function toggleBackToTop() {
// //     if (window.pageYOffset > 300) {
// //         backToTopBtn.style.display = 'block';
// //     } else {
// //         backToTopBtn.style.display = 'none';
// //     }
// // }

// // function toggleSettings() {
// //     if (settingsPanel.style.display === 'block') {
// //         settingsPanel.style.display = 'none';
// //         overlay.style.display = 'none';
// //     } else {
// //         settingsPanel.style.display = 'block';
// //         overlay.style.display = 'block';
// //         chapterPanel.style.display = 'none';
// //     }
// //     resetHideControlsTimer();
// // }

// // function toggleChapterPanel() {
// //     if (chapterPanel.style.display === 'block') {
// //         chapterPanel.style.display = 'none';
// //         overlay.style.display = 'none';
// //     } else {
// //         chapterPanel.style.display = 'block';
// //         overlay.style.display = 'block';
// //         settingsPanel.style.display = 'none';

// //         // Isi daftar chapter
// //         chapterList.innerHTML = '';
// //         Object.keys(mangaData).forEach(chapterNum => {
// //             const chapterItem = document.createElement('div');
// //             chapterItem.className = 'chapter-item';
// //             chapterItem.textContent = `Chapter ${chapterNum}`;
// //             chapterItem.addEventListener('click', () => {
// //                 scrollToChapter(chapterNum);
// //                 toggleChapterPanel();
// //             });
// //             chapterList.appendChild(chapterItem);
// //         });
// //     }
// //     resetHideControlsTimer();
// // }

// // function toggleFullscreen() {
// //     if (!document.fullscreenElement) {
// //         document.documentElement.requestFullscreen().catch(err => {
// //             console.error(`Error attempting to enable fullscreen: ${err.message}`);
// //         });
// //     } else {
// //         if (document.exitFullscreen) {
// //             document.exitFullscreen();
// //         }
// //     }
// //     resetHideControlsTimer();
// // }

// // function toggleControls() {
// //     controlsHidden = !controlsHidden;
// //     document.body.classList.toggle('controls-hidden', controlsHidden);
// //     toggleControlsBtn.textContent = controlsHidden ? 'Tampilkan Kontrol' : 'Hide';

// //     if (controlsHidden) {
// //         showControlsBtn.style.display = 'block';
// //         clearTimeout(hideControlsTimeout);
// //         window.removeEventListener('mousemove', handleUserActivity);
// //         window.removeEventListener('touchstart', handleUserActivity);
// //     } else {
// //         showControlsBtn.style.display = 'none';
// //         resetHideControlsTimer();
// //         const hideControlsCheckbox = document.getElementById('hide-controls');
// //         if (hideControlsCheckbox && hideControlsCheckbox.checked) {
// //             window.addEventListener('mousemove', handleUserActivity);
// //             window.addEventListener('touchstart', handleUserActivity);
// //         }
// //     }
// // }

// // function resetHideControlsTimer() {
// //     if (hideControlsTimeout) {
// //         clearTimeout(hideControlsTimeout);
// //     }

// //     const hideControlsCheckbox = document.getElementById('hide-controls');
// //     if (hideControlsCheckbox && hideControlsCheckbox.checked && !controlsHidden) {
// //         hideControlsTimeout = setTimeout(() => {
// //             toggleControls();
// //         }, 3000);
// //     }
// // }

// // function handleUserActivity() {
// //     if (!controlsHidden) {
// //         resetHideControlsTimer();
// //     }
// // }

// // // ---------------------------
// // // Event Listeners
// // // ---------------------------
// // window.addEventListener('load', () => {
// //     renderAllChapters();
// //     resetHideControlsTimer();
// // });

// // window.addEventListener('scroll', () => {
// //     updateProgressBar();
// //     toggleBackToTop();
// // });

// // backToTopBtn.addEventListener('click', () => {
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //     resetHideControlsTimer();
// // });

// // settingsBtn.addEventListener('click', toggleSettings);
// // closeSettings.addEventListener('click', toggleSettings);
// // overlay.addEventListener('click', () => {
// //     settingsPanel.style.display = 'none';
// //     chapterPanel.style.display = 'none';
// //     overlay.style.display = 'none';
// // });

// // applySettings.addEventListener('click', () => {
// //     const readingMode = document.getElementById('reading-mode').value;
// //     const autoScroll = document.getElementById('auto-scroll').value;

// //     alert(`Pengaturan diterapkan:\nMode Baca: ${readingMode}\nAuto Scroll: ${autoScroll}`);
// //     toggleSettings();
// // });

// // fullscreenBtn.addEventListener('click', toggleFullscreen);

// // toggleControlsBtn.addEventListener('click', toggleControls);
// // showControlsBtn.addEventListener('click', toggleControls);

// // mobileChapter.addEventListener('click', toggleChapterPanel);
// // closeChapterPanel.addEventListener('click', toggleChapterPanel);

// // // Prev / Next jadi scroll antar judul
// // prevChapterBtn.addEventListener('click', () => {
// //     const current = findCurrentChapterInView();
// //     if (current > 1) {
// //         scrollToChapter(current - 1);
// //     }
// // });
// // nextChapterBtn.addEventListener('click', () => {
// //     const current = findCurrentChapterInView();
// //     const maxChapter = Object.keys(mangaData).length;
// //     if (current < maxChapter) {
// //         scrollToChapter(current + 1);
// //     }
// // });

// // // Event listeners user activity
// // window.addEventListener('mousemove', handleUserActivity);
// // window.addEventListener('touchstart', handleUserActivity);

// // // Orientasi
// // window.addEventListener('orientationchange', () => {
// //     setTimeout(() => {
// //         updateProgressBar();
// //     }, 300);
// // });

// // // Init
// // updateProgressBar();
// // Fungsi bantu untuk generate array nama file otomatis
// function generatePages(prefix, start, end, pad = 3, ext = ".jpg") {
//     const pages = [];
//     for (let i = start; i <= end; i++) {
//         const num = String(i).padStart(pad, "0");
//         pages.push(`${prefix}${num}${ext}`);
//     }
//     return pages;
// }

// // ---------- DATA MANGA (tetap seperti sebelumnya) ----------
// // Jika Anda sudah gabung semua gambar ke satu list, bisa tetap pakai ini:
// const mangaData = {
//     1: {
//         title: "Semua Gambar (sudah digabung)",
//         pages: generatePages("manga/", 1, 221) // contoh
//     }
// };

// // ---------------------------
// // --- KONFIGURASI CHAPTER ---
// // Anda bisa kustom sendiri banyaknya chapter di array `chapters`.
// // Gunakan start/end sebagai nomor halaman 1-based yang sesuai ordering di mangaData[...].pages.
// // Contoh: start:1, end:30 artinya halaman pertama sampai halaman ke-30.
// const allPagesKey = Object.keys(mangaData)[0]; // ambil array pages yang sudah digabung
// const allPages = Array.isArray(mangaData[allPagesKey].pages) ? mangaData[allPagesKey].pages : [];

// /* --- Kustom: atur chapter di sini ---
//    Sesuaikan banyaknya object di bawah (num, title, start, end).
//    start/end = 1-based index terhadap allPages.
// */
// const chapters = window.customChapters || [
//     { num: 1, title: "My Sister is a Kankan Model", start: 1, end: 26 },
//     { num: 2, title: "Stepmother's Petal", start: 27, end: 120 },
//     { num: 3, title: "Race Queen Leah", start: 121, end: 221 }
// ];
// // -----------------------------------------------------------

// // Variabel state & DOM
// let controlsHidden = false;
// let hideControlsTimeout = null;

// const mangaContent = document.getElementById('manga-content');
// const prevChapterBtn = document.getElementById('prev-chapter');
// const nextChapterBtn = document.getElementById('next-chapter');
// const backToTopBtn = document.getElementById('back-to-top');
// const progressBar = document.getElementById('progress-bar');
// const settingsBtn = document.getElementById('settings-btn');
// const settingsPanel = document.getElementById('settings-panel');
// const closeSettings = document.getElementById('close-settings');
// const overlay = document.getElementById('overlay');
// const applySettings = document.getElementById('apply-settings');
// const fullscreenBtn = document.getElementById('fullscreen-btn');
// const toggleControlsBtn = document.getElementById('toggle-controls');
// const mobileChapter = document.getElementById('mobile-chapter');
// const chapterPanel = document.getElementById('chapter-panel');
// const closeChapterPanel = document.getElementById('close-chapter-panel');
// const chapterList = document.getElementById('chapter-list');
// const showControlsBtn = document.getElementById('show-controls');

// // ---------------------------
// // Render: tampilkan chapter title + gambar per chapter
// // ---------------------------
// function renderAllChapters() {
//     mangaContent.innerHTML = '';

//     // sanitize chapters: clamp indices agar tidak out-of-range
//     chapters.forEach(ch => {
//         if (typeof ch.start !== 'number') ch.start = 1;
//         if (typeof ch.end !== 'number') ch.end = allPages.length;
//         ch.start = Math.max(1, ch.start);
//         ch.end = Math.min(allPages.length, ch.end);
//         if (ch.start > ch.end) ch.end = ch.start;
//     });

//     chapters.forEach(chapter => {
//         // Judul chapter (section anchor)
//         const titleEl = document.createElement('h2');
//         titleEl.className = 'chapter-title';
//         titleEl.id = `chapter-${chapter.num}`;
//         titleEl.textContent = chapter.title;
//         mangaContent.appendChild(titleEl);

//         // Gambar halaman chapter -> beri id img-<1-based index>
//         for (let pageIdx = chapter.start; pageIdx <= chapter.end; pageIdx++) {
//             const url = allPages[pageIdx - 1]; // allPages zero-based
//             if (!url) continue; // skip jika tidak ada
//             const img = document.createElement('img');
//             img.src = url;
//             img.alt = `${chapter.title} - Halaman ${pageIdx}`;
//             img.id = `img-${pageIdx}`; // id berdasarkan nomor halaman 1-based
//             img.className = 'manga-page';
//             img.loading = 'lazy';
//             mangaContent.appendChild(img);
//         }
//     });
// }

// // ---------------------------
// // Scroll ke chapter (ke gambar pertama chapter)
// // ---------------------------
// function scrollToChapter(chapterNum) {
//     const chap = chapters.find(c => c.num === Number(chapterNum));
//     if (!chap) return;
//     const targetImg = document.getElementById(`img-${chap.start}`) || document.getElementById(`chapter-${chap.num}`);
//     if (targetImg) targetImg.scrollIntoView({ behavior: 'smooth', block: 'start' });
// }

// // ---------------------------
// // Cari chapter saat ini yang paling dekat ke viewport top
// // ---------------------------
// function findCurrentChapterInView() {
//     // gunakan posisi judul chapter (chapter-title)
//     const chapterEls = Array.from(document.querySelectorAll('.chapter-title'));
//     let currentNum = chapters.length ? chapters[0].num : 1;
//     let minDistance = Infinity;

//     chapterEls.forEach(el => {
//         const rect = el.getBoundingClientRect();
//         const distance = Math.abs(rect.top);
//         if (rect.top <= window.innerHeight * 0.6 && distance < minDistance) {
//             minDistance = distance;
//             currentNum = Number(el.id.replace('chapter-', ''));
//         }
//     });

//     return currentNum;
// }

// // ---------------------------
// // UI helpers
// // ---------------------------
// function updateProgressBar() {
//     const windowHeight = window.innerHeight;
//     const documentHeight = document.documentElement.scrollHeight - windowHeight;
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     if (documentHeight > 0) {
//         const progress = (scrollTop / documentHeight) * 100;
//         progressBar.style.width = `${progress}%`;
//     }
// }

// function toggleBackToTop() {
//     if (window.pageYOffset > 300) {
//         if (backToTopBtn) backToTopBtn.style.display = 'block';
//     } else {
//         if (backToTopBtn) backToTopBtn.style.display = 'none';
//     }
// }

// function toggleSettings() {
//     if (!settingsPanel) return;
//     if (settingsPanel.style.display === 'block') {
//         settingsPanel.style.display = 'none';
//         overlay.style.display = 'none';
//     } else {
//         settingsPanel.style.display = 'block';
//         overlay.style.display = 'block';
//         chapterPanel.style.display = 'none';
//     }
//     resetHideControlsTimer();
// }

// function toggleChapterPanel() {
//     if (!chapterPanel) return;
//     if (chapterPanel.style.display === 'block') {
//         chapterPanel.style.display = 'none';
//         overlay.style.display = 'none';
//     } else {
//         chapterPanel.style.display = 'block';
//         overlay.style.display = 'block';
//         settingsPanel.style.display = 'none';

//         // Isi daftar chapter (dari array chapters)
//         chapterList.innerHTML = '';
//         chapters.forEach(ch => {
//             const chapterItem = document.createElement('div');
//             chapterItem.className = 'chapter-item';
//             chapterItem.textContent = ch.title || `Chapter ${ch.num}`;
//             chapterItem.addEventListener('click', () => {
//                 scrollToChapter(ch.num);
//                 toggleChapterPanel();
//             });
//             chapterList.appendChild(chapterItem);
//         });
//     }
//     resetHideControlsTimer();
// }

// function toggleFullscreen() {
//     if (!document.fullscreenElement) {
//         document.documentElement.requestFullscreen().catch(err => {
//             console.error(`Error attempting to enable fullscreen: ${err.message}`);
//         });
//     } else {
//         if (document.exitFullscreen) document.exitFullscreen();
//     }
//     resetHideControlsTimer();
// }

// function toggleControls() {
//     controlsHidden = !controlsHidden;
//     document.body.classList.toggle('controls-hidden', controlsHidden);
//     const btn = toggleControlsBtn;
//     if (btn) btn.textContent = controlsHidden ? 'Tampilkan Kontrol' : 'Hide';
//     if (controlsHidden) {
//         showControlsBtn.style.display = 'block';
//         clearTimeout(hideControlsTimeout);
//         window.removeEventListener('mousemove', handleUserActivity);
//         window.removeEventListener('touchstart', handleUserActivity);
//     } else {
//         showControlsBtn.style.display = 'none';
//         resetHideControlsTimer();
//         const hideControlsCheckbox = document.getElementById('hide-controls');
//         if (hideControlsCheckbox && hideControlsCheckbox.checked) {
//             window.addEventListener('mousemove', handleUserActivity);
//             window.addEventListener('touchstart', handleUserActivity);
//         }
//     }
// }

// function resetHideControlsTimer() {
//     if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
//     const hideControlsCheckbox = document.getElementById('hide-controls');
//     if (hideControlsCheckbox && hideControlsCheckbox.checked && !controlsHidden) {
//         hideControlsTimeout = setTimeout(() => toggleControls(), 3000);
//     }
// }

// function handleUserActivity() {
//     if (!controlsHidden) resetHideControlsTimer();
// }

// // ---------------------------
// // Event Listeners
// // ---------------------------
// window.addEventListener('load', () => {
//     renderAllChapters();
//     resetHideControlsTimer();
//     // build chapter list initially (if panel opened later)
//     // (we build it on panel open too)
// });

// window.addEventListener('scroll', () => {
//     updateProgressBar();
//     toggleBackToTop();
// });

// if (backToTopBtn) {
//     backToTopBtn.addEventListener('click', () => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//         resetHideControlsTimer();
//     });
// }

// if (settingsBtn) settingsBtn.addEventListener('click', toggleSettings);
// if (closeSettings) closeSettings.addEventListener('click', toggleSettings);
// if (overlay) overlay.addEventListener('click', () => {
//     if (settingsPanel) settingsPanel.style.display = 'none';
//     if (chapterPanel) chapterPanel.style.display = 'none';
//     overlay.style.display = 'none';
// });

// if (applySettings) applySettings.addEventListener('click', () => {
//     const readingMode = document.getElementById('reading-mode')?.value;
//     const autoScroll = document.getElementById('auto-scroll')?.value;
//     alert(`Pengaturan diterapkan:\nMode Baca: ${readingMode}\nAuto Scroll: ${autoScroll}`);
//     toggleSettings();
// });

// if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
// if (toggleControlsBtn) toggleControlsBtn.addEventListener('click', toggleControls);
// if (showControlsBtn) showControlsBtn.addEventListener('click', toggleControls);
// if (mobileChapter) mobileChapter.addEventListener('click', toggleChapterPanel);
// if (closeChapterPanel) closeChapterPanel.addEventListener('click', toggleChapterPanel);

// // Prev / Next chapter
// if (prevChapterBtn) prevChapterBtn.addEventListener('click', () => {
//     const current = findCurrentChapterInView();
//     const idx = chapters.findIndex(c => c.num === current);
//     if (idx > 0) scrollToChapter(chapters[idx - 1].num);
// });
// if (nextChapterBtn) nextChapterBtn.addEventListener('click', () => {
//     const current = findCurrentChapterInView();
//     const idx = chapters.findIndex(c => c.num === current);
//     if (idx >= 0 && idx < chapters.length - 1) scrollToChapter(chapters[idx + 1].num);
// });

// // user activity
// window.addEventListener('mousemove', handleUserActivity);
// window.addEventListener('touchstart', handleUserActivity);

// window.addEventListener('orientationchange', () => {
//     setTimeout(updateProgressBar, 300);
// });

// // initial update
// updateProgressBar();

// Fungsi bantu untuk generate array nama file otomatis (jika Anda pakai pola nama)
function generatePages(prefix, start, end, pad = 3, ext = ".jpg") {
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
        pages: generatePages("manga/", 1, 221)
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
    { num: 1, title: "Kakak Tiriku Seorang Model Eksklusif", start: 15, end: 26 },
    { num: 2, title: "Kelopak Ibu Tiri", start: 27, end: 50 },
    { num: 3, title: "Gairah di Pemandian Air Panas - Ibu Tiri", start: 53, end: 66 },
    { num: 4, title: "Gairah di Pemandian Air Panas - Nafsu Kakak Cantik", start: 67, end: 82 },
    { num: 5, title: "Kakak si Model - Pertama Kali", start: 81, end: 221 },
    { num: 6, title: "Inces: Ibu Tiri & Adik Tiri 1", start: 100, end: 14 },
    { num: 7, title: "Inces: Ibu Tiri & Adik Tiri 2", start: 116, end: 14 },
    { num: 8, title: "Christina, Presenter Berita yang Menggoda", start: 138, end: 14 },
    { num: 9, title: "Yuriko: Istri Kelas Atas yang Terjerumus — Bab 1", start: 152, end: 14 },
    { num: 10, title: "Yuriko: Istri Kelas Atas yang Terjerumus — Bab 2", start: 170, end: 14 },
    { num: 11, title: "Yuriko: Istri Kelas Atas yang Terjerumus — Bab 3", start: 186, end: 14 },
    { num: 12, title: "Ekstra - Aku Mau Seorang Tuan", start: 203, end: 14 },
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
