# BetaOverflow
***

Here is a live version of BetaOverflow: https://beta-overflow.onrender.com

BetaOverflow is a replica of the StackOverflow application that is intended to be used to post questions/responses for everything rock climbing. The backend of the application is built on Python3 and Flask with a PostgreSQL database. The frontend is structured on React/Redux for creating a normalized, global state.

## Features & Implementation
***

### Single-Page App

#### React Router and Components

* BetaOverflow is a single page app with each page rendered at "/". The React router ensures that the applications components are reached by adding paths to the root route.

#### Frontend and Backend Interaction

* The data from the backend is retrieved by reaching an api endpoint. The data retrieved from the backend path is then hydrated in the Redux state, which is accessible from the frontend framework. The information passed from backend to frontend allows for secure, normalized, and efficient rendering.

### Authentication


* Users are required to signup or login to be authenticated. The application uses Flask built-in methods to inject a csrf-token into cookies and ensure that the user is authenticated before navigating to pages requiring authentication.

#### All Questions Page/Landing Page

* The All Questions page displays every question in a paginated format and is limited to 10 questions per page. We leverage the questions slice of state to render all questions and utilize the "all_questions" route handler to paginate and hydrate data to the state variable. When a user is logged-in a side bar menu will give options for the user to view their own questions/comments.

#### User Questions Page
* The User Questions page displays a current user's questions in a paginated format and is limited to 5 questions per page. We implement the questions state variable to render a user's question and utilize the "get_user_questions" route handler to paginate and hydrate data to the state variable.

* A user is able to edit and delete a question by clicking on the "update" or "delete" buttons, respectively. The update button leverages the "update_question" route handler to query a question and allow a user to update their question using a rich text editor. The delete button uses the "delete_question" route handler to query and delete a specified question.

#### User Comments Page
* The User Comments Page displays a current user's comments in a paginated format and is limited to 5 comments per page. We implement the comments state variable to render a user's comments and utilize the "get_user_comments" route handler to paginate and hydrate data to the state variable.

* A user is able to edit and delete a comment by clicking on the "update" or "delete" buttons, respectively. The update button leverages the "update_comment" route handler to query a comment and allows a user to update their comment using a rich text editor. The delete button uses the "delete_comment" route handler to query and delete a specified comment.

#### Selected Question Page
* When a user selects a question, the user will be able to view all comments associated with a question. A logged-in user will be able to create a comment on the selected question using a rich text editor that creates HTML tags for styling markdown. The "parse" library is then used to properly render the html elements in an easily readable format.

#### Question List Page
* A user is able to query for question titles using the search tool located in the navigation header. When a user submits a query, they are redirected to the Question List Page, which will display all results that match the query. The search functionality involves filtering the "questions" state variable using the "query" slice of state, which will then return matched results. There is a limit to 5 results per page, and further results are paginated to boost user experience.
