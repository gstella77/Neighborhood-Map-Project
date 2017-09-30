## Neighborhood Map Project

The neighborhood Map Web site displays one of the largest **Basque** settlement in the United States from people of the Euskal Herria region in Spain. The Block Basque in Boise offers several locations for entertainment, eating, and dancing. The actual locations use Google Maps API and details for each place is retrieved with Foursquare API using the venue ID.

### How to Interact with the Map
* Use the filter to display locations by their name
* Display a specific place either by clicking on the list or on the marker itself
* Use the infowindow to learn more about the place by clicking on the business Web site

### How to Run the Web Site on your Local Computer
1. Clone or download the folder by copying the link on the top right corner (green button) and paste it in your terminal using Git. Instructions about how to use Git and how to clone a repository are found [here](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/).
2. Navigate to the folder location using ```$ cd /path/to/your-project-folder```
3. For more reliable API results run **python server** by typing ```python -m SimpleHTTPServer 8080``` this will run the project into a local server.
5. Start using the map to learn about the Basque community in Boise!

### Project Components and Vendor Libraries
* Knockout
* jQuery
* Google Maps API
* Boostrap