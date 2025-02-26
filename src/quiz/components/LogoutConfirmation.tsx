import { LogOut } from 'lucide-react';

interface LogoutConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmation({ onConfirm, onCancel }: LogoutConfirmationProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Confirm Logout</h3>
        </div>
        <p className="text-gray-600 mb-8">
          Are you sure you want to logout? This will clear all your quiz progress and saved data.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}