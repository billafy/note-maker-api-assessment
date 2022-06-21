# Note Maker API
Built with Express.js

Steps to run:-

	1. Install Node.js.
	2. Replace the environment variables value in .env.example and rename the file to .env
	3. Run 'npm install'.
	4. Run 'npm start'.

API Routes:-

	POST /auth/login - {username:String, password:String} - Logs in the user

	PUT /auth/refresh - refreshes the user session

	DELETE /auth/logout - Log the user and delete current session

	GET /notes?tag1=tag&tag2=tag - Get all notes which match to the optional tags passed as query parameters

	POST /notes - {title:String, body:String, tags:Array} - Create a new note

	PUT /notes/:_id - {title:String, body:String, tags:Array} - Update the note with id as passed _id

	DELETE /notes/:_id - Delete the note with id as passed _id