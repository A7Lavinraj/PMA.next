import { TParkingTicket, TTicketStatus } from "@/types";
import { useMemo, useState } from "react";

export function useTicketFilter(tickets: TParkingTicket[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | TTicketStatus>("ALL");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.plate.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(search.toLowerCase()) ||
        ticket.valet.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "ALL" ? true : ticket.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const stats = {
    active: tickets.filter((t) => t.status === "PARKED").length,
    retrieving: tickets.filter((t) => t.status === "RETRIEVING").length,
    today: tickets.length,
    revenue: tickets.reduce((sum, t) => sum + t.payment, 0),
  };

  return {
    stats,
    filter,
    search,
    setFilter,
    setSearch,
    filteredTickets,
  };
}
