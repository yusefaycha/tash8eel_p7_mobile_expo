import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getCoverPhoto } from '../actions/actions'
import Logo from './logo.jpg'

export default function EventCard({ event, navigation }) {

  const [cover, setCover] = useState('')

  useEffect(
    () => {
      getCoverPhoto(event, setCover)
    },
    []
  )

  const handlePress = (e) => {
    navigation.navigate('DetailsScreen', { event: e })
  }

  return (
    <TouchableOpacity onPress={() => handlePress(event)}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={Logo}
            style={styles.logo}
          />
          <Text style={styles.title}>{event.name}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.info}>
            <Text style={styles.label}>Departure Location:</Text>
            <Text>{event.departureLocation}</Text>
            <Text style={styles.label}>Valid From:</Text>
            <Text>{event.validFrom}</Text>
            <Text style={styles.label}>Departure Time:</Text>
            <Text>{event.departureTime}</Text>
          </View>
          <Image
            source={cover ? { uri: cover } : null}
            style={styles.image}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    // height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,

  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  info: {
    flex: 2,
  },
  image: {
    flex: 3,
    height: '100%',
  },
  label: {
    fontWeight: 'bold'
  }
})