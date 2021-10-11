const LOOP_TIME = 20; // ms
const MOTOR_ENCODER_CPR = 48; // two pin encoder rising and falling edge
const MOTOR_GEAR_RATIO = 46.85;
const NUM_TICKS_PER_REVOLUTION = MOTOR_GEAR_RATIO * MOTOR_ENCODER_CPR;
const WHEEL_BASE = 190.825; // mm
const BASE_CIRCUMFERENCE = Math.PI * WHEEL_BASE;
const WHEEL_DIAMETER_DIFF = 0.075; // mm
const BASE_WHEEL_DIAMETER = 71.45;
const LEFT_WHEEL_DIAMETER = BASE_WHEEL_DIAMETER - WHEEL_DIAMETER_DIFF; // mm
const LEFT_WHEEL_CIRCUMFERENCE = Math.PI * LEFT_WHEEL_DIAMETER; // mm
const LEFT_DISTANCE_PER_TICK = LEFT_WHEEL_CIRCUMFERENCE / NUM_TICKS_PER_REVOLUTION; // mm
const RIGHT_WHEEL_DIAMETER = BASE_WHEEL_DIAMETER + WHEEL_DIAMETER_DIFF; // mm
const RIGHT_WHEEL_CIRCUMFERENCE = Math.PI * RIGHT_WHEEL_DIAMETER; // mm
const RIGHT_DISTANCE_PER_TICK = RIGHT_WHEEL_CIRCUMFERENCE / NUM_TICKS_PER_REVOLUTION; // mm
const ACCELERATION_STEP = 5; // mm/looptime
const ACCELERATION = ACCELERATION_STEP * (1000 / LOOP_TIME); // mm/s
const MIN_SPEED = 50; // mm/s
const MAX_SPEED = 200; // mm/s
const MAX_ROTATION_SPEED = MAX_SPEED / 2; // mm/s
const HEADING_KP = 100;
const HEADING_KI = 0.5;
const HEADING_KD = 0;
const GRIPPER_JAW_CLOSE_ANGLE = 28; // deg
const GRIPPER_JAW_WIDE_OPEN_ANGLE = 85; // deg
const GRIPPER_JAW_OPEN_ANGLE = 125; // deg
const GRIPPER_LIFT_UP_ANGLE = 75; // deg
const GRIPPER_LIFT_DOWN_ANGLE = 140; // deg
const GRIPPER_OBSTACLE_DISTANCE = 200; // mm
const GRIPPER_OBSTACLE_PICKUP_DISTANCE = 130; // mm

const config = {
  LOOP_TIME,
  MOTOR_ENCODER_CPR,
  MOTOR_GEAR_RATIO,
  NUM_TICKS_PER_REVOLUTION,
  WHEEL_BASE,
  BASE_CIRCUMFERENCE,
  LEFT_WHEEL_DIAMETER,
  LEFT_WHEEL_CIRCUMFERENCE,
  LEFT_DISTANCE_PER_TICK,
  RIGHT_WHEEL_DIAMETER,
  RIGHT_WHEEL_CIRCUMFERENCE,
  RIGHT_DISTANCE_PER_TICK,
  ACCELERATION_STEP,
  ACCELERATION,
  MIN_SPEED,
  MAX_SPEED,
  MAX_ROTATION_SPEED,
  HEADING_KP,
  HEADING_KI,
  HEADING_KD,
  GRIPPER_JAW_CLOSE_ANGLE,
  GRIPPER_JAW_WIDE_OPEN_ANGLE,
  GRIPPER_JAW_OPEN_ANGLE,
  GRIPPER_LIFT_UP_ANGLE,
  GRIPPER_LIFT_DOWN_ANGLE,
  GRIPPER_OBSTACLE_DISTANCE,
  GRIPPER_OBSTACLE_PICKUP_DISTANCE,
};

module.exports = config;
