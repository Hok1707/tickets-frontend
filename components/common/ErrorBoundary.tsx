
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl border border-red-200 dark:border-red-900/50">
                <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 dark:text-red-400" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Oops! Something went wrong.
                </h1>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                    We're sorry for the inconvenience. An unexpected error occurred.
                </p>
                <div className="mt-8">
                    <button
                        onClick={this.handleRefresh}
                        className="rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
