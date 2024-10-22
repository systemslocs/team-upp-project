import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SideMenu from '../components/SideMenu';

const MatchItem = ({ match, onUpdateScore, onDelete, onStartTimer, onPauseResumeTimer, timer, isRunning, isPaused }) => {
  return (
    <View style={styles.matchContainer}>
      <View style={styles.teamsRow}>
        <TextInput
          style={styles.teamName}
          value={match.team1Name}
          onChangeText={(text) => onUpdateScore(match.id, 'team1Name', text)}
        />
        <TouchableOpacity onPress={() => onUpdateScore(match.id, 'team1Score')}>
          <Text style={styles.score}>{match.team1Score}</Text>
        </TouchableOpacity>
        <Text style={styles.score}>x</Text>
        <TouchableOpacity onPress={() => onUpdateScore(match.id, 'team2Score')}>
          <Text style={styles.score}>{match.team2Score}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.teamName}
          value={match.team2Name}
          onChangeText={(text) => onUpdateScore(match.id, 'team2Name', text)}
        />
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timer}</Text>
        <View style={styles.timerButtons}>
          <TouchableOpacity onPress={() => onStartTimer(match.id)} style={styles.timerButtonStart}>
            <Text>Iniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPauseResumeTimer(match.id)} style={styles.timerButtonPause}>
            <Text>{isPaused ? 'Continuar' : 'Pausar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(match.id)} style={styles.trashButton}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MatchesScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [timers, setTimers] = useState({});
  const [timerStatus, setTimerStatus] = useState({});
  const [isPaused, setIsPaused] = useState({});

  const addNewMatch = () => {
    const newMatch = {
      id: Date.now().toString(),
      team1Name: 'Time 1',
      team2Name: 'Time 2',
      team1Score: 0,
      team2Score: 0,
    };
    setMatches([...matches, newMatch]);
    setTimers((prev) => ({ ...prev, [newMatch.id]: '00:00' }));
    setTimerStatus((prev) => ({ ...prev, [newMatch.id]: false }));
    setIsPaused((prev) => ({ ...prev, [newMatch.id]: false }));
  };

  const updateScore = (matchId, field, value) => {
    const updatedMatches = matches.map((match) => {
      if (match.id === matchId) {
        if (field === 'team1Score') return { ...match, team1Score: match.team1Score + 1 };
        if (field === 'team2Score') return { ...match, team2Score: match.team2Score + 1 };
        return { ...match, [field]: value };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const deleteMatch = (matchId) => {
    setMatches(matches.filter((match) => match.id !== matchId));
    const updatedTimers = { ...timers };
    delete updatedTimers[matchId];
    setTimers(updatedTimers);
    const updatedStatus = { ...timerStatus };
    delete updatedStatus[matchId];
    setTimerStatus(updatedStatus);
    const updatedPausedStatus = { ...isPaused };
    delete updatedPausedStatus[matchId];
    setIsPaused(updatedPausedStatus);
  };

  const startTimer = (matchId) => {
    if (!timerStatus[matchId]) {
      const startTime = Date.now() - parseTime(timers[matchId]);
      const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
        setTimers((prev) => ({ ...prev, [matchId]: `${minutes}:${seconds}` }));
      }, 1000);
      setTimers((prev) => ({ ...prev, [`${matchId}_interval`]: timerInterval }));
      setTimerStatus((prev) => ({ ...prev, [matchId]: true }));
      setIsPaused((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  const pauseResumeTimer = (matchId) => {
    if (isPaused[matchId]) {
      const startTime = Date.now() - parseTime(timers[matchId]);
      const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
        setTimers((prev) => ({ ...prev, [matchId]: `${minutes}:${seconds}` }));
      }, 1000);
      setTimers((prev) => ({ ...prev, [`${matchId}_interval`]: timerInterval }));
      setTimerStatus((prev) => ({ ...prev, [matchId]: true }));
    } else {
      clearInterval(timers[`${matchId}_interval`]);
      setTimerStatus((prev) => ({ ...prev, [matchId]: false }));
    }
    setIsPaused((prev) => ({ ...prev, [matchId]: !prev[matchId] }));
  };

  const parseTime = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60000 + seconds * 1000;
  };

  return (
    <View style={styles.container}>
      <SideMenu navigation={navigation} />
      <Image source={require('../../assets/match-icon.png')} style={styles.image} />
      <Text style={styles.instructionText}>Clique para adicionar uma partida.</Text>
      <TouchableOpacity style={styles.addButton} onPress={addNewMatch}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchItem
            match={item}
            onUpdateScore={updateScore}
            onDelete={deleteMatch}
            onStartTimer={startTimer}
            onPauseResumeTimer={pauseResumeTimer}
            timer={timers[item.id] || '00:00'}
            isRunning={timerStatus[item.id] || false}
            isPaused={isPaused[item.id] || false}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.matchList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    tintColor: '#084b0f',
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 40,
    fontSize: 20,
    color: '#084b0f',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#084b0f',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
  },
  matchList: {
    flexGrow: 1,
  },
  matchContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamName: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: 100,
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerButtonStart: {
    marginHorizontal: 10,
    backgroundColor: '#84e184',
    padding: 10,
    borderRadius: 5,
  },
  timerButtonPause: {
    marginHorizontal: 10,
    backgroundColor: '#c4ac57',
    padding: 10,
    borderRadius: 5,
  },
  trashButton: {
    marginLeft: 10,
  },
});

export default MatchesScreen;
