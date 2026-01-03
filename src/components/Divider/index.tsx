import { type ColorValue, View } from 'react-native'
import { styles } from './styles'

export type DividerProps = {
  color: ColorValue
}

export function Separator({ color }: DividerProps) {
  return <View style={[styles.container, { backgroundColor: color }]}></View>
}
