import { router } from 'expo-router'
import { Button, View } from 'react-native'
import { PageHeader } from '@/components/PageHeader'

export default function Target() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader title="Meta" />
      <Button title={'Voltar'} onPress={() => router.back()} />
    </View>
  )
}
