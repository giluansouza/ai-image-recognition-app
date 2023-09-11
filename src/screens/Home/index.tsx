import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { styles } from './styles';

import { Tip } from '../../components/Tip';
import { Item, ItemProps } from '../../components/Item';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import { Loading } from '../../components/Loading';
import { foodContains } from '../../utils/foodContains';

export function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('Precisamos de acesso a sua galeria para continuar.');
      }

      setIsLoading(true)

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      })

      if (response.canceled) {
        return 
      }

      if (!response.canceled) {
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: { width: 900 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          }
        )
        setSelectedImageUri(imgManipuled.uri)
        foodDetect(imgManipuled.base64)
      }


    } catch (error) {
      console.log(error);
    }
  }

  async function foodDetect(imageBase64: string | undefined) {

    setIsLoading(false)
    const response = await api
      .post(`https://api.clarifai.com/v2/models/${process.env.EXPO_PUBLIC_API_MODEL_ID}/outputs`,{
        "user_app_id": {
            "user_id": process.env.EXPO_PUBLIC_API_USER_ID,
            "app_id": process.env.EXPO_PUBLIC_API_APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                      "base64": imageBase64
                    }
                }
            }
        ]
    })

    const concepts = response.data.outputs[0].data.concepts.map((concept: any) => {
      return {
        name: concept.name,
        percentage: `${(concept.value * 100).toFixed(2)}%`
      }
    })
    const isVegetable = foodContains('vegetable', concepts)
    setMessage(isVegetable ? 'Seu prato é saudável' : 'Seu prato não é saudável')
    setItems(concepts)
    // console.log(response);
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading}/>

      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          :
          <Text style={styles.description}>
            Selecione a foto do seu prato para analizar!
          </Text>
      }

      <View style={styles.bottom}>
        {isLoading ? <Loading /> :
          <>
            {message && <Tip message={message} />}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
              <View style={styles.items}>
                {items.map((item: ItemProps) => (
                  <Item key={item.name} data={item} />
                  ))}
              </View>
            </ScrollView>
          </>
        }
      </View>
    </View>
  );
}