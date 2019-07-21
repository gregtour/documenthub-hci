//generator.js
const fs = require('fs');

let teams = fs.readFileSync('teams.json');
let content = fs.readFileSync('content.json');

teams = JSON.parse(teams);
content = JSON.parse(content);

let TEAM_NAMES = [];

for (let key in teams) {
	if (teams.hasOwnProperty(key)) TEAM_NAMES.push(key);
}

function otherTeam(team) {
	let num = Math.random() * (TEAM_NAMES.length - 1) | 0;
	let offs = TEAM_NAMES.indexOf(team);
	return TEAM_NAMES[(offs + num + 1) % TEAM_NAMES.length];
}

function someUser(team) {
	return teams[team].members[Math.random() * teams[team].members.length | 0]
}

let allEvents = [];

for (let T of TEAM_NAMES)
{
	let docs = teams[T].docs;
	for (let D of docs) 
	{
		let createTime = Math.random() * 1000 | 0;
		let sharedTime = {};

		let docEvents = [{
			"type": "created",
			"team": T,
			"user": someUser(T),
			"doc": D,
			"time": createTime
		}];

		let count = 3 + Math.random() * 5 | 0;
		while (count--) 
		{
			if (Math.random() < 0.75) {
				let user = 
				docEvents.push({
					"type": "edited",
					"team": T,
					"user": someUser(T),
					"doc": D,
					"time": createTime + Math.random() * 1000 | 0
				})
			} else {
				let other = otherTeam(T);
				if (sharedTime[other]) {
					docEvents.push({
						"type": "edited",
						"team": other,
						"user": someUser(other),
						"doc": D,
						"time": sharedTime[other] + Math.random() * 1000 | 0
					})
				} else {
					sharedTime[other] = createTime + Math.random() * 1000 | 0;
					docEvents.push({
						"type": "shared",
						"team": T,
						"user": someUser(T),
						"with": other,
						"doc": D,
						"time": sharedTime[other]
					})
				}
			}
		}

		allEvents = allEvents.concat(docEvents);
	}
}


allEvents.sort((a, b) => a.time - b.time);
let maxTime = 0;
for (let e of allEvents) {
	if (e.time > maxTime) maxTime = e.time;
}

for (let e of allEvents) {
	let today = new Date();
	let daysAgo = (e.time - maxTime) / 10;
	let millis = today.getTime();
	let timeAgo = millis + 1000 * 60 * 60 * 24 * daysAgo;
	e.time = new Date(timeAgo)
}

console.log(allEvents.length);

let eventsStr = JSON.stringify(allEvents, undefined, 4);

fs.writeFileSync('events.json', eventsStr);
