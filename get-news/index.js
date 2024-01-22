const Sequelize = require("sequelize");

let apiEvent = {};

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    apiEvent = {
      version: "2.0",
      routeKey: "GET /newsfeed",
      postData: {
        postid: data.postData.postid,
        id: data.userData.id,
        time: data.userData.time,
        content: data.userData.content,   
        media: data.userData.media,
      },
      isBase64Encoded: true,
    };

    await main();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "PostData processed", apiEvent }),
    };
  } catch (error) {
    console.error(error);
    event.status(500).send("Error processing request");
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

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const ed = apiEvent.userData;

    const [existingUser, _] = await sequelize.query(`
      SELECT * FROM Post WHERE PostID = '${ed.postid}'
    `);

    if (existingUser.length > 0) {
      console.log("Post vorhanden");
    } else {
      await sequelize.query(`
        INSERT INTO User (PostID, UserID, TimeAndDate, Content, MediaLink)
        VALUES ('${ed.postid}', '${ed.id}', '${ed.time}', '${ed.content}', '${ed.media}')
        ON DUPLICATE KEY UPDATE
          PostID = VALUES(PostID),
          UserID = VALUES(UserID),
          TimeAndDate = VALUES(TimeAndDate),
          Content = VALUES(Content),
          MediaLink = VALUES(MediaLink)
      `);

      console.log("Post vorhanden.");
    }

    const [results, metadata] = await sequelize.query("SELECT * FROM Post");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
