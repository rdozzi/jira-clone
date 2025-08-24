import { Readable } from 'stream';

// interface ReadableWithPath extends Readable {
//   path: string;
//   close: boolean;
//   bytesRead: number;
//   pending: boolean;
// }

class ReadableWithPath extends Readable {
  path: string;
  bytesRead: number = 0;
  pending: boolean = false;

  constructor(buffer: Buffer, name: string) {
    super();
    this.path = name;
    this.push(buffer);
    this.push(null);
  }

  close() {
    this.destroy();
  }
}

export function createTestFile(sizeInBytes: number, name: string) {
  const buffer = Buffer.alloc(sizeInBytes, 0);

  return new ReadableWithPath(buffer, name);
}
