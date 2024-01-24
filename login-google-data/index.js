const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/*global fetch*/
exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log(body);
    const antwortFrontend = {
        status: "ok",
        message: "",
        steps: {}
    };

    let googleUserData = {};
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
    console.log(sequelize);
    // }
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.log("Error at Sequelize");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.database = error;
        console.error("Unable to connect to the database:", error);
    }

    const newSessionUUID = uuidv4();
    antwortFrontend["sessionData"] = newSessionUUID;
    try {
        const [session, _] = await sequelize.query(`
                INSERT INTO Session (UUID, Name)
                VALUES ('${newSessionUUID}', '${googleUserData.name}')
                `);
        antwortFrontend.steps.session = "ok";
    } catch (error) {
        console.log("Derzeit noch kein Session Management");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.session = error;
    }
    try {
        const [existingUser, _] = await sequelize.query(`
                SELECT * FROM User WHERE UserID = '${googleUserData.id}'
                `);
        antwortFrontend.steps.existingUser = "ok";
    } catch (error) {
        console.log("Error at Finde User in DB");
        antwortFrontend.status = "error";
        antwortFrontend.steps.existingUser = error;
    }

    if (existingUser.length > 0) {
        antwortFrontend.isNewUser = false;
    } else {
        antwortFrontend.isNewUser = true;
        try {
            const [insertUser, _] = await sequelize.query(`
                    INSERT INTO User (UserID, RealName, EmailAddress, BirthDate, Course, AuthProvider, ProfileImg)
                    VALUES ('${googleUserData.id}', '${googleUserData.name}', '${googleUserData.email}', null, null, null, '${googleUserData.picture}')
                    ON DUPLICATE KEY UPDATE
                    UserID = VALUES(UserID),
                    EmailAddress = VALUES(EmailAddress),
                    RealName = VALUES(RealName),
                    BirthDate = VALUES(BirthDate),
                    Course = VALUES(Course),
                    AuthProvider = VALUES(AuthProvider),
                    ProfileImg = VALUES(ProfileImg);
                `);
            antwortFrontend.steps.insertUser = "ok";
            antwortFrontend.steps.insertUserMessage = JSON.stringify(insertUser);
        } catch (error) {
            antwortFrontend.status = "error";
            antwortFrontend.steps.insertUser = error;
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