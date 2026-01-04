import { router } from 'expo-router'
import { StatusBar, View } from 'react-native'
import { Button } from '@/components/Button'
import { HomeHeader } from '@/components/HomeHeader'
import { List } from '@/components/List'
import { Target } from '@/components/Target'

const summary = {
  total: 'R$ 2.680,00',
  input: { label: 'Entradas', value: 'R$ 6,184.90' },
  output: { label: 'Saídas', value: '-R$ 883.65' },
}

const targets = [
  {
    id: '1',
    name: 'Apple Watch',
    percentage: '50%',
    current: 'R$ 580,00 ',
    target: 'R$ 1.160,00',
  },
  {
    id: '2',
    name: 'Comprar uma cadeira ergonômica',
    percentage: '75%',
    current: 'R$ 900,00',
    target: 'R$ 1.2000,00',
  },
  {
    id: '3',
    name: 'Fazer uma viagem para o Rio de Janeiro',
    percentage: '75%',
    current: 'R$ 2.250,00',
    target: 'R$ 3.000,00',
  },
]

export default function Index() {
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
