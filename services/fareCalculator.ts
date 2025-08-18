
import { FareInput } from '../types';

export const calculateFare = (data: FareInput): number => {
  const { distance, duration, pickup, wait, isNight } = data;

  const BASE_FARE = 19;
  const PLATFORM_FEE = 2.5;

  let distanceFare = 0;
  if (distance > 4) {
    distanceFare = (2 * 4) + ((distance - 4) * 6.5);
  } else if (distance > 2) {
    distanceFare = (distance - 2) * 4;
  }

  const timeFare = duration * 0.5;
  const pickupFare = pickup > 2 ? Math.min((pickup - 2) * 3, 6) : 0;
  const waitCharge = Math.min(wait * 1, 15);

  let total = BASE_FARE + PLATFORM_FEE + distanceFare + timeFare + pickupFare + waitCharge;

  if (isNight) {
    total *= 1.2;
  }

  return parseFloat(total.toFixed(2));
};
