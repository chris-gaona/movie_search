$(function() {
  'use strict';

  $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

  $('.no-movies').css('cursor', 'auto');

  $('#submit').on('click', function(e) {
    e.preventDefault();

    var searchKeywords = $('#search').val();
    var urlSafeKeywords = searchKeywords.replace(' ', '+');

    //Filter the search by year of release
    var searchYear = $('#year').val();

    getResults(urlSafeKeywords, searchYear, searchKeywords);

  }); //.on click

  function getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber) {
    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&page=" + linkNumber + "&y=" + searchYear + "&r=json", function(data) {
      console.log(data);

      var resultAmount = data.totalResults;
      // paginateResults(resultAmount);

      var searchResults = data.Search;

      $('.desc-content').empty();
      $('#movies').empty();
      // $('.main-content #pagination').empty();

      if (data.Error === "Something went wrong.") {
        $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

        $('.no-movies').css('cursor', 'auto');
        $('.main-content #pagination').empty();

        return;
      }

      //If the search returns no movie data, display the text "No movies found that match: 'title'."
      //See a sample of the code you'll need to display in the index.html comments
      if (data.Error === "Movie not found!") {
        $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchKeywords + '.</li>');

        $('.no-movies').css('cursor', 'auto');
        $('.main-content #pagination').empty();

        return;
      }

      if (data.totalResults <= 10) {
        $('.main-content #pagination').empty();
      }

      //The data should load inside the #movies <ul>

      //Please see the comments in index.html for samples of the HTML you'll need to dynamically create with JavaScript
      //For each movie returned, render an <li> displaying these items inside:
      //Movie title
      //Year of release
      //Movie poster image
      //Render an <img> that displays a poster image via the src attribute
      //Make sure you use the exact class names provided in the CSS
      $.each(searchResults, function() {
        //The app should not display broken images when no poster image data is returned
        //If the "Poster" parameter returns "N/A", render the placeholder icon shown in the index.html comments

        //Wrap the poster image -- or everything in the <li> -- in a <a> tag that links a movie to its imdb.com page
        if (this.Poster === "N/A") {
          $('#movies').append('<li><div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        } else {
          $('#movies').append('<li><div class="poster-wrap"><img class="movie-poster" src="' + this.Poster + '"></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        }

      }); //$.each ()

      if ($('#movies').length) {
        console.log('yup');
        var movieResults = $('#movies li');
        showDescription(movieResults, urlSafeKeywords, searchYear, searchKeywords, linkNumber);
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

  var linkNumber = 1;
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
      nextPrevPage();

      getResults(urlSafeKeywords, searchYear, searchKeywords, linkNumber);
    });
  }

});
