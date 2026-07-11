var St = require('users/paulkaria2020/practice:myModule')
var ims; //indexmangroveseries;
var analysisName;
var border; //cliparea;
var prodVis; //product visualization;
var imVis; //indexmangrovevisualization;
var panelLegend; //panel legend;

//Drawing Tools
var drawingTools = Map.drawingTools();
// Don't make imports that correspond to the drawn points.
Map.drawingTools().setLinked(false);
var debug = ui.url.get('debug', true);

drawingTools.setShown(true); // SHOW drawing tools
drawingTools.setDrawModes(['polygon', 'rectangle']); // allow both
drawingTools.setShape('polygon'); // default mode


drawingTools.onDraw(function() {
  drawingTools.stop();
});


// Create a control panel
var panel = ui.Panel({style: {width: '360px', color:'131010'}});

// Add version text and app title to the control panel
panel.add(ui.Label({value: 'Version 1.15 ', style: St.version}));
panel.add(ui.Label({value: 'Mangrove Restoration Tool in Rufiji Delta', style: St.titleAPP}));

// Add two buttons: "How to use" and "About"
var ButtonFAQ = ui.Button({
    label: 'How to use this tool?', 
    style: St.ButtonPrincipal1, 
    onClick: function() {
        Map.add(FAQ_PANEL);
    }
});
var ButtonAbout = ui.Button({
    label: 'About ', 
    style: St.ButtonAbout,  
    onClick: function() {
        Map.add(ABOUT_PANEL);
    }
});
var PanelsButton = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [ButtonFAQ, ButtonAbout]
});

// DESCRIPTION HOW TO USE Mangrove
var FAQ_PANEL = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
    widgets: [
        ui.Label({ value: 'How to use this Tool?', style: St.titleWidwet }), 
        ui.Label({ value: '1. Draw a polygon to the area you need to Assess ', style: St.conte }),
        ui.Label({ value: '2. Enter a start and end date using the format Year-month-day (xxxx-xx-xx)', style: St.conte }),
        ui.Label({ value: '3. Select a set of images: 1) Sentinel-2', style: St.conte }),//Landsat-8, 2)
        ui.Label({ value: '4. Select a analysis of mangrove you need to do analysis', style: St.conte }),
        ui.Label({ value: '5. Click on "Run Analysis" and the selected mangrove for the polygon appears on the map', style: St.conte }),        
        ui.Label({ value: '6. Click on "New Polygon" to calculate the mangrove of other polygons', style: St.conte }),
        ui.Label({ value: '7. The legend after the analysis results are displayed shows whether or not there are mangroves in the area being studied.', style: St.conte }),
      
    ],
    style: { position: 'top-center', shown: true, width: '30%', height: '50%', padding: '5px', margin: '10px' }
    
});
// ABOUT BOX
var ABOUT_PANEL = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
    widgets: [
        ui.Label({ value: 'About Blue Carbon Explorer', style: St.titleWidwet }),
        ui.Label({ value: 'Blue Carbon Explorer is a tool to Assess mangrove condition using Sentinel-2 image', style: St.conte }),
        ui.Label({ value: 'By Paul', style: { fontWeight: 'bold', textAlign: 'center', padding: '5px', margin: 'auto' } }),
    ],
});


// Contact Me
var contact = ui.Label({
  value: 'Email - (paul.karia.2020@gmail.com)',
  style: {fontSize: '12px', textAlign: 'center',padding: '5px 5px', margin: 'auto'}
});


// To Close
var CloseButton = ui.Button({label: 'Close',style: St.closeButton,
  onClick: function(){
    Map.remove(FAQ_PANEL);
  }
});
var CloseButtonABOUT = ui.Button({label: 'Close',style: St.closeButton,
  onClick: function(){
    Map.remove(ABOUT_PANEL);
  }
});

var CloseButtonSAT = ui.Button({label: 'Close',style: St.closeButton,
  onClick: function(){
    Map.remove(SATELITE_PANEL);
  }
});
var CloseButtonINDEX = ui.Button({label: 'Close',style: St.closeButton,
  onClick: function(){
    Map.remove(INDEX_PANEL);
  }
});

// Add to Panel
panel.add(PanelsButton);
panel.add(contact);



//  DRAWING UI

var drawLabel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: St.styleDatWiget, //border: '0.5px solid #000000' 
  widgets: [
    ui.Label({ value: 'Select Drawing Mode', style: St.styleWiget }),
  ]
});


// var drawLabel = ui.Label('Select Drawing Mode', {fontWeight: 'bold'});

var rectButton = ui.Button({
  label: '▭ Rectangle',
  onClick: function() {
    drawingTools.setShape('rectangle');
    drawingTools.draw();
  }
});

var polyButton = ui.Button({
  label: '▲ Polygon',
  onClick: function() {
    drawingTools.setShape('polygon');
    drawingTools.draw();
  }
});

var drawPanel = ui.Panel({
  widgets: [drawLabel, rectButton, polyButton],
  style: {margin: '10px 0'}
});

panel.add(drawPanel);
// 


// Close 
ABOUT_PANEL.add(CloseButtonABOUT);
FAQ_PANEL.add(CloseButton);



// 5. NAVIGATION PANEL - OPTION SELECTION
// 5.1. Add a panel with two labels for the start and end dates and the text boxes
var Box_Data = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: St.styleDatWiget, //border: '0.5px solid #000000' 
  widgets: [
    ui.Label({ value: 'Start and End Date', style: St.styleWiget }),
  ]
});

var currentDate = ee.String(ee.Date(Date.now()).get('year')).cat('-')
    .cat(ee.Date(Date.now()).format('MM')).cat('-')
    .cat(ee.Date(Date.now()).format('dd'));

var previousYearDate = ee.String(ee.Date(Date.now()).advance(-1, 'year').get('year')).cat('-')
    .cat(ee.Date(Date.now()).format('MM')).cat('-')
    .cat(ee.Date(Date.now()).format('dd'));

var startDateTextbox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: previousYearDate.getInfo(),
  style: { maxWidth: '120px' }
});

var endDateTextbox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: currentDate.getInfo(),
  style: { maxWidth: '120px' }
});
panel.add(Box_Data);
panel.add(ui.Panel([startDateTextbox, endDateTextbox], ui.Panel.Layout.flow('horizontal')));




// 5.1.2 For Cloud Percentage
var CloudTextLabel = ui.Label({
    value: 'Cloudy Pixel Percentage:',
    style: St.styleTexTConf
});

var cloudPercentageTextbox = ui.Textbox({
    placeholder: '10',
    value: '10',
    style: { maxWidth: '90px' }
});

var cloudConfigPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    widgets: [CloudTextLabel, cloudPercentageTextbox]
});
panel.add(cloudConfigPanel);

// 5.2.  selector
var AnalysisSelector = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: St.styleDatWiget, //border: '0.5px solid #c9dcc0' 
  widgets: [
    ui.Label({ value: 'Select Satellite and Analysis Type', style: St.styleWiget }),
  ]
});
var minPalete;
var maxPalete;






