var searchInfo = {
  author: {
    firstName: "",
    lastName: "",
  },
  bookTitle: "",
  bookisbn: "",
  eventId: "",
};
var startup = false;
var startupEvent = false;
var authorID;
var bookTitle;

// var movideapiKey = "bea0d386";
// var bookapiKey = "tfugk99hpk2nt8sm3ve3peqy";
/* grab current day using day js to use to limit author events returned */
var currentDate = dayjs().format("M/DD/YYYY");

/* function to save author name and book title to local storage */
function saveSearchInfo() {
  
  /* save book title and author name to local storage after changing object to String */
  localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
}

function convertSearchTerm(searchTerm) {
  console.log(searchTerm);
  /* split book title into individual word array based upon space character as separator */
  var convert = searchTerm.split(" ");
  /* rejoin each array element with + between each word in string */
  convert = convert.join("+");
  return convert;
}

function buildMovieQueryURL(bookTitle) {
  var queryURL = "http://www.omdbapi.com/?";

  var movieTitle = convertSearchTerm(bookTitle);
  var queryParams = {
    apikey: "bea0d386",
  };
  queryParams.t = movieTitle;
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}

function buildAuthorQueryURL(author) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/search/views/search-display?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.q = convertSearchTerm(author);
  queryParams.preferLanguage = "EN";
  console.log(queryURL + $.param(queryParams));

  return queryURL + $.param(queryParams);
}

function buildBookTitleQueryURL(isbn) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/";

  queryURL = queryURL + isbn + "?";
  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.preferLanguage = "EN";

  return queryURL + $.param(queryParams);
}

function buildEventQueryURL(authorid, authoreventisbn) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

  queryURL = queryURL + authorid + "/events?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
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
    url = buildMovieQueryURL(bookTitle);
    console.log(url);
    /* make ajax call to retrieve movie object */
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            if (response.Error === "Movie not found!") {
                $("#movieCard").addClass("hidden");
                $("#movieNotFound").removeClass("hidden");
                $("#alternateMovieText").text("No movie found that matched the book selected.");
            } else {
                $("#movieNotFound").addClass("hidden");
                $("#movieCard").removeClass("hidden");
                console.log(response);
                clearMovieInfo();
                console.log("movie array");

                $("#movieTitle").val(response.Title);
                $("#moviePlot").text(response.Plot);
                $("#movieRated").val(response.Rated);
                $("#movieRuntime").val(response.Runtime);
                $("#movieGenre").val(response.Genre);
                $("#movieReleased").val(response.Released);
                M.updateTextFields();
                if (response.Poster === "N/A") {
                    $("#moviePoster").addClass("hidden");
                    $("#notAvailableText").removeClass("hidden");
                    $("#notAvailableText").text("No movie poster available");
                }
                else {
                    $("#notAvailableText").addClass("hidden");
                    $("#moviePoster").removeClass("hidden");

                }
                $("#moviePoster").attr("src", response.Poster);
            }
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
    } else {
        startup = true;
        startup = true;
        searchInfo = savedInfo;
        clearAuthorInfo();
        clearBookInfo();
        clearEventInfo();
        clearMovieInfo();
        getAuthorInfo();
        getBookInfo();
        getEventInfo();
    }
}

init();

$(".dropdown-trigger").dropdown();
$(".dropdown-trigger2").dropdown();
$(".dropdown-trigger3").dropdown();


































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
    $("#dropdown1").empty();
    $("authorEvents").empty();
    clearBookInfo();
    clearAuthorInfo();
    clearMovieInfo();
    clearEventInfo();
    getAuthorInfo();

});

function buildAuthorContentQueryURL(forcedauthorid) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";
  queryURL = queryURL + forcedauthorid + "?";
  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };
  queryParams.preferLanguage = "EN";
  console.log("authorcontent query");
  return queryURL + $.param(queryParams);
}

function buildAuthorTitlesQueryURL(forcedauthorid) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

  queryURL = queryURL + forcedauthorid + "/titles?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };
  queryParams.preferLanguage = "EN";
  queryParams.rows = 0;
  //   queryParams.format = "HC";
  queryParams.language = "E";
  return queryURL + $.param(queryParams);
}

function buildPickedEventQueryURL(whichEvent) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/events/";

  queryURL = queryURL + whichEvent + "?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.preferLanguage = "EN";
  return queryURL + $.param(queryParams);
}

