// Reading in the data 
function Data(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

  // Filtering data
  var buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = buildingArray[0];
  
  var panelData = d3.select("#sample-metadata");

  // Adding values and keys to the panel 
  Object.entries(result).forEach(([key, value]) => {
    panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

function charts(sample) {
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    var buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var result = buildingArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

// Build a Bubble Chart
    var bubbleChart = {
        title: "Bacteria",
        xaxis: { title: "OTU ID" },
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
          }
        }
      ];
// Plotting graph 
    Plotly.newPlot("bubble", bubbleData, bubbleChart);
    
// Horizontal bar chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10),
        text: otu_labels.slice(0, 10),
        type: "bar",
        orientation: "h",
        title: "Top 10 Bacteria",
      }
    ];

    Plotly.newPlot("bar", barData);
  });
};

function dashBroad() {
  // Use D3 to select the dropdown menu
  var selectDropdown = d3.select("#selDataset");

  // Populate the select options by using the list of sample names
  d3.json("samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      selectDropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Use the sample data from the list to build the plots
    var sampleData = name[0];
    charts(sampleData);
    Data(sampleData);
  });
};

function Change(newSample) {
// Fetch new data each time a new sample is selected
  buildCharts(newSample);
  Data(newSample);
};

// Initialize the dashboard
dashBroad()
