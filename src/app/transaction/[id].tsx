import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { TransactionType } from '@/components/TransactionType'
import { useTransactionsDatabase } from '@/database/useTrasactionsDatabase'
import { TransactionTypes } from '@/utils/TransactionTypes'

export default function Transaction() {
  const [isCreating, setIsCreating] = useState(false)
  const [amount, setAmount] = useState(0)
  const [observation, setObservation] = useState('')
  const [type, setType] = useState(TransactionTypes.Input)

  const params = useLocalSearchParams<{ id: string }>()
  const transactionDataBase = useTransactionsDatabase()

  async function handleCreate() {
    try {
      if (amount <= 0) {
        return Alert.alert('Atenção', 'Preencha o valor')
      }
      await transactionDataBase.create({
        target_id: Number(params.id),
        amount: type === TransactionTypes.Input ? amount : -amount,
        observation,
      })
      Alert.alert('Sucesso', 'Transação criada com sucesso!', [
        { text: 'OK', onPress: router.back },
      ])
      setIsCreating(true)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a transação')
      setIsCreating(false)
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />
        <CurrencyInput
          label="Valor (R$)"
          value={amount}
          onChangeValue={setAmount}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
          value={observation}
          onChangeText={setObservation}
        />

        <Button
          title="Salvar"
          onPress={handleCreate}
          isProcessing={isCreating}
        />
      </View>
    </View>
  )
}
