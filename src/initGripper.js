const Gripper = require('node-gripper');

/**
 * Initialize gripper
 * @param {String} portName
 * @param {Object} config
 * @return {Object}
 */
const initGripper = (portName, config) => new Promise((resolve, reject) => {
  if (!portName) {
    reject('gripper not found');
    return;
  }

  const gripper = Gripper(portName);
  const errorTimeout = setTimeout(() => {
    reject('gripper timed out');
  }, 5000);

  let isReady = false;

  const isReadyTimeout = setTimeout(() => {
    if (!isReady) {
      gripper.isReady()
        .catch(reject);
    }
  }, 2500);

  const onInit = () => {
    isReady = true;

    clearTimeout(isReadyTimeout);
    clearTimeout(errorTimeout);

    gripper.setLiftAngle(config.GRIPPER_LIFT_DOWN_ANGLE);
    gripper.setJawAngle(config.GRIPPER_JAW_OPEN_ANGLE);

    resolve(gripper);
  };

  gripper.init()
    .then(onInit)
    .catch(reject);
});

module.exports = initGripper;