import * as userRepository from './repositories/userRepository.js';
import * as mapRepository from './repositories/mapRepository.js';
import * as routeRepository from './repositories/routeRepository.js';
import * as obstacleRepository from './repositories/obstacleRepository.js';
import * as waypointRepository from './repositories/waypointRepository.js';

import { userService } from '../application/services/userService.js';
import { mapService } from '../application/services/mapService.js';
import { routeService } from '../application/services/routeService.js';
import { obstacleService } from '../application/services/obstacleService.js';
import { waypointService } from '../application/services/waypointService.js';

export const container = {
  userService: userService({ userRepository }),
  mapService: mapService({ mapRepository }),
  routeService: routeService({ routeRepository }, { waypointRepository }, { obstacleRepository }),
  obstacleService: obstacleService({ obstacleRepository }),
  waypointService: waypointService({ waypointRepository }, { obstacleRepository })
};