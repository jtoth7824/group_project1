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
var startup = false;
var startupEvent = false;

// var movieapiKey = "bea0d386";
// var bookapiKey = "tfugk99hpk2nt8sm3ve3peqy";
/* grab current day using day js to use to limit author events returned */
var currentDate = dayjs().format("M/DD/YYYY");

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

function buildMovieQueryURL(bookTitle) {
  var queryURL = "http://www.omdbapi.com/?";

  var movieTitle = convertSearchTerm(bookTitle);
  var queryParams = {
    apikey: "bea0d386",
  };
  queryParams.t = movieTitle;
  return queryURL + $.param(queryParams);
}

function buildAuthorQueryURL(author) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/search/views/search-display?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.q = convertSearchTerm(author);
  queryParams.preferLanguage = "E";

  return queryURL + $.param(queryParams);
}

function buildBookTitleQueryURL(isbn) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/titles/";

  queryURL = queryURL + isbn + "?";
  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };

  queryParams.preferLanguage = "E";

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

  return queryURL + $.param(queryParams);
}

function retrieveCoverArt(isbn) {
  var srcCoverArt = "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg";

  return srcCoverArt;
}

function displayMovieInfo() {
    var url;
if (!(searchInfo.bookTitle === "")) {
    /* build url for movie api call utilzing the book title chosen */
    url = buildMovieQueryURL(searchInfo.bookTitle);
    console.log(url);
    /* make ajax call to retrieve movie object */
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            console.log(response);
            if (response.Error === "Movie not found!") {
                $("#movieCard").addClass("hidden");
                $("#movieNotFound").removeClass("hidden");
                $("#alternateMovieText").text("No movie found that matched the book selected.");
            } else {
                $("#movieNotFound").addClass("hidden");
                $("#movieCard").removeClass("hidden");
                clearMovieInfo();

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
        },
        error: function() {
          console.log("inside movie error");
          $("#movieCard").addClass("hidden");
          $("#movieNotFound").removeClass("hidden");
          $("#alternateMovieText").text("No movie found that matched the book selected.");
          searchInfo.authorEventId = "";
          saveSearchInfo();
        }
    })
}
else {
  $("#movieCard").addClass("hidden");
  $("#movieNotFound").removeClass("hidden");
  $("#alternateMovieText").text("No movie event found that matched the book selected.");
}
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
        startupEvent = true;
        searchInfo = savedInfo;
        console.log("in else at init");
        console.log("searchInfo");
        console.log(searchInfo);
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
    searchInfo.author.firstName = $("#firstName").val().trim();
    searchInfo.author.lastName = $("#lastName").val().trim();
    /* save user entered search criteria to local storage */
    saveSearchInfo();
    /*clear search terms in input boxes */
    $("#bookTitle").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#dropdown1").empty();
    $("authorEvents").empty();
    searchInfo.bookTitle = "";
    searchInfo.bookisbn = "";
    searchInfo.authorEventId = "";
    $("#movieCard").addClass("hidden");
    $("#movieNotFound").removeClass("hidden");
    $("#alternateMovieText").text("No movie found that matched the book selected.");
    $("#eventCard").addClass("hidden");
    $("#eventNotFound").removeClass("hidden");
    $("#alternateEventText").text("No event found that matched the book selected.");
    saveSearchInfo();
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
  queryParams.preferLanguage = "E";
  return queryURL + $.param(queryParams);
}

