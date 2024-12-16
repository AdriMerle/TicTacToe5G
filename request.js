// Install this : https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/

// Define the API URL and parameters
const apiUrl = "http://172.24.153.108:8080/qpe/getTagData";
const params = {
    mode: "json",
};

// Build the query string
const queryString = new URLSearchParams(params).toString();

// Fetch data from the API
fetch(`${apiUrl}?${queryString}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    return response.json();
  })
  .then(data => {

    // Get data from tags
    const tags = data.tags;
    
    // Make a new array with tag color, locationZoneNames
    const tagData = tags.map(tag => {
        return {
          color: tag.color,
          locationZoneNames: tag.locationZoneNames?.[0] || 'Unknown'
        };
      });

    // Initialize a 9-cell array with "-"
    const zoneStatus = Array(9).fill("-");

    // Process each tag in the input data
    tagData.forEach(({ color, locationZoneNames }) => {
    if (locationZoneNames.startsWith("Zone")) {
        const zoneIndex = parseInt(locationZoneNames.replace("Zone", ""), 10) - 1; // Convert ZoneX to index
        if (color === "#00FF33") {
            zoneStatus[zoneIndex] = "X"; // Green
        } else if (color === "#FF0000") {
            zoneStatus[zoneIndex] = "O"; // Red
        }
    }
    });

    console.log(zoneStatus); // Log the data to the

    // Display the data on the webpage, 3 elements per row
    const outputElement = document.getElementById("output");
    zoneStatus.forEach((status, index) => {
        if (index % 3 === 0) {
            outputElement.appendChild(document.createElement("br"));
        }
        outputElement.appendChild(document.createTextNode(status));
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error); // Handle errors
    const outputElement = document.getElementById("output");
    outputElement.textContent = `Error fetching data: ${error.message}`;
  });
