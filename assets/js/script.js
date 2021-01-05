// global variable declarations
// object for searchInfo to be stored in local storage
var searchInfo = {
  author: {
    firstName: "",
    lastName: ""
  },
  bookTitle: "",
  bookisbn: "",
  authorEventId: "",
  authorID: ""
};
// variables to keep track of whether first run of app without any localstorage or not
var startup = false;
var startupEvent = false;

/* grab current day using day js to use to limit author events returned */
var currentDate = dayjs().format("M/DD/YYYY");

/* function to save author name and book title to local storage */
function saveSearchInfo() {

  /* save book title and author name to local storage after changing object to String */
  localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
}

// function to change book title to proper format for api call
function convertSearchTerm(searchTerm) {
  /* split book title into individual word array based upon space character as separator */
  var convert = searchTerm.split(" ");
  /* rejoin each array element with + between each word in string */
  convert = convert.join("+");
  /* return converted string */
  return convert;
}

// function to build the api call for retrieving movie info
function buildMovieQueryURL(bookTitle) {
  var queryURL = "https://www.omdbapi.com/?";

  var movieTitle = convertSearchTerm(bookTitle);
  var queryParams = {
    apikey: "bea0d386",
  };
  queryParams.t = movieTitle;
  return queryURL + $.param(queryParams);
}

// function to build the api call for searching on an author's name to get the authorid information
function buildAuthorQueryURL(author) {
  var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/search/views/search-display?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.q = convertSearchTerm(author);
  // this parameter is to restrict information to English language only
  queryParams.preferLanguage = "E";

  return queryURL + $.param(queryParams);
}

// function to build the api call to retrieve book information based upon ISBN
function buildBookTitleQueryURL(isbn) {
  var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/";

  queryURL = queryURL + isbn + "?";
  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };
  // this parameter is to restrict information to English language only
  queryParams.preferLanguage = "E";

  return queryURL + $.param(queryParams);
}

// function to build the api call to retrieve specific author event information
function buildEventQueryURL(authorid, authoreventisbn) {
  var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

  queryURL = queryURL + authorid + "/events?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  // author event is based upon ISBN
  queryParams.isbn = authoreventisbn;
  // need this parameter to limit author events to current day forward
  //  api call would otherwise return all events even if in the past
  queryParams.eventDateFrom = currentDate;
  // parameter to sort the returned author events by date
  queryParams.sort = "eventdate";

  return queryURL + $.param(queryParams);
}

// function to build the api call to get the book cover art if any
function retrieveCoverArt(isbn) {
  // the -M indicates the size of the jpg file to return, in this case we are getting medium size image
  var srcCoverArt = "https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg";

  return srcCoverArt;
}

// function to display movie info based upon selected ISBN
function displayMovieInfo() {
  var url;
  // check if book title exists
  if (!(searchInfo.bookTitle === "")) {
    /* build url for movie api call utilizing the book title chosen */
    url = buildMovieQueryURL(searchInfo.bookTitle);
    /* make ajax call to retrieve movie object */
    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        // check if movie found based upon JSON response
        if (response.Error === "Movie not found!") {
          $("#movieCard").addClass("hidden");
          $("#movieNotFound").removeClass("hidden");
          $("#alternateMovieText").text("No movie found that matched the book selected.");
        } else {
          $("#movieNotFound").addClass("hidden");
          $("#movieCard").removeClass("hidden");
          clearMovieInfo();
          // assign JSON response data to individual fields in HTML
          $("#movieTitle").val(response.Title);
          $("#moviePlot").text(response.Plot);
          $("#movieRated").val(response.Rated);
          $("#movieRuntime").val(response.Runtime);
          $("#movieGenre").val(response.Genre);
          $("#movieReleased").val(response.Released);
          // this is needed to make input field labels relocate outside the field when data filled in
          M.updateTextFields();
          // check if movie poster available
          if (response.Poster === "N/A") {
            // when no movie poster available hide field and show not available text
            $("#moviePoster").addClass("hidden");
            $("#notAvailableText").removeClass("hidden");
            $("#notAvailableText").text("No movie poster available");
          } else {
            // show the movie poster field
            $("#notAvailableText").addClass("hidden");
            $("#moviePoster").removeClass("hidden");

          }
          $("#moviePoster").attr("src", response.Poster);
        }
      }
    });
    // no book title provided so no api call can be made
  } else {
    $("#movieCard").addClass("hidden");
    $("#movieNotFound").removeClass("hidden");
    $("#alternateMovieText").text("No movie found that matched the book selected.");
  }
}

