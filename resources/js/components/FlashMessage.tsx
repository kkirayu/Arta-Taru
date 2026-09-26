import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { PageProps } from '@/types';

export default function FlashMessage() {
  const { flash } = usePage<PageProps>().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (flash.success) {
      setMessage(flash.success);
      setType('success');
      setVisible(true);
    } else if (flash.error) {
      setMessage(flash.error);
      setType('error');
      setVisible(true);
    }
  }, [flash.success, flash.error]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg shadow-lg ${
          type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <p className={`text-sm flex-1 ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
          {message}
        </p>
        <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
