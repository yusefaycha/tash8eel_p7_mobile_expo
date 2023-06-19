import { StyleSheet, View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { getBaseUrl } from '../actions/actions'
import Logo from './logo.jpg'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react/cjs/react.production.min'

export default function EventCard({ event , navigation}) {

  const [cover, setCover] = useState('')

  useEffect(
    () => {
      const apiURL = getBaseUrl() + '/photos'
      fetch(apiURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: event.photos[0] })
      }).then(res => res.json())
        .then(data => {
          setCover(data.myFile)
        })
    },
    []
  )

  const handlePress = (e) => {
    // console.log(e)
    navigation.navigate('DetailsScreen', { event:e , navigation:navigation})
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
            source={cover?{ uri: cover }:null}
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
    flex:2,
  },
  image: {
    flex: 3,
    height: '100%',
  },
  label: {
    fontWeight: 'bold'
  }
})