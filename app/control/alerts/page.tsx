"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Pause, Plus } from "lucide-react";
import { useTheme } from "next-themes";

interface Alert {
  id: number;
  name: string;
  time: string;
  repeat: "daily" | "specific";
  days?: string[];
  sound?: string;
  active: boolean;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({});
  const [showDialog, setShowDialog] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then(setAlerts);
  }, []);

  const addAlert = async () => {
    if (!newAlert.name || !newAlert.time) return;
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newAlert, active: true }),
    });
    const alert = await res.json();
    setAlerts([...alerts, alert]);
    setNewAlert({});
    setShowDialog(false);
  };

  const toggleAlert = async (id: number, active: boolean) => {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const deleteAlert = async (id: number) => {
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const dynamicBgColor = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Alerts</h2>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4 flex items-center gap-2">
            <Plus size={16} /> Add Alert
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Alert</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Alert Name"
            value={newAlert.name || ""}
            onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
            className={dynamicBgColor}
          />
          <Input
            type="time"
            value={newAlert.time || ""}
            onChange={(e) => setNewAlert({ ...newAlert, time: e.target.value })}
            className={dynamicBgColor}
          />
          <Select onValueChange={(val) => setNewAlert({ ...newAlert, repeat: val as "daily" | "specific" })}>
            <SelectTrigger>
              <SelectValue placeholder="Repeat" />
            </SelectTrigger>
            <SelectContent className={dynamicBgColor}>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="specific">Specific Days</SelectItem>
            </SelectContent>
          </Select>
          {newAlert.repeat === "specific" && (
            <div className="mt-2">
              <p className="text-sm mb-1">Select Days</p>
              <div className="flex gap-2">
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map((day) => (
                  <label key={day} className={`flex items-center gap-2 ${dynamicBgColor}`}>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      value={day}
                      onChange={(e) => {
                        const selectedDays = newAlert.days || [];
                        if (e.target.checked) {
                          setNewAlert({ ...newAlert, days: [...selectedDays, day] });
                        } else {
                          setNewAlert({
                            ...newAlert,
                            days: selectedDays.filter((d) => d !== day),
                          });
                        }
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          )}
          <Button onClick={addAlert} className={dynamicBgColor}>
            Save Alert
          </Button>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex justify-between p-2 border rounded-lg ${dynamicBgColor}`}
          >
            <div>
              <p className="font-medium">{alert.name}</p>
              <p className="text-sm">{alert.time} - {alert.repeat}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleAlert(alert.id, alert.active)}
              >
                <Pause size={16} />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteAlert(alert.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
