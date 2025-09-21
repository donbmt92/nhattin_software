interface TransferNoteData {
    email?: string;
    phone?: string;
    note?: string;
}

interface TransferNoteParserProps {
    transferNote: string | undefined;
    className?: string;
}

export const TransferNoteParser: React.FC<TransferNoteParserProps> = ({ 
    transferNote, 
    className = "max-w-[150px]" 
}) => {
    if (!transferNote) {
        return <div className="text-sm text-gray-500">N/A</div>;
    }

    const parseTransferNote = (note: string): TransferNoteData => {
        const parts = note.split(' - ');
        return {
            email: parts[0] || undefined,
            phone: parts[1] || undefined,
            note: parts[2] || undefined
        };
    };

    const { email, phone, note } = parseTransferNote(transferNote);

    return (
        <div className={className}>
            {email && (
                <div className="text-sm font-medium truncate" title={email}>
                    {email}
                </div>
            )}
            {phone && (
                <div className="text-xs text-gray-500 truncate" title={phone}>
                    {phone}
                </div>
            )}
            {note && (
                <div className="text-xs text-gray-400 truncate" title={note}>
                    {note}
                </div>
            )}
        </div>
    );
};

export default TransferNoteParser;
