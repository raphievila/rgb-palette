const redSlider = $('#myRed'),
  redSample = $('#sampleRed'),
  greenSlider = $('#myGreen'),
  greenSample = $('#sampleGreen'),
  blueSlider = $('#myBlue'),
  blueSample = $('#sampleBlue'),
  mainSample = $('#color1'),
  secondarySample = $('#color2'),
  mixSample = $('#color3'),
  mainValue = $('#mainValue'),
  altValue = $('#altValue'),
  mixValue = $('#mixValue'),
  compValue = $('#compValue'),
  comp2Value = $('#comp2Value'),
  complementSample = $('#color4'),
  complement2Sample = $('#color5'),
  log = console.log;

var currentRGB = [128, 128, 128],
  sliderSize;

const domExists = (dom) => {
  return $(dom).length > 0;
}

const rgb = (r, g, b) => {
  if (typeof r === 'object') {
    b = r[2];
    g = r[1];
    r = r[0];
  }

  if (r === undefined || isNaN(r)) { r = 0; }
  if (g === undefined || isNaN(g)) { g = 0; }
  if (b === undefined || isNaN(b)) { b = 0; }

  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

const replacer = (m, p1, p2, p3, p4, p5) => {
  return p3.replace(/\s/g, '');
}

const getRGB = (me) => {
  var rgbValue = me.css('background'),
    rgbRule = rgbValue.replace(/(^.*?)(rgb\()(\d*, \d*, \d*)+(\))(.*?$)/i, replacer),
    rgbSplit = rgbRule.split(',');

  if (rgbSplit.length === 3) {
    for (i = 0; i < rgbSplit.length; i++) {
      rgbSplit[i] = (!isNaN(rgbSplit[i])) ? Math.abs(rgbSplit[i]) : 0;
    }
  }

  return rgbSplit;
}

const applyColor = () => {
  var sample = $('.select');

  sample.css('background', rgb(
      redSlider.val(),
      greenSlider.val(),
      blueSlider.val()
    )
  );

  mixSamples();
  setComplement(mainSample);
  setComplement(secondarySample);
  setLabels();
}

const setSliders = (rgbObject) => {
  redSlider.val(rgbObject[0]);
  redSample.css('background', rgb(rgbObject[0]))
    .text(rgbObject[0]);

  //setting green doms
  greenSlider.val(rgbObject[1]);
  greenSample.css('background', rgb(0, rgbObject[1]))
    .text(rgbObject[1]);

  //setting blue doms
  blueSlider.val(rgbObject[2]);
  blueSample.css('background', rgb(0, 0, rgbObject[2]))
    .text(rgbObject[2]);
}

const setLabels = () => {
  var mainSet = getRGB(mainSample),
    altSet = getRGB(secondarySample),
    mixSet = getRGB(mixSample),
    compSet = getRGB($('#color4')),
    comp2Set = getRGB($('#color5'));

  // console.log(typeof mainSet, mainSet);

  mainValue.val(mainSet).css('color', rgb(mainSet));
  altValue.val(altSet).css('color', rgb(altSet));
  mixValue.val(mixSet).css('color', rgb(mixSet));
  compValue.val(compSet).css('color', rgb(compSet));
  comp2Value.val(comp2Set).css('color', rgb(comp2Set));
}

const setComplement = (me) => {
  var myRGB = getRGB(me),
    myId = me.attr('id'),
    r = Math.ceil((myRGB[1]) + (myRGB[2])),
    g = Math.ceil((myRGB[2]) + (myRGB[0])),
    b = Math.ceil((myRGB[0]) + (myRGB[1])),
    sample = (myId === 'color2')
      ? complement2Sample
      : complementSample;

  //console.log(r,g,b);
  if (r > 255) { r = (r - 255); }
  if (g > 255) { g = (g - 255); }
  if (b > 255) { b = (b - 255); }
  //console.log(r,g,b);

  sample.css('background', rgb(r, g, b));
}

const mixSamples = () => {
  var colOne = getRGB(mainSample),
    colTwo = getRGB(secondarySample),
    r = (colOne[0]) + (colTwo[0]),
    g = (colOne[1]) + (colTwo[1]),
    b = (colOne[2]) + (colTwo[2]);

  if (r > 255) { r = r - 255; }
  if (g > 255) { g = g - 255; }
  if (b > 255) { b = g - 255; }

  mixSample.css('background', rgb(r, g, b));
}

const selectSample = (t) => {
  var me = $(t),
    myId = me.attr('id');

  me.toggleClass('select');

  switch (myId) {
    case 'color2':
      mainSample.removeClass('select');
      break;
    default:
      secondarySample.removeClass('select');
      break;
  }

  currentRGB = getRGB(me);

  setSliders(currentRGB);
  mixSamples();
  setLabels();
  setComplement(mainSample);
  setComplement(secondarySample);
}

const applyBackgroundGamma = (percent) => {
  var maxValue = 255
  percentToDecimal = percent * 0.01,
    rgbScale = Math.round(maxValue * percentToDecimal),
    rgbSet = maxValue - rgbScale;

  // $('#testView').text(` ${rgbScale} :: rgb(${rgbSet},${rgbSet},${rgbSet})`);

  $('body').css('background', rgb(rgbScale, rgbScale, rgbScale));
}

const adjustBackgroundGamma = (top) => {
  if (top === undefined) { return false; }
  var topValue = top.replace('px', ''),
    knobPosition,
    compensation;

  // console.log(topValue, typeof topValue);
  if (!isNaN(topValue)) {
    compensation = (Math.abs(topValue) > 50)
      ? Math.abs(topValue) + 5
      : Math.abs(topValue) - 5;
    knobPosition = Math.ceil(compensation / sliderSize * 100);
    $('#bg-gamma-knob > .flag').text(knobPosition + '%');
  }

  applyBackgroundGamma(knobPosition);
}

const callTemplate = (e) => {
  var exporters = $('[data-get]');

  exporters.each(function () {
    var me = $(this),
        template = me.attr('data-get');
    
    if (me.hasClass('tab')) {
      me.click((e) => {
        var thisLi = $($(e)[0].currentTarget);

        // log(thisLi.attr('data-get'), me.attr('data-get'));

        me.find('> a').addClass('active')
        me.siblings().find('> a').removeClass('active');

        $.post(`/export/${template}`, (data, status) => {
          var dataText,
              domFriendly
              main = mainValue.val(),
              secondary = altValue.val(),
              mix = mixValue.val(),
              comp1 = compValue.val(),
              comp2 = comp2Value.val();

          if (status === 'success' && main.length !== 0) {
            dataText = data.template
                        .replace(/\[main\]/g, main)
                        .replace(/\[secondary\]/g, secondary)
                        .replace(/\[mix\]/g, mix)
                        .replace(/\[comp1\]/g, comp1)
                        .replace(/\[comp2\]/g, comp2);
            domFriendly = dataText.replace(/\\r/g, '<br>').replace(/\n/g, '');

            $('.exporters-receiver#plain-text').val(dataText);
            $('.exporters-receiver#console').text(domFriendly);
            $('#filename').text(data.file);
          }
        });
      });
    }
  })
}

$(function () {
  redSample.css('background-color', rgb(redSlider.val()));
  greenSample.css('background', rgb(0, greenSlider.val()));
  blueSample.css('background', rgb(0, 0, blueSlider.val()));

  if (domExists('#bg-gamma-slider')) { sliderSize = $('#bg-gamma-slider').outerHeight(); }

  $('#color1, #color2').on('click', function () {
    selectSample(this);
  });

  redSlider.on('mouseup change', function () {
    var me = $(this),
      myValue = me.val();
    redSample.css('background', rgb(myValue)).text(myValue);
    applyColor();
  });

  greenSlider.on('mouseup change', function () {
    var me = $(this),
      myValue = me.val();
    greenSample.css('background', rgb(0, myValue)).text(myValue);
    applyColor();
  });

  blueSlider.on('mouseup change', function () {
    var me = $(this),
      myValue = me.val();
    blueSample.css('background', rgb(0, 0, myValue)).text(myValue);
    applyColor();
  });

  if (domExists('#bg-gamma-knob')) {
    $('#bg-gamma-knob').draggable({
      axis: 'y',
      containment: 'parent',
      drag: function () {
        adjustBackgroundGamma($(this).css('top'));
      }
    });
  }

  if (domExists('.flaticon-menu')) {
    $('.flaticon-menu').click((e) => {
      e.preventDefault();
      $('#sidemenu').find('.menu-label').toggleClass('expanded');
    });
  }

  if (domExists('[data-get]')) {
    callTemplate(event);
  }
});