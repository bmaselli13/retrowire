import { X, Zap, MousePointer, Download } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  userName: string | null;
}

export default function WelcomeModal({ onClose, userName }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome to RetroWire{userName ? `, ${userName}` : ''}! 🎉
              </h2>
              <p className="text-blue-100">
                Let's get you started with your first wiring diagram
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-white mb-6">Quick Start Guide</h3>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">Add Components</h4>
                </div>
                <p className="text-gray-400">
                  Browse the component library on the left and drag switches, relays, or power supplies onto the canvas.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-white">Connect Wires</h4>
                </div>
                <p className="text-gray-400">
                  Click on component terminals to create connections. Auto-wire will suggest optimal paths!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-white">Export & Share</h4>
                </div>
                <p className="text-gray-400">
                  When ready, export your diagram as PDF, PNG, or JSON to share with clients or for documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-300 font-medium mb-2">💡 Pro Tips:</p>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Use <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+Z</kbd> to undo</li>
              <li>• Right-click components for quick actions</li>
              <li>• Auto-wire validates your connections automatically</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition transform hover:scale-105"
            >
              Start Building! 🚀
            </button>
          </div>

          {/* Trial Notice */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Your 7-day free trial is now active. No credit card required!
          </p>
        </div>
      </div>
    </div>
  );
}
