import { useSQLiteContext } from 'expo-sqlite'

export type TargetCreate = {
  name: string
  amount: number
}

export type TargetUpdate = TargetCreate & {
  id: number
}

export type TargetResponse = {
  id: number
  name: string
  amount: number
  current: number
  percentage: number
  created_at: string
  updated_at: string
}

export function useTargetDatabase() {
  const database = useSQLiteContext()

  async function create(data: TargetCreate) {
    const statement = await database.prepareAsync(
      'INSERT INTO targets (name, amount) VALUES ($name, $amount)',
    )

    void statement.executeAsync({
      $name: data.name,
      $amount: data.amount,
    })
  }

  function listByClosestTarget() {
    return database.getAllAsync<TargetResponse>(`
      SELECT
          targets.id,
          targets.name,
          targets.amount,
          COALESCE(SUM(transactions.amount),0) AS current,
          COALESCE((SUM(transactions.amount)/targets.amount)*100,0) AS percentage,
          targets.created_at,
          targets.updated_at
      FROM targets 
          LEFT JOIN transactions ON targets.id = transactions.target_id
      GROUP BY targets.id, targets.name, targets.amount
      ORDER BY current DESC
    `)
  }

  function show(id: number) {
    return database.getFirstAsync<TargetResponse>(
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

  async function update(data: TargetUpdate) {
    const statement = await database.prepareAsync(`
      UPDATE targets SET
         name = $name,
         amount = $amount,
         updated_at = CURRENT_TIMESTAMP
      WHERE id = $id
    `)

    void statement.executeAsync({
      $name: data.name,
      $amount: data.amount,
      $id: data.id,
    })
  }

  async function remove(id: number) {
    await database.runAsync(`DELETE FROM targets WHERE id = ?`, id)
  }

  return {
    create,
    show,
    update,
    remove,
    listByClosestTarget,
  }
}
