import { StyleSheet, View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../actions/actions'
import EventCard from '../components/EventCard'
import Nav from '../components/Nav'

export default function eventsPage() {
    const [events, setEvents] = useState([])
    const [query, setQuery] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(true)

    const fixFormat = (event) => {
        event.validFrom = event.validFrom.split('T')[0]
        event.validTo = event.validTo.split('T')[0]
        event.publishDate = event.publishDate.split('T')[0]
        event.departureTime = event.departureTime.substring(11, 16)
        event.arrivalTime = event.arrivalTime.substring(11, 16)

        return event
    }

    useEffect(() => {
        if (!isRefreshing) return
        const apiURL = getBaseUrl() + '/events'
        // console.log(apiURL)
        fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                setEvents(data.map(e => fixFormat(e)))
                setIsRefreshing(false)
                // console.log(data)
            }).catch(error => {
                setIsRefreshing(false)
                console.error(error)
            })
    }, [isRefreshing])

    const renderItem = ({ item }) => {
        return <EventCard key={item._id} event={item} />
    }

    return (
        <View style={styles.container}>
            <Nav query={query} setQuery={setQuery} />
            {/* <Text>Event Page: </Text> */}
            <FlatList
                data={events.filter(e => e.name.toLowerCase().includes(query))}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                refreshing={isRefreshing}
                onEndReachedThreshold={() => {
                    setIsRefreshing(true)
                }}
                onRefresh={()=> console.log('refresh')}
            />
            {/* {events.filter(e => e.name.toLowerCase().includes(query)).map(event => {
                return <EventCard key={event._id} event={event} />
            })} */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgrey',
        minHeight: '100%'
    }
})