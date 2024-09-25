import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/CustomButton';
import SideMenu from '../components/SideMenu';

const TeamsScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamDifference, setTeamDifference] = useState(null);

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
  const generateTeamsCombinations = (players, teamSize) => {
    const result = [];
    const numberOfTeams = Math.floor(players.length / teamSize);
    
    const generateCombinations = (currentTeams, remainingPlayers) => {
      if (currentTeams.length === numberOfTeams) {
        result.push(currentTeams);
        return;
      }
      for (let i = 0; i <= remainingPlayers.length - teamSize; i++) {
        const newTeam = remainingPlayers.slice(i, i + teamSize);
        generateCombinations([...currentTeams, newTeam], [
          ...remainingPlayers.slice(0, i),
          ...remainingPlayers.slice(i + teamSize),
        ]);
      }
    };

    generateCombinations([], players);
    return result;
  };

  // Função para encontrar a combinação de times com a menor diferença entre as médias
  const findBestTeamsCombination = (players, teamSize) => {
    const combinations = generateTeamsCombinations(players, teamSize);
    let bestCombination = null;
    let minDifference = Infinity;

    combinations.forEach((combination) => {
      const averages = combination.map((team) => calculateAverage(team));
      const maxAverage = Math.max(...averages);
      const minAverage = Math.min(...averages);
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
    if (selectedPlayers.length < 10 || selectedPlayers.length % 5 !== 0) {
      alert('Selecione pelo menos 10 jogadores e certifique-se de que o número seja múltiplo de 5');
      return;
    }

    // Encontra a melhor combinação de times que minimiza a diferença entre as médias
    const { teams: generatedTeams, difference } = findBestTeamsCombination(selectedPlayers, 5);

    // Atualiza o estado dos times e da diferença
    setTeams(generatedTeams);
    setTeamDifference(difference);
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation} />
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
          />
        )}

        <CustomButton
          title="Sortear Times"
          onPress={handleSortTeams}
          disabled={selectedPlayers.length < 10 || selectedPlayers.length % 5 !== 0}
        />

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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    tintColor: '#084b0f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
});

export default TeamsScreen;
