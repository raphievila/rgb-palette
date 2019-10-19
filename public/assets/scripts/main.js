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
      complement2Sample = $('#color5');

var currentRGB = [204,204,204];

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
      rgbSplit[i] = ( !isNaN(rgbSplit[i]) )? Math.abs(rgbSplit[i]) : 0;
    }
  }
  
  return rgbSplit;
}

const setSampleValues = () => {
  
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
  greenSample.css('background', rgb(0,rgbObject[1]))
    .text(rgbObject[1]);
  
  //setting blue doms
  blueSlider.val(rgbObject[2]);
  blueSample.css('background', rgb(0,0,rgbObject[2]))
    .text(rgbObject[2]);
}

const setLabels = () => {
  var mainSet = getRGB(mainSample),
      altSet = getRGB(secondarySample),
      mixSet = getRGB(mixSample),
      compSet = getRGB($('#color4')),
      comp2Set = getRGB($('#color5'));

  console.log(typeof mainSet, mainSet);

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
  
  sample.css('background', rgb(r,g,b));
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
  
  mixSample.css('background', rgb(r,g,b));
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

$(function () {
  redSample.css('background-color', rgb(redSlider.val()));
  greenSample.css('background', rgb(0, greenSlider.val()));
  blueSample.css('background', rgb(0,0,blueSlider.val()));
  
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
    greenSample.css('background', rgb(0,myValue)).text(myValue);
    applyColor();
  });
  
  blueSlider.on('mouseup change', function () {
    var me = $(this),
        myValue = me.val();
    blueSample.css('background', rgb(0,0,myValue)).text(myValue);
    applyColor();
  });
});