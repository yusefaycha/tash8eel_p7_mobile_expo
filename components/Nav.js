import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

export default function Nav({query, setQuery}) {
  return (
    <View style={styles.container}>
      <Text style={styles.appLabel}>Go Hiking</Text>
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>Click me</Text>
      </TouchableOpacity> */}
      <TextInput 
            value={query} 
            style={styles.search} 
            onChangeText={(e) => setQuery(e.toLowerCase())}
            placeholder='Search'
        />
    </View>
  )
}

const styles= StyleSheet.create({
    container:  {
        display: 'flex',
        backgroundColor: "green",
        alignItems: 'center',
        paddingHorizontal: 10
    },
    appLabel: {
        paddingTop: 20,
        fontSize:   30,
        fontWeight: 'bold',
        color: 'white'
    },
    search: {
        backgroundColor: 'white',
        color: 'gray',
        borderRadius: 30,
        paddingVertical: 5,
        width:  '100%',
        marginVertical:10,
        fontSize:20,
        textAlign: 'center',
    },
    // btnText: {
    //     fontSize:20,
    //     textAlign: 'center',

    // }
})