import { DateRange } from '@/types/common';
import { Events } from '@/types/events';
import { ChartDataPoint } from '@/types/financials';
import { Ticket } from '@/types/tickets';
import { eventService } from './eventService';

const TAX_RATE = 0.20;


const getPreviousDateRange = (dateRange: DateRange): DateRange | null => {
  const { startDate, endDate } = dateRange;
  if (!startDate || !endDate) return null;

  const duration = endDate.getTime() - startDate.getTime();
  const prevEndDate = new Date(startDate.getTime() - 1);
  const prevStartDate = new Date(prevEndDate.getTime() - duration);
  return { startDate: prevStartDate, endDate: prevEndDate };
};

const calculateChange = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? null : 0;
  return ((current - previous) / previous) * 100;
};

const filterDataByDateRange = (allEvents: Events[], allTickets: Ticket[], dateRange?: DateRange) => {
  if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
    return { filteredEvents: allEvents, filteredTickets: allTickets };
  }

  const start = dateRange.startDate ? new Date(dateRange.startDate.setHours(0, 0, 0, 0)) : null;
  const end = dateRange.endDate ? new Date(dateRange.endDate.setHours(23, 59, 59, 999)) : null;

  const filteredTickets = allTickets.filter(t => {
    const purchaseDate = new Date(t.createdAt);
    if (start && purchaseDate < start) return false;
    if (end && purchaseDate > end) return false;
    return true;
  });

  const filteredEvents = allEvents.filter(e => {
    const eventDate = new Date(e.start);
    if (start && eventDate < start) return false;
    if (end && eventDate > end) return false;
    return true;
  });

  const filteredEventIds = new Set(filteredEvents.map(e => e.id));
  const ticketsForFilteredEvents = filteredTickets.filter(t => filteredEventIds.has(t.eventId));

  return { filteredEvents, filteredTickets: ticketsForFilteredEvents };
};

const calculatePeriodFinancials = (events: Events[], tickets: Ticket[]) => {
  const eventMap = new Map<string, Events>(events.map(e => [e.id, e]));

  const totalIncome = tickets.reduce((acc, ticket) => {
    const event = eventMap.get(ticket.eventId);
    const ticketType = event?.ticketTypes.find(tt => tt.id === ticket.ticketTypeId);
    return acc + (ticketType?.price || 0);
  }, 0);

  const totalExpenses = events.reduce((acc, event) => acc + (event.expenses ?? 0), 0);

  const netProfit = totalIncome - totalExpenses;
  const taxes = netProfit > 0 ? netProfit * TAX_RATE : 0;

  return { totalIncome, totalExpenses, netProfit, taxes };
};

// Generate monthly chart data
const generateChartData = (events: Events[], tickets: Ticket[]): ChartDataPoint[] => {
  const eventMap = new Map<string, Events>(events.map(e => [e.id, e]));
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  // Aggregate income by month
  tickets.forEach(ticket => {
    const event = eventMap.get(ticket.eventId);
    if (!event) return;
    const ticketType = event.ticketTypes.find(tt => tt.id === ticket.ticketTypeId);
    if (!ticketType) return;

    const date = new Date(ticket.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expenses: 0 };
    monthlyData[key].income += ticketType.price;
  });

  // Aggregate expenses by month
  events.forEach(event => {
    const date = new Date(event.start);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expenses: 0 };
    monthlyData[key].expenses += event.expenses ?? 0;
  });

  return Object.entries(monthlyData)
    .map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short' });
      return {
        month: `${monthName} '${year.slice(2)}`,
        income: data.income,
        expenses: data.expenses,
        profit: data.income - data.expenses,
      };
    })
    .sort((a, b) => {
      const aDate = new Date(a.month.replace("'", "20"));
      const bDate = new Date(b.month.replace("'", "20"));
      return aDate.getTime() - bDate.getTime();
    });
};

export const financialService = {
  getSystemWideFinancials: async (dateRange?: DateRange) => {
    const [eventsRes,allTickets] = await Promise.all([
      eventService.getEvents(),
      // ticketService.getAllTickets(),
      []
    ]);

    const allEvents = eventsRes.items;
    
    const { filteredEvents: currentEvents, filteredTickets: currentTickets } =
      filterDataByDateRange(allEvents, allTickets, dateRange);

    const currentFinancials = calculatePeriodFinancials(currentEvents, currentTickets);
    const chartData = generateChartData(currentEvents, currentTickets);

    const previousDateRange = dateRange ? getPreviousDateRange(dateRange) : null;
    let previousFinancials = { totalIncome: 0, totalExpenses: 0, netProfit: 0 };
    if (previousDateRange) {
      const { filteredEvents: prevEvents, filteredTickets: prevTickets } =
        filterDataByDateRange(allEvents, allTickets, previousDateRange);
      previousFinancials = calculatePeriodFinancials(prevEvents, prevTickets);
    }

    return {
      ...currentFinancials,
      incomeChange: previousDateRange ? calculateChange(currentFinancials.totalIncome, previousFinancials.totalIncome) : null,
      expensesChange: previousDateRange ? calculateChange(currentFinancials.totalExpenses, previousFinancials.totalExpenses) : null,
      netProfitChange: previousDateRange ? calculateChange(currentFinancials.netProfit, previousFinancials.netProfit) : null,
      chartData,
    };
  },
};
