import { MaterialIcons } from '@expo/vector-icons'
import { type ColorValue, Text, View } from 'react-native'
import { styles } from '@/components/Summary/styles'

export type SummaryProps = {
  label: string
  value: string
}

export type Props = {
  data: SummaryProps
  icon: {
    name: keyof typeof MaterialIcons.glyphMap
    color: ColorValue
  }
  isRight?: boolean
}

export function Summary({ data, icon, isRight = false }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { justifyContent: isRight ? 'flex-end' : 'flex-start' },
        ]}
      >
        <MaterialIcons name={icon.name} size={24} color={icon.color} />
        <Text style={styles.label}>{data.label}</Text>
      </View>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  )
}
