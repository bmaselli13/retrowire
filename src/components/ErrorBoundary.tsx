import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    // In production, send to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Clear localStorage if corruption might be the issue
    if (window.confirm('Clear saved data and reload? This might fix the error.')) {
      localStorage.removeItem('retrowire-project');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-800 border-2 border-red-500 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">⚠️</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Something Went Wrong</h1>
                <p className="text-gray-400">The application encountered an unexpected error</p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded">
                <p className="text-red-300 font-mono text-sm mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {import.meta.env.DEV && this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="text-red-400 cursor-pointer text-xs">
                      Show Stack Trace
                    </summary>
                    <pre className="text-red-300 text-xs mt-2 overflow-x-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Clear Data & Reload
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-400">
                <strong className="text-white">What to try:</strong>
              </p>
              <ul className="text-sm text-gray-400 mt-2 space-y-1 list-disc list-inside">
                <li>Reload the page (temporary issues)</li>
                <li>Clear browser cache</li>
                <li>Clear saved data (may lose current work)</li>
                <li>Try a different browser</li>
                <li>Report the issue with the error message above</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
