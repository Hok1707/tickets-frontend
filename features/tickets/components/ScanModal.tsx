
import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ticketService } from '../../../services/ticketService';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import { User } from '@/types/auth';
import { Events } from '@/types/events';
import { Ticket, TicketType } from '@/types/tickets';
import { Scanner } from '@yudiel/react-qr-scanner';

type VerificationResult = {
  status: 'success' | 'error';
  reason?: string;
  message: string;
  data?: { ticket: Ticket; event: Events; ticketType: TicketType; user: User };
} | null;

const ScanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTicketRedeemed: () => void;
}> = ({ isOpen, onClose, onTicketRedeemed }) => {
  const [error, setError] = useState<string | null>(null);
  const [scanState, setScanState] = useState<'scanning' | 'verifying' | 'result'>('scanning');
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');

  const handleVerification = useCallback(async (qrCodeValue: string) => {
    setScanState('verifying');
    try {
      const result = await ticketService.redeemTicket(qrCodeValue);
      if (!result.success) {
        setVerificationResult({ status: 'error', message: result.message, reason: 'INTERNAL_ERROR' });
        toast.error(result.message);
      } else {
        setVerificationResult({ status: 'success', message: result.message, data: result.data });
        toast.success("Ticket checked in!");
        onTicketRedeemed();
      }
    } catch (e) {
      setVerificationResult({ status: 'error', message: 'An error occurred during verification.' });
      toast.error("Verification failed.");
    } finally {
      setScanState('result');
    }
  }, [onTicketRedeemed]);

  const handleClose = () => {
    onClose();
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleVerification(manualCode.trim());
    }
  };

  const resetForNextScan = () => {
    setVerificationResult(null);
    setManualCode('');
    if (mode === 'scan') {
      setScanState('scanning');
    } else {
      setScanState('scanning');
    }
  };


  const renderResult = () => {
    if (verificationResult?.status === 'success') {
      return (
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">Check-In Successful</h3>
          <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4 space-y-2 text-sm text-gray-900 dark:text-gray-100">
            <p><strong>Event:</strong> {verificationResult.data?.event?.name || 'N/A'}</p>
            <p><strong>Ticket:</strong> {verificationResult.data?.ticketType?.name || 'N/A'}</p>
            <p><strong>Attendee:</strong> {verificationResult.data?.user?.username || 'N/A'}</p>
          </div>
          <button onClick={resetForNextScan} className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Scan Next Ticket</button>
        </div>
      );
    }

    switch (verificationResult?.reason) {
      case 'ALREADY_USED':
        return (
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-yellow-500" />
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">Ticket Already Used</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{verificationResult?.message}</p>
            <button onClick={resetForNextScan} className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Try Again</button>
          </div>
        );
      case 'NOT_FOUND':
      case 'INTERNAL_ERROR':
      default:
        return (
          <div className="text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">Invalid Ticket</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{verificationResult?.message}</p>
            <button onClick={resetForNextScan} className="mt-6 w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Try Again</button>
          </div>
        );
    }
  }


  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mt-4">Error</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 text-primary-600 hover:underline">Retry</button>
        </div>
      );
    }

    switch (scanState) {
      case 'scanning':
        if (mode === 'manual') {
          return (
            <>
              <div className="text-center mb-4">
                <h2 id="scan-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">Manual Entry</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Enter the ticket code below to verify.</p>
              </div>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ticket-code-input" className="sr-only">Ticket Code</label>
                  <input
                    id="ticket-code-input" type="text" value={manualCode} autoFocus
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g., TICKET-t1-EVENT-1-USER-3" required
                    className="w-full text-center px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  Verify Ticket
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => setMode('scan')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
                  Or Scan QR Code
                </button>
              </div>
            </>
          );
        }
        return ( // mode === 'scan'
          <>
            <div className="text-center mb-4">
              <h2 id="scan-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">Scan QR Code</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Point your camera at a ticket's QR code.</p>
            </div>
            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
              {isOpen && (
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      handleVerification(result[0].rawValue);
                    }
                  }}
                  onError={(err) => {
                    console.error(err);
                    // Don't show error immediately to avoid flickering on minor read errors
                    // But if it's a permission error, we might want to show it.
                    // For now, let's log it.
                  }}
                  components={{
                    onOff: false,
                    torch: false,
                    zoom: false,
                    finder: false
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' },
                    video: { width: '100%', height: '100%', objectFit: 'cover' }
                  }}
                />
              )}
              <div className="absolute inset-0 border-4 border-white/50 rounded-lg pointer-events-none"></div>
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => setMode('manual')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
                Or Enter Code Manually
              </button>
            </div>
          </>
        );
      case 'verifying':
        return (
          <div className="text-center py-16">
            <div role="status" className="flex flex-col items-center">
              <QrCodeIcon className="h-12 w-12 text-primary-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Verifying...</h2>
          </div>
        );
      case 'result':
        return renderResult();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-modal-title"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full relative"
      >
        <button
          onClick={handleClose}
          aria-label="Close verification modal"
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ScanModal;
