export default function UserPageTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-6 py-3 flex justify-between text-sm">
        {["home", "ticket", "history", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toUpperCase())}
            className={`${
              activeTab === tab ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
