const books = [
  {
    id: Date.now(),
    image: "book-1.jpg",
    tittle: "Book: Hasil",
    author: "Author: Umera Ahmad ",
    price: "Price = 3000.PKR",
    description:
      'Description : "highlights the relevance of religion in a Muslims life."',
  },
];

function renderData() {
  const cardContainer = document.getElementById("container");
  const card = document.createElement("div");
  card.classList.add("card");
  const cardImage = document.createElement("img");
  const cardTittle = document.createElement("h2");
  const cardAuthor = document.createElement("h2");
  const cardPrice = document.createElement("h2");
  const cardDescription = document.createElement("p");

  books.forEach((item) => {
    cardImage.src = item.image;
    cardImage.alt = item.tittle;
    cardTittle.textContent = item.tittle;
    cardAuthor.textContent = item.author;
    cardPrice.textContent = item.price;
    cardDescription.textContent = item.description;
  });

  card.appendChild(cardImage);
  card.appendChild(cardTittle);
  card.appendChild(cardAuthor);
  card.appendChild(cardPrice);
  card.appendChild(cardDescription);
  cardContainer.appendChild(card);
}

renderData();

// const addBtn = document.getElementById("btn");

// addBtn.addEventListener("click", function addData() {
//   const newBook = {
//     image: "book-1.jpg",
//     tittle: "Book : lahasil",
//     author: "Author: Umera Ahmad ",
//     price: "Price = 3000.PKR",
//     description:
//       'Description : "highlights the relevance of religion in a Muslims life."',
//   };
//   books.push(newBook);

//   // console.log("updated books : ", books);
// });
//  renderData();

const addBookBtn = document.getElementById("btn");
const closeBtn = document.getElementById("closebtn");

const openDialog = () => {
  const dialog = document.getElementById("dialog");
  const dialogOverlay = document.querySelector(".dialog-overlay");
  dialog.style.opacity = 1;
  dialog.style.scale = 1;
  dialog.style.pointerEvents = "all";
  dialogOverlay.style.opacity = 1;
  dialogOverlay.style.pointerEvents = "all";
  document.body.style.overflow = "hidden";
};
const dialogOverlay = document.querySelector(".dialog-overlay");
dialogOverlay.addEventListener("click",()=>closeDialog());

const closeDialog = () => {
  const dialog = document.getElementById("dialog");
  const dialogOverlay = document.querySelector(".dialog-overlay");
  dialog.style.opacity = 0;
  dialog.style.scale = 0.9;
  dialog.style.pointerEvents = "none";
  dialogOverlay.style.opacity = 0;
  dialogOverlay.style.pointerEvents = "none";
  document.body.style.overflow = "auto";
};

const dialog=document.getElementById('dialog')
dialog.addEventListener('click',(e)=>{
e.stopPropagation()
})
addBookBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openDialog();
});

closeBtn.addEventListener("click", () => {
  closeDialog();
});

const addBookForm = document.getElementById("form");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const tittle = document.getElementById("tittle").value.trim();
  const author = document.getElementById("author").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();

  const formData = {
    id: Date.now(),
    image: "book-1.jpg",
    tittle: `Book :${tittle}`,
    author: `Author: ${author} `,
    price: `Price = ${price}`,
    description: `Description : ${description}`,
  };
  books.push(formData);
  closeDialog();
  renderData();
});
