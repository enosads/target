import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, StatusBar, TextInput, View } from 'react-native'
import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'
import { useTargetDatabase } from '@/database/useTargetDatabase'

export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)

  const amountInputRef = useRef<TextInput>(null)

  const params = useLocalSearchParams<{ id?: string }>()
  const targetDataBase = useTargetDatabase()

  function handleSave() {
    if (!name.trim() || amount <= 0) {
      return Alert.alert(
        'Atenção',
        'Preencha o nome e o valor precisa ser maior que zero.',
      )
    }

    setIsProcessing(true)

    if (params.id) {
      void update()
    } else {
      void create()
    }
  }

  async function update() {
    try {
      await targetDataBase.update({ id: Number(params.id), name, amount })
      Alert.alert('Sucesso', 'Meta atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: router.back,
        },
      ])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a meta.')
      console.error(error)
      setIsProcessing(false)
    }
  }

  async function create() {
    try {
      await targetDataBase.create({ name, amount })
      Alert.alert('Nova Meta', 'Meta criada com sucesso!', [
        {
          text: 'Ok',
          onPress: router.back,
        },
      ])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a meta.')
      console.log(error)
      setIsProcessing(false)
    }
  }

  async function fetchDetails(id: number) {
    try {
      const response = await targetDataBase.show(id)
      setName(response.name)
      setAmount(response.amount)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da meta')
      console.error(error)
    }
  }

  function handleRemove() {
    if (!params.id) return

    Alert.alert('Remover', 'Deseja realmente remover?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: remove },
    ])
  }

  async function remove() {
    try {
      await targetDataBase.remove(Number(params.id))
      Alert.alert('Meta', 'Meta removida com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.dismissTo('/'),
        },
      ])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a meta')
      console.log(error)
    }
  }

  useEffect(() => {
    if (params.id) {
      void fetchDetails(Number(params.id))
    }
  }, [params.id])

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <StatusBar barStyle={'dark-content'} />
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
        rightButton={
          params.id && {
            icon: 'delete',
            onPress: handleRemove,
          }
        }
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          onChangeText={setName}
          value={name}
          returnKeyType="next"
          onSubmitEditing={() => amountInputRef.current?.focus()}
        />

        <CurrencyInput
          ref={amountInputRef}
          label="Valor alvo (R$)"
          value={amount}
          onChangeValue={setAmount}
          onSubmitEditing={handleSave}
          returnKeyType="done"
        />

        <Button
          title={params.id ? 'Atualizar' : 'Salvar'}
          isProcessing={isProcessing}
          onPress={handleSave}
        />
      </View>
    </View>
  )
}
