import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConversationService } from './../service/conversation.service';
import { MessageService } from './../service/message.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('transformMenu', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {
  conversations: any[] = [];
  filteredConversations: any[] = [];
  selectedConversation: any;
  messages: any[] = [];
  newMessage: string = '';
  isMinimized: boolean = false;
  filter: string = 'active';
  editedConversationName: string = '';
  isEditing: boolean = false;
  isLoading: boolean = false;

  constructor(
    private conversationService: ConversationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loadConversations();
  }

  ngAfterViewChecked() {
    // Esto asegura que el scroll se desplaza hasta el final después de cada actualización
    this.scrollToBottom();
  }
  // Método para hacer scroll al final del contenedor de mensajes
  scrollToBottom(): void {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  // Cargar todas las conversaciones
  loadConversations() {
    this.isLoading = true;  // Activar loading
    this.conversationService.listConversation().subscribe((data: any) => {
      this.conversations = data;
      this.filterConversations(this.filter);
      this.isLoading = false;  // Desactivar loading después de la respuesta
    }, (error) => {
      console.error("Error al cargar las conversaciones:", error);
      this.isLoading = false;  // Desactivar loading en caso de error
    });
  }

  // Filtrar conversaciones por estado
  filterConversations(status: string) {
    this.isLoading = true;  // Activar loading
    this.filter = status;
    this.conversationService.listActiveConversation(status === 'active' ? 'A' : 'I').subscribe((data: any) => {
      console.log("Datos de conversaciones:", data);
      this.filteredConversations = data;
      this.isLoading = false;  // Desactivar loading después de la respuesta
    }, (error) => {
      console.error("Error al filtrar las conversaciones:", error);
      this.isLoading = false;  // Desactivar loading en caso de error
    });
  }

  // Agregar una nueva conversación
  addConversation() {
    this.isLoading = true;  // Activar loading
    const newConversation = {
      topic: 'Nuevo Chat',
    };
    this.conversationService.newConversation(newConversation).subscribe((response: any) => {
      const createdConversation = response;
      this.selectConversation(createdConversation);
      this.loadMessages(createdConversation.conversationId);
      this.loadConversations();
      this.isLoading = false;  // Desactivar loading después de la respuesta
    }, (error) => {
      console.error("Error al agregar la conversación:", error);
      this.isLoading = false;  // Desactivar loading en caso de error
    });
  }

  togglePanel() {
    this.isMinimized = !this.isMinimized;
  }

  archive(conversation: any) {
    Swal.fire({
      title: "¿Quieres Eliminar la conversacion?",
      icon: "warning",
      color: "#ffffff",
      background: "#111111",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.conversationService.disableConversationById(conversation.conversationId).subscribe(() => {
          Swal.fire({
            title: "¡Eliminado!",
            text: "Su conversacion ha sido eliminado.",
            icon: "success",
            color: "#ffffff",
            background: "#111111"
          });
          this.loadConversations();
        }, (error) => {
          console.error("Error al archivar la conversación:", error);
        });
      }
    });
  }

  desarchive(conversation: any) {
    Swal.fire({
      title: "¿Quieres Restaurar la conversacion?",
      icon: "warning",
      color: "#ffffff",
      background: "#111111",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, restauralo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.conversationService.activateConversationById(conversation.conversationId).subscribe(() => {
          Swal.fire({
            title: "¡Restaurado!",
            text: "Su conversacion ha sido restaurado.",
            icon: "success",
            color: "#ffffff",
            background: "#111111"
          });
          this.loadConversations();
        }, (error) => {
          console.error("Error al desarchivar la conversación:", error);
        });
      }
    });
  }

  updateConversation(conversation: any) {
    this.editedConversationName = conversation.topic; // Guardar el nombre actual
    this.isEditing = true; // Activar el modo de edición
    this.selectedConversation = conversation; // Almacenar la conversación seleccionada
  }

  saveUpdatedConversation() {
    if (this.editedConversationName.trim()) {
      const updatedConversation = {
        topic: this.editedConversationName,
      };
      this.conversationService.updateConversationById(this.selectedConversation.conversationId, updatedConversation).subscribe(() => {
        Swal.fire({
          title: "¡Actualizado!",
          text: "El nombre de la conversación ha sido actualizado.",
          icon: "success",
          color: "#ffffff",
          background: "#111111"
        });
        this.loadConversations(); // Recargar la lista de conversaciones
        this.isEditing = false; // Desactivar el modo de edición
      }, (error) => {
        console.error("Error al actualizar la conversación:", error);
      });
    }
  }

  cancelEdit() {
    this.isEditing = false; // Desactivar el modo de edición
    this.editedConversationName = ''; // Limpiar el nombre editado
    this.selectedConversation = null; // Resetear la conversación seleccionada
  }

  // Seleccionar una conversación
  selectConversation(conversation: any) {
    if (this.selectedConversation && this.selectedConversation.conversationId === conversation.conversationId) {
      // Si ya está seleccionada, no hace nada
      return;
    }
    this.cancelEdit(); // Cancela la edición antes de seleccionar una nueva conversación
    this.selectedConversation = conversation;
    this.loadMessages(conversation.conversationId);
  }

  // Función para manejar los cambios de los mensajes
  loadMessages(conversationId: number) {
    this.isLoading = true;  // Activar loading
    this.messageService.listMessageConversation(conversationId).subscribe((data: any) => {
      this.messages = data;
      this.isLoading = false;  // Desactivar loading después de la respuesta
    }, (error) => {
      console.error("Error al cargar los mensajes:", error);
      this.isLoading = false;  // Desactivar loading en caso de error
    });
  }

  // Enviar un nuevo mensaje
  sendMessage() {
    if (this.newMessage.trim()) {
      this.isLoading = true;  // Activar loading
      const messageToSend = {
        conversationId: this.selectedConversation.conversationId,
        question: this.newMessage,
      };

      this.messageService.newMessage(messageToSend).subscribe(
        () => {
          this.newMessage = '';
          this.loadMessages(this.selectedConversation.conversationId);
          this.scrollToBottom(); // Asegura que el scroll vaya al final después de enviar el mensaje
          this.isLoading = false;
          this.loadConversations();
        },
        (error) => {
          console.error("Error al enviar el mensaje:", error);
          this.isLoading = false;  // Desactivar loading en caso de error
        }
      );
    }
  }

  onMessageInput() {
    // Aquí podrías añadir cualquier lógica adicional si es necesario, pero no es obligatorio.
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Evita que se inserte un salto de línea
      this.sendMessage();
    }
  }

  stopPropagation(event: MouseEvent) {
    console.log('Evento de propagación detenido.');
    event.stopPropagation();
  }

  formatAnswer(answer: string): string {
    // Convierte la sección de opciones en una lista ordenada
    if (answer.includes("Opciones:")) {
      const parts = answer.split("Opciones:");
      const options = parts[1].split('\n').filter(opt => opt.trim() !== '').map(opt => `<li>${opt.trim()}</li>`).join('');
      return `${parts[0]}<ol>${options}</ol>`;
    }
    return answer.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') // Para negritas
      .replace(/\n/g, '<br>'); // Para saltos de línea
  }
}