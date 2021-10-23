function Book(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

Book.prototype.changeReadStatus = function() {
    this.haveRead = !this.haveRead;
}

const LIBRARY = {
    listOfBooks : [],
    addBookToLibrary : function(book) {
        book.indexInLibrary = this.listOfBooks.push(book) - 1; // push returns length
    },
    removeBookFromLibrary: function(bookIndex) {
        this.listOfBooks.splice(bookIndex, 1);
        this.updateRemainingBookIndexes(bookIndex); 
    },

    updateRemainingBookIndexes(bookIndex) {
        for(let i=bookIndex; i<this.listOfBooks.length; i++) {
            this.listOfBooks[i].indexInLibrary = i;
        }
    },
};

const BOOK_TABLE_DOM = {
    table: document.querySelector('.book-table'),

    displayAllBooks: function() {
        // removes the last table body, to allow update
        this.table.removeChild(this.table.lastChild);

        const tableBody = document.createElement('tbody');
        LIBRARY.listOfBooks.forEach(book => {
            const tableRow = this.putBookInRow(book);
            tableBody.appendChild(tableRow);
        });

        this.table.appendChild(tableBody);
    },

    putBookInRow: function(book) {
        const tableRow = document.createElement('tr');
        for(const key in book) {
            // for title, author and pages
            if(book.hasOwnProperty(key) && key != 'haveRead' && key != 'indexInLibrary') {
                const tableData = document.createElement('td');
                tableData.textContent = book[key];
                tableRow.appendChild(tableData);
            }

            if(key == 'haveRead' && book[key]) {
                const tableData = document.createElement('td');
                const haveReadButton = this.createHaveReadButton(book.indexInLibrary);
                tableData.appendChild(haveReadButton);
                tableRow.appendChild(tableData);
            }
      
            if(key == 'haveRead' && !book[key]) {
                const tableData = document.createElement('td');
                const haveNotReadButton = this.createHaveNotReadButton(book.indexInLibrary);
                tableData.appendChild(haveNotReadButton);
                tableRow.appendChild(tableData);
            }
        }

        const deleteButton = this.createDeleteButton(book.indexInLibrary);
        const tableData = document.createElement('td');
        tableData.appendChild(deleteButton);
        tableRow.appendChild(tableData);

        return tableRow;
    },

    createDeleteButton: function(bookIndex) {
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('data-book-index', bookIndex);
        deleteButton.classList.add('deleteButton');
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-trash');
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', this.handleDeleteButtonClick);

        return deleteButton;
    },

    createHaveReadButton: function(bookIndex) {
        const haveReadButton = document.createElement('button');
        haveReadButton.setAttribute('data-book-index', bookIndex);
        haveReadButton.classList.add('haveReadButton');
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-check');
        haveReadButton.appendChild(icon);
        haveReadButton.addEventListener('click', this.handleHaveReadButtonClick);

        return haveReadButton;
    },

    createHaveNotReadButton: function(bookIndex) {
        const haveNotReadButton = document.createElement('button');
        haveNotReadButton.setAttribute('data-book-index', bookIndex);
        haveNotReadButton.classList.add('haveNotReadButton');
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-times');
        haveNotReadButton.appendChild(icon);
        haveNotReadButton.addEventListener('click', this.handleHaveNotReadButtonClick);

        return haveNotReadButton;
    },

    /* ========= Event Listeners =========== */
    handleDeleteButtonClick: function(event) {
        const bookIndex = this.getAttribute('data-book-index');
        LIBRARY.removeBookFromLibrary(bookIndex);
        BOOK_TABLE_DOM.displayAllBooks();
    },

    handleHaveReadButtonClick: function(event) {
        const bookIndex = this.getAttribute('data-book-index');
        LIBRARY.listOfBooks[bookIndex].changeReadStatus();
        BOOK_TABLE_DOM.displayAllBooks(); // this function is a callback so I cant use "this"
    },

    handleHaveNotReadButtonClick: function(event) {
        const bookIndex = this.getAttribute('data-book-index');
        LIBRARY.listOfBooks[bookIndex].changeReadStatus();
        BOOK_TABLE_DOM.displayAllBooks();
    },
};

const BOOK_FORM = {
    form: document.querySelector('.book-form'),
    submitButton: document.querySelector('.submit-form-button'),

    addEventListenerToButton: function() {
        this.submitButton.addEventListener('click', this.handleSubmitButtonClick, false);
    },

    // Listener is a callback, cant use "this"
    handleSubmitButtonClick: function(event) {
        const formData = new FormData(BOOK_FORM.form);
        const title = formData.get('title');
        const author = formData.get('author');
        const pages = formData.get('pages');
        const haveRead = formData.get('haveRead') == 'true' ? true : false;

        if(BOOK_FORM.isNameValid(title) && BOOK_FORM.isNameValid(author) && BOOK_FORM.isNumberValid(pages) && BOOK_FORM.isNameValid(pages) && (haveRead || !haveRead) ) {
            const book = new Book(title, author, pages, haveRead);
            LIBRARY.addBookToLibrary(book);
            BOOK_TABLE_DOM.displayAllBooks();
            BOOK_FORM.resetForm();
            event.preventDefault(); // preventing focus on first input
        }
    },

    isNameValid: function(name) {
        if(name==='') {
            return false; 
        }
        return true;
    },

    isNumberValid: function(num) {
        if(isNaN(num)) {
            return false;
        }
        return true;
    }, 

    resetForm: function() {
        this.form.reset();
    }
};

/* ============ START OF PROGRAM =============== */
BOOK_FORM.addEventListenerToButton();

const book1 = new Book('Astro Boy', 'Japanese Dude', 200, false);
const book2 = new Book('Game of Thrones', 'George R. R. Martin', 345, true);

LIBRARY.addBookToLibrary(book1);
LIBRARY.addBookToLibrary(book2);

BOOK_TABLE_DOM.displayAllBooks();