function getAuthorInfo() {
  var url1;
  var author = searchInfo.author.firstName + " " + searchInfo.author.lastName;
  url1 = buildAuthorQueryURL(author);
  $.ajax({
    type: "GET",
    url: url1,
    success: function (response) {
            if(response.data.results[0].authorBio === null || response.data.results[0].authorBio === "N/A") {
                $("#authorBio").html("No author biography provided.");
                $("#authorPhoto").attr("src", response.data.results[0].authorPhotoUrl);
            }
            else {
                $("#authorBio").html(response.data.results[0].authorBio);
                $("#authorPhoto").attr("src", response.data.results[0].authorPhotoUrl);
                authorID = response.data.results[0].authorId;
                console.log("authorID after setting from response");
                console.log(authorID);
                var url2;
                url2 = buildAuthorTitlesQueryURL(response.data.results[0].authorId);
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
        }
    });
}

function clearBookInfo() {
    $("#title").val("");
    $("#saleDate").val("");
    $("#format").val("");
    $("#numPages").val("");
    $("#price").val("");
    $("#isbn").val("");
    $("#bookCover").removeAttr("src");
    //    $("#bookCover").attr("src", "");
}

function clearAuthorInfo() {
    $("#authorSpotlight").text("");
    $("#authorSpotlight").removeAttr("src");
    //    $("#authorPhotoURL").attr("src", "");
}

function clearMovieInfo() {
  $("#movieTitle").val("");
  $("#moviePlot").text("");
  $("#movieRated").val("");
  $("#movieRuntime").val("");
  $("#movieGenre").val("");
  $("#movieReleased").val("");
  $("moviePoster").removeAttr("src");
  $("#moviePoster").attr("src", "");
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

/* listener event for book dropdown list */
$(document).on("click", ".book-list-item", getBookInfo);
/* listener event for author event dropdown list */
$(document).on("click", ".event-list-item", getEventInfo);

/* populate author event info based upon which event user selected */
function getEventInfo() {

    if (startupEvent) {
        whichEvent = searchInfo.eventId;
        startupEvent = false;
        console.log("eventId:  " + searchInfo.eventId);
        console.log("whichEvent:  " + whichEvent);
    } else {
        var whichEvent = $(this).attr("eventId");
        console.log("inside else");
        console.log(whichEvent);
        searchInfo.eventId = $(this).attr("eventId");
        saveSearchInfo();
    }

    //    var whichEvent = $(this).attr("eventId");

    var url;
    url = buildPickedEventQueryURL(whichEvent);
    console.log(url);
    /* call to retrieve single author event based upon eventId selected*/
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {

            $("#eventLocation").val(response.data.events[0].location)
            $("#eventDesc").val(response.data.events[0].description);
            $("#eventDate").val(response.data.events[0].eventDate);
            $("#eventAddress").val(response.data.events[0].address1);
            $("#eventCity").val(response.data.events[0].city);
            $("#eventState").val(response.data.events[0].state);
            $("#eventZip").val(response.data.events[0].zip);
            $("#eventTime").val(response.data.events[0].eventTime);
            M.updateTextFields();
        }
    });
}

function getBookInfo() {
    var url3;
    if (startup) {
        whichBook = searchInfo.bookisbn;
        startup = false;
        console.log("bookisbn:  " + searchInfo.bookisbn);
        console.log("whichBook:  " + whichBook);
    } else {
        var whichBook = $(this).attr("isbn");
        console.log("inside else");
        console.log(whichBook);
        searchInfo.bookisbn = $(this).attr("isbn");
        saveSearchInfo();
    }

    //    var whichBook = $(this).attr("isbn");

    url3 = buildBookTitleQueryURL(whichBook);
    $.ajax({
        type: "GET",
        url: url4,
        success: function (response) {
            console.log(response);
            bookTitle = response.data.titles[0].title;

            $("#title").val(response.data.titles[0].title);
            if(response.data.titles[0].pages === null) {
                $("#numPages").val("N/A");
            }
            else {
                $("#numPages").val(response.data.titles[0].pages);
            }
            $("#saleDate").val(response.data.titles[0].onsale);
            $("#format").val(response.data.titles[0].format.description);
            $("#price").val("$" + response.data.titles[0].price[1].amount);
            $("#isbn").val(String(response.data.titles[0].isbn));
            M.updateTextFields();
            $("#bookCover").attr("src", retrieveCoverArt(response.data.titles[0].isbn));
            displayMovieInfo();

            console.log(authorID);
            console.log(response.data.titles[0].isbn);
            url4 = buildEventQueryURL(authorID, response.data.titles[0].isbn);
            /* api call to retrieve author events to populate dropdown list */
            $.ajax({
                type: "GET",
                url: url4,
                success: function (response) {
                    alert("success");
                    console.log("response event not found");
                    console.log(response.message);
                    if (response.message === "Not found") {
                        $("#eventCard").addClass("hidden");
                        $("#eventNotFound").removeClass("hidden");
                        $("#alternateEventText").text("No movie found that matched the book selected.");
                    } else {
                        alert("in else when event found")
                        $("#eventNotFound").addClass("hidden");
                        $("#eventCard").removeClass("hidden");
                        /* add each event to list */
                        for (var i = 0; i < response.data.events.length; i++) {
                            var listEl = $("<li>");
                            var listDivEl = $("<li>");
                            var aEl = $("<a>");

                            $(aEl).attr("href", "#!");
                            $(aEl).attr("eventId", response.data.events[i].eventId);
                            $(aEl).text(response.data.events[i].location);
                            $(aEl).addClass("event-list-item");
                            $(listEl).append(aEl);
                            $(listDivEl).addClass("divider");
                            $(listDivEl).attr("tabindex", "-1");
                            $("#authorEvents").append(listEl);
                            $("#authorEvents").append(listDivEl);
                        }
                    }
                },
                error: function(){
                    $("#eventCard").addClass("hidden");
                    $("#eventNotFound").removeClass("hidden");
                    $("#alternateEventText").text("No author event found that matched the book selected.");
                }
            });
        }
    });
}
