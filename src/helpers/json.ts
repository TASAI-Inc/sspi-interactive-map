import { promises as fs } from 'fs';

export async function loadFile<T = any> (path: string): Promise<T> {
  const data: string = await fs.readFile(path, 'utf8');
  return JSON.parse(data) as T;
}

export async function writeJson (fileName: string, data: any): Promise<void> {
  await fs.writeFile(`output/${fileName}`, JSON.stringify(data));
}