var Sensor = ui.Select({ 
  items: [ 
    { label:"Sentinel-2", value: 1 } 
    // { label:"Landsat-8 (Coming Soon)", value: 0 }
  ],
  value: 1, // Default = Sentinel
  disabled: true, //  user cannot change
  style: { width: '270px', border: '1px solid darkgray' }
});


// Fixed sensor (Sentinel only)
var selectedSensor = 1;



panel.add(AnalysisSelector);
panel.add(Sensor);

var MangroveAnalysis = ui.Select({
  items: [
          { label: "1. Mangrove Coverage", value: 0},
          { label: "2. Mangrove Change", value: 1},
          { label: "3. Mangrove Restoration", value: 2},
          ],
placeholder: 'Select a Mangrove Analysis',
value: 0,
style: { width: '270px', border: '1px solid darkgray' },
});
panel.add(MangroveAnalysis);

//Function to Filter Images Covering The Entiner Polygon
var PolyFilter=ui.Checkbox({label:'Filter images covering the entire polygon',value: true,style: {color: '#dc7a55', width: '280px'}})
var PolT= ui.Panel({
      layout: ui.Panel.Layout.flow("horizontal"),
      style: {position: 'top-center'},
      widgets: [PolyFilter]
  });
panel.add(PolyFilter);

 



// Function to Collect Sentinel-2 
function ImageCollectionSentinelSR(dates, aoi, threshold) 
{
  // Load Sentinel-2 Surface Reflectance image collection
  var sentinelCollection = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterDate(dates[0], dates[1]) // Filter by date range
    .filterBounds(aoi) // Filter by region of interest
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE' ,threshold)); // Filter by cloud cover threshold

  // Select only relevant bands before renaming
  var filteredCollection = sentinelCollection.select([
    'B2', // Blue
    'B3', // Green
    'B4', // Red
    'B5', // Vegetation Red Edge1
    'B6', // Vegetation Red Edge2
    'B7', // Vegetation Red Edge3
    'B8', // NIR
    'B8A', // Vegetation Red Edge4
    'B11', // SWIR1
    'B12'  // SWIR2
  ]);
  
  // Map and rename bands to match Sentinel naming conventions
  
  var renamedCollection = filteredCollection.map(function(image) {
  return image
    .divide(10000) // IX: scaling Sentinel
    .rename([
  'blue',
  'green',
  'red',
  'nir',
  'rededge1',
  'rededge2',
  'rededge3',
  'rededge4',
  'swir1',
  'swir2'
]).copyProperties(image,['system:time_start']);
});
  
 
  return renamedCollection;
}

function maskClouds(img) {
  var clouds = ee.Image(img.get('cloud_mask')).select('probability');
  var isNotCloud = clouds.lt(90);
  return img.updateMask(isNotCloud);
}
var minBox_C1 =ui.Textbox({value:0, placeholder: '-1', style:St.TexBoxValueIndex});
var maxBox_C1 =ui.Textbox({value:1, placeholder: '1', style:St.TexBoxValueIndex});

// Fucntion to Download Result
var DownloadC1_Button = ui.Label({value:"⇓", style: St.ButonDonwload});
var DownloadC2_Button = ui.Label({value:"⇓", style:St.ButonDonwload});

var DownloadTIFF_Button = ui.Label({
  value: "⇓",
  style: St.ButonDonwload
});

var downloadVFile= ui.Panel({
    layout: ui.Panel.Layout.flow("horizontal"),
    style: {backgroundColor: "#eceaea", position: 'top-center',shown: true},
    widgets: [ui.Label('download vector file',{backgroundColor: "#eceaea", color: '#615b58',width: '270px'}),DownloadC2_Button]
});
var downloadIV= ui.Panel({
    layout: ui.Panel.Layout.flow("horizontal"),
    style: {backgroundColor: "#eceaea", position: 'top-center',shown: true},
    // widgets: [ui.Label('download mangrove map',{backgroundColor: "#eceaea", color: '#615b58',width: '270px'}),DownloadC1_Button]
});

var downloadTIFFPanel = ui.Panel({
  layout: ui.Panel.Layout.flow("horizontal"),
  style: {
    backgroundColor: "#eceaea",
    position: 'top-center',
    shown: true
  },
  widgets: [
    ui.Label('download GeoTIFF', {
      backgroundColor: "#eceaea",
      color: '#615b58',
      width: '270px'
    }),
    DownloadTIFF_Button
  ]
});


var downloadLinkLabel = ui.Label({
  value: '',
  style: {
    fontSize: '12px',
    color: 'blue',
    shown: false
  }
});



panel.add(downloadIV);
panel.add(downloadVFile);
panel.add(downloadTIFFPanel);




var chartPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    width: '340px',
    height: '250px',
    padding: '10px',
    backgroundColor: 'white'
  }
});





// Add chartPanel to the main panel
panel.add(chartPanel);


downloadVFile.style().set('shown', false);
downloadIV.style().set('shown', false);
downloadTIFFPanel.style().set('shown', false);

function buildSelectDisplay(number) {
  if (number==0) {
    minBox_C1.setValue(-1);
    maxBox_C1.setValue(1);
  }
  else if (number==1) {
    minBox_C1.setValue(-1);
    maxBox_C1.setValue(1);
  }
  else if (number==2) {
    minBox_C1.setValue(0);
    maxBox_C1.setValue(20);
  }
  // valC1.style().set('shown', true); //clase 1
  minBox_C1.setDisabled(true);
  maxBox_C1.setDisabled(true);
}



function Legend(title, vis, type) {

  var panel = ui.Panel({style: {position: 'bottom-left'}});

  panel.add(ui.Label({
    value: title,
    style: {fontWeight: 'bold'}
  }));

  if (type === 0) { // COVERAGE
          

panel.add(ui.Panel([
  ui.Label('■', {color: '#2E7D32'}), ui.Label('Mangroves')
], ui.Panel.Layout.Flow('horizontal')));

panel.add(ui.Panel([
  ui.Label('■', {color: '#AED581'}), ui.Label('Vegetation')
], ui.Panel.Layout.Flow('horizontal')));

panel.add(ui.Panel([
  ui.Label('■', {color: '#64B5F6' }), ui.Label('Water')
], ui.Panel.Layout.Flow('horizontal')));


panel.add(ui.Panel([
  ui.Label('■', {color:'#D7CCC8' }), ui.Label('Bareland')
], ui.Panel.Layout.Flow('horizontal')));

panel.add(ui.Panel([
  ui.Label('■', {color: '#c45339'}), ui.Label('Builtup')
], ui.Panel.Layout.Flow('horizontal')));

}

               
   


  else if (type === 1) {

  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'red', margin: '0 5px 0 0'}),
      ui.Label('Loss Areas')
    ], ui.Panel.Layout.Flow('horizontal'))
  );

  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'black', margin: '0 5px 0 0'}),
      ui.Label('No Change')
    ], ui.Panel.Layout.Flow('horizontal'))
  );

  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'green', margin: '0 5px 0 0'}),
      ui.Label('Gain Areas')
    ], ui.Panel.Layout.Flow('horizontal'))
  );

}
  
  
   
  



