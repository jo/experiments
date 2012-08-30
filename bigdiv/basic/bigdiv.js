// BigDIV
//
// (c) 2012 Johannes J. Schmidt, TF
var BigDIV = (function() {
  var bigdiv, template, viewport, viewFn, length, visibleLength, height, total;

  function calculateLength() {
    console.log('calculate length');

    // reset bigdiv and measure height
    bigdiv.html(template);
    height = template.height();
    template.remove();

    // set visibleLength to 0 if height is 0,
    // otherwise it could be possible to render infinite number of elements
    visibleLength = height > 0 ? Math.ceil(viewport.height() / height) : 0;
  }

  function update() {
    var index = Math.floor(viewport.scrollTop() / height);

    big.render(index);
  }

  function big(element) {
    bigdiv = $(element);
    viewport = bigdiv.parent();
    template = bigdiv.find('> :first-child');
    calculateLength();

    template.remove();

    // on scroll
    viewport.on('scroll', update);

    $(window).on('resize', function() {
      console.log('resize');
      calculateLength();
      // visibleLength = Math.ceil(viewport.height() / height);
      update();
    });

    return big;
  }

  big.view = function(fn) {
    viewFn = fn;

    return big;
  };

  big.size = function(value) {
    length = value;
    total = length * height;

    bigdiv.css('height', total + 'px');
    bigdiv.css('background-size', '1px ' + 2 * height + 'px');

    return big;
  };

  big.renderEntry = function(position) {
    var element = $('#entry-' + position);

    if (!element.length) {
      element = template.clone();
      bigdiv.append(element);
    }

    element.attr('id', 'entry-' + position);
    element.css('top', position * height + 'px');

    viewFn(position, function(view) {
      for (var property in view) {
        element.find('[property="' + property + '"]').html(view[property]);
      }
    });

    return big;
  };

  big.render = function(index) {
    for (var i = 0; i < visibleLength; i++) {
      big.renderEntry(index + i);
    }

    bigdiv.trigger('render', [index, index + visibleLength]);

    return big;
  };

  return big;
})();
