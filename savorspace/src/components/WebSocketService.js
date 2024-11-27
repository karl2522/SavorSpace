import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                // Add any auth headers if needed
            },
            debug: function (str) {
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
    }

    connect(username, onMessageReceived) {
        this.client.onConnect = () => {
            console.log('Connected to WebSocket');
            
            // Subscribe to personal notifications
            this.client.subscribe(`/user/${username}/topic/notifications`, message => {
                const notification = JSON.parse(message.body);
                onMessageReceived(notification);
            });
        };

        this.client.activate();
    }

    disconnect() {
        this.client.deactivate();
    }
}

export default new WebSocketService();