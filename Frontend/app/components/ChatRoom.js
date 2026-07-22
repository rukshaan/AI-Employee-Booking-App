import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import Client from '../api/Client';
import { useLogin } from '../context/LoginProvider';

// Connect to backend IP (change to your local IP or backend URL)
// Note: Expo might need specific IP if running on physical device
const SOCKET_URL = 'http://192.168.1.100:8080'; // Update this to match Client base URL

const ChatRoom = ({ route, navigation }) => {
    const { bookingId, title } = route.params;
    const { profile } = useLogin();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const socketRef = useRef(null);
    const flatListRef = useRef();

    useEffect(() => {
        // Load old messages
        const loadMessages = async () => {
            try {
                const res = await Client.get(`/chat/${bookingId}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Error loading messages", err);
            }
        };
        loadMessages();

        // Initialize socket
        socketRef.current = io(Client.defaults.baseURL.replace('/api', ''));
        
        socketRef.current.emit('join_room', bookingId);

        socketRef.current.on('receive_message', (newMsg) => {
            setMessages((prev) => [...prev, newMsg]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [bookingId]);

    const sendMessage = () => {
        if (!inputText.trim()) return;
        
        const msgData = {
            senderId: profile.id,
            senderType: profile.age !== undefined ? 'employer' : 'employee', // HACK to differentiate since both use profile object
            receiverId: 0, // Receiver ID can be explicitly passed if needed
            text: inputText.trim(),
            bookingId: bookingId
        };
        
        socketRef.current.emit('send_message', msgData);
        setInputText('');
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === profile.id;
        return (
            <View style={[styles.msgContainer, isMe ? styles.myMsg : styles.theirMsg]}>
                <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>{item.text}</Text>
                <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>{title || "Chat Room"}</Text>
            </View>
            
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 15 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    backBtn: { fontSize: 24, marginRight: 15, color: '#000' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    msgContainer: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 10 },
    myMsg: { alignSelf: 'flex-end', backgroundColor: '#000', borderBottomRightRadius: 0 },
    theirMsg: { alignSelf: 'flex-start', backgroundColor: '#e5e7eb', borderBottomLeftRadius: 0 },
    msgText: { fontSize: 16 },
    myMsgText: { color: '#fff' },
    theirMsgText: { color: '#000' },
    timeText: { fontSize: 10, color: '#9ca3af', alignSelf: 'flex-end', marginTop: 4 },
    inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
    sendButton: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20 },
    sendButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default ChatRoom;
