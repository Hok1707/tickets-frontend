import type { User, Event, Ticket, TicketType } from '../types';
import { Role, AccountStatus, EventStatus, TicketStatus } from '../types';

export let mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: Role.ADMIN, phone: '111-222-3333', status: AccountStatus.ACTIVE },
  { id: '2', name: 'Organizer User', email: 'organizer@example.com', role: Role.ORGANIZER, phone: '222-333-4444', status: AccountStatus.ACTIVE },
  { id: '3', name: 'Regular User', email: 'user@example.com', role: Role.USER, phone: '333-444-5555', status: AccountStatus.ACTIVE },
  { id: '4', name: 'Heng Kimhok', email: 'hengkimhok@example.com', role: Role.USER, phone: '444-555-6666', status: AccountStatus.PENDING },
  { id: '5', name: 'John Smith', email: 'john@example.com', role: Role.ORGANIZER, phone: '555-666-7777', status: AccountStatus.SUSPENDED },
  { id: '6', name: 'Staff User', email: 'staff@example.com', role: Role.STAFF, phone: '666-777-8888', status: AccountStatus.ACTIVE },
];

const mockTicketTypes: TicketType[] = [
    { id: 'tt1', eventId: '1', name: 'General Admission', price: 50, quantity: 200, validity: 'Full Event' },
    { id: 'tt2', eventId: '1', name: 'VIP Pass', price: 150, quantity: 50, validity: 'Full Event + Backstage' },
    { id: 'tt3', eventId: '2', name: 'Standard Seat', price: 30, quantity: 500, validity: 'Single Day' },
    { id: 'tt4', eventId: '3', name: 'Early Bird', price: 25, quantity: 100, validity: 'Full Weekend' },
    { id: 'tt5', eventId: '3', name: 'Weekend Pass', price: 40, quantity: 300, validity: 'Full Weekend' },
];

export let mockEvents: Event[] = [
  {
    id: '1',
    title: 'React Conference 2024',
    description: 'The biggest conference for React enthusiasts. Join us for three days of talks, workshops, and networking.',
    location: 'San Francisco, CA',
    startDate: '2024-10-22T09:00:00',
    endDate: '2024-10-24T17:00:00',
    imageUrl: 'https://picsum.photos/seed/reactconf/1200/800',
    organizerId: '2',
    ticketTypes: [mockTicketTypes[0], mockTicketTypes[1]],
    category: 'Tech Conference',
    status: EventStatus.ACTIVE,
    capacity: 500,
    contactEmail: 'contact@reactconf.com',
    expenses: 25000,
  },
  {
    id: '2',
    title: 'VueJS Summit',
    description: 'A deep dive into the Vue.js ecosystem, from core concepts to advanced patterns.',
    location: 'Amsterdam, NL',
    startDate: '2024-11-15T10:00:00',
    endDate: '2024-11-16T18:00:00',
    imageUrl: 'https://picsum.photos/seed/vueconf/1200/800',
    organizerId: '5',
    ticketTypes: [mockTicketTypes[2]],
    category: 'Tech Conference',
    status: EventStatus.ACTIVE,
    capacity: 800,
    contactEmail: 'contact@vuesummit.com',
    expenses: 18000,
  },
  {
    id: '3',
    title: 'Local Music Festival',
    description: 'Featuring the best local bands and artists. A family-friendly event with food trucks and activities.',
    location: 'City Park, Downtown',
    startDate: '2024-09-07T12:00:00',
    endDate: '2024-09-08T22:00:00',
    imageUrl: 'https://picsum.photos/seed/musicfest/1200/800',
    organizerId: '2',
    ticketTypes: [mockTicketTypes[3], mockTicketTypes[4]],
    category: 'Music Festival',
    status: EventStatus.ACTIVE,
    capacity: 2500,
    contactEmail: 'contact@musicfest.com',
    expenses: 12500,
  },
  {
    id: '4',
    title: 'Past Tech Workshop',
    description: 'A workshop on advanced TypeScript that has already concluded.',
    location: 'Online',
    startDate: '2024-01-15T09:00:00',
    endDate: '2024-01-15T17:00:00',
    imageUrl: 'https://picsum.photos/seed/pastworkshop/1200/800',
    organizerId: '5',
    ticketTypes: [],
    category: 'Tech Workshop',
    status: EventStatus.COMPLETED,
    capacity: 100,
    contactEmail: 'contact@techworkshop.com',
    expenses: 1000,
  },
  {
    id: '5',
    title: 'Art Fair 2024 (Cancelled)',
    description: 'This event has been unfortunately cancelled due to unforeseen circumstances.',
    location: 'Exhibition Center',
    startDate: '2024-12-01T10:00:00',
    endDate: '2024-12-03T20:00:00',
    imageUrl: 'https://picsum.photos/seed/artfair/1200/800',
    organizerId: '2',
    ticketTypes: [{ id: 'tt6', eventId: '5', name: 'General Entry', price: 15, quantity: 1000, validity: 'Single Day' }],
    category: 'Art & Culture',
    status: EventStatus.CANCELLED,
    capacity: 1000,
    contactEmail: 'contact@artfair.com',
    expenses: 5000,
  },
];


export let mockTickets: Ticket[] = [
    {
        id: 't1',
        eventId: '1',
        userId: '3',
        ticketTypeId: 'tt1',
        purchaseDate: new Date().toISOString(),
        qrCodeValue: 'TICKET-t1-EVENT-1-USER-3',
        status: TicketStatus.VALID,
    },
    {
        id: 't2',
        eventId: '3',
        userId: '3',
        ticketTypeId: 'tt5',
        purchaseDate: new Date().toISOString(),
        qrCodeValue: 'TICKET-t2-EVENT-3-USER-3',
        status: TicketStatus.VALID,
    }
];

export const updateMockUserRole = (userId: string, newRole: Role) => {
    mockUsers = mockUsers.map(u => u.id === userId ? {...u, role: newRole} : u);
};

export const updateMockUserInfo = (userId: string, updates: Partial<User>) => {
    mockUsers = mockUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
};

export const updateMockUserStatus = (userId: string, newStatus: AccountStatus) => {
    mockUsers = mockUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u);
};