// function that retrieves local storage information, clears all information fields and 
// calls each individual function to retrieve api information
function init() {
  // Get stored events from localStorage
  // Parsing the JSON string to an object
  var savedInfo = JSON.parse(localStorage.getItem("SearchInfo"));

  // set these variables to true for when app initially runs vs event listener
  startup = true;
  startupEvent = true;
  // If events were not retrieved from localStorage, update local storage to searchInfo object
  if (savedInfo === null) {
    localStorage.setItem("SearchInfo", JSON.stringify(searchInfo));
    // calls to display the no info found panels
    getAuthorInfo();
    getBookInfo();
    getEventInfo();
  }
  else {
    // save the retrieved local storage data
    searchInfo = savedInfo;
    // calls to clear all the field info
    clearAuthorInfo();
    clearBookInfo();
    clearEventInfo();
    clearMovieInfo();
    // calls to retrieve all the info based upon data saved in local storage
    getAuthorInfo();
    getBookInfo();
    getEventInfo();
  }
}

init();

// materialize triggers for the drop downs in HTML
$(".dropdown-trigger").dropdown();
$(".dropdown-trigger2").dropdown();

// event listener for Author Search button
$("#searchBtn").on("click", function () {
  /* save user entered info to searchInfo object */
  searchInfo.author.firstName = $("#firstName").val().trim();
  searchInfo.author.lastName = $("#lastName").val().trim();
  /* save user entered search criteria to local storage */
  saveSearchInfo();
  //empty dropdown list contents
  $("#dropdown1").empty();
  $("authorEvents").empty();
  // set this info to empty string before api data returned
  searchInfo.bookTitle = "";
  searchInfo.bookisbn = "";
  searchInfo.authorID = "";
  searchInfo.authorEventId = "";
  // set/remove hidden class appropriately for HTML elements
  $("#movieCard").addClass("hidden");
  $("#movieNotFound").removeClass("hidden");
  $("#alternateMovieText").text("No movie found that matched the book selected.");
  $("#eventCard").addClass("hidden");
  $("#eventNotFound").removeClass("hidden");
  $("#alternateEventText").text("No event found that matched the book selected.");
  // save changes back out to local storage
  saveSearchInfo();
  // clear all the text fields prior to retrieving api data
  //  this is similar to what happens at initialization except this time based upon clicking the search button
  clearBookInfo();
  clearAuthorInfo();
  clearMovieInfo();
  clearEventInfo();
  getAuthorInfo();

});

// function to build the api call to retrieve book titles based upon author id
function buildAuthorTitlesQueryURL(forcedauthorid) {
  var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

  queryURL = queryURL + forcedauthorid + "/titles?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };
  // parameters to restrict returned results to English language
  queryParams.preferLanguage = "E";
  queryParams.language = "E";
  // parameter to return all data not restricting by how many rows returned
  queryParams.rows = 0;
  // parameter to restrict book titles only where author is primary author on book
  queryParams.contribRoleCode = "A";
  return queryURL + $.param(queryParams);
}

// function to build api call to return a specific author event information
function buildPickedEventQueryURL(whichEvent) {
  var queryURL = "https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/events/";

  queryURL = queryURL + whichEvent + "?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  // parameter to restrict results to English language
  queryParams.preferLanguage = "EN";
  return queryURL + $.param(queryParams);
}

