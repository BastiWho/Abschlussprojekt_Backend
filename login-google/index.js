const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

let apiEvent = {};

exports.handler = async (event, context) => {
  console.log(event);
  const body = JSON.parse(event.body);
  console.log(body.accessToken);
  const accessToken = body.accessToken;

  console.log("Fetching Google-Data");
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
  // let data;
  try {
    const fetch1 = await fetch(url);
    console.log("################# FETCH1 #################");
    console.log(fetch1);
  } catch (error) {
    console.log("Error:");
    console.log(error);
  }
  // .then((response) => {
  //   console.log("Response:");
  //   data = response;
  //   console.log(response);
  // })
  // .catch((error) => {
  //   console.log("Error:");
  //   console.log(error);
  // });
  const url2 = `https://www.googleapis.com/oauth2/v3/tokeninfo?`;
  try {
    const fetch2 = await fetch("https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("################# FETCH2 #################");
    console.log(fetch2);
  } catch (error) {
    console.log("Error:");
    console.log(error);
  }
  // data = await data.json();
  // const data = await response.json();
  // console.log("Google Data:");
  // console.log(data);
  // let ed = await fetchgoogledata(accessToken);
  // console.log(ed);
  // let mainResponse = await main(accessToken);
  // mainResponse["Status"] = "OK";
  // mainResponse["Message"] = "Soweit wissen wir nicht was schief gegangen ist, sollte man vielleicht mal ändern";
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
// const sequelize = new Sequelize({
//   dialect: process.env.TSNET_DB_DIALECT,
//   host: process.env.TSNET_DB_HOST,
//   database: process.env.TSNET_DB_DATABASE,
//   port: process.env.TSNET_DB_PORT,
//   username: process.env.TSNET_DB_USER,
//   password: process.env.TSNET_DB_PASSWORD,
// });

// const main = async (accessToken) => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");

//     let frontendantwort = {};

//     const newSessionUUID = uuidv4();
//     frontendantwort["sessionData"] = newSessionUUID;

//     try {
//       const [session] = await sequelize.query(`
//       INSERT INTO Session (UUID, Name) 
//       VALUES ('${newSessionUUID}', '${ed.name}')
//     `);
//     } catch (error) {
//       console.log("Derzeit noch kein Session Management");
//       console.log(error);
//       // console.log("Session bereits vorhanden");
//     }

//     try {
//       const [existingUser, _] = await sequelize.query(`
//       SELECT * FROM User WHERE UserID = '${ed.id}'
//     `);
//     } catch (error) {
//       console.log("Error at Finde User in DB");
//     }

//     if (existingUser.length > 0) {
//       console.log("User vorhanden");
//       frontendantwort["isNewUser"] = false;
//     } else {
//       frontendantwort["isNewUser"] = true;
//       try {
//         await sequelize.query(`
//         INSERT INTO User (UserID, RealName, EmailAddress, BirthDate, Course, AuthProvider, ProfileImg)
//         VALUES ('${ed.id}', '${ed.name}', '${ed.email}', null, null, null, '${ed.picture}')
//         ON DUPLICATE KEY UPDATE
//         UserID = VALUES(UserID),
//         EmailAddress = VALUES(EmailAddress),
//         RealName = VALUES(RealName),
//         BirthDate = VALUES(BirthDate),
//         Course = VALUES(Course),
//         AuthProvider = VALUES(AuthProvider),
//         ProfileImg = VALUES(ProfileImg);
//       `);
//       } catch (error) {
//         console.log("Error at Insert User in DB");
//         console.log(error);
//       }

//       console.log("Neuer Eintrag in der Datenbank erstellt");
//     }
//     // const [results, metadata] = await sequelize.query("SELECT * FROM User");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
//   return frontendantwort;
// };
