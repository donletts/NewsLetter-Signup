const express = require ( "express" );
const bodyParser = require ( "body-parser" );
const https = require ( "https" );
const request = require ( "request" );

const app = express ();
const port = 3000;

app.use ( bodyParser.urlencoded ( {extended: true} ) );
app.use ( express.static ( "public" ) );

app.get ( "/", function (req, res) {
    res.sendFile ( __dirname + "/signup.html" );
} );

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.post ( "/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;

    console.log ( firstName, lastName, emailAddress );

    var data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var payload = JSON.stringify ( data );
    console.log ( payload );
// Mail Chimp API Key
    var apiKey = "dbce63a2869ea61106b9d08a14923b98-us19";

// Mail Chimp member id
    var memberId = "_c696f91c47";
    var apiEndpoint = "https://us19.api.mailchimp.com/3.0/lists/" + memberId;
    const httpOptions = {
        method: "POST",
        auth: "authId:" + apiKey
    };
    const request = https.request ( apiEndpoint, httpOptions, function (response) {

        var status = response.statusCode;

        if(status === 200){
            res.sendFile(__dirname + "/success.html");
            // res.send("Successfully subscribed");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
            // res.send("there was an error signing up, please try again");
        }

        response.on("data", function(data){

        });
    } );

    request.write(payload);
    request.end();
} );

app.listen ( process.env.PORT || port, function () {
    console.log ( "server started on port " + port );
} );
