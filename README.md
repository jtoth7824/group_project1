# Group Name:

The Librarians

# Project Description:

Book site where user can search by author name or book title and retrieve information about author or the book. This could include items such as sale date, author bio, book cover, page count, usa pricing info. The author is then searched upon if there is any current author event and information about the author event is displayed. The book title is searched behind the scenes for any related movies based upon that book title. The movie info is then displayed along with possible movie poster.

# Project Mockup

https://designer.gravit.io/?token=1zKWwJ-XQp2MWJxHxJjlm8LMzhQ7gimn

# Team members and responsibilities:

John: Javascript/jquery
Walter: HTML/CSS/responsiveness
Matias: HTML/CSS/powerpoint presentation
Duc: API research, Javascript

<div>John:  Javascript/jquery</div>
<div>Walter: HTML/CSS/responsiveness</div>
<div>Matias: HTML/CSS/powerpoint presentation</div>
<div>Duc:  API research, Javascript</div>

# APIs

Random House publishing, OMBDB api, openlibrary API, possibly some geolocation TBD


# PseudoCode

<div>function init()</div>
<div>retrieve from local storage and check for null</div>
<div>display info</div>

<div>function retrieve values from local storage</div>

<div>function buildqueryURLs</div>
<div>	build movie call</div>
<div>	build author call</div>
<div>	build title call</div>
<div>	build author even call</div>

<div>event listener search button</div>
<div>	retrieve search term (last name, first name, title)</div>
<div>	save local storage</div>
<div>	display book results in dropdown list</div>

<div>event listener dropdown selection</div>
<div>	user picks book</div>
<div>	make api call to get book info</div>
<div>	display book info</div>
<div>	retrieve the book cover image</div>
<div>	display the book cover image</div>
<div>	make api call to get author info</div>
<div>	display info</div>
<div>	make api call to get event info</div>
<div>	if there is event info</div>
<div>		display event info</div>
<div>	make movie api call with book title</div>
<div>	display movie info</div>
<div>	display movie poster</div>

<div>function display search area</div>
<div>function dsiplay book area</div>
<div>function display event area</div>
<div>function display author area</div>
<div>function display movie info</div>

<div>function determine is there movie info</div>
<div>function determine is author event null</div>

<div>parse and save ajax response data</div>
<div>	extract the piece we need and save to an array</div>
<div>	repeat for each type of api call</div>


