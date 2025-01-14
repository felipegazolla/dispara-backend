import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function sqliteConnection() {
  const database = await open({
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database,
  })

  return database
}
