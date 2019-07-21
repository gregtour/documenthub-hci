# Document Hub

This is a prototype user interface for locating documents when working with multiple large teams. The interface was developed for an assignment in *Intro to Human-Computer Interaction* at Georgia Tech, available for free on Udacity [here](https://www.udacity.com/course/human-computer-interaction--ud400). The course is a great introduction to the fundamentals of HCI.

## Abstract

Abstract—​Today's office workers deal with a number of digital documents which they must share with team members as a part of their job. The task of managing and sharing documents is an important part of office work. By looking at existing interfaces and engaging in user centered design, we can improve the interface for this task.

## Interface

The timeline prototype allows a user to locate documents based on when they were created, shared, and edited by the user and by collaborators. The timeline prototype allows the user to view or hide entries by filtering for those action types and by relevance to themselves or collaborators. The timeline prototype also allows the user to use a keyword search to prune the results.


The control condition will be an interface that lists all events including created documents, shared documents, and edited documents by all users. The interface will not allow the user to filter based on types of timeline events or the relevance. The interface will still allow the user to use a keyword search.

## Nature of the Study

Subjects will be directed to perform three similar tasks on a new user interface. Each task will be a successive trial of locating a file using the user interface, with slightly different prompting. The file name and data will change for each trial. While the user is performing the task, they will be timed to see how long it takes them to complete the task. The experiment will be conducted as a between-subjects test, so each subject will randomly be given one of the two interfaces to use.

## Implementation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The frontend is a monolithic web app written with React JS. The user interface is defined in src/App.js and src/App.css while the business logic exists in src/Store.js

The application data that is used in the randomly generated and the article contents are pulled from Wikipedia. The scripts for generating random data are in the util/ directory.

The backend is a ten line PHP program that receives data sent from the client and appends it to a file.

