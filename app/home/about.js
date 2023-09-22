import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
const About = () => {
    const { langMode, baseURL } = useAuth();
    const [ about, setAbout ] = useState('');
    const [ loading, setLoading ] = useState(true);

    const getAboutData = async(retryCount = 3, delay = 1000) => {
        try {
            await axios.get('/about-settings', {})
            .then(res => {
                setAbout( JSON.parse(res.data[0].value) )
            });
        } catch (error) {
            if (retryCount > 0 && error.response?.status === 429) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                getAboutData(retryCount - 1, delay * 2); 
            } if (retryCount > 0 && error.response?.status === 500) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                getAboutData(retryCount - 1, delay * 2); 
            } else {
                console.log(error);
                setLoading(false);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        getAboutData();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{ langMode == 'BN' ? about.about_page_title_bn : about.about_page_title_en}</Text>
            <View>
                <Text style={styles.text}>Humans are the most complete of living beings. But he is born as the most imperfect. The tiger bear derives its livelihood from the storehouse of nature. People come to Jivarangbhoomi with two empty hands clenched into fists. Even before the arrival of humans, nature's turn to create life has come to an end. With huge flesh, hard armour, huge tail, the body of Prithul in the water and on the land was strong and tired. The proof is that the defeat of excess is inevitable. Experiments also determined that the greater the indulgence, the worse the vulnerability burden. In the new phase, nature kept itself in the background by reducing human allocation as much as possible. People have to look very small, but that's just a trick. In this life cycle, greatness has turned into greatness. In the universe the beasts were vastly solitary, the people a far-flung multitude.</Text>
            </View>
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    text: {
        lineHeight: 25
    }
})