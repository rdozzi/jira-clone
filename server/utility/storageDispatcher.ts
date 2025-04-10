import { cloudStorage } from './cloudStorage';
import { dbStorage } from './dbStorage';
import { localStorage } from './localStorage';

type Destination = 'LOCAL' | 'CLOUD' | 'DB';

async function storageDispatcher(file, destination: Destination = 'LOCAL') {
  switch (destination) {
    case 'LOCAL':
      return localStorage(file);
    case 'CLOUD':
      return cloudStorage(file);
    case 'DB':
      return dbStorage(file);
    default:
      throw new Error('Invalid storage destination');
  }
}

export default storageDispatcher;
