var searchInfo = {
    author: {
        firstName: "",
        lastName: ""
    },
    bookTitle: "",
    bookisbn: "",
    eventId: ""
};
var startup = false;
var startupEvent = false;
var movieInfoArray = [];

var tempMovieInfo = {
    movieTitle: "",
    moviePlot: "",
    movieRating: "",
    movieRuntime: "",
    movieGenre: "",
    movieReleased: "",
    moviePosterLink: ""
};

var authorInfoArray = [];

var tempAuthorInfo = {
    authorFirst: "",
    authorLast: "",
    authorPhotoURL: "",
    authorSpotlight: "",
    authorID: ""
};

var bookInfoArray = [];

var tempBookInfo = {
    bookOnSale: "",
    bookFormat: "",
    bookNumPages: 0,
    bookTheme: "",
    bookPriceUSA: 0,
    bookCoverArt: "",
    bookSubjectDesc: "",
    bookISBN: ""
};


var authorEventInfoArray = [];

var tempAuthorEventInfo = {
    eventDescription: "",
    eventDate: "",
    eventLocation: "",
    eventAddress: "",
    eventCity: "",
    eventState: "",
    eventZip: ""
    //    eventTelephone: ""
};

var title = "anne of green gables";
var author = "Dan Brown";
var isbn = "9780593123843";
var authorid = "124249"; //Daniel Lieberman
var authoreventisbn = "9781524746988";
// var movideapiKey = "bea0d386";
// var bookapiKey = "tfugk99hpk2nt8sm3ve3peqy";
/* grab current day using day js to use to limit author events returned */
var currentDate = dayjs().format('M/DD/YYYY');
// The following url is how to retrieve the book cover.   Need an ISBN number
// <img src="http://covers.openlibrary.org/b/isbn/9780385533225-S.jpg" />

/* function to save author name and book title to local storage */
function saveSearchInfo() {

    /* save book title and author name to local storage after changing object to String */
    localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
}

function convertSearchTerm(searchTerm) {
    /* split book title into individual word array based upon space character as separator */
    var convert = searchTerm.split(" ");
    /* rejoin each array element with + between each word in string */
    convert = convert.join("+");
    return convert;
}

function buildMovieQueryURL() {
    var queryURL = "http://www.omdbapi.com/?";

    var movieTitle = convertSearchTerm(title);
    var queryParams = {
        "apikey": "bea0d386"
    };
    queryParams.t = movieTitle;
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

function buildAuthorQueryURL() {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/search/views/search-display?";

    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"
    };

    queryParams.q = convertSearchTerm(author);
    queryParams.preferLanguage = "EN";
    console.log(queryURL + $.param(queryParams));

    return queryURL + $.param(queryParams);
}

function buildBookTitleQueryURL(isbn) {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/";

    queryURL = queryURL + isbn + "?";
    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"
    };

    queryParams.preferLanguage = "EN";

    return queryURL + $.param(queryParams);
}

function buildEventQueryURL() {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

    queryURL = queryURL + authorid + "/events?";

    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"
    };

    queryParams.isbn = authoreventisbn;
    queryParams.eventDateFrom = currentDate;
    queryParams.sort = "eventdate";
    console.log(queryURL + $.param(queryParams));

    return queryURL + $.param(queryParams);
}

function retrieveCoverArt(isbn) {
    var srcCoverArt = "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg";

    return srcCoverArt;
}

function displayMovieInfo() {
    var url;

    /* build url for movie api call utilzing the book title chosen */
    url = buildMovieQueryURL();
    console.log(url);
    /* make ajax call to retrieve movie object */
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            console.log(response);
            /* clear movie info */

            /* clear goes above here */

            /* create elements to display movie info to page */


        }
    })
}



function init() {
    // Get stored events from localStorage
    // Parsing the JSON string to an object
    var savedInfo = JSON.parse(localStorage.getItem("SearchInfo"));

    // If events were not retrieved from localStorage, update local storage to searchInfo object
    if (savedInfo === null) {
        localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
    }
    else {
        startup = true;
        startup = true;
        searchInfo = savedInfo;
        getAuthorInfo();
    }

    /* call to display the search params area */
//    displaySearchParams();
}

init();

$('.dropdown-trigger').dropdown();
$('.dropdown-trigger2').dropdown();
$('.dropdown-trigger3').dropdown();


































//Create ajax calls to retrieve movie info

