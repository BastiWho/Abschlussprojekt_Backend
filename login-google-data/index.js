const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/*global fetch*/
exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log(body);
    const googleUserData = body;
    const antwortFrontend = {
        status: "ok",
        message: "",
        steps: {}
    };

    console.log("################# DATABASE PART #################");
    console.log("Connecting to database...");
    const sequelize = new Sequelize({
        dialect: process.env.TSNET_DB_DIALECT,
        host: process.env.TSNET_DB_HOST,
        database: process.env.TSNET_DB_DATABASE,
        port: process.env.TSNET_DB_PORT,
        username: process.env.TSNET_DB_USER,
        password: process.env.TSNET_DB_PASSWORD
    });

    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.log("Error at Sequelize");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.database = JSON.stringify(error);
        console.error("Unable to connect to the database:", error);
    }

    const newSessionUUID = uuidv4();
    antwortFrontend["sessionData"] = newSessionUUID;
    try {
        const [session, _] = await sequelize.query(`
                INSERT INTO Session (UUID, Name, Token, CreatedAt, UpdatedAt)
                VALUES ('${newSessionUUID}', '${googleUserData.name}', '${googleUserData.token}', '${new Date().toISOString()}', '${new Date().toISOString()}' )
                `);
        antwortFrontend.steps.session = "ok";
    } catch (error) {
        console.log("Derzeit noch kein Session Management");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.session = JSON.stringify(error);
    }
    try {
        const [existingUser, _] = await sequelize.query(` SELECT * FROM User WHERE GoogleUserID = '${googleUserData.id}' `);
        antwortFrontend.steps.existingUser = "ok";
    } catch (error) {
        console.log("Error at Finde User in DB");
        antwortFrontend.status = "error";
        antwortFrontend.steps.existingUser = JSON.stringify(error);
    }

    if (existingUser.length > 0) {
        antwortFrontend.isNewUser = false;
    } else {
        antwortFrontend.isNewUser = true;
        try {
            const [insertUser, _] = await sequelize.query(`
                    INSERT INTO User (UserID, GoogleID, RealName, EmailAddress, BirthDate, Course, AuthProvider, ProfileImg)
                    VALUES ('${sequelize.uuidv4}', '${googleUserData.id}', '${googleUserData.name}', '${googleUserData.email}', null, null, "google", '${googleUserData.picture}')
                `);
            antwortFrontend.steps.insertUser = "ok";
            antwortFrontend.steps.insertUserMessage = JSON.stringify(insertUser);
        } catch (error) {
            antwortFrontend.status = "error";
            antwortFrontend.steps.insertUser = JSON.stringify(error);
        }
    }
    console.log("################# Antwort an Frontend #################");
    console.log(antwortFrontend);

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(antwortFrontend),
    };
};