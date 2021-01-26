$(function() {
    var startIndex = 0,
    searchQuery;
    $('#bookSearch').submit( function() {
        searchQuery = $("#searchQuery").val();
        if(searchQuery.length) {
            startIndex = 0;
            getBooks(searchQuery);
        }
        return false;
    });

    $('#prevPage').click( function() {
        getBooks(searchQuery, startIndex-=1);
        return false;
    });

    $('#nextPage').click( function() {
        getBooks(searchQuery, startIndex+=1);
        return false;
    });

    $('#searchResults').on('click', '.book', function() {
        if($(this).attr('aria-expanded') == 'true') {
            $(this).attr('aria-expanded','false');
            $(this).parent().removeClass('expanded');
        } else {
            $(this).attr('aria-expanded','true');
            $(this).parent().addClass('expanded');
        }
    });
});

    
function getBooks(searchQuery, startIndex = 0) {

    const apiRoot = 'https://www.googleapis.com/books/v1/volumes',
        startTime = new Date().getTime();
    
    $.get( apiRoot, { q: searchQuery, startIndex: startIndex }, function( data ) {
        var responseTime = new Date().getTime() - startTime;
        $('#bookList').remove();
        $('#searchResults').prepend('<dl id="bookList"></dl>');
        $.map(data.items, function(book, i) {
            $('#bookList').append('<dt><button aria-controls="book-' + i + '" aria-expanded="false" id="book-button-' + i + '" class="book">' + ((typeof book.volumeInfo.authors != "undefined") ? book.volumeInfo.authors.join(', ') : 'No Author Provided') + ' - ' + book.volumeInfo.title + '</button></dt>');
            $('#bookList').append('<dd><p class="description" id="book-' + i + '">' + (book.volumeInfo.description || 'No description available.') + '</p></dd>');
        });

        //Pagination
        if(typeof data.items != 'undefined' && data.items.length == 10 || startIndex > 0) {
            $('#pagination').show();
        } else {
            $('#pagination').hide();
        }

        $('#prevPage').prop('disabled', startIndex == 0);

        $('#nextPage').prop('disabled', typeof data.items == 'undefined' || data.items.length < 10);

        //Response Time
        $('#responseTime').html(responseTime).parent().show();
    } );

}

