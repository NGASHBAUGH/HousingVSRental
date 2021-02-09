# HousingVSRental 


In this Project we wanted to visualize house marked date within the entire US.

First, we used Jupyter Notebook to run an API query through the US Census sight to get the most recent (2018) census data. We then saved that as a CSV and created a SQL server to house the data.

To run our code, you will first need to set up a PostgreSQL server named Project_2 Then set your user account as admin2 with pw: 12345 or update our code with your own superuser ID and password. Use the Table_creater code to make the column headings needed. Finally import the cenus_data_2018 CSV file

This will set up the sever so that our app.py can make the proper connections for our data.

We then started on our JavaScript and created multiple functions to create and display our data. The user can enter a zip code for anywhere in the US and find the data we pulled.

We make an API call to Zillow in real time to obtain Marked data on the Home Value Index by zipcode and the Rental index to visualize what areas may be better to buy in vs rent in. This was displayed using Plotly as bar graphs.

The area selected by the user is displayed in a Leaflet map automatically and changes whenever the new zipcode is entered.

At the same time a call is made to our SQL server based on the zipcode entered to display key market data for the area to display in our Market Highlights box as well as generate a pie chart below the map to show the number of houses built in that zip code in various year ranges.

Lastly to comply with Zillow's terms of using their API we created a button with jQuery that when clicked, routes you to the Zillow website.

Contributors: Michael Munson, Nathan Ashbaugh, Rafael Cespedes, Jordan Usner UC Davis BootCamp 2020

