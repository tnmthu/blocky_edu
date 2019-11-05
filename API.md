# Blocky API !




## Account Register
```json
POST /api/v1/register
with body = JSON
{
	"username" : "myemail@gmail.com",
	"password" : "mypassword", // please use hashed on prod
	"organization" : "aisschool", // optional field
	
	// Will, not now
	"info":
	{
		"fullName" : "",
		"address" : "",
		"birthday" : "",
	}
}
```
If user has already registered and the password is correct
```json
{
	"success" : True,
	"message" : "USER_ALREADY_REGISTERED",
	"data" : "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5Ym1GdFpTSTZJbEp2WW1WeWRDQlNZWGx0YjI1a1FHZHRZV2xzTG1OdmJTSXNJbVY0Y0NJNk1UVTNNelUxT1RFd05Td2lhV0YwSWpveE5UY3lPVFUwTXpBMWZRLndsdFpYZFdnc3Q1bDhNOFdXeFRtYkNZYkducEdTOXlndFNuYmQ2TzJGZDQ=", // JWT Token
	
	// This is for the server to controll the notification
	"toast" : 
	{
		"type" : "success",
		"title" : "You have already registered",
		"text" : "Logging in !"
	}
}
```

If the password is wrong
```json
{
	"success" : False,
	"message" : "WRONG_PASSWORD",
	"data" : "",
	// This is for the server to controll the notification
	"toast" : 
	{
		"type" : "error",
		"title" : "You have already registered",
		"text" : "Wrong password"
	}
}
```
If not registered
```json
{
	"success" : True,
	"message" : "USER_REGISTERED",
	"data" : "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5Ym1GdFpTSTZJbEp2WW1WeWRDQlNZWGx0YjI1a1FHZHRZV2xzTG1OdmJTSXNJbVY0Y0NJNk1UVTNNelUxT1RFd05Td2lhV0YwSWpveE5UY3lPVFUwTXpBMWZRLndsdFpYZFdnc3Q1bDhNOFdXeFRtYkNZYkducEdTOXlndFNuYmQ2TzJGZDQ=", // JWT Token
	
	// This is for the server to controll the notification
	"toast" : 
	{
		"type" : "success",
		"title" : "Welcome !",
		"text" : "Have a good day"
	}
}
```

Save the JWT Token to local storage, use this token for any API call


## Getting the user profile (Admin)

```json
GET : /api/v1/profile
{
	"username" : "myemail@gmail.com",
	"token":"ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5Ym1GdFpTSTZJbEp2WW1WeWRDQlNZWGx0YjI1a1FHZHRZV2xzTG1OdmJTSXNJbVY0Y0NJNk1UVTNNelUxT1RFd05Td2lhV0YwSWpveE5UY3lPVFUwTXpBMWZRLndsdFpYZFdnc3Q1bDhNOFdXeFRtYkNZYkducEdTOXlndFNuYmQ2TzJGZDQ="
}
```
If the token is expired
```json
{
	"success" : False,
	"message" : "WRONG_TOKEN",
	"data" : "", 
	
	// This is for the server to controll the notification
	"toast" : 
	{
		"type" : "error",
		"title" : "Sorry",
		"text" : "Please log in again, your session has expired"
	}
}
```

If success
```json
{
	"success" : True,
	"message" : "USER_LOGGED_IN",
	"data" : 
	{
		"projects" : [ 
			{ 
				"projectName" : "This is my project",
				"owner" : "studentA", 
				"dateCreated" : 1572975838, // Unix Time
				"dateModified" : 1572975900,
				"currentMode"  : "block" or "python",
				"lastModifiedBy" : "studentA",
				// specify that this code is being used
				// by some controller. Appendix A
				"controller" : None or "controllerA",
				"data":{
					"xml" : "XMLSTRUCTURE...",
					"python" : "pythonCode",
					// Advance parameter. Phase 2
					"channelMapping" : {},
			}
			...
		],
		"users" : [
			{
				"username" : "Curly Nguyen",
				"favoriteColour" : "#ff00ff",
				"avatar" : "happy-cat", // use Chrome user avatar
				"lastLoggedIn" : 1572975900,
				"isLoggedIn" : True, //for displaying students status
				"currentController" : None or "controllerA",
				// Phase 2
				"machineInfo": { }
			}, 
			...
		]
	}
	
	// This is for the server to controll the notification
	"toast" : 
	{
		"type" : "success",
		"title" : "Welcome !",
		"text" : "Have a good day"
	}
}
```

## Admin creating access token for students ( just like Kahoot )
```json
GET /api/v1/passport
{
	"username" : "myemail@gmail.com",
	"token"  : "myLongJWTKey...",
	"ttl" : 300 // 5 mins by default
} 
```
If wrong password => like above
If success
```json
{
	"success" : True,
	"message" : "PASSPORT_CREATED",
	"data" : 123909819,
}
// Start the countdown in 5 minutes
```
### Students will use this passport key to create their account !
When they input all 9 digits, call to the server to verify
```json
{
	"passport" : 123909819
}
```
If not correct
```json
{
	"success" : False,
	"message" : "PASSPORT_INCORRECT",
	"data" : ""
}
```
If correct : 
```json
{
	"succes" : True,
	"message" : "PASSPORT_CORRECT",
	"data" : "TEMPORARY_JWT_KEY"
}
```
Save the temporary jwt key, this will expire soon 
Show another dialog, where user can input their name ( must ) and email,password (optional)
Send those input back to the server

```json
POST : /api/v1/passport
{
	"username" : "Trung Nguyen",
	"email" : "curly@gmail.com",
	"password"  : "mypassword"
}
```
```json
{
	"success" : True,
	"message" : "LOCAL_JWT_CREATED",
	"data" : "myJWTToken",
}
// Save this token to the localStorage
```
The idea is that students don't need to log in if they register using the same machine
If they aren't , they can log in using email and password, if they have registered that too.

In case name has already taken: TODO
In case email has already taken: TODO



# Students getting the profile.
### Using the localStorage 
```json
GET /api/v1/profile
{
	"token" : "myJWTToken"
}
// return the same thing as above ( Admin )
```

### Using email and password
```json
GET /api/v1/profile
{
	"email" : "myEmail@gmail.com",
	"password" : "alita"
}
// This will return the JWT token, then do the above step to get the profile
```

# Device
Idea : 
1. when the students has selected a controller, other students can't
2. when the students selected another controller, call the api

### Notify the server about student selecting a controller
```json
UPDATE /api/v1/device
{
	"token" : "myJWTToken",
	"controller" : "controllerA"
}
```
When user clicked on the controller dropdown list, pull the profile to know if the controller is being used by anyone !

# Project
### Saving Project
```json
POST /api/v1/project
{
	"token": "myJWTToken",
	"
```