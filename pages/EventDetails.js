import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Gallery from 'react-native-image-gallery';
import MapView, { Polyline } from 'react-native-maps';
import { formatDate, getMilestoneAndDirectionCoords, getPhotos, getTrail, milestoneToMarker } from '../actions/actions';

export default function EventDetails({ route }) {

    const { event } = route.params;

    const [milestones, setMilestones] = useState([{ location: '0, 0', photos: [], type: '' }])
    const [directionCoords, setDirectionCoords] = useState([])
    const [trail, setTrail] = useState({ name: '', distance: 0, minHeight: 0, maxHeight: 0, difficulty: 'Moderate', description: '' })
    const [region, setRegion] = useState({
        latitude: 33.8938,
        longitude: 35.8518,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
    })
    const [photos, setPhotos] = useState([])

    useEffect(
         () => {
            if (event.trail !== '') {
                getTrail(event, setTrail)
                getMilestoneAndDirectionCoords(event, setMilestones, setRegion, setDirectionCoords)
            }
            getPhotos(event, setPhotos)
        },
        []
    )

    return (
        <ScrollView>
            <View style={styles.screen}>
                <MapView
                    style={styles.map}
                    region={region}
                >
                    {milestones.length !== 1 ?
                        milestones.map((milestone, index) => (
                            milestoneToMarker(milestone, index)
                        )) :
                        null
                    }
                    {directionCoords.length !== 0 ?
                        <Polyline
                            coordinates={directionCoords.map(coords => {
                                return {
                                    latitude: coords[1],
                                    longitude: coords[0]
                                }
                            })}
                            strokeWidth={6}
                            strokeColor='#f00'
                        /> :
                        null
                    }
                </MapView>
                <View style={styles.body}>
                    <Text style={styles.title}>{event.name}</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={{ ...styles.cell, ...styles.leftCell }}>
                                <Text style={styles.label}>Distance</Text>
                                <Text style={styles.value}>{trail.distance} Km</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.label}>Elevation Gain</Text>
                                <Text style={styles.value}>{trail.maxHeight - trail.minHeight} m</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={{ ...styles.cell, ...styles.leftCell }}>
                                <Text style={styles.label}>Difficulty</Text>
                                <Text style={styles.value}>{trail.difficulty}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.label}>Elevation Loss</Text>
                                <Text style={styles.value}>{trail.maxHeight - trail.minHeight} m</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={{ ...styles.cell, ...styles.leftCell }}>
                                <Text style={styles.label}>Min Height</Text>
                                <Text style={styles.value}>{trail.minHeight} m</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.label}>Max Height</Text>
                                <Text style={styles.value}>{trail.maxHeight} m</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={{ ...styles.cell, ...styles.leftCell }}>
                                <Text style={styles.label}>Valid From</Text>
                                <Text style={styles.value}>{formatDate(event.validFrom)}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.label}>Valid To</Text>
                                <Text style={styles.value}>{formatDate(event.validTo)}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={{ ...styles.cell, ...styles.leftCell }}>
                                <Text style={styles.label}>Duration</Text>
                                <Text style={styles.value}>{event.duration} h</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text style={styles.label}>Fees</Text>
                                <Text style={styles.value}>{event.fees} $</Text>
                            </View>
                        </View>
                    </View>
                    <Gallery
                        style={styles.gallery}
                        images={
                            photos.map(p => { return { source: { uri: p } } })
                        }
                    />
                    <Text style={styles.description}>{event.description}</Text>
                </View>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    screen: {
    },
    map: {
        width: '100%',
        height: 250,
    },
    body: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    table: {
        paddingVertical: 20
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingVertical: 10
    },
    cell: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    leftCell: {
        borderRightWidth: 1,
        borderRightColor: 'lightgrey'
    },
    label: {
        fontSize: 16,
        color: 'grey'
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    gallery: {
        height: 200,
        backgroundColor: 'black',
        marginVertical: 10
    },
    image: {
        width: 200,
        height: 150,
    },
    description: {
        fontSize: 16,
        // textAlign: 'justify'
    }
})