import { forwardRef } from 'react'
import { Text, TextInput, View } from 'react-native'
import Input, { type CurrencyInputProps } from 'react-native-currency-input'
import { colors } from '@/theme'
import { styles } from './styles'

type Props = CurrencyInputProps & {
  label: string
}

export const CurrencyInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <Input
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          delimiter="."
          separator=","
          precision={2}
          minValue={0}
          {...rest}
        />
      </View>
    )
  },
)