// function to retrieve author information from api based upon author first/last name
function getAuthorInfo() {
  var url1;
  var author = searchInfo.author.firstName + " " + searchInfo.author.lastName;
  // build the query URL for author
  url1 = buildAuthorQueryURL(author);
  $.ajax({
    type: "GET",
    url: url1,
    success: function (response) {
      // check if author information is returned
      if (!(response.recordCount === 0)) {
        // set/remove hidden class on author HTML elements
        $("#authorNotFound").addClass("hidden");
        $("#authorCard").removeClass("hidden");
        // check if author biography section is missing or set to N/A
        if (response.data.results[0].authorBio === null || response.data.results[0].authorBio === "N/A") {
          // when author bio is missing display text
          $("#authorBio").html("No author biography provided.");
        } else {
          // author bio exists, set to returned bio info
          $("#authorBio").html(response.data.results[0].authorBio);
        }
        // set author photo url
               if (response.data.results[0].authorPhotoUrl === null) {
                    $("#authorPhoto").addClass("hidden");
                    $("#noPhoto").removeClass("hidden");
                }
                else {
                    $("#noPhoto").addClass("hidden");
                    $("#authorPhoto").attr("src", response.data.results[0].authorPhotoUrl);
                    $("authorPhotoUrl").removeClass("hidden");
                }
        searchInfo.authorID = response.data.results[0].authorId;
        var url2;
        // build query url to retrieve book titles based upon author ID
        url2 = buildAuthorTitlesQueryURL(response.data.results[0].authorId);
        $.ajax({
          type: "GET",
          url: url2,
          success: function (response) {
            /* build list of book titles for dropdown list */
            for (var i = 0; i < response.data.titles.length; i++) {
              var listEl = $("<li>");
              var aEl = $("<a>");

              $(aEl).attr("href", "#!");
              /* save isbn number as attribute so future api call can happen based upon which book was clicked */
              $(aEl).attr("isbn", response.data.titles[i].isbn);
              $(aEl).text(response.data.titles[i].title);
              $(aEl).addClass("book-list-item");
              $(aEl).addClass("collection-item");
              $(listEl).append(aEl);
              $("#dropdown1").append(listEl);
            }
            $("#bookNotFound").addClass("hidden");
            $("#bookCard").removeClass("hidden");
          },
          // error condition if api call doesn't return a book that matches
          error: function () {
            $("#bookCard").addClass("hidden");
            $("#bookNotFound").removeClass("hidden");
            $("#alternateBookText").text("No book found that matched the author selected.");
            $("#authorCard").addClass("hidden");
            $("#authorNotFound").removeClass("hidden");
            $("#alternateAuthorText").text("No author info found that matched the author searched.");            
          }
        });
      } else {
        // error condition if no author selected  
        searchInfo.authorID = "";
        saveSearchInfo();
        $("#bookCard").addClass("hidden");
        $("#bookNotFound").removeClass("hidden");
        $("#alternateBookText").text("No book found that matched the author selected.");
        $("#authorCard").addClass("hidden");
        $("#authorNotFound").removeClass("hidden");
        $("#alternateAuthorText").text("No author info found that matched the author selected.");
      }
    }
  });
}

// function to clear all book fields
function clearBookInfo() {
  $("#title").val("");
  $("#saleDate").val("");
  $("#format").val("");
  $("#numPages").val("");
  $("#price").val("");
  $("#isbn").val("");
  $("#bookCover").removeAttr("src");
}

// function to clear all author fields
function clearAuthorInfo() {
  $("#authorSpotlight").text("");
  $("#authorSpotlight").removeAttr("src");
}

// function to clear all movie fields
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

// function to clear all event fields
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
var whichEvent;
  // check if startupEvent is true
  if (startupEvent) {
    // startupEvent true means data existed in local storage for event
    whichEvent = searchInfo.authorEventId;
    startupEvent = false;
    console.log("eventId:  " + searchInfo.authorEventId);
    console.log("whichEvent:  " + whichEvent);
  } else {
    // startupEvent false means data did NOT exist in local storage for event
    //  therefore need to retrieve new event ID based upon user selection to use in api call
    whichEvent = $(this).attr("eventId");
    searchInfo.authorEventId = $(this).attr("eventId");
    // save newly selected event ID to local storage
    saveSearchInfo();
  }
  // check if event selected is empty string
  if (!(whichEvent === "")) {
    var url;
    // build query URL for event api call if event was selected
    url = buildPickedEventQueryURL(whichEvent);
    console.log(url);
    /* call to retrieve single author event based upon eventId selected*/
    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        // populate HTML fields with returned JSON response data
        $("#eventLocation").val(response.data.events[0].location);
        //  check if there is an event description returned otherwise display N/A
        if (!(response.data.events[0].description === null)) {
          $("#eventDescription").text(response.data.events[0].description);
        } else {
          $("#eventDescription").text("N/A");
        }
        $("#eventDate").val(response.data.events[0].eventDate);
        // check if there is an event address returned otherwise display N/A
        if (!(response.data.events[0].address1 === null)) {
          $("#eventAddress").val(response.data.events[0].address1);
        } else {
          $("#eventAddress").val("N/A");
        }
        // check if there is an event city returned otherwise display N/A
        if (!(response.data.events[0].city === null)) {
          $("#eventCity").val(response.data.events[0].city);
        } else {
          $("eventCity").val("N/A");
        }
        // check if there is an event state returned otherwise display N/A
        if (!(response.data.events[0].state === null)) {
          $("#eventState").val(response.data.events[0].state);
        } else {
          $("#eventState").val("N/A");
        }
        // check if there is an event zip code returned otherwise display N/A
        if (!(response.data.events[0].zip === null)) {
          $("#eventZip").val(response.data.events[0].zip);
        } else {
          $("#eventZip").val("N/A");
        }
        // check if there is an event time returned otherwise display N/A
        if (!(response.data.events[0].eventTime === null)) {
          $("#eventTime").val(response.data.events[0].eventTime);
        }
        else {
          $("#eventTime").val("N/A");
        }
        // the following needs to be called to shift materialize css label out of the input field
        M.updateTextFields();
      }
    });
  } else {
    // no author event exists or chosen
    $("#eventCard").addClass("hidden");
    $("#eventNotFound").removeClass("hidden");
    $("#alternateEventText").text("No author event found that matched the book selected.");
  }
}

