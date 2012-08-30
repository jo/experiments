// BigDIV flickr adapter
var flickr = (function(options) {
  var perpage = 10,
      requests = [],
      responses = [],
      total = 0;

  function init(fn) {
    requests = [];
    responses = [];
    total = 0;
    getData(0, 0, fn);
  }

  function view(photo) {
    if (!photo) return {};

    return {
      title: photo.title,
      image_url: 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + 'm.jpg',
      body: 'by ' + photo.owner
    }
  }

  function getData(page, index, fn) {
    var url = 'http://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&api_key=7743d3727f10b0666b071553afa41844&page=' + (page + 1);

    // append options
    for (var key in options) {
      url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
    }

    // think: can not abort a jsonp request.
    requests[page] = $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      success: function(response) {
        requests[page] = null;
        responses[page] = response;

        if (response.stat !== 'ok') {
          total = 0;
          return;
        }
        total = response.photos.total;

        done(page, index, fn);
      }
    });
  }

  function done(page, index, fn) {
    fn(view(responses[page].photos.photo[index % perpage]));
  }

  function get(index, fn) {
    var page = Math.floor(index / perpage);

    if (requests[page]) return requests[page].done(function() { done(page, index, fn); });

    if (responses[page]) return done(page, index, fn);

    getData(page, index, fn);
  }

  return {
    get: get,
    init: init,
    total: function() { return total; }
  }
});
