const verifyPosition = require('../helpers/verifyPosition');

module.exports = () => ({ config, arena, logger, controllers, sensors }) => {
  const { motion } = controllers;
  const { lidar } = sensors;

  function constructor() {
    logger.log('constructor', 'testVerifyPosition');
  }

  async function start() {
    logger.log('start', 'testVerifyPosition');

    await verifyPosition(lidar, motion);

    testComplete();
  }

  function stop() {
    logger.log('stop', 'testVerifyPosition');
    motion.stop(true);
  }

  function testComplete() {
    logger.log('test complete', 'testVerifyPosition');
    stop();
  }

  constructor();

  return {
    start,
    stop,
  };
};