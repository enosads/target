import { LinearGradient } from 'expo-linear-gradient'
import { Text, View } from 'react-native'
import { Separator } from '@/components/Divider'
import { Summary } from '@/components/Summary'
import { colors } from '@/theme'
import { styles } from './styles'

export type HomeHeaderProps = {
  total: string
  input: string
  output: string
}

export type Props = {
  data: HomeHeaderProps
}

export function HomeHeader({ data }: Props) {
  return (
    <LinearGradient
      colors={[colors.blue[500], colors.blue[800]]}
      style={styles.container}
    >
      <View>
        <Text style={styles.label}>Total que você possui</Text>
        <Text style={styles.total}>{data.total}</Text>
      </View>
      <Separator color={colors.blue['400']} />

      <View style={styles.summaryContainer}>
        <Summary
          data={{
            label: 'Entradas',
            value: data.input,
          }}
          icon={{ name: 'arrow-upward', color: colors.green['500'] }}
        />
        <Summary
          data={{
            label: 'Saídas',
            value: data.output,
          }}
          icon={{ name: 'arrow-downward', color: colors.red['400'] }}
          isRight
        />
      </View>
    </LinearGradient>
  )
}
