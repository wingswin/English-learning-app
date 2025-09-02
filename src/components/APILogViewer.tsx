import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, Trash2, Eye, EyeOff } from "lucide-react";

interface APILog {
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'info';
  message: string;
  data?: any;
}

interface APILogViewerProps {
  logs: APILog[];
  onClearLogs?: () => void;
  onExportLogs?: () => void;
}

export const APILogViewer = ({ logs, onClearLogs, onExportLogs }: APILogViewerProps) => {
  const [showLogs, setShowLogs] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const toggleLogExpansion = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'request': return '📤';
      case 'response': return '📥';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'request': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'response': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatData = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">API Call Logs</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showLogs ? 'Hide' : 'Show'} Logs
          </Button>
          {onExportLogs && (
            <Button variant="outline" size="sm" onClick={onExportLogs}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
          {onClearLogs && (
            <Button variant="outline" size="sm" onClick={onClearLogs}>
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showLogs && (
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No logs available. Generate some concepts to see API calls.
              </p>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2 pr-4">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-sm ${getLogColor(log.type)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{getLogIcon(log.type)}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs opacity-75">{log.timestamp}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLogExpansion(index)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedLogs.has(index) ? '−' : '+'}
                        </Button>
                      </div>
                      
                      <p className="font-medium mb-2">{log.message}</p>
                      
                      {log.data && expandedLogs.has(index) && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">Data:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(formatData(log.data))}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <pre className="bg-white/50 p-2 rounded text-xs overflow-x-auto">
                            {formatData(log.data)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
