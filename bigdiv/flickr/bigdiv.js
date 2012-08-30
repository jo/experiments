// BigDIV
//
// (c) 2012 Johannes J. Schmidt, TF
var BigDIV = (function() {
  var $bigdiv,
      $template,
      $viewport,
      visibleLength,
      templateHeight,
      bigdivHeight,
      db;

  function calculateLength() {
    // reset bigdiv and measure height
    $bigdiv.html($template);
    templateHeight = $template.height();
    $template.remove();

    // set visibleLength to 0 if templateHeight is 0,
    // otherwise it could be possible to render infinite number of elements
    visibleLength = templateHeight > 0 ? Math.ceil($viewport.height() / templateHeight) : 0;
  }

  function update() {
    var index = Math.floor($viewport.scrollTop() / templateHeight);

    big.render(index);
  }

  function big(element) {
    $bigdiv = $(element);
    $viewport = $bigdiv.parent();
    $template = $bigdiv.find('> :first-child');
    calculateLength();

    $template.remove();

    // on scroll
    $viewport.on('scroll', _.debounce(update, 100));

    $(window).on('resize', function() {
      calculateLength();
      update();
    });

    return big;
  }

  big.db = function(value) {
    db = value;

    db.init(big.init);

    return big;
  };

  big.init = function() {
    var total = db.total();

    calculateLength();

    bigdivHeight = total * templateHeight;

    $bigdiv.css('height', bigdivHeight + 'px');

    $bigdiv.trigger('init', [total, visibleLength]);

    return big.render();
  };

  big.renderEntry = function(position) {
    var element = $('#entry-' + position);

    if (!element.length) {
      element = $template.clone();
      $bigdiv.append(element);
    
      element.attr('id', 'entry-' + position);
    }

    db.get(position, function(view) {
      for (var property in view) {
        element.find('[property="' + property + '"]').html(view[property]);
        element.find('[property-src="' + property + '"]').attr('src', view[property]);
      }
    });

    element.css('top', position * templateHeight + 'px');

    return big;
  };

  big.render = function(index) {
    index || (index = 0);

    for (var i = 0; i <= visibleLength; i++) {
      big.renderEntry(index + i);
    }

    $bigdiv.trigger('render', [index, index + visibleLength]);

    return big;
  };

  return big;
})();
