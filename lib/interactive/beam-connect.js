const {ipcMain} = require('electron')
const {BrowserWindow} = require('electron')
const Beam = require('beam-client-node');
const beam = new Beam();
const Interactive = require('beam-interactive-node');
const JsonDB = require('node-json-db');

const reportHandler = require('./controls-router.js');

const dbAuth = new JsonDB("./user-settings/auth", true, false);

// Global Vars
const clientId = "f78304ba46861ddc7a8c1fb3706e997c3945ef275d7618a9";

// Connects to interactive
function beamConnect(event) {

    var channelId = dbAuth.getData('/streamer/channelID');
    var authToken = dbAuth.getData('/streamer/token');

    beam.use('oauth', {
        clientId: clientId,
        tokens: {
            access: authToken,
            expires: Date.now() + 365 * 24 * 60 * 60 * 1000
        }
    })
    beam.game.join(channelId)
        .then(res => createRobot(res, channelId))
        .then(robot => performRobotHandShake(robot))
        .then(robot => setupRobotEvents(robot,event))
        .catch(err => {
            if (err.res) {
                throw new Error('Error connecting to Interactive:' + err.res.body.message);
            }
            throw err;
        });
};

// Creating Robot
function createRobot(res, channelId) {
    console.log('Creating robot...')
    return new Interactive.Robot({
        remote: res.body.address,
        channel: channelId,
        key: res.body.key,
        debug: true
    });
};

// Robot Handshake
function performRobotHandShake(robot) {
    console.log('Robot Handshaking...');
    return new Promise((resolve, reject) => {
        robot.handshake(err => {
            if (err) {
                reject(err);
            }
            resolve(robot);
        });
    });
};

// Robot Events
function setupRobotEvents(robot,event) {
    console.log("Good news everyone! Interactive is ready to go!");
    robot.on('report', report => {
        reportHandler.reportHandler(report);
    });
    robot.on('error', err => {
        console.log('Error setting up robot events.', err);
    });

    global.robot = robot;

    // Send to UI
    event.sender.send('beamInteractive', 'connected');
};

// Beam Disconnect
function beamDisconnect(event){
    if(global.robot !== null){
        // Disconnect from interactive
        global.robot.close();
        // Send to UI
        event.sender.send('beamInteractive', 'disconnected');
    }
};



// Interactive Toggle
// Controls Turning on and off interactive when connection button is pressed.
ipcMain.on('beamInteractive', function(event, status) {
    if(status == "connect" || status == "connected"){
        beamConnect(event);
    } else {
        beamDisconnect(event);
    }
});