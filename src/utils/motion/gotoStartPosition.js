const getAngleDistance = require('../sensor/lidar/getAngleDistance');

/**
 *
 * @param {Object} measurements
 * @param {Object} motion
 * @param {Number} centerOffset [-x / x]
 * @return {Promise}
 */
const gotoStartPosition = async (measurements, motion, centerOffset = 0) => {
  const offsetLeft = Math.round(getAngleDistance(measurements, 270));
  const offsetRight = Math.round(getAngleDistance(measurements, 90));
  const currentOffset = Math.round((offsetLeft - offsetRight) / 2);
  const distance = Math.max(centerOffset, currentOffset) - Math.min(centerOffset, currentOffset);
  const direction = centerOffset - currentOffset < 0 ? -1 : 1;
  const angle = (Math.PI / 2) * direction;

  if (!distance) {
    return Promise.resolve();
  }

  await motion.rotate(angle);
  await motion.distanceHeading(distance, angle);
  await motion.rotate(angle * -1);

  return Promise.resolve();
};

module.exports = gotoStartPosition;
