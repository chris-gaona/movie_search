$(function() {
  'use strict';

  $('#movies').append('<li class="no-movies">Enter a search keyword.</li>');

  $('#submit').on('click', function(e) {
    e.preventDefault();

    var searchKeywords = $('#search').val();
    var urlSafeKeywords = searchKeywords.replace(' ', '+');
    console.log(urlSafeKeywords);

    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&page=2&y=&r=json", function(data) {
      var resultAmount = data.totalResults;
      console.log(resultAmount);
      paginateResults(resultAmount);

      console.log(data);
      var searchResults = data.Search;
      console.log(searchResults);

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
        if (this.Poster === "N/A") {
          $('#movies').append('<li><div class="poster-wrap"><i class="material-icons poster-placeholder">crop_original</i></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        } else {
          $('#movies').append('<li><div class="poster-wrap"><img class="movie-poster" src="' + this.Poster + '"></div><span class="movie-title">' + this.Title + '</span><span class="movie-year">' + this.Year + '</span></li>');
        }

      }); //$.each ()
    }); //$.get ()

  }); //.on click

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
      $('.main-content').append('<ul><li><a href="#">' + linkNumber++ + '</a></li></ul>');
      //every loop until while loop is false, 1 is
      //added to links variable until it is equal to
      //totalLinks
      links++;
    }
  }

});
