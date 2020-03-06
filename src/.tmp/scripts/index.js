require('dotenv').config({path: `${__dirname}/.env`})
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const puppeteer = require('puppeteer');
const fetch = require('isomorphic-fetch'); 
const Dropbox = require('dropbox').Dropbox;
const gm = require('gm').subClass({graphicsmagick: true});
const dbx = new Dropbox({ accessToken: process.env['API_TOKEN'], fetch: fetch });

class Database {
    static ConnectToMongoDB () {
        const MONGODB_URI = 'mongodb://localhost:27017/';
        const MONGODB_DB_MAIN = 'usersdb';
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
    static connectToUserSchema() {
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

    static connectToLinkSchema() {
        const connection = Database.ConnectToMongoDB();

        const LinkSchema = new Schema(
            {
                link: {
                    type: String
                }
            },
            {
                collection: 'screenshots',
                versionKey: false,
            },
        );
        return connection.model('screenshots', LinkSchema);
    }
}

// Grabbing user data
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

const saveUserData = async (users) => {
    const UserModel = SchemaMongoDb.connectToUserSchema();
    for (const user of users) {
        await UserModel.create(user);
    }
};

// Make and save screenshots
const uploadSchreenshot = (file, time) => {
    // FIX: wrong format for gm
    /*gm(file)
        .quality(1)
        .write(file, function (err) {
            if (err) console.error(err);
        });*/

    dbx.filesUpload({ path: `/${time}.png`, contents: file });
};

const saveLinkData = (time) => {
    const LinkModel = SchemaMongoDb.connectToLinkSchema();

    return dbx.sharingCreateSharedLink({
        path: `/${time}.png`,
    })
        .then((PathLinkMetadata) => {
            return LinkModel.create({ link: PathLinkMetadata.url });
        });
};

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('http://localhost:3000/v1/users');

        // grabbing emails
        const users = await page.evaluate(grabbingUserData);
        await saveUserData(users);

        // upload screenshot
        const file = await page.screenshot({ type: 'png' , encoding: 'buffer'});
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        await uploadSchreenshot(file, time);
        await saveLinkData(time);

        await browser.close();

    } catch (err) {
        console.error(err);
    }  
})();

    



