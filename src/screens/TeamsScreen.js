import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from '../styles/GlobalStyles';
import SideMenu from '../components/SideMenu';
import CustomButton from '../components/CustomButton';

const TeamsScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamDifference, setTeamDifference] = useState(null);
  const [isSorted, setIsSorted] = useState(false);

  // Função para buscar jogadores armazenados
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const storedPlayers = await AsyncStorage.getItem('players');
        const parsedPlayers = storedPlayers ? JSON.parse(storedPlayers) : [];
        setPlayers(parsedPlayers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlayers();
  }, []);

  // Função para alternar a seleção de jogadores
  const togglePlayerSelection = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Função para calcular a média das notas dos jogadores de um time
  const calculateAverage = (team) => {
    const totalScore = team.reduce((sum, player) => sum + parseFloat(player.score), 0);
    return totalScore / team.length;
  };

  // Função para gerar todas as combinações possíveis de times
  const generateCombinations = (players, teamSize) => {
    const allCombinations = [];
    const numTeams = players.length / teamSize;

    const helper = (currentTeams, remainingPlayers) => {
      if (currentTeams.length === numTeams) {
        allCombinations.push(currentTeams);
        return;
      }

      for (let i = 0; i <= remainingPlayers.length - teamSize; i++) {
        const newTeam = remainingPlayers.slice(i, i + teamSize);
        helper([...currentTeams, newTeam], [
          ...remainingPlayers.slice(0, i),
          ...remainingPlayers.slice(i + teamSize),
        ]);
      }
    };

    helper([], players);
    return allCombinations;
  };

  // Função para encontrar a melhor combinação de times (menor diferença entre as médias)
  const findBestCombination = (players, teamSize) => {
    const allCombinations = generateCombinations(players, teamSize);
    let bestCombination = null;
    let minDifference = Infinity;

    allCombinations.forEach((combination) => {
      const teamAverages = combination.map((team) => calculateAverage(team));
      const maxAverage = Math.max(...teamAverages);
      const minAverage = Math.min(...teamAverages);
      const difference = maxAverage - minAverage;

      if (difference < minDifference) {
        minDifference = difference;
        bestCombination = combination;
      }
    });

    return { teams: bestCombination, difference: minDifference };
  };

  // Função para sortear os times com a menor diferença de médias
  const handleSortTeams = () => {
    const teamSize = 5;
    const numberOfPlayers = selectedPlayers.length;

    if (numberOfPlayers < teamSize || numberOfPlayers % teamSize !== 0) {
      alert(`Selecione múltiplos de 5 jogadores para formar times.`);
      return;
    }

    const { teams: sortedTeams, difference } = findBestCombination(selectedPlayers, teamSize);

    setTeams(sortedTeams);
    setTeamDifference(difference);
    setIsSorted(true);
  };

  // Função para resetar a página para o estado inicial
  const handleNewSort = () => {
    setSelectedPlayers([]);
    setTeams([]);
    setTeamDifference(null);
    setIsSorted(false);
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation} />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Image source={require('../../assets/team-icon.png')} style={styles.image} />
          <Text style={styles.title}>Selecione os jogadores</Text>

          {players.length === 0 ? (
            <Text style={styles.noPlayersText}>Nenhum jogador adicionado</Text>
          ) : (
            <FlatList
              data={players}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.playerItem,
                    selectedPlayers.includes(item) && styles.selectedPlayer,
                  ]}
                  onPress={() => togglePlayerSelection(item)}
                >
                  <Text>{item.name} - Nota: {parseFloat(item.score).toFixed(2)}</Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          )}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isSorted ? "Novo Sorteio" : "Sortear Times"}
              onPress={isSorted ? handleNewSort : handleSortTeams}
              disabled={!isSorted && (selectedPlayers.length < 5 || selectedPlayers.length % 5 !== 0)}
            />
          </View>
          {teams.length > 0 && (
            <View style={styles.teamsContainer}>
              {teams.map((team, index) => (
                <View key={index} style={styles.team}>
                  <Text style={styles.teamTitle}>Time {index + 1} - Média: {calculateAverage(team).toFixed(2)}</Text>
                  {team.map((player, idx) => (
                    <Text key={idx} style={styles.playerText}>{player.name} - Nota: {parseFloat(player.score).toFixed(2)}</Text>
                  ))}
                </View>
              ))}
              {teamDifference !== null && (
                <Text style={styles.differenceText}>Maior diferença entre as médias: {teamDifference.toFixed(3)}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    tintColor: '#084b0f',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#084b0f',
  },
  playerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedPlayer: {
    backgroundColor: '#84e184',
  },
  playerText: {
    fontSize: 18,
  },
  teamsContainer: {
    marginTop: 20,
  },
  team: {
    marginBottom: 20,
  },
  teamTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noPlayersText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginVertical: 20,
  },
  differenceText: {
    fontSize: 18,
    color: '#084b0f',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center', 
    marginVertical: 20,
  },
});

export default TeamsScreen;
