import { useState, useEffect } from "react";

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  className?: string;
  inputClassName?: string;
}

// Component used to enable double click editing of text
export function InlineEdit({
  value,
  onSave,
  className,
  inputClassName,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Update draft when the value prop changes externally
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = async () => {
    if (draft.trim() === "") return;
    await onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className={className}>
      {editing ? (
        <>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={inputClassName}
          />
          <button onClick={handleSave} className="ml-2 text-xs text-blue-500">
            Save
          </button>
          <button onClick={handleCancel} className="ml-1 text-xs text-red-500">
            Cancel
          </button>
        </>
      ) : (
        // Trigger editing on double-click
        <div onDoubleClick={() => setEditing(true)}>{value}</div>
      )}
    </div>
  );
}
