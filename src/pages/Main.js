import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({navigation}) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });

      setUsers(response.data);
    }
    loadUsers();
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {user: id},
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {user: id},
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Acabou :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, {zIndex: users.length - index}]}>
              <Image style={styles.avatar} source={{uri: user.avatar}} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
                <View style={styles.icons}>
                  <Text style={styles.textLike} numberOfLines={3}>
                    {user.likes.length}
                  </Text>
                  <Icon name="thumbs-up" size={18} color="#df4723" />
                  <Text style={styles.textLike} numberOfLines={3}>
                    {user.dislikes.length}
                  </Text>
                  <Icon name="thumbs-down" size={18} color="#df4723"/>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttom} onPress={handleDislike}>
          <Image source={dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttom} onPress={handleLike}>
          <Image source={like} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    marginTop: 60,
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    margin: 25,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  avatar: {
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  name: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
    marginTop: 5,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  icons: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: 'center',
    paddingVertical: 3
  },

  textLike: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },

  buttom: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
