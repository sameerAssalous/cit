
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import IssueReportForm from './IssueReportForm';

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

const IssueReportModal: React.FC<IssueReportModalProps> = ({ isOpen, onClose, initialProjectId }) => {
  const handleSubmitSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Construction Issue</DialogTitle>
        </DialogHeader>
        <IssueReportForm 
          initialProjectId={initialProjectId} 
          onSuccess={handleSubmitSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default IssueReportModal;
