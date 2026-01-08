import { useSQLiteContext } from 'expo-sqlite'

export type TransactionCreate = {
  target_id: number
  amount: number
  observation?: string
}

export type TransactionResponse = {
  id: number
  target_id: number
  observation: string
  amount: number
  created_at: string
  updated_at: string
}

export type Summary = {
  input: number
  output: number
}

export function useTransactionsDatabase() {
  const database = useSQLiteContext()

  async function create(data: TransactionCreate) {
    const statement = await database.prepareAsync(
      `INSERT INTO transactions (target_id, amount, observation) 
                VALUES ($target_id, $amount, $observation)`,
    )

    void statement.executeAsync({
      $target_id: data.target_id,
      $amount: data.amount,
      $observation: data.observation,
    })
  }

  function listByTargetId(id: number) {
    return database.getAllAsync<TransactionResponse>(
      `
      SELECT
          transactions.id,
          transactions.target_id,
          transactions.observation,
          transactions.amount,
          transactions.created_at,
          transactions.updated_at
      FROM transactions 
      WHERE transactions.target_id = ?

      ORDER BY created_at DESC
    `,
      id,
    )
  }

  function show(id: number) {
    return database.getFirstAsync<TransactionResponse>(
      `
        SELECT targets.id,
               targets.name,
               targets.amount,
               COALESCE(SUM(transactions.amount), 0)                          AS current,
               COALESCE((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
               targets.created_at,
               targets.updated_at
        FROM targets
                 LEFT JOIN transactions ON targets.id = transactions.target_id
        WHERE targets.id = ?
        GROUP BY targets.id, targets.name, targets.amount, targets.created_at, targets.updated_at
    `,
      id,
    )
  }

  async function remove(id: number) {
    await database.runAsync(`DELETE FROM transactions WHERE id = ?`, id)
  }

  function summary() {
    return database.getFirstAsync<Summary>(`
      SELECT COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS input,
             COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS output
      FROM transactions
    `)
  }

  return {
    create,
    show,
    remove,
    listByTargetId,
    summary,
  }
}
