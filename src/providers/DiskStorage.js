import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TMP_FOLDER, UPLOADS_FOLDER } from '../configs/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOADS_FOLDER, file)
    )

    return file
  }

  async deleteFile(file) {
    const filePath = path.resolve(UPLOADS_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
