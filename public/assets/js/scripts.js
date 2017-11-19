//Get news
$('#new').on('click', () => {
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).then( () => location.reload() );
});

//Save article
$('.save').on('click', function () {
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: `/save/${thisId}`,
  }).then( () => location.reload() );
});

//Unsave article
$('.unsave').on('click', function () {
  const thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: `/unsave/${thisId}`,
  }).then( () => location.reload() );
});

//Add note
$('.plus').on('click', function () {
  const id = $(this).attr('id').slice(4);
  const $in = $(`#${id}`);

  if ($in.val().trim() === '') {
    $in.focus();
    $in.val('');
  } else {
    $.ajax({
      method: 'POST',
      url: `/add/${id}`,
      data: {
        text: $in.val()
      }
    }).then( () => location.reload() );
  }
});

//Delete note
$('.minus').on('click', function () {
  const idArt = $(this).attr('id').slice(4);
  const idNote = $(this).attr('data-id');
  const $in = $(`#${idArt}`);

  if ($(this).hasClass('edit')) {
    if ($in.val().trim() === '') {
      $in.focus();
      $in.val('');
    } else {
      $.ajax({
        method: 'POST',
        url: `/edit/${idNote}`,
        data: {
          text: $in.val()
        }
      }).then( () => location.reload() );
    }    
  } else {
    $.ajax({
      method: 'POST',
      url: `/sub/${idArt}/${idNote}`
    }).then( () => location.reload() );
  } 
});

//Editing note
$('.noted').on('click', function () {
  const id = $(this).attr('id');
  const idNote = $(`#sub-${id}`).attr('data-id');
  const $in = $(`#${id}`);

  if ($(`#edit-${id}`).length === 0) {
    const $edit = $('<div>').addClass('edit').attr({
      id: `edit-${id}`,
      'data-id': idNote
    }).html('✎').css('border', 'none');

    $edit.insertAfter($(`#sub-${id}`)).on('click', function () {
      if ($in.val().trim() === '') {
        $in.val($in.attr('value'));
        $(this).remove();
      } else {
        $.ajax({
          method: 'POST',
          url: `/edit/${idNote}`,
          data: {
            text: $in.val()
          }
        }).then( () => location.reload() );
      }     
    })
  }
});

// Determine what to do if Enter is pressed in input
$('input').on('keyup', function (e) {
  if (e.keyCode === 13) {
    const id = $(this).attr('id');
    if ($(`#add-${id}`).length !== 0) {
      if ($(this).val().trim() === '') {
        $(this).focus();
        $(this).val('');
      } else {
        $.ajax({
          method: 'POST',
          url: `/add/${id}`,
          data: {
            text: $(this).val()
          }
        }).then( () => location.reload() );
      }      
    } else if ($(`#edit-${id}`).length !== 0) {
      const idNote = $(`#sub-${id}`).attr('data-id');
      if ($(this).val().trim() === '') {
        $(this).val($(this).attr('value'));
        $(this).blur();
        $(`#edit-${id}`).remove();
      } else {
        $.ajax({
          method: 'POST',
          url: `/edit/${idNote}`,
          data: {
            text: $(this).val()
          }
        }).then( () => location.reload() );
      }
    }
  }
});