/*var movieURL = "https://...";
$.ajax({
    url: URL,
    method: "GET",
}).then(function(response){

    if (response.error === " NOT FOUND"){
            //
    }
    else {
    

        //movie title
        var mTitle = response.title;

        //plot
        var mplot = response.plot;


        //rating
        var mRating = response.rating;
        


        //runningTime
        var mTime = response.runningTime;

        //genre
        var mgenre = response.genre;



        //releaseDate
        var mDate = response.releaseDate;



    }

}
)



//Create ajax calls to retrieve book info

$.ajax({
    url: bookURL,
    method: "GET",
  }).then(function (response1) {

    if (response1.items === 0){



    }




    

    else {




    }


  })
*/



















































































$("#searchBtn").on("click", function () {
    /* save user entered info to searchInfo object */
    //searchInfo.bookTitle = $("#bookTitle").val().trim();
    searchInfo.author.firstName = $("#firstName").val().trim();
    searchInfo.author.lastName = $("#lastName").val().trim();
console.log(searchInfo);
    /* save user entered search criteria to local storage */
    saveSearchInfo();
    /*clear search terms in input boxes */
    $("#bookTitle").val("");
    $("#firstName").val("");
    $("#lastName").val("");

    var listEl = $("<li>");
    var listDivEl = $("<li>");
    var aEl = $("<a>");

    $(aEl).attr("href", "#!");
    $(aEl).text(searchInfo.bookTitle);
    $(listEl).append(aEl);
    $(listDivEl).addClass("divider");
    $(listDivEl).attr("tabindex", "-1");
    console.log(listEl);
    $("#dropdown1").append(listEl);
    $("#dropdown1").append(listDivEl);
});

function buildAuthorContentQueryURL(forcedauthorid) {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";
    queryURL = queryURL + forcedauthorid + "?";
    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"
    }
    queryParams.preferLanguage = "EN";
    console.log("authorcontent query");
    return queryURL + $.param(queryParams);
}

function buildAuthorTitlesQueryURL(forcedauthorid) {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";
    queryURL = queryURL + forcedauthorid + "/titles?";

    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"

    }
    queryParams.preferLanguage = "EN";
    queryParams.rows = 0;
    //   queryParams.format = "HC";
    queryParams.language = "E";
    return queryURL + $.param(queryParams);
}

function buildPickedEventQueryURL(whichEvent) {
    var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/events/";

    queryURL = queryURL + whichEvent + "?";

    var queryParams = {
        "api_key": "tfugk99hpk2nt8sm3ve3peqy"
    }

    queryParams.preferLanguage = "EN";
    return queryURL + $.param(queryParams);
}

function getAuthorInfo() {
    var url1;
    var author = searchInfo.author.firstName + " " + searchInfo.author.lastName;
    console.log("author = " + author);
    url1 = buildAuthorQueryURL(author);
    $.ajax({
        type: "GET",
        url: url1,
        success: function (response) {
            tempAuthorInfo.authorPhotoURL = response.data.results[0].authorPhotoUrl;
            tempAuthorInfo.authorSpotlight = response.data.results[0].authorBio;
            tempAuthorInfo.authorID = response.data.results[0].authorId;
            authorInfoArray.push(tempAuthorInfo);
            $("#authorBio").html(tempAuthorInfo.authorSpotlight);
            $("#authorPhoto").attr("src", tempAuthorInfo.authorPhotoURL);

            var url2;
            url2 = buildAuthorTitlesQueryURL(tempAuthorInfo.authorID);
            $.ajax({
                type: "GET",
                url: url2,
                success: function (response) {
                    /* build list of book titles for dropdown list */
                    for (var i = 0; i < response.data.titles.length; i++) {
                        var listEl = $("<li>");
                        var listDivEl = $("<li>");
                        var aEl = $("<a>");

                        $(aEl).attr("href", "#!");
                        /* save isbn number as attribute so future api call can happen based upon which book was clicked */
                        $(aEl).attr("isbn", response.data.titles[i].isbn);
                        $(aEl).text(response.data.titles[i].title);
                        $(aEl).addClass("book-list-item");
                        $(listEl).append(aEl);
                        $(listDivEl).addClass("divider");
                        $(listDivEl).attr("tabindex", "-1");
                        console.log(listEl);
                        $("#dropdown1").append(listEl);
                        $("#dropdown1").append(listDivEl);
                    }
                }
            });
        }
    });
}

function clearAuthorInfo() {
    $("#authorSpotlight").text("");
    $("#authorSpotlight").removeAttr("src");
//    $("#authorPhotoURL").attr("src", "");
}

function clearEventInfo() {
    $("#eventLocation").val("");
    $("#eventDesc").val("");
    $("#eventDate").val("");
    $("#eventTime").val("");
    $("#eventAddress").val("");
    $("#eventCity").val("");
    $("#eventState").val("");
    $("#eventZip").val(""); 
}



















