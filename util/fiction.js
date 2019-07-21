/*
	Create a database of fiction documents. 
*/
const fs = require('fs');

const teams = {
	"Products": {
		"members": ["Ed", "Jacqueline", "Chuck"],
		"docs": [
			"List of SAP products", 
			"List of IBM products", 
			"List of Canon products",
			"Timeline of Apple Inc. products",
			"List of Motorola products",
		 	"LTE (telecommunication)", 
		 	"List of Skittles products",
		 	"List of cleaning products",
		 	"Consumer electronics", 
		 	"National Science Foundation Network",
		 	"List of multiple-system operators",
		 ]
	},
	"Accounts": {
		"members": ["Susan", "Tony", "Jose", ],
		"docs": [
			"List of cities in North America", 
			"List of metropolitan areas by population", 
			"Western United States", 
			"Southern United States", 
			"Eastern United States", 
			"Beachamwell", 
			"Norfolk, Virginia",
		]
	},
	"Research": {
		"members": ["me", "Emma", "Tim", "Mary", "Matthew"],
		"docs": [
			"Automotive industry in the United_States", 
			"Electric car", 
			"Big-box store", 
			"Music of Oregon", 
			"Greenhouse gas emissions", 
			"Carbon dioxide", 
			"Atmosphere of Earth", 
			"Rayleigh scattering",
			"List of mobile network operators",

		]
	},
	"Support": {
		"members": ["Steve", "Taylor", "Oliver"],
		"docs": [
			"ISO 19011", 
			"ISO 9000", 
			"Quality management system", 
			"Customer support", 
			"Customer service", 
			"Customer satisfaction research", 
			"Customer satisfaction",
			"List of Charvet customers",
			"Most valuable customers",
		]
	}
}

const wiki = require('wikijs').default;

let docsList = [];
let docsContent = {};


function savefile() 
{
	let contents = JSON.stringify(docsContent, undefined, 4);
	let utc = new Date().getTime();
	fs.writeFileSync(`sample-${utc}.json`, contents);
}

for (let teamName in teams)
{
	let team = teams[teamName];
	docsList = docsList.concat(team.docs);
}

let queries = [];
for (let idx in docsList) 
{
	let docName = docsList[idx];
	queries.push(
		wiki().page(docName)
			.then((page) => page.summary())
			.then((content) => { docsContent[docName] = content; })
			.catch((err) => console.log(docName + " failed with " + err))
	);
}

Promise.all(queries)
	.then((res) => { savefile() })
	.catch((err) => console.log("Failed to query all: " + err))

//allDocs[0];

