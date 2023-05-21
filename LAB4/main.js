document.addEventListener('DOMContentLoaded', function() {
    fetch('https://2022148033.github.io/HomeworkRepository/LAB4/product.json')
        .then(response => response.json())
        .then(json => init(json))
        .catch(err => console.error(`Fetch Problem: ${err.message}`));
});

function init(books) {
    const itemBox = document.querySelector('.itemBox');
    const category = document.getElementById('category');
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    const filter_submit = document.querySelector('button');

    //initialize
    let lastCategory = category.value;
    let lastSearch = '';
    let lastSort = sort.value;

    let finalGroup;
    let displayedBooks = 0;

    finalGroup = books;
    updateDisplay();

    //wait for filter button click
    filter_submit.addEventListener('click', syncFilter);

    //infinite scroll
    document.addEventListener('scroll', function() {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - document.querySelector('.description').getBoundingClientRect().height) loadBooks();
    });

    function syncFilter(e) {
        e.preventDefault();

        displayedBooks = 0;

        categoryGroup = [];
        searchGroup = [];
        sortedGroup = [];
        finalGroup = [];

        if(category.value === lastCategory && search.value.trim() === lastSearch && sort.value === lastSort) return;
        else{
            lastCategory = category.value;
            lastSearch = search.value.trim();
            lastSort = sort.value;
            filterBooks();
        }
    }

    function filterBooks() {
        finalGroup = books;

        //category
        if(category.value === 'All'){
            //
        }
        else finalGroup = books.filter(book => book.category === category.value);

        //search
        if(search.value.trim() === ''){
            //
        }
        else{
            const keyword = search.value.trim().toLowerCase();
            finalGroup = finalGroup.filter(book => book.title.toLowerCase().includes(keyword));
        }

        //sort
        if(sort.value === 'Ascending'){
            finalGroup = finalGroup.sort((a, b) => a.price - b.price);
        }
        else if(sort.value === 'Descending'){
            finalGroup = finalGroup.sort((a, b) => b.price - a.price);
        }
        else{//None
            //
        }

        updateDisplay();
    }

    function updateDisplay() {   
        console.log(finalGroup);
        
        //remove all elements
        while(itemBox.firstChild){
            itemBox.removeChild(itemBox.firstChild);
        }

        //insert elements
        if(finalGroup == undefined || finalGroup.length === 0){
            const tmp = document.createElement('p');
            tmp.textContent = "No result";
            itemBox.appendChild(tmp);
        }
        else{
            loadBooks();
        }
    }

    function showBook(book) {
        const imageURL = `images/${book.image}`;

        const newBook = document.createElement('div');
        newBook.setAttribute('class', 'item');

        const bookImage = document.createElement('img');
        bookImage.src = imageURL;
        bookImage.alt = book.title;

        const bookInfo = document.createElement('div');

        const bookTitle = document.createElement('div');
        bookTitle.innerText = book.title;
        const bookAuthor = document.createElement('div');
        bookAuthor.innerText = book.author;
        const bookPrice = document.createElement('div');
        bookPrice.innerText = '$' + book.price;

        itemBox.appendChild(newBook);
        newBook.appendChild(bookImage);
        newBook.appendChild(bookInfo);
        bookInfo.appendChild(bookTitle);
        bookInfo.appendChild(bookAuthor);
        bookInfo.appendChild(bookPrice);

        let height = document.getElementById('filter').offsetHeight;
        console.log(`height: ${height}, book: ${newBook.offsetHeight}`);
        if(height < newBook.offsetHeight){
            height = newBook.offsetHeight;
            console.log(`change height`);
            console.log(`height: ${height}, book: ${newBook.offsetHeight}`);
        }

        //click event
        bookInfo.addEventListener('click', function() {
            //Hidden
            if(bookInfo.style.opacity == 0) bookInfo.style.opacity = 1;
            //Open
            else bookInfo.style.opacity = 0;
        })
    }

    function loadBooks() {
        if(displayedBooks >= finalGroup.length) return;

        const displayUnitBooks = 6;
        let startIndex = displayedBooks;
        let endIndex = Math.min((displayedBooks + displayUnitBooks), finalGroup.length + 1);
        displayedBooks = endIndex;

        let tmp = finalGroup.slice(startIndex, endIndex);

        for(const book of tmp){
            showBook(book);
        }
    }
}
