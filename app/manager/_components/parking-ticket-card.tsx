import { TParkingTicket } from "@/types";

export function InfoRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-sm">{value}</p>
      {sub && <span className="text-gray-500 text-xs">{sub}</span>}
    </div>
  );
}

export default function ParkingTicketCard({
  ticket,
}: {
  ticket: TParkingTicket;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4 text-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-base">{ticket.vehicle}</h3>
          <span className="text-gray-500">{ticket.plate}</span>
        </div>

        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
          {ticket.status}
        </span>
      </div>

      <InfoRow label="Customer" value={ticket.customer} />

      <hr className="border-gray-100" />

      <InfoRow
        label="Valet Assigned"
        value={ticket.valet}
        sub={`ID: ${ticket.valetId}`}
      />

      <InfoRow label="Location" value={ticket.location} sub={ticket.area} />

      <InfoRow
        label="Entry Time"
        value={ticket.entryTime}
        sub={`Duration: ${ticket.duration}`}
      />

      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
        <div>
          <p className="text-gray-500 text-xs">Payment</p>
          <h3 className="font-semibold text-base">₹{ticket.payment}</h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200">
          Paid
        </span>
      </div>

      <p className="text-center text-xs text-gray-400">Ticket: {ticket.id}</p>
    </div>
  );
}
