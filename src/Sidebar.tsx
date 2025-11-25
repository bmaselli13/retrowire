import { useState, useMemo } from 'react';
import { ComponentDefinition } from './types';
import { componentLibrary } from './componentLibrary';
import { Cpu, Gamepad2, Zap, Monitor, Search, ChevronDown, ChevronRight } from 'lucide-react';

const categoryIcons = {
  controller: Cpu,
  input: Gamepad2,
  power: Zap,
  display: Monitor,
  output: Monitor,
};

function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const onDragStart = (event: React.DragEvent, component: ComponentDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Filter components based on search term (memoized for performance)
  const filteredComponents = useMemo(() => 
    componentLibrary.filter(comp =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  // Group components by category (memoized for performance)
  const groupedComponents = useMemo(() => 
    filteredComponents.reduce((acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, ComponentDefinition[]>),
    [filteredComponents]
  );

  // Sort categories (memoized for performance)
  const sortedCategories = useMemo(() => {
    const categoryOrder = ['power', 'controller', 'input', 'output', 'display'];
    return categoryOrder.filter(cat => groupedComponents[cat]?.length > 0);
  }, [groupedComponents]);

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Components
        </h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>

        {searchTerm && (
          <p className="text-xs text-gray-400 mt-2">
            Found {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedCategories.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No components found</p>
            <p className="text-xs mt-2">Try a different search term</p>
          </div>
        ) : (
          sortedCategories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const components = groupedComponents[category];

            const isCollapsed = collapsedCategories.has(category);
            
            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center gap-2 mb-3 w-full hover:bg-gray-800 rounded px-2 py-1 -mx-2 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                  <Icon className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                    {category}
                  </h3>
                  <span className="text-xs text-gray-500">({components.length})</span>
                </button>
                
                {!isCollapsed && (
                  <div className="space-y-2">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="bg-gray-800 rounded-lg p-2 cursor-move hover:bg-gray-700 transition-colors border border-gray-600 hover:border-blue-500"
                      draggable
                      onDragStart={(e) => onDragStart(e, component)}
                    >
                      <h4 className="text-sm font-medium text-white truncate">
                        {component.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {component.ports.length} port{component.ports.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 Drag components onto the canvas to start building
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
