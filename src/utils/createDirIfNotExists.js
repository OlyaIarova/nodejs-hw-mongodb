import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};


//Ця функція корисна для створення необхідних директорій перед записом файлів, забезпечуючи, що всі необхідні директорії 