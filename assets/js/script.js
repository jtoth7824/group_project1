var searchInfo = {
    author: {
        firstName: "Dan",
        lastName: "Brown"
    },
    bookTitle: "Angels and Demons"
};

$("#searchBtn").on("click", function () {

});

function displaySearchParams() {

}

/* function to save author name and book title to local storage */
function saveSearchInfo() {

    /* save book title and author name to local storage after changing object to String */
    localStorage.setItem("SearchInfo", JSON.stringify(searchInfo)); 
}

function init() {
    // Get stored events from localStorage
    // Parsing the JSON string to an object
    var savedInfo = JSON.parse(localStorage.getItem("SearchInfo"));

    // If events were not retrieved from localStorage, update local storage to searchInfo object
    if (savedInfo === null) {
        localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
    }

    /* call to display the search params area */
    displaySearchParams();
}

init();