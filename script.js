// ============================================
// DIGITAL CREATIVITY BOOKLET - 8 PAGES
// ============================================

// Page Configuration (8 pages total)
const pagesConfig = [
    { id: 0, file: "pages/01-cover.html", title: "Cover", class: "cover-page" },
    { id: 1, file: "pages/02-introduction.html", title: "Introduction", class: "" },
    { id: 2, file: "pages/03-problem-statement.html", title: "Problem Statement", class: "" },
    { id: 3, file: "pages/04-technology.html", title: "Technology", class: "" },
    { id: 4, file: "pages/05-future-trends.html", title: "Future Trends", class: "" },
    { id: 5, file: "pages/06-project-management.html", title: "Project Management", class: "" },
    { id: 6, file: "pages/07-processes.html", title: "Processes", class: "" },
    { id: 7, file: "pages/08-conclusion-references.html", title: "Conclusion & References", class: "" }
];

// Chapter navigation
const chapters = [
    { page: 0, title: "Cover" },
    { page: 1, title: "Introduction" },
    { page: 2, title: "Problem" },
    { page: 3, title: "Technology" },
    { page: 4, title: "Future" },
    { page: 5, title: "Management" },
    { page: 6, title: "Processes" },
    { page: 7, title: "Conclusion" }
];

// State
let currentPage = 0;
let totalPages = pagesConfig.length;
let isAnimating = false;
let pagesLoaded = false;

// DOM Elements
let prevBtn, nextBtn, currentPageDisplay, totalPagesDisplay, progressBar, chapterNav, bookPages, fullscreenBtn;

// Fullscreen state
let isFullscreen = false;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    await loadAllPages();
    createChapterNavigation();
    initializeEventListeners();
    updateUI();
});

function initializeElements() {
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    currentPageDisplay = document.getElementById('currentPage');
    totalPagesDisplay = document.getElementById('totalPages');
    progressBar = document.getElementById('progressBar');
    chapterNav = document.getElementById('chapterNav');
    bookPages = document.getElementById('bookPages');
    fullscreenBtn = document.getElementById('fullscreenBtn');

    // Fullscreen navigation buttons
    const fullscreenPrevBtn = document.getElementById('fullscreenPrevBtn');
    const fullscreenNextBtn = document.getElementById('fullscreenNextBtn');

    if (fullscreenPrevBtn) fullscreenPrevBtn.addEventListener('click', previousPage);
    if (fullscreenNextBtn) fullscreenNextBtn.addEventListener('click', nextPage);

    if (totalPagesDisplay) {
        totalPagesDisplay.textContent = totalPages;
    }
}

// ============================================
// LOAD PAGES FROM SEPARATE FILES
// ============================================

async function loadAllPages() {
    for (const pageConfig of pagesConfig) {
        try {
            const response = await fetch(pageConfig.file);
            const content = await response.text();

            const pageDiv = document.createElement('div');
            pageDiv.className = `page ${pageConfig.class}`;
            pageDiv.setAttribute('data-page', pageConfig.id);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'page-content';
            contentDiv.innerHTML = content;

            pageDiv.appendChild(contentDiv);
            bookPages.appendChild(pageDiv);

            if (pageConfig.id === 0) {
                pageDiv.classList.add('active');
            }
        } catch (error) {
            console.error(`Error loading ${pageConfig.file}:`, error);
            const errorDiv = document.createElement('div');
            errorDiv.className = `page ${pageConfig.class}`;
            errorDiv.setAttribute('data-page', pageConfig.id);
            errorDiv.innerHTML = `
                <div class="page-content">
                    <h3>Error Loading Page</h3>
                    <p>Could not load ${pageConfig.file}</p>
                </div>
            `;
            bookPages.appendChild(errorDiv);
        }
    }
    pagesLoaded = true;
}

// ============================================
// CHAPTER NAVIGATION
// ============================================

function createChapterNavigation() {
    if (!chapterNav) return;

    chapterNav.innerHTML = '';
    chapters.forEach(chapter => {
        const btn = document.createElement('button');
        btn.className = 'chapter-btn';
        btn.textContent = chapter.title;
        btn.addEventListener('click', () => goToPage(chapter.page));
        chapterNav.appendChild(btn);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    if (prevBtn) prevBtn.addEventListener('click', previousPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', handleKeyboard);

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextPage() : previousPage();
        }
    }, { passive: true });
}

