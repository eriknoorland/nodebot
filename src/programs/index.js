const backAndForth = require('./backAndForth');
const superSlalom = require('./superSlalom');
const lineFollower = require('./lineFollower');
const tTime = require('./tTime');
const cans = require('./cans');

const testRemote = require('./test/remote');
const testDistance = require('./test/distance');
const testHeading = require('./test/heading');
const testHeadingCorrection = require('./test/headingCorrection');
const testRotation = require('./test/rotation');
const testStraightLine = require('./test/straightLine');
const testLidarAlignment = require('./test/lidarAlignment');
const testImuOdometryWithLine = require('./test/imuOdomLine');
const testUMBMark = require('./test/umbMark');
const testStartVector = require('./test/startVector');
const testStartPosition = require('./test/startPosition');
const testVerifyRotation = require('./test/verifyRotation');
const testVerifyPosition = require('./test/verifyPosition');
const testPickupCan = require('./test/pickupCan');
const testCanDetection = require('./test/canDetection');
const testICP = require('./test/icp');

const testPrograms = [
  { name: '--', module: null },
  { name: '[Test] Remote', module: testRemote() },
  { name: '[Test] Rechtuit 1m', module: testDistance(1000) },
  { name: '[Test] Rechtuit 2m', module: testDistance(2000) },
  { name: '[Test] Rechtuit 3m', module: testDistance(3000) },
  { name: '[Test] Rechtuit 4m', module: testDistance(4000) },
  { name: '[Test] Heading 1m', module: testHeading(1000) },
  { name: '[Test] Heading 2m', module: testHeading(2000) },
  { name: '[Test] Heading 3m', module: testHeading(3000) },
  { name: '[Test] Heading correctie 1m', module: testHeadingCorrection(1000) },
  { name: '[Test] Heading correctie 2m', module: testHeadingCorrection(2000) },
  { name: '[Test] Heading correctie 3m', module: testHeadingCorrection(3000) },
  { name: '[Test] Draai 1x rond CW', module: testRotation(1) },
  { name: '[Test] Draai 5x rond CW', module: testRotation(5) },
  { name: '[Test] Draai 10x rond CW', module: testRotation(10) },
  { name: '[Test] Draai 1x rond CCW', module: testRotation(-1) },
  { name: '[Test] Draai 5x rond CCW', module: testRotation(-5) },
  { name: '[Test] Draai 10x rond CCW', module: testRotation(-10) },
  { name: '[Test] Heen & weer 1m CW', module: testStraightLine(1000) },
  { name: '[Test] Heen & weer 2m CW', module: testStraightLine(2000) },
  { name: '[Test] Heen & weer 3m CW', module: testStraightLine(3000) },
  { name: '[Test] Heen & weer 4m CW', module: testStraightLine(4000) },
  { name: '[Test] Heen & weer 1m CCW', module: testStraightLine(1000, -1) },
  { name: '[Test] Heen & weer 2m CCW', module: testStraightLine(2000, -1) },
  { name: '[Test] Heen & weer 3m CCW', module: testStraightLine(3000, -1) },
  { name: '[Test] Heen & weer 4m CCW', module: testStraightLine(4000, -1) },
  { name: '[Test] IMU odometry with linefollow track', module: testImuOdometryWithLine() },
  { name: '[Test] UMBMark 1m CW', module: testUMBMark(1000) },
  { name: '[Test] UMBMark 2m CW', module: testUMBMark(2000) },
  { name: '[Test] UMBMark 3m CW', module: testUMBMark(3000) },
  { name: '[Test] UMBMark 4m CW', module: testUMBMark(4000) },
  { name: '[Test] UMBMark 1m CCW', module: testUMBMark(1000, -1) },
  { name: '[Test] UMBMark 2m CCW', module: testUMBMark(2000, -1) },
  { name: '[Test] UMBMark 3m CCW', module: testUMBMark(3000, -1) },
  { name: '[Test] UMBMark 4m CCW', module: testUMBMark(4000, -1) },
  { name: '[Test] Lidar alignment', module: testLidarAlignment() },
  { name: '[Test] Start vector', module: testStartVector() },
  { name: '[Test] Start position', module: testStartPosition() },
  { name: '[Test] Start position - 300', module: testStartPosition(-300) },
  { name: '[Test] Start position + 300', module: testStartPosition(300) },
  { name: '[Test] Verifieër rotatie rechts', module: testVerifyRotation(90) },
  { name: '[Test] Verifieër rotatie links', module: testVerifyRotation(270) },
  { name: '[Test] Verifieër positie', module: testVerifyPosition() },
  { name: '[Test] Blik pakken', module: testPickupCan() },
  { name: '[Test] Blikken detecteren', module: testCanDetection() },
  { name: '[Test] ICP', module: testICP() },
  { name: '[Test] Remote', module: testRemote() },
];

module.exports = [
  { name: 'Heen & Weer', module: backAndForth() },
  { name: 'Super Slalom', module: superSlalom() },
  { name: 'Lijnvolgen', module: lineFollower() },
  { name: 'Lijnvolgen met Obstakel', module: lineFollower(true) },
  { name: 'T-Tijd', module: tTime() },
  { name: 'T-Tijd met smalle doorgang', module: tTime(true) },
  { name: 'Blikken', module: cans() },
  { name: 'Blikken Retour', module: cans(true) },
  ...testPrograms,
];
