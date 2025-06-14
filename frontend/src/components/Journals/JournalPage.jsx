import { useState } from "react";
import AddJournal from "./AddJournal";
import JournalList from "./JournalList";

function JournalPage() {
  const [newEntry, setNewEntry] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AddJournal onAdd={setNewEntry} />
      <JournalList newEntry={newEntry} />
    </div>
  );
}

export default JournalPage;
