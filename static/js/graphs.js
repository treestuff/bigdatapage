queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {
	
	//Clean data
	var records = recordsJson;
	var dateFormat = d3.time.format("%m/%d/%Y");
	
	records.forEach(function(d) {
		d["timestamp"] = dateFormat.parse(d["timestamp"]);
		d["longitude"] = +d["longitude"];
		d["latitude"] = +d["latitude"];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var genderDim = ndx.dimension(function(d) { return d["gender"]; });
	var ageSegmentDim = ndx.dimension(function(d) { return d["age_segment"]; });
	var phoneBrandDim = ndx.dimension(function(d) { return d["phone_brand_en"]; });
	var locationdDim = ndx.dimension(function(d) { return d["location"]; });
	var heightdDim = ndx.dimension(function(d) { return d["height"]; });
	var spreadDim = ndx.dimension(function(d) { return d["spread"]; });
	var DBHDim = ndx.dimension(function(d) { return d["DBH"]; });
	var leanDim = ndx.dimension(function(d) { return d["lean"]; });
	var districtDim = ndx.dimension(function(d) { return d["District"]; });
	var incidentTypeDim = ndx.dimension(function(d) { return d["Treetype"]; });
	var slopeYearDim = ndx.dimension(function(d) { return d["ConstructionYear"]; });
	var ownerDim = ndx.dimension(function(d) { return d["Owner"]; });
	var slopeDegreeDim = ndx.dimension(function(d) { return d["Degree"]; });
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	var numRecordsByDate = dateDim.group();
	var genderGroup = genderDim.group();
	var ageSegmentGroup = ageSegmentDim.group();
	var phoneBrandGroup = phoneBrandDim.group();
	var locationGroup = locationdDim.group();
	var heightGroup = heightdDim.group();
	var spreadGroup = spreadDim.group();
	var DBHGroup = DBHDim.group();
	var leanGroup = leanDim.group();
	var districtGroup = districtDim.group();
	var incidentTypeGroup = incidentTypeDim.group();
	var slopeYearGroup = slopeYearDim.group();
	var ownerGroup = ownerDim.group();
	var slopeDegreeGroup = slopeDegreeDim.group();
	var all = ndx.groupAll();


	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["timestamp"];
	var maxDate = dateDim.top(1)[0]["timestamp"];


   //Charts
   var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var timeChart = dc.lineChart("#time-chart");
	var genderChart = dc.rowChart("#gender-row-chart");
	var ageSegmentChart = dc.rowChart("#age-segment-row-chart");
	var phoneBrandChart = dc.rowChart("#phone-brand-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");
	var heightChart = dc.barChart("#height-row-chart");
	var spreadChart = dc.barChart("#spread-row-chart");
	var DBHChart = dc.barChart("#DBH-row-chart");
	var leanChart = dc.barChart("#lean-row-chart");
	var districtChart = dc.rowChart("#district-row-chart");
	var incidentTypeChart = dc.rowChart("#incident-type-row-chart")
    var slopeYearChart = dc.pieChart("#slope-year");
    var ownerChart = dc.pieChart("#owner-pie-chart");
    var slopeDegreeChart = dc.barChart("#slope-degree")

	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);


	timeChart
		.width(950)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	genderChart
        .width(450)
        .height(100)
        .dimension(genderDim)
        .group(genderGroup)
        .label(function(d){
            return d.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

	ageSegmentChart
		.width(450)
		.height(100)
        .dimension(ageSegmentDim)
        .group(ageSegmentGroup)
        .label(function(d){
            return d.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

	heightChart
		.width(450)
		.height(200)
		.x(d3.scale.linear().domain([1,25]))
		.yAxisLabel("Number of Cases")
		.xAxisLabel("Tree Height")
		.margins({top: 10, right: 50, bottom: 40, left: 40})
        .dimension(heightdDim)
        .group(heightGroup)
        .elasticY(true)
        .colors(['#6baed6'])

	spreadChart
		.width(450)
		.height(200)
		.x(d3.scale.linear().domain([1,25]))
		.yAxisLabel("Number of Cases")
		.xAxisLabel("Crown Spread")
		.margins({top: 10, right: 50, bottom: 40, left: 40})
        .dimension(spreadDim)
        .group(spreadGroup)
        .elasticY(true)
        .colors(['#6baed6'])

	DBHChart
		.width(450)
		.height(200)
		.x(d3.scale.linear().domain([100,4000]))
		.yAxisLabel("Number of Cases")
		.xAxisLabel("DBH")
		.margins({top: 10, right: 50, bottom: 40, left: 40})
        .dimension(DBHDim)
        .group(DBHGroup)
        .elasticY(true)
        .colors(['#6baed6'])

	leanChart
		.width(450)
		.height(200)
		.x(d3.scale.linear().domain([0,90]))
		.yAxisLabel("Number of Cases")
		.xAxisLabel("Leaning Angle")
		.margins({top: 10, right: 50, bottom: 40, left: 40})
        .dimension(leanDim)
        .group(leanGroup)
        .elasticY(true)
        .colors(['#6baed6'])

	districtChart
        .width(450)
        .height(200)
        .dimension(districtDim)
        .group(districtGroup)
        .label(function(d){
            return d.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    incidentTypeChart
        .width(450)
        .height(100)
        .dimension(incidentTypeDim)
        .group(incidentTypeGroup)
        .label(function(d){
            return d.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

	phoneBrandChart
		.width(450)
		.height(2100)
        .dimension(phoneBrandDim)
        .group(phoneBrandGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    locationChart
    	.width(300)
		.height(2100)
        .dimension(locationdDim)
        .group(locationGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

    slopeYearChart
        .width(400)
        .height(400)
        .slicesCap(4)
        .innerRadius(100)
        .dimension(slopeYearDim)
        .group(slopeYearGroup)
        .label(function(d){
            return d.data.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })

    ownerChart
        .width(400)
        .height(400)
        .slicesCap(4)
        .innerRadius(100)
        .dimension(ownerDim)
        .group(ownerGroup)
        .label(function(d){
            return d.data.key + " : " + d.value + " - " +(d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })

	slopeDegreeChart
		.width(450)
		.height(200)
		.x(d3.scale.linear().domain([0,90]))
		.yAxisLabel("Number of Cases")
		.xAxisLabel("Slope Degree")
		.margins({top: 10, right: 50, bottom: 40, left: 40})
        .dimension(slopeDegreeDim)
        .group(slopeDegreeGroup)
        .elasticY(true)
        .colors(['#6baed6'])

	var map = L.map('map');
	
	var drawMap = function(){

	    map.setView([22.3, 114.17], 10);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["latitude"], d["longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();
	//Update the heatmap if any dc chart get filtered
	dcCharts = [timeChart, genderChart, ageSegmentChart, phoneBrandChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	});
	
	dc.renderAll();

};