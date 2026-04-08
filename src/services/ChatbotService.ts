import axios from 'axios';

const CHATBOT_ENDPOINT = '/api/chatbot/message';
const CHATBOT_TIMEOUT_MS = 5000;

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

export interface ChatResponse {
    message: string;
    conversationId: string;
    success: boolean;
}

const normalizeMessage = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

class ChatbotServiceClass {
    private conversationId: string | null = null;

    private createBotMessage(text: string): ChatMessage {
        return {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            timestamp: new Date(),
        };
    }

    private getInstantReply(message: string): ChatMessage | null {
        const normalizedMessage = normalizeMessage(message);

        const replyMap = [
            {
                keywords: ['que focaccias tienen', 'focaccias tienen', 'menu', 'focaccias'],
                text: 'Podés ver las focaccias disponibles en la sección "Nuestras Focaccias" de esta misma página. Ahí vas a encontrar variedades, precios y cuáles están destacadas. 🍕',
            },
            {
                keywords: ['veganas', 'vegana', 'vegetar'],
                text: 'Sí, tenemos opciones aptas para quienes buscan alternativas sin carne. Revisá la etiqueta correspondiente en cada focaccia del menú para elegir la ideal. 🌱',
            },
            {
                keywords: ['cuanto cuesta', 'precio', 'precios', 'sale'],
                text: 'Los precios se muestran directamente en cada tarjeta del menú para que puedas verlos al instante. Si querés, elegí tu favorita y te guiamos con el pedido. 💰',
            },
            {
                keywords: ['como hago un pedido', 'como pedir', 'pedido'],
                text: 'Podés hacer tu pedido por WhatsApp o por Instagram DM. Tomamos pedidos para el finde y conviene confirmarlo con anticipación. 🛒',
            },
            {
                keywords: ['delivery', 'envio', 'retiro'],
                text: 'Hacemos entregas en zonas de Mar del Plata y también contamos con opción de retiro. 🚚',
            },
            {
                keywords: ['ingredientes', 'usan', 'que trae'],
                text: 'Cada focaccia detalla sus ingredientes en la tarjeta del menú para que puedas revisar sabores y combinaciones antes de pedir. 🌿',
            },
            {
                keywords: ['horario', 'horarios', 'cuando atienden'],
                text: 'Para coordinar horarios y disponibilidad, escribinos por WhatsApp o Instagram y te respondemos con la info actualizada. 🕐',
            },
            {
                keywords: ['donde estan', 'ubicacion', 'mar del plata'],
                text: 'Estamos en Mar del Plata. También podés encontrarnos en Instagram como @crosti.focaccias para coordinar tu pedido. 📍',
            },
        ];

        const match = replyMap.find((reply) =>
            reply.keywords.some((keyword) => normalizedMessage.includes(keyword))
        );

        return match ? this.createBotMessage(match.text) : null;
    }

    /**
     * Envía un mensaje al chatbot y obtiene respuesta
     */
    async sendMessage(message: string): Promise<ChatMessage> {
        const instantReply = this.getInstantReply(message);

        if (instantReply) {
            return instantReply;
        }

        try {
            const request: ChatRequest = {
                message,
                conversationId: this.conversationId || undefined
            };

            const response = await axios.post<ChatResponse>(
                CHATBOT_ENDPOINT,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: CHATBOT_TIMEOUT_MS
                }
            );

            this.conversationId = response.data.conversationId;

            return this.createBotMessage(response.data.message);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error al comunicarse con el chatbot:', {
                    status: error.response?.status,
                    message: error.message,
                });
            } else {
                console.error('Error inesperado en el chatbot:', error);
            }

            return this.createBotMessage(
                'Estoy con demoras para conectarme ahora mismo. Mientras tanto, podés ver el menú, escribirnos por WhatsApp o intentarlo nuevamente en un momento. 🤖'
            );
        }
    }

    /**
     * Reinicia la conversación
     */
    resetConversation(): void {
        this.conversationId = null;
    }

    /**
     * Obtiene un mensaje de bienvenida
     */
    getWelcomeMessage(): ChatMessage {
        return {
            id: 'welcome',
            text: '¡Hola! 👋 Soy el asistente virtual de Crosti Focaccias.\n\nPuedes escribir tu pregunta o seleccionar una de las opciones de abajo:',
            sender: 'bot',
            timestamp: new Date()
        };
    }
}

export const ChatbotService = new ChatbotServiceClass();
