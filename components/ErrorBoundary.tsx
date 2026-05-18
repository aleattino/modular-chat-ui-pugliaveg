import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const copy = {
  it: {
    title: 'Qualcosa è andato storto',
    message: 'Si è verificato un errore imprevisto. Ricarica la pagina per riprovare.',
    reload: 'Ricarica',
  },
  en: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Reload the page to try again.',
    reload: 'Reload',
  },
};

function getLang(): 'it' | 'en' {
  try {
    const raw = localStorage.getItem('chatbot-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.language === 'en') return 'en';
    }
  } catch { /* fallback */ }
  return 'it';
}

class ErrorBoundary extends Component<Props, State> {
  declare state: State;
  declare props: Props & { children: ReactNode };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const c = copy[getLang()];
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#f4f3ee] dark:bg-gray-900 p-6">
          <div className="text-center max-w-md">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {c.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {c.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#465E32] hover:bg-[#3a4f28] text-white text-sm font-medium rounded-xl transition-colors duration-100"
            >
              {c.reload}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
