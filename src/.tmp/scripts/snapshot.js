const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

class Database {
    static ConnectToMongoDB () {
        const MONGODB_URI = 'mongodb://localhost:27017/';
        const MONGODB_DB_MAIN = 'users_db';
        const MONGO_URI = `${MONGODB_URI}${MONGODB_DB_MAIN}`;

        const connectOptions = {
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        return mongoose.createConnection(MONGO_URI, connectOptions);
    }
}

class SchemaMongoDb {
    static connectToSchema() {
        const connection = Database.ConnectToMongoDB();

        const UserSchema = new Schema(
            {
                fullName: {
                    type: String,
                    trim: true,
                },
                email: {
                    type: String,
                    required: true,
                },
            },
            {
                collection: 'grabbingusers',
                versionKey: false,
            },
        );
        return connection.model('grabbingusers', UserSchema);
    }
} 

const saveUserData = (users) => {
    const UserModel = SchemaMongoDb.connectToSchema();
    for (const user of users) {
        UserModel.create(user);
    }
};

const grabbingUserData = () => {
    const grabFromRow = (row, classname) => row
        .querySelector(`td.${classname}`)
        .innerText
        .trim()

    const USERS_ROW_SELECTOR = `tr.user`;

    const data = [];

    const usersRows = document.querySelectorAll(USERS_ROW_SELECTOR);

    for(const tr of usersRows) {
        data.push({
            fullName : grabFromRow(tr, 'fullName'),
            email: grabFromRow(tr, 'email'),
        });
    }
    return data;
};


void (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/v1/users');
    await page.screenshot({ path: 'screenshot.png' });

    // grabbing emails
    const users = await page.evaluate(grabbingUserData);
    await saveUserData(users);

    //console.log(JSON.stringify(users, null, 2));
      
    await browser.close();
})();

    



