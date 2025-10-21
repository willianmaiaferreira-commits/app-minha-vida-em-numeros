import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [diadedieta,setdiadedieta] = useState('');
  const [diadeacademia,setdiadeacademia] = useState('');
  const [diadenutrisionista,setdiadenutrisionista] = useState('');


  useEffect(() => {
    if (registroEmEdicao) {
      setdiadedieta(String(registroEmEdicao.dieta));
      setdiadeacademia(String(registroEmEdicao.academia));
      setdiadenutricao(String(registroEmEdicao.nutricao));


    } else {
      setdiadedieta('');
      setdiadeacademia('');
      setdiadenutrisionista('');
    }
  }, [registroEmEdicao]);


  const handleSaveClick = () => {
    onSave(diadedieta,diadeacademia,diadenutrisionista);
  };


  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>
      <TextInput style={styles.input} placeholder="dia de dieta" keyboardType="numeric" value={diadedieta} onChangeText={setdiadedieta} />
      <TextInput style={styles.input} placeholder="Dia de academia" keyboardType="numeric" value={diadeacademia} onChangeText={setdiadeacademia} />
      <TextInput style={styles.input} placeholder="Dia de nutrisionista" keyboardType="numeric" value={diadeacademia} onChangeText={setdiadenutrisionista} />


      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>


      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
    card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
    subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
    input: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
    botao: { backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    botaoCancelar: { backgroundColor: '#7f8c8d', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});
