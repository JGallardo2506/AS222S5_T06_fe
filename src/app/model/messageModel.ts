// message.model.ts
export interface Message {
    id: number;
    conversation_id: number;
    question: string;
    answer: string;
    date_time: string;
}