function buildAuthorTitlesQueryURL(forcedauthorid) {
  var queryURL ="https://api.penguinrandomhouse.com/resources/v2/title/domains/PRH.US/authors/";

  queryURL = queryURL + forcedauthorid + "/titles?";

  var queryParams = {
    api_key: "tfugk99hpk2nt8sm3ve3peqy",
  };
  queryParams.preferLanguage = "E";
  queryParams.language = "E";
  queryParams.rows = 0;
  queryParams.contribRoleCode = "A";
  //   queryParams.format = "HC";
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
  console.log("author: " + url1);
  $.ajax({
      type: "GET",
      url: url1,
      success: function (response) {
          if (!(response.recordCount === 0)) {
              $("#authorNotFound").addClass("hidden");
              $("#authorCard").removeClass("hidden");
              if (response.data.results[0].authorBio === null || response.data.results[0].authorBio === "N/A") {
                  $("#authorBio").html("No author biography provided.");
              }
              else {
                  $("#authorBio").html(response.data.results[0].authorBio);
              }
              //                $("#authorPhoto").attr("src", response.data.results[0].authorPhotoUrl);
              $("#authorPhoto").attr("src", response.data.results[0].authorPhotoUrl);
              searchInfo.authorID = response.data.results[0].authorId;
              var url2;
              url2 = buildAuthorTitlesQueryURL(response.data.results[0].authorId);
              console.log("build book list: " + url2);
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
                          $("#dropdown1").append(listEl);
                          $("#dropdown1").append(listDivEl);
                      }
                      $("#bookNotFound").addClass("hidden");
                      $("#bookCard").removeClass("hidden");
                  },
                  error: function () {
                     $("#bookCard").addClass("hidden");
                     $("#bookNotFound").removeClass("hidden");
                     $("#alternateBookText").text("No book found that matched the author selected.");
  //                searchInfo.authorEventId = "";
  //                saveSearchInfo();
                  }
              });
          }
          else {
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

function clearBookInfo() {
    $("#title").val("");
    $("#saleDate").val("");
    $("#format").val("");
    $("#numPages").val("");
    $("#price").val("");
    $("#isbn").val("");
    $("#bookCover").removeAttr("src");
}

function clearAuthorInfo() {
    $("#authorSpotlight").text("");
    $("#authorSpotlight").removeAttr("src");
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
        whichEvent = searchInfo.authorEventId;
        startupEvent = false;
        console.log("eventId:  " + searchInfo.authorEventId);
        console.log("whichEvent:  " + whichEvent);
    } else {
        var whichEvent = $(this).attr("eventId");
        console.log("inside else");
        console.log(whichEvent);
        searchInfo.authorEventId = $(this).attr("eventId");
        saveSearchInfo();
    }
    if (!(whichEvent === "")) {
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
  else {
    $("#eventCard").addClass("hidden");
    $("#eventNotFound").removeClass("hidden");
    $("#alternateEventText").text("No author event found that matched the book selected.");    
  }
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
    console.log("whichBook = " + whichBook);
    if (!(whichBook === "")) {
      url3 = buildBookTitleQueryURL(whichBook);
      console.log("url3 book title: " + url3);
      $.ajax({
          type: "GET",
          url: url3,
          success: function (response) {
              console.log(response);
              $("#bookNotFound").addClass("hidden");
              $("#bookCard").removeClass("hidden");
              searchInfo.bookTitle = response.data.titles[0].title;
  
              $("#title").val(response.data.titles[0].title);
              if(response.data.titles[0].pages === null) {
                  $("#numPages").val("N/A");
              }
              else {
                  $("#numPages").val(response.data.titles[0].pages);
              }
              $("#saleDate").val(response.data.titles[0].onsale);
              $("#format").val(response.data.titles[0].format.description);
              if(response.data.titles[0].price[0].currencyCode === "USD") {
                  $("#price").val("$" + response.data.titles[0].price[0].amount);
              }
              else {
                  $("#price").val("$" + response.data.titles[0].price[1].amount);
              }
              $("#isbn").val(String(response.data.titles[0].isbn));
              M.updateTextFields();
              $("#bookCover").attr("src", retrieveCoverArt(response.data.titles[0].isbn));
              console.log("calling display movie");
              displayMovieInfo();
  
              url4 = buildEventQueryURL(searchInfo.authorID, response.data.titles[0].isbn);
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
                  },
                  error: function(){
                      console.log("inside event error");
                      $("#eventCard").addClass("hidden");
                      $("#eventNotFound").removeClass("hidden");
                      $("#alternateEventText").text("No author event found that matched the book selected.");
                      searchInfo.authorEventId = "";
                      saveSearchInfo();
                      displayMovieInfo();
                  }
              });
          }
      });      
    }
    else {
      $("#eventCard").addClass("hidden");
      $("#eventNotFound").removeClass("hidden");
      $("#alternateEventText").text("No author event found that matched the book selected");
      searchInfo.authorEventId = "";
      saveSearchInfo();
      displayMovieInfo();
    }
}
