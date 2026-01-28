// 1. Unified Book Data (One source of truth)
const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "fiction", cover: "https://placehold.co/220x280/4a6fa5/ffffff?text=Gatsby", rating: 4.3, year: 1925, status: "available" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "fiction", cover: "https://placehold.co/220x280/6b8cbc/ffffff?text=Mockingbird", rating: 4.5, year: 1960, status: "available" },
    { id: 3, title: "1984", author: "George Orwell", genre: "sci-fi", cover: "https://placehold.co/220x280/e63946/ffffff?text=1984", rating: 4.2, year: 1949, status: "borrowed" },
    { id: 4, title: "The Silent Patient", author: "Alex Michaelides", genre: "mystery", cover: "https://placehold.co/220x280/1d3557/ffffff?text=Patient", rating: 4.1, year: 2019, status: "available" },
    { id: 5, title: "Sapiens", author: "Yuval Noah Harari", genre: "non-fiction", cover: "https://placehold.co/220x280/f1faee/4a6fa5?text=Sapiens", rating: 4.6, year: 2011, status: "available" },
    { id: 10, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fantasy", cover: "https://placehold.co/220x280/1d3557/ffffff?text=Hobbit", rating: 4.6, year: 1937, status: "available" }
];

// 2. DOM Elements (Using optional checks)
const featuredBooksContainer = document.getElementById('featured-books');
const booksContainer = document.getElementById('books-container');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const sortBy = document.getElementById('sort-by');
const emptyState = document.getElementById('empty-state');
const loader = document.getElementById('loader');

// 3. Helper: Create a book card
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
        <div class="book-cover" style="background-image: url('${book.cover}')">
            <div class="book-status ${book.status}">${book.status}</div>
        </div>
        <div class="book-info">
            <h3>${book.title}</h3>
            <p class="author">${book.author}</p>
            <div class="book-meta">
                <span>${book.genre}</span>
                <span><i class="fas fa-star"></i> ${book.rating}</span>
            </div>
            <div class="book-actions">
                ${book.status === 'available' ? 
                    `<button class="btn btn-primary" onclick="handleBorrow(${book.id})">Borrow</button>` : 
                    `<button class="btn btn-outline" disabled>Borrowed</button>`}
                <button class="btn btn-outline">Preview</button>
            </div>
        </div>
    `;
    return bookCard;
}

// 4. Handle Borrowing Logic
function handleBorrow(bookId) {
    if (loader) loader.style.display = 'block';
    
    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        alert('Book successfully borrowed!');
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.status = 'borrowed';
            renderCatalog(); // Refresh the list
        }
    }, 1000);
}

// 5. Filter and Sort Logic for Catalog
function renderCatalog() {
    if (!booksContainer) return; // Exit if not on catalog page

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const genre = genreFilter ? genreFilter.value : 'all';

    let filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = genre === 'all' || book.genre === genre;
        return matchesSearch && matchesGenre;
    });

    booksContainer.innerHTML = '';
    if (filtered.length === 0 && emptyState) {
        emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        filtered.forEach(book => booksContainer.appendChild(createBookCard(book)));
    }
}

// 6. Initialize Page Specific Content
document.addEventListener('DOMContentLoaded', () => {
    // If on HOME page (featured section exists)
    if (featuredBooksContainer) {
        const featured = books.slice(0, 4);
        featured.forEach(book => featuredBooksContainer.appendChild(createBookCard(book)));
    }

    // If on CATALOG page (filters exist)
    if (booksContainer) {
        renderCatalog();
        if (searchInput) searchInput.addEventListener('input', renderCatalog);
        if (genreFilter) genreFilter.addEventListener('change', renderCatalog);
        if (sortBy) sortBy.addEventListener('change', renderCatalog);
    }
    
    // Simple Button Redirects
    const browseBtn = document.getElementById('browse-catalog');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => window.location.href = 'catalog.html');
    }
});