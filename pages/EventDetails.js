import { StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { getBaseUrl } from '../actions/actions'
// import MapView from 'react-native-maps'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import Gallery from 'react-native-image-gallery';

export default function EventDetails({ route }) {

    const { event, navigation } = route.params;

    const [milestones, setMilestones] = useState([{ location: '0, 0', photos: [], type: '' }])
    const [directionCoords, setDirectionCoords] = useState([])
    const [trail, setTrail] = useState({ name: '', distance: 0, minHeight: 0, maxHeight: 0, difficulty: 'Moderate', description: '' })
    const [region, setRegion] = useState({
        latitude: 33.8938,
        longitude: 35.8518,
        latitudeDelta: 0.07,
        longitudeDelta: 0.07,
    })
    // const [photos, setPhotos] = useState([{ myFile: '' }])

    // const milestoneToDirectionCoord = (milestone) => {
    //     return ({
    //         latitude: +milestone.location.split(',')[1],
    //         longitude: +milestone.location.split(',')[0],
    //     })
    // }

    const srtingToCoordinate = (str) => {
        return ({
            latitude: +str.split(',')[0],
            longitude: +str.split(',')[1],
        })
    }

    const milestoneToMarker = (milestone, index) => {
        let color = ''
        switch (milestone.type) {
            case 'On The Trail':
                color = 'orange'
                break
            case 'End':
                color = 'red'
                break
            case 'Start':
                color = 'green'
                break
            default:
                color = 'green'
        }
        return (<Marker
            key={index}
            coordinate={srtingToCoordinate(milestone.location)}
            title={milestone.name + '/' + milestone.type}
            pinColor={color}
        // description={milestone.description}
        // image={milestone.photos[0]}
        />)
    }

    const getStartMilestone = (list) => {
        let start = list.find(m => m.type === 'Start')
        if (!start) start = { ...list[0], type: 'Start' }
        return start
    }

    const getEndMilestone = (list) => {
        let end = list.find(m => m.type === 'End')
        if (!end) end = { ...list[list.length - 1], type: 'End' }
        return end
    }

    const coordsToMarker = (coords, index) => {
        return (<Marker
            key={index}
            coordinate={{
                latitude: coords[1],
                longitude: coords[0]
            }}
        // title={index}
        // description={milestone.description}
        // image={milestone.photos[0]}
        />)
    }

    const directionURL = 'https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484d13fef796ec42b3990cd840de80665e&'

    // 'start=35.847662,34.446513&end=35.831252,34.436347'

    useEffect(
        async () => {
            const apiURL = getBaseUrl()
            await fetch(apiURL + '/trails', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: event.trail })
            })
                .then(res => res.json())
                .then(data => {
                    setTrail(data)
                })
                .catch(error => console.error(error))
            await fetch(apiURL + '/milestones', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ trail: event.trail })
            })
                .then(res => res.json())
                .then(async milestonesRes => {
                    milestonesRes = [
                        getStartMilestone(milestonesRes),
                        ...milestonesRes.filter(m => m !== getStartMilestone(milestonesRes) && m !== getEndMilestone(milestonesRes)),
                        getEndMilestone(milestonesRes)
                    ]
                    setMilestones(milestonesRes)
                    setRegion({ ...region, ...srtingToCoordinate(getStartMilestone(milestonesRes).location) })
                    // console.log(milestonesRes)

                    for (let i = 0; i < milestonesRes.length - 1; i++) {
                        const url = directionURL +
                            `start=${srtingToCoordinate(milestonesRes[i].location).longitude}` +
                            `,${srtingToCoordinate(milestonesRes[i].location).latitude}` +
                            `&end=${srtingToCoordinate(milestonesRes[i + 1].location).longitude}` +
                            `,${srtingToCoordinate(milestonesRes[i + 1].location).latitude}`
                        // console.log(url)
                        await fetch(url)
                            .then(res => res.json())
                            .then(data => {
                                setDirectionCoords(p => [...p, ...data.features[0].geometry.coordinates])
                                // console.log(data.features[0].geometry.coordinates)
                            })
                            .catch(error => console.error(error))
                    }

                })
                .catch(error => console.error(error))

            // for (const photoId of event.photos) {
            //     console.log(`downloading: ${photoId}`)
            //     await fetch(apiURL + '/photos', {
            //         method: 'POST',
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({ _id: photoId })
            //     })
            //         .then(res => res.json())
            //         .then(photo => {
            //             setPhotos(p => [...p, photo.myFile])
            //             console.log(`download finished: ${photoId}`)
            //         })
            // }
        },
        []
    )

    // useEffect(
    //     async () => {
    //         if (photos.length > 0) return
    //         const apiURL = getBaseUrl()
    //         for (const photoId of event.photos) {
    //             console.log(`downloading: ${photoId}`)
    //             await fetch(apiURL + '/photos', {
    //                 method: 'POST',
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ _id: photoId })
    //             })
    //                 .then(res => res.json())
    //                 .then(photo => {
    //                     setPhotos(p => [...p, photo.myFile])
    //                     console.log(`download finished: ${photoId}`)
    //                 })
    //         }
    //     },
    //     []
    // )


    return (
        <ScrollView>
            <View style={styles.screen}>
                {/* <Text>EventDetails</Text> */}
                <MapView
                    style={styles.map}
                    region={region}
                >
                    {milestones.map((milestone, index) => (
                        milestoneToMarker(milestone, index)
                    ))}
                    {/* <Polyline
                    coordinates={milestones.map(m => srtingToCoordinate(m.location))}
                    strokeWidth={6}
                    strokeColor='#5fa'

                /> */}
                    <Polyline
                        coordinates={directionCoords.map(coords => {
                            return {
                                latitude: coords[1],
                                longitude: coords[0]
                            }
                        })}
                        strokeWidth={6}
                        strokeColor='#f00'

                    />
                    {/* {directionCoords.map((coords, index) => (
                    coordsToMarker(coords, index)
                ))} */}
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
                    </View>
                    {/* <Gallery
                        style={styles.gallery}
                        images={photos.length===0?
                            [{ source: { uri: '../components/logo.jpg' } }]:
                            photos.map(p => { return { source: { uri: p } } })}
                    /> */}
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
    description: {
        fontSize: 16,
        // textAlign: 'justify'
    }
})