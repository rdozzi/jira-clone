import { cloudStorage } from './cloudStorage';
import { dbStorage } from './dbStorage';
import { localStorage } from './localStorage';

type Destination = 'LOCAL' | 'CLOUD' | 'DB';

async function storageDispatcher(files, destination: Destination = 'LOCAL') {
  switch (destination) {
    case 'LOCAL':
      return localStorage(files);
    case 'CLOUD':
      return cloudStorage(files);
    case 'DB':
      return dbStorage(files);
    default:
      throw new Error('Invalid storage destination');
  }
}

export default storageDispatcher;
