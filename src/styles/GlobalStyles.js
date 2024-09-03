import { StyleSheet, Platform, StatusBar } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 22,
    color: '#084b0f',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'normal',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, 
    left: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#084b0f',
    fontSize: 16,
  },
});
