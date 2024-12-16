import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  conversationUpdate = new Subject<any[]>();
  constructor(private http: HttpClient) { }
  // Listar conversaciones completas
  listConversation() {
    return this.http.get(`${environment.apiUrl}/service/conversation`);
  }
  // Listar conversaciones por id
  listConversationId(ConversationId: number) {
    return this.http.get(`${environment.apiUrl}/service/conversation/id/${ConversationId}`, {});
  }
  //Listado de conversaciones activo y inactivos
  listActiveConversation(status: String) {
    return this.http.get(`${environment.apiUrl}/service/conversation/active/${status}`);
  }
  // Eliminar conversacion fisicamente por ID
  deleteConversation(ConversationId: number) {
    return this.http.delete(`${environment.apiUrl}/service/conversation/delete/${ConversationId}`, {});
  }
  // Eliminar conversacion lógicamente por ID
  disableConversationById(ConversationId: number) {
    return this.http.post(`${environment.apiUrl}/service/conversation/delete/${ConversationId}`, {});
  }
  // Resturar conversacion lógicamente por ID
  activateConversationById(ConversationId: number) {
    return this.http.post(`${environment.apiUrl}/service/conversation/restore/${ConversationId}`, {});
  }
  // Editar conversacion por ID
  updateConversationById(ConversationId: number, updatedConversation: any) {
    return this.http.put(`${environment.apiUrl}/service/conversation/update/${ConversationId}`, updatedConversation);
  }
  // Insertar conversacion
  newConversation(newConversation: any) {
    return this.http.post(`${environment.apiUrl}/service/conversation/save`, newConversation);
  }
}
