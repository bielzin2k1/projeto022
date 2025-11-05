import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Data não disponível';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'Sem data';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: ptBR 
  });
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculateWinRate(victories: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((victories / total) * 100);
}

export function getActionTypeEmoji(type: string): string {
  const emojis: { [key: string]: string } = {
    Pequeno: '🔹',
    Médio: '🔸',
    Grande: '🔺',
  };
  return emojis[type] || '⚡';
}

export function getResultEmoji(result: string): string {
  const emojis: { [key: string]: string } = {
    Vitória: '✅',
    Derrota: '❌',
    Cancelada: '⚠️',
  };
  return emojis[result] || '❓';
}

export function playNotificationSound() {
  if (typeof window !== 'undefined') {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Handle autoplay restrictions
      console.log('Could not play sound');
    });
  }
}

export function playSuccessSound() {
  if (typeof window !== 'undefined') {
    const audio = new Audio('/sounds/success.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      console.log('Could not play sound');
    });
  }
}