function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':  // Added: Down arrow goes to next page
        case 'PageDown':
            e.preventDefault();
            nextPage();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':    // Added: Up arrow goes to previous page
        case 'PageUp':
            e.preventDefault();
            previousPage();
            break;
        case 'Home':
            e.preventDefault();
            goToPage(0);
            break;
        case 'End':
            e.preventDefault();
            goToPage(totalPages - 1);
            break;
        case ' ':  // Added: Spacebar goes to next page
            e.preventDefault();
            nextPage();
            break;
    }
}

// ============================================
// PAGE NAVIGATION
// ============================================

function nextPage() {
    if (currentPage < totalPages - 1 && !isAnimating) {
        goToPage(currentPage + 1);
    }
}

function previousPage() {
    if (currentPage > 0 && !isAnimating) {
        goToPage(currentPage - 1);
    }
}

function goToPage(pageNumber) {
    if (!pagesLoaded || pageNumber < 0 || pageNumber >= totalPages || pageNumber === currentPage || isAnimating) {
        return;
    }

    isAnimating = true;
    const oldPage = currentPage;
    currentPage = pageNumber;

    const pages = document.querySelectorAll('.page');
    pages.forEach((page, index) => {
        page.classList.remove('active', 'prev');

        if (index === currentPage) {
            setTimeout(() => page.classList.add('active'), 50);
        } else if (index === oldPage) {
            page.classList.add('prev');
        }
    });

    setTimeout(() => {
        updateUI();
        isAnimating = false;
    }, 500);
}

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
    updatePageIndicator();
    updateProgressBar();
    updateNavigationButtons();
    updateChapterButtons();
}

function updatePageIndicator() {
    if (currentPageDisplay) {
        currentPageDisplay.textContent = currentPage + 1;
    }
}

function updateProgressBar() {
    if (progressBar && totalPages > 1) {
        const progress = (currentPage / (totalPages - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function updateNavigationButtons() {
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages - 1;
}

function updateChapterButtons() {
    const chapterButtons = chapterNav.querySelectorAll('.chapter-btn');

    let currentChapterIndex = 0;
    for (let i = 0; i < chapters.length; i++) {
        if (currentPage >= chapters[i].page) {
            currentChapterIndex = i;
        }
    }

    chapterButtons.forEach((btn, index) => {
        btn.classList.toggle('active', index === currentChapterIndex);
    });
}

// ============================================
// FULLSCREEN TOGGLE (Native Browser API - Like YouTube)
// ============================================

function toggleFullscreen() {
    const bookletContainer = document.querySelector('.booklet-container');
    const fullscreenIcon = document.getElementById('fullscreenIcon');

    if (!document.fullscreenElement) {
        // Enter fullscreen mode
        if (bookletContainer.requestFullscreen) {
            bookletContainer.requestFullscreen();
        } else if (bookletContainer.webkitRequestFullscreen) { // Safari
            bookletContainer.webkitRequestFullscreen();
        } else if (bookletContainer.msRequestFullscreen) { // IE11
            bookletContainer.msRequestFullscreen();
        }
        fullscreenIcon.textContent = '⛶';
        fullscreenBtn.title = 'Exit Fullscreen (ESC)';
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
        fullscreenIcon.textContent = '⛶';
        fullscreenBtn.title = 'Toggle Fullscreen';
    }
}

// Listen for fullscreen changes (when user presses ESC)
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    if (document.fullscreenElement) {
        fullscreenIcon.textContent = '⛶';
        fullscreenBtn.title = 'Exit Fullscreen (ESC)';
    } else {
        fullscreenIcon.textContent = '⛶';
        fullscreenBtn.title = 'Toggle Fullscreen';
    }
}

console.log('%c Digital Creativity Booklet ', 'background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c Group 11 | OCC1 - 2026 | 8 Pages ', 'color: #a855f7; font-size: 12px;');
