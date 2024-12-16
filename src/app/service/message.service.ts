import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageUpdate = new Subject<any[]>();
  constructor(private http: HttpClient) { }
  // Listar mensajes completos
  listMessage() {
    return this.http.get(`${environment.apiUrl}/service/message`);
  }
  // Listar mensajes por id
  listMessageId(MessageId: number) {
    return this.http.get(`${environment.apiUrl}/service/message/id/${MessageId}`, {});
  }
  //Listado mensajes de una conversacion
  listMessageConversation(conversationId: number) {
    return this.http.get(`${environment.apiUrl}/service/message/conversation/${conversationId}`);
  }

  // Eliminar mensaje fisicamente por ID
  deleteConversation(MessageId: number) {
    return this.http.delete(`${environment.apiUrl}/service/message/${MessageId}`, {});
  }
  // Eliminar conversacion mas sus mensajes por id de la conversacion
  disableConversationMessageById(ConversationId: number) {
    return this.http.delete(`${environment.apiUrl}/service/message/conversation/${ConversationId}`, {});
  }
  // Editar mensaje por ID
  updateMessageById(MessageId: number, updatedMessage: any) {
    return this.http.put(`${environment.apiUrl}/service/message/update/${MessageId}`, updatedMessage);
  }
  // Insertar mensaje
  newMessage(newMessage: any) {
    return this.http.post(`${environment.apiUrl}/service/message/save`, newMessage);
  }
}
