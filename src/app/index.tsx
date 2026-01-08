import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, StatusBar, View } from 'react-native'
import { Button } from '@/components/Button'
import { HomeHeader } from '@/components/HomeHeader'
import { List } from '@/components/List'
import { Loading } from '@/components/Loading'
import { Target, type TargetProps } from '@/components/Target'
import { useTargetDatabase } from '@/database/useTargetDatabase'
import { useTransactionsDatabase } from '@/database/useTrasactionsDatabase'
import { numberToCurrency } from '@/utils/numberToCurrency'

export default function Index() {
  const [isFetching, setIsFetching] = useState(true)
  const [summary, setSummary] = useState({
    input: 'R$ 0,00',
    output: 'R$ 0,00',
    total: 'R$ 0,00',
  })
  const [targets, setTargets] = useState<TargetProps[]>([])
  const targetDataBase = useTargetDatabase()
  const transactionsDatabase = useTransactionsDatabase()

  const fetchTargets = async (): Promise<TargetProps[]> => {
    try {
      const response = await targetDataBase.listByClosestTarget()
      return response.map((target) => ({
        id: String(target.id),
        name: target.name,
        current: numberToCurrency(target.current),
        percentage: `${target.percentage.toFixed(0)}%`,
        target: numberToCurrency(target.amount),
      }))
    } catch (error) {
      Alert.alert('Error', 'Não foi possível carregar as metas')
      console.log(error)
    }
  }

  const fetchData = async () => {
    const targetDataPromise = fetchTargets()
    const summaryDataPromise = fetchSummary()

    const [targetData, summaryData] = await Promise.all([
      targetDataPromise,
      summaryDataPromise,
    ])
    setTargets(targetData)
    setSummary(summaryData)
    setIsFetching(false)
  }

  const fetchSummary = async () => {
    try {
      const response = await transactionsDatabase.summary()
      return {
        input: numberToCurrency(response.input),
        output: numberToCurrency(response.output),
        total: numberToCurrency(response.input + response.output),
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível carregar o resumo')
    }
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
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />
      <List
        title="Metas"
        data={targets}
        keyExtractor={(item) => item.id}
        emptyMessage={
          'Nenhuma meta cadastrada. Toque em nova meta para adicionar'
        }
        renderItem={({ item }) => (
          <Target
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        )}
        containerStyle={{ paddingHorizontal: 24 }}
      />
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Nova meta" onPress={() => router.navigate('/target')} />
      </View>
    </View>
  )
}
