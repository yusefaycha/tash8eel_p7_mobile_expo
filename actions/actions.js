import AsyncStorage from "@react-native-async-storage/async-storage";
import { Marker } from "react-native-maps";

const getBaseUrl = () => {
    return 'https://tash8eel-p7-api-1ad6.vercel.app/api';
}

const getDirectionURL = () => {
    return 'https://api.openrouteservice.org/v2/directions/foot-hiking?api_key=5b3ce3597851110001cf62484d13fef796ec42b3990cd840de80665e&'
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

const srtingToCoordinate = (str) => {
    return ({
        latitude: +str.split(',')[0],
        longitude: +str.split(',')[1],
    })
}

const formatDate = (date) => {
    date = date.split('-')
    return `${date[2]}/${date[1]}/${date[0]}`
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


const getMilestoneAndDirectionCoords = async (event, setMilestones, setRegion, setDirectionCoords) => {
    const apiURL = getBaseUrl()
    await fetch(apiURL + '/milestones', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ trail: event.trail })
    })
        .then(res => res.json())
        .then(async milestonesRes => {
            const start = getStartMilestone(milestonesRes)
            const end = getEndMilestone(milestonesRes)
            milestonesRes = [
                start,
                ...milestonesRes.filter(m => m._id !== start._id && m._id !== end._id),
                end
            ]
            setMilestones(milestonesRes)
            setRegion(region => { return { ...region, ...srtingToCoordinate(getStartMilestone(milestonesRes).location) } })
            getDirectionCoords(milestonesRes, setDirectionCoords)

        })
        .catch(error => console.error(error))
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
        title={milestone.name}
        pinColor={color}
    // description={milestone.description}
    // image={milestone.photos[0]}
    />)
}

const getCoverPhoto = async (event, setCover) => {
    const apiURL = getBaseUrl() + '/photos'
    const file = await AsyncStorage.getItem(event.photos[0])
    if (file !== null) {
        setCover(file)
    }
    else {
        fetch(apiURL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: event.photos[0] })
        }).then(res => res.json())
            .then(data => {
                setCover(data.myFile)
                AsyncStorage.setItem(data._id, data.myFile)
            })
    }
}

const getPhotos = async (event, setPhotos) => {
    const apiURL = getBaseUrl()
    for (const photoId of event.photos) {
        const file = await AsyncStorage.getItem(photoId)
        if (file !== null) {
            setPhotos(p => [...p, file])
        }
        else {
            console.log(`downloading: ${photoId}`)
            await fetch(apiURL + '/photos', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: photoId })
            })
                .then(res => res.json())
                .then(photo => {
                    setPhotos(p => [...p, photo.myFile])
                    AsyncStorage.setItem(photo._id, photo.myFile)
                    console.log(`download finished: ${photoId}`)
                })
                .catch(error => console.error(error))
        }
    }
}

const getDirectionCoords = async (milestones, setDirectionCoords) => {
    for (let i = 0; i < milestones.length - 1; i++) {
        const url = getDirectionURL() +
            `start=${srtingToCoordinate(milestones[i].location).longitude}` +
            `,${srtingToCoordinate(milestones[i].location).latitude}` +
            `&end=${srtingToCoordinate(milestones[i + 1].location).longitude}` +
            `,${srtingToCoordinate(milestones[i + 1].location).latitude}`
        await fetch(url)
            .then(res => res.json())
            .then(data => {
                setDirectionCoords(p => [...p, ...data.features[0].geometry.coordinates])
            })
            .catch(error => console.error(error))
    }
}

const getTrail = (event, setTrail) => {
    const apiURL = getBaseUrl()
    fetch(apiURL + '/trails', {
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
}

export {
    getBaseUrl,
    getStartMilestone,
    getEndMilestone,
    srtingToCoordinate,
    formatDate,
    coordsToMarker,
    getDirectionURL,
    milestoneToMarker,
    getCoverPhoto,
    getPhotos,
    getDirectionCoords,
    getTrail,
    getMilestoneAndDirectionCoords
}