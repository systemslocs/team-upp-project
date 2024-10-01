import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage
import { GlobalStyles } from '../styles/GlobalStyles';
import SideMenu from '../components/SideMenu';
import CustomButton from '../components/CustomButton';

const TeamsScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamDifference, setTeamDifference] = useState(null);
  const [isSorted, setIsSorted] = useState(false); // Nova variável para controlar o status do sorteio

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
      alert('Selecione pelo menos 10 jogadores e a quantidade necessária para formar times de 5.');
      return;
    }

    // Encontra a melhor combinação de times que minimiza a diferença entre as médias
    const { teams: generatedTeams, difference } = findBestTeamsCombination(selectedPlayers, 5);

    // Atualiza o estado dos times e da diferença
    setTeams(generatedTeams);
    setTeamDifference(difference);
    setIsSorted(true); // Marca o sorteio como concluído
  };

  // Função para resetar a página para o estado inicial
  const handleNewSort = () => {
    setSelectedPlayers([]);  // Reseta a seleção de jogadores
    setTeams([]);            // Reseta os times
    setTeamDifference(null);  // Reseta a diferença das médias
    setIsSorted(false);       // Volta ao estado inicial
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
            scrollEnabled={false} // Desabilita o scroll do FlatList para evitar conflito com o ScrollView
          />
        )}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isSorted ? "Novo Sorteio" : "Sortear Times"} // Muda o título do botão
            onPress={isSorted ? handleNewSort : handleSortTeams} // Alterna entre o sorteio e o reset
            disabled={!isSorted && (selectedPlayers.length < 10 || selectedPlayers.length % 5 !== 0)} // Desabilita o botão se não houver sorteio e seleção inválida
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
