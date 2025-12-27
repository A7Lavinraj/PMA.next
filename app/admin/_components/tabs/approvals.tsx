export default function AdminPageApprovalsTab() {
  return (
    <div className="w-full flex flex-col gap-40">
      <p>Pending Driver Approvals</p>
      <div className="flex flex-col items-center gap-2">
        <h3>All Caught Up!</h3>
        <p className="text-gray-700 text-sm">
          No pending driver approvals at the moment
        </p>
      </div>
    </div>
  );
}
