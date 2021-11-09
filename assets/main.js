const buttonAdd = document.querySelector(".button-add");
const buttonClear = document.querySelector(".button-clear");
const formContainer = document.querySelector(".form-container");

// accordion
buttonAdd.addEventListener("click", function () {
  buttonAdd.classList.toggle("active");
  if (formContainer.style.display == "block") {
    formContainer.style.display = "none";
  } else {
    formContainer.style.display = "block";
  }
});

// web storage requirement
const localStorageKey = "bookshelfApp";
let bookshelfApp = [];
const saveBook = document.getElementById("saveBook");

// check browser support storage
const checkSupportedStorage = () => {
  return typeof Storage !== undefined;
};

if (checkSupportedStorage()) {
  if (localStorage.getItem(localStorageKey) === null) {
    bookshelfApp = [];
  } else {
    bookshelfApp = JSON.parse(localStorage.getItem(localStorageKey));
  }
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
}

// search book by title
const searchBook = (kw) => {
  const r =  bookshelfApp.filter(book => book.title.toLowerCase().includes(kw.toLowerCase()));
  renderBooks(r);
};

// add book to localStorage
const addBook = (Obj, localStorageKey) => {
  bookshelfApp.push(Obj);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
};

// delete book from localStorage
const deleteBook = (book) => {
  bookshelfApp.splice(book, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

// move to Finished Read
const finishedRead = (book) => {
  bookshelfApp[book].isComplete = true;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

// move to Book List
const unfinishedRead = (book) => {
  bookshelfApp[book].isComplete = false;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

// display book to html
const unfinishedReadId = "unfinished-read";
const finishedReadId = "finished-read";

const renderBooks = (bookshelfApp) => {
  const books = bookshelfApp;

  const listUnfinished = document.getElementById(unfinishedReadId);
  const listFinished = document.getElementById(finishedReadId);

  listUnfinished.innerHTML = "";
  listFinished.innerHTML = "";

  for (let book of books.keys()) {
    const listGroupItem = document.createElement("article");
    listGroupItem.classList.add("list-group-item");

    // book detail
    const bookDetail = document.createElement("div");
    bookDetail.classList.add("book-detail");

    // book detail child
    const bookTitle = document.createElement("b");
    bookTitle.innerHTML = books[book].title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("small");
    bookAuthor.innerHTML = "Author: " + books[book].author;

    const bookYear = document.createElement("p");
    bookYear.classList.add("small");
    bookYear.innerHTML = "Year: " + books[book].year;

    bookDetail.append(bookTitle, bookAuthor, bookYear);

    // book action
    const bookAction = document.createElement("div");
    bookAction.classList.add("book-action");

    // book action child
    const buttonRead = document.createElement("button");

    if (books[book].isComplete) {
      buttonRead.classList.add("button-finish");
      buttonRead.innerHTML = "Not finished read";
      buttonRead.addEventListener("click", () => {
        unfinishedRead(book);
      });
    } else {
      buttonRead.classList.add("button-unfinish");
      buttonRead.innerHTML = "Finished read";
      buttonRead.addEventListener("click", () => {
        finishedRead(book);
      });
    }
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("button-delete");
    buttonDelete.innerHTML = "Delete book";
    buttonDelete.addEventListener("click", () => {
      let confirmDelete = confirm(
        "Are you sure you want to delete the book '" + books[book].title + "'?"
      );
      if (confirmDelete) {
        deleteBook(book);
      }
    });

    bookAction.append(buttonRead, buttonDelete);

    // append book detail and action
    listGroupItem.append(bookDetail, bookAction);

    if (books[book].isComplete) {
      listFinished.append(listGroupItem);
    } else {
      listUnfinished.append(listGroupItem);
    }
  }
};

// searchForm event handler
searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (e) => {
  const kw = document.querySelector("#searchBookTitle").value;
  e.preventDefault();
  searchBook(kw);

});

// button save event handler
saveBook.addEventListener("click", function (event) {
  // input value from add new book form
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const year = document.getElementById("year");
  const isComplete = document.getElementById("isComplete");

  // put to object
  let Obj = {
    id: +new Date(),
    title: title.value,
    author: author.value,
    year: year.value,
    isComplete: isComplete.checked,
  };

  // checking blank field
  if (title.value && author.value && year.value) {
    // run addBook function for add book data to localStorage
    addBook(Obj, localStorageKey);
  } else {
    return alert("The field can't be blank");
  }

  // clear all input value
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  // hide accordion
  formContainer.style.display = "none";

  renderBooks(bookshelfApp);

  alert("Success, your book have been record");
});

//  button clear event handler
buttonClear.addEventListener("click", () => {
  let confirmClearAll = confirm(
    "Are you sure you want to clean up all the books?"
  );

  if (confirmClearAll) {
    localStorage.clear();
    bookshelfApp = [];
  }
  renderBooks(bookshelfApp);
});

// displays all the data that have entered into the localStorage
window.addEventListener("load", function () {
  if (checkSupportedStorage) {
    renderBooks(bookshelfApp);
  } else {
    alert("Your browser isn't support web storage");
  }
});