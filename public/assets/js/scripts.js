//Get news
$('#new').on('click', () => {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then( () => location.reload() );
});

//Save article
$('.save').on('click', function () {
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/save/" + thisId,
  }).then( () => location.reload() );
});

//Unsave article
$('.unsave').on('click', function () {
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId,
  }).then( () => location.reload() );
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
