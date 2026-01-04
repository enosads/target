import { View } from 'react-native'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'

export default function Target() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader title="Meta" />
      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
        />
        <CurrencyInput label="Valor alvo" value={10000} />
        <Button title="Salvar" />
      </View>
    </View>
  )
}
