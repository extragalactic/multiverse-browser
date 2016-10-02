INTRODUCTION
------------

The Multiverse Galaxy Browser is an interface to browse a collection of 480 galaxies, representing most large galaxies within 100 million light years of Earth. Multiverse is an offline astronomy application built with TouchDesigner software that lets you navigate a galactic map in 3D space, using high-res images from telescopes like the Hubble Space Telescope. This website lets users search the database and filter the results according to several different criteria. Each galaxy has a picture and data such as: spatial coordinates, size, distance and morphological type. There are two different page styles for listing galaxies, with a linear list or a tiled grid (which looks nice when browsing a large number of galaxies).

The program is also built to connect to the TouchDesigner Multiverse application via OSC messages. The bi-directional communication lets a user auto-fly to a galaxy's location, or display data for a galaxy when selected within TouchDesigner. This functionality is especially useful when presenting Multiverse for educational purposes. 

As an interesting footnote, the Multiverse project had a news story written about it in August 2015 which was published in newspapers across Canada, including a 2/3 page article in the Globe and Mail.

The Multiverse Browser is written in Javascript, using technologies including AngularJS, UI-Bootstrap, MongoDB, CSS3/Sass and it is built with Gulp.

Author: Matt Mazur
        matt@sigma-1.com


REQUIREMENTS
------------

Install Node.js and MongoDB


TO RUN
------

Start the MongoDB database. *** Note: The DB is not currently included in this Git repository. ***

If you are running locally, first navigate to the 'src' folder, open the file 'serverIP - local.js' and change the variable to your computer's IP address. You can also change the port here (the default port is 3300).

Start the Node.js server by running "galaxy-server.js", then navigate to your local IP on port 3300.


ADDITIONAL NOTES
----------------

The project is live online at: http://www.galacticnavigator.com/multiverse/#/home  The site is currently running on an Amazon EC2 server.

The project URL on GitHub is: https://github.com/extragalactic/multiverse-browser.git

The galaxy image folder is also not included in the Git repo (it is rather large).

More information and media about Multiverse can be found at my Galaxy Class website: http://www.galaxyclass.org/multiverse/  Galaxy Class is an astronomy class I run to teach people about cosmology and the universe.


ISSUES/BUGS
-----------

...

