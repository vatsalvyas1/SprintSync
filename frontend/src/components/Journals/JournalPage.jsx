import { useState } from "react";
import AddJournal from "./AddJournal";
import JournalList from "./JournalList";

function JournalPage() {
  const [newEntry, setNewEntry] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
       <div className="flex items-center justify-between md:ml-64 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Journals</h1>
            <p className="text-gray-600">Track development productivity without Jira clutter</p>
          </div>
        </div>
      <AddJournal onAdd={setNewEntry} />
      <JournalList newEntry={newEntry} />
    </div>
  );
}

export default JournalPage;
