const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

//this line is required to parse the request body
app.use(cors());
app.use(express.json());


/* Create - POST method */
app.post('/user/add', (req, res) => {
    //get the existing user data
    const userDataFromJson = getDataFromJson();

    //get the new user data from post request
    const userData = req.body;

    //check if the userData fields are missing
    if (
        userData.first_name == null ||
        userData.last_name == null ||
        userData.email == null
    ) {
        return res.status(401).send({ error: true, msg: 'User data missing' });
    }

    //check if the username exist already
    const findExist = userDataFromJson.find(
        (user) => user.email === userData.email
    );
    if (findExist) {
        return res.status(409).send({
            error: true,
            msg: `User already exist with this email! `,
        });
    }

    //append the user data
    userDataFromJson.push(userData);

    //save the new user data
    storeDataInJson(userDataFromJson);
    res.send({ success: true, msg: 'User data added successfully' });
});

/* Read - GET method */
app.get('/user/list', (req, res) => {
    const users = getDataFromJson();
    res.send(users);
});

/* Update - Patch method */
app.patch('/user/update/:email', (req, res) => {
    //get the username from url
    const email = req.params.email;

    //get the update data
    const userData = req.body;

    //get the existing user data
    const userDataFromJson = getDataFromJson();

    //check if the username exist or not
    const findExist = userDataFromJson.find((user) => user.email === email);

    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'email not exist' });
    }

    //filter the userdata
    const updateUser = userDataFromJson.filter((user) => user.email !== email);

    //push the updated data
    updateUser.push(userData);

    //finally save it
    storeDataInJson(updateUser);

    res.send({ success: true, msg: 'User data updated successfully' });
});

/* Delete - Delete method */
app.delete('/user/delete/:email', (req, res) => {
    const email = req.params.email;

    //get the existing userdata
    const userDataFromJson = getDataFromJson();

    //filter the userdata to remove it
    const filterUser = userDataFromJson.filter((user) => user.email !== email);

    if (userDataFromJson.length === filterUser.length) {
        return res.status(409).send({ error: true, msg: 'email does not exist' });
    }

    //save the filtered data
    storeDataInJson(filterUser);

    res.send({ success: true, msg: 'User removed successfully' });
});

/* util functions */

//read the user data from json file
const storeDataInJson = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync('users.json', stringifyData);
};

//get the user data from json file
const getDataFromJson = () => {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData);
};

/* util functions ends */

//configure the server port
app.listen(8001, () => {
    console.log('Server runs on port 8001');
});