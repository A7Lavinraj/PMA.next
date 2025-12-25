export type TUserPageTab = "HOME" | "TICKET" | "HISTORY" | "SETTINGS";

export type TParkingItem = {
  mall: string;
  location: string;
  amount: number;
  date: string;
  plate: string;
  duration: string;
};

export type TTicketStatus = "PARKED" | "RETRIEVING" | "RETRIEVED";

export type TParkingTicket = {
  id: string;
  vehicle: string;
  plate: string;
  customer: string;
  valet: string;
  valetId: string;
  location: string;
  area: string;
  entryTime: string;
  duration: string;
  payment: number;
  status: TTicketStatus;
};

export type TAssignmentStatus = "RETRIEVE" | "PARK";

export type TAssignment = {
  vehicleName: string;
  vehicleNumber: string;
  status: TAssignmentStatus;
  customer?: string;
  parkAt?: string;
  location?: {
    name: string;
    area: string;
  };
  assignedAt?: string;
};

export type TDriverStats = {
  today: number;
  parked: number;
  retrieved: number;
};
