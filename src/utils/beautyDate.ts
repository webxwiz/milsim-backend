export default function formatBeautifulDate(uglyDate: Date): string {
    const months: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Преобразовать строку в объект Date
    const date: Date = new Date(uglyDate);
  
    // Извлечь день, месяц и год из объекта Date
    const day: number = date.getDate();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();
  
    // Сформировать красивую дату и вернуть ее
    const beautifulDate: string = `${months[month]} ${day}, ${year}`;
    return beautifulDate;
  }