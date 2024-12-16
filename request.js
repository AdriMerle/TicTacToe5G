// Install this : https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/

// Define the API URL and parameters
const apiUrl = "http://172.24.153.108:8080/qpe/getTagData";
const params = {
    mode: "json",
    tag: "a4da22e1701e,a4da22e16cda"
};

// Build the query string
const queryString = new URLSearchParams(params).toString();

// Initialize a 9-cell array with "-"
const zoneStatus = Array(9).fill("-");

// Fetch data from the API
function fetchDataAndUpdate() {
    return fetch(`${apiUrl}?${queryString}`)
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
                locationZoneNames: tag.locationZoneNames?.[0] || 'Unknown',
                isPushed: tag.button1State === 'pushed'
                };
            });



            // Process each tag in the input data
            tagData.forEach(({ color, locationZoneNames, isPushed }) => {
                if (!isPushed) {
                    return;
                }
                if (locationZoneNames.startsWith("Zone")) {
                    const zoneIndex = parseInt(locationZoneNames.replace("Zone", ""), 10) - 1; // Convert ZoneX to index
                    if (zoneStatus[zoneIndex] !== "-") {
                        return;
                    }
                    if (color === "#00FF33") {
                        zoneStatus[zoneIndex] = "X"; // Green
                    } else if (color === "#FF0000") {
                        zoneStatus[zoneIndex] = "O"; // Red
                    }
                }
            });

            // Display the data on the webpage, 3 elements per row
            const outputElement = document.getElementById("output");
            outputElement.textContent = ""; // Clear the output
            zoneStatus.forEach((status, index) => {
                if (index % 3 === 0) {
                    outputElement.appendChild(document.createElement("br"));
                }
                outputElement.appendChild(document.createTextNode(status));
            });
            console.log(zoneStatus); // Log the data to the console

        })
        .catch(error => {
            console.error("Error fetching data:", error); // Handle errors
            const outputElement = document.getElementById("output");
            outputElement.textContent = `Error fetching data: ${error.message}`;
        });
}

fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 1000);