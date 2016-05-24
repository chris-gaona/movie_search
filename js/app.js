$(function() {
  'use strict';

  $('#submit').on('click', function(e) {
    e.preventDefault();

    var searchKeywords = $('#search').val();
    var urlSafeKeywords = searchKeywords.replace(' ', '+');
    console.log(urlSafeKeywords);

    $.get("http://www.omdbapi.com/?s=" + urlSafeKeywords + "&y=&r=json", function(data) {
      console.log(data);
      var searchResults = data.Search;
      console.log(searchResults);

      $('#movies').empty();

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

});