else if (type === 2) {
  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'FF0000', margin: '0 5px 0 0'}),
      ui.Label('High Priority')
    ], ui.Panel.Layout.Flow('horizontal'))
  );
  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'FFA500', margin: '0 5px 0 0'}),
      ui.Label('Moderate Priority')
    ], ui.Panel.Layout.Flow('horizontal'))
  );
  panel.add(
    ui.Panel([
      ui.Label('■', {color: 'FFFF00', margin: '0 5px 0 0'}),
      ui.Label('Low Priority')
    ], ui.Panel.Layout.Flow('horizontal'))
  );
}


  return panel;
}



function getVectorFile (clippingArea){ 
// Export an ee.FeatureCollection as an Earth Engine asset.
    var srr=ee.FeatureCollection(clippingArea);
    var downloadUrl = srr
                    .getDownloadURL({ 
                      format:'kml',
                      filename: 'Area of Interest'});
    return downloadUrl;
}

function getName(imagen){
      var time_start=imagen.get('system:time_start');
      var date=ee.Date(time_start);
      var year=ee.Number(date.get('year'));
      var month=ee.Number(date.get('month'));
      var day=ee.Number(date.get('day'));
      var sensor=imagen.get('sensor');
      var satelite=imagen.get('satelite');
      var Name_image=ee.String(year)
        .cat(ee.String('_'))
        .cat(ee.String(month))
        .cat(ee.String('_'))
        .cat(ee.String(day));
        
      return  Name_image;
}


function NewPolygon()
{
  Map.clear(); 
  // Map.layers().reset([]);
  Map.setControlVisibility(true, true, true, true, true, true, true);
  
 
  drawingTools.clear();
  
  Map.setCenter(39.3, -8.0, 9);
 Map.setCenter(39.3, -8.0, 9);

}





function getWaterMask(image){
  var ndwi = image.normalizedDifference(['green','nir']);
  return ndwi.gt(0.15); // water
}



function getMangrove(year, aoi, sensor) {
  
  var start = ee.Date.fromYMD(year, 1, 1);
  var end = start.advance(1, 'year');
  
  var img;

  



//   } else { // SENTINEL
    
    img = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
      .filterBounds(aoi)
      .filterDate(start, end)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60))
      .select(['B2','B3','B4','B8','B11'])
      .median()
      .divide(10000)
      .clip(aoi);

    var ndvi = img.normalizedDifference(['B8','B4']);
    var ndmi = img.normalizedDifference(['B8','B11']);
    var ndwi = img.normalizedDifference(['B3','B8']);

    var water = ndwi.gt(0.2);
    var distance = water.fastDistanceTransform(30).sqrt(); //100
    var coastal = distance.lte(500);//2000

    var mangrove = ndvi.gte(0.45)//0.35
      .and(ndmi.gte(0.2))//0.15
      .and(ndwi.lt(0.1))//0.15
      // .and(savi.lt(0.35))//0.15
      // .and(cmri.lt(0.5))//0.15
      // .and(mvi.lt(0.13))//0.15
      .and(coastal)
      .updateMask(water.not());
  // }

  return mangrove.rename('mangroves');
  
  
}


function getChange(before, after, aoi) {
  
  before = before.clip(aoi);
  after = after.clip(aoi);
  var loss = before.eq(1).and(after.eq(0));
  var gain = before.eq(0).and(after.eq(1));
  var noChange = before.eq(1).and(after.eq(1));
  
  var change = ee.Image(0)
    .where(loss, 1)
    .where(noChange, 2)
    .where(gain, 3)
    .updateMask(before.or(after)) // removes non-mangrove areas
    
  return change.clip(aoi);
}






function getSuitability(startYear, endYear, aoi, sensor) {

  var mangroveStart = getMangrove(startYear, aoi, sensor);
  var mangroveEnd = getMangrove(endYear, aoi, sensor);

  var lossArea = mangroveStart.eq(1).and(mangroveEnd.eq(0));

  var start = ee.Date.fromYMD(startYear, 1, 1);
  var end = ee.Date.fromYMD(endYear, 12, 31);

  var img = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40))
    .median()
    .divide(10000)
    .clip(aoi);

  // NDVI (vegetation)
  var ndvi = img.normalizedDifference(['B8','B4']).rename('NDVI');
  // NDWI (water)
  var ndwi = img.normalizedDifference(['B3','B8']).rename('NDWI');
  // NDMI (moisture) — NEW, needed for scoring, wasn't in your app before
  var ndmi = img.normalizedDifference(['B8','B11']).rename('NDMI');

  // Water mask + distance to water
  var water = ndwi.gt(0.2);
  var distance = water.fastDistanceTransform(30).sqrt();

  // ---- PRIORITY SCORING ----

  // Distance score: closer to water = higher priority
  var distanceScore = ee.Image(1)
    .where(distance.lte(200), 3)
    .where(distance.gt(200).and(distance.lte(500)), 2)
    .where(distance.gt(500), 1);

  // Elevation score: lower elevation = higher priority
  var dem = ee.Image("USGS/SRTMGL1_003").clip(aoi);
  var elevationScore = ee.Image(1)
    .where(dem.lte(5), 3)
    .where(dem.gt(5).and(dem.lte(10)), 2)
    .where(dem.gt(10).and(dem.lte(20)), 1);

  // Moisture score (NDMI)
  var moistureScore = ee.Image(1)
    .where(ndmi.gte(0.4), 3)
    .where(ndmi.gte(0.3).and(ndmi.lt(0.4)), 2)
    .where(ndmi.gte(0.2).and(ndmi.lt(0.3)), 1);

  // Vegetation score (NDVI)
  var vegetationScore = ee.Image(1)
    .where(ndvi.gte(0.5), 3)
    .where(ndvi.gte(0.3).and(ndvi.lt(0.5)), 2)
    .where(ndvi.gte(0.2).and(ndvi.lt(0.3)), 1);

  // Total score (4–12 range)
  var totalScore = distanceScore
    .add(elevationScore)
    .add(moistureScore)
    .add(vegetationScore);

  // Final priority class: 1 = Low, 2 = Moderate, 3 = High
  var priority = ee.Image(1)
    .where(totalScore.gte(10), 3)
    .where(totalScore.gte(7).and(totalScore.lt(10)), 2)
    .where(totalScore.lt(7), 1);

  // Only keep priority values where mangrove was actually lost
  priority = priority.updateMask(lossArea);

  return priority.clip(aoi);
}







function getArea(image, aoi, year) {
  
  var area = ee.Image.pixelArea()
    .updateMask(image)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aoi,
      scale: 30,
      maxPixels: 1e13
    });

  var areaHa = ee.Number(area.get('area'))
    .divide(10000)
    .divide(1000);

  return ee.Feature(null, {
    'year': ee.Number(year).format('%02d').slice(2),
    'area_ha': areaHa
    // 'Mangrove Area (1000 ha)': areaHa
  });
}






