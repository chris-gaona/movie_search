$(function() {
  'use strict';

  //define variables
  var linkNumber,
      searchKeywords,
      urlSafeKeywords,
      searchYear,
      resultAmount,
      searchResults,
      movieTitle,
      movieYear,
      moviesPerPage,
      totalLinks;

  var $movies = $('#movies'),
      $pagination = $('.main-content #pagination');

  //appends enter search icon & text on page load
  $movies.append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

  var $noMovies = $('.no-movies');

  //changes cursor to auto
  $noMovies.css('cursor', 'auto');

  //on click of submit button
  $('#submit').on('click', function(e) {
    linkNumber = 1;

    //prevents default behavior of anchor tag
    e.preventDefault();

    //value of user input for search
    searchKeywords = $('#search').val();
    //changes user input to be used in url
    urlSafeKeywords = searchKeywords.replace(' ', '+');

    //gets user input for year
    searchYear = $('#year').val();

    //gets initial results based on user query
    // passes in needed parameters
    getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);

  }); //.on click

  //function to handle error message
  // passes in html string as a parameter
  function resultError(htmlText) {
    $movies.append(htmlText);
    $noMovies.css('cursor', 'auto');
    // removes pagination
    $pagination.empty();
  }

  function getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber) {
    //utilizes jquery.get to retrieve ombd api results based on
    //user query
    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&page=" + linkNumber + "&y=" + searchYear + "&r=json", function(data) {
      //data holds the results from ombd api

      //total results from query
      resultAmount = data.totalResults;

      searchResults = data.Search;
      var errorText;

      //empties the following 2 containers just in case there is already
      //content to make room for new query content
      $('.desc-content').empty();
      $movies.empty();

      //if user submits search without any query, add a message
      //to the user & stop all other actions after this
      if (data.Error === "Something went wrong.") {
        errorText = '<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>';
        resultError(errorText);

        return;

        //if the search returns no movie data, display the text "No movies found that match: 'title'."
      } else if (data.Error === "Movie not found!") {
        errorText = '<li class="no-movies"><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchKeywords + '.</li>';
        resultError(errorText);

        return;
      }

      //iterate through each item in the search array
      $.each(searchResults, function() {
        //if the "Poster" parameter returns "N/A", render the placeholder icon else render poster from imbd
        if (this.Poster === "N/A") {
          //data loads inside the #movies <ul>
          $movies.append('<li><div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        } else {
          //data loads inside the #movies <ul>
          $movies.append('<li><div class="poster-wrap"><img class="movie-poster" src="' + this.Poster + '"></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        }

      }); //$.each ()

      //if movies div has content within it
      if ($movies.length) {
        var movieResults = $('#movies li');
        //calls function to display description page if user clicks
        //on a movie
        showDescription(movieResults, urlSafeKeywords, searchYear, searchKeywords, linkNumber);

        //calls function to add pagination for results
        nextPrevPage(resultAmount, urlSafeKeywords, searchYear, searchKeywords);
      }
    }); //$.get ()
  } //getResults()

  //Load a description page displaying a movie's title, year, poster, plot information, and IMDb rating
  //adds css in style.css mainly under "movie description components"
  function showDescription(results, keywords, year, searchKeywords, linkNumber) {
    //on click of results variable which holds li elements
    results.on('click', function() {
      //get movie title & movie year from li element clicked
      movieTitle = $(this).find('.movie-title').text();
      movieYear = $(this).find('.movie-year').text();

      //utilizes jquery.get method to query imbd api for specific movie
      $.get("http://www.omdbapi.com/?t=" + movieTitle + "&y=" + movieYear + "&plot=full&r=json", function(data) {
        //removes content in #moves to make room for description content
        $movies.empty();

        if (data.Poster === 'N/A') {
          //adds descripton content after main-content div
          $('.main-content').after('<div class="desc-content"><div class="desc-color"><a href="" class="back-button"><i class="material-icons back-icon">keyboard_arrow_left</i> Search Results</a><div class="desc-container"><div class="no-poster"><i class="material-icons poster-placeholder">crop_original</i></div><div class="desc-title">' + data.Title + ' (' + data.Year + ')</div><span class="imbd-rating">IMBD rating: ' + data.imdbRating + '</span></div></div><div class="plot"><span class="plot-title">Plot Synopsis:</span>' + data.Plot + '<a href="http://www.imdb.com/title/' + data.imdbID + '" class="imbd-link">View on IMBD</a></div></div>');
        } else {
          //adds descripton content after main-content div
          $('.main-content').after('<div class="desc-content"><div class="desc-color"><a href="" class="back-button"><i class="material-icons back-icon">keyboard_arrow_left</i> Search Results</a><div class="desc-container"><img src="' + data.Poster + '"><div class="desc-title">' + data.Title + ' (' + data.Year + ')</div><span class="imbd-rating">IMBD rating: ' + data.imdbRating + '</span></div></div><div class="plot"><span class="plot-title">Plot Synopsis:</span>' + data.Plot + '<a href="http://www.imdb.com/title/' + data.imdbID + '" class="imbd-link">View on IMBD</a></div></div>');
        }

        //calls function to create back to search results button
        backToResults(keywords, year, searchKeywords, linkNumber);

      }); //$.get ()
    }); //click ()
  } //showDescription()

  //when user clicks back to search results button on description page
  //return them to the correct search result & page where they left off
  function backToResults(keywords, year, searchKeywords, linkNumber) {
    $('.back-button').on('click', function(e) {
      e.preventDefault();

      getResults(keywords, year, searchKeywords, linkNumber);
    });
  }

  //holds amount of movies to display on each page
  moviesPerPage = 10;

  //adds pagination buttons for search results
  function nextPrevPage(total, urlSafeKeywords, searchYear, searchKeywords) {
    //adds next & previous buttons
    $pagination.html('<li><a href="#" id="previous">Previous</a><a href="#" id="next">Next</li>');

    //calculates total number of pages when 10 movies per page
    totalLinks = Math.ceil(total/moviesPerPage);

    //define variables
    var $previousButton = $('#previous'),
        $nextButton = $('#next');

    //if first page of results is shown disable previous button &
    //add disabled look in css
    if (linkNumber === 1) {
      $previousButton.addClass('disabled');
    } else {
      $previousButton.removeClass('disabled');
    }

    //if last page of results is shown disable next button &
    //add disabled look in css
    if (linkNumber === totalLinks) {
      $nextButton.addClass('disabled');
    } else {
      $nextButton.removeClass('disabled');
    }

    //on click of previous button
    $previousButton.on('click', function(e) {
      e.preventDefault();

      //if first page of results is shown make sure user cannot click
      //previous button
      if (linkNumber === 1) {
        return;
      }

      //subtract 1 to linkNumber each time previous button is clicked
      linkNumber--;

      //runs this current function again to check if statements
      nextPrevPage();

      //calls getResults function to get previous page of results
      getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);
    }); //click ()

    $nextButton.on('click', function(e) {
      e.preventDefault();

      //if last page of results is shown make sure user cannot click
      //next button
      if (linkNumber === totalLinks) {
        return;
      }

      //add 1 to linkNumber each time next button is clicked
      linkNumber++;

      //runs this current function again to check if statements
      nextPrevPage();

      //calls getResults function to get next page of results
      getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);
    }); //click ()
  } //nextPrevPage()

});
