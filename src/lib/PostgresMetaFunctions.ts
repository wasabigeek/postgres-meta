import { literal } from 'pg-format'
import { DEFAULT_SYSTEM_SCHEMAS } from './constants'
import { functionsSql } from './sql'
import { PostgresMetaResult, PostgresFunction } from './types'

export default class PostgresMetaFunctions {
  query: (sql: string) => Promise<PostgresMetaResult<any>>

  constructor(query: (sql: string) => Promise<PostgresMetaResult<any>>) {
    this.query = query
  }

  async list({ includeSystemSchemas = false } = {}): Promise<
    PostgresMetaResult<PostgresFunction[]>
  > {
    const sql = includeSystemSchemas
      ? functionsSql
      : `${functionsSql} WHERE NOT (n.nspname IN (${DEFAULT_SYSTEM_SCHEMAS.map(literal).join(
          ','
        )}));`
    return await this.query(sql)
  }
}
