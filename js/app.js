$(function() {
  'use strict';

  var linkNumber;

  //appends enter search icon & text on page load
  $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

  //changes cursor to auto
  $('.no-movies').css('cursor', 'auto');

  //on click of submit button
  $('#submit').on('click', function(e) {
    linkNumber = 1;

    //prevents default behavior of anchor tag
    e.preventDefault();

    //value of user input for search
    var searchKeywords = $('#search').val();
    //changes user input to be used in url
    var urlSafeKeywords = searchKeywords.replace(' ', '+');

    //gets user input for year
    var searchYear = $('#year').val();

    //gets initial results based on user query
    getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);

  }); //.on click

  function getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber) {
    //utilizes jquery.get to retrieve ombd api results based on
    //user query
    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&page=" + linkNumber + "&y=" + searchYear + "&r=json", function(data) {
      //data holds the results from ombd api

      //total results from query
      var resultAmount = data.totalResults;

      var searchResults = data.Search;

      //empties the following 2 containers just in case there is already
      //content to make room for new query content
      $('.desc-content').empty();
      $('#movies').empty();

      //if user submits search without any query, add a message
      //to the user & stop all other actions after this
      if (data.Error === "Something went wrong.") {
        $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

        $('.no-movies').css('cursor', 'auto');
        $('.main-content #pagination').empty();

        return;
      }

      //if the search returns no movie data, display the text "No movies found that match: 'title'."
      if (data.Error === "Movie not found!") {
        $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchKeywords + '.</li>');

        $('.no-movies').css('cursor', 'auto');
        $('.main-content #pagination').empty();

        return;
      }

      //iterate through each item in the search array
      $.each(searchResults, function() {
        //if the "Poster" parameter returns "N/A", render the placeholder icon else render poster from imbd
        if (this.Poster === "N/A") {
          //data loads inside the #movies <ul>
          $('#movies').append('<li><div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        } else {
          //data loads inside the #movies <ul>
          $('#movies').append('<li><div class="poster-wrap"><img class="movie-poster" src="' + this.Poster + '"></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        }

      }); //$.each ()

      //if movies div has content within it
      if ($('#movies').length) {
        var movieResults = $('#movies li');
        //calls function to display description page if user clicks
        //on a movie
        showDescription(movieResults, urlSafeKeywords, searchYear, searchKeywords, linkNumber);

        //calls function to add pagination for results
        nextPrevPage(resultAmount, urlSafeKeywords, searchYear, searchKeywords);
      }
    }); //$.get ()
  }


  //Create a movie description page
  //Load or link to a description page displaying a movie's title, year, poster, plot information, and IMDb rating
  //You'll need to write the CSS for this new page
  //See the 'description-page.png' mockup in the 'examples' folder of the project files
  function showDescription(results, keywords, year, searchKeywords, linkNumber) {
    console.log(results);
    results.on('click', function() {
      var movieTitle = $(this).find('.movie-title').text();
      var movieYear = $(this).find('.movie-year').text();
      console.log(movieTitle);
      $.get("http://www.omdbapi.com/?t=" + movieTitle + "&y=" + movieYear + "&plot=full&r=json", function(data) {
        console.log(data);
        $('#movies').empty();

        $('.main-content').after('<div class="desc-content"><div class="desc-color"><a href="" class="back-button"><i class="material-icons back-icon">keyboard_arrow_left</i> Search Results</a><div class="desc-container"><img src="' + data.Poster + '"><div class="desc-title">' + data.Title + ' (' + data.Year + ')</div><span class="imbd-rating">IMBD rating: ' + data.imdbRating + '</span></div></div><div class="plot"><span class="plot-title">Plot Synopsis:</span>' + data.Plot + '<a href="http://www.imdb.com/title/' + data.imdbID + '" class="imbd-link">View on IMBD</a></div></div>');

        backToResults(keywords, year, searchKeywords, linkNumber);

      });
    });
  }

  function backToResults(keywords, year, searchKeywords, linkNumber) {
    $('.back-button').on('click', function(e) {
      e.preventDefault();

      getResults(keywords, year, searchKeywords, linkNumber);
    });
  }

  // var linkNumber = 1;
  var moviesPerPage = 10;

  function nextPrevPage(total, urlSafeKeywords, searchYear, searchKeywords) {
    $('.main-content #pagination').html('<li><a href="#" id="previous">Previous</a><a href="#" id="next">Next</li>');

    var totalLinks = Math.ceil(total/moviesPerPage);

    if (linkNumber === 1) {
      $('#previous').prop('disabled', true).addClass('disabled');
    } else {
      $('#previous').prop('disabled', false).removeClass('disabled');
    }

    if (linkNumber === totalLinks) {
      $('#next').prop('disabled', true).addClass('disabled');
    } else {
      $('#next').prop('disabled', false).removeClass('disabled');
    }

    $('#previous').on('click', function(e) {
      e.preventDefault();

      if (linkNumber === 1) {
        return;
      }

      linkNumber--;
      console.log('Previous!');
      console.log(linkNumber);
      console.log(totalLinks);
      nextPrevPage();

      getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);
    });

    $('#next').on('click', function(e) {
      e.preventDefault();

      if (linkNumber === totalLinks) {
        return;
      }

      linkNumber++;
      console.log('Next!');
      console.log(linkNumber);
      console.log(totalLinks);
      nextPrevPage();

      getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);
    });
  }

});
