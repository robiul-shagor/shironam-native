import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Privecy = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Privecy Policy</Text>
            <View>
                <Text style={styles.text}>Humans are the most complete of living beings. But he is born as the most imperfect. The tiger bear derives its livelihood from the storehouse of nature. People come to Jivarangbhoomi with two empty hands clenched into fists. Even before the arrival of humans, nature's turn to create life has come to an end. With huge flesh, hard armour, huge tail, the body of Prithul in the water and on the land was strong and tired. The proof is that the defeat of excess is inevitable. Experiments also determined that the greater the indulgence, the worse the vulnerability burden. In the new phase, nature kept itself in the background by reducing human allocation as much as possible. People have to look very small, but that's just a trick. In this life cycle, greatness has turned into greatness. In the universe the beasts were vastly solitary, the people a far-flung multitude.</Text>
            </View>
        </View>
    )
}

export default Privecy

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