import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';


function formatDateMMDDYYYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

const LoanInputForm = () => {
  const [result, setResult] = useState(null);
  const [principal, setPrincipal] = useState(3000000);
  const [interestRate, setInterestRate] = useState(6);
  const [loanTerm, setLoanTerm] = useState(30);
  const [extraPayment, setExtraPayment] = useState(200);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;


  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...updatedMessages.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
            }))
          ]
        }),
      });
      const data = await response.json();
      const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiReply) {
      setChatMessages([
        ...updatedMessages,
        { role: 'assistant', content: geminiReply }
      ]);
    } else {
      setChatMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Sorry, there was an error.' }
      ]);
    }
  } catch (err) {
    setChatMessages([
      ...updatedMessages,
      { role: 'assistant', content: 'Sorry, there was an error.' }
    ]);
  }
    setChatInput('');
    setChatLoading(false);
  };
  
  const handleSubmit = async () => {
    if (!principal || !interestRate || !loanTerm) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('https://mortgage-calculator-4inptdclh-vikram-modugus-projects.vercel.app/api/mortgage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          principal: parseFloat(principal),
          interestRate: parseFloat(interestRate),
          loanTerm: parseInt(loanTerm),
          extraPayment: parseFloat(extraPayment || 0),
          startDate: formatDateMMDDYYYY(startDate),
        }),
      });

      const data = await response.json();
      console.log('typeof data:', typeof data); // Shows the datatype (usually 'object')
      console.log('data:', data);
      if (data && data.monthlyPayment) {
        console.log("response: " + data.monthlyPayment);
        setResult(data);
        Alert.alert('Result', `Monthly Payment: $${data.monthlyPayment.toFixed(2)}`);
      } else {
        Alert.alert('Error', 'Invalid response from server.');
        console.error('Invalid response:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate loan.');
      console.error(error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
       <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>🏠 Mortgage Calculator</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Original Loan Amount (Principal) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={principal}
              onChangeText={setPrincipal}
              placeholder="e.g. 250000"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Interest Rate (%) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="e.g. 4.5"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Term (in years) *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={loanTerm}
              onChangeText={setLoanTerm}
              placeholder="e.g. 30"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Additional Principal Payment</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={extraPayment}
              onChangeText={setExtraPayment}
              placeholder="e.g. 200"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Date of the Loan</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                style={{ ...styles.input, paddingVertical: 8 }}
                value={startDate.toISOString().substring(0, 10)}
                onChange={e => setStartDate(new Date(e.target.value))}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDateMMDDYYYY(startDate)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>📊 Mortgage Results</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Original Payoff Date:</Text>
                <Text style={styles.resultValue}>{result.originalPayoffDate}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>New Payoff Date:</Text>
                <Text style={styles.resultValue}>{result.payoffDate}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Interest (Original):</Text>
                <Text style={styles.resultValue}>${result.originalTotalInterest}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Interest Saved:</Text>
                <Text style={[styles.resultValue, { color: '#2ecc40' }]}>${result.interestSaved}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Time Saved:</Text>
                <Text style={styles.resultValue}>{result.monthsSaved} months ({result.yearsSaved} years)</Text>
              </View>
            </View>
          )}
          <View style={styles.chatContainer}>
            <Text style={styles.chatTitle}>💬 Chat with Mortgage Assistant</Text>
            <ScrollView style={styles.chatMessages} contentContainerStyle={{ padding: 8 }}>
              {chatMessages.map((msg, idx) => (
                <View key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                  <Text style={{
                    backgroundColor: msg.role === 'user' ? '#007AFF' : '#eee',
                    color: msg.role === 'user' ? '#fff' : '#222',
                    borderRadius: 8,
                    padding: 8,
                    maxWidth: 250,
                  }}>
                    {msg.content}
                  </Text>
                </View>
              ))}
              {chatLoading && <Text style={{ color: '#888' }}>Thinking...</Text>}
            </ScrollView>
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask me anything about mortgages..."
                onSubmitEditing={sendChatMessage}
                editable={!chatLoading}
              />
              <TouchableOpacity style={styles.chatSendButton} onPress={sendChatMessage} disabled={chatLoading}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  
};

export default LoanInputForm;
