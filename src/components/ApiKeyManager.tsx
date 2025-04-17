import React, { useState } from "react";
import { PlusCircle, Trash2, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
  usage: {
    current: number;
    limit: number;
  };
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "sk_prod_2023xyzabc123456789",
      createdAt: "2023-10-15T10:30:00Z",
      lastUsed: "2023-11-20T14:45:00Z",
      status: "active",
      usage: {
        current: 7500,
        limit: 10000,
      },
    },
    {
      id: "2",
      name: "Development API Key",
      key: "sk_dev_2023abcxyz987654321",
      createdAt: "2023-11-01T09:15:00Z",
      lastUsed: "2023-11-19T11:20:00Z",
      status: "active",
      usage: {
        current: 3200,
        limit: 5000,
      },
    },
    {
      id: "3",
      name: "Testing API Key",
      key: "sk_test_2023test123456789",
      createdAt: "2023-09-05T16:45:00Z",
      lastUsed: null,
      status: "revoked",
      usage: {
        current: 0,
        limit: 1000,
      },
    },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("development");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: `${apiKeys.length + 1}`,
      name: newKeyName,
      key: `sk_${newKeyType}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      status: "active",
      usage: {
        current: 0,
        limit:
          newKeyType === "production"
            ? 10000
            : newKeyType === "development"
              ? 5000
              : 1000,
      },
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewKeyType("development");
    setIsCreateDialogOpen(false);
  };

  const revokeKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "revoked" as const } : key,
      ),
    );
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min(Math.round((current / limit) * 100), 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 60) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">API Key Management</h1>
          <p className="text-muted-foreground">
            Create, view, and manage your API keys
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your application. Keep your API keys
                secure - they grant access to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Backend"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Key Type</Label>
                <Select value={newKeyType} onValueChange={setNewKeyType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">
                      Development (5,000 requests/month)
                    </SelectItem>
                    <SelectItem value="production">
                      Production (10,000 requests/month)
                    </SelectItem>
                    <SelectItem value="testing">
                      Testing (1,000 requests/month)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={createNewKey}>Generate Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your API keys and monitor their usage. Revoke keys that are
            no longer needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {showKeys[apiKey.id]
                          ? apiKey.key
                          : `${apiKey.key.substring(0, 8)}...${apiKey.key.substring(apiKey.key.length - 4)}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        disabled={apiKey.status === "revoked"}
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                        disabled={apiKey.status === "revoked"}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        apiKey.status === "active" ? "default" : "secondary"
                      }
                    >
                      {apiKey.status === "active" ? "Active" : "Revoked"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>
                          {apiKey.usage.current.toLocaleString()} /{" "}
                          {apiKey.usage.limit.toLocaleString()}
                        </span>
                        <span>
                          {getUsagePercentage(
                            apiKey.usage.current,
                            apiKey.usage.limit,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={getUsagePercentage(
                          apiKey.usage.current,
                          apiKey.usage.limit,
                        )}
                        className={getUsageColor(
                          getUsagePercentage(
                            apiKey.usage.current,
                            apiKey.usage.limit,
                          ),
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {apiKey.status === "active" ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Revoke
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Trash2 className="h-4 w-4 mr-1" /> Revoked
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {apiKeys.length} API keys
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyManager;
