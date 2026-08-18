// ---------- State ----------
const STORAGE_KEY = "knowledgeHubBooks";
const DEFAULT_IMAGE = "book-1.jpg";

const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
  "hasil.jpg",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
  "book-1.jpg",
];

function getRandomDummyImage() {
  return DUMMY_IMAGES[Math.floor(Math.random() * DUMMY_IMAGES.length)];
}

const SAMPLE_BOOKS = [
  {
    id: "sample-1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 3200,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    createdAt: Date.now() - 5000,
  },
  {
    id: "sample-2",
    title: "Hasil",
    author: "Umera Ahmed",
    price: 1800,
    image: "hasil.jpg",
    description: "A famous novel exploring human struggles, faith, and spiritual discovery.",
    createdAt: Date.now() - 4000,
  },
  {
    id: "sample-3",
    title: "Deep Work",
    author: "Cal Newport",
    price: 2500,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    description: "Rules for Focused Success in a Distracted World.",
    createdAt: Date.now() - 3000,
  },
  {
    id: "sample-4",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 2900,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop&q=80",
    description: "Timeless lessons on wealth, greed, and happiness.",
    createdAt: Date.now() - 2000,
  },
  {
    id: "sample-5",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 4200,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
    description: "A Handbook of Agile Software Craftsmanship.",
    createdAt: Date.now() - 1000,
  },
  {
    id: "sample-6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 2100,
    image: "book-1.jpg",
    description: "A magical story about following your dreams.",
    createdAt: Date.now(),
  },
];

/** @type {Array<{id:string,title:string,author:string,price:number,image:string,description:string,createdAt:number}>} */
let books = loadBooks();
let editingId = null;

// ---------- DOM refs ----------
const grid = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const bookCount = document.getElementById("bookCount");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const overlay = document.getElementById("dialogOverlay");
const dialog = document.getElementById("dialog");
const dialogTitle = document.getElementById("dialogTitle");
const form = document.getElementById("form");
const addBookBtn = document.getElementById("addBookBtn");
const closeBtn = document.getElementById("closeBtn");

// ---------- Image URL Helper ----------
function normalizeImageUrl(url) {
  if (!url) return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  // If already starts with a protocol scheme (http://, https://, data:, blob:, file://)
  if (/^(https?:\/\/|data:|blob:|file:\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  // Relative path starting with / or ./ or ../
  if (/^(\/|\.\/|\.\.\/)/.test(trimmed)) {
    return trimmed;
  }

  // Exact local image files in directory
  const knownLocalFiles = ["book-1.jpg", "hasil.jpg"];
  if (knownLocalFiles.includes(trimmed.toLowerCase())) {
    return trimmed;
  }

  // Simple local file name without path like "mycover.png"
  if (/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
    return trimmed;
  }

  // External web URL missing protocol (e.g. images.unsplash.com/..., www.example.com/...)
  return "https://" + trimmed;
}

// ---------- Persistence ----------
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SAMPLE_BOOKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_BOOKS;
  } catch {
    return SAMPLE_BOOKS;
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// ---------- CRUD ----------
function createBook(data) {
  books.push({
    id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
    createdAt: Date.now(),
    ...data,
  });
  saveBooks();
}

function updateBook(id, data) {
  const book = books.find((b) => b.id === id);
  if (book) Object.assign(book, data);
  saveBooks();
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooks();
}

// ---------- Filtering / sorting (Read) ----------
function getVisibleBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let result = books.filter((b) => {
    if (!query) return true;
    return (
      b.title.toLowerCase().includes(query) ||
      (b.author || "").toLowerCase().includes(query)
    );
  });

  const sorters = {
    newest: (a, b) => b.createdAt - a.createdAt,
    "title-asc": (a, b) => a.title.localeCompare(b.title),
    "title-desc": (a, b) => b.title.localeCompare(a.title),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  return result.sort(sorters[sort] || sorters.newest);
}

// ---------- Render ----------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render() {
  const visible = getVisibleBooks();
  grid.innerHTML = "";

  if (books.length === 0) {
    emptyState.hidden = false;
    emptyState.querySelector(".empty-title").textContent = "No books yet";
    emptyState.querySelector(".empty-sub").textContent =
      'Click "Add Book" to build your library.';
  } else if (visible.length === 0) {
    emptyState.hidden = false;
    emptyState.querySelector(".empty-title").textContent = "No matches";
    emptyState.querySelector(".empty-sub").textContent =
      "Try a different search term.";
  } else {
    emptyState.hidden = true;
  }

  bookCount.textContent = `${visible.length} of ${books.length} book${
    books.length === 1 ? "" : "s"
  }`;

  visible.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";
    const rawImg = normalizeImageUrl(book.image) || DEFAULT_IMAGE;
    card.innerHTML = `
      <img class="card-img" src="${escapeHtml(rawImg)}"
           alt="${escapeHtml(book.title)}"
           loading="lazy"
           onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'" />
      <div class="card-body">
        <h2 class="card-title">${escapeHtml(book.title)}</h2>
        ${book.author ? `<p class="card-author">by ${escapeHtml(book.author)}</p>` : ""}
        <p class="card-price">Rs. ${Number(book.price).toLocaleString()}</p>
        ${book.description ? `<p class="card-desc">${escapeHtml(book.description)}</p>` : ""}
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost" data-action="edit" data-id="${book.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${book.id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- Dialog ----------
function openDialog(book) {
  editingId = book ? book.id : null;
  dialogTitle.textContent = book ? "Edit Book" : "Add Book";

  form.title.value = book ? book.title : "";
  form.author.value = book ? book.author || "" : "";
  form.price.value = book ? book.price : "";
  form.image.value = book ? book.image || "" : "";
  form.description.value = book ? book.description || "" : "";

  overlay.hidden = false;
  void overlay.offsetWidth;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  form.title.focus();
}

function closeDialog() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  editingId = null;
  form.reset();
  setTimeout(() => {
    overlay.hidden = true;
  }, 220);
}

// ---------- Events ----------
addBookBtn.addEventListener("click", () => openDialog(null));
closeBtn.addEventListener("click", closeDialog);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeDialog();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeDialog();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const rawImage = form.image.value.trim();
  const normalizedImage = rawImage ? normalizeImageUrl(rawImage) : getRandomDummyImage();

  const data = {
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    price: Number(form.price.value) || 0,
    image: normalizedImage,
    description: form.description.value.trim(),
  };

  if (!data.title) {
    form.title.focus();
    return;
  }

  if (editingId) {
    updateBook(editingId, data);
  } else {
    createBook(data);
  }

  closeDialog();
  render();
});

// Delegated card actions (edit / delete)
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;

  if (btn.dataset.action === "edit") {
    const book = books.find((b) => b.id === id);
    if (book) openDialog(book);
  } else if (btn.dataset.action === "delete") {
    const book = books.find((b) => b.id === id);
    if (book && confirm(`Delete "${book.title}"?`)) {
      deleteBook(id);
      render();
    }
  }
});

// Filtering
searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

// ---------- Init ----------
render();
