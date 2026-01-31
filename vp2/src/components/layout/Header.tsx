import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import Logo from "./Logo";

const Header = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 justify-between">
      {/* Logo */}
      <Logo />
      
      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Look for orders by ID, item or customer name"
            className="pl-10 bg-background border-border h-10"
          />
        </div>
      </div>
      
      {/* Online Toggle */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isOnline ? 'bg-primary' : 'bg-muted'}`}>
          <span className={`text-sm font-medium ${isOnline ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
            Online
          </span>
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
            className="data-[state=checked]:bg-online-toggle"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
