const robotlib = require('robotlib');
const scan = require('../utils/sensor/lidar/scan');
const averageMeasurements = require('../utils/sensor/lidar/averageMeasurements');
const solveStartVector = require('../utils/motion/solveStartVector2');
const gotoStartPosition = require('../utils/motion/gotoStartPosition');
const getInitialPosition = require('../utils/motion/getInitialPosition');
const verifyPosition = require('../helpers/verifyPosition');
const verifyRotation = require('../helpers/verifyRotation');
const getArenaMatrix = require('../utils/getArenaMatrix');
const localiseCans = require('../utils/localiseCans');
const locateCan = require('../utils/locateCan');
const pickupCan = require('../utils/pickupCan');
const dropCan = require('../utils/dropCan');
const cellStates = require('../utils/cellStates');

const { pause } = robotlib.utils;
const { calculateDistance } = robotlib.utils.math;

module.exports = (pickupAndReturn = false) => ({ socket, config, arena, logger, controllers, sensors }) => {
  const { motion, gripper } = controllers;
  const { lidar } = sensors;
  const matrix = getArenaMatrix(arena.width, arena.height, 30);
  const halfArenaHeight = arena.height / 2;
  const maxNumCans = 6;
  const canStoreCoordinates = [
    { x: 100, y: 150 + halfArenaHeight },
    { x: 100, y: 300 + halfArenaHeight },
    { x: 100, y: 450 + halfArenaHeight },
    { x: 250, y: 150 + halfArenaHeight },
    { x: 250, y: 300 + halfArenaHeight },
    { x: 250, y: 450 + halfArenaHeight },
  ];

  const endPosition = {
    x: 200,
    y: arena.height * 0.75,
  };

  const arenaCenterPosition = {
    x: arena.width / 2,
    y: arena.height * 0.75,
  };

  let numStoredCans = 0;

  function constructor() {
    logger.log('constructor', 'cans');
  }

  async function start() {
    logger.log('start', 'cans');

    await solveStartVector(lidar, motion);

    const positionScanData = await scan(lidar, 1000);
    const positionAveragedMeasurements = averageMeasurements(positionScanData);
    await gotoStartPosition(positionAveragedMeasurements, motion);

    const currentPositionScanData = await scan(lidar, 1000);
    const currentPositionAveragedMeasurements = averageMeasurements(currentPositionScanData);
    const initialPosition = getInitialPosition(currentPositionAveragedMeasurements, arena.height);

    motion.setTrackPose(true);
    motion.appendPose({ ...initialPosition, phi: 0 });

    const startPosition = { ...initialPosition };

    if (startPosition.x < 450) {
      startPosition.x = 450;
    }

    const verificationPosition = {
      ...startPosition,
      y: startPosition.y + 150,
    };

    const scanRadius = arena.width / 4;
    const scanPositions = [
      { ...startPosition, heading: 0 },
      { x: 1250, y: initialPosition.y, heading: 0 },
      { x: 2050, y: initialPosition.y, heading: 0 },
      { x: 2850, y: initialPosition.y, heading: 0 },
      { x: 1800, y: 1100, heading: -(Math.PI / 2) },
      { x: 1800, y: 600, heading: -(Math.PI / 2) },
    ];

    for (let scanPositionIndex = 0; scanPositionIndex < scanPositions.length; scanPositionIndex += 1) {
      const scanPosition = scanPositions[scanPositionIndex];
      const isAtLastScanPosition = scanPositionIndex === scanPositions.length - 1;
      const isScanPositionInSquareC = isPositionInAreaC(halfArenaHeight, scanPosition);

      if (isScanPositionInSquareC) {
        await motion.move2XY(arenaCenterPosition);
        await pause(250);
      }

      await motion.move2XYPhi(scanPosition, scanPosition.heading);
      await pause(250);

      if (scanPosition.heading === 0) {
        await verifyRotation(lidar, motion, 90, 60);
        await verifyPosition(arena, lidar, motion, 0);
      }

      const scanPose = motion.getPose();
      const localisedCans = await localiseCans(scanRadius, matrix, scanPose, lidar, 30);
      const sortedLocalisedCans = [...localisedCans].sort((a, b) => calculateDistance(scanPose, a) - calculateDistance(scanPose, b));

      sortedLocalisedCans.forEach(({ row, column }) => matrix[row][column] = cellStates.OBSTACLE);

      // TODO visualize cans in telemetry?

      // visualize the matrix
      matrix.forEach(row => console.log(row.toString()));
      console.log(`${localisedCans.length} can(s) found at scan position ${scanPosition.x},${scanPosition.y}`);

      for (let obstacleIndex = 0; obstacleIndex < sortedLocalisedCans.length; obstacleIndex += 1) {
        const obstacle = sortedLocalisedCans[obstacleIndex];
        const isLastObstacle = obstacleIndex === sortedLocalisedCans.length - 1;

        if (obstacleIndex !== 0 && isPositionInAreaC(halfArenaHeight, obstacle)) {
          await motion.move2XY(arenaCenterPosition);
          await pause(250);
        }

        await motion.move2XY(obstacle, -config.GRIPPER_OBSTACLE_DISTANCE);
        await pause(250);

        if (pickupAndReturn) {
          try {
            await pickupCan(config, lidar, motion, gripper);
          } catch(error) {
            console.log(error);
            matrix[obstacle.row][obstacle.column] = cellStates.EMPTY;
            continue;
          }

          await motion.distanceHeading(-200, motion.getPose().phi);
          await pause(250);

          if (isPositionInAreaC(halfArenaHeight, motion.getPose())) {
            await motion.move2XY(arenaCenterPosition);
            await pause(250);
          }

          await motion.move2XY(canStoreCoordinates[numStoredCans], -config.GRIPPER_OBSTACLE_DISTANCE);
          await dropCan(config, gripper);

          await motion.distanceHeading(-150, motion.getPose().phi);
          await pause(250);

          if (!isAtLastScanPosition && !isLastObstacle) {
            await motion.move2XYPhi(verificationPosition, 0);
            await verifyRotation(lidar, motion, 90, 60);
            await verifyPosition(arena, lidar, motion, 0);
            await pause(250);
          }
        } else {
          try {
            await locateCan(config, lidar);
          } catch(error) {
            console.log(error);
            matrix[obstacle.row][obstacle.column] = cellStates.EMPTY;
          }

          await gripper.setJawAngle(config.GRIPPER_JAW_WIDE_OPEN_ANGLE);
          await gripper.setJawAngle(config.GRIPPER_JAW_OPEN_ANGLE);

          await pause(5000); // give "someone" the time to remove the can
        }

        matrix[obstacle.row][obstacle.column] = cellStates.EMPTY;
        numStoredCans += 1;
      };

      const areAllCansStored = numStoredCans === maxNumCans;
      console.log({ areAllCansStored, isAtLastScanPosition });

      if (areAllCansStored || isAtLastScanPosition) {
        console.log('we should be done...');
        const currentPose = motion.getPose();
        const inSquareA = currentPose.x < 450;

        if (!inSquareA) {
          console.log('we\'re not home yet');
          if (isPositionInAreaC(halfArenaHeight, currentPose)) {
            console.log('move to center square');
            await motion.move2XY(arenaCenterPosition);
          }

          console.log('move to square A');
          await motion.move2XY(endPosition);
        }
      }
    }

    missionComplete();
  }

  function isPositionInAreaC(halfArenaHeight, position) {
    return position.y < halfArenaHeight;
  }

  function stop() {
    logger.log('stop', 'cans');
    motion.stop(true);
  }

  function missionComplete() {
    logger.log('mission complete', 'cans');
    stop();
  }

  constructor();

  return {
    start,
    stop,
  };
};
