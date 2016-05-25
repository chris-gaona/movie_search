$(function() {
  'use strict';

  $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">search</i>Enter a search keyword.</li>');

  $('#submit').on('click', function(e) {
    e.preventDefault();

    var searchKeywords = $('#search').val();
    var urlSafeKeywords = searchKeywords.replace(' ', '+');

    //Filter the search by year of release
    var searchYear = $('#year').val();

    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&page=&y=" + searchYear + "&r=json", function(data) {
      console.log(data);

      var resultAmount = data.totalResults;
      // paginateResults(resultAmount);

      var searchResults = data.Search;

      $('#movies').empty();

      //If the search returns no movie data, display the text "No movies found that match: 'title'."
      //See a sample of the code you'll need to display in the index.html comments
      if (data.Error === "Movie not found!") {
        $('#movies').append('<li class="no-movies"><i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchKeywords + '.</li>');

        return;
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
        showDescription(movieResults);
      }
    }); //$.get ()

  }); //.on click


  //Create a movie description page
  //Load or link to a description page displaying a movie's title, year, poster, plot information, and IMDb rating
  //You'll need to write the CSS for this new page
  //See the 'description-page.png' mockup in the 'examples' folder of the project files
  function showDescription(results) {
    console.log(results);
    results.on('click', function() {
      var movieTitle = $(this).find('.movie-title').text();
      var movieYear = $(this).find('.movie-year').text();
      console.log(movieTitle);
      $.get("http://www.omdbapi.com/?t=" + movieTitle + "&y=" + movieYear + "&plot=full&r=json", function(data) {
        console.log(data);
        $('#movies').empty();

        $('.main-content').after('<div class="desc-content"><div class="desc-color"><a href="" class="back-button">< Search Results</a><div class="desc-container"><img src="' + data.Poster + '"><div class="desc-title">' + data.Title + ' (' + data.Year + ')</div><span class="imbd-rating">IMBD rating: ' + data.imdbRating + '</span></div></div><div class="plot"><span class="plot-title">Plot Synopsis:</span>' + data.Plot + '</div><a href="http://www.imdb.com/title/' + data.imdbID + '" class="imbd-link">View on IMBD</a></div>');
      });
    });
  }

  function paginateResults(total) {
    var moviesPerPage = 10;

    $('#movies').empty();

    //if number value passed through is less than or
    //equal to 10 do the following...
    if (total <= 10) {
      //return, which stops anything after it from
      //running...there is no need for page buttons
      return;
    }

    var totalLinks = Math.ceil(total/moviesPerPage);

    //links variable holds initial number to utilize
    //in the while loop below...see below for more
    var links = 0;
    //linkNumber variable holds the intial number (1)
    //to inject into the html using jquery
    var linkNumber = 1;

    //while links (initially 0 defined above) is less than totalLinks do the following...
    //totalLinks in this case is by groupings of 10 students but could be
    //some other value
    while (links < totalLinks) {
      //Uses jquery to append the dynamic html
      //linkNumber was defined above & starts at 1
      //and then every loop through gets 1 added
      $('.main-content #pagination').append('<li><a href="#">' + linkNumber++ + '</a></li>');
      //every loop until while loop is false, 1 is
      //added to links variable until it is equal to
      //totalLinks
      links++;
    }
  }

});
