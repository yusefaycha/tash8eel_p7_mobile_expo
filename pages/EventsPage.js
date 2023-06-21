import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { getBaseUrl } from '../actions/actions'
import EventCard from '../components/EventCard'
import Nav from '../components/Nav'

export default function EventsPage({ navigation }) {
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
        if (isRefreshing) {
            const apiURL = getBaseUrl() + '/events'
            fetch(apiURL)
                .then(res => res.json())
                .then(data => {
                    setEvents(data.map(e => fixFormat(e)))
                    setIsRefreshing(false)
                }).catch(error => {
                    setIsRefreshing(false)
                    console.error(error)
                })
        }
    }, [isRefreshing])

    const renderItem = ({ item }) => {
        return <EventCard key={item._id} event={item} navigation={navigation} />
    }

    const search = (events, query) => {
        return events.filter(e => {
            return e.name.toLowerCase().includes(query) || e.description.toLowerCase().includes(query)
        }
        )
    }

    return (
        <View style={styles.container}>
            <Nav query={query} setQuery={setQuery} />
            <FlatList
                style={styles.list}
                data={search(events, query)}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                refreshing={isRefreshing}
                onRefresh={() => {
                    setIsRefreshing(true)
                    console.log('refresh')
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgrey',
        height: '100%'
    },
    list: {
        paddingTop: 10
    }
})