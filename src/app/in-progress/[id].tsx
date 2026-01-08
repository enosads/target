import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, StatusBar, View } from 'react-native'
import { Button } from '@/components/Button'
import { List } from '@/components/List'
import { Loading } from '@/components/Loading'
import { PageHeader } from '@/components/PageHeader'
import { Progress } from '@/components/Progress'
import { Transaction, TransactionProps } from '@/components/Transaction'
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionsDatabase } from '@/database/useTrasactionsDatabase'
import { numberToCurrency } from '@/utils/numberToCurrency'
import { TransactionTypes } from '@/utils/TransactionTypes'

export default function InProgress() {
  const [isFetching, setIsFetching] = useState(true)
  const [details, setDetails] = useState({
    name: '',
    current: 'R$ 0,00',
    target: 'R$ 0,00',
    percentage: 0,
  })
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  const params = useLocalSearchParams<{ id: string }>()

  const targetDatabase = useTargetDatabase()
  const transactionsDataBase = useTransactionsDatabase()

  async function fetchDetails() {
    try {
      const response = await targetDatabase.show(Number(params.id))
      setDetails({
        name: response.name,
        current: numberToCurrency(response.current),
        target: numberToCurrency(response.amount),
        percentage: response.percentage,
      })
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da meta')
      console.error(error)
    }
  }

  async function fetchTransaction() {
    try {
      const response = await transactionsDataBase.listByTargetId(
        Number(params.id),
      )
      setTransactions(
        response.map((transaction) => ({
          type:
            transaction.amount > 0
              ? TransactionTypes.Input
              : TransactionTypes.Output,
          value: numberToCurrency(transaction.amount),
          date: String(transaction.created_at),
          description: transaction.observation,
          id: String(transaction.id),
        })),
      )
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as transações')
      console.error(e)
    }
  }

  async function fetchData() {
    const fetchDetailsPromise = fetchDetails()
    const fetchTransactionPromise = fetchTransaction()
    await Promise.all([fetchDetailsPromise, fetchTransactionPromise])
    setIsFetching(false)
  }

  useFocusEffect(
    useCallback(() => {
      void fetchData()
    }, []),
  )

  if (isFetching) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <StatusBar barStyle={'dark-content'} />
      <PageHeader
        title={details.name}
        rightButton={{
          icon: 'edit',
          onPress: () => {
            router.navigate(`/target?id=${params.id}`)
          },
        }}
      />
      <Progress data={details} />
      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction data={item} onRemove={() => {}} />
        )}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />
      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  )
}
