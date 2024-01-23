const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

let apiEvent = {};

exports.handler = async (event, context) => {
  try {
    console.log(event);
    const accessToken = JSON.parse(event.body);
    console.log(accessToken);

    let mainResponse = await main(accessToken);
    mainResponse["Status"] = "OK";
    mainResponse["Message"] =
      "Soweit wissen wir nicht was schief gegangen ist, sollte man vielleicht mal ändern";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mainResponse),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const main = async (accessToken) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    async function fetchgoogledata(accessToken) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
        );
        console.log(response);
        const data = await response.json();
        console.log("Google Data:", data);
        return data;
      } catch (error) {
        console.error("Fehler beim Abrufen von Google-Benutzerdaten.");
        console.log(error);
        return null;
      }
    }

    let ed = await fetchgoogledata(accessToken);
    let frontendantwort = {};

    const newSessionUUID = uuidv4();
    frontendantwort["sessionData"] = newSessionUUID;

    try {
      const [session] = await sequelize.query(`
      INSERT INTO Session (UUID, Name) 
      VALUES ('${newSessionUUID}', '${ed.name}')
    `);
    } catch (error) {
      console.log("Derzeit noch kein Session Management");
      console.log(error);
      // console.log("Session bereits vorhanden");
    }

    try {
      const [existingUser, _] = await sequelize.query(`
      SELECT * FROM User WHERE UserID = '${ed.id}'
    `);
    } catch (error) {
      console.log("Error at Finde User in DB");
    }

    if (existingUser.length > 0) {
      console.log("User vorhanden");
      frontendantwort["isNewUser"] = false;
    } else {
      frontendantwort["isNewUser"] = true;
      try {
        await sequelize.query(`
        INSERT INTO User (UserID, RealName, EmailAddress, BirthDate, Course, AuthProvider, ProfileImg)
        VALUES ('${ed.id}', '${ed.name}', '${ed.email}', null, null, null, '${ed.picture}')
        ON DUPLICATE KEY UPDATE
        UserID = VALUES(UserID),
        EmailAddress = VALUES(EmailAddress),
        RealName = VALUES(RealName),
        BirthDate = VALUES(BirthDate),
        Course = VALUES(Course),
        AuthProvider = VALUES(AuthProvider),
        ProfileImg = VALUES(ProfileImg);
      `);
      } catch (error) {
        console.log("Error at Insert User in DB");
        console.log(error);
      }

      console.log("Neuer Eintrag in der Datenbank erstellt");
    }
    // const [results, metadata] = await sequelize.query("SELECT * FROM User");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  return frontendantwort;
};
