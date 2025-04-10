import { saveToCloud } from './cloudStorage';
import { saveToDB } from './dbStorage';
import { saveToLocal } from './localStorage';

type Destination = 'LOCAL' | 'CLOUD' | 'DB';

async function storageDispatcher(file, destination: Destination = 'LOCAL') {
  switch (destination) {
    case 'LOCAL':
      return saveToLocal(file);
    case 'CLOUD':
      return saveToCloud(file);
    case 'DB':
      return saveToDB(file);
    default:
      throw new Error('Invalid storage destination');
  }
}

export default storageDispatcher;
