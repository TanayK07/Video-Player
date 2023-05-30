import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Font from 'expo-font';

const API_KEY = 'AIzaSyDyBxAOgl3Lv3k1ITNAwTegHMlfp9OIRZc';
const videoLinks = [
  {
    videoId: '2GrAVlJ7Cdo',
  },
  {
    videoId: 'EEwHbIp6vHI',
  },
  {
    videoId: 'It9D08W8Z7o',
  },
];

class App extends React.Component {
  state = {
    selectedVideoLink: null,
    videoTitles: [],
    fontsLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'CM Sans Serif 2012': require('./assets/fonts/cms2012.ttf'),
    });

    this.setState({ fontsLoaded: true });

    this.fetchVideoTitles();
  }

  fetchVideoTitles = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoLinks
          .map(({ videoId }) => videoId)
          .join(',')}&key=${API_KEY}`
      );
      const json = await response.json();
      const videoTitles = json.items.map(item => item.snippet.title);
      this.setState({ videoTitles });
    } catch (error) {
      console.error('Error fetching video titles:', error);
    }
  };

  renderVideoList() {
    const { videoTitles } = this.state;
    return videoLinks.map(({ videoId }, index) => {
      const videoTitle = videoTitles[index] || `Video ${index + 1}`;
      return (
        <TouchableOpacity
          key={index}
          style={styles.videoItem}
          onPress={() => this.setState({ selectedVideoLink: videoId })}
        >
          <Text style={styles.videoTitle}>{videoTitle}</Text>
          <WebView
            style={styles.videoPlayer}
            source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
          />
        </TouchableOpacity>
      );
    });
  }
  
  render() {
    const { selectedVideoLink, fontsLoaded } = this.state;

    if (!fontsLoaded) {
      return null; // Render nothing until the fonts are loaded
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./assets/BookLine.webp')}
            style={styles.logo}
          />
          <Text style={styles.heading}>BookLine</Text>
        </View>
        <View style={styles.videoList}>{this.renderVideoList()}</View>
        {selectedVideoLink ? (
          <WebView
            style={styles.selectedVideoPlayer}
            source={{ uri: `https://www.youtube.com/embed/${selectedVideoLink}` }}
          />
        ) : (
          <Text style={styles.placeholderText}>Select a video to play</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4F92FF',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'CM Sans Serif 2012',
    color: '#FFFFFF',
  },
  videoList: {
    padding: 20,
  },
  
  videoItem: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  videoPlayerContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  videoPlayer: {
    width: '80%',
    height :'10%',
    aspectRatio: 16 / 9,
    maxWidth: 300,
    maxHeight: 200,
  },
  selectedVideoPlayer: {
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20,
    color: '#666666',
  },
});

export default App;
