import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';


import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState([]);
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      if (dados) {
        setRegistros(dados);
      }
      setLoading(false);
    };
    init();
  }, []);


  const handleSave = async (diadedieta, diadeacademia, diadenutrisionista) => {
    const dietaNum = parseFloat(String(diadedieta).replace(',', '.')) || 0;
    const academiaNum = parseFloat(String(diadeacademia).replace(',', '.')) || 0;
    const nutricionistaNum = parseFloat(String(diadenutrisionista).replace(',', '.')) || 0;


    let registrosAtualizados = [];


    if (editingId) {
      registrosAtualizados = registros.map(reg =>
        reg.id === editingId
          ? { ...reg, dieta: dietaNum, academia: academiaNum, nutricionista: nutricionistaNum }
          : reg
      );
    } else {
      const novoRegistro = {
        id: new Date().getTime(),
        dieta: dietaNum,
        academia: academiaNum,
        nutricionista: nutricionistaNum
      };
      registrosAtualizados = [...registros, novoRegistro];
    }


    setRegistros(registrosAtualizados);
    await Database.salvarDados(registrosAtualizados);
    setEditingId(null);
  };


  const handleDelete = async (id) => {
    const novosRegistros = registros.filter(reg => reg.id !== id);
    setRegistros(novosRegistros);
    await Database.salvarDados(novosRegistros);
  };


  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };


  const handleCancel = () => {
    setEditingId(null);
  };


  const exportarDados = async () => {
    const fileUri = Database.fileUri;
    if (Platform.OS === 'web') {
        if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
        const jsonString = JSON.stringify(registros, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
        URL.revokeObjectURL(url);
    } else {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
        if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
        await Sharing.shareAsync(fileUri);
    }
  };


  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3498db" /></View>;
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Minha Vida em Números</Text>
        <Text style={styles.subtituloApp}>App Componentizado</Text>


        <Formulario
          onSave={handleSave}
          onCancel={handleCancel}
          registroEmEdicao={registros.find(r => r.id === editingId) || null}
        />


        <ListaRegistros
          registros={registros}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />


        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar "Banco de Dados"</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#f0f4f7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#1e3a5f' },
  subtituloApp: { textAlign: 'center', fontSize: 16, color: '#555', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  botaoExportar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