function RF_Mangrove_Classification(image, trainingData, sensor) {

  var bands;

 
  
  bands = [
  'blue','green','red','nir',
  'rededge1','rededge2','rededge3','rededge4',
  'swir1','swir2','NDVI','NDWI','SAVI','CMRI',//EVI'
];

  // SAMPLE
  var samples = image.select(bands).sampleRegions({
    collection: trainingData,
    properties: ['class'],
    scale: 30
  });

  // SPLIT DATA
  var dataset = samples.randomColumn('random');

  var trainSet = dataset.filter(ee.Filter.lt('random', 0.8));
  var testSet  = dataset.filter(ee.Filter.gte('random', 0.8));

  // TRAIN MODEL
  var classifier = ee.Classifier.smileRandomForest(200)
    .train({
      features: trainSet,
      classProperty: 'class',
      inputProperties: bands
    });

  // CLASSIFY IMAGE
  var classified = image.select(bands).classify(classifier).rename('classification');

  return {
    classified: classified,
    classifier: classifier,
    testSet: testSet
  };
}




// Example training data (YOU SHOULD DRAW YOUR OWN IN GEE)
var mangrove = 
    //* color: #4cb301 */
    //* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([39.30262518747735, -7.8113039442435666]),
            {
              "class": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([39.26966620310235, -7.8228684447014425]),
            {
              "class": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([39.32803107126641, -7.8147053011690275]),
            {
              "class": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([39.310178288063284, -7.84395582553327]),
            {
              "class": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([39.32047797068047, -7.86708269118057]),
            {
              "class": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([39.33627081736016, -7.846676700080256]),
            {
              "class": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([39.32253790720391, -7.763682044079923]),
            {
              "class": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([39.304685124000784, -7.749394420141321]),
            {
              "class": 1,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([39.42484808786797, -7.885447224684667]),
            {
              "class": 1,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([39.39120245798516, -7.914012655742023]),
            {
              "class": 1,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([39.406308659157034, -7.941215987836835]),
            {
              "class": 1,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([39.4097418866961, -8.006978264574004]),
            {
              "class": 1,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([39.40218878611016, -8.067489439586614]),
            {
              "class": 1,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([39.387082584938284, -8.079726555789708]),
            {
              "class": 1,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([39.395322331032034, -8.103086917243937]),
            {
              "class": 1,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([39.34245062693047, -8.130277600932606]),
            {
              "class": 1,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([39.356870182594534, -8.134356044646529]),
            {
              "class": 1,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([39.33627081736016, -8.211838568120665]),
            {
              "class": 1,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([39.26279974802422, -8.207081303556983]),
            {
              "class": 1,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([39.31155157907891, -8.251933244171086]),
            {
              "class": 1,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([39.34451056345391, -8.22746917874332]),
            {
              "class": 1,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([39.29575873239922, -8.376484709849938]),
            {
              "class": 1,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([39.266232975563284, -8.324173521538606]),
            {
              "class": 1,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([39.28957892282891, -8.398901640497016]),
            {
              "class": 1,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([39.2833991132586, -8.454935028145574]),
            {
              "class": 1,
              "system:index": "24"
            })]),
    vegetation = 
    //* color: #92d47e */
    //* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([39.253528797587315, -8.388537360705284]),
            {
              "class": 2,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([39.160145008524815, -8.39397171835217]),
            {
              "class": 2,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([39.1319925427045, -8.343701014329893]),
            {
              "class": 2,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([39.201343738993565, -8.226151083651445]),
            {
              "class": 2,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([39.15671178098575, -8.17178091217623]),
            {
              "class": 2,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([39.138172352274815, -8.08885215051649]),
            {
              "class": 2,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([39.22262974973575, -8.055539884834348]),
            {
              "class": 2,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([39.21713658567325, -7.949466305096542]),
            {
              "class": 2,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([39.17319127317325, -7.899819866707552]),
            {
              "class": 2,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([39.09216710325138, -7.911381900644393]),
            {
              "class": 2,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([39.15053197141544, -7.827719899716654]),
            {
              "class": 2,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([39.0880472302045, -7.790984924345444]),
            {
              "class": 2,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([39.21576329465763, -7.727711587118268]),
            {
              "class": 2,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([39.17868443723575, -7.703896580710918]),
            {
              "class": 2,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([39.140918934306065, -7.679399748532396]),
            {
              "class": 2,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([39.19928380247013, -7.8263594027172045]),
            {
              "class": 2,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([39.096973621806065, -7.682802170891677]),
            {
              "class": 2,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([39.04822179075138, -7.649457258323096]),
            {
              "class": 2,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([39.11688634153263, -7.601817150085268]),
            {
              "class": 2,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([39.17181798215763, -7.605900795564426]),
            {
              "class": 2,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([39.17181798215763, -7.818876589867827]),
            {
              "class": 2,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([39.14798903548074, -7.74713997326374]),
            {
              "class": 2,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([39.10463516624698, -7.94818047531519]),
            {
              "class": 2,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([39.218618320543854, -8.10320223230566]),
            {
              "class": 2,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([39.11587393575466, -8.19063567340227]),
            {
              "class": 2,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([39.189345005090594, -8.27854511683684]),
            {
              "class": 2,
              "system:index": "25"
            })]),
    water = 
    //* color: #0b4a8b */
    //* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([39.35619986348903, -8.368227613123809]),
            {
              "class": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([39.38035525600812, -8.348032989894854]),
            {
              "class": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([39.444213288234685, -8.2950385334808]),
            {
              "class": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([39.438720124172185, -8.175435108367365]),
            {
              "class": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([39.493651764797185, -8.195144973461744]),
            {
              "class": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([39.529357331203435, -8.247473319333112]),
            {
              "class": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([39.44375527585766, -8.076871216684244]),
            {
              "class": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([39.54675210202954, -8.10542324636444]),
            {
              "class": 3,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([39.4732810326936, -7.9233877394543955]),
            {
              "class": 3,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([39.54194558347485, -7.799978640853996]),
            {
              "class": 3,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([39.40255654538891, -7.803380089965213]),
            {
              "class": 3,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([39.298873073709224, -7.770725037865157]),
            {
              "class": 3,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([39.2425681420686, -7.825828959505551]),
            {
              "class": 3,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([39.175484706519086, -8.046416577163424]),
            {
              "class": 3,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([39.117806483862836, -8.040977456831673]),
            {
              "class": 3,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([39.049141933081586, -8.028739169455969]),
            {
              "class": 3,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([39.2420893207769, -7.977025221681333]),
            {
              "class": 3,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([39.27848153269096, -7.906298979152737]),
            {
              "class": 3,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([39.28946786081596, -7.856647347879879]),
            {
              "class": 3,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([39.28740792429252, -7.787941471721601]),
            {
              "class": 3,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([39.35469918405815, -7.777736665212876]),
            {
              "class": 3,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([39.31231771376604, -7.705993302448918]),
            {
              "class": 3,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([39.409134730367605, -7.654956893615397]),
            {
              "class": 3,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([39.49290548232073, -7.658359511427499]),
            {
              "class": 3,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([39.59796224501604, -7.63386005743567]),
            {
              "class": 3,
              "system:index": "24"
            }),
        ee.Feature(
            ee.Geometry.Point([39.48535238173479, -7.5617146386931875]),
            {
              "class": 3,
              "system:index": "25"
            }),
        ee.Feature(
            ee.Geometry.Point([39.39608846571917, -7.490918731415707]),
            {
              "class": 3,
              "system:index": "26"
            })]),
    bareland = 
    //* color: #ffc82d */
    //* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([39.257042750387136, -7.866547556072524]),
            {
              "class": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([39.267514094381276, -7.879300807216674]),
            {
              "class": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([39.290516718892995, -7.874709682028109]),
            {
              "class": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([39.28897176650042, -7.864506999474894]),
            {
              "class": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([39.31403432753557, -7.883551803663194]),
            {
              "class": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([39.320729121236745, -7.882531568498083]),
            {
              "class": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([39.342701777486745, -7.875049767120753]),
            {
              "class": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([39.371197566060964, -7.869438327397074]),
            {
              "class": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([39.37531743910784, -7.85583452197458]),
            {
              "class": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([39.39196859267229, -7.853113707385336]),
            {
              "class": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([39.39729009535784, -7.8548142185923835]),
            {
              "class": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([39.3238190260219, -7.89443415550576]),
            {
              "class": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([39.30036865459356, -7.905189287283043]),
            {
              "class": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([39.23427902446661, -7.924912304885591]),
            {
              "class": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([39.31564651714239, -7.941574117868804]),
            {
              "class": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([39.33109604106817, -7.950414805477977]),
            {
              "class": 4,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([39.28526245342169, -7.973365700809511]),
            {
              "class": 4,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([39.22998749004278, -7.897367829466436]),
            {
              "class": 4,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([39.232390749320125, -7.845844532659057]),
            {
              "class": 4,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([39.21676956401739, -7.846524749875246]),
            {
              "class": 4,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([39.27290283428106, -7.764210414883264]),
            {
              "class": 4,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([39.34731804119024, -7.937748761348907]),
            {
              "class": 4,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([39.36105095134649, -7.934178396467142]),
            {
              "class": 4,
              "system:index": "22"
            })]),
    builtup = 
    //* color: #ff5602 */
    //* shown: false */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Point([39.016461944579554, -8.123944974700448]),
            {
              "class": 5,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Point([39.0243583679194, -8.126324109464575]),
            {
              "class": 5,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Point([39.03259811401315, -8.127003859663573]),
            {
              "class": 5,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Point([39.04478607177682, -8.129128071612431]),
            {
              "class": 5,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Point([39.06615791320748, -8.127088828357467]),
            {
              "class": 5,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Point([39.09965333938546, -8.128512051305233]),
            {
              "class": 5,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Point([39.09896669387765, -8.132802931718013]),
            {
              "class": 5,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Point([39.101305580138636, -8.129659122842083]),
            {
              "class": 5,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Point([39.09783110230787, -8.132824173586036]),
            {
              "class": 5,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Point([39.09868940919264, -8.134438552263278]),
            {
              "class": 5,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Point([39.099976869519786, -8.129298008082428]),
            {
              "class": 5,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Point([39.0966294726692, -8.131082336670206]),
            {
              "class": 5,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Point([39.097466321881846, -8.134311101551448]),
            {
              "class": 5,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Point([39.106993528302745, -8.138623161457414]),
            {
              "class": 5,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Point([39.11768140840457, -8.140959268707817]),
            {
              "class": 5,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Point([39.1384524350159, -8.135840049863823]),
            {
              "class": 5,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Point([39.14617719697879, -8.142509890552322]),
            {
              "class": 5,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Point([39.14647760438846, -8.143869334901158]),
            {
              "class": 5,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Point([39.155790234088165, -8.139790988010304]),
            {
              "class": 5,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Point([39.18296773257373, -8.195595254431574]),
            {
              "class": 5,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Point([39.220611366264315, -8.292769674670723]),
            {
              "class": 5,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Point([39.18582152200801, -7.888831850459051]),
            {
              "class": 5,
              "system:index": "21"
            }),
        ee.Feature(
            ee.Geometry.Point([39.18693732095821, -7.889341960586591]),
            {
              "class": 5,
              "system:index": "22"
            }),
        ee.Feature(
            ee.Geometry.Point([39.18588589502437, -7.890808523697559]),
            {
              "class": 5,
              "system:index": "23"
            }),
        ee.Feature(
            ee.Geometry.Point([39.18886851144893, -7.891552430533149]),
            {
              "class": 5,
              "system:index": "24"
            })]);

var trainingData = mangrove.merge(water).merge(vegetation).merge(bareland).merge(builtup);




// Function To Calculate
function Run_analysis(){
  
  var layers = drawingTools.layers();

  if (layers.length() === 0) {
  ui.alert(' Please draw a polygon first before running analysis.');
  return;
}

var om = ee.FeatureCollection(layers.get(0).getEeObject());


  proc2.setDisabled(false);

  // 1) Stop drawing and import the layer created by the user
  drawingTools.stop();
  
  
  print('polygon:', om)

  // Hide the layer created by the user
  Map.drawingTools().layers().forEach(function(layer) {
    layer.setShown(false);
  });



  // Begin importing all image-related data
  var threshold = parseFloat(cloudPercentageTextbox.getValue());
  
  
  var startDate = startDateTextbox.getValue();
  var endDate = endDateTextbox.getValue();
  
  if (!startDate || !endDate) {
    startDate = '2017-03-30';
    endDate = '2023-12-31';
  }
  
  print('Start Date:', startDate);
  print('End Date:', endDate);
  
  
  var dates = [startDate, endDate];
  
  
  

  
  var selectedAnalysis = MangroveAnalysis.getValue();
  var selectedSensor = 1;// Sensor.getValue();
  // var polynomialResponse = Pol.getValue();
  
  var polynomialResponse = PolyFilter.getValue();
  
  var clippingArea = om;

  // Log inputs for debugging
  console.log(startDate, endDate, selectedAnalysis, selectedSensor, polynomialResponse, clippingArea);
  // console.log(startDate, endDate, dates, selectedAnalysis, selectedSensor, polynomialResponse, clippingArea);

  var S2A; // For Sentinel-2 data
  var S2B; // For Landsat-8 data
  var scale; // Spatial resolution (scale)
  var VisRGB; // Visualization placeholder



var collection = ImageCollectionSentinelSR(dates, clippingArea, threshold);
var scale = 10;



var start = ee.Date(startDate);
var end = ee.Date(endDate);

// limit to max 1 year
var diff = end.difference(start, 'year');

end = ee.Date(ee.Algorithms.If(diff.gt(1), start.advance(1, 'year'), end));



collection = collection.limit(50);
   
   
   

  var count = collection.size();
  print('Image count:', count);
  

  
  

count.evaluate(function(c) {
  if (c === 0) {
    panel.add(ui.Label('⚠ No images found!', {color: 'red'}));
  }
});


  
  print('Collection size:', collection.size());
  
 
  console.log("S2B Size")
  // console.log(S2B.size())
  console.log(collection.size())
  
  var im = ee.Image(collection.first());
  
  ims = ee.ImageCollection([]);
  if (selectedAnalysis === 0) {
    
    
    
var composite = collection.limit(20).median().clip(clippingArea);




// VEGETATION INDICES


// NDVI
var ndvi = composite.normalizedDifference(
  ['nir', 'red']
).rename('NDVI');


// NDWI
var ndwi = composite.normalizedDifference(
  ['green', 'nir']
).rename('NDWI');


// SAVI
var savi = composite.expression(
  '((NIR - RED) / (NIR + RED + 0.5)) * 1.5',
  {
    'NIR': composite.select('nir'),
    'RED': composite.select('red')
  }
).rename('SAVI');


// CMRI
var cmri = ndvi.subtract(ndwi).rename('CMRI');


// Add all indices
composite = composite
  .addBands(ndvi)
  .addBands(ndwi)
  .addBands(savi)
  .addBands(cmri);







var result = RF_Mangrove_Classification(composite, trainingData, selectedSensor);

var classified = result.classified;
var classifier = result.classifier;
var testSet = result.testSet;


//  ACCURACY ASSESSMENT 

var validated = testSet.classify(classifier);

var confusionMatrix = validated.errorMatrix('class', 'classification');

print('Confusion Matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Kappa:', confusionMatrix.kappa());
print('Producer Accuracy:', confusionMatrix.producersAccuracy());
print('User Accuracy:', confusionMatrix.consumersAccuracy());




ims = ee.ImageCollection([classified]);
analysisName = 'Land Cover Classification';

// analysisName = 'Mangrove (RF Classification)';

imVis = {
  min: 1,
  max: 5,
  palette: [
    '#2E7D32', // Mangrove (dark green)
    '#AED581', // vegetation (soft blue)
    '#64B5F6', // water (light brown/gray)
    '#D7CCC8', // Bareland (light green)
    '#c45339'  // Builtup (pale green)
    
  ]
};


    
    
    
    // --------- CREATE TIME SERIES CHART ---------

var startYear = ee.Date(startDate).get('year');
var endYear = ee.Date(endDate).get('year');

startYear = ee.Number(startYear);
endYear = ee.Number(endYear);

// Create list of years
var years = ee.List.sequence(startYear, endYear);




// Map through years
var features = years.map(function(y) {
  var mang = getMangrove(y, clippingArea, selectedSensor);
  return getArea(mang, clippingArea, y);
});








// FeatureCollection
var trend = ee.FeatureCollection(features);




print('Trend data:', trend);

// Create chart
var chart = ui.Chart.feature.byFeature({
  features: trend,
  xProperty: 'year',
  yProperties: ['area_ha']
})
.setChartType('LineChart')
.setOptions({
  title: 'Mangrove Coverage Trend',
  // hAxis: {title: 'Year (2000)'},
  // vAxis: {title: 'Area (1000 ha)'},
  hAxis: {
  title: 'Year(2000)',
  slantedText: true,
  slantedTextAngle: 45,
  textStyle: {fontSize: 10}
},

 vAxis: {
    title: 'Area (1000 ha)'
  },

  lineWidth: 2,
  pointSize: 4,
  colors: ['green'],
  
  lineWidth: 2,
  pointSize: 3,
  // legend: {position: 'right'},
  colors: ['green'],
  legend: {
  position: 'top',
  alignment: 'end',
  textStyle: {fontSize: 11}
},
chartArea: {
  left: 60,
  right: 20,
  top: 50,
  bottom: 50,
  width: '80%',
  height: '65%'
}
  
  
});


chartPanel.clear();
chartPanel.add(ui.Label('📊 Mangrove Trend', {fontWeight: 'bold'}));
chartPanel.add(chart);



// Display accuracy in UI
chartPanel.add(ui.Label('📊 Accuracy Assessment', {fontWeight: 'bold'}));

confusionMatrix.accuracy().evaluate(function(acc){
  chartPanel.add(ui.Label('Overall Accuracy: ' + acc.toFixed(3)));
});

confusionMatrix.kappa().evaluate(function(k){
  chartPanel.add(ui.Label('Kappa: ' + k.toFixed(3)));
});

   
  }
  
  
  
  
  
  else if (selectedAnalysis === 1) {
  
  analysisName = 'Mangrove Change';
  
//  Get years from user input
  var startYear = ee.Date(startDate).get('year');
  var endYear = ee.Date(endDate).get('year');
  
  startYear = ee.Number(startYear);
  endYear = ee.Number(endYear);
  

  
  
  var before = getMangrove(startYear, clippingArea, selectedSensor);
  var after = getMangrove(endYear, clippingArea, selectedSensor);
  
  

  
  
  
  // Compute change
  var changeImage = getChange(before, after, clippingArea);
  
  // IMPORTANT: wrap inside collection (your system expects this)
  ims = ee.ImageCollection([changeImage]);
  
  imVis = {
    min: 1,
    max: 4,
    palette: [
      'ff0000', // Loss
      '000000', // No change (mangrove)
      '00ff00', // Gain
      '808080'  // Non-mangrove
    ]
  };
  
 // --------- CHANGE CHART ---------

function getAreaByClass(changeImage, label) {
  
  var areaImage = ee.Image.pixelArea().addBands(changeImage);

  var stats = areaImage.reduceRegion({
    reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'class',
    }),
    geometry: clippingArea,
    scale: scale,
    maxPixels: 1e13
  });

  var groups = ee.List(stats.get('groups'));

  var fc = groups.map(function(item) {
    item = ee.Dictionary(item);

    var classId = ee.Number(item.get('class'));
    var areaHa = ee.Number(item.get('sum')).divide(10000).divide(1000);

    var className = ee.String(
      ee.Algorithms.If(classId.eq(1), 'Loss',
      ee.Algorithms.If(classId.eq(2), 'No Change',
      ee.Algorithms.If(classId.eq(3), 'Gain',
      'Constant'))))
    ;

    return ee.Feature(null, {
      'period': label,
      'class': className,
      'area_ha': areaHa
    });
  });

  return ee.FeatureCollection(fc)
          .filter(ee.Filter.neq('class', 'Constant'));
}


// Get years
var startYear = ee.Number(ee.Date(startDate).get('year'));
var endYear = ee.Number(ee.Date(endDate).get('year'));

// Build period label
var label = startYear.format().cat(' - ').cat(endYear.format());

// Compute area stats
var changeStats = getAreaByClass(changeImage, label);

// Force evaluation (IMPORTANT)
print('Change stats:', changeStats);

// Create chart
var changeChart = ui.Chart.feature.groups({
  features: changeStats,
  xProperty: 'period',
  yProperty: 'area_ha',
  seriesProperty: 'class'
})
.setChartType('ColumnChart')
.setOptions({
  title: 'Mangrove Change',

  hAxis: {
    title: 'Year'
  },

  vAxis: {
    title: 'Area (1000 ha)'
  },

  series: {
    0: {color: 'red'},    // Loss
    1: {color: 'black'},  // No Change
    2: {color: 'green'}   // Gain
  },

  legend: {
    position: 'top'
  },

  chartArea: {
    left: 60,
    right: 20,
    top: 50,
    bottom: 50,
    width: '80%',
    height: '65%'
  }
});

// Show in UI panel
chartPanel.clear();
chartPanel.add(ui.Label('📊 Mangrove Change ', {fontWeight: 'bold'}));
chartPanel.add(changeChart);


  
}
  
  
  else if (selectedAnalysis === 2) {
  
  analysisName = 'Restoration';
  
  var startYear = ee.Number(ee.Date(startDate).get('year'));
  var endYear = ee.Number(ee.Date(endDate).get('year'));
  
  var suitabilityImage = getSuitability(startYear, endYear, clippingArea, selectedSensor);
  
  ims = ee.ImageCollection([suitabilityImage]);
  
  imVis = {
    min: 1,
    max: 3,
    palette: [ 'FFFF00', 'FFA500', 'FF0000']  //'00FFFF']//'000000',
  };





// RESTORATION CHART — grouped by priority class, with matching colors
var pixelAreaHa = ee.Image.pixelArea().divide(10000); // hectares

var restorationStats = pixelAreaHa.addBands(suitabilityImage).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'priority'
  }),
  geometry: clippingArea,
  scale: 60,
  bestEffort: true,
  tileScale: 16,
  maxPixels: 1e13
});

var restGroups = ee.List(restorationStats.get('groups'));

// Get area per class, default to 0 if missing (map+reduce avoids List.filter property issue)
var getRestArea = function(list, classNum) {
  var areas = ee.List(list).map(function(item) {
    item = ee.Dictionary(item);
    return ee.Algorithms.If(
      ee.Number(item.get('priority')).eq(classNum),
      item.get('sum'),
      0
    );
  });
  return areas.reduce(ee.Reducer.sum());
};

var highArea = getRestArea(restGroups, 3);
var modArea = getRestArea(restGroups, 2);
var lowArea = getRestArea(restGroups, 1);

var restorationFC = ee.FeatureCollection([
  ee.Feature(null, {Priority: 'High', High: highArea, Moderate: 0, Low: 0}),
  ee.Feature(null, {Priority: 'Moderate', High: 0, Moderate: modArea, Low: 0}),
  ee.Feature(null, {Priority: 'Low', High: 0, Moderate: 0, Low: lowArea})
]);

print('Restoration priority stats:', restorationFC);

// Create chart — colors map 1:1 to High/Moderate/Low series
var chart = ui.Chart.feature.byFeature(restorationFC, 'Priority', ['High', 'Moderate', 'Low'])
  .setChartType('ColumnChart')
  .setOptions({
    title: 'Mangrove Restoration Priority',
    hAxis: {
      title: 'Priority Class',
      textStyle: {fontSize: 12}
    },
    vAxis: {
      title: 'Area (ha)',
      viewWindow: {min: 0}
    },
    legend: {position: 'none'},
    colors: ['FF0000', 'FFA500', 'FFFF00'], // High=red, Moderate=orange, Low=yellow
    isStacked: false,
    bar: {groupWidth: '40%'}
  });

chartPanel.clear();
chartPanel.add(ui.Label('📊 Restoration Priority', {fontWeight: 'bold'}));
chartPanel.add(chart);
 
DownloadTIFF_Button.setUrl(generateDownloadURL());  
}
  
  
  
function generateDownloadURL() {

  if (!ims || ims.size().getInfo() === 0) {
    ui.alert('Run analysis first.');
    return null;
  }

  var image = ee.Image(ims.first());

  var layers = Map.drawingTools().layers();
  if (layers.length() === 0) {
    ui.alert('Draw polygon first.');
    return null;
  }

  var aoi = ee.FeatureCollection(layers.get(0).getEeObject());
  
  
  var area = aoi.geometry().area();

area.evaluate(function(a){

  if(a > 100000000){

    ui.alert(
      'Polygon is too large. Please draw a smaller area.'
    );

  }

});
  
  

  var url = image.getDownloadURL({
    name: 'mangrove_result',
    scale: 30, //10
    region: aoi.geometry(),
    fileFormat: 'GeoTIFF'
  });

  return url; //  THIS LINE IS THE KEY
}


  


  
function buildImageSelect(items, imVis, reVis, analysisName, clippingArea,Pr_Response,lis_S2A,prodVis, indSel,scale){ 
      var imageSelect = ui.Select({ 
          items: items, 
          value:0,
          placeholder: "List of Images", 
          style: { width: '95%', margin: '10px 10px 10px 10px', position: 'top-center'},
          onChange: function (value){
                    var im=ee.Image(uris.get(value));
                    var layer1=ui.Map.Layer(im.clip(clippingArea), imVis, analysisName);
                    var layer2= ui.Map.Layer((ee.Image(lis_S2A.get(value))).clip(clippingArea), St.vizParams, 'RGB');
                    if (Pr_Response===true) {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2,layer1, layer3]); 
                              addReferenceLayers();
                        }
                        else {
                              Map.layers().reset([layer2,layer1, layer3]);
                              addReferenceLayers();
                        }
                    }
                    else {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2, layer1]); 
                              addReferenceLayers();
                        }
                        else {
                              Map.layers().reset([layer2,layer1]);
                              addReferenceLayers();
                        }
                    }    
                    // DownloadC1_Button.setUrl(getURLNDVI(im,analysisName, clippingArea,scale,analyisName ));
                    minBox_C1.setDisabled(false);
                    maxBox_C1.setDisabled(false); 
              
              //WHEN CLASS 1 CHANGES
             
              minBox_C1.onChange(function(value) {
      
                    imVis.min =parseFloat(value);
                    layer1.setVisParams(imVis);
                    var pan1 = Legend(analysisName, imVis);
                    panelLegend.widgets().set(2, pan1.widgets().get(2));
                    layer1 = ui.Map.Layer(iv.clip(clippingArea), imVis, analysisName);
                    if (Pr_Response===true) {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2,layer1, layer3]); 
                        }
                        else {
                              Map.layers().reset([layer2,layer1, layer3]);
                        }
                    }
                    else {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2, layer1]);  
                        }
                        else {
                              Map.layers().reset([layer2,layer1]);
                        }         
                    }
              });
              maxBox_C1.onChange(function(value) {
                    imVis.max =parseFloat(value);
                    layer1.setVisParams(imVis);
                    var pan1 = Legend(analysisName, imVis);
                    panelLegend.widgets().set(2, pan1.widgets().get(2));
                    layer1 = ui.Map.Layer(iv.clip(clippingArea), imVis, analysisName);
                    if (Pr_Response===true) {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2,layer1])//, layer3]); 
                        }
                        else {
                              Map.layers().reset([layer2,layer1, layer3]);
                        }
                    }
                    else {
                        if (Re_Response===true) { 
                              Map.layers().reset([layer2, layer1]);  
                        }
                        else {
                              Map.layers().reset([layer2,layer1]);
                        }         
                    }
              });  
            }
      });
      return imageSelect; 
}

  downloadIV.style().set('shown', true);
  downloadVFile.style().set('shown', true);  
  downloadTIFFPanel.style().set('shown', true);
  minPalete=parseFloat(minBox_C1.getValue());
  maxPalete=parseFloat(maxBox_C1.getValue());
  
  // Draw clippingArea result as an image
  var clipArearesult = ee.Image().byte();
  border = clipArearesult.paint({
    featureCollection: clippingArea,
    color: 1,
    width: 1
  });
  Map.clear(); 
 
  Map.centerObject(clippingArea, 10);
  
  Map.setControlVisibility(true, true, false, true, true, true, false);
  

  // var mosf = ee.Date(ee.Image(S2A.first()).get('system:time_start'));
  var firstImage = ee.Image(collection.first());
  // var firstImage = ee.Image(S2A.first());
  var mosf = ee.Date(ee.Algorithms.If(
  firstImage,
  firstImage.get('system:time_start'),
  ee.Date(Date.now())
));
  // var iv = ims.first();
  var iv = ee.Image(ee.Algorithms.If(
  ims.size().gt(0),
  ims.first(),
  ee.Image(0).selfMask()
));
  
  im = collection.filterDate(mosf.advance(-0.5, 'hour'), mosf.advance(0.5, 'hour'));
  // im = S2A.filterDate(mosf.advance(-0.5, 'hour'), mosf.advance(0.5, 'hour'));
  var panL2;
  prodVis = {min : 0.5, max : 1.5, palette : St.paletaProd};
  // imVis = {min :minPalete, max : maxPalete, palette : St.paletaIV};
  
  
  var safeRGB = ee.Image(ee.Algorithms.If(
  collection.size().gt(0),
  // collection.mosaic(),
  collection.limit(10).mosaic(),
  ee.Image(0).selfMask()
));
  

var rgbVis;


  rgbVis = {bands: ['red','green','blue'], min: 0, max: 0.3};
// }

   Map.addLayer(safeRGB.clip(clippingArea), rgbVis, 'RGB');



  
  Map.addLayer(iv.clip(clippingArea), imVis, analysisName); //Index
  
  Map.addLayer(border, {palette: 'black'}, 'Polygons');
  
  addReferenceLayers();
  
  panelLegend = Legend(analysisName, imVis, selectedAnalysis);
  Map.add(panelLegend);
  
  //The lists are generated to extract information
  var uris=ims.toList(ims.size());
  var imageSelect = null;

  // DownloadC1_Button.setUrl(getURLNDVI(iv,analysisName, clippingArea,scale));
  DownloadC2_Button.setUrl(getVectorFile(clippingArea));
  DownloadTIFF_Button.setUrl(generateDownloadURL());
  // Map.add(panel1);
}

var proc2 = ui.Button('New polygon', NewPolygon, false, {margin: 'auto', padding: '5px', width: '110px', fontSize: '15px'});
var proc = ui.Button('Run analysis', Run_analysis, false, {margin: 'auto', padding: '5px', width: '110px', fontSize: '15px'});

// proc.setDisabled(true);

drawingTools.onDraw(function() {
  proc.setDisabled(false);
});

// var proc2 = ui.Button('New polygon', NewPolygon, false, {margin: 'auto', padding: '5px', width: '110px', fontSize: '15px'});
var procHelp= ui.Panel({
      layout: ui.Panel.Layout.flow("horizontal"),
      style: {position: 'top-center'},
      widgets: [proc2, proc]
  });
panel.add(procHelp);

// panel.add(referencePanel);
// ui.root.insert(0, panel);

// REFERENCE LAYERS PANEL


// Create title
var referenceTitle = ui.Label({
  value: 'Reference Layers',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '8px 0 4px 0'
  }
});

// Protected Areas checkbox
var protectedCheckbox = ui.Checkbox({
  label: 'Degraded Mangrove Areas',
  value: false,
  style: {margin: '2px 0'}
});

var groundTruthCheckbox = ui.Checkbox({
  label: 'Ground Truth Points',
  value: false
});

// Example layer (replace with your dataset)
var protectedAreas = ee.FeatureCollection("projects/ee-paulkaria2020/assets/degraded_Mangrove");



// Ground Truth Dataset
var groundTruth = ee.FeatureCollection("projects/ee-paulkaria2020/assets/Ground_Truth");



// ======================================
// STYLE GROUND TRUTH BY CLASS
// ======================================

var groundTruthStyled = groundTruth.map(function(feature) {

  var cls = ee.Number(feature.get('Class'));

  var color = ee.Algorithms.If(
    cls.eq(1), '#2E7D32',   // Mangrove
    ee.Algorithms.If(
      cls.eq(2), '#AED581', // Vegetation
      ee.Algorithms.If(
        cls.eq(3), '#64B5F6', // Water
        ee.Algorithms.If(
          cls.eq(4), '#D7CCC8', // Bareland
          '#c45339'            // Built-up
        )
      )
    )
  );

  return feature.set('style', {
    color: color,
    pointSize: 2,
    width: 1
  });

});




// Create map layer
var protectedLayer = ui.Map.Layer(
  protectedAreas,
  {
    color: 'red'
  },
  'Protected Areas'
);




var groundTruthLayer = ui.Map.Layer(
  groundTruthStyled.style({
    styleProperty: 'style'
  }),
  {},
  'Ground Truth'
);


function addReferenceLayers(){

  if(protectedCheckbox.getValue()){
    Map.layers().add(protectedLayer);
  }

  if(groundTruthCheckbox.getValue()){
    Map.layers().add(groundTruthLayer);
  }

}



// Checkbox behavior
protectedCheckbox.onChange(function(checked) {

  if (checked) {

    Map.layers().add(protectedLayer);

  } else {

    Map.layers().remove(protectedLayer);

  }

});

groundTruthCheckbox.onChange(function(checked) {

  if (checked) {

    Map.layers().add(groundTruthLayer);

  } else {

    Map.layers().remove(groundTruthLayer);

  }

});


// Create panel
var referencePanel = ui.Panel({
 
  widgets: [
  referenceTitle,
  protectedCheckbox,
  //benthicCheckbox,
  groundTruthCheckbox
],
  style: {
    padding: '8px',
    margin: '10px 0',
    border: '1px solid lightgray'
  }
});

// Add to main control panel
panel.add(referencePanel);



ui.root.insert(0, panel);

