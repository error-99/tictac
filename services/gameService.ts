
// A public WebSocket echo server for demonstration purposes.
// All messages are broadcast to all connected clients.
const WEBSOCKET_URL = 'wss://socketsbay.com/wss/v2/1/demo/';

type MessageCallback = (data: any) => void;

class GameService {
    private ws: WebSocket | null = null;
    private messageCallback: MessageCallback | null = null;
    private messageQueue: string[] = [];
    private isConnecting = false;

    connect(callback: MessageCallback) {
        this.messageCallback = callback;
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.ws = new WebSocket(WEBSOCKET_URL);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnecting = false;
            // Send any messages that were queued while connecting
            this.messageQueue.forEach(msg => this.ws?.send(msg));
            this.messageQueue = [];
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Added an app identifier to filter out irrelevant messages on the public channel
                if (data.app === 'gemini-tic-tac-toe' && this.messageCallback) {
                    this.messageCallback(data);
                }
            } catch (error) {
                // Silently ignore messages that are not valid JSON or not for this app
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnecting = false;
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.ws = null;
            this.isConnecting = false;
        };
    }

    send(data: object) {
        // Wrap the message with an app identifier
        const message = JSON.stringify({ app: 'gemini-tic-tac-toe', ...data });

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            // If the connection is not open, queue the message
            this.messageQueue.push(message);
            // And attempt to connect if not already doing so
            if (!this.isConnecting) {
                this.connect(this.messageCallback!);
            }
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const gameService = new GameService();