// function to retrieve book info from api call
function getBookInfo() {
  var whichBook;
  var url3;
  // check if data exists at startup for book found in local storage
  if (startup) {
    // book info existed in local storage so use this as the ISBN in api call
    whichBook = searchInfo.bookisbn;
    startup = false;
  } else {
    // book info didn't exist in local storage need to grab the currently selected book to use in api call
    whichBook = $(this).attr("isbn");
    searchInfo.bookisbn = $(this).attr("isbn");
    // save the selected book info to local storage
    saveSearchInfo();
  }
  // check if book title is empty string (user may not have selected a book)
  if (!(whichBook === "")) {
    // build query URL for retrieving book information
    url3 = buildBookTitleQueryURL(whichBook);
    $.ajax({
      type: "GET",
      url: url3,
      success: function (response) {
        // set/remove hidden class on correct HTML elements for book fields
        $("#bookNotFound").addClass("hidden");
        $("#bookCard").removeClass("hidden");
        searchInfo.bookTitle = response.data.titles[0].title;
        // set HTML fields with correct JSON response data
        $("#title").val(response.data.titles[0].title);
        // check if page count for book is null and display N/A  otherwise display page count
        if (response.data.titles[0].pages === null) {
          $("#numPages").val("N/A");
        } else {
          $("#numPages").val(response.data.titles[0].pages);
        }
        $("#saleDate").val(response.data.titles[0].onsale);
        $("#format").val(response.data.titles[0].format.description);
        // sometimes book info does not not return both Canadian and US pricing
        // therefore need to check which array item the US price is in
        if (response.data.titles[0].price[0].currencyCode === "USD") {
          $("#price").val("$" + response.data.titles[0].price[0].amount);
        } else {
          $("#price").val("$" + response.data.titles[0].price[1].amount);
        }
        $("#isbn").val(String(response.data.titles[0].isbn));
        //  need to call the following to move materialize labels out of field once populated
        M.updateTextFields();
        $("#bookCover").attr("src", retrieveCoverArt(response.data.titles[0].isbn));
        // now that there is a book ISBN, use to call movie api to get movie info
        displayMovieInfo();

        // build query URL to retrieve author event info based upon book ISBN
        var url4 = buildEventQueryURL(searchInfo.authorID, response.data.titles[0].isbn);
        console.log("url4 = " + url4);
        /* api call to retrieve author events to populate dropdown list */
        $.ajax({
          type: "GET",
          url: url4,
          success: function (response) {
            $("#eventNotFound").addClass("hidden");
            $("#eventCard").removeClass("hidden");
            /* add each event to list */
            for (var i = 0; i < response.data.events.length; i++) {
              var listEl = $("<li>");
              var aEl = $("<a>");

              $(aEl).attr("href", "#!");
              $(aEl).attr("eventId", response.data.events[i].eventId);
              $(aEl).text(response.data.events[i].location);
              $(aEl).addClass("event-list-item");
              $(aEl).addClass("collection-item");
              $(listEl).append(aEl);
              $("#authorEvents").append(listEl);
            }
          },
          // error if there are no author events
          error: function () {
            console.log("inside event error");
            $("#eventCard").addClass("hidden");
            $("#eventNotFound").removeClass("hidden");
            $("#alternateEventText").text("No author event found that matched the book selected.");
            // save off the updated author event ID to local storage
            searchInfo.authorEventId = "";
            saveSearchInfo();
          }
        });
      }
    });
  } else {
    // error condition if no book selected
    $("#eventCard").addClass("hidden");
    $("#eventNotFound").removeClass("hidden");
    $("#alternateEventText").text("No author event found that matched the book selected");
    // save off th eupdated author event ID to local storage
    searchInfo.authorEventId = "";
    saveSearchInfo();
    // call function to display movie info if any
    displayMovieInfo();
  }
}